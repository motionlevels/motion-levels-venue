#!/usr/bin/env python3
import json
import os
import re
import subprocess
import threading
import time
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib import error, request


ROOT = Path(os.environ.get("MOTION_LEVELS_CAMERA_RECORDINGS_ROOT", "/var/lib/motion-levels/camera-recordings"))
BACKEND = os.environ.get("MOTION_LEVELS_CAMERA_RECORDER_BACKEND", "fake").strip() or "fake"
MEDIA_EXTENSION = os.environ.get(
    "MOTION_LEVELS_CAMERA_MEDIA_EXTENSION",
    ".mock-video.txt" if BACKEND == "fake" else ".insv",
).strip()
if MEDIA_EXTENSION and not MEDIA_EXTENSION.startswith("."):
    MEDIA_EXTENSION = f".{MEDIA_EXTENSION}"
PHOTO_EXTENSION = os.environ.get(
    "MOTION_LEVELS_CAMERA_PHOTO_EXTENSION",
    ".mock-photo.txt" if BACKEND == "fake" else ".insp",
).strip()
if PHOTO_EXTENSION and not PHOTO_EXTENSION.startswith("."):
    PHOTO_EXTENSION = f".{PHOTO_EXTENSION}"
COMMAND_TIMEOUT_SECONDS = float(os.environ.get("MOTION_LEVELS_CAMERA_COMMAND_TIMEOUT_SECONDS", "120"))
START_COMMAND = os.environ.get("MOTION_LEVELS_CAMERA_START_COMMAND", "").strip()
STOP_COMMAND = os.environ.get("MOTION_LEVELS_CAMERA_STOP_COMMAND", "").strip()
PHOTO_COMMAND = os.environ.get("MOTION_LEVELS_CAMERA_PHOTO_COMMAND", "").strip()
USB_VENDOR = os.environ.get("MOTION_LEVELS_CAMERA_USB_VENDOR", "2e1a").strip().lower()
SDK_PATH = Path(os.environ.get("MOTION_LEVELS_CAMERA_SDK_PATH", "/opt/insta360/Desktop-CameraSDK-Cpp"))
RCLONE_DEST = os.environ.get("MOTION_LEVELS_CAMERA_RCLONE_DEST", "").strip().rstrip("/")
RCLONE_PATH_PREFIX = os.environ.get("MOTION_LEVELS_CAMERA_RCLONE_PATH_PREFIX", "Motion Levels").strip().strip("/")
RCLONE_TIMEOUT_SECONDS = float(os.environ.get("MOTION_LEVELS_CAMERA_RCLONE_TIMEOUT_SECONDS", "900"))
PLATFORM_URL = (
    os.environ.get("MOTION_LEVELS_CAMERA_RECORDER_PLATFORM_URL")
    or os.environ.get("MOTION_LEVELS_PLATFORM_URL")
    or ""
).strip().rstrip("/")
PLATFORM_TOKEN = (
    os.environ.get("MOTION_LEVELS_CAMERA_RECORDER_PLATFORM_TOKEN")
    or os.environ.get("MOTION_LEVELS_PLATFORM_TOKEN")
    or ""
).strip()
PLATFORM_TIMEOUT_SECONDS = float(os.environ.get("MOTION_LEVELS_CAMERA_RECORDER_PLATFORM_TIMEOUT_SECONDS", "20"))
PUBLIC_LINKS = os.environ.get("MOTION_LEVELS_CAMERA_PUBLIC_LINKS", "1").strip().lower() not in {"0", "false", "no", "off"}


active_lock = threading.Lock()
active_recordings: dict[str, dict[str, Any]] = {}
upload_events: list[dict[str, Any]] = []


def slug(value: Any, fallback: str = "unknown") -> str:
    text = str(value or "").strip().lower()
    text = re.sub(r"[^a-z0-9._-]+", "-", text)
    text = text.strip("-._")
    return text or fallback


