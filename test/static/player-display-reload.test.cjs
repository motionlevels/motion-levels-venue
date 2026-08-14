const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

function between(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0, `missing start marker: ${startMarker}`);
  assert.ok(end > start, `missing end marker after ${startMarker}: ${endMarker}`);
  return source.slice(start, end);
}

test("deployment converges every games surface before restarting Chromium", () => {
  const playbook = read("ansible/playbooks/venue.yml");
  const caddyRestart = playbook.indexOf("Enable and restart Caddy on the activated release");
  const runtimeGate = playbook.indexOf("Verify the public runtime games revision before kiosk restart");
  const menuGate = playbook.indexOf("Verify the player menu build revision before kiosk restart");
  const displayGate = playbook.indexOf("Verify the player display build revision before kiosk restart");
  const pageBaseline = playbook.indexOf("Record the current player display page before kiosk restart");
  const kioskRestart = playbook.indexOf("Enable and restart the kiosk and hotplug watchdog");
  const playerGate = playbook.indexOf("Verify the activated player display rendered the locked games revision");
  const snapshotGate = playbook.indexOf("Verify the complete venue snapshot");

  assert.ok(caddyRestart >= 0 && caddyRestart < runtimeGate);
  assert.ok(runtimeGate < menuGate && menuGate < displayGate);
  assert.ok(displayGate < pageBaseline && pageBaseline < kioskRestart);
  assert.ok(kioskRestart < playerGate && playerGate < snapshotGate);

  for (const [marker, route] of [
    ["Verify the public runtime games revision before kiosk restart", "/engine/api/status"],
    ["Verify the player menu build revision before kiosk restart", "/menu/build.json"],
    ["Verify the player display build revision before kiosk restart", "/display/build.json"],
  ]) {
    const gate = between(playbook, marker, marker === "Verify the player display build revision before kiosk restart"
      ? "Record the current player display page before kiosk restart"
      : marker === "Verify the player menu build revision before kiosk restart"
        ? "Verify the player display build revision before kiosk restart"
        : "Verify the player menu build revision before kiosk restart");
    assert.match(gate, new RegExp(route.replaceAll("/", "\\/")));
    assert.match(gate, /motion_levels_component_lock\.components\.games\.revision/);
  }

  const baseline = between(
    playbook,
    "Record the current player display page before kiosk restart",
    "Enable and restart the kiosk and hotplug watchdog",
  );
  assert.match(baseline, /http:\/\/127\.0\.0\.1\/engine\/api\/display-client/);
  assert.match(baseline, /register: motion_levels_previous_player_display/);
  assert.match(baseline, /failed_when: false/);

  const restart = between(
    playbook,
    "Enable and restart the kiosk and hotplug watchdog",
    "Verify the activated player display rendered the locked games revision",
  );
  assert.match(restart, /state: restarted/);
  assert.match(restart, /motion_levels_display_services/);
});

test("post-restart convergence requires a new page, exact shell and renderer, and recent paint", () => {
  const playbook = read("ansible/playbooks/venue.yml");
  const gate = between(
    playbook,
    "Verify the activated player display rendered the locked games revision",
    "Verify the complete venue snapshot",
  );

  assert.match(gate, /\.json\.fresh \| default\(false\) \| bool/);
  assert.match(gate, /\.json\.healthy \| default\(false\) \| bool/);
  assert.match(gate, /\.json\.renderStatus \| default\(''\) == 'ready'/);
  assert.match(gate, /\.json\.expectedRevision[\s\S]*motion_levels_component_lock\.components\.games\.revision/);
  assert.match(gate, /\.json\.loadedRevision[\s\S]*motion_levels_component_lock\.components\.games\.revision/);
  assert.match(gate, /\.json\.shellRevision[\s\S]*motion_levels_component_lock\.components\.games\.revision/);
  assert.match(gate, /\.json\.pageLoadedUnixMillis[\s\S]*motion_levels_previous_player_display\.get\('json', \{\}\)\.get\('pageLoadedUnixMillis', 0\)/);
  assert.match(gate, /\.json\.lastPaintUnixMillis/);
  assert.match(gate, /\| abs[\s\S]*<= 15000/);
  assert.match(gate, /retries: 60/);
  assert.match(gate, /delay: 2/);
});

test("display build identity bypasses caches and the kiosk always starts a fresh app", () => {
  const unit = read("deploy/motionlevels-pc/motion-levels-kiosk.service");
  const launcher = read("deploy/motionlevels-pc/motion-levels-player-kiosk");
  const caddy = read("deploy/motionlevels-pc/Caddyfile");
  const display = between(caddy, "handle_path /display/*", "redir /games /games/");

  assert.match(unit, /ExecStart=\/usr\/bin\/xinit \/usr\/local\/bin\/motion-levels-player-kiosk/);
  assert.match(launcher, /exec \/usr\/bin\/chromium .*--app="\$\{target_url\}"/);
  assert.match(display, /@display_assets path \/assets\/\*/);
  assert.match(display, /header @display_assets Cache-Control "public, max-age=31536000, immutable"/);
  assert.match(display, /@display_build path \/build\.json/);
  assert.match(display, /header @display_build Cache-Control "no-store, max-age=0, must-revalidate"/);
  assert.match(display, /header @display_index Cache-Control "no-cache"/);
});
