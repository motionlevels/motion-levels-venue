#!/usr/bin/env node

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import {
  cp,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const sourceRevisionPattern = /^[0-9a-f]{40}$/u;
const digestPattern = /^[0-9a-f]{64}$/u;
const releaseTagPattern = /^games-v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/u;
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function importMotionLevelsGamesRelease({
  archivePath,
  checksumPath,
  releaseTag,
  sourceRevision,
  vendorRoot = path.join(repoRoot, "game-bundles/motion-levels-games"),
}) {
  assert.match(String(sourceRevision), sourceRevisionPattern, "source revision must be a full lowercase Git SHA");
  const nextVersion = parseReleaseTag(releaseTag);
  const archiveName = `motion-levels-games-${sourceRevision}.tgz`;
  assert.equal(path.basename(archivePath), archiveName, "release archive name must match its source revision");
  assert.equal(path.basename(checksumPath), `${archiveName}.sha256`, "checksum file name must match the release archive");

  const checksum = parseChecksum(await readFile(checksumPath, "utf8"));
  assert.equal(checksum.fileName, archiveName, "checksum must name the downloaded release archive");
  const archiveDigest = createHash("sha256").update(await readFile(archivePath)).digest("hex");
  assert.equal(archiveDigest, checksum.digest, "release archive SHA-256 does not match its published checksum");

  await mkdir(vendorRoot, { recursive: true });
  const currentPin = await readCurrentPin(vendorRoot);
  if (currentPin?.releaseTag) {
    const currentVersion = parseReleaseTag(currentPin.releaseTag);
    const comparison = compareVersions(nextVersion, currentVersion);
    assert.ok(comparison >= 0, `refusing games bundle downgrade from ${currentPin.releaseTag} to ${releaseTag}`);
    if (comparison === 0) {
      assert.equal(currentPin.sourceRevision, sourceRevision, `${releaseTag} is already pinned to another source revision`);
    }
  }

  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "motion-levels-games-import-"));
  const stagingRoot = path.join(vendorRoot, `.import-${sourceRevision}-${process.pid}`);
  let installed = false;
  try {
    await validateArchiveEntries(archivePath);
    await execFile("tar", ["-xzf", archivePath, "-C", temporaryRoot]);
    const bundle = await verifyBundleDirectory(temporaryRoot, sourceRevision);
    const destination = path.join(vendorRoot, sourceRevision);
    const destinationExists = await exists(destination);
    if (destinationExists) {
      const installedBundle = await verifyBundleDirectory(destination, sourceRevision);
      assert.deepEqual(
        installedBundle,
        bundle,
        `source revision ${sourceRevision} is already installed with a different bundle manifest`,
      );
    } else {
      await rm(stagingRoot, { recursive: true, force: true });
      await cp(temporaryRoot, stagingRoot, { recursive: true, force: false });
      await rename(stagingRoot, destination);
      installed = true;
    }

    const previousRevision = currentPin && currentPin.sourceRevision !== sourceRevision
      ? currentPin.sourceRevision
      : normalizePreviousRevision(currentPin?.previousRevision, sourceRevision);
    const nextPin = {
      schema: "motion-levels-games-pin-v1",
      sourceRevision,
      artifactDigest: bundle.artifactDigest,
      bundlePath: sourceRevision,
      releaseTag,
      ...(previousRevision ? { previousRevision } : {}),
    };
    const serializedPin = `${JSON.stringify(nextPin, null, 2)}\n`;
    const currentSerializedPin = currentPin ? `${JSON.stringify(currentPin, null, 2)}\n` : "";
    const pinChanged = serializedPin !== currentSerializedPin;
    if (pinChanged) {
      const temporaryPin = path.join(vendorRoot, `.pin-${process.pid}.json`);
      await writeFile(temporaryPin, serializedPin, { mode: 0o644 });
      await rename(temporaryPin, path.join(vendorRoot, "pin.json"));
    }

    const retained = new Set([sourceRevision, previousRevision].filter(Boolean));
    const pruned = [];
    const hasRetentionHistory = !currentPin
      || currentPin.sourceRevision !== sourceRevision
      || Boolean(previousRevision);
    if (hasRetentionHistory) {
      for (const entry of await readdir(vendorRoot, { withFileTypes: true })) {
        if (!entry.isDirectory() || !sourceRevisionPattern.test(entry.name) || retained.has(entry.name)) continue;
        await rm(path.join(vendorRoot, entry.name), { recursive: true, force: true });
        pruned.push(entry.name);
      }
    }

    return {
      changed: installed || pinChanged || pruned.length > 0,
      archiveDigest,
      artifactDigest: bundle.artifactDigest,
      sourceRevision,
      releaseTag,
      previousRevision: previousRevision || null,
      pruned: pruned.sort(),
    };
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
    await rm(stagingRoot, { recursive: true, force: true });
  }
}

