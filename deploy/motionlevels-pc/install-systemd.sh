#!/usr/bin/env bash
set -euo pipefail

UNIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SYSTEMD_DIR="/etc/systemd/system"

old_services=(
  motion-levels-player-tv.service
  motion-levels-camera-helper.service
  motion-levels.service
)

new_services=(
  motion-levels-floor-controller.service
  motion-levels-game-engine.service
  motion-levels-player-menu.service
  motion-levels-player-display.service
  motion-levels-kiosk.service
)

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this script with sudo on the Motion Levels PC." >&2
  exit 1
fi

mkdir -p \
  /etc/motion-levels \
  /opt/motion-levels/rebuild/var/floor-controller/recordings \
  /opt/motion-levels/rebuild/var/game-engine/sessions \
  /var/lib/motion-levels

for service in "${old_services[@]}"; do
  systemctl stop "$service" 2>/dev/null || true
  systemctl disable "$service" 2>/dev/null || true
done

for service in "${new_services[@]}"; do
  install -m 0644 "$UNIT_DIR/$service" "$SYSTEMD_DIR/$service"
done

systemctl daemon-reload

for service in "${new_services[@]}"; do
  systemctl enable "$service"
done

systemctl restart "${new_services[@]}"
systemctl --no-pager --lines=3 status "${new_services[@]}"
