import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const displaySource = readFileSync(new URL("../src/MotionLevelsGamesDisplay.tsx", import.meta.url), "utf8");

test("new games load their revision-matched display while legacy games retain the existing app", () => {
  assert.match(appSource, /liveStatus\.sourceKind === "motion_levels_games"/u);
  assert.match(displaySource, /runtime\?\.revision !== revision/u);
  assert.match(displaySource, /encodeURIComponent\(revision\)\}\/display\/display\.js/u);
  assert.match(displaySource, /pendingRuntime\?\.revision === revision/u);
  assert.match(displaySource, /pendingRuntime\?\.script\.remove\(\)/u);
  assert.match(displaySource, /window\.MotionLevelsGamesDisplay\?\.unmount/u);
});

test("gateway display previews keep game assets on the proxied venue origin", () => {
  assert.match(displaySource, /\/gateways\\\/\[\^\/\]\+\)\\\/display/u);
  assert.match(displaySource, /gateway\[1\]\}\/games/u);
});
