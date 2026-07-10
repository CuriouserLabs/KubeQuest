import { useId, useState } from "react";
import type { Step } from "../types";
import { stepCounts, type CompletedSet } from "../utils/progress";
import { HintText } from "./HintText";
import { SubStepRow } from "./SubStepRow";

interface StepRowProps {
  step: Step;
  completed: CompletedSet;
  readOnly: boolean;
  onToggleSub: (id: string, value: boolean) => void;
  onToggleMany: (ids: string[], value: boolean) => void;
}

export function StepRow({
  step,
  completed,
  readOnly,
  onToggleSub,
  onToggleMany,
}: StepRowProps) {
  const checkboxId = useId();
  const hintsId = useId();
  const [hintsOpen, setHintsOpen] = useState(false);
  const { done, total } = stepCounts(step, completed);
  const allDone = done === total && total > 0;

  return (
    <li className="rounded-2xl border-2 border-kube-950/60 bg-white/70 p-3 dark:border-slate-300/20 dark:bg-slate-900/60">
      <div className="flex items-start gap-2.5">
        <input
          id={checkboxId}
          type="checkbox"
          checked={allDone}
          disabled={readOnly}
          ref={(el) => {
            if (el) el.indeterminate = done > 0 && !allDone;
          }}
          onChange={() =>
            onToggleMany(
              step.subSteps.map((s) => s.id),
              !allDone,
            )
          }
          title={readOnly ? "Sign in with Google to track progress" : undefined}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded accent-kube-600 disabled:cursor-not-allowed"
          aria-label={`Mark all of "${step.title}" as ${allDone ? "not done" : "done"}`}
        />
        <div className="min-w-0 flex-1">
          <label htmlFor={checkboxId} className="cursor-pointer">
            <span className="font-display text-base font-bold leading-snug">
              {step.title}
            </span>
          </label>
          <span className="ml-2 align-middle text-xs font-bold text-slate-400 dark:text-slate-500">
            {done}/{total}
          </span>
        </div>
        {step.hints.length > 0 && (
          <button
            type="button"
            onClick={() => setHintsOpen((o) => !o)}
            aria-expanded={hintsOpen}
            aria-controls={hintsId}
            aria-label={`${hintsOpen ? "Hide" : "Show"} guidance for: ${step.title}`}
            className={`shrink-0 rounded-lg border-2 border-kube-950/80 px-2 py-0.5 text-xs font-bold transition-colors dark:border-slate-300/25 ${
              hintsOpen
                ? "bg-amber-300 text-kube-950"
                : "bg-white text-slate-500 hover:bg-amber-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            💡 Why
          </button>
        )}
      </div>

      {hintsOpen && (
        <ul
          id={hintsId}
          className="mt-2 ml-7 space-y-1.5 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 p-3 dark:border-amber-500/50 dark:bg-amber-500/10"
        >
          {step.hints.map((hint, i) => (
            <li
              key={i}
              className="flex gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200"
            >
              <span aria-hidden="true" className="shrink-0">
                👉
              </span>
              <span>
                <HintText text={hint} />
              </span>
            </li>
          ))}
        </ul>
      )}

      <ul className="mt-2 space-y-0.5 border-l-[3px] border-kube-200 pl-2 dark:border-kube-800">
        {step.subSteps.map((sub) => (
          <SubStepRow
            key={sub.id}
            subStep={sub}
            checked={completed.has(sub.id)}
            readOnly={readOnly}
            onToggle={onToggleSub}
          />
        ))}
      </ul>
    </li>
  );
}
