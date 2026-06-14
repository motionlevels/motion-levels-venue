import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { controlGame, fetchAnimationPreview, fetchEngineStatus, fetchGameCatalog, fetchMenuState, postMenuEvent, postMenuState, postVenueSession, selectGame, type AnimationPreview, type EngineGame, type EngineStatus, type MenuStateEnvelope, type PlatformGameCatalogEntry } from "./api";
import { categories, colors, difficulties, games, playerColorNames, playerColors, previewAsset, type CategoryID, type DifficultyID, type GameCard } from "./catalog";
import {
  catalogDifficultyIDs,
  closestSupportedDifficulty,
  difficultyRank,
  estimatedDurationLabel,
  normalizeEstimatedDurationSeconds,
  normalizeDifficultyIDs,
  platformDifficultyLabel,
  platformDurationLabel,
  platformPlayerBounds,
  platformPlayerRangeLabel,
  platformSupportedDifficulties,
  platformSupportsLevels,
  playerBoundsForGame,
  rosterForGame,
  supportedDifficultiesForGame,
} from "./catalogSync";
import { ArrowLeftIcon, BackspaceIcon, BoltIcon, CheckIcon, CloseIcon, GearIcon, PauseIcon, PlayIcon, PlusIcon, RestartIcon, VolumeIcon, VolumeMutedIcon } from "./icons";
import { FloorPreview } from "./FloorPreview";
import { LiveFloorView } from "./LiveFloorView";
import { defaultFloorAnim, floorAnimations, type FloorAnim, type RGB } from "./floor";
import { hexToColor, hexToRGB, initials } from "./utils";
import { captureMenuEvent, menuKioskID, setMenuEventForwarder } from "./analytics";

type Player = {
  id: number;
  name: string;
  color: string;
  active: boolean;
};

type MenuState = {
  sessionActive: boolean;
  sessionId: string;
  sessionStartedUnix: number;
  teamName: string;
  players: Player[];
  category: CategoryID;
  selectedGame: string;
  difficulty: DifficultyID;
  selectedLevels: Record<string, string>;
  levelProgress: Record<string, LevelProgress>;
  nextPlayerId: number;
  narrationArmed: Record<string, boolean>;
  operatorUnlockLevels: boolean;
};

type LevelProgress = {
  unlockedThrough: number;
  bestByLevel: Record<string, DifficultyID>;
  bestTimeByLevel: Record<string, number>;
};

type FinishedLevelAttempt = NonNullable<EngineStatus["finishedLevelAttempts"]>[number];
type KeyboardTarget = { kind: "team" } | { kind: "player"; id: number };
type ScreenMode = "browse" | "game";
type RosterIssue = { message: string; playerIds: Set<number> };
type MenuMirrorSnapshot = {
  menu: MenuState;
  screenMode: ScreenMode;
  launchedGameID: string;
  levelBrowserGameID: string | null;
  teamOpen: boolean;
  message: string;
  error: string;
};
type RemoteSessionRequest = {
  configuredPlayerCount: number;
  reservationId: string;
  venueSessionId: string;
  teamName: string;
  playerCount: number;
  room: string;
  startsAt: string;
};

const storageKey = "ml-player-menu-state-v1";
const platformCatalogStorageKey = "ml-player-menu-platform-catalog-v1";
const platformCatalogRefreshMillis = 5000;
const maxPlayers = 6;
const maxTeamNameLength = 24;
const maxPlayerNameLength = 12;
const noPressureSessionLimitMillis = 60 * 60 * 1000;
// Spanish QWERTY adapted for a kiosk touch surface.
const keyboardLetterRows = ["qwertyuiop", "asdfghjklñ", "zxcvbnm"];
const keyboardNumberRows = ["1234567890", "-_/&()'\"", ".,!?"];
const keyboardAccentRows = ["áéíóúü", "àèìòù", "äëïöüñ"];
const envUnlockLevels = import.meta.env.DEV || import.meta.env.VITE_UNLOCK_LEVELS === "1";
const operatorSettingsPin = /^\d{6}$/.test(import.meta.env.VITE_DEV_SETTINGS_PIN || "") ? import.meta.env.VITE_DEV_SETTINGS_PIN || "" : "739481";
const defaultPlayers: Player[] = [{ id: 1, name: "", color: playerColors[0], active: true }];
const teamNameStarts = ["Rayo", "Neón", "Pulso", "Láser", "Cumbre", "Órbita", "Turbo", "Brillo", "Salto", "Ritmo", "Chispa", "Fuego"];
const teamNameFinishes = ["Verde", "Azul", "Solar", "Norte", "Sur", "Lima", "Rojo", "Claro", "Pista", "Nivel", "Flash", "Veloz"];

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUUID(value: unknown): value is string {
  return typeof value === "string" && uuidPattern.test(value.trim());
}

function clampInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function remoteSessionRequestFromURL(): RemoteSessionRequest | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get("remoteSession") !== "reservation") return null;
  const venueSessionId = params.get("venueSessionId") || "";
  const reservationId = params.get("reservationId") || venueSessionId;
  if (!isUUID(venueSessionId) || !isUUID(reservationId)) return null;
  const reservedPlayers = Math.max(1, Math.round(Number(params.get("players") || 1)));

  return {
    configuredPlayerCount: clampInteger(reservedPlayers, 1, maxPlayers),
    playerCount: reservedPlayers,
    reservationId: reservationId.toLowerCase(),
    room: cleanNameWhitespace(params.get("room") || "Sala remota", 40),
    startsAt: params.get("startsAt") || "",
    teamName: cleanNameWhitespace(params.get("teamName") || defaultTeamName(), maxTeamNameLength),
    venueSessionId: venueSessionId.toLowerCase(),
  };
}

function clearRemoteSessionURL() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  for (const key of ["remoteSession", "reservationId", "venueSessionId", "players", "room", "startsAt", "teamName"]) {
    url.searchParams.delete(key);
  }
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function menuReadOnlyFromURL(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("readOnly") === "1" || params.get("readonly") === "1" || params.get("mode") === "readonly";
}

function floorOnlyFromURL(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("floorOnly") === "1" || params.get("floor") === "1" || params.get("mode") === "floor";
}

function playersForCount(count: number): Player[] {
  return Array.from({ length: clampInteger(count, 1, maxPlayers) }, (_, index) => ({
    active: true,
    color: playerColors[index % playerColors.length],
    id: index + 1,
    name: "",
  }));
}

function newVenueSessionID(): string {
  return crypto.randomUUID();
}

function defaultTeamName(date = new Date()): string {
  const seed = Math.max(0, Math.floor(date.getTime() / 1000));
  const start = teamNameStarts[seed % teamNameStarts.length];
  const finish = teamNameFinishes[Math.floor(seed / teamNameStarts.length) % teamNameFinishes.length];
  const code = 100 + (seed % 900);
  return `${start} ${finish} ${code}`;
}

function cleanNameWhitespace(value: string, maxLength: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength).trim();
}

function engineGameID(game: GameCard): string {
  return game.engineGame || game.id;
}

function previewAnimationID(game: GameCard): string {
  return game.previewAnimation || game.id;
}

function levelPreviewAnimationID(game: GameCard, level?: NonNullable<GameCard["levels"]>[number]): string {
  return level?.previewAnimation || previewAnimationID(game);
}

function levelPreviewSrc(game: GameCard, level: NonNullable<GameCard["levels"]>[number] | undefined, difficulty: DifficultyID): string | undefined {
  return level?.previewByDifficulty?.[difficulty] || level?.previewSrc || game.previewSrc;
}

function isAmbientCard(game: GameCard): boolean {
  return game.category === "attract";
}

function isFeaturedCard(game: GameCard): boolean {
  return game.featured === true || game.category === "featured";
}

function gamesForCategory(catalogGames: GameCard[], category: CategoryID): GameCard[] {
  if (category === "featured") return catalogGames.filter(isFeaturedCard);
  return catalogGames.filter((game) => game.category === category);
}

function gameBelongsToCategory(game: GameCard, category: CategoryID): boolean {
  return category === "featured" ? isFeaturedCard(game) : game.category === category;
}

function menuCategoryForGame(game: GameCard, currentCategory: CategoryID): CategoryID {
  if (currentCategory === "featured" && isFeaturedCard(game)) return "featured";
  return game.category;
}

function animationIsIdleLoop(currentGame: string, phase: string): boolean {
  return currentGame === "animations" && (phase === "idle" || phase === "ambient");
}

function gameForEngineStatus(engineGame: string, currentMenuGameID: string, catalogGames = games): GameCard | undefined {
  const matches = catalogGames.filter((game) => engineGameID(game) === engineGame);
  if (matches.length === 0) return undefined;
  return matches.find((game) => game.id === currentMenuGameID) || matches.find((game) => !game.id.startsWith("featured-")) || matches[0];
}

function liveAnimationCards(catalog: EngineGame[] | undefined): GameCard[] {
  const existingEngineGames = new Set(games.map(engineGameID));
  const animationColors = [colors.cyan, colors.blue, colors.green, colors.violet, colors.orange, colors.yellow];
  return (catalog || [])
    .filter((entry) => entry.game.startsWith("animation-") && !existingEngineGames.has(entry.game))
    .map((entry, index): GameCard => ({
      id: entry.game,
      label: entry.label || entry.game.replace(/^animation-/, ""),
      category: "attract",
      color: animationColors[index % animationColors.length],
      players: "Todos",
      difficulty: "Ambiente",
      duration: "Bucle",
      mode: "Ambiente",
      audio: entry.music ? "Música" : "Suave",
      description: entry.description || "Animación publicada desde el editor.",
      rules: ["Animación publicada desde el editor.", "Se actualiza desde el motor sin reiniciar el menú."],
      engineGame: entry.game,
      previewAnimation: entry.game,
      featured: false,
    }));
}

function isCategoryID(value: string): value is CategoryID {
  return categories.some((category) => category.id === value);
}

function platformEntryEngineGame(entry: PlatformGameCatalogEntry): string {
  return entry.engine_game || entry.id;
}

function catalogThumbnailSrc(ref: string | undefined): string | undefined {
  const clean = String(ref || "").trim();
  if (!clean) return undefined;
  if (/^(?:https?:|data:|blob:|\/)/i.test(clean)) return clean;
  return previewAsset(clean.replace(/^preview:/, "")) || clean;
}

function catalogPreviewAnimation(entry: PlatformGameCatalogEntry, fallback: GameCard | undefined, engineGame: string): string | undefined {
  const configured = String(entry.catalog_preview_animation || "").trim();
  if (configured) return configured;
  return fallback?.previewAnimation || (entry.source_kind === "cloud_animations" || entry.catalog_category === "attract" ? engineGame : undefined);
}

function platformEntryToGameCard(entry: PlatformGameCatalogEntry, fallback: GameCard | undefined, index: number): GameCard {
  const engineGame = platformEntryEngineGame(entry);
  const previewSrc = catalogThumbnailSrc(entry.catalog_thumbnail_ref) || fallback?.previewSrc;
  const playerBounds = platformPlayerBounds(entry);
  const supportedDifficulties = platformSupportedDifficulties(entry, fallback);
  const supportsLevels = platformSupportsLevels(entry, fallback);
  const estimatedDurationSeconds = normalizeEstimatedDurationSeconds(entry.estimated_duration_seconds);
  const levels = supportsLevels && entry.levels && entry.levels.length > 0
    ? entry.levels.map((lvl) => {
        const fallbackLevel = fallback?.levels?.find((level) => level.id === lvl.id);
        const levelDifficulties = normalizeDifficultyIDs(lvl.difficulties);
        return {
          id: lvl.id,
          label: lvl.label,
          description: lvl.description,
          difficulties: levelDifficulties.length ? levelDifficulties : fallbackLevel?.difficulties,
          previewSrc: fallbackLevel?.previewSrc || fallback?.previewSrc,
          previewByDifficulty: fallbackLevel?.previewByDifficulty,
          previewAnimation: fallbackLevel?.previewAnimation,
        };
      })
    : supportsLevels ? fallback?.levels : undefined;
  const duration = platformDurationLabel(entry, fallback) || (levels?.length ? `${levels.length} niveles` : "");
  return {
    id: entry.id,
    label: entry.label || fallback?.label || engineGame,
    category: isCategoryID(entry.catalog_category) ? entry.catalog_category : fallback?.category || "arcade",
    color: entry.catalog_color || fallback?.color || [colors.cyan, colors.blue, colors.green, colors.violet, colors.orange, colors.yellow][index % 6],
    players: platformPlayerRangeLabel(entry, fallback),
    difficulty: platformDifficultyLabel(entry, fallback),
    difficulties: supportedDifficulties,
    duration,
    estimatedDurationSeconds,
    mode: entry.mode_label || fallback?.mode || "",
    audio: entry.audio_label || fallback?.audio || "",
    description: entry.description || fallback?.description || "Juego publicado desde el catálogo.",
    rules: entry.catalog_rules?.length ? entry.catalog_rules : fallback?.rules || ["Configurable desde la página Juegos."],
    featured: typeof entry.catalog_featured === "boolean" ? entry.catalog_featured : fallback?.featured === true || entry.catalog_category === "featured",
    levels,
    allowDifficultyWithLevels: supportsLevels && (fallback?.allowDifficultyWithLevels || (entry.source_kind === "cloud_levels" && Boolean(levels?.length))),
    engineGame,
    minPlayers: playerBounds.minPlayers,
    maxPlayers: playerBounds.maxPlayers,
    previewSrc,
    previewAnimation: catalogPreviewAnimation(entry, fallback, engineGame),
    supportsLevels,
    disabled: false,
  };
}

