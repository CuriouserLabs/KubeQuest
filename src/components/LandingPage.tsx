import { TRACKS } from "../data/tracks";
import type { TrackData } from "../types";
import { navigateTo } from "../utils/routing";
import { overallCounts, percent, type CompletedSet } from "../utils/progress";

interface LandingPageProps {
  completed: CompletedSet;
  signedIn: boolean;
  studierCount: number | null;
}

/**
 * The welcome page: what KubeQuest is, the two certification tracks, and an
 * honest CKA-vs-CKAD briefing so students pick the right exam for their goal.
 */
export function LandingPage({ completed, signedIn, studierCount }: LandingPageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="py-8 text-center sm:py-12">
        <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-5xl">
          Chart your course to a{" "}
          <span className="text-kube-600 dark:text-kube-300">
            Kubernetes certification
          </span>{" "}
          ☸️
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold text-slate-600 dark:text-slate-300 sm:text-base">
          KubeQuest gives you a realistic, part-time study plan for the CKA and
          CKAD exams — with progress tracking, a &ldquo;ready to book?&rdquo;
          signal, and skill checks to prove the knowledge stuck. Free and open
          source; sign in with Google to sync your progress across devices.
        </p>
        {studierCount !== null && studierCount > 0 && (
          <p className="mt-4 inline-block rounded-full border-2 border-kube-950/80 bg-white px-4 py-1 text-sm font-bold text-kube-800 dark:border-slate-300/25 dark:bg-slate-800 dark:text-kube-200">
            🧑‍🚀 {studierCount.toLocaleString()}{" "}
            {studierCount === 1 ? "person is" : "people are"} studying with
            KubeQuest
          </p>
        )}
      </section>

      {/* Track cards */}
      <section aria-labelledby="tracks-heading" className="mt-2">
        <h2 id="tracks-heading" className="sr-only">
          Choose your certification track
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {TRACKS.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              completed={completed}
              signedIn={signedIn}
            />
          ))}
        </div>
      </section>

      {/* What you get */}
      <section aria-labelledby="features-heading" className="mt-10">
        <h2
          id="features-heading"
          className="mb-4 font-display text-2xl font-extrabold"
        >
          🎁 What you get (for free)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            emoji="🗺️"
            title="A realistic plan"
            text="Part-time weekly plans built around hands-on checkpoints, not endless video hours."
          />
          <FeatureCard
            emoji="📈"
            title="Progress that means something"
            text="Per-domain progress weighted by the official exam weights, plus a pace check against your exam date."
          />
          <FeatureCard
            emoji="🚦"
            title="A readiness bar"
            text="Clear criteria that light up as you complete the work — book the exam when every light is on."
          />
          <FeatureCard
            emoji="🧪"
            title="Skill checks"
            text="Per-step quizzes and command drills verified right in the browser — validate before you tick."
          />
        </div>
      </section>

      {/* CKA vs CKAD */}
      <section aria-labelledby="compare-heading" className="mt-10">
        <h2
          id="compare-heading"
          className="mb-2 font-display text-2xl font-extrabold"
        >
          🤔 CKA vs CKAD — which exam is for you?
        </h2>
        <p className="mb-4 max-w-3xl text-sm font-semibold text-slate-600 dark:text-slate-300">
          Both are 2-hour, 100% hands-on, proctored exams from the Linux
          Foundation / CNCF: real tasks in real clusters, 66% to pass with
          partial credit, open book (official docs only), one free retake, and
          a certification valid for 2 years. The difference is the job they
          certify you for.
        </p>

        <div className="cartoon-card overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-[3px] border-kube-950/90 dark:border-slate-300/25">
                <th scope="col" className="p-4 font-display text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  &nbsp;
                </th>
                <th scope="col" className="p-4 font-display text-base font-extrabold text-kube-700 dark:text-kube-300">
                  🛠️ CKA — Administrator
                </th>
                <th scope="col" className="p-4 font-display text-base font-extrabold text-kube-700 dark:text-kube-300">
                  🧑‍💻 CKAD — Application Developer
                </th>
              </tr>
            </thead>
            <tbody className="font-semibold text-slate-700 dark:text-slate-200">
              <CompareRow
                label="Who it's for"
                cka="Platform, DevOps and SRE folks who run clusters: infrastructure is the product."
                ckad="Developers who ship software onto clusters someone else runs."
              />
              <CompareRow
                label="What you do all exam"
                cka="Operate the cluster itself: kubeadm installs and upgrades, etcd backup/restore, RBAC, and lots of troubleshooting broken nodes and control planes."
                ckad="Live inside app manifests: pods and sidecars, Jobs, config and secrets, probes, rollouts, Helm/Kustomize, Ingress."
              />
              <CompareRow
                label="Heaviest domains"
                cka="Troubleshooting (30%) and Cluster Architecture, Installation & Configuration (25%)."
                ckad="Application Environment, Configuration & Security (25%), then Design/Build and Deployment (20% each)."
              />
              <CompareRow
                label="Assumed background"
                cka="Comfortable on Linux (systemd, journald, ssh); container basics help."
                ckad="Comfortable writing and debugging applications; YAML and container basics."
              />
              <CompareRow
                label="Unlocks"
                cka="Cluster operator / platform engineering roles; prerequisite for the CKS security exam."
                ckad="Credibility shipping cloud-native apps; the fastest of the three Kubernetes certs to prepare for."
              />
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <AdviceCard
            emoji="🛠️"
            title="Take the CKA if…"
            points={[
              "You run (or want to run) clusters: platform, DevOps, SRE.",
              "\"The node is NotReady\" sounds like your problem to fix.",
              "You want the CKS later — CKA is its prerequisite.",
            ]}
          />
          <AdviceCard
            emoji="🧑‍💻"
            title="Take the CKAD if…"
            points={[
              "You build apps and Kubernetes is where they run.",
              "You care about manifests, probes and rollouts — not kubeadm.",
              "You want a strong cert on the shortest realistic timeline.",
            ]}
          />
          <AdviceCard
            emoji="🏆"
            title="Doing both?"
            points={[
              "They overlap a lot — kubectl speed, workloads, networking.",
              "Most people find CKAD the gentler on-ramp; take it first, then add the CKA's cluster-admin depth.",
              "Your progress here tracks each plan separately.",
            ]}
          />
        </div>
      </section>
    </div>
  );
}

