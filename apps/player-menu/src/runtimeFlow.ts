export type ScreenMode = "browse" | "game";

type IdleLoopSyncInput = {
  launchedGameID: string;
  launchingGameID: string | null;
  screenMode: ScreenMode;
  stoppedLevelGameID: string | null;
};

type IdleLoopSyncDecision =
  | { action: "ignore" }
  | { action: "hold-stopped"; message: string }
  | { action: "hold-launching" }
  | { action: "return-to-browse"; message: string };

export function idleLoopSyncDecision({
  launchedGameID,
  launchingGameID,
  screenMode,
  stoppedLevelGameID,
}: IdleLoopSyncInput): IdleLoopSyncDecision {
  if (screenMode !== "game") return { action: "ignore" };
  if (stoppedLevelGameID && launchedGameID === stoppedLevelGameID) {
    return { action: "hold-stopped", message: "Nivel detenido" };
  }
  if (launchingGameID && launchedGameID === launchingGameID) {
    return { action: "hold-launching" };
  }
  return { action: "return-to-browse", message: "Juego finalizado" };
}
