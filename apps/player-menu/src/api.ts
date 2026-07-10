import type { EngineGame, EngineStatus, PlatformGameCatalogEntry } from "@motion-levels/core";

export type { EngineGame, EngineStatus, PlatformGameCatalogEntry };

export type AnimationPreview = {
  level: string;
  frames: Array<{ pixels: string }>;
};

export type SelectGameRequest = {
  game: string;
  gameLabel?: string;
  platformUrl?: string;
  venueSessionId?: string;
  recordingEnabled?: boolean;
  playerCount: number;
  allowAnyPlayers?: boolean;
  difficulty?: string;
  level?: string;
  levelMode?: "challenge" | "free";
  durationSeconds?: number;
  challengeElapsedMillis?: number;
  challengeAttemptCount?: number;
  narrationEnabled?: boolean;
  countdownFloorOverlay?: boolean;
  teamName?: string;
  config?: Record<string, number | boolean | string>;
  players?: Array<{
    index: number;
    label: string;
    color: { r: number; g: number; b: number };
  }>;
};

const enginePort = "4102";
const localEngineURL = `http://127.0.0.1:${enginePort}`;
const publicPlatformHost = "platform.motionlevels.obis.dev";
export const publicPlatformURL = `https://${publicPlatformHost}`;

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

export function inferPlatformURL(location: Pick<Location, "hostname" | "origin" | "pathname" | "protocol"> = window.location): string {
  if (!location.origin || location.protocol === "file:") {
    return "";
  }
  if (location.pathname.startsWith("/gateways/")) {
    return location.origin;
  }
  const hostname = location.hostname.toLowerCase();
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  const isPlatformHost = hostname === publicPlatformHost;
  if (isLocalHost || isPlatformHost) {
    return location.origin;
  }
  return publicPlatformURL;
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

export async function fetchAnimationPreview(level: string, frames = 16, revision?: string): Promise<AnimationPreview> {
  const params = new URLSearchParams({ level, frames: String(frames) });
  if (revision) params.set("revision", revision);
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
  recordingEnabled?: boolean;
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
