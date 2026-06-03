export type EngineGame = {
  game: string;
  label: string;
  description: string;
  music: string;
  players: boolean;
  minPlayers: number;
  maxPlayers: number;
  volume: number;
};

export type EngineStatus = {
  currentGame: string;
  label: string;
  playerCount: number;
  music: string;
  musicVolume: number;
  audioEnabled: boolean;
  startedUnix: number;
  catalog: EngineGame[];
};

export type SelectGameRequest = {
  game: string;
  playerCount: number;
};

const fallbackEngineURL = "http://127.0.0.1:8082";

export function engineBaseURL(): string {
  return import.meta.env.VITE_GAME_ENGINE_URL || fallbackEngineURL;
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
