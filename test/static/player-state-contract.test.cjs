const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");

const root = join(__dirname, "../..");

test("menu and player display share one revisioned runtime state", () => {
  const http = readFileSync(join(root, "game-engine/cmd/game-engine/http.go"), "utf8");
  const displayAPI = readFileSync(join(root, "apps/player-display/src/api.ts"), "utf8");
  const displayApp = readFileSync(join(root, "apps/player-display/src/App.tsx"), "utf8");
  assert.match(http, /\/api\/player-state/);
  assert.match(http, /\/api\/player-state\/events/);
  assert.match(http, /ValidatePlayerExperienceState/);
  assert.match(displayAPI, /\/api\/player-state/);
  assert.match(displayAPI, /\/api\/player-state\/events/);
  assert.match(displayApp, /acceptedPlayerStateRevision/);
  assert.doesNotMatch(displayAPI, /\/api\/display(?:\/events)?/);
});
