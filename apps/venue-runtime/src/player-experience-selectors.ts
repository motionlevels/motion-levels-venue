import type {
  PlayerExperienceControl,
  PlayerExperienceLifecycle,
} from "@motion-levels/core";

const ambientModes = new Set([
  "salvapantallas",
  "animations",
  "ambient-comet",
  "ambient-pulse",
  "ambient-spark",
  "screensaver",
  "screen-saver",
  "loop",
]);

function isAmbientActivity(game: string): boolean {
  const normalized = game.trim().toLowerCase();
  return ambientModes.has(normalized) || normalized.startsWith("ambient-") || normalized.startsWith("animation-");
}

export function selectLifecycle(game: string, phase: string, paused: boolean): PlayerExperienceLifecycle {
  if (paused) return "paused";
  switch (phase.trim().toLowerCase()) {
    case "idle":
      return isAmbientActivity(game) ? "idle" : "waiting";
    case "loading":
    case "launching":
      return "launching";
    case "waiting":
      return "waiting";
    case "ready":
    case "starting":
    case "countdown":
      return "starting";
    case "finished":
    case "complete":
    case "completed":
      return "finished";
    case "stopping":
      return "stopping";
    case "error":
    case "failed":
      return "error";
    default:
      return isAmbientActivity(game) ? "idle" : "running";
  }
}

export function selectAllowedControls(
  lifecycle: PlayerExperienceLifecycle,
  audioEnabled: boolean,
  audioMuted: boolean,
): PlayerExperienceControl[] {
  if (["idle", "launching", "stopping", "error"].includes(lifecycle)) return [];
  const controls: PlayerExperienceControl[] = [
    lifecycle === "paused" ? "resume" : "pause",
    "restart",
    "exit",
    "narration",
  ];
  if (audioEnabled) {
    controls.push(audioMuted ? "unmute" : "mute", "toggle_mute");
  }
  return controls;
}
