import { expect, test, type Page, type Route } from "@playwright/test";

const revision = "games-test";

function displayStatus(score = 7) {
  return {
    currentGame: "motion-levels-games:pong",
    sourceKind: "motion_levels_games",
    sourceRevision: revision,
    label: "Pong",
    phase: "running",
    difficulty: "medium",
    difficultyConfigurable: true,
    playerCount: 2,
    playerConfigurable: true,
    players: [
      { index: 0, label: "Rojo", color: { r: 255, g: 41, b: 56 }, score, lives: -1 },
      { index: 1, label: "Azul", color: { r: 30, g: 120, b: 255 }, score: 3, lives: -1 },
    ],
    score,
    lives: -1,
    startedUnix: 0,
    endsUnix: 0,
    elapsedMillis: 10_000,
    remainingMillis: 50_000,
    introRemainingMillis: 0,
    countdownRemainingMillis: 0,
    activeTargets: 0,
    matchTarget: 10,
    roundHits: 0,
    lastRoundHits: 0,
    lastRoundWinner: "",
    rounds: [],
    audioEnabled: true,
    audioMuted: false,
    lastEventUnixNanos: 0,
    lastEventCue: "",
    lastEventMessage: "",
    gameSnapshot: { score },
  };
}

const successfulRuntime = `
window.MotionLevelsGamesDisplay = {
  revision: ${JSON.stringify(revision)},
  mount(element, input) { this.update(element, input); },
  update(element, input) {
    element.innerHTML = '<section data-testid="game-runtime">Pong runtime · ' + input.snapshot.score + '</section>';
  },
  unmount(element) { element.replaceChildren(); }
};`;

async function mockEngine(page: Page, status: () => object, runtime: (route: Route) => Promise<void>) {
  const heartbeats: Array<Record<string, unknown>> = [];
  await page.route("**/engine/api/display/events", (route) => route.abort());
  await page.route(/\/engine\/api\/display$/u, (route) => route.fulfill({ json: status() }));
  await page.route("**/engine/api/display-client", async (route) => {
    heartbeats.push(route.request().postDataJSON() as Record<string, unknown>);
    await route.fulfill({ json: { status: "ok" } });
  });
  await page.route(`**/games/${revision}/display/display.js`, runtime);
  return heartbeats;
}

async function serveRuntime(route: Route, body = successfulRuntime) {
  await route.fulfill({ status: 200, contentType: "application/javascript", body });
}

test("loads the exact game display revision and reports a healthy render", async ({ page }) => {
  const heartbeats = await mockEngine(page, () => displayStatus(), (route) => serveRuntime(route));
  await page.goto("/");
  await expect(page.getByTestId("game-runtime")).toHaveText("Pong runtime · 7");
  await expect.poll(() => heartbeats.some((report) => report.renderStatus === "ready" && report.loadedRevision === revision)).toBe(true);
  expect(await page.viewportSize()).toEqual({ width: 1920, height: 1080 });
});

test("keeps the generic HUD visible while a failed bundle retries", async ({ page }) => {
  let requests = 0;
  await mockEngine(page, () => displayStatus(), async (route) => {
    requests += 1;
    if (requests === 1) {
      await route.abort();
      return;
    }
    await serveRuntime(route);
  });
  await page.goto("/");
  await expect(page.getByText("Pong", { exact: true })).toBeVisible();
  await expect(page.getByTestId("game-runtime")).toHaveText("Pong runtime · 7");
  expect(requests).toBeGreaterThanOrEqual(2);
});

test("falls back safely when the game runtime reports a render error", async ({ page }) => {
  const heartbeats = await mockEngine(page, () => displayStatus(), (route) =>
    serveRuntime(
      route,
      `window.MotionLevelsGamesDisplay = {
        revision: ${JSON.stringify(revision)},
        mount(element, input) { input.onError(new Error('render boom')); },
        update() {},
        unmount(element) { element.replaceChildren(); }
      };`,
    ),
  );
  await page.goto("/");
  await expect(page.getByText("Pong", { exact: true })).toBeVisible();
  await expect(page.getByTestId("game-runtime")).toHaveCount(0);
  await expect.poll(() => heartbeats.some((report) => report.renderStatus === "error" && report.error === "render boom")).toBe(true);
});

test("recovers current game state through polling when the SSE feed is unavailable", async ({ page }) => {
  let polls = 0;
  await mockEngine(
    page,
    () => {
      polls += 1;
      return displayStatus(polls === 1 ? 1 : 9);
    },
    (route) => serveRuntime(route),
  );
  await page.goto("/");
  await expect(page.getByTestId("game-runtime")).toHaveText("Pong runtime · 9", { timeout: 5_000 });
  expect(polls).toBeGreaterThanOrEqual(2);
});
