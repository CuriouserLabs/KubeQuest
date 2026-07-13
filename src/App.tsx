import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { KubeBackground } from "./components/KubeBackground";
import { LandingPage } from "./components/LandingPage";
import { ProgressOverview } from "./components/ProgressOverview";
import { ExamDateCard } from "./components/ExamDateCard";
import { ReadinessCard } from "./components/ReadinessCard";
import { SkillCheck } from "./components/SkillCheck";
import { WeekCard } from "./components/WeekCard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TRACK_MAP } from "./data/tracks";
import { useProgress } from "./hooks/useProgress";
import { useStudierCount } from "./hooks/useStudierCount";
import { useTheme } from "./hooks/useTheme";
import type { TrackData } from "./types";
import { completedSetFromMap, firstUnfinishedWeekId, type CompletedSet } from "./utils/progress";
import {
  NAVIGATE_EVENT,
  navigateTo,
  parseInitialLocation,
  parsePath,
  type AppRoute,
} from "./utils/routing";
import { applySeo } from "./utils/seo";

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

  const [route, setRoute] = useState<AppRoute>(() =>
    parseInitialLocation(window.location),
  );
  useEffect(() => {
    const onChange = () => setRoute(parsePath(window.location.pathname));
    window.addEventListener("popstate", onChange);
    window.addEventListener(NAVIGATE_EVENT, onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener(NAVIGATE_EVENT, onChange);
    };
  }, []);
  useEffect(() => {
    applySeo(route);
    // Fresh view: start at the top unless a skill check asked to be focused.
    if (!(route.view === "skill-check" && route.focusStepId)) {
      window.scrollTo(0, 0);
    }
  }, [route]);

  const completed = useMemo(
    () => completedSetFromMap(progress.completedMap),
    [progress.completedMap],
  );
  const track = route.view === "landing" ? null : TRACK_MAP[route.trackId];

  return (
    <div className="min-h-screen font-body text-slate-800 dark:text-slate-100">
      <KubeBackground />
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        route={route}
        onNavigate={navigateTo}
      />

      <main className="mx-auto max-w-5xl px-4 pb-20">
        {route.view === "landing" && (
          <LandingPage
            completed={completed}
            signedIn={!!user}
            studierCount={studierCount}
          />
        )}
        {route.view === "skill-check" && track && (
          <SkillCheck track={track} focusStepId={route.focusStepId} />
        )}
        {route.view === "plan" && track && (
          <TrackPlanView
            track={track}
            completed={completed}
            banners={
              <>
                {!available && (
                  <Banner tone="info">
                    Firebase isn't configured (no <code>.env</code>), so you're
                    browsing in read-only mode. See the README to enable
                    sign-in and progress tracking.
                  </Banner>
                )}
                {available && !authLoading && !user && (
                  <Banner tone="info">
                    👋 Browse the whole plan freely —{" "}
                    <strong>sign in with Google</strong> (top right) to tick
                    things off and sync progress across devices.
                  </Banner>
                )}
                {authError && <Banner tone="error">{authError}</Banner>}
                {progress.loadError && (
                  <Banner tone="error">{progress.loadError}</Banner>
                )}
                {user && progress.loading && (
                  <Banner tone="info">
                    <span className="inline-block animate-spin" aria-hidden="true">
                      ☸️
                    </span>{" "}
                    Loading your progress…
                  </Banner>
                )}
              </>
            }
            signedIn={!!user}
            examDate={progress.examDates[track.id]}
            startedAtMs={progress.startedAtMs}
            onSetExamDate={(iso) => progress.setExamDate(track.id, iso)}
            onReset={() => progress.resetTrackProgress(track)}
            onToggleSub={progress.toggleSubStep}
            onToggleMany={progress.setManySubSteps}
          />
        )}

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

interface TrackPlanViewProps {
  track: TrackData;
  completed: CompletedSet;
  banners: React.ReactNode;
  signedIn: boolean;
  examDate: string | null;
  startedAtMs: number | null;
  onSetExamDate: (isoDate: string | null) => void;
  onReset: () => Promise<void>;
  onToggleSub: (id: string, value: boolean) => void;
  onToggleMany: (ids: string[], value: boolean) => void;
}

/** One track's full plan page: hero, dashboard, weekly plan and resources. */
function TrackPlanView({
  track,
  completed,
  banners,
  signedIn,
  examDate,
  startedAtMs,
  onSetExamDate,
  onReset,
  onToggleSub,
  onToggleMany,
}: TrackPlanViewProps) {
  const openWeekId = firstUnfinishedWeekId(track, completed) ?? track.weeks[0].id;
  const readOnly = !signedIn;

  return (
    <>
      {/* Hero */}
      <section className="py-8 text-center sm:py-10">
        <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
          Chart your course to the{" "}
          <span className="text-kube-600 dark:text-kube-300">{track.name}</span>{" "}
          ☸️
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold text-slate-600 dark:text-slate-300 sm:text-base">
          {track.heroTagline}
        </p>
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {track.examFacts.map((fact) => (
            <li key={fact.text} className="chip bg-white dark:bg-slate-800">
              <span aria-hidden="true">{fact.emoji}</span>
              {fact.text}
            </li>
          ))}
        </ul>
      </section>

      {/* Status banners */}
      {banners}

      {/* Dashboard */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProgressOverview track={track} completed={completed} />
        </div>
        <div className="space-y-5 lg:col-span-2">
          <ExamDateCard
            track={track}
            examDate={examDate}
            startedAtMs={startedAtMs}
            completed={completed}
            signedIn={signedIn}
            onSetExamDate={onSetExamDate}
            onReset={onReset}
          />
          <ReadinessCard track={track} completed={completed} />
        </div>
      </div>

      {/* The plan */}
      <h2 className="mt-10 mb-4 font-display text-2xl font-extrabold">
        🗺️ The plan, week by week
      </h2>
      <div className="space-y-5">
        {track.weeks.map((week) => (
          <WeekCard
            key={week.id}
            track={track}
            week={week}
            completed={completed}
            readOnly={readOnly}
            defaultOpen={week.id === openWeekId}
            onToggleSub={onToggleSub}
            onToggleMany={onToggleMany}
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
          {track.resources.map((r) => (
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
    </>
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
