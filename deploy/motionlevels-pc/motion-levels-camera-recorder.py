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
FALSE_VALUES = {"0", "false", "no", "off"}
TRUE_VALUES = {"1", "true", "yes", "on"}
REGULAR_MEDIA_EXTENSION = os.environ.get(
    "MOTION_LEVELS_CAMERA_REGULAR_MEDIA_EXTENSION",
    ".mock-video.txt" if BACKEND == "fake" else ".mp4",
).strip()
if REGULAR_MEDIA_EXTENSION and not REGULAR_MEDIA_EXTENSION.startswith("."):
    REGULAR_MEDIA_EXTENSION = f".{REGULAR_MEDIA_EXTENSION}"
SPHERICAL_MEDIA_EXTENSION = os.environ.get(
    "MOTION_LEVELS_CAMERA_360_MEDIA_EXTENSION",
    ".mock-video.txt" if BACKEND == "fake" else ".insv",
).strip()
if SPHERICAL_MEDIA_EXTENSION and not SPHERICAL_MEDIA_EXTENSION.startswith("."):
    SPHERICAL_MEDIA_EXTENSION = f".{SPHERICAL_MEDIA_EXTENSION}"
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
STATUS_COMMAND = os.environ.get("MOTION_LEVELS_CAMERA_STATUS_COMMAND", "").strip()
if not STATUS_COMMAND and START_COMMAND:
    inferred_status_command = re.sub(r"(^|\s)start(\s*)$", r"\1status\2", START_COMMAND)
    STATUS_COMMAND = inferred_status_command if inferred_status_command != START_COMMAND else ""
CAMERA_STATUS_CACHE_SECONDS = float(os.environ.get("MOTION_LEVELS_CAMERA_STATUS_CACHE_SECONDS", "30"))
CAMERA_STATUS_TIMEOUT_SECONDS = float(os.environ.get("MOTION_LEVELS_CAMERA_STATUS_TIMEOUT_SECONDS", "10"))
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
PUBLIC_LINKS = os.environ.get("MOTION_LEVELS_CAMERA_PUBLIC_LINKS", "1").strip().lower() not in FALSE_VALUES
DELETE_LOCAL_AFTER_UPLOAD = os.environ.get("MOTION_LEVELS_CAMERA_DELETE_LOCAL_AFTER_UPLOAD", "1").strip().lower() not in FALSE_VALUES
DEFAULT_HDR_ENABLED = os.environ.get("MOTION_LEVELS_CAMERA_HDR_DEFAULT", "1").strip().lower() not in FALSE_VALUES
DEFAULT_VIDEO_PROJECTION = os.environ.get("MOTION_LEVELS_CAMERA_VIDEO_PROJECTION_DEFAULT", "regular").strip().lower()
SESSION_SEGMENT_SECONDS = float(os.environ.get("MOTION_LEVELS_CAMERA_SESSION_SEGMENT_SECONDS", "120"))
DELETE_REMOTE_AFTER_DOWNLOAD = os.environ.get("MOTION_LEVELS_CAMERA_DELETE_REMOTE_AFTER_DOWNLOAD", "1").strip().lower() not in FALSE_VALUES
TV_STATUS_URL = os.environ.get("MOTION_LEVELS_CAMERA_TV_STATUS_URL", "http://127.0.0.1:4101/tv").strip()
DISPLAY_STATUS_URL = os.environ.get("MOTION_LEVELS_CAMERA_DISPLAY_STATUS_URL", "http://127.0.0.1:4102/api/display").strip()


active_lock = threading.Lock()
camera_command_lock = threading.Lock()
active_recordings: dict[str, dict[str, Any]] = {}
active_sessions: dict[str, dict[str, Any]] = {}
skipped_recordings: set[str] = set()
camera_status_cache: dict[str, Any] | None = None
camera_status_cache_at = 0.0
camera_status_refreshing = False
upload_events: list[dict[str, Any]] = []


def slug(value: Any, fallback: str = "unknown") -> str:
    text = str(value or "").strip().lower()
    text = re.sub(r"[^a-z0-9._-]+", "-", text)
    text = text.strip("-._")
    return text or fallback


def normalized_bool(value: Any, fallback: bool) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return fallback
    text = str(value).strip().lower()
    if text in TRUE_VALUES:
        return True
    if text in FALSE_VALUES:
        return False
    return fallback


def normalized_video_projection(value: Any, fallback: str = DEFAULT_VIDEO_PROJECTION) -> str:
    text = str(value or fallback or "regular").strip().lower()
    text = text.replace("_", "-")
    if text in {"360", "spherical", "sphere", "reframeable", "insv"}:
        return "360"
    return "regular"


