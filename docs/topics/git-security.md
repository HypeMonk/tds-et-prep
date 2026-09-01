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
