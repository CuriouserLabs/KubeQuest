import type { StepValidation } from "../../types";

/**
 * CKAD skill checks: one per main step of the plan, keyed by Step.id.
 *
 * Each check has multiple-choice questions and, where it makes sense, small
 * command drills that are verified locally with regex patterns — no cluster
 * or backend required. The real CKAD exam is 100% hands-on (no multiple
 * choice); these exist only so students can validate that the knowledge
 * stuck before ticking a step off.
 *
 * Results are intentionally NOT persisted and NOT linked to progress
 * tracking — retake any check, any time.
 */

export const VALIDATIONS: StepValidation[] = [
  // ── Setup ────────────────────────────────────────────────────────────────
  {
    stepId: "ckad-setup-cluster",
    questions: [
      {
        id: "q-ckad-setup-format",
        prompt: "What is the format of the CKAD exam?",
        choices: [
          "Multiple-choice questions with a few YAML snippets",
          "Hands-on tasks solved from a live command line in real clusters",
          "A take-home project reviewed by an examiner",
          "An oral interview about application design",
        ],
        answerIndex: 1,
        explanation:
          "The CKAD is performance-based: roughly 15–20 live tasks in real clusters, no multiple choice at all. That is why a real practice cluster is non-negotiable.",
      },
      {
        id: "q-ckad-setup-singlenode",
        prompt:
          "Why is a single-node cluster enough for CKAD practice, when the CKA plan insists on multi-node?",
        choices: [
          "CKAD clusters are always single-node",
          "CKAD never tests cluster administration — no kubeadm, no node repair — so one node covers every topic",
          "Multi-node clusters cannot run Helm",
          "It isn't — CKAD also needs multi-node",
        ],
        answerIndex: 1,
        explanation:
          "CKAD is the application developer exam: you work with workloads, config and networking inside a running cluster. Bootstrapping and fixing clusters is CKA territory.",
      },
      {
        id: "q-ckad-setup-helm",
        prompt: "Which extra tool should you install locally during setup because the CKAD tests it directly?",
        choices: ["terraform", "helm", "istioctl", "docker-compose"],
        answerIndex: 1,
        explanation:
          "Helm is part of the Application Deployment domain (20%): installing, upgrading and rolling back charts. Have it ready before Week 3.",
      },
    ],
  },
  {
    stepId: "ckad-setup-speed",
    questions: [
      {
        id: "q-ckad-speed-do",
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
        id: "q-ckad-speed-ns",
        prompt:
          "A task says everything happens in namespace `moon`. What is the fastest safe way to work there?",
        choices: [
          "Add `-n moon` to every command and hope you never forget",
          "`kubectl config set-context --current --namespace=moon`",
          "Rename the namespace to `default`",
          "Export `$ns=moon` and rely on kubectl reading it",
        ],
        answerIndex: 1,
        explanation:
          "Setting the namespace on the current context makes every subsequent command target `moon` — one command instead of twenty `-n` flags, and no silent misses.",
      },
      {
        id: "q-ckad-speed-vim",
        prompt: "Why does the plan include vim YAML drills for CKAD specifically?",
        choices: [
          "The exam terminal only has vim, and CKAD is the most time-pressured k8s exam — editor fumbling costs real marks",
          "vim validates YAML automatically",
          "The exam awards bonus points for vim usage",
          "You cannot use kubectl without vim",
        ],
        answerIndex: 0,
        explanation:
          "You edit a lot of YAML under time pressure. Visual-block indent, fast copy/paste and `set paste` keep your manifests valid and your minutes for thinking.",
      },
    ],
    drills: [
      {
        id: "d-ckad-speed-ns",
        instruction:
          "Set the current context's default namespace to `moon`.",
        requiredPatterns: [
          "^(k|kubectl)\\s+config\\s+set-context\\s+--current\\s+--namespace[= ]moon$",
        ],
        sampleSolution: "kubectl config set-context --current --namespace=moon",
      },
      {
        id: "d-ckad-speed-alias",
        instruction: "Write the shell command that makes `k` an alias for `kubectl`.",
        requiredPatterns: ["^alias\\s+k=[\"']?kubectl[\"']?$"],
        sampleSolution: "alias k=kubectl",
      },
    ],
  },

  // ── Week 1 ───────────────────────────────────────────────────────────────
  {
    stepId: "ckad-w1-pods",
    questions: [
      {
        id: "q-ckad-w1-cmdargs",
        prompt:
          "In a pod spec, what do `command` and `args` override from the container image?",
        choices: [
          "`command` overrides CMD, `args` overrides ENTRYPOINT",
          "`command` overrides ENTRYPOINT, `args` overrides CMD",
          "Both override CMD",
          "Neither — they are appended to the image's defaults",
        ],
        answerIndex: 1,
        explanation:
          "`command` replaces the image's ENTRYPOINT and `args` replaces its CMD. Mixing these up is a classic exam trap when a task says \"run the container with this command\".",
      },
      {
        id: "q-ckad-w1-run",
        prompt: "What does `kubectl run web --image=nginx` create?",
        choices: ["A Deployment", "A single Pod", "A ReplicaSet", "A Service"],
        answerIndex: 1,
        explanation:
          "`kubectl run` creates a bare pod. For a Deployment use `kubectl create deployment`.",
      },
      {
        id: "q-ckad-w1-labels",
        prompt: "Why do labels matter so much in CKAD tasks?",
        choices: [
          "They change how much CPU a pod gets",
          "Deployments, Services and NetworkPolicies all select pods by label — a mismatch silently breaks the wiring",
          "The API server rejects pods without labels",
          "They are only cosmetic",
        ],
        answerIndex: 1,
        explanation:
          "Label selectors are the glue of Kubernetes. A Service with no endpoints or a policy that does nothing usually traces back to a label/selector mismatch.",
      },
    ],
    drills: [
      {
        id: "d-ckad-w1-run",
        instruction:
          "Create a single pod named `web` with image `nginx` and label `tier=frontend`, imperatively.",
        requiredPatterns: [
          "^(k|kubectl)\\s+run\\s+web\\s",
          "--image[= ]nginx",
          "(--labels?|-l)[= ][\"']?tier=frontend",
        ],
        sampleSolution: "kubectl run web --image=nginx --labels=tier=frontend",
      },
      {
        id: "d-ckad-w1-deploy",
        instruction:
          "Imperatively create a deployment `api` with image `nginx` and 3 replicas.",
        requiredPatterns: [
          "^(k|kubectl)\\s+create\\s+deploy(ment)?\\s+api\\s",
          "--image[= ]nginx",
          "--replicas[= ]3",
        ],
        sampleSolution: "kubectl create deployment api --image=nginx --replicas=3",
      },
    ],
  },
  {
    stepId: "ckad-w1-multi",
    questions: [
      {
        id: "q-ckad-w1-init-order",
        prompt: "When do init containers run?",
        choices: [
          "In parallel with the app containers",
          "One at a time, each to completion, before any app container starts",
          "Only when the pod restarts",
          "After the app containers become Ready",
        ],
        answerIndex: 1,
        explanation:
          "Each init container must exit successfully before the next starts, and all must finish before the main containers run — a pod stuck in `Init:0/1` status points there.",
      },
      {
        id: "q-ckad-w1-native-sidecar",
        prompt: "How do you define a native sidecar container (Kubernetes 1.29+)?",
        choices: [
          "A second entry in `containers:` with `sidecar: true`",
          "An entry in `initContainers:` with `restartPolicy: Always`",
          "A separate pod with the same labels",
          "A container with `kind: Sidecar`",
        ],
        answerIndex: 1,
        explanation:
          "Native sidecars are init containers with `restartPolicy: Always`: they start before the app containers but keep running alongside them (and terminate after them).",
      },
      {
        id: "q-ckad-w1-emptydir",
        prompt:
          "Two containers in one pod must share files. What is the standard mechanism?",
        choices: [
          "A PersistentVolumeClaim with ReadWriteMany",
          "An `emptyDir` volume declared once and mounted in both containers",
          "A shared ConfigMap",
          "hostPath on the node",
        ],
        answerIndex: 1,
        explanation:
          "`emptyDir` is pod-scoped scratch space: declare it under `spec.volumes`, mount it via `volumeMounts` in each container. It vanishes with the pod — which is fine for sidecar file sharing.",
      },
    ],
  },
  {
    stepId: "ckad-w1-jobs",
    questions: [
      {
        id: "q-ckad-w1-job-restart",
        prompt: "Which restartPolicy values are valid for a Job's pod template?",
        choices: [
          "Always only",
          "Never or OnFailure",
          "Always or Never",
          "Any of the three",
        ],
        answerIndex: 1,
        explanation:
          "Job pods must use `Never` or `OnFailure` — `Always` (the Deployment default) is invalid for Jobs and a favourite exam gotcha when you scaffold from the wrong template.",
      },
      {
        id: "q-ckad-w1-job-parallel",
        prompt:
          "A Job needs 6 successful runs, 2 at a time. Which fields express that?",
        choices: [
          "`replicas: 6`, `maxSurge: 2`",
          "`completions: 6`, `parallelism: 2`",
          "`count: 6`, `threads: 2`",
          "`completions: 2`, `parallelism: 6`",
        ],
        answerIndex: 1,
        explanation:
          "`completions` is the total number of successful pods required; `parallelism` is how many may run at once. `backoffLimit` caps retries on failure.",
      },
      {
        id: "q-ckad-w1-cron-manual",
        prompt: "How do you trigger a CronJob named `backup` right now, once?",
        choices: [
          "`kubectl run backup --now`",
          "`kubectl create job --from=cronjob/backup manual-1`",
          "Edit the schedule to `* * * * *` and wait",
          "`kubectl rollout restart cronjob/backup`",
        ],
        answerIndex: 1,
        explanation:
          "`kubectl create job --from=cronjob/<name> <job-name>` clones the CronJob's template into an immediate one-off Job — a known exam task.",
      },
    ],
    drills: [
      {
        id: "d-ckad-w1-cronjob",
        instruction:
          "Imperatively create a CronJob `tick` with image `busybox` and schedule `*/5 * * * *` (quote the schedule).",
        requiredPatterns: [
          "^(k|kubectl)\\s+create\\s+cronjob\\s+tick\\s",
          "--image[= ]busybox",
          "--schedule[= ][\"'].{9}[^\"']*[\"']",
        ],
        sampleSolution: "kubectl create cronjob tick --image=busybox --schedule='*/5 * * * *'",
      },
      {
        id: "d-ckad-w1-fromcron",
        instruction: "Create a one-off Job named `tick-now` from the CronJob `tick`.",
        requiredPatterns: [
          "^(k|kubectl)\\s+create\\s+job\\s",
          "--from[= ]cronjob/tick",
          "tick-now",
        ],
        sampleSolution: "kubectl create job tick-now --from=cronjob/tick",
      },
    ],
  },
  {
    stepId: "ckad-w1-checkpoint",
    questions: [
      {
        id: "q-ckad-w1-cp-volume",
        prompt:
          "In the two-container shared-volume pod you just built, where is the volume declared and where is it mounted?",
        choices: [
          "Declared in each container, mounted once at pod level",
          "Declared once under `spec.volumes`, mounted under each container's `volumeMounts`",
          "Declared in a separate Volume object, referenced by name",
          "Declared under `spec.volumeMounts`, mounted under `spec.volumes`",
        ],
        answerIndex: 1,
        explanation:
          "One `spec.volumes` entry, one `volumeMounts` entry per container that needs it. If you can write this without the docs, the checkpoint has done its job.",
      },
      {
        id: "q-ckad-w1-cp-initfail",
        prompt: "An init container keeps failing. What happens to the pod?",
        choices: [
          "The app containers start anyway after a timeout",
          "The pod restarts the init container per restartPolicy and app containers never start",
          "The pod is deleted automatically",
          "The scheduler moves the pod to another node",
        ],
        answerIndex: 1,
        explanation:
          "App containers only start once every init container has succeeded. A crash-looping init container shows as `Init:CrashLoopBackOff` — check its logs with `kubectl logs <pod> -c <init-name>`.",
      },
    ],
  },

  // ── Week 2 ───────────────────────────────────────────────────────────────
  {
    stepId: "ckad-w2-config",
    questions: [
      {
        id: "q-ckad-w2-envfrom",
        prompt:
          "What is the difference between `envFrom.configMapRef` and `env[].valueFrom.configMapKeyRef`?",
        choices: [
          "None — they are aliases",
          "`envFrom` imports every key of the ConfigMap as env vars; `valueFrom` imports one named key",
          "`envFrom` is for Secrets only",
          "`valueFrom` mounts the ConfigMap as files",
        ],
        answerIndex: 1,
        explanation:
          "`envFrom` bulk-imports the whole map; `valueFrom.configMapKeyRef` cherry-picks a single key into a named variable. Exam tasks ask for both — read carefully which one they want.",
      },
      {
        id: "q-ckad-w2-cm-volume",
        prompt: "When a ConfigMap is mounted as a volume, what appears in the container?",
        choices: [
          "One JSON file containing the whole map",
          "One file per key, with the value as file content",
          "Environment variables for each key",
          "A read-write copy of the ConfigMap object",
        ],
        answerIndex: 1,
        explanation:
          "Each key becomes a file named after the key. Apps that read config files (nginx.conf, application.properties) are wired this way on the exam.",
      },
      {
        id: "q-ckad-w2-secret-encoding",
        prompt: "How are Secret values stored and how do you read one back?",
        choices: [
          "AES-encrypted; only pods can read them",
          "base64-encoded; `kubectl get secret ... -o jsonpath | base64 -d`",
          "Plain text in etcd, readable with kubectl describe",
          "Hashed; they cannot be read back",
        ],
        answerIndex: 1,
        explanation:
          "Secrets are only base64-encoded, not encrypted. `kubectl get secret db -o jsonpath='{.data.password}' | base64 -d` prints the value — worth having in muscle memory.",
      },
    ],
    drills: [
      {
        id: "d-ckad-w2-cm",
        instruction:
          "Imperatively create a ConfigMap `app-config` with the literal `MODE=prod`.",
        requiredPatterns: [
          "^(k|kubectl)\\s+create\\s+(configmap|cm)\\s+app-config\\s",
          "--from-literal[= ][\"']?MODE=prod",
        ],
        sampleSolution: "kubectl create configmap app-config --from-literal=MODE=prod",
      },
      {
        id: "d-ckad-w2-secret",
        instruction:
          "Imperatively create a generic Secret `db-creds` with the literal `password=hunter2`.",
        requiredPatterns: [
          "^(k|kubectl)\\s+create\\s+secret\\s+generic\\s+db-creds\\s",
          "--from-literal[= ][\"']?password=hunter2",
        ],
        sampleSolution: "kubectl create secret generic db-creds --from-literal=password=hunter2",
      },
    ],
  },
  {
    stepId: "ckad-w2-resources",
    questions: [
      {
        id: "q-ckad-w2-requests",
        prompt: "What do resource requests and limits each control?",
        choices: [
          "Requests control throttling; limits control scheduling",
          "Requests drive scheduling decisions; limits cap usage (CPU throttling, memory OOM-kill)",
          "Both only affect billing",
          "Requests are per pod; limits are per node",
        ],
        answerIndex: 1,
        explanation:
          "The scheduler places pods based on requests; at runtime the kubelet enforces limits — CPU is throttled, memory overuse gets the container OOM-killed.",
      },
      {
        id: "q-ckad-w2-limitrange",
        prompt: "What does a LimitRange do that a ResourceQuota does not?",
        choices: [
          "Caps the namespace's total CPU",
          "Sets per-container default requests/limits and min/max bounds",
          "Blocks pod creation entirely",
          "Applies cluster-wide",
        ],
        answerIndex: 1,
        explanation:
          "ResourceQuota caps namespace totals; LimitRange works per container — injecting defaults when a pod declares nothing, and rejecting out-of-bounds values.",
      },
      {
        id: "q-ckad-w2-quota-reject",
        prompt:
          "A namespace has a ResourceQuota on CPU. Your pod without any resource fields is rejected. Why?",
        choices: [
          "The quota is already full",
          "When a quota tracks a resource, every pod must declare requests/limits for it (unless a LimitRange injects defaults)",
          "Quotas reject all new pods by design",
          "The pod needs a priorityClass",
        ],
        answerIndex: 1,
        explanation:
          "With an active quota on a resource, unspecified usage is unaccountable, so the API server rejects the pod. Fix: add requests/limits or rely on a LimitRange default.",
      },
    ],
  },
  {
    stepId: "ckad-w2-security",
    questions: [
      {
        id: "q-ckad-w2-sc-levels",
        prompt:
          "Where can `securityContext` be set, and which wins on conflict?",
        choices: [
          "Pod level only",
          "Pod and container level; the container-level setting wins for that container",
          "Container level only",
          "Namespace level; pods inherit it",
        ],
        answerIndex: 1,
        explanation:
          "Pod-level securityContext applies to all containers; a container-level block overrides it. Note `capabilities` exists only at container level.",
      },
      {
        id: "q-ckad-w2-sa-attach",
        prompt: "How does a pod run as a specific ServiceAccount `app-sa`?",
        choices: [
          "`kubectl label pod ... sa=app-sa`",
          "`serviceAccountName: app-sa` in the pod spec",
          "An annotation `kubernetes.io/sa: app-sa`",
          "A RoleBinding on the pod",
        ],
        answerIndex: 1,
        explanation:
          "`spec.serviceAccountName` is the wiring. RBAC then controls what that ServiceAccount may do; `automountServiceAccountToken: false` stops the token mount entirely.",
      },
      {
        id: "q-ckad-w2-cani",
        prompt:
          "How do you check whether ServiceAccount `app-sa` in `dev` may list pods there?",
        choices: [
          "`kubectl auth can-i list pods --as system:serviceaccount:dev:app-sa -n dev`",
          "`kubectl describe sa app-sa`",
          "`kubectl get rolebindings -n dev`",
          "Exec into a pod and try it",
        ],
        answerIndex: 0,
        explanation:
          "`kubectl auth can-i ... --as system:serviceaccount:<ns>:<name>` answers authorization questions directly — proving access is usually part of the exam task.",
      },
    ],
    drills: [
      {
        id: "d-ckad-w2-sa",
        instruction: "Imperatively create a ServiceAccount named `app-sa`.",
        requiredPatterns: ["^(k|kubectl)\\s+create\\s+(serviceaccount|sa)\\s+app-sa$"],
        sampleSolution: "kubectl create serviceaccount app-sa",
      },
      {
        id: "d-ckad-w2-role",
        instruction:
          "Imperatively create a Role `reader` allowing the verbs `get,list` on `pods`.",
        requiredPatterns: [
          "^(k|kubectl)\\s+create\\s+role\\s+reader\\s",
          "--verb[= ]get,list|--verb[= ]get\\s+--verb[= ]list",
          "--resource[= ]pods",
        ],
        sampleSolution: "kubectl create role reader --verb=get,list --resource=pods",
      },
    ],
  },
  {
    stepId: "ckad-w2-volumes",
    questions: [
      {
        id: "q-ckad-w2-pvc-fields",
        prompt: "Which three PVC fields must be compatible with a PV (or StorageClass) for binding?",
        choices: [
          "name, namespace, labels",
          "storageClassName, accessModes, requested size",
          "hostPath, nodeName, capacity",
          "reclaimPolicy, mountPath, size",
        ],
        answerIndex: 1,
        explanation:
          "A PVC binds when storageClassName, accessModes and capacity all line up. A Pending PVC almost always has a mismatch in one of the three.",
      },
      {
        id: "q-ckad-w2-emptydir-life",
        prompt: "When does data in an emptyDir volume disappear?",
        choices: [
          "When any container in the pod restarts",
          "When the pod is removed from the node",
          "Every 24 hours",
          "Never — it persists on the node",
        ],
        answerIndex: 1,
        explanation:
          "emptyDir survives container restarts (it belongs to the pod) but dies with the pod. Anything that must outlive the pod needs a PVC.",
      },
    ],
  },
  {
    stepId: "ckad-w2-checkpoint",
    questions: [
      {
        id: "q-ckad-w2-cp-order",
        prompt:
          "Your checkpoint app must run as UID 1000 with no privilege escalation. Which YAML expresses that?",
        choices: [
          "`securityContext: {runAsUser: 1000, allowPrivilegeEscalation: false}` (pod/container level as appropriate)",
          "`annotations: {runAs: \"1000\"}`",
          "`env: [{name: UID, value: \"1000\"}]`",
          "`rbac: {uid: 1000}`",
        ],
        answerIndex: 0,
        explanation:
          "`runAsUser` (pod or container securityContext) plus `allowPrivilegeEscalation: false` (container level). If you wrote this without notes, the 25% domain is in good shape.",
      },
      {
        id: "q-ckad-w2-cp-debug",
        prompt:
          "After deploying, your pod is CreateContainerConfigError. The most likely cause in this stack?",
        choices: [
          "The node is out of disk",
          "A referenced ConfigMap or Secret (or key) does not exist",
          "The image tag is wrong",
          "The PVC is too small",
        ],
        answerIndex: 1,
        explanation:
          "CreateContainerConfigError is the classic signature of a missing ConfigMap/Secret reference. `kubectl describe pod` names the missing object exactly.",
      },
    ],
  },

  // ── Week 3 ───────────────────────────────────────────────────────────────
  {
    stepId: "ckad-w3-rollouts",
    questions: [
      {
        id: "q-ckad-w3-undo",
        prompt: "How do you roll a Deployment back to revision 2?",
        choices: [
          "`kubectl rollout undo deployment/web --to-revision=2`",
          "`kubectl rollback deployment/web 2`",
          "`kubectl set revision deployment/web 2`",
          "Delete and recreate the Deployment",
        ],
        answerIndex: 0,
        explanation:
          "`kubectl rollout history` to find the revision, then `rollout undo --to-revision=N`. Without the flag, undo returns to the previous revision.",
      },
      {
        id: "q-ckad-w3-surge",
        prompt:
          "During a rolling update, what does `maxSurge: 1, maxUnavailable: 0` mean?",
        choices: [
          "One extra pod may be created above the desired count, and no pod may be unavailable — zero-downtime, one-at-a-time",
          "At most one pod total may run during the update",
          "The update happens one node at a time",
          "The old ReplicaSet is deleted first",
        ],
        answerIndex: 0,
        explanation:
          "maxSurge is how many pods may exist above the desired replica count; maxUnavailable is how many may be missing. 1/0 gives the safest, slowest wave.",
      },
      {
        id: "q-ckad-w3-canary",
        prompt: "How is a canary deployment typically built on the exam (no service mesh)?",
        choices: [
          "A `kind: Canary` object",
          "Two Deployments whose pods share the Service's selector label; replica counts set the traffic split",
          "One Deployment with `strategy: Canary`",
          "A NetworkPolicy that splits traffic",
        ],
        answerIndex: 1,
        explanation:
          "The Service selects a label both Deployments share (e.g. `app=web`); running 9 stable + 1 canary replicas approximates a 10% canary. Promotion = scale/relabel.",
      },
    ],
    drills: [
      {
        id: "d-ckad-w3-setimage",
        instruction:
          "Update deployment `web`, container `app`, to image `nginx:1.27`.",
        requiredPatterns: [
          "^(k|kubectl)\\s+set\\s+image\\s+deploy(ment)?/web\\s+app[= ]nginx:1\\.27$",
        ],
        sampleSolution: "kubectl set image deployment/web app=nginx:1.27",
      },
      {
        id: "d-ckad-w3-undo",
        instruction: "Roll deployment `web` back to revision 2.",
        requiredPatterns: [
          "^(k|kubectl)\\s+rollout\\s+undo\\s+deploy(ment)?/web\\s+--to-revision[= ]2$",
        ],
        sampleSolution: "kubectl rollout undo deployment/web --to-revision=2",
      },
    ],
  },
  {
    stepId: "ckad-w3-helm",
    questions: [
      {
        id: "q-ckad-w3-helm-override",
        prompt:
          "You must install a chart with `replicaCount` set to 3. Which is the one-off way?",
        choices: [
          "`helm install web bitnami/nginx --set replicaCount=3`",
          "Edit the chart's templates",
          "`helm install` then `kubectl scale`",
          "`helm push --values replicaCount=3`",
        ],
        answerIndex: 0,
        explanation:
          "`--set key=value` overrides a single value; `-f values.yaml` is better for many. `helm show values <chart>` tells you what is overridable.",
      },
      {
        id: "q-ckad-w3-helm-rollback",
        prompt: "An upgraded Helm release is broken. Fastest recovery?",
        choices: [
          "`helm uninstall` and reinstall",
          "`helm rollback <release> <revision>` (see `helm history`)",
          "`kubectl rollout undo` on each Deployment",
          "Delete the namespace",
        ],
        answerIndex: 1,
        explanation:
          "Helm keeps release revisions: `helm history web` lists them, `helm rollback web 1` restores one. It is the release-level analogue of `kubectl rollout undo`.",
      },
      {
        id: "q-ckad-w3-helm-template",
        prompt: "What does `helm template <chart>` do?",
        choices: [
          "Creates a new chart skeleton",
          "Renders the chart's manifests locally without installing anything",
          "Validates the chart against the cluster",
          "Uploads the chart to a repository",
        ],
        answerIndex: 1,
        explanation:
          "`helm template` renders locally — useful for inspecting what would be created. (`helm install --dry-run` is similar but talks to the cluster.)",
      },
    ],
    drills: [
      {
        id: "d-ckad-w3-helm-install",
        instruction:
          "Install the chart `bitnami/nginx` as a release named `web`, setting `replicaCount` to `2`.",
        requiredPatterns: [
          "^helm\\s+install\\s+web\\s+bitnami/nginx\\s",
          "--set\\s+replicaCount[= ]2",
        ],
        sampleSolution: "helm install web bitnami/nginx --set replicaCount=2",
      },
      {
        id: "d-ckad-w3-helm-ls",
        instruction: "List Helm releases in all namespaces.",
        requiredPatterns: ["^helm\\s+(list|ls)\\s+(-A|--all-namespaces)$"],
        sampleSolution: "helm list -A",
      },
    ],
  },
  {
    stepId: "ckad-w3-kustomize",
    questions: [
      {
        id: "q-ckad-w3-kustomize-apply",
        prompt: "How do you apply a Kustomize directory `overlays/prod`?",
        choices: [
          "`kubectl apply -f overlays/prod`",
          "`kubectl apply -k overlays/prod`",
          "`kustomize install overlays/prod`",
          "`helm install overlays/prod`",
        ],
        answerIndex: 1,
        explanation:
          "Kustomize is built into kubectl: `-k` treats the directory as a kustomization. `kubectl kustomize <dir>` renders it without applying — the preview command.",
      },
      {
        id: "q-ckad-w3-kustomize-image",
        prompt:
          "An overlay must run the base's `web` image as `web:2.0` without editing base manifests. Which kustomization field?",
        choices: ["`patches:`", "`images:`", "`resources:`", "`replicas:`"],
        answerIndex: 1,
        explanation:
          "The `images:` transformer rewrites image names/tags declaratively — exactly the \"retag per environment\" use case overlays exist for.",
      },
    ],
  },
  {
    stepId: "ckad-w3-checkpoint",
    questions: [
      {
        id: "q-ckad-w3-cp-verify",
        prompt: "How did you verify your canary was actually receiving ~10% of traffic?",
        choices: [
          "Trusted the replica math",
          "Curled the Service repeatedly and watched which pods (or versions) answered",
          "Checked `kubectl get canary`",
          "Read the Deployment's status field",
        ],
        answerIndex: 1,
        explanation:
          "Verification is part of the task: repeated requests through the Service should hit the canary roughly in proportion to its replica share.",
      },
      {
        id: "q-ckad-w3-cp-promote",
        prompt: "What does \"promoting\" the canary mean mechanically?",
        choices: [
          "Deleting the Service",
          "Scaling the canary up / updating the stable Deployment to the new version, then removing the old pods",
          "Renaming the canary Deployment",
          "Adding a toleration",
        ],
        answerIndex: 1,
        explanation:
          "Promotion ends with all traffic on the new version: either scale the canary to full and delete stable, or roll the stable Deployment to the canary's image and drop the canary.",
      },
    ],
  },

  // ── Week 4 ───────────────────────────────────────────────────────────────
  {
    stepId: "ckad-w4-services",
    questions: [
      {
        id: "q-ckad-w4-noendpoints",
        prompt: "A Service has no endpoints. What is the most likely cause?",
        choices: [
          "The cluster DNS is down",
          "Selector/label mismatch, or no pods are Ready",
          "The Service needs a NodePort",
          "kube-proxy is not installed",
        ],
        answerIndex: 1,
        explanation:
          "No endpoints almost always means a selector/label mismatch or no Ready pods (failing readiness probes). Check `kubectl get endpoints <svc>` first — it is the fastest tell.",
      },
      {
        id: "q-ckad-w4-dns-cross",
        prompt:
          "A pod in namespace `app` must call Service `db` in namespace `data`. Which URL works?",
        choices: [
          "`http://db`",
          "`http://db.data`",
          "`http://data.db`",
          "`http://db/data`",
        ],
        answerIndex: 1,
        explanation:
          "Cross-namespace DNS is `<service>.<namespace>` (short) or `<service>.<namespace>.svc.cluster.local` (full). Bare `db` only resolves inside the same namespace.",
      },
      {
        id: "q-ckad-w4-targetport",
        prompt:
          "In a Service, what is the difference between `port` and `targetPort`?",
        choices: [
          "None — they must match",
          "`port` is where the Service listens; `targetPort` is the container port traffic is forwarded to",
          "`targetPort` is only for NodePort Services",
          "`port` is the node's port",
        ],
        answerIndex: 1,
        explanation:
          "Clients hit the Service's `port`; the Service forwards to the pods' `targetPort`. Mixing them up gives a Service that exists but connects to nothing.",
      },
    ],
    drills: [
      {
        id: "d-ckad-w4-expose",
        instruction:
          "Expose deployment `web` as a Service on port 80, targeting container port 8080.",
        requiredPatterns: [
          "^(k|kubectl)\\s+expose\\s+deploy(ment)?\\s+web\\s",
          "--port[= ]80",
          "--target-port[= ]8080",
        ],
        sampleSolution: "kubectl expose deployment web --port=80 --target-port=8080",
      },
    ],
  },
  {
    stepId: "ckad-w4-ingress",
    questions: [
      {
        id: "q-ckad-w4-ingress-backend",
        prompt: "What does an Ingress rule's backend point at?",
        choices: [
          "A Deployment",
          "A Service name and port",
          "A pod IP",
          "A NodePort number",
        ],
        answerIndex: 1,
        explanation:
          "Ingress routes to Services, never directly to pods or Deployments. The chain is Ingress → Service → endpoints (pods).",
      },
      {
        id: "q-ckad-w4-pathtype",
        prompt: "What does `pathType: Prefix` with path `/cart` match?",
        choices: [
          "Only exactly `/cart`",
          "`/cart` and any path under it, like `/cart/items`",
          "Any path containing the substring `cart`",
          "Nothing unless a rewrite annotation exists",
        ],
        answerIndex: 1,
        explanation:
          "`Prefix` matches the path element-wise as a prefix; `Exact` matches only the literal path. The exam expects you to pick the right one for the wording.",
      },
    ],
    drills: [
      {
        id: "d-ckad-w4-ingress",
        instruction:
          "Imperatively scaffold an Ingress `web` routing `shop.example.com/cart` (prefix) to service `cart-svc` on port 80 (use --rule, quote it).",
        requiredPatterns: [
          "^(k|kubectl)\\s+create\\s+ingress\\s+web\\s",
          "--rule[= ][\"']?shop\\.example\\.com/cart\\*?=cart-svc:80",
        ],
        sampleSolution:
          "kubectl create ingress web --rule='shop.example.com/cart*=cart-svc:80'",
      },
    ],
  },
  {
    stepId: "ckad-w4-netpol",
    questions: [
      {
        id: "q-ckad-w4-netpol-default",
        prompt:
          "A NetworkPolicy has `podSelector: {}` and `policyTypes: [Ingress]` with no ingress rules. Effect?",
        choices: [
          "Allows all ingress to all pods in the namespace",
          "Denies all ingress to all pods in the namespace",
          "Denies all egress",
          "Does nothing without rules",
        ],
        answerIndex: 1,
        explanation:
          "Empty podSelector = every pod in the namespace; listing Ingress with no allow rules = nothing is allowed in. This is the standard default-deny building block.",
      },
      {
        id: "q-ckad-w4-netpol-combined",
        prompt:
          "In a `from:` entry, what changes when `podSelector` and `namespaceSelector` are in ONE list item vs two?",
        choices: [
          "Nothing",
          "One item = AND (that pod in that namespace); two items = OR (either matches)",
          "Two items are invalid YAML",
          "One item = OR, two items = AND",
        ],
        answerIndex: 1,
        explanation:
          "Selectors inside a single `from:` element are ANDed; separate elements are ORed. This exact subtlety decides whether your policy is narrow or wide open.",
      },
      {
        id: "q-ckad-w4-netpol-additive",
        prompt: "How do multiple NetworkPolicies selecting the same pod combine?",
        choices: [
          "The newest wins",
          "They are additive — traffic is allowed if ANY policy allows it",
          "They conflict and block everything",
          "Alphabetical priority",
        ],
        answerIndex: 1,
        explanation:
          "Policies are purely additive allowlists. Default-deny plus a narrow allow is the standard exam pattern precisely because of this.",
      },
    ],
  },
  {
    stepId: "ckad-w4-checkpoint",
    questions: [
      {
        id: "q-ckad-w4-cp-verify",
        prompt: "How do you prove your NetworkPolicy actually blocks the forbidden path?",
        choices: [
          "`kubectl describe networkpolicy` shows \"active\"",
          "Exec/run a pod that should be blocked and show the connection times out, then show the allowed pod connecting",
          "The policy's status field says Enforced",
          "Trust the YAML",
        ],
        answerIndex: 1,
        explanation:
          "Positive AND negative verification: `kubectl run tmp --rm -it --image=busybox -- wget --timeout=2 <svc>` from the wrong pod should fail, from the right pod should succeed.",
      },
      {
        id: "q-ckad-w4-cp-chain",
        prompt: "In your checkpoint, external traffic reaches the app through which chain?",
        choices: [
          "Ingress → Service → pod endpoints",
          "Service → Ingress → pod",
          "NodePort → NetworkPolicy → pod",
          "Ingress → pod directly",
        ],
        answerIndex: 0,
        explanation:
          "The Ingress controller terminates the route and forwards to the backend Service, which load-balances across Ready pod endpoints — with the NetworkPolicy gating what may talk to those pods.",
      },
    ],
  },

  // ── Week 5 ───────────────────────────────────────────────────────────────
  {
    stepId: "ckad-w5-probes",
    questions: [
      {
        id: "q-ckad-w5-live-vs-ready",
        prompt: "What happens when a liveness probe fails vs a readiness probe?",
        choices: [
          "Liveness: pod removed from Service endpoints. Readiness: container restarted",
          "Liveness: container restarted. Readiness: pod removed from Service endpoints",
          "Both restart the container",
          "Both delete the pod",
        ],
        answerIndex: 1,
        explanation:
          "Liveness failure = kubelet restarts the container. Readiness failure = pod stays running but stops receiving Service traffic. Picking the right probe for the symptom is the exam question.",
      },
      {
        id: "q-ckad-w5-startup",
        prompt: "What is a startup probe for?",
        choices: [
          "Replacing init containers",
          "Holding off liveness/readiness checks until a slow-starting app is up",
          "Probing the node at boot",
          "Warming DNS caches",
        ],
        answerIndex: 1,
        explanation:
          "Until the startup probe succeeds, the other probes are disabled — so a slow-booting app is not liveness-killed during startup.",
      },
      {
        id: "q-ckad-w5-probe-knobs",
        prompt:
          "A probe should first fire after 10s, then every 5s, and only fail after 3 misses. Which fields?",
        choices: [
          "`initialDelaySeconds: 10, periodSeconds: 5, failureThreshold: 3`",
          "`startAfter: 10, interval: 5, retries: 3`",
          "`delay: 10, repeat: 5, tolerance: 3`",
          "`timeoutSeconds: 10, periodSeconds: 5, successThreshold: 3`",
        ],
        answerIndex: 0,
        explanation:
          "initialDelaySeconds / periodSeconds / failureThreshold are the three timing knobs the exam asks for by name.",
      },
    ],
  },
  {
    stepId: "ckad-w5-debug",
    questions: [
      {
        id: "q-ckad-w5-logs-multi",
        prompt:
          "How do you read logs of container `sidecar` in pod `web-1`, including its previous crashed run?",
        choices: [
          "`kubectl logs web-1` twice",
          "`kubectl logs web-1 -c sidecar --previous`",
          "`kubectl describe pod web-1 -c sidecar`",
          "`kubectl exec web-1 -- cat /var/log`",
        ],
        answerIndex: 1,
        explanation:
          "Multi-container pods need `-c <name>`, and `--previous` shows the prior instance's output — the crashed container's last words.",
      },
      {
        id: "q-ckad-w5-pending",
        prompt: "A pod is stuck Pending. Which is NOT a usual suspect?",
        choices: [
          "Requests larger than any node's free capacity",
          "An unbound PVC",
          "A taint without a matching toleration",
          "A failing liveness probe",
        ],
        answerIndex: 3,
        explanation:
          "Probes only run once containers are started — Pending means the pod was never scheduled/started. Resources, PVCs and taints are the classic causes.",
      },
      {
        id: "q-ckad-w5-top",
        prompt: "Which command shows per-container CPU/memory usage for pods in `prod`?",
        choices: [
          "`kubectl top pod --containers -n prod`",
          "`kubectl describe quota -n prod`",
          "`kubectl get pods -o wide -n prod`",
          "`kubectl stats pods -n prod`",
        ],
        answerIndex: 0,
        explanation:
          "`kubectl top pod` (via metrics-server) is the exam's resource-usage tool; `--containers` breaks it down inside each pod.",
      },
    ],
    drills: [
      {
        id: "d-ckad-w5-logs",
        instruction:
          "Show the logs of the previous (crashed) run of container `app` in pod `web-1`.",
        requiredPatterns: [
          "^(k|kubectl)\\s+logs\\s+web-1\\s",
          "(-c|--container)[= ]app",
          "(--previous|-p)( |$)",
        ],
        sampleSolution: "kubectl logs web-1 -c app --previous",
      },
      {
        id: "d-ckad-w5-top",
        instruction:
          "Show resource usage of pods in namespace `prod`, broken down by container.",
        requiredPatterns: [
          "^(k|kubectl)\\s+top\\s+pods?\\s",
          "--containers",
          "(-n|--namespace)[= ]prod",
        ],
        sampleSolution: "kubectl top pod --containers -n prod",
      },
    ],
  },
  {
    stepId: "ckad-w5-deprecations",
    questions: [
      {
        id: "q-ckad-w5-apiversion",
        prompt:
          "A manifest fails with \"no matches for kind Ingress in version extensions/v1beta1\". Fix?",
        choices: [
          "Downgrade the cluster",
          "Update `apiVersion` to `networking.k8s.io/v1` and adjust the spec to the current schema",
          "Add `--validate=false`",
          "Change kind to Service",
        ],
        answerIndex: 1,
        explanation:
          "The API group moved. `kubectl explain ingress` / `kubectl api-resources` show the served version; the exam expects you to migrate the manifest, not fight the cluster.",
      },
      {
        id: "q-ckad-w5-find-version",
        prompt: "Which command tells you the current apiVersion for a resource kind?",
        choices: [
          "`kubectl api-resources` (or `kubectl explain <kind>`)",
          "`kubectl version`",
          "`kubectl get apiversion <kind>`",
          "`cat /etc/kubernetes/versions`",
        ],
        answerIndex: 0,
        explanation:
          "`kubectl api-resources` lists kinds with their group/version; `kubectl explain <kind>` shows it too plus the schema. Both are exam-legal and fast.",
      },
    ],
  },
  {
    stepId: "ckad-w5-checkpoint",
    questions: [
      {
        id: "q-ckad-w5-cp-triage",
        prompt: "What is the efficient triage order for a broken app?",
        choices: [
          "logs → describe → events → config",
          "describe (events) → logs → exec/config, without dithering",
          "Delete the pod and hope",
          "Check node kernel logs first",
        ],
        answerIndex: 1,
        explanation:
          "`kubectl describe pod` names most problems in Events (image, probe, config, scheduling). Logs come next for app-level crashes; exec/config checks last.",
      },
      {
        id: "q-ckad-w5-cp-imagepull",
        prompt: "ImagePullBackOff on a private image usually means what on the CKAD?",
        choices: [
          "The registry is down",
          "Wrong image name/tag, or a missing imagePullSecret",
          "The node has no disk",
          "The pod needs more CPU",
        ],
        answerIndex: 1,
        explanation:
          "Check the exact image reference first, then whether the pod/ServiceAccount references the right `imagePullSecrets`.",
      },
    ],
  },

  // ── Week 6 ───────────────────────────────────────────────────────────────
  {
    stepId: "ckad-w6-sim",
    questions: [
      {
        id: "q-ckad-w6-killer",
        prompt: "How should you use your first Killer.sh session?",
        choices: [
          "As a pass/fail verdict on booking",
          "As a diagnostic: the list of fumbled tasks becomes your re-drill syllabus",
          "Skip it and save both for exam week",
          "Only read the solutions",
        ],
        answerIndex: 1,
        explanation:
          "Killer.sh is deliberately harder than the real exam. The score matters less than the fumble list — that list is your plan for the remaining time.",
      },
      {
        id: "q-ckad-w6-partial",
        prompt: "Why is flag-and-move-on the right discipline in a 2-hour, ~16-task exam?",
        choices: [
          "Unanswered tasks are scored higher later",
          "Partial credit exists, so breadth beats sinking 20 minutes into one stubborn task",
          "The proctor requires it",
          "Tasks unlock sequentially",
        ],
        answerIndex: 1,
        explanation:
          "Every task attempted with partial credit beats one perfect task and three untouched ones. Flag the stinker, bank the easy marks, come back.",
      },
    ],
  },
  {
    stepId: "ckad-w6-final",
    questions: [
      {
        id: "q-ckad-w6-docs",
        prompt: "Which references are allowed during the CKAD?",
        choices: [
          "Any website",
          "kubernetes.io docs + blog and the Helm docs, in one extra browser tab",
          "Your own notes PDF",
          "Stack Overflow only",
        ],
        answerIndex: 1,
        explanation:
          "One extra tab, official docs only. Practising fast doc navigation (probes, NetworkPolicy, Jobs pages) is a real, scored skill.",
      },
      {
        id: "q-ckad-w6-firstmins",
        prompt: "What should the first two minutes of the exam look like?",
        choices: [
          "Read all questions end to end",
          "Set up alias/exports/completion, then per task always check context and namespace before touching anything",
          "Open every docs page you might need",
          "Start with the highest-weight task",
        ],
        answerIndex: 1,
        explanation:
          "The speed environment pays for itself across every task; the context/namespace check prevents the silent zero of solving in the wrong place.",
      },
    ],
  },
  {
    stepId: "ckad-w6-book",
    questions: [
      {
        id: "q-ckad-w6-when",
        prompt: "When does the plan say to book the exam?",
        choices: [
          "After Week 1 for motivation",
          "When every readiness-bar light is on — not before, not long after",
          "Only after a perfect Killer.sh score",
          "Whenever a discount appears",
        ],
        answerIndex: 1,
        explanation:
          "The readiness bar encodes the plan's definition of ready. Booking too early wastes the attempt; waiting too long wastes the peak.",
      },
      {
        id: "q-ckad-w6-validity",
        prompt: "How long is the CKAD certification valid, and what if you fail?",
        choices: [
          "1 year, no retake",
          "2 years, and your fee includes one free retake",
          "5 years, paid retakes",
          "Lifetime",
        ],
        answerIndex: 1,
        explanation:
          "Valid 2 years; one free retake is included. That safety net is another reason to book once the bar is lit rather than over-preparing.",
      },
    ],
  },

  // ── Drills ───────────────────────────────────────────────────────────────
  {
    stepId: "ckad-hy-drills",
    questions: [
      {
        id: "q-ckad-hy-priority",
        prompt: "Why over-practise this specific list?",
        choices: [
          "They are the only topics on the exam",
          "They recur in some form again and again — reflex here is the best marks-per-hour investment",
          "They are the hardest topics",
          "Killer.sh only tests these",
        ],
        answerIndex: 1,
        explanation:
          "Sidecars, probes, config wiring, rollouts, Helm, Ingress and NetworkPolicies are the CKAD's greatest hits. Reflex on these frees time for the genuinely novel tasks.",
      },
      {
        id: "q-ckad-hy-reflex",
        prompt: "What does \"reflex\" mean as the bar for checking these off?",
        choices: [
          "You have done each once",
          "You can do each quickly, from memory, without docs — and verify the result",
          "You can explain the theory",
          "You bookmarked the docs page",
        ],
        answerIndex: 1,
        explanation:
          "From memory, fast, verified. If any drill still needs the docs, it is not yet a tick — repeat it tomorrow.",
      },
    ],
    drills: [
      {
        id: "d-ckad-hy-do",
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
        id: "d-ckad-hy-scale",
        instruction: "Scale deployment `web` to 5 replicas.",
        requiredPatterns: [
          "^(k|kubectl)\\s+scale\\s+deploy(ment)?/web\\s+--replicas[= ]5$|^(k|kubectl)\\s+scale\\s+deploy(ment)?\\s+web\\s+--replicas[= ]5$",
        ],
        sampleSolution: "kubectl scale deployment web --replicas=5",
      },
    ],
  },
];
