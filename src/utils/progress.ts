import { ALL_SUB_STEPS, READINESS, WEEKS } from "../data/plan";
import type { DomainId, ReadinessCriterion, Step, Week } from "../types";

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

export function overallCounts(completed: CompletedSet): Counts {
  const done = ALL_SUB_STEPS.filter((s) => completed.has(s.id)).length;
  return { done, total: ALL_SUB_STEPS.length };
}

export function percent({ done, total }: Counts): number {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export function domainCounts(
  domain: DomainId,
  completed: CompletedSet,
): Counts {
  const subs = ALL_SUB_STEPS.filter((s) => s.domain === domain);
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
export function examWeightedPercent(completed: CompletedSet): number {
  const weights: [DomainId, number][] = [
    ["troubleshooting", 30],
    ["architecture", 25],
    ["networking", 20],
    ["workloads", 15],
    ["storage", 10],
  ];
  let score = 0;
  for (const [domain, weight] of weights) {
    const c = domainCounts(domain, completed);
    if (c.total > 0) score += weight * (c.done / c.total);
  }
  return Math.round(score);
}

export interface ReadinessStatus {
  criterion: ReadinessCriterion;
  done: number;
  total: number;
  met: boolean;
}

export function readinessStatuses(completed: CompletedSet): ReadinessStatus[] {
  return READINESS.map((criterion) => {
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
  examDateIso: string,
  startedAtMs: number,
  completed: CompletedSet,
  nowMs: number = Date.now(),
): PaceInfo {
  const examMs = new Date(`${examDateIso}T00:00:00`).getTime();
  const daysLeft = Math.ceil((examMs - nowMs) / 86_400_000);
  const actual = percent(overallCounts(completed));

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
export function firstUnfinishedWeekId(completed: CompletedSet): string | null {
  for (const week of WEEKS) {
    const c = weekCounts(week, completed);
    if (c.done < c.total) return week.id;
  }
  return null;
}
