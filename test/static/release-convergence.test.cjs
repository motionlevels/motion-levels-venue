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

test("mutable menu release metadata and icons are never cached as immutable", () => {
  const caddy = read("deploy/motionlevels-pc/Caddyfile");
  const png = between(caddy, "handle /motion-levels-icon.png", "handle /motion-levels-icon.webp");
  const webp = between(caddy, "handle /motion-levels-icon.webp", "redir /menu /menu/");

  for (const icon of [png, webp]) {
    assert.match(icon, /Cache-Control "no-cache, max-age=0, must-revalidate"/);
    assert.doesNotMatch(icon, /immutable/);
  }
  assert.match(caddy, /@menu_build path \/build\.json/);
  assert.match(
    caddy,
    /header @menu_build Cache-Control "no-store, max-age=0, must-revalidate"/,
  );
});

test("native activation replaces current and previous through temporary symlinks", () => {
  const playbook = read("ansible/playbooks/venue.yml");
  const activation = between(
    playbook,
    "Activate the native venue release atomically",
    "Install deployed stack metadata",
  );

  assert.match(activation, /current_link="\$root\/\.current\.\$\$\.tmp"/);
  assert.match(activation, /previous_link="\$root\/\.previous\.\$\$\.tmp"/);
  assert.match(activation, /ln -s "\$active" "\$previous_link"/);
  assert.match(activation, /mv -Tf "\$previous_link" "\$root\/previous"/);
  assert.match(activation, /ln -s "\$candidate" "\$current_link"/);
  assert.match(activation, /mv -Tf "\$current_link" "\$root\/current"/);
  assert.doesNotMatch(activation, /ln -sfn/);
  assert.ok(
    activation.indexOf('mv -Tf "$previous_link"') < activation.indexOf('mv -Tf "$current_link"'),
  );
});

test("published stack metadata carries every immutable component revision", () => {
  const playbook = read("ansible/playbooks/venue.yml");
  const metadata = between(
    playbook,
    "Install deployed stack metadata",
    "Publish non-secret deployed stack metadata",
  );

  for (const component of ["controller", "games", "cameras"]) {
    assert.match(metadata, new RegExp(`"${component}": \\{`));
    assert.match(
      metadata,
      new RegExp(`motion_levels_component_lock\\.components\\.${component}\\.revision`),
    );
  }
  assert.match(metadata, /motion_levels_component_lock\.components\.controller\.target/);
  assert.match(metadata, /motion_levels_component_lock\.components\.controller\.protocol/);
});

test("runtime and menu must match the locked games revision before kiosk restart", () => {
  const playbook = read("ansible/playbooks/venue.yml");
  const caddyRestart = playbook.indexOf("Enable and restart Caddy on the activated release");
  const runtimeGate = playbook.indexOf("Verify the public runtime games revision before kiosk restart");
  const menuGate = playbook.indexOf("Verify the player menu build revision before kiosk restart");
  const kioskRestart = playbook.indexOf("Enable and restart the kiosk and hotplug watchdog");

  assert.ok(caddyRestart >= 0 && caddyRestart < runtimeGate);
  assert.ok(runtimeGate < menuGate && menuGate < kioskRestart);

  const runtime = between(
    playbook,
    "Verify the public runtime games revision before kiosk restart",
    "Verify the player menu build revision before kiosk restart",
  );
  assert.match(runtime, /http:\/\/127\.0\.0\.1\/engine\/api\/status/);
  assert.match(runtime, /return_content: true/);
  assert.match(runtime, /get\('sourceRevision', ''\)/);
  assert.match(runtime, /motion_levels_component_lock\.components\.games\.revision/);

  const menu = between(
    playbook,
    "Verify the player menu build revision before kiosk restart",
    "Enable and restart the kiosk and hotplug watchdog",
  );
  assert.match(menu, /http:\/\/127\.0\.0\.1\/menu\/build\.json/);
  assert.match(menu, /return_content: true/);
  assert.match(menu, /get\('gamesSourceRevision', ''\)/);
  assert.match(menu, /motion_levels_component_lock\.components\.games\.revision/);
});
