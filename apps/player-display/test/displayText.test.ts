import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { gameTitleES, levelLabelES } from "../src/displayText.ts";

describe("gameTitleES", () => {
  it("uses native runtime ids instead of level labels", () => {
    assert.equal(gameTitleES("memory-lights", "Nivel 3"), "Reto de memoria");
  });

  it("uses catalog labels for level games instead of local id exceptions", () => {
    assert.equal(gameTitleES("parkour", "Parkour"), "Parkour");
    assert.equal(gameTitleES("temporada1-niveles", "Temporada 1"), "Temporada 1");
    assert.equal(gameTitleES("parkour", "level-1-2"), "parkour");
  });

  it("keeps custom labels for unknown non-level games", () => {
    assert.equal(gameTitleES("custom-game", "Juego personalizado"), "Juego personalizado");
  });

  it("does not promote level labels to titles for UUID level games", () => {
    assert.equal(gameTitleES("8b20d467-b2d1-4d62-9ef3-8455adb61393", "Temporada 1 / Nivel 1"), "Juego de niveles");
    assert.equal(gameTitleES("8b20d467-b2d1-4d62-9ef3-8455adb61393", "Parkour"), "Parkour");
  });
});

describe("displayGameTitle wiring", () => {
  it("does not hard-code UUID level games as Temporada 1", () => {
    const source = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
    assert.doesNotMatch(source, /return "Temporada 1";/);
  });
});

describe("levelLabelES", () => {
  it("normalizes human and internal level labels", () => {
    assert.equal(levelLabelES("Nivel 2"), "Nivel 2");
    assert.equal(levelLabelES("level-1-2"), "Nivel 2");
    assert.equal(levelLabelES("Temporada 1 / Nivel 1"), "Nivel 1");
    assert.equal(levelLabelES("temporada1-level-20"), "Nivel 20");
  });

  it("ignores non-level labels", () => {
    assert.equal(levelLabelES("Parkour"), "");
    assert.equal(levelLabelES("Reto de memoria"), "");
  });
});