export async function verifyBundleDirectory(root, expectedRevision) {
  const manifest = JSON.parse(await readFile(path.join(root, "bundle.json"), "utf8"));
  assert.equal(manifest.schema, "motion-levels-games-bundle-v1");
  assert.equal(manifest.contractVersion, 1);
  assert.equal(manifest.runnerProtocolVersion, 1);
  assert.equal(manifest.sdkFps, 50);
  assert.equal(manifest.sourceRevision, expectedRevision);
  assert.match(String(manifest.artifactDigest), digestPattern);
  assert.ok(Array.isArray(manifest.files), "bundle manifest must contain a file list");

  const declaredFiles = manifest.files.map((file) => {
    assertSafeRelativePath(file.path, "bundle file");
    assert.match(String(file.sha256), digestPattern, `${file.path} has an invalid SHA-256`);
    assert.ok(Number.isSafeInteger(file.bytes) && file.bytes >= 0, `${file.path} has an invalid size`);
    return { path: file.path, sha256: file.sha256, bytes: file.bytes };
  });
  assert.deepEqual(declaredFiles, [...declaredFiles].sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0), "bundle file list must be sorted");

  const actualFiles = await bundleFiles(root);
  assert.deepEqual(actualFiles, declaredFiles, "bundle file manifest does not match the extracted release");
  const canonical = actualFiles.map((file) => `${file.path}\0${file.sha256}\0${file.bytes}\n`).join("");
  assert.equal(createHash("sha256").update(canonical).digest("hex"), manifest.artifactDigest, "bundle artifact digest mismatch");

  assertSafeRelativePath(manifest.catalog, "catalog");
  assertSafeRelativePath(manifest.runtime?.entry, "runtime entry");
  assertSafeRelativePath(manifest.playerDisplay?.entry, "player display entry");
  if (manifest.playerMenu !== undefined) {
    assertSafeRelativePath(manifest.playerMenu?.entry, "player menu entry");
    assert.equal(manifest.playerMenu?.adapterProtocolVersion, 1, "unsupported player menu adapter protocol");
  }
  const filePaths = new Set(actualFiles.map((file) => file.path));
  assert.ok(filePaths.has(manifest.catalog), "catalog is missing from the bundle file list");
  assert.ok(filePaths.has(manifest.runtime.entry), "runtime entry is missing from the bundle file list");
  assert.ok(filePaths.has(manifest.playerDisplay.entry), "player display entry is missing from the bundle file list");
  if (manifest.playerMenu !== undefined) {
    assert.ok(filePaths.has(manifest.playerMenu.entry), "player menu entry is missing from the bundle file list");
  }

  const catalog = JSON.parse(await readFile(path.join(root, ...manifest.catalog.split("/")), "utf8"));
  assert.ok(Array.isArray(catalog), "bundle catalog must be an array");
  assertStringArray(manifest.runtime.games, "runtime games");
  assertStringArray(manifest.playerDisplay.games, "player display games");
  assert.equal(new Set(manifest.runtime.games).size, manifest.runtime.games.length, "runtime games must be unique");
  assert.equal(new Set(manifest.playerDisplay.games).size, manifest.playerDisplay.games.length, "player display games must be unique");
  validateCatalog(catalog, filePaths);
  const productionGames = catalog
    .filter((game) => game?.availability?.production === true)
    .map((game) => game.id)
    .sort();
  assert.deepEqual([...manifest.runtime.games].sort(), productionGames, "runtime registry must match production catalog games");
  assert.deepEqual([...manifest.playerDisplay.games].sort(), productionGames, "player display registry must match production catalog games");
  return manifest;
}

