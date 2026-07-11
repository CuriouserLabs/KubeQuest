# ☸️ KubeQuest — CKA Study Plan Tracker

A community web app for following and tracking progress through a realistic,
part-time **CKA (Certified Kubernetes Administrator)** study plan
(see [CKA_Study_Plan.md](CKA_Study_Plan.md), the single source of truth for
all plan content).

- 🗺️ The full plan as an expandable, checkable tree: weeks → steps → sub-steps
  (topics, hands-on tasks, checkpoints), each with inline hints and supporting
  points from the plan.
- 📈 Progress visualization: overall %, per-week and per-domain breakdowns
  weighted by the official exam domain weights (Troubleshooting 30%,
  Cluster Architecture 25%, Networking 20%, Workloads 15%, Storage 10%).
- 🚦 A readiness bar that lights up automatically as you complete the relevant
  work — a clear "am I ready to book the exam?" signal.
- 🧪 A **Skill Check** tab: per-step multiple-choice quizzes plus command
  drills verified locally with regex patterns (no cluster or backend needed),
  so students can validate their knowledge before ticking a step off. The UI
  nudges this via the step hints and a pop-up when completing a step. Results
  are deliberately not persisted and not linked to progress tracking.
- 🗓️ Optional target exam date with countdown and pace indicator.
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

Plan content is identical for every user, so it ships with the app as a typed,
static TypeScript structure ([src/data/plan.ts](src/data/plan.ts)) — it is
**not** stored in Firestore. Firestore holds only per-user state, one document
per user to keep reads cheap:

```
users/{uid} = {
  displayName, email, photoURL,
  completedIds: { [subStepId]: true },  // map of completed sub-step ids
  examDate: string | null,
  createdAt, updatedAt
}
```

Step/week/domain completion is derived client-side from `completedIds`.
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
  data/plan.ts          # the study plan as typed static data (source of truth)
  data/validation.ts    # per-step skill checks: MCQs + regex-verified drills
  types.ts              # shared types (plan structure, Firestore user doc)
  utils/progress.ts     # derived progress: per-week/domain %, readiness, pace
  utils/routing.ts      # tiny hash router (#/ plan, #/skill-check)
  lib/firebase.ts       # Firebase init from env vars (optional at dev time)
  context/AuthContext.tsx
  hooks/useProgress.ts  # users/{uid} sync with optimistic checkbox writes
  hooks/useStudierCount.ts
  hooks/useTheme.ts     # light/dark toggle persisted to localStorage
  components/           # Header, dashboard cards, plan tree, background art
firestore.rules         # per-user isolation + anonymous counter rules
firebase.json           # Hosting config with SPA rewrite
.env.example            # Firebase web config keys the app expects
```

## Contributing

The plan content lives entirely in `src/data/plan.ts`. Every step and sub-step
has a stable, unique id — **never change existing ids**, since they are the
keys under which users' completed work is stored. Adding new sub-steps with
new ids is safe.
