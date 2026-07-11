import type { StepValidation } from "../types";

/**
 * Skill checks: one per main step of the plan, keyed by Step.id.
 *
 * Each check has multiple-choice questions and, where it makes sense, small
 * command drills that are verified locally with regex patterns — no cluster
 * or backend required. The real CKA exam is 100% hands-on (no multiple
 * choice); these exist only so students can validate that the knowledge
 * stuck before ticking a step off.
 *
 * Results are intentionally NOT persisted and NOT linked to progress
 * tracking — retake any check, any time.
 */

export const VALIDATIONS: StepValidation[] = [
  // ── Setup ────────────────────────────────────────────────────────────────
  {
    stepId: "setup-cluster",
    questions: [
      {
        id: "q-setup-cluster-format",
        prompt: "What is the format of the CKA exam?",
        choices: [
          "Multiple-choice questions with a few YAML snippets",
          "Hands-on tasks solved from a live command line in real clusters",
          "A take-home project reviewed by an examiner",
          "An oral interview about Kubernetes architecture",
        ],
        answerIndex: 1,
        explanation:
          "The CKA is performance-based: roughly 15–20 live tasks in real clusters, no multiple choice at all. That is why a real practice cluster is non-negotiable.",
      },
      {
        id: "q-setup-cluster-multinode",
        prompt:
          "Why does the plan insist on a multi-node practice environment and not just a single-node tool?",
        choices: [
          "Single-node clusters are not free",
          "kubeadm bootstrap and node troubleshooting cannot be fully practised on a single node",
          "The exam requires at least 10 nodes",
          "Multi-node clusters run pods faster",
        ],
        answerIndex: 1,
        explanation:
          "Joining workers, draining nodes, and fixing a broken worker's kubelet all need a second node. Single-node tools can't cover those exam-critical flows.",
      },
      {
        id: "q-setup-cluster-free",
        prompt:
          "Which option gives you free, zero-setup, in-browser CKA practice scenarios for daily drills?",
        choices: ["killercoda.com", "Killer.sh unlimited sessions", "KodeKloud (free tier)", "kubernetes.io/docs"],
        answerIndex: 0,
        explanation:
          "killercoda.com is free and browser-based, including broken-cluster scenarios. Killer.sh gives only two sessions with exam registration and is saved for weeks 7–8.",
      },
    ],
  },
  {
    stepId: "setup-speed",
    questions: [
      {
        id: "q-setup-speed-do",
        prompt: "What does the exported `$do` variable (`--dry-run=client -o yaml`) let you do?",
        choices: [
          "Apply a manifest without validation",
          "Delete a pod without a grace period",
          "Generate a YAML manifest from an imperative command without creating the object",
          "Run a command against every namespace at once",
        ],
        answerIndex: 2,
        explanation:
          "`kubectl create ... $do > x.yaml` prints the YAML instead of creating anything — the fastest way to scaffold manifests on the exam.",
      },
      {
        id: "q-setup-speed-context",
        prompt: "Why should you run `kubectl config use-context <name>` at the start of every task?",
        choices: [
          "It resets the kubectl cache",
          "Tasks may target different clusters — working in the wrong context silently loses points",
          "It is required before kubectl will accept any command",
          "It speeds up API calls",
        ],
        answerIndex: 1,
        explanation:
          "Each exam task tells you which context to use. Solving a task perfectly in the wrong cluster scores zero — make the switch a reflex.",
      },
      {
        id: "q-setup-speed-now",
        prompt: "What is the `$now` export (`--force --grace-period=0`) for?",
        choices: [
          "Instantly deleting pods instead of waiting for graceful termination",
          "Forcing a deployment rollout",
          "Skipping YAML validation",
          "Draining a node immediately",
        ],
        answerIndex: 0,
        explanation:
          "`kubectl delete pod x $now` skips the graceful-termination wait. Seconds saved per delete add up over 15–20 tasks.",
      },
    ],
    drills: [
      {
        id: "d-setup-speed-alias",
        instruction: "Write the shell command that makes `k` an alias for `kubectl`.",
        requiredPatterns: ["^alias\\s+k=[\"']?kubectl[\"']?$"],
        sampleSolution: "alias k=kubectl",
      },
      {
        id: "d-setup-speed-context",
        instruction: "Switch kubectl to the context named `prod-cluster`.",
        requiredPatterns: ["^(k|kubectl)\\s+config\\s+use-context\\s+prod-cluster$"],
        sampleSolution: "kubectl config use-context prod-cluster",
      },
    ],
  },

  // ── Week 1 ───────────────────────────────────────────────────────────────
  {
    stepId: "w1-model",
    questions: [
      {
        id: "q-w1-model-etcd",
        prompt: "Which component stores the entire cluster state?",
        choices: ["kube-apiserver", "etcd", "kubelet", "kube-controller-manager"],
        answerIndex: 1,
        explanation:
          "etcd is the cluster's key-value store — everything else is stateless or reconstructable. That is why etcd backup/restore is such a classic exam task.",
      },
      {
        id: "q-w1-model-scheduler",
        prompt: "Which component decides which node a new pod runs on?",
        choices: ["kubelet", "kube-proxy", "kube-scheduler", "the container runtime"],
        answerIndex: 2,
        explanation:
          "kube-scheduler assigns pods to nodes (respecting requests, taints, affinity). The kubelet on the chosen node then actually starts the containers.",
      },
      {
        id: "q-w1-model-kubelet",
        prompt: "Which of these runs on EVERY node (control plane and workers) as a systemd service, not a pod?",
        choices: ["kube-apiserver", "CoreDNS", "kube-scheduler", "kubelet"],
        answerIndex: 3,
        explanation:
          "kubelet is the node agent, managed by systemd (`systemctl status kubelet`). On kubeadm clusters the control-plane components run as static pods that kubelet itself launches from `/etc/kubernetes/manifests`.",
      },
      {
        id: "q-w1-model-selectors",
        prompt: "How does a Service know which pods to send traffic to?",
        choices: [
          "By pod name prefix",
          "By matching its label selector against pod labels",
          "By the namespace only",
          "By the image the pods run",
        ],
        answerIndex: 1,
        explanation:
          "Labels and selectors are the glue of Kubernetes: Services, Deployments and NetworkPolicies all target pods by label. A selector/label mismatch is the #1 cause of a Service with no endpoints.",
      },
    ],
  },
  {
    stepId: "w1-imperative",
    questions: [
      {
        id: "q-w1-imp-run",
        prompt: "What does `kubectl run web --image=nginx` create?",
        choices: ["A Deployment", "A single Pod", "A ReplicaSet", "A Service"],
        answerIndex: 1,
        explanation:
          "`kubectl run` creates a bare pod. For a Deployment use `kubectl create deployment`.",
      },
      {
        id: "q-w1-imp-expose",
        prompt: "What does `kubectl expose deployment web --port=80` do?",
        choices: [
          "Opens port 80 on every node's firewall",
          "Creates a Service selecting the deployment's pods",
          "Adds a containerPort to the pod spec",
          "Creates an Ingress rule",
        ],
        answerIndex: 1,
        explanation:
          "`kubectl expose` creates a Service (ClusterIP by default) whose selector matches the deployment's pod labels — one line instead of hand-written YAML.",
      },
      {
        id: "q-w1-imp-scaffold",
        prompt: "What is the fastest exam-safe way to get editable YAML for a new Deployment?",
        choices: [
          "Write it from memory in vim",
          "Copy a random example from a blog",
          "`kubectl create deployment ... --dry-run=client -o yaml > d.yaml`",
          "Export an existing deployment from another cluster",
        ],
        answerIndex: 2,
        explanation:
          "Imperative command + `$do` gives correct, current-version YAML in seconds. Edit the file, then apply it.",
      },
    ],
    drills: [
      {
        id: "d-w1-imp-create",
        instruction: "Create a deployment named `web` with image `nginx` and 3 replicas, imperatively.",
        requiredPatterns: [
          "^(k|kubectl)\\s+create\\s+deploy(ment)?\\s+web(\\s|$)",
          "--image[= ]nginx",
          "--replicas[= ]3",
        ],
        sampleSolution: "kubectl create deployment web --image=nginx --replicas=3",
      },
      {
        id: "d-w1-imp-scale",
        instruction: "Scale the deployment `web` to 5 replicas.",
        requiredPatterns: ["^(k|kubectl)\\s+scale\\s", "deploy(ment)?(/|\\s+)web", "--replicas[= ]5"],
        sampleSolution: "kubectl scale deployment web --replicas=5",
      },
    ],
  },
  {
    stepId: "w1-checkpoint",
    questions: [
      {
        id: "q-w1-cp-blank",
        prompt: "You are stuck on an exam task. What does the plan say to do?",
        choices: [
          "Spend as long as it takes — accuracy beats speed",
          "Leave it blank and move on",
          "Flag it, do what you can for partial credit, and move on",
          "Restart the exam environment",
        ],
        answerIndex: 2,
        explanation:
          "Partial credit applies, so never leave a task fully blank — but breadth beats getting stuck. Flag hard tasks and come back.",
      },
      {
        id: "q-w1-cp-edit",
        prompt: "What happens when you save changes in `kubectl edit deployment web`?",
        choices: [
          "A new deployment is created alongside the old one",
          "The live object is updated immediately (a rollout starts if the pod template changed)",
          "A YAML file is written to disk but nothing changes",
          "The deployment is deleted and recreated with downtime",
        ],
        answerIndex: 1,
        explanation:
          "`kubectl edit` applies your change to the live object on save. Pod-template changes trigger a rolling update — no downtime for a healthy Deployment.",
      },
    ],
    drills: [
      {
        id: "d-w1-cp-expose",
        instruction: "Expose the deployment `web` as a Service on port 80.",
        requiredPatterns: ["^(k|kubectl)\\s+expose\\s+deploy(ment)?(/|\\s+)web(\\s|$)", "--port[= ]80"],
        sampleSolution: "kubectl expose deployment web --port=80",
      },
    ],
  },

  // ── Week 2 ───────────────────────────────────────────────────────────────
  {
    stepId: "w2-bootstrap",
    questions: [
      {
        id: "q-w2-boot-init",
        prompt: "Which command initialises a new control plane node?",
        choices: ["kubeadm join", "kubeadm init", "kubectl init", "kubeadm bootstrap"],
        answerIndex: 1,
        explanation:
          "`kubeadm init` sets up the control plane; workers then `kubeadm join` using the token it prints.",
      },
      {
        id: "q-w2-boot-manifests",
        prompt: "Where do static pod manifests live on a kubeadm cluster?",
        choices: [
          "/etc/kubernetes/manifests",
          "/var/lib/kubelet/pods",
          "/etc/kubernetes/pki",
          "/opt/kubernetes/manifests",
        ],
        answerIndex: 0,
        explanation:
          "kubelet watches `/etc/kubernetes/manifests` and runs whatever manifests it finds — no API server needed. The control plane itself runs from here, which matters hugely for troubleshooting.",
      },
      {
        id: "q-w2-boot-certs",
        prompt: "Where are the cluster's certificates stored?",
        choices: ["/etc/ssl/kubernetes", "/var/lib/etcd/certs", "/etc/kubernetes/pki", "~/.kube/certs"],
        answerIndex: 2,
        explanation:
          "Certificates live under `/etc/kubernetes/pki` (etcd's under `/etc/kubernetes/pki/etcd`); kubeconfigs live in `/etc/kubernetes`.",
      },
      {
        id: "q-w2-boot-token",
        prompt: "The join token from `kubeadm init` has expired. How do you get a new join command?",
        choices: [
          "Re-run kubeadm init",
          "`kubeadm token create --print-join-command`",
          "Copy /etc/kubernetes/admin.conf to the worker",
          "Tokens never expire",
        ],
        answerIndex: 1,
        explanation:
          "Tokens are short-lived by default; `kubeadm token create --print-join-command` mints a new one and prints the full join command.",
      },
    ],
    drills: [
      {
        id: "d-w2-boot-join",
        instruction: "Print a fresh, complete `kubeadm join` command for adding a worker node.",
        requiredPatterns: ["^kubeadm\\s+token\\s+create\\s+--print-join-command$"],
        sampleSolution: "kubeadm token create --print-join-command",
      },
    ],
  },
  {
    stepId: "w2-upgrade",
    questions: [
      {
        id: "q-w2-up-first",
        prompt: "What is the first kubeadm command to run when upgrading a cluster?",
        choices: ["kubeadm upgrade apply", "kubeadm upgrade plan", "kubeadm upgrade node", "kubeadm init --upgrade"],
        answerIndex: 1,
        explanation:
          "`kubeadm upgrade plan` shows which versions you can move to and what will change — then `kubeadm upgrade apply v1.x.y` on the control plane.",
      },
      {
        id: "q-w2-up-order",
        prompt: "In what order do you upgrade the cluster?",
        choices: [
          "Workers first, then the control plane",
          "All nodes at once for consistency",
          "Control plane first, then workers one at a time (drain → upgrade → uncordon)",
          "Order does not matter",
        ],
        answerIndex: 2,
        explanation:
          "Control plane first; then each worker is drained, upgraded (kubeadm/kubelet/kubectl), and uncordoned. Forgetting the final uncordon is a classic lost point.",
      },
      {
        id: "q-w2-up-drain",
        prompt: "What does `kubectl drain <node>` do?",
        choices: [
          "Deletes the node from the cluster",
          "Evicts workloads and marks the node unschedulable",
          "Stops the kubelet service",
          "Removes all images from the node",
        ],
        answerIndex: 1,
        explanation:
          "Drain = cordon (unschedulable) + evict pods, so the node can be safely upgraded or maintained. `--ignore-daemonsets` is almost always needed.",
      },
    ],
    drills: [
      {
        id: "d-w2-up-drain",
        instruction: "Safely evict workloads from node `node01` before upgrading it (DaemonSet pods can stay).",
        requiredPatterns: ["^(k|kubectl)\\s+drain\\s+node01(\\s|$)", "--ignore-daemonsets"],
        sampleSolution: "kubectl drain node01 --ignore-daemonsets",
      },
      {
        id: "d-w2-up-uncordon",
        instruction: "Make `node01` schedulable again after its upgrade.",
        requiredPatterns: ["^(k|kubectl)\\s+uncordon\\s+node01$"],
        sampleSolution: "kubectl uncordon node01",
      },
    ],
  },
  {
    stepId: "w2-etcd",
    questions: [
      {
        id: "q-w2-etcd-flags",
        prompt: "Which flags does `etcdctl snapshot save` need to authenticate against etcd?",
        choices: [
          "--username and --password",
          "--cacert, --cert, and --key",
          "--token only",
          "None — etcd is unauthenticated locally",
        ],
        answerIndex: 1,
        explanation:
          "etcd uses mutual TLS: you need the CA cert, a client cert, and its key (plus `--endpoints`). Read their exact paths out of the etcd static pod manifest.",
      },
      {
        id: "q-w2-etcd-paths",
        prompt: "Where do you find the correct cert paths and endpoint for etcdctl on an exam cluster?",
        choices: [
          "In the etcd static pod manifest (/etc/kubernetes/manifests/etcd.yaml)",
          "In the kubelet config",
          "They are always the same on every cluster",
          "In the CoreDNS ConfigMap",
        ],
        answerIndex: 0,
        explanation:
          "The etcd static pod manifest lists the exact `--cert-file`, `--key-file`, `--trusted-ca-file` and listen URLs — copy them instead of guessing.",
      },
      {
        id: "q-w2-etcd-restore",
        prompt: "After `etcdutl snapshot restore` into a new data directory, what makes the cluster actually use it?",
        choices: [
          "Nothing — the restore command switches it automatically",
          "Rebooting every node",
          "Pointing the etcd static pod's data volume at the new directory so kubelet restarts etcd with it",
          "Running kubeadm init again",
        ],
        answerIndex: 2,
        explanation:
          "Restore writes a new data dir; you then edit the etcd static pod manifest (its hostPath volume / --data-dir) to point at it. kubelet notices the manifest change and restarts etcd.",
      },
      {
        id: "q-w2-etcd-verify",
        prompt: "How do you verify a snapshot file after taking it?",
        choices: [
          "`etcdutl snapshot status <file>`",
          "`kubectl get snapshot`",
          "`cat` the file and check it is not empty",
          "`etcdctl snapshot verify <file>`",
        ],
        answerIndex: 0,
        explanation:
          "`etcdutl snapshot status` prints the snapshot's hash, revision and size — quick proof the backup is real.",
      },
    ],
    drills: [
      {
        id: "d-w2-etcd-save",
        instruction:
          "Take an etcd snapshot to `/backup/snap.db` (include the endpoint and the three TLS flags; any plausible cert paths are fine).",
        requiredPatterns: [
          "etcdctl\\s+snapshot\\s+save\\s",
          "/backup/snap\\.db",
          "--endpoints[= ]",
          "--cacert[= ]",
          "(^|\\s)--cert[= ]",
          "(^|\\s)--key[= ]",
        ],
        sampleSolution:
          "ETCDCTL_API=3 etcdctl snapshot save /backup/snap.db --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key",
      },
    ],
  },
  {
    stepId: "w2-checkpoint",
    questions: [
      {
        id: "q-w2-cp-order",
        prompt: "Put the etcd restore flow in the right order.",
        choices: [
          "Restore snapshot → edit etcd manifest to new data dir → let kubelet restart etcd → verify",
          "Edit etcd manifest → restore snapshot → reboot node → verify",
          "Stop kubelet → restore into the existing data dir → start kubelet",
          "Delete etcd pod → restore snapshot → kubeadm join",
        ],
        answerIndex: 0,
        explanation:
          "Restore into a NEW directory, repoint the static pod's volume/--data-dir, and kubelet restarts etcd automatically. Never restore over the live data dir.",
      },
      {
        id: "q-w2-cp-nonotes",
        prompt: "The checkpoint says to do backup + restore \"without notes\". Why?",
        choices: [
          "Notes are forbidden in this study plan",
          "The exam allows kubernetes.io docs, but the etcd flow must be reflex to stay inside the time budget",
          "etcdctl syntax changes too often for notes to help",
          "It proves you memorised the exact cert file hashes",
        ],
        answerIndex: 1,
        explanation:
          "You could look parts up mid-exam, but this task is so common and so mechanical that doing it from memory converts directly into saved minutes.",
      },
    ],
  },

  // ── Week 3 ───────────────────────────────────────────────────────────────
  {
    stepId: "w3-workloads",
    questions: [
      {
        id: "q-w3-wl-undo",
        prompt: "A rolling update went bad. Which command rolls the deployment back?",
        choices: [
          "kubectl rollout undo deployment <name>",
          "kubectl rollback deployment <name>",
          "kubectl undo deployment <name>",
          "kubectl rollout revert deployment <name>",
        ],
        answerIndex: 0,
        explanation:
          "`kubectl rollout undo` reverts to the previous revision (`--to-revision=N` for a specific one, found via `kubectl rollout history`).",
      },
      {
        id: "q-w3-wl-static",
        prompt: "How does a static pod differ from a DaemonSet pod?",
        choices: [
          "Static pods cannot mount volumes",
          "Static pods are run directly by kubelet from a manifest directory, with no controller involved",
          "DaemonSets only run on the control plane",
          "There is no difference",
        ],
        answerIndex: 1,
        explanation:
          "kubelet runs static pods straight from `/etc/kubernetes/manifests`; the API server only shows a read-only mirror pod. A DaemonSet is a normal controller-managed workload targeting every node.",
      },
      {
        id: "q-w3-wl-init",
        prompt: "When do init containers run?",
        choices: [
          "In parallel with app containers",
          "Only when a pod crashes",
          "To completion, one at a time, before the app containers start",
          "After the app containers become ready",
        ],
        answerIndex: 2,
        explanation:
          "Each init container must exit successfully before the next starts, and all must finish before the main containers run — a pod stuck in `Init:...` status points there.",
      },
    ],
    drills: [
      {
        id: "d-w3-wl-undo",
        instruction: "Roll the deployment `web` back to revision 2.",
        requiredPatterns: [
          "^(k|kubectl)\\s+rollout\\s+undo\\s",
          "deploy(ment)?(/|\\s+)web",
          "--to-revision[= ]2",
        ],
        sampleSolution: "kubectl rollout undo deployment web --to-revision=2",
      },
    ],
  },
  {
    stepId: "w3-scheduling",
    questions: [
      {
        id: "q-w3-sched-taint",
        prompt: "A node has taint `key=value:NoSchedule`. What happens to new pods without a matching toleration?",
        choices: [
          "They are scheduled but never started",
          "They are not scheduled onto that node",
          "They are evicted from every other node",
          "They run with reduced resources",
        ],
        answerIndex: 1,
        explanation:
          "NoSchedule keeps new non-tolerating pods off the node (existing pods stay; `NoExecute` would evict them too). Tolerations allow — they do not force — placement.",
      },
      {
        id: "q-w3-sched-cordon",
        prompt: "What is the difference between `kubectl cordon` and `kubectl drain`?",
        choices: [
          "They are aliases",
          "cordon marks the node unschedulable; drain also evicts the pods already running there",
          "drain marks the node unschedulable; cordon also evicts pods",
          "cordon deletes the node object",
        ],
        answerIndex: 1,
        explanation:
          "cordon = no NEW pods. drain = cordon + evict existing pods. That is why drain is the pre-upgrade step.",
      },
      {
        id: "q-w3-sched-force",
        prompt: "Which of these does NOT influence which node a pod lands on?",
        choices: ["nodeSelector", "node affinity", "taints and tolerations", "the pod's restartPolicy"],
        answerIndex: 3,
        explanation:
          "restartPolicy controls container restarts, not placement. nodeSelector, affinity, taints/tolerations (and `nodeName`) are the placement tools.",
      },
    ],
    drills: [
      {
        id: "d-w3-sched-label",
        instruction: "Label node `node01` with `disktype=ssd`.",
        requiredPatterns: ["^(k|kubectl)\\s+label\\s+node(s)?\\s+node01\\s+disktype=ssd$"],
        sampleSolution: "kubectl label node node01 disktype=ssd",
      },
      {
        id: "d-w3-sched-taint",
        instruction: "Taint node `node01` with key `env`, value `prod`, effect `NoSchedule`.",
        requiredPatterns: ["^(k|kubectl)\\s+taint\\s+node(s)?\\s+node01\\s", "env=prod:NoSchedule"],
        sampleSolution: "kubectl taint nodes node01 env=prod:NoSchedule",
      },
    ],
  },
  {
    stepId: "w3-config",
    questions: [
      {
        id: "q-w3-cfg-secret",
        prompt: "How are Secret values stored by default?",
        choices: [
          "AES-encrypted",
          "Base64-encoded (not encryption)",
          "Hashed with SHA-256",
          "In plain text in the pod spec",
        ],
        answerIndex: 1,
        explanation:
          "Base64 is encoding, not encryption — `echo <value> | base64 -d` reads any Secret you can get. Worth remembering both for the exam and real life.",
      },
      {
        id: "q-w3-cfg-requests",
        prompt: "What is the difference between resource requests and limits?",
        choices: [
          "Requests cap usage; limits drive scheduling",
          "Requests drive scheduling; limits cap usage (throttle CPU, OOM-kill on memory)",
          "They are the same value expressed in different units",
          "Limits only apply to storage",
        ],
        answerIndex: 1,
        explanation:
          "The scheduler places pods based on requests; the runtime enforces limits. A pod stuck Pending often just requests more than any node has free.",
      },
      {
        id: "q-w3-cfg-envfrom",
        prompt: "What does `envFrom` with a `configMapRef` do in a container spec?",
        choices: [
          "Mounts the ConfigMap as a volume",
          "Injects every key of the ConfigMap as an environment variable",
          "Copies the ConfigMap into the image",
          "Restarts the pod when the ConfigMap changes",
        ],
        answerIndex: 1,
        explanation:
          "`envFrom` imports all keys at once; `valueFrom` picks a single key; volume mounts expose keys as files. Know all three shapes.",
      },
    ],
    drills: [
      {
        id: "d-w3-cfg-cm",
        instruction: "Imperatively create a ConfigMap `app-config` with the literal `mode=debug`.",
        requiredPatterns: [
          "^(k|kubectl)\\s+create\\s+(configmap|cm)\\s+app-config(\\s|$)",
          "--from-literal[= ]mode=debug",
        ],
        sampleSolution: "kubectl create configmap app-config --from-literal=mode=debug",
      },
    ],
  },
  {
    stepId: "w3-checkpoint",
    questions: [
      {
        id: "q-w3-cp-three",
        prompt: "Which THREE mechanisms can put a pod on one specific node? (Pick the fully correct set.)",
        choices: [
          "nodeSelector, node affinity, taint+toleration combined with a selector",
          "restartPolicy, nodeSelector, priorityClass",
          "namespace, labels, annotations",
          "hostNetwork, hostPID, hostPath",
        ],
        answerIndex: 0,
        explanation:
          "nodeSelector and required node affinity target labelled nodes; tainting all other nodes (or taint + toleration + selector) achieves it too. The blunt fourth option is `nodeName`, which bypasses the scheduler entirely.",
      },
      {
        id: "q-w3-cp-toleration",
        prompt:
          "A pod must run on a tainted node. You add the matching toleration but it still lands elsewhere. Why?",
        choices: [
          "Tolerations must also be added to the node",
          "A toleration only ALLOWS scheduling on the tainted node — it does not require it; add a nodeSelector/affinity too",
          "Taints override tolerations",
          "The pod must be restarted twice",
        ],
        answerIndex: 1,
        explanation:
          "Toleration = permission, not attraction. To force placement, combine it with nodeSelector or affinity for that node's label.",
      },
    ],
  },

  // ── Week 4 ───────────────────────────────────────────────────────────────
  {
    stepId: "w4-services",
    questions: [
      {
        id: "q-w4-svc-noend",
        prompt: "A Service returns connection refused and `kubectl get endpoints <svc>` shows none. Most likely cause?",
        choices: [
          "kube-proxy crashed",
          "The Service selector doesn't match any ready pod's labels",
          "CoreDNS is down",
          "The Service needs a NodePort",
        ],
        answerIndex: 1,
        explanation:
          "No endpoints almost always means a selector/label mismatch or no Ready pods (failing readiness probes). Check endpoints first — it is the fastest tell.",
      },
      {
        id: "q-w4-svc-types",
        prompt: "Which statement about Service types is correct?",
        choices: [
          "ClusterIP is reachable from outside the cluster",
          "NodePort exposes the Service on a port of every node; ClusterIP is internal-only",
          "NodePort works only on the control plane node",
          "ClusterIP requires a cloud load balancer",
        ],
        answerIndex: 1,
        explanation:
          "ClusterIP = in-cluster virtual IP. NodePort = same, plus a high port (30000–32767 by default) opened on every node.",
      },
      {
        id: "q-w4-svc-proxy",
        prompt: "What is kube-proxy's job?",
        choices: [
          "Proxying kubectl traffic to the API server",
          "Programming iptables/IPVS rules on each node so Service IPs route to pod endpoints",
          "Serving the cluster DNS zone",
          "Terminating TLS for Ingress",
        ],
        answerIndex: 1,
        explanation:
          "kube-proxy watches Services/EndpointSlices and keeps each node's packet-forwarding rules in sync — it is why a ClusterIP 'exists' on every node.",
      },
    ],
    drills: [
      {
        id: "d-w4-svc-ep",
        instruction: "Check which endpoints back the Service `web`.",
        requiredPatterns: ["^(k|kubectl)\\s+get\\s+(endpoints|ep|endpointslices?)\\s+web"],
        sampleSolution: "kubectl get endpoints web",
      },
    ],
  },
  {
    stepId: "w4-dns",
    questions: [
      {
        id: "q-w4-dns-fqdn",
        prompt: "What is the full DNS name of Service `web` in namespace `apps`?",
        choices: [
          "web.apps.svc.cluster.local",
          "apps.web.svc.cluster.local",
          "web.svc.apps.cluster.local",
          "svc.web.apps.cluster.local",
        ],
        answerIndex: 0,
        explanation:
          "The pattern is `<service>.<namespace>.svc.<cluster-domain>`. From inside the same namespace, plain `web` resolves too.",
      },
      {
        id: "q-w4-dns-coredns",
        prompt: "Where does CoreDNS run?",
        choices: [
          "As a systemd service on every node",
          "As a Deployment (with a Service) in the kube-system namespace",
          "Inside the API server process",
          "As a static pod on workers",
        ],
        answerIndex: 1,
        explanation:
          "CoreDNS is a normal Deployment in `kube-system` behind the `kube-dns` Service — so its logs, its endpoints, and its ConfigMap are all debuggable with standard tools.",
      },
      {
        id: "q-w4-dns-debug",
        prompt: "Service names won't resolve from pods. What is the right first move?",
        choices: [
          "Restart every node",
          "Test with a throwaway pod (`nslookup` a known service), then check CoreDNS pods/logs and the kube-dns Service endpoints",
          "Reinstall the CNI plugin",
          "Edit /etc/hosts on the nodes",
        ],
        answerIndex: 1,
        explanation:
          "Reproduce from inside first, then check the DNS pipeline: CoreDNS pods running? kube-dns Service has endpoints? Errors in CoreDNS logs?",
      },
    ],
    drills: [
      {
        id: "d-w4-dns-test",
        instruction:
          "Run a temporary busybox pod that does an `nslookup` of the service `web` (any reasonable one-liner).",
        requiredPatterns: ["^(k|kubectl)\\s+run\\s", "--image[= ]busybox", "nslookup\\s+web"],
        sampleSolution: "kubectl run tmp --image=busybox:1.36 --rm -it --restart=Never -- nslookup web",
      },
    ],
  },
  {
    stepId: "w4-netpol",
    questions: [
      {
        id: "q-w4-np-deny",
        prompt: "What does a NetworkPolicy with `podSelector: {}` and `policyTypes: [Ingress]` do in a namespace?",
        choices: [
          "Allows all ingress to all pods",
          "Denies all ingress to all pods in that namespace",
          "Does nothing until pods are labelled",
          "Blocks egress from the namespace",
        ],
        answerIndex: 1,
        explanation:
          "Empty podSelector selects EVERY pod; listing Ingress with no rules means no ingress is allowed — the classic default-deny.",
      },
      {
        id: "q-w4-np-additive",
        prompt: "How do multiple NetworkPolicies combine?",
        choices: [
          "The most restrictive one wins",
          "The newest one replaces older ones",
          "They are additive — traffic is allowed if ANY policy allows it",
          "They conflict and must be merged manually",
        ],
        answerIndex: 2,
        explanation:
          "Policies are allow-lists that union together. Default-deny + a narrow allow is the standard exam pattern.",
      },
      {
        id: "q-w4-np-selectors",
        prompt:
          "In a `from:` entry, what changes when `podSelector` and `namespaceSelector` are combined in ONE list item vs listed as TWO items?",
        choices: [
          "Nothing — they always AND together",
          "One item = AND (pods matching both); two items = OR (either matches)",
          "Two items are invalid YAML",
          "One item = OR; two items = AND",
        ],
        answerIndex: 1,
        explanation:
          "Same list item means both conditions must hold; separate items are alternatives. This one-line YAML difference is a favourite exam trap.",
      },
    ],
  },
  {
    stepId: "w4-ingress",
    questions: [
      {
        id: "q-w4-ing-docs",
        prompt: "Which references are allowed in the exam's extra browser tab?",
        choices: [
          "Any website",
          "kubernetes.io/docs and blog, Helm docs, and the Gateway API docs",
          "Stack Overflow and kubernetes.io",
          "Only kubernetes.io/docs",
        ],
        answerIndex: 1,
        explanation:
          "kubernetes.io/docs + blog, helm.sh docs, and gateway-api.sigs.k8s.io are allowed. Knowing where the Ingress/Gateway examples live beats memorising the YAML.",
      },
      {
        id: "q-w4-ing-gateway",
        prompt: "Which resources belong to the Gateway API?",
        choices: [
          "Gateway, GatewayClass, HTTPRoute",
          "Ingress, IngressClass, IngressRoute",
          "Service, Endpoint, Route",
          "LoadBalancer, Listener, Backend",
        ],
        answerIndex: 0,
        explanation:
          "GatewayClass (implementation) → Gateway (listener) → HTTPRoute (routing rules) is the Gateway API trio; Ingress/IngressClass are the older API.",
      },
    ],
  },
  {
    stepId: "w4-checkpoint",
    questions: [
      {
        id: "q-w4-cp-verify",
        prompt: "How do you PROVE a NetworkPolicy isolates a pod, exam-style?",
        choices: [
          "kubectl describe networkpolicy shows 'active'",
          "Exec into another pod and show the connection now times out, then succeeds after adding the allow rule",
          "Check the CNI plugin logs",
          "Ping the node IP",
        ],
        answerIndex: 1,
        explanation:
          "Verification is part of the task: a `wget`/`curl` with a short timeout from a test pod, blocked before and working after, is the proof.",
      },
      {
        id: "q-w4-cp-scope",
        prompt: "A NetworkPolicy's `podSelector` selects pods from where?",
        choices: [
          "The whole cluster",
          "Only the namespace the policy is created in",
          "Only pods with no other policies",
          "Only the kube-system namespace",
        ],
        answerIndex: 1,
        explanation:
          "NetworkPolicies are namespaced and select pods in their own namespace; reaching across namespaces is what `namespaceSelector` in the rules is for.",
      },
    ],
  },

  // ── Week 5 ───────────────────────────────────────────────────────────────
  {
    stepId: "w5-storage",
    questions: [
      {
        id: "q-w5-st-pending",
        prompt: "A PVC stays Pending with no StorageClass involved. Most likely cause?",
        choices: [
          "The cluster is out of CPU",
          "No PV matches its storageClassName, accessModes, and requested size",
          "PVCs always take a few minutes",
          "The PVC needs a nodeSelector",
        ],
        answerIndex: 1,
        explanation:
          "Static binding requires a compatible PV: class name, access mode, and enough capacity. Any mismatch leaves the claim Pending.",
      },
      {
        id: "q-w5-st-rwo",
        prompt: "What does accessMode `ReadWriteOnce` (RWO) mean?",
        choices: [
          "Only one pod can ever mount it",
          "The volume is read-only after first write",
          "It can be mounted read-write by pods on a single node",
          "One write per second is allowed",
        ],
        answerIndex: 2,
        explanation:
          "RWO is per-NODE, not per-pod: several pods on the same node may share it. RWX = many nodes; ROX = read-only many nodes; RWOP = single pod.",
      },
      {
        id: "q-w5-st-reclaim",
        prompt: "With reclaimPolicy `Delete`, what happens when a bound PVC is deleted?",
        choices: [
          "The PV and its underlying storage are deleted too",
          "The PV becomes Available for the next claim",
          "The PVC cannot be deleted while bound",
          "The data is archived to etcd",
        ],
        answerIndex: 0,
        explanation:
          "Delete removes the PV (and backing storage) with the claim; Retain keeps the PV (status Released) and its data for manual cleanup.",
      },
      {
        id: "q-w5-st-dynamic",
        prompt: "What triggers dynamic provisioning of a volume?",
        choices: [
          "Creating a PV with a provisioner field",
          "Creating a PVC that references a StorageClass with a provisioner",
          "Labelling a node with storage=dynamic",
          "Running kubectl provision",
        ],
        answerIndex: 1,
        explanation:
          "With a StorageClass, the PVC alone is enough — the provisioner creates a matching PV automatically. No hand-written PV needed.",
      },
    ],
  },
  {
    stepId: "w5-rbac",
    questions: [
      {
        id: "q-w5-rbac-scope",
        prompt: "What is the difference between a Role and a ClusterRole?",
        choices: [
          "Roles are read-only; ClusterRoles allow writes",
          "A Role grants permissions within one namespace; a ClusterRole is cluster-scoped (and can also be bound into a namespace)",
          "ClusterRoles apply only to nodes",
          "Roles apply only to service accounts",
        ],
        answerIndex: 1,
        explanation:
          "Role + RoleBinding = namespaced. A ClusterRole can be bound cluster-wide (ClusterRoleBinding) or reused per-namespace via a RoleBinding.",
      },
      {
        id: "q-w5-rbac-cani",
        prompt: "How do you check whether service account `app-sa` in namespace `dev` can list pods?",
        choices: [
          "`kubectl auth can-i list pods --as system:serviceaccount:dev:app-sa -n dev`",
          "`kubectl get rolebinding app-sa`",
          "`kubectl describe sa app-sa`",
          "Exec into a pod and try it — there is no other way",
        ],
        answerIndex: 0,
        explanation:
          "`kubectl auth can-i` with `--as system:serviceaccount:<ns>:<name>` verifies effective permissions — and proving access is part of the exam task.",
      },
      {
        id: "q-w5-rbac-parts",
        prompt: "Which three objects together give a service account permissions?",
        choices: [
          "ServiceAccount + Role (or ClusterRole) + RoleBinding (or ClusterRoleBinding)",
          "ServiceAccount + Secret + ConfigMap",
          "User + Group + Token",
          "Role + NetworkPolicy + Namespace",
        ],
        answerIndex: 0,
        explanation:
          "The rule lives in the Role, the identity is the ServiceAccount, and the binding connects them. All three have imperative `kubectl create` commands.",
      },
    ],
    drills: [
      {
        id: "d-w5-rbac-role",
        instruction: "Imperatively create a Role `pod-reader` that can get, list and watch pods.",
        requiredPatterns: [
          "^(k|kubectl)\\s+create\\s+role\\s+pod-reader(\\s|$)",
          "--verb[= ]",
          "get",
          "list",
          "watch",
          "--resource[= ]pods?",
        ],
        sampleSolution: "kubectl create role pod-reader --verb=get,list,watch --resource=pods",
      },
      {
        id: "d-w5-rbac-cani",
        instruction:
          "Verify whether the service account `app-sa` in namespace `dev` can list pods in `dev`.",
        requiredPatterns: [
          "^(k|kubectl)\\s+auth\\s+can-i\\s+list\\s+pods?(\\s|$)",
          "--as[= ]system:serviceaccount:dev:app-sa",
          "(-n|--namespace)[= ]dev",
        ],
        sampleSolution: "kubectl auth can-i list pods --as system:serviceaccount:dev:app-sa -n dev",
      },
    ],
  },
  {
    stepId: "w5-checkpoint",
    questions: [
      {
        id: "q-w5-cp-loop",
        prompt: "What is the full RBAC proof loop the checkpoint asks for?",
        choices: [
          "Create SA → Role → RoleBinding → `auth can-i` returns yes for the allowed verb AND no for a denied one",
          "Create SA → give it cluster-admin → done",
          "Create Role → delete it → recreate it",
          "Create SA and check it appears in kubectl get sa",
        ],
        answerIndex: 0,
        explanation:
          "Proving both the allow AND the deny shows the binding is scoped correctly — that is the exam-grade verification.",
      },
      {
        id: "q-w5-cp-format",
        prompt: "What is the correct `--as` identity format for a service account?",
        choices: [
          "system:serviceaccount:<namespace>:<name>",
          "serviceaccount/<name>",
          "<namespace>:<name>@serviceaccount",
          "sa:<name>:<namespace>",
        ],
        answerIndex: 0,
        explanation:
          "The full username is `system:serviceaccount:<ns>:<name>` — namespace before name. Getting the order wrong silently tests the wrong identity.",
      },
    ],
  },

  // ── Week 6 ───────────────────────────────────────────────────────────────
  {
    stepId: "w6-node",
    questions: [
      {
        id: "q-w6-node-first",
        prompt: "A node is NotReady. What is the highest-value first command (on the node)?",
        choices: [
          "kubectl delete node && re-join",
          "systemctl status kubelet (then journalctl -u kubelet)",
          "reboot",
          "kubectl get pods -A",
        ],
        answerIndex: 1,
        explanation:
          "NotReady usually means the kubelet is down or misconfigured. Its status and journal almost always spell out the exact error.",
      },
      {
        id: "q-w6-node-logs",
        prompt: "Where do you read kubelet logs on a systemd node?",
        choices: [
          "kubectl logs kubelet -n kube-system",
          "journalctl -u kubelet",
          "/var/log/pods/kubelet.log",
          "docker logs kubelet",
        ],
        answerIndex: 1,
        explanation:
          "kubelet is a systemd service, not a pod — `kubectl logs` cannot see it. `journalctl -u kubelet` is the tool.",
      },
      {
        id: "q-w6-node-causes",
        prompt: "Which is NOT a common cause of a NotReady node?",
        choices: [
          "kubelet service stopped",
          "A wrong path in the kubelet config",
          "Expired or wrong certificates",
          "Too many Services defined in the cluster",
        ],
        answerIndex: 3,
        explanation:
          "Service count doesn't affect node readiness. Kubelet stopped / bad config / cert problems cover most exam variants.",
      },
    ],
    drills: [
      {
        id: "d-w6-node-journal",
        instruction: "Show the kubelet service's logs on a node.",
        requiredPatterns: ["^journalctl\\s+(-u|--unit[= ])\\s*kubelet"],
        sampleSolution: "journalctl -u kubelet",
      },
    ],
  },
  {
    stepId: "w6-controlplane",
    questions: [
      {
        id: "q-w6-cp-kubectl-dead",
        prompt: "`kubectl` itself hangs — the API server is down. Where do you look?",
        choices: [
          "kubectl describe pod kube-apiserver (it will work eventually)",
          "On the control plane node: /etc/kubernetes/manifests for manifest errors and `crictl ps` for what is actually running",
          "The CoreDNS ConfigMap",
          "kubectl get events -A",
        ],
        answerIndex: 1,
        explanation:
          "When the API server is gone you must go UNDER it: static pod manifests, `crictl ps`/`crictl logs`, and `journalctl -u kubelet` for manifest parse errors.",
      },
      {
        id: "q-w6-cp-typo",
        prompt: "What happens if a static pod manifest in /etc/kubernetes/manifests has a YAML typo?",
        choices: [
          "The API server rejects it with an error event",
          "kubelet logs a parse error and the pod simply never (re)starts",
          "The node reboots",
          "kubeadm repairs it automatically",
        ],
        answerIndex: 1,
        explanation:
          "No controller or admission involved — kubelet just fails to load it. That's why `journalctl -u kubelet` is where the evidence lives.",
      },
      {
        id: "q-w6-cp-crictl",
        prompt: "Why `crictl logs` instead of `kubectl logs` for a crashed API server container?",
        choices: [
          "crictl is faster",
          "kubectl logs needs the API server, which is exactly what is down; crictl talks straight to the container runtime",
          "kubectl logs only works for Deployments",
          "There is no difference",
        ],
        answerIndex: 1,
        explanation:
          "`kubectl logs` is an API call. With the control plane down, only runtime-level tools (`crictl ps -a`, `crictl logs`) still work.",
      },
    ],
    drills: [
      {
        id: "d-w6-cp-crictl",
        instruction: "List ALL containers (including exited ones) with the container-runtime CLI.",
        requiredPatterns: ["^crictl\\s+ps\\s+(-a|--all)$"],
        sampleSolution: "crictl ps -a",
      },
    ],
  },
  {
    stepId: "w6-workload",
    questions: [
      {
        id: "q-w6-wl-crash",
        prompt: "A pod is in CrashLoopBackOff. Which command shows why the app keeps dying?",
        choices: [
          "kubectl logs <pod> --previous",
          "kubectl get pod <pod> -o yaml",
          "kubectl top pod <pod>",
          "kubectl port-forward <pod>",
        ],
        answerIndex: 0,
        explanation:
          "The current container may be mid-restart; `--previous` shows the logs of the crashed attempt — usually the actual error.",
      },
      {
        id: "q-w6-wl-imagepull",
        prompt: "Which is a typical cause of ImagePullBackOff?",
        choices: [
          "Not enough CPU on the node",
          "A typo in the image name/tag, or missing registry credentials",
          "A failing liveness probe",
          "An unbound PVC",
        ],
        answerIndex: 1,
        explanation:
          "ImagePull problems are about the image reference or registry access. Resources/taints/PVCs cause Pending; probes cause restarts.",
      },
      {
        id: "q-w6-wl-pending",
        prompt: "A pod is stuck Pending. Which trio covers the usual suspects?",
        choices: [
          "Insufficient resources, untolerated taints, or an unbound PVC",
          "DNS failure, expired certs, image typo",
          "Wrong restartPolicy, missing labels, bad probes",
          "kube-proxy down, CNI down, etcd down",
        ],
        answerIndex: 0,
        explanation:
          "Pending = the scheduler can't place it: not enough requested resources, taints without tolerations, or waiting on storage. `kubectl describe pod` Events name which.",
      },
      {
        id: "q-w6-wl-describe",
        prompt: "Why is `kubectl describe pod` the recommended FIRST command for a broken workload?",
        choices: [
          "It restarts the pod",
          "Its Events section names the failure (image pull, scheduling, probe, mount) most of the time",
          "It shows the full container logs",
          "It is the only command that works on Pending pods",
        ],
        answerIndex: 1,
        explanation:
          "Events at the bottom of describe output typically state the problem outright — read them before going anywhere else.",
      },
    ],
    drills: [
      {
        id: "d-w6-wl-prev",
        instruction: "Show the logs of the PREVIOUS (crashed) container instance of pod `web-1`.",
        requiredPatterns: [
          "^(k|kubectl)\\s+logs\\s",
          "\\sweb-1(\\s|$)",
          "(--previous|-p)(\\s|$)",
        ],
        sampleSolution: "kubectl logs web-1 --previous",
      },
    ],
  },
  {
    stepId: "w6-network",
    questions: [
      {
        id: "q-w6-net-tell",
        prompt: "`kubectl get endpoints web` shows `<none>`. What does that tell you?",
        choices: [
          "kube-proxy is broken on all nodes",
          "The Service selects no ready pods — check selector vs labels and pod readiness",
          "The Service needs to be recreated",
          "DNS is misconfigured",
        ],
        answerIndex: 1,
        explanation:
          "Empty endpoints is the fastest tell in cluster networking: the Service works, but nothing matches it (label mismatch or pods not Ready).",
      },
      {
        id: "q-w6-net-order",
        prompt: "DNS lookups fail inside pods. Which check order matches the plan?",
        choices: [
          "Reinstall CNI → reboot nodes → recreate pods",
          "CoreDNS pods healthy? → kube-dns Service has endpoints? → CoreDNS logs",
          "Check Ingress → check Gateway → check LoadBalancer",
          "Delete and recreate the kube-system namespace",
        ],
        answerIndex: 1,
        explanation:
          "It is Week 4's material under failure: verify the DNS Deployment is running, its Service has endpoints, then read its logs.",
      },
    ],
  },
  {
    stepId: "w6-speed",
    questions: [
      {
        id: "q-w6-speed-order",
        prompt: "What triage order does the plan drill for a broken workload?",
        choices: [
          "logs → describe → delete pod → retry",
          "describe → logs → node services (journalctl) → container runtime (crictl)",
          "crictl → describe → logs → reboot",
          "Google the error first",
        ],
        answerIndex: 1,
        explanation:
          "Start at the object (describe/Events), then app logs, then drop to the node layer only if needed. The skill is moving through the layers without dithering.",
      },
      {
        id: "q-w6-speed-events",
        prompt: "Which command surfaces scheduling failures, probe failures and mount errors in one place?",
        choices: ["kubectl logs", "kubectl describe pod (Events section)", "crictl ps", "kubectl get svc"],
        answerIndex: 1,
        explanation:
          "Events aggregate what the scheduler, kubelet, and probes have to say about the pod — it is the single highest-signal view.",
      },
    ],
  },
  {
    stepId: "w6-checkpoint",
    questions: [
      {
        id: "q-w6-cp-timer",
        prompt: "Why does the checkpoint insist on fixing broken clusters UNDER A TIMER?",
        choices: [
          "The killercoda playground expires quickly",
          "Troubleshooting is 30% of the exam and the 2-hour budget makes speed part of the skill",
          "Timers make the scenarios harder to break",
          "It is only for fun",
        ],
        answerIndex: 1,
        explanation:
          "You can often fix anything given infinite time; the exam gives ~6–8 minutes per task. Practising against a clock is what converts knowledge into points.",
      },
      {
        id: "q-w6-cp-scenario",
        prompt:
          "In a broken-cluster scenario, `kubectl get nodes` shows a worker NotReady and kubelet is running. What is the next place to look?",
        choices: [
          "kubelet's journal for config/cert errors, and the kubelet config files it complains about",
          "Delete the node object",
          "The CoreDNS ConfigMap",
          "Ingress controller logs",
        ],
        answerIndex: 0,
        explanation:
          "Running-but-NotReady usually means kubelet is up but failing (bad config path, wrong CA, unreachable API server) — its journal says which.",
      },
    ],
  },

  // ── Week 7 ───────────────────────────────────────────────────────────────
  {
    stepId: "w7-sim",
    questions: [
      {
        id: "q-w7-sim-brutal",
        prompt: "Your first Killer.sh score is low. What does the plan say that means?",
        choices: [
          "You are not ready and should delay the exam by months",
          "Nothing — the simulator is broken",
          "Expected: Killer.sh is deliberately harder than the real exam; the fumble list is the real output",
          "You should immediately book the exam anyway",
        ],
        answerIndex: 2,
        explanation:
          "Killer.sh is harder by design. The score matters less than the list of what you fumbled — that list is your syllabus for the remaining weeks.",
      },
      {
        id: "q-w7-sim-sessions",
        prompt: "How many Killer.sh sessions come with CKA registration, and how does the plan use them?",
        choices: [
          "One, used the night before",
          "Two — one in week 7 to find weak spots, one in week 8 to prove speed",
          "Unlimited during exam week",
          "Two, both in week 1",
        ],
        answerIndex: 1,
        explanation:
          "Registration includes two simulator sessions. Attempt 1 finds gaps; attempt 2 should be finished comfortably within time.",
      },
      {
        id: "q-w7-sim-stamina",
        prompt: "Why run full killercoda sets against a 2-hour clock?",
        choices: [
          "To memorise the scenarios",
          "To build stamina and the flag-and-move-on discipline for a 2-hour, ~15–20-task exam",
          "Because scenarios reset every 2 hours",
          "To unlock more scenarios",
        ],
        answerIndex: 1,
        explanation:
          "Staying sharp for the whole window and skipping stuck tasks (partial credit!) are trained skills, separate from knowing Kubernetes.",
      },
    ],
  },

  // ── Week 8 ───────────────────────────────────────────────────────────────
  {
    stepId: "w8-polish",
    questions: [
      {
        id: "q-w8-pol-2min",
        prompt: "What does the plan say to do in the FIRST 2 minutes of the exam?",
        choices: [
          "Read every task before starting any",
          "Set up alias k, $do, $now and completion; then use-context before every task",
          "Start with the hardest task while fresh",
          "Bookmark the docs pages",
        ],
        answerIndex: 1,
        explanation:
          "Two minutes of setup pays back across all ~15–20 tasks; context switching before each task prevents silent zero-scores.",
      },
      {
        id: "q-w8-pol-bookmarks",
        prompt: "Which set of docs bookmarks does the plan call good candidates?",
        choices: [
          "NetworkPolicy examples, PV/PVC, kubeadm upgrade, etcd backup/restore, Ingress",
          "The Kubernetes source code on GitHub",
          "Helm chart templates",
          "The CKA exam FAQ",
        ],
        answerIndex: 0,
        explanation:
          "Bookmark the pages with copy-adaptable YAML for the highest-yield tasks — jumping to the right page in seconds is a scored skill in practice.",
      },
      {
        id: "q-w8-pol-memory",
        prompt: "Which four tasks should you be able to re-run FROM MEMORY by week 8?",
        choices: [
          "etcd backup/restore, kubeadm upgrade, RBAC, NetworkPolicy",
          "Helm install, ArgoCD sync, Prometheus setup, Grafana dashboards",
          "Cluster deletion, node reboot, image build, registry push",
          "Only etcd backup",
        ],
        answerIndex: 0,
        explanation:
          "Those four are the spine of the highest-yield list — reflex by exam day, no notes.",
      },
    ],
  },
  {
    stepId: "w8-book",
    questions: [
      {
        id: "q-w8-book-when",
        prompt: "When does the plan say to book the exam?",
        choices: [
          "As soon as you start studying, for motivation",
          "When every readiness-bar criterion is met — not before, not long after",
          "Only after scoring 100% on Killer.sh",
          "After finishing the optional book",
        ],
        answerIndex: 1,
        explanation:
          "The readiness bar (etcd from memory, kubeadm upgrade without notes, fixing broken nodes, NetworkPolicy+RBAC verified, Killer.sh in time, automatic speed habits) is the booking signal.",
      },
      {
        id: "q-w8-book-retake",
        prompt: "What safety net does the exam registration include?",
        choices: [
          "A refund if you fail",
          "One free retake and two Killer.sh sessions",
          "Three attempts",
          "A live proctor who gives hints",
        ],
        answerIndex: 1,
        explanation:
          "One free retake plus the two simulator sessions — and the certification is valid for 2 years once you pass.",
      },
    ],
  },

  // ── Drills ───────────────────────────────────────────────────────────────
  {
    stepId: "hy-drills",
    questions: [
      {
        id: "q-hy-etcd",
        prompt: "Rapid fire: where do the TLS cert paths for `etcdctl snapshot save` come from?",
        choices: [
          "The etcd static pod manifest",
          "The kubeconfig",
          "A Secret in kube-system",
          "They are hardcoded defaults",
        ],
        answerIndex: 0,
        explanation: "Read `--cert-file`, `--key-file`, `--trusted-ca-file` straight out of /etc/kubernetes/manifests/etcd.yaml.",
      },
      {
        id: "q-hy-upgrade",
        prompt: "Rapid fire: the last step after upgrading a drained worker node?",
        choices: ["kubectl uncordon <node>", "kubeadm upgrade plan", "systemctl restart containerd", "kubectl drain <node>"],
        answerIndex: 0,
        explanation: "Never forget the uncordon — an unschedulable node after an otherwise perfect upgrade still loses points.",
      },
      {
        id: "q-hy-notready",
        prompt: "Rapid fire: the three-stop tour for a NotReady node?",
        choices: [
          "systemctl status kubelet → journalctl -u kubelet → /etc/kubernetes/manifests",
          "kubectl get svc → get ep → get ingress",
          "reboot → reinstall → rejoin",
          "describe node → delete node → join node",
        ],
        answerIndex: 0,
        explanation: "Kubelet status, kubelet journal, static pod manifests — that route covers most NotReady variants.",
      },
      {
        id: "q-hy-podfail",
        prompt: "Rapid fire: match the state to its usual suspect — Pending / CrashLoopBackOff / ImagePullBackOff.",
        choices: [
          "Resources or taints / the app itself / the image reference",
          "The image reference / resources / the app",
          "DNS / etcd / kube-proxy",
          "The app / the image / the node",
        ],
        answerIndex: 0,
        explanation:
          "Pending = can't schedule (resources, taints, PVC). CrashLoop = app dies (check logs --previous). ImagePull = bad image name/tag or registry access.",
      },
      {
        id: "q-hy-netpol",
        prompt: "Rapid fire: the standard exam NetworkPolicy pattern?",
        choices: [
          "Default-deny for the namespace, plus a narrow targeted allow",
          "Allow-all plus logging",
          "One deny rule per pod",
          "Egress-only policies",
        ],
        answerIndex: 0,
        explanation: "Policies are additive allow-lists: deny everything with `podSelector: {}`, then allow exactly what the task asks.",
      },
    ],
    drills: [
      {
        id: "d-hy-do",
        instruction:
          "Generate pod YAML (without creating anything) for a pod `nginx` with image `nginx`, using the dry-run technique.",
        requiredPatterns: [
          "^(k|kubectl)\\s+run\\s+nginx\\s",
          "--image[= ]nginx",
          "(\\$do|--dry-run[= ]client)",
        ],
        sampleSolution: "kubectl run nginx --image=nginx $do  # $do = --dry-run=client -o yaml",
      },
      {
        id: "d-hy-sa",
        instruction: "Imperatively create a service account named `app-sa`.",
        requiredPatterns: ["^(k|kubectl)\\s+create\\s+(serviceaccount|sa)\\s+app-sa$"],
        sampleSolution: "kubectl create serviceaccount app-sa",
      },
    ],
  },
];

export const VALIDATION_MAP: Record<string, StepValidation> = Object.fromEntries(
  VALIDATIONS.map((v) => [v.stepId, v]),
);
