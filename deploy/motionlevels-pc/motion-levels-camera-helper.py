#!/usr/bin/env python3
from __future__ import annotations

import os
import threading
import time
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

os.environ.setdefault(
    "OPENCV_FFMPEG_CAPTURE_OPTIONS",
    "rtsp_transport;tcp|fflags;nobuffer|max_delay;200000|stimeout;5000000",
)

import cv2


class CameraFeed:
    def __init__(self, name: str, url: str, fps: float, jpeg_quality: int, idle_seconds: float):
        self.name = name
        self.url = url
        self.delay = 1.0 / fps
        self.jpeg_quality = jpeg_quality
        self.idle_seconds = idle_seconds
        self.lock = threading.Lock()
        self.jpeg: bytes | None = None
        self.last_requested = 0.0
        self.thread: threading.Thread | None = None

    def ensure_running(self) -> None:
        thread: threading.Thread | None = None
        with self.lock:
            self.last_requested = time.monotonic()
            if self.thread is None or not self.thread.is_alive():
                self.jpeg = None
                self.thread = threading.Thread(target=self._loop, daemon=True)
                thread = self.thread
        if thread is not None:
            thread.start()

    def _loop(self) -> None:
        while not self._idle_expired():
            cap = cv2.VideoCapture(self.url, cv2.CAP_FFMPEG)
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            if not cap.isOpened():
                print(f"{self.name}: cannot open camera, retrying", flush=True)
                time.sleep(2)
                continue

            print(f"{self.name}: connected", flush=True)
            last_encode = 0.0
            while not self._idle_expired():
                ok, frame = cap.read()
                if not ok or frame is None:
                    print(f"{self.name}: frame read failed, reconnecting", flush=True)
                    break

                now = time.monotonic()
                if now - last_encode < self.delay:
                    continue

                last_encode = now
                ok, encoded = cv2.imencode(".jpg", frame, [int(cv2.IMWRITE_JPEG_QUALITY), self.jpeg_quality])
                if ok:
                    with self.lock:
                        self.jpeg = encoded.tobytes()

            cap.release()
            time.sleep(1)

        print(f"{self.name}: idle, closed", flush=True)

    def latest(self) -> bytes | None:
        self.ensure_running()
        with self.lock:
            return self.jpeg

    def _idle_expired(self) -> bool:
        with self.lock:
            return time.monotonic() - self.last_requested > self.idle_seconds


def make_handler(feeds: dict[str, CameraFeed]):
    class Handler(BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"

        def do_HEAD(self) -> None:
            self._handle(send_body=False)

        def do_GET(self) -> None:
            self._handle(send_body=True)

        def _handle(self, send_body: bool) -> None:
            path = self.path.split("?", 1)[0]
            if path == "/health":
                self._send_health(send_body)
                return
            if path.startswith("/cam/") and path.endswith(".jpg"):
                key = path.removeprefix("/cam/").removesuffix(".jpg")
                self._send_jpeg(feeds.get(key), send_body)
                return
            self.send_error(HTTPStatus.NOT_FOUND)

        def _send_health(self, send_body: bool) -> None:
            body = b'{"ok":true}\n'
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            if send_body:
                self.wfile.write(body)

        def _send_jpeg(self, feed: CameraFeed | None, send_body: bool) -> None:
            if not feed:
                self.send_error(HTTPStatus.NOT_FOUND)
                return

            deadline = time.time() + 5
            data = feed.latest()
            while data is None and time.time() < deadline:
                time.sleep(0.05)
                data = feed.latest()

            if data is None:
                self.send_error(HTTPStatus.SERVICE_UNAVAILABLE)
                return

            self.send_response(200)
            self.send_header("Content-Type", "image/jpeg")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            if send_body:
                self.wfile.write(data)

        def log_message(self, fmt: str, *args) -> None:
            message = fmt % args
            if " /cam/" not in message:
                print(f"{self.client_address[0]} - {message}", flush=True)

    return Handler


def env_float(name: str, fallback: float) -> float:
    try:
        return float(os.environ.get(name, fallback))
    except (TypeError, ValueError):
        return fallback


def env_int(name: str, fallback: int) -> int:
    try:
        return int(os.environ.get(name, fallback))
    except (TypeError, ValueError):
        return fallback


def secret_value(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if value:
        return value
    path = os.environ.get(f"{name}_FILE", "").strip()
    if not path:
        return ""
    try:
        return open(path, encoding="utf-8").read().strip()
    except OSError as exc:
        raise SystemExit(f"cannot read {name}_FILE: {exc}") from exc


def camera_password() -> str:
    explicit = secret_value("MOTION_LEVELS_CAMERA_PASSWORD")
    if explicit:
        return explicit
    password_env = os.environ.get("MOTION_LEVELS_CAMERA_PASSWORD_ENV", "ML_TAPO_PASSWORD")
    return secret_value(password_env)


def main() -> None:
    password = camera_password()
    if not password:
        raise SystemExit("missing camera password env var")

    bind = os.environ.get("MOTION_LEVELS_CAMERA_BIND", "127.0.0.1")
    port = env_int("MOTION_LEVELS_CAMERA_PORT", 8020)
    user = os.environ.get("MOTION_LEVELS_CAMERA_USER", "motionlevels")
    fps = env_float("MOTION_LEVELS_CAMERA_FPS", 2.0)
    jpeg_quality = env_int("MOTION_LEVELS_CAMERA_JPEG_QUALITY", 55)
    idle_seconds = env_float("MOTION_LEVELS_CAMERA_IDLE_SECONDS", 20.0)
    cameras = {
        "128": os.environ.get("MOTION_LEVELS_CAMERA_128_HOST", "192.168.1.128"),
        "129": os.environ.get("MOTION_LEVELS_CAMERA_129_HOST", "192.168.1.129"),
        "130": os.environ.get("MOTION_LEVELS_CAMERA_130_HOST", "192.168.1.130"),
    }

    feeds = {
        key: CameraFeed(f"camera {key}", f"rtsp://{user}:{password}@{host}:554/stream2", fps, jpeg_quality, idle_seconds)
        for key, host in cameras.items()
    }

    server = ThreadingHTTPServer((bind, port), make_handler(feeds))
    print(f"serving camera snapshots at http://{bind}:{port}/cam/{{id}}.jpg", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
