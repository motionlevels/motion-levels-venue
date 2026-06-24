#!/usr/bin/env python3
import json
import os
import shutil
import signal
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib import error, parse, request


ROOT = Path(os.environ.get("MOTION_LEVELS_SECURITY_RECORDINGS_ROOT", "/var/lib/motion-levels/security-recordings"))
ENABLED = os.environ.get("MOTION_LEVELS_SECURITY_RECORDER_ENABLED", "1").strip().lower() not in {"0", "false", "no", "off"}
CAMERA_ID = os.environ.get("MOTION_LEVELS_SECURITY_CAMERA_ID", "130").strip() or "130"
CAMERA_LABEL = os.environ.get("MOTION_LEVELS_SECURITY_CAMERA_LABEL", "Cámara frontal").strip() or "Cámara frontal"
CAMERA_ROLE = os.environ.get("MOTION_LEVELS_SECURITY_CAMERA_ROLE", "front").strip() or "front"
CAMERA_HOST = (
    os.environ.get("MOTION_LEVELS_SECURITY_CAMERA_HOST")
    or os.environ.get(f"MOTION_LEVELS_CAMERA_{CAMERA_ID}_HOST")
    or "192.168.1.130"
).strip()
CAMERA_USER = os.environ.get("MOTION_LEVELS_SECURITY_CAMERA_USER") or os.environ.get("MOTION_LEVELS_CAMERA_USER", "motionlevels")
PASSWORD_ENV = os.environ.get("MOTION_LEVELS_SECURITY_CAMERA_PASSWORD_ENV") or os.environ.get("MOTION_LEVELS_CAMERA_PASSWORD_ENV", "ML_TAPO_PASSWORD")
CAMERA_PASSWORD = os.environ.get("MOTION_LEVELS_SECURITY_CAMERA_PASSWORD") or os.environ.get("MOTION_LEVELS_CAMERA_PASSWORD") or os.environ.get(PASSWORD_ENV, "")
RTSP_PATH = os.environ.get("MOTION_LEVELS_SECURITY_CAMERA_RTSP_PATH", "/stream2").strip() or "/stream2"
AUDIO_ENABLED = os.environ.get("MOTION_LEVELS_SECURITY_RECORDER_AUDIO", "0").strip().lower() in {"1", "true", "yes", "on"}
SEGMENT_SECONDS = max(30, int(os.environ.get("MOTION_LEVELS_SECURITY_RECORDER_SEGMENT_SECONDS", "300")))
RETENTION_DAYS = max(1, int(os.environ.get("MOTION_LEVELS_SECURITY_RECORDER_RETENTION_DAYS", "14")))
SETTLE_SECONDS = max(5, int(os.environ.get("MOTION_LEVELS_SECURITY_RECORDER_UPLOAD_SETTLE_SECONDS", "20")))
SCAN_SECONDS = max(5, int(os.environ.get("MOTION_LEVELS_SECURITY_RECORDER_SCAN_SECONDS", "15")))
DELETE_LOCAL_AFTER_UPLOAD = os.environ.get("MOTION_LEVELS_SECURITY_RECORDER_DELETE_LOCAL_AFTER_UPLOAD", "1").strip().lower() in {"1", "true", "yes", "on"}
PLATFORM_URL = (
    os.environ.get("MOTION_LEVELS_SECURITY_RECORDER_PLATFORM_URL")
    or os.environ.get("MOTION_LEVELS_PLATFORM_URL")
    or "https://platform.motionlevels.obis.dev"
).strip().rstrip("/")
PLATFORM_TOKEN = (
    os.environ.get("MOTION_LEVELS_SECURITY_RECORDER_PLATFORM_TOKEN")
    or os.environ.get("MOTION_LEVELS_PLATFORM_TOKEN")
    or ""
).strip()
PLATFORM_TIMEOUT_SECONDS = float(os.environ.get("MOTION_LEVELS_SECURITY_RECORDER_PLATFORM_TIMEOUT_SECONDS", "60"))
CONTROLLER_HOSTNAME = os.environ.get("MOTION_LEVELS_CONTROLLER_HOSTNAME") or os.environ.get("MOTION_LEVELS_HOSTNAME") or os.uname().nodename

stop_requested = False
ffmpeg_process: subprocess.Popen[str] | None = None


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso(value: datetime) -> str:
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def log(message: str) -> None:
    print(f"{iso(utc_now())} {message}", flush=True)


def rtsp_url() -> str:
    user = parse.quote(CAMERA_USER, safe="")
    password = parse.quote(CAMERA_PASSWORD, safe="")
    path = "/" + RTSP_PATH.strip("/")
    return f"rtsp://{user}:{password}@{CAMERA_HOST}:554{path}"


