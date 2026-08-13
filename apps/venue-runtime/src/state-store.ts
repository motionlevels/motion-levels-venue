import { isDeepStrictEqual } from "node:util";

import type { PlayerExperienceState } from "@motion-levels/core";

import { parsePlayerExperienceState } from "./contract.js";

export type IngestResult = "accepted" | "duplicate" | "stale" | "conflict";
export type StateListener = (state: PlayerExperienceState) => void;

export class CanonicalStateStore {
  #current: PlayerExperienceState | undefined;
  #listeners = new Set<StateListener>();

  readonly metrics = {
    accepted: 0,
    duplicates: 0,
    stale: 0,
    conflicts: 0,
    invalid: 0,
  };

  ingest(value: unknown): IngestResult {
    let incoming: PlayerExperienceState;
    try {
      incoming = parsePlayerExperienceState(value);
    } catch (error) {
      this.metrics.invalid += 1;
      throw error;
    }

    if (this.#current !== undefined) {
      if (incoming.revision < this.#current.revision) {
        this.metrics.stale += 1;
        return "stale";
      }
      if (incoming.revision === this.#current.revision) {
        if (isDeepStrictEqual(incoming, this.#current)) {
          this.metrics.duplicates += 1;
          return "duplicate";
        }
        this.metrics.conflicts += 1;
        return "conflict";
      }
    }

    this.#current = incoming;
    this.metrics.accepted += 1;
    for (const listener of this.#listeners) {
      listener(structuredClone(incoming));
    }
    return "accepted";
  }

  current(): PlayerExperienceState | undefined {
    return this.#current === undefined ? undefined : structuredClone(this.#current);
  }

  subscribe(listener: StateListener): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }
}
