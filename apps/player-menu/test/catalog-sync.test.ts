import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
  shouldPreferCatalogFallbackPreviewAnimation,
  supportedDifficultiesForGame,
} from "../src/catalogSync.ts";
import { platformAnimationCards } from "../src/animationCatalog.ts";
import { inferPlatformURL } from "../src/api.ts";
import type { PlatformGameCatalogEntry } from "../src/api.ts";
import type { GameCard } from "../src/catalog.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  it("uses structured platform player bounds", () => {
    const entry = catalogEntry({ min_players: 2, max_players: 5, players_label: "2-5" });

    assert.deepEqual(platformPlayerBounds(entry), { minPlayers: 2, maxPlayers: 5 });
    assert.equal(platformPlayerRangeLabel(entry), "2-5");
  });

  it("derives ambient player labels from category", () => {
    const entry = catalogEntry({ min_players: 3, max_players: 3, players_label: "Tríos" });

    assert.equal(platformPlayerRangeLabel(entry), "3");
    assert.equal(platformPlayerRangeLabel(catalogEntry({ catalog_category: "attract", min_players: 1, max_players: 1 })), "Todos");
  });

  it("normalizes platform difficulty options and exposes the same label shown in the menu", () => {
    const entry = catalogEntry({ difficulties: ["hard", "medium", "medium", "unknown"] });

    assert.deepEqual(platformSupportedDifficulties(entry), ["medium", "hard"]);
    assert.equal(platformDifficultyLabel(entry), "Media-Difícil");
  });

  it("derives difficulty copy from structured IDs and category", () => {
    const entry = catalogEntry({
      difficulty_label: "1-4 estrellas",
      difficulties: ["easy", "medium", "hard", "expert"],
    });

    assert.equal(platformDifficultyLabel(entry), "Fácil-Experto");
    assert.deepEqual(platformSupportedDifficulties(entry), ["easy", "medium", "hard", "expert"]);
    assert.equal(platformDifficultyLabel(catalogEntry({ catalog_category: "attract", difficulties: ["medium"] })), "Ambiente");
  });

  it("formats estimated duration when no custom duration label is set", () => {
    assert.equal(estimatedDurationLabel(45), "45s");
    assert.equal(estimatedDurationLabel(300), "5 min");
    assert.equal(estimatedDurationLabel(5400), "1h 30 min");
    assert.equal(platformDurationLabel(catalogEntry({ duration_label: "", estimated_duration_seconds: 90 })), "2 min");
    assert.equal(platformDurationLabel(catalogEntry({ duration_label: "Sin límite", estimated_duration_seconds: 0 })), "");
  });

  it("treats support for levels as a catalog-owned flag", () => {
    assert.equal(platformSupportsLevels(catalogEntry({ supports_levels: true })), true);
    assert.equal(platformSupportsLevels(catalogEntry({ supports_levels: false })), false);
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

  it("does not expose the retired aggregate animations launcher", () => {
    const catalogSource = fs.readFileSync(path.resolve(__dirname, "../src/catalog.ts"), "utf8");
    const staticGamesSource = catalogSource
      .slice(catalogSource.indexOf("export const games: GameCard[] = ["))
      .split("\n];")[0];

    assert.equal(/id:\s*"animations"/.test(staticGamesSource), false);
    assert.match(staticGamesSource, /id:\s*"salvapantallas"[\s\S]*?engineGame:\s*"salvapantallas"/);
  });

  it("expands published animations into Ambiente cards without drafts", () => {
    const cards = platformAnimationCards([
      catalogEntry({
        id: "animations",
        engine_game: "animations",
        source_kind: "animations",
        catalog_enabled: false,
        default_music_ref: "Motion/canciones/Ambient.mp3",
        revision_hash: "game-rev",
        levels: [
          {
            id: "11111111-1111-4111-8111-111111111111",
            slug: "aurora",
            label: "Aurora",
            description: "Loop suave",
            status: "published",
            settings_hash: "level-rev",
          },
          {
            id: "22222222-2222-4222-8222-222222222222",
            slug: "draft-loop",
            label: "Draft loop",
            description: "Todavía oculto",
            status: "draft",
            settings_hash: "draft-rev",
          },
        ],
      }),
    ]);

    assert.deepEqual(cards.map((card) => card.id), ["animation-aurora"]);
    assert.equal(cards[0].category, "attract");
    assert.equal(cards[0].engineGame, "animation-aurora");
    assert.equal(cards[0].previewAnimation, "animation-aurora");
    assert.equal(cards[0].previewRevisionHash, "level-rev");
  });

  it("keeps party inside the competitive menu category", () => {
    const catalogSource = fs.readFileSync(path.resolve(__dirname, "../src/catalog.ts"), "utf8");

    assert.equal(/\|\s*"party"/.test(catalogSource), false);
    assert.equal(/id:\s*"party"/.test(catalogSource), false);
    assert.match(catalogSource, /id:\s*"versus"[\s\S]*?label:\s*"Competitivos"/);
  });

  it("keeps the player-facing fallback catalog minimal", () => {
    const catalogSource = fs.readFileSync(path.resolve(__dirname, "../src/catalog.ts"), "utf8");
    const staticGamesSource = catalogSource
      .slice(catalogSource.indexOf("export const games: GameCard[] = ["))
      .split("\n];")[0];

    for (const id of ["memory-lights", "plataformas", "temporada1-niveles", "temporada2", "patrones"]) {
      assert.equal(new RegExp(`id:\\s*"${id}"`).test(staticGamesSource), false);
    }
    assert.match(staticGamesSource, /id:\s*"featured-lava"/);
    assert.match(staticGamesSource, /id:\s*"salvapantallas"/);
  });

  it("keeps catalog preview media cheap to decode", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../src/App.tsx"), "utf8");

    assert.match(appSource, /decoding="async"/);
    assert.match(appSource, /loading=\{compact \? "lazy" : "eager"\}/);
    assert.match(appSource, /richSrc=\{rich \? game\.previewSrc : undefined\}/);
    assert.match(appSource, /richSrcs=\{rich \? gamePreviewSrcs\(game\) : emptyPreviewSources\}/);
    assert.match(appSource, /promoteAnimation=\{rich\}/);
    assert.match(appSource, /renderPartyPreview\(game, \{ compact: true, rich: selected \|\| active \}\)/);
  });

  it("uses revisioned platform preview media for level cards", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../src/App.tsx"), "utf8");

    assert.match(appSource, /catalogDirectAssetSrc\(lvl\.catalog_thumbnail_url\)/);
    assert.match(appSource, /catalogDirectAssetSrc\(lvl\.catalog_preview_url\)/);
    assert.match(appSource, /previewRevisionHash: existing\?\.previewRevisionHash \|\| lvl\.settings_hash \|\| lvl\.updated_at/);
    assert.match(appSource, /src=\{levelThumbnailSrc\(level, game\)\}/);
    assert.match(appSource, /richSrc=\{active \? levelPreviewSrc\(game, level, previewDifficulty\) : undefined\}/);
  });

  it("keeps preview animations as fallback when platform media URLs fail", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../src/App.tsx"), "utf8");
    const helperSource = appSource.slice(
      appSource.indexOf("function catalogPreviewAnimation("),
      appSource.indexOf("function platformEntryToGameCard("),
    );

    assert.match(helperSource, /if \(configured\) return configured;/);
    assert.match(helperSource, /if \(fallback\?\.previewAnimation\) return fallback\.previewAnimation;/);
    assert.doesNotMatch(helperSource, /hasPlatformMedia/);
  });

  it("prefers authored preview animations for engine games without static preview art", () => {
    const lavaFallback = { previewAnimation: "lava" };

    assert.equal(
      shouldPreferCatalogFallbackPreviewAnimation(
        catalogEntry({
          catalog_preview_url: "/api/game-catalog/previews/lava.webp",
          catalog_thumbnail_url: "/api/game-catalog/thumbnails/lava.webp",
          source_kind: "engine_hardcoded",
          supports_levels: false,
        }),
        lavaFallback,
      ),
      true,
    );
    assert.equal(
      shouldPreferCatalogFallbackPreviewAnimation(
        catalogEntry({
          source_kind: "platform_levels",
          supports_levels: true,
        }),
        lavaFallback,
      ),
      false,
    );
    assert.equal(
      shouldPreferCatalogFallbackPreviewAnimation(
        catalogEntry({
          source_kind: "engine_hardcoded",
          supports_levels: false,
        }),
        { previewAnimation: "parkour", thumbnailSrc: "/previews/parkour.webp" },
      ),
      false,
    );
  });
});
