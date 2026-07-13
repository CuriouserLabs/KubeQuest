import { useId, useState } from "react";
import type { TrackData, Week } from "../types";
import { percent, weekCounts, type CompletedSet } from "../utils/progress";
import { StepRow } from "./StepRow";

interface WeekCardProps {
  track: TrackData;
  week: Week;
  completed: CompletedSet;
  readOnly: boolean;
  defaultOpen: boolean;
  onToggleSub: (id: string, value: boolean) => void;
  onToggleMany: (ids: string[], value: boolean) => void;
}

export function WeekCard({
  track,
  week,
  completed,
  readOnly,
  defaultOpen,
  onToggleSub,
  onToggleMany,
}: WeekCardProps) {
  const bodyId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const counts = weekCounts(week, completed);
  const pct = percent(counts);
  const domain = track.domainMap[week.domain];
  const allDone = counts.done === counts.total;

  return (
    <article id={`week-${week.id}`} className="cartoon-card scroll-mt-24 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="flex w-full cursor-pointer items-center gap-3 p-4 text-left transition-colors hover:bg-kube-50 dark:hover:bg-slate-800/60 sm:gap-4 sm:p-5"
      >
        <span
          aria-hidden="true"
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-[3px] border-kube-950/90 font-display text-xs font-extrabold shadow-cartoon-sm dark:border-slate-300/25 ${
            allDone ? "bg-emerald-300 text-emerald-950" : "bg-kube-100 text-kube-900 dark:bg-kube-800 dark:text-kube-100"
          }`}
        >
          {allDone ? "✓" : week.badge.replace("Week ", "W")}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-display text-base font-extrabold leading-tight sm:text-lg">
              {week.title}
            </h3>
            <span className={`chip border-transparent ${domain.chipClass}`}>
              <span aria-hidden="true">{domain.emoji}</span>
              {week.weightNote ?? domain.shortLabel}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {week.tagline}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${week.badge} progress: ${pct}%`}
              className="h-2.5 flex-1 overflow-hidden rounded-full border-2 border-kube-950/60 bg-slate-100 dark:border-slate-300/20 dark:bg-slate-800"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${domain.barClass}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-bold text-slate-500 dark:text-slate-400">
              {counts.done}/{counts.total}
            </span>
          </div>
        </div>

        <span
          aria-hidden="true"
          className={`shrink-0 text-xl transition-transform ${open ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </button>

      {open && (
        <div id={bodyId} className="border-t-[3px] border-dashed border-kube-950/30 bg-kube-50/50 p-3 dark:border-slate-300/20 dark:bg-slate-950/30 sm:p-4">
          <ul className="space-y-3">
            {week.steps.map((step) => (
              <StepRow
                key={step.id}
                track={track}
                step={step}
                completed={completed}
                readOnly={readOnly}
                onToggleSub={onToggleSub}
                onToggleMany={onToggleMany}
              />
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
