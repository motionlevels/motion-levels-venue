import type { DisplayPlayer, DisplayStatus } from "@motion-levels/core";

export type { DisplayPlayer, DisplayStatus };

const enginePort = "4102";
const localEngineURL = `http://127.0.0.1:${enginePort}`;

function inferEngineURL(): string {
  if (typeof window === "undefined" || !window.location.hostname || window.location.protocol === "file:") {
    return localEngineURL;
  }
  const gatewayMatch = window.location.pathname.match(/^\/gateways\/[^/]+\/display(?:\/|$)/);
  if (gatewayMatch) {
    return `${window.location.origin}${gatewayMatch[0].replace(/\/display\/?$/, "/engine")}`;
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
