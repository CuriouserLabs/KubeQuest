import type { Timestamp } from "firebase/firestore";

/** The five scored CKA domains, plus "craft" for exam technique / speed work. */
export type DomainId =
  | "troubleshooting"
  | "architecture"
  | "networking"
  | "workloads"
  | "storage"
  | "craft";

export interface DomainInfo {
  id: DomainId;
  label: string;
  shortLabel: string;
  /** Official exam weight in percent. 0 for unscored "craft" items. */
  weight: number;
  emoji: string;
  /** Static Tailwind classes (never build class names dynamically). */
  barClass: string;
  chipClass: string;
}

export type SubStepKind = "topic" | "task" | "checkpoint";

export interface SubStep {
  /** Stable unique id — also used as the Firestore map key, so no dots. */
  id: string;
  title: string;
  kind: SubStepKind;
  domain: DomainId;
  /** Hints and supporting points drawn from the study plan. `code` spans use backticks. */
  hints: string[];
}

export interface Step {
  id: string;
  title: string;
  /** Step-level guidance shown in the step header's hint panel. */
  hints: string[];
  subSteps: SubStep[];
}

export interface Week {
  id: string;
  /** Short badge label, e.g. "Setup", "Week 3", "Drills". */
  badge: string;
  title: string;
  tagline: string;
  /** Dominant exam domain for this week (colours the card accent). */
  domain: DomainId;
  /** e.g. "25% of the exam" — shown next to the title. */
  weightNote?: string;
  steps: Step[];
}

export interface ReadinessCriterion {
  id: string;
  title: string;
  detail: string;
  /** Sub-step ids that must all be complete for this criterion to light up. */
  requiredIds: string[];
}

/** The single per-user Firestore document: users/{uid}. */
export interface UserDoc {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  completedIds: Record<string, true>;
  examDate: string | null; // ISO date, e.g. "2026-09-01"
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}