function validateCatalog(catalog, filePaths) {
  const gameIDs = new Set();
  for (const game of catalog) {
    assertRecord(game, "catalog game");
    assert.match(String(game.id || ""), /^[a-z0-9]+(?:-[a-z0-9]+)*$/u, "catalog contains an invalid game id");
    assert.ok(!gameIDs.has(game.id), `catalog contains duplicate game id: ${game.id}`);
    gameIDs.add(game.id);
    assert.equal(game.engineGame, `motion-levels-games:${game.id}`, `${game.id} has an invalid engine game`);
    assertNonEmptyString(game.label, `${game.id} label`);
    if (game.description !== undefined) assert.equal(typeof game.description, "string", `${game.id} description must be a string`);

    assertRecord(game.availability, `${game.id} availability`);
    assert.equal(typeof game.availability.development, "boolean", `${game.id} development availability must be a boolean`);
    assert.equal(typeof game.availability.production, "boolean", `${game.id} production availability must be a boolean`);

    assertRecord(game.catalog, `${game.id} catalog metadata`);
    assert.ok(["team", "versus", "individual", "arcade"].includes(game.catalog.category), `${game.id} has an invalid catalog category`);
    assert.match(String(game.catalog.color || ""), /^#[0-9a-f]{6}$/iu, `${game.id} has an invalid catalog color`);
    for (const field of ["durationLabel", "modeLabel", "audioLabel"]) {
      assertNonEmptyString(game.catalog[field], `${game.id} catalog ${field}`);
    }
    assertStringArray(game.catalog.rules, `${game.id} catalog rules`);

    assertRecord(game.players, `${game.id} players`);
    assert.equal(typeof game.players.allowAny, "boolean", `${game.id} players.allowAny must be a boolean`);
    assert.ok(Number.isInteger(game.players.min) && game.players.min >= 1, `${game.id} players.min must be a positive integer`);
    assert.ok(Number.isInteger(game.players.max) && game.players.max >= game.players.min, `${game.id} players.max must be at least players.min`);
    assert.ok(Number.isFinite(game.defaultDurationMillis) && game.defaultDurationMillis >= 0, `${game.id} duration must be a non-negative number`);

    validateCatalogConfig(game.id, game.config);
    assertRecord(game.media, `${game.id} media`);
    for (const mediaKey of ["thumbnailSmall", "thumbnail", "animation", "playerDisplay", "playerDisplayAnimation"]) {
      const mediaPath = game.media[mediaKey];
      assertSafeRelativePath(mediaPath, `${game.id} media ${mediaKey}`);
      assert.ok(filePaths.has(mediaPath), `${game.id} media is missing: ${mediaPath}`);
    }
  }
}

function validateCatalogConfig(gameID, config) {
  if (config === undefined || config === null) return;
  assertRecord(config, `${gameID} config`);
  if (config.difficulty !== undefined) {
    assertRecord(config.difficulty, `${gameID} difficulty config`);
    if (config.difficulty.options !== undefined) {
      assertStringArray(config.difficulty.options, `${gameID} difficulty options`, { nonEmpty: true });
      assert.equal(new Set(config.difficulty.options).size, config.difficulty.options.length, `${gameID} difficulty options must be unique`);
    }
    if (config.difficulty.default !== undefined) {
      assertNonEmptyString(config.difficulty.default, `${gameID} default difficulty`);
      if (config.difficulty.options !== undefined) {
        assert.ok(config.difficulty.options.includes(config.difficulty.default), `${gameID} default difficulty must be an available option`);
      }
    }
  }
  if (config.vars === undefined) return;
  assert.ok(Array.isArray(config.vars), `${gameID} config vars must be an array`);
  const keys = new Set();
  for (const variable of config.vars) {
    assertRecord(variable, `${gameID} config variable`);
    assertNonEmptyString(variable.key, `${gameID} config variable key`);
    assert.ok(!keys.has(variable.key), `${gameID} has duplicate config variable: ${variable.key}`);
    keys.add(variable.key);
    assertNonEmptyString(variable.label, `${gameID} config variable ${variable.key} label`);
    if (variable.description !== undefined) assertNonEmptyString(variable.description, `${gameID} config variable ${variable.key} description`);
    assert.equal(typeof variable.playerFacing, "boolean", `${gameID} config variable ${variable.key} must declare playerFacing`);
    assert.ok(["int", "float", "bool", "enum"].includes(variable.type), `${gameID} config variable ${variable.key} has an invalid type`);
    assert.ok(Object.hasOwn(variable, "default"), `${gameID} config variable ${variable.key} must declare a default`);
    if (variable.type === "int" || variable.type === "float") {
      assert.ok(Number.isFinite(variable.default), `${gameID} config variable ${variable.key} default must be numeric`);
      if (variable.type === "int") assert.ok(Number.isInteger(variable.default), `${gameID} config variable ${variable.key} default must be an integer`);
      for (const bound of ["min", "max", "step"]) {
        if (variable[bound] !== undefined) {
          assert.ok(Number.isFinite(variable[bound]), `${gameID} config variable ${variable.key} ${bound} must be numeric`);
          if (variable.type === "int") assert.ok(Number.isInteger(variable[bound]), `${gameID} config variable ${variable.key} ${bound} must be an integer`);
        }
      }
      if (variable.min !== undefined) assert.ok(variable.default >= variable.min, `${gameID} config variable ${variable.key} default must not be below min`);
      if (variable.max !== undefined) assert.ok(variable.default <= variable.max, `${gameID} config variable ${variable.key} default must not exceed max`);
      if (variable.min !== undefined && variable.max !== undefined) assert.ok(variable.min <= variable.max, `${gameID} config variable ${variable.key} min must not exceed max`);
      if (variable.step !== undefined) assert.ok(variable.step > 0, `${gameID} config variable ${variable.key} step must be positive`);
    } else if (variable.type === "bool") {
      assert.equal(typeof variable.default, "boolean", `${gameID} config variable ${variable.key} default must be boolean`);
    } else {
      assert.ok(Array.isArray(variable.options) && variable.options.length > 0, `${gameID} config variable ${variable.key} must declare enum options`);
      const values = variable.options.map((option) => {
        assertRecord(option, `${gameID} config variable ${variable.key} option`);
        assertNonEmptyString(option.value, `${gameID} config variable ${variable.key} option value`);
        if (option.label !== undefined) assertNonEmptyString(option.label, `${gameID} config variable ${variable.key} option label`);
        return option.value;
      });
      assert.equal(new Set(values).size, values.length, `${gameID} config variable ${variable.key} options must be unique`);
      assert.ok(values.includes(variable.default), `${gameID} config variable ${variable.key} default must be an available option`);
    }
  }
}

async function validateArchiveEntries(archivePath) {
  const [{ stdout: namesOutput }, { stdout: verboseOutput }] = await Promise.all([
    execFile("tar", ["-tzf", archivePath], { maxBuffer: 4 * 1024 * 1024 }),
    execFile("tar", ["-tvzf", archivePath], { maxBuffer: 8 * 1024 * 1024 }),
  ]);
  const names = nonEmptyLines(namesOutput);
  const verbose = nonEmptyLines(verboseOutput);
  assert.equal(verbose.length, names.length, "could not validate every release archive entry");
  for (let index = 0; index < names.length; index += 1) {
    assertSafeRelativePath(names[index], "archive entry", { allowRoot: true });
    assert.ok(verbose[index].startsWith("-") || verbose[index].startsWith("d"), `archive entry is not a regular file or directory: ${names[index]}`);
  }
}

async function bundleFiles(root) {
  const files = await walk(root);
  const result = [];
  for (const file of files.filter((candidate) => path.basename(candidate) !== "bundle.json").sort()) {
    const contents = await readFile(file);
    result.push({
      path: path.relative(root, file).split(path.sep).join("/"),
      sha256: createHash("sha256").update(contents).digest("hex"),
      bytes: contents.length,
    });
  }
  return result;
}

async function walk(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`bundle contains a symbolic link: ${path.relative(root, fullPath)}`);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.isFile()) files.push(fullPath);
    else throw new Error(`bundle contains an unsupported file: ${path.relative(root, fullPath)}`);
  }
  return files;
}

