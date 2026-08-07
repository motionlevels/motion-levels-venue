#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
reconciler="$repo_root/deploy/motionlevels-pc/reconcile-venue-release"
test_root="$(mktemp -d)"
trap 'rm -rf "$test_root"' EXIT

config_root="$test_root/config"
drm_root="$test_root/drm"
calls="$test_root/calls"
mkdir -p "$config_root" "$drm_root/card0-HDMI-A-1"
: >"$calls"

write_manifest() {
  local path=$1
  local revision=$2
  local backend=${3:-x11}
  printf 'VENUE_MODE=containers\nVENUE_REVISION=%s\nVENUE_DISPLAY_BACKEND=%s\n' "$revision" "$backend" >"$path"
}

run_reconciler() {
  MOTION_LEVELS_VENUE_CONFIG_ROOT="$config_root" \
  MOTION_LEVELS_DRM_ROOT="$drm_root" \
  MOTION_LEVELS_VENUE_ACTIVATOR="$test_root/activator" \
    "$reconciler"
}

cat >"$test_root/activator" <<'EOF'
#!/bin/sh
set -eu
printf '%s\n' "$(sed -n 's/^VENUE_REVISION=//p' "$MOTION_LEVELS_VENUE_CONFIG_ROOT/candidate.env")" >>"ACTIVATION_CALLS"
case "${ACTIVATION_MODE:-succeed}" in
  defer) exit 75 ;;
  busy) exit 73 ;;
  fail) exit 1 ;;
  succeed)
    mv "$MOTION_LEVELS_VENUE_CONFIG_ROOT/candidate.env" "$MOTION_LEVELS_VENUE_CONFIG_ROOT/current.env"
    ;;
esac
EOF
sed -i "s|ACTIVATION_CALLS|$calls|" "$test_root/activator"
chmod +x "$test_root/activator"

revision_a="$(printf 'a%.0s' {1..40})"
revision_b="$(printf 'b%.0s' {1..40})"

# No desired state is a successful no-op.
run_reconciler
test ! -s "$calls"

# A busy venue retains the exact desired revision across repeated processes.
write_manifest "$config_root/candidate.env" "$revision_a"
ACTIVATION_MODE=defer run_reconciler
test "$(sed -n 's/^VENUE_REVISION=//p' "$config_root/candidate.env")" = "$revision_a"
ACTIVATION_MODE=defer run_reconciler
test "$(wc -l <"$calls")" -eq 2

# A disconnected Wayland display defers locally without invoking activation.
write_manifest "$config_root/candidate.env" "$revision_a" wayland
before="$(wc -l <"$calls")"
run_reconciler
test "$(wc -l <"$calls")" -eq "$before"
printf 'connected\n' >"$drm_root/card0-HDMI-A-1/status"
ACTIVATION_MODE=defer run_reconciler
test "$(wc -l <"$calls")" -eq $((before + 1))

# Explicit supersession replaces A with B; only B is passed to the activator.
write_manifest "$config_root/candidate.env.tmp" "$revision_b"
mv "$config_root/candidate.env.tmp" "$config_root/candidate.env"
ACTIVATION_MODE=succeed run_reconciler
test "$(tail -n 1 "$calls")" = "$revision_b"
test "$(sed -n 's/^VENUE_REVISION=//p' "$config_root/current.env")" = "$revision_b"
test ! -e "$config_root/candidate.env"

# A restart after activation is idempotent and stale desired state is removed.
write_manifest "$config_root/candidate.env" "$revision_b"
before="$(wc -l <"$calls")"
run_reconciler
test "$(wc -l <"$calls")" -eq "$before"
test ! -e "$config_root/candidate.env"

# Activation failure stays visible and preserves the desired release for retry.
write_manifest "$config_root/candidate.env" "$revision_a"
if ACTIVATION_MODE=fail run_reconciler; then
  echo "expected failed activation to return non-zero" >&2
  exit 1
fi
test -e "$config_root/candidate.env"

echo "venue release reconciliation tests passed"
