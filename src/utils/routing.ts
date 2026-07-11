/** Tiny hash router: "#/" → plan, "#/skill-check[/<stepId>]" → skill checks. */

export type AppView = "plan" | "skill-check";

export interface AppRoute {
  view: AppView;
  /** Step whose skill check should be opened and scrolled to, if any. */
  focusStepId: string | null;
}

export function parseHash(hash: string): AppRoute {
  const path = hash.replace(/^#\/?/, "");
  if (path === "skill-check" || path.startsWith("skill-check/")) {
    return { view: "skill-check", focusStepId: path.split("/")[1] || null };
  }
  return { view: "plan", focusStepId: null };
}

export function navigateTo(view: AppView, focusStepId?: string): void {
  window.location.hash =
    view === "plan" ? "/" : `/skill-check${focusStepId ? `/${focusStepId}` : ""}`;
}
