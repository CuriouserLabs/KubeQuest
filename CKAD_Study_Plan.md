# CKAD Study Plan (Certified Kubernetes Application Developer)

A realistic, part-time plan for busy developers. It is built around the most common
starting point: comfortable writing and debugging applications, some Docker and
YAML, but limited hands-on Kubernetes fluency. Unlike the CKA, the CKAD never asks
you to build or repair clusters — everything happens inside a running cluster, from
an application developer's seat.

Target pace: about 6 hours per week over 6 weeks (roughly 35 to 40 hours total).
Go harder and you can compress to 4 weeks; spread thinner and extend to 8. The
week boundaries matter less than finishing every hands-on checkpoint.

The typed source of truth for the app is `src/data/ckad/plan.ts` — this document
summarises the same content.

---

## Exam facts to plan around

- Format: hands-on, performance-based. Roughly 15 to 20 tasks solved from a live
  command line in real clusters. No multiple choice.
- Time: 2 hours. Pass mark: 66%. Partial credit applies, so never leave a task blank.
- Widely considered the most time-pressured Kubernetes exam — speed matters as much
  as knowledge.
- Open book, but only kubernetes.io/docs, kubernetes.io/blog and the Helm docs, in
  one extra browser tab. Practising fast doc navigation is a real skill.
- Version: tracks the current Kubernetes release (around v1.35 as of now, updated
  quarterly). Study the current version, not older tutorials.
- Registration includes one free retake and two Killer.sh simulator sessions.
- Validity: 2 years.

### Domain weights (build your time around these)

| Domain | Weight | Priority |
|---|---|---|
| Application Environment, Configuration & Security | 25% | Highest. ConfigMaps, Secrets, resources, SecurityContexts, ServiceAccounts, RBAC basics. |
| Application Design & Build | 20% | High. Pods, multi-container patterns, Jobs/CronJobs, volumes. |
| Application Deployment | 20% | High. Rolling updates, blue/green & canary, Helm, Kustomize. |
| Services & Networking | 20% | High. Services, Ingress, NetworkPolicies. |
| Application Observability & Maintenance | 15% | Medium. Probes, logs, events, kubectl top, API deprecations. |

---

## One-time setup (do before Week 1, about 1 hour)

- Try killercoda.com and run one interactive CKAD scenario. Free, in-browser,
  zero setup — your drill ground for the whole plan.
- Stand up a local cluster with kind, minikube or k3d. Single-node is enough for
  every CKAD topic. Install helm locally too.
- Optional: KodeKloud "CKAD with Practice Tests" (Mumshad Mannambeth) for guided labs.
- Build your speed environment and use it from day one:
  - `alias k=kubectl`
  - `export do="--dry-run=client -o yaml"` and `export now="--force --grace-period=0"`
  - Tab completion on the alias.
  - `kubectl config use-context <name>` and
    `kubectl config set-context --current --namespace=<ns>` as reflexes.
  - Scaffold YAML with `kubectl explain` and `kubectl create ... $do`.
  - Get quick at editing YAML in vim (visual-block indent, `set paste`,
    `set ts=2 sw=2 et`).

---

## Week 1 — Pods, workloads & multi-container design (Design & Build, 20%)

- Pod anatomy: containers, image, `command` vs `args`, env, labels.
- Drill: create pods and deployments imperatively in under 60 seconds each.
- Init containers: ordering and failure behaviour.
- Sidecar containers, including native sidecars (init containers with
  `restartPolicy: Always`).
- Share an emptyDir volume between two containers in one pod.
- Jobs: completions, parallelism, backoffLimit, restartPolicy (`Never`/`OnFailure`).
- CronJobs: schedule syntax, history limits, manual runs with
  `kubectl create job --from=cronjob/<name>`.
- Checkpoint: build a two-container pod sharing a volume, plus a CronJob — from
  scratch, without looking anything up.

## Week 2 — Environment, configuration & security (25%)

- ConfigMaps: create imperatively; inject as env, envFrom, and volumes.
- Secrets: generic secrets, env and volume injection, base64 handling.
- Resource requests and limits; ResourceQuotas and LimitRanges.
- SecurityContext: runAsUser, runAsNonRoot, capabilities, readOnlyRootFilesystem;
  pod vs container level.
