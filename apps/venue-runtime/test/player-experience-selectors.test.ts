import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import type { PlayerExperienceControl, PlayerExperienceLifecycle } from "@motion-levels/core";

import { selectAllowedControls, selectLifecycle } from "../src/player-experience-selectors.js";

type SelectorCase = {
  name: string;
  game: string;
  phase: string;
  paused: boolean;
  audioEnabled: boolean;
  audioMuted: boolean;
  lifecycle: PlayerExperienceLifecycle;
  controls: PlayerExperienceControl[];
};

const fixtureURL = new URL("../../../../test/fixtures/player-experience-selectors.json", import.meta.url);
const fixture = JSON.parse(await readFile(fixtureURL, "utf8")) as { schema: string; cases: SelectorCase[] };

test("TypeScript selectors match the language-neutral compatibility fixture", async (context) => {
  assert.equal(fixture.schema, "motion-levels-player-experience-selectors-v1");
  for (const entry of fixture.cases) {
    await context.test(entry.name, () => {
      const lifecycle = selectLifecycle(entry.game, entry.phase, entry.paused);
      assert.equal(lifecycle, entry.lifecycle);
      assert.deepEqual(selectAllowedControls(lifecycle, entry.audioEnabled, entry.audioMuted), entry.controls);
    });
  }
});
