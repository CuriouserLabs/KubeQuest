import type {
  DomainInfo,
  ExamFact,
  ReadinessCriterion,
  Resource,
  Week,
} from "../../types";

/**
 * The CKAD study plan as a typed, static data structure — the single source
 * of truth for all CKAD plan content (summarised in CKAD_Study_Plan.md).
 *
 * Sub-step ids are Firestore map keys under users/{uid}.completedIds and are
 * shared with the CKA track's ids in the same map, so every id here carries
 * the `ckad-` prefix and must never be renamed once shipped.
 */

export const DOMAINS: DomainInfo[] = [
  {
    id: "app-environment",
    label: "Application Environment, Configuration & Security",
    shortLabel: "Environment",
    weight: 25,
    emoji: "🔐",
    barClass: "bg-rose-500",
    chipClass:
      "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300",
  },
  {
    id: "app-design",
    label: "Application Design & Build",
    shortLabel: "Design & Build",
    weight: 20,
    emoji: "🧩",
    barClass: "bg-amber-500",
    chipClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  },
  {
    id: "app-deployment",
    label: "Application Deployment",
    shortLabel: "Deployment",
    weight: 20,
    emoji: "🚀",
    barClass: "bg-kube-500",
    chipClass:
      "bg-kube-100 text-kube-800 dark:bg-kube-500/20 dark:text-kube-300",
  },
  {
    id: "networking",
    label: "Services & Networking",
    shortLabel: "Networking",
    weight: 20,
    emoji: "🕸️",
    barClass: "bg-violet-500",
    chipClass:
      "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300",
  },
  {
    id: "observability",
    label: "Application Observability & Maintenance",
    shortLabel: "Observability",
    weight: 15,
    emoji: "🔭",
    barClass: "bg-emerald-500",
    chipClass:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  {
    id: "craft",
    label: "Exam craft & speed",
    shortLabel: "Exam craft",
    weight: 0,
    emoji: "⚡",
    barClass: "bg-slate-500",
    chipClass:
      "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  },
];

export const WEEKS: Week[] = [
  {
    id: "ckad-setup",
    badge: "Setup",
    title: "One-time setup — your practice environment",
    tagline:
      "Do this before Week 1. About 1 hour. CKAD needs no cluster administration, so a single-node cluster is enough.",
    domain: "craft",
    steps: [
      {
        id: "ckad-setup-cluster",
        title: "Get a cluster to practise on",
        hints: [
          "The exam is 100% hands-on: roughly 15 to 20 tasks solved from a live command line in real clusters. No multiple choice.",
          "Unlike the CKA, you never bootstrap or repair clusters on the CKAD — any working single-node cluster is a fine practice ground.",
        ],
        subSteps: [
          {
            id: "ckad-setup-killercoda",
            title: "Try killercoda.com — run one interactive CKAD scenario",
            kind: "task",
            domain: "craft",
            hints: [
              "Free, in-browser, zero setup. Perfect for daily drills.",
              "It has a dedicated CKAD scenario collection — bookmark it now, it is your drill ground for the whole plan.",
            ],
          },
          {
            id: "ckad-setup-local",
            title: "Stand up a local cluster (kind, minikube, or k3d)",
            kind: "task",
            domain: "craft",
            hints: [
              "Any of `kind`, `minikube` or `k3d` gives you a disposable cluster in minutes — single node is enough for every CKAD topic.",
              "Also install `helm` locally now; you will need it from Week 3.",
            ],
          },
          {
            id: "ckad-setup-kodekloud",
            title: "Optional: KodeKloud labs (if you buy the course)",
            kind: "topic",
            domain: "craft",
            hints: [
              "KodeKloud \"CKAD with Practice Tests\" (Mumshad Mannambeth) has the best guided in-browser labs.",
              "Keep resources minimal: depth of repetition on a real cluster beats breadth of materials for a hands-on exam.",
            ],
          },
        ],
      },
      {
        id: "ckad-setup-speed",
        title: "Build your speed environment (use it from day one)",
        hints: [
          "Set this up now and use it in every session so it becomes reflex before exam day.",
          "CKAD is widely considered the most time-pressured Kubernetes exam — speed is trained, not crammed.",
        ],
        subSteps: [
          {
            id: "ckad-setup-aliases",
            title: "Set up the k alias, $do / $now exports, and tab completion",
            kind: "task",
            domain: "craft",
            hints: [
              "`alias k=kubectl`",
              "`export do=\"--dry-run=client -o yaml\"` — generate manifests fast.",
              "`export now=\"--force --grace-period=0\"` — fast pod deletes.",
              "`source <(kubectl completion bash)` then `complete -F __start_kubectl k` for tab completion on the alias.",
            ],
          },
          {
            id: "ckad-setup-context",
            title:
              "Practise switching context and namespace at the start of every task",
            kind: "task",
            domain: "craft",
            hints: [
              "`kubectl config use-context <name>` before touching anything — wrong context silently loses points.",
              "CKAD tasks live in many namespaces: `kubectl config set-context --current --namespace=<ns>` beats typing `-n` twenty times.",
            ],
          },
          {
            id: "ckad-setup-scaffold",
            title: "Scaffold YAML with kubectl explain and create ... $do",
            kind: "task",
            domain: "craft",
            hints: [
              "Use `kubectl explain` and `kubectl create ... $do` to scaffold YAML instead of writing it by hand.",
              "On exam day, use the docs tab for exact manifest fields — do not memorise long YAML.",
            ],
          },
          {
            id: "ckad-setup-vim",
            title: "Get quick at editing YAML in vim (indent, copy, paste)",
            kind: "task",
            domain: "craft",
            hints: [
              "You will live in the terminal editor. Learn visual-block indenting (`V` + `>`), line copy (`yy`/`p`), and `:set paste` for clean pastes.",
              "Put `set ts=2 sw=2 et` in `~/.vimrc` so tabs never corrupt your YAML.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ckad-w1",
    badge: "Week 1",
    title: "Pods, workloads & multi-container design",
    tagline:
      "The building blocks: pod specs you can write in your sleep, plus the multi-container and batch patterns CKAD loves.",
    domain: "app-design",
    weightNote: "20% of the exam",
    steps: [
      {
        id: "ckad-w1-pods",
        title: "Pod specs inside and out",
        hints: [
          "Almost every CKAD task starts from a pod spec — fluency here buys time everywhere else.",
        ],
        subSteps: [
          {
            id: "ckad-w1-pod-anatomy",
            title:
              "Pod anatomy: containers, image, command vs args, env, labels",
            kind: "topic",
            domain: "app-design",
            hints: [
              "`command` overrides the image's ENTRYPOINT, `args` overrides CMD — a classic exam trap.",
              "Labels are the glue: Deployments, Services and NetworkPolicies all select pods by label.",
            ],
          },
          {
            id: "ckad-w1-imperative",
            title:
              "Drill: create pods and deployments imperatively in under 60 seconds",
            kind: "task",
            domain: "app-design",
            hints: [
              "`kubectl run web --image=nginx $do` for a pod; `kubectl create deployment web --image=nginx --replicas=3 $do` for a Deployment.",
              "Time yourself. The point is reflex, not correctness alone.",
            ],
          },
        ],
      },
      {
        id: "ckad-w1-multi",
        title: "Multi-container pod patterns",
        hints: [
          "Init containers and sidecars are CKAD's signature questions — expect at least one.",
        ],
        subSteps: [
          {
            id: "ckad-w1-init",
            title: "Init containers: ordering, failure behaviour",
            kind: "task",
            domain: "app-design",
            hints: [
              "Init containers run one at a time, each to completion, before app containers start — a pod stuck in `Init:0/1` points there.",
              "There is no imperative shortcut: scaffold the pod with `$do`, then add the `initContainers:` block by hand.",
            ],
          },
          {
            id: "ckad-w1-sidecar",
            title: "Sidecar containers (including native restartPolicy: Always sidecars)",
            kind: "task",
            domain: "app-design",
            hints: [
              "Classic sidecar: a second container in `containers:`. Native sidecar: an init container with `restartPolicy: Always` that keeps running alongside the app.",
              "Typical exam shape: a logging sidecar that tails a file the app writes.",
            ],
          },
          {
            id: "ckad-w1-shared-volume",
            title:
              "Share an emptyDir volume between two containers in one pod",
            kind: "task",
            domain: "app-design",
            hints: [
              "Declare the volume once under `spec.volumes`, then mount it in both containers with `volumeMounts`.",
              "`emptyDir: {}` lives and dies with the pod — it is the standard answer for container-to-container file sharing.",
            ],
          },
        ],
      },
      {
        id: "ckad-w1-jobs",
        title: "Jobs & CronJobs",
        hints: [
          "Batch workloads are pure CKAD territory — quick points if the field names are reflex.",
        ],
        subSteps: [
          {
            id: "ckad-w1-job",
            title: "Jobs: completions, parallelism, backoffLimit, restartPolicy",
            kind: "task",
            domain: "app-design",
            hints: [
              "`kubectl create job pi --image=perl $do -- perl -Mbignum=bpi -wle 'print bpi(200)'` scaffolds the YAML.",
              "Job pods need `restartPolicy: Never` or `OnFailure` — `Always` is invalid and a favourite exam gotcha.",
            ],
          },
          {
            id: "ckad-w1-cronjob",
            title: "CronJobs: schedule syntax, history limits, manual runs",
            kind: "task",
            domain: "app-design",
            hints: [
              "`kubectl create cronjob backup --image=busybox --schedule='*/5 * * * *' $do -- sh -c 'echo hi'`.",
              "Trigger one manually with `kubectl create job --from=cronjob/backup test-run` — a known exam task.",
            ],
          },
        ],
      },
      {
        id: "ckad-w1-checkpoint",
        title: "Week 1 checkpoint",
        hints: [
          "The week boundaries matter less than finishing every hands-on checkpoint.",
        ],
        subSteps: [
          {
            id: "ckad-w1-checkpoint-multi",
            title:
              "Build a two-container pod sharing a volume, plus a CronJob — from scratch, without looking anything up",
            kind: "checkpoint",
            domain: "app-design",
            hints: [
              "If you still need the docs for the volume/volumeMounts shape, repeat the drills before moving on.",
              "Partial credit applies on the exam, so never leave a task blank — but these basics should cost you zero thinking time.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ckad-w2",
    badge: "Week 2",
    title: "Environment, configuration & security",
    tagline:
      "The heaviest CKAD domain: ConfigMaps, Secrets, resources, SecurityContexts, ServiceAccounts and volumes.",
    domain: "app-environment",
    weightNote: "25% of the exam",
    steps: [
      {
        id: "ckad-w2-config",
        title: "ConfigMaps & Secrets",
        hints: [
          "Wiring config into pods is the single most common CKAD task shape — know every injection route.",
        ],
        subSteps: [
          {
            id: "ckad-w2-configmaps",
            title:
              "ConfigMaps: create imperatively, inject as env, envFrom, and volumes",
            kind: "task",
            domain: "app-environment",
            hints: [
              "`kubectl create configmap app-config --from-literal=MODE=prod --from-file=config.txt`.",
              "Three injection routes: single `valueFrom.configMapKeyRef`, whole-map `envFrom`, or a volume mount where each key becomes a file.",
            ],
          },
          {
            id: "ckad-w2-secrets",
            title: "Secrets: generic secrets, env and volume injection, base64",
            kind: "task",
            domain: "app-environment",
            hints: [
              "`kubectl create secret generic db-creds --from-literal=password=hunter2` — kubectl does the base64 for you.",
              "Reading one back: `kubectl get secret db-creds -o jsonpath='{.data.password}' | base64 -d`.",
            ],
          },
        ],
      },
      {
        id: "ckad-w2-resources",
        title: "Resources, quotas & limit ranges",
        hints: [],
        subSteps: [
          {
            id: "ckad-w2-requests",
            title: "Resource requests and limits on containers",
            kind: "task",
            domain: "app-environment",
            hints: [
              "Requests drive scheduling; limits drive throttling/OOM. A pod stuck Pending often just requests more than any node has.",
              "The block lives at `spec.containers[].resources.requests/limits` — write it from memory.",
            ],
          },
          {
            id: "ckad-w2-quota",
            title: "ResourceQuotas and LimitRanges in a namespace",
            kind: "topic",
            domain: "app-environment",
            hints: [
              "A ResourceQuota caps a namespace's total usage; a LimitRange sets per-container defaults and bounds.",
              "If a pod is rejected with a quota error, either the namespace is full or the pod is missing required requests/limits.",
            ],
          },
        ],
      },
      {
        id: "ckad-w2-security",
        title: "SecurityContexts, ServiceAccounts & API access",
        hints: [
          "Security fields are heavily tested in this domain — and they are pure YAML knowledge, so cheap to bank.",
        ],
        subSteps: [
          {
            id: "ckad-w2-securitycontext",
            title:
              "SecurityContext: runAsUser, runAsNonRoot, capabilities, readOnlyRootFilesystem",
            kind: "task",
            domain: "app-environment",
            hints: [
              "Pod-level `securityContext` applies to all containers; container-level overrides it. `capabilities` is container-level only.",
              "Know the difference cold: `runAsUser: 1000` sets the UID; `allowPrivilegeEscalation: false` and dropped capabilities harden it.",
            ],
          },
          {
            id: "ckad-w2-serviceaccount",
            title: "ServiceAccounts: create one and attach it to a pod",
            kind: "task",
            domain: "app-environment",
            hints: [
              "`kubectl create sa app-sa`, then `serviceAccountName: app-sa` in the pod spec.",
              "Set `automountServiceAccountToken: false` when a pod should not talk to the API — asked more often than you would expect.",
            ],
          },
          {
            id: "ckad-w2-rbac",
            title:
              "RBAC basics: Roles, RoleBindings, and kubectl auth can-i",
            kind: "task",
            domain: "app-environment",
            hints: [
              "`kubectl create role reader --verb=get,list --resource=pods` and `kubectl create rolebinding reader-sa --role=reader --serviceaccount=<ns>:app-sa`.",
              "Verify with `kubectl auth can-i list pods --as system:serviceaccount:<ns>:app-sa -n <ns>` — proving access is part of the task.",
            ],
          },
        ],
      },
      {
        id: "ckad-w2-volumes",
        title: "Volumes: ephemeral & persistent",
        hints: [],
        subSteps: [
          {
            id: "ckad-w2-emptydir",
            title: "Ephemeral volumes: emptyDir and when to use them",
            kind: "topic",
            domain: "app-design",
            hints: [
              "emptyDir is scratch space per pod — gone when the pod goes. You already used it for the Week 1 sidecar drill.",
            ],
          },
          {
            id: "ckad-w2-pvc",
            title:
              "PersistentVolumeClaims: create one and mount it into a pod",
            kind: "task",
            domain: "app-design",
            hints: [
              "CKAD focuses on the consumer side: write a PVC (storageClassName, accessModes, size) and mount it via `persistentVolumeClaim:` in the pod spec.",
              "With a StorageClass present, the PVC alone triggers dynamic provisioning — no manual PV needed.",
            ],
          },
        ],
      },
      {
        id: "ckad-w2-checkpoint",
        title: "Week 2 checkpoint",
        hints: [],
        subSteps: [
          {
            id: "ckad-w2-checkpoint-secure",
            title:
              "Deploy an app with ConfigMap + Secret config, resource limits, a non-root securityContext, and a PVC — without notes",
            kind: "checkpoint",
            domain: "app-environment",
            hints: [
              "\"Without notes\" is the bar. If you peeked, run it again tomorrow.",
              "This checkpoint covers the whole 25% domain in one exercise — it is readiness-bar material.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ckad-w3",
    badge: "Week 3",
    title: "Application deployment",
    tagline:
      "Rolling updates, blue/green and canary patterns, plus the two package tools: Helm and Kustomize.",
    domain: "app-deployment",
    weightNote: "20% of the exam",
    steps: [
      {
        id: "ckad-w3-rollouts",
        title: "Rolling updates, rollbacks & strategies",
        hints: [
          "Deployment mechanics are guaranteed marks — the commands must be one motion by the end of this week.",
        ],
        subSteps: [
          {
            id: "ckad-w3-rolling",
            title:
              "Rolling updates: set image, rollout status/history/undo, maxSurge & maxUnavailable",
            kind: "task",
            domain: "app-deployment",
            hints: [
              "`kubectl set image deployment/web app=nginx:1.27`, then `kubectl rollout status`, `history`, `undo [--to-revision=N]`.",
              "`strategy.rollingUpdate.maxSurge/maxUnavailable` control the wave size — know where they live and what they mean.",
            ],
          },
          {
            id: "ckad-w3-strategies",
            title:
              "Blue/green and canary deployments with labels and Services",
            kind: "task",
            domain: "app-deployment",
            hints: [
              "Blue/green: two Deployments, flip the Service's selector. Canary: two Deployments sharing a selector label, replica counts set the traffic split.",
              "There is no `kind: Canary` — the exam wants you to compose it from Deployments, labels and a Service.",
            ],
          },
        ],
      },
      {
        id: "ckad-w3-helm",
        title: "Helm: consume charts like a pro",
        hints: [
          "CKAD tests you as a chart consumer, not an author — install, upgrade, roll back, inspect.",
        ],
        subSteps: [
          {
            id: "ckad-w3-helm-use",
            title:
              "helm repo add / install / upgrade / rollback / uninstall",
            kind: "task",
            domain: "app-deployment",
            hints: [
              "The core loop: `helm repo add bitnami https://charts.bitnami.com/bitnami`, `helm install web bitnami/nginx`, `helm upgrade web bitnami/nginx --set replicaCount=3`, `helm rollback web 1`.",
              "`helm list -A` and `helm history <release>` tell you what is deployed where.",
            ],
          },
          {
            id: "ckad-w3-helm-inspect",
            title:
              "Inspect charts: helm show values, --set vs -f, helm template",
            kind: "task",
            domain: "app-deployment",
            hints: [
              "`helm show values <chart>` lists what you can override; `-f my-values.yaml` for many overrides, `--set key=value` for one-offs.",
              "`helm template` renders the manifests locally — handy for seeing what a chart will actually create.",
            ],
          },
        ],
      },
      {
        id: "ckad-w3-kustomize",
        title: "Kustomize: bases and overlays",
        hints: [],
        subSteps: [
          {
            id: "ckad-w3-kustomize-apply",
            title:
              "kustomization.yaml: resources, patches, images — applied with kubectl apply -k",
            kind: "task",
            domain: "app-deployment",
            hints: [
              "Kustomize is built into kubectl: `kubectl apply -k <dir>` and `kubectl kustomize <dir>` to preview.",
              "Know the big three fields: `resources:` (what to include), `patches:`, and `images:` (retag without editing manifests).",
            ],
          },
        ],
      },
      {
        id: "ckad-w3-checkpoint",
        title: "Week 3 checkpoint",
        hints: [],
        subSteps: [
          {
            id: "ckad-w3-checkpoint-canary",
            title:
              "Run a canary next to a stable Deployment, shift traffic, then promote or roll back — end to end",
            kind: "checkpoint",
            domain: "app-deployment",
            hints: [
              "Verify the split by curling the Service repeatedly and watching which pods answer.",
              "Finish by promoting the canary (scale + selector) or rolling it back cleanly — both directions matter.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ckad-w4",
    badge: "Week 4",
    title: "Services & networking",
    tagline:
      "Expose apps with Services and Ingress, and fence them in with NetworkPolicies.",
    domain: "networking",
    weightNote: "20% of the exam",
    steps: [
      {
        id: "ckad-w4-services",
        title: "Services & cluster DNS",
        hints: [],
        subSteps: [
          {
            id: "ckad-w4-service-types",
            title:
              "Service types (ClusterIP, NodePort), endpoints, kubectl expose",
            kind: "task",
            domain: "networking",
            hints: [
              "A Service with no endpoints almost always means a label-selector mismatch or no ready pods — check `kubectl get endpoints <svc>` first.",
              "`kubectl expose deployment web --port=80 --target-port=8080` creates the Service in one line.",
            ],
          },
          {
            id: "ckad-w4-dns",
            title:
              "Service DNS names, including across namespaces",
            kind: "task",
            domain: "networking",
            hints: [
              "Same namespace: `http://web`. Cross-namespace: `web.other-ns` or the full `web.other-ns.svc.cluster.local`.",
              "Test from inside: `kubectl run tmp --image=busybox:1.36 --rm -it -- wget -qO- http://web.other-ns`.",
            ],
          },
        ],
      },
      {
        id: "ckad-w4-ingress",
        title: "Ingress",
        hints: [
          "Unlike the CKA, CKAD expects you to write an Ingress, not just know where the docs are.",
        ],
        subSteps: [
          {
            id: "ckad-w4-ingress-route",
            title:
              "Write an Ingress with host and path rules routing to Services",
            kind: "task",
            domain: "networking",
            hints: [
              "`kubectl create ingress web --rule='shop.example.com/cart*=cart-svc:80' $do` scaffolds most of it.",
              "Know `pathType: Prefix` vs `Exact`, and that the backend is always a Service name + port.",
            ],
          },
        ],
      },
      {
        id: "ckad-w4-netpol",
        title: "NetworkPolicies",
        hints: [
          "CKAD asks you to both read existing policies and write new ones — practise both directions.",
        ],
        subSteps: [
          {
            id: "ckad-w4-netpol-read",
            title:
              "Read a NetworkPolicy: which traffic does it allow, and for whom?",
            kind: "task",
            domain: "networking",
            hints: [
              "Read it in three steps: whose pods (`podSelector`), which directions (`policyTypes`), what is allowed (`ingress`/`egress` rules).",
              "Watch the difference between `podSelector`, `namespaceSelector`, and both combined in one `from:` entry.",
            ],
          },
          {
            id: "ckad-w4-netpol-write",
            title:
              "Write a policy allowing only one app tier to reach another",
            kind: "task",
            domain: "networking",
            hints: [
              "The standard exam pattern: default-deny for the namespace, then an allow from `app=frontend` to `app=backend` on one port.",
              "Copy the shape from the kubernetes.io docs — this page is worth a bookmark for exam day.",
            ],
          },
        ],
      },
      {
        id: "ckad-w4-checkpoint",
        title: "Week 4 checkpoint",
        hints: [],
        subSteps: [
          {
            id: "ckad-w4-checkpoint-expose",
            title:
              "Expose an app end to end: Service + Ingress + a NetworkPolicy allowing exactly what is needed — verified with curl",
            kind: "checkpoint",
            domain: "networking",
            hints: [
              "Verification matters: prove the allowed path works and a blocked path fails, from inside the cluster.",
              "This checkpoint is a readiness-bar line for booking the exam.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ckad-w5",
    badge: "Week 5",
    title: "Observability & maintenance",
    tagline:
      "Probes, logs, events and metrics — plus staying calm when the manifest uses a dead API version.",
    domain: "observability",
    weightNote: "15% of the exam",
    steps: [
      {
        id: "ckad-w5-probes",
        title: "Liveness, readiness & startup probes",
        hints: [
          "Probes are the most reliably recurring CKAD question — the YAML shape must be reflex.",
        ],
        subSteps: [
          {
            id: "ckad-w5-liveness",
            title:
              "Configure httpGet, exec and tcpSocket probes with timings",
            kind: "task",
            domain: "observability",
            hints: [
              "Know all three probe mechanisms and the timing knobs: `initialDelaySeconds`, `periodSeconds`, `failureThreshold`.",
              "Liveness failure restarts the container; readiness failure only pulls the pod out of Service endpoints — that difference is the exam question.",
            ],
          },
          {
            id: "ckad-w5-probe-debug",
            title:
              "Diagnose restart loops and missing endpoints caused by bad probes",
            kind: "task",
            domain: "observability",
            hints: [
              "`kubectl describe pod` shows probe failures in Events; a wrong port or path is the usual culprit.",
              "A Deployment that is \"running but unreachable\" often has a failing readiness probe — check endpoints.",
            ],
          },
        ],
      },
      {
        id: "ckad-w5-debug",
        title: "Debugging: logs, events, exec, metrics",
        hints: [],
        subSteps: [
          {
            id: "ckad-w5-logs",
            title:
              "kubectl logs (multi-container -c, --previous), exec, port-forward",
            kind: "task",
            domain: "observability",
            hints: [
              "In multi-container pods `-c <container>` is mandatory — and `--previous` shows the crashed container's last words.",
              "`kubectl exec -it <pod> -- sh` and `kubectl port-forward` are your inspect-from-inside and inspect-from-outside tools.",
            ],
          },
          {
            id: "ckad-w5-events",
            title:
              "Triage CrashLoopBackOff, ImagePullBackOff and Pending with describe + events",
            kind: "task",
            domain: "observability",
            hints: [
              "`kubectl describe pod` first — Events at the bottom name the problem most of the time.",
              "CrashLoopBackOff → logs. Pending → resources or unbound PVC. ImagePullBackOff → image name/tag or registry access.",
            ],
          },
          {
            id: "ckad-w5-top",
            title: "kubectl top pods/nodes for resource usage",
            kind: "task",
            domain: "observability",
            hints: [
              "`kubectl top pod --containers -n <ns>` — needs metrics-server, which the exam clusters have.",
              "Typical task: \"find the pod using the most CPU and label it\" — one command plus one label.",
            ],
          },
        ],
      },
      {
        id: "ckad-w5-deprecations",
        title: "API deprecations",
        hints: [],
        subSteps: [
          {
            id: "ckad-w5-api-versions",
            title:
              "Fix manifests that use removed apiVersions",
            kind: "topic",
            domain: "observability",
            hints: [
              "`kubectl explain <kind>` and `kubectl api-resources` show the current group/version for any kind.",
              "Classic example: Ingress moved from `extensions/v1beta1` to `networking.k8s.io/v1` — the exam hands you the old YAML and expects the fix.",
            ],
          },
        ],
      },
      {
        id: "ckad-w5-checkpoint",
        title: "Week 5 checkpoint",
        hints: [],
        subSteps: [
          {
            id: "ckad-w5-checkpoint-fix",
            title:
              "Fix a deliberately broken app — bad probe, bad image, missing config — under a timer",
            kind: "checkpoint",
            domain: "observability",
            hints: [
              "killercoda has ready-made broken-app scenarios — give yourself a time budget per fix and hold to it.",
              "The skill is triage order: describe → events → logs → config, without dithering.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ckad-w6",
    badge: "Week 6",
    title: "Simulation, polish — then book it",
    tagline:
      "Stop learning topics, start rehearsing the exam. Prove the readiness bar and book it.",
    domain: "craft",
    steps: [
      {
        id: "ckad-w6-sim",
        title: "Simulate the real thing",
        hints: [
          "Your exam registration includes two Killer.sh simulator sessions and one free retake.",
        ],
        subSteps: [
          {
            id: "ckad-w6-killer1",
            title: "Killer.sh CKAD attempt 1",
            kind: "task",
            domain: "craft",
            hints: [
              "Expect it to feel brutal — it is deliberately harder than the real exam.",
              "The score matters less than the list of things you fumbled. That list is your syllabus for the rest of the plan.",
            ],
          },
          {
            id: "ckad-w6-redrill",
            title:
              "Re-drill every domain you fumbled — especially the 25% environment/config/security domain",
            kind: "task",
            domain: "app-environment",
            hints: [
              "Weak spots in the heaviest domain cost the most. Re-run the Week 2 checkpoint until it is clean.",
            ],
          },
          {
            id: "ckad-w6-timed",
            title:
              "Run full killercoda CKAD sets against a 2-hour clock",
            kind: "task",
            domain: "craft",
            hints: [
              "The exam is 2 hours with a 66% pass mark. Build the stamina to stay sharp for the whole window.",
              "Practise the flag-and-move-on discipline: partial credit means breadth beats getting stuck on one task.",
            ],
          },
        ],
      },
      {
        id: "ckad-w6-final",
        title: "Final rehearsal",
        hints: [
          "Exam-day plan for the first 2 minutes: set up `alias k`, `$do`, `$now` and completion; read every task's context and namespace before touching anything.",
        ],
        subSteps: [
          {
            id: "ckad-w6-killer2",
            title:
              "Killer.sh CKAD attempt 2 — finish comfortably within time",
            kind: "task",
            domain: "craft",
            hints: [
              "This is your readiness proof: finished within the time limit and passed comfortably.",
              "Killer.sh reuses the same scenarios per session window — a much better second score should come from speed, not memory.",
            ],
          },
          {
            id: "ckad-w6-bookmarks",
            title:
              "Tighten doc bookmarks so you can jump to the right page in seconds",
            kind: "task",
            domain: "craft",
            hints: [
              "kubernetes.io/docs and blog plus the Helm docs are your allowed references, in one extra browser tab.",
              "Good candidates: probes, ConfigMaps/Secrets, SecurityContext, Ingress, NetworkPolicy, Jobs/CronJobs.",
            ],
          },
        ],
      },
      {
        id: "ckad-w6-book",
        title: "Book the exam",
        hints: [],
        subSteps: [
          {
            id: "ckad-w6-book-exam",
            title: "Book the exam once you hit the readiness bar",
            kind: "checkpoint",
            domain: "craft",
            hints: [
              "The readiness panel above tracks every criterion — book when they are all lit, not before, not long after.",
              "The certification is valid for 2 years, and your fee includes one free retake if it goes sideways.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ckad-hy",
    badge: "Drills",
    title: "Highest-yield tasks to over-practise",
    tagline:
      "These show up in some form again and again. Check each one off only when it is reflex.",
    domain: "app-environment",
    steps: [
      {
        id: "ckad-hy-drills",
        title: "Make these nine reflex",
        hints: [
          "Revisit this list every week — over-practising these is the best marks-per-hour investment in the whole plan.",
        ],
        subSteps: [
          {
            id: "ckad-hy-multipod",
            title:
              "Two-container pod sharing an emptyDir (sidecar pattern)",
            kind: "task",
            domain: "app-design",
            hints: [
              "One `volumes:` entry, two `volumeMounts:`. Scaffold the pod with `$do`, add the second container by hand.",
            ],
          },
          {
            id: "ckad-hy-cronjob",
            title: "Job and CronJob from scratch, including a manual run",
            kind: "task",
            domain: "app-design",
            hints: [
              "`kubectl create cronjob ... $do`, then `kubectl create job --from=cronjob/<name> manual-1`.",
            ],
          },
          {
            id: "ckad-hy-config",
            title:
              "ConfigMap + Secret wired into a pod as env and as volumes",
            kind: "task",
            domain: "app-environment",
            hints: [
              "All four routes in one pod: `envFrom`, `valueFrom`, ConfigMap volume, Secret volume — five minutes, no docs.",
            ],
          },
          {
            id: "ckad-hy-securitycontext",
            title: "Harden a pod: non-root UID, dropped capabilities",
            kind: "task",
            domain: "app-environment",
            hints: [
              "`runAsUser` + `runAsNonRoot: true` at pod level; `capabilities.drop: [\"ALL\"]` at container level.",
            ],
          },
          {
            id: "ckad-hy-probes",
            title:
              "Add liveness + readiness probes to an existing Deployment",
            kind: "task",
            domain: "observability",
            hints: [
              "`kubectl edit` or patch the YAML: httpGet path/port plus sensible `initialDelaySeconds`. Know why each probe type matters.",
            ],
          },
          {
            id: "ckad-hy-rollout",
            title:
              "Set image, watch the rollout, roll back to a previous revision",
            kind: "task",
            domain: "app-deployment",
            hints: [
              "`kubectl set image` → `rollout status` → `rollout undo --to-revision=N` — one motion.",
            ],
          },
          {
            id: "ckad-hy-helm",
            title:
              "helm install and upgrade a chart with a custom value",
            kind: "task",
            domain: "app-deployment",
            hints: [
              "`helm install web bitnami/nginx --set replicaCount=2`, then `helm upgrade` and `helm rollback`. Check with `helm list`.",
            ],
          },
          {
            id: "ckad-hy-ingress",
            title: "Ingress routing a host/path to a Service",
            kind: "task",
            domain: "networking",
            hints: [
              "`kubectl create ingress` with `--rule` scaffolds it; fix `pathType` and the backend port by hand.",
            ],
          },
          {
            id: "ckad-hy-netpol",
            title:
              "NetworkPolicy allowing one tier to reach another, verified",
            kind: "task",
            domain: "networking",
            hints: [
              "Default-deny plus a targeted allow, then prove it with `wget --timeout=2` from the right and wrong pods.",
            ],
          },
        ],
      },
    ],
  },
];

/** Readiness bar: book the exam when all are true. Each criterion lights up
 *  when its required sub-steps are complete. */
export const READINESS: ReadinessCriterion[] = [
  {
    id: "ckad-ready-workloads",
    title: "You can build a multi-container pod and a CronJob from memory",
    detail: "Complete the Week 1 patterns, its checkpoint, and both drills.",
    requiredIds: [
      "ckad-w1-sidecar",
      "ckad-w1-shared-volume",
      "ckad-w1-cronjob",
      "ckad-w1-checkpoint-multi",
      "ckad-hy-multipod",
      "ckad-hy-cronjob",
    ],
  },
  {
    id: "ckad-ready-config",
    title:
      "You can wire config, secrets, resources and a securityContext without notes",
    detail: "Complete the Week 2 work, its checkpoint, and both drills.",
    requiredIds: [
      "ckad-w2-configmaps",
      "ckad-w2-secrets",
      "ckad-w2-securitycontext",
      "ckad-w2-checkpoint-secure",
      "ckad-hy-config",
      "ckad-hy-securitycontext",
    ],
  },
  {
    id: "ckad-ready-deploy",
    title: "Rollouts, Helm and Kustomize hold no surprises",
    detail: "Complete the Week 3 work, its checkpoint, and both drills.",
    requiredIds: [
      "ckad-w3-rolling",
      "ckad-w3-helm-use",
      "ckad-w3-kustomize-apply",
      "ckad-w3-checkpoint-canary",
      "ckad-hy-rollout",
      "ckad-hy-helm",
    ],
  },
  {
    id: "ckad-ready-network",
    title:
      "You can expose and isolate an app (Service, Ingress, NetworkPolicy) and verify it",
    detail: "Complete the Week 4 checkpoint and both networking drills.",
    requiredIds: [
      "ckad-w4-checkpoint-expose",
      "ckad-hy-ingress",
      "ckad-hy-netpol",
    ],
  },
  {
    id: "ckad-ready-observe",
    title: "You can debug a broken app fast (probes, logs, events)",
    detail: "Complete the Week 5 probe work, its checkpoint, and the probes drill.",
    requiredIds: [
      "ckad-w5-probe-debug",
      "ckad-w5-checkpoint-fix",
      "ckad-hy-probes",
    ],
  },
  {
    id: "ckad-ready-killer",
    title: "You finished a Killer.sh session in time and passed comfortably",
    detail: "Complete both simulator attempts in Week 6.",
    requiredIds: ["ckad-w6-killer1", "ckad-w6-killer2"],
  },
  {
    id: "ckad-ready-speed",
    title: "Your speed aliases and namespace switching are automatic",
    detail: "Complete the speed setup and the Week 1 sixty-second drill.",
    requiredIds: [
      "ckad-setup-aliases",
      "ckad-setup-context",
      "ckad-setup-scaffold",
      "ckad-w1-imperative",
    ],
  },
];

/** Key exam facts, shown as chips on the dashboard. */
export const EXAM_FACTS: ExamFact[] = [
  { emoji: "⏱️", text: "2 hours, ~15–20 live tasks" },
  { emoji: "🎯", text: "66% to pass, partial credit" },
  { emoji: "📖", text: "Open book: kubernetes.io + Helm docs" },
  { emoji: "🔁", text: "Free retake + 2× Killer.sh" },
  { emoji: "🔄", text: "Tracks current k8s (~v1.35)" },
  { emoji: "🏅", text: "Valid 2 years" },
];

export const RESOURCES: Resource[] = [
  {
    name: "KodeKloud — CKAD with Practice Tests",
    url: "https://kodekloud.com/courses/certified-kubernetes-application-developer-ckad/",
    note: "Best hands-on labs (Mumshad Mannambeth).",
  },
  {
    name: "Killer.sh",
    url: "https://killer.sh/",
    note: "Official simulator; two sessions free with registration. Week 6.",
  },
  {
    name: "killercoda.com",
    url: "https://killercoda.com/",
    note: "Free interactive CKAD scenarios and a live playground for daily drills.",
  },
  {
    name: "dgkanatsios/CKAD-exercises",
    url: "https://github.com/dgkanatsios/CKAD-exercises",
    note: "The classic free exercise set, organised by exam domain.",
  },
  {
    name: "kubernetes.io/docs",
    url: "https://kubernetes.io/docs/",
    note: "Practise navigating it — your main exam reference.",
  },
];
