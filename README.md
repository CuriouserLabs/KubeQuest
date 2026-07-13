# ☸️ KubeQuest — CKA & CKAD Study Plan Tracker

A community web app for following and tracking progress through realistic,
part-time study plans for the **CKA (Certified Kubernetes Administrator)** and
**CKAD (Certified Kubernetes Application Developer)** exams
(see [CKA_Study_Plan.md](CKA_Study_Plan.md) and
[CKAD_Study_Plan.md](CKAD_Study_Plan.md), the human-readable sources of truth
for the plan content).

- 🏠 A landing page (`/`) that briefs students on both exams — who each is
  for, how they differ, and which to take — and routes them into a track.
- 🗺️ Each track's full plan as an expandable, checkable tree: weeks → steps →
  sub-steps (topics, hands-on tasks, checkpoints), each with inline hints and
  supporting points from the plan.
- 📈 Progress visualization per track: overall %, per-week and per-domain
  breakdowns weighted by the official exam domain weights.
- 🚦 A readiness bar per track that lights up automatically as you complete
  the relevant work — a clear "am I ready to book the exam?" signal.
- 🧪 A **Skill Check** tab per track: per-step multiple-choice quizzes plus
  command drills verified locally with regex patterns (no cluster or backend
  needed), so students can validate their knowledge before ticking a step
  off. The UI nudges this via the step hints and a pop-up when completing a
  step. Results are deliberately not persisted and not linked to progress
  tracking.
- 🗓️ Optional target exam date per track with countdown and pace indicator.
- 🔐 Google sign-in; progress syncs across devices via Firestore. Signed-out
  visitors can browse the whole plan read-only.
- 🌞/🌙 Light and dark mode, mobile-first, keyboard navigable.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Auth | Firebase Authentication (Google sign-in only) |
| Database | Cloud Firestore (one document per user) |
| Hosting | Firebase Hosting (SPA rewrite) |

### Data model

Plan content is identical for every user, so it ships with the app as typed,
static TypeScript structures (one directory per track under `src/data/`,
assembled by the track registry [src/data/tracks.ts](src/data/tracks.ts)) —
it is **not** stored in Firestore. Firestore holds only per-user state, one
document per user to keep reads cheap:

```
users/{uid} = {
  displayName, email, photoURL,
  completedIds: { [subStepId]: true },  // completed sub-step ids, ALL tracks
  examDate: string | null,              // legacy CKA field, kept in sync
  examDates: { cka?, ckad? },           // target exam date per track
  createdAt, updatedAt
}
```

Sub-step ids are globally unique across tracks (CKAD ids carry a `ckad-`
prefix), so one `completedIds` map serves every track. Step/week/domain
completion is derived client-side from `completedIds`.
Checkbox writes rely on the Firestore SDK's latency compensation, so ticking a
box updates the UI instantly while the write completes in the background.

There is also a single public `stats/global = { studiers: number }` document
backing the anonymous "N people are studying this plan" counter. It is
incremented exactly once per new user and exposes no individual data.

Security rules ([firestore.rules](firestore.rules)) allow each user to read and
write **only** their own `users/{uid}` document; everything else is denied.

## Setup

### 1. Create the Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com/) and
   **Add project** (any name, Analytics optional).
2. **Enable Google sign-in:** Build → Authentication → Get started →
   Sign-in method → add **Google** → enable → save.
3. **Enable Firestore:** Build → Firestore Database → Create database →
   production mode → pick a region.
4. **Register a web app:** Project settings (gear icon) → General →
   Your apps → Web (`</>`) → register. Copy the `firebaseConfig` values shown.

### 2. Configure and run locally

```bash
# install dependencies
npm install

# create your env file and paste in the values from step 4 above
cp .env.example .env

# run the dev server
npm run dev
```

Open the printed URL (default `http://localhost:5173`). Without a `.env` the
app still runs in read-only mode, which is handy for UI work.

> **Note:** for Google sign-in to work locally, `localhost` must be in
> Authentication → Settings → Authorized domains (it is by default).

> **Production config:** the live project's Firebase **web** config is
> committed in `.env.production` and picked up automatically by
> `npm run build`, so deploys work without any local setup. Those values are
> public by design (they ship in the client bundle) — **not** secrets. A
> local `.env` (gitignored) still overrides them for development. The Admin
> SDK service-account key is a separate, real secret and must never be
> committed (see `serviceAccountKey.example.json`).

### 3. Deploy to Firebase Hosting

```bash
# one-time: install the CLI and sign in
npm install -g firebase-tools
firebase login

# one-time: point this directory at your project (creates .firebaserc)
firebase use --add   # select your project, alias e.g. "default"

# build and deploy hosting + security rules
npm run build
firebase deploy --only hosting,firestore:rules
```

Your app is then live at `https://<project-id>.web.app`. Add that domain under
Authentication → Settings → Authorized domains if it isn't already.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check (`tsc`) then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Type-check only |

## Project structure

```
src/
  data/tracks.ts        # track registry: assembles every certification track
  data/cka/plan.ts      # CKA study plan as typed static data
  data/cka/validation.ts    # CKA skill checks: MCQs + regex-verified drills
  data/ckad/plan.ts     # CKAD study plan as typed static data
  data/ckad/validation.ts   # CKAD skill checks
  types.ts              # shared types (tracks, plan structure, user doc)
  utils/progress.ts     # derived progress: per-week/domain %, readiness, pace
  utils/routing.ts      # tiny path router (/, /cka, /ckad, .../skill-check)
  utils/seo.ts          # per-route title/description/canonical
  lib/firebase.ts       # Firebase init from env vars (optional at dev time)
  context/AuthContext.tsx
  hooks/useProgress.ts  # users/{uid} sync with optimistic checkbox writes
  hooks/useStudierCount.ts
  hooks/useTheme.ts     # light/dark toggle persisted to localStorage
  components/           # Header, landing page, dashboard cards, plan tree
firestore.rules         # per-user isolation + anonymous counter rules
firebase.json           # Hosting config with SPA rewrite
.env.example            # Firebase web config keys the app expects
```

## Contributing

Plan content lives entirely under `src/data/<track>/`. Every step and
sub-step has a stable, unique id — **never change existing ids**, since they
are the keys under which users' completed work is stored (and ids must stay
unique across all tracks — new tracks should prefix theirs, like `ckad-`).
Adding new sub-steps with new ids is safe.

Adding a whole new certification track means: a new `src/data/<track>/`
directory (plan + validation), one entry in `TRACKS` in
[src/data/tracks.ts](src/data/tracks.ts), the track id in
`src/utils/routing.ts` and `src/types.ts`, plus sitemap/firebase-header
entries — no component changes.
