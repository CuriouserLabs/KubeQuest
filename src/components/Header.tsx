import { useAuth } from "../context/AuthContext";
import type { Theme } from "../hooks/useTheme";
import type { AppView } from "../utils/routing";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  view: AppView;
  onNavigate: (view: AppView) => void;
}

export function Header({ theme, onToggleTheme, view, onNavigate }: HeaderProps) {
  const { user, loading, available, signIn, signOutUser } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b-[3px] border-kube-950/90 bg-kube-600 dark:border-slate-300/25 dark:bg-kube-900">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border-[3px] border-kube-950/90 bg-white text-2xl shadow-cartoon-sm dark:border-slate-300/25"
        >
          ☸️
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl font-extrabold leading-tight text-white sm:text-2xl">
            KubeQuest
          </h1>
          <p className="truncate text-xs font-semibold text-kube-100">
            CKA study plan tracker
          </p>
        </div>

        <nav aria-label="Sections" className="flex shrink-0 gap-1.5">
          <NavTab
            label="Plan"
            emoji="🗺️"
            active={view === "plan"}
            onClick={() => onNavigate("plan")}
          />
          <NavTab
            label="Skill Check"
            emoji="🧪"
            active={view === "skill-check"}
            onClick={() => onNavigate("skill-check")}
          />
        </nav>

        <button
          type="button"
          onClick={onToggleTheme}
          className="cartoon-btn h-11 w-11 bg-white text-xl dark:bg-slate-800"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={theme === "dark"}
        >
          <span aria-hidden="true">{theme === "dark" ? "🌞" : "🌙"}</span>
        </button>

        {available &&
          (loading ? (
            <span
              className="h-11 w-24 animate-pulse rounded-2xl bg-kube-500/60"
              role="status"
              aria-label="Checking sign-in status"
            />
          ) : user ? (
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="hidden h-11 w-11 rounded-2xl border-[3px] border-kube-950/90 dark:border-slate-300/25 sm:block"
                />
              ) : null}
              <button
                type="button"
                onClick={() => void signOutUser()}
                className="cartoon-btn bg-white px-4 py-2 text-sm text-kube-900 dark:bg-slate-800 dark:text-slate-100"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void signIn()}
              className="cartoon-btn bg-amber-300 px-4 py-2 text-sm text-kube-950"
            >
              <GoogleMark />
              Sign in
            </button>
          ))}
      </div>
    </header>
  );
}

function NavTab({
  label,
  emoji,
  active,
  onClick,
}: {
  label: string;
  emoji: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`cartoon-btn px-3 py-2 text-sm ${
        active
          ? "bg-white text-kube-900 dark:bg-slate-800 dark:text-slate-100"
          : "bg-kube-700 text-white hover:bg-kube-500 dark:bg-kube-800"
      }`}
    >
      <span aria-hidden="true">{emoji}</span>
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
    </button>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.02.15 3.5 2.7.24.03c2.2-2.1 3.5-5.1 3.5-8.6"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.2 0-5.8-2.1-6.8-5l-.14.01-3.7 2.8-.05.13C3.3 21.3 7.3 24 12 24"
      />
      <path
        fill="#FBBC05"
        d="M5.2 14.4c-.3-.7-.4-1.5-.4-2.4s.2-1.6.4-2.4l-.01-.16-3.7-2.9-.12.06C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4z"
      />
      <path
        fill="#EB4335"
        d="M12 4.6c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.4 6.6l3.8 2.9c1-2.8 3.6-4.9 6.8-4.9"
      />
    </svg>
  );
}