def video_capture_options(payload: dict[str, Any], recording: dict[str, Any] | None = None) -> dict[str, Any]:
    base: dict[str, Any] = {}
    if recording:
        for key in ("start", "payload"):
            value = recording.get(key)
            if isinstance(value, dict):
                base.update(value)
    base.update(payload)
    explicit_video_mode = str(base.get("videoMode") or "").strip().lower()
    hdr_enabled = normalized_bool(base.get("hdrEnabled"), DEFAULT_HDR_ENABLED)
    if explicit_video_mode == "hdr":
        hdr_enabled = True
    elif explicit_video_mode == "normal":
        hdr_enabled = False
    projection = normalized_video_projection(
        base.get("videoProjection")
        or base.get("captureProjection")
        or base.get("projection")
        or ("360" if normalized_bool(base.get("video360"), False) else None),
    )
    return {
        "hdrEnabled": hdr_enabled,
        "videoMode": "hdr" if hdr_enabled else "normal",
        "videoProjection": projection,
        "stitchingEnabled": projection == "regular",
        "mediaExtension": SPHERICAL_MEDIA_EXTENSION if projection == "360" else REGULAR_MEDIA_EXTENSION,
    }


def video_media_extension(payload: dict[str, Any], recording: dict[str, Any] | None = None) -> str:
    return str(video_capture_options(payload, recording).get("mediaExtension") or REGULAR_MEDIA_EXTENSION)


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


def attempt_paths(start: dict[str, Any], extension: str | None = None) -> dict[str, Path]:
    started_at = unix_nanos_to_datetime(start.get("startedUnixNanos"))
    day_dir = ROOT / started_at.strftime("%Y") / started_at.strftime("%m") / started_at.strftime("%d")
    game_dir = day_dir / slug(start.get("game"), "game") / slug(start.get("level"), "level")
    timestamp = started_at.strftime("%Y%m%dT%H%M%SZ")
    media_extension = extension or video_media_extension(start)
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
        "media": game_dir / f"{stem}{media_extension}",
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


def session_dir(payload: dict[str, Any]) -> Path:
    started_at = unix_nanos_to_datetime(payload.get("startedUnixNanos"))
    venue_id = slug(payload.get("venueSessionId") or payload.get("sessionId"), "session")
    return ROOT / started_at.strftime("%Y") / started_at.strftime("%m") / started_at.strftime("%d") / "sessions" / venue_id


def session_segment_paths(payload: dict[str, Any], segment_index: int, extension: str) -> dict[str, Path]:
    started_at = datetime.now(timezone.utc)
    base = session_dir(payload)
    timestamp = started_at.strftime("%Y%m%dT%H%M%SZ")
    venue_id = slug(payload.get("venueSessionId") or payload.get("sessionId"), "session")
    stem = f"{timestamp}-session-{venue_id}-segment-{segment_index:04d}"
    return {
        "dir": base,
        "media": base / f"{stem}{extension}",
        "metadata": base / f"{stem}.json",
    }


def session_video_folder_path(payload: dict[str, Any]) -> str:
    relative_dir = relative_upload_dir(session_dir(payload))
    if RCLONE_DEST:
        return f"{RCLONE_DEST}/{relative_dir}"
    return relative_dir


def relative_upload_path(path: Path) -> str:
    try:
        relative = path.relative_to(ROOT)
    except ValueError:
        relative = Path(path.name)
    if RCLONE_PATH_PREFIX:
        return f"{RCLONE_PATH_PREFIX}/{relative.as_posix()}"
    return relative.as_posix()


def relative_upload_dir(path: Path) -> str:
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


def camera_busy_response(action: str) -> dict[str, Any]:
    return {
        "ok": False,
        "label": "camera-command",
        "action": action,
        "error": "camera command already running",
        "startedAt": datetime.now(timezone.utc).isoformat(),
    }


