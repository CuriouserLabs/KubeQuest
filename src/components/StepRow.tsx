import { useEffect, useId, useState } from "react";
import { VALIDATION_MAP } from "../data/validation";
import type { Step } from "../types";
import { navigateTo } from "../utils/routing";
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

/**
 * Steps whose skill-check nudge was already shown (and acknowledged) this
 * session — so completing a step asks at most once, not on every re-check.
 */
const nudgedSteps = new Set<string>();

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
  /** Non-null while the skill-check pop-up is open; carries the sub-step id
   *  if the pop-up was triggered by ticking the last remaining sub-step. */
  const [nudge, setNudge] = useState<{ pendingSubId: string | null } | null>(null);
  const { done, total } = stepCounts(step, completed);
  const allDone = done === total && total > 0;
  const validation = VALIDATION_MAP[step.id];
  const showBulb = step.hints.length > 0 || !!validation;

  const completeStep = (pendingSubId: string | null) => {
    if (pendingSubId) {
      onToggleSub(pendingSubId, true);
    } else {
      onToggleMany(
        step.subSteps.map((s) => s.id),
        true,
      );
    }
  };

  const handleMainToggle = () => {
    if (!allDone && validation && !nudgedSteps.has(step.id)) {
      setNudge({ pendingSubId: null });
      return;
    }
    onToggleMany(
      step.subSteps.map((s) => s.id),
      !allDone,
    );
  };

  const handleSubToggle = (id: string, value: boolean) => {
    const completesStep = value && !completed.has(id) && done === total - 1;
    if (completesStep && validation && !nudgedSteps.has(step.id)) {
      setNudge({ pendingSubId: id });
      return;
    }
    onToggleSub(id, value);
  };

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
          onChange={handleMainToggle}
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
        {showBulb && (
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
          {validation && (
            <li className="flex gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
              <span aria-hidden="true" className="shrink-0">
                🧪
              </span>
              <span>
                Before ticking this off, validate what you've learned with{" "}
                <button
                  type="button"
                  onClick={() => navigateTo("skill-check", step.id)}
                  className="cursor-pointer font-bold text-kube-700 underline decoration-2 underline-offset-2 hover:text-kube-500 dark:text-kube-300 dark:hover:text-kube-200"
                >
                  this step's skill check
                </button>{" "}
                — a quick quiz
                {validation.drills?.length ? " and command drills" : ""} in the
                Skill Check tab.
              </span>
            </li>
          )}
        </ul>
      )}

      <ul className="mt-2 space-y-0.5 border-l-[3px] border-kube-200 pl-2 dark:border-kube-800">
        {step.subSteps.map((sub) => (
          <SubStepRow
            key={sub.id}
            subStep={sub}
            checked={completed.has(sub.id)}
            readOnly={readOnly}
            onToggle={handleSubToggle}
          />
        ))}
      </ul>

      {nudge && (
        <SkillCheckNudge
          stepTitle={step.title}
          hasDrills={!!validation?.drills?.length}
          onValidate={() => {
            nudgedSteps.add(step.id);
            setNudge(null);
            navigateTo("skill-check", step.id);
          }}
          onProceed={() => {
            nudgedSteps.add(step.id);
            completeStep(nudge.pendingSubId);
            setNudge(null);
          }}
          onCancel={() => setNudge(null)}
        />
      )}
    </li>
  );
}

/** Cartoon-styled pop-up nudging a quick skill check before completing a step. */
function SkillCheckNudge({
  stepTitle,
  hasDrills,
  onValidate,
  onProceed,
  onCancel,
}: {
  stepTitle: string;
  hasDrills: boolean;
  onValidate: () => void;
  onProceed: () => void;
  onCancel: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onCancel}
      className="fixed inset-0 z-40 flex items-center justify-center bg-kube-950/60 p-4 backdrop-blur-[2px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="cartoon-card w-full max-w-md p-5"
      >
        <h4 id={titleId} className="font-display text-lg font-extrabold">
          🧪 Validated your skills yet?
        </h4>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
          Nice progress! Before you check off{" "}
          <strong className="text-slate-800 dark:text-slate-100">
            “{stepTitle}”
          </strong>
          , there's a quick skill check for it — a short quiz
          {hasDrills ? " and command drills" : ""} to confirm the knowledge
          actually stuck.
        </p>
        <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
          (The real exam is 100% hands-on, not multiple choice — this is just a
          self-check.)
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            autoFocus
            onClick={onValidate}
            className="cartoon-btn bg-amber-300 px-4 py-2 text-sm text-kube-950"
          >
            🧪 Take the skill check
          </button>
          <button
            type="button"
            onClick={onProceed}
            className="cartoon-btn bg-white px-4 py-2 text-sm text-kube-900 dark:bg-slate-800 dark:text-slate-100"
          >
            ✅ Mark done anyway
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer px-2 py-2 text-sm font-bold text-slate-500 underline decoration-2 underline-offset-2 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
