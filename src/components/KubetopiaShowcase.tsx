const PLAY_URL = "https://play.kubequest.org";

/**
 * The flagship product of the KubeQuest family: Kubetopia, the animated
 * Kubernetes simulator game. This is the banner that turns "here's a study
 * plan" into "…and here's where you go play what you learned." It deliberately
 * breaks out of the white-card rhythm with a bold gradient band so it reads as
 * the headline product, not a footnote link.
 */
export function KubetopiaShowcase() {
  return (
    <section aria-labelledby="kubetopia-heading" className="mt-12">
      <div className="relative overflow-hidden rounded-3xl border-[3px] border-kube-950/90 bg-gradient-to-br from-kube-600 via-kube-700 to-kube-900 shadow-cartoon dark:border-slate-300/25 dark:shadow-cartoon-dark">
        {/* Floating cartoon scenery — purely decorative. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
          <span className="absolute right-6 top-6 animate-float text-4xl opacity-70 sm:text-5xl">
            🏙️
          </span>
          <span className="absolute right-24 top-24 hidden animate-float-slow text-3xl opacity-50 sm:inline">
            📦
          </span>
          <span className="absolute bottom-6 right-10 animate-float text-3xl opacity-50">
            ☸️
          </span>
          <span className="absolute bottom-10 left-8 hidden animate-float-slow text-2xl opacity-40 sm:inline">
            ⚙️
          </span>
        </div>

        <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[1.15fr_1fr] md:p-10">
          {/* Pitch */}
          <div className="text-white">
            <span className="chip border-white/40 bg-white/15 text-white backdrop-blur-sm">
              🎮 The KubeQuest flagship game
            </span>

            <h2
              id="kubetopia-heading"
              className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl"
            >
              Run a whole city on Kubernetes in{" "}
              <span className="text-amber-300">Kubetopia</span> 🏙️
            </h2>

            <p className="mt-3 max-w-xl text-sm font-semibold text-kube-50/95 sm:text-base">
              Kubetopia is a cartoon 3D island town where every building is a
              node and every glowing crate is a pod. You&rsquo;re the on-call
              engineer — type <strong>real <code>kubectl</code> commands</strong>{" "}
              into a live cluster, fix the outages, and keep the townsfolk happy
              before the meter bottoms out. It&rsquo;s where everything you study
              here turns into muscle memory.
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {[
                { emoji: "⌨️", text: "A real kubectl console" },
                { emoji: "🧩", text: "Live YAML editor" },
                { emoji: "🏗️", text: "A 3D town that reacts" },
                { emoji: "⭐", text: "12 story missions, stars & scoring" },
              ].map((f) => (
                <li
                  key={f.text}
                  className="chip border-white/40 bg-white/15 text-white backdrop-blur-sm"
                >
                  <span aria-hidden="true">{f.emoji}</span>
                  {f.text}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={PLAY_URL}
                target="_blank"
                rel="noreferrer"
                className="cartoon-btn bg-amber-300 px-5 py-2.5 text-base text-kube-950 hover:bg-amber-200"
              >
                🎮 Play Kubetopia — save the city
              </a>
              <span className="text-xs font-bold text-kube-100">
                Free · no sign-in needed · same Google account as KubeQuest
              </span>
            </div>
          </div>

          {/* Campaign portals — mirror the CKA/CKAD tracks players study here. */}
          <div className="grid content-start gap-3">
            <CampaignCard
              emoji="🏙️"
              title="The City Campaign"
              subtitle="Path of the Cluster Admin"
              track="CKA-style"
              text="Blackouts, cursed deploys and NotReady nodes: cordon, drain, roll back and troubleshoot to keep Kubetopia running."
            />
            <CampaignCard
              emoji="🏥"
              title="The Hospital Campaign"
              subtitle="Path of the App Developer"
              track="CKAD-style"
              text="Ship apps from YAML: ConfigMaps, Secrets, probes and rollouts — land the hotfix before Code Blue."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CampaignCard({
  emoji,
  title,
  subtitle,
  track,
  text,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  track: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl border-[3px] border-kube-950/90 bg-white/95 p-4 shadow-cartoon-sm dark:border-slate-300/25 dark:bg-slate-900/95">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-[3px] border-kube-950/90 bg-kube-100 text-2xl dark:border-slate-300/25 dark:bg-kube-800"
        >
          {emoji}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-base font-extrabold leading-tight text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          <p className="text-xs font-bold text-kube-700 dark:text-kube-300">
            {subtitle} · {track}
          </p>
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
        {text}
      </p>
    </article>
  );
}