def ffmpeg_command() -> list[str]:
    local_dir = ROOT / CAMERA_ID
    local_dir.mkdir(parents=True, exist_ok=True)
    output_pattern = local_dir / f"%Y%m%dT%H%M%S-{CAMERA_ID}.mp4"
    command = [
        "ffmpeg",
        "-hide_banner",
        "-loglevel",
        os.environ.get("MOTION_LEVELS_SECURITY_RECORDER_FFMPEG_LOG_LEVEL", "error"),
        "-nostdin",
        "-rtsp_transport",
        "tcp",
        "-i",
        rtsp_url(),
        "-map",
        "0:v:0",
        "-c:v",
        "copy",
    ]
    if AUDIO_ENABLED:
        command.extend(["-map", "0:a:0?", "-c:a", os.environ.get("MOTION_LEVELS_SECURITY_RECORDER_AUDIO_CODEC", "aac"), "-b:a", "96k"])
    else:
        command.append("-an")
    command.extend(
        [
            "-f",
            "segment",
            "-segment_time",
            str(SEGMENT_SECONDS),
            "-reset_timestamps",
            "1",
            "-strftime",
            "1",
            str(output_pattern),
        ]
    )
    return command


def post_json(path: str, payload: dict[str, Any]) -> dict[str, Any]:
    body = json.dumps(payload).encode("utf-8")
    req = request.Request(
        f"{PLATFORM_URL}{path}",
        data=body,
        headers={"content-type": "application/json"},
        method="POST",
    )
    if PLATFORM_TOKEN:
        req.add_header("authorization", f"Bearer {PLATFORM_TOKEN}")
    with request.urlopen(req, timeout=PLATFORM_TIMEOUT_SECONDS) as response:
        response_body = response.read(1024 * 1024).decode("utf-8", errors="replace")
        parsed = json.loads(response_body or "{}")
        if not isinstance(parsed, dict):
            raise RuntimeError("platform returned a non-object JSON response")
        return parsed


def put_file(upload_url: str, path: Path, content_type: str) -> None:
    data = path.read_bytes()
    req = request.Request(
        upload_url,
        data=data,
        headers={"content-type": content_type, "content-length": str(len(data))},
        method="PUT",
    )
    with request.urlopen(req, timeout=PLATFORM_TIMEOUT_SECONDS) as response:
        if response.status < 200 or response.status >= 300:
            raise RuntimeError(f"upload failed with HTTP {response.status}")


def sidecar_path(path: Path) -> Path:
    return path.with_suffix(path.suffix + ".uploaded.json")


