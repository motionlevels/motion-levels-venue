/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "../..");

function readRepoFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("cloud-init embeds the canonical venue runtime files", () => {
  const result = spawnSync(
    process.execPath,
    [path.join(repoRoot, "scripts/sync-cloud-init-runtime-files.mjs"), "--check"],
    { cwd: repoRoot, encoding: "utf8" },
  );
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
});

test("games release sync works without GitHub CLI on the self-hosted runner", () => {
  const workflow = readRepoFile(".github/workflows/sync-games-bundle.yml");

  assert.match(workflow, /api\.github\.com\/repos\/\$\{GAMES_REPOSITORY\}\/releases\/tags\/\$\{RELEASE_TAG\}/);
  assert.match(workflow, /api\.github\.com\/repos\/\$\{GAMES_REPOSITORY\}\/releases\/assets\/\$\{asset_id\}/);
  assert.match(workflow, /Accept: application\/octet-stream/);
  assert.match(workflow, /actions\/workflows\/ci\.yml\/dispatches/);
  assert.doesNotMatch(workflow, /\bgh (?:release|workflow)\b/);
});

test("CI supplies native and browser dependencies without privileged runner setup", () => {
  const workflow = readRepoFile(".github/workflows/ci.yml");

  assert.match(workflow, /golang:1\.24-bookworm/);
  assert.match(workflow, /mcr\.microsoft\.com\/playwright:v1\.62\.1-noble/);
  assert.match(workflow, /--user "\$\(id -u\):\$\(id -g\)"/);
  assert.match(workflow, /--volume "\$GITHUB_WORKSPACE:\/workspace:ro"/);
  assert.match(workflow, /git config --global --add safe\.directory \/workspace/);
  assert.doesNotMatch(workflow, /sudo apt-get|playwright install --with-deps/);
});

