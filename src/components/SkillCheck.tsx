import { useEffect, useId, useMemo, useRef, useState } from "react";
import type {
  CommandDrill,
  McqQuestion,
  Step,
  StepValidation,
  TrackData,
  Week,
} from "../types";
import { HintText } from "./HintText";

interface SkillCheckProps {
  track: TrackData;
  /** Step id to scroll to and open, from the /<track>/skill-check/<stepId> route. */
  focusStepId: string | null;
}

/** Normalise a typed command before matching: trim + collapse whitespace. */
function normalizeCommand(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

function drillPasses(drill: CommandDrill, input: string): boolean {
  const cmd = normalizeCommand(input);
  if (!cmd) return false;
  return drill.requiredPatterns.every((p) => new RegExp(p).test(cmd));
}

export function SkillCheck({ track, focusStepId }: SkillCheckProps) {
  const weeksWithChecks = useMemo(
    () =>
      track.weeks
        .map((week) => ({
          week,
          steps: week.steps.filter((s) => track.validationMap[s.id]),
        }))
        .filter((w) => w.steps.length > 0),
    [track],
  );

  const focusWeekId = focusStepId
    ? weeksWithChecks.find((w) => w.steps.some((s) => s.id === focusStepId))?.week.id ?? null
    : null;

  return (
    <div className="pt-8">
      <section className="cartoon-card p-5 sm:p-6">
        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
          🧪 {track.name} skill checks — validate before you tick
        </h2>
        <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300 sm:text-base">
          Each main step of the plan has a short quiz, and many have command
          drills you can verify right here — no cluster needed. Use them to
          confirm the knowledge actually stuck <em>before</em> checking a step
          off in the plan.
        </p>
        <p className="mt-3 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 p-3 text-xs font-semibold leading-relaxed text-slate-700 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-slate-200">
          ⚠️ Heads-up: the real {track.name} exam is <strong>not</strong>{" "}
          multiple choice — it is 100% hands-on tasks in live clusters. These quizzes
          only validate knowledge; they are no substitute for practising on a
          real cluster. Command drills are checked locally against expected
          patterns. Results are not saved — retake any check, any time.
        </p>
      </section>

      <div className="mt-6 space-y-5">
        {weeksWithChecks.map(({ week, steps }) => (
          <WeekChecksCard
            key={week.id}
            track={track}
            week={week}
            steps={steps}
            defaultOpen={focusWeekId ? week.id === focusWeekId : false}
            focusStepId={focusStepId}
          />
        ))}
      </div>
    </div>
  );
}

function WeekChecksCard({
  track,
  week,
  steps,
  defaultOpen,
  focusStepId,
}: {
  track: TrackData;
  week: Week;
  steps: Step[];
  defaultOpen: boolean;
  focusStepId: string | null;
}) {
  const bodyId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const containsFocus = focusStepId != null && steps.some((s) => s.id === focusStepId);
  useEffect(() => {
    // Deep links (#/skill-check/<stepId>) must open this card even if it is
    // already mounted, e.g. when navigating from the completion pop-up while
    // the Skill Check tab was visited before.
    if (containsFocus) setOpen(true);
  }, [containsFocus, focusStepId]);
  const domain = track.domainMap[week.domain];
  const questionCount = steps.reduce(
    (n, s) => n + (track.validationMap[s.id]?.questions.length ?? 0),
    0,
  );
  const drillCount = steps.reduce(
    (n, s) => n + (track.validationMap[s.id]?.drills?.length ?? 0),
    0,
  );

  return (
    <article className="cartoon-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="flex w-full cursor-pointer items-center gap-3 p-4 text-left transition-colors hover:bg-kube-50 dark:hover:bg-slate-800/60 sm:gap-4 sm:p-5"
      >
        <span
          aria-hidden="true"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-[3px] border-kube-950/90 bg-kube-100 font-display text-xs font-extrabold text-kube-900 shadow-cartoon-sm dark:border-slate-300/25 dark:bg-kube-800 dark:text-kube-100"
        >
          {week.badge.replace("Week ", "W")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="font-display text-base font-extrabold leading-tight sm:text-lg">
              {week.title}
            </h3>
            <span className={`chip border-transparent ${domain.chipClass}`}>
              <span aria-hidden="true">{domain.emoji}</span>
              {domain.shortLabel}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {steps.length} skill check{steps.length === 1 ? "" : "s"} ·{" "}
            {questionCount} questions
            {drillCount > 0 && ` · ${drillCount} command drill${drillCount === 1 ? "" : "s"}`}
          </p>
        </div>
        <span
          aria-hidden="true"
          className={`shrink-0 text-xl transition-transform ${open ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </button>

      {open && (
        <div
          id={bodyId}
          className="space-y-4 border-t-[3px] border-dashed border-kube-950/30 bg-kube-50/50 p-3 dark:border-slate-300/20 dark:bg-slate-950/30 sm:p-4"
        >
          {steps.map((step) => (
            <StepCheck
              key={step.id}
              step={step}
              validation={track.validationMap[step.id]}
              highlighted={step.id === focusStepId}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function StepCheck({
  step,
  validation,
  highlighted,
}: {
  step: Step;
  validation: StepValidation;
  highlighted: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!highlighted) return;
    // Deep-linked step: scroll itself into view. Deferred and instant (not
    // smooth) so late layout shifts (web fonts, sibling cards) can't strand
    // the scroll somewhere else mid-animation.
    const t = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ block: "start" });
    }, 150);
    return () => window.clearTimeout(t);
  }, [highlighted]);
  const allAnswered = validation.questions.every((q) => answers[q.id] !== undefined);
  const score = submitted
    ? validation.questions.filter((q) => answers[q.id] === q.answerIndex).length
    : 0;

  return (
    <section
      ref={sectionRef}
      id={`sc-step-${step.id}`}
      aria-label={`Skill check: ${step.title}`}
      className={`scroll-mt-24 rounded-2xl border-2 bg-white/70 p-3 dark:bg-slate-900/60 sm:p-4 ${
        highlighted
          ? "border-amber-400 dark:border-amber-500/70"
          : "border-kube-950/60 dark:border-slate-300/20"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-display text-base font-bold leading-snug">{step.title}</h4>
        {submitted && (
          <span
            className={`chip border-transparent ${
              score === validation.questions.length
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
            }`}
          >
            {score === validation.questions.length ? "🎉" : "📊"} {score}/
            {validation.questions.length}
          </span>
        )}
      </div>

      <ol className="mt-3 space-y-4">
        {validation.questions.map((q, qi) => (
          <QuestionItem
            key={q.id}
            index={qi}
            question={q}
            selected={answers[q.id]}
            submitted={submitted}
            onSelect={(choice) => {
              setAnswers((a) => ({ ...a, [q.id]: choice }));
            }}
          />
        ))}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {!submitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={() => setSubmitted(true)}
            className="cartoon-btn bg-amber-300 px-4 py-2 text-sm text-kube-950"
          >
            ✅ Check answers
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
            }}
            className="cartoon-btn bg-white px-4 py-2 text-sm text-kube-900 dark:bg-slate-800 dark:text-slate-100"
          >
            🔄 Try again
          </button>
        )}
        {!submitted && !allAnswered && (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Answer all {validation.questions.length} questions to check.
          </span>
        )}
        {submitted && score === validation.questions.length && (
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            Nailed it — this box has earned its tick! ☸️
          </span>
        )}
      </div>

      {validation.drills && validation.drills.length > 0 && (
        <div className="mt-4 border-t-2 border-dashed border-kube-950/20 pt-3 dark:border-slate-300/15">
          <h5 className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            ⌨️ Command drills — type the command you would run
          </h5>
          <ul className="mt-2 space-y-3">
            {validation.drills.map((drill) => (
              <DrillItem key={drill.id} drill={drill} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function QuestionItem({
  index,
  question,
  selected,
  submitted,
  onSelect,
}: {
  index: number;
  question: McqQuestion;
  selected: number | undefined;
  submitted: boolean;
  onSelect: (choice: number) => void;
}) {
  const groupId = useId();
  const correct = submitted && selected === question.answerIndex;

  return (
    <li>
      <p className="text-sm font-bold leading-snug">
        {index + 1}. <HintText text={question.prompt} />
        {submitted && (
          <span aria-hidden="true" className="ml-1.5">
            {correct ? "✅" : "❌"}
          </span>
        )}
      </p>
      <div role="radiogroup" aria-label={`Choices for question ${index + 1}`} className="mt-1.5 space-y-1">
        {question.choices.map((choice, ci) => {
          const isSelected = selected === ci;
          const isAnswer = ci === question.answerIndex;
          let tone =
            "border-kube-950/40 bg-white hover:bg-kube-50 dark:border-slate-300/20 dark:bg-slate-800/60 dark:hover:bg-slate-800";
          if (submitted && isAnswer) {
            tone =
              "border-emerald-500 bg-emerald-50 dark:border-emerald-400/60 dark:bg-emerald-500/15";
          } else if (submitted && isSelected && !isAnswer) {
            tone = "border-rose-400 bg-rose-50 dark:border-rose-400/60 dark:bg-rose-500/15";
          } else if (isSelected) {
            tone =
              "border-kube-500 bg-kube-50 dark:border-kube-400 dark:bg-kube-500/15";
          }
          return (
            <label
              key={ci}
              className={`flex cursor-pointer items-start gap-2 rounded-xl border-2 px-3 py-1.5 text-xs font-semibold leading-relaxed transition-colors ${tone} ${
                submitted ? "cursor-default" : ""
              }`}
            >
              <input
                type="radio"
                name={groupId}
                checked={isSelected}
                disabled={submitted}
                onChange={() => onSelect(ci)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-kube-600"
              />
              <span>
                <HintText text={choice} />
              </span>
            </label>
          );
        })}
      </div>
      {submitted && (
        <p className="mt-1.5 ml-1 flex gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <span aria-hidden="true" className="shrink-0">
            💡
          </span>
          <span>
            <HintText text={question.explanation} />
          </span>
        </p>
      )}
    </li>
  );
}

function DrillItem({ drill }: { drill: CommandDrill }) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<"idle" | "pass" | "fail">("idle");
  const [attempts, setAttempts] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const check = () => {
    const pass = drillPasses(drill, value);
    setResult(pass ? "pass" : "fail");
    if (!pass) setAttempts((a) => a + 1);
  };

  return (
    <li className="rounded-xl border-2 border-kube-950/40 bg-white p-3 dark:border-slate-300/20 dark:bg-slate-800/60">
      <label htmlFor={inputId} className="text-xs font-bold leading-relaxed">
        <HintText text={drill.instruction} />
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          id={inputId}
          type="text"
          value={value}
          spellCheck={false}
          autoComplete="off"
          placeholder="$ type your command…"
          onChange={(e) => {
            setValue(e.target.value);
            setResult("idle");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) check();
          }}
          className="min-w-0 flex-1 rounded-xl border-2 border-kube-950/60 bg-kube-50/60 px-3 py-1.5 font-mono text-xs font-semibold text-slate-800 placeholder:text-slate-400 dark:border-slate-300/25 dark:bg-slate-950/60 dark:text-slate-100"
        />
        <button
          type="button"
          disabled={!value.trim()}
          onClick={check}
          className="cartoon-btn bg-kube-600 px-3 py-1.5 text-xs text-white"
        >
          Check
        </button>
      </div>
      {result === "pass" && (
        <p className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          ✅ Correct — that command does the job.
        </p>
      )}
      {result === "fail" && (
        <p className="mt-2 text-xs font-bold text-rose-700 dark:text-rose-300">
          ❌ Not quite — check the verb, the resource, and the flags, then try
          again.
        </p>
      )}
      {(attempts > 0 || result === "pass") && !revealed && result !== "pass" && (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-2 text-xs font-bold text-kube-700 underline decoration-2 underline-offset-2 hover:text-kube-500 dark:text-kube-300"
        >
          Show a solution
        </button>
      )}
      {(revealed || result === "pass") && (
        <p className="mt-2 overflow-x-auto rounded-lg bg-kube-100 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-kube-800 dark:bg-kube-500/20 dark:text-kube-200">
          {drill.sampleSolution}
        </p>
      )}
    </li>
  );
}
