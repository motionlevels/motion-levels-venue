import type { CanonicalStateStore } from "./state-store.js";

export type ShadowSourceOptions = {
  sourceURL: URL;
  intervalMillis: number;
  requestTimeoutMillis: number;
};

export class ShadowSource {
  #timer: NodeJS.Timeout | undefined;
  #running = false;

  lastSuccessUnixMillis = 0;
  lastError = "";
  requests = 0;
  failures = 0;

  constructor(
    private readonly store: CanonicalStateStore,
    private readonly options: ShadowSourceOptions,
  ) {}

  start(): void {
    if (this.#running) return;
    this.#running = true;
    void this.poll();
  }

  stop(): void {
    this.#running = false;
    if (this.#timer !== undefined) clearTimeout(this.#timer);
    this.#timer = undefined;
  }

  async poll(): Promise<void> {
    this.requests += 1;
    try {
      const endpoint = new URL("/api/player-state", this.options.sourceURL);
      const response = await fetch(endpoint, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(this.options.requestTimeoutMillis),
      });
      if (!response.ok) throw new Error(`source returned HTTP ${response.status}`);
      this.store.ingest(await response.json());
      this.lastSuccessUnixMillis = Date.now();
      this.lastError = "";
    } catch (error) {
      this.failures += 1;
      this.lastError = error instanceof Error ? error.message : String(error);
    } finally {
      if (this.#running) {
        this.#timer = setTimeout(() => void this.poll(), this.options.intervalMillis);
        this.#timer.unref();
      }
    }
  }
}
