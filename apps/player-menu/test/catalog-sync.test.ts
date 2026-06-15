import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  closestSupportedDifficulty,
  platformDifficultyLabel,
  platformLevelSupportedDifficulties,
  estimatedDurationLabel,
  platformDurationLabel,
  platformPlayerBounds,
  platformPlayerRangeLabel,
  platformSupportedDifficulties,
  platformSupportsLevels,
  playerBoundsForGame,
  rosterForGame,
  supportedDifficultiesForGame,
} from "../src/catalogSync.ts";
import { inferPlatformURL } from "../src/api.ts";
import type { PlatformGameCatalogEntry } from "../src/api.ts";
import type { GameCard } from "../src/catalog.ts";

function catalogEntry(patch: Partial<PlatformGameCatalogEntry> = {}): PlatformGameCatalogEntry {
  return {
    id: "catalog-game",
    engine_game: "catalog-game",
    label: "Catalog Game",
    description: "",
    catalog_category: "team",
    catalog_enabled: true,
    catalog_featured: false,
    catalog_color: "#36d9ff",
    catalog_order: 10,
    players_label: "",
    difficulty_label: "",
    duration_label: "",
    estimated_duration_seconds: 0,
    supports_levels: true,
    mode_label: "",
    audio_label: "",
    min_players: 1,
    max_players: 4,
    difficulties: ["easy", "medium", "hard", "expert"],
    default_music_ref: "",
    default_music_volume: 0.16,
    source_kind: "platform_levels",
    code_editable: false,
    ...patch,
  };
}

describe("catalog metadata sync", () => {
  it("uses the public platform catalog when the menu runs on a direct venue host", () => {
    assert.equal(inferPlatformURL({
      hostname: "motionlevels-cloud-1",
      origin: "http://motionlevels-cloud-1",
      pathname: "/menu/",
      protocol: "http:",
    }), "https://platform.motionlevels.obis.dev");
    assert.equal(inferPlatformURL({
      hostname: "platform.motionlevels.obis.dev",
      origin: "https://platform.motionlevels.obis.dev",
      pathname: "/gateways/motionlevels-cloud-1/menu/",
      protocol: "https:",
    }), "https://platform.motionlevels.obis.dev");
    assert.equal(inferPlatformURL({
      hostname: "localhost",
      origin: "http://localhost:4103",
      pathname: "/menu/",
      protocol: "http:",
    }), "http://localhost:4103");
  });

  it("uses structured platform player bounds instead of stale fallback labels", () => {
    const entry = catalogEntry({ min_players: 2, max_players: 5, players_label: "2-5" });
    const fallback = { players: "1-6" };

    assert.deepEqual(platformPlayerBounds(entry), { minPlayers: 2, maxPlayers: 5 });
    assert.equal(platformPlayerRangeLabel(entry, fallback), "2-5");
  });

  it("keeps custom player labels only when they add information beyond the range", () => {
    const entry = catalogEntry({ min_players: 3, max_players: 3, players_label: "Tríos" });

    assert.equal(platformPlayerRangeLabel(entry), "Tríos");
  });

  it("normalizes platform difficulty options and exposes the same label shown in the menu", () => {
    const entry = catalogEntry({ difficulties: ["hard", "medium", "medium", "unknown"] });

    assert.deepEqual(platformSupportedDifficulties(entry), ["medium", "hard"]);
    assert.equal(platformDifficultyLabel(entry), "Media-Difícil");
  });

  it("keeps catalog difficulty copy while structured IDs drive availability", () => {
    const entry = catalogEntry({
      difficulty_label: "1-4 estrellas",
      difficulties: ["easy", "medium", "hard", "expert"],
    });

    assert.equal(platformDifficultyLabel(entry), "1-4 estrellas");
    assert.deepEqual(platformSupportedDifficulties(entry), ["easy", "medium", "hard", "expert"]);
  });

  it("formats estimated duration when no custom duration label is set", () => {
    assert.equal(estimatedDurationLabel(45), "45s");
    assert.equal(estimatedDurationLabel(300), "5 min");
    assert.equal(estimatedDurationLabel(5400), "1h 30 min");
    assert.equal(platformDurationLabel(catalogEntry({ duration_label: "", estimated_duration_seconds: 90 })), "2 min");
    assert.equal(platformDurationLabel(catalogEntry({ duration_label: "Sin límite", estimated_duration_seconds: 90 })), "Sin límite");
  });

  it("treats support for levels as a catalog-owned flag", () => {
    assert.equal(platformSupportsLevels(catalogEntry({ supports_levels: true }), { supportsLevels: false }), true);
    assert.equal(platformSupportsLevels(catalogEntry({ supports_levels: false }), { supportsLevels: true }), false);
  });

  it("uses game-level difficulty support for menu buttons, with level metadata allowed to narrow it", () => {
    const game = { difficulties: ["medium", "hard"] } as Pick<GameCard, "difficulties">;

    assert.deepEqual(supportedDifficultiesForGame(game), ["medium", "hard"]);
    assert.deepEqual(supportedDifficultiesForGame(game, { difficulties: ["hard"] }), ["hard"]);
  });

  it("uses platform level difficulty settings as the supported menu buttons", () => {
    assert.deepEqual(
      platformLevelSupportedDifficulties({
        difficulty: "medium",
        rules: {
          difficulty_settings: {
            easy: { life: 7 },
            medium: { life: 5 },
            hard: { life: 3 },
            expert: { life: 1 },
          },
        },
      }),
      ["easy", "medium", "hard", "expert"],
    );
  });

  it("never lets level metadata re-enable a difficulty disabled in the game catalog", () => {
    const game = { difficulties: ["medium", "hard"] } as Pick<GameCard, "difficulties">;

    assert.deepEqual(supportedDifficultiesForGame(game, { difficulties: ["easy", "medium", "expert"] }), ["medium"]);
    assert.deepEqual(supportedDifficultiesForGame(game, { difficulties: ["easy", "expert"] }), ["medium", "hard"]);
  });

  it("snaps requested difficulty to the closest supported option", () => {
    assert.equal(closestSupportedDifficulty("expert", ["medium", "hard"]), "hard");
    assert.equal(closestSupportedDifficulty("easy", ["medium", "hard"]), "medium");
  });

  it("uses catalog player bounds for launch roster selection even for category-specific games", () => {
    const game = {
      id: "catalog-individual",
      category: "individual",
      minPlayers: 2,
      maxPlayers: 3,
    } as Pick<GameCard, "category" | "engineGame" | "id" | "maxPlayers" | "minPlayers">;
    const players = [
      { active: true, id: 1 },
      { active: true, id: 2 },
      { active: true, id: 3 },
      { active: true, id: 4 },
      { active: false, id: 5 },
    ];

    assert.deepEqual(playerBoundsForGame(game), { minPlayers: 2, maxPlayers: 3 });
    assert.deepEqual(rosterForGame(game, players).map((player) => player.id), [1, 2, 3]);
  });

  it("keeps legacy category defaults for static cards without structured bounds", () => {
    assert.deepEqual(playerBoundsForGame({ id: "solo", category: "individual" }), { minPlayers: 1, maxPlayers: 1 });
    assert.deepEqual(playerBoundsForGame({ id: "duel", category: "versus" }), { minPlayers: 2, maxPlayers: 4 });
  });
});
