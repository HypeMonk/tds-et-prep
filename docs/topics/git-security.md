# Git, security & practices — 60-second sheets

<div class="tx-meta" markdown>

~6 min total · 5 concepts · Last-minute revision layer — [full: W1](../weeks/week-1.md) + [W7](../weeks/week-7.md)

</div>

---

## Git — the daily loop

```
Working dir --add--> Staging --commit--> Local repo --push--> GitHub
```

| Command | Shows |
|---|---|
| `git status` | Which files changed |
| `git diff` | What lines changed |
| `git log` | History |
| `git show` | One commit in detail |

!!! warning "Trap — git diff after add shows nothing"
    `git diff` compares working dir to **staging area**. After `git add`, it's
    empty. Use `git diff --staged`.

??? question "Practice: Correct sequence to save and upload?"
    `git add` → `git commit` → `git push`. Always. → [T3-FN Q23](../pyqs/t3-2025-fn.md#q23-the-save-and-upload-sequence)

---

## Merge conflicts + pull requests

**Merge conflict:** two people edit the same line on different branches. Git marks it (`<<<<<<<` / `>>>>>>>`), a human resolves it manually.

**Pull request:** a conversation about a merge — reviewers see the diff, comment, approve before merging.

??? question "Practice: Two people edit the same line. What happens on merge?"
    **Git creates a merge conflict** that must be resolved manually.
    → [T3-FN Q24](../pyqs/t3-2025-fn.md#q24-the-merge-conflict)

---

## Secrets — the .env workflow

```bash
# .env (never committed)
API_KEY=sk-...

# .gitignore (add BEFORE first commit)
.env
```

```python
# load in code
key = os.getenv("API_KEY")
```

!!! danger "Wrong belief — 'I'll push it now and remove it later'"
    Once pushed, the secret is in **git history forever** — clones, forks,
    scrapers. Bots scan for keys within minutes.

??? question "Practice: Which files go into .gitignore?"
    **`.env` and any file containing secrets/credentials.** Documentation and
    dependency lists do NOT. → [T1-AN Q5](../pyqs/t1-2026-an.md#q5-what-goes-into-gitignore)

---

## Race conditions — the simultaneous write

Two users sign up with the same username at the same millisecond. Without locking:
1. Both availability checks pass simultaneously
2. Both writes proceed
3. **Duplicate records or an exception**

**The fix:** make check-and-write atomic — a database lock or a unique constraint.

??? question "Practice: What happens without locking on simultaneous signups?"
    **Both checks pass, both create the user.** → [T1-FN Q16](../pyqs/t1-2026-fn.md#q16-the-username-race-condition)

---

## Dependency management — the middle path

**Pin versions** (`pandas==2.2.0`) for reproducibility. **Test upgrades separately** before applying. **Never** auto-upgrade everything or freeze forever.

!!! success "The professional answer to every dependency question"
    - Vulnerable old version + breaking new version?
      → **Assess severity, test in staging, plan migration**
    - New version with bug fixes?
      → **Document current, test new separately, upgrade if compatible**

    Both extremes (immediately upgrade / never touch) are wrong in every paper.

??? question "Practice: Why pin dependencies?"
    **Reproducible pipelines** — prevents updates from breaking code. Same install
    works tomorrow. → [T1-AN Q14](../pyqs/t1-2026-an.md#q14-why-pin-dependencies)


---

## Release security — what CI/CD must get right

*Official topic 3: CI/CD & Release Security.*

**1 · Untrusted code never sees deploy credentials.** Anyone can open a PR — so **PR code is untrusted code**. Tests on a fork PR run with **zero secrets**; deploy credentials only flow to trusted triggers (push/merge to `main` by maintainers).

!!! success "Must remember — the trust of the trigger gates the secrets it sees"
    Fork-PR CI runs: tests execute, **zero secrets** are visible. Maintainer
    merges: deploy credentials may flow. The trust level of the *event* decides
    the privilege of the *run*.

!!! warning "Trap — the exfiltrating PR"
    A "test" that prints environment variables into the build log, or curls them
    to an external URL. If CI secrets were visible to PR runs, they're gone.
    Same defense as prompt injection: **untrusted input never reaches privileged
    capabilities.**

**2 · Supply-chain hardening.** Every dependency is attack surface you accepted:

- **Pin exact versions + lockfile** — no `latest`, no loose `flask>=2`
- **Verify hashes** — install what was reviewed, not what resolves today
- **Review dependency diffs in CI** — not just your own code
- **Fewer dependencies** — minimal surface

**3 · Reviewing risky infra changes.** A one-line Terraform change can open a database to the internet — infra blast radius is the whole system. Infra changes go through PR review with the **plan/diff visible** (what will this *do*?); anything touching security groups, credentials, or permissions gets a second, informed pair of eyes.

**4 · Safe progressive rollouts.** Deploy is a slope, not a switch:

```
canary (1-5%) -> staged (25% -> 50% -> 100%) -> full
```

!!! success "Must remember — what a canary buys you"
    Each rollout step watches health **rates** (error rate, p95 — not raw counts)
    and **auto-rolls-back on regression**. A bad deploy then hurts 5% of users
    for two minutes, not everyone for an hour.

→ Full treatment: [Week 7 — release security](../weeks/week-7.md#release-security-four-things-cicd-must-get-right)

---

## Safe git history changes — rewriting is surgery

*Official topic 5: Web/API/Infra Fundamentals.*

**When history must change:** a secret was committed, a giant file bloats the repo, garbage commits before going public.

**The safe procedure:**

1. **Rotate first if a secret was pushed** — it was leaked the moment it left your machine; rewriting history does not un-leak it
2. **Rewrite on a branch, review, then:**

```bash
git filter-repo --path .env --invert-paths
git push --force-with-lease        # not plain --force
```

3. **Coordinate** — everyone rebases after the rewrite; announce it or spend a day untangling diverged histories

!!! success "Must remember — force-with-lease over force"
    `--force-with-lease` refuses to overwrite if someone pushed in the meantime —
    history rewrites are the one place a plain force-push silently destroys
    teammates' work.

!!! warning "Trap — \"I deleted the file, so the secret is gone\""
    Deleting the file in a new commit leaves it in every previous commit — still
    cloneable by anyone. Only rewrite + rotation fix it.

!!! info "What rewriting costs"
    Every commit hash from the rewrite point back changes — tags, open PRs, and
    local clones reference dead IDs. Hence: rare, announced, surgical.

→ Full treatment: [Week 2 — safe git history changes](../weeks/week-2.md#safe-git-history-changes-rewriting-is-surgery)