def backend_ready(action: str = "video") -> tuple[bool, str | None]:
    if BACKEND == "fake":
        return True, None
    if BACKEND == "command":
        if action == "photo":
            if not PHOTO_COMMAND:
                return False, "MOTION_LEVELS_CAMERA_PHOTO_COMMAND is not configured"
            return True, None
        if not START_COMMAND:
            return False, "MOTION_LEVELS_CAMERA_START_COMMAND is not configured"
        if not STOP_COMMAND:
            return False, "MOTION_LEVELS_CAMERA_STOP_COMMAND is not configured"
        return True, None
    return False, f"unsupported camera recorder backend: {BACKEND}"


def read_sysfs(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8").strip()
    except OSError:
        return None


def usb_devices() -> list[dict[str, Any]]:
    root = Path("/sys/bus/usb/devices")
    devices: list[dict[str, Any]] = []
    if not root.exists():
        return devices
    for path in sorted(root.iterdir(), key=lambda item: item.name):
        vendor = read_sysfs(path / "idVendor")
        product_id = read_sysfs(path / "idProduct")
        if not vendor or not product_id:
            continue
        devices.append(
            {
                "path": path.name,
                "vendor": vendor.lower(),
                "productId": product_id.lower(),
                "manufacturer": read_sysfs(path / "manufacturer"),
                "product": read_sysfs(path / "product"),
                "serial": read_sysfs(path / "serial"),
                "busNumber": read_sysfs(path / "busnum"),
                "deviceNumber": read_sysfs(path / "devnum"),
                "speed": read_sysfs(path / "speed"),
            }
        )
    return devices


def camera_probe() -> dict[str, Any]:
    devices = usb_devices()
    camera_devices = [device for device in devices if str(device.get("vendor") or "").lower() == USB_VENDOR]
    return {
        "expectedUsbVendor": USB_VENDOR,
        "detected": bool(camera_devices),
        "devices": camera_devices,
        "usbDeviceCount": len(devices),
        "sdkPath": str(SDK_PATH),
        "sdkPathExists": SDK_PATH.exists(),
    }


def unix_nanos_to_datetime(value: Any) -> datetime:
    try:
        nanos = int(value)
    except (TypeError, ValueError):
        nanos = 0
    if nanos <= 0:
        return datetime.now(timezone.utc)
    return datetime.fromtimestamp(nanos / 1_000_000_000, tz=timezone.utc)


def attempt_paths(start: dict[str, Any]) -> dict[str, Path]:
    started_at = unix_nanos_to_datetime(start.get("startedUnixNanos"))
    day_dir = ROOT / started_at.strftime("%Y") / started_at.strftime("%m") / started_at.strftime("%d")
    game_dir = day_dir / slug(start.get("game"), "game") / slug(start.get("level"), "level")
    timestamp = started_at.strftime("%Y%m%dT%H%M%SZ")
    stem = "-".join(
        [
            timestamp,
            slug(start.get("game"), "game"),
            slug(start.get("level"), "level"),
            slug(start.get("attemptId") or start.get("captureId"), "attempt")[:48],
        ]
    )
    return {
        "dir": game_dir,
        "media": game_dir / f"{stem}{MEDIA_EXTENSION}",
        "metadata": game_dir / f"{stem}.json",
    }


def capture_paths(payload: dict[str, Any], kind: str, extension: str) -> dict[str, Path]:
    now = datetime.now(timezone.utc)
    day_dir = ROOT / now.strftime("%Y") / now.strftime("%m") / now.strftime("%d")
    label = slug(payload.get("label") or payload.get("name") or kind, kind)
    capture_id = slug(payload.get("captureId") or payload.get("attemptId") or f"{kind}-{now.timestamp()}", kind)
    timestamp = now.strftime("%Y%m%dT%H%M%SZ")
    stem = "-".join([timestamp, kind, label, capture_id[:48]])
    return {
        "dir": day_dir / kind / label,
        "media": day_dir / kind / label / f"{stem}{extension}",
        "metadata": day_dir / kind / label / f"{stem}.json",
    }


def relative_upload_path(path: Path) -> str:
    try:
        relative = path.relative_to(ROOT)
    except ValueError:
        relative = Path(path.name)
    if RCLONE_PATH_PREFIX:
        return f"{RCLONE_PATH_PREFIX}/{relative.as_posix()}"
    return relative.as_posix()


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    temp.replace(path)


def content_type_for(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix == ".mp4":
        return "video/mp4"
    if suffix in {".jpg", ".jpeg"}:
        return "image/jpeg"
    if suffix == ".png":
        return "image/png"
    if suffix in {".insv", ".insp"}:
        return "application/octet-stream"
    if suffix in {".txt", ".log"}:
        return "text/plain; charset=utf-8"
    if suffix == ".json":
        return "application/json"
    return "application/octet-stream"


def record_event(event: dict[str, Any]) -> None:
    with active_lock:
        upload_events.append(event)
        del upload_events[:-50]


def run_rclone(args: list[str], timeout: float) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["rclone", *args],
        check=False,
        capture_output=True,
        text=True,
        timeout=timeout,
    )


def command_env(action: str, payload: dict[str, Any], recording: dict[str, Any], media_path: Path, metadata_path: Path) -> dict[str, str]:
    env = os.environ.copy()
    env.update(
        {
            "MOTION_LEVELS_CAMERA_ACTION": action,
            "MOTION_LEVELS_CAMERA_BACKEND": BACKEND,
            "MOTION_LEVELS_CAMERA_PAYLOAD_JSON": json.dumps(payload, sort_keys=True),
            "MOTION_LEVELS_CAMERA_RECORDING_JSON": json.dumps(recording, sort_keys=True),
            "MOTION_LEVELS_CAMERA_ATTEMPT_ID": str(payload.get("attemptId") or recording.get("attemptId") or ""),
            "MOTION_LEVELS_CAMERA_MEDIA_PATH": str(media_path),
            "MOTION_LEVELS_CAMERA_METADATA_PATH": str(metadata_path),
        }
    )
    return env


def run_camera_command(action: str, command: str, payload: dict[str, Any], recording: dict[str, Any], media_path: Path, metadata_path: Path) -> dict[str, Any]:
    started = time.time()
    event = {
        "label": "camera-command",
        "action": action,
        "attemptId": payload.get("attemptId") or recording.get("attemptId"),
        "captureId": payload.get("captureId") or recording.get("captureId"),
        "startedAt": datetime.now(timezone.utc).isoformat(),
    }
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=False,
            capture_output=True,
            text=True,
            timeout=COMMAND_TIMEOUT_SECONDS,
            env=command_env(action, payload, recording, media_path, metadata_path),
        )
        event["durationSeconds"] = round(time.time() - started, 3)
        event["returnCode"] = result.returncode
        event["stdout"] = result.stdout[-4000:]
        event["stderr"] = result.stderr[-4000:]
        event["ok"] = result.returncode == 0
    except Exception as exc:
        event["durationSeconds"] = round(time.time() - started, 3)
        event["ok"] = False
        event["error"] = str(exc)
    record_event(event)
    return event


