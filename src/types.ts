import type { Timestamp } from "firebase/firestore";

/** The certification tracks the app offers. Ids are persisted (exam-date map
 *  keys in the user doc) — never rename existing ones. */
export type TrackId = "cka" | "ckad";

/**
 * Exam domain ids across all tracks: the five scored CKA domains, the four
 * CKAD-specific ones, "networking" (scored in both exams), and "craft" for
 * unscored exam technique / speed work (shared by all tracks).
 */
export type DomainId =
  // CKA
  | "troubleshooting"
  | "architecture"
  | "workloads"
  | "storage"
  // CKAD
  | "app-design"
  | "app-deployment"
  | "app-environment"
  | "observability"
  // shared
  | "networking"
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

/** A single multiple-choice question in a step's skill check. */
export interface McqQuestion {
  id: string;
  /** Question text. `code` spans use backticks (rendered via HintText). */
  prompt: string;
  choices: string[];
  /** Index into `choices` of the correct answer. */
  answerIndex: number;
  /** Shown after checking answers. */
  explanation: string;
}

/**
 * A small hands-on activity verified programmatically: the student types the
 * command they would run and it is checked locally against regex patterns —
 * no cluster or server needed.
 */
export interface CommandDrill {
  id: string;
  /** What to accomplish, e.g. "Scale deployment `web` to 5 replicas." */
  instruction: string;
  /**
   * Regex sources that must ALL match the submitted command after whitespace
   * normalisation. Patterns accept both `kubectl` and the `k` alias.
   */
  requiredPatterns: string[];
  /** A canonical correct answer, revealed on demand. */
  sampleSolution: string;
}

/** The skill check attached to one main step (Step.id) of the plan. */
export interface StepValidation {
  stepId: string;
  questions: McqQuestion[];
  drills?: CommandDrill[];
}

export interface ReadinessCriterion {
  id: string;
  title: string;
  detail: string;
  /** Sub-step ids that must all be complete for this criterion to light up. */
  requiredIds: string[];
}

export interface ExamFact {
  emoji: string;
  text: string;
}

export interface Resource {
  name: string;
  url: string;
  note: string;
}

/**
 * One certification track: all content and metadata for a study plan and its
 * skill checks. Adding a new certification means adding one of these (plus
 * its data files) — no component changes.
 */
export interface Track {
  id: TrackId;
  /** Short name shown in navigation and headings, e.g. "CKA". */
  name: string;
  /** Full certification name, e.g. "Certified Kubernetes Administrator". */
  certName: string;
  emoji: string;
  /** Route base for this track, e.g. "/cka". */
  basePath: string;
  /** Hero tagline shown under "Chart your course to the <name>". */
  heroTagline: string;
  /** One-liner used on the landing page track card. */
  landingBlurb: string;
  domains: DomainInfo[];
  weeks: Week[];
  readiness: ReadinessCriterion[];
  examFacts: ExamFact[];
  resources: Resource[];
  validations: StepValidation[];
  seo: { title: string; description: string };
}

/** A Track plus lookups derived once at module load. */
export interface TrackData extends Track {
  domainMap: Record<DomainId, DomainInfo>;
  validationMap: Record<string, StepValidation>;
  /** All sub-steps in plan order, flattened. */
  allSubSteps: SubStep[];
}

/** The single per-user Firestore document: users/{uid}. */
export interface UserDoc {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  /** Completed sub-step ids across ALL tracks (ids are globally unique). */
  completedIds: Record<string, true>;
  /**
   * Legacy field from the CKA-only era: the CKA exam date. Still written for
   * CKA so older clients keep working; `examDates.cka` wins when present.
   */
  examDate: string | null; // ISO date, e.g. "2026-09-01"
  /** Per-track target exam dates, keyed by TrackId. */
  examDates?: Partial<Record<TrackId, string | null>>;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}
