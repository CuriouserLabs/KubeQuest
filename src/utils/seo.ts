import { TRACK_MAP } from "../data/tracks";
import { routeToPath, type AppRoute } from "./routing";

/**
 * Per-route SEO: the app is a client-rendered SPA, so index.html carries
 * site-wide defaults and this module keeps title / meta description /
 * canonical in sync with the current route for crawlers that execute JS
 * (and for social shares of deep links).
 */

const ORIGIN = "https://kubequest.org";

const LANDING_TITLE = "KubeQuest — CKA & CKAD Study Plans & Progress Tracker";
const LANDING_DESCRIPTION =
  "Free, open-source study plans and progress trackers for the CKA and CKAD Kubernetes certifications: realistic part-time plans, domain-weighted readiness, and hands-on skill checks.";

function routeMeta(route: AppRoute): { title: string; description: string } {
  if (route.view === "landing") {
    return { title: LANDING_TITLE, description: LANDING_DESCRIPTION };
  }
  const track = TRACK_MAP[route.trackId];
  if (route.view === "skill-check") {
    return {
      title: `${track.name} Skill Checks — Quizzes & Command Drills | KubeQuest`,
      description: `Validate your ${track.certName} (${track.name}) knowledge with free per-step quizzes and locally verified kubectl command drills — no cluster needed.`,
    };
  }
  return { title: track.seo.title, description: track.seo.description };
}

export function applySeo(route: AppRoute): void {
  const { title, description } = routeMeta(route);
  document.title = title;
  document
    .querySelector<HTMLMetaElement>('meta[name="description"]')
    ?.setAttribute("content", description);
  // Skill-check deep links (/…/skill-check/<stepId>) canonicalise to the
  // step-less skill-check page — same content, one indexable URL.
  const canonicalRoute: AppRoute =
    route.view === "skill-check" ? { ...route, focusStepId: null } : route;
  const canonicalPath = routeToPath(canonicalRoute);
  document
    .querySelector<HTMLLinkElement>('link[rel="canonical"]')
    ?.setAttribute(
      "href",
      canonicalPath === "/" ? `${ORIGIN}/` : `${ORIGIN}${canonicalPath}`,
    );
}
