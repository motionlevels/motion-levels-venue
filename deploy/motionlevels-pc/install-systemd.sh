#!/usr/bin/env bash
set -euo pipefail

UNIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SYSTEMD_DIR="/etc/systemd/system"

old_services=(
  motion-levels-player-menu.service
  motion-levels-player-display.service
  motion-levels-player-tv.service
  motion-levels.service
)

new_services=(
  motion-levels-floor-controller.service
  motion-levels-game-engine.service
  motion-levels-camera-helper.service
  motion-levels-kiosk.service
  motion-levels-hdmi-watchdog.service
)

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this script with sudo on the Motion Levels PC." >&2
  exit 1
fi

mkdir -p \
  /etc/motion-levels \
  /etc/caddy \
  /var/lib/motion-levels

if command -v apt-get >/dev/null 2>&1; then
  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y caddy ffmpeg python3-opencv v4l-utils
fi

if [ ! -f /etc/motion-levels/motion-levels.env ]; then
  install -m 0644 "$UNIT_DIR/motion-levels.env" /etc/motion-levels/motion-levels.env
fi

install -m 0644 "$UNIT_DIR/Caddyfile" /etc/caddy/Caddyfile
install -m 0755 "$UNIT_DIR/motion-levels-player-kiosk" /usr/local/bin/motion-levels-player-kiosk
install -m 0755 "$UNIT_DIR/motion-levels-hdmi-watchdog" /usr/local/bin/motion-levels-hdmi-watchdog

for service in "${old_services[@]}"; do
  systemctl stop "$service" 2>/dev/null || true
  systemctl disable "$service" 2>/dev/null || true
  rm -f "$SYSTEMD_DIR/$service"
done

for service in "${new_services[@]}"; do
  install -m 0644 "$UNIT_DIR/$service" "$SYSTEMD_DIR/$service"
done

systemctl daemon-reload
systemctl enable caddy 2>/dev/null || true

for service in "${new_services[@]}"; do
  systemctl enable "$service"
done

systemctl restart caddy
systemctl restart "${new_services[@]}"
systemctl --no-pager --lines=3 status caddy "${new_services[@]}"