def upload_segment(path: Path) -> bool:
    sidecar = sidecar_path(path)
    if sidecar.exists():
        return True
    stat = path.stat()
    ended_at = datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc)
    started_at = ended_at - timedelta(seconds=SEGMENT_SECONDS)
    metadata = {
        "localPath": str(path),
        "cameraHost": CAMERA_HOST,
        "segmentSeconds": SEGMENT_SECONDS,
        "source": "motion-levels-security-recorder",
    }
    upload: dict[str, Any] | None = None
    try:
        upload = post_json(
            "/api/security-recordings/init",
            {
                "cameraId": CAMERA_ID,
                "cameraLabel": CAMERA_LABEL,
                "cameraRole": CAMERA_ROLE,
                "controllerHostname": CONTROLLER_HOSTNAME,
                "contentType": "video/mp4",
                "byteSize": stat.st_size,
                "hasAudio": AUDIO_ENABLED,
                "startedAt": iso(started_at),
                "endedAt": iso(ended_at),
                "durationSeconds": SEGMENT_SECONDS,
                "retentionDays": RETENTION_DAYS,
                "fileName": path.name,
                "metadata": metadata,
            },
        )
        upload_url = str(upload.get("uploadUrl") or "")
        segment_id = str(upload.get("segmentId") or "")
        if not upload_url or not segment_id:
            raise RuntimeError("platform init did not return uploadUrl and segmentId")
        put_file(upload_url, path, "video/mp4")
        complete = post_json(
            "/api/security-recordings/complete",
            {
                "segmentId": segment_id,
                "byteSize": stat.st_size,
                "startedAt": iso(started_at),
                "endedAt": iso(ended_at),
                "durationSeconds": SEGMENT_SECONDS,
                "metadata": {
                    **metadata,
                    "bucket": upload.get("bucket"),
                    "objectKey": upload.get("objectKey"),
                    "uploadedAt": iso(utc_now()),
                },
            },
        )
        sidecar.write_text(json.dumps({"upload": upload, "complete": complete}, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        log(f"uploaded security segment camera={CAMERA_ID} path={path} bytes={stat.st_size}")
        if DELETE_LOCAL_AFTER_UPLOAD:
            path.unlink(missing_ok=True)
        return True
    except error.HTTPError as exc:
        detail = exc.read(4096).decode("utf-8", errors="replace")
        log(f"security segment upload failed status={exc.code} path={path} detail={detail}")
        if upload and upload.get("segmentId"):
            mark_failed(str(upload["segmentId"]), path, stat.st_size, str(exc))
    except Exception as exc:
        log(f"security segment upload failed path={path} error={exc}")
        if upload and upload.get("segmentId"):
            mark_failed(str(upload["segmentId"]), path, stat.st_size, str(exc))
    return False


def mark_failed(segment_id: str, path: Path, byte_size: int, message: str) -> None:
    try:
        post_json(
            "/api/security-recordings/complete",
            {
                "segmentId": segment_id,
                "byteSize": byte_size,
                "error": message[:1000],
                "metadata": {"localPath": str(path), "failedAt": iso(utc_now())},
            },
        )
    except Exception as exc:
        log(f"failed to mark security segment failed segment={segment_id} error={exc}")


def segment_candidates(include_newest: bool = False) -> list[Path]:
    files = sorted(ROOT.glob(f"{CAMERA_ID}/**/*.mp4"), key=lambda path: path.stat().st_mtime)
    if not files:
        return []
    newest = files[-1]
    now = time.time()
    candidates: list[Path] = []
    for path in files:
        if sidecar_path(path).exists():
            continue
        if path == newest and not include_newest:
            continue
        if now - path.stat().st_mtime < SETTLE_SECONDS:
            continue
        candidates.append(path)
    return candidates


def upload_pending(include_newest: bool = False) -> None:
    if not PLATFORM_TOKEN:
        log("platform token is not configured; security segments will remain local")
        return
    cleanup_confirmed_local_segments()
    for path in segment_candidates(include_newest=include_newest):
        upload_segment(path)
    cleanup_confirmed_local_segments()


def cleanup_confirmed_local_segments() -> None:
    if not DELETE_LOCAL_AFTER_UPLOAD:
        return
    for sidecar in ROOT.glob(f"{CAMERA_ID}/**/*.mp4.uploaded.json"):
        media_path = Path(str(sidecar).removesuffix(".uploaded.json"))
        try:
            if media_path.exists():
                media_path.unlink()
                log(f"deleted confirmed local security segment path={media_path}")
        except Exception as exc:
            log(f"failed to delete confirmed local security segment path={media_path} error={exc}")


def handle_signal(signum: int, _frame: Any) -> None:
    global stop_requested
    stop_requested = True
    log(f"received signal {signum}; stopping")
    if ffmpeg_process and ffmpeg_process.poll() is None:
        ffmpeg_process.terminate()


def main() -> int:
    global ffmpeg_process
    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)
    if not ENABLED:
        log("security recorder is disabled")
        return 0
    if not CAMERA_PASSWORD:
        log(f"camera password is not configured; set MOTION_LEVELS_SECURITY_CAMERA_PASSWORD or {PASSWORD_ENV}")
        return 2
    if not PLATFORM_TOKEN:
        log("MOTION_LEVELS_PLATFORM_TOKEN is not configured; recorder will keep local files but cannot upload")
    if not shutil.which("ffmpeg"):
        log("ffmpeg is not installed")
        return 2
    ROOT.mkdir(parents=True, exist_ok=True)
    log(f"starting security recorder camera={CAMERA_ID} host={CAMERA_HOST} role={CAMERA_ROLE} audio={'on' if AUDIO_ENABLED else 'off'} root={ROOT}")
    log(f"segments={SEGMENT_SECONDS}s retention={RETENTION_DAYS}d platform={PLATFORM_URL}")

    while not stop_requested:
        command = ffmpeg_command()
        redacted = ["<rtsp-url>" if part.startswith("rtsp://") else part for part in command]
        log("launching ffmpeg " + " ".join(redacted))
        ffmpeg_process = subprocess.Popen(command, text=True)
        while ffmpeg_process.poll() is None and not stop_requested:
            upload_pending(include_newest=False)
            time.sleep(SCAN_SECONDS)
        upload_pending(include_newest=True)
        if stop_requested:
            break
        log(f"ffmpeg exited code={ffmpeg_process.returncode}; restarting in 10s")
        time.sleep(10)
    return 0


if __name__ == "__main__":
    sys.exit(main())
