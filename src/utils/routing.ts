import type { TrackId } from "../types";

/**
 * Tiny history-API router over real paths (the Firebase Hosting SPA rewrite
 * serves index.html for every path, and real URLs beat hash routes for SEO):
 *
 *   "/"                               → landing page
 *   "/<track>"                        → that track's study plan
 *   "/<track>/skill-check[/<stepId>]" → that track's skill checks
 *
 * Legacy hash routes from the CKA-only era ("#/skill-check[/<stepId>]") are
 * translated to "/cka/..." so old links keep working.
 */

export type AppRoute =
  | { view: "landing" }
  | { view: "plan"; trackId: TrackId }
  | { view: "skill-check"; trackId: TrackId; focusStepId: string | null };

const TRACK_IDS: TrackId[] = ["cka", "ckad"];

function isTrackId(value: string): value is TrackId {
  return (TRACK_IDS as string[]).includes(value);
}

export function routeToPath(route: AppRoute): string {
  switch (route.view) {
    case "landing":
      return "/";
    case "plan":
      return `/${route.trackId}`;
    case "skill-check":
      return `/${route.trackId}/skill-check${
        route.focusStepId ? `/${route.focusStepId}` : ""
      }`;
  }
}

export function parsePath(pathname: string): AppRoute {
  const [first, second, third] = pathname
    .split("/")
    .filter(Boolean)
    .map(decodeURIComponent);
  if (first && isTrackId(first)) {
    if (second === "skill-check") {
      return { view: "skill-check", trackId: first, focusStepId: third || null };
    }
    return { view: "plan", trackId: first };
  }
  return { view: "landing" };
}

/** Parse the initial location, translating legacy hash URLs to path routes. */
export function parseInitialLocation(location: Location): AppRoute {
  const hashPath = location.hash.replace(/^#\/?/, "");
  if (hashPath === "skill-check" || hashPath.startsWith("skill-check/")) {
    const route: AppRoute = {
      view: "skill-check",
      trackId: "cka",
      focusStepId: hashPath.split("/")[1] || null,
    };
    window.history.replaceState(null, "", routeToPath(route));
    return route;
  }
  return parsePath(location.pathname);
}

/** Fired on pushState navigations so the app can re-render (popstate only
 *  fires for browser back/forward). */
export const NAVIGATE_EVENT = "kubequest:navigate";

export function navigateTo(route: AppRoute): void {
  const path = routeToPath(route);
  if (window.location.pathname !== path) {
    window.history.pushState(null, "", path);
  }
  window.dispatchEvent(new CustomEvent(NAVIGATE_EVENT));
}
