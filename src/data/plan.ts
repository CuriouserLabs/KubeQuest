import type {
  DomainId,
  DomainInfo,
  ReadinessCriterion,
  SubStep,
  SubStepKind,
  Week,
} from "../types";

/**
 * The CKA study plan as a typed, static data structure.
 *
 * This is the single source of truth for all plan content, parsed from
 * CKA_Study_Plan.md. Plan content is identical for every user, so it ships
 * with the app; Firestore stores only per-user completion state keyed by
 * the stable sub-step ids defined here.
 */

export const DOMAINS: DomainInfo[] = [
  {
    id: "troubleshooting",
    label: "Troubleshooting",
    shortLabel: "Troubleshoot",
    weight: 30,
    emoji: "🚨",
    barClass: "bg-rose-500",
    chipClass:
      "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300",
  },
  {
    id: "architecture",
    label: "Cluster Architecture, Installation & Configuration",
    shortLabel: "Architecture",
    weight: 25,
    emoji: "🏗️",
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
    chipClass:
      "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-300",
    barClass: "bg-violet-500",
  },
  {
    id: "workloads",
    label: "Workloads & Scheduling",
    shortLabel: "Workloads",
    weight: 15,
    emoji: "📦",
    barClass: "bg-amber-500",
    chipClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  },
  {
    id: "storage",
    label: "Storage",
    shortLabel: "Storage",
    weight: 10,
    emoji: "💾",
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

export const DOMAIN_MAP: Record<DomainId, DomainInfo> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
) as Record<DomainId, DomainInfo>;

export const KIND_META: Record<
  SubStepKind,
  { label: string; emoji: string; chipClass: string }
> = {
  topic: {
    label: "Topic",
    emoji: "📘",
    chipClass:
      "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
  },
  task: {
    label: "Hands-on",
    emoji: "🛠️",
    chipClass:
      "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
  },
  checkpoint: {
    label: "Checkpoint",
    emoji: "🏁",
    chipClass:
      "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
  },
};

export const WEEKS: Week[] = [
  {
    id: "setup",
    badge: "Setup",
    title: "One-time setup — your practice environment",
    tagline: "Do this before Week 1. About 1 hour. You need a real cluster, not just theory.",
    domain: "craft",
    steps: [
      {
        id: "setup-cluster",
        title: "Get a real cluster to practise on",
        hints: [
          "The exam is 100% hands-on: roughly 15 to 20 tasks solved from a live command line in a real cluster. No multiple choice.",
          "Single-node tools cannot fully cover kubeadm bootstrap and node troubleshooting, so plan for multi-node practice too.",
        ],
        subSteps: [
          {
            id: "setup-killercoda",
            title: "Try killercoda.com — run one interactive CKA scenario",
            kind: "task",
            domain: "craft",
            hints: [
              "Free, in-browser, zero setup. Perfect for daily drills.",
              "It also has broken-cluster scenarios you will lean on hard in Week 6 (Troubleshooting).",
            ],
          },
          {
            id: "setup-multinode",
            title: "Stand up a local multi-node cluster (kind, or two small VMs)",
            kind: "task",
            domain: "craft",
            hints: [
              "Use `kind`, or two small VMs via multipass, Vagrant, or two cheap cloud VMs.",
              "Multi-node is what lets you practise kubeadm cluster bootstrap and node troubleshooting for real.",
            ],
          },
          {
            id: "setup-kodekloud",
            title: "Optional: KodeKloud labs (if you buy the course)",
            kind: "topic",
            domain: "craft",
            hints: [
              "KodeKloud \"CKA with Practice Tests\" (Mumshad Mannambeth) has the best guided in-browser labs.",
              "Keep resources minimal: depth of repetition on a real cluster beats breadth of materials for a hands-on exam.",
            ],
          },
        ],
      },
      {
        id: "setup-speed",
        title: "Build your speed environment (use it from day one)",
        hints: [
          "Set this up now and use it in every session so it becomes reflex before exam day.",
          "Doing everything fast, under time pressure, is where most candidates fall short — speed is trained, not crammed.",
        ],
        subSteps: [
          {
            id: "setup-aliases",
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
            id: "setup-context",
            title: "Practise switching context at the start of every task",
            kind: "task",
            domain: "craft",
            hints: [
              "`kubectl config use-context <name>` before touching anything.",
              "Wrong context is a silent way to lose points on the exam — make the switch automatic.",
            ],
          },
          {
            id: "setup-scaffold",
            title: "Scaffold YAML with kubectl explain and create ... $do",
            kind: "task",
            domain: "craft",
            hints: [
              "Use `kubectl explain` and `kubectl create ... $do` to scaffold YAML instead of writing it by hand.",
              "On exam day, use the docs tab for exact manifest fields — do not memorise long YAML.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "w1",
    badge: "Week 1",
    title: "Core model + speed habits",
    tagline:
      "Lean on any Linux, Docker and YAML experience you have — the goal this week is fluency, not new theory.",
    domain: "workloads",
    steps: [
      {
        id: "w1-model",
        title: "Understand the Kubernetes core model",
        hints: [
          "If you already have strong Linux, Docker and YAML skills, do not over-study what you know — focus on what is Kubernetes-specific.",
        ],
        subSteps: [
          {
            id: "w1-architecture",
            title:
              "Architecture: control plane components, kubelet, kube-proxy, etcd",
            kind: "topic",
            domain: "architecture",
            hints: [
              "Know what each component does and where it runs — this map is the backbone of troubleshooting later.",
              "On kubeadm clusters the control plane runs as static pods from `/etc/kubernetes/manifests`; kubelet is a systemd service on every node.",
            ],
          },
          {
            id: "w1-objects",
            title:
              "Pods, ReplicaSets, Deployments, namespaces, labels, selectors",
            kind: "topic",
            domain: "workloads",
            hints: [
              "Labels and selectors are the glue: Services, Deployments and NetworkPolicies all match workloads by label.",
              "Always know which namespace you are in — `-n <ns>` mistakes are a classic silent point-loser.",
            ],
          },
        ],
      },
      {
        id: "w1-imperative",
        title: "Imperative kubectl fluency",
        hints: [
          "Roughly 15–20 tasks in 2 hours leaves only 6–8 minutes per task. Imperative commands are how you stay inside that budget.",
        ],
        subSteps: [
          {
            id: "w1-imperative-cmds",
            title: "Practise create, run, expose, scale, edit, delete",
            kind: "task",
            domain: "workloads",
            hints: [
              "`kubectl create deployment`, `kubectl run`, `kubectl expose`, `kubectl scale`, `kubectl edit` cover most scaffolding needs.",
              "Combine with `$do` to turn any imperative command into editable YAML.",
            ],
          },
          {
            id: "w1-drill",
            title:
              "Drill: recreate common objects imperatively in under 60 seconds each",
            kind: "task",
            domain: "craft",
            hints: [
              "Time yourself. The point is reflex, not correctness alone.",
              "This drill is also readiness-bar material: your aliases and muscle memory should end up automatic, not something you think about.",
            ],
          },
        ],
      },
      {
        id: "w1-checkpoint",
        title: "Week 1 checkpoint",
        hints: [
          "The week boundaries matter less than finishing every hands-on checkpoint.",
        ],
        subSteps: [
          {
            id: "w1-checkpoint-deploy",
            title:
              "Stand up a Deployment, expose it, scale it, and edit it — without looking anything up",
            kind: "checkpoint",
            domain: "workloads",
            hints: [
              "If you still need the docs for this, repeat the drills before moving on.",
              "Partial credit applies on the exam, so never leave a task blank — but these basics should cost you zero thinking time.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "w2",
    badge: "Week 2",
    title: "Cluster Architecture & Installation",
    tagline:
      "The most common genuine gap and the second-heaviest domain. kubeadm, certificates, upgrades, etcd.",
    domain: "architecture",
    weightNote: "25% of the exam",
    steps: [
      {
        id: "w2-bootstrap",
        title: "Bootstrap a cluster with kubeadm",
        hints: [
          "Bootstrapping and upgrading a cluster with kubeadm is on the \"grind\" list — limited hands-on cluster administration is exactly the gap this plan closes.",
        ],
        subSteps: [
          {
            id: "w2-kubeadm-init",
            title: "kubeadm init a control plane and join one worker node",
            kind: "task",
            domain: "architecture",
            hints: [
              "Use the multi-node environment from Setup — this cannot be practised on a single-node toy cluster.",
              "Understand the join-token flow: `kubeadm token create --print-join-command` regenerates it.",
            ],
          },
          {
            id: "w2-anatomy",
            title:
              "Know kubeconfig, certificate locations, and static pod manifests",
            kind: "topic",
            domain: "architecture",
            hints: [
              "Certificates live under `/etc/kubernetes/pki`; kubeconfigs under `/etc/kubernetes`.",
              "Static pod manifests live in `/etc/kubernetes/manifests` — kubelet runs them directly, no API server needed.",
              "A broken static pod manifest is a classic exam troubleshooting task — knowing this layout now pays off in Week 6.",
            ],
          },
        ],
      },
      {
        id: "w2-upgrade",
        title: "Cluster upgrade with kubeadm",
        hints: [
          "kubeadm cluster upgrade is one of the highest-yield tasks — it shows up in some form again and again.",
        ],
        subSteps: [
          {
            id: "w2-upgrade-run",
            title:
              "Run a full upgrade: upgrade plan, apply, drain, uncordon",
            kind: "task",
            domain: "architecture",
            hints: [
              "The rhythm: `kubeadm upgrade plan` → `kubeadm upgrade apply` on the control plane, then per node: drain → upgrade kubelet/kubectl → uncordon.",
              "The exam tracks the current Kubernetes release (about v1.35, updated quarterly) — practise against the current version, not old tutorials.",
            ],
          },
        ],
      },
      {
        id: "w2-etcd",
        title: "etcd backup and restore",
        hints: [
          "A classic, high-value exam task. Practise this until it is automatic — it is on the grind list, in the highest-yield list, and in the readiness bar.",
        ],
        subSteps: [
          {
            id: "w2-etcd-backup",
            title: "Take an etcd snapshot with etcdctl snapshot save",
            kind: "task",
            domain: "architecture",
            hints: [
              "You need the TLS flags: `--cacert`, `--cert`, `--key` — read their paths straight out of the etcd static pod manifest.",
              "Also know `--endpoints` and how to verify a snapshot with `etcdutl snapshot status`.",
            ],
          },
          {
            id: "w2-etcd-restore",
            title: "Restore etcd from a snapshot, end to end",
            kind: "task",
            domain: "architecture",
            hints: [
              "Restore into a new data directory, then point the etcd static pod's volume at it and let kubelet restart it.",
              "Do the whole loop — snapshot, wreck something, restore, verify — not just the restore command in isolation.",
            ],
          },
        ],
      },
      {
        id: "w2-checkpoint",
        title: "Week 2 checkpoint",
        hints: [],
        subSteps: [
          {
            id: "w2-checkpoint-etcd",
            title:
              "Back up etcd and restore it from a snapshot — without notes",
            kind: "checkpoint",
            domain: "architecture",
            hints: [
              "\"Without notes\" is the bar. If you peeked, run it again tomorrow.",
              "This exact skill is the first line of the readiness bar for booking the exam.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "w3",
    badge: "Week 3",
    title: "Workloads & Scheduling",
    tagline: "Deployments in motion, plus every way to control where pods land.",
    domain: "workloads",
    weightNote: "15% of the exam",
    steps: [
      {
        id: "w3-workloads",
        title: "Workload objects in motion",
        hints: [
          "Medium weight, but these objects appear inside tasks from every other domain — fluency here buys time everywhere.",
        ],
        subSteps: [
          {
            id: "w3-rolling",
            title: "Rolling updates and rollbacks",
            kind: "task",
            domain: "workloads",
            hints: [
              "`kubectl set image`, `kubectl rollout status`, `kubectl rollout undo` — practise the trio until it is one motion.",
              "Check `kubectl rollout history` to pick a revision to roll back to.",
            ],
          },
          {
            id: "w3-special",
            title: "DaemonSets, static pods, multi-container pods",
            kind: "topic",
            domain: "workloads",
            hints: [
              "Know how a static pod differs from a DaemonSet: kubelet runs static pods from `/etc/kubernetes/manifests` with no controller involved.",
              "Multi-container patterns (sidecar, init containers) show up in debugging tasks too.",
            ],
          },
        ],
      },
      {
        id: "w3-scheduling",
        title: "Scheduling: put pods exactly where you want them",
        hints: [
          "Scheduling questions are usually quick points if the mechanisms are reflex.",
        ],
        subSteps: [
          {
            id: "w3-nodeselect",
            title: "nodeSelector and node affinity / anti-affinity",
            kind: "task",
            domain: "workloads",
            hints: [
              "`nodeSelector` is the fast path; affinity is the expressive one. Know the YAML shape of both.",
              "Label a node first: `kubectl label node <node> disktype=ssd`.",
            ],
          },
          {
            id: "w3-taints",
            title: "Taints, tolerations, and cordon",
            kind: "task",
            domain: "workloads",
            hints: [
              "`kubectl taint nodes <node> key=value:NoSchedule` and the matching toleration block.",
              "`kubectl cordon` / `uncordon` also gate scheduling — you will reuse them in the kubeadm upgrade flow.",
            ],
          },
        ],
      },
      {
        id: "w3-config",
        title: "Configuration: ConfigMaps, Secrets, resources",
        hints: [],
        subSteps: [
          {
            id: "w3-configmaps",
            title: "ConfigMaps and Secrets, injected as env and as volumes",
            kind: "task",
            domain: "workloads",
            hints: [
              "`kubectl create configmap`/`secret generic` imperatively, then wire in via `envFrom`, `valueFrom`, or volume mounts.",
              "Remember Secrets are only base64-encoded — `echo <value> | base64 -d` to read one.",
            ],
          },
          {
            id: "w3-resources",
            title: "Resource requests and limits",
            kind: "task",
            domain: "workloads",
            hints: [
              "Requests drive scheduling; limits drive throttling/OOM. A pod stuck Pending often just requests more than any node has.",
            ],
          },
        ],
      },
      {
        id: "w3-checkpoint",
        title: "Week 3 checkpoint",
        hints: [],
        subSteps: [
          {
            id: "w3-checkpoint-node",
            title:
              "Force a pod onto a specific node three different ways",
            kind: "checkpoint",
            domain: "workloads",
            hints: [
              "Three ways: `nodeSelector`, node affinity, and taint+toleration (or the blunt `nodeName`).",
              "If you can do all three quickly, you own this domain's scheduling points.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "w4",
    badge: "Week 4",
    title: "Services & Networking",
    tagline:
      "Services, DNS, and NetworkPolicies — including the debugging instincts that pay off in Week 6.",
    domain: "networking",
    weightNote: "20% of the exam",
    steps: [
      {
        id: "w4-services",
        title: "Services and endpoints",
        hints: [
          "NetworkPolicies and cluster DNS debugging are on the grind list — general networking intuition helps, but the Kubernetes specifics need reps.",
        ],
        subSteps: [
          {
            id: "w4-service-types",
            title:
              "Service types (ClusterIP, NodePort), endpoints, kube-proxy basics",
            kind: "task",
            domain: "networking",
            hints: [
              "A Service with no endpoints almost always means a label-selector mismatch or no ready pods — check `kubectl get endpoints <svc>` first.",
              "`kubectl expose` creates a Service from a Deployment or pod in one line.",
            ],
          },
        ],
      },
      {
        id: "w4-dns",
        title: "Cluster DNS",
        hints: [],
        subSteps: [
          {
            id: "w4-dns-debug",
            title: "Resolve service names and debug CoreDNS",
            kind: "task",
            domain: "networking",
            hints: [
              "Test from inside: `kubectl run tmp --image=busybox:1.36 --rm -it -- nslookup <svc>.<ns>.svc.cluster.local`.",
              "CoreDNS runs as a Deployment in `kube-system` — its logs and its Service's endpoints are your first two checks.",
            ],
          },
        ],
      },
      {
        id: "w4-netpol",
        title: "NetworkPolicies",
        hints: [
          "NetworkPolicy (default-deny plus a targeted allow) is one of the highest-yield tasks — make it reflex.",
        ],
        subSteps: [
          {
            id: "w4-netpol-deny",
            title: "Write a default-deny policy for a namespace",
            kind: "task",
            domain: "networking",
            hints: [
              "An empty `podSelector: {}` with a `policyTypes` list denies all ingress (and/or egress) for every pod in the namespace.",
              "Copy the shape from the kubernetes.io docs — this page is worth a bookmark for exam day.",
            ],
          },
          {
            id: "w4-netpol-allow",
            title: "Layer targeted ingress/egress allows on top",
            kind: "task",
            domain: "networking",
            hints: [
              "Policies are additive: a default-deny plus a narrow allow is the standard exam pattern.",
              "Watch the difference between `podSelector`, `namespaceSelector`, and both combined in one `from:` entry.",
            ],
          },
        ],
      },
      {
        id: "w4-ingress",
        title: "Ingress and Gateway API",
        hints: [],
        subSteps: [
          {
            id: "w4-ingress-basics",
            title: "Ingress and Gateway API basics — know where the docs are",
            kind: "topic",
            domain: "networking",
            hints: [
              "You do not need to memorise these manifests; you need to find them fast. The Gateway API docs are an allowed exam reference alongside kubernetes.io.",
              "Practise fast doc navigation — it is a real, scored skill in an open-book exam with one extra tab.",
            ],
          },
        ],
      },
      {
        id: "w4-checkpoint",
        title: "Week 4 checkpoint",
        hints: [],
        subSteps: [
          {
            id: "w4-checkpoint-netpol",
            title:
              "Write a NetworkPolicy that isolates a pod — and verify it works",
            kind: "checkpoint",
            domain: "networking",
            hints: [
              "Verification matters: exec into another pod and prove traffic is blocked, then allowed after your targeted policy.",
              "This checkpoint is half of the \"NetworkPolicy and RBAC\" line in the readiness bar.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "w5",
    badge: "Week 5",
    title: "Storage + RBAC",
    tagline:
      "Storage is the lightest domain but easy points — do not skip. RBAC is a classic grind-list gap.",
    domain: "storage",
    weightNote: "10% of the exam (+ RBAC from the 25% domain)",
    steps: [
      {
        id: "w5-storage",
        title: "Persistent storage",
        hints: [
          "Lowest exam weight, but the tasks are formulaic — reliable, quick points if you know the shapes.",
        ],
        subSteps: [
          {
            id: "w5-pv",
            title: "PersistentVolumes, PersistentVolumeClaims, and binding",
            kind: "task",
            domain: "storage",
            hints: [
              "PV/PVC binding and mounting into a pod is on the highest-yield list.",
              "A PVC binds only when storageClassName, accessModes, and capacity are all compatible with a PV — mismatches leave it Pending.",
            ],
          },
          {
            id: "w5-storageclass",
            title:
              "StorageClasses, access modes, reclaim policies, dynamic provisioning",
            kind: "topic",
            domain: "storage",
            hints: [
              "Know the access modes (RWO, ROX, RWX, RWOP) and reclaim policies (Retain vs Delete) well enough to pick the right one fast.",
              "With a StorageClass, the PVC alone triggers dynamic provisioning — no manual PV needed.",
            ],
          },
        ],
      },
      {
        id: "w5-rbac",
        title: "RBAC",
        hints: [
          "RBAC (roles, bindings, service accounts) is on the grind list and scored under the heavyweight 25% architecture domain.",
        ],
        subSteps: [
          {
            id: "w5-roles",
            title:
              "Roles, ClusterRoles, RoleBindings, ServiceAccounts",
            kind: "task",
            domain: "architecture",
            hints: [
              "Create them imperatively: `kubectl create role`, `create clusterrole`, `create rolebinding`, `create serviceaccount` — all support `$do`.",
              "Role+RoleBinding is namespaced; ClusterRole can be bound either cluster-wide or into a namespace.",
            ],
          },
          {
            id: "w5-cani",
            title: "Verify access with kubectl auth can-i",
            kind: "task",
            domain: "architecture",
            hints: [
              "`kubectl auth can-i get pods --as system:serviceaccount:<ns>:<sa> -n <ns>` — proving access is part of the exam task, not an extra.",
            ],
          },
        ],
      },
      {
        id: "w5-checkpoint",
        title: "Week 5 checkpoint",
        hints: [],
        subSteps: [
          {
            id: "w5-checkpoint-rbac",
            title:
              "Bind a service account to a role and prove what it can and cannot do",
            kind: "checkpoint",
            domain: "architecture",
            hints: [
              "Full loop: service account → role → binding → `auth can-i` both for something allowed and something denied.",
              "This is the other half of the \"NetworkPolicy and RBAC\" readiness-bar line.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "w6",
    badge: "Week 6",
    title: "Troubleshooting — the big one",
    tagline:
      "The heaviest domain by far. It gets its own week and keeps recurring until exam day.",
    domain: "troubleshooting",
    weightNote: "30% of the exam",
    steps: [
      {
        id: "w6-node",
        title: "Node failures",
        hints: [
          "Node troubleshooting (NotReady nodes, kubelet issues, static pods) is top of the grind list.",
        ],
        subSteps: [
          {
            id: "w6-notready",
            title:
              "Fix NotReady nodes: kubelet down, cert or config issues",
            kind: "task",
            domain: "troubleshooting",
            hints: [
              "Start on the node: `systemctl status kubelet`, then `journalctl -u kubelet` — the error is usually spelled out.",
              "Common culprits: kubelet stopped, a wrong path in its config, or certificate problems.",
              "Fixing a NotReady node is one of the highest-yield exam tasks.",
            ],
          },
        ],
      },
      {
        id: "w6-controlplane",
        title: "Control plane failures",
        hints: [],
        subSteps: [
          {
            id: "w6-static",
            title:
              "Fix broken static pod manifests and an unresponsive API server",
            kind: "task",
            domain: "troubleshooting",
            hints: [
              "If `kubectl` itself fails, go under it: inspect `/etc/kubernetes/manifests` for typos and use `crictl ps` to see what is actually running.",
              "kubelet logs (`journalctl -u kubelet`) report manifest parse errors when a static pod will not start.",
            ],
          },
        ],
      },
      {
        id: "w6-workload",
        title: "Workload failures",
        hints: [],
        subSteps: [
          {
            id: "w6-pods",
            title:
              "Diagnose CrashLoopBackOff, ImagePullBackOff, Pending pods, failed probes",
            kind: "task",
            domain: "troubleshooting",
            hints: [
              "`kubectl describe pod` first — Events at the bottom name the problem most of the time.",
              "CrashLoopBackOff → `kubectl logs` (add `--previous` for the crashed container). Pending → resources, taints, or unbound PVC. ImagePullBackOff → image name/tag or registry access.",
            ],
          },
        ],
      },
      {
        id: "w6-network",
        title: "Networking failures",
        hints: [],
        subSteps: [
          {
            id: "w6-dns",
            title:
              "Fix DNS that will not resolve and Services with no endpoints",
            kind: "task",
            domain: "troubleshooting",
            hints: [
              "This is Week 4's material under failure conditions: CoreDNS health, then service selectors vs pod labels.",
              "`kubectl get endpoints` telling you \"none\" is the fastest tell in cluster networking.",
            ],
          },
        ],
      },
      {
        id: "w6-speed",
        title: "Read logs fast",
        hints: [],
        subSteps: [
          {
            id: "w6-logs",
            title:
              "Drill the toolkit: kubectl logs, describe, journalctl -u kubelet, crictl ps",
            kind: "task",
            domain: "troubleshooting",
            hints: [
              "A Linux background (systemctl, journald, log inspection) is a genuine advantage here — if you have one, lean on it.",
              "The skill is triage order: describe → logs → node services → container runtime, without dithering.",
            ],
          },
        ],
      },
      {
        id: "w6-checkpoint",
        title: "Week 6 checkpoint",
        hints: [],
        subSteps: [
          {
            id: "w6-checkpoint-broken",
            title:
              "Fix deliberately broken clusters under a timer",
            kind: "checkpoint",
            domain: "troubleshooting",
            hints: [
              "killercoda has ready-made broken-cluster scenarios — give yourself a time budget per fix and hold to it.",
              "Being able to fix a NotReady node and a broken control plane pod is a readiness-bar line.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "w7",
    badge: "Week 7",
    title: "Simulation and timing",
    tagline:
      "Stop learning topics, start rehearsing the exam. Stamina and weak-spot hunting.",
    domain: "craft",
    steps: [
      {
        id: "w7-sim",
        title: "Simulate the real thing",
        hints: [
          "Your exam registration includes two Killer.sh simulator sessions and one free retake — the simulator sessions are for weeks 7 and 8.",
        ],
        subSteps: [
          {
            id: "w7-killer1",
            title: "Killer.sh attempt 1",
            kind: "task",
            domain: "craft",
            hints: [
              "Expect it to feel brutal — it is deliberately harder than the real exam.",
              "The score matters less than the list of things you fumbled. That list is your syllabus for the rest of the plan.",
            ],
          },
          {
            id: "w7-redrill",
            title:
              "Re-drill every domain you fumbled — especially troubleshooting and etcd",
            kind: "task",
            domain: "troubleshooting",
            hints: [
              "Troubleshooting is 30% of the marks and etcd restore is the classic high-value task — weak spots there cost the most.",
            ],
          },
          {
            id: "w7-stamina",
            title:
              "Run full killercoda scenario sets against a 2-hour clock",
            kind: "task",
            domain: "craft",
            hints: [
              "The exam is 2 hours with a 66% pass mark. Build the stamina to stay sharp for the whole window.",
              "Practise the flag-and-move-on discipline: partial credit means breadth beats getting stuck on one task.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "w8",
    badge: "Week 8",
    title: "Final polish — then book it",
    tagline: "Prove the readiness bar, tighten the last screws, and book the exam.",
    domain: "craft",
    steps: [
      {
        id: "w8-polish",
        title: "Final rehearsal",
        hints: [
          "Exam-day plan for the first 2 minutes: set up `alias k`, `$do`, `$now` and completion; read every task's context and `kubectl config use-context` before touching anything.",
        ],
        subSteps: [
          {
            id: "w8-killer2",
            title:
              "Killer.sh attempt 2 — finish comfortably within time",
            kind: "task",
            domain: "craft",
            hints: [
              "This is your readiness proof: finished within the time limit and passed comfortably.",
              "Killer.sh reuses the same scenarios per session window — a much better second score should come from speed, not memory.",
            ],
          },
          {
            id: "w8-rerun-core",
            title:
              "Re-run etcd backup/restore, kubeadm upgrade, RBAC and NetworkPolicy from memory",
            kind: "task",
            domain: "architecture",
            hints: [
              "These four are the spine of the highest-yield list — they must be reflex by now, from memory, no notes.",
            ],
          },
          {
            id: "w8-bookmarks",
            title:
              "Tighten doc bookmarks so you can jump to the right page in seconds",
            kind: "task",
            domain: "craft",
            hints: [
              "Only kubernetes.io/docs, kubernetes.io/blog, Helm docs and Gateway API docs are allowed, in one extra browser tab.",
              "Good candidates: NetworkPolicy examples, PV/PVC, kubeadm upgrade, etcd backup/restore, Ingress.",
            ],
          },
        ],
      },
      {
        id: "w8-book",
        title: "Book the exam",
        hints: [],
        subSteps: [
          {
            id: "w8-book-exam",
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
    id: "hy",
    badge: "Drills",
    title: "Highest-yield tasks to over-practise",
    tagline:
      "These show up in some form again and again. Check each one off only when it is reflex.",
    domain: "troubleshooting",
    steps: [
      {
        id: "hy-drills",
        title: "Make these eight reflex",
        hints: [
          "Revisit this list every week — over-practising these is the best marks-per-hour investment in the whole plan.",
        ],
        subSteps: [
          {
            id: "hy-etcd",
            title: "etcd snapshot save and restore",
            kind: "task",
            domain: "architecture",
            hints: [
              "The single most classic CKA task. Certs from the static pod manifest, snapshot save, restore to a new data dir, repoint etcd.",
            ],
          },
          {
            id: "hy-upgrade",
            title: "kubeadm cluster upgrade (drain, upgrade, uncordon)",
            kind: "task",
            domain: "architecture",
            hints: [
              "Control plane first, then workers. Never forget the uncordon at the end.",
            ],
          },
          {
            id: "hy-notready",
            title: "Fix a NotReady node (usually kubelet or a broken static pod)",
            kind: "task",
            domain: "troubleshooting",
            hints: [
              "`systemctl status kubelet` → `journalctl -u kubelet` → `/etc/kubernetes/manifests` covers most variants.",
            ],
          },
          {
            id: "hy-rbac",
            title:
              "RBAC: role + binding + service account, verified with auth can-i",
            kind: "task",
            domain: "architecture",
            hints: [
              "All four objects have imperative `kubectl create` commands — no YAML needed until they ask for something unusual.",
            ],
          },
          {
            id: "hy-netpol",
            title: "NetworkPolicy: default-deny plus a targeted allow",
            kind: "task",
            domain: "networking",
            hints: [
              "Keep the docs example bookmarked; adapt selectors rather than writing from scratch.",
            ],
          },
          {
            id: "hy-pvpvc",
            title: "PV/PVC binding and mounting into a pod",
            kind: "task",
            domain: "storage",
            hints: [
              "Match storageClassName, accessModes and size, then mount via `persistentVolumeClaim` in the pod spec.",
            ],
          },
          {
            id: "hy-podfail",
            title:
              "Diagnose a pod stuck Pending, CrashLoopBackOff, or ImagePullBackOff",
            kind: "task",
            domain: "troubleshooting",
            hints: [
              "`describe` → Events → `logs --previous`. Each of the three states has one usual suspect: resources/taints, the app itself, the image reference.",
            ],
          },
          {
            id: "hy-imperative",
            title:
              "Create resources imperatively with $do and edit the YAML quickly",
            kind: "task",
            domain: "craft",
            hints: [
              "`kubectl create ... $do > x.yaml`, edit, apply. This is the meta-skill under every other task on this list.",
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
    id: "ready-etcd",
    title: "You can back up and restore etcd from memory",
    detail: "Complete the Week 2 etcd work, its checkpoint, and the etcd drill.",
    requiredIds: ["w2-etcd-backup", "w2-etcd-restore", "w2-checkpoint-etcd", "hy-etcd"],
  },
  {
    id: "ready-upgrade",
    title: "You can upgrade a cluster with kubeadm without notes",
    detail: "Complete the Week 2 upgrade task and the upgrade drill.",
    requiredIds: ["w2-upgrade-run", "hy-upgrade"],
  },
  {
    id: "ready-fix",
    title: "You can fix a NotReady node and a broken control plane pod",
    detail: "Complete the Week 6 node and control-plane work plus the NotReady drill.",
    requiredIds: ["w6-notready", "w6-static", "w6-checkpoint-broken", "hy-notready"],
  },
  {
    id: "ready-netpol-rbac",
    title: "You can write and verify a NetworkPolicy and an RBAC binding",
    detail: "Complete the Week 4 and Week 5 checkpoints and both drills.",
    requiredIds: ["w4-checkpoint-netpol", "w5-checkpoint-rbac", "hy-netpol", "hy-rbac"],
  },
  {
    id: "ready-killer",
    title: "You finished a Killer.sh session in time and passed comfortably",
    detail: "Complete both simulator attempts (weeks 7 and 8).",
    requiredIds: ["w7-killer1", "w8-killer2"],
  },
  {
    id: "ready-speed",
    title: "Your speed aliases and context switching are automatic",
    detail: "Complete the speed setup and the Week 1 sixty-second drill.",
    requiredIds: ["setup-aliases", "setup-context", "setup-scaffold", "w1-drill"],
  },
];

/** Key exam facts, shown as chips on the dashboard. */
export const EXAM_FACTS: { emoji: string; text: string }[] = [
  { emoji: "⏱️", text: "2 hours, ~15–20 live tasks" },
  { emoji: "🎯", text: "66% to pass, partial credit" },
  { emoji: "📖", text: "Open book: kubernetes.io docs" },
  { emoji: "🔁", text: "Free retake + 2× Killer.sh" },
  { emoji: "🔄", text: "Tracks current k8s (~v1.35)" },
  { emoji: "🏅", text: "Valid 2 years" },
];

export const RESOURCES: { name: string; url: string; note: string }[] = [
  {
    name: "KodeKloud — CKA with Practice Tests",
    url: "https://kodekloud.com/courses/certified-kubernetes-administrator-cka/",
    note: "Best hands-on labs (Mumshad Mannambeth).",
  },
  {
    name: "Killer.sh",
    url: "https://killer.sh/",
    note: "Official simulator; two sessions free with registration. Weeks 7–8.",
  },
  {
    name: "killercoda.com",
    url: "https://killercoda.com/",
    note: "Free interactive scenarios and a live playground for daily drills.",
  },
  {
    name: "kubernetes.io/docs",
    url: "https://kubernetes.io/docs/",
    note: "Practise navigating it — your only exam reference.",
  },
  {
    name: "CKA Study Guide (Muschko)",
    url: "https://www.oreilly.com/library/view/certified-kubernetes-administrator/9781098107215/",
    note: "Optional book. Do not collect more than this.",
  },
];

/** All sub-steps in plan order, flattened. */
export const ALL_SUB_STEPS: SubStep[] = WEEKS.flatMap((w) =>
  w.steps.flatMap((s) => s.subSteps),
);

export const TOTAL_SUB_STEPS = ALL_SUB_STEPS.length;
