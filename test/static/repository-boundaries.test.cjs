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
  assert.doesNotMatch(build, /pip wheel|\.whl/);
  assert.match(build, /rsync -a "\$repo_root\/deploy\/motionlevels-pc\/"/);
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
  assert.match(caddy, /current\/game-bundles\/motion-levels-games\/current\/menu/);
  assert.match(caddy, /current\/game-bundles\/motion-levels-games\/current\/display/);
  assert.match(caddy, /handle_path \/camera-recorder\/\*/);
  assert.match(caddy, /reverse_proxy 127\.0\.0\.1:8040/);
  assert.match(runtime, /venue\/runtime\.mjs/);
  assert.match(runtime, /exec "\$node_binary" "\$runtime_entry"/);
});

test("the native floor adapter is pinned to the venue LAN source address", () => {
  const hostVars = read("ansible/inventory/production/host_vars/motionlevels-1.yml");
  const environment = read("ansible/templates/motion-levels.env.j2");
  const service = read("deploy/motionlevels-pc/motion-levels-floor-controller.service");

  assert.match(hostVars, /floor:\n\s+#[\s\S]*?source_address: 192\.168\.1\.142/);
  assert.match(environment, /MOTION_LEVELS_FLOOR_SOURCE_IP=\{\{ motion_levels_network\.floor\.source_address \}\}/);
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
