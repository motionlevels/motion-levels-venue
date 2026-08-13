#!/usr/bin/env python3
"""Canonical host status and camera-control boundary for a venue appliance."""

from __future__ import annotations

import hmac
import json
import os
import socket
import subprocess
import threading
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib import error, request

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
SERVICES = tuple(
    value.strip()
    for value in os.environ.get(
        "MOTION_LEVELS_SUPERVISOR_SERVICES",
        "motion-levels-floor-controller.service,motion-levels-venue-runtime.service,"
        "motion-levels-kiosk.service,motion-levels-camera-helper.service,caddy.service",
    ).split(",")
    if value.strip()
)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def read_secret(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8").strip()
    except OSError:
        return ""


def platform_token() -> str:
    return os.environ.get("MOTION_LEVELS_PLATFORM_TOKEN", "").strip() or read_secret(PLATFORM_TOKEN_PATH)


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


def build_snapshot() -> dict[str, Any]:
    targets = {
        "engine": f"{ENGINE_URL}/api/status",
        "engineHealth": f"{ENGINE_URL}/api/health",
        "controller": f"{CONTROLLER_URL}/health",
        "camera": f"{CAMERA_URL}/status",
    }
    with ThreadPoolExecutor(max_workers=len(targets) + 1) as pool:
        probe_futures = [pool.submit(probe, name, url) for name, url in targets.items()]
        services_future = pool.submit(service_states)
        probes = dict(future.result() for future in probe_futures)
        services = services_future.result()

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
        "camera": probes["camera"],
        "summary": {
            "game": engine.get("currentGame") if isinstance(engine, dict) else None,
            "phase": engine.get("phase") if isinstance(engine, dict) else None,
            "displayHealthy": display.get("healthy") is True if isinstance(display, dict) else False,
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
    print(f"venue supervisor listening at http://{bind}:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
