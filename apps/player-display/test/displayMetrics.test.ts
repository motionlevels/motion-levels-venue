import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { heartMeterSlotCount, levelDisplayLives, levelDisplayTimeMillis } from "../src/displayMetrics.ts";

describe("levelDisplayTimeMillis", () => {
  it("uses whole-challenge remaining time for challenge-mode level games", () => {
    assert.equal(levelDisplayTimeMillis({
      levelMode: "challenge",
      remainingMillis: 12000,
      sessionRemainingMillis: 551400,
      challengeElapsedMillis: 174000,
      elapsedMillis: 48600,
      sessionElapsedMillis: 48600,
    }), 551400);
  });

  it("falls back to the engine remaining clock instead of elapsed time on older payloads", () => {
    assert.equal(levelDisplayTimeMillis({
      levelMode: "challenge",
      remainingMillis: 12000,
      challengeElapsedMillis: 174000,
      elapsedMillis: 48600,
      sessionElapsedMillis: 48600,
    }), 12000);
  });
});

describe("levelDisplayLives", () => {
  it("shows configured starting lives on the completed-level result screen", () => {
    assert.equal(levelDisplayLives({ phase: "finished", lives: 3, livesStart: 7 }), 7);
  });

  it("shows current lives while the level is running", () => {
    assert.equal(levelDisplayLives({ phase: "running", lives: 3, livesStart: 7 }), 3);
  });
});

describe("heartMeterSlotCount", () => {
  it("uses the real finite life count instead of padding to five hearts", () => {
    assert.equal(heartMeterSlotCount(1), 1);
    assert.equal(heartMeterSlotCount(5), 5);
  });
});