async function readCurrentPin(vendorRoot) {
  const pinPath = path.join(vendorRoot, "pin.json");
  if (!await exists(pinPath)) return null;
  const pin = JSON.parse(await readFile(pinPath, "utf8"));
  assert.equal(pin.schema, "motion-levels-games-pin-v1", "installed games pin has an unsupported schema");
  assert.match(String(pin.sourceRevision), sourceRevisionPattern, "installed games pin has an invalid revision");
  assert.match(String(pin.artifactDigest), digestPattern, "installed games pin has an invalid digest");
  assert.equal(pin.bundlePath, pin.sourceRevision, "installed games pin path does not match its revision");
  assert.match(String(pin.releaseTag), releaseTagPattern, "installed games pin has an invalid release tag");
  if (pin.previousRevision !== undefined) {
    assert.match(String(pin.previousRevision), sourceRevisionPattern, "installed games pin has an invalid previous revision");
    assert.notEqual(pin.previousRevision, pin.sourceRevision, "installed games pin previous revision must differ from its current revision");
  }
  return pin;
}

function parseChecksum(value) {
  const match = /^([0-9a-f]{64})  ([^\r\n]+)\r?\n?$/u.exec(value);
  assert.ok(match, "release checksum must use '<sha256>  <archive>' format");
  return { digest: match[1], fileName: match[2] };
}