function applyPlatformCatalog(baseGames: GameCard[], catalog: PlatformGameCatalogEntry[] | null): GameCard[] {
  if (!catalog) return baseGames;
  const fallbackByID = new Map(baseGames.map((game) => [game.id, game]));
  const fallbackByEngine = new Map(baseGames.map((game) => [engineGameID(game), game]));
  const catalogOrderByID = new Map(catalog.map((entry) => [entry.id, entry.catalog_order]));
  const catalogOrderByEngine = new Map(catalog.map((entry) => [platformEntryEngineGame(entry), entry.catalog_order]));
  return catalog
    .filter((entry) => entry.catalog_enabled !== false)
    .map((entry, index) => platformEntryToGameCard(
      entry,
      fallbackByID.get(entry.id) || fallbackByEngine.get(platformEntryEngineGame(entry)),
      index,
    ))
    .sort((left, right) => {
      const leftOrder = catalogOrderByID.get(left.id) ?? catalogOrderByEngine.get(engineGameID(left)) ?? 1000;
      const rightOrder = catalogOrderByID.get(right.id) ?? catalogOrderByEngine.get(engineGameID(right)) ?? 1000;
      return leftOrder - rightOrder || left.label.localeCompare(right.label);
    });
}

function isIndividualCard(game: GameCard): boolean {
  return game.category === "individual";
}

function usesDifficulty(game: GameCard): boolean {
  return !isAmbientCard(game) && (!game.levels?.length || Boolean(game.allowDifficultyWithLevels));
}

function supportsNarration(game: GameCard): boolean {
  return !isAmbientCard(game);
}

function defaultLevelID(game: GameCard): string {
  return game.levels?.[0]?.id || "";
}

