import type { DomainId, ReadinessCriterion, Step, TrackData, Week } from "../types";

export interface Counts {
  done: number;
  total: number;
}

export type CompletedSet = ReadonlySet<string>;

export function completedSetFromMap(
  map: Record<string, true> | undefined,
): Set<string> {
  return new Set(Object.keys(map ?? {}));
}

export function stepCounts(step: Step, completed: CompletedSet): Counts {
  const done = step.subSteps.filter((s) => completed.has(s.id)).length;
  return { done, total: step.subSteps.length };
}

export function weekCounts(week: Week, completed: CompletedSet): Counts {
  let done = 0;
  let total = 0;
  for (const step of week.steps) {
    const c = stepCounts(step, completed);
    done += c.done;
    total += c.total;
  }
  return { done, total };
}

export function overallCounts(
  track: TrackData,
  completed: CompletedSet,
): Counts {
  const done = track.allSubSteps.filter((s) => completed.has(s.id)).length;
  return { done, total: track.allSubSteps.length };
}

export function percent({ done, total }: Counts): number {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export function domainCounts(
  track: TrackData,
  domain: DomainId,
  completed: CompletedSet,
): Counts {
  const subs = track.allSubSteps.filter((s) => s.domain === domain);
  return {
    done: subs.filter((s) => completed.has(s.id)).length,
    total: subs.length,
  };
}

/**
 * Progress weighted by the official exam domain weights, so users see how
 * much of the *scored* exam surface their completed work covers.
 * Unscored "craft" items are excluded here (they still count in overall %).
 */
export function examWeightedPercent(
  track: TrackData,
  completed: CompletedSet,
): number {
  let score = 0;
  for (const domain of track.domains) {
    if (domain.weight === 0) continue;
    const c = domainCounts(track, domain.id, completed);
    if (c.total > 0) score += domain.weight * (c.done / c.total);
  }
  return Math.round(score);
}

export interface ReadinessStatus {
  criterion: ReadinessCriterion;
  done: number;
  total: number;
  met: boolean;
}

export function readinessStatuses(
  track: TrackData,
  completed: CompletedSet,
): ReadinessStatus[] {
  return track.readiness.map((criterion) => {
    const done = criterion.requiredIds.filter((id) => completed.has(id)).length;
    const total = criterion.requiredIds.length;
    return { criterion, done, total, met: done === total };
  });
}

export type PaceStatus = "done" | "ahead" | "on-track" | "behind" | "overdue";

export interface PaceInfo {
  daysLeft: number;
  expectedPercent: number;
  actualPercent: number;
  status: PaceStatus;
}

/**
 * Simple pace model: linear progress expected between the day the user
 * started (their user doc's createdAt) and their target exam date.
 */
export function paceInfo(
  track: TrackData,
  examDateIso: string,
  startedAtMs: number,
  completed: CompletedSet,
  nowMs: number = Date.now(),
): PaceInfo {
  const examMs = new Date(`${examDateIso}T00:00:00`).getTime();
  const daysLeft = Math.ceil((examMs - nowMs) / 86_400_000);
  const actual = percent(overallCounts(track, completed));

  const span = examMs - startedAtMs;
  const elapsed = nowMs - startedAtMs;
  const expectedFraction =
    span <= 0 ? 1 : Math.min(1, Math.max(0, elapsed / span));
  const expected = Math.round(expectedFraction * 100);

  let status: PaceStatus;
  if (actual >= 100) status = "done";
  else if (daysLeft < 0) status = "overdue";
  else if (actual >= expected + 10) status = "ahead";
  else if (actual >= expected - 5) status = "on-track";
  else status = "behind";

  return { daysLeft, expectedPercent: expected, actualPercent: actual, status };
}

/** First week (in plan order) that still has unfinished sub-steps. */
export function firstUnfinishedWeekId(
  track: TrackData,
  completed: CompletedSet,
): string | null {
  for (const week of track.weeks) {
    const c = weekCounts(week, completed);
    if (c.done < c.total) return week.id;
  }
  return null;
}
