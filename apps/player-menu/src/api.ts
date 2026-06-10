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
  venueSessionId: string;
  label: string;
  difficulty: string;
  level?: string;
  teamName: string;
  playerCount: number;
  players?: Array<{
    index: number;
    label: string;
    color: { r: number; g: number; b: number };
    score: number;
    lives: number;
  }>;
  music: string;
  musicVolume: number;
  audioEnabled: boolean;
  audioMuted: boolean;
  paused: boolean;
  phase: string;
  success: boolean;
  introRemainingMillis: number;
  countdownRemainingMillis: number;
  startedUnix: number;
  elapsedMillis: number;
  sessionId: string;
  lastPressureUnix: number;
  finishedLevelAttempts?: Array<{
    attemptId: string;
    game: string;
    level: string;
    levelNumber: number;
    difficulty: string;
    result: string;
    success: boolean;
    elapsedMillis: number;
    endedUnixNanos: number;
  }>;
  catalog: EngineGame[];
};

export type SelectGameRequest = {
  game: string;
  venueSessionId?: string;
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

const enginePort = "4102";
const localEngineURL = `http://127.0.0.1:${enginePort}`;

function inferEngineURL(): string {
  if (typeof window === "undefined" || !window.location.hostname || window.location.protocol === "file:") {
    return localEngineURL;
  }
  if (window.location.pathname.startsWith("/menu") || window.location.pathname.startsWith("/display")) {
    return `${window.location.origin}/engine`;
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

export type VenueSessionRequest = {
  action: "start" | "end";
  venueSessionId: string;
  teamName?: string;
  kioskId?: string;
  reason?: string;
};

export type MenuEventRequest = {
  venueSessionId: string;
  name: string;
  kioskId?: string;
  occurredAtUnixMillis?: number;
  properties?: Record<string, unknown>;
};

// Visit recording is best-effort: the kiosk must never block or surface errors
// because the engine is briefly unreachable, so these are fire-and-forget.
export function postVenueSession(request: VenueSessionRequest) {
  void fetch(`${engineBaseURL()}/api/venue-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    keepalive: true,
  }).catch(() => {});
}

export function postMenuEvent(request: MenuEventRequest) {
  void fetch(`${engineBaseURL()}/api/menu-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    keepalive: true,
  }).catch(() => {});
}
