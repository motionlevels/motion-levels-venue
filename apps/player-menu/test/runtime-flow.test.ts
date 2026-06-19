import assert from "node:assert/strict";
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
});
