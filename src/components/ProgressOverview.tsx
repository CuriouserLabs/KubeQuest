import type { TrackData } from "../types";
import type { CompletedSet } from "../utils/progress";
import {
  domainCounts,
  examWeightedPercent,
  overallCounts,
  percent,
  weekCounts,
} from "../utils/progress";

export function ProgressOverview({
  track,
  completed,
}: {
  track: TrackData;
  completed: CompletedSet;
}) {
  const overall = overallCounts(track, completed);
  const overallPct = percent(overall);
  const weightedPct = examWeightedPercent(track, completed);

  return (
    <section aria-labelledby="progress-heading" className="cartoon-card p-5">
      <h2 id="progress-heading" className="font-display text-lg font-extrabold">
        📈 Your progress
      </h2>

      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row">
        <Donut percentValue={overallPct} />
        <div className="w-full flex-1 space-y-1 text-center sm:text-left">
          <p className="text-sm font-semibold">
            <span className="font-display text-2xl font-extrabold text-kube-600 dark:text-kube-300">
              {overall.done}
            </span>{" "}
            of {overall.total} items done
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Exam-weighted coverage:{" "}
            <strong className="text-slate-800 dark:text-slate-100">
              {weightedPct}%
            </strong>{" "}
            of scored material
          </p>
        </div>
      </div>

      <h3 className="mt-6 font-display text-sm font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        By exam domain
      </h3>
      <ul className="mt-2 space-y-3">
        {track.domains.map((domain) => {
          const c = domainCounts(track, domain.id, completed);
          const pct = percent(c);
          return (
            <li key={domain.id}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-bold">
                  <span aria-hidden="true">{domain.emoji} </span>
                  {domain.shortLabel}
                  {domain.weight > 0 && (
                    <span className={`chip ml-2 border-transparent ${domain.chipClass}`}>
                      {domain.weight}%
                    </span>
                  )}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {c.done}/{c.total}
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${domain.label}: ${pct}% complete`}
                className="mt-1 h-3.5 overflow-hidden rounded-full border-2 border-kube-950/80 bg-slate-100 dark:border-slate-300/25 dark:bg-slate-800"
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${domain.barClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <h3 className="mt-6 font-display text-sm font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        By week
      </h3>
      <ul className="mt-2 grid grid-cols-5 gap-2">
        {track.weeks.map((week) => {
          const c = weekCounts(week, completed);
          const done = c.done === c.total;
          return (
            <li key={week.id}>
              <a
                href={`#week-${week.id}`}
                className={`block rounded-xl border-2 border-kube-950/80 px-1 py-1.5 text-center text-xs font-bold transition-transform hover:-translate-y-0.5 dark:border-slate-300/25 ${
                  done
                    ? "bg-emerald-300 text-emerald-950 dark:bg-emerald-500/40 dark:text-emerald-100"
                    : c.done > 0
                      ? "bg-amber-200 text-amber-950 dark:bg-amber-500/30 dark:text-amber-100"
                      : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
                aria-label={`${week.badge}: ${c.done} of ${c.total} items complete`}
              >
                {week.badge.replace("Week ", "W")}
                <span className="block text-[10px] font-semibold opacity-80">
                  {c.done}/{c.total}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Donut({ percentValue }: { percentValue: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const filled = (percentValue / 100) * circumference;

  return (
    <svg
      viewBox="0 0 128 128"
      className="h-32 w-32 shrink-0"
      role="img"
      aria-label={`Overall progress: ${percentValue}%`}
    >
      <circle
        cx="64"
        cy="64"
        r={radius}
        fill="none"
        strokeWidth="14"
        className="stroke-slate-200 dark:stroke-slate-700"
      />
      <circle
        cx="64"
        cy="64"
        r={radius}
        fill="none"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference - filled}`}
        transform="rotate(-90 64 64)"
        className="stroke-kube-500 transition-all duration-700 dark:stroke-kube-400"
      />
      <text
        x="64"
        y="64"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-slate-800 font-display text-[26px] font-extrabold dark:fill-slate-100"
      >
        {percentValue}%
      </text>
    </svg>
  );
}
