const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "../..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

test("venue inventory exposes independent kiosk and player display rotations", () => {
  const defaults = read("ansible/inventory/production/group_vars/all.yml");
  const zaragoza = read("ansible/inventory/production/host_vars/motionlevels-zaragoza.yml");
  const environment = read("ansible/templates/motion-levels.env.j2");

  assert.match(defaults, /motion_levels_floor_view:[\s\S]*kiosk_rotation_degrees: 0[\s\S]*player_display_rotation_degrees: 0/);
  assert.match(zaragoza, /motion_levels_floor_view:[\s\S]*kiosk_rotation_degrees: 0[\s\S]*player_display_rotation_degrees: 0/);
  assert.match(environment, /MOTION_LEVELS_KIOSK_FLOOR_ROTATION_DEGREES=/);
  assert.match(environment, /MOTION_LEVELS_PLAYER_DISPLAY_FLOOR_ROTATION_DEGREES=/);
});

test("Caddy publishes a surface-specific no-store client configuration", () => {
  const caddy = read("deploy/motionlevels-pc/Caddyfile");

  assert.match(caddy, /handle \/menu\/venue-config\.json[\s\S]*motion_levels_floor_view\.kiosk_rotation_degrees/);
  assert.match(caddy, /handle \/display\/venue-config\.json[\s\S]*motion_levels_floor_view\.player_display_rotation_degrees/);
  assert.equal((caddy.match(/schema\":\"motion-levels-venue-client-v1/g) || []).length, 2);
  assert.equal((caddy.match(/header Cache-Control "no-store"/g) || []).length >= 2, true);
});
