/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEVICE_ID?: string;
  readonly VITE_KIOSK_ID?: string;
  readonly VITE_POSTHOG_ENABLED?: string;
  readonly VITE_POSTHOG_HOST?: string;
  readonly VITE_POSTHOG_KEY?: string;
  readonly VITE_POSTHOG_UI_HOST?: string;
  readonly VITE_VENUE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
