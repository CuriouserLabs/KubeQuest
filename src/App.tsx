import { useMemo } from "react";
import { Header } from "./components/Header";
import { KubeBackground } from "./components/KubeBackground";
import { ProgressOverview } from "./components/ProgressOverview";
import { ExamDateCard } from "./components/ExamDateCard";
import { ReadinessCard } from "./components/ReadinessCard";
import { WeekCard } from "./components/WeekCard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EXAM_FACTS, RESOURCES, WEEKS } from "./data/plan";
import { useProgress } from "./hooks/useProgress";
import { useStudierCount } from "./hooks/useStudierCount";
import { useTheme } from "./hooks/useTheme";
import { completedSetFromMap, firstUnfinishedWeekId } from "./utils/progress";

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading: authLoading, available, error: authError } = useAuth();
  const progress = useProgress(user);
  const studierCount = useStudierCount();

  const completed = useMemo(
    () => completedSetFromMap(progress.completedMap),
    [progress.completedMap],
  );
  const openWeekId = firstUnfinishedWeekId(completed) ?? WEEKS[0].id;
  const readOnly = !user;

  return (
    <div className="min-h-screen font-body text-slate-800 dark:text-slate-100">
      <KubeBackground />
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="mx-auto max-w-5xl px-4 pb-20">
        {/* Hero */}
        <section className="py-8 text-center sm:py-10">
          <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Chart your course to the{" "}
            <span className="text-kube-600 dark:text-kube-300">CKA</span> ☸️
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold text-slate-600 dark:text-slate-300 sm:text-base">
            A realistic, part-time plan for a working backend engineer: about
            6–8 hours a week over 8 weeks. The week boundaries matter less than
            finishing every hands-on checkpoint.
          </p>
          {studierCount !== null && studierCount > 0 && (
            <p className="mt-3 inline-block rounded-full border-2 border-kube-950/80 bg-white px-4 py-1 text-sm font-bold text-kube-800 dark:border-slate-300/25 dark:bg-slate-800 dark:text-kube-200">
              🧑‍🚀 {studierCount.toLocaleString()}{" "}
              {studierCount === 1 ? "person is" : "people are"} studying this plan
            </p>
          )}
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {EXAM_FACTS.map((fact) => (
              <li key={fact.text} className="chip bg-white dark:bg-slate-800">
                <span aria-hidden="true">{fact.emoji}</span>
                {fact.text}
              </li>
            ))}
          </ul>
        </section>

        {/* Status banners */}
        {!available && (
          <Banner tone="info">
            Firebase isn't configured (no <code>.env</code>), so you're browsing
            in read-only mode. See the README to enable sign-in and progress
            tracking.
          </Banner>
        )}
        {available && !authLoading && !user && (
          <Banner tone="info">
            👋 Browse the whole plan freely — <strong>sign in with Google</strong>{" "}
            (top right) to tick things off and sync progress across devices.
          </Banner>
        )}
        {authError && <Banner tone="error">{authError}</Banner>}
        {progress.loadError && <Banner tone="error">{progress.loadError}</Banner>}
        {user && progress.loading && (
          <Banner tone="info">
            <span className="inline-block animate-spin" aria-hidden="true">
              ☸️
            </span>{" "}
            Loading your progress…
          </Banner>
        )}

        {/* Dashboard */}
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ProgressOverview completed={completed} />
          </div>
          <div className="space-y-5 lg:col-span-2">
            <ExamDateCard
              examDate={progress.examDate}
              startedAtMs={progress.startedAtMs}
              completed={completed}
              signedIn={!!user}
              onSetExamDate={progress.setExamDate}
              onReset={progress.resetProgress}
            />
            <ReadinessCard completed={completed} />
          </div>
        </div>

        {/* The plan */}
        <h2 className="mt-10 mb-4 font-display text-2xl font-extrabold">
          🗺️ The plan, week by week
        </h2>
        <div className="space-y-5">
          {WEEKS.map((week) => (
            <WeekCard
              key={week.id}
              week={week}
              completed={completed}
              readOnly={readOnly}
              defaultOpen={week.id === openWeekId}
              onToggleSub={progress.toggleSubStep}
              onToggleMany={progress.setManySubSteps}
            />
          ))}
        </div>

        {/* Resources */}
        <section aria-labelledby="resources-heading" className="cartoon-card mt-10 p-5">
          <h2 id="resources-heading" className="font-display text-lg font-extrabold">
            🎒 Resources (keep it minimal)
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Do not collect more than this — depth of repetition on a real
            cluster beats breadth of materials for a hands-on exam.
          </p>
          <ul className="mt-3 space-y-2">
            {RESOURCES.map((r) => (
              <li key={r.name} className="text-sm">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-kube-700 underline decoration-2 underline-offset-2 hover:text-kube-500 dark:text-kube-300 dark:hover:text-kube-200"
                >
                  {r.name}
                </a>{" "}
                <span className="text-slate-500 dark:text-slate-400">— {r.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-10 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
          Open source · your progress is private to your account · good luck,
          captain ☸️
        </footer>
      </main>

      {/* Save-error toast */}
      {progress.saveError && (
        <div
          role="alert"
          className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border-[3px] border-kube-950/90 bg-rose-100 px-4 py-3 text-sm font-bold text-rose-900 shadow-cartoon dark:border-slate-300/25 dark:bg-rose-900 dark:text-rose-100"
        >
          ⚠️ {progress.saveError}
        </div>
      )}
    </div>
  );
}

function Banner({
  tone,
  children,
}: {
  tone: "info" | "error";
  children: React.ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : undefined}
      className={`mb-5 rounded-2xl border-[3px] border-kube-950/90 px-4 py-3 text-sm font-semibold shadow-cartoon-sm dark:border-slate-300/25 ${
        tone === "error"
          ? "bg-rose-100 text-rose-900 dark:bg-rose-900/60 dark:text-rose-100"
          : "bg-sky-100 text-sky-900 dark:bg-sky-900/60 dark:text-sky-100"
      }`}
    >
      {children}
    </p>
  );
}
