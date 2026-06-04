import posthog from "posthog-js";
import type { Properties } from "posthog-js";

const defaultPostHogKey = "phc_pmpLzyqQbK6WU3fHtxMUuaSfWF3PA3aYREKpeCLE5Uow";
// Ingestion goes through the reverse proxy at p.obis.dev to dodge ad blockers.
const defaultPostHogHost = "https://p.obis.dev";
// ui_host keeps the toolbar and "view in PostHog" links pointing at the real app.
const defaultPostHogUiHost = "https://us.posthog.com";
const deviceStorageKey = "ml-player-menu-device-id";

function readEnv(name: string): string {
  const value = import.meta.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function analyticsEnabled(): boolean {
  const configured = readEnv("VITE_POSTHOG_ENABLED").toLowerCase();
  if (["1", "true", "yes", "on"].includes(configured)) return true;
  if (["0", "false", "no", "off"].includes(configured)) return false;
  return import.meta.env.PROD;
}

function getDeviceID(): string {
  const configured = readEnv("VITE_KIOSK_ID") || readEnv("VITE_DEVICE_ID");
  if (configured) return configured;

  const existing = localStorage.getItem(deviceStorageKey);
  if (existing) return existing;

  const generated = globalThis.crypto?.randomUUID?.() || `kiosk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(deviceStorageKey, generated);
  return generated;
}

function baseProperties(): Properties {
  return {
    app: "player-menu",
    venue_id: readEnv("VITE_VENUE_ID") || "motion-levels",
    kiosk_id: getDeviceID(),
    kiosk_mode: window.matchMedia("(display-mode: fullscreen)").matches ? "fullscreen" : "browser",
  };
}

export function initMenuAnalytics() {
  const key = readEnv("VITE_POSTHOG_KEY") || defaultPostHogKey;
  if (!analyticsEnabled() || !key) return;

  posthog.init(key, {
    api_host: readEnv("VITE_POSTHOG_HOST") || defaultPostHogHost,
    ui_host: readEnv("VITE_POSTHOG_UI_HOST") || defaultPostHogUiHost,
    defaults: "2026-05-30",
    autocapture: true,
    capture_heatmaps: true,
    capture_pageview: false,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: ".ph-mask",
      blockSelector: ".ph-no-capture",
    },
    loaded: (client) => {
      const props = baseProperties();
      client.identify(`kiosk:${props.kiosk_id}`, props);
      client.group("venue", String(props.venue_id), { app: "player-menu" });
      client.capture("player_menu_opened", props);
    },
  });
}

export function captureMenuEvent(event: string, properties: Properties = {}) {
  if (!analyticsEnabled()) return;
  posthog.capture(`player_menu_${event}`, {
    ...baseProperties(),
    ...properties,
  });
}
