import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { idleLoopSyncDecision } from "../src/runtimeFlow.ts";

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
});
