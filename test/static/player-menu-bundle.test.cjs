/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const { mkdtemp, mkdir, readFile, rm, writeFile } = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { pathToFileURL } = require("node:url");

const installerURL = pathToFileURL(path.resolve(__dirname, "../../scripts/install-player-menu-from-games-bundle.mjs"));

test("venue images install player-menu assets through the games-aware compatibility stage", async () => {
  const dockerfile = await readFile(path.resolve(__dirname, "../../deploy/motionlevels-pc/venue-bundle.Dockerfile"), "utf8");
  assert.match(dockerfile, /AS player-menu-assets/);
  assert.match(dockerfile, /install-player-menu-from-games-bundle\.mjs/);
  assert.match(dockerfile, /COPY --from=player-menu-assets \/workspace\/player-menu \/srv\/player-menu/);
});

test("prefers the revision-matched games player menu", async () => {
  await withFixture(async ({ vendorRoot, fallbackRoot, outputRoot, revision }) => {
    const menuRoot = path.join(vendorRoot, revision, "menu");
    await mkdir(menuRoot, { recursive: true });
    await writeFile(path.join(menuRoot, "index.html"), "games-menu");
    await writeFile(path.join(vendorRoot, revision, "bundle.json"), JSON.stringify({
      playerMenu: { entry: "menu/index.html", adapterProtocolVersion: 2 },
    }));

    const { installPlayerMenu } = await import(installerURL);
    const result = await installPlayerMenu({ vendorRoot, fallbackRoot, outputRoot });
    assert.equal(result.source, `games:${revision}`);
    assert.equal(await readFile(path.join(outputRoot, "index.html"), "utf8"), "games-menu");
  });
});

test("uses the venue build only for legacy bundles without a menu descriptor", async () => {
  await withFixture(async ({ vendorRoot, fallbackRoot, outputRoot, revision }) => {
    await writeFile(path.join(vendorRoot, revision, "bundle.json"), JSON.stringify({}));
    const { installPlayerMenu } = await import(installerURL);
    const result = await installPlayerMenu({ vendorRoot, fallbackRoot, outputRoot });
    assert.equal(result.source, "venue-fallback");
    assert.equal(await readFile(path.join(outputRoot, "index.html"), "utf8"), "fallback-menu");
  });
});

test("fails closed for an incompatible games player menu", async () => {
  await withFixture(async ({ vendorRoot, fallbackRoot, outputRoot, revision }) => {
    const menuRoot = path.join(vendorRoot, revision, "menu");
    await mkdir(menuRoot, { recursive: true });
    await writeFile(path.join(menuRoot, "index.html"), "future-menu");
    await writeFile(path.join(vendorRoot, revision, "bundle.json"), JSON.stringify({
      playerMenu: { entry: "menu/index.html", adapterProtocolVersion: 3 },
    }));
    const { installPlayerMenu } = await import(installerURL);
    await assert.rejects(
      installPlayerMenu({ vendorRoot, fallbackRoot, outputRoot }),
      /unsupported player-menu adapter protocol 3/,
    );
  });
});

async function withFixture(run) {
  const root = await mkdtemp(path.join(os.tmpdir(), "motion-levels-menu-bundle-"));
  const vendorRoot = path.join(root, "games");
  const fallbackRoot = path.join(root, "fallback");
  const outputRoot = path.join(root, "output");
  const revision = "a".repeat(40);
  try {
    await mkdir(path.join(vendorRoot, revision), { recursive: true });
    await mkdir(fallbackRoot, { recursive: true });
    await writeFile(path.join(fallbackRoot, "index.html"), "fallback-menu");
    await writeFile(path.join(vendorRoot, "pin.json"), JSON.stringify({ sourceRevision: revision, bundlePath: revision }));
    await run({ vendorRoot, fallbackRoot, outputRoot, revision });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
