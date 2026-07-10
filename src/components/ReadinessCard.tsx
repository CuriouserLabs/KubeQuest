import type { CompletedSet } from "../utils/progress";
import { readinessStatuses } from "../utils/progress";

/**
 * The "am I ready to book the exam?" panel. Each criterion from the plan's
 * readiness bar lights up automatically as its required work is completed.
 */
export function ReadinessCard({ completed }: { completed: CompletedSet }) {
  const statuses = readinessStatuses(completed);
  const metCount = statuses.filter((s) => s.met).length;
  const allMet = metCount === statuses.length;

  return (
    <section aria-labelledby="readiness-heading" className="cartoon-card p-5">
      <h2 id="readiness-heading" className="font-display text-lg font-extrabold">
        🚦 Readiness bar
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Book the exam when every light is on. {metCount}/{statuses.length} lit.
      </p>

      <ul className="mt-4 space-y-3">
        {statuses.map(({ criterion, done, total, met }) => (
          <li
            key={criterion.id}
            className={`rounded-2xl border-2 border-kube-950/80 p-3 transition-colors dark:border-slate-300/25 ${
              met
                ? "bg-emerald-100 dark:bg-emerald-500/15"
                : "bg-slate-50 dark:bg-slate-800/60"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className={`mt-0.5 text-lg ${met ? "" : "opacity-40 grayscale"}`}
              >
                💡
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug">
                  {criterion.title}
                  <span className="sr-only">
                    {met ? " — achieved" : ` — ${done} of ${total} tasks done`}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {criterion.detail}{" "}
                  <span aria-hidden="true" className="font-semibold">
                    ({done}/{total})
                  </span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {allMet && (
        <p
          role="status"
          className="mt-4 rounded-2xl border-[3px] border-kube-950/90 bg-amber-300 p-3 text-center font-display text-base font-extrabold text-kube-950 shadow-cartoon-sm dark:border-slate-300/25"
        >
          🎉 All lights on — book the exam!
        </p>
      )}
    </section>
  );
}
