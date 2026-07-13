/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "../..");

function readRepoFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

test("venue catalog composes its base, authored, and bundled games", () => {
  const runtimeSource = readRepoFile("game-engine/cmd/game-engine/runtime.go");
  const baseCatalog = runtimeSource.slice(
    runtimeSource.indexOf("func baseGameCatalogEntries() []gameCatalogEntry"),
    runtimeSource.indexOf("func gameCatalog(platformURL string) []gameCatalogEntry"),
  );
  const catalog = runtimeSource.slice(
    runtimeSource.indexOf("func gameCatalog(platformURL string) []gameCatalogEntry"),
    runtimeSource.indexOf("func catalogEntry(game string)"),
  );

  for (const game of [
    "parkour",
    "temporada1-niveles",
    "salvapantallas",
    "animations",
    "ambient-comet",
    "ambient-pulse",
    "ambient-spark",
  ]) {
    assert.match(baseCatalog, new RegExp(`Game:\\s*"${game}"`));
  }
  assert.match(catalog, /authored\.CachedCatalog\(\)/);
  assert.match(catalog, /authored\.NativeCatalogEntries\(\)/);
  assert.match(catalog, /motionlevelsgames\.Load/);
  assert.match(catalog, /bundle\.SupportsGame\(game\.ID\)/);
});

test("runtime countdown overlay uses floor-space rotation", () => {
  const source = readRepoFile("game-engine/cmd/game-engine/countdown_overlay.go");

  assert.match(source, /width := patternWidth \* scale/);
  assert.match(source, /height := patternHeight \* scale/);
  assert.match(source, /flippedX := patternWidth - 1 - px/);
  assert.match(source, /flippedY := patternHeight - 1 - py/);
  assert.match(source, /x := startX \+ flippedX\*scale \+ sx/);
  assert.match(source, /y := startY \+ flippedY\*scale \+ sy/);
  assert.match(source, /yellow := animation\.RGB\{R: 255, G: 224, B: 32\}/);
});

test("runtime level results use only plural animation lists", () => {
  const source = readRepoFile("game-engine/internal/games/niveles/niveles.go");

  assert.doesNotMatch(source, /(?<!_)victory_animation(?!s)/);
  assert.doesNotMatch(source, /(?<!_)defeat_animation(?!s)/);
});

test("motion-go config defaults and menu overrides reach native and wasm runtimes", () => {
  const sdkSource = readRepoFile("packages/motiongo/sdk.go");
  const configSource = readRepoFile("game-engine/internal/games/authored/config.go");
  const nativeSource = readRepoFile("game-engine/internal/games/authored/native.go");
  const wasmSource = readRepoFile("game-engine/internal/games/authored/wasm.go");
  const httpSource = readRepoFile("game-engine/cmd/game-engine/http.go");

  assert.match(sdkSource, /Config\s+ConfigValues\s+`json:"config,omitempty"`/);
  assert.match(sdkSource, /func \(c ConfigValues\) Int\(key string, fallback int\) int/);
  assert.match(configSource, /func ResolveConfig\(spec Spec, overrides map\[string\]json\.RawMessage\) map\[string\]json\.RawMessage/);
  assert.match(nativeSource, /Config:\s+ResolveConfig\(entry\.GameSource, configOverrides\),/);
  assert.match(wasmSource, /Config:\s+ResolveConfig\(entry\.GameSource, configOverrides\),/);
  assert.match(httpSource, /Config\s+map\[string\]json\.RawMessage\s+`json:"config"`/);
});

test("ping pong embedded config spec matches its native source", () => {
  const nativeSource = readRepoFile("game-engine/internal/games/authored/native.go");
  const gameSource = readRepoFile(
    "game-engine/internal/games/authored/nativegames/pingpongmotion/game.go",
  );
  const configSpec = nativeSource.slice(
    nativeSource.indexOf("func PingPongConfigSpec() *ConfigSpec"),
    nativeSource.indexOf("func floatPtr(value float64)"),
  );

  assert.match(configSpec, /Key:\s+"points_to_win"[\s\S]*?Default:\s+json\.RawMessage\("7"\)[\s\S]*?Min:\s+floatPtr\(1\)[\s\S]*?Max:\s+floatPtr\(21\)/);
  assert.match(configSpec, /Key:\s+"duration_seconds"[\s\S]*?Default:\s+json\.RawMessage\("120"\)[\s\S]*?Min:\s+floatPtr\(30\)[\s\S]*?Max:\s+floatPtr\(600\)/);
  assert.match(gameSource, /defaultWinningScore\s*= 7/);
  assert.match(gameSource, /defaultDurationNS\s*= int64\(120000000000\)/);
  assert.match(gameSource, /req\.Config\.Int\("points_to_win", defaultWinningScore\)/);
  assert.match(gameSource, /req\.Config\.DurationNS\("duration_seconds", defaultDurationNS\)/);
});

test("engine artifacts use wasip1 and protobuf records are deep-cloned", () => {
  const seedgenTestSource = readRepoFile(
    "game-engine/internal/games/authored/seedgen/seedgen_test.go",
  );
  const recorderSource = readRepoFile("game-engine/internal/sessionrecording/recorder.go");
  const mainSource = readRepoFile("game-engine/cmd/game-engine/main.go");

  assert.match(seedgenTestSource, /"-target=wasip1"/);
  assert.match(recorderSource, /proto\.Clone\(record\)\.\(\*gamepb\.GameSessionRecord\)/);
  assert.match(mainSource, /proto\.Clone\(frame\)\.\(\*recordingpb\.FrameRecord\)/);
  assert.doesNotMatch(mainSource, /tileClone := \*tile/);
});

