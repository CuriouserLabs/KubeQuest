import { useId, useState } from "react";
import type { CompletedSet, PaceStatus } from "../utils/progress";
import { paceInfo } from "../utils/progress";

interface ExamDateCardProps {
  examDate: string | null;
  startedAtMs: number | null;
  completed: CompletedSet;
  signedIn: boolean;
  onSetExamDate: (isoDate: string | null) => void;
  onReset: () => Promise<void>;
}

const PACE_STYLES: Record<PaceStatus, { label: string; emoji: string; className: string }> = {
  done: {
    label: "Plan complete!",
    emoji: "🎉",
    className: "bg-emerald-200 text-emerald-900 dark:bg-emerald-500/30 dark:text-emerald-100",
  },
  ahead: {
    label: "Ahead of pace",
    emoji: "🚀",
    className: "bg-emerald-200 text-emerald-900 dark:bg-emerald-500/30 dark:text-emerald-100",
  },
  "on-track": {
    label: "On track",
    emoji: "✅",
    className: "bg-sky-200 text-sky-900 dark:bg-sky-500/30 dark:text-sky-100",
  },
  behind: {
    label: "Behind pace — pick it up",
    emoji: "🐢",
    className: "bg-amber-200 text-amber-900 dark:bg-amber-500/30 dark:text-amber-100",
  },
  overdue: {
    label: "Exam date has passed",
    emoji: "📅",
    className: "bg-rose-200 text-rose-900 dark:bg-rose-500/30 dark:text-rose-100",
  },
};

export function ExamDateCard({
  examDate,
  startedAtMs,
  completed,
  signedIn,
  onSetExamDate,
  onReset,
}: ExamDateCardProps) {
  const inputId = useId();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const pace =
    examDate !== null
      ? paceInfo(examDate, startedAtMs ?? Date.now(), completed)
      : null;

  return (
    <section aria-labelledby="exam-date-heading" className="cartoon-card p-5">
      <h2 id="exam-date-heading" className="font-display text-lg font-extrabold">
        🗓️ Target exam date
      </h2>

      {!signedIn ? (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Sign in to set a target date and get a countdown with a pace check.
        </p>
      ) : (
        <>
          <label
            htmlFor={inputId}
            className="mt-3 block text-sm font-bold text-slate-600 dark:text-slate-300"
          >
            When do you want to sit the exam?
          </label>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <input
              id={inputId}
              type="date"
              value={examDate ?? ""}
              onChange={(e) => onSetExamDate(e.target.value || null)}
              className="rounded-xl border-[3px] border-kube-950/90 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-300/25 dark:bg-slate-800 dark:[color-scheme:dark]"
            />
            {examDate && (
              <button
                type="button"
                onClick={() => onSetExamDate(null)}
                className="cartoon-btn bg-white px-3 py-2 text-xs dark:bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>

          {pace && (
            <div className="mt-4 space-y-2">
              <p className="font-display text-3xl font-extrabold text-kube-600 dark:text-kube-300">
                {pace.daysLeft >= 0 ? (
                  <>
                    {pace.daysLeft}
                    <span className="text-base font-bold text-slate-500 dark:text-slate-400">
                      {" "}
                      day{pace.daysLeft === 1 ? "" : "s"} to go
                    </span>
                  </>
                ) : (
                  <span className="text-base font-bold">Date has passed</span>
                )}
              </p>
              <p
                className={`inline-flex items-center gap-2 rounded-full border-2 border-kube-950/80 px-3 py-1 text-sm font-bold dark:border-slate-300/25 ${PACE_STYLES[pace.status].className}`}
              >
                <span aria-hidden="true">{PACE_STYLES[pace.status].emoji}</span>
                {PACE_STYLES[pace.status].label}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You're at {pace.actualPercent}% — steady pace for your date
                would be about {pace.expectedPercent}% by today.
              </p>
            </div>
          )}

          <div className="mt-6 border-t-2 border-dashed border-slate-300 pt-4 dark:border-slate-600">
            {confirmingReset ? (
              <div role="alertdialog" aria-label="Confirm progress reset" className="space-y-2">
                <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
                  Wipe all ticked items and your exam date? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={resetting}
                    onClick={() => {
                      setResetting(true);
                      void onReset().finally(() => {
                        setResetting(false);
                        setConfirmingReset(false);
                      });
                    }}
                    className="cartoon-btn bg-rose-400 px-3 py-2 text-xs text-rose-950"
                  >
                    {resetting ? "Resetting…" : "Yes, start over"}
                  </button>
                  <button
                    type="button"
                    disabled={resetting}
                    onClick={() => setConfirmingReset(false)}
                    className="cartoon-btn bg-white px-3 py-2 text-xs dark:bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingReset(true)}
                className="text-xs font-bold text-slate-400 underline decoration-dotted underline-offset-2 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400"
              >
                Reset my progress and start over
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
