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

const fallbackEngineURL = "http://127.0.0.1:8082";

export function engineBaseURL(): string {
  return import.meta.env.VITE_GAME_ENGINE_URL || fallbackEngineURL;
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
