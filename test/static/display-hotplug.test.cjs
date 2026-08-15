const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "../..");
const watchdog = path.join(repoRoot, "deploy/motionlevels-pc/motion-levels-hdmi-watchdog");
const kiosk = path.join(repoRoot, "deploy/motionlevels-pc/motion-levels-player-kiosk");

function runSourcedScript(script, body) {
  const result = spawnSync("bash", ["-c", `set -euo pipefail\nsource "$DISPLAY_SCRIPT"\n${body}`], {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, DISPLAY_SCRIPT: script },
  });

  assert.equal(
    result.status,
    0,
    `sourced display script failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
  return result;
}

const parsingChecks = String.raw`
fixture="$(printf '%s\n' \
  'Screen 0: minimum 320 x 200, current 1280 x 720, maximum 16384 x 16384' \
  'DP-1 connected primary 1280x720+0+0 (normal left inverted right x axis y axis)' \
  '   1280x720      60.00*' \
  'HDMI-1 connected (normal left inverted right x axis y axis)' \
  '   1920x1080     60.00 +' \
  'HDMI-2 disconnected (normal left inverted right x axis y axis)')"

inactive_geometry="$(active_geometry_for_output "$fixture" HDMI-1)"
active_geometry="$(active_geometry_for_output "$fixture" DP-1)"
default_output="$(display_output_from_query "$fixture")"
preferred_output="$(display_output_from_query "$fixture" HDMI-1)"
test -z "$inactive_geometry"
test "$active_geometry" = '1280x720+0+0'
test "$default_output" = HDMI-1
test "$preferred_output" = HDMI-1

switched_fixture="$(printf '%s\n' \
  'DP-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)' \
  'HDMI-1 disconnected (normal left inverted right x axis y axis)' \
  'HDMI-2 connected 1920x1080+0+0 (normal left inverted right x axis y axis)')"
test "$(display_output_from_query "$switched_fixture" HDMI-1)" = HDMI-2

two_hdmi_fixture="$(printf '%s\n' \
  'HDMI-1 connected (normal left inverted right x axis y axis)' \
  'HDMI-2 connected 1920x1080+0+0 (normal left inverted right x axis y axis)')"
test "$(display_output_from_query "$two_hdmi_fixture")" = HDMI-2
test "$(display_output_from_query "$two_hdmi_fixture" HDMI-1)" = HDMI-1

only_dp_fixture='DP-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)'
test -z "$(display_output_from_query "$only_dp_fixture")"
MOTION_LEVELS_XRANDR_MODE=1920x1080
display_geometry_is_usable '1920x1080+0+0'
! display_geometry_is_usable '3840x2160+0+0'
! display_geometry_is_usable '1920x1080+1920+0'

# A missing X server must be a normal empty observation, not a strict-mode exit.
query_display >/dev/null
`;

test("display parsers tolerate an inactive connected output under strict shell mode", () => {
  runSourcedScript(watchdog, parsingChecks);
  runSourcedScript(kiosk, parsingChecks);
});

const alsaDiscoveryChecks = String.raw`
fixture_root="$(mktemp -d)"
trap 'rm -rf -- "$fixture_root"' EXIT
mkdir -p "$fixture_root/card1/pcm3p" "$fixture_root/card1/pcm7p"

write_eld() {
  local path="$1"
  local present="$2"
  local valid="$3"
  printf '%s\n' \
    "monitor_present  $present" \
    "eld_valid        $valid" \
    'connection_type  HDMI' >"$path"
}
write_pcm() {
  local path="$1"
  local device="$2"
  local eld_index="$3"
  printf '%s\n' \
    'stream: PLAYBACK' \
    "device: $device" \
    "id: HDMI $eld_index" >"$path"
}

MOTION_LEVELS_PROC_ASOUND_ROOT="$fixture_root"
write_eld "$fixture_root/card1/eld#0.1" 1 1
write_pcm "$fixture_root/card1/pcm7p/info" 7 1
test "$(resolve_live_hdmi_alsa_device HDMI-2)" = 'plughw:1,7'

write_eld "$fixture_root/card1/eld#0.1" 0 0
write_eld "$fixture_root/card1/eld#0.0" 1 1
write_pcm "$fixture_root/card1/pcm3p/info" 3 0
test "$(resolve_live_hdmi_alsa_device HDMI-1)" = 'plughw:1,3'

# Each selected output keeps its own ELD when two HDMI sinks are live.
write_eld "$fixture_root/card1/eld#0.1" 1 1
test "$(resolve_live_hdmi_alsa_device HDMI-1)" = 'plughw:1,3'
test "$(resolve_live_hdmi_alsa_device HDMI-2)" = 'plughw:1,7'

# The same connector ordinal on two cards is deliberately ambiguous.
mkdir -p "$fixture_root/card2/pcm3p"
write_eld "$fixture_root/card2/eld#0.0" 1 1
write_pcm "$fixture_root/card2/pcm3p/info" 3 0
! resolve_live_hdmi_alsa_device HDMI-1 >/dev/null
`;

test("ELD discovery maps each selected HDMI connector to its playback PCM", () => {
  runSourcedScript(watchdog, alsaDiscoveryChecks);
  runSourcedScript(kiosk, alsaDiscoveryChecks);
});

test("kiosk ALSA discovery falls back safely when ELD is unavailable", () => {
  runSourcedScript(kiosk, String.raw`
fixture_root="$(mktemp -d)"
trap 'rm -rf -- "$fixture_root"' EXIT
MOTION_LEVELS_PROC_ASOUND_ROOT="$fixture_root"
MOTION_LEVELS_HDMI_ALSA_DEVICE='plughw:1,7'
sleep() { return 0; }
test "$(resolve_hdmi_alsa_device_with_fallback HDMI-2 2>/dev/null)" = 'plughw:1,7'
`);
});

test("watchdog recognizes the kiosk across Debian and NixOS Chromium paths", () => {
  runSourcedScript(watchdog, String.raw`
MOTION_LEVELS_PLAYER_URL='http://127.0.0.1/display/'
pgrep() {
  test "$1" = -af
  test "$2" = chromium
  printf '%s\n' \
    '101 /nix/store/example-chromium/libexec/chromium/chromium --kiosk --app=http://127.0.0.1/display/' \
    '102 /nix/store/example-chromium/libexec/chromium/chromium --type=renderer'
}
chromium_running

pgrep() {
  printf '%s\n' '102 /usr/lib/chromium/chromium --type=renderer'
}
! chromium_running
`);
});

test("watchdog repairs a connected output with no active geometry", () => {
  runSourcedScript(watchdog, String.raw`
display_configured=0
kiosk_restarts=0
MOTION_LEVELS_XRANDR_OUTPUT=HDMI-1
inactive_query() {
  printf '%s\n' \
    'Screen 0: minimum 320 x 200, current 1024 x 768, maximum 16384 x 16384' \
    'HDMI-1 connected primary (normal left inverted right x axis y axis)' \
    '   1920x1080     60.00 +'
}
active_query() {
  printf '%s\n' \
    'Screen 0: minimum 320 x 200, current 1920 x 1080, maximum 16384 x 16384' \
    'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)' \
    '   1920x1080     60.00* +' \
    '    audio: on'
}
query_display() {
  if (( display_configured )); then active_query; else inactive_query; fi
}
configure_display() {
  test "$1" = HDMI-1
  display_configured=1
}
systemctl() {
  test "$1" = restart
  test "$2" = motion-levels-kiosk.service
  kiosk_restarts=$((kiosk_restarts + 1))
}
chromium_running() { return 0; }
display_client_healthy() { return 0; }

watchdog_check
test "$display_configured" -eq 1
test "$kiosk_restarts" -eq 1
test "$failure_count" -eq 0
`);
});

test("watchdog moves an offset TV to the kiosk origin and reloads Chromium", () => {
  runSourcedScript(watchdog, String.raw`
display_configured=0
kiosk_restarts=0
MOTION_LEVELS_XRANDR_OUTPUT=HDMI-1
query_display() {
  if (( display_configured )); then
    printf '%s\n' \
      'Screen 0: minimum 320 x 200, current 1920 x 1080, maximum 16384 x 16384' \
      'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)'
  else
    printf '%s\n' \
      'Screen 0: minimum 320 x 200, current 3840 x 1080, maximum 16384 x 16384' \
      'DP-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)' \
      'HDMI-1 connected 1920x1080+1920+0 (normal left inverted right x axis y axis)'
  fi
}
configure_display() {
  test "$1" = HDMI-1
  display_configured=1
}
systemctl() {
  test "$1" = restart
  test "$2" = motion-levels-kiosk.service
  kiosk_restarts=$((kiosk_restarts + 1))
}
chromium_running() { return 0; }
display_client_healthy() { return 0; }

watchdog_check
test "$display_configured" -eq 1
test "$kiosk_restarts" -eq 1
`);
});

test("watchdog reloads Chromium when an already-active TV reconnects", () => {
  runSourcedScript(watchdog, String.raw`
display_connected=0
kiosk_restarts=0
MOTION_LEVELS_XRANDR_MODE=1920x1080
MOTION_LEVELS_XRANDR_OUTPUT=HDMI-1
query_display() {
  if (( display_connected )); then
    printf '%s\n' \
      'Screen 0: minimum 320 x 200, current 1920 x 1080, maximum 16384 x 16384' \
      'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)'
  else
    printf '%s\n' \
      'Screen 0: minimum 320 x 200, current 1024 x 768, maximum 16384 x 16384' \
      'HDMI-1 disconnected primary (normal left inverted right x axis y axis)'
  fi
}
configure_display() { return 99; }
systemctl() {
  kiosk_restarts=$((kiosk_restarts + 1))
}
chromium_running() { return 0; }
display_client_healthy() { return 0; }

watchdog_check
display_connected=1
watchdog_check
test "$kiosk_restarts" -eq 1
test -z "$restart_pending_reason"
`);
});

test("watchdog follows a live cable move from HDMI-1 to HDMI-2 exactly once", () => {
  runSourcedScript(watchdog, String.raw`
active_output=HDMI-1
kiosk_restarts=0
MOTION_LEVELS_XRANDR_MODE=1920x1080
MOTION_LEVELS_XRANDR_OUTPUT=HDMI-1
MOTION_LEVELS_FORCE_ALSA_OUTPUT=0
query_display() {
  if [ "$active_output" = HDMI-1 ]; then
    printf '%s\n' \
      'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)' \
      'HDMI-2 disconnected (normal left inverted right x axis y axis)'
  else
    printf '%s\n' \
      'HDMI-1 disconnected (normal left inverted right x axis y axis)' \
      'HDMI-2 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)'
  fi
}
resolve_live_hdmi_alsa_device() { return 1; }
systemctl() { kiosk_restarts=$((kiosk_restarts + 1)); }
chromium_running() { return 0; }
display_client_healthy() { return 0; }
RESTART_COOLDOWN_SECONDS=0

watchdog_check
active_output=HDMI-2
watchdog_check
test "$last_display_output" = HDMI-2
test "$kiosk_restarts" -eq 1
watchdog_check
test "$kiosk_restarts" -eq 1
`);
});

test("watchdog reloads once when delayed ELD appears or changes PCM", () => {
  runSourcedScript(watchdog, String.raw`
mock_live_alsa_device=''
kiosk_restarts=0
MOTION_LEVELS_XRANDR_MODE=1920x1080
MOTION_LEVELS_XRANDR_OUTPUT=HDMI-1
MOTION_LEVELS_FORCE_ALSA_OUTPUT=1
query_display() {
  printf '%s\n' \
    'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)' \
    '    audio: on'
}
resolve_live_hdmi_alsa_device() {
  test "$1" = HDMI-1
  [ -n "$mock_live_alsa_device" ] || return 1
  printf '%s' "$mock_live_alsa_device"
}
configure_hdmi_alsa_controls() { return 0; }
systemctl() { kiosk_restarts=$((kiosk_restarts + 1)); }
chromium_running() { return 0; }
display_client_healthy() { return 0; }
RESTART_COOLDOWN_SECONDS=0

watchdog_check
test "$kiosk_restarts" -eq 0
mock_live_alsa_device='plughw:1,7'
watchdog_check
test "$kiosk_restarts" -eq 1
watchdog_check
test "$kiosk_restarts" -eq 1
mock_live_alsa_device='plughw:1,3'
watchdog_check
test "$kiosk_restarts" -eq 2
watchdog_check
test "$kiosk_restarts" -eq 2
`);
});

test("watchdog retains a reconnect reload while restart cooldown is active", () => {
  runSourcedScript(watchdog, String.raw`
display_connected=0
kiosk_restarts=0
MOTION_LEVELS_XRANDR_MODE=1920x1080
MOTION_LEVELS_XRANDR_OUTPUT=HDMI-1
query_display() {
  if (( display_connected )); then
    printf '%s\n' \
      'Screen 0: minimum 320 x 200, current 1920 x 1080, maximum 16384 x 16384' \
      'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)'
  else
    printf '%s\n' \
      'Screen 0: minimum 320 x 200, current 1024 x 768, maximum 16384 x 16384' \
      'HDMI-1 disconnected primary (normal left inverted right x axis y axis)'
  fi
}
systemctl() { kiosk_restarts=$((kiosk_restarts + 1)); }
chromium_running() { return 0; }
display_client_healthy() { return 0; }

watchdog_check
display_connected=1
last_restart="$(date +%s)"
watchdog_check
test "$kiosk_restarts" -eq 0
test -n "$restart_pending_reason"
last_restart=0
watchdog_check
test "$kiosk_restarts" -eq 1
test -z "$restart_pending_reason"
`);
});

test("watchdog retries a pending reload after systemctl fails", () => {
  runSourcedScript(watchdog, String.raw`
display_connected=0
restart_attempts=0
MOTION_LEVELS_XRANDR_MODE=1920x1080
MOTION_LEVELS_XRANDR_OUTPUT=HDMI-1
RESTART_COOLDOWN_SECONDS=0
query_display() {
  if (( display_connected )); then
    printf '%s\n' \
      'Screen 0: minimum 320 x 200, current 1920 x 1080, maximum 16384 x 16384' \
      'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)'
  else
    printf '%s\n' \
      'Screen 0: minimum 320 x 200, current 1024 x 768, maximum 16384 x 16384' \
      'HDMI-1 disconnected primary (normal left inverted right x axis y axis)'
  fi
}
systemctl() {
  restart_attempts=$((restart_attempts + 1))
  test "$restart_attempts" -gt 1
}
chromium_running() { return 0; }
display_client_healthy() { return 0; }

watchdog_check
display_connected=1
watchdog_check
test "$restart_attempts" -eq 1
test -n "$restart_pending_reason"
watchdog_check
test "$restart_attempts" -eq 2
test -z "$restart_pending_reason"
`);
});

test("watchdog counts a persistent inactive mode instead of crashing", () => {
  const result = runSourcedScript(watchdog, String.raw`
query_display() {
  printf '%s\n' \
    'Screen 0: minimum 320 x 200, current 1024 x 768, maximum 16384 x 16384' \
    'HDMI-1 connected primary (normal left inverted right x axis y axis)' \
    '   1920x1080     60.00 +'
}
configure_display() { return 0; }
chromium_running() { return 0; }
display_client_healthy() { return 0; }
FAILURES_BEFORE_RESTART=3

watchdog_check
test "$failure_count" -eq 1
`);

  assert.match(result.stdout, /bad HDMI geometry 'none' on HDMI-1; failure 1\/3/);
});

const activeWatchdogFixture = String.raw`
kiosk_restarts=0
query_display() {
  printf '%s\n' \
    'Screen 0: minimum 320 x 200, current 1920 x 1080, maximum 16384 x 16384' \
    'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)' \
    '   1920x1080     60.00* +' \
    '    audio: on'
}
chromium_running() { return 0; }
systemctl() {
  test "$1" = restart
  test "$2" = motion-levels-kiosk.service
  kiosk_restarts=$((kiosk_restarts + 1))
}
`;

test("watchdog accepts a fresh healthy player-display heartbeat", () => {
  runSourcedScript(watchdog, String.raw`
${activeWatchdogFixture}
fetch_display_client() {
  printf '%s\n' '{"fresh":true,"healthy":true}'
}
FAILURES_BEFORE_RESTART=3
failure_count=2

watchdog_check
test "$failure_count" -eq 0
test "$kiosk_restarts" -eq 0
`);
});

test("watchdog restarts the kiosk after repeated stale player-display heartbeats", () => {
  const result = runSourcedScript(watchdog, String.raw`
${activeWatchdogFixture}
fetch_display_client() {
  printf '%s\n' '{"fresh":false,"healthy":false}'
}
FAILURES_BEFORE_RESTART=2
RESTART_COOLDOWN_SECONDS=0

watchdog_check
test "$failure_count" -eq 1
test "$kiosk_restarts" -eq 0
watchdog_check
test "$failure_count" -eq 0
test "$kiosk_restarts" -eq 1
`);

  assert.match(result.stdout, /player display heartbeat is unhealthy; failure 1\/2/);
  assert.match(result.stdout, /player display heartbeat is unhealthy; restarting motion-levels-kiosk\.service/);
});

test("watchdog treats malformed player-display status as unhealthy", () => {
  const result = runSourcedScript(watchdog, String.raw`
${activeWatchdogFixture}
fetch_display_client() {
  printf '%s\n' '{not-json'
}
FAILURES_BEFORE_RESTART=3

watchdog_check
test "$failure_count" -eq 1
test "$kiosk_restarts" -eq 0
`);

  assert.match(result.stdout, /player display heartbeat is unhealthy; failure 1\/3/);
});

test("watchdog treats non-object and unreachable player-display status as unhealthy without tracebacks", () => {
  for (const fetchBody of [
    "printf '%s\\n' '[]'",
    "printf '%s\\n' 'null'",
    "return 1",
  ]) {
    const result = runSourcedScript(watchdog, String.raw`
${activeWatchdogFixture}
fetch_display_client() {
  ${fetchBody}
}
FAILURES_BEFORE_RESTART=3

watchdog_check
test "$failure_count" -eq 1
test "$kiosk_restarts" -eq 0
`);

    assert.doesNotMatch(result.stderr, /Traceback|AttributeError/u);
    assert.match(result.stdout, /player display heartbeat is unhealthy; failure 1\/3/);
  }
});

test("watchdog clears heartbeat failures after the player display recovers", () => {
  runSourcedScript(watchdog, String.raw`
${activeWatchdogFixture}
display_client_state=stale
fetch_display_client() {
  if [ "$display_client_state" = healthy ]; then
    printf '%s\n' '{"fresh":true,"healthy":true}'
  else
    printf '%s\n' '{"fresh":false,"healthy":false}'
  fi
}
FAILURES_BEFORE_RESTART=3

watchdog_check
test "$failure_count" -eq 1
display_client_state=healthy
watchdog_check
test "$failure_count" -eq 0
display_client_state=stale
watchdog_check
test "$failure_count" -eq 1
test "$kiosk_restarts" -eq 0
`);
});

test("watchdog cancels a heartbeat restart when the display recovers during cooldown", () => {
  runSourcedScript(watchdog, String.raw`
${activeWatchdogFixture}
display_client_state=stale
fetch_display_client() {
  if [ "$display_client_state" = healthy ]; then
    printf '%s\n' '{"fresh":true,"healthy":true}'
  else
    printf '%s\n' '{"fresh":false,"healthy":false}'
  fi
}
FAILURES_BEFORE_RESTART=1
RESTART_COOLDOWN_SECONDS=60
last_restart="$(date +%s)"

watchdog_check
test "$failure_count" -eq 1
test "$kiosk_restarts" -eq 0
test -z "$restart_pending_reason"
display_client_state=healthy
last_restart=0
watchdog_check
test "$failure_count" -eq 0
test "$kiosk_restarts" -eq 0
test -z "$restart_pending_reason"
`);
});

test("kiosk launcher retries the connected-but-inactive TV until modesetting succeeds", () => {
  const result = runSourcedScript(kiosk, String.raw`
display_configured=0
MOTION_LEVELS_XRANDR_MODE=1920x1080
MOTION_LEVELS_XRANDR_RATE=60
MOTION_LEVELS_XRANDR_OUTPUT=HDMI-1
query_display() {
  if (( display_configured )); then
    printf '%s\n' \
      'Screen 0: minimum 320 x 200, current 1920 x 1080, maximum 16384 x 16384' \
      'HDMI-1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis)'
  else
    printf '%s\n' \
      'Screen 0: minimum 320 x 200, current 1024 x 768, maximum 16384 x 16384' \
      'HDMI-1 connected primary (normal left inverted right x axis y axis)' \
      '   1920x1080     60.00 +'
  fi
}
apply_display_mode() {
  test "$1" = HDMI-1
  test "$2" = 1920x1080
  test "$3" = 60
  display_configured=1
}
sleep() { return 0; }

configure_display
test "$display_configured" -eq 1
`);

  assert.match(result.stdout, /Display configured: HDMI-1 1920x1080\+0\+0/);
});

test("kiosk launcher exhausts retries cleanly while X is unavailable", () => {
  const result = runSourcedScript(kiosk, String.raw`
query_display() { return 0; }
sleep() { return 0; }
configure_display
`);

  assert.match(result.stdout, /could not configure a connected display after retries/);
});

test("watchdog rejects unsafe timing values without overflowing shell arithmetic", () => {
  runSourcedScript(watchdog, String.raw`
test "$(validated_integer 0008 10 1 3600 interval 2>/dev/null)" = 8
test "$(validated_integer 0 10 1 3600 interval 2>/dev/null)" = 10
test "$(validated_integer -1 10 1 3600 interval 2>/dev/null)" = 10
test "$(validated_integer 99999999999999999999 10 1 3600 interval 2>/dev/null)" = 10
test "$(validated_integer 3601 10 1 3600 interval 2>/dev/null)" = 10
`);
});

test("watchdog publishes atomic debounced HDMI metrics without treating detector failure as disconnect", () => {
  runSourcedScript(watchdog, String.raw`
fixture_root="$(mktemp -d)"
trap 'rm -rf -- "$fixture_root"' EXIT
HDMI_METRICS_FILE="$fixture_root/motion-levels-hdmi.prom"
HDMI_METRICS_CONNECTOR='HDMI-A-2'
HDMI_METRICS_CONFIRMATIONS=3
MOTION_LEVELS_BOOT_ID_FILE="$fixture_root/boot_id"
printf '%s\n' '11111111-1111-1111-1111-111111111111' >"$MOTION_LEVELS_BOOT_ID_FILE"
mock_now=1700000000
date() {
  test "$1" = +%s
  printf '%s\n' "$mock_now"
}
metric_is() {
  grep -Fqx "$1" "$HDMI_METRICS_FILE"
}
reset_metrics_runtime() {
  hdmi_metrics_loaded=0
  hdmi_metrics_baselined=0
  hdmi_metrics_connected=0
  hdmi_metrics_last_transition_timestamp=0
  hdmi_metrics_candidate_connected=''
  hdmi_metrics_candidate_count=0
  hdmi_metrics_boot_id=''
}

# The first valid observation in a boot is a baseline, not a transition.
record_hdmi_metrics_observation 1 0
metric_is 'motionlevels_hdmi_connected{connector="HDMI-A-2"} 0'
metric_is 'motionlevels_hdmi_detector_up 1'
metric_is 'motionlevels_hdmi_last_transition_timestamp_seconds{connector="HDMI-A-2"} 0'
! grep -Eq 'site=|vmid=' "$HDMI_METRICS_FILE"

# Three consecutive observations are required to publish a transition.
record_hdmi_metrics_observation 1 1
record_hdmi_metrics_observation 1 1
metric_is 'motionlevels_hdmi_connected{connector="HDMI-A-2"} 0'
record_hdmi_metrics_observation 1 1
metric_is 'motionlevels_hdmi_connected{connector="HDMI-A-2"} 1'
metric_is 'motionlevels_hdmi_last_transition_timestamp_seconds{connector="HDMI-A-2"} 1700000000'

# Detector failure is exported immediately but preserves last-known HDMI state
# and clears an incomplete disconnect candidate.
record_hdmi_metrics_observation 1 0
record_hdmi_metrics_observation 1 0
record_hdmi_metrics_observation 0 0
metric_is 'motionlevels_hdmi_connected{connector="HDMI-A-2"} 1'
metric_is 'motionlevels_hdmi_detector_up 0'
metric_is 'motionlevels_hdmi_last_transition_timestamp_seconds{connector="HDMI-A-2"} 1700000000'
mock_now=1700000060
record_hdmi_metrics_observation 1 0
record_hdmi_metrics_observation 1 0
metric_is 'motionlevels_hdmi_connected{connector="HDMI-A-2"} 1'
record_hdmi_metrics_observation 1 0
metric_is 'motionlevels_hdmi_connected{connector="HDMI-A-2"} 0'
metric_is 'motionlevels_hdmi_detector_up 1'
metric_is 'motionlevels_hdmi_last_transition_timestamp_seconds{connector="HDMI-A-2"} 1700000060'

# A same-boot service restart retains state and still debounces changes.
reset_metrics_runtime
mock_now=1700000120
record_hdmi_metrics_observation 1 1
record_hdmi_metrics_observation 1 1
metric_is 'motionlevels_hdmi_connected{connector="HDMI-A-2"} 0'
record_hdmi_metrics_observation 1 1
metric_is 'motionlevels_hdmi_connected{connector="HDMI-A-2"} 1'
metric_is 'motionlevels_hdmi_last_transition_timestamp_seconds{connector="HDMI-A-2"} 1700000120'

# A new VM boot takes a fresh baseline and does not replay a shutdown event.
printf '%s\n' '22222222-2222-2222-2222-222222222222' >"$MOTION_LEVELS_BOOT_ID_FILE"
reset_metrics_runtime
record_hdmi_metrics_observation 1 0
metric_is 'motionlevels_hdmi_connected{connector="HDMI-A-2"} 0'
metric_is 'motionlevels_hdmi_last_transition_timestamp_seconds{connector="HDMI-A-2"} 1700000120'
test "$(find "$fixture_root" -name '*.tmp.*' -print -quit)" = ''
`);
});