def remove_local_file(path: Path, label: str) -> dict[str, Any]:
    event = {
        "path": str(path),
        "label": label,
        "startedAt": datetime.now(timezone.utc).isoformat(),
    }
    try:
        if path.exists():
            path.unlink()
            event["deleted"] = True
        else:
            event["deleted"] = False
            event["missing"] = True
        event["ok"] = True
    except Exception as exc:
        event["ok"] = False
        event["error"] = str(exc)
    record_event(event)
    return event


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
    options = video_capture_options(payload, recording)
    env.update(
        {
            "MOTION_LEVELS_CAMERA_ACTION": action,
            "MOTION_LEVELS_CAMERA_BACKEND": BACKEND,
            "MOTION_LEVELS_CAMERA_PAYLOAD_JSON": json.dumps(payload, sort_keys=True),
            "MOTION_LEVELS_CAMERA_RECORDING_JSON": json.dumps(recording, sort_keys=True),
            "MOTION_LEVELS_CAMERA_ATTEMPT_ID": str(payload.get("attemptId") or recording.get("attemptId") or ""),
            "MOTION_LEVELS_CAMERA_MEDIA_PATH": str(media_path),
            "MOTION_LEVELS_CAMERA_METADATA_PATH": str(metadata_path),
            "MOTION_LEVELS_CAMERA_HDR_ENABLED": "1" if options["hdrEnabled"] else "0",
            "MOTION_LEVELS_CAMERA_VIDEO_PROJECTION": str(options["videoProjection"]),
            "MOTION_LEVELS_INSTA360_VIDEO_MODE": str(options["videoMode"]),
            "MOTION_LEVELS_INSTA360_ENABLE_STITCHING": "1" if options["stitchingEnabled"] else "0",
            "MOTION_LEVELS_INSTA360_DELETE_AFTER_DOWNLOAD": "1" if DELETE_REMOTE_AFTER_DOWNLOAD else "0",
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


def run_camera_status_command() -> dict[str, Any]:
    event = {
        "ok": False,
        "label": "camera-status",
        "startedAt": datetime.now(timezone.utc).isoformat(),
    }
    if BACKEND != "command":
        return {**event, "skipped": True, "error": "camera status is only available for command backend"}
    if not STATUS_COMMAND:
        return {**event, "skipped": True, "error": "MOTION_LEVELS_CAMERA_STATUS_COMMAND is not configured"}
    if not camera_command_lock.acquire(blocking=False):
        return {**event, "skipped": True, "error": "camera command already running"}
    try:
        started = time.time()
        result = subprocess.run(
            STATUS_COMMAND,
            shell=True,
            check=False,
            capture_output=True,
            text=True,
            timeout=CAMERA_STATUS_TIMEOUT_SECONDS,
            env=os.environ.copy(),
        )
        event["durationSeconds"] = round(time.time() - started, 3)
        event["returnCode"] = result.returncode
        event["stdout"] = result.stdout[-4000:]
        event["stderr"] = result.stderr[-4000:]
        event["ok"] = result.returncode == 0
        if result.returncode == 0:
            lines = [line.strip() for line in result.stdout.splitlines() if line.strip()]
            if lines:
                try:
                    parsed = json.loads(lines[-1])
                    if isinstance(parsed, dict):
                        event.update(parsed)
                        event["ok"] = bool(parsed.get("ok", True))
                except json.JSONDecodeError as exc:
                    event["ok"] = False
                    event["error"] = f"invalid camera status JSON: {exc}"
    except Exception as exc:
        event["ok"] = False
        event["error"] = str(exc)
    finally:
        camera_command_lock.release()
    event["updatedAt"] = datetime.now(timezone.utc).isoformat()
    return event


def refresh_camera_status_cache() -> None:
    global camera_status_cache, camera_status_cache_at, camera_status_refreshing
    try:
        status = run_camera_status_command()
        with active_lock:
            if not status.get("skipped"):
                camera_status_cache = status
                camera_status_cache_at = time.time()
    finally:
        with active_lock:
            camera_status_refreshing = False


def cached_camera_status() -> dict[str, Any]:
    global camera_status_refreshing
    now = time.time()
    with active_lock:
        cached = dict(camera_status_cache) if camera_status_cache else None
        stale = not cached or now - camera_status_cache_at > CAMERA_STATUS_CACHE_SECONDS
        should_refresh = stale and not camera_status_refreshing
        if should_refresh:
            camera_status_refreshing = True
    if should_refresh:
        threading.Thread(target=refresh_camera_status_cache, daemon=True).start()
    if cached:
        cached["refreshing"] = should_refresh
        return cached
    return {
        "ok": False,
        "pending": True,
        "refreshing": should_refresh,
        "label": "camera-status",
        "error": "camera storage status is loading",
    }


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


def fetch_json(url: str, timeout: float = 2.0) -> tuple[dict[str, Any] | None, str | None]:
    if not url:
        return None, "url is not configured"
    try:
        with request.urlopen(url, timeout=timeout) as response:
            payload = json.loads(response.read(8192).decode("utf-8", errors="replace"))
            return payload if isinstance(payload, dict) else {}, None
    except Exception as exc:
        return None, str(exc)


def hardware_health() -> dict[str, Any]:
    ready, ready_error = backend_ready()
    camera = camera_probe()
    tv, tv_error = fetch_json(TV_STATUS_URL)
    display, display_error = fetch_json(DISPLAY_STATUS_URL)
    hdmi_ok = bool(tv and tv.get("hdmiConnected") is True)
    kiosk_ok = bool(tv and tv.get("kioskActive") is True)
    audio_enabled = bool(display and display.get("audioEnabled") is True)
    audio_muted = bool(display and display.get("audioMuted") is True)
    return {
        "camera": {
            "ok": ready and camera.get("detected") is True,
            "label": "camera",
            "message": ready_error if not ready else ("USB camera not detected" if not camera.get("detected") else "ready"),
            "details": camera,
        },
        "hdmi": {
            "ok": hdmi_ok,
            "label": "HDMI",
            "message": tv_error or ("connected" if hdmi_ok else "HDMI output is not connected"),
            "details": tv,
        },
        "playerDisplay": {
            "ok": kiosk_ok,
            "label": "player display",
            "message": tv_error or ("kiosk active" if kiosk_ok else "kiosk service is not active"),
            "details": tv,
        },
        "sound": {
            "ok": audio_enabled and not audio_muted,
            "label": "sound",
            "message": display_error or ("audio ready" if audio_enabled and not audio_muted else "audio disabled or muted"),
            "details": display,
        },
    }


def notify_session_start(payload: dict[str, Any], video_folder_share_url: str | None, health: dict[str, Any]) -> dict[str, Any]:
    event = {
        "label": "session-start-alert",
        "venueSessionId": payload.get("venueSessionId"),
        "startedAt": datetime.now(timezone.utc).isoformat(),
    }
    if not PLATFORM_URL:
        event["ok"] = False
        event["skipped"] = True
        event["error"] = "platform URL is not configured"
        record_event(event)
        return event
    body = {
        "venueSessionId": payload.get("venueSessionId"),
        "controllerLabel": payload.get("controllerLabel"),
        "controllerHostname": payload.get("controllerHostname"),
        "teamName": payload.get("teamName"),
        "startedAt": datetime.now(timezone.utc).isoformat(),
        "platformSessionPath": payload.get("platformSessionPath") or f"/session/{payload.get('venueSessionId')}",
        "videoFolderShareUrl": video_folder_share_url,
        "hardware": health,
    }
    try:
        req = request.Request(
            f"{PLATFORM_URL}/api/ingest/session-start-alert",
            data=json.dumps(body).encode("utf-8"),
            headers={"content-type": "application/json"},
            method="POST",
        )
        if PLATFORM_TOKEN:
            req.add_header("authorization", f"Bearer {PLATFORM_TOKEN}")
        with request.urlopen(req, timeout=PLATFORM_TIMEOUT_SECONDS) as response:
            event["status"] = response.status
            event["response"] = response.read(4096).decode("utf-8", errors="replace")
            event["ok"] = 200 <= response.status < 300
    except error.HTTPError as exc:
        event["status"] = exc.code
        event["response"] = exc.read(4096).decode("utf-8", errors="replace")[-2000:]
        event["ok"] = False
    except Exception as exc:
        event["ok"] = False
        event["error"] = str(exc)
    record_event(event)
    return event


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
    if media_event.get("ok") and DELETE_LOCAL_AFTER_UPLOAD:
        metadata["localDelete"] = remove_local_file(media_path, f"delete-{media_path.name}")
        metadata["localDeletedAt"] = datetime.now(timezone.utc).isoformat()
    write_json(metadata_path, metadata)
    metadata_event = run_upload(metadata_path, metadata_path.name)
    metadata["metadataUpload"] = metadata_event
    if metadata_event.get("ok") and DELETE_LOCAL_AFTER_UPLOAD:
        write_json(metadata_path, metadata)
        remove_local_file(metadata_path, f"delete-{metadata_path.name}")


def upload_recording(recording: dict[str, Any], media_path: Path, metadata_path: Path) -> None:
    platform_recording = recording if recording.get("platformIngest") else None
    upload_media(media_path, metadata_path, platform_recording)


def segment_duration_seconds(payload: dict[str, Any] | None = None) -> int:
    value: Any = SESSION_SEGMENT_SECONDS
    if payload:
        value = payload.get("segmentSeconds") or payload.get("segmentDurationSeconds") or value
    try:
        parsed = float(value)
    except (TypeError, ValueError):
        parsed = SESSION_SEGMENT_SECONDS
    return max(10, min(900, round(parsed)))


def create_session_folder_link(payload: dict[str, Any], health: dict[str, Any]) -> tuple[str | None, dict[str, Any] | None]:
    if not RCLONE_DEST:
        return None, None
    base = session_dir(payload)
    base.mkdir(parents=True, exist_ok=True)
    manifest = base / "session-start.json"
    write_json(
        manifest,
        {
            "type": "session-start",
            "payload": payload,
            "hardware": health,
            "createdAt": datetime.now(timezone.utc).isoformat(),
        },
    )
    upload_event = run_upload(manifest, manifest.name)
    remote_dir = f"{RCLONE_DEST}/{relative_upload_dir(base)}"
    share_url = None
    link_event = None
    if upload_event.get("ok"):
        share_url, link_event = run_public_link(remote_dir)
    if DELETE_LOCAL_AFTER_UPLOAD:
        remove_local_file(manifest, f"delete-{manifest.name}")
    return share_url, link_event


def run_session_segment(session: dict[str, Any], segment_index: int) -> bool:
    payload = dict(session["payload"])
    capture_options = video_capture_options(payload)
    paths = session_segment_paths(payload, segment_index, str(capture_options["mediaExtension"]))
    paths["dir"].mkdir(parents=True, exist_ok=True)
    now = datetime.now(timezone.utc)
    venue_id = str(payload.get("venueSessionId") or "session")
    attempt_id = f"{venue_id}:segment:{segment_index:04d}"
    segment_payload = {
        **payload,
        "attemptId": attempt_id,
        "captureId": attempt_id,
        "segmentIndex": segment_index,
        "segmentSeconds": session["segmentSeconds"],
        "startedUnixNanos": int(now.timestamp() * 1_000_000_000),
        "game": "venue-session",
        "level": f"segment-{segment_index:04d}",
    }
    started_at = now.isoformat()
    recording = {
        "attemptId": attempt_id,
        "captureId": attempt_id,
        "startedAt": started_at,
        "mediaPath": str(paths["media"]),
        "metadataPath": str(paths["metadata"]),
        "start": segment_payload,
        "captureOptions": capture_options,
        "platformIngest": True,
    }
    metadata = {
        "backend": BACKEND,
        "state": "recording",
        "type": "session-segment",
        "segmentIndex": segment_index,
        "durationSeconds": session["segmentSeconds"],
        "startedAt": started_at,
        "payload": segment_payload,
        "captureOptions": capture_options,
        "mediaPath": str(paths["media"]),
        "rcloneDest": RCLONE_DEST,
    }
    write_json(paths["metadata"], metadata)

    stop_event: threading.Event = session["stopEvent"]
    start_event = None
    stop_command_event = None
    if BACKEND == "fake":
        stop_event.wait(session["segmentSeconds"])
        stopped_at = datetime.now(timezone.utc).isoformat()
        paths["media"].write_text(
            "\n".join(
                [
                    "Motion Levels fake camera session segment",
                    f"venueSessionId={venue_id}",
                    f"segmentIndex={segment_index}",
                    f"startedAt={started_at}",
                    f"stoppedAt={stopped_at}",
                ]
            )
            + "\n",
            encoding="utf-8",
        )
    elif BACKEND == "command":
        camera_command_lock.acquire()
        try:
            if stop_event.is_set():
                return False
            start_event = run_camera_command("session-segment-start", START_COMMAND, segment_payload, recording, paths["media"], paths["metadata"])
            metadata["startCommand"] = start_event
            if not start_event.get("ok"):
                metadata["state"] = "start-failed"
                metadata["stoppedAt"] = datetime.now(timezone.utc).isoformat()
                write_json(paths["metadata"], metadata)
                return False
            write_json(paths["metadata"], metadata)
            stop_event.wait(session["segmentSeconds"])
            stopped_at = datetime.now(timezone.utc).isoformat()
            stop_payload = {**segment_payload, "stoppedAt": stopped_at}
            stop_command_event = run_camera_command("session-segment-stop", STOP_COMMAND, stop_payload, recording, paths["media"], paths["metadata"])
            metadata["stopCommand"] = stop_command_event
        finally:
            camera_command_lock.release()
    else:
        metadata["state"] = "unsupported-backend"
        metadata["stoppedAt"] = datetime.now(timezone.utc).isoformat()
        write_json(paths["metadata"], metadata)
        return False

    stopped_at = datetime.now(timezone.utc).isoformat()
    media_ready = paths["media"].exists() and paths["media"].stat().st_size > 0
    metadata["state"] = "finished" if media_ready and (not stop_command_event or stop_command_event.get("ok")) else "media-missing"
    if stop_command_event and not stop_command_event.get("ok"):
        metadata["state"] = "stop-failed"
    metadata["contentType"] = content_type_for(paths["media"])
    metadata["byteSize"] = paths["media"].stat().st_size if paths["media"].exists() else 0
    metadata["stoppedAt"] = stopped_at
    metadata["mediaReady"] = media_ready
    write_json(paths["metadata"], metadata)
    if RCLONE_DEST and media_ready and metadata["state"] == "finished":
        threading.Thread(target=upload_recording, args=(recording, paths["media"], paths["metadata"]), daemon=True).start()
    return media_ready and metadata["state"] == "finished"


def run_session_loop(session_id: str) -> None:
    with active_lock:
        session = active_sessions.get(session_id)
    if not session:
        return
    record_event({"label": "session-recording-loop", "venueSessionId": session_id, "ok": True, "startedAt": datetime.now(timezone.utc).isoformat()})
    index = 1
    while not session["stopEvent"].is_set():
        ok = run_session_segment(session, index)
        with active_lock:
            if session_id in active_sessions:
                active_sessions[session_id]["segmentIndex"] = index
                active_sessions[session_id]["lastSegmentOk"] = ok
                active_sessions[session_id]["updatedAt"] = datetime.now(timezone.utc).isoformat()
        if not ok:
            break
        index += 1
    record_event({"label": "session-recording-loop", "venueSessionId": session_id, "ok": True, "stoppedAt": datetime.now(timezone.utc).isoformat(), "segments": index - 1})
    with active_lock:
        active_sessions.pop(session_id, None)


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
            sessions = [
                {key: value for key, value in session.items() if key not in {"stopEvent", "thread"}}
                for session in active_sessions.values()
            ]
            uploads = list(upload_events)
        ready, ready_error = backend_ready()
        photo_ready, photo_error = backend_ready("photo")
        camera = camera_probe()
        camera_status = cached_camera_status()
        ready_to_record = ready and camera.get("detected") is True and bool(RCLONE_DEST)
        ready_to_record_error = None
        if not camera.get("detected"):
            ready_to_record_error = "Insta360 camera is not connected by USB"
        elif not ready:
            ready_to_record_error = ready_error
        elif not RCLONE_DEST:
            ready_to_record_error = "rclone destination is not configured"
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
                "statusCommandConfigured": bool(STATUS_COMMAND),
                "camera": camera,
                "cameraStatus": camera_status,
                "readyToRecord": ready_to_record,
                "readyToRecordError": ready_to_record_error,
                "rcloneConfigured": bool(RCLONE_DEST),
                "deleteLocalAfterUpload": DELETE_LOCAL_AFTER_UPLOAD,
                "publicLinks": PUBLIC_LINKS,
                "videoDefaults": {
                    "hdrEnabled": DEFAULT_HDR_ENABLED,
                    "videoMode": "hdr" if DEFAULT_HDR_ENABLED else "normal",
                    "videoProjection": normalized_video_projection(DEFAULT_VIDEO_PROJECTION),
                    "regularMediaExtension": REGULAR_MEDIA_EXTENSION,
                    "sphericalMediaExtension": SPHERICAL_MEDIA_EXTENSION,
                },
                "platformConfigured": bool(PLATFORM_URL),
                "root": str(ROOT),
                "active": active,
                "activeSessions": sessions,
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
        if self.path.rstrip("/") == "/sessions/start":
            self.handle_session_start()
            return
        if self.path.rstrip("/") == "/sessions/stop":
            self.handle_session_stop()
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def handle_session_start(self) -> None:
        payload = self.read_json()
        venue_id = str(payload.get("venueSessionId") or "").strip()
        if not venue_id:
            self.write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "venueSessionId is required"})
            return
        payload.setdefault("startedUnixNanos", int(time.time() * 1_000_000_000))
        payload.setdefault("platformSessionPath", f"/session/{venue_id}")
        video_folder_path = session_video_folder_path(payload)
        health = hardware_health()
        video_folder_share_url, link_event = create_session_folder_link(payload, health)
        alert_event = notify_session_start(payload, video_folder_share_url, health)
        ready, ready_error = backend_ready()
        camera = camera_probe()
        can_record = ready and camera.get("detected") is True
        if not can_record:
            self.write_json(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "recording": False,
                    "venueSessionId": venue_id,
                    "videoFolderPath": video_folder_path,
                    "videoFolderShareUrl": video_folder_share_url,
                    "hardware": health,
                    "alert": alert_event,
                    "error": ready_error or "camera not detected",
                },
            )
            return
        with active_lock:
            if venue_id in active_sessions:
                session = active_sessions[venue_id]
                self.write_json(
                    HTTPStatus.OK,
                    {
                        "ok": True,
                        "recording": True,
                        "venueSessionId": venue_id,
                        "alreadyActive": True,
                        "videoFolderPath": session.get("videoFolderPath") or video_folder_path,
                        "videoFolderShareUrl": session.get("videoFolderShareUrl"),
                        "segmentIndex": session.get("segmentIndex"),
                    },
                )
                return
            stop_event = threading.Event()
            session = {
                "venueSessionId": venue_id,
                "startedAt": datetime.now(timezone.utc).isoformat(),
                "payload": payload,
                "segmentSeconds": segment_duration_seconds(payload),
                "videoFolderPath": video_folder_path,
                "videoFolderShareUrl": video_folder_share_url,
                "health": health,
                "stopEvent": stop_event,
                "segmentIndex": 0,
                "lastSegmentOk": None,
            }
            thread = threading.Thread(target=run_session_loop, args=(venue_id,), daemon=True)
            session["thread"] = thread
            active_sessions[venue_id] = session
        thread.start()
        self.write_json(
            HTTPStatus.OK,
            {
                "ok": True,
                "recording": True,
                "venueSessionId": venue_id,
                "segmentSeconds": segment_duration_seconds(payload),
                "videoFolderPath": video_folder_path,
                "videoFolderShareUrl": video_folder_share_url,
                "folderLink": link_event,
                "hardware": health,
                "alert": alert_event,
            },
        )

    def handle_session_stop(self) -> None:
        payload = self.read_json()
        venue_id = str(payload.get("venueSessionId") or "").strip()
        if not venue_id:
            self.write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "venueSessionId is required"})
            return
        with active_lock:
            session = active_sessions.get(venue_id)
        if not session:
            self.write_json(HTTPStatus.OK, {"ok": True, "recording": False, "venueSessionId": venue_id})
            return
        stop_event: threading.Event = session["stopEvent"]
        stop_event.set()
        thread: threading.Thread | None = session.get("thread")
        if thread:
            thread.join(timeout=5)
        self.write_json(HTTPStatus.OK, {"ok": True, "recording": False, "venueSessionId": venue_id, "stopping": thread.is_alive() if thread else False})

    def handle_start(self) -> None:
        payload = self.read_json()
        generated_capture_id = f"video-{int(time.time() * 1000)}"
        attempt_id = str(payload.get("attemptId") or payload.get("captureId") or generated_capture_id).strip()
        if not attempt_id:
            self.write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "attemptId or captureId is required"})
            return
        payload.setdefault("captureId", attempt_id)
        capture_options = video_capture_options(payload)
        venue_id = str(payload.get("venueSessionId") or "").strip()
        with active_lock:
            session_recording_active = bool(venue_id and venue_id in active_sessions)
            if session_recording_active:
                skipped_recordings.add(attempt_id)
        if session_recording_active:
            self.write_json(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "backend": BACKEND,
                    "recordingId": attempt_id,
                    "recording": False,
                    "skipped": True,
                    "reason": "venue session recording is active",
                    "venueSessionId": venue_id,
                },
            )
            return
        ready, ready_error = backend_ready()
        if not ready:
            self.write_json(HTTPStatus.SERVICE_UNAVAILABLE, {"ok": False, "backend": BACKEND, "error": ready_error})
            return
        with active_lock:
            if active_recordings and attempt_id not in active_recordings:
                self.write_json(HTTPStatus.CONFLICT, {"ok": False, "backend": BACKEND, "error": "camera recording already active"})
                return
        paths = attempt_paths(payload, str(capture_options["mediaExtension"]))
        paths["dir"].mkdir(parents=True, exist_ok=True)
        metadata = {
            "backend": BACKEND,
            "state": "recording",
            "startedAt": datetime.now(timezone.utc).isoformat(),
            "start": payload,
            "captureOptions": capture_options,
            "mediaPath": str(paths["media"]),
        }
        recording = {
            "attemptId": attempt_id,
            "captureId": payload.get("captureId"),
            "startedAt": metadata["startedAt"],
            "mediaPath": str(paths["media"]),
            "metadataPath": str(paths["metadata"]),
            "start": payload,
            "captureOptions": capture_options,
            "platformIngest": bool(payload.get("attemptId") and (payload.get("sessionId") or payload.get("venueSessionId"))),
        }
        if BACKEND == "command":
            if not camera_command_lock.acquire(blocking=False):
                event = camera_busy_response("video-start")
                metadata["startCommand"] = event
                metadata["state"] = "start-busy"
                write_json(paths["metadata"], metadata)
                self.write_json(HTTPStatus.CONFLICT, {"ok": False, "backend": BACKEND, "error": "camera command already running", "event": event})
                return
            try:
                event = run_camera_command("video-start", START_COMMAND, payload, recording, paths["media"], paths["metadata"])
                metadata["startCommand"] = event
                if not event.get("ok"):
                    metadata["state"] = "start-failed"
                    write_json(paths["metadata"], metadata)
                    self.write_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"ok": False, "backend": BACKEND, "error": "camera start command failed", "event": event})
                    return
            finally:
                camera_command_lock.release()
        write_json(paths["metadata"], metadata)
        with active_lock:
            active_recordings[attempt_id] = recording
        self.write_json(HTTPStatus.OK, {"ok": True, "backend": BACKEND, "recordingId": attempt_id, "mediaPath": str(paths["media"])})

    def handle_stop(self) -> None:
        payload = self.read_json()
        attempt_id = str(payload.get("attemptId") or payload.get("captureId") or "").strip()
        venue_id = str(payload.get("venueSessionId") or "").strip()
        with active_lock:
            recording = active_recordings.pop(attempt_id, None)
            was_skipped = attempt_id in skipped_recordings
            if was_skipped:
                skipped_recordings.discard(attempt_id)
        if not recording:
            if was_skipped:
                self.write_json(
                    HTTPStatus.OK,
                    {
                        "ok": True,
                        "backend": BACKEND,
                        "recordingId": attempt_id,
                        "recording": False,
                        "skipped": True,
                        "reason": "venue session recording handled this interval",
                        "venueSessionId": venue_id,
                    },
                )
                return
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
            if not camera_command_lock.acquire(blocking=False):
                command_event = camera_busy_response("video-stop")
            else:
                try:
                    command_event = run_camera_command("video-stop", STOP_COMMAND, payload, recording, media_path, metadata_path)
                finally:
                    camera_command_lock.release()
        metadata = {
            "backend": BACKEND,
            "state": "finished",
            "startedAt": recording["startedAt"],
            "stoppedAt": stopped_at,
            "start": recording["start"],
            "finish": payload,
            "captureOptions": recording.get("captureOptions") or video_capture_options(payload, recording),
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
        capture_options = video_capture_options(payload)
        paths = capture_paths(payload, "video", str(capture_options["mediaExtension"]))
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
            "captureOptions": capture_options,
            "platformIngest": False,
        }
        metadata = {
            "backend": BACKEND,
            "state": "recording",
            "type": "quick-video",
            "durationSeconds": duration_seconds,
            "startedAt": started_at,
            "payload": payload,
            "captureOptions": capture_options,
            "mediaPath": str(paths["media"]),
            "rcloneDest": RCLONE_DEST,
        }

        start_event = None
        stop_event = None
        lock_acquired = False
        if BACKEND == "command":
            if not camera_command_lock.acquire(blocking=False):
                start_event = camera_busy_response("quick-video-start")
                metadata["startCommand"] = start_event
                metadata["state"] = "start-busy"
                metadata["stoppedAt"] = datetime.now(timezone.utc).isoformat()
                write_json(paths["metadata"], metadata)
                self.write_json(HTTPStatus.CONFLICT, {"ok": False, "backend": BACKEND, "error": "camera command already running", "event": start_event})
                return
            lock_acquired = True
            start_event = run_camera_command("quick-video-start", START_COMMAND, payload, recording, paths["media"], paths["metadata"])
            metadata["startCommand"] = start_event
            if not start_event.get("ok"):
                metadata["state"] = "start-failed"
                metadata["stoppedAt"] = datetime.now(timezone.utc).isoformat()
                write_json(paths["metadata"], metadata)
                self.write_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"ok": False, "backend": BACKEND, "error": "camera start command failed", "event": start_event})
                camera_command_lock.release()
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
            if lock_acquired:
                camera_command_lock.release()
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
            if not camera_command_lock.acquire(blocking=False):
                command_event = camera_busy_response("photo")
            else:
                try:
                    command_event = run_camera_command("photo", PHOTO_COMMAND, payload, recording, paths["media"], paths["metadata"])
                finally:
                    camera_command_lock.release()
            metadata["photoCommand"] = command_event
            if not command_event.get("ok"):
                metadata["state"] = "photo-failed"
                write_json(paths["metadata"], metadata)
                status = HTTPStatus.CONFLICT if command_event.get("error") == "camera command already running" else HTTPStatus.INTERNAL_SERVER_ERROR
                self.write_json(status, {"ok": False, "backend": BACKEND, "error": "camera photo command failed", "event": command_event})
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
