#!/usr/bin/env python3
"""Canonical host status and camera-control boundary for a venue appliance."""

from __future__ import annotations

import hashlib
import hmac
import http.client
import json
import os
import socket
import stat
import subprocess
import tempfile
import threading
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib import error, parse, request

SCHEMA = "motion-levels-venue-snapshot-v1"
ENGINE_URL = os.environ.get("MOTION_LEVELS_SUPERVISOR_ENGINE_URL", "http://127.0.0.1:4102").rstrip("/")
CONTROLLER_URL = os.environ.get("MOTION_LEVELS_SUPERVISOR_CONTROLLER_URL", "http://127.0.0.1:4101").rstrip("/")
CAMERA_URL = os.environ.get("MOTION_LEVELS_CAMERA_RECORDER_URL", "http://127.0.0.1:8040").rstrip("/")
STACK_PATH = Path(os.environ.get("MOTION_LEVELS_STACK_PATH", "/etc/motion-levels/stack.json"))
CONTROLLER_ID_PATH = Path(
    os.environ.get(
        "MOTION_LEVELS_CONTROLLER_ID_FILE",
        "/var/lib/motion-levels/floor-controller/controller-id",
    )
)
TOKEN = os.environ.get("MOTION_LEVELS_SUPERVISOR_TOKEN", "").strip()
CAMERA_TOKEN_PATH = Path(os.environ.get("MOTION_LEVELS_CAMERA_RECORDER_TOKEN_FILE", "/etc/motion-levels/camera-recorder-token"))
PLATFORM_URL = os.environ.get("MOTION_LEVELS_PLATFORM_URL", "").strip().rstrip("/")
PLATFORM_TOKEN_PATH = Path(os.environ.get("MOTION_LEVELS_PLATFORM_TOKEN_FILE", "/etc/motion-levels/platform-token"))
PLATFORM_INTERVAL = max(2, float(os.environ.get("MOTION_LEVELS_PLATFORM_SYNC_INTERVAL", "5")))
ENGINE_TOKEN_PATH = Path(os.environ.get("MOTION_LEVELS_ENGINE_TOKEN_FILE", "/etc/motion-levels/engine-token"))
SESSION_SYNC_SCHEMA = "motion-levels-session-history-sync-v1"
SESSION_HISTORY_SCHEMA = "motion-levels-session-history-v1"
SESSION_SYNC_ENABLED = os.environ.get("MOTION_LEVELS_SESSION_SYNC_ENABLED", "1").strip().lower() not in {
    "0",
    "false",
    "no",
    "off",
}
SESSION_SYNC_INTERVAL = max(2.0, float(os.environ.get("MOTION_LEVELS_SESSION_SYNC_INTERVAL", "15")))
SESSION_SYNC_MAX_BACKOFF = max(
    SESSION_SYNC_INTERVAL,
    float(os.environ.get("MOTION_LEVELS_SESSION_SYNC_MAX_BACKOFF", "300")),
)
SESSION_SYNC_FULL_SWEEP_SECONDS = max(
    SESSION_SYNC_INTERVAL,
    float(os.environ.get("MOTION_LEVELS_SESSION_SYNC_FULL_SWEEP_SECONDS", "3600")),
)
SESSION_SYNC_RETRY_SECONDS = max(
    SESSION_SYNC_INTERVAL,
    float(os.environ.get("MOTION_LEVELS_SESSION_SYNC_RETRY_SECONDS", "300")),
)
SESSION_SYNC_PAGE_LIMIT = max(1, min(100, int(os.environ.get("MOTION_LEVELS_SESSION_SYNC_PAGE_LIMIT", "25"))))
SESSION_SYNC_RECENT_LIMIT = max(1, min(25, int(os.environ.get("MOTION_LEVELS_SESSION_SYNC_RECENT_LIMIT", "5"))))
SESSION_SYNC_EVENT_LIMIT = max(1, min(250, int(os.environ.get("MOTION_LEVELS_SESSION_SYNC_EVENT_LIMIT", "250"))))
SESSION_SYNC_MAX_ARTIFACT_BYTES = max(
    1,
    int(os.environ.get("MOTION_LEVELS_SESSION_SYNC_MAX_ARTIFACT_BYTES", "67108864")),
)
SESSION_SYNC_ARTIFACT_TIMEOUT = max(
    10.0,
    float(os.environ.get("MOTION_LEVELS_SESSION_SYNC_ARTIFACT_TIMEOUT", "120")),
)
SESSION_SYNC_STATE_PATH = Path(
    os.environ.get(
        "MOTION_LEVELS_SESSION_SYNC_STATE_PATH",
        "/var/lib/motion-levels/session-sync/state.json",
    )
)
SESSION_SYNC_TEMP_DIR = Path(
    os.environ.get(
        "MOTION_LEVELS_SESSION_SYNC_TEMP_DIR",
        str(SESSION_SYNC_STATE_PATH.parent / "artifacts"),
    )
)
SESSION_SYNC_STALE_TEMP_SECONDS = max(
    3_600.0,
    float(os.environ.get("MOTION_LEVELS_SESSION_SYNC_STALE_TEMP_SECONDS", "86400")),
)
SERVICES = tuple(
    value.strip()
    for value in os.environ.get(
        "MOTION_LEVELS_SUPERVISOR_SERVICES",
        "motion-levels-floor-controller.service,motion-levels-venue-runtime.service,"
        "motion-levels-kiosk.service,motion-levels-camera-helper.service,caddy.service",
    ).split(",")
    if value.strip()
)
SESSION_SYNC_OBSERVABILITY_LOCK = threading.Lock()
SESSION_SYNC_OBSERVABILITY: dict[str, Any] = {
    "lastAttemptAt": None,
    "lastSuccessAt": None,
    "consecutiveFailures": 0,
    "backoffSeconds": 0,
    "retryAt": None,
    "pendingVisitCount": 0,
    "visitsInBackoff": 0,
    "nextVisitRetryAt": None,
}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def read_secret(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8").strip()
    except OSError:
        return ""


def platform_token() -> str:
    return os.environ.get("MOTION_LEVELS_PLATFORM_TOKEN", "").strip() or read_secret(PLATFORM_TOKEN_PATH)


def engine_token() -> str:
    return (
        os.environ.get("MOTION_LEVELS_ENGINE_TOKEN", "").strip()
        or read_secret(ENGINE_TOKEN_PATH)
        or read_secret(CAMERA_TOKEN_PATH)
    )


def publish_session_sync_observability(**updates: Any) -> None:
    with SESSION_SYNC_OBSERVABILITY_LOCK:
        SESSION_SYNC_OBSERVABILITY.update(updates)


def session_sync_observability() -> dict[str, Any]:
    with SESSION_SYNC_OBSERVABILITY_LOCK:
        status = dict(SESSION_SYNC_OBSERVABILITY)
    pending = non_negative_integer(status.get("pendingVisitCount")) or 0
    visits_in_backoff = non_negative_integer(status.get("visitsInBackoff")) or 0
    consecutive = non_negative_integer(status.get("consecutiveFailures")) or 0
    backoff_seconds = max(0.0, float(status.get("backoffSeconds") or 0))
    return {
        "enabled": SESSION_SYNC_ENABLED,
        "configured": bool(PLATFORM_URL and platform_token() and engine_token()),
        "lastAttemptAt": optional_text(status.get("lastAttemptAt")),
        "lastSuccessAt": optional_text(status.get("lastSuccessAt")),
        "pendingVisitCount": pending,
        "failure": {
            "active": consecutive > 0 or pending > 0,
            "consecutiveAttempts": consecutive,
            "visitsInBackoff": visits_in_backoff,
            "backoffSeconds": backoff_seconds,
            "retryAt": optional_text(status.get("retryAt")),
            "nextVisitRetryAt": optional_text(status.get("nextVisitRetryAt")),
        },
    }


def read_json_file(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
        return value if isinstance(value, dict) else {}
    except (OSError, ValueError):
        return {}


def fetch_json(url: str, *, method: str = "GET", payload: dict[str, Any] | None = None, timeout: float = 3) -> dict[str, Any]:
    body = json.dumps(payload).encode() if payload is not None else None
    headers = {"accept": "application/json"}
    if body is not None:
        headers["content-type"] = "application/json"
    camera_token = read_secret(CAMERA_TOKEN_PATH)
    if camera_token and url.startswith(CAMERA_URL):
        headers["authorization"] = f"Bearer {camera_token}"
    history_token = engine_token()
    if history_token and url.startswith(f"{ENGINE_URL}/api/history/"):
        headers["x-motion-levels-engine-token"] = history_token
    response = request.urlopen(request.Request(url, data=body, headers=headers, method=method), timeout=timeout)
    raw = response.read(4 * 1024 * 1024)
    value = json.loads(raw or b"{}")
    return value if isinstance(value, dict) else {"value": value}


def probe(name: str, url: str) -> tuple[str, dict[str, Any]]:
    started = time.monotonic()
    try:
        payload = fetch_json(url)
        return name, {"ok": True, "latencyMillis": round((time.monotonic() - started) * 1000), "data": payload}
    except (OSError, ValueError, error.URLError) as exc:
        return name, {
            "ok": False,
            "latencyMillis": round((time.monotonic() - started) * 1000),
            "error": str(exc),
        }


def service_states() -> dict[str, str]:
    states: dict[str, str] = {}
    for service in SERVICES:
        result = subprocess.run(
            ["systemctl", "is-active", service],
            check=False,
            capture_output=True,
            text=True,
            timeout=2,
        )
        states[service.removesuffix(".service")] = (result.stdout.strip() or "unknown")
    return states


def display_connection() -> dict[str, Any]:
    """Report physical X output state without making HDMI a venue dependency."""
    environment = os.environ.copy()
    environment.setdefault("DISPLAY", ":0")
    try:
        result = subprocess.run(
            ["/usr/bin/xrandr", "--query"],
            check=False,
            capture_output=True,
            text=True,
            timeout=3,
            env=environment,
        )
    except (OSError, subprocess.SubprocessError) as exc:
        return {"available": False, "connected": None, "error": str(exc)}

    if result.returncode != 0:
        return {
            "available": False,
            "connected": None,
            "error": (result.stderr.strip() or f"xrandr exited {result.returncode}"),
        }

    outputs: list[dict[str, Any]] = []
    for line in result.stdout.splitlines():
        fields = line.split()
        if len(fields) < 2 or fields[1] not in {"connected", "disconnected"}:
            continue
        active_mode = next(
            (
                field.split("+", 1)[0]
                for field in fields[2:]
                if "+" in field and field.split("+", 1)[0].replace("x", "").isdigit()
            ),
            None,
        )
        outputs.append(
            {
                "name": fields[0],
                "connected": fields[1] == "connected",
                "activeMode": active_mode,
            }
        )
    connected = [output for output in outputs if output["connected"]]
    return {
        "available": True,
        "connected": bool(connected),
        "activeMode": next((output["activeMode"] for output in connected if output["activeMode"]), None),
        "outputs": outputs,
    }


def build_snapshot() -> dict[str, Any]:
    targets = {
        "engine": f"{ENGINE_URL}/api/status",
        "engineHealth": f"{ENGINE_URL}/api/health",
        "controller": f"{CONTROLLER_URL}/health",
        "camera": f"{CAMERA_URL}/status",
    }
    with ThreadPoolExecutor(max_workers=len(targets) + 2) as pool:
        probe_futures = [pool.submit(probe, name, url) for name, url in targets.items()]
        services_future = pool.submit(service_states)
        display_connection_future = pool.submit(display_connection)
        probes = dict(future.result() for future in probe_futures)
        services = services_future.result()
        physical_display = display_connection_future.result()

    engine = probes["engine"].get("data", {})
    camera = probes["camera"].get("data", {})
    engine_health = probes["engineHealth"].get("data", {})
    display = engine_health.get("displayClient", {}) if isinstance(engine_health, dict) else {}
    required_services_ok = all(value == "active" for value in services.values())
    overall_ok = required_services_ok and probes["engine"]["ok"] and probes["controller"]["ok"]
    return {
        "schema": SCHEMA,
        "generatedAt": utc_now(),
        "ok": overall_ok,
        "venue": {
            "hostname": socket.gethostname(),
            "release": read_json_file(STACK_PATH),
        },
        "services": services,
        "engine": probes["engine"],
        "engineHealth": probes["engineHealth"],
        "controller": probes["controller"],
        "display": display,
        "displayConnection": physical_display,
        "camera": probes["camera"],
        # Upload/backoff is operational telemetry, never a software or
        # physical activation gate. Local history remains durable offline.
        "sessionSync": session_sync_observability(),
        "summary": {
            "game": engine.get("currentGame") if isinstance(engine, dict) else None,
            "phase": engine.get("phase") if isinstance(engine, dict) else None,
            "displayHealthy": display.get("healthy") is True if isinstance(display, dict) else False,
            "displayConnected": physical_display.get("connected"),
            "cameraDetected": camera.get("readyToRecord") is True
            or (isinstance(camera.get("camera"), dict) and camera["camera"].get("detected") is True)
            or (isinstance(camera.get("cameraStatus"), dict) and camera["cameraStatus"].get("ok") is True),
        },
    }


def quick_record(payload: dict[str, Any]) -> dict[str, Any]:
    try:
        duration = int(payload.get("durationSeconds", 10))
    except (TypeError, ValueError):
        duration = 10
    duration = max(1, min(60, duration))
    return fetch_json(
        f"{CAMERA_URL}/recordings/quick",
        method="POST",
        payload={
            "source": "venue-operator-ui",
            "label": "venue-check",
            "captureId": f"venue-check-{uuid.uuid4()}",
            "durationSeconds": duration,
            "controllerHostname": socket.gethostname(),
        },
        timeout=duration + 300,
    )


def post_platform(path: str, payload: dict[str, Any]) -> dict[str, Any]:
    token = platform_token()
    if not PLATFORM_URL or not token:
        return {"ok": False, "skipped": "platform credentials unavailable"}
    body = json.dumps(payload).encode()
    response = request.urlopen(
        request.Request(
            f"{PLATFORM_URL}{path}",
            data=body,
            headers={
                "accept": "application/json",
                "authorization": f"Bearer {token}",
                "content-type": "application/json",
            },
            method="POST",
        ),
        timeout=10,
    )
    value = json.loads(response.read(1024 * 1024) or b"{}")
    return value if isinstance(value, dict) else {"ok": True}


def history_url(path: str, query: dict[str, Any] | None = None) -> str:
    suffix = path if path.startswith("/") else f"/{path}"
    url = f"{ENGINE_URL}/api/history/v1{suffix}"
    clean_query = {key: value for key, value in (query or {}).items() if value is not None and value != ""}
    return f"{url}?{parse.urlencode(clean_query)}" if clean_query else url


def list_history_sessions(*, status: str, limit: int, cursor: str | None = None) -> dict[str, Any]:
    payload = fetch_json(
        history_url("/sessions", {"status": status, "limit": limit, "cursor": cursor}),
        timeout=10,
    )
    require_history_schema(payload)
    if not isinstance(payload.get("sessions"), list):
        raise ValueError("session history list is missing sessions")
    return payload


def get_history_visit(visit_id: str) -> dict[str, Any]:
    payload = fetch_json(history_url(f"/sessions/{path_segment(visit_id)}"), timeout=10)
    require_history_schema(payload)
    visit = payload.get("session")
    if not isinstance(visit, dict) or visit.get("id") != visit_id:
        raise ValueError(f"session history returned the wrong visit for {visit_id}")
    return visit


def get_history_event_batch(
    visit_id: str,
    *,
    after_sequence: int,
    snapshot_last_sequence: int,
) -> list[dict[str, Any]]:
    """Read one bounded, snapshot-scoped journal page from the venue runtime."""
    if after_sequence < 0 or snapshot_last_sequence < after_sequence:
        raise ValueError(f"invalid event sequence bounds for {visit_id}")
    remaining = snapshot_last_sequence - after_sequence
    if remaining == 0:
        return []
    limit = min(SESSION_SYNC_EVENT_LIMIT, remaining)
    payload = fetch_json(
        history_url(
            f"/sessions/{path_segment(visit_id)}/events",
            {"limit": limit, "afterSequence": after_sequence},
        ),
        timeout=10,
    )
    require_history_schema(payload)
    if payload.get("sessionId") != visit_id or not isinstance(payload.get("events"), list):
        raise ValueError(f"session history returned invalid events for {visit_id}")
    page = payload["events"]
    if len(page) > limit or any(not isinstance(event, dict) for event in page):
        raise ValueError(f"session history returned an invalid event batch for {visit_id}")

    bounded: list[dict[str, Any]] = []
    expected_sequence = after_sequence + 1
    for event in page:
        sequence = strict_non_negative_integer(event.get("sequence"))
        if sequence is None:
            raise ValueError(f"session history returned an invalid event sequence for {visit_id}")
        if sequence > snapshot_last_sequence:
            # The journal advanced after the immutable snapshot was read. A
            # later sync will publish the new snapshot and these new events.
            break
        if sequence != expected_sequence:
            raise ValueError(
                f"session history event sequence is not contiguous for {visit_id}: "
                f"expected {expected_sequence}, got {sequence}"
            )
        bounded.append(event)
        expected_sequence += 1
    if not bounded:
        raise RuntimeError(
            f"session history did not return sequence {after_sequence + 1} for {visit_id}"
        )
    return bounded


def require_history_schema(payload: dict[str, Any]) -> None:
    if payload.get("schema") != SESSION_HISTORY_SCHEMA:
        raise ValueError(f"unsupported session history schema: {payload.get('schema')!r}")


def path_segment(value: Any) -> str:
    text = str(value or "").strip()
    if not text or len(text) > 255:
        raise ValueError("session history identifier is invalid")
    return parse.quote(text, safe="")


def replay_upload_candidate(recording: Any) -> bool:
    if not isinstance(recording, dict):
        return False
    candidate = (
        recording.get("backend") == "venue-runtime-replay"
        and recording.get("scope") == "run"
        and recording.get("status") in {"pending_upload", "partial"}
        and isinstance(recording.get("localPath"), str)
        and not recording.get("remoteUrl")
    )
    if not candidate:
        return False
    run_id = optional_text(recording.get("runId"))
    asset_id = optional_text(recording.get("id"))
    # The unsegmented asset remains readable through the legacy engine route,
    # but new cloud delivery is exclusively the bounded multipart contract.
    return not run_id or asset_id != f"run-replay-{run_id}"


def replay_part_metadata(recording: dict[str, Any]) -> tuple[dict[str, Any], int]:
    run_id = required_text(recording.get("runId"), "replay run id")
    asset_id = required_text(recording.get("id"), "replay asset id")
    metadata = recording.get("metadata")
    if not isinstance(metadata, dict):
        raise ValueError(f"replay metadata is unavailable for asset {asset_id}")
    part_index = strict_non_negative_integer(metadata.get("partIndex"))
    if part_index is None or part_index > 999_999:
        raise ValueError(f"replay partIndex is invalid for asset {asset_id}")
    run_digest = hashlib.sha256(run_id.encode("utf-8")).hexdigest()
    expected_asset_id = f"run-replay-{run_digest}-part-{part_index:06d}"
    if asset_id != expected_asset_id:
        raise ValueError(f"replay asset id does not match run id and partIndex: {asset_id}")
    expected_file_name = f"{asset_id}.mlrun.jsonl.gz"
    if recording.get("fileName") != expected_file_name:
        raise ValueError(f"replay fileName does not match asset id: {asset_id}")
    if recording.get("localPath") != f"replays/{expected_file_name}":
        raise ValueError(f"replay localPath does not match asset id: {asset_id}")
    if recording.get("contentType") != "application/vnd.motion-levels.run-replay+jsonl":
        raise ValueError(f"replay contentType is invalid for asset {asset_id}")
    if metadata.get("schema") != "motion-levels-run-replay-v1":
        raise ValueError(f"replay metadata schema is invalid for asset {asset_id}")
    if strict_non_negative_integer(metadata.get("contractVersion")) != 1:
        raise ValueError(f"replay contractVersion is invalid for asset {asset_id}")
    if metadata.get("compression") != "gzip":
        raise ValueError(f"replay compression is invalid for asset {asset_id}")
    if strict_non_negative_integer(metadata.get("runFrameOffset")) is None:
        raise ValueError(f"replay runFrameOffset is invalid for asset {asset_id}")
    is_final_part = metadata.get("isFinalPart")
    if not isinstance(is_final_part, bool):
        raise ValueError(f"replay isFinalPart is invalid for asset {asset_id}")
    partial = metadata.get("partial")
    if not isinstance(partial, bool):
        raise ValueError(f"replay partial flag is invalid for asset {asset_id}")
    if is_final_part:
        part_count = strict_positive_integer(metadata.get("partCount"))
        if part_count != part_index + 1:
            raise ValueError(f"replay final partCount is invalid for asset {asset_id}")
    elif "partCount" in metadata:
        raise ValueError(f"replay non-final part declares partCount: {asset_id}")
    if not is_final_part and partial:
        raise ValueError(f"replay non-final part cannot be partial: {asset_id}")
    if (recording.get("status") == "partial") != partial:
        raise ValueError(f"replay status and partial metadata disagree for asset {asset_id}")
    return metadata, part_index


def ordered_replay_candidates(visit: dict[str, Any]) -> list[dict[str, Any]]:
    recordings = visit.get("recordings")
    candidates = [
        recording
        for recording in (recordings if isinstance(recordings, list) else [])
        if replay_upload_candidate(recording)
    ]

    def sort_key(recording: dict[str, Any]) -> tuple[str, int, str]:
        metadata = recording.get("metadata") if isinstance(recording.get("metadata"), dict) else {}
        part_index = strict_non_negative_integer(metadata.get("partIndex"))
        return (
            str(recording.get("runId") or ""),
            part_index if part_index is not None else 1_000_000,
            str(recording.get("id") or ""),
        )

    return sorted(candidates, key=sort_key)


def replay_init_payload(visit: dict[str, Any], recording: dict[str, Any]) -> dict[str, Any]:
    visit_id = required_text(visit.get("id"), "visit id")
    selection_id = required_text(recording.get("selectionId"), "replay selection id")
    run_id = required_text(recording.get("runId"), "replay run id")
    asset_id = required_text(recording.get("id"), "replay asset id")
    metadata, _part_index = replay_part_metadata(recording)
    sha256 = required_sha256(recording.get("sha256"))
    byte_size = required_positive_integer(recording.get("byteSize"), "replay byteSize")
    file_name = required_text(recording.get("fileName"), "replay fileName")
    content_type = required_text(recording.get("contentType"), "replay contentType")
    encoded_metadata = json.dumps(metadata, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    if len(encoded_metadata) > 65_536:
        raise ValueError(f"replay metadata is too large for asset {asset_id}")
    controller_id = str(visit.get("controllerId") or read_secret(CONTROLLER_ID_PATH)).strip()
    if not controller_id:
        raise ValueError(f"controller id is unavailable for replay {asset_id}")
    payload: dict[str, Any] = {
        "artifactKind": "gameplay_replay",
        "controllerId": controller_id,
        "controllerLabel": os.environ.get("MOTION_LEVELS_CONTROLLER_LABEL", "").strip() or socket.gethostname(),
        "controllerHostname": os.environ.get("MOTION_LEVELS_CONTROLLER_HOSTNAME", "").strip() or socket.gethostname(),
        "visitId": visit_id,
        "selectionId": selection_id,
        "runId": run_id,
        "assetId": asset_id,
        "fileName": file_name,
        "contentType": content_type,
        "compression": str(metadata.get("compression") or "gzip"),
        "byteSize": byte_size,
        "sha256": sha256,
        "artifactStatus": required_text(recording.get("status"), "replay artifact status"),
        "metadata": metadata,
        "startedAt": iso_from_unix_millis(recording.get("startedAtUnixMillis")),
        "endedAt": iso_from_unix_millis(recording.get("endedAtUnixMillis")),
        "frameCount": metadata_bigint(metadata, "frameCount"),
        "firstSequence": metadata_bigint(metadata, "firstPresentationSequence"),
        "lastSequence": metadata_bigint(metadata, "lastPresentationSequence"),
    }
    capture_id = optional_text(recording.get("captureId"))
    if capture_id:
        payload["captureId"] = capture_id
    return {key: value for key, value in payload.items() if value is not None and value != ""}


def download_replay_artifact(visit_id: str, recording: dict[str, Any]) -> Path:
    token = engine_token()
    if not token:
        raise RuntimeError("engine token is unavailable for replay download")
    run_id = required_text(recording.get("runId"), "replay run id")
    asset_id = required_text(recording.get("id"), "replay asset id")
    replay_part_metadata(recording)
    expected_size = required_positive_integer(recording.get("byteSize"), "replay byteSize")
    expected_sha256 = required_sha256(recording.get("sha256"))
    if expected_size > SESSION_SYNC_MAX_ARTIFACT_BYTES:
        raise ValueError(f"replay artifact exceeds the local upload limit: {expected_size}")

    temporary_root = session_sync_temp_dir()
    temporary_root.mkdir(parents=True, exist_ok=True, mode=0o750)
    file_descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".replay-upload-{safe_file_part(asset_id)}-",
        suffix=".mlrun.jsonl.gz",
        dir=temporary_root,
    )
    temporary = Path(temporary_name)
    digest = hashlib.sha256()
    downloaded = 0
    replay_url = history_url(
        f"/sessions/{path_segment(visit_id)}/runs/{path_segment(run_id)}"
        f"/replay/{path_segment(asset_id)}"
    )
    try:
        replay_request = request.Request(
            replay_url,
            headers={"accept": required_text(recording.get("contentType"), "replay contentType"), "x-motion-levels-engine-token": token},
            method="GET",
        )
        with os.fdopen(file_descriptor, "wb") as output, request.urlopen(
            replay_request,
            timeout=SESSION_SYNC_ARTIFACT_TIMEOUT,
        ) as response:
            content_length = response.headers.get("content-length")
            if content_length and int(content_length) != expected_size:
                raise RuntimeError(
                    f"replay download size changed: expected {expected_size}, got {content_length}"
                )
            while True:
                chunk = response.read(1024 * 1024)
                if not chunk:
                    break
                downloaded += len(chunk)
                if downloaded > SESSION_SYNC_MAX_ARTIFACT_BYTES:
                    raise RuntimeError("replay download exceeded the local upload limit")
                digest.update(chunk)
                output.write(chunk)
            output.flush()
            os.fsync(output.fileno())
        if downloaded != expected_size:
            raise RuntimeError(f"replay download size mismatch: expected {expected_size}, got {downloaded}")
        actual_sha256 = digest.hexdigest()
        if actual_sha256 != expected_sha256:
            raise RuntimeError(
                f"replay download sha256 mismatch: expected {expected_sha256}, got {actual_sha256}"
            )
        return temporary
    except BaseException:
        temporary.unlink(missing_ok=True)
        raise


def put_artifact(upload_url: str, path: Path, content_type: str, sha256: str) -> None:
    target = parse.urlsplit(upload_url)
    if target.scheme not in {"http", "https"} or not target.hostname:
        raise ValueError("platform returned an invalid replay upload URL")
    connection_type = http.client.HTTPSConnection if target.scheme == "https" else http.client.HTTPConnection
    connection = connection_type(target.hostname, target.port, timeout=SESSION_SYNC_ARTIFACT_TIMEOUT)
    request_target = target.path or "/"
    if target.query:
        request_target += f"?{target.query}"
    try:
        connection.putrequest("PUT", request_target, skip_accept_encoding=True)
        connection.putheader("content-type", content_type)
        connection.putheader("content-length", str(path.stat().st_size))
        connection.putheader("x-amz-meta-sha256", sha256)
        connection.putheader("user-agent", "motion-levels-venue-session-sync/1")
        connection.endheaders()
        with path.open("rb") as source:
            while chunk := source.read(1024 * 1024):
                connection.send(chunk)
        response = connection.getresponse()
        detail = response.read(64 * 1024).decode("utf-8", errors="replace")
        if response.status < 200 or response.status >= 300:
            raise RuntimeError(f"replay upload failed with HTTP {response.status}: {detail[:1000]}")
    finally:
        connection.close()


def update_engine_recording(visit_id: str, recording: dict[str, Any]) -> dict[str, Any]:
    return fetch_json(
        history_url(f"/sessions/{path_segment(visit_id)}/recordings"),
        method="POST",
        payload=recording,
        timeout=10,
    )


def upload_replay_artifact(visit: dict[str, Any], recording: dict[str, Any]) -> bool:
    if not replay_upload_candidate(recording):
        return False
    visit_id = required_text(visit.get("id"), "visit id")
    init_payload = replay_init_payload(visit, recording)
    artifact_path = download_replay_artifact(visit_id, recording)
    try:
        initialized = post_platform("/api/recording-uploads/init", init_payload)
        if initialized.get("ok") is False:
            raise RuntimeError(str(initialized.get("error") or "platform rejected replay upload init"))
        upload_id = required_text(initialized.get("uploadId"), "platform replay upload id")
        upload_url = optional_text(initialized.get("uploadUrl"))
        if upload_url:
            put_artifact(
                upload_url,
                artifact_path,
                required_text(recording.get("contentType"), "replay contentType"),
                required_sha256(recording.get("sha256")),
            )
        elif initialized.get("alreadyComplete") is not True:
            raise RuntimeError("platform replay upload init did not return uploadUrl")

        complete_payload = {
            "uploadId": upload_id,
            "byteSize": required_positive_integer(recording.get("byteSize"), "replay byteSize"),
            "sha256": required_sha256(recording.get("sha256")),
            "startedAt": iso_from_unix_millis(recording.get("startedAtUnixMillis")),
            "endedAt": iso_from_unix_millis(recording.get("endedAtUnixMillis")),
        }
        metadata = recording.get("metadata") if isinstance(recording.get("metadata"), dict) else {}
        for source_key, target_key in (
            ("frameCount", "frameCount"),
            ("firstPresentationSequence", "firstSequence"),
            ("lastPresentationSequence", "lastSequence"),
        ):
            value = metadata_bigint(metadata, source_key)
            if value is not None:
                complete_payload[target_key] = value
        completed = post_platform(
            "/api/recording-uploads/complete",
            {key: value for key, value in complete_payload.items() if value is not None},
        )
        if completed.get("ok") is False:
            raise RuntimeError(str(completed.get("error") or "platform rejected replay upload completion"))

        recording_row = completed.get("recording") if isinstance(completed.get("recording"), dict) else {}
        download_url = (
            optional_text(completed.get("downloadUrl"))
            or optional_text(recording_row.get("downloadUrl"))
            or optional_text(recording_row.get("download_url"))
            or f"{PLATFORM_URL}/api/recording-objects/{parse.quote(upload_id, safe='')}/download"
        )
        platform_metadata = {
            "schema": "motion-levels-replay-upload-v1",
            "uploadId": upload_id,
            "bucket": initialized.get("bucket"),
            "objectKey": initialized.get("objectKey"),
            "uploadedAt": utc_now(),
        }
        updated = dict(recording)
        updated["status"] = "complete"
        updated["remoteUrl"] = download_url
        updated["downloadUrl"] = download_url
        updated["metadata"] = {**metadata, "platformUpload": platform_metadata}
        response = update_engine_recording(visit_id, updated)
        require_history_schema(response)
        persisted = response.get("recording")
        if not isinstance(persisted, dict) or persisted.get("id") != updated["id"] or persisted.get("status") != "complete":
            raise RuntimeError("venue runtime did not confirm the completed replay asset")
        return True
    finally:
        artifact_path.unlink(missing_ok=True)


def post_canonical_visit(visit: dict[str, Any], events: list[dict[str, Any]]) -> dict[str, Any]:
    visit_id = required_text(visit.get("id"), "visit id")
    controller_id = str(visit.get("controllerId") or read_secret(CONTROLLER_ID_PATH)).strip()
    if not controller_id:
        raise ValueError(f"controller id is unavailable for visit {visit_id}")
    result = post_platform(
        "/api/ingest/session-history/v1",
        {
            "schema": SESSION_SYNC_SCHEMA,
            "controllerId": controller_id,
            "controllerLabel": os.environ.get("MOTION_LEVELS_CONTROLLER_LABEL", "").strip() or socket.gethostname(),
            "controllerHostname": os.environ.get("MOTION_LEVELS_CONTROLLER_HOSTNAME", "").strip() or socket.gethostname(),
            "visit": visit,
            "events": events,
            "sentAt": utc_now(),
        },
    )
    if result.get("ok") is False:
        raise RuntimeError(str(result.get("error") or f"platform rejected canonical visit {visit_id}"))
    return result


def platform_event_high_water(result: dict[str, Any], visit_id: str) -> int:
    sequence = strict_non_negative_integer(result.get("lastStoredEventSequence"))
    if sequence is None or sequence > 9_007_199_254_740_991:
        raise ValueError(f"platform returned an invalid event high-water mark for {visit_id}")
    return sequence


def sync_visit_snapshot_events(visit: dict[str, Any]) -> int:
    """Publish one immutable snapshot, then stream only its missing events."""
    visit_id = required_text(visit.get("id"), "visit id")
    snapshot_last_sequence = strict_non_negative_integer(visit.get("lastSequence"))
    if snapshot_last_sequence is None:
        raise ValueError(f"session history snapshot is missing lastSequence for {visit_id}")

    result = post_canonical_visit(visit, [])
    after_sequence = platform_event_high_water(result, visit_id)
    while after_sequence < snapshot_last_sequence:
        events = get_history_event_batch(
            visit_id,
            after_sequence=after_sequence,
            snapshot_last_sequence=snapshot_last_sequence,
        )
        last_sent_sequence = strict_non_negative_integer(events[-1].get("sequence"))
        if last_sent_sequence is None:
            raise ValueError(f"session history returned an invalid final event for {visit_id}")
        result = post_canonical_visit(visit, events)
        next_sequence = platform_event_high_water(result, visit_id)
        if next_sequence <= after_sequence or next_sequence < last_sent_sequence:
            raise RuntimeError(f"platform event high-water mark did not advance for {visit_id}")
        after_sequence = next_sequence
    return after_sequence


def sync_history_visit(visit_id: str) -> dict[str, Any]:
    # Freeze the manifest first. Events appended after this read are excluded
    # by its lastSequence and will be delivered with the next snapshot.
    visit = get_history_visit(visit_id)
    sync_visit_snapshot_events(visit)

    needs_artifact_retry = False
    uploaded = False
    for recording in ordered_replay_candidates(visit):
        try:
            uploaded = upload_replay_artifact(visit, recording) or uploaded
        except (OSError, TypeError, ValueError, RuntimeError, error.URLError, http.client.HTTPException) as exc:
            needs_artifact_retry = True
            print(
                f"canonical replay upload failed visit={visit_id} asset={recording.get('id')} error={exc}",
                flush=True,
            )

    if uploaded:
        visit = get_history_visit(visit_id)
        sync_visit_snapshot_events(visit)
    if needs_artifact_retry:
        raise RuntimeError(f"one or more replay artifacts remain queued for visit {visit_id}")
    return {
        "updatedAtUnixMillis": non_negative_integer(visit.get("updatedAtUnixMillis")) or 0,
        "lastSequence": non_negative_integer(visit.get("lastSequence")) or 0,
        "needsArtifactRetry": needs_artifact_retry,
    }


def iso_from_unix_millis(value: Any) -> str | None:
    millis = non_negative_integer(value)
    if millis is None:
        return None
    return datetime.fromtimestamp(millis / 1000, timezone.utc).isoformat().replace("+00:00", "Z")


def required_text(value: Any, label: str) -> str:
    text = optional_text(value)
    if not text:
        raise ValueError(f"{label} is required")
    return text


def optional_text(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    text = value.strip()
    return text or None


def non_negative_integer(value: Any) -> int | None:
    if isinstance(value, bool):
        return None
    try:
        number = int(value)
    except (TypeError, ValueError):
        return None
    return number if number >= 0 else None


def strict_non_negative_integer(value: Any) -> int | None:
    if isinstance(value, bool) or not isinstance(value, int) or value < 0:
        return None
    return value


def strict_positive_integer(value: Any) -> int | None:
    number = strict_non_negative_integer(value)
    return number if number is not None and number > 0 else None


def required_positive_integer(value: Any, label: str) -> int:
    number = non_negative_integer(value)
    if number is None or number <= 0:
        raise ValueError(f"{label} must be a positive integer")
    return number


def required_sha256(value: Any) -> str:
    text = optional_text(value)
    if not text or len(text) != 64 or any(character not in "0123456789abcdefABCDEF" for character in text):
        raise ValueError("replay sha256 is invalid")
    return text.lower()


def metadata_bigint(metadata: dict[str, Any], key: str) -> str | None:
    value = metadata.get(key)
    if isinstance(value, bool):
        return None
    if isinstance(value, int) and value >= 0:
        return str(value)
    if isinstance(value, str) and value.isdigit():
        return value.lstrip("0") or "0"
    return None


def safe_file_part(value: str) -> str:
    return "".join(character if character.isalnum() or character in "-_." else "-" for character in value)[:120] or "replay"


def session_sync_temp_dir() -> Path:
    state_root = SESSION_SYNC_STATE_PATH.parent.resolve(strict=False)
    temporary_root = SESSION_SYNC_TEMP_DIR.resolve(strict=False)
    if temporary_root == state_root or state_root not in temporary_root.parents:
        raise ValueError("session sync temp directory must be below the dedicated sync state directory")
    return temporary_root


def cleanup_stale_replay_temps(now: float | None = None) -> int:
    """Remove only uploader-owned regular files after a conservative age."""
    try:
        temporary_root = session_sync_temp_dir()
        temporary_root.mkdir(parents=True, exist_ok=True, mode=0o750)
        entries = list(temporary_root.iterdir())
    except (OSError, ValueError):
        return 0
    cutoff = (time.time() if now is None else now) - SESSION_SYNC_STALE_TEMP_SECONDS
    removed = 0
    for path in entries:
        if not path.name.startswith(".replay-upload-") or not path.name.endswith(".mlrun.jsonl.gz"):
            continue
        try:
            metadata = path.lstat()
            if not stat.S_ISREG(metadata.st_mode) or metadata.st_mtime > cutoff:
                continue
            path.unlink()
            removed += 1
        except FileNotFoundError:
            continue
        except OSError as exc:
            print(f"stale replay temp cleanup failed path={path.name} error={exc}", flush=True)
    return removed


def iso_from_unix(value: Any) -> str | None:
    try:
        seconds = float(value)
    except (TypeError, ValueError):
        return None
    if seconds <= 0:
        return None
    return datetime.fromtimestamp(seconds, timezone.utc).isoformat().replace("+00:00", "Z")


def session_payload(status: dict[str, Any], *, ended: bool = False) -> dict[str, Any]:
    phase = str(status.get("phase") or status.get("lifecycle") or "unknown")
    payload = {
        "sessionId": status.get("sessionId"),
        "venueSessionId": status.get("venueSessionId") or None,
        "controllerId": read_secret(CONTROLLER_ID_PATH) or None,
        "controllerLabel": os.environ.get("MOTION_LEVELS_CONTROLLER_LABEL", "").strip() or socket.gethostname(),
        "controllerHostname": os.environ.get("MOTION_LEVELS_CONTROLLER_HOSTNAME", "").strip() or socket.gethostname(),
        "game": status.get("currentGame") or "unknown",
        "label": status.get("label") or status.get("currentGame") or "Juego",
        "phase": "ended" if ended else phase,
        "status": "ended" if ended else "active",
        "teamName": status.get("teamName") or None,
        "startedAt": iso_from_unix(status.get("sessionStartedUnix") or status.get("startedUnix")),
        "endedAt": utc_now() if ended else None,
        "playerCount": status.get("playerCount") or 0,
        "score": status.get("score") or 0,
        "lives": status.get("lives") if status.get("lives") is not None else -1,
        "activeTargets": status.get("activeTargets") or 0,
        "lastEventMessage": status.get("lastEventMessage") or None,
        "players": status.get("players") if isinstance(status.get("players"), list) else [],
    }
    return {key: value for key, value in payload.items() if value is not None}


def venue_payload(status: dict[str, Any], *, ended: bool = False) -> dict[str, Any]:
    players = status.get("players") if isinstance(status.get("players"), list) else []
    return {
        "venueSessionId": status.get("venueSessionId"),
        "controllerId": read_secret(CONTROLLER_ID_PATH) or None,
        "teamName": status.get("teamName") or None,
        "playerLabels": [str(player.get("label") or "") for player in players if isinstance(player, dict)],
        "players": [
            {"index": player.get("index"), "label": player.get("label"), "color": player.get("color")}
            for player in players
            if isinstance(player, dict)
        ],
        "status": "ended" if ended else "active",
        "endReason": "runtime_session_ended" if ended else None,
        "startedAt": iso_from_unix(status.get("sessionStartedUnix") or status.get("startedUnix")),
        "endedAt": utc_now() if ended else None,
    }


def ambient_game(value: Any) -> bool:
    game = str(value or "").lower()
    return game in {"loop", "animations", "salvapantallas", "ambient-comet", "ambient-pulse", "ambient-spark"} or game.startswith("animation-")


def default_session_sync_state() -> dict[str, Any]:
    return {
        "schema": "motion-levels-session-sync-state-v1",
        "endedSweepCursor": None,
        "endedSweepAfterUnixMillis": 0,
        "failures": {},
        "pendingVisitIds": [],
        "sessions": {},
    }


def load_session_sync_state() -> dict[str, Any]:
    candidate = read_json_file(SESSION_SYNC_STATE_PATH)
    if candidate.get("schema") != "motion-levels-session-sync-state-v1":
        return default_session_sync_state()
    sessions = candidate.get("sessions")
    failures = candidate.get("failures")
    pending = candidate.get("pendingVisitIds")
    return {
        "schema": "motion-levels-session-sync-state-v1",
        "endedSweepCursor": optional_text(candidate.get("endedSweepCursor")),
        "endedSweepAfterUnixMillis": non_negative_integer(candidate.get("endedSweepAfterUnixMillis")) or 0,
        "failures": failures if isinstance(failures, dict) else {},
        "pendingVisitIds": [
            value for value in (pending if isinstance(pending, list) else [])
            if isinstance(value, str) and value.strip()
        ][:100],
        "sessions": sessions if isinstance(sessions, dict) else {},
    }


def save_session_sync_state(state: dict[str, Any]) -> None:
    parent = SESSION_SYNC_STATE_PATH.parent
    parent.mkdir(parents=True, exist_ok=True, mode=0o750)
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".{SESSION_SYNC_STATE_PATH.name}.",
        suffix=".tmp",
        dir=parent,
    )
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as output:
            json.dump(state, output, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
            output.write("\n")
            output.flush()
            os.fsync(output.fileno())
        os.replace(temporary, SESSION_SYNC_STATE_PATH)
        directory_descriptor = os.open(parent, os.O_RDONLY | getattr(os, "O_DIRECTORY", 0))
        try:
            os.fsync(directory_descriptor)
        finally:
            os.close(directory_descriptor)
    except BaseException:
        temporary.unlink(missing_ok=True)
        raise


class CanonicalSessionSync:
    """Push durable runtime history and run replays to Platform.

    Local cursors only reduce work. Every Platform write remains idempotent and
    periodic full sweeps resend the complete visit and event history, so
    deleting this local state cannot lose a session.
    """

    def __init__(self) -> None:
        self.state = load_session_sync_state()
        self.last_error_at = 0.0
        self.last_temp_cleanup_at = 0.0
        self._publish_state()

    def once(self) -> None:
        publish_session_sync_observability(lastAttemptAt=utc_now())
        if not PLATFORM_URL or not platform_token():
            raise RuntimeError("platform credentials are unavailable for canonical session sync")
        if not engine_token():
            raise RuntimeError("engine token is unavailable for canonical session sync")

        now = time.time()
        if now - self.last_temp_cleanup_at >= 3_600:
            cleanup_stale_replay_temps(now)
            self.last_temp_cleanup_at = now

        attempted: set[str] = set()
        for visit_id in list(self.state.get("pendingVisitIds", [])):
            self._attempt(visit_id, attempted)

        self._sync_active(attempted)
        self._sync_recent_ended(attempted)
        self._advance_ended_sweep(attempted)
        self._prune_state()
        save_session_sync_state(self.state)
        self._publish_state(
            lastSuccessAt=utc_now(),
            consecutiveFailures=0,
            backoffSeconds=0,
            retryAt=None,
        )

    def _sync_active(self, attempted: set[str]) -> None:
        cursor: str | None = None
        observed_cursors: set[str] = set()
        while True:
            page = list_history_sessions(status="active", limit=SESSION_SYNC_PAGE_LIMIT, cursor=cursor)
            for summary in page["sessions"]:
                visit_id = summary_visit_id(summary)
                self._attempt(visit_id, attempted)
            next_cursor = page.get("nextCursor")
            if next_cursor is None:
                return
            if not isinstance(next_cursor, str) or not next_cursor or next_cursor in observed_cursors:
                raise ValueError("session history returned an invalid active-session cursor")
            observed_cursors.add(next_cursor)
            cursor = next_cursor

    def _sync_recent_ended(self, attempted: set[str]) -> None:
        page = list_history_sessions(status="ended", limit=SESSION_SYNC_RECENT_LIMIT)
        now_millis = int(time.time() * 1000)
        sessions = self.state.setdefault("sessions", {})
        for summary in page["sessions"]:
            visit_id = summary_visit_id(summary)
            saved = sessions.get(visit_id) if isinstance(sessions.get(visit_id), dict) else {}
            updated_at = non_negative_integer(summary.get("updatedAtUnixMillis")) or 0
            saved_updated_at = non_negative_integer(saved.get("updatedAtUnixMillis")) or 0
            last_synced_at = non_negative_integer(saved.get("lastSyncedAtUnixMillis")) or 0
            due = (
                updated_at > saved_updated_at
                or saved.get("needsArtifactRetry") is True
                or now_millis - last_synced_at >= int(SESSION_SYNC_RETRY_SECONDS * 1000)
            )
            if due:
                self._attempt(visit_id, attempted)

    def _advance_ended_sweep(self, attempted: set[str]) -> None:
        now_millis = int(time.time() * 1000)
        cursor = optional_text(self.state.get("endedSweepCursor"))
        sweep_after = non_negative_integer(self.state.get("endedSweepAfterUnixMillis")) or 0
        if not cursor and now_millis < sweep_after:
            return
        try:
            page = list_history_sessions(status="ended", limit=SESSION_SYNC_PAGE_LIMIT, cursor=cursor)
        except error.HTTPError as exc:
            if not cursor or exc.code not in {400, 404}:
                raise
            # A removed local visit can invalidate an opaque cursor. Starting
            # the idempotent sweep again is safer than stranding the backlog.
            cursor = None
            self.state["endedSweepCursor"] = None
            page = list_history_sessions(status="ended", limit=SESSION_SYNC_PAGE_LIMIT)
        for summary in page["sessions"]:
            self._attempt(summary_visit_id(summary), attempted)
        next_cursor = page.get("nextCursor")
        if next_cursor is not None and (not isinstance(next_cursor, str) or not next_cursor):
            raise ValueError("session history returned an invalid ended-session cursor")
        self.state["endedSweepCursor"] = next_cursor
        if next_cursor is None:
            self.state["endedSweepAfterUnixMillis"] = now_millis + int(SESSION_SYNC_FULL_SWEEP_SECONDS * 1000)

    def _attempt(self, visit_id: str, attempted: set[str]) -> bool:
        if visit_id in attempted:
            return visit_id not in self.state.get("pendingVisitIds", [])
        attempted.add(visit_id)
        failures = self.state.setdefault("failures", {})
        failure = failures.get(visit_id) if isinstance(failures.get(visit_id), dict) else {}
        retry_at = non_negative_integer(failure.get("retryAtUnixMillis")) or 0
        if int(time.time() * 1000) < retry_at:
            return False
        try:
            result = sync_history_visit(visit_id)
        except (OSError, TypeError, ValueError, RuntimeError, error.URLError, http.client.HTTPException) as exc:
            pending = self.state.setdefault("pendingVisitIds", [])
            if visit_id not in pending:
                pending.append(visit_id)
                del pending[: max(0, len(pending) - 100)]
            failure_count = (non_negative_integer(failure.get("count")) or 0) + 1
            retry_seconds = min(
                SESSION_SYNC_MAX_BACKOFF,
                SESSION_SYNC_INTERVAL * (2 ** min(failure_count - 1, 8)),
            )
            failures[visit_id] = {
                "count": failure_count,
                "retryAtUnixMillis": int(time.time() * 1000 + retry_seconds * 1000),
            }
            now = time.monotonic()
            if now - self.last_error_at >= 60:
                print(f"canonical session sync failed visit={visit_id} error={exc}", flush=True)
                self.last_error_at = now
            self._publish_state()
            return False

        pending = self.state.setdefault("pendingVisitIds", [])
        self.state["pendingVisitIds"] = [candidate for candidate in pending if candidate != visit_id]
        failures.pop(visit_id, None)
        self.state.setdefault("sessions", {})[visit_id] = {
            **result,
            "lastSyncedAtUnixMillis": int(time.time() * 1000),
        }
        self._publish_state()
        return True

    def _prune_state(self) -> None:
        pending = set(self.state.get("pendingVisitIds", []))
        failures = self.state.get("failures")
        if isinstance(failures, dict):
            self.state["failures"] = {visit_id: value for visit_id, value in failures.items() if visit_id in pending}
        sessions = self.state.get("sessions")
        if not isinstance(sessions, dict) or len(sessions) <= 5000:
            return
        ordered = sorted(
            sessions.items(),
            key=lambda item: non_negative_integer(item[1].get("lastSyncedAtUnixMillis")) or 0
            if isinstance(item[1], dict) else 0,
            reverse=True,
        )
        self.state["sessions"] = dict(ordered[:5000])

    def _publish_state(self, **updates: Any) -> None:
        pending = self.state.get("pendingVisitIds")
        failures = self.state.get("failures")
        now_millis = int(time.time() * 1000)
        retry_times = [
            retry_at
            for value in (failures.values() if isinstance(failures, dict) else [])
            if isinstance(value, dict)
            if (retry_at := non_negative_integer(value.get("retryAtUnixMillis"))) is not None
            if retry_at > now_millis
        ]
        publish_session_sync_observability(
            pendingVisitCount=len(pending) if isinstance(pending, list) else 0,
            visitsInBackoff=len(retry_times),
            nextVisitRetryAt=iso_from_unix_millis(min(retry_times)) if retry_times else None,
            **updates,
        )

    def run(self) -> None:
        failures = 0
        while True:
            try:
                self.once()
                failures = 0
                delay = SESSION_SYNC_INTERVAL
            except (OSError, TypeError, ValueError, RuntimeError, error.URLError, http.client.HTTPException) as exc:
                failures += 1
                delay = min(SESSION_SYNC_MAX_BACKOFF, SESSION_SYNC_INTERVAL * (2 ** min(failures - 1, 8)))
                self._publish_state(
                    consecutiveFailures=failures,
                    backoffSeconds=delay,
                    retryAt=iso_from_unix_millis(int((time.time() + delay) * 1000)),
                )
                now = time.monotonic()
                if now - self.last_error_at >= 60:
                    print(f"canonical session sync unavailable; retrying in {delay:g}s: {exc}", flush=True)
                    self.last_error_at = now
            time.sleep(delay)


def summary_visit_id(summary: Any) -> str:
    if not isinstance(summary, dict):
        raise ValueError("session history returned a non-object summary")
    return required_text(summary.get("id"), "session summary id")


class PlatformHeartbeat:
    def __init__(self) -> None:
        self.last_session: dict[str, Any] | None = None
        self.last_venue: dict[str, Any] | None = None
        self.last_error_at = 0.0

    def once(self) -> None:
        status = fetch_json(f"{ENGINE_URL}/api/status")
        session_id = str(status.get("sessionId") or "")
        venue_id = str(status.get("venueSessionId") or "")

        if self.last_session and self.last_session.get("sessionId") != session_id:
            post_platform("/api/ingest/session", session_payload(self.last_session, ended=True))
            self.last_session = None
        if session_id and not ambient_game(status.get("currentGame")):
            post_platform("/api/ingest/session", session_payload(status))
            self.last_session = status

        if self.last_venue and self.last_venue.get("venueSessionId") != venue_id:
            post_platform("/api/ingest/venue-session", venue_payload(self.last_venue, ended=True))
            self.last_venue = None
        if venue_id:
            post_platform("/api/ingest/venue-session", venue_payload(status))
            self.last_venue = status

    def run(self) -> None:
        while True:
            try:
                self.once()
            except (OSError, ValueError, error.URLError) as exc:
                now = time.monotonic()
                if now - self.last_error_at >= 60:
                    print(f"platform heartbeat failed: {exc}", flush=True)
                    self.last_error_at = now
            time.sleep(PLATFORM_INTERVAL)


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self) -> None:
        path = self.path.split("?", 1)[0]
        if path == "/health":
            self.send_json({"ok": True, "schema": SCHEMA})
            return
        if not self.authorized():
            self.send_json({"ok": False, "error": "supervisor token required"}, HTTPStatus.UNAUTHORIZED)
            return
        if path == "/v1/snapshot":
            self.send_json(build_snapshot())
            return
        self.send_json({"ok": False, "error": "not found"}, HTTPStatus.NOT_FOUND)

    def do_POST(self) -> None:
        path = self.path.split("?", 1)[0]
        if not self.authorized():
            self.send_json({"ok": False, "error": "supervisor token required"}, HTTPStatus.UNAUTHORIZED)
            return
        if path != "/v1/camera/record":
            self.send_json({"ok": False, "error": "not found"}, HTTPStatus.NOT_FOUND)
            return
        try:
            payload = self.read_json()
            self.send_json(quick_record(payload))
        except (OSError, ValueError, error.URLError) as exc:
            self.send_json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_GATEWAY)

    def authorized(self) -> bool:
        if self.client_address[0] in {"127.0.0.1", "::1"} and not TOKEN:
            return True
        provided = self.headers.get("X-Motion-Levels-Supervisor-Token", "")
        return bool(TOKEN) and hmac.compare_digest(TOKEN, provided)

    def read_json(self) -> dict[str, Any]:
        length = min(int(self.headers.get("content-length", "0") or 0), 65536)
        value = json.loads(self.rfile.read(length) or b"{}")
        if not isinstance(value, dict):
            raise ValueError("request body must be an object")
        return value

    def send_json(self, payload: Any, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode()
        self.send_response(int(status))
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("cache-control", "no-store")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def log_message(self, fmt: str, *args: Any) -> None:
        print(f"{self.client_address[0]} - {fmt % args}", flush=True)


def main() -> None:
    bind = os.environ.get("MOTION_LEVELS_SUPERVISOR_BIND", "127.0.0.1")
    port = int(os.environ.get("MOTION_LEVELS_SUPERVISOR_PORT", "4103"))
    server = ThreadingHTTPServer((bind, port), Handler)
    threading.Thread(target=PlatformHeartbeat().run, daemon=True).start()
    if SESSION_SYNC_ENABLED:
        threading.Thread(target=CanonicalSessionSync().run, daemon=True).start()
    print(f"venue supervisor listening at http://{bind}:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
