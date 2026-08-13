import assert from "node:assert/strict";
import test from "node:test";

import { CanonicalStateStore } from "../src/state-store.js";
import { playerState } from "./fixtures.js";

test("accepts only monotonic canonical revisions", () => {
  const store = new CanonicalStateStore();
  assert.equal(store.ingest(playerState(4)), "accepted");
  assert.equal(store.ingest(playerState(4)), "duplicate");
  assert.equal(store.ingest(playerState(3)), "stale");
  assert.equal(store.ingest({ ...playerState(4), score: 12 }), "conflict");
  assert.equal(store.ingest(playerState(5)), "accepted");
  assert.equal(store.current()?.revision, 5);
  assert.deepEqual(store.metrics, { accepted: 2, duplicates: 1, stale: 1, conflicts: 1, invalid: 0 });
});

test("rejects an incomplete state at the contract boundary", () => {
  const store = new CanonicalStateStore();
  assert.throws(() => store.ingest({ contractVersion: 1, revision: 1 }), /missing runId/);
  assert.equal(store.metrics.invalid, 1);
});
