import assert from "node:assert/strict";
import { cp, mkdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const supportedPlayerMenuAdapterProtocolVersion = 2;

export async function installPlayerMenu({ vendorRoot, fallbackRoot, outputRoot }) {
  const pin = JSON.parse(await readFile(path.join(vendorRoot, "pin.json"), "utf8"));
  assert.match(String(pin.sourceRevision), /^[0-9a-f]{40}$/u, "games pin has an invalid source revision");
  assert.equal(pin.bundlePath, pin.sourceRevision, "games pin path must equal its source revision");

  const bundleRoot = path.join(vendorRoot, pin.bundlePath);
  const manifest = JSON.parse(await readFile(path.join(bundleRoot, "bundle.json"), "utf8"));
  const playerMenu = manifest.playerMenu;

  let sourceRoot = fallbackRoot;
  let source = "venue-fallback";
  if (playerMenu !== undefined) {
    assert.equal(
      playerMenu.adapterProtocolVersion,
      supportedPlayerMenuAdapterProtocolVersion,
      `unsupported player-menu adapter protocol ${playerMenu.adapterProtocolVersion}`,
    );
    assertSafeRelativePath(playerMenu.entry, "player-menu entry");
    const entry = path.join(bundleRoot, ...playerMenu.entry.split("/"));
    await stat(entry);
    sourceRoot = path.dirname(entry);
    source = `games:${pin.sourceRevision}`;
  }

  await stat(path.join(sourceRoot, "index.html"));
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });
  await cp(sourceRoot, outputRoot, { recursive: true });
  return { source, protocolVersion: playerMenu?.adapterProtocolVersion ?? null };
}

function assertSafeRelativePath(value, label) {
  assert.equal(typeof value, "string", `${label} must be a string`);
  const normalized = path.posix.normalize(value);
  assert.ok(value.length > 0 && normalized === value, `${label} must be normalized`);
  assert.ok(normalized !== ".." && !normalized.startsWith("../") && !path.posix.isAbsolute(normalized), `${label} escapes the bundle root`);
}

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const vendorRoot = option("--vendor-root");
  const fallbackRoot = option("--fallback-root");
  const outputRoot = option("--output-root");
  assert.ok(vendorRoot && fallbackRoot && outputRoot, "expected --vendor-root, --fallback-root, and --output-root");
  const result = await installPlayerMenu({ vendorRoot, fallbackRoot, outputRoot });
  console.log(`Installed player menu from ${result.source}`);
}
