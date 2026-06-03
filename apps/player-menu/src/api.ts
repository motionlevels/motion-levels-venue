export type EngineGame = {
  game: string;
  label: string;
  description: string;
  music: string;
  players: boolean;
  minPlayers: number;
  maxPlayers: number;
  difficulty: boolean;
  volume: number;
  levels?: Array<{ id: string; label: string; description: string }>;
};

export type EngineStatus = {
  currentGame: string;
  label: string;
  difficulty: string;
  level?: string;
  teamName: string;
  playerCount: number;
  music: string;
  musicVolume: number;
  audioEnabled: boolean;
  audioMuted: boolean;
  paused: boolean;
  phase: string;
  introRemainingMillis: number;
  countdownRemainingMillis: number;
  startedUnix: number;
  catalog: EngineGame[];
};

export type SelectGameRequest = {
  game: string;
  playerCount: number;
  difficulty?: string;
  level?: string;
  narrationEnabled?: boolean;
  teamName?: string;
  players?: Array<{
    index: number;
    label: string;
    color: { r: number; g: number; b: number };
  }>;
};

const enginePort = "8082";
const localEngineURL = `http://127.0.0.1:${enginePort}`;

function inferEngineURL(): string {
  if (typeof window === "undefined" || !window.location.hostname || window.location.protocol === "file:") {
    return localEngineURL;
  }
  return `${window.location.protocol}//${window.location.hostname}:${enginePort}`;
}

export function engineBaseURL(): string {
  return import.meta.env.VITE_GAME_ENGINE_URL || inferEngineURL();
}

export async function fetchEngineStatus(): Promise<EngineStatus> {
  const response = await fetch(`${engineBaseURL()}/api/status`);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<EngineStatus>;
}

export async function selectGame(request: SelectGameRequest): Promise<EngineStatus> {
  const response = await fetch(`${engineBaseURL()}/api/select`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<EngineStatus>;
}

export type ControlGameAction = "pause" | "resume" | "restart" | "exit" | "narration" | "mute" | "unmute" | "toggle_mute";

export async function controlGame(action: ControlGameAction): Promise<EngineStatus> {
  const response = await fetch(`${engineBaseURL()}/api/control`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<EngineStatus>;
}
