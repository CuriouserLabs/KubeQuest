# CKA Study Plan (Certified Kubernetes Administrator)

A realistic, part-time plan for busy engineers. It is built around the most common
starting point: some Linux, Docker, YAML, and cloud fundamentals, but limited
hands-on Kubernetes cluster administration. If your background differs, shift time
between the "lean on" and "grind" lists below — the structure still holds.

Target pace: about 6 to 8 hours per week over 8 weeks (roughly 50 to 60 hours total).
Go harder and you can compress to 6 weeks; spread thinner and extend to 10. The
week boundaries matter less than finishing every hands-on checkpoint.

---

## Exam facts to plan around

- Format: hands-on, performance-based. Roughly 15 to 20 tasks solved from a live
  command line in a real cluster. No multiple choice.
- Time: 2 hours. Pass mark: 66%. Partial credit applies, so never leave a task blank.
- Open book, but only kubernetes.io/docs, kubernetes.io/blog, Helm docs, and Gateway
  API docs, in one extra browser tab. Practising fast doc navigation is a real skill.
- Version: tracks the current Kubernetes release (around v1.35 as of now, updated
  quarterly). Study the current version, not older tutorials.
- Registration includes one free retake and two Killer.sh simulator sessions.
- Validity: 2 years.

### Domain weights (build your time around these)

| Domain | Weight | Priority |
|---|---|---|
| Troubleshooting | 30% | Highest. Gets its own week and keeps recurring. |
| Cluster Architecture, Installation & Configuration | 25% | High. kubeadm, etcd, upgrades, RBAC. |
| Services & Networking | 20% | Medium-high. Services, NetworkPolicies, DNS, Ingress/Gateway. |
| Workloads & Scheduling | 15% | Medium. Deployments, scheduling, config. |
| Storage | 10% | Lowest weight, but easy points. Do not skip. |

---

## What to lean on vs what to grind

Lean on what you already know — if you have strong skills in any of these, do not
over-study them; focus on what is Kubernetes-specific:
- Linux CLI, file editing, systemctl, journald, process and log inspection.
- Docker and container concepts.
- YAML authoring and reading.
- General cloud and networking intuition.

If any of these are shaky, brush up just enough as you go rather than studying them
up front — the exam tests them only through Kubernetes tasks.

Grind these (the real gaps for most first-time cluster administrators):
- Bootstrapping and upgrading a cluster with kubeadm.
- etcd backup and restore. This is a classic, high-value exam task.
- Node troubleshooting (NotReady nodes, kubelet issues, static pods).
- RBAC (roles, bindings, service accounts).
- NetworkPolicies and cluster DNS debugging.
- Doing all of the above fast, under time pressure.

---

## One-time setup (do before Week 1, about 1 hour)

You need a real cluster to practise on, not just theory.

- Free option: killercoda.com has interactive CKA scenarios and a live playground in
  the browser. Good for daily drills with zero setup.
- Local multi-node: use `kind` or two small VMs (multipass, Vagrant, or two cheap
  cloud VMs) so you can practise kubeadm cluster bootstrap and node troubleshooting,
  which single-node tools cannot fully cover.
- KodeKloud labs (if you buy the course) give guided in-browser clusters.

Set up your speed environment now and use it from day one so it becomes reflex:

```bash
alias k=kubectl
export do="--dry-run=client -o yaml"   # generate manifests fast
export now="--force --grace-period=0"  # fast pod deletes
source <(kubectl completion bash)      # tab completion
complete -F __start_kubectl k
```

Also practise: switching context at the start of every task
(`kubectl config use-context <name>`), and using `kubectl explain` and
`kubectl create ... $do` to scaffold YAML instead of writing it by hand.

---

## Week-by-week

### Week 1 — Core model + speed habits
- Kubernetes architecture: control plane components, kubelet, kube-proxy, etcd.
- Pods, ReplicaSets, Deployments, namespaces, labels, selectors.
- Imperative kubectl: create, run, expose, scale, edit, delete.
- Drill: recreate common objects imperatively in under 60 seconds each.
- Checkpoint: you can stand up a Deployment, expose it, scale it, and edit it without
  looking anything up.

### Week 2 — Cluster Architecture & Installation (25%)
- Bootstrap a cluster with kubeadm (control plane + one worker).
- Join nodes, understand kubeconfig, certificates location, static pod manifests
  (/etc/kubernetes/manifests).
- Cluster upgrade with kubeadm (upgrade plan, apply, drain, uncordon).
- etcd backup and restore end to end. Practise this until it is automatic.
- Checkpoint: you can back up etcd and restore it from a snapshot without notes.