def run_upload(local_path: Path, label: str) -> dict[str, Any]:
    if not RCLONE_DEST:
        return {"ok": False, "path": str(local_path), "label": label, "error": "rclone destination is not configured"}
    remote = f"{RCLONE_DEST}/{relative_upload_path(local_path)}"
    started = time.time()
    event = {
        "path": str(local_path),
        "remote": remote,
        "label": label,
        "startedAt": datetime.now(timezone.utc).isoformat(),
    }
    try:
        result = run_rclone(["copyto", str(local_path), remote], RCLONE_TIMEOUT_SECONDS)
        event["durationSeconds"] = round(time.time() - started, 3)
        event["returnCode"] = result.returncode
        event["stdout"] = result.stdout[-2000:]
        event["stderr"] = result.stderr[-2000:]
        event["ok"] = result.returncode == 0
    except Exception as exc:
        event["durationSeconds"] = round(time.time() - started, 3)
        event["ok"] = False
        event["error"] = str(exc)
    record_event(event)
    return event


def run_public_link(remote: str) -> tuple[str | None, dict[str, Any]]:
    started = time.time()
    event = {
        "remote": remote,
        "label": "public-link",
        "startedAt": datetime.now(timezone.utc).isoformat(),
    }
    if not PUBLIC_LINKS:
        event["ok"] = False
        event["error"] = "public links are disabled"
        record_event(event)
        return None, event
    try:
        result = run_rclone(["link", remote], RCLONE_TIMEOUT_SECONDS)
        link = result.stdout.strip().splitlines()[-1].strip() if result.stdout.strip() else ""
        event["durationSeconds"] = round(time.time() - started, 3)
        event["returnCode"] = result.returncode
        event["stdout"] = result.stdout[-2000:]
        event["stderr"] = result.stderr[-2000:]
        event["shareUrl"] = link
        event["ok"] = result.returncode == 0 and bool(link)
        return (link if event["ok"] else None), event
    except Exception as exc:
        event["durationSeconds"] = round(time.time() - started, 3)
        event["ok"] = False
        event["error"] = str(exc)
        return None, event
    finally:
        record_event(event)


