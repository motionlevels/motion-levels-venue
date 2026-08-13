import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import test from "node:test";

import { createRuntimeServer } from "../src/server.js";
import { CanonicalStateStore } from "../src/state-store.js";
import { playerState } from "./fixtures.js";

test("serves canonical state and bounded shadow metrics", async (context) => {
  const store = new CanonicalStateStore();
  store.ingest(playerState(9));
  const source = {
    lastSuccessUnixMillis: Date.now(),
    requests: 3,
    failures: 0,
  };
  const server = createRuntimeServer({ store, source });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  context.after(() => server.close());
  const { port } = server.address() as AddressInfo;

  const health = await fetch(`http://127.0.0.1:${port}/api/health`);
  assert.equal(health.status, 200);
  const healthBody = await health.json() as Record<string, unknown>;
  assert.equal(healthBody.status, "ok");
  assert.equal(healthBody.mode, "shadow");
  assert.equal(healthBody.authoritative, false);
  assert.equal(healthBody.revision, 9);
  assert.equal(typeof healthBody.sourceAgeMillis, "number");

  const state = await fetch(`http://127.0.0.1:${port}/api/player-state`);
  assert.equal(state.status, 200);
  assert.equal((await state.json() as { revision: number }).revision, 9);

  const metrics = await fetch(`http://127.0.0.1:${port}/metrics`);
  assert.equal(metrics.status, 200);
  const metricsBody = await metrics.text();
  assert.match(metricsBody, /motion_levels_venue_runtime_info\{mode="shadow"\} 1/);
  assert.match(metricsBody, /motion_levels_venue_runtime_player_state_revision 9/);
  assert.doesNotMatch(metricsBody, /runId|sessionId|currentGame/);
});
