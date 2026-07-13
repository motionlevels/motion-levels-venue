/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "../..");

function readRepoFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("player menu derives party player bounds from mini-game intersections", () => {
  const source = readRepoFile("apps/player-menu/src/App.tsx");

  assert.match(source, /function derivedPartyPlayerBounds\(game: GameCard, catalogGames: GameCard\[\]\): PlayerBounds/);
  assert.match(source, /const minPlayers = Math\.max\(\.\.\.miniGameBounds\.map\(\(bounds\) => bounds\.minPlayers\)\)/);
  assert.match(source, /const maxPlayers = Math\.min\(\.\.\.miniGameBounds\.map\(\(bounds\) => bounds\.maxPlayers\)\)/);
  assert.match(source, /return applyDerivedPartyPlayerRanges\(orderedGames\)/);
  assert.match(source, /players,\s*\n\s*\}/);
});

test("player menu honors no-player requirements from catalog synchronization", () => {
  const appSource = readRepoFile("apps/player-menu/src/App.tsx");
  const syncSource = readRepoFile("apps/player-menu/src/catalogSync.ts");

  assert.match(syncSource, /export const noPlayerRequirementLabel = "Sin requisito"/);
  assert.match(syncSource, /export function gameRequiresPlayerCount/);
  assert.match(syncSource, /if \(game\.allowAnyPlayers\) return false;/);
  assert.match(syncSource, /"sin selector", "sin requisito"/);
  assert.match(syncSource, /if \(entry\.allow_any_players \|\| !gameRequiresPlayerCount\(\{ allowAnyPlayers: false, players: entry\.players_label \}\)\) return noPlayerRequirementLabel/);
  assert.match(syncSource, /if \(game\.allowAnyPlayers \|\| \(typeof game\.players === "string" && !gameRequiresPlayerCount\(game\)\)\) return \{ minPlayers: 1, maxPlayers: 99 \}/);
  assert.match(appSource, /if \(!gameRequiresPlayerCount\(game\)\) return noPlayerRequirementLabel/);
});

test("player display recognizes screensaver and level modes without legacy labels", () => {
  const source = readRepoFile("apps/player-display/src/App.tsx");
  const cssSource = readRepoFile("apps/player-display/src/styles.css");

  assert.match(source, /if \(isScreensaverDisplay\(liveStatus\)\) \{\s*return <ScreensaverDisplay \/>;\s*\}/);
  assert.match(source, /function ScreensaverDisplay\(\)[\s\S]*className="display screensaver-display"[\s\S]*className="screensaver-logo"/);
  assert.match(source, /case "screensaver":[\s\S]*currentGame: "salvapantallas"/);
  assert.doesNotMatch(source, /label === "salvapantallas"/);
  assert.match(source, /function isLevelGame\([\s\S]*status\.level[\s\S]*status\.levelNumber[\s\S]*status\.levelMode/);
  assert.match(source, /case "levels":/);
  assert.doesNotMatch(source, /currentGame\.includes\("temporada1"\)/);
  assert.doesNotMatch(source, /label\.includes\("temporada 1"\)/);
  assert.doesNotMatch(source, /case "temporada1":/);
  assert.doesNotMatch(source, /currentGame\.includes\("season1"\)/);
  assert.match(cssSource, /\.display\.screensaver-display\s*\{[\s\S]*grid-template-rows: minmax\(0, 1fr\);[\s\S]*place-items: center;/);
  assert.match(cssSource, /\.screensaver-logo\s*\{[\s\S]*width: min\(68vw, 82vh, 900px\);[\s\S]*motion-levels-icon\.png/);
});

test("kiosk previews render both apps at their fixed TV viewport", () => {
  const displaySource = readRepoFile("apps/player-display/src/main.tsx");
  const menuSource = readRepoFile("apps/player-menu/src/main.tsx");

  for (const source of [displaySource, menuSource]) {
    assert.match(source, /function fixedKioskPreviewViewport\(\)/);
    assert.match(source, /new URLSearchParams\(window\.location\.search\)\.get\("kioskViewport"\) === `\$\{kioskDesignWidth\}x\$\{kioskDesignHeight\}`/);
    assert.match(source, /if \(fixedKioskPreviewViewport\(\)\) return 1;/);
  }
});

test("player menu uses catalog thumbnail URLs without retired hard-coded routes", () => {
  const source = readRepoFile("apps/player-menu/src/App.tsx");

  assert.match(source, /const thumbnailSrcs = catalogThumbnailMediaSrcs\(entry\);/);
  assert.match(source, /const platformThumbnailSrcs = catalogThumbnailMediaSrcs\(lvl\);/);
  assert.doesNotMatch(source, /game-catalog\/thumbnails/);
});