### Week 3 — Workloads & Scheduling (15%)
- Rolling updates, rollbacks, DaemonSets, static pods, multi-container pods.
- Scheduling: nodeSelector, affinity/anti-affinity, taints and tolerations, cordon.
- Config: ConfigMaps, Secrets, resource requests and limits, env injection.
- Checkpoint: you can force a pod onto a specific node three different ways.

### Week 4 — Services & Networking (20%)
- Service types (ClusterIP, NodePort), endpoints, kube-proxy basics.
- Cluster DNS: resolve service names, debug CoreDNS.
- NetworkPolicies: default-deny, then allow specific ingress/egress.
- Ingress and Gateway API basics (know where the docs are).
- Checkpoint: you can write a NetworkPolicy that isolates a pod and verify it works.

### Week 5 — Storage (10%) + RBAC
- PersistentVolumes, PersistentVolumeClaims, StorageClasses, access modes, reclaim
  policies, dynamic provisioning.
- RBAC: Roles, ClusterRoles, RoleBindings, ServiceAccounts, and verifying access with
  `kubectl auth can-i`.
- Checkpoint: you can bind a service account to a role and prove what it can and
  cannot do.

### Week 6 — Troubleshooting (30%, the big one)
- Node failures: NotReady nodes, kubelet down, cert or config issues.
- Control plane failures: broken static pod manifests, API server not responding.
- Workload failures: CrashLoopBackOff, ImagePullBackOff, pending pods, failed probes.
- Networking failures: DNS not resolving, service has no endpoints.
- Practise reading logs fast: `kubectl logs`, `kubectl describe`, `journalctl -u kubelet`,
  `crictl ps`.
- Checkpoint: give yourself broken clusters (killercoda has these) and fix them under
  a timer.

### Week 7 — Simulation and timing
- Killer.sh attempt 1. Expect it to feel brutal; it is harder than the real exam by
  design. Score is less important than finding your weak spots.
- Re-drill every domain you fumbled, especially troubleshooting and etcd.
- Do full killercoda scenario sets against a 2-hour clock to build stamina.

### Week 8 — Final polish and book the exam
- Killer.sh attempt 2. Aim to finish comfortably within time.
- Re-run etcd backup/restore, kubeadm upgrade, RBAC, and NetworkPolicy from memory.
- Tighten doc bookmarks so you can jump to the right page in seconds.
- Book the exam once you hit the readiness bar below.

---

## Highest-yield tasks to over-practise

These show up in some form again and again. Make them reflex:

1. etcd snapshot save and restore.
2. kubeadm cluster upgrade (drain, upgrade, uncordon).
3. Fix a NotReady node (usually kubelet or a broken static pod).
4. RBAC: create role + binding + service account, verify with `auth can-i`.
5. NetworkPolicy: default-deny plus a targeted allow.
6. PV/PVC binding and mounting into a pod.
7. Diagnose a pod stuck Pending, CrashLoopBackOff, or ImagePullBackOff.
8. Create resources imperatively with `$do` and edit the YAML quickly.

---

## Exam-day speed setup (first 2 minutes)

- Set up `alias k=kubectl`, the `$do` and `$now` exports, and completion.
- Read every task's context name and run `kubectl config use-context` before touching
  anything. Wrong context is a silent way to lose points.
- Flag hard tasks and move on. Partial credit means breadth beats getting stuck.
- Use the docs tab for exact manifest fields; do not memorise long YAML.

---

## Readiness bar (book the exam when all are true)

- You can back up and restore etcd from memory.
- You can upgrade a cluster with kubeadm without notes.
- You can fix a NotReady node and a broken control plane pod.
- You can write and verify a NetworkPolicy and an RBAC binding.
- You finished a Killer.sh session within the time limit and passed comfortably.
- Your speed aliases and context switching are automatic, not something you think about.

---

## Resources (keep it minimal)

- KodeKloud "CKA with Practice Tests" (Mumshad Mannambeth): best hands-on labs.
- Killer.sh: official simulator, free with registration, two sessions. Use in weeks 7-8.
- killercoda.com: free interactive scenarios and a live playground for daily drills.
- kubernetes.io/docs: practise navigating it, since it is your only exam reference.
- Optional book: "Certified Kubernetes Administrator (CKA) Study Guide" (Muschko).

Do not collect more than this. Depth of repetition on a real cluster beats breadth of
materials for a hands-on exam.