- ServiceAccounts: create and attach to pods; automountServiceAccountToken.
- RBAC basics: Roles, RoleBindings, verification with `kubectl auth can-i`.
- Volumes: emptyDir vs PersistentVolumeClaims; mount a PVC into a pod.
- Checkpoint: deploy an app with ConfigMap + Secret config, resource limits, a
  non-root securityContext, and a PVC — without notes.

## Week 3 — Application deployment (20%)

- Rolling updates: `kubectl set image`, rollout status/history/undo,
  maxSurge and maxUnavailable.
- Blue/green and canary patterns composed from Deployments, labels and Services.
- Helm as a consumer: repo add, install, upgrade, rollback, uninstall;
  `helm show values`, `--set` vs `-f`, `helm template`.
- Kustomize: kustomization.yaml (resources, patches, images), `kubectl apply -k`.
- Checkpoint: run a canary next to a stable Deployment, shift traffic, then
  promote or roll back — end to end.

## Week 4 — Services & networking (20%)

- Service types (ClusterIP, NodePort), endpoints, `kubectl expose`,
  port vs targetPort.
- Service DNS names, including cross-namespace (`svc.ns` /
  `svc.ns.svc.cluster.local`).
- Ingress: host and path rules, pathType, backends (CKAD expects you to write one).
- NetworkPolicies: read existing policies and write new ones
  (default-deny + targeted allow; podSelector vs namespaceSelector).
- Checkpoint: expose an app end to end — Service + Ingress + a NetworkPolicy
  allowing exactly what is needed — verified with curl.

## Week 5 — Observability & maintenance (15%)

- Probes: httpGet/exec/tcpSocket; liveness vs readiness vs startup;
  initialDelaySeconds, periodSeconds, failureThreshold.
- Diagnose restart loops and missing endpoints caused by bad probes.
- kubectl logs (multi-container `-c`, `--previous`), exec, port-forward.
- Triage CrashLoopBackOff, ImagePullBackOff and Pending with describe + events.
- kubectl top pods/nodes.
- API deprecations: fix manifests using removed apiVersions
  (kubectl explain / api-resources).
- Checkpoint: fix a deliberately broken app — bad probe, bad image, missing
  config — under a timer.

## Week 6 — Simulation, polish — then book it

- Killer.sh attempt 1. Expect it to feel brutal; the fumble list is your syllabus.
- Re-drill every domain you fumbled — especially the 25% environment domain.
- Run full killercoda CKAD sets against a 2-hour clock; practise flag-and-move-on.
- Killer.sh attempt 2 — finish comfortably within time.
- Tighten doc bookmarks (probes, ConfigMaps/Secrets, SecurityContext, Ingress,
  NetworkPolicy, Jobs/CronJobs).
- Book the exam once you hit the readiness bar.

---

## Highest-yield tasks to over-practise

These show up in some form again and again. Check each off only when it is reflex:

1. Two-container pod sharing an emptyDir (sidecar pattern).
2. Job and CronJob from scratch, including a manual run.
3. ConfigMap + Secret wired into a pod as env and as volumes.
4. Harden a pod: non-root UID, dropped capabilities.
5. Add liveness + readiness probes to an existing Deployment.
6. Set image, watch the rollout, roll back to a previous revision.
7. helm install and upgrade a chart with a custom value.
8. Ingress routing a host/path to a Service.
9. NetworkPolicy allowing one tier to reach another, verified.

## Readiness bar (book the exam when all are true)

- You can build a multi-container pod and a CronJob from memory.
- You can wire config, secrets, resources and a securityContext without notes.
- Rollouts, Helm and Kustomize hold no surprises.
- You can expose and isolate an app (Service, Ingress, NetworkPolicy) and verify it.
- You can debug a broken app fast (probes, logs, events).
- You finished a Killer.sh session in time and passed comfortably.
- Your speed aliases and namespace switching are automatic.

## Resources (keep it minimal)

- KodeKloud — CKAD with Practice Tests (best hands-on labs).
- Killer.sh (two sessions free with registration — Week 6).
- killercoda.com (free interactive CKAD scenarios for daily drills).
- dgkanatsios/CKAD-exercises on GitHub (the classic free exercise set).
- kubernetes.io/docs (practise navigating it — your main exam reference).

Do not collect more than this — depth of repetition on a real cluster beats
breadth of materials for a hands-on exam.
