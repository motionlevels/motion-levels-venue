export type DisplayColor = {
  r: number;
  g: number;
  b: number;
};

export type DisplayPlayer = {
  index: number;
  label: string;
  color: DisplayColor;
  score: number;
  lives: number;
};

export type DisplayStatus = {
  currentGame: string;
  label: string;
  phase: string;
  difficulty: string;
  playerCount: number;
  players: DisplayPlayer[];
  score: number;
  lives: number;
  startedUnix: number;
  endsUnix: number;
  elapsedMillis: number;
  remainingMillis: number;
  introRemainingMillis: number;
  countdownRemainingMillis: number;
  activeTargets: number;
  audioEnabled: boolean;
  audioMuted: boolean;
  lastEventUnixNanos: number;
  lastEventCue: string;
  lastEventMessage: string;
};

const enginePort = "4102";
const localEngineURL = `http://127.0.0.1:${enginePort}`;

function inferEngineURL(): string {
  if (typeof window === "undefined" || !window.location.hostname || window.location.protocol === "file:") {
    return localEngineURL;
  }
  if (window.location.pathname.startsWith("/display")) {
    return `${window.location.origin}/engine`;
  }
  return `${window.location.protocol}//${window.location.hostname}:${enginePort}`;
}

export function engineBaseURL(): string {
  return import.meta.env.VITE_GAME_ENGINE_URL || inferEngineURL();
}

export async function fetchDisplayStatus(): Promise<DisplayStatus> {
  const response = await fetch(`${engineBaseURL()}/api/display`);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<DisplayStatus>;
}

export function displayEventSource(): EventSource {
  return new EventSource(`${engineBaseURL()}/api/display/events`);
}
