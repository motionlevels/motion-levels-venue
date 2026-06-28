import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { gameTitleES, levelLabelES } from "../src/displayText.ts";

describe("gameTitleES", () => {
  it("uses known game ids instead of level labels", () => {
    assert.equal(gameTitleES("parkour", "level-1-2"), "Parkour");
    assert.equal(gameTitleES("memory-lights", "Nivel 3"), "Reto de memoria");
  });

  it("keeps custom labels for unknown non-level games", () => {
    assert.equal(gameTitleES("custom-game", "Juego personalizado"), "Juego personalizado");
  });
});

describe("levelLabelES", () => {
  it("normalizes human and internal level labels", () => {
    assert.equal(levelLabelES("Nivel 2"), "Nivel 2");
    assert.equal(levelLabelES("level-1-2"), "Nivel 2");
    assert.equal(levelLabelES("temporada1-level-20"), "Nivel 20");
  });

  it("ignores non-level labels", () => {
    assert.equal(levelLabelES("Parkour"), "");
    assert.equal(levelLabelES("Reto de memoria"), "");
  });
});
