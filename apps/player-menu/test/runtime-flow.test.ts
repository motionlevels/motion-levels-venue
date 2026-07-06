import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { idleLoopSyncDecision, visibleActiveLevelLaunch } from "../src/runtimeFlow.ts";

describe("runtime screen flow", () => {
  it("keeps the game screen after a level was stopped", () => {
    assert.deepEqual(
      idleLoopSyncDecision({
        launchedGameID: "temporada-1",
        launchingGameID: null,
        screenMode: "game",
        stoppedLevelGameID: "temporada-1",
      }),
      { action: "hold-stopped", message: "Nivel detenido" },
    );
  });

  it("keeps the game screen while a replacement level launch is in flight", () => {
    assert.deepEqual(
      idleLoopSyncDecision({
        launchedGameID: "temporada-1",
        launchingGameID: "temporada-1",
        screenMode: "game",
        stoppedLevelGameID: null,
      }),
      { action: "hold-launching" },
    );
  });

  it("returns to browse only for an idle loop with no stopped or launching level", () => {
    assert.deepEqual(
      idleLoopSyncDecision({
        launchedGameID: "temporada-1",
        launchingGameID: null,
        screenMode: "game",
        stoppedLevelGameID: null,
      }),
      { action: "return-to-browse", message: "Juego finalizado" },
    );
  });

  it("ignores idle sync outside the game screen", () => {
    assert.deepEqual(
      idleLoopSyncDecision({
        launchedGameID: "temporada-1",
        launchingGameID: null,
        screenMode: "browse",
        stoppedLevelGameID: "temporada-1",
      }),
      { action: "ignore" },
    );
  });

  it("shows active level launch progress on the current game screen", () => {
    assert.deepEqual(
      visibleActiveLevelLaunch({
        gameID: "temporada-1",
        launch: { gameID: "temporada-1", levelID: "temporada1-level-20", phase: "loading" },
        screenMode: "game",
      }),
      { gameID: "temporada-1", levelID: "temporada1-level-20", phase: "loading" },
    );
  });

  it("does not show active level launch progress in browse or for another game", () => {
    assert.equal(
      visibleActiveLevelLaunch({
        gameID: "temporada-1",
        launch: { gameID: "temporada-1", levelID: "temporada1-level-20", phase: "stopping" },
        screenMode: "browse",
      }),
      null,
    );
    assert.equal(
      visibleActiveLevelLaunch({
        gameID: "reto-memoria",
        launch: { gameID: "temporada-1", levelID: "temporada1-level-20", phase: "loading" },
        screenMode: "game",
      }),
      null,
    );
  });

  it("advances the selected level after free-mode success so controls follow engine status", () => {
    const source = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
    assert.match(source, /if \(levelModeFor\(game, state\) === "free"\)/);
    assert.match(source, /const difficultyLevels = levelsForDifficulty\(game, difficulty\);/);
    assert.match(source, /const nextLevel = finishedIndex >= 0 \? difficultyLevels\[finishedIndex \+ 1\] : null;/);
    assert.match(source, /\[game\.id\]: nextLevel\.id/);
  });

  it("does not use catalog estimated duration as a level-game time limit", () => {
    const source = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
    assert.match(source, /durationSeconds: launchGame\.levels\?\.length \? undefined : launchGame\.estimatedDurationSeconds \|\| undefined/);
    assert.match(source, /const totalMillis = hasLevels \? 0 : Math\.max\(0, Math\.round\(\(game\.estimatedDurationSeconds \|\| 0\) \* 1000\)\);/);
  });

  it("sends the selected catalog label to the engine for UUID level games", () => {
    const source = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
    assert.match(source, /gameLabel: launchGame\.label/);
  });
});