function levelNumber(levelID: string): number {
  const value = Number(levelID.replace(/^level-/, ""));
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function supportedDifficultiesFor(game: GameCard, level?: NonNullable<GameCard["levels"]>[number]): DifficultyID[] {
  if (!usesDifficulty(game)) return [...catalogDifficultyIDs];
  return supportedDifficultiesForGame(game, level);
}

function higherDifficulty(a: DifficultyID | undefined, b: DifficultyID): DifficultyID {
  if (!a) return b;
  return difficultyRank(b) > difficultyRank(a) ? b : a;
}

function progressFor(game: GameCard, state: MenuState): LevelProgress {
  const progress = state.levelProgress[game.id];
  return { unlockedThrough: progress?.unlockedThrough || 1, bestByLevel: progress?.bestByLevel || {}, bestTimeByLevel: progress?.bestTimeByLevel || {} };
}

function unlockLevelsEnabled(state: MenuState): boolean {
  return envUnlockLevels || state.operatorUnlockLevels;
}

function isLevelUnlocked(game: GameCard, levelID: string, state: MenuState): boolean {
  if (!game.levels?.length) return true;
  if (unlockLevelsEnabled(state)) return true;
  return levelNumber(levelID) <= progressFor(game, state).unlockedThrough;
}

function difficultyColor(difficulty?: DifficultyID): string {
  return difficulties.find((candidate) => candidate.id === difficulty)?.color || colors.green;
}

function formatBestTime(ms?: number): string {
  if (!ms || ms <= 0) return "Sin marca";
  const totalTenths = Math.round(ms / 100);
  const minutes = Math.floor(totalTenths / 600);
  const seconds = Math.floor((totalTenths % 600) / 10);
  const tenths = totalTenths % 10;
  return minutes > 0 ? `${minutes}:${String(seconds).padStart(2, "0")}.${tenths}` : `${seconds}.${tenths}s`;
}

function starCountForDifficulty(difficulty?: DifficultyID): number {
  if (!difficulty) return 0;
  return Math.max(0, difficultyRank(difficulty) + 1);
}

function StarRating({ difficulty, label = "Dificultad", muted = false }: { difficulty?: DifficultyID; label?: string; muted?: boolean }) {
  const count = starCountForDifficulty(difficulty);
  return (
    <span className={`star-rating ${muted ? "muted" : ""}`} aria-label={difficulty ? `${label}: ${count} de 4` : `${label}: sin superar`}>
      {[0, 1, 2, 3].map((index) => (
        <span key={index} aria-hidden="true" className={index < count ? "filled" : ""}>
          {index < count ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

function difficultyFromEngine(value: string | undefined, fallback: DifficultyID): DifficultyID {
  return difficulties.some((candidate) => candidate.id === value) ? (value as DifficultyID) : fallback;
}

function recordLevelCompletion(
  state: MenuState,
  game: GameCard,
  levelID: string,
  success: boolean,
  difficulty: DifficultyID,
  elapsedMillis: number,
): MenuState {
  if (!game.levels?.length || !levelID) return state;
  const finishedNumber = levelNumber(levelID);
  const previous = progressFor(game, state);
  const nextBest = { ...previous.bestByLevel };
  const nextBestTime = { ...previous.bestTimeByLevel };
  if (success) {
    nextBest[levelID] = higherDifficulty(nextBest[levelID], difficulty);
    if (elapsedMillis > 0 && (!nextBestTime[levelID] || elapsedMillis < nextBestTime[levelID])) {
      nextBestTime[levelID] = elapsedMillis;
    }
  }
  return {
    ...state,
    levelProgress: {
      ...state.levelProgress,
      [game.id]: {
        unlockedThrough: Math.min(game.levels.length, Math.max(previous.unlockedThrough || 1, finishedNumber + 1)),
        bestByLevel: nextBest,
        bestTimeByLevel: nextBestTime,
      },
    },
  };
}

function loadMenuState(): MenuState {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null") as Partial<MenuState> | null;
    if (saved && typeof saved === "object") {
      const narrationArmed = saved.narrationArmed && typeof saved.narrationArmed === "object" ? saved.narrationArmed : {};
      const selectedLevels = saved.selectedLevels && typeof saved.selectedLevels === "object" ? saved.selectedLevels : {};
      const levelProgress = saved.levelProgress && typeof saved.levelProgress === "object" ? saved.levelProgress : {};
      const savedPlayers = Array.isArray(saved.players) ? saved.players : [];
      const cleanedPlayers = savedPlayers.map((player, index) => ({
        id: Number(player?.id) || index + 1,
        name: cleanNameWhitespace(String(player?.name || ""), maxPlayerNameLength),
        color: typeof player?.color === "string" ? player.color : playerColors[index % playerColors.length],
        active: Boolean(player?.active),
      }));
      const wasOldUntouchedDefault =
        !saved.teamName &&
        savedPlayers.length === 2 &&
        savedPlayers.every((player, index) => {
          const name = String(player?.name || "").trim();
          const oldName = index === 0 ? "Red" : "Blue";
          return player && player.active && (name === "" || name === oldName);
        });
      const requestedGameID = saved.selectedGame === "whack-a-mole" && wasOldUntouchedDefault ? "featured-lava" : String(saved.selectedGame || "featured-lava");
      const savedGame = games.find((game) => game.id === requestedGameID);
      const savedCategory: CategoryID = categories.some((category) => category.id === saved.category) ? (saved.category as CategoryID) : "featured";
      return {
        difficulty: "easy",
        ...saved,
        teamName: cleanNameWhitespace(String(saved.teamName || ""), maxTeamNameLength),
        sessionActive: Boolean(saved.sessionActive),
        sessionId: isUUID(saved.sessionId) ? saved.sessionId.toLowerCase() : "",
        sessionStartedUnix: Number(saved.sessionStartedUnix) || 0,
        category: savedGame?.category || savedCategory,
        selectedGame: savedGame?.id || "featured-lava",
        selectedLevels,
        levelProgress,
        players: wasOldUntouchedDefault ? defaultPlayers : cleanedPlayers,
        nextPlayerId: wasOldUntouchedDefault ? 1 : saved.nextPlayerId || 0,
        narrationArmed,
        operatorUnlockLevels: envUnlockLevels || Boolean(saved.operatorUnlockLevels),
      };
    }
  } catch {
    // Ignore broken local storage and return the default kiosk state.
  }
  return {
    sessionActive: false,
    sessionId: "",
    sessionStartedUnix: 0,
    teamName: "",
    players: defaultPlayers,
    category: "featured",
    selectedGame: "featured-lava",
    difficulty: "easy",
    selectedLevels: {},
    levelProgress: {},
    nextPlayerId: 1,
    narrationArmed: {},
    operatorUnlockLevels: envUnlockLevels,
  };
}

function loadCachedPlatformCatalog(): PlatformGameCatalogEntry[] | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const payload = JSON.parse(localStorage.getItem(platformCatalogStorageKey) || "null") as { games?: unknown } | PlatformGameCatalogEntry[] | null;
    const games = Array.isArray(payload) ? payload : Array.isArray(payload?.games) ? payload.games : null;
    return games ? games.filter(isPlatformGameCatalogEntry) : null;
  } catch {
    return null;
  }
}

function cachePlatformCatalog(catalog: PlatformGameCatalogEntry[]) {
  try {
    localStorage.setItem(platformCatalogStorageKey, JSON.stringify({ games: catalog, cachedAt: Date.now() }));
  } catch {
    // Ignore storage pressure; the bundled catalog remains the offline fallback.
  }
}

function isPlatformGameCatalogEntry(value: unknown): value is PlatformGameCatalogEntry {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && "id" in value && "label" in value);
}

// Players get a "Jugador N" placeholder until they are named.
function playerLabel(players: Player[], player: Player): string {
  const name = player.name.trim();
  if (name) return name;
  return `Jugador ${players.indexOf(player) + 1}`;
}

function rosterSnapshot(players: Player[]) {
  return players
    .filter((player) => player.active)
    .map((player, index) => ({
      index,
      label: playerLabel(players, player),
      color: hexToColor(player.color),
    }));
}

function menuSnapshotProperties(menu: MenuState) {
  return {
    team_name: menu.teamName.trim(),
    players: rosterSnapshot(menu.players),
    player_count: menu.players.filter((player) => player.active).length,
  };
}

function avatarLabel(players: Player[], player: Player): string {
  const name = player.name.trim();
  return name ? initials(name) : `${players.indexOf(player) + 1}`;
}

function normalizeRosterName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase("es-ES");
}

function colorChannels(color: string): [number, number, number] {
  const normalized = color.trim().replace(/^#/, "");
  if (normalized.length !== 6) return [0, 0, 0];
  return [Number.parseInt(normalized.slice(0, 2), 16), Number.parseInt(normalized.slice(2, 4), 16), Number.parseInt(normalized.slice(4, 6), 16)];
}

function channelToHex(value: number): string {
  return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0");
}

function rgbToHex(color: { r: number; g: number; b: number }): string {
  return `#${channelToHex(color.r)}${channelToHex(color.g)}${channelToHex(color.b)}`;
}

function colorDistanceSquared(a: string, b: string): number {
  const [ar, ag, ab] = colorChannels(a);
  const [br, bg, bb] = colorChannels(b);
  return (ar - br) ** 2 + (ag - bg) ** 2 + (ab - bb) ** 2;
}

function statusPlayersForDisplay(status: EngineStatus | null): Player[] {
  if (!status?.players?.length) return [];
  return status.players.map((player) => ({
    id: player.index + 1,
    name: player.label,
    color: rgbToHex(player.color),
    active: true,
  }));
}

function firstAvailableColor(players: Player[], ignoredID?: number): string {
  const used = new Set(players.filter((player) => player.active && player.id !== ignoredID).map((player) => player.color.toLowerCase()));
  const available = playerColors.filter((color) => !used.has(color.toLowerCase()));
  if (available.length === 0) return playerColors[0];

  const activeColors = players.filter((player) => player.active && player.id !== ignoredID).map((player) => player.color);
  if (activeColors.length === 0) return available[0];

  return available.reduce((best, color) => {
    const colorScore = Math.min(...activeColors.map((activeColor) => colorDistanceSquared(color, activeColor)));
    const bestScore = Math.min(...activeColors.map((activeColor) => colorDistanceSquared(best, activeColor)));
    return colorScore > bestScore ? color : best;
  }, available[0]);
}

function activeRosterIssue(players: Player[]): RosterIssue | null {
  const active = players.filter((player) => player.active);
  const names = new Map<string, Player[]>();
  const colors = new Map<string, Player[]>();

  for (const player of active) {
    const nameKey = normalizeRosterName(playerLabel(players, player));
    if (nameKey) names.set(nameKey, [...(names.get(nameKey) || []), player]);

    const colorKey = player.color.toLowerCase();
    colors.set(colorKey, [...(colors.get(colorKey) || []), player]);
  }

  for (const duplicates of names.values()) {
    if (duplicates.length > 1) {
      const label = playerLabel(players, duplicates[0]);
      return {
        message: `El nombre "${label}" ya está en uso`,
        playerIds: new Set(duplicates.map((player) => player.id)),
      };
    }
  }

  for (const duplicates of colors.values()) {
    if (duplicates.length > 1) {
      return {
        message: "Cada jugador necesita un color distinto",
        playerIds: new Set(duplicates.map((player) => player.id)),
      };
    }
  }

  return null;
}

function gameRosterIssue(game: GameCard, players: Player[]): RosterIssue | null {
  const duplicateIssue = activeRosterIssue(players);
  if (duplicateIssue) return duplicateIssue;
  const active = players.filter((player) => player.active);
  const { maxPlayers: gameMaxPlayers, minPlayers: gameMinPlayers } = playerBoundsForGame(game);
  if (active.length < gameMinPlayers) {
    return {
      message: gameMinPlayers === 1 ? "Necesita al menos 1 jugador" : `Necesita al menos ${gameMinPlayers} jugadores`,
      playerIds: new Set(active.map((player) => player.id)),
    };
  }
  if (active.length > gameMaxPlayers) {
    return {
      message: gameMaxPlayers === 1 ? "Máximo 1 jugador" : `Máximo ${gameMaxPlayers} jugadores`,
      playerIds: new Set(active.map((player) => player.id)),
    };
  }
  return null;
}

export default function App() {
  return floorOnlyFromURL() ? <FloorOnlyApp /> : <MenuApp />;
}

function MenuApp() {
  const readOnlyMirror = useMemo(() => menuReadOnlyFromURL(), []);
  const [menu, setMenu] = useState<MenuState>(() => loadMenuState());
  const [status, setStatus] = useState<EngineStatus | null>(null);
  const [platformCatalog, setPlatformCatalog] = useState<PlatformGameCatalogEntry[] | null>(() => loadCachedPlatformCatalog());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [keyboardTarget, setKeyboardTarget] = useState<KeyboardTarget | null>(null);
  const [colorPickerFor, setColorPickerFor] = useState<number | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<number | null>(null);
  const [confirmResetSession, setConfirmResetSession] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsUnlocked, setSettingsUnlocked] = useState(false);
  const [settingsPin, setSettingsPin] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [teamOpen, setTeamOpen] = useState(false);
  const [screenMode, setScreenMode] = useState<ScreenMode>("browse");
  const [remoteSessionRequest, setRemoteSessionRequest] = useState<RemoteSessionRequest | null>(() => remoteSessionRequestFromURL());
  const [launchedGameID, setLaunchedGameID] = useState(menu.selectedGame);
  const [levelBrowserGameID, setLevelBrowserGameID] = useState<string | null>(null);
  const [introUntil, setIntroUntil] = useState(0);
  const [countdownUntil, setCountdownUntil] = useState(0);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const processedFinishedSessions = useRef(new Set<string>());
  const syncedEngineSession = useRef("");
  const mirroredMenuVersion = useRef(0);
  const venueSessionIDRef = useRef(menu.sessionId);

  useEffect(() => {
    if (readOnlyMirror) return;
    localStorage.setItem(storageKey, JSON.stringify(menu));
  }, [menu, readOnlyMirror]);

  useEffect(() => {
    venueSessionIDRef.current = menu.sessionId;
  }, [menu.sessionId]);

  const menuRef = useRef(menu);

  useEffect(() => {
    menuRef.current = menu;
  }, [menu]);

  const menuGames = useMemo(
    () => applyPlatformCatalog([...games, ...liveAnimationCards(status?.catalog)], platformCatalog),
    [platformCatalog, status?.catalog],
  );

  useEffect(() => {
    if (!platformCatalog || !menuGames.length) return;
    const launchedStillVisible = menuGames.some((game) => game.id === launchedGameID);
    if (!launchedStillVisible) {
      setLaunchedGameID(menuGames[0].id);
    }
    setMenu((current) => {
      const selected =
        menuGames.find((game) => game.id === current.selectedGame)
        || gamesForCategory(menuGames, current.category)[0]
        || menuGames[0];
      const category = menuCategoryForGame(selected, current.category);
      if (current.selectedGame === selected.id && current.category === category) return current;
      const selectedLevels = selected.levels?.length && !current.selectedLevels[selected.id]
        ? { ...current.selectedLevels, [selected.id]: defaultLevelID(selected) }
        : current.selectedLevels;
      const selectedLevel = selected.levels?.find((level) => level.id === selectedLevels[selected.id]);
      return {
        ...current,
        category,
        difficulty: closestSupportedDifficulty(current.difficulty, supportedDifficultiesFor(selected, selectedLevel)),
        selectedGame: selected.id,
        selectedLevels,
      };
    });
  }, [launchedGameID, menu.category, menu.selectedGame, menuGames, platformCatalog]);

  // Mirror every captured menu event to the game-engine so the visit is fully
  // recorded server-side (independent of PostHog analytics).
  useEffect(() => {
    if (readOnlyMirror) return;
    setMenuEventForwarder((event, properties) => {
      const current = menuRef.current;
      const venueSessionId = venueSessionIDRef.current
        || (typeof properties.venue_session_id === "string" ? properties.venue_session_id : "");
      if (!venueSessionId) return;
      postMenuEvent({
        venueSessionId,
        name: event,
        kioskId: menuKioskID(),
        occurredAtUnixMillis: Date.now(),
        properties: {
          ...menuSnapshotProperties(current),
          ...properties,
        },
      });
    });
    return () => setMenuEventForwarder(null);
  }, [readOnlyMirror]);

  useEffect(() => {
    if (readOnlyMirror) return;
    const snapshot: MenuMirrorSnapshot = {
      menu,
      screenMode,
      launchedGameID,
      levelBrowserGameID,
      teamOpen,
      message,
      error,
    };
    const timeout = window.setTimeout(() => {
      postMenuState({ kioskId: menuKioskID(), snapshot });
    }, 150);
    return () => window.clearTimeout(timeout);
  }, [error, launchedGameID, levelBrowserGameID, menu, message, readOnlyMirror, screenMode, teamOpen]);

  useEffect(() => {
    if (!readOnlyMirror) return;
    let cancelled = false;

    function applyEnvelope(envelope: MenuStateEnvelope<MenuMirrorSnapshot>) {
      if (cancelled || !envelope.snapshot || envelope.version <= mirroredMenuVersion.current) return;
      mirroredMenuVersion.current = envelope.version;
      const snapshot = envelope.snapshot;
      setMenu(snapshot.menu);
      setScreenMode(snapshot.screenMode);
      setLaunchedGameID(snapshot.launchedGameID);
      setLevelBrowserGameID(snapshot.levelBrowserGameID);
      setTeamOpen(snapshot.teamOpen);
      setMessage(snapshot.message);
      setError(snapshot.error);
      setKeyboardTarget(null);
      setColorPickerFor(null);
      setConfirmRemove(null);
      setConfirmResetSession(false);
      setSettingsOpen(false);
    }

    async function refreshMenuState() {
      try {
        applyEnvelope(await fetchMenuState<MenuMirrorSnapshot>());
      } catch {
        if (!cancelled) setError("Sin conexión con el menú principal");
      }
    }

    refreshMenuState();
    const interval = window.setInterval(refreshMenuState, 700);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [readOnlyMirror]);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const next = await fetchEngineStatus();
        if (cancelled) return;
        setStatus(next);
        setError("");
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Sin conexión con el motor");
      }
    }
    refresh();
    const id = window.setInterval(refresh, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    async function refreshCatalog() {
      if (cancelled || inFlight) return;
      inFlight = true;
      try {
        const next = await fetchGameCatalog();
        cachePlatformCatalog(next);
        if (!cancelled) setPlatformCatalog(next);
      } catch {
        if (!cancelled) setPlatformCatalog((current) => current);
      } finally {
        inFlight = false;
      }
    }
    const refreshOnDemand = () => { void refreshCatalog(); };
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refreshCatalog();
    };
    void refreshCatalog();
    const interval = window.setInterval(refreshCatalog, platformCatalogRefreshMillis);
    window.addEventListener("motion-levels:refresh-catalog", refreshOnDemand);
    window.addEventListener("focus", refreshOnDemand);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("motion-levels:refresh-catalog", refreshOnDemand);
      window.removeEventListener("focus", refreshOnDemand);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  useEffect(() => {
    if (screenMode !== "game") return;
    const id = window.setInterval(() => setNowMs(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [screenMode]);

  useEffect(() => {
    if (!menu.sessionActive) return;
    const latestActivityUnix = Math.max(menu.sessionStartedUnix || 0, status?.lastPressureUnix || 0);
    if (!latestActivityUnix) return;
    const idleMillis = Date.now() - latestActivityUnix * 1000;
    if (idleMillis < noPressureSessionLimitMillis) return;
    void closeSession("no_pressure_1h");
  }, [menu.sessionActive, menu.sessionStartedUnix, status?.lastPressureUnix]);

  useEffect(() => {
    if (!status) return;
    const engineGame = gameForEngineStatus(status.currentGame, menu.selectedGame, menuGames);
    if (!engineGame) return;

    const engineIsAmbient = isAmbientCard(engineGame);
    const engineIsIdleLoop = animationIsIdleLoop(status.currentGame, status.phase);
    const syncKey = `${status.sessionId}:${status.currentGame}:${status.level || ""}:${status.phase}`;

    if (engineIsIdleLoop) {
      syncedEngineSession.current = syncKey;
      if (screenMode === "game") {
        setScreenMode("browse");
        setMessage("Juego finalizado");
      }
      return;
    }

    if (!menu.sessionActive) {
      setMenu((current) => ({
        ...current,
        sessionActive: true,
        sessionId: current.sessionId || status.venueSessionId || newVenueSessionID(),
        sessionStartedUnix: current.sessionStartedUnix || status.startedUnix || Math.floor(Date.now() / 1000),
        teamName: current.teamName || status.teamName || defaultTeamName(),
      }));
    }

    setMenu((current) => {
      const selectedLevels = engineGame.levels?.length && status.level && current.selectedLevels[engineGame.id] !== status.level ? { ...current.selectedLevels, [engineGame.id]: status.level } : current.selectedLevels;
      const progress = progressFor(engineGame, current);
      const syncedLevelNumber = status.level ? levelNumber(status.level) : 0;
      const levelProgress =
        engineGame.levels?.length && status.level && progress.unlockedThrough < syncedLevelNumber
          ? {
              ...current.levelProgress,
              [engineGame.id]: {
                ...progress,
                unlockedThrough: syncedLevelNumber,
              },
            }
          : current.levelProgress;
      const level = engineGame.levels?.find((candidate) => candidate.id === (status.level || selectedLevels[engineGame.id] || defaultLevelID(engineGame)));
      const difficulty = usesDifficulty(engineGame) ? closestSupportedDifficulty(difficultyFromEngine(status.difficulty, current.difficulty), supportedDifficultiesFor(engineGame, level)) : current.difficulty;
      if (
        current.selectedGame === engineGame.id &&
        current.category === menuCategoryForGame(engineGame, current.category) &&
        current.difficulty === difficulty &&
        current.selectedLevels === selectedLevels &&
        current.levelProgress === levelProgress
      ) {
        return current;
      }
      return {
        ...current,
        category: menuCategoryForGame(engineGame, current.category),
        selectedGame: engineGame.id,
        selectedLevels,
        levelProgress,
        difficulty,
      };
    });
    setLaunchedGameID(engineGame.id);
    setLevelBrowserGameID(null);
    setTeamOpen(false);
    setKeyboardTarget(null);

    if (engineIsAmbient) {
      if (screenMode === "game") setScreenMode("browse");
      syncedEngineSession.current = syncKey;
      return;
    }

    if (screenMode !== "game") {
      setScreenMode("game");
      setMessage("En curso");
    }
    if (syncedEngineSession.current !== syncKey) {
      syncPlayTiming(status, engineGame);
      syncedEngineSession.current = syncKey;
    }
  }, [status, menu.selectedGame, screenMode, menuGames]);

  useEffect(() => {
    if (screenMode !== "game") return;
    setTeamOpen(false);
    setKeyboardTarget(null);
    setColorPickerFor(null);
    setConfirmRemove(null);
    setConfirmResetSession(false);
  }, [screenMode]);

  useEffect(() => {
    if (!status?.sessionId) return;
    const attempts: FinishedLevelAttempt[] = [...(status.finishedLevelAttempts || [])];
    if (status.phase === "finished") {
      const game = menuGames.find((candidate) => engineGameID(candidate) === status.currentGame);
      const finishedLevel = status.level || (game ? selectedLevelFor(game) : "");
      const alreadyHasAttempt = attempts.some((attempt) => attempt.game === status.currentGame && attempt.level === finishedLevel);
      if (game?.levels?.length && finishedLevel && !alreadyHasAttempt) {
        attempts.push({
          attemptId: `${status.sessionId}:${status.currentGame}:${finishedLevel}:${status.success ? "success" : "failed"}:${status.elapsedMillis || 0}`,
          game: status.currentGame,
          level: finishedLevel,
          levelNumber: levelNumber(finishedLevel),
          difficulty: status.difficulty,
          result: status.success ? "success" : "failed",
          success: status.success,
          elapsedMillis: status.elapsedMillis || 0,
          endedUnixNanos: 0,
        });
      }
    }

    const pending = attempts
      .map((attempt) => ({ attempt, game: menuGames.find((candidate) => engineGameID(candidate) === attempt.game) }))
      .filter(({ attempt, game }) => game?.levels?.length && attempt.level && !processedFinishedSessions.current.has(attempt.attemptId));
    if (pending.length === 0) return;

    for (const { attempt } of pending) {
      processedFinishedSessions.current.add(attempt.attemptId);
    }
    setMenu((current) =>
      pending.reduce((next, { attempt, game }) => {
        if (!game?.levels?.length) return next;
        return recordLevelCompletion(next, game, attempt.level, attempt.success, difficultyFromEngine(attempt.difficulty, next.difficulty), attempt.elapsedMillis || 0);
      }, current),
    );
  }, [status, menuGames]);

  // Esc closes the topmost overlay (keyboard first, then dialogs, then the team drawer).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" && keyboardTarget) {
        event.preventDefault();
        setKeyboardTarget(null);
        return;
      }
      if (event.key !== "Escape") return;
      if (keyboardTarget) setKeyboardTarget(null);
      else if (colorPickerFor !== null) setColorPickerFor(null);
      else if (confirmRemove !== null) setConfirmRemove(null);
      else if (confirmResetSession) setConfirmResetSession(false);
      else if (settingsOpen) setSettingsOpen(false);
      else if (teamOpen) setTeamOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [keyboardTarget, colorPickerFor, confirmRemove, confirmResetSession, settingsOpen, teamOpen]);

  const availableGames = useMemo(() => new Set((status?.catalog || []).map((entry) => entry.game)), [status]);
  const activePlayers = menu.players.filter((player) => player.active);
  const enginePlayers = statusPlayersForDisplay(status);
  const activeCategory = categories.find((category) => category.id === menu.category) || categories[0];
  const levelsUnlocked = unlockLevelsEnabled(menu);
  const selectedGame = menuGames.find((game) => game.id === menu.selectedGame) || menuGames[0] || games[0];
  const launchedGame = menuGames.find((game) => game.id === launchedGameID) || selectedGame;
  const levelBrowserGame = menuGames.find((game) => game.id === levelBrowserGameID && gameBelongsToCategory(game, menu.category) && game.levels?.length) || null;
  const browsingLevels = Boolean(levelBrowserGame);
  const visibleGames = gamesForCategory(menuGames, menu.category);
  const selectedLevel = selectedGame.levels?.find((level) => level.id === selectedLevelFor(selectedGame));
  const selectedSupportedDifficulties = supportedDifficultiesFor(selectedGame, selectedLevel);
  const effectiveDifficulty = closestSupportedDifficulty(menu.difficulty, selectedSupportedDifficulties);
  const selectedDifficulty = difficulties.find((difficulty) => difficulty.id === effectiveDifficulty) || difficulties[0];
  const selectedLevelProgress = progressFor(selectedGame, menu);
  const selectedLevelIndex = selectedLevel ? levelNumber(selectedLevel.id) : 0;
  const selectedLevelBest = selectedLevel ? selectedLevelProgress.bestByLevel[selectedLevel.id] : undefined;
  const selectedLevelBestTime = selectedLevel ? selectedLevelProgress.bestTimeByLevel[selectedLevel.id] : undefined;
  const selectedLevelBestLabel = selectedLevelBestTime ? formatBestTime(selectedLevelBestTime) : selectedLevelBest ? difficulties.find((difficulty) => difficulty.id === selectedLevelBest)?.label || selectedLevelBest : "Sin superar";
  const selectedGameDurationLabel = selectedGame.duration || estimatedDurationLabel(selectedGame.estimatedDurationSeconds || 0) || "Sin estimar";
  const levelDetail = Boolean(selectedGame.levels?.length && selectedLevel);
  const gameActive = screenMode === "game";
  const launchedPlayers = rosterForGame(launchedGame, activePlayers);
  const displayPlayers = gameActive && enginePlayers.length > 0 ? enginePlayers : launchedPlayers;
  const headerPlayers = gameActive && enginePlayers.length > 0 ? enginePlayers : activePlayers;
  const launchedLevel = launchedGame.levels?.find((level) => level.id === (status?.level || selectedLevelFor(launchedGame)));
  const launchedModeLabel = isAmbientCard(launchedGame) ? "Ambiente" : launchedLevel?.label || selectedDifficulty.label;
  const pickerPlayer = menu.players.find((player) => player.id === colorPickerFor) || null;
  const removePlayer = menu.players.find((player) => player.id === confirmRemove) || null;
  const connectionState = error ? "connection-off" : status ? "connection-on" : "connection-pending";
  const menuPlayerCount = activePlayers.length || 1;
  const headerPlayerCount = headerPlayers.length || 1;
  const playerCountLabel = `${headerPlayerCount} ${headerPlayerCount === 1 ? "jugador" : "jugadores"}`;
  const selectedGamePlayerBounds = playerBoundsForGame(selectedGame);
  const selectedGamePlayerCount = Math.min(menuPlayerCount, selectedGamePlayerBounds.maxPlayers);
  const selectedGamePlayerCountLabel = `${selectedGamePlayerCount} ${selectedGamePlayerCount === 1 ? "jugador" : "jugadores"}`;
  const rosterIssue = useMemo(() => gameRosterIssue(selectedGame, menu.players), [selectedGame, menu.players]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", colors.blue);
    document.documentElement.style.setProperty("--accent-rgb", hexToRGB(colors.blue));
  }, []);

  useEffect(() => {
    if (menu.difficulty !== effectiveDifficulty) {
      setMenu((current) => ({ ...current, difficulty: effectiveDifficulty }));
    }
  }, [effectiveDifficulty, menu.difficulty]);

  function addPlayer() {
    const previousPlayerCount = activePlayers.length;
    const nextPlayers = menu.players.length < maxPlayers
      ? [
          ...menu.players,
          {
            id: menu.nextPlayerId + 1,
            name: "",
            color: firstAvailableColor(menu.players),
            active: true,
          },
        ]
      : menu.players;
    setMenu((current) => {
      if (current.players.length >= maxPlayers) return current;
      return {
        ...current,
        players: [
          ...current.players,
          {
            id: current.nextPlayerId + 1,
            name: "",
            color: firstAvailableColor(current.players),
            active: true,
          },
        ],
        nextPlayerId: current.nextPlayerId + 1,
      };
    });
    if (menu.players.length < maxPlayers) {
      captureMenuEvent("player_added", {
        previous_player_count: previousPlayerCount,
        next_player_count: previousPlayerCount + 1,
        players: rosterSnapshot(nextPlayers),
      });
    }
  }

  function ensurePlayers(current: MenuState): MenuState {
    if (current.players.some((player) => player.active)) return current;
    return {
      ...current,
      players: [{ id: current.nextPlayerId + 1, name: "", color: playerColors[0], active: true }],
      nextPlayerId: current.nextPlayerId + 1,
    };
  }

  function updatePlayer(id: number, patch: Partial<Player>) {
    const requestedPatch = typeof patch.name === "string" ? { ...patch, name: cleanNameWhitespace(patch.name, maxPlayerNameLength) } : patch;
    const currentPlayer = menu.players.find((player) => player.id === id);
    const nextPlayers = currentPlayer
      ? menu.players.map((player) => (player.id === id ? { ...player, ...requestedPatch } : player))
      : menu.players;
    if (typeof requestedPatch.name === "string" && currentPlayer && requestedPatch.name !== currentPlayer.name) {
      captureMenuEvent("player_renamed", {
        player_index: menu.players.filter((player) => player.active).findIndex((player) => player.id === id),
        player_name: playerLabel(nextPlayers, nextPlayers.find((player) => player.id === id) || currentPlayer),
        players: rosterSnapshot(nextPlayers),
      });
    }
    if (typeof requestedPatch.active === "boolean") {
      captureMenuEvent("player_active_toggled", {
        active: requestedPatch.active,
        player_count: activePlayers.length,
        players: rosterSnapshot(nextPlayers),
      });
    }
    if (requestedPatch.color) {
      captureMenuEvent("player_color_changed", {
        color: requestedPatch.color,
        player_count: activePlayers.length,
        players: rosterSnapshot(nextPlayers),
      });
    }
    setMenu((current) => {
      let nextPatch = requestedPatch;
      if (requestedPatch.color && current.players.some((player) => player.id !== id && player.active && player.color.toLowerCase() === requestedPatch.color?.toLowerCase())) {
        return current;
      }
      if (requestedPatch.active === true) {
        const player = current.players.find((candidate) => candidate.id === id);
        if (player && current.players.some((candidate) => candidate.id !== id && candidate.active && candidate.color.toLowerCase() === player.color.toLowerCase())) {
          nextPatch = { ...requestedPatch, color: firstAvailableColor(current.players, id) };
        }
      }
      return {
        ...current,
        players: current.players.map((player) => (player.id === id ? { ...player, ...nextPatch } : player)),
      };
    });
  }

  function deletePlayer(id: number) {
    const nextPlayers = menu.players.filter((player) => player.id !== id);
    captureMenuEvent("player_removed", {
      player_count: menu.players.filter((player) => player.active).length,
      players: rosterSnapshot(nextPlayers),
    });
    setMenu((current) => ({ ...current, players: current.players.filter((player) => player.id !== id) }));
    setConfirmRemove(null);
  }

  function beginSession(remoteRequest?: RemoteSessionRequest) {
    const defaultGame = menuGames[0] || games[0];
    const defaultSelectedLevels = defaultGame.levels?.length ? { [defaultGame.id]: defaultLevelID(defaultGame) } : {};
    const nextTeamName = remoteRequest?.teamName || defaultTeamName();
    const nextSessionID = remoteRequest?.venueSessionId || newVenueSessionID();
    const nowUnix = Math.floor(Date.now() / 1000);
    const nextPlayers = remoteRequest ? playersForCount(remoteRequest.configuredPlayerCount) : defaultPlayers;
    postVenueSession({
      action: "start",
      venueSessionId: nextSessionID,
      teamName: nextTeamName,
      kioskId: menuKioskID(),
    });
    captureMenuEvent("session_started", {
      default_team_name: !remoteRequest,
      remote_reservation: Boolean(remoteRequest),
      reservation_id: remoteRequest?.reservationId,
      reserved_player_count: remoteRequest?.playerCount,
      venue_session_id: nextSessionID,
    });
    setMenu((current) => ({
      ...current,
      sessionActive: true,
      sessionId: nextSessionID,
      sessionStartedUnix: nowUnix,
      teamName: nextTeamName,
      players: nextPlayers,
      category: menuCategoryForGame(defaultGame, "featured"),
      selectedGame: defaultGame.id,
      difficulty: "easy",
      selectedLevels: defaultSelectedLevels,
      levelProgress: {},
      nextPlayerId: Math.max(0, ...nextPlayers.map((player) => player.id)),
      narrationArmed: {},
    }));
    if (remoteRequest) {
      setRemoteSessionRequest(null);
      clearRemoteSessionURL();
    }
    setMessage("");
    setError("");
    setScreenMode("browse");
    setLevelBrowserGameID(null);
    setTeamOpen(true);
    setKeyboardTarget(null);
    setColorPickerFor(null);
    setConfirmRemove(null);
    setConfirmResetSession(false);
  }

  async function closeSession(reason = "manual") {
    const defaultGame = menuGames[0] || games[0];
    const defaultSelectedLevels = defaultGame.levels?.length ? { [defaultGame.id]: defaultLevelID(defaultGame) } : {};
    if (menu.sessionId) {
      postVenueSession({
        action: "end",
        venueSessionId: menu.sessionId,
        reason,
        kioskId: menuKioskID(),
      });
    }
    captureMenuEvent("session_closed", {
      category: menu.category,
      reason,
      venue_session_id: menu.sessionId,
      player_count: activePlayers.length,
      selected_game: selectedGame.id,
    });
    setMenu((current) => ({
      ...current,
      sessionActive: false,
      sessionId: "",
      sessionStartedUnix: 0,
      teamName: "",
      players: defaultPlayers,
      category: menuCategoryForGame(defaultGame, "featured"),
      selectedGame: defaultGame.id,
      difficulty: "easy",
      selectedLevels: defaultSelectedLevels,
      levelProgress: {},
      nextPlayerId: 1,
      narrationArmed: {},
    }));
    setKeyboardTarget(null);
    setColorPickerFor(null);
    setConfirmRemove(null);
    setConfirmResetSession(false);
    setTeamOpen(false);
    setLevelBrowserGameID(null);
    setScreenMode("browse");
    setMessage("");
    setError("");
    if (status?.currentGame && !animationIsIdleLoop(status.currentGame, status.phase)) {
      try {
        setStatus(await controlGame("exit"));
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo cerrar la sesión");
      }
    }
  }

  function confirmRemoteSessionStart() {
    if (!remoteSessionRequest) return;
    beginSession(remoteSessionRequest);
  }

  function dismissRemoteSessionStart() {
    setRemoteSessionRequest(null);
    clearRemoteSessionURL();
  }

  function openSettings() {
    captureMenuEvent("settings_opened", {
      operator_unlock_levels: menu.operatorUnlockLevels,
    });
    setSettingsOpen(true);
    setSettingsUnlocked(false);
    setSettingsPin("");
    setSettingsError("");
  }

  function closeSettings() {
    setSettingsOpen(false);
    setSettingsUnlocked(false);
    setSettingsPin("");
    setSettingsError("");
  }

  function setOperatorUnlockLevels(enabled: boolean) {
    captureMenuEvent("operator_unlock_levels_changed", {
      enabled,
      env_unlock_levels: envUnlockLevels,
    });
    setMenu((current) => ({ ...current, operatorUnlockLevels: enabled }));
  }

  function submitSettingsPin(pin = settingsPin) {
    if (pin === operatorSettingsPin) {
      setSettingsUnlocked(true);
      setSettingsPin("");
      setSettingsError("");
      captureMenuEvent("settings_unlocked");
      return;
    }
    setSettingsPin("");
    setSettingsError("Código incorrecto");
    captureMenuEvent("settings_pin_failed");
  }

  function typeSettingsPinDigit(digit: string) {
    setSettingsError("");
    setSettingsPin((current) => {
      const next = `${current}${digit}`.slice(0, 6);
      if (next.length === 6) window.setTimeout(() => submitSettingsPin(next), 0);
      return next;
    });
  }

  function keyboardValue() {
    if (!keyboardTarget) return "";
    if (keyboardTarget.kind === "team") return menu.teamName;
    return menu.players.find((player) => player.id === keyboardTarget.id)?.name || "";
  }

  function keyboardTitle() {
    if (!keyboardTarget) return "";
    if (keyboardTarget.kind === "team") return "Nombre del equipo";
    const player = menu.players.find((candidate) => candidate.id === keyboardTarget.id);
    return player ? `Jugador ${menu.players.indexOf(player) + 1}` : "Jugador";
  }

  function keyboardMaxLength() {
    return keyboardTarget?.kind === "team" ? maxTeamNameLength : maxPlayerNameLength;
  }

  function setKeyboardValue(value: string) {
    if (!keyboardTarget) return;
    const next = cleanNameWhitespace(value, keyboardMaxLength());
    if (keyboardTarget.kind === "team") {
      captureMenuEvent("team_renamed", {
        team_name: next,
      });
      setMenu((current) => ({ ...current, teamName: next }));
      return;
    }
    updatePlayer(keyboardTarget.id, { name: next });
  }

  function regenerateTeamName() {
    setMenu((current) => ({ ...current, teamName: defaultTeamName() }));
    setKeyboardTarget({ kind: "team" });
  }

  function typeKey(key: string) {
    const current = keyboardValue();
    setKeyboardValue(`${current}${key}`);
  }

  function selectGameCard(gameID: string) {
    const game = menuGames.find((candidate) => candidate.id === gameID);
    if (game) {
      captureMenuEvent("game_selected", {
        category: game.category,
        engine_game: engineGameID(game),
        game: game.id,
        has_levels: Boolean(game.levels?.length),
        player_count: activePlayers.length,
      });
    }
    setMenu((current) => {
      const selectedLevels = game?.levels?.length && !current.selectedLevels[gameID] ? { ...current.selectedLevels, [gameID]: defaultLevelID(game) } : current.selectedLevels;
      const levelID = game?.levels?.length ? selectedLevels[gameID] || defaultLevelID(game) : "";
      const level = game?.levels?.find((candidate) => candidate.id === levelID);
      return {
        ...current,
        difficulty: game ? closestSupportedDifficulty(current.difficulty, supportedDifficultiesFor(game, level)) : current.difficulty,
        selectedGame: gameID,
        selectedLevels,
      };
    });
    setLevelBrowserGameID(game?.levels?.length ? game.id : null);
    if (game && isAmbientCard(game) && !game.disabled && availableGames.has(engineGameID(game))) {
      void launch(game.id);
    }
  }

  function selectedLevelFor(game: GameCard, state = menu): string {
    if (!game.levels?.length) return "";
    const selected = state.selectedLevels[game.id] || defaultLevelID(game);
    return isLevelUnlocked(game, selected, state) ? selected : defaultLevelID(game);
  }

  function setSelectedLevel(game: GameCard, levelID: string) {
    if (!isLevelUnlocked(game, levelID, menu)) {
      captureMenuEvent("locked_level_tapped", {
        engine_game: engineGameID(game),
        game: game.id,
        level: levelID,
        level_number: levelNumber(levelID),
      });
      return;
    }
    const level = game.levels?.find((candidate) => candidate.id === levelID);
    captureMenuEvent("level_selected", {
      difficulty: closestSupportedDifficulty(menu.difficulty, supportedDifficultiesFor(game, level)),
      engine_game: engineGameID(game),
      game: game.id,
      level: levelID,
      level_number: levelNumber(levelID),
    });
    setMenu((current) => ({
      ...current,
      difficulty: closestSupportedDifficulty(current.difficulty, supportedDifficultiesFor(game, level)),
      selectedLevels: {
        ...current.selectedLevels,
        [game.id]: levelID,
      },
    }));
  }

  function renderLevelOption(game: GameCard, level: NonNullable<GameCard["levels"]>[number]) {
    const active = selectedLevelFor(game) === level.id;
    const progress = progressFor(game, menu);
    const bestDifficulty = progress.bestByLevel[level.id];
    const locked = !isLevelUnlocked(game, level.id, menu);
    const previewDifficulty = closestSupportedDifficulty(menu.difficulty, supportedDifficultiesFor(game, level));
    return (
      <button
        key={level.id}
        className={`level-option ${active ? "active" : ""} ${locked ? "locked" : ""} ${bestDifficulty ? "passed" : ""}`}
        style={{ "--level-color": difficultyColor(bestDifficulty), "--level-rgb": hexToRGB(difficultyColor(bestDifficulty)), "--c": game.color, "--crgb": hexToRGB(game.color) } as CSSProperties}
        type="button"
        role="radio"
        disabled={locked}
        aria-checked={active}
        aria-disabled={locked}
        onClick={() => setSelectedLevel(game, level.id)}
      >
        <Preview src={levelPreviewSrc(game, level, previewDifficulty)} animationID={levelPreviewAnimationID(game, level)} compact />
        <span className="level-footer">
          <strong>{level.label}</strong>
          {locked ? (
            <span className="level-state locked-label">Bloqueado</span>
          ) : (
            <span className={`level-state ${bestDifficulty ? "rated" : "unrated"}`}>
              <StarRating difficulty={bestDifficulty} label="Mejor dificultad" muted={!bestDifficulty} />
            </span>
          )}
        </span>
      </button>
    );
  }

  function narrationArmedFor(game: GameCard, state = menu): boolean {
    if (!supportsNarration(game)) return false;
    return state.narrationArmed[game.id] ?? true;
  }

  function setNarrationArmed(game: GameCard, armed: boolean) {
    captureMenuEvent("narration_toggled", {
      engine_game: engineGameID(game),
      game: game.id,
      narration_enabled: armed,
    });
    setMenu((current) => ({
      ...current,
      narrationArmed: {
        ...current.narrationArmed,
        [game.id]: armed,
      },
    }));
    setMessage((current) => (current.startsWith("Narración") ? "" : current));
  }

  async function launch(gameID = selectedGame.id) {
    const game = menuGames.find((candidate) => candidate.id === gameID);
    if (!game || game.disabled || !availableGames.has(engineGameID(game))) {
      captureMenuEvent("start_blocked", {
        engine_game: game ? engineGameID(game) : gameID,
        game: game?.id || gameID,
        reason: !game ? "missing" : game.disabled ? "disabled" : "engine_unavailable",
      });
      return;
    }
    let nextMenu = ensurePlayers({ ...menu, selectedGame: game.id });
    if (!nextMenu.sessionId) {
      nextMenu = {
        ...nextMenu,
        sessionActive: true,
        sessionId: newVenueSessionID(),
        sessionStartedUnix: nextMenu.sessionStartedUnix || Math.floor(Date.now() / 1000),
      };
    }
    const nextRosterIssue = gameRosterIssue(game, nextMenu.players);
    if (!isAmbientCard(game) && nextRosterIssue) {
      captureMenuEvent("start_blocked", {
        engine_game: engineGameID(game),
        game: game.id,
        player_count: nextMenu.players.filter((player) => player.active).length,
        reason: "roster_issue",
      });
      setMenu(nextMenu);
      setMessage("");
      setError(nextRosterIssue.message);
      setTeamOpen(true);
      return;
    }
    const playNarration = narrationArmedFor(game, nextMenu);
    const launchRoster = rosterForGame(game, nextMenu.players);
    const selectedLevelID = selectedLevelFor(game, nextMenu);
    const launchLevel = game.levels?.find((level) => level.id === selectedLevelID);
    const launchDifficulty = usesDifficulty(game) ? closestSupportedDifficulty(nextMenu.difficulty, supportedDifficultiesFor(game, launchLevel)) : undefined;
    if (launchDifficulty && nextMenu.difficulty !== launchDifficulty) {
      nextMenu = { ...nextMenu, difficulty: launchDifficulty };
    }
    if (selectedLevelID && !isLevelUnlocked(game, selectedLevelID, nextMenu)) {
      captureMenuEvent("start_blocked", {
        engine_game: engineGameID(game),
        game: game.id,
        level: selectedLevelID,
        level_number: levelNumber(selectedLevelID),
        reason: "level_locked",
      });
      setMenu(nextMenu);
      setMessage("");
      setError("Nivel bloqueado");
      return;
    }
    setMenu(nextMenu);
    setMessage("Iniciando");
    setError("");
    captureMenuEvent("game_started", {
      ambient: isAmbientCard(game),
      category: game.category,
      difficulty: launchDifficulty,
      difficulty_label: launchDifficulty ? difficulties.find((difficulty) => difficulty.id === launchDifficulty)?.label : undefined,
      engine_game: engineGameID(game),
      game: game.id,
      game_label: game.label,
      level: selectedLevelID || undefined,
      level_label: launchLevel?.label,
      level_number: selectedLevelID ? levelNumber(selectedLevelID) : undefined,
      narration_enabled: supportsNarration(game) ? playNarration : false,
      player_count: launchRoster.length,
      venue_session_id: nextMenu.sessionId,
    });
    try {
      const nextStatus = await selectGame({
        game: engineGameID(game),
        venueSessionId: nextMenu.sessionId,
        playerCount: Math.max(1, launchRoster.length),
        difficulty: launchDifficulty,
        level: selectedLevelID || undefined,
        narrationEnabled: supportsNarration(game) ? playNarration : false,
        teamName: nextMenu.teamName.trim(),
        players: launchRoster.map((player, index) => ({
          index,
          label: playerLabel(nextMenu.players, player),
          color: hexToColor(player.color),
        })),
      });
      setStatus(nextStatus);
      setMessage("En curso");
      setLaunchedGameID(game.id);
      if (supportsNarration(game) && playNarration) {
        setMenu((current) => ({
          ...current,
          narrationArmed: {
            ...current.narrationArmed,
            [game.id]: false,
          },
        }));
      }
      syncPlayTiming(nextStatus, game);
      setTeamOpen(false);
      setKeyboardTarget(null);
      setScreenMode(isAmbientCard(game) ? "browse" : "game");
    } catch (err) {
      captureMenuEvent("start_failed", {
        engine_game: engineGameID(game),
        error: err instanceof Error ? err.message : "unknown",
        game: game.id,
      });
      setError(err instanceof Error ? err.message : "No se pudo iniciar el juego");
    }
  }

  async function restartLaunchedGame() {
    captureMenuEvent("game_restarted", {
      engine_game: engineGameID(launchedGame),
      game: launchedGame.id,
      level: status?.level || selectedLevelFor(launchedGame) || undefined,
    });
    await launch(launchedGame.id);
    setMessage("Reiniciando");
  }

  async function sendGameControl(action: "pause" | "resume" | "restart" | "exit" | "narration" | "mute" | "unmute" | "toggle_mute") {
    setError("");
    captureMenuEvent("control_used", {
      action,
      engine_game: engineGameID(launchedGame),
      game: launchedGame.id,
      level: status?.level || undefined,
      phase: status?.phase,
    });
    try {
      const nextStatus = await controlGame(action);
      setStatus(nextStatus);
      if (action === "restart") {
        syncPlayTiming(nextStatus, launchedGame);
        setMessage("Reiniciando");
      } else if (action === "exit") {
        setScreenMode("browse");
        setMessage("Juego finalizado");
      } else if (action === "narration") {
        setMessage("Narración");
      } else if (action === "toggle_mute" || action === "mute" || action === "unmute") {
        setMessage(nextStatus.audioMuted ? "Audio silenciado" : "Audio activo");
      } else {
        setMessage(action === "pause" ? "Pausado" : "En curso");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo controlar el juego");
    }
  }

  function syncPlayTiming(nextStatus: EngineStatus, game: GameCard) {
    const now = Date.now();
    if (isAmbientCard(game)) {
      setIntroUntil(now);
      setCountdownUntil(now);
      setNowMs(now);
      return;
    }
    const introMillis = nextStatus.phase === "intro" ? Math.max(0, nextStatus.introRemainingMillis || 0) : 0;
    const countdownMillis =
      nextStatus.phase === "intro" || nextStatus.phase === "countdown"
        ? Math.max(0, nextStatus.countdownRemainingMillis || 0)
        : 0;
    setIntroUntil(now + introMillis);
    setCountdownUntil(now + introMillis + countdownMillis);
    setNowMs(now);
  }

  const introActive = screenMode === "game" && introUntil > nowMs;
  const countdownValue = screenMode === "game" && !introActive ? Math.max(0, Math.ceil((countdownUntil - nowMs) / 1000)) : 0;
  const launchIssue = !isAmbientCard(selectedGame) ? rosterIssue?.message || "" : "";
  const launchStatusMessage = error || launchIssue || message || (isAmbientCard(selectedGame) ? "Ambiente listo" : "Listo para jugar");

  function enterBrowserFullscreen() {
    const fullscreenDocument = document as Document & { webkitFullscreenElement?: Element | null };
    if (document.fullscreenElement || fullscreenDocument.webkitFullscreenElement) return;
    const root = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
    const requestFullscreen = root.requestFullscreen?.bind(root) || root.webkitRequestFullscreen?.bind(root);
    if (!requestFullscreen) return;
    captureMenuEvent("fullscreen_requested");
    Promise.resolve(requestFullscreen()).catch((err) => {
      console.warn("Fullscreen request failed", err);
    });
  }

  if (!menu.sessionActive && screenMode !== "game") {
    return (
      <WelcomeScreen
        connectionState={connectionState}
        readOnly={readOnlyMirror}
        remoteSessionRequest={remoteSessionRequest}
        onCancelRemoteStart={dismissRemoteSessionStart}
        onConfirmRemoteStart={confirmRemoteSessionStart}
        onStart={() => beginSession()}
        onFullscreen={enterBrowserFullscreen}
      />
    );
  }

  return (
    <main className={`app ${connectionState} ${readOnlyMirror ? "read-only-mirror" : ""} ${keyboardTarget ? `keyboard-open keyboard-${keyboardTarget.kind}` : ""} ${screenMode === "game" ? "playing" : ""}`}>
      <header className="topbar">
        <div className="brand">
          <button className="brand-mark" type="button" aria-label="Pantalla completa" title="Pantalla completa" onClick={enterBrowserFullscreen} />
          <div className="brand-copy">
            <b>Motion Levels</b>
            <span>Quiosco</span>
          </div>
        </div>
        <nav className="category-tabs top-category-tabs" aria-label="Categorías de juegos">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`tab ${menu.category === category.id ? "active" : ""}`}
              type="button"
              disabled={gameActive}
              aria-pressed={menu.category === category.id}
              onClick={() => {
                if (gameActive) return;
                const categoryGames = gamesForCategory(menuGames, category.id);
                const first = categoryGames[0];
                captureMenuEvent("category_selected", {
                  category: category.id,
                  game_count: categoryGames.length,
                  selected_game: first?.id,
                });
                setMenu((current) => {
                  const selectedGameID = first?.id || current.selectedGame;
                  const selectedLevels = first?.levels?.length && !current.selectedLevels[selectedGameID] ? { ...current.selectedLevels, [selectedGameID]: defaultLevelID(first) } : current.selectedLevels;
                  const levelID = first?.levels?.length ? selectedLevels[selectedGameID] || defaultLevelID(first) : "";
                  const level = first?.levels?.find((candidate) => candidate.id === levelID);
                  return {
                    ...current,
                    category: category.id,
                    difficulty: first ? closestSupportedDifficulty(current.difficulty, supportedDifficultiesFor(first, level)) : current.difficulty,
                    selectedGame: selectedGameID,
                    selectedLevels,
                  };
                });
                setLevelBrowserGameID(null);
              }}
            >
              <span className="tab-emoji" aria-hidden="true">
                {category.icon}
              </span>
              <span>{category.label}</span>
            </button>
          ))}
        </nav>
        <div className="status-capsules">
          <button
            className={`capsule audio-btn ${status?.audioMuted ? "muted" : ""}`}
            type="button"
            onClick={() => sendGameControl("toggle_mute")}
            disabled={!status?.audioEnabled}
            aria-label={status?.audioMuted ? "Unmute" : "Mute"}
            title={status?.audioMuted ? "Unmute" : "Mute"}
          >
            {status?.audioMuted ? <VolumeMutedIcon /> : <VolumeIcon />}
          </button>
          <button
            className={`capsule equipo-btn ${rosterIssue ? "invalid" : ""}`}
            type="button"
            onClick={() => {
              if (gameActive) return;
              captureMenuEvent("team_opened", {
                player_count: activePlayers.length,
                selected_game: selectedGame.id,
              });
              setTeamOpen(true);
            }}
            disabled={gameActive}
            aria-label={gameActive ? "Equipo no disponible durante la partida" : "Abrir equipo"}
            title={gameActive ? "Sal de la partida para cambiar el equipo" : undefined}
          >
            <span className="mini-avatars">
              {headerPlayers.slice(0, 6).map((player) => (
                <span key={player.id} style={{ "--pc": player.color } as CSSProperties} />
              ))}
            </span>
            <strong>{playerCountLabel}</strong>
          </button>
          <button
            className={`capsule settings-btn ${levelsUnlocked ? "active" : ""}`}
            type="button"
            onClick={openSettings}
            aria-label="Ajustes"
            aria-pressed={levelsUnlocked}
            title="Ajustes"
          >
            <GearIcon />
          </button>
        </div>
      </header>

      {screenMode === "game" ? (
        <GameControlScreen
          game={launchedGame}
          status={status}
          players={displayPlayers}
          allPlayers={displayPlayers.length > 0 ? displayPlayers : menu.players}
          modeLabel={launchedModeLabel}
          ambient={isAmbientCard(launchedGame)}
          introActive={introActive}
          countdownValue={countdownValue}
          error={error}
          onPauseToggle={() => sendGameControl(status?.paused ? "resume" : "pause")}
          onRestart={() => restartLaunchedGame()}
          narrationSupported={supportsNarration(launchedGame)}
          narrationArmed={narrationArmedFor(launchedGame)}
          onNarrationToggle={() => setNarrationArmed(launchedGame, !narrationArmedFor(launchedGame))}
          onExit={() => sendGameControl("exit")}
        />
      ) : (
      <section className="layout">
        <div className={`drawer-backdrop ${teamOpen ? "open" : ""}`} onClick={() => setTeamOpen(false)} />
        <aside className={`panel team-panel team-drawer ${teamOpen ? "open" : ""}`} aria-label="Configuración del equipo" aria-hidden={!teamOpen}>
          <div className="drawer-head">
            <div>
              <strong>Equipo</strong>
              <span>{playerCountLabel}</span>
            </div>
            <button className="icon-button" type="button" aria-label="Cerrar equipo" onClick={() => setTeamOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <section className={`team-name ${keyboardTarget?.kind === "team" ? "editing" : ""}`}>
            <div className="team-name-head">
              <div>
                <div className="micro">Equipo</div>
                <strong>Alias de partida</strong>
              </div>
              <button className="btn compact name-refresh" type="button" onClick={regenerateTeamName}>
                <RestartIcon />
                Nuevo
              </button>
            </div>
            <input
              className="ph-no-capture"
              value={menu.teamName}
              maxLength={maxTeamNameLength}
              autoComplete="off"
              spellCheck={false}
              placeholder="Nombre del equipo"
              inputMode="none"
              onFocus={() => setKeyboardTarget({ kind: "team" })}
              onClick={() => setKeyboardTarget({ kind: "team" })}
              onChange={(event) => setMenu((current) => ({ ...current, teamName: cleanNameWhitespace(event.target.value, maxTeamNameLength) }))}
            />
          </section>

          <section className="roster" aria-label="Jugadores">
            {menu.players.length === 0 ? <div className="message">Añade un jugador o usa el inicio rápido.</div> : null}
            {menu.players.map((player, index) => {
              const invalidPlayer = Boolean(rosterIssue?.playerIds.has(player.id));
              const editingPlayer = keyboardTarget?.kind === "player" && keyboardTarget.id === player.id;
              return (
                <article key={player.id} className={`player ${player.active ? "" : "off"} ${invalidPlayer ? "invalid" : ""} ${editingPlayer ? "editing" : ""}`} style={{ "--pc": player.color } as CSSProperties}>
                  <button className="avatar" type="button" onClick={() => setColorPickerFor(player.id)} aria-label={`Elegir color de ${playerLabel(menu.players, player)}`}>
                    {avatarLabel(menu.players, player)}
                  </button>
                  <input
                    className="ph-no-capture"
                    value={player.name}
                    maxLength={maxPlayerNameLength}
                    aria-label="Nombre del jugador"
                    autoComplete="off"
                    spellCheck={false}
                    inputMode="none"
                    aria-invalid={invalidPlayer || undefined}
                    placeholder={`Jugador ${index + 1}`}
                    onFocus={() => setKeyboardTarget({ kind: "player", id: player.id })}
                    onClick={() => setKeyboardTarget({ kind: "player", id: player.id })}
                    onChange={(event) => updatePlayer(player.id, { name: event.target.value })}
                  />
                  <div className="player-actions">
                    <button
                      className="icon-button"
                      type="button"
                      title={player.active ? "Descansar" : "Activar"}
                      aria-label={player.active ? `Poner a descansar a ${playerLabel(menu.players, player)}` : `Activar a ${playerLabel(menu.players, player)}`}
                      onClick={() => updatePlayer(player.id, { active: !player.active })}
                    >
                      {player.active ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button className="icon-button danger" type="button" title="Quitar" aria-label={`Quitar a ${playerLabel(menu.players, player)}`} onClick={() => setConfirmRemove(player.id)}>
                      <CloseIcon />
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="team-actions">
            <button className="btn" type="button" onClick={addPlayer} disabled={menu.players.length >= maxPlayers}>
              <PlusIcon />
              Añadir jugador
            </button>
            <button className="btn session-reset" type="button" onClick={() => setConfirmResetSession(true)}>
              <CloseIcon />
              Cerrar sesión
            </button>
          </section>

          <button className="btn primary drawer-done" type="button" onClick={() => setTeamOpen(false)}>
            <CheckIcon />
            Listo
          </button>
        </aside>

        <section className="main-panel">
          <section className="browse-content">
            <section className="game-grid-panel" aria-labelledby="games-heading">
              <div className="section-head">
                <div>
                  <span className="micro">{browsingLevels ? "Elige nivel" : "Elige juego"}</span>
                  <h2 id="games-heading">{levelBrowserGame?.label || activeCategory.label}</h2>
                </div>
                {browsingLevels ? (
                  <div className="level-browser-actions">
                    {levelsUnlocked ? <span className="dev-unlock-pill">Dev: niveles abiertos</span> : null}
                    <button className="btn compact back-to-games" type="button" onClick={() => setLevelBrowserGameID(null)}>
                      <ArrowLeftIcon />
                      Juegos
                    </button>
                  </div>
                ) : (
                  <span className="grid-count">{visibleGames.length} modos</span>
                )}
              </div>
              {browsingLevels && levelBrowserGame?.levels?.length ? (
                <section key={`${levelBrowserGame.id}-levels`} className="levels-grid" role="radiogroup" aria-label={`Niveles de ${levelBrowserGame.label}`}>
                  {levelBrowserGame.levels.map((level) => renderLevelOption(levelBrowserGame, level))}
                </section>
              ) : (
                <section key={menu.category} className="games game-grid" aria-label="Juegos">
                  {visibleGames.map((game, index) => {
                    const future = Boolean(game.disabled);
                    const engineAvailable = availableGames.has(engineGameID(game));
                    const selected = menu.selectedGame === game.id;
                    const active = selected && status?.currentGame === engineGameID(game);
                    return (
                      <button
                        key={game.id}
                        className={`card game-card ${future ? "disabled" : ""} ${!future && !engineAvailable ? "unavailable" : ""} ${selected ? "selected" : ""} ${active ? "active" : ""}`}
                        style={{ "--c": game.color, "--crgb": hexToRGB(game.color), "--i": index } as CSSProperties}
                        type="button"
                        disabled={future}
                        data-game-id={game.id}
                        aria-pressed={selected}
                        onClick={() => selectGameCard(game.id)}
                      >
                        <Preview src={game.previewSrc} animationID={previewAnimationID(game)} />
                        <div className="game-body">
                          <h3>{game.label}</h3>
                        </div>
                      </button>
                    );
                  })}
                </section>
              )}
            </section>

            <aside className={`panel detail-panel ${levelDetail ? "level-detail-panel" : ""}`} style={{ "--c": selectedGame.color, "--crgb": hexToRGB(selectedGame.color) } as CSSProperties} aria-label="Juego seleccionado">
              <div className="detail-preview">
                <Preview src={levelPreviewSrc(selectedGame, selectedLevel, effectiveDifficulty)} animationID={levelPreviewAnimationID(selectedGame, selectedLevel)} />
              </div>
              <div className="detail-copy">
                {levelDetail && selectedLevel ? (
                  <>
                    <section className="season-summary" aria-label="Juego actual">
                      <span className="micro">Juego actual</span>
                      <div className="season-title-row">
                        <h2>{selectedGame.label}</h2>
                        <span className="season-progress">
                          {selectedLevelIndex}/{selectedGame.levels?.length}
                        </span>
                      </div>
                      <p>{selectedGame.description}</p>
                    </section>
                    <section className="season-level-row" aria-label="Nivel seleccionado">
                      <span className="micro">Nivel</span>
                      <div>
                        <strong>{selectedLevel.label}</strong>
                        <p>{selectedLevel.description}</p>
                      </div>
                    </section>
                    <section className="season-facts" aria-label="Resumen de partida">
                      <div>
                        <span>{isIndividualCard(selectedGame) ? "Jugador" : "Equipo"}</span>
                        <strong>{selectedGamePlayerCountLabel}</strong>
                      </div>
                      <div>
                        <span>Dificultad</span>
                        <strong>{selectedDifficulty.label}</strong>
                      </div>
                      <div>
                        <span>Mejor</span>
                        <strong>{selectedLevelBestLabel}</strong>
                      </div>
                      <div>
                        <span>Duración</span>
                        <strong>{selectedGameDurationLabel}</strong>
                      </div>
                    </section>
                  </>
                ) : (
                  <>
                    <span className="micro">Seleccionado</span>
                    <h2>{selectedGame.label}</h2>
                    <p>{selectedGame.description}</p>
                    <section className="season-facts" aria-label="Resumen de partida">
                      <div>
                        <span>{isIndividualCard(selectedGame) ? "Jugador" : "Equipo"}</span>
                        <strong>{selectedGamePlayerCountLabel}</strong>
                      </div>
                      <div>
                        <span>Dificultad</span>
                        <strong>{selectedDifficulty.label}</strong>
                      </div>
                      <div>
                        <span>Duración</span>
                        <strong>{selectedGameDurationLabel}</strong>
                      </div>
                    </section>
                    <div className="detail-rules">
                      <span className="micro">Reglas rápidas</span>
                      <ul>
                        {selectedGame.rules.map((rule) => (
                          <li key={rule}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="detail-note">
                      {isAmbientCard(selectedGame)
                        ? "Las animaciones de ambiente se pueden cambiar al instante desde esta pantalla."
                        : "Revisa equipo y dificultad antes de empezar. La partida se lanza desde el botón principal."}
                    </p>
                  </>
                )}
              </div>
            </aside>
          </section>

          <section className="panel launch-bar" aria-label="Resumen de inicio">
            <div className={`launch-copy ${isAmbientCard(selectedGame) ? "ambient" : ""}`}>
              <div className="launch-selected">
                <span className={`launch-status ${error || launchIssue ? "error" : ""}`}>{launchStatusMessage}</span>
                <strong>{selectedGame.label}</strong>
              </div>
              {usesDifficulty(selectedGame) ? (
                <div className="launch-difficulty" role="group" aria-label="Dificultad">
                  {difficulties.map((difficulty) => (
                    (() => {
                      const supported = selectedSupportedDifficulties.includes(difficulty.id);
                      return (
                        <button
                          key={difficulty.id}
                          className={`launch-difficulty-button ${effectiveDifficulty === difficulty.id ? "active" : ""} ${supported ? "" : "unavailable"}`}
                          style={{ "--accent": difficulty.color, "--accent-rgb": hexToRGB(difficulty.color) } as CSSProperties}
                          type="button"
                          disabled={!supported}
                          aria-pressed={effectiveDifficulty === difficulty.id}
                          aria-disabled={!supported}
                          title={supported ? undefined : "No disponible en este nivel"}
                          onClick={() => {
                            if (!supported) return;
                            captureMenuEvent("difficulty_changed", {
                              difficulty: difficulty.id,
                              engine_game: engineGameID(selectedGame),
                              game: selectedGame.id,
                              level: selectedLevel?.id || undefined,
                            });
                            setMenu((current) => ({ ...current, difficulty: difficulty.id }));
                          }}
                        >
                          <span className="difficulty-label">{difficulty.label}</span>
                          <StarRating difficulty={difficulty.id} label={difficulty.label} />
                        </button>
                      );
                    })()
                  ))}
                </div>
              ) : null}
            </div>
            {(() => {
              const engineAvailable = availableGames.has(engineGameID(selectedGame));
              const rosterBlocked = !isAmbientCard(selectedGame) && Boolean(rosterIssue);
              const levelBlocked = Boolean(selectedGame.levels?.length && !isLevelUnlocked(selectedGame, selectedLevelFor(selectedGame), menu));
              const blocked = selectedGame.disabled || !engineAvailable || rosterBlocked || levelBlocked;
              const blockedLabel = levelBlocked ? "Nivel bloqueado" : rosterBlocked ? "Revisa equipo" : selectedGame.disabled ? "Próximamente" : error ? "Sin conexión" : "No disponible";
              return (
                <div className="launch-actions">
                  {supportsNarration(selectedGame) ? (
                    <button
                      className={`btn narration-toggle ${narrationArmedFor(selectedGame) ? "active" : ""}`}
                      type="button"
                      aria-pressed={narrationArmedFor(selectedGame)}
                      onClick={() => setNarrationArmed(selectedGame, !narrationArmedFor(selectedGame))}
                    >
                      <BoltIcon />
                      {narrationArmedFor(selectedGame) ? "Narración ON" : "Narración OFF"}
                    </button>
                  ) : null}
                  <button className="btn primary play" type="button" disabled={blocked} onClick={() => launch()}>
                    {blocked ? (
                      blockedLabel
                    ) : (
                      <>
                        <PlayIcon />
                        {isAmbientCard(selectedGame) ? "Reproducir" : "Empezar"}
                      </>
                    )}
                  </button>
                </div>
              );
            })()}
          </section>
        </section>
      </section>
      )}

      {pickerPlayer ? (
        <ColorPicker
          player={pickerPlayer}
          takenColors={new Set(menu.players.filter((player) => player.active && player.id !== pickerPlayer.id).map((player) => player.color.toLowerCase()))}
          onPick={(color) => {
            updatePlayer(pickerPlayer.id, { color });
            setColorPickerFor(null);
          }}
          onClose={() => setColorPickerFor(null)}
        />
      ) : null}

      {removePlayer ? (
        <ConfirmDialog
          title="¿Quitar jugador?"
          body={`Se quitará a ${playerLabel(menu.players, removePlayer)} del equipo.`}
          confirmLabel="Quitar"
          cancelLabel="Cancelar"
          onConfirm={() => deletePlayer(removePlayer.id)}
          onCancel={() => setConfirmRemove(null)}
        />
      ) : null}

      {confirmResetSession ? (
        <ConfirmDialog
          title="¿Cerrar sesión?"
          body="Se cerrará el equipo actual, se limpiará el progreso local de la sesión y volveremos a la pantalla de inicio."
          confirmLabel="Cerrar sesión"
          cancelLabel="Cancelar"
          onConfirm={() => void closeSession("manual")}
          onCancel={() => setConfirmResetSession(false)}
        />
      ) : null}

      {settingsOpen ? (
        <OperatorSettingsDialog
          unlocked={settingsUnlocked}
          pin={settingsPin}
          error={settingsError}
          levelsUnlocked={levelsUnlocked}
          envUnlockLevels={envUnlockLevels}
          onTypeDigit={typeSettingsPinDigit}
          onBackspace={() => {
            setSettingsError("");
            setSettingsPin((current) => current.slice(0, -1));
          }}
          onClear={() => {
            setSettingsError("");
            setSettingsPin("");
          }}
          onSubmit={() => submitSettingsPin()}
          onToggleLevels={() => setOperatorUnlockLevels(!menu.operatorUnlockLevels)}
          onClose={closeSettings}
        />
      ) : null}

      {keyboardTarget ? (
        <TouchKeyboard
          title={keyboardTitle()}
          value={keyboardValue()}
          placeholder={keyboardTarget.kind === "team" ? "Nombre del equipo" : "Nombre del jugador"}
          onType={typeKey}
          onBackspace={() => setKeyboardValue(keyboardValue().slice(0, -1))}
          onClear={() => setKeyboardValue("")}
          onDone={() => setKeyboardTarget(null)}
        />
      ) : null}
    </main>
  );
}

function FloorOnlyApp() {
  return (
    <main className="app floor-only-app">
      <LiveFloorView interactive />
    </main>
  );
}

function WelcomeScreen({
  connectionState,
  readOnly,
  remoteSessionRequest,
  onCancelRemoteStart,
  onConfirmRemoteStart,
  onStart,
  onFullscreen,
}: {
  connectionState: string;
  readOnly?: boolean;
  remoteSessionRequest: RemoteSessionRequest | null;
  onCancelRemoteStart: () => void;
  onConfirmRemoteStart: () => void;
  onStart: () => void;
  onFullscreen: () => void;
}) {
  const welcomeGame = games.find((game) => game.id === "temporada1");
  const welcomeLevel = welcomeGame?.levels?.[0];
  const welcomePreviewSrc = welcomeGame ? levelPreviewSrc(welcomeGame, welcomeLevel, "easy") : undefined;
  return (
    <main className={`app welcome-app ${connectionState} ${readOnly ? "read-only-mirror" : ""}`}>
      <section className="welcome-screen" aria-label="Inicio">
        <div className="welcome-copy">
          <button className="welcome-mark" type="button" aria-label="Pantalla completa" title="Pantalla completa" onClick={onFullscreen} />
          <h1>Motion Levels</h1>
          <p>Preparad el equipo, elegid un reto y jugad sobre el suelo LED.</p>
        </div>
        <div className="welcome-visual" aria-hidden="true">
          <div className="welcome-floor" style={{ "--crgb": welcomeGame ? hexToRGB(welcomeGame.color) : "47, 216, 108" } as CSSProperties}>
            <Preview src={welcomePreviewSrc} animationID="temporada1" />
          </div>
        </div>
        <button className="btn primary welcome-start" type="button" onClick={onStart} disabled={readOnly}>
          <PlayIcon />
          {readOnly ? "Esperando menú" : "Comenzar"}
        </button>
        {remoteSessionRequest ? (
          <section className="remote-session-card" aria-label="Reserva pendiente">
            <div>
              <span className="micro">Reserva desde plataforma</span>
              <strong>{remoteSessionRequest.teamName}</strong>
              <p>
                {remoteSessionRequest.room} · {remoteSessionPlayerCopy(remoteSessionRequest)}
                {remoteSessionRequest.startsAt ? ` · ${formatRemoteStartTime(remoteSessionRequest.startsAt)}` : ""}
              </p>
            </div>
            <div className="remote-session-card__actions">
              <button className="btn compact" type="button" onClick={onCancelRemoteStart}>
                Ignorar
              </button>
              <button className="btn primary" type="button" onClick={onConfirmRemoteStart}>
                <PlayIcon />
                Confirmar sesión
              </button>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

function remoteSessionPlayerCopy(request: RemoteSessionRequest) {
  const reserved = `${request.playerCount} ${request.playerCount === 1 ? "reservado" : "reservados"}`;
  if (request.configuredPlayerCount === request.playerCount) {
    return `${request.playerCount} ${request.playerCount === 1 ? "jugador" : "jugadores"}`;
  }
  return `${reserved} · ${request.configuredPlayerCount} en menú`;
}

function formatRemoteStartTime(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return new Intl.DateTimeFormat("es", { day: "2-digit", hour: "2-digit", minute: "2-digit", month: "short" }).format(date);
}

function ColorPicker({
  player,
  takenColors,
  onPick,
  onClose,
}: {
  player: Player;
  takenColors: Set<string>;
  onPick: (color: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Elegir color" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <strong>Elige un color</strong>
          <button className="icon-button" type="button" aria-label="Cerrar" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="swatch-grid">
          {playerColors.map((color, index) => {
            const selected = color.toLowerCase() === player.color.toLowerCase();
            const taken = !selected && takenColors.has(color.toLowerCase());
            return (
              <button
                key={color}
                className={`swatch ${selected ? "selected" : ""} ${taken ? "taken" : ""}`}
                style={{ "--pc": color } as CSSProperties}
                type="button"
                disabled={taken}
                aria-label={taken ? `${playerColorNames[index]} en uso` : playerColorNames[index]}
                aria-pressed={selected}
                onClick={() => onPick(color)}
              >
                {selected ? <CheckIcon /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OperatorSettingsDialog({
  unlocked,
  pin,
  error,
  levelsUnlocked,
  envUnlockLevels,
  onTypeDigit,
  onBackspace,
  onClear,
  onSubmit,
  onToggleLevels,
  onClose,
}: {
  unlocked: boolean;
  pin: string;
  error: string;
  levelsUnlocked: boolean;
  envUnlockLevels: boolean;
  onTypeDigit: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit: () => void;
  onToggleLevels: () => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Ajustes" onClick={onClose}>
      <div className="modal settings-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <strong>Ajustes</strong>
          <button className="icon-button" type="button" aria-label="Cerrar ajustes" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {unlocked ? (
          <section className="settings-section" aria-label="Opciones de operador">
            <button className={`settings-toggle ${levelsUnlocked ? "active" : ""}`} type="button" onClick={onToggleLevels} disabled={envUnlockLevels} aria-pressed={levelsUnlocked}>
              <span>
                <strong>Dev: niveles abiertos</strong>
                <small>{envUnlockLevels ? "Activado por entorno" : levelsUnlocked ? "Todos los niveles visibles" : "Progreso normal"}</small>
              </span>
              <span className="switch-track" aria-hidden="true">
                <span />
              </span>
            </button>
          </section>
        ) : (
          <section className="pin-panel" aria-label="PIN operador">
            <span className="micro">PIN operador</span>
            <div className={`pin-dots ${error ? "error" : ""}`} aria-label={`${pin.length} de 6 dígitos`}>
              {Array.from({ length: 6 }, (_, index) => (
                <span key={index} className={index < pin.length ? "filled" : ""} />
              ))}
            </div>
            {error ? <p className="pin-error">{error}</p> : <p className="pin-error placeholder">{"\u00a0"}</p>}
            <div className="pin-keypad" aria-label="Teclado PIN">
              {"123456789".split("").map((digit) => (
                <button key={digit} className="pin-key" type="button" onClick={() => onTypeDigit(digit)}>
                  {digit}
                </button>
              ))}
              <button className="pin-key secondary" type="button" onClick={onClear}>
                C
              </button>
              <button className="pin-key" type="button" onClick={() => onTypeDigit("0")}>
                0
              </button>
              <button className="pin-key secondary" type="button" onClick={onBackspace} aria-label="Borrar dígito">
                <BackspaceIcon />
              </button>
            </div>
            <button className="btn primary settings-submit" type="button" onClick={onSubmit} disabled={pin.length !== 6}>
              <CheckIcon />
              Entrar
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={onCancel}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <strong>{title}</strong>
        </div>
        <p className="modal-body">{body}</p>
        <div className="modal-actions">
          <button className="btn" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="btn danger" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function GameControlScreen({
  game,
  status,
  players,
  allPlayers,
  modeLabel,
  ambient,
  introActive,
  countdownValue,
  error,
  onPauseToggle,
  onRestart,
  narrationSupported,
  narrationArmed,
  onNarrationToggle,
  onExit,
}: {
  game: GameCard;
  status: EngineStatus | null;
  players: Player[];
  allPlayers: Player[];
  modeLabel: string;
  ambient: boolean;
  introActive: boolean;
  countdownValue: number;
  error: string;
  onPauseToggle: () => void;
  onRestart: () => void;
  narrationSupported: boolean;
  narrationArmed: boolean;
  onNarrationToggle: () => void;
  onExit: () => void;
}) {
  const paused = Boolean(status?.paused);
  return (
    <section className="game-control-screen" style={{ "--c": game.color, "--crgb": hexToRGB(game.color) } as CSSProperties}>
      <div className="game-control-main">
        <div className="game-control-preview">
          <LiveFloorView />
          {introActive ? (
            <div className="countdown-overlay narration" aria-live="polite">
              <span>Narración</span>
            </div>
          ) : countdownValue > 0 ? (
            <div className="countdown-overlay" aria-live="polite">
              <span>{countdownValue}</span>
            </div>
          ) : paused ? (
            <div className="countdown-overlay paused" aria-live="polite">
              <span>Pausa</span>
            </div>
          ) : null}
        </div>

        <div className="game-control-copy">
          <span className="micro">{ambient ? "Ambiente activo" : "Juego activo"}</span>
          <h2>{game.label}</h2>
          <p>{ambient ? "Animación en curso" : introActive ? "Narración inicial" : countdownValue > 0 ? "Preparando una salida segura" : paused ? "El juego está pausado" : "Ronda en curso"}</p>
          <div className="control-meta">
            <span>{ambient ? "Todos los jugadores" : `${players.length || 1} ${players.length === 1 ? "jugador" : "jugadores"}`}</span>
            <span>{modeLabel}</span>
            <span>{status?.currentGame || engineGameID(game)}</span>
          </div>
          {!ambient ? <div className="control-roster">
            {players.slice(0, 6).map((player) => (
              <span key={player.id} className="player-pill" style={{ "--pc": player.color } as CSSProperties}>
                <span />
                <span>{playerLabel(allPlayers, player)}</span>
              </span>
            ))}
          </div> : null}
          {error ? <div className="message error">{error}</div> : null}
        </div>
      </div>

      <div className="game-control-actions">
        <button className="btn control-action" type="button" onClick={onPauseToggle}>
          {paused ? <PlayIcon /> : <PauseIcon />}
          {paused ? "Reanudar" : "Pausar"}
        </button>
        <button className="btn control-action" type="button" onClick={onRestart}>
          <RestartIcon />
          Reiniciar
        </button>
        {narrationSupported ? (
          <button
            className={`btn control-action narration-toggle ${narrationArmed ? "active" : ""}`}
            type="button"
            aria-pressed={narrationArmed}
            onClick={onNarrationToggle}
          >
            <BoltIcon />
            {narrationArmed ? "Narración ON" : "Narración OFF"}
          </button>
        ) : null}
        <button className="btn control-action danger" type="button" onClick={onExit}>
          <CloseIcon />
          Salir
        </button>
      </div>
    </section>
  );
}

function TouchKeyboard({
  title,
  value,
  placeholder,
  onType,
  onBackspace,
  onClear,
  onDone,
}: {
  title: string;
  value: string;
  placeholder: string;
  onType: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onDone: () => void;
}) {
  const [mode, setMode] = useState<"letters" | "numbers" | "accents">("letters");
  const [shiftActive, setShiftActive] = useState(true);
  const [spacePending, setSpacePending] = useState(false);
  const rows = mode === "numbers" ? keyboardNumberRows : mode === "accents" ? keyboardAccentRows : keyboardLetterRows;
  const shifted = mode !== "numbers" && shiftActive;

  function showKey(key: string) {
    return shifted ? key.toLocaleUpperCase("es-ES") : key;
  }

  function pressKey(key: string) {
    const visibleKey = showKey(key);
    onType(`${spacePending && value ? " " : ""}${visibleKey}`);
    setSpacePending(false);
  }

  function setKeyboardMode(nextMode: "letters" | "numbers" | "accents") {
    setMode((current) => (current === nextMode ? "letters" : nextMode));
    if (nextMode === "numbers") setShiftActive(false);
  }

  function pressSpace() {
    if (value) setSpacePending(true);
  }

  function pressBackspace() {
    if (spacePending) {
      setSpacePending(false);
      return;
    }
    onBackspace();
  }

  function pressClear() {
    setSpacePending(false);
    onClear();
  }

  return (
    <div className="keyboard-modal-layer" role="dialog" aria-modal="true" aria-label="Editar nombre" onMouseDown={(event) => event.preventDefault()}>
      <section className="touch-keyboard" aria-label="Teclado táctil">
        <div className="kb-title-tab">
          <span aria-hidden="true">●</span>
          {title}
        </div>

        <div className="kb-compose">
          <div className="kb-field ph-mask">
            <div className="kb-value ph-mask">
              {value ? <span>{value}</span> : <span className="kb-placeholder">{placeholder}</span>}
              <span className="kb-caret" />
            </div>
          </div>
          <button className="kb-done" type="button" onClick={onDone}>
            <CheckIcon />
            Listo
          </button>
        </div>

        <div className="keyboard-rows">
          {rows.map((row, index) => (
            <div className={`keyboard-row ${mode === "accents" ? "accents" : ""} ${index === 2 ? "bottom-letters" : ""}`} key={`${mode}-${row}`}>
              {index === 2 && mode !== "numbers" ? (
                <button className={`key shift ${shiftActive ? "active" : ""}`} type="button" aria-label="Mayúsculas" aria-pressed={shiftActive} onClick={() => setShiftActive((active) => !active)}>
                  ⇧
                </button>
              ) : null}
              {row.split("").map((key) => (
                <button className={`key ${mode === "accents" ? "accent" : ""}`} key={key} type="button" onClick={() => pressKey(key)}>
                  {showKey(key)}
                </button>
              ))}
              {index === 2 ? (
                <button className="key backspace" type="button" aria-label="Borrar" onClick={pressBackspace}>
                  <BackspaceIcon />
                </button>
              ) : null}
            </div>
          ))}
          <div className="keyboard-row keyboard-tools">
            <button className={`key mode ${mode === "numbers" ? "active" : ""}`} type="button" aria-pressed={mode === "numbers"} onClick={() => setKeyboardMode("numbers")}>
              123
            </button>
            <button className={`key mode ${mode === "accents" ? "active" : ""}`} type="button" aria-pressed={mode === "accents"} onClick={() => setKeyboardMode("accents")}>
              Acentos
            </button>
            <button className={`key space ${spacePending ? "pending" : ""}`} type="button" aria-pressed={spacePending} onClick={pressSpace}>
              Espacio
            </button>
            <button className="key clear" type="button" onClick={pressClear} disabled={!value}>
              Borrar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

const animationPreviewCache = new Map<string, Promise<AnimationPreview>>();

function cachedAnimationPreview(level: string): Promise<AnimationPreview> {
  const key = level.trim().toLowerCase();
  const cached = animationPreviewCache.get(key);
  if (cached) return cached;
  const request = fetchAnimationPreview(key).catch((error) => {
    animationPreviewCache.delete(key);
    throw error;
  });
  animationPreviewCache.set(key, request);
  return request;
}

function previewLevelID(animationID: string): string | null {
  return animationID.startsWith("animation-") ? animationID.replace(/^animation-/, "") : null;
}

function decodePreviewFrames(preview: AnimationPreview | null): RGB[][] {
  if (!preview?.frames?.length) return [];
  return preview.frames.flatMap((frame) => {
    const raw = frame.pixels || "";
    if (raw.length < 16 * 32 * 6) return [];
    const pixels: RGB[] = [];
    for (let index = 0; index < 16 * 32; index++) {
      const offset = index * 6;
      pixels.push([
        Number.parseInt(raw.slice(offset, offset + 2), 16) || 0,
        Number.parseInt(raw.slice(offset + 2, offset + 4), 16) || 0,
        Number.parseInt(raw.slice(offset + 4, offset + 6), 16) || 0,
      ]);
    }
    return [pixels];
  });
}

function animFromPreviewFrames(frames: RGB[][]): FloorAnim | null {
  if (!frames.length) return null;
  return (x, y, cols, _rows, t) => {
    const frame = frames[Math.floor(t * 12) % frames.length] || frames[0];
    return frame[y * cols + x] || [0, 0, 0];
  };
}

function Preview({ animationID, compact = false, src }: { animationID: string; compact?: boolean; src?: string }) {
  const liveLevelID = previewLevelID(animationID);
  const [livePreview, setLivePreview] = useState<AnimationPreview | null>(null);

  useEffect(() => {
    if (!liveLevelID || src) return;
    let cancelled = false;
    cachedAnimationPreview(liveLevelID)
      .then((preview) => {
        if (!cancelled) setLivePreview(preview);
      })
      .catch(() => {
        if (!cancelled) setLivePreview(null);
      });
    return () => {
      cancelled = true;
    };
  }, [liveLevelID, src]);

  const previewFrames = useMemo(() => decodePreviewFrames(livePreview), [livePreview]);
  const liveAnim = useMemo(() => animFromPreviewFrames(previewFrames), [previewFrames]);
  const anim = liveAnim || floorAnimations[animationID] || defaultFloorAnim;
  return (
    <div className={`preview ${compact ? "compact-preview" : ""}`}>
      {src ? <img className="preview-media" src={src} alt="" aria-hidden="true" /> : <FloorPreview anim={anim} orientation="landscape" />}
    </div>
  );
}