def post_platform_video(recording: dict[str, Any], metadata: dict[str, Any], media_event: dict[str, Any], share_url: str) -> dict[str, Any]:
    started = time.time()
    start_payload = recording.get("start") if isinstance(recording.get("start"), dict) else {}
    finish_payload = metadata.get("finish") if isinstance(metadata.get("finish"), dict) else {}
    attempt_id = start_payload.get("attemptId") or finish_payload.get("attemptId")
    media_path_text = str(metadata.get("mediaPath") or "")
    media_path = Path(media_path_text) if media_path_text else None
    ingest_event = {
        "label": "platform-ingest",
        "attemptId": attempt_id,
        "startedAt": datetime.now(timezone.utc).isoformat(),
    }
    if not attempt_id:
        ingest_event["ok"] = False
        ingest_event["skipped"] = True
        ingest_event["error"] = "attemptId is not present"
        record_event(ingest_event)
        return ingest_event
    if not PLATFORM_URL:
        ingest_event["ok"] = False
        ingest_event["error"] = "platform URL is not configured"
        record_event(ingest_event)
        return ingest_event
    payload = {
        "attemptId": attempt_id,
        "sessionId": start_payload.get("sessionId"),
        "venueSessionId": start_payload.get("venueSessionId"),
        "controllerLabel": start_payload.get("controllerLabel"),
        "controllerHostname": start_payload.get("controllerHostname"),
        "game": start_payload.get("game"),
        "level": start_payload.get("level"),
        "levelNumber": start_payload.get("levelNumber"),
        "difficulty": start_payload.get("difficulty"),
        "teamName": start_payload.get("teamName"),
        "playerCount": start_payload.get("playerCount"),
        "result": finish_payload.get("result"),
        "success": finish_payload.get("success"),
        "elapsedMillis": finish_payload.get("elapsedMillis"),
        "scoreEnd": finish_payload.get("scoreEnd"),
        "livesEnd": finish_payload.get("livesEnd"),
        "startedAt": metadata.get("startedAt"),
        "stoppedAt": metadata.get("stoppedAt"),
        "startedUnixNanos": start_payload.get("startedUnixNanos"),
        "gameplayStartedUnixNanos": start_payload.get("gameplayStartedUnixNanos"),
        "endedUnixNanos": finish_payload.get("endedUnixNanos"),
        "backend": metadata.get("backend"),
        "localPath": str(media_path) if media_path else None,
        "remotePath": media_event.get("remote"),
        "shareUrl": share_url,
        "fileName": media_path.name if media_path else None,
        "contentType": content_type_for(media_path) if media_path else None,
        "byteSize": media_path.stat().st_size if media_path and media_path.exists() else None,
        "metadata": metadata,
    }
    try:
        body = json.dumps(payload).encode("utf-8")
        req = request.Request(
            f"{PLATFORM_URL}/api/ingest/session-video",
            data=body,
            headers={"content-type": "application/json"},
            method="POST",
        )
        if PLATFORM_TOKEN:
            req.add_header("authorization", f"Bearer {PLATFORM_TOKEN}")
        with request.urlopen(req, timeout=PLATFORM_TIMEOUT_SECONDS) as response:
            response_body = response.read(4096).decode("utf-8", errors="replace")
            ingest_event["status"] = response.status
            ingest_event["response"] = response_body[-2000:]
            ingest_event["ok"] = 200 <= response.status < 300
    except error.HTTPError as exc:
        ingest_event["status"] = exc.code
        ingest_event["response"] = exc.read(4096).decode("utf-8", errors="replace")[-2000:]
        ingest_event["ok"] = False
    except Exception as exc:
        ingest_event["ok"] = False
        ingest_event["error"] = str(exc)
    ingest_event["durationSeconds"] = round(time.time() - started, 3)
    record_event(ingest_event)
    return ingest_event


