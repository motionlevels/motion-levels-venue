const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

function trackedFiles() {
  return execFileSync("git", ["ls-files"], { cwd: repoRoot, encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);
}

test("the venue repository does not vendor product source or release artifacts", () => {
  const forbiddenPrefixes = [
    "apps/",
    "content/audio/",
    "game-bundles/",
    "game-engine/",
    "packages/",
  ];
  const forbiddenFiles = new Set([
    "go.mod",
    "go.sum",
    "ansible/playbooks/venue-containers.yml",
    ".github/workflows/images.yml",
    ".github/workflows/sync-games-bundle.yml",
    "deploy/motionlevels-pc/docker-compose.yml",
    "deploy/motionlevels-pc/venue-bundle.Dockerfile",
    "deploy/motionlevels-pc/motion-levels-venue-containers.service",
  ]);
  const forbiddenPathPatterns = [
    /^\.github\/workflows\/(?:deploy-production|images|reconcile-deployment|sync-games-bundle)\.yml$/,
    /^scripts\/(?:generate-elevenlabs-narration|import-motion-levels-games-release|install-player-menu-from-games-bundle|request-venue-deployment|sync-cloud-init-runtime-files|sync-platform-mirrors|verify-motion-levels-games-bundle)\./,
    /^deploy\/motionlevels-pc\/(?:.*container.*|.*\.compose\.yml|docker-compose\.yml|venue-bundle\.Dockerfile(?:\.dockerignore)?|activate-venue-containers|Caddyfile\.container|venue-caddy|venue-game-engine)$/,
    /^deploy\/motionlevels-pc\/(?:build-nocloud-seed-iso\.sh|cloud-init\.yaml|create-motionlevels-venue-vm\.sh)$/,
    /^deploy\/motionlevels-pc\/(?:aplay-raw|motion-levels-audio.*|motion-levels-display-agent|motion-levels-display-wayland\.service|motion-levels-game-engine\.service|motion-levels-hdmi-agent(?:\.service)?|weston\.ini)$/,
  ];

  for (const file of trackedFiles()) {
    assert.equal(forbiddenFiles.has(file), false, `${file} belongs to a retired release path`);
    assert.equal(
      forbiddenPathPatterns.some((pattern) => pattern.test(file)),
      false,
      `${file} belongs to a retired deployment path`,
    );
    assert.equal(
      forbiddenPrefixes.some((prefix) => file.startsWith(prefix)),
      false,
      `${file} belongs to a source repository or generated release`,
    );
  }
});

test("the component lock pins external source repositories", () => {
  const lock = JSON.parse(read("deploy/motionlevels-pc/venue-components.lock.json"));
  assert.equal(lock.schema, "motion-levels-venue-components-v2");
  assert.deepEqual(Object.keys(lock.components).sort(), ["cameras", "controller", "games"]);

  for (const [name, component] of Object.entries(lock.components)) {
    assert.match(component.repository, /^https:\/\/github\.com\/motionlevels\/motion-levels-[a-z-]+\.git$/);
    assert.match(component.revision, /^[0-9a-f]{40}$/, `${name} revision must be immutable`);
  }
  assert.equal(lock.components.controller.target, "linux/amd64");
  assert.equal(lock.components.controller.protocol, "v1+v2");
  assert.match(lock.components.controller.goVersion, /^go1\./);
  assert.match(lock.components.games.nodeVersion, /^\d+$/);
  assert.match(lock.components.cameras.pythonVersion, /^\d+\.\d+$/);
});

test("native releases are assembled from clean pinned sibling checkouts", () => {
  const build = read("scripts/build-native-release.sh");
  assert.match(build, /validate_source controller/);
  assert.match(build, /validate_source games/);
  assert.match(build, /validate_source cameras/);
  assert.match(build, /status --porcelain --untracked-files=normal/);
  assert.match(build, /scripts\/build-native\.sh/);
  assert.match(build, /npm --prefix "\$games_root" run build:bundle/);
  assert.match(build, /npm run verify:bundle/);
  assert.match(build, /components\/cameras\/source\/motion_levels_cameras/);
  assert.match(build, /requirements-native\.lock/);
  assert.match(build, /chmod 0755 "\$candidate"/);
  assert.match(build, /--exclude '__pycache__'/);
  assert.match(build, /--exclude '\*\.py\[cod\]'/);
  assert.match(build, /--exclude 'tests\/'/);
  assert.doesNotMatch(build, /pip wheel|\.whl/);
  assert.match(build, /"\$repo_root\/deploy\/motionlevels-pc\/"/);
  assert.doesNotMatch(build, /docker|ghcr\.io|git clone/);
});

test("the verified native bundle contains the runtime, menu, and complete display", () => {
  const verify = read("scripts/verify-native-release.py");
  const caddy = read("deploy/motionlevels-pc/Caddyfile");
  const runtime = read("deploy/motionlevels-pc/venue-runtime");

  assert.match(verify, /bundle\.get\("venueRuntime"/);
  assert.match(verify, /bundle\.get\("playerMenu"/);
  assert.match(verify, /bundle\.get\("playerDisplay".*"entry"/);
  assert.match(verify, /bundle\.get\("playerDisplay".*"shellEntry"/);
  assert.match(verify, /native release root must have mode 0755/);
  assert.match(verify, /development-only Python content is not allowed/);
  assert.match(caddy, /current\/game-bundles\/motion-levels-games\/current\/menu/);
  assert.match(caddy, /current\/game-bundles\/motion-levels-games\/current\/display/);
  assert.match(caddy, /handle_path \/camera-recorder\/\*/);
  assert.match(caddy, /reverse_proxy 127\.0\.0\.1:8040/);
  assert.match(runtime, /venue\/runtime\.mjs/);
  assert.match(runtime, /exec "\$node_binary" "\$runtime_entry"/);
});

test("native cutover safety precedes live replacement and services activate in dependency order", () => {
  const playbook = read("ansible/playbooks/venue.yml");
  const installLive = read("ansible/tasks/install-native-live.yml");
  const workloadGate = playbook.indexOf("Refuse to interrupt active camera workloads during cutover");
  const idleGate = playbook.indexOf("Require an idle venue before disrupting runtime services");
  const liveReplacement = playbook.indexOf("Replace live native files inside the rollback boundary");
  const coreActivation = playbook.indexOf("Enable and restart native core services in dependency order");
  const caddyActivation = playbook.indexOf("Enable and restart Caddy on the activated release");
  const displayActivation = playbook.indexOf("Enable and restart the kiosk and hotplug watchdog");

  assert.ok(workloadGate >= 0 && workloadGate < liveReplacement);
  assert.ok(idleGate >= 0 && idleGate < liveReplacement);
  assert.match(installLive, /Render the venue runtime environment/);
  assert.match(installLive, /Render the venue-specific Caddy configuration/);
  assert.match(installLive, /Install native systemd units from the release/);
  assert.match(playbook, /genuinely fresh idle host/);
  assert.ok(coreActivation >= 0 && coreActivation < caddyActivation);
  assert.ok(caddyActivation < displayActivation);
});

test("hardware state is observable at runtime but never gates deployment", () => {
  const ansibleConfig = read("ansible.cfg");
  const caddy = read("deploy/motionlevels-pc/Caddyfile");
  const playbook = read("ansible/playbooks/venue.yml");
  const safety = read("ansible/tasks/verify-camera-cutover-safety.yml");
  const udev = read("ansible/templates/72-motion-levels-gopro.rules.j2");
  const makefile = read("Makefile");
  const groupVars = read("ansible/inventory/production/group_vars/all.yml");
  const hostVars = read("ansible/inventory/production/host_vars/motionlevels-1.yml");

  for (const source of [playbook, groupVars, hostVars]) {
    assert.doesNotMatch(source, /CAMERA-OFFLINE|camera_offline_maintenance|offline-maintenance/);
  }
  assert.doesNotMatch(playbook, /\/readyz|status\?refresh=true|cameraDetected|displayHealthy|xrandr/);
  assert.match(playbook, /Verify native camera service health independently of hardware/);
  assert.match(playbook, /http:\/\/127\.0\.0\.1:8040\/healthz/);
  assert.match(playbook, /mediaPipelineConfigured/);
  assert.match(playbook, /twitchBroadcast\.configured/);
  assert.match(playbook, /"deployment_health_contract": "software-only"/);
  assert.match(playbook, /"hardware_state_contract": "observed-not-gated"/);
  assert.match(playbook, /Publish non-secret deployed stack metadata/);
  assert.match(playbook, /motion_levels_state_root \}\}\/public\/stack\.json/);
  assert.match(caddy, /handle \/stack\.json[\s\S]*motion_levels_state_root \}\}\/public[\s\S]*Cache-Control "no-store"/);
  assert.doesNotMatch(playbook, /\bifup\b/);
  assert.match(playbook, /Queue exact GoPro hotplug reconciliation without gating activation[\s\S]*timeout[\s\S]*udevadm[\s\S]*failed_when: false/);
  assert.match(safety, /\/capture/);
  assert.match(safety, /\/host-recording/);
  assert.match(safety, /\/broadcasts\/twitch/);
  assert.match(safety, /active_recording_clip/);
  assert.doesNotMatch(safety, /idVendor|idProduct|expected_serial|\/readyz/);
  assert.match(udev, /ATTR\{serial\}=="\{\{ motion_levels_camera\.expected_serial \}\}"/);
  assert.doesNotMatch(makefile, /\/readyz|usb_detected|command_ready/);
  assert.match(ansibleConfig, /ControlMaster=no/);
  assert.match(ansibleConfig, /ServerAliveInterval=10/);
  assert.match(ansibleConfig, /ServerAliveCountMax=3/);
});

test("rollback stops native units first and restores only a known stack", () => {
  const playbook = read("ansible/playbooks/venue.yml");
  const rescue = playbook.indexOf("rescue:", playbook.indexOf("Activate and health-gate the native release"));
  const stopNative = playbook.indexOf("Stop every native unit before rollback", rescue);
  const restoreFiles = playbook.indexOf("Restore every pre-existing live file exactly", rescue);
  const healthCheck = playbook.indexOf("Health-check the restored stack", rescue);

  assert.ok(rescue >= 0);
  assert.ok(stopNative > rescue && stopNative < restoreFiles);
  assert.ok(restoreFiles < healthCheck);
  assert.match(playbook, /motion_levels_pre_cutover_stack == 'native'/);
  assert.match(playbook, /motion_levels_pre_cutover_stack == 'legacy'/);
  assert.match(playbook, /motion_levels_pre_cutover_stack != 'native'/);
  assert.match(playbook, /Refuse to invent a legacy rollback without its source/);
  assert.match(playbook, /motion_levels_legacy_camera_was_running/);
});

test("retired display, audio, and TV broker units are removed after cutover", () => {
  const variables = read("ansible/inventory/production/group_vars/all.yml");
  for (const service of [
    "motion-levels-hdmi-agent.service",
    "motion-levels-audio-keepalive.service",
    "motion-levels-audio.socket",
    "motion-levels-audio@.service",
    "motion-levels-tv.service",
  ]) {
    assert.match(variables, new RegExp(`^\\s+- ${service.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "m"));
  }
});

test("a verified native cutover disables the retired container runtime", () => {
  const playbook = read("ansible/playbooks/venue.yml");
  const variables = read("ansible/inventory/production/group_vars/all.yml");
  const cameraGate = playbook.indexOf("Verify native camera service health independently of hardware");
  const runtimeStop = playbook.indexOf("Stop and disable the retired container runtime");
  const controlCleanup = playbook.indexOf("Remove the retired container control plane after verified cutover");

  assert.ok(cameraGate >= 0 && cameraGate < runtimeStop);
  assert.ok(runtimeStop < controlCleanup);
  assert.match(playbook, /docker\.socket/);
  assert.match(playbook, /docker\.service/);
  assert.match(playbook, /containerd\.service/);
  const cleanupBlock = variables.match(/motion_levels_retired_container_control_paths:\n((?:\s+- \/[^\n]+\n?)+)/);
  assert.ok(cleanupBlock, "retired container cleanup allowlist is missing");
  const cleanupPaths = [...cleanupBlock[1].matchAll(/^\s+- (\/[^\n]+)$/gm)].map((match) => match[1]);
  assert.deepEqual(cleanupPaths.sort(), [
    "/etc/motion-levels/venue",
    "/etc/motion-levels/venue-public",
    "/etc/systemd/system/docker.service.d/motion-levels-firewall.conf",
    "/opt/motion-levels/venue-containers",
    "/usr/local/sbin/motion-levels-container-firewall",
    "/usr/local/sbin/motion-levels-venue-containers",
  ]);
  for (const preserved of [
    "/opt/motion-levels/venue",
    "/var/lib/docker",
    "/var/lib/motion-levels",
    "/var/lib/motion-levels-cameras",
  ]) {
    assert.equal(cleanupPaths.includes(preserved), false, `${preserved} must survive legacy cleanup`);
  }
  assert.match(playbook, /Remove successful and stale cutover rollback snapshots/);
  assert.doesNotMatch(playbook, /state: absent[\s\S]{0,160}\/var\/lib\/docker/);
});

test("cold boot retries optional floor networking and bounds recorder shutdown", () => {
  const floorService = read("deploy/motionlevels-pc/motion-levels-floor-controller.service");
  const installLive = read("ansible/tasks/install-native-live.yml");
  const playbook = read("ansible/playbooks/venue.yml");
  const recorderService = read("deploy/motionlevels-pc/motion-levels-security-recorder.service");
  const recorder = read("deploy/motionlevels-pc/motion-levels-security-recorder.py");

  assert.match(floorService, /^After=.*motion-levels-lan-ip\.service$/m);
  assert.match(floorService, /^Wants=.*motion-levels-lan-ip\.service$/m);
  assert.doesNotMatch(floorService, /^Requires=motion-levels-lan-ip\.service$/m);
  assert.match(playbook, /Enable and restart the venue LAN address reconciler[\s\S]*state: restarted/);
  assert.match(playbook, /Verify the venue LAN address reconciler process[\s\S]*SubState[\s\S]*running/);
  assert.match(installLive, /while :; do[\s\S]*ip link show dev "\$interface"[\s\S]*sleep 10/);
  assert.match(installLive, /Type=simple[\s\S]*Restart=always/);
  assert.match(recorderService, /^TimeoutStopSec=20$/m);
  assert.match(recorderService, /^KillMode=control-group$/m);
  assert.match(recorder, /min\(10\.0, float\(os\.environ\.get\("MOTION_LEVELS_SECURITY_RECORDER_PLATFORM_TIMEOUT_SECONDS"/);
  assert.match(recorder, /stop_event\.wait\(SCAN_SECONDS\)/);
  assert.match(recorder, /if stop_requested:\n\s+break\n\s+upload_pending\(include_newest=True\)/);
  assert.match(recorder, /process\.wait\(timeout=FFMPEG_STOP_TIMEOUT_SECONDS\)/);
});

test("the native camera can traverse to its group-readable API token", () => {
  const playbook = read("ansible/playbooks/venue.yml");
  assert.match(playbook, /Allow the camera account to traverse the shared config directory/);
  assert.match(playbook, /group: motion-levels-cameras\n\s+mode: "0710"/);
});

test("the Twitch stream key stays in a host-owned file", () => {
  const playbook = read("ansible/playbooks/venue.yml");
  const hostVars = read("ansible/inventory/production/host_vars/motionlevels-1.yml");
  const environment = read("ansible/templates/motion-levels-cameras.env.j2");

  assert.match(hostVars, /stream_key_file: \/etc\/motion-levels-cameras\/twitch-stream-key/);
  assert.match(hostVars, /watch_url: https:\/\/www\.twitch\.tv\/motionlevels/);
  assert.match(environment, /^ML_CAMERAS_TWITCH_STREAM_KEY_FILE=\{\{ motion_levels_camera\.twitch\.stream_key_file \}\}$/m);
  assert.match(environment, /^ML_CAMERAS_TWITCH_WATCH_URL=\{\{ motion_levels_camera\.twitch\.watch_url \}\}$/m);
  assert.doesNotMatch(environment, /^ML_CAMERAS_TWITCH_STREAM_KEY=/m);
  assert.match(playbook, /motion_levels_camera\.twitch\.stream_key_file/);
  assert.match(playbook, /group: motion-levels-cameras\n\s+mode: "0440"/);
});

test("the native floor adapter is pinned to the venue LAN source address", () => {
  const hostVars = read("ansible/inventory/production/host_vars/motionlevels-1.yml");
  const environment = read("ansible/templates/motion-levels.env.j2");
  const service = read("deploy/motionlevels-pc/motion-levels-floor-controller.service");

  assert.match(hostVars, /floor:\n\s+#[\s\S]*?source_address: 192\.168\.1\.142/);
  assert.match(environment, /MOTION_LEVELS_FLOOR_SOURCE_IP=\{\{ motion_levels_network\.floor\.source_address \}\}/);
  assert.match(environment, /^MOTION_LEVELS_LIVE_PUSH_FPS=5$/m);
  assert.match(environment, /^MOTION_LEVELS_LOCAL_LIVE_FLOOR_FPS=25$/m);
  assert.match(service, /-floor-source-ip \$\{MOTION_LEVELS_FLOOR_SOURCE_IP\}/);
});

test("every active native host unit has a venue-owned source", () => {
  const variables = read("ansible/inventory/production/group_vars/all.yml");
  const serviceBlock = variables.match(/motion_levels_native_services:\n([\s\S]*?)\nmotion_levels_retired_services:/);
  assert.ok(serviceBlock, "native service inventory is missing");
  const services = [...serviceBlock[1].matchAll(/^\s+-\s+([^\s]+\.service)$/gm)].map((match) => match[1]);
  assert.ok(services.length > 0);

  for (const service of services) {
    const source = service === "motion-levels-cameras.service"
      ? "ansible/templates/motion-levels-cameras.service.j2"
      : `deploy/motionlevels-pc/${service}`;
    assert.equal(fs.existsSync(path.join(repoRoot, source)), true, `${service} has no release source`);
  }
});
