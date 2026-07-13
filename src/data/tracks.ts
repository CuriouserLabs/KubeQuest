import type {
  DomainId,
  DomainInfo,
  StepValidation,
  SubStepKind,
  Track,
  TrackData,
  TrackId,
} from "../types";
import * as ckaPlan from "./cka/plan";
import * as ckaValidation from "./cka/validation";
import * as ckadPlan from "./ckad/plan";
import * as ckadValidation from "./ckad/validation";

/**
 * The track registry: every certification the app supports, with all content
 * and per-track lookups derived once at module load. Components never import
 * plan data directly — they receive a TrackData and read from it, so adding
 * a track is purely additive.
 */

/** Sub-step kind metadata, shared by every track. */
export const KIND_META: Record<
  SubStepKind,
  { label: string; emoji: string; chipClass: string }
> = {
  topic: {
    label: "Topic",
    emoji: "📘",
    chipClass:
      "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
  },
  task: {
    label: "Hands-on",
    emoji: "🛠️",
    chipClass:
      "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
  },
  checkpoint: {
    label: "Checkpoint",
    emoji: "🏁",
    chipClass:
      "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
  },
};

function buildTrackData(track: Track): TrackData {
  return {
    ...track,
    domainMap: Object.fromEntries(
      track.domains.map((d) => [d.id, d]),
    ) as Record<DomainId, DomainInfo>,
    validationMap: Object.fromEntries(
      track.validations.map((v) => [v.stepId, v]),
    ) as Record<string, StepValidation>,
    allSubSteps: track.weeks.flatMap((w) => w.steps.flatMap((s) => s.subSteps)),
  };
}

export const TRACKS: TrackData[] = [
  buildTrackData({
    id: "cka",
    name: "CKA",
    certName: "Certified Kubernetes Administrator",
    emoji: "🛠️",
    basePath: "/cka",
    heroTagline:
      "A realistic, part-time plan for busy engineers: about 6–8 hours a week over 8 weeks. The week boundaries matter less than finishing every hands-on checkpoint.",
    landingBlurb:
      "The cluster operator's exam: build, upgrade, secure and — above all — troubleshoot Kubernetes clusters themselves.",
    domains: ckaPlan.DOMAINS,
    weeks: ckaPlan.WEEKS,
    readiness: ckaPlan.READINESS,
    examFacts: ckaPlan.EXAM_FACTS,
    resources: ckaPlan.RESOURCES,
    validations: ckaValidation.VALIDATIONS,
    seo: {
      title: "CKA Study Plan & Progress Tracker | KubeQuest",
      description:
        "A free, realistic 8-week part-time study plan for the Certified Kubernetes Administrator (CKA) exam, with progress tracking, domain-weighted readiness, and hands-on skill checks.",
    },
  }),
  buildTrackData({
    id: "ckad",
    name: "CKAD",
    certName: "Certified Kubernetes Application Developer",
    emoji: "🧑‍💻",
    basePath: "/ckad",
    heroTagline:
      "A realistic, part-time plan for busy developers: about 6 hours a week over 6 weeks. The week boundaries matter less than finishing every hands-on checkpoint.",
    landingBlurb:
      "The developer's exam: design, configure, deploy and debug applications that run on Kubernetes — fast.",
    domains: ckadPlan.DOMAINS,
    weeks: ckadPlan.WEEKS,
    readiness: ckadPlan.READINESS,
    examFacts: ckadPlan.EXAM_FACTS,
    resources: ckadPlan.RESOURCES,
    validations: ckadValidation.VALIDATIONS,
    seo: {
      title: "CKAD Study Plan & Progress Tracker | KubeQuest",
      description:
        "A free, realistic 6-week part-time study plan for the Certified Kubernetes Application Developer (CKAD) exam, with progress tracking, domain-weighted readiness, and hands-on skill checks.",
    },
  }),
];

export const TRACK_MAP: Record<TrackId, TrackData> = Object.fromEntries(
  TRACKS.map((t) => [t.id, t]),
) as Record<TrackId, TrackData>;
