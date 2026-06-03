import type { DisplayColor } from "./api";

export function colorCSS(color: DisplayColor): string {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

export function colorRGB(color: DisplayColor): string {
  return `${color.r}, ${color.g}, ${color.b}`;
}

export function formatClock(ms: number): string {
  const safe = Math.max(0, ms);
  const totalSeconds = Math.ceil(safe / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function phaseLabel(phase: string): string {
  switch (phase) {
    case "intro":
      return "Intro";
    case "ready":
      return "Step on start";
    case "countdown":
      return "Get ready";
    case "running":
      return "Live round";
    case "finished":
      return "Round complete";
    case "ambient":
      return "Ambient mode";
    default:
      return "Waiting";
  }
}
