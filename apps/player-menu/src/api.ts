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

export type PlatformGameCatalogEntry = {
  id: string;
  engine_game: string;
  label: string;
  description: string;
  catalog_category: string;
  catalog_enabled: boolean;
  catalog_color: string;
  catalog_order: number;
  players_label: string;
  difficulty_label: string;
  duration_label: string;
  mode_label: string;
  audio_label: string;
  min_players: number;
  max_players: number;
  default_music_ref: string;
  default_music_volume: number;
  source_kind: string;
  code_editable: boolean;
  game_source?: Record<string, unknown>;
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

export type AnimationPreview = {
  level: string;
  frames: Array<{ pixels: string }>;
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
  const gatewayMatch = window.location.pathname.match(/^\/gateways\/[^/]+\/menu(?:\/|$)/);
  if (gatewayMatch) {
    return `${window.location.origin}${gatewayMatch[0].replace(/\/menu\/?$/, "/engine")}`;
  }
  if (window.location.pathname.startsWith("/menu") || window.location.pathname.startsWith("/display")) {
    return `${window.location.origin}/engine`;
  }
  return `${window.location.protocol}//${window.location.hostname}:${enginePort}`;
}

export function engineBaseURL(): string {
  return import.meta.env.VITE_GAME_ENGINE_URL || inferEngineURL();
}

function inferPlatformURL(): string {
  if (typeof window === "undefined" || !window.location.origin || window.location.protocol === "file:") {
    return "";
  }
  return window.location.origin;
}

export function platformBaseURL(): string {
  return import.meta.env.VITE_PLATFORM_URL || inferPlatformURL();
}

export async function fetchEngineStatus(): Promise<EngineStatus> {
  const response = await fetch(`${engineBaseURL()}/api/status`);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<EngineStatus>;
}

export async function fetchGameCatalog(): Promise<PlatformGameCatalogEntry[]> {
  const baseURL = platformBaseURL();
  if (!baseURL) return [];
  const response = await fetch(`${baseURL}/api/game-catalog`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const payload = await response.json() as { games?: PlatformGameCatalogEntry[] };
  return Array.isArray(payload.games) ? payload.games : [];
}

export async function fetchAnimationPreview(level: string, frames = 16): Promise<AnimationPreview> {
  const params = new URLSearchParams({ level, frames: String(frames) });
  const response = await fetch(`${engineBaseURL()}/api/animation-preview?${params.toString()}`);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<AnimationPreview>;
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

export type MenuStateEnvelope<TSnapshot = unknown> = {
  kioskId: string;
  version: number;
  updatedUnixMillis: number;
  snapshot: TSnapshot | null;
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

export async function fetchMenuState<TSnapshot = unknown>(): Promise<MenuStateEnvelope<TSnapshot>> {
  const response = await fetch(`${engineBaseURL()}/api/menu-state`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<MenuStateEnvelope<TSnapshot>>;
}

export function postMenuState<TSnapshot>(request: { kioskId: string; snapshot: TSnapshot }) {
  void fetch(`${engineBaseURL()}/api/menu-state`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    keepalive: true,
  }).catch(() => {});
}
