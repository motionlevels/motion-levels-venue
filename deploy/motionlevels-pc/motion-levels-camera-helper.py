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
    def __init__(self, name: str, url: str, fps: float, jpeg_quality: int):
        self.name = name
        self.url = url
        self.delay = 1.0 / fps
        self.jpeg_quality = jpeg_quality
        self.lock = threading.Lock()
        self.jpeg: bytes | None = None
        self.running = True

    def start(self) -> None:
        threading.Thread(target=self._loop, daemon=True).start()

    def _loop(self) -> None:
        while self.running:
            cap = cv2.VideoCapture(self.url, cv2.CAP_FFMPEG)
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            if not cap.isOpened():
                print(f"{self.name}: cannot open camera, retrying", flush=True)
                time.sleep(2)
                continue

            print(f"{self.name}: connected", flush=True)
            last_encode = 0.0
            while self.running:
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

    def latest(self) -> bytes | None:
        with self.lock:
            return self.jpeg


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


def camera_password() -> str:
    explicit = os.environ.get("MOTION_LEVELS_CAMERA_PASSWORD")
    if explicit:
        return explicit
    password_env = os.environ.get("MOTION_LEVELS_CAMERA_PASSWORD_ENV", "ML_TAPO_PASSWORD")
    return os.environ.get(password_env, "")


def main() -> None:
    password = camera_password()
    if not password:
        raise SystemExit("missing camera password env var")

    bind = os.environ.get("MOTION_LEVELS_CAMERA_BIND", "127.0.0.1")
    port = env_int("MOTION_LEVELS_CAMERA_PORT", 8020)
    user = os.environ.get("MOTION_LEVELS_CAMERA_USER", "motionlevels")
    fps = env_float("MOTION_LEVELS_CAMERA_FPS", 2.0)
    jpeg_quality = env_int("MOTION_LEVELS_CAMERA_JPEG_QUALITY", 55)
    cameras = {
        "128": os.environ.get("MOTION_LEVELS_CAMERA_128_HOST", "192.168.1.128"),
        "129": os.environ.get("MOTION_LEVELS_CAMERA_129_HOST", "192.168.1.129"),
        "130": os.environ.get("MOTION_LEVELS_CAMERA_130_HOST", "192.168.1.130"),
    }

    feeds = {
        key: CameraFeed(f"camera {key}", f"rtsp://{user}:{password}@{host}:554/stream2", fps, jpeg_quality)
        for key, host in cameras.items()
    }
    for feed in feeds.values():
        feed.start()

    server = ThreadingHTTPServer((bind, port), make_handler(feeds))
    print(f"serving camera snapshots at http://{bind}:{port}/cam/{{id}}.jpg", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