function parseReleaseTag(tag) {
  const match = releaseTagPattern.exec(String(tag));
  assert.ok(match, `invalid games release tag: ${tag}`);
  return match.slice(1).map(BigInt);
}

function compareVersions(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] < right[index]) return -1;
    if (left[index] > right[index]) return 1;
  }
  return 0;
}

function assertRecord(value, label) {
  assert.ok(value && typeof value === "object" && !Array.isArray(value), `${label} must be an object`);
}

function assertNonEmptyString(value, label) {
  assert.ok(typeof value === "string" && value.trim().length > 0, `${label} must be a non-empty string`);
}

function assertStringArray(value, label, { nonEmpty = false } = {}) {
  assert.ok(Array.isArray(value), `${label} must be an array`);
  if (nonEmpty) assert.ok(value.length > 0, `${label} must not be empty`);
  for (const item of value) assertNonEmptyString(item, `${label} item`);
}

function assertSafeRelativePath(value, label, { allowRoot = false } = {}) {
  assert.equal(typeof value, "string", `${label} path must be a string`);
  const withoutDot = value.replace(/^(?:\.\/)+/u, "");
  if (allowRoot && (value === "." || withoutDot === "")) return;
  assert.ok(withoutDot.length > 0, `${label} path must not be empty`);
  assert.ok(!withoutDot.includes("\\"), `${label} path must use POSIX separators`);
  assert.ok(!path.posix.isAbsolute(withoutDot), `${label} path must be relative`);
  const normalized = path.posix.normalize(withoutDot);
  assert.ok(normalized !== ".." && !normalized.startsWith("../"), `${label} path escapes the bundle root`);
  assert.equal(normalized, withoutDot, `${label} path must be normalized`);
}

function normalizePreviousRevision(value, currentRevision) {
  return sourceRevisionPattern.test(String(value)) && value !== currentRevision ? value : "";
}

function nonEmptyLines(value) {
  return value.split(/\r?\n/u).filter((line) => line.length > 0);
}

async function exists(filePath) {
  try {
    await lstat(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function parseArguments(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || value === undefined) throw new Error(`invalid argument: ${key || "<missing>"}`);
    options[key.slice(2)] = value;
  }
  for (const required of ["archive", "checksum", "release-tag", "source-revision"]) {
    if (!options[required]) throw new Error(`missing --${required}`);
  }
  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const result = await importMotionLevelsGamesRelease({
    archivePath: path.resolve(options.archive),
    checksumPath: path.resolve(options.checksum),
    releaseTag: options["release-tag"],
    sourceRevision: options["source-revision"],
    ...(options["vendor-root"] ? { vendorRoot: path.resolve(options["vendor-root"]) } : {}),
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
