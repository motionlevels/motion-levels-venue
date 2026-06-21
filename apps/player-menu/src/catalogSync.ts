import type { PlatformGameCatalogEntry } from "./api";
import type { DifficultyID, GameCard, GameLevel } from "./catalog";

export const catalogDifficultyIDs = ["easy", "medium", "hard", "expert"] as const satisfies readonly DifficultyID[];

const difficultyLabels: Record<DifficultyID, string> = {
  easy: "Fácil",
  medium: "Media",
  hard: "Difícil",
  expert: "Experto",
};

export type PlayerBounds = {
  maxPlayers: number;
  minPlayers: number;
};

export const noPlayerRequirementLabel = "Sin requisito";

function playerRequirementKey(value: unknown) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function gameRequiresPlayerCount(game: Pick<GameCard, "players">): boolean {
  return !["", "todos", "sin selector", "sin requisito", "sin limite", "sin jugadores", "no aplica", "none", "hidden", "n/a"].includes(playerRequirementKey(game.players));
}

export function normalizeEstimatedDurationSeconds(value: unknown): number {
  return clampInteger(value, 0, 24 * 60 * 60, 0);
}

export function estimatedDurationLabel(seconds: number): string {
  const clean = normalizeEstimatedDurationSeconds(seconds);
  if (clean <= 0) return "";
  if (clean < 60) return `${clean}s`;
  const minutes = Math.round(clean / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainderMinutes = minutes % 60;
  return remainderMinutes ? `${hours}h ${remainderMinutes} min` : `${hours}h`;
}

export function platformDurationLabel(
  entry: Pick<PlatformGameCatalogEntry, "estimated_duration_seconds">,
): string {
  return estimatedDurationLabel(entry.estimated_duration_seconds);
}

export function platformSupportsLevels(
  entry: Pick<PlatformGameCatalogEntry, "supports_levels">,
): boolean {
  return entry.supports_levels === true;
}

export function shouldPreferCatalogFallbackPreviewAnimation(
  entry: Pick<PlatformGameCatalogEntry, "source_kind">,
  fallback?: Pick<GameCard, "previewAnimation" | "previewSrc" | "previewSrcs" | "thumbnailSrc" | "thumbnailSrcs">,
): boolean {
  return Boolean(
    fallback?.previewAnimation
    && !fallback.thumbnailSrc
    && !fallback.thumbnailSrcs?.length
    && !fallback.previewSrc
    && !fallback.previewSrcs?.length
    && entry.source_kind !== "platform_levels"
    && entry.source_kind !== "animations",
  );
}

export function normalizeDifficultyIDs(value: unknown): DifficultyID[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<DifficultyID>();
  for (const item of value) {
    if (catalogDifficultyIDs.includes(item as DifficultyID)) {
      seen.add(item as DifficultyID);
    }
  }
  return catalogDifficultyIDs.filter((difficulty) => seen.has(difficulty));
}

export function platformPlayerBounds(entry: Pick<PlatformGameCatalogEntry, "max_players" | "min_players">): PlayerBounds {
  const minPlayers = clampInteger(entry.min_players, 1, 99, 1);
  const maxPlayers = Math.max(minPlayers, clampInteger(entry.max_players, 1, 99, minPlayers));
  return { maxPlayers, minPlayers };
}

export function platformPlayerRangeLabel(entry: Pick<PlatformGameCatalogEntry, "catalog_category" | "max_players" | "min_players" | "players_label">): string {
  if (entry.catalog_category === "attract") return "Todos";
  if (!gameRequiresPlayerCount({ players: entry.players_label })) return noPlayerRequirementLabel;
  const { maxPlayers, minPlayers } = platformPlayerBounds(entry);
  return minPlayers === maxPlayers ? String(minPlayers) : `${minPlayers}-${maxPlayers}`;
}

export function platformSupportedDifficulties(
  entry: Pick<PlatformGameCatalogEntry, "difficulties">,
): DifficultyID[] | undefined {
  const supported = normalizeDifficultyIDs(entry.difficulties);
  if (supported.length) return supported;
  return undefined;
}

export function platformLevelSupportedDifficulties(
  level: { difficulties?: string[]; difficulty?: string; rules?: Record<string, unknown> },
): DifficultyID[] | undefined {
  const explicit = normalizeDifficultyIDs(level.difficulties);
  if (explicit.length) return explicit;

  const settings = level.rules?.difficulty_settings;
  if (settings && typeof settings === "object" && !Array.isArray(settings)) {
    const configured = normalizeDifficultyIDs(Object.keys(settings));
    if (configured.length) return configured;
  }

  const single = normalizeDifficultyIDs(level.difficulty ? [level.difficulty] : []);
  if (single.length) return single;
  return undefined;
}

export function platformDifficultyLabel(
  entry: Pick<PlatformGameCatalogEntry, "catalog_category" | "difficulties" | "source_kind">,
): string {
  if (entry.catalog_category === "attract" || entry.source_kind === "animations") return "Ambiente";
  const supported = platformSupportedDifficulties(entry);
  if (supported?.length === catalogDifficultyIDs.length) return "Fácil-Experto";
  if (supported && supported.length > 1) {
    return `${difficultyLabels[supported[0]]}-${difficultyLabels[supported[supported.length - 1]]}`;
  }
  if (supported?.length === 1) return difficultyLabels[supported[0]];
  return "Juego";
}

export function supportedDifficultiesForGame(game: Pick<GameCard, "difficulties">, level?: Pick<GameLevel, "difficulties">): DifficultyID[] {
  const gameSupported = game.difficulties?.length ? game.difficulties : [...catalogDifficultyIDs];
  if (!level?.difficulties?.length) return gameSupported;
  const levelSupported = level.difficulties.filter((difficulty) => gameSupported.includes(difficulty));
  return levelSupported.length ? levelSupported : gameSupported;
}

export function difficultyRank(difficulty: DifficultyID): number {
  return catalogDifficultyIDs.indexOf(difficulty);
}

export function closestSupportedDifficulty(requested: DifficultyID, supported: DifficultyID[]): DifficultyID {
  if (supported.includes(requested)) return requested;
  const fallback = supported[0] || catalogDifficultyIDs[0];
  return supported.reduce((best, candidate) => {
    const bestDistance = Math.abs(difficultyRank(best) - difficultyRank(requested));
    const candidateDistance = Math.abs(difficultyRank(candidate) - difficultyRank(requested));
    if (candidateDistance !== bestDistance) return candidateDistance < bestDistance ? candidate : best;
    return difficultyRank(candidate) > difficultyRank(best) ? candidate : best;
  }, fallback);
}

export function playerBoundsForGame(
  game: Pick<GameCard, "engineGame" | "id" | "category" | "maxPlayers" | "minPlayers" | "players">,
): PlayerBounds {
  if (typeof game.players === "string" && !gameRequiresPlayerCount(game)) return { minPlayers: 1, maxPlayers: 99 };
  if (Number.isFinite(game.minPlayers) && Number.isFinite(game.maxPlayers)) {
    const minPlayers = clampInteger(game.minPlayers, 1, 99, 1);
    const maxPlayers = Math.max(minPlayers, clampInteger(game.maxPlayers, 1, 99, minPlayers));
    return { maxPlayers, minPlayers };
  }
  if (game.category === "individual") return { minPlayers: 1, maxPlayers: 1 };
  if ((game.engineGame || game.id) === "duel" || (game.engineGame || game.id) === "memory") {
    return { minPlayers: 2, maxPlayers: 4 };
  }
  return { minPlayers: 1, maxPlayers: 6 };
}

export function rosterForGame<T extends { active: boolean }>(
  game: Pick<GameCard, "engineGame" | "id" | "category" | "maxPlayers" | "minPlayers" | "players">,
  players: T[],
): T[] {
  const { maxPlayers } = playerBoundsForGame(game);
  return players.filter((player) => player.active).slice(0, maxPlayers);
}

function clampInteger(value: unknown, min: number, max: number, fallback: number) {
  const next = Number(value);
  if (!Number.isFinite(next)) return fallback;
  return Math.min(max, Math.max(min, Math.round(next)));
}
