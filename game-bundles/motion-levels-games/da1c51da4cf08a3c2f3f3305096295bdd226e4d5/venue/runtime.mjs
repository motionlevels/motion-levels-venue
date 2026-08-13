// apps/venue-runtime/src/main.ts
import { execFileSync } from "node:child_process";

// apps/venue-runtime/src/httpServer.ts
import { timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";

// apps/venue-runtime/src/commandExecutor.ts
var uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;
var SerializedCommandExecutor = class {
  constructor(maxCachedResults = 256) {
    this.maxCachedResults = maxCachedResults;
    if (!Number.isSafeInteger(maxCachedResults) || maxCachedResults < 1) {
      throw new RangeError("maxCachedResults must be a positive safe integer");
    }
  }
  maxCachedResults;
  tail = Promise.resolve();
  results = /* @__PURE__ */ new Map();
  order = [];
  execute(commandId, action) {
    const normalized = commandId.trim().toLowerCase();
    if (normalized && !uuidPattern.test(normalized)) {
      return Promise.reject(new TypeError("commandId must be a UUID"));
    }
    const execution = this.tail.then(async () => {
      const cached = normalized ? this.results.get(normalized) : void 0;
      if (cached !== void 0) return structuredClone(cached);
      const result = await action();
      if (normalized) {
        this.results.set(normalized, structuredClone(result));
        this.order.push(normalized);
        if (this.order.length > this.maxCachedResults) {
          const expired = this.order.shift();
          if (expired) this.results.delete(expired);
        }
      }
      return structuredClone(result);
    });
    this.tail = execution.then(() => void 0, () => void 0);
    return execution;
  }
};

// apps/venue-runtime/src/venueRuntime.ts
import { randomUUID } from "node:crypto";

// packages/game-sdk/src/effects.ts
function paintDiamondRing(frame, options) {
  const centerX = options.centerX ?? (frame.width - 1) / 2;
  const centerY = options.centerY ?? (frame.height - 1) / 2;
  const radius = Math.max(0, options.radius);
  const thickness = Math.max(0, options.thickness ?? 1);
  visitFrame(frame, options.color, (x, y) => {
    const distance = manhattanDistance(x, y, centerX, centerY);
    return {
      distance,
      phase: Math.abs(distance - radius),
      selected: Math.abs(distance - radius) <= thickness
    };
  }, 0);
}
function paintDiamondWave(frame, options) {
  const centerX = options.centerX ?? (frame.width - 1) / 2;
  const centerY = options.centerY ?? (frame.height - 1) / 2;
  const period = Math.max(1, Math.floor(options.period ?? 7));
  const bandWidth = Math.min(period, Math.max(1, Math.floor(options.bandWidth ?? 2)));
  const step = Math.floor(options.step);
  visitFrame(frame, options.color, (x, y) => {
    const distance = Math.floor(manhattanDistance(x, y, centerX, centerY));
    const phase = positiveModulo(distance + step, period);
    return { distance, phase, selected: phase < bandWidth };
  }, step);
}
function visitFrame(frame, color, select, step) {
  for (let y = 0; y < frame.height; y += 1) {
    for (let x = 0; x < frame.width; x += 1) {
      const selection = select(x, y);
      if (!selection.selected) {
        continue;
      }
      const resolvedColor = typeof color === "function" ? color({ distance: selection.distance, phase: selection.phase, step, x, y }) : color;
      if (resolvedColor) {
        frame.cells[y * frame.width + x] = { x, y, color: resolvedColor };
      }
    }
  }
}
function manhattanDistance(x, y, centerX, centerY) {
  return Math.abs(x - centerX) + Math.abs(y - centerY);
}
function positiveModulo(value, divisor) {
  return (value % divisor + divisor) % divisor;
}

// packages/game-sdk/src/index.ts
var FLOOR_COLS = 16;
var FLOOR_ROWS = 32;
var DEFAULT_GAME_SEED = 137;
var MIN_GAME_SEED = 0;
var MAX_GAME_SEED = 4294967295;
var FRAME_SIZE = FLOOR_COLS * FLOOR_ROWS;
var DEFAULT_START_COUNTDOWN_MILLIS = 2e3;
var DEFAULT_PLAYER_RELEASE_GRACE_MILLIS = 650;
function gameManifestSlug(manifest23) {
  const slug = String(manifest23.slug ?? "").trim();
  return slug || manifest23.id;
}
function gameManifestLookupKeys(manifest23) {
  const keys = [manifest23.id, gameManifestSlug(manifest23), ...manifest23.aliases ?? []].map(normalizeGameLookupKey).filter(Boolean);
  return Object.freeze([...new Set(keys)]);
}
function normalizeGameLookupKey(value) {
  return String(value ?? "").trim().toLowerCase();
}
var DEFAULT_GAME_DIFFICULTIES = ["easy", "medium", "hard", "expert"];
var DEFAULT_ENGINE_FPS = 50;
var DEFAULT_ENGINE_FRAME_MILLIS = 1e3 / DEFAULT_ENGINE_FPS;
function inFloorBounds(x, y) {
  return Number.isInteger(x) && Number.isInteger(y) && x >= 0 && x < FLOOR_COLS && y >= 0 && y < FLOOR_ROWS;
}
function normalizeGameConfig(config, manifest23) {
  const content = normalizeGameContent(config.content);
  return {
    seed: normalizeGameSeed(config.seed),
    playerCount: normalizePlayerCount(config.playerCount, manifest23),
    players: Array.isArray(config.players) ? config.players : [],
    durationMillis: normalizeNonNegativeNumber(config.durationMillis, manifest23.defaultDurationMillis),
    nowMillis: normalizeNonNegativeNumber(config.nowMillis, 0),
    difficulty: normalizeGameDifficulty(config.difficulty, manifest23),
    options: normalizeGameConfigOptions(config.options, manifest23),
    ...content ? { content } : {}
  };
}
function normalizeGameContent(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return void 0;
  const schema = String(value.schema ?? "").trim();
  if (!schema || schema.length > 120) return void 0;
  const clone = cloneGameContentValue(value, /* @__PURE__ */ new WeakSet());
  if (!clone || typeof clone !== "object" || Array.isArray(clone)) return void 0;
  return Object.freeze({ ...clone, schema });
}
function cloneGameContentValue(value, ancestors) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
  if (typeof value !== "object") return void 0;
  if (ancestors.has(value)) return void 0;
  ancestors.add(value);
  if (Array.isArray(value)) {
    const cloned2 = [];
    for (const child of value) {
      const normalized = cloneGameContentValue(child, ancestors);
      if (normalized === void 0) {
        ancestors.delete(value);
        return void 0;
      }
      cloned2.push(normalized);
    }
    ancestors.delete(value);
    return Object.freeze(cloned2);
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    ancestors.delete(value);
    return void 0;
  }
  const cloned = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "__proto__" || key === "prototype" || key === "constructor") {
      ancestors.delete(value);
      return void 0;
    }
    const normalized = cloneGameContentValue(child, ancestors);
    if (normalized === void 0) {
      ancestors.delete(value);
      return void 0;
    }
    cloned[key] = normalized;
  }
  ancestors.delete(value);
  return Object.freeze(cloned);
}
function normalizeGameSeed(value) {
  const candidate = typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : DEFAULT_GAME_SEED;
  return clamp(candidate, MIN_GAME_SEED, MAX_GAME_SEED);
}
function normalizePlayerCount(value, manifest23) {
  const rounded = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : defaultGamePlayerCount(manifest23);
  if (manifest23.players.allowAny === true && rounded === 0) {
    return 0;
  }
  return clamp(rounded, manifest23.players.min, manifest23.players.max);
}
function defaultGamePlayerCount(manifest23) {
  return manifest23.players.allowAny ? 0 : manifest23.players.min;
}
function normalizeNonNegativeNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : fallback;
}
function gameDifficultyOptions(manifest23) {
  const configured = manifest23.config?.difficulty?.options;
  return configured?.length ? [...configured] : [...DEFAULT_GAME_DIFFICULTIES];
}
function normalizeGameDifficulty(value, manifest23) {
  const options = gameDifficultyOptions(manifest23);
  const configuredDefault = manifest23.config?.difficulty?.default;
  const fallback = configuredDefault && options.includes(configuredDefault) ? configuredDefault : options.includes("medium") ? "medium" : options[0] ?? "medium";
  return value && options.includes(value) ? value : fallback;
}
function normalizeGameConfigOptions(options, manifest23) {
  const source = options ?? {};
  return Object.fromEntries(
    (manifest23.config?.vars ?? []).map((configVar) => [
      configVar.key,
      normalizeGameConfigValue(configVar, source[configVar.key])
    ])
  );
}
function normalizeGameConfigValue(configVar, value) {
  if (configVar.type === "bool") {
    const normalized2 = value === true || value === "true" ? true : value === false || value === "false" ? false : configVar.default;
    return normalized2;
  }
  if (configVar.type === "enum") {
    const candidate = String(value ?? configVar.default);
    const normalized2 = configVar.options.some((option) => option.value === candidate) ? candidate : configVar.default;
    return normalized2;
  }
  const numeric = typeof value === "number" && Number.isFinite(value) ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : Number.NaN;
  const finite = Number.isFinite(numeric) ? numeric : configVar.default;
  const rounded = configVar.type === "int" ? Math.round(finite) : finite;
  const normalized = clamp(rounded, configVar.min ?? -Infinity, configVar.max ?? Infinity);
  return normalized;
}
function readGameConfigOption(options, configVar) {
  return normalizeGameConfigValue(configVar, options[configVar.key]);
}
function createFrame(fill = "#05070a") {
  const cells = [];
  for (let y = 0; y < FLOOR_ROWS; y += 1) {
    for (let x = 0; x < FLOOR_COLS; x += 1) {
      cells.push({ x, y, color: fill });
    }
  }
  return {
    width: FLOOR_COLS,
    height: FLOOR_ROWS,
    cells
  };
}
function paintFrameCell(frame, x, y, color) {
  if (!inFloorBounds(x, y)) {
    return;
  }
  frame.cells[y * frame.width + x] = { x, y, color };
}
function fillFrameRect(frame, x, y, width, height, color) {
  for (let yy = y; yy < y + height; yy += 1) {
    for (let xx = x; xx < x + width; xx += 1) {
      paintFrameCell(frame, xx, yy, color);
    }
  }
}
function gameEvent(cue, message, atMillis) {
  return { cue, message: message.trimEnd().replace(/\.+$/u, ""), atMillis };
}
function createSeededRng(seed) {
  let state = seed >>> 0;
  if (state === 0) {
    state = 1;
  }
  return {
    next() {
      state = Math.imul(state, 1664525) + 1013904223 >>> 0;
      return state / 4294967296;
    },
    int(maxExclusive) {
      if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) {
        throw new Error("maxExclusive must be greater than zero");
      }
      return Math.floor(this.next() * maxExclusive);
    },
    range(minInclusive, maxInclusive) {
      if (maxInclusive < minInclusive) {
        throw new Error("maxInclusive must be greater than or equal to minInclusive");
      }
      return minInclusive + this.int(maxInclusive - minInclusive + 1);
    }
  };
}
function defaultPlayers(count, players = []) {
  const colors = ["#35d7ff", "#ff3bd7", "#ffe176", "#5fff9e"];
  return Array.from({ length: count }, (_, index) => ({
    index,
    label: players[index]?.label || players[index]?.name || `Player ${index + 1}`,
    color: players[index]?.color || colors[index % colors.length] || colors[0],
    score: 0,
    lives: -1
  }));
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function createHorizontalPlayerReadyZones(count, bounds = {}) {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error("player ready zone count must be a positive integer");
  }
  const minX = clamp(Math.round(bounds.minX ?? 0), 0, FLOOR_COLS - 1);
  const maxX = clamp(Math.round(bounds.maxX ?? FLOOR_COLS - 1), minX, FLOOR_COLS - 1);
  const minY = clamp(Math.round(bounds.minY ?? 0), 0, FLOOR_ROWS - 1);
  const maxY = clamp(Math.round(bounds.maxY ?? FLOOR_ROWS - 1), minY, FLOOR_ROWS - 1);
  const height = maxY - minY + 1;
  if (count > height) {
    throw new Error("player ready zone count cannot exceed the available floor rows");
  }
  return Array.from({ length: count }, (_, index) => ({
    minX,
    maxX,
    minY: minY + Math.floor(height * index / count),
    maxY: minY + Math.floor(height * (index + 1) / count) - 1
  }));
}
function createPlayerReadyGate(policy, zones, nowMillis = 0) {
  return new DefaultPlayerReadyGate(policy, zones, nowMillis);
}
function gameStartCountdownMillis(policy) {
  return normalizePositiveMillis(
    policy.mode === "player-ready" ? policy.countdownMillis : void 0,
    DEFAULT_START_COUNTDOWN_MILLIS
  );
}
function createGameEngine(game, options = {}) {
  return new DefaultGameEngine(game, options);
}
function normalizeEngineFps(fps) {
  if (fps === void 0 || !Number.isFinite(fps) || fps <= 0) {
    return DEFAULT_ENGINE_FPS;
  }
  return fps;
}
function normalizeMillis(value) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}
var DefaultPlayerReadyGate = class {
  constructor(policy, zones, nowMillis) {
    this.policy = policy;
    this.zones = zones;
    if (policy.mode === "player-ready" && zones.length === 0) {
      throw new Error("player-ready games require at least one presence zone");
    }
    this.countdownDuration = gameStartCountdownMillis(policy);
    this.releaseGraceMillis = normalizePositiveMillis(
      policy.mode === "player-ready" ? policy.releaseGraceMillis : void 0,
      DEFAULT_PLAYER_RELEASE_GRACE_MILLIS
    );
    this.zoneHeld = Array.from({ length: zones.length }, () => 0);
    this.zoneGraceUntil = Array.from({ length: zones.length }, () => 0);
    this.phase = policy.mode === "immediate" ? "running" : "waiting";
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        this.tileZones[y * FLOOR_COLS + x] = zones.findIndex((zone) => pointInReadyZone(x, y, zone));
      }
    }
    this.reset(nowMillis);
  }
  policy;
  zones;
  countdownDuration;
  releaseGraceMillis;
  tileZones = new Int16Array(FRAME_SIZE).fill(-1);
  tileHeld = new Uint8Array(FRAME_SIZE);
  zoneHeld;
  zoneGraceUntil;
  phase;
  startAtMillis = 0;
  reset(nowMillis = 0) {
    this.tileHeld.fill(0);
    this.zoneHeld.fill(0);
    this.zoneGraceUntil.fill(0);
    this.phase = this.policy.mode === "immediate" ? "running" : "waiting";
    this.startAtMillis = normalizeMillis(nowMillis);
    return this.state(nowMillis);
  }
  update(event) {
    if (!inFloorBounds(event.x, event.y)) {
      return this.tick(event.atMillis);
    }
    const tileIndex = event.y * FLOOR_COLS + event.x;
    const zoneIndex = this.tileZones[tileIndex] ?? -1;
    const held = this.tileHeld[tileIndex] === 1;
    if (zoneIndex >= 0 && held !== event.pressed) {
      this.tileHeld[tileIndex] = event.pressed ? 1 : 0;
      if (event.pressed) {
        this.zoneHeld[zoneIndex] = (this.zoneHeld[zoneIndex] ?? 0) + 1;
        this.zoneGraceUntil[zoneIndex] = 0;
      } else {
        this.zoneHeld[zoneIndex] = Math.max(0, (this.zoneHeld[zoneIndex] ?? 0) - 1);
        if (this.zoneHeld[zoneIndex] === 0) {
          this.zoneGraceUntil[zoneIndex] = normalizeMillis(event.atMillis) + this.releaseGraceMillis;
        }
      }
    }
    return this.tick(event.atMillis);
  }
  tick(nowMillis) {
    if (this.policy.mode === "immediate" || this.phase === "running") {
      return "none";
    }
    const now = normalizeMillis(nowMillis);
    const allReady = this.readyPlayerCount(now) === this.zones.length;
    if (this.phase === "waiting" && allReady) {
      this.phase = "starting";
      this.startAtMillis = now + this.countdownDuration;
      return "players-ready";
    }
    if (this.phase === "starting" && !allReady) {
      this.phase = "waiting";
      this.startAtMillis = 0;
      return "players-left";
    }
    if (this.phase === "starting" && now >= this.startAtMillis) {
      this.phase = "running";
      return "started";
    }
    return "none";
  }
  state(nowMillis) {
    const now = normalizeMillis(nowMillis);
    return {
      phase: this.phase,
      readyPlayers: this.readyPlayerCount(now),
      requiredPlayers: this.zones.length,
      countdownMillis: this.phase === "starting" ? Math.max(0, this.startAtMillis - now) : 0
    };
  }
  zoneReady(index, nowMillis) {
    const graceUntil = this.zoneGraceUntil[index] ?? 0;
    return (this.zoneHeld[index] ?? 0) > 0 || graceUntil > 0 && graceUntil >= normalizeMillis(nowMillis);
  }
  readyPlayerCount(nowMillis) {
    return this.zones.reduce((count, _zone, index) => count + Number(this.zoneReady(index, nowMillis)), 0);
  }
};
function normalizePositiveMillis(value, fallback) {
  return value !== void 0 && Number.isFinite(value) && value > 0 ? value : fallback;
}
function pointInReadyZone(x, y, zone) {
  return x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY;
}
var DefaultGameEngine = class {
  currentClockMillis;
  currentFps;
  currentFrameMillis;
  currentGame;
  currentState;
  constructor(game, options) {
    this.currentGame = game;
    this.currentClockMillis = options.nowMillis ?? 0;
    this.currentFps = normalizeEngineFps(options.fps);
    this.currentFrameMillis = 1e3 / this.currentFps;
    this.currentState = this.composeState(options.initialEvents ?? []);
  }
  get clockMillis() {
    return this.currentClockMillis;
  }
  get fps() {
    return this.currentFps;
  }
  get frameMillis() {
    return this.currentFrameMillis;
  }
  get state() {
    return this.currentState;
  }
  press(x, y, atMillis = this.currentClockMillis) {
    this.currentClockMillis = Math.max(this.currentClockMillis, normalizeMillis(atMillis));
    return this.refresh(this.currentGame.press({
      x,
      y,
      pressed: true,
      atMillis: this.currentClockMillis
    }));
  }
  refresh(events = []) {
    this.currentState = this.composeState(events);
    return this.currentState;
  }
  release(x, y, atMillis = this.currentClockMillis) {
    this.currentClockMillis = Math.max(this.currentClockMillis, normalizeMillis(atMillis));
    return this.refresh(this.currentGame.release({
      x,
      y,
      pressed: false,
      atMillis: this.currentClockMillis
    }));
  }
  replaceGame(game, options = {}) {
    this.currentGame = game;
    this.currentClockMillis = options.nowMillis ?? 0;
    this.currentFps = normalizeEngineFps(options.fps ?? this.currentFps);
    this.currentFrameMillis = 1e3 / this.currentFps;
    return this.refresh(options.initialEvents ?? []);
  }
  step(deltaMillis = this.currentFrameMillis) {
    const safeDelta = Number.isFinite(deltaMillis) ? Math.max(0, deltaMillis) : this.currentFrameMillis;
    return this.tickTo(this.currentClockMillis + safeDelta);
  }
  tickTo(atMillis) {
    this.currentClockMillis = Math.max(this.currentClockMillis, normalizeMillis(atMillis));
    return this.refresh(this.currentGame.tick({ atMillis: this.currentClockMillis }));
  }
  composeState(events) {
    const snapshot = this.currentGame.snapshot();
    return {
      clockMillis: this.currentClockMillis,
      events,
      fps: this.currentFps,
      frame: this.currentGame.render(),
      frameMillis: this.currentFrameMillis,
      snapshot
    };
  }
};
function rgbToHex(color) {
  return `#${hexByte(color.r)}${hexByte(color.g)}${hexByte(color.b)}`;
}
function scaleRgb(color, percent) {
  return {
    r: clamp(Math.round(color.r * percent / 100), 0, 255),
    g: clamp(Math.round(color.g * percent / 100), 0, 255),
    b: clamp(Math.round(color.b * percent / 100), 0, 255)
  };
}
function addRgb(left, right) {
  return {
    r: clamp(left.r + right.r, 0, 255),
    g: clamp(left.g + right.g, 0, 255),
    b: clamp(left.b + right.b, 0, 255)
  };
}
function hexByte(value) {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
}

// packages/player-experience/src/index.ts
var playerExperienceContractVersion = 1;
var idleGames = /* @__PURE__ */ new Set(["salvapantallas", "screensaver", "loop"]);
function lifecycleFromRuntime(input) {
  if (input.paused) return "paused";
  const phase = input.phase.trim().toLowerCase();
  if (idleGames.has(input.currentGame)) return "idle";
  if (phase === "idle") return "waiting";
  if (phase === "countdown" || phase === "starting" || phase === "ready") return "starting";
  if (phase === "waiting") return "waiting";
  if (phase === "finished" || phase === "complete" || phase === "completed") return "finished";
  if (phase === "launching" || phase === "loading") return "launching";
  if (phase === "stopping") return "stopping";
  if (phase === "error" || phase === "failed") return "error";
  return "running";
}
function controlsForState(input) {
  if (input.lifecycle === "idle" || input.lifecycle === "launching" || input.lifecycle === "stopping" || input.lifecycle === "error") return [];
  const controls = input.lifecycle === "paused" ? ["resume", "restart", "exit"] : ["pause", "restart", "exit"];
  controls.push("narration");
  if (input.audioEnabled) controls.push(input.audioMuted ? "unmute" : "mute", "toggle_mute");
  return controls;
}

// games/arkanoid/src/manifest.ts
var arkanoidConfigVars = {
  ballSpeed: {
    key: "ball_speed",
    label: "Ball speed (tiles/s)",
    playerFacing: true,
    description: "Base ball speed on Easy. Higher difficulties multiply this value.",
    type: "float",
    default: 4.25,
    min: 2,
    max: 8,
    step: 0.25
  }
};
var manifest = {
  id: "arkanoid",
  label: "Arkanoid",
  description: "Single-player floor Arkanoid with step-controlled paddle movement and deterministic brick physics.",
  availability: { development: true, production: true },
  catalog: {
    category: "individual",
    color: "#ff9f45",
    durationLabel: "Sin l\xEDmite",
    modeLabel: "Arkanoid",
    audioLabel: "Efectos",
    rules: ["Pisa la zona inferior para mover la pala", "Rompe todos los bloques sin perder la pelota"]
  },
  players: {
    allowAny: true,
    min: 1,
    max: 1
  },
  start: { mode: "player-ready" },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    },
    vars: Object.values(arkanoidConfigVars)
  },
  defaultDurationMillis: 0,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 1,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 7, y: 30 },
      { atMillis: 2150, type: "release", x: 7, y: 30 },
      { atMillis: 2250, type: "press", x: 9, y: 30 },
      { atMillis: 2450, type: "release", x: 9, y: 30 }
    ],
    captureStartMillis: 2200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["arcade", "single-player", "typescript"]
};

// games/arkanoid/src/game.ts
var ballColor = "#ffffff";
var paddleColor = "#35d7ff";
var brickColors = ["#ff3151", "#ff8a2a", "#ffd45f", "#74e58d"];
var defaultBrickColor = "#ff3151";
var backgroundColor = "#03070c";
var controlZoneColor = "#06101d";
var controlMarkerColor = "#145cff";
var missLineColor = "#37101a";
var paddleMissColor = "#ff3151";
var successColor = "#74e58d";
var trailColors = ["#9ddfff", "#4b91b8", "#21445b"];
var brickRows = 4;
var brickWidth = 2;
var brickStartY = 3;
var paddleWidth = 5;
var paddleY = 29;
var controlZoneStartY = 24;
var startingLives = 3;
var maxCatchUpMoves = 12;
function createGame(config) {
  return new ArkanoidGame(config);
}
var ArkanoidGame = class {
  ball = { x: 7, y: paddleY - 1, dx: 1, dy: -1 };
  ballMoves = 0;
  ballTrail = [];
  bricks = [];
  config;
  lastControlX = 7;
  lastEvent = gameEvent("none", "Listo", 0);
  lastMoveMillis = 0;
  lives = startingLives;
  nowMillis = 0;
  paddleX = Math.floor((FLOOR_COLS - paddleWidth) / 2);
  phase = "ready";
  players = [];
  rng;
  readyGate;
  score = 0;
  startedAtMillis = 0;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate = createPlayerReadyGate(manifest.start, [{
      minX: 0,
      maxX: FLOOR_COLS - 1,
      minY: controlZoneStartY,
      maxY: FLOOR_ROWS - 1
    }], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.nowMillis = nowMillis;
    this.readyGate.reset(nowMillis);
    this.phase = "waiting";
    this.attachBall();
    this.lastEvent = gameEvent("ready", "Esperando jugador abajo", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (event.y < controlZoneStartY || event.y >= FLOOR_ROWS) {
      return [];
    }
    if (event.pressed) {
      this.movePaddle(event.x);
    }
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase === "ready" && event.pressed) {
      return this.launchBall(event.atMillis);
    }
    return [];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase !== "running") {
      return [];
    }
    const events = [];
    const interval = 1e3 / ballSpeedForConfig(this.config);
    for (let moves = 0; moves < maxCatchUpMoves; moves += 1) {
      if (event.atMillis - this.lastMoveMillis < interval) {
        break;
      }
      this.lastMoveMillis += interval;
      const nextEvent = this.moveBall(this.lastMoveMillis);
      if (nextEvent) {
        events.push(nextEvent);
      }
      if (this.phase !== "running") {
        break;
      }
    }
    return this.recordEvents(events);
  }
  render() {
    const frame = createFrame(backgroundColor);
    fillFrameRect(frame, 0, controlZoneStartY, FLOOR_COLS, FLOOR_ROWS - controlZoneStartY, controlZoneColor);
    fillFrameRect(frame, 0, FLOOR_ROWS - 1, FLOOR_COLS, 1, missLineColor);
    for (const brick of this.bricks) {
      if (brick.alive) {
        fillFrameRect(frame, brick.x, brick.y, brick.width, 1, brick.color);
      }
    }
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawPlayerStart(frame);
    }
    if (this.phase === "finished" && this.score === this.bricks.length) {
      drawSuccessFrame(frame);
    }
    this.ballTrail.forEach((position, index) => {
      const color = trailColors[index];
      if (color) {
        paintFrameCell(frame, position.x, position.y, color);
      }
    });
    if (this.phase !== "finished" || this.lives > 0) {
      paintFrameCell(frame, this.ball.x, this.ball.y, ballColor);
    }
    fillFrameRect(
      frame,
      this.paddleX,
      paddleY,
      paddleWidth,
      1,
      this.phase === "finished" && this.lives === 0 ? paddleMissColor : paddleColor
    );
    paintFrameCell(frame, this.lastControlX, FLOOR_ROWS - 1, controlMarkerColor);
    return frame;
  }
  snapshot() {
    const remaining = this.bricksRemaining();
    const readyState = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest.id,
      label: manifest.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.score,
      lives: this.lives,
      maxLives: startingLives,
      elapsedMillis: Math.max(0, this.nowMillis - this.startedAtMillis),
      remainingMillis: 0,
      activeTargets: remaining,
      success: remaining === 0,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: this.bricks.length,
      ball: { ...this.ball },
      ballMoves: this.ballMoves,
      ballSpeed: ballSpeedForConfig(this.config),
      bricksRemaining: remaining,
      launched: this.phase === "running",
      paddleWidth,
      paddleX: this.paddleX,
      totalBricks: this.bricks.length
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest);
    this.rng = createSeededRng(this.config.seed);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Jugador listo", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a la zona iluminada", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "started") {
      return this.launchBall(nowMillis);
    }
    return [];
  }
  launchBall(nowMillis) {
    const firstLaunch = this.phase === "waiting" || this.phase === "starting";
    this.phase = "running";
    if (firstLaunch) {
      this.startedAtMillis = nowMillis;
    }
    this.ball = {
      x: this.paddleCenter(),
      y: paddleY - 1,
      dx: this.rng.next() < 0.5 ? -1 : 1,
      dy: -1
    };
    this.ballTrail = [];
    this.lastMoveMillis = nowMillis;
    this.lastEvent = gameEvent("start", "Pelota en juego", nowMillis);
    return [this.lastEvent];
  }
  attachBall() {
    this.ball = { x: this.paddleCenter(), y: paddleY - 1, dx: this.ball.dx, dy: -1 };
    this.ballTrail = [];
  }
  brickAt(x, y) {
    return this.bricks.find((brick) => brick.alive && brick.y === y && x >= brick.x && x < brick.x + brick.width);
  }
  bricksRemaining() {
    return this.bricks.reduce((count, brick) => count + Number(brick.alive), 0);
  }
  commitBall(next) {
    this.ballTrail = [{ x: this.ball.x, y: this.ball.y }, ...this.ballTrail].slice(0, trailColors.length);
    this.ball = next;
    this.ballMoves += 1;
  }
  loseLife(nowMillis) {
    this.lives -= 1;
    this.players = this.scoredPlayers();
    this.ballTrail = [];
    if (this.lives <= 0) {
      this.phase = "finished";
      return gameEvent("fail", "Sin vidas", nowMillis);
    }
    this.phase = "ready";
    this.attachBall();
    return gameEvent("fail", "Vida perdida, pisa abajo para lanzar", nowMillis);
  }
  moveBall(nowMillis) {
    let dx = this.ball.dx;
    let dy = this.ball.dy;
    let nextX = this.ball.x + dx;
    let nextY = this.ball.y + dy;
    if (nextX < 0 || nextX >= FLOOR_COLS) {
      dx = dx === 1 ? -1 : 1;
      nextX = this.ball.x + dx;
    }
    if (nextY < 1) {
      dy = 1;
      nextY = this.ball.y + dy;
    }
    const brick = this.brickAt(nextX, nextY);
    if (brick) {
      brick.alive = false;
      this.score += 1;
      this.players = this.scoredPlayers();
      this.ball = { ...this.ball, dx, dy: dy === 1 ? -1 : 1 };
      this.ballMoves += 1;
      if (this.bricksRemaining() === 0) {
        this.phase = "finished";
        return gameEvent("win", "Muro completado", nowMillis);
      }
      return gameEvent("hit", `Bloque ${this.score} de ${this.bricks.length}`, nowMillis);
    }
    if (dy > 0 && nextY === paddleY) {
      if (nextX >= this.paddleX && nextX < this.paddleX + paddleWidth) {
        const offset = nextX - this.paddleCenter();
        if (offset < 0) {
          dx = -1;
        } else if (offset > 0) {
          dx = 1;
        } else {
          dx = this.rng.next() < 0.5 ? -1 : 1;
        }
        if (Math.abs(offset) === 1 && this.rng.next() < 0.35) {
          dx = dx === 1 ? -1 : 1;
        }
        this.commitBall({ x: nextX, y: paddleY - 1, dx, dy: -1 });
        return gameEvent("coin", "Rebote", nowMillis);
      }
    }
    if (nextY >= FLOOR_ROWS) {
      return this.loseLife(nowMillis);
    }
    this.commitBall({ x: nextX, y: nextY, dx, dy });
    return void 0;
  }
  movePaddle(x) {
    const half = Math.floor(paddleWidth / 2);
    const center = clamp(Math.round(x), half, FLOOR_COLS - 1 - half);
    this.paddleX = center - half;
    this.lastControlX = clamp(Math.round(x), 0, FLOOR_COLS - 1);
    if (this.phase === "ready" || this.phase === "waiting" || this.phase === "starting") {
      this.attachBall();
    }
  }
  drawPlayerStart(frame) {
    if (this.phase === "waiting") {
      const scanY = controlZoneStartY + Math.floor(this.nowMillis / 150) % (FLOOR_ROWS - controlZoneStartY);
      for (let y = controlZoneStartY; y < FLOOR_ROWS; y += 1) {
        for (let x = 0; x < FLOOR_COLS; x += 1) {
          if (y === scanY || x === 0 || x === FLOOR_COLS - 1) {
            paintFrameCell(frame, x, y, y === scanY ? "#35d7ff" : "#0b4260");
          }
        }
      }
      return;
    }
    const pulse = Math.floor(this.nowMillis / 125) % 4;
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        if ((Math.abs(x - this.paddleCenter()) + Math.abs(y - paddleY) + pulse) % 6 === 0) {
          paintFrameCell(frame, x, y, y >= controlZoneStartY ? "#ffe176" : "#176783");
        }
      }
    }
  }
  paddleCenter() {
    return this.paddleX + Math.floor(paddleWidth / 2);
  }
  recordEvents(events) {
    const latestEvent = events.at(-1);
    if (latestEvent) {
      this.lastEvent = latestEvent;
    }
    return events;
  }
  resetState(nowMillis) {
    this.bricks = createBricks();
    this.lives = startingLives;
    this.nowMillis = nowMillis;
    this.startedAtMillis = nowMillis;
    this.lastMoveMillis = nowMillis;
    this.paddleX = Math.floor((FLOOR_COLS - paddleWidth) / 2);
    this.lastControlX = this.paddleCenter();
    this.readyGate.reset(nowMillis);
    this.phase = "waiting";
    this.score = 0;
    this.ballMoves = 0;
    this.ball = { x: this.paddleCenter(), y: paddleY - 1, dx: 1, dy: -1 };
    this.ballTrail = [];
    this.players = this.scoredPlayers();
    this.lastEvent = gameEvent("ready", "Esperando jugador abajo", nowMillis);
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({
      ...player,
      lives: this.lives,
      score: this.score
    }));
  }
};
function createBricks() {
  const bricks = [];
  let id = 0;
  for (let row = 0; row < brickRows; row += 1) {
    for (let x = 0; x < FLOOR_COLS; x += brickWidth) {
      bricks.push({
        alive: true,
        color: brickColors[row] ?? defaultBrickColor,
        id,
        width: brickWidth,
        x,
        y: brickStartY + row
      });
      id += 1;
    }
  }
  return bricks;
}
function drawSuccessFrame(frame) {
  fillFrameRect(frame, 2, 13, FLOOR_COLS - 4, 1, successColor);
  fillFrameRect(frame, 2, 19, FLOOR_COLS - 4, 1, successColor);
  fillFrameRect(frame, 2, 13, 1, 7, successColor);
  fillFrameRect(frame, FLOOR_COLS - 3, 13, 1, 7, successColor);
  paintFrameCell(frame, 5, 16, successColor);
  paintFrameCell(frame, 6, 17, successColor);
  paintFrameCell(frame, 7, 18, successColor);
  paintFrameCell(frame, 8, 17, successColor);
  paintFrameCell(frame, 9, 16, successColor);
  paintFrameCell(frame, 10, 15, successColor);
}
function ballSpeedForConfig(config) {
  const baseSpeed = readGameConfigOption(config.options, arkanoidConfigVars.ballSpeed);
  return baseSpeed * difficultySpeedFactor(config.difficulty);
}
function difficultySpeedFactor(difficulty) {
  switch (difficulty) {
    case "medium":
      return 1.25;
    case "hard":
      return 1.6;
    case "expert":
      return 2;
    default:
      return 1;
  }
}

// games/cruce-galactico/src/manifest.ts
var manifest2 = {
  id: "cruce-galactico",
  label: "Cruce Gal\xE1ctico",
  description: "Cruza cuatro corredores c\xF3smicos, esquiva el tr\xE1fico espacial y alcanza el portal de salida.",
  availability: { development: true, production: true },
  catalog: {
    category: "individual",
    color: "#7c5cff",
    durationLabel: "75 s",
    modeLabel: "Cruce espacial",
    audioLabel: "M\xFAsica + efectos",
    rules: [
      "Empieza en la plataforma azul",
      "Cruza cada corredor evitando los obst\xE1culos rojos",
      "Alcanza los cuatro controles antes de que termine el tiempo"
    ]
  },
  players: { allowAny: true, min: 1, max: 4 },
  start: { mode: "player-ready", releaseGraceMillis: 1500 },
  config: { difficulty: { default: "medium", options: ["easy", "medium", "hard", "expert"] } },
  defaultDurationMillis: 75e3,
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 8, y: 30 },
      { atMillis: 2150, type: "release", x: 8, y: 30 },
      { atMillis: 2500, type: "press", x: 8, y: 22 }
    ],
    captureStartMillis: 2300,
    frameCount: 24,
    frameIntervalMillis: 120
  },
  tags: ["arcade", "crossing", "survival", "typescript"]
};

// games/cruce-galactico/src/game.ts
var startingLives2 = 3;
var checkpointTarget = 4;
var gameWinAnimationMillis = 3e3;
var damageImmunityMillis = 1500;
var backgroundColor2 = "#02030b";
var laneColor = "#090d20";
var checkpointColor = "#26d9ff";
var nextCheckpointColor = "#66ff9a";
var hazardColor = "#ff365c";
var hazardCoreColor = "#fff0a6";
var playerColor = "#ffffff";
var winColors = ["#7c5cff", "#26d9ff", "#66ff9a", "#ffffff"];
var startZone = { minX: 4, maxX: 11, minY: 29, maxY: 31 };
var checkpointBands = [
  { minY: 22, maxY: 23 },
  { minY: 15, maxY: 16 },
  { minY: 8, maxY: 9 },
  { minY: 0, maxY: 2 }
];
var lanes = [
  { minY: 24, maxY: 28, direction: 1, offset: 0 },
  { minY: 17, maxY: 21, direction: -1, offset: 4 },
  { minY: 10, maxY: 14, direction: 1, offset: 8 },
  { minY: 3, maxY: 7, direction: -1, offset: 2 }
];
var difficultyStepMillis = { easy: 620, medium: 480, hard: 360, expert: 270 };
function createGame2(config) {
  return new GalacticCrossingGame(config);
}
var GalacticCrossingGame = class {
  checkpoint = 0;
  config;
  finishedAtMillis;
  lastDamageAtMillis = Number.NEGATIVE_INFINITY;
  lastEvent = gameEvent("none", "Listo para despegar", 0);
  lives = startingLives2;
  nowMillis = 0;
  occupiedTiles = /* @__PURE__ */ new Set();
  phase = "ready";
  players = [];
  readyGate;
  startedAtMillis = 0;
  success = false;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest2);
    this.readyGate = createPlayerReadyGate(manifest2.start, [startZone], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    this.updateOccupied(event.x, event.y, event.pressed);
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) return [];
    const band = checkpointBands[this.checkpoint];
    if (!band || event.y < band.minY || event.y > band.maxY) return [];
    this.checkpoint += 1;
    this.players = this.scoredPlayers();
    if (this.checkpoint === checkpointTarget) {
      return [this.finish(true, "Portal alcanzado", event.atMillis)];
    }
    this.lastEvent = gameEvent("hit", `Control ${this.checkpoint} activado`, event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    this.updateOccupied(event.x, event.y, false);
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase !== "running") return [];
    if (this.remainingMillis() === 0) return [this.finish(false, "Tiempo agotado", event.atMillis)];
    if (event.atMillis - this.lastDamageAtMillis < damageImmunityMillis || !this.playerTouchesHazard()) return [];
    this.lastDamageAtMillis = event.atMillis;
    this.lives = Math.max(0, this.lives - 1);
    this.players = this.scoredPlayers();
    if (this.lives === 0) return [this.finish(false, "Nave destruida", event.atMillis)];
    this.lastEvent = gameEvent("miss", `Impacto: quedan ${this.lives} vidas`, event.atMillis);
    return [this.lastEvent];
  }
  render() {
    const frame = createFrame(backgroundColor2);
    for (const lane of lanes) fillFrameRect(frame, 0, lane.minY, FLOOR_COLS, lane.maxY - lane.minY + 1, laneColor);
    if (this.phase === "waiting" || this.phase === "starting") {
      const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 180));
      paintDiamondRing(frame, {
        centerX: 8,
        centerY: 30,
        radius: 1 + step % 6,
        color: this.phase === "starting" ? "#ffe176" : checkpointColor
      });
      return frame;
    }
    if (this.phase === "finished") {
      if (this.success) {
        const step = Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 120);
        paintDiamondWave(frame, {
          color: ({ distance }) => winColors[(distance + step) % winColors.length] ?? winColors[0],
          step
        });
      } else {
        const pulse = Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 180) % 2;
        fillFrameRect(frame, 0, 0, FLOOR_COLS, FLOOR_ROWS, pulse === 0 ? "#5b0717" : "#18030a");
      }
      return frame;
    }
    checkpointBands.forEach((band, index) => {
      const color = index < this.checkpoint ? checkpointColor : index === this.checkpoint ? nextCheckpointColor : "#15233d";
      fillFrameRect(frame, 0, band.minY, FLOOR_COLS, band.maxY - band.minY + 1, color);
    });
    for (const hazard of this.currentHazards()) {
      fillFrameRect(frame, hazard.x, hazard.y, hazard.width, hazard.height, hazardColor);
      paintFrameCell(frame, hazard.x + 1, hazard.y + 1, hazardCoreColor);
    }
    for (const tile of this.occupiedTiles) {
      const [x, y] = parseTile(tile);
      paintFrameCell(frame, x, y, playerColor);
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    const celebrationMillis = this.phase === "finished" && this.success ? Math.min(gameWinAnimationMillis, Math.max(0, this.nowMillis - (this.finishedAtMillis ?? this.nowMillis))) : 0;
    return {
      currentGame: manifest2.id,
      label: manifest2.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.checkpoint,
      lives: this.lives,
      maxLives: startingLives2,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? 1 : 0,
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      matchTarget: checkpointTarget,
      checkpoint: this.checkpoint,
      checkpointTarget,
      hazards: this.phase === "running" ? this.currentHazards() : [],
      celebrating: this.success && celebrationMillis < gameWinAnimationMillis,
      celebrationMillis
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest2);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Tripulaci\xF3n lista", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a la plataforma azul", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastEvent = gameEvent("start", "Avanza hacia el control verde", nowMillis);
    } else return [];
    return [this.lastEvent];
  }
  currentHazards() {
    const stepMillis = difficultyStepMillis[this.config.difficulty] ?? difficultyStepMillis.medium;
    const step = Math.floor(Math.max(0, this.nowMillis - this.startedAtMillis) / stepMillis);
    return lanes.flatMap((lane, laneIndex) => [0, 7, 14].map((gap) => {
      const raw = lane.offset + gap + step * lane.direction;
      const x = (raw % 20 + 20) % 20 - 3;
      return { x, y: lane.minY + laneIndex % 2, width: 3, height: 3 };
    })).filter((hazard) => hazard.x < FLOOR_COLS && hazard.x + hazard.width > 0);
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting" || this.phase === "ready") return 0;
    return Math.max(0, (this.finishedAtMillis ?? this.nowMillis) - this.startedAtMillis);
  }
  finish(success, message, atMillis) {
    this.phase = "finished";
    this.success = success;
    this.finishedAtMillis = atMillis;
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return this.lastEvent;
  }
  playerTouchesHazard() {
    const hazards = this.currentHazards();
    for (const tile of this.occupiedTiles) {
      const [x, y] = parseTile(tile);
      if (hazards.some((hazard) => x >= hazard.x && x < hazard.x + hazard.width && y >= hazard.y && y < hazard.y + hazard.height)) return true;
    }
    return false;
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.checkpoint = 0;
    this.finishedAtMillis = void 0;
    this.lastDamageAtMillis = Number.NEGATIVE_INFINITY;
    this.lastEvent = gameEvent("ready", "Espera en la plataforma azul", nowMillis);
    this.lives = startingLives2;
    this.nowMillis = nowMillis;
    this.occupiedTiles.clear();
    this.phase = "waiting";
    this.players = this.scoredPlayers();
    this.startedAtMillis = nowMillis;
    this.success = false;
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({
      ...player,
      score: this.checkpoint,
      lives: this.lives
    }));
  }
  updateOccupied(x, y, pressed) {
    if (x < 0 || x >= FLOOR_COLS || y < 0 || y >= FLOOR_ROWS) return;
    const key = `${x},${y}`;
    if (pressed) this.occupiedTiles.add(key);
    else this.occupiedTiles.delete(key);
  }
};
function parseTile(tile) {
  const [x = "0", y = "0"] = tile.split(",");
  return [Number(x), Number(y)];
}

// games/duelo/src/manifest.ts
var dueloConfigVars = {
  baseFillPercent: {
    key: "base_fill_percent",
    label: "Base floor coverage (%)",
    playerFacing: false,
    description: "The percentage of floor tiles assigned as targets on Medium difficulty.",
    type: "int",
    default: 60,
    min: 30,
    max: 75,
    step: 5
  },
  hardFillMultiplier: {
    key: "hard_fill_multiplier",
    label: "Hard coverage multiplier",
    playerFacing: false,
    description: "Hard difficulty multiplies the base floor coverage by this value, capped at the full floor.",
    type: "float",
    default: 1.5,
    min: 1,
    max: 1.8,
    step: 0.05
  }
};
var manifest3 = {
  id: "duelo",
  label: "Duelo",
  description: "A fast 2\u20138 player race to claim every tile of your color before anyone else.",
  availability: { development: true, production: true },
  catalog: {
    category: "versus",
    color: "#ff5268",
    durationLabel: "Sin l\xEDmite",
    modeLabel: "Carrera de colores",
    audioLabel: "M\xFAsica + efectos",
    rules: [
      "Cada jugador ocupa la zona de inicio de su color",
      "Pisa todas las baldosas de tu color antes que los dem\xE1s"
    ]
  },
  players: {
    allowAny: false,
    min: 2,
    max: 8
  },
  start: {
    mode: "player-ready",
    countdownMillis: 3e3,
    releaseGraceMillis: 2e3
  },
  config: {
    difficulty: {
      default: "medium",
      options: ["medium", "hard"]
    },
    vars: Object.values(dueloConfigVars)
  },
  defaultDurationMillis: 0,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 4,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 1, y: 1 },
      { atMillis: 100, type: "press", x: 14, y: 30 },
      { atMillis: 100, type: "press", x: 1, y: 30 },
      { atMillis: 100, type: "press", x: 14, y: 1 }
    ],
    captureStartMillis: 3200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["competitive", "multiplayer", "color-race", "typescript"]
};

// games/duelo/src/game.ts
var startPadSize = 4;
var boardCandidateCount = 18;
var claimFlashMillis = 420;
var recentClaimMillis = 700;
var winAnimationMillis = 5e3;
var idleColor = "#03060b";
var white = { r: 255, g: 255, b: 255 };
var dueloPlayerPalette = [
  "#ff3048",
  "#24d9ff",
  "#42e879",
  "#ff4fd8",
  "#376bff",
  "#ffd84d",
  "#a66cff",
  "#ff8a3d"
];
function createGame3(config) {
  return new DueloGame(config);
}
function dueloReadyZones(playerCount) {
  const count = clamp(Math.round(playerCount), manifest3.players.min, manifest3.players.max);
  const right = FLOOR_COLS - startPadSize;
  const bottom = FLOOR_ROWS - startPadSize;
  const centerX = Math.floor((FLOOR_COLS - startPadSize) / 2);
  const centerY = Math.floor((FLOOR_ROWS - startPadSize) / 2);
  const origins = count === 2 ? [[0, centerY], [right, centerY]] : count === 3 ? [[0, 0], [right, 0], [centerX, bottom]] : [
    [0, 0],
    [right, bottom],
    [0, bottom],
    [right, 0],
    [0, centerY],
    [right, centerY],
    [centerX, 0],
    [centerX, bottom]
  ].slice(0, count);
  return origins.map(([x = 0, y = 0]) => ({
    minX: x,
    maxX: x + startPadSize - 1,
    minY: y,
    maxY: y + startPadSize - 1
  }));
}
var DueloGame = class {
  claimed = new Uint8Array(FRAME_SIZE);
  claimedAt = new Float64Array(FRAME_SIZE);
  claims = [];
  config;
  fillPercent = 60;
  finishAtMillis = 0;
  lastEvent = gameEvent("none", "Listo", 0);
  motionEventId = 0;
  nowMillis = 0;
  owners = new Int16Array(FRAME_SIZE).fill(-1);
  phase = "waiting";
  players = [];
  readyGate;
  readyZones = [];
  recentClaim = null;
  rng;
  startedAtMillis = 0;
  targets = [];
  winnerIndex = -1;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest3);
    this.rng = createSeededRng(this.config.seed);
    this.readyZones = dueloReadyZones(this.config.playerCount);
    this.readyGate = createPlayerReadyGate(manifest3.start, this.readyZones, this.config.nowMillis);
    this.resetGame(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetGame(nowMillis);
    this.lastEvent = gameEvent("ready", this.waitingMessage(), nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.recordEvents(this.applyReadyTransition(this.readyGate.update(event), event.atMillis));
    }
    if (this.phase !== "running" || !event.pressed || !inFloorBounds(event.x, event.y)) {
      return [];
    }
    const eventResult = this.claimTile(event.x, event.y, event.atMillis);
    return this.recordEvents(eventResult ? [eventResult] : []);
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.recordEvents(this.applyReadyTransition(
        this.readyGate.update({ ...event, pressed: false }),
        event.atMillis
      ));
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.recordEvents(this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis));
    }
    if (this.phase === "finished" && event.atMillis - this.finishAtMillis >= winAnimationMillis) {
      this.resetGame(event.atMillis);
      return this.recordEvents([gameEvent("ready", "Nuevo duelo", event.atMillis)]);
    }
    return [];
  }
  render() {
    const frame = createFrame(idleColor);
    if (this.phase === "waiting") {
      this.drawWaiting(frame);
    } else if (this.phase === "starting") {
      this.drawStarting(frame);
    } else if (this.phase === "running") {
      this.drawBoard(frame);
    } else {
      this.drawVictory(frame);
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    const progress = this.playerProgress();
    const leadingPlayer = progress.reduce((best, player) => {
      if (!best || player.progress > best.progress || player.progress === best.progress && player.index < best.index) {
        return player;
      }
      return best;
    }, void 0);
    const leader = leadingPlayer && progress.filter((player) => player.progress === leadingPlayer.progress).length === 1 ? leadingPlayer : void 0;
    const claimedTargets = this.claims.reduce((sum, value) => sum + value, 0);
    const totalTargets = this.targets.reduce((sum, value) => sum + value, 0);
    const winner = this.players[this.winnerIndex];
    const elapsedEnd = this.phase === "finished" ? this.finishAtMillis : this.nowMillis;
    const recentClaimAge = this.recentClaim ? this.nowMillis - this.recentClaim.atMillis : Number.POSITIVE_INFINITY;
    return {
      currentGame: manifest3.id,
      label: manifest3.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players.map((player, index) => ({ ...player, score: this.claims[index] ?? 0 })),
      score: Math.max(0, ...this.claims),
      lives: -1,
      elapsedMillis: this.phase === "waiting" || this.phase === "starting" ? 0 : Math.max(0, elapsedEnd - this.startedAtMillis),
      remainingMillis: this.phase === "finished" ? Math.max(0, this.finishAtMillis + winAnimationMillis - this.nowMillis) : 0,
      activeTargets: totalTargets - claimedTargets,
      success: this.winnerIndex >= 0,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: Math.max(0, ...this.targets),
      claimedTargets,
      fillPercent: this.fillPercent,
      leaderIndex: leader?.index ?? -1,
      leaderLabel: leader?.label ?? "-",
      motionEventId: this.motionEventId,
      playerProgress: progress,
      readyPlayerIndices: this.players.filter((_, index) => this.readyGate.zoneReady(index, this.nowMillis)).map((player) => player.index),
      recentClaim: this.recentClaim && recentClaimAge < recentClaimMillis ? {
        playerIndex: this.recentClaim.playerIndex,
        remainingMillis: recentClaimMillis - recentClaimAge,
        x: this.recentClaim.x,
        y: this.recentClaim.y
      } : null,
      remainingTargets: totalTargets - claimedTargets,
      totalTargets,
      winnerIndex: this.winnerIndex,
      winnerLabel: winner?.label ?? ""
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest3);
    this.readyZones = dueloReadyZones(this.config.playerCount);
    this.readyGate = createPlayerReadyGate(manifest3.start, this.readyZones, this.config.nowMillis);
    this.resetGame(this.config.nowMillis);
    this.lastEvent = gameEvent("ready", this.waitingMessage(), this.config.nowMillis);
  }
  playerReadyZones() {
    return this.readyZones.map((zone) => ({ ...zone }));
  }
  targetOwner(x, y) {
    return inFloorBounds(x, y) ? this.owners[y * FLOOR_COLS + x] ?? -1 : -1;
  }
  targetClaimed(x, y) {
    return inFloorBounds(x, y) && this.claimed[y * FLOOR_COLS + x] === 1;
  }
  resetGame(nowMillis) {
    this.nowMillis = nowMillis;
    this.startedAtMillis = nowMillis;
    this.finishAtMillis = 0;
    this.phase = "waiting";
    this.winnerIndex = -1;
    this.motionEventId = 1;
    this.recentClaim = null;
    this.claimed.fill(0);
    this.claimedAt.fill(0);
    this.readyGate.reset(nowMillis);
    this.players = this.createPlayers();
    this.fillPercent = this.readFillPercent();
    this.rng = createSeededRng(this.config.seed);
    const board = generateBalancedBoard(this.config.playerCount, this.fillPercent, this.rng);
    this.owners = board.owners;
    this.targets = board.targets;
    this.claims = Array.from({ length: this.config.playerCount }, () => 0);
    this.lastEvent = gameEvent("ready", this.waitingMessage(), nowMillis);
  }
  createPlayers() {
    return Array.from({ length: this.config.playerCount }, (_, index) => {
      const configured = this.config.players[index];
      const fallbackColor = dueloPlayerPalette[index] ?? dueloPlayerPalette[0];
      const configuredColor = configured?.color;
      const color = configuredColor && /^#[0-9a-f]{6}$/i.test(configuredColor) ? configuredColor : fallbackColor;
      const label = String(configured?.label || configured?.name || `Jugador ${index + 1}`).trim();
      return {
        index,
        label: label || `Jugador ${index + 1}`,
        color,
        score: 0,
        lives: -1
      };
    });
  }
  readFillPercent() {
    const base = readGameConfigOption(this.config.options, dueloConfigVars.baseFillPercent);
    if (this.config.difficulty !== "hard") {
      return Math.round(base);
    }
    const multiplier = readGameConfigOption(this.config.options, dueloConfigVars.hardFillMultiplier);
    return Math.round(clamp(base * multiplier, 1, 100));
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("start", "Todos en posici\xF3n", nowMillis)];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a tu zona iluminada", nowMillis)];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.motionEventId += 1;
      return [gameEvent("start", "Reclama todas las baldosas de tu color", nowMillis)];
    }
    return [];
  }
  claimTile(x, y, nowMillis) {
    const index = y * FLOOR_COLS + x;
    const owner = this.owners[index] ?? -1;
    if (owner < 0 || owner >= this.players.length || this.claimed[index] === 1) {
      return void 0;
    }
    this.claimed[index] = 1;
    this.claimedAt[index] = nowMillis;
    this.claims[owner] = (this.claims[owner] ?? 0) + 1;
    this.recentClaim = { atMillis: nowMillis, playerIndex: owner, x, y };
    this.motionEventId += 1;
    const remaining = Math.max(0, (this.targets[owner] ?? 0) - (this.claims[owner] ?? 0));
    const label = this.players[owner]?.label ?? `Jugador ${owner + 1}`;
    if (remaining === 0) {
      this.phase = "finished";
      this.finishAtMillis = nowMillis;
      this.winnerIndex = owner;
      return gameEvent("win", `${label} gana el duelo`, nowMillis);
    }
    return gameEvent("coin", `${label}: ${remaining} por reclamar`, nowMillis);
  }
  recordEvents(events) {
    const last = events.at(-1);
    if (last) this.lastEvent = last;
    return events;
  }
  waitingMessage() {
    return `Duelo espera a ${this.config.playerCount} jugadores`;
  }
  playerProgress() {
    return this.players.map((player, index) => {
      const target = this.targets[index] ?? 0;
      const claimed = this.claims[index] ?? 0;
      return {
        claimed,
        color: player.color,
        index,
        label: player.label,
        progress: target > 0 ? claimed / target : 0,
        remaining: Math.max(0, target - claimed),
        target
      };
    });
  }
  drawWaiting(frame) {
    const pulse = 0.5 + 0.5 * Math.sin(this.nowMillis / 310);
    this.readyZones.forEach((zone, index) => {
      const ready = this.readyGate.zoneReady(index, this.nowMillis);
      this.drawReadyZone(frame, zone, this.players[index]?.color ?? dueloPlayerPalette[0], ready, pulse);
    });
    paintDiamondRing(frame, {
      color: "#13263a",
      radius: 2 + Math.floor(this.nowMillis / 180) % 20,
      thickness: 0.35
    });
  }
  drawStarting(frame) {
    const step = Math.floor(this.nowMillis / 110);
    paintDiamondWave(frame, {
      bandWidth: 2,
      period: 8,
      step,
      color: ({ distance }) => {
        const player = this.players[Math.floor(distance) % this.players.length];
        return dimColor(player?.color ?? dueloPlayerPalette[0], 58);
      }
    });
    this.readyZones.forEach((zone, index) => {
      this.drawReadyZone(frame, zone, this.players[index]?.color ?? dueloPlayerPalette[0], true, 1);
    });
  }
  drawReadyZone(frame, zone, color, ready, pulse) {
    for (let y = zone.minY; y <= zone.maxY; y += 1) {
      for (let x = zone.minX; x <= zone.maxX; x += 1) {
        const edge = x === zone.minX || x === zone.maxX || y === zone.minY || y === zone.maxY;
        const intensity = ready ? edge ? 100 : 78 : edge ? 26 + pulse * 24 : 12 + pulse * 12;
        paintFrameCell(frame, x, y, dimColor(color, intensity));
      }
    }
  }
  drawBoard(frame) {
    const progress = this.playerProgress();
    for (let index = 0; index < FRAME_SIZE; index += 1) {
      const owner = this.owners[index] ?? -1;
      if (owner < 0) continue;
      const x = index % FLOOR_COLS;
      const y = Math.floor(index / FLOOR_COLS);
      const color = this.players[owner]?.color ?? dueloPlayerPalette[0];
      if (this.claimed[index] === 1) {
        const age = this.nowMillis - (this.claimedAt[index] ?? 0);
        if (age < claimFlashMillis) {
          const flash = 1 - age / claimFlashMillis;
          paintFrameCell(frame, x, y, mixWithWhite(color, 35 + flash * 65));
        } else {
          paintFrameCell(frame, x, y, dimColor(color, 12));
        }
        continue;
      }
      const urgency = (progress[owner]?.progress ?? 0) >= 0.88 ? 16 : 0;
      const pulse = 0.5 + 0.5 * Math.sin(this.nowMillis / 360 + x * 0.74 + y * 0.18 + owner);
      paintFrameCell(frame, x, y, dimColor(color, 58 + urgency + pulse * 24));
    }
  }
  drawVictory(frame) {
    const winnerColor = this.players[this.winnerIndex]?.color ?? dueloPlayerPalette[0];
    const winnerRgb = parseHexColor(winnerColor);
    const elapsed = Math.max(0, this.nowMillis - this.finishAtMillis);
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const shimmer = 0.5 + 0.5 * Math.sin(elapsed / 170 + x * 0.58 + y * 0.19);
        const glow = addRgb(scaleRgb(winnerRgb, 48 + shimmer * 42), scaleRgb(white, shimmer * 16));
        paintFrameCell(frame, x, y, rgbToHex(glow));
      }
    }
    paintDiamondWave(frame, {
      bandWidth: 2,
      period: 9,
      step: Math.floor(elapsed / 90),
      color: "#ffffff"
    });
  }
};
function generateBalancedBoard(playerCount, fillPercent, rng) {
  const requestedTargets = Math.round(FRAME_SIZE * fillPercent / 100);
  const targetsPerPlayer = Math.max(1, Math.floor(requestedTargets / playerCount));
  const targets = Array.from({ length: playerCount }, () => targetsPerPlayer);
  let bestOwners = new Int16Array(FRAME_SIZE).fill(-1);
  let bestPenalty = Number.POSITIVE_INFINITY;
  for (let attempt = 0; attempt < boardCandidateCount; attempt += 1) {
    const candidate = generateBoardCandidate(targets, rng);
    const penalty = boardOrganicPenalty(candidate);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestOwners = candidate;
    }
  }
  return { owners: bestOwners, targets };
}
function generateBoardCandidate(targets, rng) {
  const owners = new Int16Array(FRAME_SIZE).fill(-1);
  const counts = Array.from({ length: targets.length }, () => 0);
  const order = Array.from({ length: FRAME_SIZE }, (_, index) => index);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swapIndex = rng.int(index + 1);
    [order[index], order[swapIndex]] = [order[swapIndex] ?? 0, order[index] ?? 0];
  }
  for (const tileIndex of order) {
    const x = tileIndex % FLOOR_COLS;
    const y = Math.floor(tileIndex / FLOOR_COLS);
    let bestPlayer = -1;
    let bestScore = Number.POSITIVE_INFINITY;
    for (let player = 0; player < targets.length; player += 1) {
      const target = targets[player] ?? 0;
      if ((counts[player] ?? 0) >= target) continue;
      const sameOrthogonal = sameOrthogonalNeighbors(owners, x, y, player);
      const sameDiagonal = sameDiagonalNeighbors(owners, x, y, player);
      const score = localAdjacencyPenalty(sameOrthogonal) + sameDiagonal * 0.12 + (counts[player] ?? 0) / Math.max(target, 1) * 0.2 + rng.next() * 1.35;
      if (score < bestScore) {
        bestScore = score;
        bestPlayer = player;
      }
    }
    if (bestPlayer >= 0) {
      owners[tileIndex] = bestPlayer;
      counts[bestPlayer] = (counts[bestPlayer] ?? 0) + 1;
    }
  }
  return owners;
}
function boardOrganicPenalty(owners) {
  let penalty = 0;
  for (let y = 0; y < FLOOR_ROWS; y += 1) {
    let runOwner = -2;
    let runLength = 0;
    for (let x = 0; x < FLOOR_COLS; x += 1) {
      const owner = owners[y * FLOOR_COLS + x] ?? -1;
      if (owner >= 0) {
        const same = sameOrthogonalNeighbors(owners, x, y, owner);
        penalty += localAdjacencyPenalty(same) + (same >= 3 ? 6 : 0);
      }
      if (owner === runOwner && owner >= 0) runLength += 1;
      else {
        runOwner = owner;
        runLength = 1;
      }
      if (runOwner >= 0 && runLength > 5) penalty += (runLength - 5) * 7;
    }
  }
  for (let x = 0; x < FLOOR_COLS; x += 1) {
    let runOwner = -2;
    let runLength = 0;
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      const owner = owners[y * FLOOR_COLS + x] ?? -1;
      if (owner === runOwner && owner >= 0) runLength += 1;
      else {
        runOwner = owner;
        runLength = 1;
      }
      if (runOwner >= 0 && runLength > 5) penalty += (runLength - 5) * 7;
    }
  }
  return penalty;
}
function sameOrthogonalNeighbors(owners, x, y, player) {
  return [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1]
  ].filter(([nextX = -1, nextY = -1]) => inFloorBounds(nextX, nextY) && owners[nextY * FLOOR_COLS + nextX] === player).length;
}
function sameDiagonalNeighbors(owners, x, y, player) {
  return [
    [x - 1, y - 1],
    [x + 1, y - 1],
    [x - 1, y + 1],
    [x + 1, y + 1]
  ].filter(([nextX = -1, nextY = -1]) => inFloorBounds(nextX, nextY) && owners[nextY * FLOOR_COLS + nextX] === player).length;
}
function localAdjacencyPenalty(sameOrthogonal) {
  if (sameOrthogonal === 0) return 0.85;
  if (sameOrthogonal === 1) return 0;
  if (sameOrthogonal === 2) return 0.45;
  return 4.5;
}
function parseHexColor(color) {
  if (!/^#[0-9a-f]{6}$/i.test(color)) return white;
  return {
    r: Number.parseInt(color.slice(1, 3), 16),
    g: Number.parseInt(color.slice(3, 5), 16),
    b: Number.parseInt(color.slice(5, 7), 16)
  };
}
function dimColor(color, percent) {
  return rgbToHex(scaleRgb(parseHexColor(color), percent));
}
function mixWithWhite(color, whitePercent) {
  const ratio = clamp(whitePercent, 0, 100);
  return rgbToHex(addRgb(
    scaleRgb(parseHexColor(color), 100 - ratio),
    scaleRgb(white, ratio)
  ));
}

// games/equilibrio/src/manifest.ts
var manifest4 = {
  id: "equilibrio",
  label: "Equilibrio",
  description: "Coordina dos lados del suelo, ocupa las plataformas sim\xE9tricas y mant\xE9n la balanza estable.",
  availability: { development: true, production: true },
  catalog: {
    category: "team",
    color: "#5fff9e",
    durationLabel: "70s",
    modeLabel: "Cooperativo",
    audioLabel: "Efectos",
    rules: [
      "Entra en las dos zonas centrales para iniciar",
      "Ocupa a la vez las dos plataformas iluminadas",
      "Mant\xE9n el equilibrio hasta completar cada nivel",
      "Evita las baldosas oscuras para conservar la estabilidad"
    ]
  },
  players: {
    allowAny: true,
    min: 2,
    max: 8
  },
  start: { mode: "player-ready", countdownMillis: 2e3, releaseGraceMillis: 1500 },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    }
  },
  defaultDurationMillis: 7e4,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 4, y: 16 },
      { atMillis: 180, type: "press", x: 11, y: 16 },
      { atMillis: 2250, type: "release", x: 4, y: 16 },
      { atMillis: 2260, type: "release", x: 11, y: 16 },
      { atMillis: 2400, type: "press", x: 3, y: 6 },
      { atMillis: 2480, type: "press", x: 12, y: 6 }
    ],
    captureStartMillis: 2650,
    frameCount: 24,
    frameIntervalMillis: 100
  },
  tags: ["equilibrio", "cooperativo", "coordinacion", "multijugador", "typescript"]
};

// games/equilibrio/src/game.ts
var equilibrioRoundWinMillis = 3e3;
var equilibrioGameWinMillis = 5e3;
var equilibrioGameFailMillis = 5e3;
var equilibrioMaxStability = 100;
var backgroundColor3 = "#03080a";
var leftColor = "#35d7ff";
var rightColor = "#ff3bd7";
var successColors = ["#35d7ff", "#5fff9e", "#ffe176", "#ff3bd7", "#ffffff"];
var readyZones = [
  { minX: 2, maxX: 6, minY: 14, maxY: 18 },
  { minX: 9, maxX: 13, minY: 14, maxY: 18 }
];
var equilibrioChallenges = [
  { left: { minX: 1, maxX: 4, minY: 4, maxY: 8 }, right: { minX: 11, maxX: 14, minY: 4, maxY: 8 } },
  { left: { minX: 3, maxX: 6, minY: 12, maxY: 16 }, right: { minX: 9, maxX: 12, minY: 12, maxY: 16 } },
  { left: { minX: 1, maxX: 4, minY: 22, maxY: 26 }, right: { minX: 11, maxX: 14, minY: 22, maxY: 26 } },
  { left: { minX: 4, maxX: 7, minY: 5, maxY: 9 }, right: { minX: 8, maxX: 11, minY: 22, maxY: 26 } },
  { left: { minX: 0, maxX: 3, minY: 27, maxY: 31 }, right: { minX: 12, maxX: 15, minY: 0, maxY: 4 } }
];
var difficultyProfiles = {
  easy: { holdMillis: 1200, stabilityPenalty: 8 },
  medium: { holdMillis: 1600, stabilityPenalty: 12 },
  hard: { holdMillis: 2e3, stabilityPenalty: 16 },
  expert: { holdMillis: 2400, stabilityPenalty: 20 }
};
function createGame4(config) {
  return new EquilibrioGame(config);
}
var EquilibrioGame = class {
  challengeIndex = 0;
  config;
  finishedAtMillis = 0;
  heldTiles = /* @__PURE__ */ new Set();
  holdStartedAtMillis = null;
  lastEvent = gameEvent("none", "La balanza est\xE1 preparada", 0);
  nowMillis = 0;
  phase = "ready";
  players = [];
  readyGate;
  roundWinAtMillis = 0;
  stability = equilibrioMaxStability;
  startedAtMillis = 0;
  success = false;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest4);
    this.readyGate = createPlayerReadyGate(manifest4.start, readyZones, this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Ocupa las dos zonas centrales", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) return [];
    const key = tileKey(event.x, event.y);
    if (this.heldTiles.has(key)) return [];
    this.heldTiles.add(key);
    if (!this.currentPadSide(event.x, event.y)) {
      this.stability = Math.max(0, this.stability - this.profile().stabilityPenalty);
      this.holdStartedAtMillis = null;
      if (this.stability === 0) return this.finish(false, event.atMillis, "La balanza perdi\xF3 la estabilidad");
      this.lastEvent = gameEvent("miss", "Baldosa fuera de equilibrio", event.atMillis);
      return [this.lastEvent];
    }
    this.updateHoldStart(event.atMillis);
    this.lastEvent = gameEvent("hold", this.bothPadsOccupied() ? "Mant\xE9n el equilibrio" : "Falta el otro lado", event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    this.heldTiles.delete(tileKey(event.x, event.y));
    if (this.phase === "running" && !this.bothPadsOccupied()) this.holdStartedAtMillis = null;
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase === "finished") {
      const resultMillis = this.success ? equilibrioGameWinMillis : equilibrioGameFailMillis;
      if (event.atMillis - this.finishedAtMillis >= resultMillis) {
        this.resetState(event.atMillis);
        this.phase = "waiting";
        this.lastEvent = gameEvent("ready", "Ocupa las dos zonas centrales", event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase === "round-win") {
      if (event.atMillis - this.roundWinAtMillis >= equilibrioRoundWinMillis) {
        this.challengeIndex += 1;
        this.phase = "running";
        this.heldTiles.clear();
        this.holdStartedAtMillis = null;
        this.lastEvent = gameEvent("start", `Nivel ${this.challengeIndex + 1}`, event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase !== "running") return [];
    if (this.remainingMillis() <= 0) return this.finish(false, event.atMillis, "Se acab\xF3 el tiempo");
    this.updateHoldStart(event.atMillis);
    if (this.holdStartedAtMillis !== null && event.atMillis - this.holdStartedAtMillis >= this.profile().holdMillis) {
      if (this.challengeIndex + 1 >= equilibrioChallenges.length) {
        return this.finish(true, event.atMillis, "Equilibrio perfecto");
      }
      this.phase = "round-win";
      this.roundWinAtMillis = event.atMillis;
      this.holdStartedAtMillis = null;
      this.players = this.scoredPlayers();
      this.lastEvent = gameEvent("round-win", `Nivel ${this.challengeIndex + 1} superado`, event.atMillis);
      return [this.lastEvent];
    }
    return [];
  }
  render() {
    const frame = createFrame(backgroundColor3);
    this.paintBoard(frame);
    if (this.phase === "waiting" || this.phase === "starting") {
      readyZones.forEach((zone, index) => {
        const ready = this.readyGate.zoneReady(index, this.nowMillis);
        fillFrameRect(frame, zone.minX, zone.minY, zone.maxX, zone.maxY, ready ? "#ffffff" : index === 0 ? leftColor : rightColor);
      });
      const radius = 2 + Math.floor(this.nowMillis / 150) % 9;
      paintDiamondRing(frame, { centerX: 8, centerY: 16, color: this.phase === "starting" ? "#ffe176" : "#5fff9e", radius });
      return frame;
    }
    if (this.phase === "round-win") {
      this.paintRoundWin(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.paintResult(frame);
      return frame;
    }
    const challenge = equilibrioChallenges[this.challengeIndex];
    if (challenge) {
      this.paintPad(frame, challenge.left, leftColor, this.padOccupied(challenge.left));
      this.paintPad(frame, challenge.right, rightColor, this.padOccupied(challenge.right));
    }
    const progress = this.holdProgress();
    const progressCells = Math.round(progress * FLOOR_ROWS);
    for (let offset = 0; offset < progressCells; offset += 1) {
      paintFrameCell(frame, 7, FLOOR_ROWS - 1 - offset, "#5fff9e");
      paintFrameCell(frame, 8, FLOOR_ROWS - 1 - offset, "#5fff9e");
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    const completed = this.challengeIndex + Number(this.phase === "round-win" || this.success);
    return {
      currentGame: manifest4.id,
      label: manifest4.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: Math.min(completed, equilibrioChallenges.length),
      lives: -1,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? 2 : 0,
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: equilibrioChallenges.length,
      challengeCount: equilibrioChallenges.length,
      challengeIndex: Math.min(this.challengeIndex, equilibrioChallenges.length - 1),
      holdMillis: Math.round(this.holdProgress() * this.profile().holdMillis),
      holdTargetMillis: this.profile().holdMillis,
      leftOccupied: this.currentPadOccupied("left"),
      rightOccupied: this.currentPadOccupied("right"),
      stability: this.stability,
      stage: this.phase === "finished" ? this.success ? "game-win" : "game-fail" : this.phase === "round-win" ? "round-win" : this.phase === "running" ? "balancing" : "waiting"
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest4);
    this.readyGate = createPlayerReadyGate(manifest4.start, readyZones, this.config.nowMillis);
    this.resetState(this.config.nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Ocupa las dos zonas centrales", this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Balanza preparada", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a las dos zonas centrales", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.heldTiles.clear();
      this.lastEvent = gameEvent("start", "Busca las dos plataformas", nowMillis);
      return [this.lastEvent];
    }
    return [];
  }
  finish(success, atMillis, message) {
    this.phase = "finished";
    this.success = success;
    this.finishedAtMillis = atMillis;
    this.heldTiles.clear();
    this.holdStartedAtMillis = null;
    if (success) this.challengeIndex = equilibrioChallenges.length - 1;
    this.players = this.scoredPlayers();
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  paintBoard(frame) {
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      paintFrameCell(frame, 7, y, "#10242c");
      paintFrameCell(frame, 8, y, "#281329");
    }
    for (let y = 3; y < FLOOR_ROWS; y += 6) {
      fillFrameRect(frame, 0, y, 6, y, "#07151b");
      fillFrameRect(frame, 9, y, FLOOR_COLS - 1, y, "#190a1c");
    }
  }
  paintPad(frame, zone, color, occupied) {
    fillFrameRect(frame, zone.minX, zone.minY, zone.maxX, zone.maxY, occupied ? "#ffffff" : color);
    const insetColor = occupied ? color : "#061015";
    if (zone.maxX - zone.minX > 1 && zone.maxY - zone.minY > 1) {
      fillFrameRect(frame, zone.minX + 1, zone.minY + 1, zone.maxX - 1, zone.maxY - 1, insetColor);
    }
  }
  paintRoundWin(frame) {
    const elapsed = Math.max(0, this.nowMillis - this.roundWinAtMillis);
    paintDiamondWave(frame, {
      centerX: 8,
      centerY: 16,
      color: ({ distance, step }) => successColors[(distance + step) % successColors.length],
      period: 7,
      bandWidth: 4,
      step: Math.floor(elapsed / 90)
    });
  }
  paintResult(frame) {
    const elapsed = Math.max(0, this.nowMillis - this.finishedAtMillis);
    if (this.success) {
      paintDiamondWave(frame, {
        centerX: 8,
        centerY: 16,
        color: ({ distance, step }) => successColors[(distance + step) % successColors.length],
        period: 9,
        bandWidth: 6,
        step: Math.floor(elapsed / 85)
      });
      return;
    }
    fillFrameRect(frame, 0, 0, FLOOR_COLS - 1, FLOOR_ROWS - 1, Math.floor(elapsed / 180) % 2 === 0 ? "#4a0715" : "#17030a");
    paintDiamondRing(frame, { centerX: 8, centerY: 16, color: "#ff3151", radius: 2 + Math.floor(elapsed / 100) % 13 });
  }
  updateHoldStart(atMillis) {
    if (this.bothPadsOccupied()) {
      this.holdStartedAtMillis ??= atMillis;
    } else {
      this.holdStartedAtMillis = null;
    }
  }
  bothPadsOccupied() {
    return this.currentPadOccupied("left") && this.currentPadOccupied("right");
  }
  currentPadOccupied(side) {
    const challenge = equilibrioChallenges[this.challengeIndex];
    return challenge ? this.padOccupied(challenge[side]) : false;
  }
  padOccupied(zone) {
    for (let y = zone.minY; y <= zone.maxY; y += 1) {
      for (let x = zone.minX; x <= zone.maxX; x += 1) {
        if (this.heldTiles.has(tileKey(x, y))) return true;
      }
    }
    return false;
  }
  currentPadSide(x, y) {
    const challenge = equilibrioChallenges[this.challengeIndex];
    if (!challenge) return null;
    if (insideZone(x, y, challenge.left)) return "left";
    if (insideZone(x, y, challenge.right)) return "right";
    return null;
  }
  holdProgress() {
    if (this.holdStartedAtMillis === null || !this.bothPadsOccupied()) return 0;
    return Math.max(0, Math.min(1, (this.nowMillis - this.holdStartedAtMillis) / this.profile().holdMillis));
  }
  profile() {
    return difficultyProfiles[this.config.difficulty] ?? difficultyProfiles.medium;
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting" || this.phase === "ready") return 0;
    return Math.max(0, this.nowMillis - this.startedAtMillis);
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  scoredPlayers() {
    const score = Math.min(this.challengeIndex + Number(this.phase === "round-win" || this.success), equilibrioChallenges.length);
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({ ...player, label: player.label || `Jugador ${player.index + 1}`, score, lives: -1 }));
  }
  resetState(nowMillis) {
    this.challengeIndex = 0;
    this.finishedAtMillis = 0;
    this.heldTiles.clear();
    this.holdStartedAtMillis = null;
    this.nowMillis = nowMillis;
    this.phase = "ready";
    this.readyGate.reset(nowMillis);
    this.roundWinAtMillis = 0;
    this.stability = equilibrioMaxStability;
    this.startedAtMillis = nowMillis;
    this.success = false;
    this.players = this.scoredPlayers();
  }
};
function tileKey(x, y) {
  return `${x},${y}`;
}
function insideZone(x, y, zone) {
  return x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY;
}

// games/estela/src/manifest.ts
var manifest5 = {
  id: "estela",
  label: "Estela",
  description: "Dibuja una estela de luz, evita todos los rastros y s\xE9 el \xFAltimo jugador en pie.",
  availability: { development: true, production: true },
  catalog: {
    category: "versus",
    color: "#d85cff",
    durationLabel: "Al mejor de 3",
    modeLabel: "Supervivencia de luz",
    audioLabel: "M\xFAsica + efectos",
    rules: [
      "Cada jugador empieza en la plataforma de su color",
      "Mu\xE9vete para extender tu estela sin tocar ning\xFAn rastro",
      "El \xFAltimo jugador en pie gana la ronda"
    ]
  },
  players: { allowAny: false, min: 2, max: 8 },
  start: { mode: "player-ready", countdownMillis: 3e3, releaseGraceMillis: 2e3 },
  config: { difficulty: { default: "medium", options: ["easy", "medium", "hard"] } },
  defaultDurationMillis: 0,
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 4,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 2, y: 2 },
      { atMillis: 100, type: "press", x: 13, y: 29 },
      { atMillis: 100, type: "press", x: 13, y: 2 },
      { atMillis: 100, type: "press", x: 2, y: 29 }
    ],
    captureStartMillis: 3300,
    frameCount: 24,
    frameIntervalMillis: 120
  },
  tags: ["competitive", "multiplayer", "light-trails", "typescript"]
};

// games/estela/src/game.ts
var roundsToWin = 2;
var roundWinAnimationMillis = 1800;
var gameWinAnimationMillis2 = 3200;
var playerColors = ["#ff365c", "#26d9ff", "#66ff9a", "#ffe176", "#d85cff", "#ff8a36", "#ffffff", "#3d73ff"];
var allStartPositions = [
  { x: 2, y: 2 },
  { x: 13, y: 29 },
  { x: 13, y: 2 },
  { x: 2, y: 29 },
  { x: 7, y: 2 },
  { x: 8, y: 29 },
  { x: 2, y: 15 },
  { x: 13, y: 16 }
];
var shrinkIntervals = { easy: 18e3, medium: 13e3, hard: 9e3 };
function createGame5(config) {
  return new EstelaGame(config);
}
function estelaStartPositions(count) {
  return allStartPositions.slice(0, count).map((position) => ({ ...position }));
}
var EstelaGame = class {
  alive = [];
  config;
  currentPositions = [];
  currentRound = 1;
  finishedAtMillis;
  gameWinnerIndex = -1;
  lastEvent = gameEvent("none", "Busca tu plataforma", 0);
  nowMillis = 0;
  phase = "ready";
  players = [];
  readyGate;
  roundStartedAtMillis = 0;
  roundTransitionAtMillis = 0;
  roundWinnerIndex = -1;
  roundWins = [];
  startPositions = [];
  trails = /* @__PURE__ */ new Map();
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest5);
    this.startPositions = estelaStartPositions(this.config.playerCount);
    this.readyGate = createPlayerReadyGate(manifest5.start, this.readyZones(), this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) return [];
    const playerIndex = this.nearestAlivePlayer(event.x, event.y);
    if (playerIndex < 0) return [];
    if (!this.inArena(event.x, event.y) || this.trails.has(tileKey2(event.x, event.y))) {
      return this.eliminate(playerIndex, event.atMillis);
    }
    this.currentPositions[playerIndex] = { x: event.x, y: event.y };
    this.trails.set(tileKey2(event.x, event.y), playerIndex);
    this.players = this.scoredPlayers();
    this.lastEvent = gameEvent("move", `${this.playerLabel(playerIndex)} extiende su estela`, event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase === "round-win" && event.atMillis - this.roundTransitionAtMillis >= roundWinAnimationMillis) {
      if ((this.roundWins[this.roundWinnerIndex] ?? 0) >= roundsToWin) {
        this.phase = "finished";
        this.gameWinnerIndex = this.roundWinnerIndex;
        this.finishedAtMillis = event.atMillis;
        this.lastEvent = gameEvent("win", `\xA1Gana ${this.playerLabel(this.gameWinnerIndex)}!`, event.atMillis);
      } else {
        this.currentRound += 1;
        this.resetRound(event.atMillis);
        this.phase = "running";
        this.lastEvent = gameEvent("start", `Ronda ${this.currentRound}`, event.atMillis);
      }
      return [this.lastEvent];
    }
    if (this.phase !== "running") return [];
    const events = [];
    for (const [index, position] of this.currentPositions.entries()) {
      if (this.alive[index] && !this.inArena(position.x, position.y)) events.push(...this.eliminate(index, event.atMillis));
      if (this.phase !== "running") break;
    }
    return events;
  }
  render() {
    const frame = createFrame("#02030a");
    if (this.phase === "waiting" || this.phase === "starting") {
      this.startPositions.forEach((position, index) => {
        const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 180));
        paintDiamondRing(frame, { centerX: position.x, centerY: position.y, radius: 1 + step % 3, color: playerColors[index] ?? "#ffffff" });
        paintFrameCell(frame, position.x, position.y, playerColors[index] ?? "#ffffff");
      });
      return frame;
    }
    if (this.phase === "finished") {
      const step = Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 110);
      paintDiamondWave(frame, {
        color: ({ distance }) => playerColors[(distance + step) % playerColors.length] ?? "#ffffff",
        step
      });
      return frame;
    }
    if (this.phase === "round-win") {
      const winnerColor = playerColors[this.roundWinnerIndex] ?? "#ffffff";
      fillFrameRect(frame, 0, 0, FLOOR_COLS, FLOOR_ROWS, "#050812");
      const step = Math.floor((this.nowMillis - this.roundTransitionAtMillis) / 130);
      paintDiamondWave(frame, { color: winnerColor, step });
      return frame;
    }
    const inset = this.arenaInset();
    for (let border = 0; border < inset; border += 1) {
      fillFrameRect(frame, border, border, FLOOR_COLS - border * 2, 1, "#ff244d");
      fillFrameRect(frame, border, FLOOR_ROWS - border - 1, FLOOR_COLS - border * 2, 1, "#ff244d");
      fillFrameRect(frame, border, border, 1, FLOOR_ROWS - border * 2, "#ff244d");
      fillFrameRect(frame, FLOOR_COLS - border - 1, border, 1, FLOOR_ROWS - border * 2, "#ff244d");
    }
    for (const [key, owner] of this.trails) {
      const [x, y] = parseTile2(key);
      paintFrameCell(frame, x, y, playerColors[owner] ?? "#ffffff");
    }
    this.currentPositions.forEach((position, index) => {
      if (this.alive[index]) paintFrameCell(frame, position.x, position.y, "#ffffff");
    });
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest5.id,
      label: manifest5.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: Math.max(...this.roundWins, 0),
      lives: -1,
      elapsedMillis: this.phase === "waiting" || this.phase === "starting" ? 0 : Math.max(0, this.nowMillis - this.roundStartedAtMillis),
      remainingMillis: 0,
      activeTargets: this.alive.filter(Boolean).length,
      success: this.phase === "finished",
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      matchTarget: roundsToWin,
      arenaInset: this.arenaInset(),
      currentRound: this.currentRound,
      gameWinnerIndex: this.gameWinnerIndex,
      playerProgress: this.progress(),
      roundWinnerIndex: this.roundWinnerIndex,
      roundsToWin,
      startPositions: this.startPositions.map((position) => ({ ...position })),
      trailCells: [...this.trails].map(([key, playerIndex]) => {
        const [x, y] = parseTile2(key);
        return { x, y, playerIndex };
      }),
      roundWinMillis: this.phase === "round-win" ? Math.max(0, roundWinAnimationMillis - (this.nowMillis - this.roundTransitionAtMillis)) : 0,
      gameWinMillis: this.phase === "finished" ? Math.min(gameWinAnimationMillis2, Math.max(0, this.nowMillis - (this.finishedAtMillis ?? this.nowMillis))) : 0
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest5);
    this.startPositions = estelaStartPositions(this.config.playerCount);
    this.readyGate = createPlayerReadyGate(manifest5.start, this.readyZones(), this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Todos en posici\xF3n", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a tu color", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.resetRound(nowMillis);
      this.lastEvent = gameEvent("start", "\xA1Deja tu estela!", nowMillis);
    } else return [];
    return [this.lastEvent];
  }
  arenaInset() {
    if (this.phase !== "running") return 0;
    const interval = shrinkIntervals[this.config.difficulty] ?? shrinkIntervals.medium;
    return Math.min(4, Math.floor(Math.max(0, this.nowMillis - this.roundStartedAtMillis) / interval));
  }
  eliminate(playerIndex, atMillis) {
    if (!this.alive[playerIndex]) return [];
    this.alive[playerIndex] = false;
    const event = gameEvent("miss", `${this.playerLabel(playerIndex)} queda fuera`, atMillis);
    this.lastEvent = event;
    if (this.alive.filter(Boolean).length <= 1) {
      const winnerIndex = this.alive.findIndex(Boolean);
      if (winnerIndex >= 0) {
        this.roundWinnerIndex = winnerIndex;
        this.roundWins[winnerIndex] = (this.roundWins[winnerIndex] ?? 0) + 1;
        this.players = this.scoredPlayers();
        this.phase = "round-win";
        this.roundTransitionAtMillis = atMillis;
        this.lastEvent = gameEvent("round-win", `Ronda para ${this.playerLabel(winnerIndex)}`, atMillis);
        return [event, this.lastEvent];
      }
    }
    this.players = this.scoredPlayers();
    return [event];
  }
  inArena(x, y) {
    const inset = this.arenaInset();
    return x >= inset && x < FLOOR_COLS - inset && y >= inset && y < FLOOR_ROWS - inset;
  }
  nearestAlivePlayer(x, y) {
    let best = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    this.currentPositions.forEach((position, index) => {
      if (!this.alive[index]) return;
      const distance = Math.abs(position.x - x) + Math.abs(position.y - y);
      if (distance < bestDistance) {
        best = index;
        bestDistance = distance;
      }
    });
    return best;
  }
  playerLabel(index) {
    return this.players[index]?.label ?? `Jugador ${index + 1}`;
  }
  progress() {
    return this.players.map((player, index) => ({
      index,
      label: player.label,
      color: player.color,
      alive: this.alive[index] ?? false,
      roundWins: this.roundWins[index] ?? 0,
      trailLength: [...this.trails.values()].filter((owner) => owner === index).length
    }));
  }
  readyZones() {
    return this.startPositions.map(({ x, y }) => ({
      minX: Math.max(0, x - 1),
      maxX: Math.min(FLOOR_COLS - 1, x + 1),
      minY: Math.max(0, y - 1),
      maxY: Math.min(FLOOR_ROWS - 1, y + 1)
    }));
  }
  resetRound(nowMillis) {
    this.alive = this.startPositions.map(() => true);
    this.currentPositions = this.startPositions.map((position) => ({ ...position }));
    this.roundStartedAtMillis = nowMillis;
    this.roundWinnerIndex = -1;
    this.trails.clear();
    this.startPositions.forEach((position, index) => this.trails.set(tileKey2(position.x, position.y), index));
    this.players = this.scoredPlayers();
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.currentRound = 1;
    this.finishedAtMillis = void 0;
    this.gameWinnerIndex = -1;
    this.lastEvent = gameEvent("ready", "Busca tu plataforma de color", nowMillis);
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.roundTransitionAtMillis = 0;
    this.roundWins = this.startPositions.map(() => 0);
    this.players = defaultPlayers(this.config.playerCount, this.config.players).map((player, index) => ({
      ...player,
      label: this.config.players[index]?.label || this.config.players[index]?.name || `Jugador ${index + 1}`,
      color: this.config.players[index]?.color ?? playerColors[index] ?? "#ffffff",
      lives: -1,
      score: 0
    }));
    this.resetRound(nowMillis);
  }
  scoredPlayers() {
    return this.players.map((player, index) => ({ ...player, score: this.roundWins[index] ?? 0, lives: -1 }));
  }
};
function tileKey2(x, y) {
  return `${x},${y}`;
}
function parseTile2(key) {
  const [x = "0", y = "0"] = key.split(",");
  return [Number(x), Number(y)];
}

// games/guardianes/src/manifest.ts
var manifest6 = {
  id: "guardianes",
  label: "Guardianes",
  description: "Activa los cuatro escudos del suelo y protege el n\xFAcleo de una oleada de amenazas.",
  availability: { development: true, production: true },
  catalog: {
    category: "arcade",
    color: "#35d7ff",
    durationLabel: "42s",
    modeLabel: "Defensa cooperativa",
    audioLabel: "Efectos",
    rules: [
      "Entra en el n\xFAcleo central para iniciar",
      "Observa por qu\xE9 carril baja cada amenaza",
      "Pisa el escudo del mismo color antes del impacto",
      "Protege las cuatro vidas del n\xFAcleo hasta el final"
    ]
  },
  players: {
    allowAny: true,
    min: 1,
    max: 8
  },
  start: { mode: "player-ready", countdownMillis: 2e3, releaseGraceMillis: 1200 },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    }
  },
  defaultDurationMillis: 42e3,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 8, y: 16 },
      { atMillis: 2150, type: "release", x: 8, y: 16 },
      { atMillis: 3100, type: "press", x: 2, y: 28 }
    ],
    captureStartMillis: 3300,
    frameCount: 28,
    frameIntervalMillis: 100
  },
  tags: ["defensa", "cooperativo", "arcade", "multijugador", "typescript"]
};

// games/guardianes/src/game.ts
var guardianesMaxLives = 4;
var guardianesGameWinMillis = 5e3;
var guardianesGameFailMillis = 5e3;
var backgroundColor4 = "#02050b";
var readyZone = { minX: 5, maxX: 10, minY: 14, maxY: 18 };
var successColors2 = ["#35d7ff", "#ff3bd7", "#ffe176", "#5fff9e", "#ffffff"];
var guardianLanes = [
  { color: "#35d7ff", label: "Azul", minX: 0, maxX: 3, shieldX: 1 },
  { color: "#ff3bd7", label: "Rosa", minX: 4, maxX: 7, shieldX: 5 },
  { color: "#ffe176", label: "Amarillo", minX: 8, maxX: 11, shieldX: 9 },
  { color: "#5fff9e", label: "Verde", minX: 12, maxX: 15, shieldX: 13 }
];
var threatPattern = [0, 2, 1, 3, 0, 3, 2, 1, 1, 3, 0, 2, 3, 1, 2, 0];
var difficultyProfiles2 = {
  easy: { spacingMillis: 2e3, travelMillis: 4e3 },
  medium: { spacingMillis: 1750, travelMillis: 3300 },
  hard: { spacingMillis: 1500, travelMillis: 2700 },
  expert: { spacingMillis: 1300, travelMillis: 2200 }
};
function guardianesThreatChart(difficulty = "medium") {
  const profile = difficultyProfiles2[difficulty] ?? difficultyProfiles2.medium;
  return threatPattern.map((lane, index) => {
    const spawnMillis = 1e3 + index * profile.spacingMillis;
    return { impactMillis: spawnMillis + profile.travelMillis, lane, spawnMillis };
  });
}
function createGame6(config) {
  return new GuardianesGame(config);
}
var GuardianesGame = class {
  blockedThreats = 0;
  chart = [];
  config;
  finishedAtMillis = 0;
  heldTiles = /* @__PURE__ */ new Set();
  lastEvent = gameEvent("none", "Los escudos est\xE1n preparados", 0);
  lives = guardianesMaxLives;
  nowMillis = 0;
  phase = "ready";
  players = [];
  readyGate;
  resolvedThreats = 0;
  startedAtMillis = 0;
  success = false;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest6);
    this.readyGate = createPlayerReadyGate(manifest6.start, [readyZone], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Entra en el n\xFAcleo para iniciar", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) return [];
    const lane = this.shieldLaneAt(event.x, event.y);
    if (lane < 0) return [];
    this.heldTiles.add(tileKey3(event.x, event.y));
    this.lastEvent = gameEvent("shield", `Escudo ${guardianLanes[lane].label.toLowerCase()} activado`, event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    this.heldTiles.delete(tileKey3(event.x, event.y));
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase === "finished") {
      const resultMillis = this.success ? guardianesGameWinMillis : guardianesGameFailMillis;
      if (event.atMillis - this.finishedAtMillis >= resultMillis) {
        this.resetState(event.atMillis);
        this.phase = "waiting";
        this.lastEvent = gameEvent("ready", "Entra en el n\xFAcleo para iniciar", event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase !== "running") return [];
    const events = [];
    while (this.resolvedThreats < this.chart.length) {
      const threat = this.chart[this.resolvedThreats];
      if (this.elapsedMillis() < threat.impactMillis) break;
      const blocked = this.shieldLaneActive(threat.lane);
      this.resolvedThreats += 1;
      if (blocked) {
        this.blockedThreats += 1;
        this.lastEvent = gameEvent("hit", `Amenaza ${guardianLanes[threat.lane].label.toLowerCase()} bloqueada`, event.atMillis);
      } else {
        this.lives = Math.max(0, this.lives - 1);
        this.lastEvent = gameEvent("miss", `Impacto en el carril ${guardianLanes[threat.lane].label.toLowerCase()}`, event.atMillis);
      }
      this.players = this.scoredPlayers();
      events.push(this.lastEvent);
      if (this.lives === 0) return [...events, ...this.finish(false, event.atMillis, "El n\xFAcleo qued\xF3 sin defensas")];
    }
    if (this.resolvedThreats >= this.chart.length) return [...events, ...this.finish(true, event.atMillis, "Oleada repelida")];
    if (this.remainingMillis() <= 0) return [...events, ...this.finish(false, event.atMillis, "La oleada super\xF3 las defensas")];
    return events;
  }
  render() {
    const frame = createFrame(backgroundColor4);
    this.paintLanes(frame);
    if (this.phase === "waiting" || this.phase === "starting") {
      fillFrameRect(frame, readyZone.minX, readyZone.minY, readyZone.maxX, readyZone.maxY, this.phase === "starting" ? "#ffe176" : "#145cff");
      paintDiamondRing(frame, { centerX: 8, centerY: 16, color: this.phase === "starting" ? "#ffffff" : "#35d7ff", radius: 2 + Math.floor(this.nowMillis / 150) % 9 });
      return frame;
    }
    if (this.phase === "finished") {
      this.paintResult(frame);
      return frame;
    }
    for (let lane = 0; lane < guardianLanes.length; lane += 1) {
      const descriptor = guardianLanes[lane];
      const active = this.shieldLaneActive(lane);
      fillFrameRect(frame, descriptor.minX, 26, descriptor.maxX, 31, active ? descriptor.color : "#10182a");
      fillFrameRect(frame, descriptor.minX + 1, 27, descriptor.maxX - 1, 30, active ? "#ffffff" : descriptor.color);
    }
    for (const threat of this.visibleThreats()) {
      const lane = guardianLanes[threat.lane];
      const y = Math.max(0, Math.min(24, Math.round(threat.progress * 24)));
      fillFrameRect(frame, lane.minX, y, lane.maxX, Math.min(25, y + 1), "#ff3151");
      paintFrameCell(frame, lane.shieldX, y, "#ffffff");
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest6.id,
      label: manifest6.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.blockedThreats,
      lives: this.lives,
      maxLives: guardianesMaxLives,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? this.visibleThreats().length : 0,
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: this.chart.length,
      blockedThreats: this.blockedThreats,
      shieldLanes: guardianLanes.map((_lane, index) => index).filter((lane) => this.shieldLaneActive(lane)),
      threatCount: this.chart.length,
      threatIndex: this.resolvedThreats,
      threats: this.visibleThreats()
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest6);
    this.readyGate = createPlayerReadyGate(manifest6.start, [readyZone], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Entra en el n\xFAcleo para iniciar", this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "N\xFAcleo protegido", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve al n\xFAcleo central", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.heldTiles.clear();
      this.lastEvent = gameEvent("start", "Activa el primer escudo", nowMillis);
      return [this.lastEvent];
    }
    return [];
  }
  finish(success, atMillis, message) {
    if (this.phase === "finished") return [];
    this.phase = "finished";
    this.success = success;
    this.finishedAtMillis = atMillis;
    this.heldTiles.clear();
    this.players = this.scoredPlayers();
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  paintLanes(frame) {
    for (const lane of guardianLanes) {
      fillFrameRect(frame, lane.minX, 0, lane.maxX, FLOOR_ROWS - 1, "#050917");
      fillFrameRect(frame, lane.minX, 0, lane.minX, FLOOR_ROWS - 1, "#10182a");
    }
    for (let y = 4; y < FLOOR_ROWS; y += 5) {
      fillFrameRect(frame, 0, y, FLOOR_COLS - 1, y, "#090f20");
    }
  }
  paintResult(frame) {
    const elapsed = Math.max(0, this.nowMillis - this.finishedAtMillis);
    if (this.success) {
      paintDiamondWave(frame, {
        centerX: 8,
        centerY: 16,
        color: ({ distance, step }) => successColors2[(distance + step) % successColors2.length],
        period: 8,
        bandWidth: 5,
        step: Math.floor(elapsed / 85)
      });
      return;
    }
    fillFrameRect(frame, 0, 0, FLOOR_COLS - 1, FLOOR_ROWS - 1, Math.floor(elapsed / 170) % 2 === 0 ? "#4f0615" : "#140208");
    paintDiamondRing(frame, { centerX: 8, centerY: 16, color: "#ff3151", radius: 2 + Math.floor(elapsed / 100) % 13 });
  }
  visibleThreats() {
    if (this.phase !== "running") return [];
    const elapsed = this.elapsedMillis();
    return this.chart.slice(this.resolvedThreats).filter((threat) => elapsed >= threat.spawnMillis && elapsed <= threat.impactMillis).map((threat) => ({
      lane: threat.lane,
      millisRemaining: Math.max(0, threat.impactMillis - elapsed),
      progress: Math.max(0, Math.min(1, (elapsed - threat.spawnMillis) / (threat.impactMillis - threat.spawnMillis)))
    }));
  }
  shieldLaneAt(x, y) {
    if (y < 26 || y >= FLOOR_ROWS) return -1;
    return guardianLanes.findIndex((lane) => x >= lane.minX && x <= lane.maxX);
  }
  shieldLaneActive(laneIndex) {
    const lane = guardianLanes[laneIndex];
    if (!lane) return false;
    for (let y = 26; y < FLOOR_ROWS; y += 1) {
      for (let x = lane.minX; x <= lane.maxX; x += 1) {
        if (this.heldTiles.has(tileKey3(x, y))) return true;
      }
    }
    return false;
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting" || this.phase === "ready") return 0;
    return Math.max(0, this.nowMillis - this.startedAtMillis);
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({ ...player, label: player.label || `Jugador ${player.index + 1}`, score: this.blockedThreats, lives: this.lives }));
  }
  resetState(nowMillis) {
    this.blockedThreats = 0;
    this.chart = guardianesThreatChart(this.config.difficulty);
    this.finishedAtMillis = 0;
    this.heldTiles.clear();
    this.lastEvent = gameEvent("none", "Los escudos est\xE1n preparados", nowMillis);
    this.lives = guardianesMaxLives;
    this.nowMillis = nowMillis;
    this.phase = "ready";
    this.readyGate.reset(nowMillis);
    this.resolvedThreats = 0;
    this.startedAtMillis = nowMillis;
    this.success = false;
    this.players = this.scoredPlayers();
  }
};
function tileKey3(x, y) {
  return `${x},${y}`;
}

// games/hello-world/src/manifest.ts
var manifest7 = {
  id: "hello-world",
  label: "Hola Mundo",
  description: "Sigue los objetivos verdes y evita las baldosas rojas.",
  availability: { development: true, production: false },
  catalog: {
    category: "individual",
    color: "#35d7ff",
    durationLabel: "30s",
    modeLabel: "Demostraci\xF3n",
    audioLabel: "Efectos",
    rules: ["Sigue los objetivos verdes", "Evita las baldosas rojas"]
  },
  players: {
    allowAny: true,
    min: 1,
    max: 1
  },
  start: { mode: "player-ready" },
  defaultDurationMillis: 3e4,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 2024,
    playerCount: 1,
    actions: [
      { atMillis: 100, type: "press", x: 8, y: 16 },
      { atMillis: 2150, type: "release", x: 8, y: 16 },
      { atMillis: 2300, type: "press", x: 4, y: 4 },
      { atMillis: 2320, type: "release", x: 4, y: 4 }
    ],
    captureStartMillis: 2200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["example", "ci", "typescript"]
};

// games/hello-world/src/game.ts
var targetColor = "#7ee787";
var hazardColor2 = "#ff2036";
var trailColor = "#1f6feb";
var idleColor2 = "#05070a";
var helloWorldTargetScore = 5;
var helloWorldStartingLives = 3;
var helloWorldCelebrationMillis = 5e3;
var targetPath = [
  { x: 3, y: 5 },
  { x: 12, y: 5 },
  { x: 8, y: 16 },
  { x: 3, y: 26 },
  { x: 12, y: 26 }
];
var hazardPath = [
  { x: 12, y: 15 },
  { x: 4, y: 15 },
  { x: 8, y: 28 }
];
function createGame7(config) {
  return new HelloWorldGame(config);
}
var HelloWorldGame = class {
  config;
  finishedAtMillis;
  hazardsHit = 0;
  lastEvent = gameEvent("none", "Listo", 0);
  lives = helloWorldStartingLives;
  nowMillis = 0;
  phase = "ready";
  players;
  readyGate;
  score = 0;
  startedAtMillis = 0;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest7);
    this.readyGate = createPlayerReadyGate(manifest7.start, createHorizontalPlayerReadyZones(1), this.config.nowMillis);
    this.players = this.scoredPlayers();
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) {
      return [];
    }
    const hazard = this.currentHazard();
    if (hazard && event.x === hazard.x && event.y === hazard.y) {
      return this.loseLife(event.atMillis);
    }
    const target = this.currentTarget();
    if (!target || event.x !== target.x || event.y !== target.y) {
      return [];
    }
    this.score += 1;
    this.players = this.scoredPlayers();
    if (this.score >= helloWorldTargetScore) {
      return this.finishGame(true, "\xA1Hola Mundo!", event.atMillis);
    }
    this.lastEvent = gameEvent("hit", `Hola ${this.score}`, event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase === "finished") {
      const finishedAtMillis = this.finishedAtMillis ?? event.atMillis;
      if (event.atMillis - finishedAtMillis < helloWorldCelebrationMillis) {
        return [];
      }
      this.resetState(event.atMillis);
      return [this.lastEvent];
    }
    if (this.phase !== "running" || this.remainingMillis() > 0) {
      return [];
    }
    return this.finishGame(false, "Tiempo agotado", event.atMillis);
  }
  render() {
    const frame = createFrame(idleColor2);
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawPlayerStart(frame);
      return frame;
    }
    for (const target2 of targetPath.slice(0, this.score)) {
      paintFrameCell(frame, target2.x, target2.y, trailColor);
    }
    if (this.phase === "finished") {
      this.drawResultAnimation(frame);
      return frame;
    }
    const target = this.currentTarget();
    if (target) {
      fillFrameRect(frame, target.x - 1, target.y - 1, 3, 3, targetColor);
      paintFrameCell(frame, target.x, target.y, "#ffffff");
    }
    const hazard = this.currentHazard();
    if (hazard) {
      paintFrameCell(frame, hazard.x, hazard.y, hazardColor2);
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest7.id,
      label: manifest7.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.score,
      lives: this.lives,
      maxLives: helloWorldStartingLives,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? Number(Boolean(this.currentTarget())) + Number(Boolean(this.currentHazard())) : 0,
      success: this.phase === "finished" && this.score >= helloWorldTargetScore,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: helloWorldTargetScore,
      celebrationDurationMillis: helloWorldCelebrationMillis,
      celebrationMillis: this.celebrationMillis(),
      hazard: this.phase === "running" ? this.currentHazard() : void 0
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({
      ...this.config,
      ...config
    }, manifest7);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Jugador listo", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a la zona iluminada", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastEvent = gameEvent("start", "Verde suma, rojo resta una vida", nowMillis);
      return [this.lastEvent];
    }
    return [];
  }
  celebrationMillis() {
    if (this.phase !== "finished" || this.finishedAtMillis === void 0) {
      return 0;
    }
    return Math.max(0, helloWorldCelebrationMillis - (this.nowMillis - this.finishedAtMillis));
  }
  currentHazard() {
    return hazardPath[this.hazardsHit];
  }
  currentTarget() {
    return targetPath[this.score];
  }
  drawPlayerStart(frame) {
    const centerX = Math.floor(FLOOR_COLS / 2);
    const centerY = Math.floor(FLOOR_ROWS / 2);
    const pulse = Math.floor(this.nowMillis / (this.phase === "starting" ? 110 : 180));
    const color = this.phase === "starting" ? "#ffe176" : targetColor;
    const radius = this.phase === "starting" ? 2 + pulse % 10 : 3 + pulse % 4;
    paintDiamondRing(frame, { centerX, centerY, color, radius });
  }
  drawResultAnimation(frame) {
    const animationStep = Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 140);
    const won = this.score >= helloWorldTargetScore;
    if (won) {
      paintDiamondWave(frame, {
        color: ({ x, y }) => (x + y + animationStep) % 3 === 0 ? "#ffffff" : targetColor,
        step: animationStep
      });
      return;
    }
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        if ((x + y + animationStep) % 8 <= 1 || (x - y - animationStep + 64) % 11 === 0) {
          paintFrameCell(frame, x, y, (x + animationStep) % 4 === 0 ? "#ff8090" : hazardColor2);
        }
      }
    }
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting") {
      return 0;
    }
    const elapsedAtMillis = this.phase === "finished" && this.finishedAtMillis !== void 0 ? this.finishedAtMillis : this.nowMillis;
    return Math.max(0, elapsedAtMillis - this.startedAtMillis);
  }
  finishGame(success, message, atMillis) {
    this.phase = "finished";
    this.finishedAtMillis = atMillis;
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  loseLife(atMillis) {
    this.lives -= 1;
    this.hazardsHit += 1;
    if (this.lives <= 0) {
      return this.finishGame(false, "Sin vidas", atMillis);
    }
    this.lastEvent = gameEvent("fail", `Vida perdida, quedan ${this.lives}`, atMillis);
    return [this.lastEvent];
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.finishedAtMillis = void 0;
    this.hazardsHit = 0;
    this.lastEvent = gameEvent("ready", "Esperando jugador", nowMillis);
    this.lives = helloWorldStartingLives;
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.score = 0;
    this.startedAtMillis = nowMillis;
    this.players = this.scoredPlayers();
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({
      ...player,
      score: this.score
    }));
  }
};

// games/lava/src/manifest.ts
var manifest8 = {
  id: "lava",
  label: "El suelo es lava",
  description: "Moveos en equipo, evitad la lava y conquistad plataformas seguras durante un minuto.",
  availability: { development: true, production: true },
  catalog: { category: "team", color: "#ff5268", durationLabel: "60s", modeLabel: "Plataformas", audioLabel: "M\xFAsica + efectos", rules: ["Espera en la zona azul", "Pisa las plataformas verdes", "Evita la lava roja durante un minuto"] },
  players: { allowAny: true, min: 1, max: 6 },
  start: { mode: "player-ready", releaseGraceMillis: 1500 },
  defaultDurationMillis: 6e4,
  config: { difficulty: { options: ["easy", "medium", "hard", "expert"], default: "medium" } },
  display: { entry: "./display" },
  preview: { seed: 137, playerCount: 0, difficulty: "medium", actions: [{ atMillis: 100, type: "press", x: 8, y: 16 }], captureStartMillis: 4e3, frameCount: 24, frameIntervalMillis: 120 },
  tags: ["lava", "cooperativo", "typescript"]
};

// games/lava/src/game.ts
var lavaStartingLives = 3;
var lavaCelebrationMillis = 5e3;
var lavaDamageImmunityMillis = 1e3;
var difficultySettings = {
  easy: { speed: 2, width: 4, height: 3, spawnMillis: 2400 },
  medium: { speed: 2.6, width: 3, height: 3, spawnMillis: 2e3 },
  hard: { speed: 3.2, width: 3, height: 2, spawnMillis: 1650 },
  expert: { speed: 4, width: 2, height: 2, spawnMillis: 1350 }
};
function createGame8(config) {
  return new LavaGame(config);
}
var LavaGame = class {
  config;
  finishedAtMillis;
  lastDamageAtMillis = Number.NEGATIVE_INFINITY;
  lastEvent = gameEvent("none", "Listo", 0);
  lives = lavaStartingLives;
  nextPlatformId = 1;
  nextSpawnAtMillis = 0;
  nowMillis = 0;
  phase = "ready";
  platforms = [];
  players;
  readyGate;
  rng;
  score = 0;
  startedAtMillis = 0;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest8);
    this.readyGate = createPlayerReadyGate(manifest8.start, [{ minX: 5, maxX: 10, minY: 13, maxY: 18 }], this.config.nowMillis);
    this.rng = createSeededRng(this.config.seed);
    this.players = this.scoredPlayers();
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    if (this.phase !== "running" || !event.pressed) return [];
    this.advancePlatforms(event.atMillis);
    const safe = this.visiblePlatforms().find((platform) => inside(event, platform));
    if (safe) {
      this.platforms = this.platforms.filter((platform) => platform.id !== safe.id);
      this.score += 1;
      this.players = this.scoredPlayers();
      this.lastEvent = gameEvent("coin", `Plataforma ${this.score}`, event.atMillis);
      return [this.lastEvent];
    }
    if (event.atMillis - this.lastDamageAtMillis < lavaDamageImmunityMillis) return [];
    this.lastDamageAtMillis = event.atMillis;
    this.lives -= 1;
    this.players = this.scoredPlayers();
    if (this.lives <= 0) return this.finish(false, "La lava os ha alcanzado", event.atMillis);
    this.lastEvent = gameEvent("damage", `Vida perdida, quedan ${this.lives}`, event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    if (this.phase === "finished") {
      if (event.atMillis - (this.finishedAtMillis ?? event.atMillis) >= lavaCelebrationMillis) {
        this.resetState(event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    this.advancePlatforms(event.atMillis);
    if (this.phase === "running" && this.remainingMillis() === 0) return this.finish(true, `${this.score} plataformas seguras`, event.atMillis);
    return [];
  }
  render() {
    const frame = createFrame("#8e0b1d");
    if (this.phase === "waiting" || this.phase === "starting") {
      const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 180));
      paintDiamondRing(frame, { centerX: 8, centerY: 16, radius: 2 + step % 8, color: this.phase === "starting" ? "#ffe176" : "#22d3ee" });
      return frame;
    }
    const pulse = Math.floor(this.nowMillis / 160);
    for (let y = 0; y < FLOOR_ROWS; y += 1) for (let x = 0; x < FLOOR_COLS; x += 1) {
      paintFrameCell(frame, x, y, (x * 5 + y + pulse) % 13 < 3 ? "#ff5a1f" : "#b20d21");
    }
    for (const platform of this.visiblePlatforms()) fillFrameRect(frame, platform.x, platform.y, platform.width, platform.height, "#39e77d");
    if (this.phase === "finished") {
      paintDiamondWave(frame, { color: this.lives > 0 ? "#39e77d" : "#ff334e", step: Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 140) });
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest8.id,
      label: manifest8.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.score,
      lives: this.lives,
      maxLives: lavaStartingLives,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? this.visiblePlatforms().length : 0,
      success: this.phase === "finished" && this.lives > 0,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      safePlatforms: this.visiblePlatforms(),
      celebrationMillis: this.phase === "finished" ? Math.max(0, lavaCelebrationMillis - (this.nowMillis - (this.finishedAtMillis ?? this.nowMillis))) : 0
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest8);
    this.resetState(this.config.nowMillis);
  }
  advancePlatforms(nowMillis) {
    if (this.phase !== "running") return;
    const settings = difficultySettings[this.config.difficulty] ?? difficultySettings.medium;
    while (nowMillis >= this.nextSpawnAtMillis) {
      this.platforms.push({ id: this.nextPlatformId++, bornMillis: this.nextSpawnAtMillis, width: settings.width, height: settings.height, x: this.rng.range(0, FLOOR_COLS - settings.width) });
      this.nextSpawnAtMillis += settings.spawnMillis;
    }
    this.platforms = this.platforms.filter((platform) => this.platformY(platform) < FLOOR_ROWS);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Equipo listo", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a la zona azul", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.nextSpawnAtMillis = nowMillis;
      this.advancePlatforms(nowMillis);
      this.lastEvent = gameEvent("start", "Pisa solo las plataformas verdes", nowMillis);
    } else return [];
    return [this.lastEvent];
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting") return 0;
    return Math.max(0, (this.finishedAtMillis ?? this.nowMillis) - this.startedAtMillis);
  }
  finish(success, message, atMillis) {
    this.phase = "finished";
    this.finishedAtMillis = atMillis;
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  platformY(platform) {
    const speed = (difficultySettings[this.config.difficulty] ?? difficultySettings.medium).speed;
    return Math.floor((this.nowMillis - platform.bornMillis) * speed / 1e3) - platform.height;
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.finishedAtMillis = void 0;
    this.lastDamageAtMillis = Number.NEGATIVE_INFINITY;
    this.lastEvent = gameEvent("ready", "Espera en la zona azul", nowMillis);
    this.lives = lavaStartingLives;
    this.nextPlatformId = 1;
    this.nextSpawnAtMillis = nowMillis;
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.platforms = [];
    this.rng = createSeededRng(this.config.seed);
    this.score = 0;
    this.startedAtMillis = nowMillis;
    this.players = this.scoredPlayers();
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({ ...player, score: this.score, lives: this.lives }));
  }
  visiblePlatforms() {
    return this.platforms.map((platform) => ({ id: platform.id, x: platform.x, y: this.platformY(platform), width: platform.width, height: platform.height })).filter((platform) => platform.y + platform.height > 0 && platform.y < FLOOR_ROWS);
  }
};
function inside(point, platform) {
  return point.x >= platform.x && point.x < platform.x + platform.width && point.y >= platform.y && point.y < platform.y + platform.height;
}

// games/memory-challenge/src/manifest.ts
var manifest9 = {
  id: "memory-challenge",
  label: "Reto de memoria",
  description: "Memoriza un camino oculto en tu calle y rec\xF3rrelo antes que los dem\xE1s sin pisar la lava.",
  availability: { development: true, production: true },
  catalog: {
    category: "team",
    color: "#005af8",
    durationLabel: "90 s",
    modeLabel: "Camino oculto",
    audioLabel: "M\xFAsica + efectos",
    rules: [
      "Cada jugador ocupa la salida de su calle",
      "Memoriza el camino iluminado antes de que desaparezca",
      "Si pisas la lava, vuelve a tu salida para intentarlo otra vez"
    ]
  },
  players: { allowAny: false, min: 1, max: 4 },
  start: { mode: "player-ready", releaseGraceMillis: 1200 },
  defaultDurationMillis: 9e4,
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 2,
    actions: [
      { atMillis: 100, type: "press", x: 3, y: 0 },
      { atMillis: 100, type: "press", x: 11, y: 0 }
    ],
    captureStartMillis: 2200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["memory", "race", "multiplayer", "typescript"]
};

// games/memory-challenge/src/game.ts
var memorizeMillis = 2800;
var retryRevealMillis = 1500;
var winAnimationMillis2 = 4e3;
var startRows = 2;
var lavaDark = "#120301";
var lavaBright = "#8f1a08";
var failColor = "#ff6b22";
var white2 = "#ffffff";
function createGame9(config) {
  return new MemoryChallengeGame(config);
}
var MemoryChallengeGame = class {
  config;
  rng;
  lanes = [];
  readyZones = [];
  readyGate;
  players = [];
  phase = "waiting";
  memoryStage = "memorize";
  nowMillis = 0;
  startedAtMillis = 0;
  stageEndsAtMillis = 0;
  finishAtMillis = 0;
  winnerIndex = -1;
  motionEventId = 0;
  lastEvent = gameEvent("none", "Listo", 0);
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest9);
    this.rng = createSeededRng(this.config.seed);
    this.rebuildBoard();
    this.readyGate = createPlayerReadyGate(manifest9.start, this.readyZones, this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.lastEvent = gameEvent("ready", "Busca tu salida iluminada", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.record(this.applyReadyTransition(this.readyGate.update(event), event.atMillis));
    }
    if (this.phase !== "running" || !event.pressed) return [];
    const playerIndex = this.playerForPoint(event.x, event.y);
    if (playerIndex < 0) return [];
    const player = this.players[playerIndex];
    if (!player) return [];
    if (player.status === "failed") {
      if (this.contains(this.readyZones[playerIndex], event.x, event.y)) {
        player.status = "memorizing";
        player.progress = 0;
        player.revealUntilMillis = event.atMillis + retryRevealMillis;
        this.motionEventId += 1;
        return this.record([gameEvent("start", `${player.label} vuelve a memorizar`, event.atMillis)]);
      }
      return [];
    }
    if (player.status === "finished" || this.memoryStage === "memorize") return [];
    const expected = player.path[player.progress];
    if (expected?.x === event.x && expected.y === event.y) {
      player.progress += 1;
      player.bestProgress = Math.max(player.bestProgress, player.progress);
      player.status = "recalling";
      this.motionEventId += 1;
      if (player.progress >= player.pathLength) return this.finishWin(playerIndex, event.atMillis);
      const cue = player.progress === 1 || player.progress % 5 === 0 ? "coin" : "hit";
      return this.record([gameEvent(cue, `${player.label}: ${player.progress} de ${player.pathLength}`, event.atMillis)]);
    }
    if (player.path.slice(0, player.progress).some((point) => point.x === event.x && point.y === event.y)) return [];
    player.status = "failed";
    player.progress = 0;
    player.revealUntilMillis = 0;
    this.motionEventId += 1;
    return this.record([gameEvent("damage", `${player.label} pis\xF3 la lava`, event.atMillis)]);
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.record(this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis));
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.record(this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis));
    }
    if (this.phase === "finished") {
      if (event.atMillis - this.finishAtMillis >= winAnimationMillis2) {
        this.resetState(event.atMillis);
        return this.record([gameEvent("ready", "Nueva carrera de memoria", event.atMillis)]);
      }
      return [];
    }
    if (this.memoryStage === "memorize" && event.atMillis >= this.stageEndsAtMillis) {
      this.memoryStage = "recall";
      for (const player of this.players) player.status = "recalling";
      this.motionEventId += 1;
      return this.record([gameEvent("start", "Los caminos se han ocultado", event.atMillis)]);
    }
    if (this.remainingMillis() <= 0) return this.finishLoss(event.atMillis);
    return [];
  }
  render() {
    const frame = createFrame("#05070a");
    this.drawLava(frame);
    this.drawLaneBorders(frame);
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawReadiness(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.drawFinished(frame);
      return frame;
    }
    for (const player of this.players) {
      this.drawStart(frame, player);
      const reveal = this.memoryStage === "memorize" || player.status === "failed" || this.nowMillis < player.revealUntilMillis;
      player.path.forEach((point, index) => {
        if (index < player.progress || reveal) {
          paintFrameCell(frame, point.x, point.y, player.status === "failed" ? failColor : player.color);
        }
      });
      const next = player.path[player.progress];
      if (next && player.status === "recalling" && !reveal && Math.floor(this.nowMillis / 220) % 2 === 0) {
        paintFrameCell(frame, next.x, next.y, "#211008");
      }
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    const readyPlayerIndices = this.readyZones.flatMap((_, index) => this.readyGate.zoneReady(index, this.nowMillis) ? [index] : []);
    const best = Math.max(0, ...this.players.map((player) => player.bestProgress));
    return {
      currentGame: manifest9.id,
      label: manifest9.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players.map((player) => ({ index: player.index, label: player.label, color: player.color, score: player.bestProgress, lives: -1 })),
      score: best,
      lives: -1,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.phase === "finished" ? Math.max(0, this.finishAtMillis + winAnimationMillis2 - this.nowMillis) : this.remainingMillis(),
      activeTargets: this.phase === "running" ? this.players.filter((player) => player.status !== "finished").length : 0,
      success: this.winnerIndex >= 0,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: Math.max(0, ...this.players.map((player) => player.pathLength)),
      memoryStage: this.memoryStage,
      stageMillis: this.memoryStage === "memorize" ? Math.max(0, this.stageEndsAtMillis - this.nowMillis) : 0,
      winnerIndex: this.winnerIndex,
      winnerLabel: this.players[this.winnerIndex]?.label ?? "",
      playerProgress: this.players.map(({ revealUntilMillis: _reveal, path: _path, ...player }) => ({ ...player })),
      paths: this.players.map((player) => player.path.map((point) => ({ ...point }))),
      readyPlayerIndices,
      motionEventId: this.motionEventId
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest9);
    this.rng = createSeededRng(this.config.seed);
    this.rebuildBoard();
    this.readyGate = createPlayerReadyGate(manifest9.start, this.readyZones, this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  pathForPlayer(index) {
    return this.players[index]?.path.map((point) => ({ ...point })) ?? [];
  }
  playerReadyZones() {
    return this.readyZones.map((zone) => ({ ...zone }));
  }
  rebuildBoard() {
    this.lanes = laneLayout(this.config.playerCount);
    this.readyZones = this.lanes.map((lane) => {
      const width = Math.min(4, lane.width);
      const minX = lane.x + Math.floor((lane.width - width) / 2);
      return { minX, maxX: minX + width - 1, minY: 0, maxY: startRows - 1 };
    });
    const roster = defaultPlayers(this.config.playerCount, this.config.players);
    this.players = roster.map((player, index) => {
      const path = generatePath(this.rng, this.lanes[index], this.readyZones[index]);
      const label = player.label === `Player ${index + 1}` ? `Jugador ${index + 1}` : player.label;
      return { index, label, color: player.color, progress: 0, bestProgress: 0, pathLength: path.length, status: "memorizing", path, revealUntilMillis: 0 };
    });
  }
  resetState(nowMillis) {
    this.rng = createSeededRng(this.config.seed);
    this.rebuildBoard();
    this.readyGate.reset(nowMillis);
    this.phase = "waiting";
    this.memoryStage = "memorize";
    this.nowMillis = nowMillis;
    this.startedAtMillis = nowMillis;
    this.stageEndsAtMillis = 0;
    this.finishAtMillis = 0;
    this.winnerIndex = -1;
    this.motionEventId = 0;
    this.lastEvent = gameEvent("ready", "Busca tu salida iluminada", nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Todos los jugadores listos", nowMillis)];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a tu salida", nowMillis)];
    }
    if (transition === "started") {
      this.phase = "running";
      this.memoryStage = "memorize";
      this.startedAtMillis = nowMillis;
      this.stageEndsAtMillis = nowMillis + memorizeMillis;
      this.players.forEach((player) => {
        player.status = "memorizing";
      });
      this.motionEventId += 1;
      return [gameEvent("start", "Memoriza tu camino", nowMillis)];
    }
    return [];
  }
  finishWin(index, atMillis) {
    const player = this.players[index];
    player.status = "finished";
    this.phase = "finished";
    this.memoryStage = "game-win";
    this.winnerIndex = index;
    this.finishAtMillis = atMillis;
    this.motionEventId += 1;
    return this.record([gameEvent("win", `\xA1${player.label} completa el camino!`, atMillis)]);
  }
  finishLoss(atMillis) {
    this.phase = "finished";
    this.memoryStage = "game-loss";
    this.finishAtMillis = atMillis;
    this.motionEventId += 1;
    return this.record([gameEvent("fail", "Se acab\xF3 el tiempo", atMillis)]);
  }
  elapsedMillis() {
    return this.phase === "waiting" || this.phase === "starting" ? 0 : Math.max(0, this.nowMillis - this.startedAtMillis);
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  playerForPoint(x, y) {
    return this.lanes.findIndex((lane) => x >= lane.x && x < lane.x + lane.width && y >= 0 && y < FLOOR_ROWS);
  }
  contains(zone, x, y) {
    return Boolean(zone && x >= zone.minX && x <= zone.maxX && y >= zone.minY && y <= zone.maxY);
  }
  record(events) {
    const latest = events.at(-1);
    if (latest) this.lastEvent = latest;
    return events;
  }
  drawLava(frame) {
    const step = Math.floor(this.nowMillis / 140);
    for (let y = 0; y < FLOOR_ROWS; y += 1) for (let x = 0; x < FLOOR_COLS; x += 1) {
      if ((x * 5 + y * 3 + step) % 13 < 2) paintFrameCell(frame, x, y, lavaBright);
      else if ((x + y + step) % 4 === 0) paintFrameCell(frame, x, y, lavaDark);
    }
  }
  drawLaneBorders(frame) {
    for (const lane of this.lanes.slice(1)) for (let y = 0; y < FLOOR_ROWS; y += 1) paintFrameCell(frame, lane.x - 1, y, "#2b2f3a");
  }
  drawReadiness(frame) {
    this.players.forEach((player, index) => {
      const ready = this.readyGate.zoneReady(index, this.nowMillis);
      const zone = this.readyZones[index];
      for (let y = zone.minY; y <= zone.maxY; y += 1) for (let x = zone.minX; x <= zone.maxX; x += 1) {
        const pulse = (x + y + Math.floor(this.nowMillis / 130)) % 4;
        if (ready || pulse < 2) paintFrameCell(frame, x, y, ready ? white2 : player.color);
      }
      if (this.phase === "starting") player.path.forEach((point, pathIndex) => {
        if ((pathIndex + Math.floor(this.nowMillis / 90)) % 5 < 3) paintFrameCell(frame, point.x, point.y, player.color);
      });
    });
  }
  drawStart(frame, player) {
    const zone = this.readyZones[player.index];
    for (let y = zone.minY; y <= zone.maxY; y += 1) for (let x = zone.minX; x <= zone.maxX; x += 1) paintFrameCell(frame, x, y, player.color);
  }
  drawFinished(frame) {
    const wave = Math.floor((this.nowMillis - this.finishAtMillis) / 90);
    if (this.winnerIndex < 0) {
      for (let y = 0; y < FLOOR_ROWS; y += 1) for (let x = 0; x < FLOOR_COLS; x += 1) if ((x + y + wave) % 5 < 2) paintFrameCell(frame, x, y, failColor);
      return;
    }
    const winner = this.players[this.winnerIndex];
    for (let y = 0; y < FLOOR_ROWS; y += 1) for (let x = 0; x < FLOOR_COLS; x += 1) {
      const lane = this.lanes[this.winnerIndex];
      if (x >= lane.x && x < lane.x + lane.width && (x + y + wave) % 4 < 3) paintFrameCell(frame, x, y, winner.color);
    }
    winner.path.forEach((point, index) => paintFrameCell(frame, point.x, point.y, (index + wave) % winner.pathLength === 0 ? white2 : winner.color));
  }
};
function laneLayout(count) {
  const safe = clamp(Math.trunc(count), 1, 4);
  if (safe === 1) return [{ x: 0, width: FLOOR_COLS }];
  if (safe === 2) return [{ x: 0, width: 8 }, { x: 8, width: 8 }];
  if (safe === 3) return [{ x: 0, width: 4 }, { x: 6, width: 4 }, { x: 12, width: 4 }];
  return Array.from({ length: 4 }, (_, index) => ({ x: index * 4, width: 4 }));
}
function generatePath(rng, lane, start) {
  const path = [];
  let x = start.minX + rng.int(start.maxX - start.minX + 1);
  let segment = 3 + rng.int(4);
  for (let y = startRows; y < FLOOR_ROWS; y += 1) {
    path.push({ x, y });
    segment -= 1;
    if (segment > 0 || y >= FLOOR_ROWS - 2) continue;
    const direction = rng.int(2) === 0 ? -1 : 1;
    const nextX = clamp(x + direction, lane.x, lane.x + lane.width - 1);
    if (nextX !== x) {
      x = nextX;
      path.push({ x, y });
    }
    segment = 3 + rng.int(5);
  }
  return path;
}

// games/memoria-v2/src/manifest.ts
var manifest10 = {
  id: "memoria-v2",
  label: "Memoria v2",
  description: "Memoriza y reconstruye figuras cada vez m\xE1s complejas durante veinte niveles.",
  availability: { development: true, production: true },
  catalog: {
    category: "team",
    color: "#22d3ee",
    durationLabel: "20 niveles",
    modeLabel: "Memoria progresiva",
    audioLabel: "M\xFAsica + efectos",
    rules: ["Memoriza la figura azul", "Reconstr\xFAyela cuando desaparezca", "Cada nivel permite tres errores"]
  },
  players: { allowAny: true, min: 1, max: 8 },
  start: { mode: "player-ready", releaseGraceMillis: 1500 },
  defaultDurationMillis: 36e4,
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 0,
    actions: [{ atMillis: 100, type: "press", x: 8, y: 16 }],
    captureStartMillis: 2300,
    frameCount: 24,
    frameIntervalMillis: 120
  },
  tags: ["memoria", "cooperativo", "typescript"]
};

// games/memoria-v2/src/game.ts
var memoriaV2TotalLevels = 20;
var memoriaV2StartingLives = 3;
var memoriaV2MemorizeMillis = 5e3;
var memoriaV2RoundWinMillis = 2200;
var memoriaV2GameWinMillis = 5e3;
function createGame10(config) {
  return new MemoriaV2Game(config);
}
function memoryTargetsForLevel(seed, level) {
  const rng = createSeededRng(seed + level * 2654435769 >>> 0);
  const targetCount = Math.min(20, 4 + Math.floor((level - 1) / 2));
  const points = [];
  const used = /* @__PURE__ */ new Set();
  while (points.length < targetCount) {
    const point = { x: rng.int(16), y: 4 + rng.int(24) };
    const key = `${point.x},${point.y}`;
    if (!used.has(key)) {
      used.add(key);
      points.push(point);
    }
  }
  return points;
}
var MemoriaV2Game = class {
  claimed = /* @__PURE__ */ new Set();
  config;
  lastEvent = gameEvent("none", "Listo", 0);
  level = 1;
  lives = memoriaV2StartingLives;
  nowMillis = 0;
  phase = "ready";
  players;
  readyGate;
  stage = "memorize";
  stageEndsAtMillis = 0;
  startedAtMillis = 0;
  targets = [];
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest10);
    this.readyGate = createPlayerReadyGate(manifest10.start, [{ minX: 5, maxX: 10, minY: 13, maxY: 18 }], this.config.nowMillis);
    this.targets = memoryTargetsForLevel(this.config.seed, this.level);
    this.players = this.scoredPlayers();
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    if (this.phase !== "running" || this.stage !== "recall" || !event.pressed) return [];
    const key = `${event.x},${event.y}`;
    if (this.targets.some((target) => target.x === event.x && target.y === event.y)) {
      if (this.claimed.has(key)) return [];
      this.claimed.add(key);
      this.players = this.scoredPlayers();
      if (this.claimed.size === this.targets.length) return this.completeLevel(event.atMillis);
      this.lastEvent = gameEvent("hit", `Acierto ${this.claimed.size} de ${this.targets.length}`, event.atMillis);
      return [this.lastEvent];
    }
    this.lives -= 1;
    this.players = this.scoredPlayers();
    if (this.lives <= 0) return this.finish(false, "Sin vidas", event.atMillis);
    this.lastEvent = gameEvent("damage", `Error, quedan ${this.lives} vidas`, event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    if (this.phase === "finished") {
      if (event.atMillis >= this.stageEndsAtMillis) {
        this.resetState(event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.stage === "memorize" && event.atMillis >= this.stageEndsAtMillis) {
      this.stage = "recall";
      this.lastEvent = gameEvent("start", "Reconstruye la figura", event.atMillis);
      return [this.lastEvent];
    }
    if (this.stage === "round-win" && event.atMillis >= this.stageEndsAtMillis) {
      this.level += 1;
      this.lives = memoriaV2StartingLives;
      this.claimed.clear();
      this.targets = memoryTargetsForLevel(this.config.seed, this.level);
      this.stage = "memorize";
      this.stageEndsAtMillis = event.atMillis + memoriaV2MemorizeMillis;
      this.lastEvent = gameEvent("ready", `Memoriza el nivel ${this.level}`, event.atMillis);
      this.players = this.scoredPlayers();
      return [this.lastEvent];
    }
    return [];
  }
  render() {
    const frame = createFrame("#020712");
    if (this.phase === "waiting" || this.phase === "starting") {
      const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 180));
      paintDiamondRing(frame, { centerX: 8, centerY: 16, radius: 2 + step % 8, color: this.phase === "starting" ? "#ffe176" : "#22d3ee" });
      return frame;
    }
    if (this.stage === "memorize") {
      for (const target of this.targets) paintFrameCell(frame, target.x, target.y, "#22d3ee");
    } else if (this.stage === "recall") {
      for (const target of this.targets) if (this.claimed.has(`${target.x},${target.y}`)) paintFrameCell(frame, target.x, target.y, "#35e77a");
    } else {
      const color = this.stage === "game-loss" ? "#ff334e" : this.stage === "round-win" ? "#ffe176" : "#35e77a";
      paintDiamondWave(frame, { color, step: Math.floor((this.stageEndsAtMillis - this.nowMillis) / 140) });
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest10.id,
      label: manifest10.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.claimed.size,
      lives: this.lives,
      maxLives: memoriaV2StartingLives,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.stage === "memorize" ? Math.max(0, this.stageEndsAtMillis - this.nowMillis) : 0,
      activeTargets: this.stage === "recall" ? this.targets.length - this.claimed.size : 0,
      success: this.phase === "finished" && this.stage === "game-win",
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      matchTarget: this.targets.length,
      level: this.level,
      totalLevels: memoriaV2TotalLevels,
      memoryStage: this.stage,
      claimedTargets: this.claimed.size,
      totalTargets: this.targets.length,
      targets: this.targets.map((target) => ({ ...target })),
      stageMillis: Math.max(0, this.stageEndsAtMillis - this.nowMillis)
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest10);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Jugador listo", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve al centro", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.stage = "memorize";
      this.stageEndsAtMillis = nowMillis + memoriaV2MemorizeMillis;
      this.startedAtMillis = nowMillis;
      this.lastEvent = gameEvent("start", "Memoriza la figura azul", nowMillis);
    } else return [];
    return [this.lastEvent];
  }
  completeLevel(atMillis) {
    if (this.level >= memoriaV2TotalLevels) return this.finish(true, "Memoria completada", atMillis);
    this.stage = "round-win";
    this.stageEndsAtMillis = atMillis + memoriaV2RoundWinMillis;
    this.lastEvent = gameEvent("win", `Nivel ${this.level} completado`, atMillis);
    return [this.lastEvent];
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting") return 0;
    return Math.max(0, this.nowMillis - this.startedAtMillis);
  }
  finish(success, message, atMillis) {
    this.phase = "finished";
    this.stage = success ? "game-win" : "game-loss";
    this.stageEndsAtMillis = atMillis + memoriaV2GameWinMillis;
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.claimed.clear();
    this.level = 1;
    this.lives = memoriaV2StartingLives;
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.stage = "memorize";
    this.stageEndsAtMillis = 0;
    this.startedAtMillis = nowMillis;
    this.targets = memoryTargetsForLevel(this.config.seed, this.level);
    this.lastEvent = gameEvent("ready", "Espera en la zona central", nowMillis);
    this.players = this.scoredPlayers();
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({ ...player, score: this.level - 1, lives: this.lives }));
  }
};

// games/meteor-dodge/src/manifest.ts
var manifest11 = {
  id: "meteor-dodge",
  label: "Lluvia de meteoritos",
  description: "Cooperative survival game: dodge telegraphed meteor impacts until the storm passes.",
  availability: { development: true, production: false },
  catalog: {
    category: "team",
    color: "#b987ff",
    durationLabel: "45s",
    modeLabel: "Supervivencia",
    audioLabel: "Efectos",
    rules: ["Esquiva las zonas marcadas", "Sobrevive hasta que termine la tormenta"]
  },
  players: {
    allowAny: true,
    min: 1,
    max: 1
  },
  start: {
    mode: "player-ready",
    releaseGraceMillis: 750
  },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    }
  },
  defaultDurationMillis: 45e3,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 1,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 8, y: 16 },
      { atMillis: 2150, type: "release", x: 8, y: 16 }
    ],
    captureStartMillis: 2200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["arcade", "cooperative", "survival", "typescript"]
};

// games/meteor-dodge/src/game.ts
var startingLives3 = 3;
var gameWinAnimationMillis3 = 3e3;
var meteorImpactVisibleMillis = 450;
var meteorWarningColor = "#ff5a36";
var meteorCoreColor = "#ffe176";
var meteorImpactColor = "#ffffff";
var playerFootprintColor = "#35d7ff";
var backgroundColor5 = "#02050b";
var backgroundStripeColor = "#050d19";
var readyZoneColor = "#145cff";
var readyPulseColor = "#35d7ff";
var startingColor = "#ffe176";
var successColors3 = ["#35d7ff", "#5fff9e", "#ffe176", "#ff3bd7", "#ffffff"];
var failColors = ["#ff3151", "#7b1428", "#2a0710"];
var damageCooldownMillis = 1e3;
var firstMeteorDelayMillis = 350;
var maxSpawnCatchUp = 64;
var readyZone2 = { minX: 4, maxX: 11, minY: 12, maxY: 19 };
var mediumDifficultyProfile = {
  intervalMillis: 1550,
  largeMeteorEvery: 5,
  radius: 1,
  warningMillis: 1350
};
var difficultyProfiles3 = {
  easy: { intervalMillis: 1900, largeMeteorEvery: 0, radius: 1, warningMillis: 1650 },
  medium: mediumDifficultyProfile,
  hard: { intervalMillis: 1200, largeMeteorEvery: 3, radius: 1, warningMillis: 1050 },
  expert: { intervalMillis: 900, largeMeteorEvery: 1, radius: 2, warningMillis: 800 }
};
function createGame11(config) {
  return new MeteorDodgeGame(config);
}
var MeteorDodgeGame = class {
  config;
  dodgedMeteors = 0;
  finishedAtMillis = 0;
  lastDamageMillis = Number.NEGATIVE_INFINITY;
  lastEvent = gameEvent("none", "Listos para la tormenta", 0);
  lives = startingLives3;
  meteors = [];
  nextMeteorId = 1;
  nextMeteorMillis = 0;
  nowMillis = 0;
  occupiedTiles = /* @__PURE__ */ new Set();
  phase = "ready";
  players = [];
  readyGate;
  rng;
  startedAtMillis = 0;
  success = false;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest11);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate = createPlayerReadyGate(manifest11.start, [readyZone2], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Entra en la zona azul", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    this.updateOccupiedTile(event.x, event.y, event.pressed);
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    return [];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    this.updateOccupiedTile(event.x, event.y, false);
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase !== "running") {
      return [];
    }
    const events = [];
    this.spawnDueMeteors(event.atMillis);
    for (const meteor of this.meteors) {
      if (meteor.result !== "pending" || event.atMillis < meteor.impactAtMillis) {
        continue;
      }
      const occupied = this.meteorContainsOccupiedTile(meteor);
      if (!occupied) {
        meteor.result = "dodged";
        this.dodgedMeteors += 1;
        continue;
      }
      if (meteor.impactAtMillis - this.lastDamageMillis < damageCooldownMillis) {
        meteor.result = "protected";
        continue;
      }
      meteor.result = "hit";
      this.lastDamageMillis = meteor.impactAtMillis;
      this.lives = Math.max(0, this.lives - 1);
      if (this.lives === 0) {
        events.push(this.finish(false, meteor.impactAtMillis));
        break;
      }
      events.push(gameEvent("miss", "\xA1Impacto! Mu\xE9vete", meteor.impactAtMillis));
    }
    this.meteors = this.meteors.filter((meteor) => meteor.clearAtMillis > event.atMillis);
    if (this.phase === "running" && this.remainingMillis() === 0) {
      events.push(this.finish(true, event.atMillis));
    }
    return this.recordEvents(events);
  }
  render() {
    const frame = createFrame(backgroundColor5);
    this.drawBackground(frame);
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawPlayerStart(frame);
      return frame;
    }
    if (this.phase === "finished") {
      if (this.success) {
        this.drawWinAnimation(frame);
      } else {
        this.drawFailAnimation(frame);
      }
      return frame;
    }
    for (const tile of this.occupiedTiles) {
      const [x, y] = occupiedTileCoordinates(tile);
      paintFrameCell(frame, x, y, playerFootprintColor);
    }
    for (const meteor of this.meteors) {
      this.drawMeteor(frame, meteor);
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    const celebrationMillis = this.success && this.phase === "finished" ? Math.max(0, Math.min(gameWinAnimationMillis3, this.nowMillis - this.finishedAtMillis)) : 0;
    return {
      currentGame: manifest11.id,
      label: manifest11.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players.map((player) => ({ ...player, lives: this.lives, score: this.dodgedMeteors })),
      score: this.dodgedMeteors,
      lives: this.lives,
      maxLives: startingLives3,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.meteors.filter((meteor) => meteor.result === "pending").length,
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      celebrating: this.success && this.phase === "finished" && celebrationMillis < gameWinAnimationMillis3,
      celebrationMillis,
      dodgedMeteors: this.dodgedMeteors,
      meteors: this.meteors.map((meteor) => ({ ...meteor })),
      stormDurationMillis: this.config.durationMillis
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest11);
    this.rng = createSeededRng(this.config.seed);
    this.resetState(this.config.nowMillis);
    this.phase = "waiting";
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Zona lista", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a la zona azul", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.nextMeteorMillis = nowMillis + firstMeteorDelayMillis;
      this.lastEvent = gameEvent("start", "Esquiva las zonas rojas", nowMillis);
      return [this.lastEvent];
    }
    return [];
  }
  difficultyProfile() {
    return difficultyProfiles3[this.config.difficulty] ?? mediumDifficultyProfile;
  }
  drawBackground(frame) {
    for (let y = 3; y < FLOOR_ROWS; y += 4) {
      fillFrameRect(frame, 0, y, FLOOR_COLS, 1, backgroundStripeColor);
    }
  }
  drawFailAnimation(frame) {
    const pulse = Math.floor((this.nowMillis - this.finishedAtMillis) / 180) % failColors.length;
    const color = failColors[pulse] ?? failColors[0];
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      const x = Math.floor(y * FLOOR_COLS / FLOOR_ROWS);
      fillFrameRect(frame, x - 1, y, 3, 1, color);
      fillFrameRect(frame, FLOOR_COLS - x - 2, y, 3, 1, color);
    }
  }
  drawMeteor(frame, meteor) {
    if (meteor.result === "pending") {
      const pulseOn = Math.floor((this.nowMillis - meteor.spawnedAtMillis) / 160) % 2 === 0;
      const size = meteor.radius * 2 + 1;
      const warningColor = pulseOn ? meteorWarningColor : "#6c1b19";
      fillFrameRect(frame, meteor.x - meteor.radius, meteor.y - meteor.radius, size, size, warningColor);
      if (meteor.radius > 0) {
        fillFrameRect(frame, meteor.x - meteor.radius + 1, meteor.y - meteor.radius + 1, size - 2, size - 2, backgroundColor5);
      }
      paintFrameCell(frame, meteor.x, meteor.y, meteorCoreColor);
      return;
    }
    const impactAge = Math.max(0, this.nowMillis - meteor.impactAtMillis);
    const extraRadius = Math.min(2, Math.floor(impactAge / 130));
    const radius = meteor.radius + extraRadius;
    const color = impactAge < 140 ? meteorImpactColor : meteor.result === "hit" ? "#ff3151" : "#ff8a2a";
    fillFrameRect(frame, meteor.x - radius, meteor.y - radius, radius * 2 + 1, radius * 2 + 1, color);
    paintFrameCell(frame, meteor.x, meteor.y, meteorImpactColor);
  }
  drawPlayerStart(frame) {
    const pulse = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 190));
    const color = this.phase === "starting" ? startingColor : pulse % 2 === 0 ? readyPulseColor : readyZoneColor;
    const inset = this.phase === "starting" ? pulse % 3 : pulse % 2;
    const x = readyZone2.minX + inset;
    const y = readyZone2.minY + inset;
    const width = readyZone2.maxX - readyZone2.minX + 1 - inset * 2;
    const height = readyZone2.maxY - readyZone2.minY + 1 - inset * 2;
    fillFrameRect(frame, x, y, width, height, color);
    if (width > 2 && height > 2) {
      fillFrameRect(frame, x + 1, y + 1, width - 2, height - 2, backgroundColor5);
    }
    paintFrameCell(frame, 7, 15, "#ffffff");
    paintFrameCell(frame, 8, 16, "#ffffff");
  }
  drawWinAnimation(frame) {
    const step = Math.floor(Math.max(0, this.nowMillis - this.finishedAtMillis) / 120);
    paintDiamondWave(frame, {
      color: ({ distance }) => successColors3[(distance + step) % successColors3.length] ?? successColors3[0],
      step
    });
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting" || this.phase === "ready") {
      return 0;
    }
    const endMillis = this.phase === "finished" ? this.finishedAtMillis : this.nowMillis;
    return Math.max(0, endMillis - this.startedAtMillis);
  }
  finish(success, atMillis) {
    this.phase = "finished";
    this.success = success;
    this.finishedAtMillis = atMillis;
    const event = gameEvent(success ? "win" : "fail", success ? "Tormenta superada" : "Sin vidas", atMillis);
    this.lastEvent = event;
    return event;
  }
  meteorContainsOccupiedTile(meteor) {
    for (const tile of this.occupiedTiles) {
      const [x, y] = occupiedTileCoordinates(tile);
      if (Math.abs(x - meteor.x) <= meteor.radius && Math.abs(y - meteor.y) <= meteor.radius) {
        return true;
      }
    }
    return false;
  }
  recordEvents(events) {
    const latestEvent = events.at(-1);
    if (latestEvent) {
      this.lastEvent = latestEvent;
    }
    return events;
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.rng = createSeededRng(this.config.seed);
    this.dodgedMeteors = 0;
    this.finishedAtMillis = 0;
    this.lastDamageMillis = Number.NEGATIVE_INFINITY;
    this.lives = startingLives3;
    this.meteors = [];
    this.nextMeteorId = 1;
    this.nextMeteorMillis = 0;
    this.nowMillis = nowMillis;
    this.occupiedTiles.clear();
    this.players = defaultPlayers(this.config.playerCount, this.config.players);
    this.startedAtMillis = nowMillis;
    this.success = false;
  }
  spawnDueMeteors(nowMillis) {
    const profile = this.difficultyProfile();
    let spawned = 0;
    while (this.nextMeteorMillis > 0 && this.nextMeteorMillis <= nowMillis && spawned < maxSpawnCatchUp) {
      const id = this.nextMeteorId;
      const large = profile.largeMeteorEvery > 0 && id % profile.largeMeteorEvery === 0;
      const radius = large ? Math.min(2, profile.radius + 1) : profile.radius;
      const impactAtMillis = this.nextMeteorMillis + profile.warningMillis;
      this.meteors.push({
        clearAtMillis: impactAtMillis + meteorImpactVisibleMillis,
        id,
        impactAtMillis,
        radius,
        result: "pending",
        spawnedAtMillis: this.nextMeteorMillis,
        x: this.rng.range(radius, FLOOR_COLS - radius - 1),
        y: this.rng.range(radius, FLOOR_ROWS - radius - 1)
      });
      this.nextMeteorId += 1;
      this.nextMeteorMillis += profile.intervalMillis;
      spawned += 1;
    }
  }
  updateOccupiedTile(x, y, pressed) {
    if (x < 0 || x >= FLOOR_COLS || y < 0 || y >= FLOOR_ROWS) {
      return;
    }
    const key = `${x},${y}`;
    if (pressed) {
      this.occupiedTiles.add(key);
    } else {
      this.occupiedTiles.delete(key);
    }
  }
};
function occupiedTileCoordinates(tile) {
  const [x = "0", y = "0"] = tile.split(",");
  return [Number(x), Number(y)];
}

// packages/published-level-runtime/src/types.ts
var PUBLISHED_LEVEL_CONTENT_SCHEMA = "motion-levels-published-level-content-v1";

// packages/published-level-runtime/src/content.ts
var MAX_LEVELS = 160;
var MAX_RESULT_ANIMATIONS = 160;
var MAX_FRAMES_PER_RECORD = 4096;
var MAX_CELLS_PER_FRAME = FLOOR_COLS * FLOOR_ROWS * 2;
function createPublishedLevelContent(input) {
  const gameId = requiredStableId(input.gameId, "gameId");
  const engineGame = requiredString(input.engineGame, "engineGame", 120).toLowerCase();
  const rawLevels = recordsFromPayload(input.levelsPayload, "levelsPayload");
  if (rawLevels.length === 0) throw new Error("Published level content has no playable levels");
  if (rawLevels.length > MAX_LEVELS) {
    throw new Error(`Published level content exceeds the ${MAX_LEVELS} level limit`);
  }
  const levels = rawLevels.map((value, index) => normalizeLevelRecord(value, `levels[${index}]`));
  const levelIds = /* @__PURE__ */ new Set();
  for (const level of levels) {
    if (levelIds.has(level.id)) {
      throw new Error(`Published level content contains duplicate canonical level id ${level.id}`);
    }
    levelIds.add(level.id);
  }
  const rawAnimations = optionalRecordsFromPayload(input.resultAnimationsPayload, "resultAnimationsPayload");
  if (rawAnimations.length > MAX_RESULT_ANIMATIONS) {
    throw new Error(`Published level content exceeds the ${MAX_RESULT_ANIMATIONS} animation limit`);
  }
  const resultAnimations = rawAnimations.map(
    (value, index) => normalizeAnimationRecord(value, `resultAnimations[${index}]`)
  );
  const selection = resolveLevelSelection(levels, input.selectedLevelId, input.selectedLevelSlug);
  const selectedLevelId = selection.id;
  const selectedLevelSlug = selection.slug;
  if (input.mode !== void 0 && input.mode !== "free" && input.mode !== "challenge") {
    throw new Error("mode must be challenge or free");
  }
  const mode = input.mode ?? "challenge";
  const suppliedRevision = input.contentRevision;
  if (suppliedRevision !== void 0 && !/^[0-9a-f]{16,64}$/u.test(suppliedRevision)) {
    throw new Error("contentRevision must be 16 through 64 lowercase hexadecimal characters");
  }
  const contentRevision = suppliedRevision || contentHash({ gameId, engineGame, selectedLevelId, selectedLevelSlug, mode, levels, resultAnimations });
  return deepFreeze({
    schema: PUBLISHED_LEVEL_CONTENT_SCHEMA,
    gameId,
    engineGame,
    contentRevision,
    selectedLevelId,
    selectedLevelSlug,
    mode,
    levels,
    resultAnimations
  });
}
function parsePublishedLevelContent(value, expectedGameId, aliases = []) {
  if (!value || value.schema !== PUBLISHED_LEVEL_CONTENT_SCHEMA) {
    throw new Error(`Expected ${PUBLISHED_LEVEL_CONTENT_SCHEMA} content`);
  }
  if (typeof value.contentRevision !== "string") {
    throw new Error("content.contentRevision must be supplied by the content boundary");
  }
  const contentGameId = requiredStableId(value.gameId, "content.gameId");
  const canonicalExpectedGameId = expectedGameId ? requiredStableId(expectedGameId, "expectedGameId") : "";
  if (canonicalExpectedGameId && contentGameId !== canonicalExpectedGameId) {
    throw new Error(`Published level content is for ${contentGameId}, expected ${canonicalExpectedGameId}`);
  }
  void aliases;
  const parsed = createPublishedLevelContent({
    gameId: contentGameId,
    engineGame: requiredString(value.engineGame, "content.engineGame", 120),
    contentRevision: value.contentRevision,
    selectedLevelId: optionalText(value.selectedLevelId, 120) || void 0,
    selectedLevelSlug: optionalText(value.selectedLevelSlug, 120) || void 0,
    mode: value.mode,
    levelsPayload: value.levels,
    resultAnimationsPayload: value.resultAnimations
  });
  return parsed;
}
function normalizeLevelId(value) {
  const clean = optionalText(value, 120).toLowerCase();
  if (!clean || clean === "starter") return "level-1";
  const numeric = /^(?:(?:nivel|level)[\s-]*)?(\d+)$/u.exec(clean);
  return numeric ? `level-${Math.max(1, Number(numeric[1]))}` : clean;
}
function recordsFromPayload(value, path) {
  if (Array.isArray(value)) return value;
  if (!isRecord(value) || !Array.isArray(value.levels)) {
    throw new Error(`${path} must be an array or an object with a levels array`);
  }
  return value.levels;
}
function optionalRecordsFromPayload(value, path) {
  if (value === void 0 || value === null) return [];
  return recordsFromPayload(value, path);
}
function normalizeLevelRecord(value, path) {
  const record = requiredRecord(value, path);
  const id = requiredStableId(record.id, `${path}.id`);
  const slugSource = requiredText(record.slug, `${path}.slug`, 120);
  const slug = normalizeLevelId(slugSource);
  const frames = normalizeFrames(record.frames, `${path}.frames`);
  if (frames.length === 0) throw new Error(`${path}.frames must contain at least one frame`);
  const rules = normalizeRules(record.rules, `${path}.rules`);
  const resultAnimations = normalizeResultAnimations(record.result_animations, `${path}.result_animations`);
  return compactObject({
    id,
    slug,
    settings_hash: optionalText(record.settings_hash, 160) || void 0,
    label: optionalText(record.label, 160) || levelLabel(slug),
    description: optionalText(record.description, 500) || void 0,
    difficulty: optionalText(record.difficulty, 40).toLowerCase() || void 0,
    life: optionalInteger(record.life, 0, 99, `${path}.life`),
    pass_score: optionalInteger(record.pass_score, 0, 1e5, `${path}.pass_score`),
    time_limit_seconds: optionalInteger(record.time_limit_seconds, 0, 86400, `${path}.time_limit_seconds`),
    frame_tick_ms: optionalInteger(record.frame_tick_ms, 1, 6e4, `${path}.frame_tick_ms`) ?? 25,
    rules,
    result_animations: resultAnimations,
    music_ref: optionalText(record.music_ref, 500) || void 0,
    music_volume: optionalFinite(record.music_volume, 0, 1, `${path}.music_volume`),
    narration_cue_ref: optionalText(record.narration_cue_ref, 500) || void 0,
    start_cue_ref: optionalText(record.start_cue_ref, 500) || void 0,
    coin_cue_ref: optionalText(record.coin_cue_ref, 500) || void 0,
    double_coin_cue_ref: optionalText(record.double_coin_cue_ref, 500) || void 0,
    damage_cue_ref: optionalText(record.damage_cue_ref, 500) || void 0,
    win_cue_ref: optionalText(record.win_cue_ref, 500) || void 0,
    defeat_cue_ref: optionalText(record.defeat_cue_ref, 500) || void 0,
    frames
  });
}
function normalizeAnimationRecord(value, path) {
  const record = requiredRecord(value, path);
  const slug = optionalText(record.slug ?? record.id, 120).toLowerCase();
  if (!slug) throw new Error(`${path} requires slug or id`);
  const frames = normalizeFrames(record.frames, `${path}.frames`);
  if (frames.length === 0) throw new Error(`${path}.frames must contain at least one frame`);
  const effects = record.tile_effects === void 0 ? {} : requiredRecord(record.tile_effects, `${path}.tile_effects`);
  const tileEffects = Object.fromEntries(Object.entries(effects).map(([kind, effect]) => {
    const effectRecord = requiredRecord(effect, `${path}.tile_effects.${kind}`);
    const color = normalizeHex(effectRecord.color);
    if (!color) throw new Error(`${path}.tile_effects.${kind}.color must be a six-digit hex color`);
    return [kind, { color }];
  }));
  return compactObject({
    id: optionalText(record.id, 120) || void 0,
    slug,
    frame_tick_ms: optionalInteger(record.frame_tick_ms, 1, 6e4, `${path}.frame_tick_ms`) ?? 50,
    tile_effects: tileEffects,
    frames
  });
}
function resolveLevelSelection(levels, requestedId, requestedSlug) {
  const cleanId = optionalText(requestedId, 120).toLowerCase();
  const cleanSlug = requestedSlug ? normalizeLevelId(requestedSlug) : "";
  let selected;
  if (cleanId) {
    selected = levels.find((level) => level.id.toLowerCase() === cleanId);
    if (!selected) {
      const legacyMatches = levels.filter((level) => normalizeLevelId(level.slug) === normalizeLevelId(cleanId));
      if (legacyMatches.length > 1) {
        throw new Error(`Legacy selected level alias ${cleanId} is ambiguous`);
      }
      selected = legacyMatches[0];
      if (!selected) throw new Error(`Selected level ${cleanId} is not present in content`);
    }
  } else if (cleanSlug) {
    const matches = levels.filter((level) => normalizeLevelId(level.slug) === cleanSlug);
    if (matches.length !== 1) throw new Error(`Selected level slug ${cleanSlug} is not uniquely resolvable`);
    selected = matches[0];
  } else {
    selected = levels[0];
  }
  if (!selected) throw new Error("Published level content has no selected level");
  if (cleanSlug && normalizeLevelId(selected.slug) !== cleanSlug) {
    throw new Error(`selectedLevelSlug ${cleanSlug} does not match selectedLevelId ${selected.id}`);
  }
  return selected;
}
function normalizeFrames(value, path) {
  if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
  if (value.length > MAX_FRAMES_PER_RECORD) {
    throw new Error(`${path} exceeds the ${MAX_FRAMES_PER_RECORD} frame limit`);
  }
  return value.map((raw, frameIndex) => {
    const record = requiredRecord(raw, `${path}[${frameIndex}]`);
    if (!Array.isArray(record.c)) throw new Error(`${path}[${frameIndex}].c must be an array`);
    if (record.c.length > MAX_CELLS_PER_FRAME) {
      throw new Error(`${path}[${frameIndex}].c exceeds the ${MAX_CELLS_PER_FRAME} cell limit`);
    }
    return {
      r: optionalInteger(record.r, 1, 1e6, `${path}[${frameIndex}].r`) ?? 1,
      c: record.c.map((cell, cellIndex2) => normalizeCell(cell, `${path}[${frameIndex}].c[${cellIndex2}]`))
    };
  });
}
function normalizeCell(value, path) {
  if (!Array.isArray(value) || value.length < 3 || value.length > 4) {
    throw new Error(`${path} must be [x, y, kind] or [x, y, kind, uniq]`);
  }
  const x = requiredInteger(value[0], 0, FLOOR_COLS - 1, `${path}[0]`);
  const y = requiredInteger(value[1], 0, FLOOR_ROWS - 1, `${path}[1]`);
  const kind = requiredInteger(value[2], 0, 255, `${path}[2]`);
  const uniq = optionalText(value[3], 120);
  return uniq ? [x, y, kind, uniq] : [x, y, kind];
}
function normalizeRules(value, path) {
  const rules = value === void 0 ? {} : requiredRecord(value, path);
  const victoryCondition = optionalText(rules.victory_condition, 40);
  if (victoryCondition && victoryCondition !== "collect_all" && victoryCondition !== "score_at_least") {
    throw new Error(`${path}.victory_condition is not supported`);
  }
  const redAnimation = optionalText(rules.red_floor_animation, 40);
  if (redAnimation && redAnimation !== "none" && redAnimation !== "parkour_lava") {
    throw new Error(`${path}.red_floor_animation is not supported`);
  }
  const loadSide = optionalText(rules.green_platform_load_side, 20);
  if (loadSide && loadSide !== "left" && loadSide !== "right") {
    throw new Error(`${path}.green_platform_load_side is not supported`);
  }
  return {
    victory_condition: victoryCondition,
    difficulty_changes_layout: rules.difficulty_changes_layout === true,
    difficulty_settings: normalizeDifficultySettings(rules.difficulty_settings, `${path}.difficulty_settings`),
    red_floor_animation: redAnimation,
    red_damage_grace_period: rules.red_damage_grace_period === true,
    green_platform_load_animation: rules.green_platform_load_animation !== false,
    green_platform_load_side: loadSide === "right" ? "right" : "left",
    green_platform_disappear: rules.green_platform_disappear === true,
    green_platform_impact_ripple: rules.green_platform_impact_ripple === true,
    blue_platform_turn_green: rules.blue_platform_turn_green === true,
    blue_platform_capture_area: rules.blue_platform_capture_area === true
  };
}
function normalizeResultAnimations(value, path) {
  const animations = value === void 0 ? {} : requiredRecord(value, path);
  return {
    victory_animations: textList(animations.victory_animations, `${path}.victory_animations`),
    defeat_animations: textList(animations.defeat_animations, `${path}.defeat_animations`)
  };
}
function normalizeDifficultySettings(value, path) {
  if (value === void 0) return {};
  const settings = requiredRecord(value, path);
  const entries = Object.entries(settings);
  if (entries.length > 12) throw new Error(`${path} exceeds the 12 difficulty limit`);
  return Object.fromEntries(entries.map(([key, raw]) => {
    const normalizedKey = requiredText(key, `${path} key`, 40).toLowerCase();
    const setting = requiredRecord(raw, `${path}.${normalizedKey}`);
    return [normalizedKey, compactObject({
      life: optionalInteger(setting.life, 0, 99, `${path}.${normalizedKey}.life`),
      frame_duration_ms: optionalInteger(
        setting.frame_duration_ms,
        0,
        6e4,
        `${path}.${normalizedKey}.frame_duration_ms`
      ),
      gameplay_lives: optionalInteger(
        setting.gameplay_lives,
        0,
        99,
        `${path}.${normalizedKey}.gameplay_lives`
      ),
      gameplay_time_limit_seconds: optionalInteger(
        setting.gameplay_time_limit_seconds,
        0,
        86400,
        `${path}.${normalizedKey}.gameplay_time_limit_seconds`
      ),
      speed_multiplier: optionalFinite(
        setting.speed_multiplier,
        0,
        100,
        `${path}.${normalizedKey}.speed_multiplier`
      )
    })];
  }));
}
function textList(value, path) {
  if (value === void 0) return [];
  if (!Array.isArray(value)) throw new Error(`${path} must be an array`);
  if (value.length > 32) throw new Error(`${path} exceeds the 32 item limit`);
  return value.map((entry, index) => requiredText(entry, `${path}[${index}]`, 120).toLowerCase());
}
function levelLabel(id) {
  const match = /^level-(\d+)$/u.exec(id);
  return match ? `Nivel ${match[1]}` : id;
}
function normalizeHex(value) {
  const clean = optionalText(value, 20).toLowerCase();
  return /^#[0-9a-f]{6}$/u.test(clean) ? clean : "";
}
function requiredRecord(value, path) {
  if (!isRecord(value)) throw new Error(`${path} must be an object`);
  return value;
}
function requiredText(value, path, max) {
  const clean = optionalText(value, max);
  if (!clean) throw new Error(`${path} must be a non-empty string`);
  return clean;
}
function requiredString(value, path, max) {
  if (typeof value !== "string") throw new Error(`${path} must be a non-empty string`);
  return requiredText(value, path, max);
}
function requiredStableId(value, path) {
  const clean = requiredString(value, path, 120);
  if (value !== clean) {
    throw new Error(`${path} must use its canonical representation without surrounding or control characters`);
  }
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;
  const hash = /^(?:[0-9a-f]{32}|[0-9a-f]{40}|[0-9a-f]{64})$/u;
  if (!uuid.test(clean) && !hash.test(clean)) {
    throw new Error(`${path} must be a canonical UUID or lowercase 32/40/64-character hash`);
  }
  return clean;
}
function optionalText(value, max) {
  if (value === void 0 || value === null) return "";
  if (typeof value !== "string" && typeof value !== "number") return "";
  return [...String(value).trim()].filter((character) => character.codePointAt(0) >= 32 && character.codePointAt(0) !== 127).join("").slice(0, max);
}
function requiredInteger(value, min, max, path) {
  const number = Number(value);
  if (!Number.isFinite(number) || !Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${path} must be an integer from ${min} through ${max}`);
  }
  return number;
}
function optionalInteger(value, min, max, path) {
  if (value === void 0 || value === null || value === "") return void 0;
  return requiredInteger(Number(value), min, max, path);
}
function optionalFinite(value, min, max, path) {
  if (value === void 0 || value === null || value === "") return void 0;
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) {
    throw new Error(`${path} must be a number from ${min} through ${max}`);
  }
  return number;
}
function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function compactObject(value) {
  return Object.fromEntries(Object.entries(value).filter(([, child]) => child !== void 0));
}
function contentHash(value) {
  const source = stableStringify(value);
  let first = 2166136261;
  let second = 2654435769;
  for (let index = 0; index < source.length; index += 1) {
    const code = source.charCodeAt(index);
    first = Math.imul(first ^ code, 16777619) >>> 0;
    second = Math.imul(second ^ code, 2246822507) >>> 0;
  }
  return `${first.toString(16).padStart(8, "0")}${second.toString(16).padStart(8, "0")}`;
}
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => `${JSON.stringify(key)}:${stableStringify(child)}`).join(",")}}`;
}
function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

// packages/published-level-runtime/src/engine.ts
var frameSize = FLOOR_COLS * FLOOR_ROWS;
var countdownDuration = 3e3;
var greenAppearWindow = 400;
var greenDisappearWindow = 800;
var greenImpactDuration = 1100;
var blueCaptureWindow = 600;
var damageCooldown = 1e3;
var resultDuration = 1250;
var failureRestartDuration = 3e3;
var black = { r: 0, g: 0, b: 0 };
var safeGreen = { r: 0, g: 255, b: 72 };
var blue = { r: 0, g: 0, b: 255 };
var red = { r: 255, g: 0, b: 0 };
var purple = { r: 245, g: 38, b: 255 };
var heldPurple = { r: 245, g: 250, b: 255 };
var hitYellow = { r: 255, g: 236, b: 82 };
var defaultAudio = Object.freeze({
  musicRef: "Motion/canciones/Background07.mp3",
  musicVolume: 0.18,
  narrationCueRef: "",
  startCueRef: "",
  coinCueRef: "Motion/sonidos/coin.wav",
  doubleCoinCueRef: "Motion/sonidos/coin.wav",
  damageCueRef: "Motion/sonidos/fallo.mp3",
  winCueRef: "Motion/sonidos/victoria.mp3",
  defeatCueRef: "Motion/sonidos/fallo.mp3"
});
function createPublishedLevelGame(product3, config) {
  return new PublishedLevelGame(product3, config);
}
var PublishedLevelGame = class {
  product;
  config;
  content;
  levels = [];
  animations = /* @__PURE__ */ new Map();
  level;
  players = publishedPlayers(1);
  nowMillis = 0;
  createdAt = 0;
  startedAt = countdownDuration;
  endedAt = 0;
  restartAt = 0;
  score = 0;
  lives = 5;
  success = false;
  ended = false;
  removed = /* @__PURE__ */ new Set();
  purpleHeld = /* @__PURE__ */ new Set();
  purplePrimed = /* @__PURE__ */ new Set();
  pressed = /* @__PURE__ */ new Set();
  greenImpacts = /* @__PURE__ */ new Set();
  ripples = [];
  capturedAt = /* @__PURE__ */ new Map();
  lastDamageAt = Number.NEGATIVE_INFINITY;
  lastDamageBy = /* @__PURE__ */ new Map();
  hitFlash = /* @__PURE__ */ new Map();
  lastEvent = gameEvent("none", "Listo", 0);
  constructor(product3, config) {
    this.product = product3;
    this.config = normalizeGameConfig(config, product3.manifest);
    this.content = this.resolveContent(this.config);
    this.rebuild(this.config.nowMillis);
  }
  init(nowMillis) {
    this.rebuild(nowMillis);
    return this.record([gameEvent("ready", `Prep\xE1rate para ${this.level.label}`, nowMillis)]);
  }
  press(event) {
    if (!inFloorBounds(event.x, event.y)) return [];
    this.nowMillis = event.atMillis;
    const events = this.tickState(event.atMillis);
    const key = cellIndex(event.x, event.y);
    if (event.pressed) this.pressed.add(key);
    else {
      this.pressed.delete(key);
      this.releasePurple(key, event.atMillis);
    }
    if (!event.pressed || this.ended || event.atMillis < this.startedAt) return this.record(events);
    this.triggerGreenImpact(key, event.atMillis);
    const pointEvents = this.applyPoint(this.pointAt(key, event.atMillis), key, event.atMillis);
    const completionEvents = this.tickState(event.atMillis);
    return this.record([
      ...events,
      ...pointEvents,
      ...completionEvents
    ]);
  }
  release(event) {
    return this.press({ ...event, pressed: false });
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    return this.record(this.tickState(event.atMillis));
  }
  render() {
    const frame = createFrame("#000000");
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        paintFrameCell(frame, x, y, rgbToHex(this.colorAt(cellIndex(x, y), this.nowMillis)));
      }
    }
    return frame;
  }
  snapshot() {
    const phase = this.ended ? "finished" : this.nowMillis < this.startedAt ? "countdown" : "running";
    const elapsedMillis = Math.max(0, this.nowMillis - this.startedAt);
    const remainingMillis = this.level.timeLimit > 0 && !this.ended ? Math.max(0, this.startedAt + this.level.timeLimit - this.nowMillis) : 0;
    const countdownMillis = this.nowMillis < this.startedAt ? this.startedAt - this.nowMillis : 0;
    const players = this.players.map((player) => ({ ...player, score: this.score, lives: this.lives }));
    return Object.freeze({
      currentGame: this.content.gameId,
      engineGame: this.content.engineGame,
      contentRevision: this.content.contentRevision,
      label: this.product.manifest.label,
      phase,
      playerCount: players.length,
      players,
      score: this.score,
      lives: this.lives,
      maxLives: this.startingLives(),
      elapsedMillis,
      remainingMillis,
      activeTargets: Math.max(0, this.level.scoreUniqs.size - this.removed.size),
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      lastEventMillis: this.lastEvent.atMillis,
      countdownMillis,
      difficulty: String(this.config.difficulty),
      level: this.level.id,
      levelSlug: this.level.slug,
      levelNumber: levelNumber(this.level.slug),
      levelCount: this.levels.length,
      levelLabel: this.level.label,
      levelDescription: this.level.description,
      isFinalLevel: this.levels.at(-1)?.id === this.level.id,
      objectivesTotal: this.level.scoreUniqs.size,
      objectivesRemaining: Math.max(0, this.level.scoreUniqs.size - this.removed.size),
      resultMillis: this.ended ? Math.max(0, (this.success ? resultDuration : failureRestartDuration) - (this.nowMillis - this.endedAt)) : 0,
      mode: this.content.mode,
      attemptCreatedMillis: this.createdAt,
      attemptStartedMillis: this.startedAt,
      attemptEndedMillis: this.endedAt,
      audio: this.level.audio
    });
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, this.product.manifest);
    this.content = this.resolveContent(this.config);
    this.rebuild(this.config.nowMillis);
  }
  playerReadyZones() {
    const first = this.level.frames[0];
    if (!first) return [];
    const safe = first.points.flatMap(
      (point, key) => point?.present === true && point.kind === 0 ? [key] : []
    );
    if (safe.length === 0) return [];
    return farthestSafeTiles(safe, Math.max(1, this.config.playerCount)).map((key) => {
      const x = key % FLOOR_COLS;
      const y = Math.floor(key / FLOOR_COLS);
      return { minX: x, maxX: x, minY: y, maxY: y };
    });
  }
  semanticTiles(atMillis = this.nowMillis) {
    const raw = this.frameAt(atMillis);
    if (!raw) return [];
    return raw.points.flatMap((point, index) => {
      if (!point?.present) return [];
      const effective = this.pointAt(index, atMillis);
      return [{
        x: index % FLOOR_COLS,
        y: Math.floor(index / FLOOR_COLS),
        kind: effective.kind,
        originalKind: point.kind,
        uniq: point.uniq,
        present: effective.present,
        removed: point.uniq ? this.removed.has(point.uniq) : false,
        primed: point.uniq ? this.purplePrimed.has(point.uniq) : false
      }];
    });
  }
  dangerAt(x, y, atMillis = this.nowMillis) {
    if (!inFloorBounds(x, y)) return 1;
    const key = cellIndex(x, y);
    const samples = [atMillis, atMillis + 200, atMillis + 400];
    return samples.reduce((danger, sample) => Math.max(danger, this.pointAt(key, sample).kind === 2 ? 1 : 0), 0);
  }
  resolveContent(config) {
    return parsePublishedLevelContent(
      config.content ?? this.product.fallbackContent,
      this.product.contentIdentity === "platform" ? void 0 : this.product.manifest.id
    );
  }
  rebuild(nowMillis) {
    this.levels = compileLevels(this.content, String(this.config.difficulty));
    this.animations = compileAnimations(this.content.resultAnimations);
    this.level = selectLevel(this.levels, this.content.selectedLevelId);
    this.players = publishedPlayers(Math.max(1, this.config.playerCount), this.config.players);
    this.createdAt = nowMillis;
    this.startedAt = nowMillis + countdownDuration;
    this.nowMillis = nowMillis;
    this.resetAttemptState();
  }
  resetAttemptState(preservePressed = false) {
    this.endedAt = 0;
    this.restartAt = 0;
    this.score = 0;
    this.lives = this.startingLives();
    this.success = false;
    this.ended = false;
    this.removed.clear();
    this.purpleHeld.clear();
    this.purplePrimed.clear();
    if (!preservePressed) this.pressed.clear();
    this.greenImpacts.clear();
    this.ripples = [];
    this.capturedAt.clear();
    this.lastDamageAt = Number.NEGATIVE_INFINITY;
    this.lastDamageBy.clear();
    this.hitFlash.clear();
    this.lastEvent = gameEvent("none", "Listo", this.nowMillis);
  }
  tickState(nowMillis) {
    this.pruneRipples(nowMillis);
    if (this.ended) {
      if (this.success && nowMillis >= this.endedAt + resultDuration && this.advanceSuccessLevel(nowMillis)) {
        return [gameEvent("ready", `Siguiente: ${this.level.label}`, nowMillis)];
      }
      if (!this.success && this.restartAt > 0 && nowMillis >= this.restartAt) {
        this.restartFailedLevel(nowMillis);
        return [gameEvent("ready", `Reintenta ${this.level.label}`, nowMillis)];
      }
      return [];
    }
    if (nowMillis < this.startedAt) return [];
    if (this.startedAt === this.createdAt && nowMillis === this.startedAt) return [];
    if (this.level.timeLimit > 0 && nowMillis - this.startedAt >= this.level.timeLimit) {
      this.finishFailure(nowMillis);
      return [gameEvent("fail", "Se acab\xF3 el tiempo", nowMillis)];
    }
    const events = [];
    for (const key of this.pressed) {
      if (this.pointAt(key, nowMillis).kind !== 2) continue;
      if (this.damage(key, nowMillis)) {
        events.push(gameEvent(this.ended ? "fail" : "damage", this.ended ? "Sin vidas" : `Impacto: quedan ${this.lives} vidas`, nowMillis));
      }
      if (this.ended) return events;
    }
    if (this.hasWon()) {
      if (this.level.winCondition === "collect_all" && this.level.passScore > 0) this.score += this.level.passScore;
      this.success = true;
      this.ended = true;
      this.endedAt = nowMillis;
      events.push(gameEvent("win", `${this.level.label} superado`, nowMillis));
    }
    return events;
  }
  hasWon() {
    return this.level.winCondition === "score_at_least" ? this.level.passScore > 0 && this.score >= this.level.passScore : this.level.scoreUniqs.size > 0 && this.removed.size >= this.level.scoreUniqs.size;
  }
  applyPoint(point, key, atMillis) {
    if (point.kind === 1) {
      const captured = this.captureBlue(point, key, atMillis);
      return captured > 0 ? [gameEvent("coin", `${this.score} puntos`, atMillis)] : [];
    }
    if (point.kind === 3 && point.uniq && !this.removed.has(point.uniq) && !this.purplePrimed.has(point.uniq)) {
      this.purpleHeld.add(point.uniq);
      return [gameEvent("doubleCoin", "Suelta y vuelve a pisar", atMillis)];
    }
    if (point.kind === 2 && this.damage(key, atMillis)) {
      return [gameEvent(this.ended ? "fail" : "damage", this.ended ? "Sin vidas" : `Impacto: quedan ${this.lives} vidas`, atMillis)];
    }
    return [];
  }
  releasePurple(key, atMillis) {
    if (this.ended || atMillis < this.startedAt) return;
    const point = this.rawPointAt(key, atMillis);
    if (!point.uniq || !this.purpleHeld.has(point.uniq)) return;
    this.purpleHeld.delete(point.uniq);
    if (!this.removed.has(point.uniq)) this.purplePrimed.add(point.uniq);
  }
  damage(key, atMillis) {
    if (this.level.damageGrace) {
      if (atMillis - this.lastDamageAt < damageCooldown) return false;
      this.lastDamageAt = atMillis;
    } else {
      const last = this.lastDamageBy.get(key) ?? Number.NEGATIVE_INFINITY;
      if (atMillis - last < damageCooldown) return false;
      this.lastDamageBy.set(key, atMillis);
    }
    this.hitFlash.set(key, atMillis + 350);
    if (this.lives > 0) this.lives -= 1;
    if (this.lives <= 0) this.finishFailure(atMillis);
    return true;
  }
  finishFailure(atMillis) {
    this.ended = true;
    this.success = false;
    this.endedAt = atMillis;
    this.restartAt = atMillis + failureRestartDuration;
  }
  restartFailedLevel(atMillis) {
    this.createdAt = atMillis;
    this.startedAt = atMillis;
    this.nowMillis = atMillis;
    this.resetAttemptState(true);
  }
  advanceSuccessLevel(atMillis) {
    const index = this.levels.findIndex((candidate) => candidate.id === this.level.id);
    const next = index >= 0 ? this.levels[index + 1] : void 0;
    if (!next) return false;
    this.level = next;
    this.createdAt = atMillis;
    this.startedAt = atMillis + countdownDuration;
    this.nowMillis = atMillis;
    this.resetAttemptState(true);
    return true;
  }
  colorAt(key, atMillis) {
    if (this.ended) return this.resultColorAt(key, atMillis);
    if ((this.hitFlash.get(key) ?? 0) > atMillis) return hitYellow;
    if (atMillis < this.startedAt) return this.countdownColorAt(key, atMillis);
    const point = this.pointAt(key, atMillis);
    return this.greenImpactColor(key, point, this.colorForPoint(key, point, atMillis), atMillis);
  }
  resultColorAt(key, atMillis) {
    const names = this.success ? this.level.victoryAnimations : this.level.defeatAnimations;
    const name = chosenResultAnimation(names, this.endedAt);
    const animation = name ? this.animations.get(name) : void 0;
    if (!animation) return black;
    const elapsed = Math.max(0, atMillis - this.endedAt) % Math.max(1, animation.totalDuration);
    let remaining = elapsed;
    let selected = animation.frames[animation.frames.length - 1];
    for (const frame of animation.frames) {
      if (remaining < frame.duration) {
        selected = frame;
        break;
      }
      remaining -= frame.duration;
    }
    const point = selected?.points[key];
    return point?.present ? animation.colors.get(point.kind) ?? black : black;
  }
  colorForPoint(key, point, atMillis) {
    if (!point.present) return black;
    if (point.kind === 2 && this.level.redAnimation === "parkour_lava") return lavaColor(key, atMillis);
    if (point.kind === 0 && point.uniq && this.removed.has(point.uniq) && this.level.blueTurnGreen) {
      return this.capturedBlueColor(point.uniq, atMillis);
    }
    if (point.kind === 0 && this.level.greenFade) return this.greenPlatformColor(key, atMillis);
    return basePointColor(point);
  }
  pointAt(key, atMillis) {
    const raw = this.rawPointAt(key, atMillis);
    if (raw.uniq && this.removed.has(raw.uniq)) {
      return this.level.blueTurnGreen && raw.kind === 1 ? { ...raw, kind: 0 } : emptyPoint;
    }
    if (raw.uniq && this.purplePrimed.has(raw.uniq)) return { ...raw, kind: 1 };
    if (raw.uniq && this.purpleHeld.has(raw.uniq)) return { ...raw, kind: 4 };
    return raw;
  }
  rawPointAt(key, atMillis) {
    return this.frameAt(atMillis)?.points[key] ?? emptyPoint;
  }
  frameAt(atMillis) {
    return framePosition(this.level, atMillis - this.startedAt).frame;
  }
  greenPlatformColor(key, atMillis) {
    const position = framePosition(this.level, atMillis - this.startedAt);
    const frame = position.frame;
    if (!frame) return black;
    const point = frame.points[key];
    if (!point?.present || point.kind !== 0) return black;
    let color = basePointColor(point);
    if (this.level.frames.length <= 1) return color;
    const index = position.index;
    const previous = this.level.frames[(index - 1 + this.level.frames.length) % this.level.frames.length]?.points[key] ?? emptyPoint;
    const next = this.level.frames[(index + 1) % this.level.frames.length]?.points[key] ?? emptyPoint;
    const appearWindow = Math.min(greenAppearWindow, frame.duration / 2);
    const disappearWindow = Math.min(greenDisappearWindow, frame.duration / 2);
    if ((!previous.present || previous.kind !== 0) && appearWindow > 0 && position.elapsed < appearWindow) {
      color = mixRgb(this.transitionPointColor(key, previous, atMillis - position.elapsed), color, ease(position.elapsed / appearWindow));
    }
    const remaining = frame.duration - position.elapsed;
    if ((!next.present || next.kind !== 0) && disappearWindow > 0 && remaining < disappearWindow) {
      color = mixRgb(color, this.transitionPointColor(key, next, atMillis + remaining), 1 - ease(remaining / disappearWindow));
    }
    return color;
  }
  transitionPointColor(key, point, atMillis) {
    if (!point.present) return black;
    return point.kind === 2 && this.level.redAnimation === "parkour_lava" ? lavaColor(key, atMillis) : basePointColor(point);
  }
  capturedBlueColor(uniq, atMillis) {
    const started = this.capturedAt.get(uniq);
    if (started === void 0 || atMillis - started >= blueCaptureWindow) return safeGreen;
    return mixRgb(blue, safeGreen, ease(Math.max(0, atMillis - started) / blueCaptureWindow));
  }
  captureBlue(point, key, atMillis) {
    if (!point.uniq || this.removed.has(point.uniq)) return 0;
    const originalKind = this.frameAt(atMillis)?.points[key]?.kind;
    const uniqs = this.level.blueCapture && originalKind === 1 ? this.connectedBlueUniqs(key, atMillis) : [point.uniq];
    let captured = 0;
    for (const uniq of uniqs) {
      if (!uniq || this.removed.has(uniq)) continue;
      this.removed.add(uniq);
      this.capturedAt.set(uniq, atMillis);
      this.purpleHeld.delete(uniq);
      this.purplePrimed.delete(uniq);
      this.score += 1;
      captured += 1;
    }
    return captured;
  }
  connectedBlueUniqs(start, atMillis) {
    const frame = this.frameAt(atMillis);
    if (!frame || frame.points[start]?.kind !== 1) return [];
    const component = floodFill(start, (key) => frame.points[key]?.present === true && frame.points[key]?.kind === 1);
    return [...new Set(component.map((key) => frame.points[key]?.uniq ?? "").filter(Boolean))];
  }
  triggerGreenImpact(key, atMillis) {
    if (!this.level.greenImpact || this.pointAt(key, atMillis).kind !== 0) return;
    const frame = this.frameAt(atMillis);
    if (!frame) return;
    const component = floodFill(key, (candidate) => frame.points[candidate]?.present === true && frame.points[candidate]?.kind === 0);
    if (component.length === 0) return;
    const componentKey = [...component].sort((a, b) => a - b).join(";");
    if (this.greenImpacts.has(componentKey)) return;
    this.greenImpacts.add(componentKey);
    this.ripples.push({
      centerX: component.reduce((sum, value) => sum + value % FLOOR_COLS + 0.5, 0) / component.length,
      centerY: component.reduce((sum, value) => sum + Math.floor(value / FLOOR_COLS) + 0.5, 0) / component.length,
      startedAt: atMillis
    });
  }
  greenImpactColor(key, point, base, atMillis) {
    if (!this.level.greenImpact || !point.present || point.kind !== 2) return base;
    const x = key % FLOOR_COLS + 0.5;
    const y = Math.floor(key / FLOOR_COLS) + 0.5;
    return this.ripples.reduce((color, ripple) => {
      const age = atMillis - ripple.startedAt;
      if (age < 0 || age > greenImpactDuration) return color;
      const progress = age / greenImpactDuration;
      const radius = 0.35 + progress * 7;
      const distance = Math.hypot(x - ripple.centerX, y - ripple.centerY);
      const strength = clamp01(1 - Math.abs(distance - radius) / 0.85) * (1 - progress);
      return strength > 0 ? mixRgb(color, { r: 255, g: 185, b: 72 }, strength * 0.7) : color;
    }, base);
  }
  pruneRipples(atMillis) {
    this.ripples = this.ripples.filter((ripple) => atMillis - ripple.startedAt <= greenImpactDuration);
  }
  countdownColorAt(key, atMillis) {
    const first = this.level.frames[0];
    if (!first) return black;
    const point = first.points[key];
    if (!this.level.greenLoad) {
      return point?.present === true && point.kind === 0 ? basePointColor(point) : black;
    }
    const safeTiles = first ? countdownSafeTiles(first, this.level.greenLoadSide) : [];
    const x = key % FLOOR_COLS;
    const y = Math.floor(key / FLOOR_COLS);
    const countdownProgress = (atMillis - this.createdAt) / Math.max(1, this.startedAt - this.createdAt);
    for (let order = 0; order < safeTiles.length; order += 1) {
      const target = safeTiles[order];
      const progress = countdownTileProgress(countdownProgress, order, safeTiles.length);
      if (progress < 0) continue;
      const targetX = target % FLOOR_COLS;
      const targetY = Math.floor(target / FLOOR_COLS);
      if (targetX !== x || countdownFallingY(targetY, progress, this.level.greenLoadSide) !== y) continue;
      if (progress >= 1) return safeGreen;
      const phase = (atMillis - this.createdAt) / 1e3 * Math.PI * 4 + (targetX + targetY) * 0.22;
      return scaleRgb2(safeGreen, 0.78 + 0.22 * (0.5 + 0.5 * Math.sin(phase)));
    }
    return black;
  }
  startingLives() {
    return this.level.lives > 0 ? this.level.lives : 5;
  }
  record(events) {
    if (events.length > 0) this.lastEvent = events[events.length - 1];
    return events;
  }
};
var emptyPoint = Object.freeze({ present: false, kind: -1, uniq: "" });
function compileLevels(content, difficulty) {
  const selectedDifficulty = difficulty.trim().toLowerCase();
  const deduped = dedupeLevels(content.levels, selectedDifficulty);
  if (deduped.length === 0) throw new Error("Published level content has no levels for this difficulty");
  return deduped.map((raw) => compileLevel(raw, selectedDifficulty, content.mode));
}
function compileLevel(raw, difficulty, mode) {
  const settings = raw.rules?.difficulty_settings?.[difficulty];
  const hasSettings = Object.keys(raw.rules?.difficulty_settings ?? {}).length > 0;
  let lives = hasSettings ? settings?.life ?? 0 : raw.life ?? 0;
  let timeLimit = mode === "challenge" && !hasSettings ? (raw.time_limit_seconds ?? 0) * 1e3 : 0;
  let frameTick = raw.frame_tick_ms && raw.frame_tick_ms > 0 ? raw.frame_tick_ms : 25;
  if (hasSettings) {
    if ((settings?.life ?? 0) > 0) lives = settings.life;
    if (mode === "challenge" && (settings?.gameplay_time_limit_seconds ?? 0) > 0) {
      timeLimit = settings.gameplay_time_limit_seconds * 1e3;
    }
    if ((settings?.speed_multiplier ?? 0) > 0) frameTick = Math.max(1, frameTick / settings.speed_multiplier);
  }
  const scoreUniqs = /* @__PURE__ */ new Set();
  let totalDuration = 0;
  const frames = raw.frames.map((frame) => {
    const points = Array.from({ length: frameSize });
    for (const [x, y, kind, uniq = ""] of frame.c) {
      points[cellIndex(x, y)] = Object.freeze({ present: true, kind, uniq });
      if (uniq && (kind === 1 || kind === 3)) scoreUniqs.add(uniq);
    }
    const duration = Math.max(1, frame.r) * frameTick;
    totalDuration += duration;
    return Object.freeze({ duration, points: Object.freeze(points) });
  });
  const audio = Object.freeze({
    musicRef: raw.music_ref || defaultAudio.musicRef,
    musicVolume: raw.music_volume === void 0 ? defaultAudio.musicVolume : clamp2(raw.music_volume, 0, 1),
    narrationCueRef: raw.narration_cue_ref || "",
    startCueRef: raw.start_cue_ref || "",
    coinCueRef: raw.coin_cue_ref || defaultAudio.coinCueRef,
    doubleCoinCueRef: raw.double_coin_cue_ref || raw.coin_cue_ref || defaultAudio.doubleCoinCueRef,
    damageCueRef: raw.damage_cue_ref || defaultAudio.damageCueRef,
    winCueRef: raw.win_cue_ref || defaultAudio.winCueRef,
    defeatCueRef: raw.defeat_cue_ref || raw.damage_cue_ref || defaultAudio.defeatCueRef
  });
  return Object.freeze({
    id: raw.id,
    slug: normalizeLevelId(raw.slug),
    aliases: uniqueStrings([raw.slug]),
    label: raw.label,
    description: raw.description ?? "",
    difficulty,
    lives,
    passScore: raw.pass_score ?? 0,
    timeLimit,
    frameTick,
    winCondition: raw.rules?.victory_condition === "score_at_least" ? "score_at_least" : "collect_all",
    redAnimation: raw.rules?.red_floor_animation === "parkour_lava" ? "parkour_lava" : "none",
    victoryAnimations: uniqueStrings(raw.result_animations?.victory_animations),
    defeatAnimations: uniqueStrings(raw.result_animations?.defeat_animations),
    greenFade: raw.rules?.green_platform_disappear === true,
    greenImpact: raw.rules?.green_platform_impact_ripple === true,
    greenLoad: raw.rules?.green_platform_load_animation !== false,
    greenLoadSide: raw.rules?.green_platform_load_side === "right" ? "right" : "left",
    blueTurnGreen: raw.rules?.blue_platform_turn_green === true,
    blueCapture: raw.rules?.blue_platform_capture_area === true,
    damageGrace: raw.rules?.red_damage_grace_period === true,
    totalDuration,
    frames: Object.freeze(frames),
    scoreUniqs,
    audio
  });
}
function dedupeLevels(levels, difficulty) {
  const order = [];
  const byId = /* @__PURE__ */ new Map();
  for (const level of levels) {
    const id = normalizeLevelId(level.slug);
    const rank = level.difficulty?.toLowerCase() === difficulty ? 3 : level.rules?.difficulty_settings?.[difficulty] ? 2 : 1;
    const previous = byId.get(id);
    if (!previous) {
      order.push(id);
      byId.set(id, { level, rank });
    } else if (rank > previous.rank) byId.set(id, { level, rank });
  }
  return order.map((id) => byId.get(id).level);
}
function compileAnimations(records) {
  const result = /* @__PURE__ */ new Map();
  for (const record of records) {
    const frameTick = record.frame_tick_ms && record.frame_tick_ms > 0 ? record.frame_tick_ms : 50;
    let totalDuration = 0;
    const frames = (record.frames ?? []).map((frame) => {
      const points = Array.from({ length: frameSize });
      for (const [x, y, kind] of frame.c) points[cellIndex(x, y)] = { present: true, kind, uniq: "" };
      const duration = Math.max(1, frame.r) * frameTick;
      totalDuration += duration;
      return { duration, points };
    });
    if (frames.length === 0) continue;
    const colors = /* @__PURE__ */ new Map();
    for (const [kind, effect] of Object.entries(record.tile_effects ?? {})) {
      const parsed = parseHex(effect.color ?? "");
      if (parsed) colors.set(Number(kind), parsed);
    }
    const ids = uniqueStrings([record.slug, record.id ?? ""]);
    const compiled = Object.freeze({ ids, frameTick, totalDuration, frames, colors });
    for (const id of ids) result.set(id, compiled);
  }
  return result;
}
function selectLevel(levels, selected) {
  const exact = levels.find((level) => level.id === selected.toLowerCase());
  if (exact) return exact;
  const normalized = normalizeLevelId(selected);
  const aliases = levels.filter((level) => level.aliases.includes(normalized));
  if (aliases.length === 1) return aliases[0];
  if (aliases.length > 1) throw new Error(`Selected level alias ${selected} is ambiguous`);
  throw new Error(`Selected level ${selected} is not present in compiled content`);
}
function framePosition(level, rawElapsed) {
  if (level.frames.length === 0 || rawElapsed < 0) return { index: -1, elapsed: 0 };
  let elapsed = level.totalDuration > 0 ? rawElapsed % level.totalDuration : rawElapsed;
  for (let index2 = 0; index2 < level.frames.length; index2 += 1) {
    const frame2 = level.frames[index2];
    if (elapsed < frame2.duration) return { frame: frame2, index: index2, elapsed };
    elapsed -= frame2.duration;
  }
  const index = level.frames.length - 1;
  const frame = level.frames[index];
  return { frame, index, elapsed: frame?.duration ?? 0 };
}
function basePointColor(point) {
  if (!point.present) return black;
  if (point.kind === 0) return safeGreen;
  if (point.kind === 1) return blue;
  if (point.kind === 2) return red;
  if (point.kind === 3) return purple;
  if (point.kind === 4) return heldPurple;
  return black;
}
function lavaColor(key, atMillis) {
  const x = key % FLOOR_COLS;
  const y = Math.floor(key / FLOOR_COLS);
  const seconds = atMillis / 1e3 * 0.22;
  const nx = x / FLOOR_COLS;
  const ny = y / FLOOR_ROWS;
  const field = 0.5 + 0.5 * Math.sin((nx * 3 + ny * 1.6 + seconds * 0.7) * Math.PI) * Math.cos((nx * 2.2 - ny * 3.2 - seconds * 0.5) * Math.PI);
  const heat = clamp01(0.18 + field * 0.82);
  const flicker = 0.92 + 0.08 * Math.sin((x * 1.3 + y * 0.7 + seconds * 4.2) * Math.PI);
  return {
    r: byte((150 + 105 * heat) * flicker),
    g: byte((14 + 70 * heat) * flicker),
    b: byte((2 + 10 * heat) * flicker)
  };
}
function chosenResultAnimation(values, endedAt) {
  const normalized = uniqueStrings(values);
  if (normalized.length <= 1) return normalized[0] ?? "";
  return normalized[hashInt(Math.trunc(endedAt)) % normalized.length] ?? normalized[0];
}
function hashInt(value) {
  let x = value + 2654435769 >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 2246822507) >>> 0;
  x ^= x >>> 13;
  x = Math.imul(x, 3266489909) >>> 0;
  x ^= x >>> 16;
  return x & 2147483647;
}
function countdownSafeTiles(frame, side) {
  const result = [];
  const rows = Array.from({ length: FLOOR_ROWS }, (_, index) => side === "right" ? FLOOR_ROWS - 1 - index : index);
  for (const y of rows) for (let x = 0; x < FLOOR_COLS; x += 1) {
    const key = cellIndex(x, y);
    const point = frame.points[key];
    if (point?.present && point.kind === 0) result.push(key);
  }
  return result;
}
function countdownTileProgress(progressValue, order, total) {
  const progress = clamp01(progressValue);
  if (total <= 1) return Math.min(progress / 0.92, 1);
  const delay = order / (total - 1) * 0.68;
  return clamp2((progress - delay) / 0.24, -1, 1);
}
function countdownFallingY(targetY, tileProgress, side) {
  const progress = clamp01(tileProgress);
  const eased = 1 - (1 - progress) ** 3;
  const startY = side === "right" ? targetY - FLOOR_ROWS : targetY + FLOOR_ROWS;
  return Math.round(startY + (targetY - startY) * eased);
}
function farthestSafeTiles(safe, count) {
  const selected = [safe[Math.floor((safe.length - 1) / 2)]];
  while (selected.length < count) {
    const next = safe.filter((key) => !selected.includes(key)).map((key) => ({
      key,
      distance: Math.min(...selected.map((other) => tileDistanceSquared(key, other)))
    })).sort((left, right) => right.distance - left.distance || left.key - right.key)[0]?.key;
    selected.push(next ?? safe[selected.length % safe.length]);
  }
  return selected;
}
function tileDistanceSquared(left, right) {
  const deltaX = left % FLOOR_COLS - right % FLOOR_COLS;
  const deltaY = Math.floor(left / FLOOR_COLS) - Math.floor(right / FLOOR_COLS);
  return deltaX * deltaX + deltaY * deltaY;
}
function floodFill(start, predicate) {
  if (!predicate(start)) return [];
  const visited = /* @__PURE__ */ new Set([start]);
  const queue = [start];
  while (queue.length > 0) {
    const key = queue.shift();
    for (const next of neighbors(key)) {
      if (!visited.has(next) && predicate(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return [...visited];
}
function neighbors(key) {
  const x = key % FLOOR_COLS;
  const y = Math.floor(key / FLOOR_COLS);
  return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].filter(([nextX, nextY]) => inFloorBounds(nextX, nextY)).map(([nextX, nextY]) => cellIndex(nextX, nextY));
}
function uniqueStrings(values) {
  return [...new Set((values ?? []).map((value) => value.trim().toLowerCase()).filter(Boolean))];
}
function publishedPlayers(count, supplied = []) {
  const colors = [
    "#ff0000",
    "#00ffff",
    "#00ff00",
    "#ff00ff",
    "#0000ff",
    "#ffff00"
  ];
  return Array.from({ length: count }, (_, index) => ({
    index,
    label: supplied[index]?.label || supplied[index]?.name || `Jugador ${index + 1}`,
    color: supplied[index]?.color || colors[index % colors.length],
    score: 0,
    lives: -1
  }));
}
function cellIndex(x, y) {
  return y * FLOOR_COLS + x;
}
function levelNumber(id) {
  return Number(/^level-(\d+)$/u.exec(id)?.[1] ?? 0);
}
function mixRgb(from, to, amount) {
  const t = clamp01(amount);
  return {
    r: byte(from.r + (to.r - from.r) * t),
    g: byte(from.g + (to.g - from.g) * t),
    b: byte(from.b + (to.b - from.b) * t)
  };
}
function scaleRgb2(color, scale) {
  return { r: byte(color.r * scale), g: byte(color.g * scale), b: byte(color.b * scale) };
}
function ease(value) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}
function parseHex(value) {
  if (!/^#[0-9a-f]{6}$/iu.test(value)) return void 0;
  const number = Number.parseInt(value.slice(1), 16);
  return { r: number >> 16, g: number >> 8 & 255, b: number & 255 };
}
function byte(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}
function clamp01(value) {
  return clamp2(value, 0, 1);
}
function clamp2(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// games/parkour/src/manifest.ts
var parkourGameId = "c1daea4f-e586-4116-8cbe-871cde887a81";
var parkourEngineGame = "parkour";
var manifest12 = {
  id: parkourGameId,
  slug: parkourEngineGame,
  aliases: [parkourEngineGame],
  label: "Parkour",
  description: "Supera plataformas, recoge objetivos y evita la lava en niveles editables.",
  availability: { development: true, production: true },
  catalog: {
    category: "individual",
    color: "#ff9f45",
    durationLabel: "Mejor tiempo",
    modeLabel: "Niveles",
    audioLabel: "M\xFAsica + efectos",
    rules: [
      "Avanza por las plataformas verdes sin tocar la lava",
      "Recoge suficientes objetivos azules para superar cada nivel"
    ]
  },
  players: {
    allowAny: true,
    min: 1,
    max: 8
  },
  start: { mode: "immediate" },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard"]
    },
    vars: []
  },
  defaultDurationMillis: 0,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    actions: [{ atMillis: 3100, type: "press", x: 7, y: 29 }],
    captureStartMillis: 3180,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["published-levels", "platform-editable", "jugar-3d", "individual", "typescript"]
};

// games/parkour/src/fixtures-content.ts
var fallbackContent = createPublishedLevelContent({
  gameId: parkourGameId,
  engineGame: parkourEngineGame,
  selectedLevelId: "11111111-1111-4111-8111-111111111101",
  selectedLevelSlug: "level-1",
  mode: "challenge",
  levelsPayload: [
    parkourLevel("11111111-1111-4111-8111-111111111101", "level-1", "Parkour / Nivel 1", 0),
    parkourLevel("11111111-1111-4111-8111-111111111102", "level-2", "Parkour / Nivel 2", 2)
  ],
  resultAnimationsPayload: {
    levels: [resultAnimation("game-pass", "#00ff48", victoryCells()), resultAnimation("game-fail", "#ff2036", defeatCells())]
  }
});
function parkourLevel(id, slug, label, shift) {
  return {
    id,
    slug,
    label,
    description: "Cruza la lava por las plataformas verdes y captura la plataforma azul.",
    life: 3,
    pass_score: 3,
    time_limit_seconds: 0,
    frame_tick_ms: 25,
    rules: {
      victory_condition: "score_at_least",
      difficulty_changes_layout: true,
      difficulty_settings: {
        easy: { life: 5, speed_multiplier: 0.8 },
        medium: { life: 3, speed_multiplier: 1 },
        hard: { life: 2, speed_multiplier: 1.3 }
      },
      red_floor_animation: "parkour_lava",
      red_damage_grace_period: false,
      green_platform_load_animation: true,
      green_platform_load_side: "left",
      green_platform_disappear: true,
      green_platform_impact_ripple: true,
      blue_platform_turn_green: true,
      blue_platform_capture_area: true
    },
    result_animations: {
      victory_animations: ["game-pass"],
      defeat_animations: ["game-fail"]
    },
    music_ref: "Motion/canciones/Background07.mp3",
    music_volume: 0.18,
    coin_cue_ref: "Motion/sonidos/coin.wav",
    damage_cue_ref: "Motion/sonidos/fallo.mp3",
    win_cue_ref: "Motion/sonidos/victoria.mp3",
    defeat_cue_ref: "Motion/sonidos/fallo.mp3",
    frames: [
      { r: 100, c: parkourCells(shift, 0) },
      { r: 100, c: parkourCells(shift, 1) }
    ]
  };
}
function parkourCells(levelShift, motionShift) {
  const cells = [];
  for (let y = 0; y < 32; y += 1) {
    for (let x = 0; x < 16; x += 1) cells.push([x, y, 2, `lava-${x}-${y}`]);
  }
  for (let y = 28; y < 32; y += 1) {
    for (let x = 5; x <= 10; x += 1) cells.push([x, y, 0, `start-${x}-${y}`]);
  }
  const islands = [23, 18, 13, 9].map((y, index) => ({
    x: 3 + index % 2 * 6 + (motionShift + levelShift) % 2,
    y: y - levelShift
  }));
  for (const [index, island] of islands.entries()) {
    for (let y = island.y; y <= island.y + 1; y += 1) {
      for (let x = island.x; x <= island.x + 3; x += 1) cells.push([x, y, 0, `island-${index}-${x}-${y}`]);
    }
  }
  const targetY = Math.max(2, 5 - levelShift);
  for (let x = 7; x <= 9; x += 1) cells.push([x, targetY, 1, `goal-${levelShift}-${x}`]);
  return cells;
}
function resultAnimation(slug, color, cells) {
  return {
    slug,
    frame_tick_ms: 50,
    tile_effects: { 0: { color } },
    frames: [{ r: 12, c: cells }, { r: 12, c: cells.map(([x, y, kind]) => [15 - x, 31 - y, kind]) }]
  };
}
function victoryCells() {
  const cells = [];
  for (let x = 0; x < 16; x += 1) cells.push([x, 0, 0], [x, 31, 0]);
  for (let y = 1; y < 31; y += 1) cells.push([0, y, 0], [15, y, 0]);
  for (let step = 0; step < 8; step += 1) cells.push([4 + step, 12 + step, 0], [11 - step, 12 + step, 0]);
  return cells;
}
function defeatCells() {
  const cells = [];
  for (let step = 0; step < 16; step += 1) cells.push([step, 8 + step, 0], [15 - step, 8 + step, 0]);
  return cells;
}

// games/parkour/src/game.ts
var product = Object.freeze({
  manifest: manifest12,
  fallbackContent,
  contentIdentity: "platform"
});
function createGame12(config) {
  return createPublishedLevelGame(product, config);
}

// games/patrones/src/manifest.ts
var manifest13 = {
  id: "patrones",
  label: "Patrones",
  description: "Reconstruye patrones azules sin pisar baldosas incorrectas.",
  availability: { development: true, production: true },
  catalog: {
    category: "team",
    color: "#176bff",
    durationLabel: "45s",
    modeLabel: "Reconstrucci\xF3n",
    audioLabel: "M\xFAsica + efectos",
    rules: ["Memoriza el patr\xF3n azul", "Pisa cada objetivo una vez", "Evita las dem\xE1s baldosas"]
  },
  players: { allowAny: true, min: 1, max: 1 },
  start: { mode: "player-ready" },
  defaultDurationMillis: 45e3,
  config: { difficulty: { options: ["easy", "medium", "hard"], default: "medium" } },
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    actions: [{ atMillis: 100, type: "press", x: 8, y: 16 }],
    captureStartMillis: 2300,
    frameCount: 24,
    frameIntervalMillis: 120
  },
  tags: ["patrones", "memoria", "typescript"]
};

// games/patrones/src/game.ts
var patronesCelebrationMillis = 5e3;
var patterns = {
  easy: [
    { x: 7, y: 11 },
    { x: 8, y: 11 },
    { x: 6, y: 12 },
    { x: 9, y: 12 },
    { x: 5, y: 13 },
    { x: 10, y: 13 },
    { x: 7, y: 14 },
    { x: 8, y: 14 }
  ],
  medium: [
    { x: 7, y: 8 },
    { x: 8, y: 8 },
    { x: 6, y: 10 },
    { x: 9, y: 10 },
    { x: 5, y: 12 },
    { x: 10, y: 12 },
    { x: 6, y: 14 },
    { x: 9, y: 14 },
    { x: 7, y: 16 },
    { x: 8, y: 16 },
    { x: 7, y: 18 },
    { x: 8, y: 18 }
  ],
  hard: [
    { x: 7, y: 7 },
    { x: 8, y: 7 },
    { x: 5, y: 9 },
    { x: 10, y: 9 },
    { x: 4, y: 12 },
    { x: 11, y: 12 },
    { x: 6, y: 13 },
    { x: 9, y: 13 },
    { x: 5, y: 16 },
    { x: 10, y: 16 },
    { x: 7, y: 17 },
    { x: 8, y: 17 },
    { x: 6, y: 20 },
    { x: 9, y: 20 },
    { x: 7, y: 22 },
    { x: 8, y: 22 }
  ]
};
function patternTargets(difficulty = "medium") {
  return (patterns[difficulty] ?? patterns.medium ?? []).map((point) => ({ ...point }));
}
function createGame13(config) {
  return new PatronesGame(config);
}
var PatronesGame = class {
  claimed = /* @__PURE__ */ new Set();
  config;
  finishedAtMillis;
  lastEvent = gameEvent("none", "Listo", 0);
  nowMillis = 0;
  phase = "ready";
  players;
  readyGate;
  startedAtMillis = 0;
  success = false;
  targets;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest13);
    this.readyGate = createPlayerReadyGate(manifest13.start, [{ minX: 5, maxX: 10, minY: 13, maxY: 18 }], this.config.nowMillis);
    this.targets = patternTargets(this.config.difficulty);
    this.players = this.scoredPlayers();
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    if (this.phase !== "running" || !event.pressed) return [];
    const key = `${event.x},${event.y}`;
    if (this.targets.some((target) => target.x === event.x && target.y === event.y)) {
      if (this.claimed.has(key)) return [];
      this.claimed.add(key);
      this.players = this.scoredPlayers();
      if (this.claimed.size === this.targets.length) return this.finish(true, "Patr\xF3n completado", event.atMillis);
      this.lastEvent = gameEvent("hit", `Acierto ${this.claimed.size} de ${this.targets.length}`, event.atMillis);
      return [this.lastEvent];
    }
    return this.finish(false, "Baldosa incorrecta", event.atMillis);
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    if (this.phase === "finished") {
      if (event.atMillis - (this.finishedAtMillis ?? event.atMillis) >= patronesCelebrationMillis) {
        this.resetState(event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase === "running" && this.remainingMillis() === 0) return this.finish(false, "Tiempo agotado", event.atMillis);
    return [];
  }
  render() {
    const frame = createFrame("#030712");
    if (this.phase === "waiting" || this.phase === "starting") {
      const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 180));
      paintDiamondRing(frame, { centerX: 8, centerY: 16, radius: 2 + step % 8, color: this.phase === "starting" ? "#ffe176" : "#176bff" });
      return frame;
    }
    for (const target of this.targets) {
      paintFrameCell(frame, target.x, target.y, this.claimed.has(`${target.x},${target.y}`) ? "#35e77a" : "#176bff");
    }
    if (this.phase === "finished") {
      paintDiamondWave(frame, { color: this.success ? "#35e77a" : "#ff334e", step: Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 140) });
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest13.id,
      label: manifest13.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.claimed.size,
      lives: -1,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? this.targets.length - this.claimed.size : 0,
      success: this.phase === "finished" && this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      matchTarget: this.targets.length,
      claimedTargets: this.claimed.size,
      totalTargets: this.targets.length,
      celebrationMillis: this.phase === "finished" ? Math.max(0, patronesCelebrationMillis - (this.nowMillis - (this.finishedAtMillis ?? this.nowMillis))) : 0
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest13);
    this.targets = patternTargets(this.config.difficulty);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Jugador listo", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve al centro", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastEvent = gameEvent("start", "Reconstruye el patr\xF3n azul", nowMillis);
    } else return [];
    return [this.lastEvent];
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting") return 0;
    return Math.max(0, (this.finishedAtMillis ?? this.nowMillis) - this.startedAtMillis);
  }
  finish(success, message, atMillis) {
    this.phase = "finished";
    this.success = success;
    this.finishedAtMillis = atMillis;
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.claimed.clear();
    this.finishedAtMillis = void 0;
    this.lastEvent = gameEvent("ready", "Espera en la zona central", nowMillis);
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.startedAtMillis = nowMillis;
    this.success = false;
    this.players = this.scoredPlayers();
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({ ...player, score: this.claimed.size }));
  }
};

// games/ping-pong/src/manifest.ts
var pingPongConfigVars = {
  pointsToWin: {
    key: "points_to_win",
    label: "Points to win",
    playerFacing: true,
    description: "The first team to reach this score wins. A match can last up to twice this value minus one rounds.",
    type: "int",
    default: 5,
    min: 1,
    max: 21,
    step: 1
  },
  initialBallSpeed: {
    key: "initial_ball_speed",
    label: "Initial ball speed (tiles/s)",
    playerFacing: false,
    description: "The ball's starting speed in floor tiles per second on Easy. Medium, Hard, and Expert apply the difficulty multiplier curve to this value.",
    type: "float",
    default: 5.75,
    min: 3,
    max: 10,
    step: 0.25
  },
  returnSpeedMultiplier: {
    key: "return_speed_multiplier",
    label: "Speed multiplier per return",
    playerFacing: false,
    description: "The ball accelerates after every successful paddle return. Difficulty scales the increase above 1x, with a safety cap at 2.5 times the starting speed.",
    type: "float",
    default: 1.035,
    min: 1,
    max: 1.1,
    step: 5e-3
  },
  difficultyMultiplier: {
    key: "difficulty_multiplier",
    label: "Difficulty multiplier step",
    playerFacing: false,
    description: "Easy uses 1x, Medium uses one step, Hard uses the step squared, and Expert uses the step cubed. It affects both starting speed and return acceleration.",
    type: "float",
    default: 1.2,
    min: 1,
    max: 1.35,
    step: 0.05
  }
};
var manifest14 = {
  id: "ping-pong",
  label: "Ping Pong",
  description: "Two-player arcade ping pong for red and blue halves of the Motion Levels floor.",
  availability: { development: true, production: true },
  catalog: {
    category: "versus",
    color: "#145cff",
    durationLabel: "A 5 puntos",
    modeLabel: "Rojo contra azul",
    audioLabel: "M\xFAsica + efectos",
    rules: ["Un equipo ocupa la mitad roja y otro la azul", "Devuelve la pelota pisando la zona iluminada"]
  },
  players: {
    allowAny: true,
    min: 2,
    max: 2
  },
  start: {
    mode: "player-ready",
    releaseGraceMillis: 1e3
  },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    },
    vars: Object.values(pingPongConfigVars)
  },
  defaultDurationMillis: 0,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 2,
    difficulty: "medium",
    options: { points_to_win: 5 },
    actions: [
      { atMillis: 100, type: "press", x: 7, y: 3 },
      { atMillis: 100, type: "press", x: 7, y: 28 }
    ],
    captureStartMillis: 2200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["arcade", "two-player", "typescript"]
};

// games/ping-pong/src/game.ts
var redColor = "#ff1c28";
var blueColor = "#145cff";
var ballColor2 = "#ffffff";
var idleColor3 = "#05070a";
var redRgb = { r: 255, g: 28, b: 40 };
var blueRgb = { r: 20, g: 92, b: 255 };
var whiteRgb = { r: 255, g: 255, b: 255 };
var postPointPauseMillis = 900;
var winAnimationMillis3 = 3e3;
var paddleYRed = 2;
var paddleYBlue = 29;
var paddleWidth2 = 5;
var serveX = Math.floor(FLOOR_COLS / 2);
var serveY = Math.floor(FLOOR_ROWS / 2);
var maximumSpeedRatio = 2.5;
function createGame14(config) {
  return new PingPongGame(config);
}
var PingPongGame = class {
  config;
  rng;
  players;
  winningScore;
  speed;
  startedAtMillis = 0;
  nowMillis = 0;
  readyGate;
  lastStepMillis = 0;
  pauseUntilMillis = 0;
  finishAtMillis = 0;
  currentIntervalMillis = 140;
  hitCount = 0;
  redPaddleX = 0;
  bluePaddleX = 0;
  ball = { x: serveX, y: serveY, dx: 1, dy: 1 };
  ballTrail = [];
  teamScore = [0, 0];
  rounds = [];
  lastRoundHits = 0;
  lastRoundWinner = "";
  phase = "waiting";
  success = false;
  scorer = -1;
  winner = -1;
  pointAtMillis = 0;
  lastImpactAtMillis = 0;
  lastImpact = null;
  motionEventId = 0;
  lastEvent = gameEvent("none", "Listo", 0);
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest14);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate = createPlayerReadyGate(manifest14.start, createHorizontalPlayerReadyZones(2), this.config.nowMillis);
    this.winningScore = this.readWinningScore();
    this.players = this.createPlayers();
    this.speed = speedForConfig(this.config);
    this.resetGame(this.config.nowMillis);
  }
  init(nowMillis) {
    this.startedAtMillis = nowMillis;
    this.nowMillis = nowMillis;
    this.resetGame(nowMillis);
    this.lastEvent = gameEvent("ready", "Ping Pong espera rojo y azul", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    const readyTransition = this.readyGate.update(event);
    if (event.pressed) {
      this.movePaddle(event.x, event.y);
    }
    return this.recordEvents(this.updatePhase(event.atMillis, readyTransition));
  }
  release(event) {
    this.nowMillis = event.atMillis;
    const readyTransition = this.readyGate.update({ ...event, pressed: false });
    return this.recordEvents(this.updatePhase(event.atMillis, readyTransition));
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    const events = this.updatePhase(event.atMillis, this.readyGate.tick(event.atMillis));
    if (this.phase !== "running" || event.atMillis < this.pauseUntilMillis) {
      return this.recordEvents(events);
    }
    for (let steps = 0; steps < 8; steps += 1) {
      if (event.atMillis - this.lastStepMillis < this.currentIntervalMillis) {
        break;
      }
      this.lastStepMillis += this.currentIntervalMillis;
      const nextEvent = this.moveBall(this.lastStepMillis);
      if (nextEvent) {
        events.push(nextEvent);
      }
      if (this.phase !== "running" || this.lastStepMillis < this.pauseUntilMillis) {
        break;
      }
    }
    return this.recordEvents(events);
  }
  render() {
    const frame = createFrame(idleColor3);
    if (this.phase === "waiting") {
      this.drawWaiting(frame);
      return frame;
    }
    if (this.phase === "starting") {
      this.drawReady(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.drawWin(frame);
      return frame;
    }
    this.drawArena(frame);
    this.drawScore(frame);
    if (this.nowMillis < this.pauseUntilMillis) {
      this.drawScoreFlash(frame);
    } else {
      this.drawBallTrail(frame);
      this.drawImpact(frame);
      this.drawPaddles(frame);
      this.drawBallGlow(frame);
      paintFrameCell(frame, this.ball.x, this.ball.y, ballColor2);
    }
    return frame;
  }
  snapshot() {
    this.recordEvents(this.updatePhase(this.nowMillis));
    const readyState = this.readyGate.state(this.nowMillis);
    const countdownMillis = this.phase === "starting" ? readyState.countdownMillis : 0;
    const remainingMillis = this.phase === "finished" && this.nowMillis < this.finishAtMillis + winAnimationMillis3 ? this.finishAtMillis + winAnimationMillis3 - this.nowMillis : 0;
    return {
      currentGame: manifest14.id,
      label: manifest14.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: [
        {
          index: 0,
          label: this.labelForTeam(0),
          color: redColor,
          score: this.teamScore[0],
          lives: -1
        },
        {
          index: 1,
          label: this.labelForTeam(1),
          color: blueColor,
          score: this.teamScore[1],
          lives: -1
        }
      ],
      score: this.teamScore[0] + this.teamScore[1],
      lives: -1,
      elapsedMillis: Math.max(0, this.nowMillis - this.startedAtMillis),
      remainingMillis,
      activeTargets: this.activeHalves(this.nowMillis),
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: this.winningScore,
      roundHits: this.hitCount,
      lastRoundHits: this.lastRoundHits,
      lastRoundWinner: this.lastRoundWinner,
      rounds: this.rounds,
      ball: { ...this.ball },
      ballTrail: this.ballTrail.map((position) => ({ ...position })),
      rallyPace: this.speed.initialMillis === this.speed.minimumMillis ? 1 : clamp(
        (this.speed.initialMillis - this.currentIntervalMillis) / (this.speed.initialMillis - this.speed.minimumMillis),
        0,
        1
      ),
      pointScorer: this.scorer,
      pointFlashMillis: Math.max(0, this.pauseUntilMillis - this.nowMillis),
      winnerIndex: this.winner,
      impact: this.lastImpact && this.nowMillis - this.lastImpactAtMillis < 480 ? {
        ...this.lastImpact,
        remainingMillis: 480 - (this.nowMillis - this.lastImpactAtMillis)
      } : null,
      motionEventId: this.motionEventId,
      initialBallSpeed: this.speed.initialTilesPerSecond,
      ballSpeed: 1e3 / this.currentIntervalMillis,
      returnSpeedMultiplier: this.speed.hitMultiplier,
      difficultySpeedFactor: this.speed.difficultyFactor
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest14);
    this.rng = createSeededRng(this.config.seed);
    this.winningScore = this.readWinningScore();
    this.players = this.createPlayers();
    this.speed = speedForConfig(this.config);
    this.motionEventId = 0;
    this.resetGame(this.config.nowMillis);
    this.lastEvent = gameEvent("none", "Listo", this.config.nowMillis);
  }
  createPlayers() {
    return [
      { index: 0, label: "Rojo", color: redColor, score: 0, lives: -1 },
      { index: 1, label: "Azul", color: blueColor, score: 0, lives: -1 }
    ];
  }
  readWinningScore() {
    return readGameConfigOption(this.config.options, pingPongConfigVars.pointsToWin);
  }
  resetGame(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.teamScore = [0, 0];
    this.rounds = [];
    this.lastRoundHits = 0;
    this.lastRoundWinner = "";
    this.redPaddleX = Math.floor((FLOOR_COLS - paddleWidth2) / 2);
    this.bluePaddleX = this.redPaddleX;
    this.phase = "waiting";
    this.success = false;
    this.scorer = -1;
    this.winner = -1;
    this.pointAtMillis = 0;
    this.lastImpactAtMillis = 0;
    this.lastImpact = null;
    this.motionEventId += 1;
    this.startedAtMillis = nowMillis;
    this.finishAtMillis = 0;
    this.resetBall();
    this.lastEvent = gameEvent("none", "Esperando a rojo arriba y azul abajo", nowMillis);
  }
  updatePhase(nowMillis, readyTransition = this.readyGate.tick(nowMillis)) {
    if (this.phase === "finished") {
      if (nowMillis - this.finishAtMillis >= winAnimationMillis3) {
        this.resetGame(nowMillis);
        return [gameEvent("ready", "Nueva partida", nowMillis)];
      }
      return [];
    }
    if (readyTransition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("start", "Rojo y azul listos", nowMillis)];
    }
    if (readyTransition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a las zonas roja y azul", nowMillis)];
    }
    if (readyTransition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastStepMillis = nowMillis;
      this.serve();
      this.motionEventId += 1;
      return [gameEvent("start", "La pelota esta en juego", nowMillis)];
    }
    return [];
  }
  movePaddle(x, y) {
    const center = clamp(Math.round(x), Math.floor(paddleWidth2 / 2), FLOOR_COLS - 1 - Math.floor(paddleWidth2 / 2));
    const left = center - Math.floor(paddleWidth2 / 2);
    if (y < FLOOR_ROWS / 2) {
      this.redPaddleX = left;
    } else {
      this.bluePaddleX = left;
    }
  }
  moveBall(nowMillis) {
    let nextX = this.ball.x + this.ball.dx;
    const nextY = this.ball.y + this.ball.dy;
    if (nextX < 0) {
      nextX = 0;
      this.ball.dx = 1;
    }
    if (nextX >= FLOOR_COLS) {
      nextX = FLOOR_COLS - 1;
      this.ball.dx = -1;
    }
    if (this.ball.dy < 0 && nextY === paddleYRed && nextX >= this.redPaddleX && nextX < this.redPaddleX + paddleWidth2) {
      this.reflectFromPaddle(nextX, this.redPaddleX);
      this.commitBall({ ...this.ball, x: nextX, y: paddleYRed + 1, dy: 1 });
      this.recordImpact(0, nextX, paddleYRed);
      this.accelerate();
      return gameEvent("coin", "Rojo devuelve", nowMillis);
    }
    if (this.ball.dy > 0 && nextY === paddleYBlue && nextX >= this.bluePaddleX && nextX < this.bluePaddleX + paddleWidth2) {
      this.reflectFromPaddle(nextX, this.bluePaddleX);
      this.commitBall({ ...this.ball, x: nextX, y: paddleYBlue - 1, dy: -1 });
      this.recordImpact(1, nextX, paddleYBlue);
      this.accelerate();
      return gameEvent("coin", "Azul devuelve", nowMillis);
    }
    if (nextY < 0) {
      this.scorePoint(1, nowMillis);
      return gameEvent("score", "Punto para azul", nowMillis);
    }
    if (nextY >= FLOOR_ROWS) {
      this.scorePoint(0, nowMillis);
      return gameEvent("score", "Punto para rojo", nowMillis);
    }
    this.commitBall({ ...this.ball, x: nextX, y: nextY });
    return void 0;
  }
  scorePoint(team, nowMillis) {
    this.teamScore[team] += 1;
    this.scorer = team;
    this.pointAtMillis = nowMillis;
    this.motionEventId += 1;
    this.recordRound(team);
    if (this.teamScore[team] >= this.winningScore) {
      this.phase = "finished";
      this.success = team === 1;
      this.winner = team;
      this.finishAtMillis = nowMillis;
      return;
    }
    this.resetBall();
    this.pauseUntilMillis = nowMillis + postPointPauseMillis;
    this.lastStepMillis = this.pauseUntilMillis;
  }
  recordRound(team) {
    this.lastRoundHits = this.hitCount;
    this.lastRoundWinner = this.labelForTeam(team);
    this.rounds = [
      ...this.rounds,
      {
        index: this.rounds.length + 1,
        winnerIndex: team,
        winnerLabel: this.lastRoundWinner,
        hits: this.lastRoundHits
      }
    ];
  }
  resetBall() {
    this.ball = { ...this.ball, x: serveX, y: serveY };
    this.ballTrail = [];
    this.currentIntervalMillis = this.speed.initialMillis;
    this.hitCount = 0;
    this.pauseUntilMillis = 0;
    this.serve();
  }
  serve() {
    this.ball = {
      x: serveX,
      y: serveY,
      dy: this.rng.int(2) === 0 ? -1 : 1,
      dx: this.rng.int(2) === 0 ? -1 : 1
    };
  }
  reflectFromPaddle(x, paddleX) {
    const center = paddleX + Math.floor(paddleWidth2 / 2);
    if (x < center) {
      this.ball.dx = -1;
    } else if (x > center) {
      this.ball.dx = 1;
    } else {
      this.ball.dx = this.rng.int(2) === 0 ? -1 : 1;
    }
  }
  accelerate() {
    this.hitCount += 1;
    this.currentIntervalMillis = Math.max(
      this.speed.minimumMillis,
      this.currentIntervalMillis / this.speed.hitMultiplier
    );
  }
  commitBall(nextBall) {
    this.ballTrail = [
      { x: this.ball.x, y: this.ball.y },
      ...this.ballTrail.filter((position) => position.x !== this.ball.x || position.y !== this.ball.y)
    ].slice(0, 5);
    this.ball = nextBall;
  }
  recordImpact(team, x, y) {
    this.lastImpact = { team, x, y };
    this.lastImpactAtMillis = this.nowMillis;
    this.motionEventId += 1;
  }
  drawWaiting(frame) {
    const redReady = this.halfReady(0, this.nowMillis);
    const blueReady = this.halfReady(1, this.nowMillis);
    this.drawWaitingHalf(frame, 0, redReady);
    this.drawWaitingHalf(frame, 1, blueReady);
    if (redReady) {
      this.drawSoftBar(frame, 3, 5, 10, redRgb);
    } else {
      this.drawBreathingOutline(frame, 0, redRgb);
    }
    if (blueReady) {
      this.drawSoftBar(frame, 3, 24, 10, blueRgb);
    } else {
      this.drawBreathingOutline(frame, 1, blueRgb);
    }
  }
  drawReady(frame) {
    const countdownDuration2 = gameStartCountdownMillis(manifest14.start);
    const elapsed = Math.max(0, countdownDuration2 - this.readyGate.state(this.nowMillis).countdownMillis);
    const progress = clamp(elapsed / countdownDuration2, 0, 1);
    const radius = progress * (FLOOR_ROWS * 0.7);
    const pulse = 0.5 + Math.sin(elapsed / 86) * 0.5;
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const dist = Math.abs(x - serveX) + Math.abs(y - serveY);
        const base = y >= FLOOR_ROWS / 2 ? blueRgb : redRgb;
        const waveDistance = Math.abs(dist - radius);
        const wake = Math.max(0, 1 - waveDistance / 3.2);
        const ambient = 7 + (Math.sin(x * 0.82 + y * 0.38 - elapsed / 120) + 1) * 4;
        if (wake > 0) {
          paintFrameCell(frame, x, y, mix(base, 28 + wake * 74, wake * 24));
        } else if (dist < radius) {
          paintFrameCell(frame, x, y, tint(base, ambient + pulse * 10));
        }
      }
    }
    this.drawCenterLine(frame, 18 + pulse * 20);
    this.drawBallGlow(frame);
    paintFrameCell(frame, serveX, serveY, ballColor2);
  }
  drawScoreFlash(frame) {
    const base = this.scorer === 1 ? blueRgb : redRgb;
    const elapsed = Math.max(0, this.nowMillis - this.pointAtMillis);
    const progress = clamp(elapsed / postPointPauseMillis, 0, 1);
    const originY = this.scorer === 0 ? FLOOR_ROWS - 1 : 0;
    const radius = progress * (FLOOR_ROWS + 8);
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const dist = Math.hypot((x - serveX) * 1.35, y - originY);
        const ring = Math.max(0, 1 - Math.abs(dist - radius) / 3.4);
        const spark = Math.sin(x * 12.13 + y * 7.71 + elapsed / 38) > 0.9 ? 1 : 0;
        const fade = 1 - progress;
        if (ring > 0) {
          paintFrameCell(frame, x, y, mix(base, 28 + ring * 82, ring * 34));
        } else if (spark > 0 && fade > 0.18) {
          paintFrameCell(frame, x, y, mix(base, 22 + fade * 44, fade * 12));
        }
      }
    }
    this.drawCenterLine(frame, 12 + (1 - progress) * 24);
    this.drawPaddles(frame);
  }
  drawWin(frame) {
    const base = this.winner === 1 ? blueRgb : redRgb;
    const elapsed = Math.max(0, this.nowMillis - this.finishAtMillis);
    const sweep = elapsed / 92;
    const pulse = 0.5 + Math.sin(elapsed / 110) * 0.5;
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const directionY = this.winner === 0 ? FLOOR_ROWS - 1 - y : y;
        const ribbon = (directionY + x * 0.72 - sweep + FLOOR_ROWS * 4) % 11;
        const sparkle = Math.sin(x * 17.17 + y * 11.31 + elapsed / 55);
        if (ribbon < 3.8) {
          paintFrameCell(frame, x, y, mix(base, 38 + (3.8 - ribbon) * 15 + pulse * 12, 12 + pulse * 18));
        } else if (sparkle > 0.91) {
          paintFrameCell(frame, x, y, mix(base, 48, 32));
        }
      }
    }
    const coreLevel = 64 + pulse * 26;
    fillFrameRect(frame, serveX - 1, serveY - 1, 3, 3, tint(whiteRgb, coreLevel));
    paintFrameCell(frame, serveX, serveY, ballColor2);
  }
  drawArena(frame) {
    const flow = this.nowMillis / 185;
    for (let y = 1; y < FLOOR_ROWS - 1; y += 1) {
      const base = y < FLOOR_ROWS / 2 ? redRgb : blueRgb;
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const wave = (Math.sin(x * 0.78 + y * 0.31 - flow) + 1) * 0.5;
        const lane = (x + y) % 3 === 0 ? 4 : 0;
        paintFrameCell(frame, x, y, tint(base, 4 + wave * 7 + lane));
      }
    }
    this.drawCenterLine(frame, 18 + (Math.sin(this.nowMillis / 140) + 1) * 5);
  }
  drawCenterLine(frame, level) {
    for (let x = 0; x < FLOOR_COLS; x += 1) {
      if ((x + Math.floor(this.nowMillis / 120)) % 3 !== 0) {
        continue;
      }
      paintFrameCell(frame, x, serveY - 1, mix(whiteRgb, level, 0));
      paintFrameCell(frame, x, serveY, mix(whiteRgb, level * 0.72, 0));
    }
  }
  drawBallTrail(frame) {
    this.ballTrail.forEach((position, index) => {
      const level = Math.max(10, 46 - index * 8);
      paintFrameCell(frame, position.x, position.y, tint(whiteRgb, level));
    });
  }
  drawBallGlow(frame) {
    const glow = 20 + (Math.sin(this.nowMillis / 70) + 1) * 7;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      paintFrameCell(frame, this.ball.x + dx, this.ball.y + dy, tint(whiteRgb, glow));
    }
  }
  drawImpact(frame) {
    if (!this.lastImpact) {
      return;
    }
    const elapsed = this.nowMillis - this.lastImpactAtMillis;
    if (elapsed < 0 || elapsed >= 480) {
      return;
    }
    const progress = elapsed / 480;
    const radius = 1 + progress * 5.5;
    const base = this.lastImpact.team === 0 ? redRgb : blueRgb;
    for (let y = Math.max(0, this.lastImpact.y - 7); y <= Math.min(FLOOR_ROWS - 1, this.lastImpact.y + 7); y += 1) {
      for (let x = Math.max(0, this.lastImpact.x - 7); x <= Math.min(FLOOR_COLS - 1, this.lastImpact.x + 7); x += 1) {
        const dist = Math.hypot(x - this.lastImpact.x, y - this.lastImpact.y);
        const ring = Math.max(0, 1 - Math.abs(dist - radius) / 1.45);
        if (ring > 0) {
          paintFrameCell(frame, x, y, mix(base, 30 + ring * 52, ring * 28 * (1 - progress)));
        }
      }
    }
  }
  drawBreathingOutline(frame, team, base) {
    const phase = (this.nowMillis / 900 + team * 0.5) % 1;
    const breath = 0.5 - Math.cos(phase * Math.PI * 2) * 0.5;
    const inset = Math.round(1 + breath * 2);
    const y = team === 0 ? 3 + inset : 21 - inset;
    const level = 48 + breath * 48;
    this.drawOutline(frame, inset, y, FLOOR_COLS - inset * 2, 8, tint(base, level));
  }
  drawScore(frame) {
    for (let x = 0; x < this.teamScore[0] && x < FLOOR_COLS; x += 1) {
      paintFrameCell(frame, x, 0, redColor);
    }
    for (let x = 0; x < this.teamScore[1] && x < FLOOR_COLS; x += 1) {
      paintFrameCell(frame, x, FLOOR_ROWS - 1, blueColor);
    }
  }
  drawPaddles(frame) {
    this.drawPaddle(frame, this.redPaddleX, paddleYRed, redRgb);
    this.drawPaddle(frame, this.bluePaddleX, paddleYBlue, blueRgb);
  }
  drawWaitingHalf(frame, half, ready) {
    const startY = half === 1 ? FLOOR_ROWS / 2 : 0;
    const base = half === 1 ? blueRgb : redRgb;
    const pulse = Math.floor(this.nowMillis / 120) % 10;
    for (let y = startY; y < startY + FLOOR_ROWS / 2; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        let level = 0;
        if (ready) {
          level = 18 + (x + y + pulse) % 6 * 6;
        } else if ((x + y + pulse) % 7 === 0) {
          level = 22;
        }
        if (level > 0) {
          paintFrameCell(frame, x, y, tint(base, level));
        }
      }
    }
  }
  drawSoftBar(frame, x, y, width, base) {
    const pulse = Math.floor(this.nowMillis / 100) % 6;
    for (let offset = 0; offset < width; offset += 1) {
      const level = offset === pulse || offset === width - 1 - pulse ? 112 : 58 + offset * 4;
      paintFrameCell(frame, x + offset, y, tint(base, level));
      paintFrameCell(frame, x + offset, y + 1, mix(base, level - 8, 10));
      paintFrameCell(frame, x + offset, y + 2, tint(base, Math.max(18, level - 28)));
    }
  }
  drawPaddle(frame, x, y, base) {
    for (let offset = 0; offset < paddleWidth2; offset += 1) {
      const level = offset === Math.floor(paddleWidth2 / 2) ? 118 : 74;
      paintFrameCell(frame, x + offset, y, mix(base, level, 18));
    }
  }
  drawOutline(frame, x, y, width, height, color) {
    const safeWidth = Math.max(2, Math.round(width));
    const safeHeight = Math.max(2, Math.round(height));
    fillFrameRect(frame, x, y, safeWidth, 1, color);
    fillFrameRect(frame, x, y + safeHeight - 1, safeWidth, 1, color);
    fillFrameRect(frame, x, y, 1, safeHeight, color);
    fillFrameRect(frame, x + safeWidth - 1, y, 1, safeHeight, color);
  }
  halfReady(half, nowMillis) {
    return this.readyGate.zoneReady(half, nowMillis);
  }
  activeHalves(nowMillis) {
    return this.readyGate.state(nowMillis).readyPlayers;
  }
  labelForTeam(team) {
    return this.players[team]?.label || (team === 0 ? "Rojo" : "Azul");
  }
  recordEvents(events) {
    const latestEvent = events.at(-1);
    if (latestEvent) {
      this.lastEvent = latestEvent;
    }
    return events;
  }
};
function speedForConfig(config) {
  const baseInitialSpeed = readGameConfigOption(config.options, pingPongConfigVars.initialBallSpeed);
  const baseHitMultiplier = readGameConfigOption(config.options, pingPongConfigVars.returnSpeedMultiplier);
  const difficultyStep = readGameConfigOption(config.options, pingPongConfigVars.difficultyMultiplier);
  const difficultyFactor = difficultyStep ** difficultyIndex(config.difficulty);
  const initialTilesPerSecond = baseInitialSpeed * difficultyFactor;
  const hitMultiplier = 1 + (baseHitMultiplier - 1) * difficultyFactor;
  const maximumTilesPerSecond = initialTilesPerSecond * maximumSpeedRatio;
  return {
    difficultyFactor,
    hitMultiplier,
    initialTilesPerSecond,
    initialMillis: 1e3 / initialTilesPerSecond,
    minimumMillis: 1e3 / maximumTilesPerSecond
  };
}
function difficultyIndex(value) {
  switch (value) {
    case "medium":
      return 1;
    case "hard":
      return 2;
    case "expert":
      return 3;
    default:
      return 0;
  }
}
function tint(color, percent) {
  return rgbToHex(scaleRgb(color, percent));
}
function mix(color, colorPercent, whitePercent) {
  return rgbToHex(addRgb(scaleRgb(color, colorPercent), scaleRgb(whiteRgb, whitePercent)));
}

// games/ping-pong-v2/src/manifest.ts
var pingPongV2ConfigVars = {
  pointsToWin: {
    key: "points_to_win",
    label: "Points to win",
    playerFacing: true,
    description: "The first team to reach this score wins.",
    type: "int",
    default: 5,
    min: 1,
    max: 21,
    step: 1
  },
  initialBallSpeed: {
    key: "initial_ball_speed",
    label: "Initial ball speed (tiles/s)",
    playerFacing: false,
    description: "Starting ball speed on Easy before applying the difficulty curve.",
    type: "float",
    default: 5.75,
    min: 3,
    max: 10,
    step: 0.25
  },
  returnSpeedMultiplier: {
    key: "return_speed_multiplier",
    label: "Speed multiplier per return",
    playerFacing: false,
    description: "Rally acceleration after each successful paddle return.",
    type: "float",
    default: 1.035,
    min: 1,
    max: 1.1,
    step: 5e-3
  },
  difficultyMultiplier: {
    key: "difficulty_multiplier",
    label: "Difficulty multiplier step",
    playerFacing: false,
    description: "Per-level multiplier for starting speed and return acceleration.",
    type: "float",
    default: 1.2,
    min: 1,
    max: 1.35,
    step: 0.05
  }
};
var manifest15 = {
  id: "ping-pong-v2",
  label: "Ping Pong v2",
  description: "La versi\xF3n competitiva de Ping Pong: peloteos acelerados y partidas al mejor de cinco puntos.",
  availability: { development: true, production: true },
  catalog: {
    category: "versus",
    color: "#145cff",
    durationLabel: "A 5 puntos",
    modeLabel: "Rojo contra azul",
    audioLabel: "M\xFAsica + efectos",
    rules: ["Un equipo ocupa la mitad roja y otro la azul", "Mueve la pala pisando tu mitad", "Cada devoluci\xF3n acelera la pelota"]
  },
  players: { allowAny: true, min: 2, max: 2 },
  start: { mode: "player-ready", releaseGraceMillis: 1e3 },
  config: {
    difficulty: { default: "medium", options: ["easy", "medium", "hard", "expert"] },
    vars: Object.values(pingPongV2ConfigVars)
  },
  defaultDurationMillis: 0,
  display: { entry: "./display" },
  preview: {
    seed: 202,
    playerCount: 2,
    difficulty: "medium",
    options: { points_to_win: 5 },
    actions: [{ atMillis: 100, type: "press", x: 7, y: 3 }, { atMillis: 100, type: "press", x: 7, y: 28 }],
    captureStartMillis: 2200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["arcade", "versus", "typescript", "v2"]
};

// games/ping-pong-v2/src/game.ts
var redColor2 = "#ff1c28";
var blueColor2 = "#145cff";
var ballColor3 = "#ffffff";
var idleColor4 = "#05070a";
var redRgb2 = { r: 255, g: 28, b: 40 };
var blueRgb2 = { r: 20, g: 92, b: 255 };
var whiteRgb2 = { r: 255, g: 255, b: 255 };
var postPointPauseMillis2 = 900;
var winAnimationMillis4 = 3e3;
var paddleYRed2 = 2;
var paddleYBlue2 = 29;
var paddleWidth3 = 5;
var serveX2 = Math.floor(FLOOR_COLS / 2);
var serveY2 = Math.floor(FLOOR_ROWS / 2);
var maximumSpeedRatio2 = 2.5;
function createGame15(config) {
  return new PingPongGame2(config);
}
var PingPongGame2 = class {
  config;
  rng;
  players;
  winningScore;
  speed;
  startedAtMillis = 0;
  nowMillis = 0;
  readyGate;
  lastStepMillis = 0;
  pauseUntilMillis = 0;
  finishAtMillis = 0;
  currentIntervalMillis = 140;
  hitCount = 0;
  redPaddleX = 0;
  bluePaddleX = 0;
  ball = { x: serveX2, y: serveY2, dx: 1, dy: 1 };
  ballTrail = [];
  teamScore = [0, 0];
  rounds = [];
  lastRoundHits = 0;
  lastRoundWinner = "";
  phase = "waiting";
  success = false;
  scorer = -1;
  winner = -1;
  pointAtMillis = 0;
  lastImpactAtMillis = 0;
  lastImpact = null;
  motionEventId = 0;
  lastEvent = gameEvent("none", "Listo", 0);
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest15);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate = createPlayerReadyGate(manifest15.start, createHorizontalPlayerReadyZones(2), this.config.nowMillis);
    this.winningScore = this.readWinningScore();
    this.players = this.createPlayers();
    this.speed = speedForConfig2(this.config);
    this.resetGame(this.config.nowMillis);
  }
  init(nowMillis) {
    this.startedAtMillis = nowMillis;
    this.nowMillis = nowMillis;
    this.resetGame(nowMillis);
    this.lastEvent = gameEvent("ready", "Ping Pong espera rojo y azul", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    const readyTransition = this.readyGate.update(event);
    if (event.pressed) {
      this.movePaddle(event.x, event.y);
    }
    return this.recordEvents(this.updatePhase(event.atMillis, readyTransition));
  }
  release(event) {
    this.nowMillis = event.atMillis;
    const readyTransition = this.readyGate.update({ ...event, pressed: false });
    return this.recordEvents(this.updatePhase(event.atMillis, readyTransition));
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    const events = this.updatePhase(event.atMillis, this.readyGate.tick(event.atMillis));
    if (this.phase !== "running" || event.atMillis < this.pauseUntilMillis) {
      return this.recordEvents(events);
    }
    for (let steps = 0; steps < 8; steps += 1) {
      if (event.atMillis - this.lastStepMillis < this.currentIntervalMillis) {
        break;
      }
      this.lastStepMillis += this.currentIntervalMillis;
      const nextEvent = this.moveBall(this.lastStepMillis);
      if (nextEvent) {
        events.push(nextEvent);
      }
      if (this.phase !== "running" || this.lastStepMillis < this.pauseUntilMillis) {
        break;
      }
    }
    return this.recordEvents(events);
  }
  render() {
    const frame = createFrame(idleColor4);
    if (this.phase === "waiting") {
      this.drawWaiting(frame);
      return frame;
    }
    if (this.phase === "starting") {
      this.drawReady(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.drawWin(frame);
      return frame;
    }
    this.drawArena(frame);
    this.drawScore(frame);
    if (this.nowMillis < this.pauseUntilMillis) {
      this.drawScoreFlash(frame);
    } else {
      this.drawBallTrail(frame);
      this.drawImpact(frame);
      this.drawPaddles(frame);
      this.drawBallGlow(frame);
      paintFrameCell(frame, this.ball.x, this.ball.y, ballColor3);
    }
    return frame;
  }
  snapshot() {
    this.recordEvents(this.updatePhase(this.nowMillis));
    const readyState = this.readyGate.state(this.nowMillis);
    const countdownMillis = this.phase === "starting" ? readyState.countdownMillis : 0;
    const remainingMillis = this.phase === "finished" && this.nowMillis < this.finishAtMillis + winAnimationMillis4 ? this.finishAtMillis + winAnimationMillis4 - this.nowMillis : 0;
    return {
      currentGame: manifest15.id,
      label: manifest15.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: [
        {
          index: 0,
          label: this.labelForTeam(0),
          color: redColor2,
          score: this.teamScore[0],
          lives: -1
        },
        {
          index: 1,
          label: this.labelForTeam(1),
          color: blueColor2,
          score: this.teamScore[1],
          lives: -1
        }
      ],
      score: this.teamScore[0] + this.teamScore[1],
      lives: -1,
      elapsedMillis: Math.max(0, this.nowMillis - this.startedAtMillis),
      remainingMillis,
      activeTargets: this.activeHalves(this.nowMillis),
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: this.winningScore,
      roundHits: this.hitCount,
      lastRoundHits: this.lastRoundHits,
      lastRoundWinner: this.lastRoundWinner,
      rounds: this.rounds,
      ball: { ...this.ball },
      ballTrail: this.ballTrail.map((position) => ({ ...position })),
      rallyPace: this.speed.initialMillis === this.speed.minimumMillis ? 1 : clamp(
        (this.speed.initialMillis - this.currentIntervalMillis) / (this.speed.initialMillis - this.speed.minimumMillis),
        0,
        1
      ),
      pointScorer: this.scorer,
      pointFlashMillis: Math.max(0, this.pauseUntilMillis - this.nowMillis),
      winnerIndex: this.winner,
      impact: this.lastImpact && this.nowMillis - this.lastImpactAtMillis < 480 ? {
        ...this.lastImpact,
        remainingMillis: 480 - (this.nowMillis - this.lastImpactAtMillis)
      } : null,
      motionEventId: this.motionEventId,
      initialBallSpeed: this.speed.initialTilesPerSecond,
      ballSpeed: 1e3 / this.currentIntervalMillis,
      returnSpeedMultiplier: this.speed.hitMultiplier,
      difficultySpeedFactor: this.speed.difficultyFactor
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest15);
    this.rng = createSeededRng(this.config.seed);
    this.winningScore = this.readWinningScore();
    this.players = this.createPlayers();
    this.speed = speedForConfig2(this.config);
    this.motionEventId = 0;
    this.resetGame(this.config.nowMillis);
    this.lastEvent = gameEvent("none", "Listo", this.config.nowMillis);
  }
  createPlayers() {
    return [
      { index: 0, label: "Rojo", color: redColor2, score: 0, lives: -1 },
      { index: 1, label: "Azul", color: blueColor2, score: 0, lives: -1 }
    ];
  }
  readWinningScore() {
    return readGameConfigOption(this.config.options, pingPongV2ConfigVars.pointsToWin);
  }
  resetGame(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.teamScore = [0, 0];
    this.rounds = [];
    this.lastRoundHits = 0;
    this.lastRoundWinner = "";
    this.redPaddleX = Math.floor((FLOOR_COLS - paddleWidth3) / 2);
    this.bluePaddleX = this.redPaddleX;
    this.phase = "waiting";
    this.success = false;
    this.scorer = -1;
    this.winner = -1;
    this.pointAtMillis = 0;
    this.lastImpactAtMillis = 0;
    this.lastImpact = null;
    this.motionEventId += 1;
    this.startedAtMillis = nowMillis;
    this.finishAtMillis = 0;
    this.resetBall();
    this.lastEvent = gameEvent("none", "Esperando a rojo arriba y azul abajo", nowMillis);
  }
  updatePhase(nowMillis, readyTransition = this.readyGate.tick(nowMillis)) {
    if (this.phase === "finished") {
      if (nowMillis - this.finishAtMillis >= winAnimationMillis4) {
        this.resetGame(nowMillis);
        return [gameEvent("ready", "Nueva partida", nowMillis)];
      }
      return [];
    }
    if (readyTransition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("start", "Rojo y azul listos", nowMillis)];
    }
    if (readyTransition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a las zonas roja y azul", nowMillis)];
    }
    if (readyTransition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastStepMillis = nowMillis;
      this.serve();
      this.motionEventId += 1;
      return [gameEvent("start", "La pelota esta en juego", nowMillis)];
    }
    return [];
  }
  movePaddle(x, y) {
    const center = clamp(Math.round(x), Math.floor(paddleWidth3 / 2), FLOOR_COLS - 1 - Math.floor(paddleWidth3 / 2));
    const left = center - Math.floor(paddleWidth3 / 2);
    if (y < FLOOR_ROWS / 2) {
      this.redPaddleX = left;
    } else {
      this.bluePaddleX = left;
    }
  }
  moveBall(nowMillis) {
    let nextX = this.ball.x + this.ball.dx;
    const nextY = this.ball.y + this.ball.dy;
    if (nextX < 0) {
      nextX = 0;
      this.ball.dx = 1;
    }
    if (nextX >= FLOOR_COLS) {
      nextX = FLOOR_COLS - 1;
      this.ball.dx = -1;
    }
    if (this.ball.dy < 0 && nextY === paddleYRed2 && nextX >= this.redPaddleX && nextX < this.redPaddleX + paddleWidth3) {
      this.reflectFromPaddle(nextX, this.redPaddleX);
      this.commitBall({ ...this.ball, x: nextX, y: paddleYRed2 + 1, dy: 1 });
      this.recordImpact(0, nextX, paddleYRed2);
      this.accelerate();
      return gameEvent("coin", "Rojo devuelve", nowMillis);
    }
    if (this.ball.dy > 0 && nextY === paddleYBlue2 && nextX >= this.bluePaddleX && nextX < this.bluePaddleX + paddleWidth3) {
      this.reflectFromPaddle(nextX, this.bluePaddleX);
      this.commitBall({ ...this.ball, x: nextX, y: paddleYBlue2 - 1, dy: -1 });
      this.recordImpact(1, nextX, paddleYBlue2);
      this.accelerate();
      return gameEvent("coin", "Azul devuelve", nowMillis);
    }
    if (nextY < 0) {
      this.scorePoint(1, nowMillis);
      return gameEvent("score", "Punto para azul", nowMillis);
    }
    if (nextY >= FLOOR_ROWS) {
      this.scorePoint(0, nowMillis);
      return gameEvent("score", "Punto para rojo", nowMillis);
    }
    this.commitBall({ ...this.ball, x: nextX, y: nextY });
    return void 0;
  }
  scorePoint(team, nowMillis) {
    this.teamScore[team] += 1;
    this.scorer = team;
    this.pointAtMillis = nowMillis;
    this.motionEventId += 1;
    this.recordRound(team);
    if (this.teamScore[team] >= this.winningScore) {
      this.phase = "finished";
      this.success = team === 1;
      this.winner = team;
      this.finishAtMillis = nowMillis;
      return;
    }
    this.resetBall();
    this.pauseUntilMillis = nowMillis + postPointPauseMillis2;
    this.lastStepMillis = this.pauseUntilMillis;
  }
  recordRound(team) {
    this.lastRoundHits = this.hitCount;
    this.lastRoundWinner = this.labelForTeam(team);
    this.rounds = [
      ...this.rounds,
      {
        index: this.rounds.length + 1,
        winnerIndex: team,
        winnerLabel: this.lastRoundWinner,
        hits: this.lastRoundHits
      }
    ];
  }
  resetBall() {
    this.ball = { ...this.ball, x: serveX2, y: serveY2 };
    this.ballTrail = [];
    this.currentIntervalMillis = this.speed.initialMillis;
    this.hitCount = 0;
    this.pauseUntilMillis = 0;
    this.serve();
  }
  serve() {
    this.ball = {
      x: serveX2,
      y: serveY2,
      dy: this.rng.int(2) === 0 ? -1 : 1,
      dx: this.rng.int(2) === 0 ? -1 : 1
    };
  }
  reflectFromPaddle(x, paddleX) {
    const center = paddleX + Math.floor(paddleWidth3 / 2);
    if (x < center) {
      this.ball.dx = -1;
    } else if (x > center) {
      this.ball.dx = 1;
    } else {
      this.ball.dx = this.rng.int(2) === 0 ? -1 : 1;
    }
  }
  accelerate() {
    this.hitCount += 1;
    this.currentIntervalMillis = Math.max(
      this.speed.minimumMillis,
      this.currentIntervalMillis / this.speed.hitMultiplier
    );
  }
  commitBall(nextBall) {
    this.ballTrail = [
      { x: this.ball.x, y: this.ball.y },
      ...this.ballTrail.filter((position) => position.x !== this.ball.x || position.y !== this.ball.y)
    ].slice(0, 5);
    this.ball = nextBall;
  }
  recordImpact(team, x, y) {
    this.lastImpact = { team, x, y };
    this.lastImpactAtMillis = this.nowMillis;
    this.motionEventId += 1;
  }
  drawWaiting(frame) {
    const redReady = this.halfReady(0, this.nowMillis);
    const blueReady = this.halfReady(1, this.nowMillis);
    this.drawWaitingHalf(frame, 0, redReady);
    this.drawWaitingHalf(frame, 1, blueReady);
    if (redReady) {
      this.drawSoftBar(frame, 3, 5, 10, redRgb2);
    } else {
      this.drawBreathingOutline(frame, 0, redRgb2);
    }
    if (blueReady) {
      this.drawSoftBar(frame, 3, 24, 10, blueRgb2);
    } else {
      this.drawBreathingOutline(frame, 1, blueRgb2);
    }
  }
  drawReady(frame) {
    const countdownDuration2 = gameStartCountdownMillis(manifest15.start);
    const elapsed = Math.max(0, countdownDuration2 - this.readyGate.state(this.nowMillis).countdownMillis);
    const progress = clamp(elapsed / countdownDuration2, 0, 1);
    const radius = progress * (FLOOR_ROWS * 0.7);
    const pulse = 0.5 + Math.sin(elapsed / 86) * 0.5;
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const dist = Math.abs(x - serveX2) + Math.abs(y - serveY2);
        const base = y >= FLOOR_ROWS / 2 ? blueRgb2 : redRgb2;
        const waveDistance = Math.abs(dist - radius);
        const wake = Math.max(0, 1 - waveDistance / 3.2);
        const ambient = 7 + (Math.sin(x * 0.82 + y * 0.38 - elapsed / 120) + 1) * 4;
        if (wake > 0) {
          paintFrameCell(frame, x, y, mix2(base, 28 + wake * 74, wake * 24));
        } else if (dist < radius) {
          paintFrameCell(frame, x, y, tint2(base, ambient + pulse * 10));
        }
      }
    }
    this.drawCenterLine(frame, 18 + pulse * 20);
    this.drawBallGlow(frame);
    paintFrameCell(frame, serveX2, serveY2, ballColor3);
  }
  drawScoreFlash(frame) {
    const base = this.scorer === 1 ? blueRgb2 : redRgb2;
    const elapsed = Math.max(0, this.nowMillis - this.pointAtMillis);
    const progress = clamp(elapsed / postPointPauseMillis2, 0, 1);
    const originY = this.scorer === 0 ? FLOOR_ROWS - 1 : 0;
    const radius = progress * (FLOOR_ROWS + 8);
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const dist = Math.hypot((x - serveX2) * 1.35, y - originY);
        const ring = Math.max(0, 1 - Math.abs(dist - radius) / 3.4);
        const spark = Math.sin(x * 12.13 + y * 7.71 + elapsed / 38) > 0.9 ? 1 : 0;
        const fade = 1 - progress;
        if (ring > 0) {
          paintFrameCell(frame, x, y, mix2(base, 28 + ring * 82, ring * 34));
        } else if (spark > 0 && fade > 0.18) {
          paintFrameCell(frame, x, y, mix2(base, 22 + fade * 44, fade * 12));
        }
      }
    }
    this.drawCenterLine(frame, 12 + (1 - progress) * 24);
    this.drawPaddles(frame);
  }
  drawWin(frame) {
    const base = this.winner === 1 ? blueRgb2 : redRgb2;
    const elapsed = Math.max(0, this.nowMillis - this.finishAtMillis);
    const sweep = elapsed / 92;
    const pulse = 0.5 + Math.sin(elapsed / 110) * 0.5;
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const directionY = this.winner === 0 ? FLOOR_ROWS - 1 - y : y;
        const ribbon = (directionY + x * 0.72 - sweep + FLOOR_ROWS * 4) % 11;
        const sparkle = Math.sin(x * 17.17 + y * 11.31 + elapsed / 55);
        if (ribbon < 3.8) {
          paintFrameCell(frame, x, y, mix2(base, 38 + (3.8 - ribbon) * 15 + pulse * 12, 12 + pulse * 18));
        } else if (sparkle > 0.91) {
          paintFrameCell(frame, x, y, mix2(base, 48, 32));
        }
      }
    }
    const coreLevel = 64 + pulse * 26;
    fillFrameRect(frame, serveX2 - 1, serveY2 - 1, 3, 3, tint2(whiteRgb2, coreLevel));
    paintFrameCell(frame, serveX2, serveY2, ballColor3);
  }
  drawArena(frame) {
    const flow = this.nowMillis / 185;
    for (let y = 1; y < FLOOR_ROWS - 1; y += 1) {
      const base = y < FLOOR_ROWS / 2 ? redRgb2 : blueRgb2;
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        const wave = (Math.sin(x * 0.78 + y * 0.31 - flow) + 1) * 0.5;
        const lane = (x + y) % 3 === 0 ? 4 : 0;
        paintFrameCell(frame, x, y, tint2(base, 4 + wave * 7 + lane));
      }
    }
    this.drawCenterLine(frame, 18 + (Math.sin(this.nowMillis / 140) + 1) * 5);
  }
  drawCenterLine(frame, level) {
    for (let x = 0; x < FLOOR_COLS; x += 1) {
      if ((x + Math.floor(this.nowMillis / 120)) % 3 !== 0) {
        continue;
      }
      paintFrameCell(frame, x, serveY2 - 1, mix2(whiteRgb2, level, 0));
      paintFrameCell(frame, x, serveY2, mix2(whiteRgb2, level * 0.72, 0));
    }
  }
  drawBallTrail(frame) {
    this.ballTrail.forEach((position, index) => {
      const level = Math.max(10, 46 - index * 8);
      paintFrameCell(frame, position.x, position.y, tint2(whiteRgb2, level));
    });
  }
  drawBallGlow(frame) {
    const glow = 20 + (Math.sin(this.nowMillis / 70) + 1) * 7;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      paintFrameCell(frame, this.ball.x + dx, this.ball.y + dy, tint2(whiteRgb2, glow));
    }
  }
  drawImpact(frame) {
    if (!this.lastImpact) {
      return;
    }
    const elapsed = this.nowMillis - this.lastImpactAtMillis;
    if (elapsed < 0 || elapsed >= 480) {
      return;
    }
    const progress = elapsed / 480;
    const radius = 1 + progress * 5.5;
    const base = this.lastImpact.team === 0 ? redRgb2 : blueRgb2;
    for (let y = Math.max(0, this.lastImpact.y - 7); y <= Math.min(FLOOR_ROWS - 1, this.lastImpact.y + 7); y += 1) {
      for (let x = Math.max(0, this.lastImpact.x - 7); x <= Math.min(FLOOR_COLS - 1, this.lastImpact.x + 7); x += 1) {
        const dist = Math.hypot(x - this.lastImpact.x, y - this.lastImpact.y);
        const ring = Math.max(0, 1 - Math.abs(dist - radius) / 1.45);
        if (ring > 0) {
          paintFrameCell(frame, x, y, mix2(base, 30 + ring * 52, ring * 28 * (1 - progress)));
        }
      }
    }
  }
  drawBreathingOutline(frame, team, base) {
    const phase = (this.nowMillis / 900 + team * 0.5) % 1;
    const breath = 0.5 - Math.cos(phase * Math.PI * 2) * 0.5;
    const inset = Math.round(1 + breath * 2);
    const y = team === 0 ? 3 + inset : 21 - inset;
    const level = 48 + breath * 48;
    this.drawOutline(frame, inset, y, FLOOR_COLS - inset * 2, 8, tint2(base, level));
  }
  drawScore(frame) {
    for (let x = 0; x < this.teamScore[0] && x < FLOOR_COLS; x += 1) {
      paintFrameCell(frame, x, 0, redColor2);
    }
    for (let x = 0; x < this.teamScore[1] && x < FLOOR_COLS; x += 1) {
      paintFrameCell(frame, x, FLOOR_ROWS - 1, blueColor2);
    }
  }
  drawPaddles(frame) {
    this.drawPaddle(frame, this.redPaddleX, paddleYRed2, redRgb2);
    this.drawPaddle(frame, this.bluePaddleX, paddleYBlue2, blueRgb2);
  }
  drawWaitingHalf(frame, half, ready) {
    const startY = half === 1 ? FLOOR_ROWS / 2 : 0;
    const base = half === 1 ? blueRgb2 : redRgb2;
    const pulse = Math.floor(this.nowMillis / 120) % 10;
    for (let y = startY; y < startY + FLOOR_ROWS / 2; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        let level = 0;
        if (ready) {
          level = 18 + (x + y + pulse) % 6 * 6;
        } else if ((x + y + pulse) % 7 === 0) {
          level = 22;
        }
        if (level > 0) {
          paintFrameCell(frame, x, y, tint2(base, level));
        }
      }
    }
  }
  drawSoftBar(frame, x, y, width, base) {
    const pulse = Math.floor(this.nowMillis / 100) % 6;
    for (let offset = 0; offset < width; offset += 1) {
      const level = offset === pulse || offset === width - 1 - pulse ? 112 : 58 + offset * 4;
      paintFrameCell(frame, x + offset, y, tint2(base, level));
      paintFrameCell(frame, x + offset, y + 1, mix2(base, level - 8, 10));
      paintFrameCell(frame, x + offset, y + 2, tint2(base, Math.max(18, level - 28)));
    }
  }
  drawPaddle(frame, x, y, base) {
    for (let offset = 0; offset < paddleWidth3; offset += 1) {
      const level = offset === Math.floor(paddleWidth3 / 2) ? 118 : 74;
      paintFrameCell(frame, x + offset, y, mix2(base, level, 18));
    }
  }
  drawOutline(frame, x, y, width, height, color) {
    const safeWidth = Math.max(2, Math.round(width));
    const safeHeight = Math.max(2, Math.round(height));
    fillFrameRect(frame, x, y, safeWidth, 1, color);
    fillFrameRect(frame, x, y + safeHeight - 1, safeWidth, 1, color);
    fillFrameRect(frame, x, y, 1, safeHeight, color);
    fillFrameRect(frame, x + safeWidth - 1, y, 1, safeHeight, color);
  }
  halfReady(half, nowMillis) {
    return this.readyGate.zoneReady(half, nowMillis);
  }
  activeHalves(nowMillis) {
    return this.readyGate.state(nowMillis).readyPlayers;
  }
  labelForTeam(team) {
    return this.players[team]?.label || (team === 0 ? "Rojo" : "Azul");
  }
  recordEvents(events) {
    const latestEvent = events.at(-1);
    if (latestEvent) {
      this.lastEvent = latestEvent;
    }
    return events;
  }
};
function speedForConfig2(config) {
  const baseInitialSpeed = readGameConfigOption(config.options, pingPongV2ConfigVars.initialBallSpeed);
  const baseHitMultiplier = readGameConfigOption(config.options, pingPongV2ConfigVars.returnSpeedMultiplier);
  const difficultyStep = readGameConfigOption(config.options, pingPongV2ConfigVars.difficultyMultiplier);
  const difficultyFactor = difficultyStep ** difficultyIndex2(config.difficulty);
  const initialTilesPerSecond = baseInitialSpeed * difficultyFactor;
  const hitMultiplier = 1 + (baseHitMultiplier - 1) * difficultyFactor;
  const maximumTilesPerSecond = initialTilesPerSecond * maximumSpeedRatio2;
  return {
    difficultyFactor,
    hitMultiplier,
    initialTilesPerSecond,
    initialMillis: 1e3 / initialTilesPerSecond,
    minimumMillis: 1e3 / maximumTilesPerSecond
  };
}
function difficultyIndex2(value) {
  switch (value) {
    case "medium":
      return 1;
    case "hard":
      return 2;
    case "expert":
      return 3;
    default:
      return 0;
  }
}
function tint2(color, percent) {
  return rgbToHex(scaleRgb(color, percent));
}
function mix2(color, colorPercent, whitePercent) {
  return rgbToHex(addRgb(scaleRgb(color, colorPercent), scaleRgb(whiteRgb2, whitePercent)));
}

// games/pulso/src/manifest.ts
var manifest16 = {
  id: "pulso",
  label: "Pulso",
  description: "Ritmo cooperativo: pisa cada pulso a tiempo y mant\xE9n la energ\xEDa de la pista.",
  availability: { development: true, production: true },
  catalog: {
    category: "arcade",
    color: "#ff3bd7",
    durationLabel: "35s",
    modeLabel: "Ritmo cooperativo",
    audioLabel: "M\xFAsica y efectos",
    rules: [
      "Pisa la zona cuando el pulso llegue al centro",
      "Completa los acordes entre varios jugadores",
      "Mant\xE9n las notas largas hasta que terminen",
      "No dejes que la energ\xEDa llegue a cero"
    ]
  },
  players: {
    allowAny: true,
    min: 1,
    max: 8
  },
  start: { mode: "player-ready", countdownMillis: 2e3, releaseGraceMillis: 1200 },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    }
  },
  defaultDurationMillis: 35e3,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 0,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 8, y: 16 },
      { atMillis: 2150, type: "release", x: 8, y: 16 }
    ],
    captureStartMillis: 2600,
    frameCount: 24,
    frameIntervalMillis: 90
  },
  tags: ["ritmo", "cooperativo", "multijugador", "typescript"]
};

// games/pulso/src/game.ts
var gameWinAnimationMillis4 = 5e3;
var gameFailAnimationMillis = 5e3;
var startingEnergy = 64;
var backgroundColor6 = "#03020a";
var gridColor = "#09081a";
var readyColor = "#145cff";
var readyPulseColor2 = "#35d7ff";
var successColors4 = ["#35d7ff", "#ff3bd7", "#ffe176", "#5fff9e", "#ffffff"];
var failColors2 = ["#ff3151", "#8d1235", "#280512"];
var readyZone3 = { minX: 5, maxX: 10, minY: 13, maxY: 18 };
var pulsePads = [
  { color: "#35d7ff", label: "Azul", minX: 1, maxX: 6, minY: 4, maxY: 11, x: 3, y: 7 },
  { color: "#ff3bd7", label: "Rosa", minX: 9, maxX: 14, minY: 4, maxY: 11, x: 12, y: 7 },
  { color: "#ffe176", label: "Amarillo", minX: 1, maxX: 6, minY: 20, maxY: 27, x: 3, y: 23 },
  { color: "#5fff9e", label: "Verde", minX: 9, maxX: 14, minY: 20, maxY: 27, x: 12, y: 23 }
];
var profiles = {
  easy: { energyGain: 8, energyLoss: 9, spacingMillis: 1350, timingWindowMillis: 600 },
  medium: { energyGain: 7, energyLoss: 11, spacingMillis: 1150, timingWindowMillis: 460 },
  hard: { energyGain: 6, energyLoss: 13, spacingMillis: 980, timingWindowMillis: 350 },
  expert: { energyGain: 5, energyLoss: 15, spacingMillis: 820, timingWindowMillis: 270 }
};
var notePattern = [
  { zones: [0] },
  { zones: [1] },
  { zones: [2] },
  { zones: [3] },
  { zones: [0, 3] },
  { zones: [1] },
  { zones: [2], holdBeats: 0.75 },
  { zones: [0] },
  { zones: [1, 2] },
  { zones: [3] },
  { zones: [0] },
  { zones: [1], holdBeats: 0.8 },
  { zones: [2, 3] },
  { zones: [0] },
  { zones: [3] },
  { zones: [0, 1] },
  { zones: [2] },
  { zones: [3], holdBeats: 0.75 },
  { zones: [0, 2] },
  { zones: [1, 3] }
];
function pulseChart(difficulty = "medium") {
  const profile = profiles[difficulty] ?? profiles.medium;
  return notePattern.map((entry, index) => ({
    atMillis: 1200 + index * profile.spacingMillis,
    holdMillis: Math.round((entry.holdBeats ?? 0) * profile.spacingMillis),
    zones: [...entry.zones]
  }));
}
function createGame16(config) {
  return new PulseGame(config);
}
var PulseGame = class {
  chart = [];
  combo = 0;
  config;
  energy = startingEnergy;
  finishedAtMillis = 0;
  hitZones = /* @__PURE__ */ new Set();
  heldZones = /* @__PURE__ */ new Set();
  lastEvent = gameEvent("none", "La pista est\xE1 lista", 0);
  maxCombo = 0;
  nowMillis = 0;
  noteIndex = 0;
  phase = "ready";
  players = [];
  readyGate;
  resolvedNotes = 0;
  startedAtMillis = 0;
  successfulNotes = 0;
  success = false;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest16);
    this.readyGate = createPlayerReadyGate(manifest16.start, [readyZone3], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Entra en el centro para iniciar", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) {
      return [];
    }
    const zone = this.zoneAt(event.x, event.y);
    if (zone === -1) {
      return [];
    }
    this.heldZones.add(zone);
    const note = this.chart[this.noteIndex];
    if (!note || !note.zones.includes(zone)) {
      return [];
    }
    const delta = Math.abs(this.elapsedMillis() - note.atMillis);
    if (delta > this.profile().timingWindowMillis) {
      return [];
    }
    this.hitZones.add(zone);
    if (note.holdMillis > 0) {
      this.lastEvent = gameEvent("hold", `Mant\xE9n ${pulsePads[zone].label.toLowerCase()}`, event.atMillis);
      return [this.lastEvent];
    }
    if (note.zones.every((requiredZone) => this.hitZones.has(requiredZone))) {
      return this.completeNote(event.atMillis);
    }
    this.lastEvent = gameEvent("hit", "Completa el acorde", event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    const zone = this.zoneAt(event.x, event.y);
    if (zone >= 0) {
      this.heldZones.delete(zone);
    }
    if (this.phase !== "running") {
      return [];
    }
    const note = this.chart[this.noteIndex];
    if (note?.holdMillis && note.zones.includes(zone) && this.hitZones.has(zone)) {
      return this.missNote(event.atMillis, "Nota larga soltada demasiado pronto");
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase === "finished") {
      const resultMillis = this.success ? gameWinAnimationMillis4 : gameFailAnimationMillis;
      if (event.atMillis - this.finishedAtMillis >= resultMillis) {
        this.resetState(event.atMillis);
        this.phase = "waiting";
        this.lastEvent = gameEvent("ready", "Entra en el centro para iniciar", event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase !== "running") {
      return [];
    }
    if (this.elapsedMillis() >= this.config.durationMillis) {
      return this.finish(false, event.atMillis, "La energ\xEDa no lleg\xF3 al final");
    }
    const note = this.chart[this.noteIndex];
    if (!note) {
      return this.finish(this.energy > 0, event.atMillis, "Pista completada");
    }
    if (note.holdMillis > 0 && note.zones.every((zone) => this.hitZones.has(zone) && this.heldZones.has(zone))) {
      if (this.elapsedMillis() >= note.atMillis + note.holdMillis) {
        return this.completeNote(event.atMillis);
      }
    }
    if (this.elapsedMillis() > note.atMillis + this.profile().timingWindowMillis) {
      return this.missNote(event.atMillis, "Pulso perdido");
    }
    return [];
  }
  render() {
    const frame = createFrame(backgroundColor6);
    for (let y = 0; y < FLOOR_ROWS; y += 4) {
      fillFrameRect(frame, 0, y, FLOOR_COLS - 1, y, gridColor);
    }
    for (let x = 0; x < FLOOR_COLS; x += 4) {
      fillFrameRect(frame, x, 0, x, FLOOR_ROWS - 1, gridColor);
    }
    if (this.phase === "waiting" || this.phase === "starting") {
      fillFrameRect(frame, readyZone3.minX, readyZone3.minY, readyZone3.maxX, readyZone3.maxY, readyColor);
      const radius = 1 + Math.floor(this.nowMillis / 160) % 7;
      paintDiamondRing(frame, {
        centerX: 8,
        centerY: 16,
        color: this.phase === "starting" ? "#ffe176" : readyPulseColor2,
        radius
      });
      return frame;
    }
    if (this.phase === "finished") {
      this.paintResult(frame);
      return frame;
    }
    for (const pad of pulsePads) {
      fillFrameRect(frame, pad.minX, pad.minY, pad.maxX, pad.maxY, "#101025");
      paintFrameCell(frame, pad.x, pad.y, pad.color);
    }
    const note = this.chart[this.noteIndex];
    if (note) {
      const untilBeat = note.atMillis - this.elapsedMillis();
      const visibleMillis = this.profile().spacingMillis;
      const progress = Math.max(0, Math.min(1, 1 - untilBeat / visibleMillis));
      const radius = Math.max(1, Math.round(7 * (1 - progress)));
      for (const zone of note.zones) {
        const pad = pulsePads[zone];
        fillFrameRect(frame, pad.minX, pad.minY, pad.maxX, pad.maxY, this.hitZones.has(zone) ? "#ffffff" : "#18183a");
        paintDiamondRing(frame, { centerX: pad.x, centerY: pad.y, color: pad.color, radius });
        paintFrameCell(frame, pad.x, pad.y, pad.color);
      }
    }
    const progressCells = Math.round(this.noteIndex / this.chart.length * FLOOR_COLS);
    for (let x = 0; x < progressCells; x += 1) {
      paintFrameCell(frame, x, FLOOR_ROWS - 1, successColors4[x % successColors4.length]);
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    const note = this.chart[this.noteIndex];
    const noteProgress = note ? Math.max(0, Math.min(1, 1 - (note.atMillis - this.elapsedMillis()) / this.profile().spacingMillis)) : 1;
    return {
      currentGame: manifest16.id,
      label: manifest16.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.successfulNotes,
      lives: -1,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" && note ? note.zones.length : 0,
      success: this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: this.chart.length,
      accuracy: this.resolvedNotes === 0 ? 100 : Math.round(this.successfulNotes / this.resolvedNotes * 100),
      celebrating: this.phase === "finished",
      combo: this.combo,
      energy: this.energy,
      hitZones: [...this.hitZones],
      maxCombo: this.maxCombo,
      noteCount: this.chart.length,
      noteIndex: this.noteIndex,
      noteKind: note?.holdMillis ? "hold" : (note?.zones.length ?? 0) > 1 ? "chord" : "tap",
      noteProgress,
      noteZones: note ? [...note.zones] : [],
      section: Math.min(4, Math.floor(this.noteIndex / this.chart.length * 4) + 1),
      timingWindowMillis: this.profile().timingWindowMillis
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest16);
    this.readyGate = createPlayerReadyGate(manifest16.start, [readyZone3], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
    this.phase = "waiting";
    this.lastEvent = gameEvent("ready", "Entra en el centro para iniciar", this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Ritmo preparado", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve al centro", nowMillis);
      return [this.lastEvent];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.heldZones.clear();
      this.lastEvent = gameEvent("start", "Sigue el primer pulso", nowMillis);
      return [this.lastEvent];
    }
    return [];
  }
  completeNote(atMillis) {
    const note = this.chart[this.noteIndex];
    if (!note) {
      return [];
    }
    this.successfulNotes += 1;
    this.resolvedNotes += 1;
    this.combo += 1;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.energy = Math.min(100, this.energy + this.profile().energyGain + Math.max(0, note.zones.length - 1) * 2);
    this.noteIndex += 1;
    this.hitZones.clear();
    this.players = this.scoredPlayers();
    this.lastEvent = gameEvent("hit", this.combo >= 4 ? `\xA1Combo x${this.combo}!` : "Pulso perfecto", atMillis);
    if (this.noteIndex >= this.chart.length) {
      return this.finish(true, atMillis, "Pista completada");
    }
    return [this.lastEvent];
  }
  missNote(atMillis, message) {
    this.resolvedNotes += 1;
    this.combo = 0;
    this.energy = Math.max(0, this.energy - this.profile().energyLoss);
    this.noteIndex += 1;
    this.hitZones.clear();
    this.players = this.scoredPlayers();
    this.lastEvent = gameEvent("miss", message, atMillis);
    if (this.energy === 0) {
      return this.finish(false, atMillis, "La pista se qued\xF3 sin energ\xEDa");
    }
    if (this.noteIndex >= this.chart.length) {
      return this.finish(true, atMillis, "Pista completada");
    }
    return [this.lastEvent];
  }
  finish(success, atMillis, message) {
    this.phase = "finished";
    this.success = success;
    this.finishedAtMillis = atMillis;
    this.hitZones.clear();
    this.heldZones.clear();
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  paintResult(frame) {
    const elapsed = Math.max(0, this.nowMillis - this.finishedAtMillis);
    if (this.success) {
      paintDiamondWave(frame, {
        centerX: 8,
        centerY: 16,
        color: ({ distance, step }) => successColors4[(distance + step) % successColors4.length],
        period: 8,
        bandWidth: 5,
        step: Math.floor(elapsed / 90)
      });
      return;
    }
    const color = failColors2[Math.floor(elapsed / 180) % failColors2.length];
    fillFrameRect(frame, 0, 0, FLOOR_COLS - 1, FLOOR_ROWS - 1, color);
    const radius = 2 + Math.floor(elapsed / 120) % 12;
    paintDiamondRing(frame, { centerX: 8, centerY: 16, color: "#ff3151", radius });
  }
  zoneAt(x, y) {
    return pulsePads.findIndex((pad) => x >= pad.minX && x <= pad.maxX && y >= pad.minY && y <= pad.maxY);
  }
  profile() {
    return profiles[this.config.difficulty] ?? profiles.medium;
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting" || this.phase === "ready") {
      return 0;
    }
    return Math.max(0, this.nowMillis - this.startedAtMillis);
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({
      ...player,
      label: player.label || `Jugador ${player.index + 1}`,
      score: this.successfulNotes,
      lives: -1
    }));
  }
  resetState(nowMillis) {
    this.chart = pulseChart(this.config.difficulty);
    this.combo = 0;
    this.energy = startingEnergy;
    this.finishedAtMillis = 0;
    this.hitZones.clear();
    this.heldZones.clear();
    this.maxCombo = 0;
    this.noteIndex = 0;
    this.nowMillis = nowMillis;
    this.phase = "ready";
    this.readyGate.reset(nowMillis);
    this.resolvedNotes = 0;
    this.startedAtMillis = nowMillis;
    this.success = false;
    this.successfulNotes = 0;
    this.players = this.scoredPlayers();
  }
};

// games/saltos/src/manifest.ts
var manifest17 = {
  id: "saltos",
  label: "Saltos",
  description: "Salta entre plataformas seguras sin tocar la lava durante un minuto.",
  availability: { development: true, production: true },
  catalog: {
    category: "individual",
    color: "#ff9f45",
    durationLabel: "60s",
    modeLabel: "Saltos",
    audioLabel: "M\xFAsica + efectos",
    rules: ["Espera en la plataforma azul", "Salta a la plataforma verde", "No pises la lava"]
  },
  players: { allowAny: true, min: 1, max: 1 },
  start: { mode: "player-ready" },
  defaultDurationMillis: 6e4,
  config: { difficulty: { options: ["easy", "medium", "hard"], default: "medium" } },
  display: { entry: "./display" },
  preview: {
    seed: 137,
    playerCount: 0,
    actions: [{ atMillis: 100, type: "press", x: 8, y: 4 }],
    captureStartMillis: 2300,
    frameCount: 24,
    frameIntervalMillis: 120
  },
  tags: ["saltos", "lava", "typescript"]
};

// games/saltos/src/game.ts
var saltosCelebrationMillis = 5e3;
var saltosStartingLives = 1;
var startPlatform = { x: 7, y: 3 };
var platformSize = 3;
function createGame17(config) {
  return new SaltosGame(config);
}
var SaltosGame = class {
  config;
  current = startPlatform;
  finishedAtMillis;
  lastEvent = gameEvent("none", "Listo", 0);
  lives = saltosStartingLives;
  nowMillis = 0;
  phase = "ready";
  players;
  readyGate;
  rng;
  score = 0;
  startedAtMillis = 0;
  target = startPlatform;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest17);
    this.readyGate = createPlayerReadyGate(manifest17.start, [{ minX: 5, maxX: 10, minY: 0, maxY: 7 }], this.config.nowMillis);
    this.rng = createSeededRng(this.config.seed);
    this.players = this.scoredPlayers();
    this.target = this.nextTarget(this.current);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) return [];
    if (insidePlatform(event, this.current)) return [];
    if (!insidePlatform(event, this.target)) {
      this.lives = 0;
      return this.finish(false, "Has pisado lava", event.atMillis);
    }
    this.current = this.target;
    this.score += 1;
    this.players = this.scoredPlayers();
    this.target = this.nextTarget(this.current);
    this.lastEvent = gameEvent("coin", `Salto ${this.score}`, event.atMillis);
    return [this.lastEvent];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase === "finished") {
      if (event.atMillis - (this.finishedAtMillis ?? event.atMillis) >= saltosCelebrationMillis) {
        this.resetState(event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase === "running" && this.remainingMillis() === 0) {
      return this.finish(true, `${this.score} saltos completados`, event.atMillis);
    }
    return [];
  }
  render() {
    const frame = createFrame("#170408");
    if (this.phase === "waiting" || this.phase === "starting") {
      const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 180));
      paintDiamondRing(frame, { centerX: 8, centerY: 4, radius: 2 + step % 5, color: this.phase === "starting" ? "#ffe176" : "#1677ff" });
      return frame;
    }
    this.paintLava(frame);
    fillFrameRect(frame, this.current.x, this.current.y, platformSize, platformSize, "#1677ff");
    if (this.phase === "running") {
      fillFrameRect(frame, this.target.x, this.target.y, platformSize, platformSize, "#38e86b");
      paintFrameCell(frame, this.target.x + 1, this.target.y + 1, "#ffffff");
    } else {
      paintDiamondWave(frame, { color: this.lives > 0 ? "#38e86b" : "#ff263d", step: Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 140) });
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest17.id,
      label: manifest17.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.score,
      lives: this.lives,
      maxLives: saltosStartingLives,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.phase === "running" ? 1 : 0,
      success: this.phase === "finished" && this.lives > 0,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      currentPlatform: { ...this.current },
      targetPlatform: this.phase === "running" ? { ...this.target } : void 0,
      celebrationMillis: this.phase === "finished" ? Math.max(0, saltosCelebrationMillis - (this.nowMillis - (this.finishedAtMillis ?? this.nowMillis))) : 0
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest17);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Jugador listo", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a la plataforma azul", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastEvent = gameEvent("start", "Salta del azul al verde", nowMillis);
    } else return [];
    return [this.lastEvent];
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting") return 0;
    const end = this.finishedAtMillis ?? this.nowMillis;
    return Math.max(0, end - this.startedAtMillis);
  }
  finish(success, message, atMillis) {
    this.phase = "finished";
    this.finishedAtMillis = atMillis;
    this.lastEvent = gameEvent(success ? "win" : "damage", message, atMillis);
    return [this.lastEvent];
  }
  nextTarget(from) {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const candidate = {
        x: this.rng.range(0, FLOOR_COLS - platformSize),
        y: this.rng.range(0, FLOOR_ROWS - platformSize)
      };
      if (Math.abs(candidate.x - from.x) + Math.abs(candidate.y - from.y) >= 7) return candidate;
    }
    return { x: from.x < 8 ? 12 : 1, y: from.y < 16 ? 25 : 3 };
  }
  paintLava(frame) {
    const pulse = Math.floor(this.nowMillis / 180);
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        paintFrameCell(frame, x, y, (x * 3 + y + pulse) % 11 < 2 ? "#ff5a1f" : "#b20d21");
      }
    }
  }
  resetState(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.rng = createSeededRng(this.config.seed);
    this.current = { ...startPlatform };
    this.target = this.nextTarget(this.current);
    this.finishedAtMillis = void 0;
    this.lastEvent = gameEvent("ready", "Espera en la plataforma azul", nowMillis);
    this.lives = saltosStartingLives;
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.score = 0;
    this.startedAtMillis = nowMillis;
    this.players = this.scoredPlayers();
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  scoredPlayers() {
    return defaultPlayers(this.config.playerCount, this.config.players).map((player) => ({ ...player, score: this.score, lives: this.lives }));
  }
};
function insidePlatform(point, platform) {
  return point.x >= platform.x && point.x < platform.x + platformSize && point.y >= platform.y && point.y < platform.y + platformSize;
}

// games/suelo-seguro/src/manifest.ts
var manifest18 = {
  id: "suelo-seguro",
  label: "Suelo Seguro",
  description: "El equipo enlaza refugios de 2\xD72 en el per\xEDmetro, comparte vidas y compite por completar los relevos en el menor tiempo.",
  availability: { development: true, production: true },
  catalog: {
    category: "team",
    color: "#5fff9e",
    durationLabel: "90s",
    modeLabel: "Relevos cooperativos",
    audioLabel: "Efectos",
    rules: [
      "Cada jugador empieza en un refugio de 2\xD72 del per\xEDmetro",
      "Los refugios aparecen separados y siempre en el borde",
      "El tiempo de cada relevo se suma al equipo: menos es mejor",
      "Evitad el bloque rojo de 8\xD78; las vidas son compartidas"
    ]
  },
  players: {
    allowAny: false,
    min: 1,
    max: 8
  },
  start: { mode: "player-ready", countdownMillis: 2e3, releaseGraceMillis: 1500 },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    }
  },
  defaultDurationMillis: 9e4,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 4,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 0, y: 0 },
      { atMillis: 180, type: "press", x: 14, y: 0 },
      { atMillis: 260, type: "press", x: 14, y: 30 },
      { atMillis: 340, type: "press", x: 0, y: 30 },
      { atMillis: 2450, type: "release", x: 0, y: 0 }
    ],
    captureStartMillis: 2700,
    frameCount: 30,
    frameIntervalMillis: 100
  },
  tags: ["plataformas", "cooperativo", "turnos", "reflejos", "multijugador", "typescript"]
};

// games/suelo-seguro/src/game.ts
var sueloSeguroPlatformSize = 2;
var sueloSeguroHazardSize = 8;
var sueloSeguroRoundWinMillis = 1400;
var sueloSeguroTurnFailMillis = 1200;
var sueloSeguroGameResultMillis = 5e3;
var sueloSeguroDamageImmunityMillis = 1100;
var sueloSeguroDepartureGraceMillis = 650;
var difficultyProfiles4 = {
  easy: { hazardStepMillis: 380, lives: 5, turnMillis: 5400 },
  medium: { hazardStepMillis: 310, lives: 4, turnMillis: 4800 },
  hard: { hazardStepMillis: 250, lives: 3, turnMillis: 4200 },
  expert: { hazardStepMillis: 190, lives: 2, turnMillis: 3600 }
};
var backgroundColor7 = "#05080b";
var dangerColor = "#ff183d";
var playerColors2 = [
  "#35d7ff",
  "#ff3bd7",
  "#ffe176",
  "#5fff9e",
  "#a88bff",
  "#ff8a3d",
  "#4c7dff",
  "#f5f7ff"
];
var perimeterStarts = [
  { x: 0, y: 0 },
  { x: 7, y: 0 },
  { x: 14, y: 0 },
  { x: 14, y: 15 },
  { x: 14, y: 30 },
  { x: 7, y: 30 },
  { x: 0, y: 30 },
  { x: 0, y: 15 }
];
var horizontalPlatformXs = [0, 3, 6, 9, 12, 14];
var verticalPlatformYs = [3, 6, 9, 12, 15, 18, 21, 24, 27];
var sueloSeguroPlatformAnchors = [
  ...horizontalPlatformXs.map((x) => ({ x, y: 0 })),
  ...verticalPlatformYs.map((y) => ({ x: FLOOR_COLS - sueloSeguroPlatformSize, y })),
  ...[...horizontalPlatformXs].reverse().map((x) => ({ x, y: FLOOR_ROWS - sueloSeguroPlatformSize })),
  ...[...verticalPlatformYs].reverse().map((y) => ({ x: 0, y }))
];
var hazardMaxX = FLOOR_COLS - sueloSeguroHazardSize;
var hazardMaxY = FLOOR_ROWS - sueloSeguroHazardSize;
var sueloSeguroHazardOrbit = [
  ...Array.from({ length: hazardMaxX + 1 }, (_, x) => ({ x, y: 0 })),
  ...Array.from({ length: hazardMaxY }, (_, index) => ({ x: hazardMaxX, y: index + 1 })),
  ...Array.from({ length: hazardMaxX }, (_, index) => ({ x: hazardMaxX - index - 1, y: hazardMaxY })),
  ...Array.from({ length: hazardMaxY - 1 }, (_, index) => ({ x: 0, y: hazardMaxY - index - 1 }))
];
var floorPerimeter = [
  ...Array.from({ length: FLOOR_COLS }, (_, x) => ({ x, y: 0 })),
  ...Array.from({ length: FLOOR_ROWS - 1 }, (_, index) => ({ x: FLOOR_COLS - 1, y: index + 1 })),
  ...Array.from({ length: FLOOR_COLS - 1 }, (_, index) => ({ x: FLOOR_COLS - index - 2, y: FLOOR_ROWS - 1 })),
  ...Array.from({ length: FLOOR_ROWS - 2 }, (_, index) => ({ x: 0, y: FLOOR_ROWS - index - 2 }))
];
function sueloSeguroDifficultyProfile(difficulty) {
  return { ...difficultyProfiles4[difficulty] ?? difficultyProfiles4.medium };
}
function sueloSeguroRequiredTransfers(playerCount) {
  return Math.max(6, playerCount * 2);
}
function sueloSeguroStartingPlatforms(playerCount) {
  return Array.from({ length: playerCount }, (_, index) => {
    const perimeterIndex = Math.floor(index * perimeterStarts.length / playerCount);
    return { ...perimeterStarts[perimeterIndex] };
  });
}
function sueloSeguroHazardOrigin(step) {
  return { ...sueloSeguroHazardOrbit[positiveModulo2(step, sueloSeguroHazardOrbit.length)] };
}
function createGame18(config) {
  return new SueloSeguroGame(config);
}
var SueloSeguroGame = class {
  activePlayerIndex = 0;
  bestTransferMillis = null;
  completedTransfers = 0;
  config;
  failedTurns = 0;
  finishedAtMillis = null;
  heldTiles = /* @__PURE__ */ new Set();
  lastDamageAtMillis = Number.NEGATIVE_INFINITY;
  lastEvent = gameEvent("none", "Busca tu plataforma", 0);
  lastTransferMillis = null;
  lives = 0;
  nowMillis = 0;
  phase = "ready";
  platforms = [];
  playerScores = [];
  players = [];
  readyGate;
  resultAtMillis = 0;
  rng;
  startedAtMillis = 0;
  success = false;
  targetPlatform = null;
  teamTransferMillis = 0;
  turnDeadlineMillis = 0;
  turnStartedAtMillis = 0;
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest18);
    this.readyGate = this.createReadyGate(this.config.nowMillis);
    this.rng = createSeededRng(this.config.seed);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    const key = tileKey4(event.x, event.y);
    if (event.pressed) this.heldTiles.add(key);
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update(event), event.atMillis);
    }
    if (this.phase !== "running" || !event.pressed) return [];
    if (this.targetPlatform && insidePlatform2(event.x, event.y, this.targetPlatform)) {
      return this.completeTransfer(event.atMillis);
    }
    if (this.isDangerousContact(event.x, event.y, event.atMillis)) {
      return this.takeDamage("Has pisado el patr\xF3n rojo", event.atMillis);
    }
    return [];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    this.heldTiles.delete(tileKey4(event.x, event.y));
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.update({ ...event, pressed: false }), event.atMillis);
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.applyReadyTransition(this.readyGate.tick(event.atMillis), event.atMillis);
    }
    if (this.phase === "finished") {
      if (event.atMillis - (this.finishedAtMillis ?? event.atMillis) >= sueloSeguroGameResultMillis) {
        this.resetState(event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase === "round-win" || this.phase === "turn-fail") {
      const transitionMillis = this.phase === "round-win" ? sueloSeguroRoundWinMillis : sueloSeguroTurnFailMillis;
      if (event.atMillis - this.resultAtMillis >= transitionMillis) {
        this.advancePlayer();
        this.beginTurn(event.atMillis);
        return [this.lastEvent];
      }
      return [];
    }
    if (this.phase !== "running") return [];
    if (this.remainingMillis() <= 0) return this.finish(false, "Se acab\xF3 el tiempo", event.atMillis);
    if (this.targetPlatform && this.heldOnPlatform(this.targetPlatform)) {
      return this.completeTransfer(event.atMillis);
    }
    if (event.atMillis >= this.turnDeadlineMillis) {
      return this.failTurn(event.atMillis);
    }
    if (event.atMillis >= this.turnStartedAtMillis + sueloSeguroDepartureGraceMillis && this.heldOnDanger(event.atMillis)) {
      return this.takeDamage("El patr\xF3n rojo ha alcanzado al equipo", event.atMillis);
    }
    return [];
  }
  render() {
    const frame = createFrame(backgroundColor7);
    if (this.phase === "waiting" || this.phase === "starting") {
      this.paintWaiting(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.paintFinished(frame);
      return frame;
    }
    this.paintHazard(frame);
    for (const platform of this.visiblePlatforms()) this.paintPlatform(frame, platform);
    if (this.phase === "round-win") {
      const winner = this.players[this.activePlayerIndex];
      paintDiamondRing(frame, {
        centerX: (this.platforms[this.activePlayerIndex]?.x ?? 7) + 0.5,
        centerY: (this.platforms[this.activePlayerIndex]?.y ?? 15) + 0.5,
        color: winner?.color ?? "#5fff9e",
        radius: 2 + Math.floor((this.nowMillis - this.resultAtMillis) / 110) % 10,
        thickness: 2
      });
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    const profile = this.profile();
    const active = this.players[this.activePlayerIndex];
    const visiblePlatforms = this.visiblePlatforms();
    return {
      currentGame: manifest18.id,
      label: manifest18.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players,
      score: this.teamTransferMillis,
      lives: this.lives,
      maxLives: profile.lives,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.remainingMillis(),
      activeTargets: this.targetPlatform ? 1 : 0,
      success: this.phase === "finished" && this.success,
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      activePlayerIndex: this.activePlayerIndex,
      activePlayerLabel: active?.label ?? "Jugador 1",
      bestTransferMillis: this.bestTransferMillis,
      completedTransfers: this.completedTransfers,
      failedTurns: this.failedTurns,
      hazardStep: this.hazardStep(this.nowMillis),
      lastTransferMillis: this.lastTransferMillis,
      platforms: visiblePlatforms,
      requiredTransfers: sueloSeguroRequiredTransfers(this.config.playerCount),
      stage: this.stage(),
      targetPlatform: visiblePlatforms.find((platform) => platform.target) ?? null,
      teamTransferMillis: this.teamTransferMillis,
      turnDurationMillis: profile.turnMillis,
      turnRemainingMillis: this.phase === "running" ? Math.max(0, this.turnDeadlineMillis - this.nowMillis) : 0
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest18);
    this.readyGate = this.createReadyGate(this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.lastEvent = gameEvent("ready", "Todos en su plataforma", nowMillis);
    } else if (transition === "players-left") {
      this.phase = "waiting";
      this.lastEvent = gameEvent("ready", "Vuelve a tu plataforma", nowMillis);
    } else if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.beginTurn(nowMillis);
    } else {
      return [];
    }
    return [this.lastEvent];
  }
  beginTurn(nowMillis) {
    this.phase = "running";
    this.turnStartedAtMillis = nowMillis;
    this.turnDeadlineMillis = nowMillis + this.profile().turnMillis;
    this.targetPlatform = this.pickTargetPlatform();
    const active = this.players[this.activePlayerIndex];
    this.lastEvent = gameEvent("turn", `${active?.label ?? "Jugador"}: busca tu nueva plataforma`, nowMillis);
  }
  completeTransfer(atMillis) {
    if (!this.targetPlatform || this.phase !== "running") return [];
    const transferMillis = Math.max(0, atMillis - this.turnStartedAtMillis);
    this.platforms[this.activePlayerIndex] = { ...this.targetPlatform };
    this.targetPlatform = null;
    this.completedTransfers += 1;
    this.lastTransferMillis = transferMillis;
    this.bestTransferMillis = this.bestTransferMillis === null ? transferMillis : Math.min(this.bestTransferMillis, transferMillis);
    this.teamTransferMillis += transferMillis;
    this.playerScores[this.activePlayerIndex] = (this.playerScores[this.activePlayerIndex] ?? 0) + transferMillis;
    this.updatePlayers();
    if (this.completedTransfers >= sueloSeguroRequiredTransfers(this.config.playerCount)) {
      return this.finish(true, `Todos los relevos en ${formatTransferTime(this.teamTransferMillis)}`, atMillis);
    }
    this.phase = "round-win";
    this.resultAtMillis = atMillis;
    const active = this.players[this.activePlayerIndex];
    this.lastEvent = gameEvent("round-win", `${active?.label ?? "Jugador"} lleg\xF3 en ${formatTransferTime(transferMillis)}`, atMillis);
    return [this.lastEvent];
  }
  failTurn(atMillis) {
    if (this.targetPlatform) this.platforms[this.activePlayerIndex] = { ...this.targetPlatform };
    this.targetPlatform = null;
    this.failedTurns += 1;
    const events = this.takeDamage("No has llegado a tiempo", atMillis);
    if (this.phase === "finished") return events;
    this.phase = "turn-fail";
    this.resultAtMillis = atMillis;
    return events;
  }
  takeDamage(message, atMillis) {
    if (atMillis - this.lastDamageAtMillis < sueloSeguroDamageImmunityMillis) return [];
    this.lastDamageAtMillis = atMillis;
    this.lives = Math.max(0, this.lives - 1);
    this.updatePlayers();
    if (this.lives === 0) return this.finish(false, "El patr\xF3n rojo ha ganado", atMillis);
    this.lastEvent = gameEvent("damage", `${message}; quedan ${this.lives} vidas`, atMillis);
    return [this.lastEvent];
  }
  finish(success, message, atMillis) {
    this.phase = "finished";
    this.finishedAtMillis = atMillis;
    this.success = success;
    this.targetPlatform = null;
    this.lastEvent = gameEvent(success ? "win" : "fail", message, atMillis);
    return [this.lastEvent];
  }
  advancePlayer() {
    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.config.playerCount;
  }
  pickTargetPlatform() {
    const origin = this.platforms[this.activePlayerIndex];
    const occupied = this.platforms.filter((_platform, index) => index !== this.activePlayerIndex);
    const candidates = sueloSeguroPlatformAnchors.filter(
      (candidate) => !samePlatform(origin, candidate) && !occupied.some((platform) => touchesOrAdjacent(platform, candidate)) && manhattan(origin, candidate) >= 8
    );
    const fallback = sueloSeguroPlatformAnchors.filter(
      (candidate) => !samePlatform(origin, candidate) && !occupied.some((platform) => touchesOrAdjacent(platform, candidate))
    );
    const pool = candidates.length > 0 ? candidates : fallback;
    const selected = pool[this.rng.int(pool.length)];
    if (!selected) throw new Error("Suelo Seguro could not place a separated perimeter platform");
    return { ...selected };
  }
  paintWaiting(frame) {
    const step = Math.floor(this.nowMillis / (this.phase === "starting" ? 100 : 150));
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        if (positiveModulo2(x * 7 + y * 3 + step, 47) === 0) paintFrameCell(frame, x, y, "#0a2630");
      }
    }
    floorPerimeter.forEach((cell, index) => {
      const trail = positiveModulo2(index - step, 23);
      if (trail === 0) paintFrameCell(frame, cell.x, cell.y, this.phase === "starting" ? "#ffe176" : "#7feaff");
      else if (trail === 1 || trail === 22) paintFrameCell(frame, cell.x, cell.y, "#164a5a");
    });
    this.platforms.forEach((platform, index) => {
      const ready = this.readyGate.zoneReady(index, this.nowMillis);
      const color = ready ? "#ffffff" : this.players[index]?.color ?? playerColors2[index];
      fillFrameRect(frame, platform.x, platform.y, sueloSeguroPlatformSize, sueloSeguroPlatformSize, color);
      if (!ready) {
        const shimmer = positiveModulo2(step + index, sueloSeguroPlatformSize * sueloSeguroPlatformSize);
        paintFrameCell(
          frame,
          platform.x + shimmer % sueloSeguroPlatformSize,
          platform.y + Math.floor(shimmer / sueloSeguroPlatformSize),
          "#ffffff"
        );
      }
    });
    paintDiamondRing(frame, {
      centerX: 7.5,
      centerY: 15.5,
      color: this.phase === "starting" ? "#ffe176" : "#35d7ff",
      radius: 2 + step % 11
    });
  }
  paintHazard(frame) {
    const origin = sueloSeguroHazardOrigin(this.hazardStep(this.nowMillis));
    fillFrameRect(frame, origin.x, origin.y, sueloSeguroHazardSize, sueloSeguroHazardSize, dangerColor);
  }
  paintPlatform(frame, platform) {
    const pulse = platform.target && Math.floor(this.nowMillis / 180) % 2 === 0 ? "#ffffff" : platform.color;
    fillFrameRect(frame, platform.x, platform.y, sueloSeguroPlatformSize, sueloSeguroPlatformSize, pulse);
  }
  paintFinished(frame) {
    const step = Math.floor((this.nowMillis - (this.finishedAtMillis ?? this.nowMillis)) / 120);
    paintDiamondWave(frame, {
      color: ({ distance }) => this.success ? playerColors2[distance % playerColors2.length] : distance % 2 === 0 ? dangerColor : "#560719",
      step,
      period: this.success ? 8 : 5,
      bandWidth: this.success ? 4 : 3
    });
  }
  visiblePlatforms() {
    const visible = this.platforms.map((platform, ownerIndex) => ({ platform, ownerIndex })).filter(({ ownerIndex }) => this.phase !== "running" || ownerIndex !== this.activePlayerIndex).map(({ platform, ownerIndex }) => ({
      ...platform,
      color: this.players[ownerIndex]?.color ?? playerColors2[ownerIndex],
      ownerIndex,
      target: false
    }));
    if (this.targetPlatform) {
      visible.push({
        ...this.targetPlatform,
        color: this.players[this.activePlayerIndex]?.color ?? playerColors2[this.activePlayerIndex],
        ownerIndex: this.activePlayerIndex,
        target: true
      });
    }
    return visible;
  }
  heldOnPlatform(platform) {
    for (const key of this.heldTiles) {
      const [x, y] = key.split(",").map(Number);
      if (insidePlatform2(x ?? -1, y ?? -1, platform)) return true;
    }
    return false;
  }
  heldOnDanger(atMillis) {
    for (const key of this.heldTiles) {
      const [x, y] = key.split(",").map(Number);
      if (this.isDangerousContact(x ?? -1, y ?? -1, atMillis)) return true;
    }
    return false;
  }
  isDangerousContact(x, y, atMillis) {
    if (this.visiblePlatforms().some((platform) => insidePlatform2(x, y, platform))) return false;
    const origin = sueloSeguroHazardOrigin(this.hazardStep(atMillis));
    return x >= origin.x && x < origin.x + sueloSeguroHazardSize && y >= origin.y && y < origin.y + sueloSeguroHazardSize;
  }
  hazardStep(atMillis) {
    return Math.floor(Math.max(0, atMillis - this.startedAtMillis) / this.profile().hazardStepMillis);
  }
  stage() {
    if (this.phase === "waiting" || this.phase === "starting") return "waiting";
    if (this.phase === "round-win") return "round-win";
    if (this.phase === "turn-fail") return "turn-fail";
    if (this.phase === "finished") return this.success ? "game-win" : "game-fail";
    return "moving";
  }
  elapsedMillis() {
    if (this.phase === "waiting" || this.phase === "starting" || this.phase === "ready") return 0;
    return Math.max(0, (this.finishedAtMillis ?? this.nowMillis) - this.startedAtMillis);
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  profile() {
    return sueloSeguroDifficultyProfile(this.config.difficulty);
  }
  createReadyGate(nowMillis) {
    const zones = sueloSeguroStartingPlatforms(this.config.playerCount).map((platform) => ({
      minX: platform.x,
      maxX: platform.x + sueloSeguroPlatformSize - 1,
      minY: platform.y,
      maxY: platform.y + sueloSeguroPlatformSize - 1
    }));
    return createPlayerReadyGate(manifest18.start, zones, nowMillis);
  }
  resetState(nowMillis) {
    this.activePlayerIndex = 0;
    this.bestTransferMillis = null;
    this.completedTransfers = 0;
    this.failedTurns = 0;
    this.finishedAtMillis = null;
    this.heldTiles.clear();
    this.lastDamageAtMillis = Number.NEGATIVE_INFINITY;
    this.lastTransferMillis = null;
    this.lives = this.profile().lives;
    this.nowMillis = nowMillis;
    this.phase = "waiting";
    this.platforms = sueloSeguroStartingPlatforms(this.config.playerCount);
    this.playerScores = Array.from({ length: this.config.playerCount }, () => 0);
    this.readyGate.reset(nowMillis);
    this.resultAtMillis = 0;
    this.rng = createSeededRng(this.config.seed);
    this.startedAtMillis = nowMillis;
    this.success = false;
    this.targetPlatform = null;
    this.teamTransferMillis = 0;
    this.turnDeadlineMillis = 0;
    this.turnStartedAtMillis = 0;
    this.updatePlayers();
    this.lastEvent = gameEvent("ready", "Cada jugador ocupa su plataforma", nowMillis);
  }
  updatePlayers() {
    this.players = defaultPlayers(this.config.playerCount, this.config.players).map((player, index) => ({
      ...player,
      label: /^Player \d+$/u.test(player.label) ? `Jugador ${index + 1}` : player.label,
      color: this.config.players[index]?.color ?? playerColors2[index] ?? playerColors2[0],
      score: this.playerScores[index] ?? 0,
      lives: this.lives
    }));
  }
};
function tileKey4(x, y) {
  return `${x},${y}`;
}
function insidePlatform2(x, y, platform) {
  return x >= platform.x && x < platform.x + sueloSeguroPlatformSize && y >= platform.y && y < platform.y + sueloSeguroPlatformSize;
}
function touchesOrAdjacent(left, right) {
  return left.x <= right.x + sueloSeguroPlatformSize && left.x + sueloSeguroPlatformSize >= right.x && left.y <= right.y + sueloSeguroPlatformSize && left.y + sueloSeguroPlatformSize >= right.y;
}
function samePlatform(left, right) {
  return left.x === right.x && left.y === right.y;
}
function manhattan(left, right) {
  return Math.abs(left.x - right.x) + Math.abs(left.y - right.y);
}
function formatTransferTime(millis) {
  return `${(Math.max(0, millis) / 1e3).toFixed(2).replace(".", ",")} s`;
}
function positiveModulo2(value, divisor) {
  return (value % divisor + divisor) % divisor;
}

// games/temporada1-niveles/src/manifest.ts
var temporada1GameId = "4773837e-3565-49d7-8953-3b40f59fca7b";
var temporada1EngineGame = "temporada1-niveles";
var manifest19 = {
  id: temporada1GameId,
  slug: temporada1EngineGame,
  aliases: [temporada1EngineGame],
  label: "Temporada 1",
  description: "Ruta cooperativa de 24 niveles con puntos, peligros y retos cl\xE1sicos de la pista.",
  availability: { development: true, production: true },
  catalog: {
    category: "team",
    color: "#8dff6e",
    durationLabel: "Por nivel",
    modeLabel: "Temporada",
    audioLabel: "M\xFAsica + efectos",
    rules: [
      "Recoge todos los objetivos azules y morados",
      "Los objetivos morados necesitan dos pisadas y las baldosas rojas quitan vidas"
    ]
  },
  players: {
    allowAny: false,
    min: 1,
    max: 6
  },
  start: { mode: "immediate" },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard", "expert"]
    },
    vars: []
  },
  defaultDurationMillis: 0,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 4,
    difficulty: "medium",
    actions: [{ atMillis: 3100, type: "press", x: 7, y: 29 }],
    captureStartMillis: 3180,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["published-levels", "platform-editable", "jugar-3d", "team", "typescript"]
};

// games/temporada1-niveles/src/fixtures-content.ts
var fallbackContent2 = createPublishedLevelContent({
  gameId: temporada1GameId,
  engineGame: temporada1EngineGame,
  selectedLevelId: "22222222-2222-4222-8222-222222222201",
  selectedLevelSlug: "level-1",
  mode: "challenge",
  levelsPayload: [
    temporadaLevel("22222222-2222-4222-8222-222222222201", "level-1", "Temporada 1 / Nivel 1", 0),
    temporadaLevel("22222222-2222-4222-8222-222222222202", "level-2", "Temporada 1 / Nivel 2", 2)
  ],
  resultAnimationsPayload: {
    levels: [resultAnimation2("game-pass", "#35d7ff", victoryCells2()), resultAnimation2("game-fail", "#ff2036", defeatCells2())]
  }
});
function temporadaLevel(id, slug, label, offset) {
  return {
    id,
    slug,
    label,
    description: "Esquiva las l\xEDneas rojas y recoge todos los objetivos azules y morados.",
    life: 4,
    pass_score: 10,
    time_limit_seconds: 75,
    frame_tick_ms: 25,
    rules: {
      victory_condition: "collect_all",
      difficulty_changes_layout: false,
      difficulty_settings: {
        easy: { life: 5, gameplay_time_limit_seconds: 100, speed_multiplier: 0.8 },
        medium: { life: 4, gameplay_time_limit_seconds: 75, speed_multiplier: 1 },
        hard: { life: 3, gameplay_time_limit_seconds: 60, speed_multiplier: 1.25 },
        expert: { life: 2, gameplay_time_limit_seconds: 45, speed_multiplier: 1.5 }
      },
      red_floor_animation: "none",
      red_damage_grace_period: false,
      green_platform_load_animation: true,
      green_platform_load_side: "left",
      green_platform_disappear: false,
      green_platform_impact_ripple: false,
      blue_platform_turn_green: false,
      blue_platform_capture_area: false
    },
    result_animations: {
      victory_animations: ["game-pass"],
      defeat_animations: ["game-fail"]
    },
    music_ref: "Motion/canciones/Background07.mp3",
    music_volume: 0.18,
    coin_cue_ref: "Motion/sonidos/coin.wav",
    double_coin_cue_ref: "Motion/sonidos/coin.wav",
    damage_cue_ref: "Motion/sonidos/fallo.mp3",
    win_cue_ref: "Motion/sonidos/victoria.mp3",
    defeat_cue_ref: "Motion/sonidos/fallo.mp3",
    frames: [
      { r: 24, c: temporadaCells(offset, 0) },
      { r: 24, c: temporadaCells(offset, 1) },
      { r: 24, c: temporadaCells(offset, 2) }
    ]
  };
}
function temporadaCells(levelOffset, motionOffset) {
  const cells = [];
  for (let y = 28; y < 32; y += 1) {
    for (let x = 3; x <= 12; x += 1) cells.push([x, y, 0, `safe-${x}-${y}`]);
  }
  for (let y = 3; y <= 26; y += 6) {
    for (let x = 5; x <= 10; x += 1) cells.push([x, y, 0, `rest-${x}-${y}`]);
  }
  const lineA = 8 + (motionOffset + levelOffset) % 3;
  const lineB = 19 - (motionOffset + levelOffset) % 3;
  for (let x = 0; x < 16; x += 1) {
    cells.push([x, lineA, 2, `laser-a-${x}`], [x, lineB, 2, `laser-b-${x}`]);
  }
  cells.push(
    [2 + levelOffset, 5, 1, `blue-a-${levelOffset}`],
    [13 - levelOffset, 24, 1, `blue-b-${levelOffset}`],
    [8, 14, 3, `purple-${levelOffset}`]
  );
  return cells;
}
function resultAnimation2(slug, color, cells) {
  return {
    slug,
    frame_tick_ms: 50,
    tile_effects: { 0: { color } },
    frames: [{ r: 10, c: cells }, { r: 10, c: cells.map(([x, y, kind]) => [15 - x, y, kind]) }]
  };
}
function victoryCells2() {
  const cells = [];
  for (let radius = 0; radius <= 7; radius += 1) {
    cells.push([7 - radius, 16, 0], [8 + radius, 16, 0], [7, 16 - radius, 0], [8, 16 + radius, 0]);
  }
  return cells.filter(([x, y]) => x >= 0 && x < 16 && y >= 0 && y < 32);
}
function defeatCells2() {
  const cells = [];
  for (let y = 7; y < 25; y += 1) cells.push([5, y, 0], [10, y, 0]);
  for (let x = 5; x <= 10; x += 1) cells.push([x, 7, 0], [x, 24, 0]);
  return cells;
}

// games/temporada1-niveles/src/game.ts
var product2 = Object.freeze({
  manifest: manifest19,
  fallbackContent: fallbackContent2,
  contentIdentity: "platform"
});
function createGame19(config) {
  return createPublishedLevelGame(product2, config);
}

// games/tetris/src/manifest.ts
var tetrisConfigVars = {
  linesToWin: { key: "lines_to_win", label: "L\xEDneas para ganar", playerFacing: true, description: "L\xEDneas que hay que eliminar para activar la celebraci\xF3n final.", type: "int", default: 10, min: 1, max: 40, step: 1 }
};
var manifest20 = {
  id: "tetris",
  label: "Tetris",
  description: "Gu\xEDa, rota y deja caer piezas f\xEDsicas en una pista cl\xE1sica de diez columnas.",
  availability: { development: true, production: true },
  catalog: { category: "arcade", color: "#36d9ff", durationLabel: "Sin l\xEDmite", modeLabel: "Tetris cl\xE1sico", audioLabel: "M\xFAsica + efectos", rules: ["Pisa una columna para guiar la pieza", "Pisa las diagonales junto a tu gu\xEDa para rotar", "Baja hasta el fondo para soltar la pieza y completa l\xEDneas"] },
  players: { allowAny: true, min: 1, max: 4 },
  start: { mode: "player-ready", releaseGraceMillis: 1500 },
  config: { difficulty: { default: "medium", options: ["easy", "medium", "hard"] }, vars: Object.values(tetrisConfigVars) },
  defaultDurationMillis: 0,
  display: { entry: "./display" },
  preview: { seed: 137, playerCount: 1, difficulty: "medium", options: { lines_to_win: 10 }, actions: [{ atMillis: 100, type: "press", x: 8, y: 29 }], captureStartMillis: 2200, frameCount: 18, frameIntervalMillis: 120 },
  tags: ["arcade", "puzzle", "classic", "typescript"]
};

// games/tetris/src/game.ts
var boardX = 3;
var boardWidth = 10;
var finishMillis = 4e3;
var rotateCooldownMillis = 180;
var palette = ["#36d9ff", "#ffd166", "#ff52c8", "#34c759", "#ff7a1a", "#0a84ff", "#ff3b30"];
var lineScores = [0, 100, 300, 500, 800];
var shapes = [
  [[[0, 0], [1, 0], [2, 0], [3, 0]], [[0, 0], [0, 1], [0, 2], [0, 3]], [[0, 0], [1, 0], [2, 0], [3, 0]], [[0, 0], [0, 1], [0, 2], [0, 3]]],
  [[[0, 0], [1, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]]],
  [[[1, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [0, 1], [1, 1], [0, 2]], [[0, 0], [1, 0], [2, 0], [1, 1]], [[1, 0], [0, 1], [1, 1], [1, 2]]],
  [[[1, 0], [2, 0], [0, 1], [1, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]], [[1, 0], [2, 0], [0, 1], [1, 1]], [[0, 0], [0, 1], [1, 1], [1, 2]]],
  [[[0, 0], [1, 0], [1, 1], [2, 1]], [[1, 0], [0, 1], [1, 1], [0, 2]], [[0, 0], [1, 0], [1, 1], [2, 1]], [[1, 0], [0, 1], [1, 1], [0, 2]]],
  [[[0, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [1, 0], [0, 1], [0, 2]], [[0, 0], [1, 0], [2, 0], [2, 1]], [[1, 0], [1, 1], [0, 2], [1, 2]]],
  [[[2, 0], [0, 1], [1, 1], [2, 1]], [[0, 0], [0, 1], [0, 2], [1, 2]], [[0, 0], [1, 0], [2, 0], [0, 1]], [[0, 0], [1, 0], [1, 1], [1, 2]]]
];
function createGame20(config) {
  return new TetrisGame(config);
}
var TetrisGame = class {
  config;
  rng;
  readyGate;
  board = [];
  active;
  next;
  phase = "waiting";
  result = "playing";
  nowMillis = 0;
  startedAtMillis = 0;
  lastFallMillis = 0;
  lastRotateMillis = -1e3;
  finishAtMillis = 0;
  lastClearMillis = 0;
  lastClearCount = 0;
  score = 0;
  lines = 0;
  level = 1;
  guideX = boardX + 5;
  guideY = FLOOR_ROWS - 1;
  motionEventId = 0;
  players = defaultPlayers(1);
  lastEvent = gameEvent("none", "Listo", 0);
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest20);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate = createPlayerReadyGate(manifest20.start, [{ minX: 5, maxX: 10, minY: 28, maxY: 31 }], this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.lastEvent = gameEvent("ready", "Entra en la zona de control", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.record(this.applyReady(this.readyGate.update(event), event.atMillis));
    if (this.phase !== "running" || !event.pressed) return [];
    if (event.y === this.guideY - 1 && event.x === this.guideX - 1) return this.rotate(-1, event.atMillis);
    if (event.y === this.guideY - 1 && event.x === this.guideX + 1) return this.rotate(1, event.atMillis);
    if (event.x < boardX || event.x >= boardX + boardWidth) return [];
    this.guideX = clamp(event.x, boardX + 1, boardX + boardWidth - 2);
    this.guideY = clamp(event.y, 1, FLOOR_ROWS - 1);
    const desiredX = clamp(event.x - Math.floor(pieceWidth(this.active) / 2), boardX, boardX + boardWidth - pieceWidth(this.active));
    if (!this.collides(this.active, desiredX, this.active.y, this.active.rotation)) this.active.x = desiredX;
    if (event.y >= FLOOR_ROWS - 2) return this.hardDrop(event.atMillis);
    return [];
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.record(this.applyReady(this.readyGate.update({ ...event, pressed: false }), event.atMillis));
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.record(this.applyReady(this.readyGate.tick(event.atMillis), event.atMillis));
    if (this.phase === "finished") {
      if (event.atMillis - this.finishAtMillis >= finishMillis) {
        this.resetState(event.atMillis);
        return this.record([gameEvent("ready", "Nueva partida", event.atMillis)]);
      }
      return [];
    }
    if (this.result === "line-clear" && event.atMillis - this.lastClearMillis >= 550) this.result = "playing";
    const interval = gravityInterval(this.level, this.config.difficulty, this.guideY > this.active.y + 5);
    let steps = 0;
    while (event.atMillis - this.lastFallMillis >= interval && steps < 4 && this.phase === "running") {
      if (this.collides(this.active, this.active.x, this.active.y + 1, this.active.rotation)) return this.lockPiece(event.atMillis);
      this.active.y += 1;
      this.lastFallMillis += interval;
      steps += 1;
    }
    return [];
  }
  render() {
    const frame = createFrame("#05070a");
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      paintFrameCell(frame, boardX - 1, y, this.phase === "finished" ? "#67151f" : "#06131a");
      paintFrameCell(frame, boardX + boardWidth, y, this.phase === "finished" ? "#67151f" : "#06131a");
      for (let x = 0; x < boardWidth; x += 1) paintFrameCell(frame, boardX + x, y, this.board[y]?.[x] ?? "#020609");
    }
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawReady(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.drawFinish(frame);
      return frame;
    }
    this.drawPiece(frame, this.ghostPiece(), "#17404a");
    this.drawPiece(frame, this.active, this.active.color);
    if (this.board[this.guideY]?.[this.guideX - boardX] === null) paintFrameCell(frame, this.guideX, this.guideY, "#12303a");
    paintFrameCell(frame, this.guideX - 1, this.guideY - 1, "#7a1f61");
    paintFrameCell(frame, this.guideX + 1, this.guideY - 1, "#7a5f1f");
    if (this.lastClearCount > 0 && this.nowMillis - this.lastClearMillis < 350) for (let x = boardX; x < boardX + boardWidth; x += 1) paintFrameCell(frame, x, FLOOR_ROWS - 1, "#ffffff");
    for (let y = FLOOR_ROWS - Math.min(FLOOR_ROWS, this.lines); y < FLOOR_ROWS; y += 1) {
      paintFrameCell(frame, 0, y, "#ffd166");
      paintFrameCell(frame, FLOOR_COLS - 1, y, "#36d9ff");
    }
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    const player = this.players[0];
    return {
      currentGame: manifest20.id,
      label: manifest20.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: [{ index: 0, label: player.label, color: player.color, score: this.score, lives: -1 }],
      score: this.score,
      lives: -1,
      elapsedMillis: this.phase === "waiting" || this.phase === "starting" ? 0 : Math.max(0, this.nowMillis - this.startedAtMillis),
      remainingMillis: this.phase === "finished" ? Math.max(0, this.finishAtMillis + finishMillis - this.nowMillis) : 0,
      activeTargets: this.phase === "running" ? 1 : 0,
      success: this.result === "game-win",
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      result: this.result,
      lines: this.lines,
      level: this.level,
      linesTarget: this.linesToWin(),
      winnerLabel: player.label,
      activePiece: snapshotPiece(this.active),
      nextPiece: snapshotPiece(this.next),
      board: this.board.map((row) => [...row]),
      guideX: this.guideX,
      guideY: this.guideY,
      lastClearCount: this.lastClearCount,
      lineFlashMillis: Math.max(0, this.lastClearMillis + 550 - this.nowMillis),
      motionEventId: this.motionEventId
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest20);
    this.rng = createSeededRng(this.config.seed);
    this.readyGate.reset(this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  resetState(nowMillis) {
    this.rng = createSeededRng(this.config.seed);
    this.readyGate.reset(nowMillis);
    this.board = Array.from({ length: FLOOR_ROWS }, () => Array(boardWidth).fill(null));
    this.active = this.randomPiece();
    this.next = this.randomPiece();
    this.phase = "waiting";
    this.result = "playing";
    this.nowMillis = nowMillis;
    this.startedAtMillis = nowMillis;
    this.lastFallMillis = nowMillis;
    this.finishAtMillis = 0;
    this.lastClearMillis = 0;
    this.lastClearCount = 0;
    this.lastRotateMillis = -1e3;
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.guideX = boardX + 5;
    this.guideY = FLOOR_ROWS - 1;
    this.motionEventId = 0;
    const roster = defaultPlayers(Math.max(1, this.config.playerCount), this.config.players);
    const first = roster[0];
    this.players = [{ ...first, label: first.label === "Player 1" ? "Jugador" : first.label }];
    this.lastEvent = gameEvent("ready", "Entra en la zona de control", nowMillis);
  }
  applyReady(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Control preparado", nowMillis)];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a la zona de control", nowMillis)];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.lastFallMillis = nowMillis;
      this.motionEventId += 1;
      return [gameEvent("start", "Tetris en marcha", nowMillis)];
    }
    return [];
  }
  randomPiece() {
    const shape = this.rng.int(shapes.length);
    const piece = { shape, rotation: 0, x: 0, y: 0, color: palette[shape] };
    piece.x = boardX + Math.floor((boardWidth - pieceWidth(piece)) / 2);
    return piece;
  }
  rotate(direction, nowMillis) {
    if (nowMillis - this.lastRotateMillis < rotateCooldownMillis) return [];
    const rotation = (this.active.rotation + direction + 4) % 4;
    for (const kick of [0, -1, 1, -2, 2]) if (!this.collides(this.active, this.active.x + kick, this.active.y, rotation)) {
      this.active.x += kick;
      this.active.rotation = rotation;
      this.lastRotateMillis = nowMillis;
      this.motionEventId += 1;
      return this.record([gameEvent("tick", direction < 0 ? "Rotaci\xF3n izquierda" : "Rotaci\xF3n derecha", nowMillis)]);
    }
    return [];
  }
  hardDrop(nowMillis) {
    while (!this.collides(this.active, this.active.x, this.active.y + 1, this.active.rotation)) this.active.y += 1;
    return this.lockPiece(nowMillis);
  }
  lockPiece(nowMillis) {
    for (const [dx, dy] of pieceCells(this.active)) {
      const x = this.active.x + dx - boardX;
      const y = this.active.y + dy;
      if (y >= 0 && y < FLOOR_ROWS && x >= 0 && x < boardWidth) this.board[y][x] = this.active.color;
    }
    const cleared = this.clearLines();
    this.lastClearCount = cleared;
    if (cleared > 0) {
      this.lastClearMillis = nowMillis;
      this.lines += cleared;
      this.level = Math.floor(this.lines / 10) + 1;
      this.score += (lineScores[cleared] ?? 0) * this.level;
      this.result = "line-clear";
      this.motionEventId += 1;
      if (this.lines >= this.linesToWin()) return this.finish(true, nowMillis);
    }
    this.active = this.next;
    this.active.x = boardX + Math.floor((boardWidth - pieceWidth(this.active)) / 2);
    this.active.y = 0;
    this.next = this.randomPiece();
    this.guideX = this.active.x + Math.floor(pieceWidth(this.active) / 2);
    this.guideY = FLOOR_ROWS - 1;
    this.lastFallMillis = nowMillis;
    if (this.collides(this.active, this.active.x, this.active.y, this.active.rotation)) return this.finish(false, nowMillis);
    return cleared > 0 ? this.record([gameEvent("win", `${cleared === 1 ? "L\xEDnea" : `${cleared} l\xEDneas`} +${(lineScores[cleared] ?? 0) * this.level}`, nowMillis)]) : [];
  }
  clearLines() {
    let cleared = 0;
    for (let y = FLOOR_ROWS - 1; y >= 0; y -= 1) if (this.board[y].every(Boolean)) {
      this.board.splice(y, 1);
      this.board.unshift(Array(boardWidth).fill(null));
      cleared += 1;
      y += 1;
    }
    return cleared;
  }
  finish(success, nowMillis) {
    this.phase = "finished";
    this.result = success ? "game-win" : "game-loss";
    this.finishAtMillis = nowMillis;
    this.motionEventId += 1;
    const target = this.linesToWin();
    return this.record([gameEvent(success ? "win" : "fail", success ? `\xA1Objetivo de ${target} ${target === 1 ? "l\xEDnea completado" : "l\xEDneas completado"}!` : "Las piezas llegaron arriba", nowMillis)]);
  }
  collides(piece, x, y, rotation) {
    return (shapes[piece.shape]?.[rotation] ?? []).some(([dx, dy]) => {
      const bx = x + dx - boardX;
      const by = y + dy;
      return bx < 0 || bx >= boardWidth || by >= FLOOR_ROWS || by >= 0 && this.board[by]?.[bx] !== null;
    });
  }
  ghostPiece() {
    const ghost = { ...this.active };
    while (!this.collides(ghost, ghost.x, ghost.y + 1, ghost.rotation)) ghost.y += 1;
    return ghost;
  }
  drawPiece(frame, piece, color) {
    for (const [dx, dy] of pieceCells(piece)) paintFrameCell(frame, piece.x + dx, piece.y + dy, color);
  }
  drawReady(frame) {
    const ready = this.readyGate.zoneReady(0, this.nowMillis);
    for (let y = 28; y < 32; y += 1) for (let x = 5; x <= 10; x += 1) if (ready || (x + y + Math.floor(this.nowMillis / 110)) % 4 < 2) paintFrameCell(frame, x, y, ready ? "#ffffff" : "#36d9ff");
  }
  drawFinish(frame) {
    const step = Math.floor((this.nowMillis - this.finishAtMillis) / 90);
    const color = this.result === "game-win" ? "#36d9ff" : "#ff3b30";
    for (let y = 0; y < FLOOR_ROWS; y += 1) for (let x = boardX; x < boardX + boardWidth; x += 1) if ((x + y + step) % 5 < 2) paintFrameCell(frame, x, y, color);
  }
  linesToWin() {
    return readGameConfigOption(this.config.options, tetrisConfigVars.linesToWin);
  }
  record(events) {
    const latest = events.at(-1);
    if (latest) this.lastEvent = latest;
    return events;
  }
};
function pieceCells(piece) {
  return shapes[piece.shape]?.[piece.rotation] ?? [];
}
function pieceWidth(piece) {
  const xs = pieceCells(piece).map(([x]) => x);
  return Math.max(...xs) - Math.min(...xs) + 1;
}
function snapshotPiece(piece) {
  return { shape: piece.shape, rotation: piece.rotation, x: piece.x, y: piece.y, color: piece.color, cells: pieceCells(piece).map((cell) => [...cell]) };
}
function gravityInterval(level, difficulty, fast) {
  const base = Math.max(100, 720 - (level - 1) * 45);
  const factor = difficulty === "easy" ? 1.25 : difficulty === "hard" ? 0.78 : 1;
  return Math.max(70, base * factor / (fast ? 3 : 1));
}

// games/tira-soga/src/manifest.ts
var manifest21 = {
  id: "tira-soga",
  label: "Tira-Soga",
  description: "Five-round team tug of war driven by rapid presses on the red and blue floor halves.",
  availability: { development: true, production: false },
  catalog: {
    category: "versus",
    color: "#ff9f1c",
    durationLabel: "Sin l\xEDmite",
    modeLabel: "Tira y afloja",
    audioLabel: "Efectos",
    rules: [
      "Rojo ocupa la mitad superior y azul la inferior",
      "Pisa r\xE1pidamente tu campo para arrastrar la soga",
      "Gana tres de las cinco rondas"
    ]
  },
  players: {
    allowAny: true,
    min: 2,
    max: 2
  },
  start: {
    mode: "player-ready",
    countdownMillis: 3e3,
    releaseGraceMillis: 2e3
  },
  config: {
    difficulty: {
      default: "medium",
      options: ["easy", "medium", "hard"]
    }
  },
  defaultDurationMillis: 0,
  display: {
    entry: "./display"
  },
  preview: {
    seed: 137,
    playerCount: 2,
    difficulty: "medium",
    actions: [
      { atMillis: 100, type: "press", x: 4, y: 8 },
      { atMillis: 100, type: "press", x: 11, y: 24 }
    ],
    captureStartMillis: 3200,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["competitive", "teams", "two-player", "typescript"]
};

// games/tira-soga/src/game.ts
var redColor3 = "#ff1c28";
var blueColor3 = "#145cff";
var redFieldColor = "#720c17";
var blueFieldColor = "#0b3189";
var centerLineColor = "#ff9f1c";
var ropeColor = "#f4c56a";
var knotColor = "#fff7d6";
var totalRounds = 5;
var roundsToWin2 = 3;
var ropeLimit = 6;
var roundWinAnimationMillis2 = 1800;
var gameWinAnimationMillis5 = 5e3;
var redFieldLastRow = 14;
var blueFieldFirstRow = 17;
var difficultyPresses = {
  easy: 1,
  medium: 2,
  hard: 3
};
var difficultyLabels = {
  easy: "F\xE1cil",
  medium: "Medio",
  hard: "Dif\xEDcil"
};
function createGame21(config) {
  return new TiraSogaGame(config);
}
function tiraSogaReadyZones() {
  return [
    { minX: 0, maxX: FLOOR_COLS - 1, minY: 0, maxY: redFieldLastRow },
    { minX: 0, maxX: FLOOR_COLS - 1, minY: blueFieldFirstRow, maxY: FLOOR_ROWS - 1 }
  ];
}
var TiraSogaGame = class {
  config;
  phase = "waiting";
  startedAtMillis = 0;
  nowMillis = 0;
  ropePosition = 0;
  teamScore = [0, 0];
  teamPresses = [0, 0];
  teamProgress = [0, 0];
  rounds = [];
  roundWinnerIndex = -1;
  winnerIndex = -1;
  roundWonAtMillis = 0;
  roundPauseUntilMillis = 0;
  finishAtMillis = 0;
  motionEventId = 0;
  readyZones = tiraSogaReadyZones();
  readyGate;
  heldTiles = Array.from({ length: FLOOR_COLS * FLOOR_ROWS }, () => false);
  flashUntil = Array.from({ length: FLOOR_COLS * FLOOR_ROWS }, () => 0);
  lastEvent = gameEvent("none", "Listos para tirar", 0);
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest21);
    this.readyGate = createPlayerReadyGate(manifest21.start, this.readyZones, this.config.nowMillis);
    this.resetMatch(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetMatch(nowMillis);
    this.lastEvent = gameEvent("ready", "Tira-Soga espera a rojo y azul", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    const readyTransition = this.readyGate.update(event);
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.recordEvents(this.applyReadyTransition(readyTransition, event.atMillis));
    }
    if (!event.pressed || this.phase !== "running" || this.roundWinnerIndex !== -1) {
      return [];
    }
    const tileIndex = this.tileIndex(event.x, event.y);
    const team = teamForTile(event.x, event.y);
    if (tileIndex === -1 || team === -1 || this.heldTiles[tileIndex]) {
      return [];
    }
    this.heldTiles[tileIndex] = true;
    this.flashUntil[tileIndex] = event.atMillis + 220;
    this.teamPresses[team] += 1;
    this.teamProgress[team] += 1;
    const threshold = this.pressesPerAdvance();
    if (this.teamProgress[team] < threshold) {
      return this.recordEvents([
        gameEvent(
          "hit",
          `${teamLabel(team)} suma ${this.teamProgress[team]} de ${threshold}`,
          event.atMillis
        )
      ]);
    }
    this.teamProgress[team] = 0;
    this.ropePosition += team === 0 ? -1 : 1;
    if (Math.abs(this.ropePosition) >= ropeLimit) {
      return this.recordEvents([this.finishRound(team, event.atMillis)]);
    }
    return this.recordEvents([
      gameEvent("hit", `${teamLabel(team)} tira de la soga`, event.atMillis)
    ]);
  }
  release(event) {
    this.nowMillis = event.atMillis;
    const tileIndex = this.tileIndex(event.x, event.y);
    if (tileIndex !== -1) {
      this.heldTiles[tileIndex] = false;
    }
    const readyTransition = this.readyGate.update({ ...event, pressed: false });
    if (this.phase === "waiting" || this.phase === "starting") {
      return this.recordEvents(this.applyReadyTransition(readyTransition, event.atMillis));
    }
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    const events = this.updateLifecycle(event.atMillis, this.readyGate.tick(event.atMillis));
    if (this.phase === "running" && this.roundWinnerIndex !== -1 && event.atMillis >= this.roundPauseUntilMillis) {
      this.startNextRound();
      events.push(gameEvent("start", `Ronda ${this.currentRound()}: \xA1a tirar!`, event.atMillis));
    }
    return this.recordEvents(events);
  }
  render() {
    const frame = createFrame("#05070a");
    if (this.phase === "waiting") {
      this.drawWaiting(frame);
      return frame;
    }
    if (this.phase === "starting") {
      this.drawStarting(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.drawGameWin(frame);
      return frame;
    }
    this.drawArena(frame);
    if (this.roundWinnerIndex !== -1) {
      this.drawRoundWin(frame);
    }
    return frame;
  }
  snapshot() {
    const readyState = this.readyGate.state(this.nowMillis);
    const players = this.scoredPlayers();
    const roundRemaining = Math.max(0, this.roundPauseUntilMillis - this.nowMillis);
    const gameRemaining = this.phase === "finished" ? Math.max(0, this.finishAtMillis + gameWinAnimationMillis5 - this.nowMillis) : 0;
    return {
      currentGame: manifest21.id,
      label: manifest21.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players,
      score: Math.max(...this.teamScore),
      lives: -1,
      elapsedMillis: this.phase === "waiting" || this.phase === "starting" ? 0 : Math.max(0, (this.phase === "finished" ? this.finishAtMillis : this.nowMillis) - this.startedAtMillis),
      remainingMillis: gameRemaining || roundRemaining,
      activeTargets: this.phase === "running" && this.roundWinnerIndex === -1 ? 2 : 0,
      success: this.phase === "finished",
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? readyState.countdownMillis : 0,
      readyPlayers: readyState.readyPlayers,
      requiredPlayers: readyState.requiredPlayers,
      matchTarget: roundsToWin2,
      roundHits: this.teamPresses[0] + this.teamPresses[1],
      lastRoundHits: this.rounds.at(-1)?.hits ?? 0,
      lastRoundWinner: this.rounds.at(-1)?.winnerLabel ?? "",
      difficulty: this.config.difficulty,
      difficultyLabel: difficultyLabels[this.config.difficulty] ?? "Medio",
      pressesPerAdvance: this.pressesPerAdvance(),
      ropePosition: this.ropePosition,
      ropeLimit,
      redPresses: this.teamPresses[0],
      bluePresses: this.teamPresses[1],
      redProgress: this.teamProgress[0],
      blueProgress: this.teamProgress[1],
      currentRound: this.currentRound(),
      totalRounds,
      rounds: this.rounds.map((round) => ({ ...round })),
      roundWinnerIndex: this.roundWinnerIndex,
      roundTransitionMillis: roundRemaining,
      winnerIndex: this.winnerIndex,
      motionEventId: this.motionEventId
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig(
      {
        ...this.config,
        ...config,
        options: { ...this.config.options, ...config.options }
      },
      manifest21
    );
    this.readyZones = tiraSogaReadyZones();
    this.readyGate = createPlayerReadyGate(manifest21.start, this.readyZones, this.config.nowMillis);
    this.resetMatch(this.config.nowMillis);
    this.lastEvent = gameEvent("ready", "Tira-Soga espera a rojo y azul", this.config.nowMillis);
  }
  playerReadyZones() {
    return this.readyZones.map((zone) => ({ ...zone }));
  }
  updateLifecycle(nowMillis, readyTransition) {
    if (this.phase === "finished") {
      if (nowMillis - this.finishAtMillis >= gameWinAnimationMillis5) {
        this.resetMatch(nowMillis);
        return [gameEvent("ready", "Nueva partida", nowMillis)];
      }
      return [];
    }
    return this.applyReadyTransition(readyTransition, nowMillis);
  }
  applyReadyTransition(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("start", "Rojo y azul listos", nowMillis)];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a tu campo iluminado", nowMillis)];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.motionEventId += 1;
      return [gameEvent("start", "Ronda 1: \xA1a tirar!", nowMillis)];
    }
    return [];
  }
  finishRound(team, atMillis) {
    const round = this.currentRound();
    const hits = this.teamPresses[0] + this.teamPresses[1];
    this.teamScore[team] += 1;
    this.roundWinnerIndex = team;
    this.roundWonAtMillis = atMillis;
    this.rounds.push({
      index: round,
      winnerIndex: team,
      winnerLabel: teamLabel(team),
      hits
    });
    this.motionEventId += 1;
    if (this.rounds.length >= totalRounds) {
      this.phase = "finished";
      this.finishAtMillis = atMillis;
      this.winnerIndex = this.teamScore[0] > this.teamScore[1] ? 0 : 1;
      return gameEvent("win", `${teamLabel(this.winnerIndex)} gana Tira-Soga`, atMillis);
    }
    this.roundPauseUntilMillis = atMillis + roundWinAnimationMillis2;
    return gameEvent("hit", `Ronda ${round} para ${teamLabel(team).toLowerCase()}`, atMillis);
  }
  startNextRound() {
    this.ropePosition = 0;
    this.teamPresses = [0, 0];
    this.teamProgress = [0, 0];
    this.roundWinnerIndex = -1;
    this.roundWonAtMillis = 0;
    this.roundPauseUntilMillis = 0;
    this.heldTiles.fill(false);
    this.flashUntil.fill(0);
    this.motionEventId += 1;
  }
  resetMatch(nowMillis) {
    this.readyGate.reset(nowMillis);
    this.phase = "waiting";
    this.startedAtMillis = nowMillis;
    this.nowMillis = nowMillis;
    this.ropePosition = 0;
    this.teamScore = [0, 0];
    this.teamPresses = [0, 0];
    this.teamProgress = [0, 0];
    this.rounds = [];
    this.roundWinnerIndex = -1;
    this.winnerIndex = -1;
    this.roundWonAtMillis = 0;
    this.roundPauseUntilMillis = 0;
    this.finishAtMillis = 0;
    this.heldTiles.fill(false);
    this.flashUntil.fill(0);
    this.motionEventId = 0;
    this.motionEventId += 1;
  }
  currentRound() {
    return Math.min(totalRounds, this.rounds.length + (this.roundWinnerIndex === -1 ? 1 : 0));
  }
  pressesPerAdvance() {
    return difficultyPresses[this.config.difficulty] ?? 2;
  }
  ropeTileY(position = this.ropePosition) {
    const normalized = (position + ropeLimit) / (ropeLimit * 2);
    return Math.round(normalized * (FLOOR_ROWS - 1));
  }
  scoredPlayers() {
    return [
      { index: 0, label: "Rojo", color: redColor3, score: this.teamScore[0], lives: -1 },
      { index: 1, label: "Azul", color: blueColor3, score: this.teamScore[1], lives: -1 }
    ];
  }
  tileIndex(x, y) {
    if (!Number.isInteger(x) || !Number.isInteger(y) || !inFloorBounds(x, y)) {
      return -1;
    }
    return y * FLOOR_COLS + x;
  }
  recordEvents(events) {
    const last = events.at(-1);
    if (last) {
      this.lastEvent = last;
    }
    return events;
  }
  drawWaiting(frame) {
    this.drawBaseFields(frame, "#410912", "#071f5a");
    const step = Math.floor(this.nowMillis / 180);
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      const team = teamForTile(0, y);
      if (team === -1 || (y + step) % 5 !== 0) {
        continue;
      }
      fillFrameRect(frame, 0, y, FLOOR_COLS, 1, team === 0 ? redFieldColor : blueFieldColor);
    }
    this.drawRope(frame, 0);
  }
  drawStarting(frame) {
    this.drawBaseFields(frame, redFieldColor, blueFieldColor);
    paintDiamondWave(frame, {
      bandWidth: 2,
      period: 7,
      step: Math.floor(this.nowMillis / 90),
      color: ({ y }) => y < FLOOR_ROWS / 2 ? "#ff7b84" : "#79a0ff"
    });
    this.drawRope(frame, 0);
  }
  drawArena(frame) {
    const highlightedTeam = this.roundWinnerIndex;
    this.drawBaseFields(
      frame,
      highlightedTeam === 0 ? redColor3 : redFieldColor,
      highlightedTeam === 1 ? blueColor3 : blueFieldColor
    );
    this.drawRope(frame, this.ropePosition);
    for (let index = 0; index < this.flashUntil.length; index += 1) {
      if ((this.flashUntil[index] ?? 0) <= this.nowMillis) {
        continue;
      }
      const x = index % FLOOR_COLS;
      const y = Math.floor(index / FLOOR_COLS);
      const team = teamForTile(x, y);
      if (team !== -1) {
        paintFrameCell(frame, x, y, team === 0 ? "#ff8a92" : "#73a0ff");
      }
    }
  }
  drawRoundWin(frame) {
    const winner = this.roundWinnerIndex;
    if (winner === -1) {
      return;
    }
    const elapsed = Math.max(0, this.nowMillis - this.roundWonAtMillis);
    const centerY = winner === 0 ? 0 : FLOOR_ROWS - 1;
    paintDiamondRing(frame, {
      centerX: (FLOOR_COLS - 1) / 2,
      centerY,
      color: knotColor,
      radius: elapsed / 80 % 24,
      thickness: 1.4
    });
    paintDiamondRing(frame, {
      centerX: (FLOOR_COLS - 1) / 2,
      centerY,
      color: centerLineColor,
      radius: (elapsed / 80 + 7) % 24,
      thickness: 1
    });
  }
  drawGameWin(frame) {
    const winnerColor = this.winnerIndex === 0 ? redColor3 : blueColor3;
    fillFrameRect(frame, 0, 0, FLOOR_COLS, FLOOR_ROWS, winnerColor);
    const elapsed = Math.max(0, this.nowMillis - this.finishAtMillis);
    paintDiamondWave(frame, {
      bandWidth: 2,
      period: 9,
      step: Math.floor(elapsed / 80),
      color: centerLineColor
    });
    for (let y = 0; y < FLOOR_ROWS; y += 1) {
      for (let x = 0; x < FLOOR_COLS; x += 1) {
        if ((x * 17 + y * 11 + Math.floor(elapsed / 120)) % 37 === 0) {
          paintFrameCell(frame, x, y, knotColor);
        }
      }
    }
  }
  drawBaseFields(frame, red2, blue2) {
    fillFrameRect(frame, 0, 0, FLOOR_COLS, redFieldLastRow + 1, red2);
    fillFrameRect(
      frame,
      0,
      blueFieldFirstRow,
      FLOOR_COLS,
      FLOOR_ROWS - blueFieldFirstRow,
      blue2
    );
    fillFrameRect(frame, 0, 15, FLOOR_COLS, 2, centerLineColor);
  }
  drawRope(frame, position) {
    fillFrameRect(frame, 7, 0, 2, FLOOR_ROWS, ropeColor);
    const knotY = this.ropeTileY(position);
    fillFrameRect(frame, 5, knotY, 6, 1, knotColor);
    if (knotY > 0) {
      fillFrameRect(frame, 7, knotY - 1, 2, 1, knotColor);
    }
    if (knotY < FLOOR_ROWS - 1) {
      fillFrameRect(frame, 7, knotY + 1, 2, 1, knotColor);
    }
  }
};
function teamForTile(x, y) {
  if (!Number.isInteger(x) || !Number.isInteger(y) || !inFloorBounds(x, y)) {
    return -1;
  }
  if (y <= redFieldLastRow) {
    return 0;
  }
  if (y >= blueFieldFirstRow) {
    return 1;
  }
  return -1;
}
function teamLabel(team) {
  return team === 0 ? "Rojo" : "Azul";
}

// games/whack-a-mole/src/manifest.ts
var manifest22 = {
  id: "whack-a-mole",
  label: "Atrapa al topo",
  description: "Persigue objetivos de colores por todo el suelo y atr\xE1palos antes de que se apaguen.",
  availability: { development: true, production: true },
  catalog: {
    category: "versus",
    color: "#36d9ff",
    durationLabel: "60 s",
    modeLabel: "Todos contra todos",
    audioLabel: "M\xFAsica + efectos",
    rules: ["Cada jugador ocupa su plataforma de salida", "Pisa los objetivos de tu color antes de que desaparezcan", "Cuanto m\xE1s r\xE1pido llegues, m\xE1s puntos ganas"]
  },
  players: { allowAny: false, min: 1, max: 8 },
  start: { mode: "player-ready", releaseGraceMillis: 1200 },
  config: { difficulty: { default: "medium", options: ["easy", "medium"] } },
  defaultDurationMillis: 6e4,
  display: { entry: "./display" },
  preview: {
    seed: 404,
    playerCount: 4,
    difficulty: "medium",
    actions: [{ atMillis: 100, type: "press", x: 0, y: 0 }, { atMillis: 100, type: "press", x: 12, y: 28 }, { atMillis: 100, type: "press", x: 0, y: 28 }, { atMillis: 100, type: "press", x: 12, y: 0 }],
    captureStartMillis: 2300,
    frameCount: 18,
    frameIntervalMillis: 120
  },
  tags: ["arcade", "reaction", "multiplayer", "typescript"]
};

// games/whack-a-mole/src/game.ts
var targetSize = 2;
var finishMillis2 = 4e3;
var hitFlashMillis = 500;
var baseLifeMillis = 3400;
var minLifeMillis = 2300;
function createGame22(config) {
  return new WhackAMoleGame(config);
}
var WhackAMoleGame = class {
  config;
  rng;
  readyZones;
  readyGate;
  players = [];
  targets = [];
  lastPositions = [];
  catchUp = [];
  hitFlash = [];
  phase = "waiting";
  nowMillis = 0;
  startedAtMillis = 0;
  finishAtMillis = 0;
  winnerIndex = -1;
  motionEventId = 0;
  lastEvent = gameEvent("none", "Listo", 0);
  constructor(config) {
    this.config = normalizeGameConfig(config, manifest22);
    this.rng = createSeededRng(this.config.seed);
    this.readyZones = readyZonesForPlayers(this.config.playerCount);
    this.readyGate = createPlayerReadyGate(manifest22.start, this.readyZones, this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  init(nowMillis) {
    this.resetState(nowMillis);
    this.lastEvent = gameEvent("ready", "Busca tu plataforma de color", nowMillis);
    return [this.lastEvent];
  }
  press(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.record(this.applyReady(this.readyGate.update(event), event.atMillis));
    if (this.phase !== "running" || !event.pressed) return [];
    const targetIndex = this.targets.findIndex((target2) => event.atMillis < target2.deadlineMillis && containsTarget(target2, event.x, event.y));
    if (targetIndex < 0) return this.record([gameEvent("miss", "No hab\xEDa ning\xFAn topo ah\xED", event.atMillis)]);
    const target = this.targets[targetIndex];
    const player = this.players[target.playerIndex];
    const points = targetScore(target, event.atMillis);
    player.score += points;
    player.hits += 1;
    player.lastPoints = points;
    for (let dy = 0; dy < targetSize; dy += 1) for (let dx = 0; dx < targetSize; dx += 1) this.hitFlash.push({ x: target.x + dx, y: target.y + dy, untilMillis: event.atMillis + hitFlashMillis, color: player.color });
    this.lastPositions[target.playerIndex] = { x: target.x, y: target.y };
    this.targets.splice(targetIndex, 1);
    this.spawnTarget(target.playerIndex, event.atMillis);
    this.motionEventId += 1;
    return this.record([gameEvent("hit", `${player.label} +${points}`, event.atMillis)]);
  }
  release(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.record(this.applyReady(this.readyGate.update({ ...event, pressed: false }), event.atMillis));
    return [];
  }
  tick(event) {
    this.nowMillis = event.atMillis;
    if (this.phase === "waiting" || this.phase === "starting") return this.record(this.applyReady(this.readyGate.tick(event.atMillis), event.atMillis));
    if (this.phase === "finished") {
      if (event.atMillis - this.finishAtMillis >= finishMillis2) {
        this.resetState(event.atMillis);
        return this.record([gameEvent("ready", "Nueva caza", event.atMillis)]);
      }
      return [];
    }
    this.hitFlash = this.hitFlash.filter((flash) => flash.untilMillis > event.atMillis);
    const expired = this.targets.filter((target) => event.atMillis >= target.deadlineMillis);
    for (const target of expired) {
      this.catchUp[target.playerIndex] = true;
      this.targets = this.targets.filter((candidate) => candidate !== target);
      this.spawnTarget(target.playerIndex, event.atMillis);
    }
    if (this.remainingMillis() <= 0) return this.finish(event.atMillis);
    return [];
  }
  render() {
    const frame = createFrame("#05070a");
    if (this.phase === "waiting" || this.phase === "starting") {
      this.drawReadiness(frame);
      return frame;
    }
    if (this.phase === "finished") {
      this.drawFinish(frame);
      return frame;
    }
    for (const target of this.targets) {
      const player = this.players[target.playerIndex];
      const ratio = clamp((target.deadlineMillis - this.nowMillis) / Math.max(1, target.deadlineMillis - target.bornMillis), 0.16, 1);
      const color = scaleHex(player.color, ratio);
      for (let dy = 0; dy < targetSize; dy += 1) for (let dx = 0; dx < targetSize; dx += 1) paintFrameCell(frame, target.x + dx, target.y + dy, color);
    }
    for (const flash of this.hitFlash) paintFrameCell(frame, flash.x, flash.y, "#ffffff");
    return frame;
  }
  snapshot() {
    const ready = this.readyGate.state(this.nowMillis);
    return {
      currentGame: manifest22.id,
      label: manifest22.label,
      phase: this.phase,
      playerCount: this.config.playerCount,
      players: this.players.map((player) => ({ index: player.index, label: player.label, color: player.color, score: player.score, lives: -1 })),
      score: this.players.reduce((sum, player) => sum + player.score, 0),
      lives: -1,
      elapsedMillis: this.elapsedMillis(),
      remainingMillis: this.phase === "finished" ? Math.max(0, this.finishAtMillis + finishMillis2 - this.nowMillis) : this.remainingMillis(),
      activeTargets: this.targets.length,
      success: this.phase === "finished",
      lastEventCue: this.lastEvent.cue,
      lastEventMessage: this.lastEvent.message,
      countdownMillis: this.phase === "starting" ? ready.countdownMillis : 0,
      readyPlayers: ready.readyPlayers,
      requiredPlayers: ready.requiredPlayers,
      targets: this.targets.map((target) => ({ ...target, remainingMillis: Math.max(0, target.deadlineMillis - this.nowMillis) })),
      playerProgress: this.players.map((player) => ({ ...player })),
      readyPlayerIndices: this.readyZones.flatMap((_, index) => this.readyGate.zoneReady(index, this.nowMillis) ? [index] : []),
      winnerIndex: this.winnerIndex,
      winnerLabel: this.players[this.winnerIndex]?.label ?? "",
      motionEventId: this.motionEventId
    };
  }
  reset(config = {}) {
    this.config = normalizeGameConfig({ ...this.config, ...config }, manifest22);
    this.rng = createSeededRng(this.config.seed);
    this.readyZones = readyZonesForPlayers(this.config.playerCount);
    this.readyGate = createPlayerReadyGate(manifest22.start, this.readyZones, this.config.nowMillis);
    this.resetState(this.config.nowMillis);
  }
  playerReadyZones() {
    return this.readyZones.map((zone) => ({ ...zone }));
  }
  resetState(nowMillis) {
    this.rng = createSeededRng(this.config.seed);
    this.readyGate.reset(nowMillis);
    const roster = defaultPlayers(this.config.playerCount, this.config.players);
    this.players = roster.map((player, index) => ({ index, label: player.label === `Player ${index + 1}` ? `Jugador ${index + 1}` : player.label, color: player.color, score: 0, hits: 0, lastPoints: 0 }));
    this.targets = [];
    this.lastPositions = [];
    this.catchUp = [];
    this.hitFlash = [];
    this.phase = "waiting";
    this.nowMillis = nowMillis;
    this.startedAtMillis = nowMillis;
    this.finishAtMillis = 0;
    this.winnerIndex = -1;
    this.motionEventId = 0;
    this.lastEvent = gameEvent("ready", "Busca tu plataforma de color", nowMillis);
  }
  applyReady(transition, nowMillis) {
    if (transition === "players-ready") {
      this.phase = "starting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Todos listos para cazar", nowMillis)];
    }
    if (transition === "players-left") {
      this.phase = "waiting";
      this.motionEventId += 1;
      return [gameEvent("ready", "Vuelve a tu plataforma", nowMillis)];
    }
    if (transition === "started") {
      this.phase = "running";
      this.startedAtMillis = nowMillis;
      this.targets = [];
      this.players.forEach((_, index) => this.spawnTarget(index, nowMillis));
      this.motionEventId += 1;
      return [gameEvent("start", "\xA1Atrapa los topos de colores!", nowMillis)];
    }
    return [];
  }
  spawnTarget(playerIndex, nowMillis) {
    let chosen = { x: this.rng.int(FLOOR_COLS - 1), y: this.rng.int(FLOOR_ROWS - 1) };
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const candidate = { x: this.rng.int(FLOOR_COLS - targetSize + 1), y: this.rng.int(FLOOR_ROWS - targetSize + 1) };
      const last = this.lastPositions[playerIndex];
      const distance = last ? (candidate.x - last.x) ** 2 + (candidate.y - last.y) ** 2 : 64;
      const clear = this.targets.every((target) => Math.abs(candidate.x - target.x) >= 4 || Math.abs(candidate.y - target.y) >= 4);
      if (clear && distance >= 25 && distance <= 225) {
        chosen = candidate;
        break;
      }
    }
    const interval = this.targetInterval();
    const extra = this.catchUp[playerIndex] ? 2e3 : 0;
    this.catchUp[playerIndex] = false;
    this.targets.push({ playerIndex, ...chosen, bornMillis: nowMillis, deadlineMillis: nowMillis + interval + 1e3 + extra });
  }
  targetInterval() {
    const progress = clamp(this.elapsedMillis() / this.config.durationMillis, 0, 1);
    const base = baseLifeMillis - 1e3;
    const drop = baseLifeMillis - minLifeMillis;
    const difficulty = this.config.difficulty === "easy" ? 1.18 : 1;
    return (base - progress * drop) * difficulty;
  }
  finish(atMillis) {
    this.phase = "finished";
    this.finishAtMillis = atMillis;
    this.targets = [];
    this.winnerIndex = this.players.reduce((best, player, index) => player.score > (this.players[best]?.score ?? -1) ? index : best, 0);
    this.motionEventId += 1;
    return this.record([gameEvent("win", `\xA1Gana ${this.players[this.winnerIndex]?.label}!`, atMillis)]);
  }
  elapsedMillis() {
    return this.phase === "waiting" || this.phase === "starting" ? 0 : Math.max(0, this.nowMillis - this.startedAtMillis);
  }
  remainingMillis() {
    return Math.max(0, this.config.durationMillis - this.elapsedMillis());
  }
  record(events) {
    const latest = events.at(-1);
    if (latest) this.lastEvent = latest;
    return events;
  }
  drawReadiness(frame) {
    this.players.forEach((player, index) => {
      const zone = this.readyZones[index];
      const ready = this.readyGate.zoneReady(index, this.nowMillis);
      for (let y = zone.minY; y <= zone.maxY; y += 1) for (let x = zone.minX; x <= zone.maxX; x += 1) if (ready || (x + y + Math.floor(this.nowMillis / 120)) % 4 < 2) paintFrameCell(frame, x, y, ready ? "#ffffff" : player.color);
    });
  }
  drawFinish(frame) {
    const winner = this.players[this.winnerIndex];
    const step = Math.floor((this.nowMillis - this.finishAtMillis) / 90);
    for (let y = 0; y < FLOOR_ROWS; y += 1) for (let x = 0; x < FLOOR_COLS; x += 1) if ((x * 2 + y + step) % 7 < 3) paintFrameCell(frame, x, y, winner?.color ?? "#36d9ff");
  }
};
function readyZonesForPlayers(count) {
  const points = [[0, 0], [12, 28], [0, 28], [12, 0], [0, 14], [12, 14], [6, 0], [6, 28]];
  return points.slice(0, clamp(Math.trunc(count), 1, 8)).map(([x = 0, y = 0]) => ({ minX: x, maxX: x + 3, minY: y, maxY: y + 3 }));
}
function containsTarget(target, x, y) {
  return x >= target.x && x < target.x + targetSize && y >= target.y && y < target.y + targetSize;
}
function targetScore(target, nowMillis) {
  const total = Math.max(1, target.deadlineMillis - target.bornMillis);
  return 4 + Math.ceil(clamp((target.deadlineMillis - nowMillis) / total, 0, 1) * 8);
}
function scaleHex(color, factor) {
  const value = color.replace("#", "");
  const parts = [0, 2, 4].map((offset) => Math.round(Number.parseInt(value.slice(offset, offset + 2), 16) * factor).toString(16).padStart(2, "0"));
  return `#${parts.join("")}`;
}

// packages/runtime/src/gameplayRegistry.ts
var registeredGames = [
  { manifest, createGame },
  { manifest: manifest2, createGame: createGame2 },
  { manifest: manifest3, createGame: createGame3 },
  { manifest: manifest4, createGame: createGame4 },
  { manifest: manifest5, createGame: createGame5 },
  { manifest: manifest6, createGame: createGame6 },
  { manifest: manifest7, createGame: createGame7 },
  { manifest: manifest8, createGame: createGame8 },
  { manifest: manifest9, createGame: createGame9 },
  { manifest: manifest10, createGame: createGame10 },
  { manifest: manifest11, createGame: createGame11 },
  { manifest: manifest12, createGame: createGame12 },
  { manifest: manifest13, createGame: createGame13 },
  { manifest: manifest14, createGame: createGame14 },
  { manifest: manifest15, createGame: createGame15 },
  { manifest: manifest16, createGame: createGame16 },
  { manifest: manifest17, createGame: createGame17 },
  { manifest: manifest18, createGame: createGame18 },
  { manifest: manifest19, createGame: createGame19 },
  { manifest: manifest20, createGame: createGame20 },
  { manifest: manifest21, createGame: createGame21 },
  { manifest: manifest22, createGame: createGame22 }
];
var gameplayRegistry = buildGameplayRegistry(registeredGames);
var gamePackageRegistry = new Map(
  registeredGames.map((game) => [gameManifestSlug(game.manifest), game])
);
var gameCatalog = registeredGames.map((game) => game.manifest).sort((left, right) => left.id.localeCompare(right.id));
function buildGameplayRegistry(games) {
  const registry = /* @__PURE__ */ new Map();
  for (const game of games) {
    for (const key of gameManifestLookupKeys(game.manifest)) {
      const existing = registry.get(key);
      if (existing && existing !== game) {
        throw new Error(`game identity collision: ${key} is declared by ${existing.manifest.id} and ${game.manifest.id}`);
      }
      registry.set(key, game);
    }
  }
  return registry;
}

// packages/runtime/src/session.ts
var GameSession = class {
  engine = null;
  gameId = "";
  initialConfig = null;
  development = false;
  paused = false;
  held = /* @__PURE__ */ new Set();
  get active() {
    return this.engine !== null;
  }
  select(selection) {
    const lookupKey = normalizeGameLookupKey(selection.gameId);
    const module = gameplayRegistry.get(lookupKey);
    if (!module) throw new Error(`unknown game: ${lookupKey}`);
    if (!module.manifest.availability.production && selection.development !== true) {
      throw new Error(`game is not production eligible: ${lookupKey}`);
    }
    const config = normalizeGameConfig(selection, module.manifest);
    const engine = createSessionEngine(module.createGame(config), config.nowMillis);
    this.engine = engine;
    this.gameId = module.manifest.id;
    this.initialConfig = config;
    this.development = selection.development === true;
    this.paused = false;
    this.held.clear();
    return this.toState(engine.state);
  }
  press(x, y, atMillis) {
    return this.input(x, y, true, atMillis);
  }
  release(x, y, atMillis) {
    return this.input(x, y, false, atMillis);
  }
  tick(atMillis) {
    const engine = this.requireEngine();
    if (this.paused) return this.toState(engine.refresh());
    return this.toState(engine.tickTo(finiteMillis(atMillis, engine.clockMillis)));
  }
  pause(atMillis) {
    const engine = this.requireEngine();
    if (!this.paused) {
      this.releaseAll(finiteMillis(atMillis, engine.clockMillis));
      this.paused = true;
    }
    return this.toState(engine.refresh());
  }
  resume() {
    const engine = this.requireEngine();
    this.paused = false;
    return this.toState(engine.refresh());
  }
  restart(nowMillis = 0) {
    if (!this.initialConfig) throw new Error("game session has no active game");
    const module = gameplayRegistry.get(normalizeGameLookupKey(this.gameId));
    if (!module) throw new Error(`unknown game: ${this.gameId}`);
    if (!module.manifest.availability.production && !this.development) {
      throw new Error(`game is not production eligible: ${this.gameId}`);
    }
    const config = { ...this.initialConfig, nowMillis: finiteMillis(nowMillis, 0) };
    const engine = createSessionEngine(module.createGame(config), config.nowMillis);
    this.engine = engine;
    this.paused = false;
    this.held.clear();
    return this.toState(engine.state);
  }
  stop() {
    this.engine = null;
    this.gameId = "";
    this.initialConfig = null;
    this.development = false;
    this.paused = false;
    this.held.clear();
  }
  state() {
    return this.toState(this.requireEngine().state);
  }
  input(x, y, pressed, atMillis) {
    const engine = this.requireEngine();
    const boundedX = boundedInteger(x, 0, 15, "x");
    const boundedY = boundedInteger(y, 0, 31, "y");
    if (this.paused) return this.toState(engine.refresh());
    const timestamp = finiteMillis(atMillis, engine.clockMillis);
    const key = `${boundedX},${boundedY}`;
    const state = pressed ? engine.press(boundedX, boundedY, timestamp) : engine.release(boundedX, boundedY, timestamp);
    if (pressed) this.held.add(key);
    else this.held.delete(key);
    return this.toState(state);
  }
  releaseAll(atMillis) {
    const engine = this.requireEngine();
    for (const key of this.held) {
      const [x, y] = key.split(",").map(Number);
      engine.release(x ?? 0, y ?? 0, atMillis);
    }
    this.held.clear();
  }
  requireEngine() {
    if (!this.engine) throw new Error("game session has no active game");
    return this.engine;
  }
  toState(state) {
    return {
      gameId: this.gameId,
      clockMillis: state.clockMillis,
      paused: this.paused,
      frame: state.frame,
      snapshot: state.snapshot,
      events: state.events
    };
  }
};
function createSessionEngine(game, nowMillis) {
  const events = game.init(nowMillis);
  return createGameEngine(game, { initialEvents: events, nowMillis });
}
function boundedInteger(value, min, max, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${label} must be an integer from ${min} to ${max}`);
  }
  return number;
}
function finiteMillis(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

// apps/venue-runtime/src/controllerClient.ts
import { connect } from "node:net";

// apps/venue-runtime/src/controllerProtocol.ts
var controllerProtocolVersion = 2;
var floorWidth = 16;
var floorHeight = 32;
var floorRgbBytes = floorWidth * floorHeight * 3;
var pressureBitsetBytes = floorWidth * floorHeight / 8;
var maxDelimitedMessageBytes = 64 * 1024;
function encodeRuntimeMessage(message) {
  const payload = message.type === "hello" ? encodeRuntimeHello(message.hello) : encodeRuntimeFrame(message.frame);
  return fieldBytes(message.type === "hello" ? 1 : 3, payload);
}
function decodeControllerMessage(bytes) {
  const envelope = oneofEnvelope(bytes, "controller message");
  if (envelope.field === 2) return { type: "hello", hello: decodeControllerHello(envelope.payload) };
  if (envelope.field === 4) return { type: "pressureChange", pressureChange: decodePressureChange(envelope.payload) };
  if (envelope.field === 5) return decodePresentedFrame(envelope.payload);
  if (envelope.field === 6) return { type: "status" };
  throw new Error(`unknown controller message field: ${envelope.field}`);
}
function encodeDelimited(payload) {
  if (payload.byteLength > maxDelimitedMessageBytes) throw new Error("protobuf message exceeds 64 KiB limit");
  return concat([encodeVarint(BigInt(payload.byteLength)), payload]);
}
var DelimitedMessageDecoder = class {
  buffered = new Uint8Array();
  push(chunk) {
    if (chunk.byteLength === 0) return [];
    this.buffered = concat([this.buffered, chunk]);
    const messages = [];
    let offset = 0;
    while (offset < this.buffered.byteLength) {
      const prefix = tryDecodeVarint(this.buffered, offset);
      if (!prefix) break;
      if (prefix.value > BigInt(maxDelimitedMessageBytes)) throw new Error("protobuf message exceeds 64 KiB limit");
      const length = Number(prefix.value);
      const end = prefix.next + length;
      if (end > this.buffered.byteLength) break;
      messages.push(this.buffered.slice(prefix.next, end));
      offset = end;
    }
    this.buffered = this.buffered.slice(offset);
    if (this.buffered.byteLength > maxDelimitedMessageBytes + 10) {
      throw new Error("incomplete delimited protobuf message exceeds limit");
    }
    return messages;
  }
  reset() {
    this.buffered = new Uint8Array();
  }
};
function validateControllerHello(hello) {
  if (hello.protocolVersion !== controllerProtocolVersion) {
    throw new Error(`unsupported controller protocol: ${hello.protocolVersion}`);
  }
  if (hello.width !== floorWidth || hello.height !== floorHeight) {
    throw new Error(`unsupported controller floor: ${hello.width}x${hello.height}`);
  }
  if (!hello.controllerId.trim() || hello.controllerId.length > 256) throw new Error("controller id is invalid");
  if (!Number.isInteger(hello.refreshFps) || hello.refreshFps <= 0) throw new Error("controller refresh fps is invalid");
}
function validateRuntimeFrame(frame) {
  if (frame.width !== floorWidth || frame.height !== floorHeight) {
    throw new Error(`runtime frame must be ${floorWidth}x${floorHeight}`);
  }
  if (frame.rgb.byteLength !== floorRgbBytes) throw new Error(`runtime frame must contain ${floorRgbBytes} RGB bytes`);
}
function pressureAt(bitset, x, y) {
  const index = y * floorWidth + x;
  const byte2 = bitset[index >> 3];
  return byte2 !== void 0 && (byte2 & 1 << (index & 7)) !== 0;
}
function encodeRuntimeHello(value) {
  if (value.sourceRevision.length > 128) throw new Error("source revision exceeds limit");
  return concat([
    fieldVarint(1, value.protocolVersion),
    fieldString(2, value.sourceRevision)
  ]);
}
function encodeRuntimeFrame(value) {
  return concat([
    fieldVarint(1, value.sequence),
    fieldVarint(2, value.unixNanos),
    fieldVarint(3, value.width),
    fieldVarint(4, value.height),
    fieldBytes(5, value.rgb)
  ]);
}
function decodeControllerHello(bytes) {
  const fields = fieldsByNumber(bytes);
  const hello = {
    protocolVersion: numberField(fields, 1),
    controllerId: stringField(fields, 2),
    width: numberField(fields, 3),
    height: numberField(fields, 4),
    refreshFps: numberField(fields, 5)
  };
  return hello;
}
function decodePresentedFrame(bytes) {
  const fields = fieldsByNumber(bytes);
  const width = numberField(fields, 4);
  const height = numberField(fields, 5);
  const pressureBits = bytesField(fields, 7);
  if (width !== floorWidth || height !== floorHeight) {
    throw new Error(`unsupported presented floor: ${width}x${height}`);
  }
  if (pressureBits.byteLength !== pressureBitsetBytes) {
    throw new Error(`presented pressure bitset must be ${pressureBitsetBytes} bytes`);
  }
  return {
    type: "presentedFrame",
    pressureBits,
    presentedUnixNanos: bigintField(fields, 3)
  };
}
function decodePressureChange(bytes) {
  const fields = fieldsByNumber(bytes);
  const value = {
    sequence: bigintField(fields, 1),
    unixNanos: bigintField(fields, 2),
    x: numberField(fields, 3),
    y: numberField(fields, 4),
    pressed: bigintField(fields, 5) !== 0n
  };
  if (!Number.isInteger(value.x) || value.x < 0 || value.x >= floorWidth || !Number.isInteger(value.y) || value.y < 0 || value.y >= floorHeight) {
    throw new Error(`pressure coordinate out of bounds: ${value.x},${value.y}`);
  }
  return value;
}
function oneofEnvelope(bytes, label) {
  const fields = fieldsByNumber(bytes);
  const candidates = [...fields.entries()].filter(([field2]) => field2 >= 1 && field2 <= 6);
  if (candidates.length !== 1 || candidates[0]?.[1].length !== 1) throw new Error(`${label} must contain exactly one payload`);
  const [field, values] = candidates[0];
  return { field, payload: bytesValue(values[0], `${label} payload`) };
}
function fieldsByNumber(bytes) {
  if (bytes.byteLength > maxDelimitedMessageBytes) throw new Error("protobuf message exceeds 64 KiB limit");
  const result = /* @__PURE__ */ new Map();
  let offset = 0;
  while (offset < bytes.byteLength) {
    const tag = decodeVarint(bytes, offset);
    offset = tag.next;
    const field = Number(tag.value >> 3n);
    const wire = Number(tag.value & 7n);
    if (field < 1) throw new Error("invalid protobuf field number");
    let decoded;
    if (wire === 0) {
      const value = decodeVarint(bytes, offset);
      offset = value.next;
      decoded = { wire, varint: value.value };
    } else if (wire === 2) {
      const length = decodeVarint(bytes, offset);
      offset = length.next;
      if (length.value > BigInt(maxDelimitedMessageBytes)) throw new Error("protobuf bytes field exceeds limit");
      const end = offset + Number(length.value);
      if (end > bytes.byteLength) throw new Error("truncated protobuf bytes field");
      decoded = { wire, bytes: bytes.slice(offset, end) };
      offset = end;
    } else if (wire === 1) {
      if (offset + 8 > bytes.byteLength) throw new Error("truncated protobuf fixed64 field");
      offset += 8;
      decoded = { wire };
    } else if (wire === 5) {
      if (offset + 4 > bytes.byteLength) throw new Error("truncated protobuf fixed32 field");
      offset += 4;
      decoded = { wire };
    } else {
      throw new Error(`unsupported protobuf wire type: ${wire}`);
    }
    const values = result.get(field) ?? [];
    values.push(decoded);
    result.set(field, values);
  }
  return result;
}
function bigintField(fields, field) {
  const value = fields.get(field)?.at(-1);
  if (!value) return 0n;
  if (value.wire !== 0 || value.varint === void 0) throw new Error(`protobuf field ${field} must be varint`);
  return value.varint;
}
function numberField(fields, field) {
  const value = bigintField(fields, field);
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`protobuf field ${field} exceeds safe integer range`);
  return Number(value);
}
function bytesField(fields, field) {
  const value = fields.get(field)?.at(-1);
  return value ? bytesValue(value, `protobuf field ${field}`) : new Uint8Array();
}
function bytesValue(value, label) {
  if (!value || value.wire !== 2 || value.bytes === void 0) throw new Error(`${label} must be length-delimited`);
  return value.bytes;
}
function stringField(fields, field) {
  return new TextDecoder("utf-8", { fatal: true }).decode(bytesField(fields, field));
}
function fieldVarint(field, value) {
  const integer = typeof value === "bigint" ? value : BigInt(value);
  if (integer < 0n) throw new Error("protobuf varint cannot be negative");
  return concat([encodeVarint(BigInt(field << 3)), encodeVarint(integer)]);
}
function fieldString(field, value) {
  return fieldBytes(field, new TextEncoder().encode(value));
}
function fieldBytes(field, value) {
  return concat([encodeVarint(BigInt(field << 3 | 2)), encodeVarint(BigInt(value.byteLength)), value]);
}
function encodeVarint(value) {
  if (value < 0n) throw new Error("protobuf varint cannot be negative");
  const bytes = [];
  let remaining = value;
  do {
    let byte2 = Number(remaining & 0x7fn);
    remaining >>= 7n;
    if (remaining !== 0n) byte2 |= 128;
    bytes.push(byte2);
  } while (remaining !== 0n);
  return Uint8Array.from(bytes);
}
function tryDecodeVarint(bytes, offset) {
  let value = 0n;
  for (let index = 0; index < 10; index += 1) {
    const byte2 = bytes[offset + index];
    if (byte2 === void 0) return null;
    value |= BigInt(byte2 & 127) << BigInt(index * 7);
    if ((byte2 & 128) === 0) return { value, next: offset + index + 1 };
  }
  throw new Error("protobuf varint exceeds 10 bytes");
}
function decodeVarint(bytes, offset) {
  const value = tryDecodeVarint(bytes, offset);
  if (!value) throw new Error("truncated protobuf varint");
  return value;
}
function concat(chunks) {
  const output = new Uint8Array(chunks.reduce((total, chunk) => total + chunk.byteLength, 0));
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

// apps/venue-runtime/src/controllerClient.ts
var ControllerClient = class {
  constructor(options) {
    this.options = options;
  }
  options;
  socket = null;
  decoder = new DelimitedMessageDecoder();
  reconnectTimer = null;
  reconnectMillis = 250;
  stopping = false;
  helloReceived = false;
  blocked = false;
  pendingFrame = null;
  pressed = new Uint8Array(floorWidth * floorHeight / 8);
  pressureSequence = 0n;
  controllerIdValue = "";
  get connected() {
    return this.helloReceived;
  }
  get controllerId() {
    return this.controllerIdValue;
  }
  start() {
    if (this.socket || this.reconnectTimer) return;
    this.stopping = false;
    this.open();
  }
  stop() {
    this.stopping = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.socket?.destroy();
    this.socket = null;
    this.setDisconnected();
  }
  sendFrame(frame) {
    validateRuntimeFrame(frame);
    if (!this.socket || !this.helloReceived || this.blocked) {
      this.pendingFrame = frame;
      return;
    }
    this.writeFrame(frame);
  }
  open() {
    const target = parseControllerAddress(this.options.address);
    const socket = connect(target);
    this.socket = socket;
    this.decoder.reset();
    this.helloReceived = false;
    this.blocked = false;
    socket.setNoDelay(true);
    socket.on("connect", () => {
      const hello = encodeDelimited(encodeRuntimeMessage({
        type: "hello",
        hello: { protocolVersion: controllerProtocolVersion, sourceRevision: this.options.sourceRevision }
      }));
      this.blocked = !socket.write(hello);
    });
    socket.on("data", (chunk) => {
      try {
        for (const payload of this.decoder.push(chunk)) this.handlePayload(payload);
      } catch (error) {
        this.options.log?.("invalid controller v2 message", error);
        socket.destroy(error instanceof Error ? error : new Error(String(error)));
      }
    });
    socket.on("drain", () => {
      this.blocked = false;
      const pending = this.pendingFrame;
      this.pendingFrame = null;
      if (pending && this.helloReceived) this.writeFrame(pending);
    });
    socket.on("error", (error) => this.options.log?.("controller connection error", error));
    socket.on("close", () => {
      if (this.socket !== socket) return;
      this.socket = null;
      this.setDisconnected();
      if (!this.stopping) this.scheduleReconnect();
    });
  }
  handlePayload(payload) {
    const message = decodeControllerMessage(payload);
    if (message.type === "hello") {
      validateControllerHello(message.hello);
      this.helloReceived = true;
      this.controllerIdValue = message.hello.controllerId;
      this.reconnectMillis = 250;
      this.options.onConnectionChange?.(true, this.controllerIdValue);
      if (!this.blocked && this.pendingFrame) {
        const pending = this.pendingFrame;
        this.pendingFrame = null;
        this.writeFrame(pending);
      }
      return;
    }
    if (message.type === "presentedFrame") {
      if (!this.helloReceived) throw new Error("controller hello must precede presented frames");
      this.resyncPressure(message.pressureBits, this.pressureSequence, message.presentedUnixNanos);
      return;
    }
    if (message.type === "status") return;
    if (!this.helloReceived) throw new Error("controller hello must precede pressure changes");
    if (message.pressureChange.sequence <= this.pressureSequence) return;
    if (pressureSequenceHasGap(this.pressureSequence, message.pressureChange.sequence)) {
      this.options.log?.(`pressure sequence gap: ${this.pressureSequence} -> ${message.pressureChange.sequence}`);
    }
    this.pressureSequence = message.pressureChange.sequence;
    const { x, y, pressed, unixNanos, sequence } = message.pressureChange;
    if (pressureAt(this.pressed, x, y) === pressed) return;
    setPressure(this.pressed, x, y, pressed);
    this.options.onPressure({ x, y, pressed, unixNanos, sequence });
  }
  resyncPressure(authoritative, sequence, unixNanos) {
    for (const input of reconcilePressure(this.pressed, authoritative, sequence, unixNanos)) this.options.onPressure(input);
    this.pressed = authoritative.slice();
    this.pressureSequence = sequence;
  }
  writeFrame(frame) {
    const socket = this.socket;
    if (!socket) {
      this.pendingFrame = frame;
      return;
    }
    this.blocked = !socket.write(encodeDelimited(encodeRuntimeMessage({ type: "frame", frame })));
  }
  setDisconnected() {
    const wasConnected = this.helloReceived;
    this.helloReceived = false;
    this.controllerIdValue = "";
    this.blocked = false;
    if (wasConnected) this.options.onConnectionChange?.(false, "");
  }
  scheduleReconnect() {
    const delay = this.reconnectMillis;
    this.reconnectMillis = Math.min(5e3, this.reconnectMillis * 2);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.stopping) this.open();
    }, delay);
    this.reconnectTimer.unref();
  }
};
function pressureSequenceHasGap(current, incoming) {
  return incoming !== current + 1n;
}
function reconcilePressure(previous, authoritative, sequence, unixNanos = BigInt(Date.now()) * 1000000n) {
  const changes = [];
  for (let y = 0; y < floorHeight; y += 1) {
    for (let x = 0; x < floorWidth; x += 1) {
      const before = pressureAt(previous, x, y);
      const after = pressureAt(authoritative, x, y);
      if (before !== after) changes.push({ x, y, pressed: after, unixNanos, sequence });
    }
  }
  return changes;
}
function setPressure(bitset, x, y, pressed) {
  const index = y * floorWidth + x;
  const byteIndex = index >> 3;
  const value = bitset[byteIndex] ?? 0;
  bitset[byteIndex] = pressed ? value | 1 << (index & 7) : value & ~(1 << (index & 7));
}
function parseControllerAddress(address2) {
  const candidate = address2.trim().replace(/^tcp:\/\//u, "");
  const bracketed = candidate.match(/^\[([^\]]+)\]:(\d+)$/u);
  const plain = candidate.match(/^([^:]+):(\d+)$/u);
  const match = bracketed ?? plain;
  if (!match) throw new Error(`invalid controller address: ${address2}`);
  const port = Number(match[2]);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`invalid controller port: ${match[2]}`);
  return { host: match[1] ?? "", port };
}

// apps/venue-runtime/src/venueRuntime.ts
var blackFrame = {
  width: FLOOR_COLS,
  height: FLOOR_ROWS,
  cells: Array.from({ length: FLOOR_COLS * FLOOR_ROWS }, (_, index) => ({
    x: index % FLOOR_COLS,
    y: Math.floor(index / FLOOR_COLS),
    color: "#000000"
  }))
};
var RevisionMismatchError = class extends Error {
};
var RequestValidationError = class extends Error {
};
var VenueRuntime = class {
  constructor(options) {
    this.options = options;
    if (!/^[0-9a-f]{40}$/u.test(options.sourceRevision)) throw new Error("source revision must be a 40-character git hash");
    this.controller = new ControllerClient({
      address: options.controllerAddress,
      sourceRevision: options.sourceRevision,
      onPressure: (input) => this.applyPressure(input),
      onConnectionChange: (connected, id) => {
        this.controllerConnected = connected;
        this.controllerId = id;
      },
      log: options.log
    });
  }
  options;
  session = new GameSession();
  controller;
  displayListeners = /* @__PURE__ */ new Set();
  statusListeners = /* @__PURE__ */ new Set();
  menuListeners = /* @__PURE__ */ new Set();
  runId = randomUUID();
  stateRevision = 1;
  state = null;
  selection = null;
  gameStartedAt = performance.now();
  pauseStartedAt = 0;
  sessionStartedUnix = 0;
  gameSessionId = "";
  frameSequence = 0n;
  lastDisplayPublishedAt = 0;
  timer = null;
  lastPressureUnix = 0;
  controllerConnected = false;
  controllerId = "";
  heldPressure = /* @__PURE__ */ new Set();
  menuState = { kioskId: "", version: 0, updatedUnixMillis: 0, snapshot: null };
  displayClientReport = null;
  displayClientReceivedUnixMillis = 0;
  start() {
    if (this.timer) return;
    this.controller.start();
    this.timer = setInterval(() => this.tick(performance.now()), 20);
  }
  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.controller.stop();
  }
  async select(request) {
    if (request.sourceRevision !== this.options.sourceRevision) {
      throw new RevisionMismatchError("motion-levels-games revision mismatch");
    }
    const gameId = runtimeGameId(request);
    const module = gameplayRegistry.get(gameId.toLowerCase());
    if (!module || !module.manifest.availability.production) {
      throw new RequestValidationError(`production TypeScript game is unavailable: ${gameId}`);
    }
    const publishedLevels = module.manifest.tags?.includes("published-levels") === true;
    if (request.sourceKind !== "motion_levels_games" && !(request.sourceKind === "platform_levels" && publishedLevels)) {
      throw new RequestValidationError(`unsupported game source: ${request.sourceKind ?? ""}`);
    }
    if (request.allowAnyPlayers !== void 0 && request.allowAnyPlayers !== module.manifest.players.allowAny) {
      throw new RequestValidationError("player mode does not match the bundled game manifest");
    }
    const minimumPlayers = module.manifest.players.allowAny ? 0 : module.manifest.players.min;
    const playerCount = boundedInteger2(request.playerCount, minimumPlayers, module.manifest.players.max, "playerCount");
    const players = normalizePlayers(request.players ?? [], playerCount, module.manifest.players.allowAny);
    const durationSeconds = Number(request.durationSeconds);
    const durationMillis = Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds * 1e3 : void 0;
    const contentResult = request.sourceKind === "platform_levels" ? await this.fetchRuntimeContent(request) : null;
    const now = performance.now();
    this.state = this.session.select({
      gameId: module.manifest.id,
      playerCount,
      players,
      difficulty: request.difficulty,
      ...durationMillis === void 0 ? {} : { durationMillis },
      options: request.config ?? {},
      ...contentResult ? { content: contentResult.content } : {}
    });
    this.selection = {
      manifest: module.manifest,
      runtimeGameId: cleanText(request.game, 256),
      engineGame: cleanText(request.engineGame, 256) || `motion-levels-games:${module.manifest.id}`,
      sourceKind: request.sourceKind,
      difficulty: String(request.difficulty || module.manifest.config?.difficulty?.default || "medium"),
      teamName: cleanText(request.teamName, 256),
      level: cleanText(request.level, 256),
      levelSlug: cleanText(request.levelSlug, 256),
      levelMode: cleanText(request.levelMode, 32),
      venueSessionId: cleanText(request.venueSessionId, 256),
      challengeElapsedMillis: nonNegative(request.challengeElapsedMillis),
      challengeAttemptCount: nonNegativeInteger(request.challengeAttemptCount),
      contentRevision: contentResult?.contentRevision ?? ""
    };
    this.gameStartedAt = now;
    this.pauseStartedAt = 0;
    this.sessionStartedUnix = Math.floor(Date.now() / 1e3);
    this.gameSessionId = randomUUID();
    this.applyHeldPressure(0);
    this.publishDisplay();
    return this.status();
  }
  control(actionValue) {
    const action = String(actionValue ?? "");
    const now = performance.now();
    if (action === "exit") {
      this.session.stop();
      this.state = null;
      this.selection = null;
      this.gameSessionId = "";
      this.publishDisplay();
      return this.status();
    }
    if (!this.state) throw new RequestValidationError("no active game");
    if (action === "pause") {
      if (!this.state.paused) this.pauseStartedAt = now;
      this.state = this.session.pause(this.elapsedAt(now));
    } else if (action === "resume") {
      if (this.state.paused && this.pauseStartedAt > 0) this.gameStartedAt += now - this.pauseStartedAt;
      this.pauseStartedAt = 0;
      this.state = this.session.resume();
      this.applyHeldPressure(this.state.clockMillis);
    } else if (action === "restart") {
      this.state = this.session.restart(0);
      this.gameStartedAt = now;
      this.pauseStartedAt = 0;
      this.sessionStartedUnix = Math.floor(Date.now() / 1e3);
      this.gameSessionId = randomUUID();
      this.applyHeldPressure(0);
    } else if (action === "narration" || action === "mute" || action === "unmute" || action === "toggle_mute") {
    } else {
      throw new RequestValidationError(`unknown control action: ${action}`);
    }
    this.publishDisplay();
    return this.status();
  }
  status() {
    const catalog = productionCatalog();
    if (!this.state || !this.selection) {
      const status2 = {
        contractVersion: playerExperienceContractVersion,
        revision: this.stateRevision,
        runId: this.runId,
        lifecycle: "idle",
        allowedControls: [],
        currentGame: "salvapantallas",
        venueSessionId: "",
        sessionId: "",
        label: "En espera",
        phase: "idle",
        difficulty: "medium",
        teamName: "",
        playerCount: 0,
        players: [],
        score: 0,
        lives: -1,
        music: "",
        musicVolume: 0,
        audioEnabled: false,
        audioMuted: true,
        paused: false,
        success: false,
        introRemainingMillis: 0,
        countdownRemainingMillis: 0,
        startedUnix: 0,
        sessionStartedUnix: 0,
        endsUnix: 0,
        elapsedMillis: 0,
        remainingMillis: 0,
        activeTargets: 0,
        lastEventUnixNanos: 0,
        lastEventCue: "",
        lastEventMessage: "",
        lastPressureUnix: this.lastPressureUnix,
        catalog
      };
      return {
        ...status2,
        pressureStreamConnected: this.controllerConnected,
        controllerId: this.controllerId
      };
    }
    const snapshot = this.state.snapshot;
    const lastEvent = this.state.events.at(-1);
    const status = {
      contractVersion: playerExperienceContractVersion,
      revision: this.stateRevision,
      runId: this.runId,
      lifecycle: "running",
      allowedControls: [],
      currentGame: this.selection.runtimeGameId,
      engineGame: this.selection.engineGame,
      sourceKind: this.selection.sourceKind,
      sourceRevision: this.options.sourceRevision,
      contentRevision: this.selection.contentRevision,
      venueSessionId: this.selection.venueSessionId,
      label: snapshot.label || this.selection.manifest.label,
      difficulty: this.selection.difficulty,
      difficultyConfigurable: (this.selection.manifest.config?.difficulty?.options?.length ?? 0) > 1,
      level: this.selection.level,
      levelSlug: this.selection.levelSlug,
      levelMode: this.selection.levelMode,
      teamName: this.selection.teamName,
      playerCount: snapshot.playerCount,
      playerConfigurable: !this.selection.manifest.players.allowAny,
      players: snapshot.players.map((player) => ({ ...player, color: hexToRgb(player.color) })),
      score: snapshot.score,
      lives: snapshot.lives,
      livesStart: snapshot.maxLives,
      music: "",
      musicVolume: 0,
      audioEnabled: false,
      audioMuted: true,
      paused: this.state.paused,
      phase: snapshot.phase,
      success: snapshot.success,
      introRemainingMillis: 0,
      countdownRemainingMillis: snapshot.countdownMillis ?? 0,
      startedUnix: this.sessionStartedUnix,
      sessionStartedUnix: this.sessionStartedUnix,
      endsUnix: snapshot.remainingMillis > 0 ? Math.floor(Date.now() / 1e3 + snapshot.remainingMillis / 1e3) : 0,
      sessionElapsedMillis: snapshot.elapsedMillis,
      sessionRemainingMillis: snapshot.remainingMillis,
      challengeElapsedMillis: this.selection.challengeElapsedMillis,
      challengeAttemptCount: this.selection.challengeAttemptCount,
      elapsedMillis: snapshot.elapsedMillis,
      remainingMillis: snapshot.remainingMillis,
      activeTargets: snapshot.activeTargets,
      lastEventUnixNanos: lastEvent ? Date.now() * 1e6 : 0,
      lastEventCue: lastEvent?.cue ?? snapshot.lastEventCue,
      lastEventMessage: lastEvent?.message ?? snapshot.lastEventMessage,
      sessionId: this.gameSessionId,
      lastPressureUnix: this.lastPressureUnix,
      catalog
    };
    status.lifecycle = lifecycleFromRuntime(status);
    status.allowedControls = controlsForState(status);
    return {
      ...status,
      pressureStreamConnected: this.controllerConnected,
      controllerId: this.controllerId
    };
  }
  display() {
    const status = this.status();
    if (!this.state || !this.selection) return status;
    return {
      ...status,
      sourceKind: "motion_levels_games",
      gameSnapshot: this.state.snapshot,
      frame: this.state.frame
    };
  }
  health() {
    return {
      status: "ok",
      sourceRevision: this.options.sourceRevision,
      controllerProtocolVersion: 2,
      controllerConnected: this.controllerConnected,
      controllerId: this.controllerId,
      audioEnabled: false,
      displayClient: this.displayClientStatus()
    };
  }
  subscribeDisplay(listener) {
    this.displayListeners.add(listener);
    return () => this.displayListeners.delete(listener);
  }
  subscribeStatus(listener) {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }
  getMenuState() {
    return structuredClone(this.menuState);
  }
  putMenuState(kioskId, snapshot) {
    const serialized = JSON.stringify(snapshot);
    if (serialized.length > 1e6) throw new RequestValidationError("snapshot is too large");
    this.menuState = {
      kioskId: cleanText(kioskId, 256),
      version: this.menuState.version + 1,
      updatedUnixMillis: Date.now(),
      snapshot: structuredClone(snapshot)
    };
    for (const listener of this.menuListeners) listener(this.getMenuState());
    return this.getMenuState();
  }
  subscribeMenuState(listener) {
    this.menuListeners.add(listener);
    return () => this.menuListeners.delete(listener);
  }
  updateVenueSession(request) {
    const action = String(request.action ?? "");
    if (action !== "start" && action !== "end") throw new RequestValidationError("action must be start or end");
    const venueSessionId = cleanText(request.venueSessionId, 256);
    if (!venueSessionId) throw new RequestValidationError("venueSessionId is required");
    if (this.selection && (action === "start" || this.selection.venueSessionId === venueSessionId)) {
      this.selection.venueSessionId = action === "start" ? venueSessionId : "";
      this.selection.teamName = action === "start" ? cleanText(request.teamName, 256) : this.selection.teamName;
    }
    this.bestEffortCamera(action, request);
    return this.status();
  }
  recordMenuEvent(request) {
    if (!cleanText(request.venueSessionId, 256) || !cleanText(request.name, 160)) {
      throw new RequestValidationError("venueSessionId and name are required");
    }
    return { ok: true };
  }
  updateDisplayClient(report) {
    if (report.clientId !== "player-display") throw new RequestValidationError("clientId must be player-display");
    this.displayClientReport = structuredClone(report);
    this.displayClientReceivedUnixMillis = Date.now();
    return this.displayClientStatus();
  }
  displayClientStatus() {
    const report = this.displayClientReport ?? {};
    const seen = this.displayClientReceivedUnixMillis > 0;
    const ageMillis = seen ? Math.max(0, Date.now() - this.displayClientReceivedUnixMillis) : 0;
    const currentGame = String(this.status().currentGame ?? "");
    const matchesCurrentGame = seen && report.currentGame === currentGame;
    const fresh = seen && ageMillis <= 15e3;
    const lastFeedUnixMillis = Number(report.lastFeedUnixMillis ?? 0);
    const feedFresh = Number.isFinite(lastFeedUnixMillis) && lastFeedUnixMillis > 0 && Date.now() - lastFeedUnixMillis <= 15e3;
    const connected = report.connected === true || report.feedTransport === "poll" && feedFresh;
    const idleDisplay = currentGame === "salvapantallas";
    const revisionMatches = seen && report.expectedRevision === report.loadedRevision && (idleDisplay ? report.loadedRevision === "" : report.loadedRevision === this.options.sourceRevision);
    return {
      ...report,
      seen,
      fresh,
      healthy: fresh && connected && report.renderStatus === "ready" && matchesCurrentGame && revisionMatches,
      matchesCurrentGame,
      revisionMatches,
      receivedUnixMillis: this.displayClientReceivedUnixMillis,
      ageMillis
    };
  }
  /** Controller input boundary; public to permit deterministic host tests. */
  applyPressure(input) {
    this.lastPressureUnix = Math.floor(Number(input.unixNanos / 1000000000n)) || Math.floor(Date.now() / 1e3);
    const key = `${input.x},${input.y}`;
    if (input.pressed) this.heldPressure.add(key);
    else this.heldPressure.delete(key);
    if (!this.state) return;
    const atMillis = this.elapsedAt(performance.now());
    this.state = input.pressed ? this.session.press(input.x, input.y, atMillis) : this.session.release(input.x, input.y, atMillis);
  }
  tick(now) {
    if (this.state && !this.state.paused) this.state = this.session.tick(this.elapsedAt(now));
    const frame = this.state?.frame ?? blackFrame;
    this.frameSequence += 1n;
    this.controller.sendFrame({
      sequence: this.frameSequence,
      unixNanos: BigInt(Date.now()) * 1000000n,
      width: FLOOR_COLS,
      height: FLOOR_ROWS,
      rgb: frameToRgb(frame, this.options.brightness ?? 1)
    });
    if (now - this.lastDisplayPublishedAt >= 250) {
      this.lastDisplayPublishedAt = now;
      this.publishDisplay();
    }
  }
  elapsedAt(now) {
    return Math.max(0, (this.pauseStartedAt || now) - this.gameStartedAt);
  }
  applyHeldPressure(atMillis) {
    for (const key of this.heldPressure) {
      const [x, y] = key.split(",").map(Number);
      if (x !== void 0 && y !== void 0) this.state = this.session.press(x, y, atMillis);
    }
  }
  publishDisplay() {
    this.stateRevision = this.stateRevision >= Number.MAX_SAFE_INTEGER ? 1 : this.stateRevision + 1;
    const status = this.status();
    for (const listener of this.statusListeners) listener(status);
    if (this.displayListeners.size === 0) return;
    const display = this.state && this.selection ? { ...status, sourceKind: "motion_levels_games", gameSnapshot: this.state.snapshot, frame: this.state.frame } : status;
    for (const listener of this.displayListeners) listener(display);
  }
  async fetchRuntimeContent(request) {
    const platform = resolveRuntimeContentPlatformUrl(this.options.platformUrl, request.platformUrl);
    if (!platform) throw new RequestValidationError("platform URL is required for published-level games");
    const canonicalGameId = String(request.game ?? "").trim().toLowerCase();
    if (!/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|[0-9a-f]{32}|[0-9a-f]{40}|[0-9a-f]{64})$/u.test(canonicalGameId)) {
      throw new RequestValidationError("published level canonical game id is invalid");
    }
    const endpoint = new URL(platform);
    endpoint.pathname = `${endpoint.pathname.replace(/\/$/u, "")}/api/level-games/${encodeURIComponent(canonicalGameId)}/runtime-content`;
    for (const [key, value] of [
      ["difficulty", request.difficulty],
      ["level", request.level],
      ["levelSlug", request.levelSlug],
      ["mode", request.levelMode]
    ]) if (value) endpoint.searchParams.set(key, value);
    const headers = { Accept: "application/json" };
    if (this.options.platformToken) headers.Authorization = `Bearer ${this.options.platformToken.trim()}`;
    const response = await fetch(endpoint, { headers, signal: AbortSignal.timeout(12e3) });
    if (!response.ok) throw new RequestValidationError(`published level content returned HTTP ${response.status}`);
    const text = await response.text();
    if (Buffer.byteLength(text) > 32 * 1024 * 1024) throw new RequestValidationError("published level content exceeds 32 MiB");
    const content = JSON.parse(text);
    if (content.schema !== "motion-levels-published-level-content-v1" || String(content.gameId).toLowerCase() !== canonicalGameId) {
      throw new RequestValidationError("published level content identity mismatch");
    }
    const engineGame = String(content.engineGame ?? "").trim();
    if (!engineGame || engineGame.length > 160) throw new RequestValidationError("published level engineGame is invalid");
    const selectedModule = gameplayRegistry.get(runtimeGameId(request).trim().toLowerCase());
    const contentModule = gameplayRegistry.get(engineGame.replace(/^motion-levels-games:/u, "").trim().toLowerCase());
    if (!selectedModule || contentModule !== selectedModule) {
      throw new RequestValidationError("published level engine product mismatch");
    }
    const selectedLevelId = String(content.selectedLevelId ?? "").trim();
    const selectedLevelSlug = String(content.selectedLevelSlug ?? "").trim();
    if (!selectedLevelId || !selectedLevelSlug) throw new RequestValidationError("published level selection is incomplete");
    if (request.level && /^[0-9a-f-]{32,64}$/iu.test(request.level) && selectedLevelId.toLowerCase() !== request.level.toLowerCase()) {
      throw new RequestValidationError("published level selection identity mismatch");
    }
    const mode = String(content.mode ?? "").toLowerCase();
    if (mode !== "challenge" && mode !== "free") throw new RequestValidationError("published level mode is invalid");
    if (request.levelMode && mode !== request.levelMode.toLowerCase()) throw new RequestValidationError("published level mode mismatch");
    const contentRevision = String(content.contentRevision ?? "");
    if (!/^[0-9a-f]{64}$/u.test(contentRevision)) throw new RequestValidationError("published level content revision is invalid");
    return { content, contentRevision };
  }
  bestEffortCamera(action, request) {
    const base = validBaseUrl(process.env.MOTION_LEVELS_CAMERA_RECORDER_URL);
    if (!base || request.recordingEnabled === false) return;
    const path = action === "start" ? "/sessions/start" : "/sessions/stop";
    const headers = { "Content-Type": "application/json" };
    const token = process.env.MOTION_LEVELS_CAMERA_RECORDER_TOKEN?.trim();
    if (token) headers.Authorization = `Bearer ${token}`;
    void fetch(new URL(path, base), {
      method: "POST",
      headers,
      body: JSON.stringify(action === "start" ? { ...request, startedUnixNanos: Date.now() * 1e6 } : { ...request, endedUnixNanos: Date.now() * 1e6 }),
      signal: AbortSignal.timeout(2e3)
    }).catch((error) => this.options.log?.("camera hook failed", error));
  }
};
function productionCatalog() {
  return gameCatalog.filter((manifest23) => manifest23.availability.production).map((manifest23) => ({
    game: `motion-levels-games:${manifest23.id}`,
    label: manifest23.label,
    description: manifest23.description ?? "",
    music: "",
    players: !manifest23.players.allowAny,
    minPlayers: manifest23.players.min,
    maxPlayers: manifest23.players.max,
    difficulty: (manifest23.config?.difficulty?.options?.length ?? 0) > 1,
    volume: 0
  }));
}
function runtimeGameId(request) {
  for (const value of [request.engineGame, request.game]) {
    const candidate = String(value ?? "").trim();
    if (candidate.startsWith("motion-levels-games:")) return candidate.slice("motion-levels-games:".length);
  }
  return String(request.game ?? "").trim();
}
function normalizePlayers(players, playerCount, allowAnyPlayers) {
  if (!allowAnyPlayers && players.length !== playerCount) {
    throw new RequestValidationError(`players roster must contain exactly ${playerCount} entries`);
  }
  if (players.length > playerCount) throw new RequestValidationError("players roster exceeds playerCount");
  const indexes = /* @__PURE__ */ new Set();
  return players.map((player) => {
    if (!Number.isInteger(player.index) || player.index < 0 || player.index >= playerCount || indexes.has(player.index)) {
      throw new RequestValidationError("player indexes must be unique and within playerCount");
    }
    indexes.add(player.index);
    return { index: player.index, label: cleanText(player.label, 80), color: rgbToHex2(player.color) };
  }).sort((left, right) => left.index - right.index);
}
function frameToRgb(frame, brightnessValue) {
  const brightness = Math.max(0, Math.min(1, Number.isFinite(brightnessValue) ? brightnessValue : 1));
  const rgb = new Uint8Array(floorRgbBytes);
  for (const cell of frame.cells) {
    if (cell.x < 0 || cell.x >= FLOOR_COLS || cell.y < 0 || cell.y >= FLOOR_ROWS) continue;
    const color = hexToRgb(cell.color);
    const offset = (cell.y * FLOOR_COLS + cell.x) * 3;
    rgb[offset] = Math.round(color.r * brightness);
    rgb[offset + 1] = Math.round(color.g * brightness);
    rgb[offset + 2] = Math.round(color.b * brightness);
  }
  return rgb;
}
function rgbToHex2(color) {
  const channel = (value) => boundedInteger2(value, 0, 255, "color channel").toString(16).padStart(2, "0");
  return `#${channel(color?.r)}${channel(color?.g)}${channel(color?.b)}`;
}
function hexToRgb(color) {
  const match = /^#([0-9a-f]{6})$/iu.exec(color);
  if (!match?.[1]) return { r: 0, g: 0, b: 0 };
  return { r: parseInt(match[1].slice(0, 2), 16), g: parseInt(match[1].slice(2, 4), 16), b: parseInt(match[1].slice(4, 6), 16) };
}
function boundedInteger2(value, min, max, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) throw new RequestValidationError(`${label} must be ${min}..${max}`);
  return number;
}
function nonNegative(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}
function nonNegativeInteger(value) {
  return Math.floor(nonNegative(value));
}
function cleanText(value, max) {
  return String(value ?? "").trim().slice(0, max);
}
function validBaseUrl(value) {
  try {
    const url = new URL(String(value ?? "").trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}
function resolveRuntimeContentPlatformUrl(configured, requested) {
  const production = validBaseUrl(configured);
  if (production) return production;
  const development = validBaseUrl(requested);
  if (!development) return null;
  const hostname = development.hostname.toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" ? development : null;
}

// apps/venue-runtime/src/httpServer.ts
var engineTokenHeader = "x-motion-levels-engine-token";
function createVenueHttpServer(runtime2, engineToken2 = "") {
  const commands = new SerializedCommandExecutor();
  return createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://venue-runtime.local");
    if (url.pathname !== "/api/health" && !authorizeEngineRequest(
      request.socket.remoteAddress,
      engineToken2,
      request.headers[engineTokenHeader]
    )) {
      response.writeHead(401).end("engine token required");
      return;
    }
    applyLoopbackCors(request, response);
    if (request.method === "OPTIONS") {
      response.writeHead(204).end();
      return;
    }
    try {
      await route(runtime2, commands, request, response);
    } catch (error) {
      if (response.headersSent) {
        response.end();
        return;
      }
      const status = error instanceof RevisionMismatchError ? 409 : error instanceof RequestValidationError || error instanceof SyntaxError ? 400 : 500;
      response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(error instanceof Error ? error.message : String(error));
    }
  });
}
async function route(runtime2, commands, request, response) {
  const url = new URL(request.url ?? "/", "http://venue-runtime.local");
  if (url.pathname === "/api/health" && (request.method === "GET" || request.method === "HEAD")) {
    json(response, runtime2.health(), request.method === "HEAD");
    return;
  }
  if (url.pathname === "/api/status" && request.method === "GET") {
    json(response, runtime2.status());
    return;
  }
  if (url.pathname === "/api/player-state" && request.method === "GET") {
    json(response, runtime2.status());
    return;
  }
  if (url.pathname === "/api/display" && request.method === "GET") {
    json(response, runtime2.display());
    return;
  }
  if (url.pathname === "/api/display/events" && request.method === "GET") {
    sse(response, request, "display", runtime2.display(), (listener) => runtime2.subscribeDisplay(listener));
    return;
  }
  if (url.pathname === "/api/player-state/events" && request.method === "GET") {
    sse(response, request, "player-state", runtime2.status(), (listener) => runtime2.subscribeStatus(listener));
    return;
  }
  if (url.pathname === "/api/select" && request.method === "POST") {
    const body = await readJson(request);
    json(response, await commands.execute(String(body.commandId ?? ""), () => runtime2.select(body)));
    return;
  }
  if (url.pathname === "/api/control" && request.method === "POST") {
    const body = await readJson(request);
    json(response, await commands.execute(String(body.commandId ?? ""), () => runtime2.control(body.action)));
    return;
  }
  if (url.pathname === "/api/menu-state") {
    if (request.method === "GET") {
      json(response, runtime2.getMenuState());
      return;
    }
    if (request.method === "PUT" || request.method === "POST") {
      const body = await readJson(request, 105e4);
      json(response, runtime2.putMenuState(body.kioskId, body.snapshot));
      return;
    }
  }
  if (url.pathname === "/api/menu-state/events" && request.method === "GET") {
    sse(response, request, "menu-state", runtime2.getMenuState(), (listener) => runtime2.subscribeMenuState(listener));
    return;
  }
  if (url.pathname === "/api/venue-session" && request.method === "POST") {
    json(response, runtime2.updateVenueSession(await readJson(request)));
    return;
  }
  if (url.pathname === "/api/menu-event" && request.method === "POST") {
    json(response, runtime2.recordMenuEvent(await readJson(request)));
    return;
  }
  if (url.pathname === "/api/display-client") {
    if (request.method === "GET") {
      json(response, runtime2.displayClientStatus());
      return;
    }
    if (request.method === "POST") {
      json(response, runtime2.updateDisplayClient(await readJson(request, 16384)));
      return;
    }
  }
  if ([
    "/api/health",
    "/api/status",
    "/api/player-state",
    "/api/player-state/events",
    "/api/display",
    "/api/display/events",
    "/api/select",
    "/api/control",
    "/api/menu-state",
    "/api/menu-state/events",
    "/api/venue-session",
    "/api/menu-event",
    "/api/display-client"
  ].includes(url.pathname)) {
    response.writeHead(405, { Allow: "GET, HEAD, POST, PUT, OPTIONS" }).end("method not allowed");
    return;
  }
  response.writeHead(404).end("not found");
}
async function readJson(request, limit = 1e6) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    length += buffer.byteLength;
    if (length > limit) throw new RequestValidationError("request body is too large");
    chunks.push(buffer);
  }
  const value = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new RequestValidationError("request body must be a JSON object");
  return value;
}
function json(response, value, head = false) {
  const body = JSON.stringify(value);
  response.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body)
  });
  response.end(head ? void 0 : body);
}
function sse(response, request, event, initial, subscribe) {
  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-store",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  const write = (value) => response.write(`event: ${event}
data: ${JSON.stringify(value)}

`);
  write(initial);
  const unsubscribe = subscribe(write);
  const heartbeat = setInterval(() => response.write(": keepalive\n\n"), 15e3);
  heartbeat.unref();
  request.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
}
function applyLoopbackCors(request, response) {
  const origin = request.headers.origin;
  if (origin && /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/u.test(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Motion-Levels-Engine-Token");
  response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, OPTIONS");
}
function isLoopbackAddress(address2) {
  return address2 === "127.0.0.1" || address2 === "::1" || address2 === "::ffff:127.0.0.1";
}
function authorizeEngineRequest(remoteAddress, expectedToken, providedToken) {
  if (isLoopbackAddress(remoteAddress)) return true;
  if (!expectedToken || typeof providedToken !== "string") return false;
  const expected = Buffer.from(expectedToken);
  const provided = Buffer.from(providedToken);
  return expected.byteLength === provided.byteLength && timingSafeEqual(expected, provided);
}

// apps/venue-runtime/src/main.ts
var runtime = new VenueRuntime({
  sourceRevision: sourceRevision(),
  controllerAddress: process.env.MOTION_LEVELS_CONTROLLER_ADDR?.trim() || "127.0.0.1:4201",
  platformUrl: process.env.MOTION_LEVELS_PLATFORM_URL,
  platformToken: process.env.MOTION_LEVELS_PLATFORM_TOKEN,
  brightness: parseBrightness(process.env.MOTION_LEVELS_ENGINE_BRIGHTNESS),
  log: (message, error) => console.error(`[venue-runtime] ${message}`, error ?? "")
});
function sourceRevision() {
  const environment = process.env.MOTION_LEVELS_GAMES_SOURCE_REVISION?.trim();
  if (environment) return environment;
  if (true) return "da1c51da4cf08a3c2f3f3305096295bdd226e4d5";
  return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
}
var address = parseHttpAddress(process.env.MOTION_LEVELS_ENGINE_HTTP?.trim() || "127.0.0.1:4102");
var engineToken = process.env.MOTION_LEVELS_ENGINE_TOKEN?.trim() || "";
if (!isLoopbackHost(address.host) && !engineToken) {
  throw new Error("MOTION_LEVELS_ENGINE_TOKEN is required for a non-loopback HTTP bind");
}
var server = createVenueHttpServer(runtime, engineToken);
server.listen(address.port, address.host, () => {
  runtime.start();
  console.log(`[venue-runtime] API listening at http://${address.host}:${address.port}`);
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    runtime.stop();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5e3).unref();
  });
}
function parseHttpAddress(value) {
  const candidate = value.replace(/^http:\/\//u, "");
  const match = candidate.match(/^\[([^\]]+)\]:(\d+)$/u) ?? candidate.match(/^([^:]+):(\d+)$/u);
  if (!match) throw new Error(`invalid MOTION_LEVELS_ENGINE_HTTP: ${value}`);
  const host = match[1] ?? "";
  const port = Number(match[2]);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`invalid HTTP port: ${match[2]}`);
  return { host, port };
}
function isLoopbackHost(host) {
  return host === "127.0.0.1" || host === "localhost" || host === "::1";
}
function parseBrightness(value) {
  const number = Number(value ?? 100);
  if (!Number.isFinite(number)) return 1;
  return Math.max(0, Math.min(1, number > 1 ? number / 100 : number));
}