def upload_media(media_path: Path, metadata_path: Path, platform_recording: dict[str, Any] | None = None) -> None:
    media_event = run_upload(media_path, media_path.name)
    metadata: dict[str, Any] = {}
    try:
        metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    except Exception as exc:
        metadata = {"metadataReadError": str(exc)}
    if media_event.get("ok") and media_event.get("remote"):
        share_url, link_event = run_public_link(str(media_event["remote"]))
        if share_url:
            metadata["shareUrl"] = share_url
            metadata["remotePath"] = media_event.get("remote")
            metadata["publicLink"] = link_event
            if platform_recording is not None:
                ingest_event = post_platform_video(platform_recording, metadata, media_event, share_url)
                metadata["platformIngest"] = ingest_event
    write_json(metadata_path, metadata)
    run_upload(metadata_path, metadata_path.name)


def upload_recording(recording: dict[str, Any], media_path: Path, metadata_path: Path) -> None:
    platform_recording = recording if recording.get("platformIngest") else None
    upload_media(media_path, metadata_path, platform_recording)


def quick_video_duration(payload: dict[str, Any]) -> int:
    try:
        value = float(payload.get("durationSeconds") or payload.get("duration") or 10)
    except (TypeError, ValueError):
        value = 10
    return max(1, min(30, round(value)))


