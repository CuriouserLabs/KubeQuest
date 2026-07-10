import { Fragment } from "react";

/**
 * Renders a hint string, styling `backtick` spans as inline code.
 * Hints in the plan data use backticks for commands and file paths.
 */
export function HintText({ text }: { text: string }) {
  const parts = text.split("`");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code
            // Hint arrays are static; index keys are stable here.
            key={i}
            className="rounded-md bg-kube-100 px-1.5 py-0.5 font-mono text-[0.85em] font-semibold text-kube-800 dark:bg-kube-500/20 dark:text-kube-200"
          >
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
