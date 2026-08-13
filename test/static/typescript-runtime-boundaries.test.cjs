const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("venue packages the revision-matched TypeScript runtime from bundle v2", () => {
  const dockerfile = read("deploy/motionlevels-pc/venue-bundle.Dockerfile");
  const launcher = read("deploy/motionlevels-pc/venue-game-engine");
  assert.equal(fs.existsSync(path.join(repoRoot, "apps/venue-runtime/package.json")), false);
  assert.match(dockerfile, /AS games-bundle/);
  assert.match(dockerfile, /COPY --from=games-bundle \/workspace\/bundle \/app\/games/);
  assert.match(launcher, /venue\/runtime\.mjs/);
  assert.match(launcher, /exec "\$node_binary" "\$runtime_entry"/);
  assert.match(dockerfile, /cp \/usr\/local\/bin\/node \/release\/bin\/node/);
  assert.doesNotMatch(dockerfile, /go build|\/app\/bin\/game-engine|runtime-build/);
});

test("runtime and proxy use separate read-only copies of one engine token", () => {
  const compose = read("deploy/motionlevels-pc/docker-compose.yml");
  const caddy = read("deploy/motionlevels-pc/Caddyfile.container");
  const playbook = read("ansible/playbooks/venue-containers.yml");
  assert.match(compose, /engine-token-core[\s\S]*target: \/run\/secrets\/engine-token[\s\S]*read_only: true/);
  assert.match(compose, /engine-token-caddy[\s\S]*target: \/run\/secrets\/engine-token[\s\S]*read_only: true/);
  assert.match(caddy, /header_up X-Motion-Levels-Engine-Token/);
  assert.match(playbook, /\("engine-token-core", engine_token, 10001, 10001\)/);
  assert.match(playbook, /\("engine-token-caddy", engine_token, 10003, 10003\)/);
  assert.match(playbook, /os\.chmod\(temporary, 0o400\)/);
});

test("venue runtime owns no audio or physical controller device boundary", () => {
  const compose = read("deploy/motionlevels-pc/docker-compose.yml");
  const engine = compose.slice(compose.indexOf("  engine:"), compose.indexOf("  camera-helper:"));
  const nativeService = read("deploy/motionlevels-pc/motion-levels-game-engine.service");
  const nativePlaybook = read("ansible/playbooks/venue.yml");
  assert.match(engine, /MOTION_LEVELS_CONTROLLER_ADDR: floor-core:4203/);
  assert.match(nativeService, /MOTION_LEVELS_CONTROLLER_ADDR=127\.0\.0\.1:4203/);
  assert.match(nativePlaybook, /MOTION_LEVELS_CONTROLLER_DUPLEX=127\.0\.0\.1:4203/);
  assert.doesNotMatch(engine, /MOTION_LEVELS_AUDIO|\/dev\/|floor-hardware|LED_BROADCAST/);
});