test("authored runtime carries debug difficulty and level settings", () => {
  const wasmSource = readRepoFile("game-engine/internal/games/authored/wasm.go");
  const runtimeSource = readRepoFile("game-engine/cmd/game-engine/runtime.go");

  assert.match(wasmSource, /Difficulty string\s+`json:"difficulty"`/);
  assert.match(wasmSource, /Level\s+string\s+`json:"level"`/);
  assert.match(wasmSource, /Difficulty:\s*normalizeDifficulty\(difficulty\)/);
  assert.match(runtimeSource, /authored\.NewWithSeedRuntimeConfig\(now, seed, cfg\.Game, cfg\.PlayerCount, whackPlayersFromConfig\(cfg\), cfg\.PlatformURL, cfg\.Difficulty, cfg\.Level, cfg\.AuthoredRuntime, cfg\.GameConfig\)/);
});

test("menu venue sessions can opt out of camera recording without hiding the session", () => {
  const httpSource = readRepoFile("game-engine/cmd/game-engine/http.go");
  const venueSource = readRepoFile("game-engine/cmd/game-engine/venue.go");
  const runtimeSource = readRepoFile("game-engine/cmd/game-engine/runtime.go");
  const testSource = readRepoFile("game-engine/cmd/game-engine/main_test.go");

  assert.match(httpSource, /RecordingEnabled\s+\*bool\s+`json:"recordingEnabled"`/);
  assert.match(httpSource, /recordingEnabledValue\(request\.RecordingEnabled\)/);
  assert.match(runtimeSource, /venueCameraRecordingEnabled bool/);
  assert.match(venueSource, /func \(r \*gameRuntime\) updateVenueCameraRecordingLocked\(enabled bool, now time\.Time\)/);
  assert.match(venueSource, /Reason:\s+"recording_disabled"/);
  assert.match(venueSource, /func menuEventRecordingEnabled\(properties map\[string\]any\) bool/);
  assert.match(testSource, /TestVenueSessionCanDisableCameraRecorder/);
});

test("native authored games retain their registrations and gameplay defaults", () => {
  const nativeSource = readRepoFile("game-engine/internal/games/authored/native.go");
  const nativeTestSource = readRepoFile("game-engine/internal/games/authored/native_test.go");
  const memorySource = readRepoFile(
    "game-engine/internal/games/authored/nativegames/memorychallengego/game.go",
  );
  const memoriaSource = readRepoFile(
    "game-engine/internal/games/authored/nativegames/memoriav2go/game.go",
  );
  const duelSource = readRepoFile(
    "game-engine/internal/games/authored/nativegames/duelgo/game.go",
  );
  const lavaSource = readRepoFile(
    "game-engine/internal/games/authored/nativegames/lavago/game.go",
  );
  const saltosSource = readRepoFile(
    "game-engine/internal/games/authored/nativegames/saltosgo/game.go",
  );
  const patronesSource = readRepoFile(
    "game-engine/internal/games/authored/nativegames/patronesgo/game.go",
  );

  assert.match(nativeSource, /authored-memory-challenge/);
  assert.match(nativeSource, /memorychallengego\.NewABI/);
  assert.match(nativeTestSource, /TestNativeMemoryChallengeRunsWithoutWASMArtifact/);
  assert.match(memorySource, /gameDurationNS\s*=\s*int64\(90000000000\)/);
  assert.match(memorySource, /pathFadeNS\s*=\s*int64\(1400000000\)/);

  assert.match(nativeSource, /authored-memoria-v2/);
  assert.match(nativeSource, /memoriav2go\.NewABI/);
  assert.match(nativeTestSource, /TestNativeMemoriaV2ProgressiveLevelFlow/);
  assert.match(memoriaSource, /totalLevels\s*=\s*20/);
  assert.match(memoriaSource, /memorizeNS\s*=\s*int64\(5000000000\)/);

  assert.match(nativeSource, /authored-duel/);
  assert.match(nativeSource, /duelgo\.NewABI/);
  assert.match(nativeTestSource, /TestNativeDuelDifficultyControlsFloorFill/);
  assert.match(duelSource, /mediumFillPct\s*=\s*60/);
  assert.match(duelSource, /hardFillPct\s*=\s*90/);

  assert.match(nativeSource, /authored-lava/);
  assert.match(nativeSource, /lavago\.NewABI/);
  assert.match(nativeTestSource, /TestNativeLavaRunsWithLivesAndDamage/);
  assert.match(lavaSource, /countdownNS\s*=\s*int64\(3000000000\)/);
  assert.match(lavaSource, /globalImmunityNS\s*=\s*int64\(1000000000\)/);
  assert.match(lavaSource, /lives:\s*8/);
  assert.match(lavaSource, /lives:\s*4/);

  assert.match(nativeSource, /authored-saltos/);
  assert.match(nativeSource, /saltosgo\.NewABI/);
  assert.match(nativeSource, /authored-patrones/);
  assert.match(nativeSource, /patronesgo\.NewABI/);
  assert.match(nativeTestSource, /TestNativeSaltosAndPatronesRunWithSelectedLevels/);
  assert.match(saltosSource, /saltos\.NewWithSeed\(now, req\.Seed, req\.Level\)/);
  assert.match(patronesSource, /patrones\.NewWithSeed\(now, req\.Seed, len\(req\.Players\), req\.Difficulty, req\.Level\)/);
});
