import type { DisplayStatus } from "./api";

type LevelTimingStatus = Pick<
  DisplayStatus,
  "levelMode" | "remainingMillis" | "sessionRemainingMillis" | "challengeElapsedMillis" | "elapsedMillis" | "sessionElapsedMillis" | "attemptCount" | "challengeAttemptCount"
>;

type LevelLivesStatus = Pick<DisplayStatus, "phase" | "lives" | "livesStart">;

export function challengeMode(status: Pick<DisplayStatus, "levelMode">): boolean {
  return normalizedDisplayText(status.levelMode || "") === "challenge" || normalizedDisplayText(status.levelMode || "") === "reto";
}

export function levelDisplayTimeMillis(status: LevelTimingStatus): number {
  if (!challengeMode(status)) {
    return levelAggregateElapsedMillis(status);
  }
  if (status.sessionRemainingMillis !== undefined) {
    return nonNegativeMillis(status.sessionRemainingMillis);
  }
  return nonNegativeMillis(status.remainingMillis);
}

export function levelDisplayAttemptCount(status: Pick<DisplayStatus, "levelMode" | "challengeAttemptCount" | "attemptCount">): number {
  if (challengeMode(status)) {
    return Math.max(1, Math.max(0, status.challengeAttemptCount ?? 0) + Math.max(0, status.attemptCount || 0));
  }
  return Math.max(1, status.attemptCount || 0);
}

export function levelAggregateElapsedMillis(status: Pick<DisplayStatus, "levelMode" | "challengeElapsedMillis" | "elapsedMillis" | "sessionElapsedMillis">): number {
  if (challengeMode(status)) {
    return nonNegativeMillis(status.challengeElapsedMillis) + nonNegativeMillis(status.elapsedMillis);
  }
  const previousElapsed = nonNegativeMillis(status.challengeElapsedMillis);
  if (previousElapsed > 0) {
    return previousElapsed + nonNegativeMillis(status.elapsedMillis);
  }
  return globalGameElapsedMillis(status);
}

export function levelDisplayLives(status: LevelLivesStatus): number {
  if (status.phase === "finished" && Number.isFinite(status.livesStart) && (status.livesStart ?? 0) > 0) {
    return status.livesStart ?? status.lives;
  }
  return status.lives;
}

export function heartMeterSlotCount(lives: number, compact = false): number {
  if (lives <= 0) {
    return 0;
  }
  if (compact) {
    return Math.min(5, lives);
  }
  return lives;
}

function globalGameElapsedMillis(status: Pick<DisplayStatus, "sessionElapsedMillis" | "elapsedMillis">): number {
  return nonNegativeMillis(status.sessionElapsedMillis ?? status.elapsedMillis);
}

function nonNegativeMillis(value: number | undefined): number {
  return Math.max(0, Math.round(Number(value) || 0));
}

function normalizedDisplayText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}
