import { useId, useState } from "react";
import { KIND_META } from "../data/plan";
import type { SubStep } from "../types";
import { HintText } from "./HintText";

interface SubStepRowProps {
  subStep: SubStep;
  checked: boolean;
  readOnly: boolean;
  onToggle: (id: string, value: boolean) => void;
}

export function SubStepRow({ subStep, checked, readOnly, onToggle }: SubStepRowProps) {
  const checkboxId = useId();
  const hintsId = useId();
  const [hintsOpen, setHintsOpen] = useState(false);
  const kind = KIND_META[subStep.kind];

  return (
    <li className="rounded-xl px-2 py-1.5 transition-colors hover:bg-kube-50 dark:hover:bg-slate-800/60">
      <div className="flex items-start gap-2.5">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          disabled={readOnly}
          onChange={(e) => onToggle(subStep.id, e.target.checked)}
          title={readOnly ? "Sign in with Google to track progress" : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-kube-600 disabled:cursor-not-allowed"
        />
        <label
          htmlFor={checkboxId}
          className={`min-w-0 flex-1 cursor-pointer text-sm leading-snug ${
            checked
              ? "text-slate-400 line-through decoration-2 dark:text-slate-500"
              : "font-semibold"
          }`}
        >
          {subStep.title}
        </label>
        <span className={`chip hidden shrink-0 border-transparent sm:inline-flex ${kind.chipClass}`}>
          <span aria-hidden="true">{kind.emoji}</span>
          {kind.label}
        </span>
        {subStep.hints.length > 0 && (
          <button
            type="button"
            onClick={() => setHintsOpen((o) => !o)}
            aria-expanded={hintsOpen}
            aria-controls={hintsId}
            aria-label={`${hintsOpen ? "Hide" : "Show"} hints for: ${subStep.title}`}
            className={`shrink-0 rounded-lg border-2 border-kube-950/80 px-1.5 py-0.5 text-xs font-bold transition-colors dark:border-slate-300/25 ${
              hintsOpen
                ? "bg-amber-300 text-kube-950"
                : "bg-white text-slate-500 hover:bg-amber-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            💡
          </button>
        )}
      </div>

      {hintsOpen && (
        <ul
          id={hintsId}
          className="mt-2 ml-7 space-y-1.5 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 p-3 dark:border-amber-500/50 dark:bg-amber-500/10"
        >
          {subStep.hints.map((hint, i) => (
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
    </li>
  );
}
