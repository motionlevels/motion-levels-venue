import type {
  PlayerExperienceLifecycle,
  PlayerExperienceState,
} from "@motion-levels/core";

const requiredFields = [
  "contractVersion",
  "revision",
  "runId",
  "lifecycle",
  "allowedControls",
  "currentGame",
  "venueSessionId",
  "sessionId",
  "label",
  "phase",
  "difficulty",
  "teamName",
  "playerCount",
  "players",
  "score",
  "lives",
  "music",
  "musicVolume",
  "audioEnabled",
  "audioMuted",
  "paused",
  "success",
  "startedUnix",
  "endsUnix",
  "elapsedMillis",
  "remainingMillis",
  "introRemainingMillis",
  "countdownRemainingMillis",
  "activeTargets",
  "lastEventUnixNanos",
  "lastEventCue",
  "lastEventMessage",
  "lastPressureUnix",
  "catalog",
] as const;

const lifecycles = new Set<PlayerExperienceLifecycle>([
  "idle",
  "launching",
  "waiting",
  "starting",
  "running",
  "paused",
  "finished",
  "stopping",
  "error",
]);

export function parsePlayerExperienceState(value: unknown): PlayerExperienceState {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TypeError("player state must be an object");
  }
  const state = value as Record<string, unknown>;
  for (const field of requiredFields) {
    if (!(field in state)) {
      throw new TypeError(`player state is missing ${field}`);
    }
  }
  if (state.contractVersion !== 1) {
    throw new TypeError("unsupported player state contractVersion");
  }
  if (!Number.isSafeInteger(state.revision) || (state.revision as number) < 1) {
    throw new TypeError("player state revision must be a positive safe integer");
  }
  if (typeof state.lifecycle !== "string" || !lifecycles.has(state.lifecycle as PlayerExperienceLifecycle)) {
    throw new TypeError("player state lifecycle is invalid");
  }
  if (typeof state.runId !== "string" || typeof state.currentGame !== "string" || state.currentGame.length === 0) {
    throw new TypeError("player state identity is invalid");
  }
  if (!Array.isArray(state.allowedControls) || !Array.isArray(state.players) || !Array.isArray(state.catalog)) {
    throw new TypeError("player state collection fields are invalid");
  }
  return structuredClone(value) as PlayerExperienceState;
}
