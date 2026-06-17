import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { controlGame, fetchAnimationPreview, fetchEngineStatus, fetchGameCatalog, fetchMenuState, platformBaseURL, postMenuEvent, postMenuState, postVenueSession, selectGame, type AnimationPreview, type EngineGame, type EngineStatus, type MenuStateEnvelope, type PlatformGameCatalogEntry } from "./api";
import { categories, colors, difficulties, games, playerColorNames, playerColors, previewAsset, type CategoryID, type DifficultyID, type GameCard, type PartyMiniGame } from "./catalog";
import {
  catalogDifficultyIDs,
  closestSupportedDifficulty,
  difficultyRank,
  estimatedDurationLabel,
  normalizeEstimatedDurationSeconds,
  platformDifficultyLabel,
  platformDurationLabel,
  platformLevelSupportedDifficulties,
  platformPlayerBounds,
  platformPlayerRangeLabel,
  platformSupportedDifficulties,
  platformSupportsLevels,
  playerBoundsForGame,
  rosterForGame,
  shouldPreferCatalogFallbackPreviewAnimation,
  supportedDifficultiesForGame,
} from "./catalogSync";
import { ArrowLeftIcon, BackspaceIcon, BoltIcon, CheckIcon, CloseIcon, GamepadIcon, GearIcon, PauseIcon, PlayIcon, PlusIcon, RefreshIcon, RestartIcon, SparkIcon, StarIcon, TeamIcon, UserIcon, VersusIcon, VolumeIcon, VolumeMutedIcon } from "./icons";
import { FloorPreview } from "./FloorPreview";
import { LiveFloorView } from "./LiveFloorView";
import { floorAnimations, type FloorAnim, type RGB } from "./floor";
import { hexToColor, hexToRGB, initials, randomUUID } from "./utils";
import { captureMenuEvent, menuKioskID, setMenuEventForwarder } from "./analytics";
import { platformAnimationCards } from "./animationCatalog";

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
  levelModes: Record<string, LevelMode>;
  levelProgress: Record<string, LevelProgress>;
  challengeRuns: Record<string, ChallengeRun>;
  nextPlayerId: number;
  narrationArmed: Record<string, boolean>;
  operatorUnlockLevels: boolean;
};

type LevelMode = "challenge" | "free";

type LevelProgress = {
  unlockedThrough: number;
  bestByLevel: Record<string, DifficultyID>;
  bestTimeByLevel: Record<string, number>;
};

type ChallengeRun = {
  difficulty: DifficultyID;
  startedUnixMillis: number;
  completedLevels: Record<string, number>;
  totalElapsedMillis: number;
};

type ChallengeCompletion = {
  key: string;
  difficulty: DifficultyID;
  gameID: string;
  gameLabel: string;
  revisionHash: string | null;
  levelCount: number;
  totalElapsedMillis: number;
};

type FinishedLevelAttempt = NonNullable<EngineStatus["finishedLevelAttempts"]>[number];
type KeyboardTarget = { kind: "team" } | { kind: "player"; id: number };
type ScreenMode = "browse" | "game";
type RosterIssue = { message: string; playerIds: Set<number> };
type PartyRunState = {
  cumulativeScore: number;
  index: number;
  partyGameID: string;
  sessionId: string;
};
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

const emptyPreviewSources: string[] = [];
const storageKey = "ml-player-menu-state-v1";
const platformCatalogStorageKey = "ml-player-menu-platform-catalog-v2";
const platformCatalogRefreshMillis = 5000;
const menuBuildLabel = `${__MENU_BUILD_REVISION__} · ${formatMenuBuildDate(__MENU_BUILD_DATE__)}`;
const menuBuildDateLabel = formatMenuBuildDate(__MENU_BUILD_DATE__);
const maxPlayers = 6;
const maxTeamNameLength = 24;
const maxPlayerNameLength = 12;
const noPressureSessionLimitMillis = 60 * 60 * 1000;
// Spanish QWERTY adapted for a kiosk touch surface.
const keyboardLetterRows = ["qwertyuiop", "asdfghjklñ", "zxcvbnm"];
const keyboardNumberRows = ["1234567890", "-_/&()'\"", ".,!?"];
const keyboardAccentRows = ["áéíóúü", "àèìòù", "äëïöüñ"];
const envUnlockLevels = import.meta.env.VITE_UNLOCK_LEVELS === "1";
const operatorSettingsPin = /^\d{6}$/.test(import.meta.env.VITE_DEV_SETTINGS_PIN || "") ? import.meta.env.VITE_DEV_SETTINGS_PIN || "" : "739481";
const defaultPlayers: Player[] = [{ id: 1, name: "", color: playerColors[0], active: true }];
const teamNameStarts = ["Rayo", "Neón", "Pulso", "Láser", "Cumbre", "Órbita", "Turbo", "Brillo", "Salto", "Ritmo", "Chispa", "Fuego"];
const teamNameFinishes = ["Verde", "Azul", "Solar", "Norte", "Sur", "Lima", "Rojo", "Claro", "Pista", "Nivel", "Flash", "Veloz"];

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUUID(value: unknown): value is string {
  return typeof value === "string" && uuidPattern.test(value.trim());
}

function formatMenuBuildDate(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "build local";
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    timeZone: "Europe/Madrid",
  }).format(date);
}

function clampInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function playerRangeLabel(game: GameCard): string {
  const bounds = playerBoundsForGame(game);
  if (game.players && !/^\d+(?:-\d+)?$/.test(game.players.trim())) return game.players;
  const count = bounds.minPlayers === bounds.maxPlayers ? String(bounds.minPlayers) : `${bounds.minPlayers}-${bounds.maxPlayers}`;
  const plural = bounds.maxPlayers === 1 ? "jugador" : "jugadores";
  return `${count} ${plural}`;
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
  return randomUUID();
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

function engineGameID(game: Pick<GameCard, "engineGame" | "id">): string {
  return game.engineGame || game.id;
}

function runtimeGameID(game: Pick<GameCard, "engineGame" | "id" | "sourceKind">): string {
  return game.sourceKind === "platform_levels" && isUUID(game.id) ? game.id : engineGameID(game);
}

function previewAnimationID(game: GameCard): string {
  if (engineGameID(game) === "salvapantallas") return "";
  return game.previewAnimation || game.id;
}

function levelPreviewAnimationID(game: GameCard, level?: NonNullable<GameCard["levels"]>[number]): string {
  return level?.previewAnimation || previewAnimationID(game);
}

function gameThumbnailSrc(game: GameCard): string | undefined {
  return game.thumbnailSrc || game.previewSrc;
}

function gameThumbnailSrcs(game: GameCard): string[] {
  return uniquePreviewSources([...(game.thumbnailSrcs || []), game.thumbnailSrc, game.previewSrc]);
}

function levelPreviewSrc(game: GameCard, level: NonNullable<GameCard["levels"]>[number] | undefined, difficulty: DifficultyID): string | undefined {
  return level?.previewByDifficulty?.[difficulty] || level?.previewSrc || game.previewSrc || game.thumbnailSrc;
}

function partyPreviewGridSize(count: number): number {
  if (count <= 1) return 1;
  return Math.ceil(Math.sqrt(count));
}

function isMotionLevelsLogoSrc(src: string | undefined): boolean {
  return Boolean(src && /(?:^|\/)motion-levels-icon\.(?:webp|png)(?:$|[?#])/i.test(src));
}

function isAmbientCard(game: GameCard): boolean {
  return game.category === "attract";
}

function isPartyCard(game: GameCard): boolean {
  return Boolean(game.partyMiniGames?.length) || String(game.category) === "party";
}

function isFeaturedCard(game: GameCard): boolean {
  return game.featured === true || game.category === "featured";
}

function categoryIcon(categoryID: CategoryID) {
  switch (categoryID) {
    case "featured":
      return <StarIcon />;
    case "team":
      return <TeamIcon />;
    case "versus":
      return <VersusIcon />;
    case "individual":
      return <UserIcon />;
    case "arcade":
      return <GamepadIcon />;
    case "attract":
      return <SparkIcon />;
    default:
      return <StarIcon />;
  }
}

function isScreensaverCard(game: Pick<GameCard, "engineGame" | "id">): boolean {
  return engineGameID(game) === "salvapantallas" || game.id === "salvapantallas";
}

function isLegacyAnimationsAggregate(value: Pick<GameCard, "engineGame" | "id"> | PlatformGameCatalogEntry): boolean {
  if ("engine_game" in value) {
    return value.id === "animations" || platformEntryEngineGame(value) === "animations";
  }
  return value.id === "animations" || engineGameID(value) === "animations";
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
  return (
    currentGame === "salvapantallas"
    || currentGame === "animations"
    || currentGame.startsWith("animation-")
  ) && (phase === "idle" || phase === "ambient");
}

function gameForEngineStatus(engineGame: string, currentMenuGameID: string, catalogGames = games): GameCard | undefined {
  const currentMenuGame = catalogGames.find((game) => game.id === currentMenuGameID);
  if (currentMenuGame && isPartyCard(currentMenuGame)) {
    const partyMiniGameMatches = (currentMenuGame.partyMiniGames || []).some((_, index) => {
      const launchGame = partyLaunchGame(currentMenuGame, catalogGames, index);
      return runtimeGameID(launchGame) === engineGame || engineGameID(launchGame) === engineGame;
    });
    if (partyMiniGameMatches) return currentMenuGame;
  }
  const matches = catalogGames.filter((game) => runtimeGameID(game) === engineGame || engineGameID(game) === engineGame);
  if (matches.length === 0) return undefined;
  return matches.find((game) => game.id === currentMenuGameID) || matches.find((game) => !game.id.startsWith("featured-")) || matches[0];
}

function liveAnimationCards(catalog: EngineGame[] | undefined, existingGames: GameCard[] = games): GameCard[] {
  const existingEngineGames = new Set(existingGames.map(engineGameID));
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
      description: entry.description || "Animación visible desde el editor.",
      rules: ["Animación visible desde el editor.", "Se actualiza desde el motor sin reiniciar el menú."],
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

function isPlatformLevelSource(entry: PlatformGameCatalogEntry): boolean {
  return entry.source_kind === "platform_levels";
}

function platformEntryMatchesGame(entry: PlatformGameCatalogEntry, game: Pick<GameCard, "engineGame" | "id">): boolean {
  return entry.id === game.id || platformEntryEngineGame(entry) === engineGameID(game);
}

function platformPartyMiniGames(entry: PlatformGameCatalogEntry): PartyMiniGame[] | undefined {
  const source = entry.game_source;
  if (!source || source.schema !== "motion-party-v1" || source.kind !== "party") return undefined;
  const rawMiniGames = Array.isArray(source.mini_games) ? source.mini_games : [];
  const miniGames = rawMiniGames.flatMap((item): PartyMiniGame[] => {
    const record = typeof item === "string" ? { game_id: item } : item;
    if (!record || typeof record !== "object" || Array.isArray(record)) return [];
    const value = record as Record<string, unknown>;
    const gameId = typeof value.game_id === "string" ? value.game_id.trim() : "";
    if (!gameId) return [];
    const difficulty = catalogDifficultyIDs.includes(value.difficulty as DifficultyID) ? value.difficulty as DifficultyID : undefined;
    const difficultyMode = value.difficulty_mode === "override" && difficulty
      ? "override"
      : value.difficulty_mode === "inherit"
        ? "inherit"
        : difficulty ? "override" : "inherit";
    return [{
      gameId,
      label: typeof value.label === "string" ? value.label : undefined,
      difficultyMode,
      difficulty,
      level: typeof value.level === "string" ? value.level : undefined,
    }];
  });
  return miniGames.length ? miniGames : undefined;
}

function partyLaunchGame(game: GameCard, catalogGames: GameCard[], index = 0): GameCard {
  if (!isPartyCard(game) || !game.partyMiniGames?.length) return game;
  const miniGame = game.partyMiniGames[index] || game.partyMiniGames[0];
  return catalogGames.find((candidate) => candidate.id === miniGame.gameId || engineGameID(candidate) === miniGame.gameId) || game;
}

function scoreFromStatus(status: EngineStatus | null): number {
  return Math.max(0, Math.round((status?.players || []).reduce((total, player) => total + (Number(player.score) || 0), 0)));
}

function webpPreviewRef(value: string): string {
  return value.replace(/^preview:/, "").replace(/\.(?:gif|png|webp)(?=($|[?#]))/i, ".webp");
}

function platformAssetURL(pathname: string): string {
  const platformURL = platformBaseURL();
  if (!platformURL) return pathname;
  return `${platformURL.replace(/\/$/, "")}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

function catalogDirectAssetSrc(ref: string | undefined): string | undefined {
  const clean = String(ref || "").trim();
  if (!clean) return undefined;
  if (/^data:image\/gif/i.test(clean)) return undefined;
  if (/^(?:https?:|blob:)/i.test(clean)) return webpPreviewRef(clean);
  if (/^data:/i.test(clean)) return clean;
  if (clean.startsWith("/")) return platformAssetURL(webpPreviewRef(clean));
  return undefined;
}

function catalogThumbnailSrc(ref: string | undefined): string | undefined {
  const direct = catalogDirectAssetSrc(ref);
  if (direct) return direct;
  const clean = String(ref || "").trim();
  if (!clean || /^data:/i.test(clean)) return undefined;
  const assetName = webpPreviewRef(clean);
  const platformURL = platformBaseURL();
  if (platformURL) return `${platformURL}/api/game-catalog/thumbnails/${encodeURIComponent(assetName)}`;
  return previewAsset(assetName);
}

function uniquePreviewSources(values: Array<string | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function catalogThumbnailMediaSrcs(entry: PlatformGameCatalogEntry, fallback: GameCard | undefined): string[] {
  return uniquePreviewSources([
    catalogDirectAssetSrc(entry.catalog_thumbnail_url),
    catalogThumbnailSrc(entry.catalog_thumbnail_ref),
    ...(fallback?.thumbnailSrcs || []),
    fallback?.thumbnailSrc,
    fallback?.previewSrc,
  ]);
}

function catalogPreviewMediaSrcs(entry: PlatformGameCatalogEntry, fallback: GameCard | undefined, thumbnailSrcs: string[]): string[] {
  return uniquePreviewSources([
    catalogDirectAssetSrc(entry.catalog_preview_url),
    catalogDirectAssetSrc(entry.catalog_thumbnail_url),
    ...thumbnailSrcs,
    ...(fallback?.previewSrcs || []),
    fallback?.previewSrc,
  ]);
}

function catalogPreviewAnimation(
  entry: PlatformGameCatalogEntry,
  fallback: GameCard | undefined,
  engineGame: string,
  hasPlatformMedia: boolean,
  preferFallbackAnimation: boolean,
): string | undefined {
  if (engineGame === "salvapantallas") return undefined;
  const configured = String(entry.catalog_preview_animation || "").trim();
  if (preferFallbackAnimation) return configured || fallback?.previewAnimation;
  if (hasPlatformMedia || isPlatformLevelSource(entry)) return undefined;
  if (configured) return configured;
  return fallback?.previewAnimation || (entry.source_kind === "cloud_animations" || entry.catalog_category === "attract" ? engineGame : undefined);
}

function platformEntryToGameCard(entry: PlatformGameCatalogEntry, fallback: GameCard | undefined, index: number): GameCard {
  const engineGame = platformEntryEngineGame(entry);
  const preferFallbackAnimation = shouldPreferCatalogFallbackPreviewAnimation(entry, fallback);
  const thumbnailSrcs = preferFallbackAnimation ? [] : catalogThumbnailMediaSrcs(entry, fallback);
  const previewSrcs = preferFallbackAnimation ? [] : catalogPreviewMediaSrcs(entry, fallback, thumbnailSrcs);
  const thumbnailSrc = thumbnailSrcs[0];
  const previewSrc = previewSrcs[0];
  const hasPlatformMedia = !preferFallbackAnimation && Boolean(catalogDirectAssetSrc(entry.catalog_preview_url) || catalogDirectAssetSrc(entry.catalog_thumbnail_url));
  const playerBounds = platformPlayerBounds(entry);
  const supportedDifficulties = platformSupportedDifficulties(entry, fallback);
  const supportsLevels = platformSupportsLevels(entry, fallback);
  const estimatedDurationSeconds = normalizeEstimatedDurationSeconds(entry.estimated_duration_seconds);
  const partyMiniGames = platformPartyMiniGames(entry);
  const levels = supportsLevels && entry.levels && entry.levels.length > 0
    ? Array.from(entry.levels.reduce((byID, lvl) => {
        const levelID = String(lvl.slug || lvl.id || "").trim() || String(lvl.id || "").trim();
        if (!levelID) return byID;
        const fallbackLevel = fallback?.levels?.find((level) => level.id === levelID || level.id === lvl.id);
        const levelDifficulties = platformLevelSupportedDifficulties(lvl, fallbackLevel);
        const existing = byID.get(levelID);
        byID.set(levelID, {
          id: levelID,
          label: existing?.label || lvl.label,
          description: existing?.description || lvl.description,
          difficulties: Array.from(new Set([...(existing?.difficulties || []), ...(levelDifficulties || [])])),
          previewSrc: existing?.previewSrc || fallbackLevel?.previewSrc || fallback?.previewSrc,
          previewByDifficulty: existing?.previewByDifficulty || fallbackLevel?.previewByDifficulty,
          previewAnimation: existing?.previewAnimation || fallbackLevel?.previewAnimation,
        });
        return byID;
      }, new Map<string, NonNullable<GameCard["levels"]>[number]>()).values())
    : supportsLevels ? fallback?.levels : undefined;
  const duration = platformDurationLabel(entry, fallback) || (levels?.length ? `${levels.length} niveles` : "");
  const fallbackCategory = String(fallback?.category || "") === "party" ? "versus" : fallback?.category;
  const category = partyMiniGames?.length
    ? "versus"
    : isCategoryID(entry.catalog_category) ? entry.catalog_category : fallbackCategory || "arcade";
  return {
    id: entry.id,
    label: entry.label || fallback?.label || engineGame,
    category,
    color: entry.catalog_color || fallback?.color || [colors.cyan, colors.blue, colors.green, colors.violet, colors.orange, colors.yellow][index % 6],
    players: platformPlayerRangeLabel(entry, fallback),
    difficulty: platformDifficultyLabel(entry, fallback),
    difficulties: supportedDifficulties,
    duration,
    estimatedDurationSeconds,
    mode: entry.mode_label || fallback?.mode || "",
    audio: entry.audio_label || fallback?.audio || "",
    description: entry.description || fallback?.description || "Juego visible desde el catálogo.",
    rules: entry.catalog_rules?.length ? entry.catalog_rules : fallback?.rules || ["Configurable desde la página Juegos."],
    featured: typeof entry.catalog_featured === "boolean" ? entry.catalog_featured : fallback?.featured === true || entry.catalog_category === "featured",
    levels,
    partyMiniGames,
    allowDifficultyWithLevels: supportsLevels && (fallback?.allowDifficultyWithLevels || (isPlatformLevelSource(entry) && Boolean(levels?.length))),
    engineGame,
    minPlayers: playerBounds.minPlayers,
    maxPlayers: playerBounds.maxPlayers,
    thumbnailSrc,
    thumbnailSrcs,
    previewSrc,
    previewSrcs,
    previewAnimation: catalogPreviewAnimation(entry, fallback, engineGame, hasPlatformMedia, preferFallbackAnimation),
    supportsLevels,
    sourceKind: entry.source_kind || fallback?.sourceKind,
    revisionHash: entry.revision_hash || fallback?.revisionHash,
    disabled: false,
  };
}

function applyPlatformCatalog(baseGames: GameCard[], catalog: PlatformGameCatalogEntry[] | null): GameCard[] {
  if (!catalog) return baseGames;
  const fallbackByID = new Map(baseGames.map((game) => [game.id, game]));
  const fallbackByEngine = new Map(baseGames.map((game) => [engineGameID(game), game]));
  const baseOrder = new Map(baseGames.map((game, index) => [game.id, index]));
  const catalogOrderByID = new Map(catalog.map((entry) => [entry.id, entry.catalog_order]));
  const catalogOrderByEngine = new Map(catalog.map((entry) => [platformEntryEngineGame(entry), entry.catalog_order]));
  const enabledCatalog = catalog.filter((entry) => entry.catalog_enabled !== false && !isLegacyAnimationsAggregate(entry));
  const platformGames = enabledCatalog
    .map((entry, index) => platformEntryToGameCard(
      entry,
      fallbackByID.get(entry.id) || fallbackByEngine.get(platformEntryEngineGame(entry)),
      index,
    ));
  const remainingBaseGames = baseGames.filter((game) => (
    !isLegacyAnimationsAggregate(game)
    && !catalog.some((entry) => platformEntryMatchesGame(entry, game) && entry.catalog_enabled === false)
    && !enabledCatalog.some((entry) => platformEntryMatchesGame(entry, game))
  ));
  return [...platformGames, ...remainingBaseGames]
    .sort((left, right) => {
      const leftOrder = catalogOrderByID.get(left.id) ?? catalogOrderByEngine.get(engineGameID(left)) ?? 10_000 + (baseOrder.get(left.id) ?? 0);
      const rightOrder = catalogOrderByID.get(right.id) ?? catalogOrderByEngine.get(engineGameID(right)) ?? 10_000 + (baseOrder.get(right.id) ?? 0);
      return leftOrder - rightOrder || left.label.localeCompare(right.label);
    });
}

function isPlatformLaunchableSource(game: Pick<GameCard, "sourceKind">): boolean {
  return game.sourceKind === "code_editable" || game.sourceKind === "platform_levels" || game.sourceKind === "cloud_animations";
}

function canLaunchWhileCatalogRefreshes(game: GameCard): boolean {
  return isAmbientCard(game) || game.sourceKind === "cloud_animations" || engineGameID(game).startsWith("animation-");
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

function playerLevelLabel(level: NonNullable<GameCard["levels"]>[number] | undefined, index?: number): string {
  if (!level) return "Nivel";
  const label = String(level.label || "").trim();
  if (label && !/^level[-_\s]?\d+$/i.test(label)) return label;
  const number = typeof index === "number" && index >= 0 ? index + 1 : levelNumber(level.id);
  return `Nivel ${number}`;
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

function levelModeFor(game: GameCard, state: MenuState): LevelMode {
  if (!game.levels?.length) return "free";
  return state.levelModes[game.id] === "free" ? "free" : "challenge";
}

function challengeRunFor(game: GameCard, state: MenuState): ChallengeRun | null {
  const run = state.challengeRuns[game.id];
  if (!run || typeof run !== "object") return null;
  return {
    difficulty: difficulties.some((candidate) => candidate.id === run.difficulty) ? run.difficulty : state.difficulty,
    startedUnixMillis: Number(run.startedUnixMillis) || 0,
    completedLevels: run.completedLevels || {},
    totalElapsedMillis: Number(run.totalElapsedMillis) || 0,
  };
}

function challengeNextLevel(game: GameCard, state: MenuState): NonNullable<GameCard["levels"]>[number] | null {
  if (!game.levels?.length) return null;
  const completed = challengeRunFor(game, state)?.completedLevels || {};
  return game.levels.find((level) => !completed[level.id]) || game.levels[0] || null;
}

function challengeTotalElapsed(completedLevels: Record<string, number>): number {
  return Object.values(completedLevels).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
}

function emptyChallengeRun(difficulty: DifficultyID, startedUnixMillis = Date.now()): ChallengeRun {
  return {
    difficulty,
    startedUnixMillis,
    completedLevels: {},
    totalElapsedMillis: 0,
  };
}

function unlockLevelsEnabled(state: MenuState): boolean {
  return envUnlockLevels || state.operatorUnlockLevels;
}

function isLevelUnlocked(game: GameCard, levelID: string, state: MenuState): boolean {
  if (!game.levels?.length) return true;
  if (unlockLevelsEnabled(state)) return true;
  if (levelModeFor(game, state) === "free") return true;
  return challengeNextLevel(game, state)?.id === levelID;
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

function formatRuntimeTime(ms?: number): string {
  if (!ms || ms <= 0) return "0s";
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}:${String(seconds).padStart(2, "0")}` : `${seconds}s`;
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
  let selectedLevels = state.selectedLevels;
  let challengeRuns = state.challengeRuns;
  if (success) {
    nextBest[levelID] = higherDifficulty(nextBest[levelID], difficulty);
    if (elapsedMillis > 0 && (!nextBestTime[levelID] || elapsedMillis < nextBestTime[levelID])) {
      nextBestTime[levelID] = elapsedMillis;
    }

    if (levelModeFor(game, state) === "challenge") {
      const expectedLevel = challengeNextLevel(game, state);
      if (expectedLevel?.id === levelID) {
        const previousRun = challengeRunFor(game, state) || emptyChallengeRun(difficulty);
        const completedLevels = {
          ...previousRun.completedLevels,
          [levelID]: Math.max(0, elapsedMillis || 0),
        };
        const nextRun: ChallengeRun = {
          ...previousRun,
          difficulty,
          completedLevels,
          totalElapsedMillis: challengeTotalElapsed(completedLevels),
        };
        const nextLevel = game.levels.find((level) => !completedLevels[level.id]);
        if (nextLevel) {
          challengeRuns = {
            ...challengeRuns,
            [game.id]: nextRun,
          };
          selectedLevels = {
            ...selectedLevels,
            [game.id]: nextLevel.id,
          };
        } else {
          const { [game.id]: _completedRun, ...remainingRuns } = challengeRuns;
          challengeRuns = remainingRuns;
          selectedLevels = {
            ...selectedLevels,
            [game.id]: defaultLevelID(game),
          };
        }
      }
    }
  }
  return {
    ...state,
    selectedLevels,
    challengeRuns,
    levelProgress: {
      ...state.levelProgress,
      [game.id]: {
        unlockedThrough: success ? Math.min(game.levels.length, Math.max(previous.unlockedThrough || 1, finishedNumber + 1)) : previous.unlockedThrough,
        bestByLevel: nextBest,
        bestTimeByLevel: nextBestTime,
      },
    },
  };
}

function challengeCompletionForAttempt(
  state: MenuState,
  game: GameCard,
  levelID: string,
  success: boolean,
  difficulty: DifficultyID,
  elapsedMillis: number,
): ChallengeCompletion | null {
  if (!success || !game.levels?.length || levelModeFor(game, state) !== "challenge") return null;
  const expectedLevel = challengeNextLevel(game, state);
  if (expectedLevel?.id !== levelID) return null;
  const previousRun = challengeRunFor(game, state) || emptyChallengeRun(difficulty);
  const completedLevels = {
    ...previousRun.completedLevels,
    [levelID]: Math.max(0, elapsedMillis || 0),
  };
  if (!game.levels.every((level) => completedLevels[level.id] !== undefined)) return null;
  const totalElapsedMillis = challengeTotalElapsed(completedLevels);
  return {
    key: `${state.sessionId || "local"}:${game.id}:${difficulty}:${game.levels.length}:${totalElapsedMillis}`,
    difficulty,
    gameID: game.id,
    gameLabel: game.label,
    revisionHash: game.revisionHash || null,
    levelCount: game.levels.length,
    totalElapsedMillis,
  };
}

function normalizeLevelModes(value: unknown): Record<string, LevelMode> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter((entry): entry is [string, LevelMode] => typeof entry[0] === "string" && (entry[1] === "challenge" || entry[1] === "free")),
  );
}

function normalizeChallengeRuns(value: unknown): Record<string, ChallengeRun> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const runs: Record<string, ChallengeRun> = {};
  for (const [gameID, run] of Object.entries(value as Record<string, unknown>)) {
    if (!run || typeof run !== "object" || Array.isArray(run)) continue;
    const source = run as Partial<ChallengeRun>;
    const completedLevels = source.completedLevels && typeof source.completedLevels === "object" && !Array.isArray(source.completedLevels)
      ? Object.fromEntries(
          Object.entries(source.completedLevels)
            .map(([levelID, elapsed]) => [levelID, Math.max(0, Math.round(Number(elapsed) || 0))]),
        )
      : {};
    runs[gameID] = {
      difficulty: difficulties.some((candidate) => candidate.id === source.difficulty) ? (source.difficulty as DifficultyID) : "easy",
      startedUnixMillis: Math.max(0, Math.round(Number(source.startedUnixMillis) || 0)),
      completedLevels,
      totalElapsedMillis: challengeTotalElapsed(completedLevels),
    };
  }
  return runs;
}

function loadMenuState(): MenuState {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null") as Partial<MenuState> | null;
    if (saved && typeof saved === "object") {
      const narrationArmed = saved.narrationArmed && typeof saved.narrationArmed === "object" ? saved.narrationArmed : {};
      const selectedLevels = saved.selectedLevels && typeof saved.selectedLevels === "object" ? saved.selectedLevels : {};
      const levelModes = normalizeLevelModes(saved.levelModes);
      const levelProgress = saved.levelProgress && typeof saved.levelProgress === "object" ? saved.levelProgress : {};
      const challengeRuns = normalizeChallengeRuns(saved.challengeRuns);
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
        levelModes,
        levelProgress,
        challengeRuns,
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
    levelModes: {},
    levelProgress: {},
    challengeRuns: {},
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
  const [catalogRefreshing, setCatalogRefreshing] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(() => platformBaseURL() !== "" && platformCatalog === null);
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
  const [settingsPinFailures, setSettingsPinFailures] = useState(0);
  const [settingsLockoutUntil, setSettingsLockoutUntil] = useState(0);
  const [teamOpen, setTeamOpen] = useState(false);
  const [screenMode, setScreenMode] = useState<ScreenMode>("browse");
  const [remoteSessionRequest, setRemoteSessionRequest] = useState<RemoteSessionRequest | null>(() => remoteSessionRequestFromURL());
  const [launchedGameID, setLaunchedGameID] = useState(menu.selectedGame);
  const [launchingGameID, setLaunchingGameID] = useState<string | null>(null);
  const [levelBrowserGameID, setLevelBrowserGameID] = useState<string | null>(null);
  const [partyRun, setPartyRun] = useState<PartyRunState | null>(null);
  const [introUntil, setIntroUntil] = useState(0);
  const [countdownUntil, setCountdownUntil] = useState(0);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const processedFinishedSessions = useRef(new Set<string>());
  const processedChallengeCompletions = useRef(new Set<string>());
  const processedPartyFinishes = useRef(new Set<string>());
  const catalogRefreshInFlight = useRef(false);
  const platformCatalogRef = useRef(platformCatalog);
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

  useEffect(() => {
    platformCatalogRef.current = platformCatalog;
  }, [platformCatalog]);

  const refreshPlatformCatalog = useCallback(async (options: { manual?: boolean } = {}) => {
    if (catalogRefreshInFlight.current) return;
    catalogRefreshInFlight.current = true;
    if (options.manual || platformCatalogRef.current === null) setCatalogRefreshing(true);
    if (platformCatalogRef.current === null) setCatalogLoading(true);
    try {
      const next = await fetchGameCatalog();
      cachePlatformCatalog(next);
      setPlatformCatalog(next);
      if (options.manual) {
        const selectedID = menuRef.current.selectedGame;
        const selected = next.find((entry) => entry.id === selectedID);
        setError("");
        setMessage(selected?.revision_hash ? `Catálogo actualizado · rev ${selected.revision_hash}` : "Catálogo actualizado");
        captureMenuEvent("catalog_refreshed", {
          game: selectedID,
          game_revision: selected?.revision_hash,
          previous_revision: platformCatalogRef.current?.find((entry) => entry.id === selectedID)?.revision_hash,
        });
      }
    } catch {
      if (options.manual) setError("No se pudo actualizar el catálogo");
    } finally {
      catalogRefreshInFlight.current = false;
      setCatalogRefreshing(false);
      setCatalogLoading(false);
    }
  }, []);

  const menuGames = useMemo(() => {
    const platformAnimations = platformAnimationCards(platformCatalog);
    return applyPlatformCatalog([...games, ...platformAnimations, ...liveAnimationCards(status?.catalog, [...games, ...platformAnimations])], platformCatalog);
  }, [platformCatalog, status?.catalog]);

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
      } catch {
        // Never surface the raw browser error (e.g. "Failed to fetch") on the
        // player-facing kiosk; show a friendly Spanish status instead.
        if (!cancelled) setError("Sin conexión con el motor");
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
    async function refreshCatalog() {
      if (cancelled) return;
      await refreshPlatformCatalog();
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
  }, [refreshPlatformCatalog]);

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
      const game = menuGames.find((candidate) => runtimeGameID(candidate) === status.currentGame || engineGameID(candidate) === status.currentGame);
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
      .map((attempt) => ({ attempt, game: menuGames.find((candidate) => engineGameID(candidate) === attempt.game || runtimeGameID(candidate) === attempt.game) }))
      .filter(({ attempt, game }) => game?.levels?.length && attempt.level && !processedFinishedSessions.current.has(attempt.attemptId));
    if (pending.length === 0) return;

    for (const { attempt } of pending) {
      processedFinishedSessions.current.add(attempt.attemptId);
    }
    setMenu((current) =>
      pending.reduce((next, { attempt, game }) => {
        if (!game?.levels?.length) return next;
        const difficulty = difficultyFromEngine(attempt.difficulty, next.difficulty);
        const completion = challengeCompletionForAttempt(next, game, attempt.level, attempt.success, difficulty, attempt.elapsedMillis || 0);
        if (completion && !processedChallengeCompletions.current.has(completion.key)) {
          processedChallengeCompletions.current.add(completion.key);
          captureMenuEvent("challenge_completed", {
            difficulty: completion.difficulty,
            engine_game: engineGameID(game),
            game: completion.gameID,
            game_label: completion.gameLabel,
            game_revision: completion.revisionHash,
            level_count: completion.levelCount,
            revision_hash: completion.revisionHash,
            score: completion.totalElapsedMillis,
            score_kind: "time",
            total_elapsed_millis: completion.totalElapsedMillis,
            total_elapsed_seconds: Math.round(completion.totalElapsedMillis / 1000),
            venue_session_id: next.sessionId,
          });
        }
        return recordLevelCompletion(next, game, attempt.level, attempt.success, difficulty, attempt.elapsedMillis || 0);
      }, current),
    );
  }, [status, menuGames]);

  useEffect(() => {
    if (!partyRun || !status || status.phase !== "finished") return;
    const party = menuGames.find((game) => game.id === partyRun.partyGameID);
    if (!party?.partyMiniGames?.length) return;
    const currentMiniGame = partyLaunchGame(party, menuGames, partyRun.index);
    if (runtimeGameID(currentMiniGame) !== status.currentGame && engineGameID(currentMiniGame) !== status.currentGame) return;
    const activeSession = status.venueSessionId || status.sessionId;
    if (partyRun.sessionId && activeSession && partyRun.sessionId !== activeSession) return;
    const finishKey = `${activeSession || status.sessionId}:${status.currentGame}:${status.level || ""}:${status.elapsedMillis || 0}:${partyRun.index}`;
    if (processedPartyFinishes.current.has(finishKey)) return;
    processedPartyFinishes.current.add(finishKey);

    const cumulativeScore = partyRun.cumulativeScore + scoreFromStatus(status);
    const nextIndex = partyRun.index + 1;
    if (nextIndex >= party.partyMiniGames.length) {
      setPartyRun(null);
      setMessage(`Party terminado · ${cumulativeScore} pts`);
      return;
    }

    setPartyRun({
      cumulativeScore,
      index: nextIndex,
      partyGameID: party.id,
      sessionId: partyRun.sessionId,
    });
    setMessage(`Party ${nextIndex + 1}/${party.partyMiniGames.length} · ${cumulativeScore} pts`);
    void launch(party.id, { partyIndex: nextIndex, partyScore: cumulativeScore });
  }, [partyRun, status, menuGames]);

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
  const platformEnabledGames = useMemo(() => (
    new Set((platformCatalog || [])
      .filter((entry) => entry.catalog_enabled !== false)
      .flatMap((entry) => [entry.id, platformEntryEngineGame(entry)]))
  ), [platformCatalog]);
  const isGameLaunchable = useCallback((game: GameCard) => {
    if (!status) return false;
    if (catalogLoading && isPlatformLaunchableSource(game) && !canLaunchWhileCatalogRefreshes(game)) return false;
    const launchGame = partyLaunchGame(game, menuGames);
    if (isScreensaverCard(launchGame)) return true;
    if (availableGames.has(runtimeGameID(launchGame)) || availableGames.has(engineGameID(launchGame))) return true;
    if (game.sourceKind === "cloud_animations" && engineGameID(game).startsWith("animation-")) return true;
    return isPlatformLaunchableSource(game) && (
      platformEnabledGames.has(game.id) || platformEnabledGames.has(engineGameID(game))
    );
  }, [availableGames, catalogLoading, menuGames, platformEnabledGames, status]);
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
  const selectedLevelMode = levelModeFor(selectedGame, menu);
  const selectedChallengeRun = challengeRunFor(selectedGame, menu);
  const selectedLevelIndex = selectedLevel && selectedGame.levels?.length ? selectedGame.levels.findIndex((level) => level.id === selectedLevel.id) + 1 : 0;
  const selectedLevelDisplayLabel = playerLevelLabel(selectedLevel, selectedLevelIndex > 0 ? selectedLevelIndex - 1 : undefined);
  const selectedLevelBest = selectedLevel ? selectedLevelProgress.bestByLevel[selectedLevel.id] : undefined;
  const selectedLevelBestTime = selectedLevel ? selectedLevelProgress.bestTimeByLevel[selectedLevel.id] : undefined;
  const selectedLevelBestLabel = selectedLevelBestTime ? formatBestTime(selectedLevelBestTime) : selectedLevelBest ? difficulties.find((difficulty) => difficulty.id === selectedLevelBest)?.label || selectedLevelBest : "Sin superar";
  const selectedChallengeProgressLabel = selectedGame.levels?.length
    ? `${Object.keys(selectedChallengeRun?.completedLevels || {}).length}/${selectedGame.levels.length}`
    : "0/0";
  const selectedPartyMiniGames = isPartyCard(selectedGame) ? selectedGame.partyMiniGames || [] : [];
  const levelDetail = Boolean(selectedGame.levels?.length && selectedLevel);
  const gameActive = screenMode === "game";
  const launchedPlayers = rosterForGame(launchedGame, activePlayers);
  const displayPlayers = gameActive && enginePlayers.length > 0 ? enginePlayers : launchedPlayers;
  const headerPlayers = gameActive && enginePlayers.length > 0 ? enginePlayers : activePlayers;
  const launchedLevel = launchedGame.levels?.find((level) => level.id === (status?.level || selectedLevelFor(launchedGame)));
  const launchedSupportedDifficulties = supportedDifficultiesFor(launchedGame, launchedLevel);
  const launchedDifficulty = closestSupportedDifficulty(menu.difficulty, launchedSupportedDifficulties);
  const launchedModeLabel = isAmbientCard(launchedGame) ? "Ambiente" : launchedLevel?.label || selectedDifficulty.label;
  const pickerPlayer = menu.players.find((player) => player.id === colorPickerFor) || null;
  const removePlayer = menu.players.find((player) => player.id === confirmRemove) || null;
  const connectionState = error ? "connection-off" : status ? "connection-on" : "connection-pending";
  const menuPlayerCount = activePlayers.length || 1;
  const headerPlayerCount = headerPlayers.length || 1;
  const playerCountLabel = `${headerPlayerCount} ${headerPlayerCount === 1 ? "jugador" : "jugadores"}`;
  const selectedGamePlayerRangeLabel = playerRangeLabel(selectedGame);
  const rosterIssue = useMemo(() => gameRosterIssue(selectedGame, menu.players), [selectedGame, menu.players]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", colors.blue);
    document.documentElement.style.setProperty("--accent-rgb", hexToRGB(colors.blue));
  }, []);

  useEffect(() => {
    if (menu.difficulty !== effectiveDifficulty) {
      setMenu((current) => (current.difficulty === effectiveDifficulty ? current : { ...current, difficulty: effectiveDifficulty }));
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
      levelModes: current.levelModes,
      levelProgress: {},
      challengeRuns: {},
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
      levelModes: current.levelModes,
      levelProgress: {},
      challengeRuns: {},
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
    setSettingsPinFailures(0);
    setSettingsLockoutUntil(0);
  }

  function closeSettings() {
    setSettingsOpen(false);
    setSettingsUnlocked(false);
    setSettingsPin("");
    setSettingsError("");
    setSettingsPinFailures(0);
    setSettingsLockoutUntil(0);
  }

  function setOperatorUnlockLevels(enabled: boolean) {
    captureMenuEvent("operator_unlock_levels_changed", {
      enabled,
      env_unlock_levels: envUnlockLevels,
    });
    setMenu((current) => ({ ...current, operatorUnlockLevels: enabled }));
  }

  function submitSettingsPin(pin = settingsPin) {
    if (Date.now() < settingsLockoutUntil) return;
    if (pin === operatorSettingsPin) {
      setSettingsUnlocked(true);
      setSettingsPin("");
      setSettingsError("");
      setSettingsPinFailures(0);
      setSettingsLockoutUntil(0);
      captureMenuEvent("settings_unlocked");
      return;
    }
    const nextFailures = settingsPinFailures + 1;
    setSettingsPin("");
    setSettingsPinFailures(nextFailures);
    if (nextFailures >= 3) {
      const lockoutUntil = Date.now() + 15000;
      setSettingsLockoutUntil(lockoutUntil);
      setSettingsError("Demasiados intentos. Espera 15 segundos.");
      window.setTimeout(() => {
        setSettingsPinFailures(0);
        setSettingsLockoutUntil(0);
        setSettingsError("");
      }, 15000);
    } else {
      setSettingsError(`Código incorrecto · intento ${nextFailures}/3`);
    }
    captureMenuEvent("settings_pin_failed", {
      failures: nextFailures,
    });
  }

  function typeSettingsPinDigit(digit: string) {
    if (Date.now() < settingsLockoutUntil) return;
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
    if (game && isAmbientCard(game) && !game.disabled && isGameLaunchable(game)) {
      void launch(game.id);
    }
  }

  function selectedLevelFor(game: GameCard, state = menu): string {
    if (!game.levels?.length) return "";
    const selected = state.selectedLevels[game.id] || defaultLevelID(game);
    if (isLevelUnlocked(game, selected, state)) return selected;
    return challengeNextLevel(game, state)?.id || defaultLevelID(game);
  }

  function setLevelMode(game: GameCard, mode: LevelMode) {
    if (!game.levels?.length) return;
    if (levelModeFor(game, menu) === mode) return;
    captureMenuEvent("level_mode_changed", {
      engine_game: engineGameID(game),
      game: game.id,
      mode,
    });
    setMenu((current) => {
      const nextLevelModes = {
        ...current.levelModes,
        [game.id]: mode,
      };
      const nextChallengeRuns = { ...current.challengeRuns };
      delete nextChallengeRuns[game.id];
      return {
        ...current,
        levelModes: nextLevelModes,
        challengeRuns: nextChallengeRuns,
        selectedLevels: {
          ...current.selectedLevels,
          [game.id]: mode === "challenge" ? defaultLevelID(game) : selectedLevelFor(game, current),
        },
      };
    });
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
    const levelIndex = game.levels?.findIndex((candidate) => candidate.id === level.id) ?? -1;
    const levelLabel = playerLevelLabel(level, levelIndex);
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
        aria-label={`${levelLabel}${locked ? ", bloqueado en modo reto" : ""}`}
        onClick={() => setSelectedLevel(game, level.id)}
      >
        <Preview src={levelPreviewSrc(game, level, previewDifficulty)} animationID={levelPreviewAnimationID(game, level)} compact />
        <span className="level-footer">
          <strong>{levelLabel}</strong>
          {locked ? (
            <span className="level-state locked-label">{levelModeFor(game, menu) === "challenge" ? "Reto" : "Bloqueado"}</span>
          ) : (
            <span className={`level-state ${bestDifficulty ? "rated" : "unrated"}`}>
              <StarRating difficulty={bestDifficulty} label="Mejor dificultad" muted={!bestDifficulty} />
            </span>
          )}
        </span>
      </button>
    );
  }

  function renderActiveLevelOption(game: GameCard, level: NonNullable<GameCard["levels"]>[number], options: {
    activeLevelID: string;
    selectable: boolean;
    onSelect: (levelID: string) => void;
  }) {
    const active = options.activeLevelID === level.id;
    const levelIndex = game.levels?.findIndex((candidate) => candidate.id === level.id) ?? -1;
    const levelLabel = playerLevelLabel(level, levelIndex);
    const progress = progressFor(game, menu);
    const bestDifficulty = progress.bestByLevel[level.id];
    const previewDifficulty = closestSupportedDifficulty(menu.difficulty, supportedDifficultiesFor(game, level));
    return (
      <button
        key={level.id}
        className={`level-option active-game-level ${active ? "active" : ""} ${bestDifficulty ? "passed" : ""} ${options.selectable ? "" : "readonly"}`}
        style={{ "--level-color": difficultyColor(bestDifficulty), "--level-rgb": hexToRGB(difficultyColor(bestDifficulty)), "--c": game.color, "--crgb": hexToRGB(game.color) } as CSSProperties}
        type="button"
        role="radio"
        aria-checked={active}
        aria-label={`${levelLabel}${options.selectable ? "" : ", solo lectura durante reto"}`}
        disabled={!options.selectable}
        onClick={() => options.onSelect(level.id)}
      >
        <Preview src={levelPreviewSrc(game, level, previewDifficulty)} animationID={levelPreviewAnimationID(game, level)} compact />
        <span className="level-footer">
          <strong>{levelLabel}</strong>
          {active ? (
            <span className="level-state rated">Actual</span>
          ) : (
            <span className={`level-state ${bestDifficulty ? "rated" : "unrated"}`}>
              <StarRating difficulty={bestDifficulty} label="Mejor dificultad" muted={!bestDifficulty} />
            </span>
          )}
        </span>
      </button>
    );
  }

  function renderPartyPreview(game: GameCard) {
    if (!isPartyCard(game) || !game.partyMiniGames?.length) {
      return <Preview src={gameThumbnailSrc(game)} srcs={gameThumbnailSrcs(game)} animationID={previewAnimationID(game)} revisionHash={game.previewRevisionHash} />;
    }
    return (
      <PartyPreview
        game={game}
        catalogGames={menuGames}
        difficulty={menu.difficulty}
      />
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

  async function launch(gameID = selectedGame.id, options: { partyIndex?: number; partyScore?: number } = {}) {
    const game = menuGames.find((candidate) => candidate.id === gameID);
    if (!game || game.disabled || !isGameLaunchable(game)) {
      captureMenuEvent("start_blocked", {
        engine_game: game ? engineGameID(game) : gameID,
        game: game?.id || gameID,
        reason: !game ? "missing" : game.disabled ? "disabled" : "engine_unavailable",
      });
      return;
    }
    let nextMenu = ensurePlayers({ ...menu, selectedGame: game.id });
    const partyIndex = isPartyCard(game) ? Math.max(0, Math.min((game.partyMiniGames?.length || 1) - 1, options.partyIndex || 0)) : 0;
    const launchGame = partyLaunchGame(game, menuGames, partyIndex);
    const partyFirstMiniGame = isPartyCard(game) ? game.partyMiniGames?.[partyIndex] : undefined;
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
    const selectedLevelID = partyFirstMiniGame?.level || selectedLevelFor(launchGame, nextMenu);
    const launchLevel = launchGame.levels?.find((level) => level.id === selectedLevelID);
    const partyParentDifficulty = isPartyCard(game) && usesDifficulty(game)
      ? closestSupportedDifficulty(nextMenu.difficulty, supportedDifficultiesFor(game))
      : undefined;
    const partyChildDifficulty = partyFirstMiniGame?.difficultyMode === "override" && partyFirstMiniGame.difficulty
      ? partyFirstMiniGame.difficulty
      : partyParentDifficulty;
    const requestedDifficulty = partyChildDifficulty || nextMenu.difficulty;
    const launchDifficulty = usesDifficulty(launchGame) ? closestSupportedDifficulty(requestedDifficulty, supportedDifficultiesFor(launchGame, launchLevel)) : undefined;
    const menuDifficulty = isPartyCard(game) ? partyParentDifficulty : launchDifficulty;
    if (menuDifficulty && nextMenu.difficulty !== menuDifficulty) {
      nextMenu = { ...nextMenu, difficulty: menuDifficulty };
    }
    const challengeDifficulty = (launchDifficulty || nextMenu.difficulty) as DifficultyID;
    const startsChallengeRun = Boolean(
      launchGame.levels?.length
      && selectedLevelID
      && levelModeFor(launchGame, nextMenu) === "challenge"
      && !challengeRunFor(launchGame, nextMenu)
    );
    if (startsChallengeRun) {
      nextMenu = {
        ...nextMenu,
        challengeRuns: {
          ...nextMenu.challengeRuns,
          [launchGame.id]: emptyChallengeRun(challengeDifficulty),
        },
      };
    }
    if (selectedLevelID && !isLevelUnlocked(launchGame, selectedLevelID, nextMenu)) {
      captureMenuEvent("start_blocked", {
        engine_game: engineGameID(launchGame),
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
    setMessage(isPartyCard(game) && game.partyMiniGames?.length ? `Party ${partyIndex + 1}/${game.partyMiniGames.length}` : "Iniciando");
    setError("");
    setLaunchingGameID(game.id);
    setPartyRun(isPartyCard(game) ? {
      cumulativeScore: options.partyScore || 0,
      index: partyIndex,
      partyGameID: game.id,
      sessionId: nextMenu.sessionId,
    } : null);
    captureMenuEvent("game_started", {
      ambient: isAmbientCard(game),
      category: game.category,
      difficulty: launchDifficulty,
      difficulty_label: launchDifficulty ? difficulties.find((difficulty) => difficulty.id === launchDifficulty)?.label : undefined,
      engine_game: engineGameID(launchGame),
      launch_engine_game: engineGameID(launchGame),
      game: game.id,
      game_label: game.label,
      level: selectedLevelID || undefined,
      level_label: launchLevel?.label,
      level_number: selectedLevelID ? levelNumber(selectedLevelID) : undefined,
      level_mode: launchGame.levels?.length ? levelModeFor(launchGame, nextMenu) : undefined,
      narration_enabled: supportsNarration(game) ? playNarration : false,
      player_count: launchRoster.length,
      venue_session_id: nextMenu.sessionId,
    });
    if (startsChallengeRun) {
      captureMenuEvent("challenge_started", {
        difficulty: challengeDifficulty,
        engine_game: engineGameID(launchGame),
        game: launchGame.id,
        game_label: launchGame.label,
        game_revision: launchGame.revisionHash || null,
        level_count: launchGame.levels?.length || 0,
        revision_hash: launchGame.revisionHash || null,
        venue_session_id: nextMenu.sessionId,
      });
    }
    try {
      const nextStatus = await selectGame({
        game: runtimeGameID(launchGame),
        platformUrl: platformBaseURL() || undefined,
        venueSessionId: nextMenu.sessionId,
        playerCount: Math.max(1, launchRoster.length),
        difficulty: launchDifficulty,
        level: selectedLevelID || undefined,
        durationSeconds: launchGame.estimatedDurationSeconds || undefined,
        narrationEnabled: supportsNarration(launchGame) ? playNarration : false,
        teamName: nextMenu.teamName.trim(),
        players: launchRoster.map((player, index) => ({
          index,
          label: playerLabel(nextMenu.players, player),
          color: hexToColor(player.color),
        })),
      });
      setStatus(nextStatus);
      setMessage(isPartyCard(game) && game.partyMiniGames?.length ? `Party ${partyIndex + 1}/${game.partyMiniGames.length} · ${options.partyScore || 0} pts` : "En curso");
      setLaunchedGameID(game.id);
      if (supportsNarration(launchGame) && playNarration) {
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
        engine_game: engineGameID(launchGame),
        error: err instanceof Error ? err.message : "unknown",
        game: game.id,
      });
      setError(err instanceof Error ? err.message : "No se pudo iniciar el juego");
    } finally {
      setLaunchingGameID((current) => (current === game.id ? null : current));
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
              <span className="tab-icon" aria-hidden="true">
                {categoryIcon(category.id)}
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
          levelMode={levelModeFor(launchedGame, menu)}
          selectedLevelID={selectedLevelFor(launchedGame)}
          challengeRun={challengeRunFor(launchedGame, menu)}
          difficulty={launchedDifficulty}
          supportedDifficulties={launchedSupportedDifficulties}
          renderLevelOption={(level, options) => renderActiveLevelOption(launchedGame, level, options)}
          ambient={isAmbientCard(launchedGame)}
          introActive={introActive}
          countdownValue={countdownValue}
          error={error}
          onDifficultyChange={(difficulty) => {
            captureMenuEvent("difficulty_changed", {
              difficulty,
              engine_game: engineGameID(launchedGame),
              game: launchedGame.id,
              level: selectedLevelFor(launchedGame),
              source: "active_game",
            });
            setMenu((current) => ({ ...current, difficulty }));
          }}
          onLevelSelect={(levelID) => setSelectedLevel(launchedGame, levelID)}
          onNextLevel={() => {
            const levels = launchedGame.levels || [];
            const currentIndex = Math.max(0, levels.findIndex((level) => level.id === selectedLevelFor(launchedGame)));
            const nextLevel = levels[(currentIndex + 1) % levels.length];
            if (nextLevel) setSelectedLevel(launchedGame, nextLevel.id);
          }}
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
                <section key={menu.category} className={`games game-grid count-${Math.min(visibleGames.length, 5)}`} aria-label="Juegos">
                  {visibleGames.map((game, index) => {
                    const future = Boolean(game.disabled);
                    const engineAvailable = isGameLaunchable(game);
                    const selected = menu.selectedGame === game.id;
                    const active = selected && (status?.currentGame === runtimeGameID(game) || status?.currentGame === engineGameID(game));
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
                        {renderPartyPreview(game)}
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
                {isPartyCard(selectedGame) ? renderPartyPreview(selectedGame) : (
                  <Preview src={levelPreviewSrc(selectedGame, selectedLevel, effectiveDifficulty)} animationID={levelPreviewAnimationID(selectedGame, selectedLevel)} revisionHash={selectedGame.previewRevisionHash} />
                )}
              </div>
              <div className="detail-copy">
                {levelDetail && selectedLevel ? (
                  <>
                    <section className="season-summary" aria-label="Juego actual">
                      <div className="detail-heading-row">
                        <span className="micro">Juego actual</span>
                        {selectedGame.revisionHash ? (
                          <span className="game-revision-row">
                            <span className="game-revision">rev {selectedGame.revisionHash}</span>
                            <button
                              className="game-revision-refresh"
                              type="button"
                              disabled={catalogRefreshing}
                              title="Actualizar catálogo"
                              aria-label="Actualizar catálogo"
                              onClick={() => refreshPlatformCatalog({ manual: true })}
                            >
                              <RefreshIcon />
                            </button>
                          </span>
                        ) : null}
                      </div>
                      <div className="season-title-row">
                        <span className="season-title-main">
                          <h2>{selectedGame.label}</h2>
                        </span>
                        <span className="season-progress">
                          {selectedLevelIndex}/{selectedGame.levels?.length}
                        </span>
                      </div>
                      <p>{selectedGame.description}</p>
                    </section>
                    <section className="season-level-row" aria-label="Nivel seleccionado">
                      <div>
                        <strong>{selectedLevelDisplayLabel}</strong>
                        <p>{selectedLevel.description}</p>
                      </div>
                    </section>
                    <section className="level-mode-panel" aria-label="Modo de niveles">
                      <div className="level-mode-toggle" role="group" aria-label="Cambiar modo de niveles">
                        <button
                          className={selectedLevelMode === "challenge" ? "active" : ""}
                          type="button"
                          aria-pressed={selectedLevelMode === "challenge"}
                          onClick={() => setLevelMode(selectedGame, "challenge")}
                        >
                          <span>Reto</span>
                          <small>{selectedChallengeProgressLabel}</small>
                        </button>
                        <button
                          className={selectedLevelMode === "free" ? "active" : ""}
                          type="button"
                          aria-pressed={selectedLevelMode === "free"}
                          onClick={() => setLevelMode(selectedGame, "free")}
                        >
                          <span>Libre</span>
                          <small>todos</small>
                        </button>
                      </div>
                    </section>
                    <section className="season-facts" aria-label="Resumen de partida">
                      <div>
                        <span>{isIndividualCard(selectedGame) ? "Jugador" : "Equipo"}</span>
                        <strong>{selectedGamePlayerRangeLabel}</strong>
                      </div>
                      <div>
                        <span>Mejor</span>
                        <strong>{selectedLevelBestLabel}</strong>
                      </div>
                    </section>
                  </>
                ) : (
                  <>
                    <div className="detail-heading-row">
                      <span className="micro">Seleccionado</span>
                      {selectedGame.revisionHash ? (
                        <span className="game-revision-row">
                          <span className="game-revision">rev {selectedGame.revisionHash}</span>
                          <button
                            className="game-revision-refresh"
                            type="button"
                            disabled={catalogRefreshing}
                            title="Actualizar catálogo"
                            aria-label="Actualizar catálogo"
                            onClick={() => refreshPlatformCatalog({ manual: true })}
                          >
                            <RefreshIcon />
                          </button>
                        </span>
                      ) : null}
                    </div>
                    <h2>{selectedGame.label}</h2>
                    <p>{selectedGame.description}</p>
                    <section className="season-facts" aria-label="Resumen de partida">
                      <div>
                        <span>{isIndividualCard(selectedGame) ? "Jugador" : "Equipo"}</span>
                        <strong>{selectedGamePlayerRangeLabel}</strong>
                      </div>
                      <div>
                        <span>Mejor</span>
                        <strong>Sin superar</strong>
                      </div>
                    </section>
                    {isPartyCard(selectedGame) ? (
                      <div className="detail-rules">
                        <span className="micro">Orden party</span>
                        <ul>
                          {selectedPartyMiniGames.length ? selectedPartyMiniGames.map((item, index) => {
                            const miniGame = menuGames.find((candidate) => candidate.id === item.gameId || engineGameID(candidate) === item.gameId);
                            const difficultyLabel = item.difficultyMode === "override" && item.difficulty
                              ? difficulties.find((difficulty) => difficulty.id === item.difficulty)?.label
                              : "hereda";
                            return (
                              <li key={`${item.gameId}-${index}`}>
                                {index + 1}. {miniGame?.label || item.label || item.gameId}{difficultyLabel ? ` · ${difficultyLabel}` : ""}
                              </li>
                            );
                          }) : (
                            <li>Sin minijuegos configurados todavía.</li>
                          )}
                        </ul>
                      </div>
                    ) : (
                      <div className="detail-rules">
                        <span className="micro">Reglas rápidas</span>
                        <ul>
                          {selectedGame.rules.slice(0, 3).map((rule) => (
                            <li key={rule}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </aside>
          </section>

          <section className="panel launch-bar" aria-label="Resumen de inicio">
            {usesDifficulty(selectedGame) ? (
              <div className="launch-difficulty" role="group" aria-label="Dificultad">
                {difficulties.map((difficulty) => (
                  (() => {
                    const supported = selectedSupportedDifficulties.includes(difficulty.id);
                    return (
                      <button
                        key={difficulty.id}
                        className={`launch-difficulty-button ${effectiveDifficulty === difficulty.id ? "active" : ""} ${supported ? "" : "unavailable"}`}
                        style={{ "--difficulty-color": difficulty.color, "--difficulty-rgb": hexToRGB(difficulty.color) } as CSSProperties}
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
            {(() => {
              const engineAvailable = isGameLaunchable(selectedGame);
              const rosterBlocked = !isAmbientCard(selectedGame) && Boolean(rosterIssue);
              const levelBlocked = Boolean(selectedGame.levels?.length && !isLevelUnlocked(selectedGame, selectedLevelFor(selectedGame), menu));
              const catalogBlocked = catalogLoading && isPlatformLaunchableSource(selectedGame) && !canLaunchWhileCatalogRefreshes(selectedGame);
              const launching = launchingGameID === selectedGame.id;
              const ambientActive = isAmbientCard(selectedGame) && Boolean(status) && (
                status?.currentGame === runtimeGameID(selectedGame)
                || status?.currentGame === engineGameID(selectedGame)
              );
              const blocked = launching || catalogBlocked || selectedGame.disabled || !engineAvailable || rosterBlocked || levelBlocked;
              const rosterAction = rosterBlocked && !launching && !catalogBlocked && !selectedGame.disabled && !levelBlocked;
              const launchDisabled = (blocked && !rosterAction) || ambientActive;
              const readyLabel = isAmbientCard(selectedGame) ? (ambientActive ? "Ambiente activo" : "Activar ambiente") : "Empezar partida";
              const unavailableByEngine = !engineAvailable || Boolean(error);
              const blockedLabel = catalogBlocked ? "Sincronizando" : levelBlocked ? "Nivel bloqueado" : rosterBlocked ? "Jugadores" : selectedGame.disabled ? "Próximamente" : unavailableByEngine ? readyLabel : "No disponible";
              const loadingVisual = launching || catalogBlocked;
              const handleLaunchAction = () => {
                if (rosterAction) {
                  captureMenuEvent("team_opened", {
                    player_count: activePlayers.length,
                    reason: "roster_blocked",
                    selected_game: selectedGame.id,
                  });
                  setTeamOpen(true);
                  return;
                }
                void launch();
              };
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
                  <button className={`btn primary play ${loadingVisual ? "loading" : ""} ${rosterAction ? "roster-action" : ""}`} type="button" disabled={launchDisabled} aria-busy={loadingVisual} onClick={handleLaunchAction}>
                    {loadingVisual ? (
                      <>
                        <span className="launch-spinner" aria-hidden="true" />
                        {launching ? "Cargando" : "Sincronizando"}
                      </>
                    ) : ambientActive ? (
                      <>
                        <CheckIcon />
                        {readyLabel}
                      </>
                    ) : blocked ? (
                      blockedLabel
                    ) : (
                      <>
                        <PlayIcon />
                        {readyLabel}
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
          lockedOut={Date.now() < settingsLockoutUntil}
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
  lockedOut,
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
  lockedOut: boolean;
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
          <div>
            <span className="micro">Quiosco</span>
            <strong>Ajustes</strong>
          </div>
          <button className="icon-button" type="button" aria-label="Cerrar ajustes" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="settings-content">
          <section className="settings-version-card" aria-label="Versión del menú">
            <span className="micro">Versión del menú</span>
            <strong>menu {__MENU_BUILD_REVISION__}</strong>
            <small title={__MENU_BUILD_DATE__}>Desplegado {menuBuildDateLabel}</small>
          </section>

          {unlocked ? (
            <section className="settings-section" aria-label="Opciones de operador">
              <div className="operator-unlocked-banner">
                <CheckIcon />
                <span>Modo operador desbloqueado</span>
              </div>
              <div className="settings-copy">
                <span className="micro">Operador</span>
                <p>Opciones protegidas para mantenimiento y pruebas.</p>
              </div>
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
              <div className="settings-copy">
                <span className="micro">Operador</span>
                <p>Introduce el PIN solo para desbloquear opciones de mantenimiento.</p>
              </div>
              <div className={`pin-dots ${error ? "error" : ""}`} aria-label={`${pin.length} de 6 dígitos`}>
                {Array.from({ length: 6 }, (_, index) => (
                  <span key={index} className={index < pin.length ? "filled" : ""} />
                ))}
              </div>
              {error ? <p className="pin-error">{error}</p> : <p className="pin-error placeholder">{"\u00a0"}</p>}
              <div className="pin-keypad" aria-label="Teclado PIN">
                {"123456789".split("").map((digit) => (
                  <button key={digit} className="pin-key" type="button" onClick={() => onTypeDigit(digit)} disabled={lockedOut}>
                    {digit}
                  </button>
                ))}
                <button className="pin-key secondary" type="button" onClick={onClear} disabled={lockedOut}>
                  C
                </button>
                <button className="pin-key" type="button" onClick={() => onTypeDigit("0")} disabled={lockedOut}>
                  0
                </button>
                <button className="pin-key secondary" type="button" onClick={onBackspace} aria-label="Borrar dígito" disabled={lockedOut}>
                  <BackspaceIcon />
                </button>
              </div>
              <button className="btn primary settings-submit" type="button" onClick={onSubmit} disabled={lockedOut || pin.length !== 6}>
                <CheckIcon />
                Entrar
              </button>
            </section>
          )}
        </div>
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
  levelMode,
  selectedLevelID,
  challengeRun,
  difficulty,
  supportedDifficulties,
  renderLevelOption,
  ambient,
  introActive,
  countdownValue,
  error,
  onDifficultyChange,
  onLevelSelect,
  onNextLevel,
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
  levelMode: LevelMode;
  selectedLevelID: string;
  challengeRun: ChallengeRun | null;
  difficulty: DifficultyID;
  supportedDifficulties: DifficultyID[];
  renderLevelOption: (level: NonNullable<GameCard["levels"]>[number], options: { activeLevelID: string; selectable: boolean; onSelect: (levelID: string) => void }) => ReactNode;
  ambient: boolean;
  introActive: boolean;
  countdownValue: number;
  error: string;
  onDifficultyChange: (difficulty: DifficultyID) => void;
  onLevelSelect: (levelID: string) => void;
  onNextLevel: () => void;
  onPauseToggle: () => void;
  onRestart: () => void;
  narrationSupported: boolean;
  narrationArmed: boolean;
  onNarrationToggle: () => void;
  onExit: () => void;
}) {
  const paused = Boolean(status?.paused);
  const levelModeFree = levelMode === "free";
  const levels = game.levels || [];
  const hasLevels = levels.length > 0;
  const currentLevelID = status?.level || selectedLevelID || levels[0]?.id || "";
  const currentLevel = levels.find((level) => level.id === currentLevelID);
  const currentLevelIndex = currentLevel ? levels.findIndex((level) => level.id === currentLevel.id) : -1;
  const pendingLevel = levels.find((level) => level.id === selectedLevelID);
  const totalMillis = Math.max(0, Math.round((game.estimatedDurationSeconds || 0) * 1000));
  const elapsedMillis = Math.max(0, Math.round(status?.elapsedMillis || 0));
  const remainingMillis = totalMillis > 0 ? Math.max(0, totalMillis - elapsedMillis) : 0;
  const timeLabel = totalMillis > 0 ? formatRuntimeTime(remainingMillis) : formatRuntimeTime(elapsedMillis);
  const timeCaption = totalMillis > 0 ? "Restante" : "Tiempo";
  const score = scoreFromStatus(status);
  const difficultyLabel = difficulties.find((candidate) => candidate.id === difficulty)?.label || difficulty;
  const completedCount = Object.keys(challengeRun?.completedLevels || {}).length;
  const progressLabel = hasLevels ? `${completedCount}/${levels.length}` : "0/0";
  const phaseLabel = ambient ? "Animación en curso" : introActive ? "Narración inicial" : countdownValue > 0 ? "Preparando salida" : paused ? "Pausado" : "En curso";
  return (
    <section className={`game-control-screen ${hasLevels ? "with-levels" : ""}`} style={{ "--c": game.color, "--crgb": hexToRGB(game.color) } as CSSProperties}>
      <div className="game-control-main">
        <div className="game-control-preview">
          <LiveFloorView orientation={hasLevels ? "portrait" : "landscape"} />
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
          <div className="game-control-heading">
            <span className="micro">{ambient ? "Ambiente activo" : hasLevels ? (levelModeFree ? "Modo libre" : "Reto en curso") : "Juego activo"}</span>
            <h2>{game.label}</h2>
            <p>{phaseLabel}</p>
          </div>
          <div className="control-meta">
            <span>{ambient ? "Todos los jugadores" : `${players.length || 1} ${players.length === 1 ? "jugador" : "jugadores"}`}</span>
            <span>{hasLevels && currentLevel ? playerLevelLabel(currentLevel, currentLevelIndex) : modeLabel}</span>
            <span>{difficultyLabel}</span>
          </div>
          {!ambient ? (
            <div className="active-game-stats" aria-label="Estado de partida">
              <div>
                <span>{timeCaption}</span>
                <strong>{timeLabel}</strong>
              </div>
              <div>
                <span>Puntos</span>
                <strong>{score}</strong>
              </div>
              {hasLevels ? (
                <div>
                  <span>{levelModeFree ? "Nivel listo" : "Progreso"}</span>
                  <strong>{levelModeFree && pendingLevel ? playerLevelLabel(pendingLevel, levels.findIndex((level) => level.id === pendingLevel.id)) : progressLabel}</strong>
                </div>
              ) : null}
            </div>
          ) : null}
          {hasLevels && levelModeFree ? (
            <div className="active-free-controls">
              <div className="active-difficulty-row" role="group" aria-label="Dificultad">
                {difficulties.map((candidate) => {
                  const supported = supportedDifficulties.includes(candidate.id);
                  return (
                    <button
                      key={candidate.id}
                      className={`active-difficulty ${difficulty === candidate.id ? "active" : ""}`}
                      style={{ "--difficulty-color": candidate.color, "--difficulty-rgb": hexToRGB(candidate.color) } as CSSProperties}
                      type="button"
                      disabled={!supported}
                      aria-pressed={difficulty === candidate.id}
                      onClick={() => {
                        if (supported) onDifficultyChange(candidate.id);
                      }}
                    >
                      <span>{candidate.label}</span>
                      <StarRating difficulty={candidate.id} label={candidate.label} />
                    </button>
                  );
                })}
              </div>
              <button className="btn active-next-level" type="button" onClick={onNextLevel}>
                Siguiente nivel
              </button>
            </div>
          ) : null}
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
        {hasLevels ? (
          <section className="active-level-rail" aria-label={levelModeFree ? "Elegir nivel" : "Niveles del reto"} role="radiogroup">
            <div className="active-level-rail-heading">
              <span className="micro">{levelModeFree ? "Cambiar nivel" : "Nivel actual"}</span>
              <strong>{levelModeFree ? "Todos los niveles" : progressLabel}</strong>
            </div>
            <div className="active-level-grid">
              {levels.map((level) => renderLevelOption(level, { activeLevelID: levelModeFree ? selectedLevelID : currentLevelID, selectable: levelModeFree, onSelect: onLevelSelect }))}
            </div>
          </section>
        ) : null}
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

function cachedAnimationPreview(level: string, revisionHash?: string): Promise<AnimationPreview> {
  const key = `${level.trim().toLowerCase()}@${revisionHash || "live"}`;
  const cached = animationPreviewCache.get(key);
  if (cached) return cached;
  const request = fetchAnimationPreview(level, 16, revisionHash).catch((error) => {
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

function PartyPreview({ catalogGames, difficulty, game }: { catalogGames: GameCard[]; difficulty: DifficultyID; game: GameCard }) {
  const miniGames = game.partyMiniGames || [];
  const gridSize = partyPreviewGridSize(miniGames.length);
  return (
    <div
      className="preview party-preview"
      style={{ "--party-grid": gridSize, "--party-count": miniGames.length } as CSSProperties}
      aria-hidden="true"
    >
      {miniGames.map((item, index) => {
        const miniGame = catalogGames.find((candidate) => candidate.id === item.gameId || engineGameID(candidate) === item.gameId);
        const levelID = item.level || (miniGame?.levels?.length ? defaultLevelID(miniGame) : "");
        const level = miniGame?.levels?.find((candidate) => candidate.id === levelID);
        const previewDifficulty = miniGame
          ? closestSupportedDifficulty(
            item.difficultyMode === "override" && item.difficulty ? item.difficulty : difficulty,
            supportedDifficultiesFor(miniGame, level),
          )
          : difficulty;
        const previewSrc = miniGame && level ? levelPreviewSrc(miniGame, level, previewDifficulty) : miniGame ? gameThumbnailSrc(miniGame) : undefined;
        const previewSrcs = miniGame && !level ? gameThumbnailSrcs(miniGame) : emptyPreviewSources;
        const animationID = miniGame && level ? levelPreviewAnimationID(miniGame, level) : miniGame ? previewAnimationID(miniGame) : "";
        const color = miniGame?.color || game.color;
        return (
          <div
            key={`${item.gameId}-${item.level || ""}-${index}`}
            className="party-preview-tile"
            style={{ "--c": color, "--crgb": hexToRGB(color) } as CSSProperties}
          >
            <Preview src={previewSrc} srcs={previewSrcs} animationID={animationID} revisionHash={miniGame?.previewRevisionHash} compact />
          </div>
        );
      })}
    </div>
  );
}

function Preview({ animationID, compact = false, revisionHash, src, srcs = emptyPreviewSources }: { animationID: string; compact?: boolean; revisionHash?: string; src?: string; srcs?: string[] }) {
  const liveLevelID = previewLevelID(animationID);
  const [livePreview, setLivePreview] = useState<AnimationPreview | null>(null);
  const [failedSrcs, setFailedSrcs] = useState<string[]>([]);
  const sourceCandidates = useMemo(() => uniquePreviewSources([src, ...srcs]), [src, srcs]);
  const usableSrc = sourceCandidates.find((candidate) => !failedSrcs.includes(candidate));

  useEffect(() => {
    setFailedSrcs((failed) => {
      const next = failed.filter((candidate) => sourceCandidates.includes(candidate));
      return next.length === failed.length ? failed : next;
    });
  }, [sourceCandidates]);

  useEffect(() => {
    if (!liveLevelID || usableSrc) return;
    let cancelled = false;
    cachedAnimationPreview(liveLevelID, revisionHash)
      .then((preview) => {
        if (!cancelled) setLivePreview(preview);
      })
      .catch(() => {
        if (!cancelled) setLivePreview(null);
      });
    return () => {
      cancelled = true;
    };
  }, [liveLevelID, revisionHash, usableSrc]);

  const previewFrames = useMemo(() => decodePreviewFrames(livePreview), [livePreview]);
  const liveAnim = useMemo(() => animFromPreviewFrames(previewFrames), [previewFrames]);
  const anim = liveAnim || floorAnimations[animationID];
  const logoMedia = isMotionLevelsLogoSrc(usableSrc);
  return (
    <div className={`preview ${compact ? "compact-preview" : ""} ${logoMedia ? "logo-preview" : ""}`}>
      {usableSrc ? (
        <img
          className={`preview-media ${logoMedia ? "logo-preview-media" : ""}`}
          src={usableSrc}
          alt=""
          aria-hidden="true"
          decoding="async"
          draggable={false}
          loading={compact ? "lazy" : "eager"}
          onError={() => setFailedSrcs((failed) => failed.includes(usableSrc) ? failed : [...failed, usableSrc])}
        />
      ) : anim ? (
        <FloorPreview anim={anim} orientation="landscape" />
      ) : (
        <div className="preview-logo-fallback" aria-hidden="true">
          <img src="/motion-levels-icon.webp" alt="" />
        </div>
      )}
    </div>
  );
}