test("venue core services are non-root, read-only, capability-dropped containers", () => {
  const compose = readRepoFile("deploy/motionlevels-pc/docker-compose.yml");
  const bundleDockerfile = readRepoFile("deploy/motionlevels-pc/venue-bundle.Dockerfile");
  const playerEntrypoint = readRepoFile("deploy/motionlevels-pc/motion-levels-player-container");
  const coreServiceNames = ["floor", "engine", "camera-helper", "security-recorder", "caddy"];

  for (let index = 0; index < coreServiceNames.length; index += 1) {
    const name = coreServiceNames[index];
    const next = coreServiceNames[index + 1] || "player";
    const block = compose.slice(compose.indexOf(`  ${name}:`), compose.indexOf(`  ${next}:`));
    assert.match(block, /user: "1000[123]:1000[123]"/);
    assert.match(block, /read_only: true/);
    assert.match(block, /cap_drop: \[ALL\]/);
    assert.match(block, /no-new-privileges=true/);
    assert.doesNotMatch(block, /privileged:/);
    assert.doesNotMatch(block, /\/dev\//);
  }

  assert.match(compose, /^name: motion-levels-venue$/m);
  assert.equal((compose.match(/pull_policy: never/g) || []).length, 6);
  assert.doesNotMatch(compose, /network_mode: host|127\.0\.0\.1:8020:8020/);
  assert.match(compose, /security-recorder:[\s\S]*?stop_grace_period: 2m/);
  assert.doesNotMatch(compose.slice(compose.indexOf("  caddy:"), compose.indexOf("  player:")), /init: true/);
  assert.doesNotMatch(compose.slice(compose.indexOf("  caddy:"), compose.indexOf("  player:")), /cap_add:/);
  assert.match(compose, /player:[\s\S]*?profiles: \[wayland-display\]/);
  assert.match(compose, /player:[\s\S]*?\/dev\/dri\/renderD128:\/dev\/dri\/renderD128/);
  assert.doesNotMatch(compose.slice(compose.indexOf("  player:")), /\/dev\/snd|\/dev\/tty|\/dev\/input/);
  assert.match(compose, /driver: ipvlan[\s\S]*?ipvlan_mode: l2/);
  assert.match(compose, /MOTION_LEVELS_FLOOR_SOURCE_IP: \$\{VENUE_FLOOR_LAN_IPV4:/);
  assert.match(compose, /MOTION_LEVELS_LED_BROADCAST_IP: \$\{VENUE_FLOOR_BROADCAST_IPV4:/);
  const floorBlock = compose.slice(compose.indexOf("  floor:"), compose.indexOf("  engine:"));
  assert.doesNotMatch(floorBlock, /\begress:|\bdns:|MOTION_LEVELS_PLATFORM_TOKEN|platform-token/);
  assert.match(floorBlock, /\bcore:|\bfloor-hardware:/);
  assert.match(compose, /core:[\s\S]*?internal: true[\s\S]*?display:[\s\S]*?internal: true/);
  assert.match(bundleDockerfile, /FROM caddy:2-alpine AS caddy-runtime[\s\S]*?setcap -r \/usr\/bin\/caddy/);
  assert.match(
    bundleDockerfile,
    /FROM debian:trixie-slim AS player-runtime[\s\S]*?libegl1[\s\S]*?libgl1-mesa-dri/,
  );
  assert.match(
    playerEntrypoint,
    /rm -f[\s\S]*?SingletonCookie[\s\S]*?SingletonLock[\s\S]*?SingletonSocket/,
  );
  assert.match(playerEntrypoint, /while \[ ! -S "\$socket" \]/);
  assert.doesNotMatch(playerEntrypoint, /Wayland socket .* did not appear|exit 1/);
  assert.ok(
    playerEntrypoint.indexOf("SingletonCookie") < playerEntrypoint.indexOf("exec /usr/bin/chromium"),
  );
  assert.match(
    compose,
    /\[ ! -S \/run\/motion-levels-display\/wayland-0 \] \|\| grep -aq chromium/,
  );
});

test("venue release activation is automated, idle-gated, and rollback-aware", () => {
  const activation = readRepoFile("deploy/motionlevels-pc/activate-venue-containers");
  const service = readRepoFile("deploy/motionlevels-pc/motion-levels-venue-containers.service");
  const playbook = readRepoFile("ansible/playbooks/venue-containers.yml");
  const makefile = readRepoFile("Makefile");
  const ciWorkflow = readRepoFile(".github/workflows/ci.yml");
  const imagesWorkflow = readRepoFile(".github/workflows/images.yml");
  const productionWorkflow = readRepoFile(".github/workflows/deploy-production.yml");
  const reconcileWorkflow = readRepoFile(".github/workflows/reconcile-deployment.yml");
  const deployRequest = readRepoFile("scripts/request-venue-deployment.sh");

  assert.match(activation, /venue_is_idle/);
  assert.match(activation, /venue busy:/);
  assert.match(activation, /restore_after_failure/);
  assert.match(activation, /VENUE_MODE=native/);
  assert.match(activation, /VENUE_COMPOSE_FILE/);
  assert.match(activation, /set_runtime_env_link/);
  assert.match(activation, /prune_old_venue_images/);
  assert.match(activation, /secret\/config-only/);
  assert.doesNotMatch(activation, /same_revision/);
  assert.match(activation, /motion-levels-venue-security-recorder[\s\S]*\/api\/healthz/);
  assert.doesNotMatch(activation, /docker exec motion-levels-venue-floor[\s\S]*?platform\.motionlevels\.obis\.dev/);
  assert.match(activation, /audio_probe \|\| return 1/);
  assert.match(activation, /http:\/\/127\.0\.0\.1\/controller\/health/);
  assert.match(activation, /http:\/\/127\.0\.0\.1\/engine\/api\/health/);
  assert.doesNotMatch(activation, /http:\/\/127\.0\.0\.1:410[12]/);
  assert.match(activation, /up -d --no-build/);
  assert.doesNotMatch(activation, /docker pull|gh api|sleep infinity/);
  assert.match(service, /After=.*tailscaled\.service/);
  assert.match(service, /until \/usr\/sbin\/ip -4 -o address show dev tailscale0/);
  assert.match(service, /test "\$\$attempt" -lt 60/);
  assert.match(playbook, /Pull immutable venue service images/);
  assert.match(playbook, /sha-\{\{ motion_levels_venue_revision\.stdout \| trim \}\}/);
  assert.match(playbook, /Resolve pulled SHA tags to verified registry digests/);
  assert.match(playbook, /org\.opencontainers\.image\.revision/);
  assert.match(playbook, /VENUE_CONFIG_ROOT=\{\{ motion_levels_venue_release_root \}\}/);
  assert.match(playbook, /values\["MOTION_LEVELS_CAMERA_RECORDER_URL"\] = inventory_camera_recorder_url/);
  assert.match(playbook, /Path\("\/etc\/motion-levels\/camera-recorder-token"\)/);
  assert.match(playbook, /Switch to the narrow Wayland display path with X11 rescue/);
  assert.match(playbook, /Commit the verified Wayland backend[\s\S]*line: VENUE_DISPLAY_BACKEND=wayland/);
  assert.match(playbook, /dest: \/etc\/motion-levels\/caddy\.env[\s\S]*MOTION_LEVELS_X5_ENABLED=/);
  assert.match(playbook, /motion-levels-x5\.conf[\s\S]*EnvironmentFile=-\/etc\/motion-levels\/caddy\.env/);
  assert.match(playbook, /MOTION_LEVELS_X5_UPSTREAM=http:\/\/127\.0\.0\.1:8040/);
  assert.doesNotMatch(playbook, /canonical_secret_root/);
  assert.doesNotMatch(playbook, /line: "MOTION_LEVELS_CAMERA_RECORDER_URL=/);
  assert.match(makefile, /rollback-motionlevels-1/);
  assert.match(makefile, /venue-containers\.yml/);
  assert.doesNotMatch(makefile, /deploy-(?:frontends|runtime)-motionlevels-1/);
  assert.doesNotMatch(makefile, /deploy-motionlevels-1-legacy/);
  assert.match(imagesWorkflow, /scripts\/request-venue-deployment\.sh/);
  assert.doesNotMatch(imagesWorkflow, /deploy-production:|VENUE_AUTO_DEPLOY_TOKEN/);
  assert.match(ciWorkflow, /actions\/workflows\/images\.yml\/dispatches/);
  assert.match(ciWorkflow, /release_sha.*\$\{RELEASE_SHA\}/);
  assert.match(imagesWorkflow, /workflow_dispatch:[\s\S]*?release_sha:/);
  assert.match(imagesWorkflow, /RELEASE_SHA: \$\{\{ inputs\.release_sha \|\| github\.event\.workflow_run\.head_sha \}\}/);
  assert.match(imagesWorkflow, /actions\/workflows\/deploy-production\.yml\/dispatches/);
  assert.match(imagesWorkflow, /venue_revision.*\$\{RELEASE_SHA\}/);
  assert.match(
    imagesWorkflow,
    /docker:28-cli@sha256:625d9431a9f54c5a2bc90f24f0e1c3d55b1349fd857dd85035f98c2c9acbdd4d[\s\S]*?compose[\s\S]*?config --quiet/,
  );
  assert.doesNotMatch(`${ciWorkflow}\n${imagesWorkflow}`, /\bgh workflow run\b/);
  assert.match(productionWorkflow, /workflows:[\s\S]*?- Container images[\s\S]*?types:[\s\S]*?- completed/);
  assert.match(productionWorkflow, /workflow_dispatch:[\s\S]*?venue_revision:/);
  assert.match(productionWorkflow, /github\.event\.workflow_run\.conclusion == 'success'/);
  assert.match(productionWorkflow, /VENUE_DEPLOY_REVISION: \$\{\{ inputs\.venue_revision \|\| github\.event\.workflow_run\.head_sha \}\}/);
  assert.match(productionWorkflow, /scripts\/request-venue-deployment\.sh/);
  assert.match(reconcileWorkflow, /cron: "\*\/15 \* \* \* \*"/);
  assert.match(
    reconcileWorkflow,
    /curl --fail[\s\S]*?\$\{GITHUB_API_URL\}\/repos\/\$\{GITHUB_REPOSITORY\}\/actions\/workflows\/images\.yml\/runs\?head_sha=\$\{VENUE_DEPLOY_REVISION\}/,
  );
  assert.match(reconcileWorkflow, /Authorization: Bearer \$GH_TOKEN/);
  assert.match(reconcileWorkflow, /python3 -c .*workflow_runs/);
  assert.doesNotMatch(reconcileWorkflow, /gh run list/);
  assert.match(reconcileWorkflow, /ready=false[\s\S]*?if: steps\.images\.outputs\.ready == 'true'/);
  assert.match(deployRequest, /if \[ "\$status" = 409 \]/);
  assert.match(deployRequest, /--connect-timeout 10[\s\S]*?--max-time 30/);
  assert.match(deployRequest, /deadline=\$\(\( \$\(date \+%s\) \+ 1800 \)\)/);
  assert.match(deployRequest, /succeeded\)[\s\S]*?motionlevels-1 is active/);
  assert.match(deployRequest, /deferred\)[\s\S]*?deployment deferred safely/);
  assert.doesNotMatch(deployRequest, /--limit motionlevels-cloud-1|deploy-standard-venues/);
});

test("controller releases are externally pinned and remain part of atomic venue rollback", () => {
  const lock = JSON.parse(readRepoFile("deploy/motionlevels-pc/venue-components.lock.json"));
  const playbook = readRepoFile("ansible/playbooks/venue-containers.yml");
  const legacyPlaybook = readRepoFile("ansible/playbooks/venue.yml");
  const compose = readRepoFile("deploy/motionlevels-pc/docker-compose.yml");
  const activation = readRepoFile("deploy/motionlevels-pc/activate-venue-containers");
  const bundleDockerfile = readRepoFile("deploy/motionlevels-pc/venue-bundle.Dockerfile");
  const imageWorkflow = readRepoFile(".github/workflows/images.yml");

  assert.deepEqual(lock, {
    schema: "motion-levels-venue-components-v1",
    components: {
      controller: {
        repository: "ghcr.io/motionlevels/motion-levels-controller",
        revision: lock.components.controller.revision,
        platform: "linux/amd64",
        protocol: "v1+v2",
      },
    },
  });
  assert.match(lock.components.controller.revision, /^[0-9a-f]{40}$/);

  assert.match(playbook, /motion_levels_venue_components_lock_path/);
  assert.match(playbook, /motion_levels_venue_image_revisions:[\s\S]*?FLOOR_IMAGE:/);
  assert.match(playbook, /motion_levels_venue_image_architectures:[\s\S]*?FLOOR_IMAGE: amd64/);
  assert.match(playbook, /payload\.get\("Architecture"\)/);
  assert.match(playbook, /io\.motionlevels\.controller\.protocol/);
  assert.match(playbook, /FLOOR_REVISION=\{\{ motion_levels_venue_components_lock/);
  assert.match(playbook, /FLOOR_IMAGE=\{\{ motion_levels_venue_pinned_images\.FLOOR_IMAGE \}\}/);
  assert.match(playbook, /Resolve pulled SHA tags to verified registry digests/);

  assert.match(compose, /com\.motionlevels\.revision: \$\{FLOOR_REVISION:/);
  assert.match(compose, /com\.motionlevels\.release-revision: \$\{VENUE_REVISION:/);
  assert.match(compose, /com\.motionlevels\.protocol: \$\{FLOOR_PROTOCOL:/);
  assert.match(activation, /payload\["components"\]/);
  assert.match(activation, /"ghcr\.io\/motionlevels\/motion-levels-controller"/);
  assert.match(activation, /"ghcr\.io\/motionlevels\/motion-levels-venue-floor"/);
  assert.doesNotMatch(activation, /prefix = "ghcr\.io\/motionlevels\/motion-levels-venue-"/);

  assert.match(legacyPlaybook, /motion_levels_controller_pinned_image/);
  assert.match(legacyPlaybook, /io\.motionlevels\.controller\.protocol/);
  assert.match(legacyPlaybook, /controller_container:\/app\/bin\/motion-levels-controller/);
  assert.match(legacyPlaybook, /release_tmp\/bin\/floor-controller/);
  assert.doesNotMatch(bundleDockerfile, /COPY floor-controller|floor-runtime|bin\/floor-controller/);
  assert.doesNotMatch(imageWorkflow, /name: venue-floor|target: floor-runtime/);
  assert.match(imageWorkflow, /Validate the venue component lock/);
  assert.match(imageWorkflow, /VENUE_LAN_INTERFACE=enp2s0/);
  assert.match(imageWorkflow, /VENUE_FLOOR_LAN_IPV4=192\.168\.1\.143/);
  assert.match(imageWorkflow, /VENUE_FLOOR_BROADCAST_IPV4=255\.255\.255\.255/);
});

test("host hardware is split across exact audio, display, and HDMI boundaries", () => {
  const audio = readRepoFile("deploy/motionlevels-pc/motion-levels-audio@.service");
  const audioKeepalive = readRepoFile(
    "deploy/motionlevels-pc/motion-levels-audio-keepalive.service",
  );
  const audioSocket = readRepoFile("deploy/motionlevels-pc/motion-levels-audio.socket");
  const display = readRepoFile("deploy/motionlevels-pc/motion-levels-display-wayland.service");
  const displayAgent = readRepoFile("deploy/motionlevels-pc/motion-levels-display-agent");
  const hdmi = readRepoFile("deploy/motionlevels-pc/motion-levels-hdmi-agent.service");
  const playbook = readRepoFile("ansible/playbooks/venue-containers.yml");
  const inventory = readRepoFile("ansible/inventory.yaml");

  assert.match(audio, /DevicePolicy=closed/);
  assert.match(audio, /DeviceAllow=\/dev\/snd\/controlC0 rw/);
  assert.match(audio, /DeviceAllow=\/dev\/snd\/pcmC0D5p rw/);
  assert.match(audio, /DeviceAllow=\/dev\/snd\/timer rw/);
  assert.doesNotMatch(audio, /pcmC0D[067]p/);
  assert.doesNotMatch(audio, /\/dev\/snd\/(seq|hwC)/);
  assert.match(audio, /RuntimeMaxSec=4min/);
  assert.match(audioKeepalive, /ExecStart=\/usr\/bin\/aplay .*\/dev\/zero/);
  assert.match(audioKeepalive, /DevicePolicy=closed/);
  assert.match(audioKeepalive, /DeviceAllow=\/dev\/snd\/pcmC0D5p rw/);
  assert.doesNotMatch(audioKeepalive, /pcmC0D[067]p|\/dev\/snd\/(seq|hwC)/);
  assert.match(audioSocket, /Requires=motion-levels-audio-keepalive\.service/);
  assert.match(audioSocket, /After=motion-levels-audio-keepalive\.service/);
  assert.match(display, /DevicePolicy=closed/);
  assert.match(display, /DeviceAllow=\/dev\/dri\/card0 rw/);
  assert.match(display, /DeviceAllow=\/dev\/dri\/renderD128 rw/);
  assert.match(display, /InaccessiblePaths=\/dev\/input/);
  assert.match(displayAgent, /connector_connected\(\)/);
  assert.match(displayAgent, /while ! connector_connected/);
  assert.match(displayAgent, /--log=\/dev\/stderr/);
  assert.doesNotMatch(displayAgent, /--log=\/run\/motion-levels-display\/weston\.log/);
  assert.match(displayAgent, /--socket=wayland-0/);
  assert.match(displayAgent, /export XDG_RUNTIME_DIR=\/run\/motion-levels-display/);
  assert.match(display, /Requires=seatd\.service/);
  assert.match(display, /Environment=LIBSEAT_BACKEND=seatd/);
  assert.doesNotMatch(display, /PAMName=/);
  assert.match(display, /RuntimeDirectoryPreserve=restart/);
  assert.match(display, /ExecStartPre=\+\/usr\/bin\/chvt 7/);
  assert.match(playbook, /- kbd/);
  assert.match(playbook, /- seatd/);
  assert.match(hdmi, /DevicePolicy=closed/);
  assert.match(hdmi, /DeviceAllow=\/dev\/snd\/controlC0 rw/);
  assert.match(inventory, /motion_levels_display_backend: wayland/);
  assert.match(inventory, /motion_levels_camera_recorder_url: http:\/\/172\.30\.53\.1:8040/);
  assert.match(inventory, /motion_levels_floor_lan_ipv4: 192\.168\.1\.143/);
  assert.match(inventory, /motion_levels_floor_broadcast_ipv4: 255\.255\.255\.255/);
  assert.doesNotMatch(inventory, /motion_levels_(?:platform|website|postgres|object_storage):/);
});

test("venue audio reset is ordered and covers container rollback paths", () => {
  const activation = readRepoFile("deploy/motionlevels-pc/activate-venue-containers");
  const stopBroker = activation.slice(
    activation.indexOf("stop_audio_broker()"),
    activation.indexOf("reset_audio_broker()"),
  );
  const rollback = activation.slice(
    activation.indexOf("rollback()"),
    activation.indexOf("restart_runtime()"),
  );
  const activate = activation.slice(
    activation.indexOf("activate()"),
    activation.indexOf("rollback()"),
  );
  const restart = activation.slice(activation.indexOf("restart_runtime()"));

  assert.match(activation, /systemctl is-active --quiet motion-levels-audio-keepalive\.service/);
  assert.match(
    activation,
    /systemctl reload-or-restart motion-levels-container-firewall\.service/,
  );
  assert.match(activation, /systemctl --job-mode=ignore-dependencies stop motion-levels-audio\.socket/);
  assert.match(activation, /systemctl stop 'motion-levels-audio@\*\.service'/);
  assert.ok(stopBroker.indexOf("motion-levels-audio.socket") < stopBroker.indexOf("motion-levels-audio@*.service"));
  assert.ok(stopBroker.indexOf("motion-levels-audio@*.service") < stopBroker.indexOf("motion-levels-audio-keepalive.service"));
  assert.match(
    rollback,
    /reset_audio_broker[\s\S]*?compose "\$previous" up[\s\S]*?reset_audio_broker[\s\S]*?compose "\$current" up/,
  );
  assert.match(
    activate,
    /compose "\$rollback_manifest" stop --timeout 120 engine[\s\S]*?stop_native[\s\S]*?reset_audio_broker/,
  );
  assert.match(
    restart,
    /systemctl stop motion-levels-venue-containers\.service[\s\S]*?reset_audio_broker[\s\S]*?systemctl start motion-levels-venue-containers\.service/,
  );
  assert.match(
    activation,
    /systemctl list-units --failed --no-legend 'motion-levels-audio@\*\.service'/,
  );
  assert.doesNotMatch(
    activation,
    /systemctl --failed --no-legend 'motion-levels-audio@\*\.service'/,
  );
});

test("container, hardware, and Ethernet-only Caddy routes use kernel-visible boundaries", () => {
  const compose = readRepoFile("deploy/motionlevels-pc/docker-compose.yml");
  const firewall = readRepoFile("deploy/motionlevels-pc/motion-levels-container-firewall.nft");
  const caddy = readRepoFile("deploy/motionlevels-pc/Caddyfile.container");
  const nativeCaddy = readRepoFile("deploy/motionlevels-pc/Caddyfile");

  assert.match(firewall, /172\.30\.50\.10[\s\S]*192\.168\.1\.128[\s\S]*tcp dport 554 accept/);
  assert.match(firewall, /172\.30\.50\.11[\s\S]*192\.168\.1\.130 tcp dport 554 accept/);
  assert.match(firewall, /172\.30\.50\.11 ip daddr 192\.168\.1\.1 udp dport 53 accept/);
  assert.match(firewall, /172\.30\.50\.11 ip daddr 192\.168\.1\.1 tcp dport 53 accept/);
  assert.match(firewall, /172\.30\.50\.11 ip daddr 84\.7\.190\.81 tcp dport 443 accept/);
  assert.doesNotMatch(firewall, /172\.30\.50\.11 tcp dport 443 accept/);
  assert.match(firewall, /172\.30\.50\.0\/24 reject/);
  assert.match(firewall, /172\.30\.51\.0\/24 reject/);
  assert.match(firewall, /172\.30\.52\.0\/24 reject/);
  assert.match(firewall, /172\.30\.53\.0\/24 reject/);
  assert.doesNotMatch(firewall, /172\.30\.53\.10/);
  assert.match(firewall, /172\.30\.53\.11 ip daddr 84\.7\.190\.81 tcp dport 443 accept/);
  assert.match(firewall, /192\.168\.1\.143[\s\S]*255\.255\.255\.255 udp dport 4626 accept/);
  assert.match(firewall, /iifname "enp2s0" ip daddr 192\.168\.1\.143 udp dport 7800 accept/);
  assert.match(firewall, /table netdev motion_levels_floor/);
  assert.match(firewall, /hook ingress device "enp2s0"[\s\S]*ip daddr 192\.168\.1\.143 drop/);
  assert.match(firewall, /hook egress device "enp2s0"[\s\S]*ip saddr 192\.168\.1\.143 drop/);
  assert.match(firewall, /172\.30\.54\.0\/24 reject/);

  assert.match(compose, /"127\.0\.0\.1:80:8080"/);
  assert.match(compose, /VENUE_TAILSCALE_IPV4:[^\n]*:80:8080/);
  assert.match(compose, /VENUE_LAN_IPV4:[^\n]*:80:8081/);
  assert.match(compose, /MOTION_LEVELS_PLAYER_URL: http:\/\/caddy-display:8080\/display\//);
  assert.doesNotMatch(compose, /NET_BIND_SERVICE|host\.docker\.internal/);
  assert.match(caddy, /:8080 \{[\s\S]*import venue_common/);
  assert.match(caddy, /:8081 \{[\s\S]*import venue_lan_only[\s\S]*import venue_common/);
  assert.match(caddy, /reverse_proxy floor-core:4101/);
  assert.match(caddy, /reverse_proxy engine-core:4102/);
  assert.match(caddy, /reverse_proxy camera-helper-api:8020/);
  assert.match(compose, /camera-api:[\s\S]*?aliases: \[camera-helper-api\]/);
  assert.doesNotMatch(caddy, /http\.request\.local\.host|127\.0\.0\.1:410[12]|127\.0\.0\.1:8020/);
  assert.match(caddy, /MOTION_LEVELS_X5_ENABLED:0[\s\S]*MOTION_LEVELS_X5_UPSTREAM:http:\/\/172\.30\.53\.1:8040/);
  assert.match(nativeCaddy, /MOTION_LEVELS_X5_ENABLED:0[\s\S]*MOTION_LEVELS_X5_UPSTREAM:127\.0\.0\.1:8040/);
});

test("venue Caddy and cloud-init expose local TV and camera proxy routes", () => {
  const caddySource = readRepoFile("deploy/motionlevels-pc/Caddyfile");
  const cloudInitSource = readRepoFile("deploy/motionlevels-pc/cloud-init.yaml");

  for (const source of [caddySource, cloudInitSource]) {
    assert.match(source, /@platform_tv\s*\{[\s\S]*?path \/tv \/tv\//);
    assert.match(source, /rewrite \* \/salas\/motionlevels-1\/tv/);
    assert.match(source, /@platform_cameras\s*\{[\s\S]*?path \/cameras \/cameras\//);
    assert.match(source, /rewrite \* \/cameras\.html/);
    assert.match(source, /@platform_next\s*\{[\s\S]*?path \/_next\/\*/);
    assert.match(source, /@platform_rooms\s*\{[\s\S]*?path \/api\/rooms\/\*/);
    assert.match(source, /@platform_live_floor\s*\{[\s\S]*?path \/api\/live-floor\/\*/);
  }
  assert.match(caddySource, /header_up Host platform\.motionlevels\.obis\.dev/);
  assert.match(cloudInitSource, /deploy\/motionlevels-pc\/create-motionlevels-venue-vm\.sh/);
  assert.doesNotMatch(cloudInitSource, /deploy\/homelab\/create-motionlevels-venue-vm\.sh/);
});

test("venue game-engine carries the bounded external recording segment policy", () => {
  const makefileSource = readRepoFile("Makefile");
  const playbookSource = readRepoFile("ansible/playbooks/venue.yml");
  const gameEngineServiceSource = readRepoFile(
    "deploy/motionlevels-pc/motion-levels-game-engine.service",
  );

  assert.match(playbookSource, /default\('300', true\)/);
  assert.match(gameEngineServiceSource, /-camera-recorder-segment-seconds \$\{MOTION_LEVELS_CAMERA_RECORDER_SEGMENT_SECONDS\}/);
  assert.match(makefileSource, /deployment-policy/);
  assert.match(makefileSource, /MOTION_LEVELS_CAMERA_RECORDER_SEGMENT_SECONDS="\$\$segment"/);
});

test("venue retains supported X5 settings behind its disabled switch", () => {
  const gatewaySource = readRepoFile("deploy/motionlevels-pc/x5-camera-gateway.compose.yml");
  const envSource = readRepoFile("deploy/motionlevels-pc/motion-levels.env");
  const playbookSource = readRepoFile("ansible/playbooks/venue.yml");
  const caddySource = readRepoFile("deploy/motionlevels-pc/Caddyfile");

  assert.match(gatewaySource, /Dormant compatibility binding/);
  assert.match(gatewaySource, /172\.30\.53\.1:8040:8040/);
  assert.doesNotMatch(gatewaySource, /network_mode:\s*host/);
  assert.match(envSource, /MOTION_LEVELS_CAMERA_VIDEO_PROJECTION_DEFAULT=360/);
  assert.match(envSource, /MOTION_LEVELS_CAMERA_VIDEO_LENS_DEFAULT=all/);
  assert.match(envSource, /^MOTION_LEVELS_CAMERA_RECORDER_URL=$/m);
  assert.doesNotMatch(envSource, /MOTION_LEVELS_CAMERA_RECORDER_PROXY_TARGET=/);
  assert.match(envSource, /MOTION_LEVELS_INSTA360_VIDEO_RESOLUTION=5\.7kplus30/);
  assert.match(playbookSource, /value: 5\.7kplus30/);
  assert.match(playbookSource, /name: motion-levels-camera-recorder\.service[\s\S]*masked: true/);
  assert.match(playbookSource, /\/usr\/local\/bin\/motion-levels-x5ctl/);
  assert.match(playbookSource, /\/opt\/insta360/);
  assert.doesNotMatch(playbookSource, /Build Insta360 camera helper/);
  assert.doesNotMatch(playbookSource, /motion-levels-camera-recorder\.py/);
  assert.match(
    caddySource,
    /handle_path \/camera-recorder\/\* \{[\s\S]*MOTION_LEVELS_X5_ENABLED:0[\s\S]*reverse_proxy @x5_enabled \{\$MOTION_LEVELS_X5_UPSTREAM:127\.0\.0\.1:8040\}[\s\S]*respond 404/,
  );
});

test("venue security recorder is frontal-only by default and provisions idempotently", () => {
  const scriptSource = readRepoFile("deploy/motionlevels-pc/motion-levels-security-recorder.py");
  const envSource = readRepoFile("deploy/motionlevels-pc/motion-levels.env");
  const serviceSource = readRepoFile(
    "deploy/motionlevels-pc/motion-levels-security-recorder.service",
  );
  const playbookSource = readRepoFile("ansible/playbooks/venue.yml");

  assert.match(scriptSource, /CAMERA_ID = os\.environ\.get\("MOTION_LEVELS_SECURITY_CAMERA_ID", "130"\)/);
  assert.match(scriptSource, /\/api\/security-recordings\/init/);
  assert.match(scriptSource, /\/api\/security-recordings\/complete/);
  assert.match(scriptSource, /cleanup_confirmed_local_segments/);
  assert.match(scriptSource, /DELETE_LOCAL_AFTER_UPLOAD = os\.environ\.get\("MOTION_LEVELS_SECURITY_RECORDER_DELETE_LOCAL_AFTER_UPLOAD", "1"\)/);
  assert.match(envSource, /MOTION_LEVELS_SECURITY_CAMERA_ID=130/);
  assert.match(envSource, /MOTION_LEVELS_SECURITY_RECORDER_AUDIO=0/);
  assert.match(envSource, /MOTION_LEVELS_SECURITY_RECORDER_DELETE_LOCAL_AFTER_UPLOAD=1/);
  assert.match(serviceSource, /EnvironmentFile=-\/etc\/motion-levels\/security-recorder\.env/);
  assert.match(playbookSource, /motion-levels-security-recorder\.service/);
  assert.match(playbookSource, /ffmpeg/);
  assert.match(playbookSource, /MOTION_LEVELS_SECURITY_RECORDER_DELETE_LOCAL_AFTER_UPLOAD[\s\S]*?value: "1"/);
});

test("X5 implementation and credentials remain restorable behind one switch", () => {
  const inventorySource = readRepoFile("ansible/inventory.yaml");
  const playbookSource = readRepoFile("ansible/playbooks/venue-containers.yml");
  const gatewayOverride = readRepoFile(
    "deploy/motionlevels-pc/x5-camera-gateway.compose.yml",
  );

  assert.match(inventorySource, /^    motion_levels_x5_enabled: false$/m);
  assert.match(inventorySource, /motion_levels_camera_recorder_url: http:\/\/172\.30\.53\.1:8040/);
  assert.match(inventorySource, /motion_levels_camera_recorder_segment_seconds: 300/);
  assert.match(inventorySource, /motion_levels_x5_caddy_upstream: http:\/\/172\.30\.53\.1:8040/);
  assert.match(playbookSource, /values\["MOTION_LEVELS_X5_ENABLED"\] = "1" if x5_enabled else "0"/);
  assert.match(playbookSource, /values\["MOTION_LEVELS_CAMERA_RECORDER_URL"\] = inventory_camera_recorder_url/);
  assert.match(playbookSource, /camera_recorder_token = ""[\s\S]*if inventory_camera_recorder_url:[\s\S]*camera_recorder_secret\.read_text/);
  assert.match(playbookSource, /MOTION_LEVELS_X5_ENABLED=\{\{[\s\S]*ternary\('1', '0'\)/);
  assert.match(playbookSource, /MOTION_LEVELS_X5_UPSTREAM=\{\{[\s\S]*motion_levels_x5_caddy_upstream[\s\S]*else ''/);
  assert.match(playbookSource, /docker container inspect motion-levels-cameras/);
  assert.match(playbookSource, /docker container rm --force motion-levels-cameras/);
  assert.match(
    playbookSource,
    /Remove an unassigned legacy camera runtime[\s\S]*not \(motion_levels_x5_enabled[\s\S]*motion_levels_camera_recorder_url \| default\(''\) \| length == 0/,
  );
  assert.match(gatewayOverride, /camera-api:[\s\S]*172\.30\.53\.1:8040:8040/);
  assert.doesNotMatch(gatewayOverride, /network_mode:\s*host/);
  assert.match(playbookSource, /dest: "\{\{ motion_levels_venue_config_root \}\}\/x5-camera-gateway\.compose\.yml"/);
});

test("venue owns controller pin updates and all immutable venue images", () => {
  const controllerWorkflow = readRepoFile(".github/workflows/update-controller.yml");
  const imageWorkflow = readRepoFile(".github/workflows/images.yml");
  const bundleDockerfile = readRepoFile("deploy/motionlevels-pc/venue-bundle.Dockerfile");

  assert.match(controllerWorkflow, /workflow_dispatch:/);
  assert.match(controllerWorkflow, /permissions:\s+contents: write/);
  assert.match(controllerWorkflow, /\.components\.controller\.revision = \$revision/);
  assert.match(controllerWorkflow, /git push origin HEAD:main/);
  for (const image of [
    "motion-levels-venue-bundle",
    "motion-levels-venue-engine",
    "motion-levels-venue-camera-helper",
    "motion-levels-venue-security-recorder",
    "motion-levels-venue-caddy",
    "motion-levels-venue-player",
  ]) {
    assert.match(imageWorkflow, new RegExp(`RELEASE_IMAGES:[\\s\\S]*${image}`));
  }
  assert.match(
    imageWorkflow,
    /cache-to: type=gha,mode=max,scope=\$\{\{ matrix\.name \}\},ignore-error=true/,
  );
  assert.equal(
    (bundleDockerfile.match(/LABEL org\.opencontainers\.image\.source="https:\/\/github\.com\/motionlevels\/motion-levels-venue"/g) || []).length,
    6,
  );
  assert.doesNotMatch(
    bundleDockerfile,
    /org\.opencontainers\.image\.source="https:\/\/github\.com\/motionlevels\/motion-levels-platform"/,
  );
});