class Handler(BaseHTTPRequestHandler):
    server_version = "MotionLevelsCameraRecorder/0.1"

    def do_GET(self) -> None:
        if self.path.rstrip("/") != "/status":
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        with active_lock:
            active = list(active_recordings.values())
            uploads = list(upload_events)
        ready, ready_error = backend_ready()
        photo_ready, photo_error = backend_ready("photo")
        self.write_json(
            HTTPStatus.OK,
            {
                "ok": True,
                "backend": BACKEND,
                "backendReady": ready,
                "backendError": ready_error,
                "photoBackendReady": photo_ready,
                "photoBackendError": photo_error,
                "commandBackendConfigured": bool(START_COMMAND and STOP_COMMAND),
                "photoCommandConfigured": bool(PHOTO_COMMAND),
                "camera": camera_probe(),
                "rcloneConfigured": bool(RCLONE_DEST),
                "publicLinks": PUBLIC_LINKS,
                "platformConfigured": bool(PLATFORM_URL),
                "root": str(ROOT),
                "active": active,
                "recentUploads": uploads,
            },
        )

    def do_POST(self) -> None:
        if self.path.rstrip("/") == "/recordings/start":
            self.handle_start()
            return
        if self.path.rstrip("/") == "/recordings/stop":
            self.handle_stop()
            return
        if self.path.rstrip("/") == "/recordings/quick":
            self.handle_quick_video()
            return
        if self.path.rstrip("/") == "/photos/take":
            self.handle_take_photo()
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def handle_start(self) -> None:
        payload = self.read_json()
        generated_capture_id = f"video-{int(time.time() * 1000)}"
        attempt_id = str(payload.get("attemptId") or payload.get("captureId") or generated_capture_id).strip()
        if not attempt_id:
            self.write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "attemptId or captureId is required"})
            return
        payload.setdefault("captureId", attempt_id)
        ready, ready_error = backend_ready()
        if not ready:
            self.write_json(HTTPStatus.SERVICE_UNAVAILABLE, {"ok": False, "backend": BACKEND, "error": ready_error})
            return
        paths = attempt_paths(payload)
        paths["dir"].mkdir(parents=True, exist_ok=True)
        metadata = {
            "backend": BACKEND,
            "state": "recording",
            "startedAt": datetime.now(timezone.utc).isoformat(),
            "start": payload,
            "mediaPath": str(paths["media"]),
        }
        recording = {
            "attemptId": attempt_id,
            "captureId": payload.get("captureId"),
            "startedAt": metadata["startedAt"],
            "mediaPath": str(paths["media"]),
            "metadataPath": str(paths["metadata"]),
            "start": payload,
            "platformIngest": bool(payload.get("attemptId") and (payload.get("sessionId") or payload.get("venueSessionId"))),
        }
        if BACKEND == "command":
            event = run_camera_command("video-start", START_COMMAND, payload, recording, paths["media"], paths["metadata"])
            metadata["startCommand"] = event
            if not event.get("ok"):
                metadata["state"] = "start-failed"
                write_json(paths["metadata"], metadata)
                self.write_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"ok": False, "backend": BACKEND, "error": "camera start command failed", "event": event})
                return
        write_json(paths["metadata"], metadata)
        with active_lock:
            active_recordings[attempt_id] = recording
        self.write_json(HTTPStatus.OK, {"ok": True, "backend": BACKEND, "recordingId": attempt_id, "mediaPath": str(paths["media"])})

    def handle_stop(self) -> None:
        payload = self.read_json()
        attempt_id = str(payload.get("attemptId") or payload.get("captureId") or "").strip()
        with active_lock:
            recording = active_recordings.pop(attempt_id, None)
        if not recording:
            self.write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "recording not found", "recordingId": attempt_id})
            return
        media_path = Path(recording["mediaPath"])
        metadata_path = Path(recording["metadataPath"])
        media_path.parent.mkdir(parents=True, exist_ok=True)
        stopped_at = datetime.now(timezone.utc).isoformat()
        if BACKEND == "fake":
            media_path.write_text(
                "\n".join(
                    [
                        "Motion Levels fake camera recording",
                        f"attemptId={attempt_id}",
                        f"startedAt={recording['startedAt']}",
                        f"stoppedAt={stopped_at}",
                        f"result={payload.get('result', '')}",
                    ]
                )
                + "\n",
                encoding="utf-8",
            )
        command_event = None
        if BACKEND == "command":
            command_event = run_camera_command("video-stop", STOP_COMMAND, payload, recording, media_path, metadata_path)
        metadata = {
            "backend": BACKEND,
            "state": "finished",
            "startedAt": recording["startedAt"],
            "stoppedAt": stopped_at,
            "start": recording["start"],
            "finish": payload,
            "mediaPath": str(media_path),
            "rcloneDest": RCLONE_DEST,
        }
        if command_event is not None:
            metadata["stopCommand"] = command_event
            if not command_event.get("ok"):
                metadata["state"] = "stop-failed"
        write_json(metadata_path, metadata)
        media_ready = media_path.exists() and media_path.stat().st_size > 0
        if RCLONE_DEST and media_ready and metadata["state"] == "finished":
            threading.Thread(target=upload_recording, args=(recording, media_path, metadata_path), daemon=True).start()
        self.write_json(
            HTTPStatus.OK,
            {
                "ok": True,
                "backend": BACKEND,
                "recordingId": attempt_id,
                "mediaPath": str(media_path),
                "metadataPath": str(metadata_path),
                "mediaReady": media_ready,
                "uploadQueued": bool(RCLONE_DEST and media_ready and metadata["state"] == "finished"),
                "command": command_event,
            },
        )

    def handle_quick_video(self) -> None:
        payload = self.read_json()
        ready, ready_error = backend_ready()
        if not ready:
            self.write_json(HTTPStatus.SERVICE_UNAVAILABLE, {"ok": False, "backend": BACKEND, "error": ready_error})
            return

        payload.setdefault("label", "debug")
        duration_seconds = quick_video_duration(payload)
        paths = capture_paths(payload, "video", MEDIA_EXTENSION)
        paths["dir"].mkdir(parents=True, exist_ok=True)
        capture_id = slug(payload.get("captureId") or paths["media"].stem, "video")
        payload.setdefault("captureId", capture_id)
        started_at = datetime.now(timezone.utc).isoformat()
        recording = {
            "captureId": capture_id,
            "startedAt": started_at,
            "durationSeconds": duration_seconds,
            "mediaPath": str(paths["media"]),
            "metadataPath": str(paths["metadata"]),
            "payload": payload,
            "platformIngest": False,
        }
        metadata = {
            "backend": BACKEND,
            "state": "recording",
            "type": "quick-video",
            "durationSeconds": duration_seconds,
            "startedAt": started_at,
            "payload": payload,
            "mediaPath": str(paths["media"]),
            "rcloneDest": RCLONE_DEST,
        }

        start_event = None
        stop_event = None
        if BACKEND == "command":
            start_event = run_camera_command("quick-video-start", START_COMMAND, payload, recording, paths["media"], paths["metadata"])
            metadata["startCommand"] = start_event
            if not start_event.get("ok"):
                metadata["state"] = "start-failed"
                metadata["stoppedAt"] = datetime.now(timezone.utc).isoformat()
                write_json(paths["metadata"], metadata)
                self.write_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"ok": False, "backend": BACKEND, "error": "camera start command failed", "event": start_event})
                return

        write_json(paths["metadata"], metadata)
        with active_lock:
            active_recordings[capture_id] = recording
        try:
            time.sleep(duration_seconds)
            stopped_at = datetime.now(timezone.utc).isoformat()
            if BACKEND == "fake":
                paths["media"].write_text(
                    "\n".join(
                        [
                            "Motion Levels fake camera quick video",
                            f"captureId={capture_id}",
                            f"startedAt={started_at}",
                            f"stoppedAt={stopped_at}",
                            f"durationSeconds={duration_seconds}",
                            f"label={payload.get('label', '')}",
                        ]
                    )
                    + "\n",
                    encoding="utf-8",
                )
            elif BACKEND == "command":
                stop_payload = {**payload, "durationSeconds": duration_seconds, "stoppedAt": stopped_at}
                stop_event = run_camera_command("quick-video-stop", STOP_COMMAND, stop_payload, recording, paths["media"], paths["metadata"])
                metadata["stopCommand"] = stop_event
            media_ready = paths["media"].exists() and paths["media"].stat().st_size > 0
            metadata["state"] = "finished" if media_ready and (not stop_event or stop_event.get("ok")) else "media-missing"
            if stop_event and not stop_event.get("ok"):
                metadata["state"] = "stop-failed"
            metadata["contentType"] = content_type_for(paths["media"])
            metadata["byteSize"] = paths["media"].stat().st_size if paths["media"].exists() else 0
            metadata["stoppedAt"] = stopped_at
            write_json(paths["metadata"], metadata)
        finally:
            with active_lock:
                active_recordings.pop(capture_id, None)

        upload_queued = bool(RCLONE_DEST and media_ready and metadata["state"] == "finished")
        if upload_queued:
            threading.Thread(target=upload_media, args=(paths["media"], paths["metadata"]), daemon=True).start()
        self.write_json(
            HTTPStatus.OK if media_ready and metadata["state"] == "finished" else HTTPStatus.INTERNAL_SERVER_ERROR,
            {
                "ok": media_ready and metadata["state"] == "finished",
                "backend": BACKEND,
                "captureId": capture_id,
                "durationSeconds": duration_seconds,
                "mediaPath": str(paths["media"]),
                "metadataPath": str(paths["metadata"]),
                "mediaReady": media_ready,
                "uploadQueued": upload_queued,
                "startCommand": start_event,
                "stopCommand": stop_event,
            },
        )

    def handle_take_photo(self) -> None:
        payload = self.read_json()
        ready, ready_error = backend_ready("photo")
        if not ready:
            self.write_json(HTTPStatus.SERVICE_UNAVAILABLE, {"ok": False, "backend": BACKEND, "error": ready_error})
            return
        paths = capture_paths(payload, "photo", PHOTO_EXTENSION)
        paths["dir"].mkdir(parents=True, exist_ok=True)
        capture_id = slug(payload.get("captureId") or paths["media"].stem, "photo")
        payload.setdefault("captureId", capture_id)
        started_at = datetime.now(timezone.utc).isoformat()
        metadata = {
            "backend": BACKEND,
            "state": "capturing",
            "type": "photo",
            "startedAt": started_at,
            "payload": payload,
            "mediaPath": str(paths["media"]),
            "rcloneDest": RCLONE_DEST,
        }
        recording = {
            "captureId": capture_id,
            "startedAt": started_at,
            "mediaPath": str(paths["media"]),
            "metadataPath": str(paths["metadata"]),
            "payload": payload,
            "platformIngest": False,
        }
        command_event = None
        if BACKEND == "fake":
            paths["media"].write_text(
                "\n".join(
                    [
                        "Motion Levels fake camera photo",
                        f"captureId={capture_id}",
                        f"capturedAt={started_at}",
                        f"label={payload.get('label', '')}",
                    ]
                )
                + "\n",
                encoding="utf-8",
            )
        elif BACKEND == "command":
            command_event = run_camera_command("photo", PHOTO_COMMAND, payload, recording, paths["media"], paths["metadata"])
            metadata["photoCommand"] = command_event
            if not command_event.get("ok"):
                metadata["state"] = "photo-failed"
                write_json(paths["metadata"], metadata)
                self.write_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"ok": False, "backend": BACKEND, "error": "camera photo command failed", "event": command_event})
                return
        media_ready = paths["media"].exists() and paths["media"].stat().st_size > 0
        metadata["state"] = "finished" if media_ready else "media-missing"
        metadata["contentType"] = content_type_for(paths["media"])
        metadata["byteSize"] = paths["media"].stat().st_size if paths["media"].exists() else 0
        metadata["stoppedAt"] = datetime.now(timezone.utc).isoformat()
        write_json(paths["metadata"], metadata)
        if RCLONE_DEST and media_ready:
            threading.Thread(target=upload_media, args=(paths["media"], paths["metadata"]), daemon=True).start()
        self.write_json(
            HTTPStatus.OK if media_ready else HTTPStatus.INTERNAL_SERVER_ERROR,
            {
                "ok": media_ready,
                "backend": BACKEND,
                "captureId": capture_id,
                "mediaPath": str(paths["media"]),
                "metadataPath": str(paths["metadata"]),
                "mediaReady": media_ready,
                "uploadQueued": bool(RCLONE_DEST and media_ready),
                "command": command_event,
            },
        )

    def read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("content-length") or "0")
        if length <= 0:
            return {}
        data = self.rfile.read(length)
        parsed = json.loads(data.decode("utf-8"))
        if not isinstance(parsed, dict):
            raise ValueError("expected JSON object")
        return parsed

    def write_json(self, status: HTTPStatus, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, sort_keys=True).encode("utf-8") + b"\n"
        self.send_response(status)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt: str, *args: Any) -> None:
        print(f"{self.log_date_time_string()} {self.address_string()} {fmt % args}", flush=True)


def main() -> None:
    bind = os.environ.get("MOTION_LEVELS_CAMERA_RECORDER_BIND", "127.0.0.1")
    port = int(os.environ.get("MOTION_LEVELS_CAMERA_RECORDER_PORT", "8030"))
    ROOT.mkdir(parents=True, exist_ok=True)
    print(f"camera recorder backend={BACKEND} serving http://{bind}:{port}", flush=True)
    print(f"camera recordings root={ROOT}", flush=True)
    ready, ready_error = backend_ready()
    if not ready:
        print(f"camera recorder backend not ready: {ready_error}", flush=True)
    if RCLONE_DEST:
        print(f"rclone uploads enabled dest={RCLONE_DEST}", flush=True)
        print(f"rclone public links {'enabled' if PUBLIC_LINKS else 'disabled'}", flush=True)
    if PLATFORM_URL:
        print(f"platform video ingest enabled url={PLATFORM_URL}", flush=True)
    ThreadingHTTPServer((bind, port), Handler).serve_forever()


if __name__ == "__main__":
    main()
