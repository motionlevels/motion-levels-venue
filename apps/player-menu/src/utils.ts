// Color math lives in the shared core package (also used by player-display).
export { hexToRGB, hexToColor, mix } from "@motion-levels/core";

export function initials(value: string): string {
  return value.trim().slice(0, 1).toUpperCase() || "?";
}
