/**
 * Decorative full-page background: a soft sky gradient with floating cartoon
 * clouds, Kubernetes helm wheels, and container boxes. Purely visual —
 * hidden from assistive tech and mouse events.
 */
export function KubeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-sky-200 via-kube-50 to-sky-100 dark:from-kube-950 dark:via-slate-950 dark:to-slate-900"
    >
      {/* Helm wheels */}
      <Wheel className="absolute -left-10 top-24 h-40 w-40 animate-spin-slow text-kube-300/60 dark:text-kube-700/25" />
      <Wheel className="absolute right-[8%] top-[55%] h-28 w-28 animate-spin-slow text-kube-300/50 dark:text-kube-700/20" />
      <Wheel className="absolute left-[15%] bottom-[8%] h-20 w-20 animate-spin-slow text-kube-300/50 dark:text-kube-700/20" />

      {/* Clouds */}
      <Cloud className="absolute right-[12%] top-16 h-16 w-32 animate-float text-white/90 dark:text-slate-700/40" />
      <Cloud className="absolute left-[30%] top-40 h-12 w-24 animate-float-slow text-white/80 dark:text-slate-700/30" />
      <Cloud className="absolute right-[30%] bottom-[20%] h-14 w-28 animate-float text-white/70 dark:text-slate-700/30" />
      <Cloud className="absolute left-[5%] top-[60%] h-12 w-24 animate-float-slow text-white/80 dark:text-slate-700/35" />

      {/* Container boxes */}
      <Box className="absolute right-[5%] top-[30%] h-14 w-14 rotate-6 animate-float-slow text-amber-400/40 dark:text-amber-500/15" />
      <Box className="absolute left-[45%] bottom-[6%] h-12 w-12 -rotate-6 animate-float text-emerald-400/40 dark:text-emerald-500/15" />
      <Box className="absolute left-[8%] top-[38%] h-10 w-10 rotate-12 animate-float text-violet-400/40 dark:text-violet-500/15" />
    </div>
  );
}

function Wheel({ className }: { className?: string }) {
  const spokes = Array.from({ length: 7 }, (_, i) => (i * 360) / 7);
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="7" />
      <circle cx="50" cy="50" r="12" fill="currentColor" />
      {spokes.map((angle) => (
        <line
          key={angle}
          x1="50"
          y1="50"
          x2={50 + 44 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 44 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 50" className={className} fill="currentColor">
      <ellipse cx="30" cy="34" rx="26" ry="15" />
      <ellipse cx="55" cy="24" rx="22" ry="17" />
      <ellipse cx="76" cy="35" rx="20" ry="13" />
    </svg>
  );
}

function Box({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="14"
        stroke="currentColor"
        strokeWidth="8"
      />
      <line x1="10" y1="42" x2="90" y2="42" stroke="currentColor" strokeWidth="8" />
      <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="8" />
    </svg>
  );
}