function TrackCard({
  track,
  completed,
  signedIn,
}: {
  track: TrackData;
  completed: CompletedSet;
  signedIn: boolean;
}) {
  const counts = overallCounts(track, completed);
  const pct = percent(counts);

  return (
    <article className="cartoon-card flex flex-col p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-[3px] border-kube-950/90 bg-kube-100 text-2xl shadow-cartoon-sm dark:border-slate-300/25 dark:bg-kube-800"
        >
          {track.emoji}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-xl font-extrabold leading-tight">
            {track.name}
          </h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {track.certName}
          </p>
        </div>
        {signedIn && counts.done > 0 && (
          <span className="chip ml-auto shrink-0 border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
            📈 {pct}% done
          </span>
        )}
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
        {track.landingBlurb}
      </p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {track.examFacts.slice(0, 3).map((fact) => (
          <li key={fact.text} className="chip bg-white text-[11px] dark:bg-slate-800">
            <span aria-hidden="true">{fact.emoji}</span>
            {fact.text}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => navigateTo({ view: "plan", trackId: track.id })}
          className="cartoon-btn bg-amber-300 px-4 py-2 text-sm text-kube-950"
        >
          🗺️ Start the {track.name} plan
        </button>
        <button
          type="button"
          onClick={() =>
            navigateTo({
              view: "skill-check",
              trackId: track.id,
              focusStepId: null,
            })
          }
          className="cartoon-btn bg-white px-4 py-2 text-sm text-kube-900 dark:bg-slate-800 dark:text-slate-100"
        >
          🧪 Skill checks
        </button>
      </div>
    </article>
  );
}

function FeatureCard({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <article className="cartoon-card p-4">
      <p aria-hidden="true" className="text-2xl">
        {emoji}
      </p>
      <h3 className="mt-1 font-display text-base font-extrabold leading-snug">
        {title}
      </h3>
      <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
        {text}
      </p>
    </article>
  );
}

function CompareRow({
  label,
  cka,
  ckad,
}: {
  label: string;
  cka: string;
  ckad: string;
}) {
  return (
    <tr className="border-b-2 border-dashed border-kube-950/20 align-top last:border-b-0 dark:border-slate-300/15">
      <th
        scope="row"
        className="w-36 p-4 text-left font-display text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400"
      >
        {label}
      </th>
      <td className="p-4 leading-relaxed">{cka}</td>
      <td className="p-4 leading-relaxed">{ckad}</td>
    </tr>
  );
}

function AdviceCard({
  emoji,
  title,
  points,
}: {
  emoji: string;
  title: string;
  points: string[];
}) {
  return (
    <article className="cartoon-card p-5">
      <h3 className="font-display text-base font-extrabold">
        <span aria-hidden="true">{emoji} </span>
        {title}
      </h3>
      <ul className="mt-2 space-y-1.5">
        {points.map((point) => (
          <li
            key={point}
            className="flex gap-2 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300"
          >
            <span aria-hidden="true" className="shrink-0">
              👉
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
