# Week 1 — Tools & fundamentals

<div class="tx-meta" markdown>

~20 min read · Examinable: 🔥🔥 (every paper asks these) · GA1 · [ET-2 session](../sessions/et-02.md)

</div>

The foundation week — git, bash, SQLite, HTTP clients, data formats, VS Code, and GitHub Pages. The exam treats these as assumed knowledge woven into scenarios rather than standalone deep-dives, but the **git workflow, HTTP status codes, and data format questions appear in every paper**.

Course files: VS Code (basics + advanced) · uv · bash scripting · git/GitHub · SQLite · HTTP clients · Requestly · data formats · GitHub Pages · LaTeX.

---

## Git — the exam's workflow questions

### The daily loop

```
Working directory --git add--> Staging area --git commit--> Local repo --git push--> GitHub
                    ←---- git fetch / pull ----
```

**The inspection family** (the ET-2 "safety goggles" — wear them before the welding of commit and push):

| Command | What it shows | When to use |
|---|---|---|
| `git status` | Which files changed, staged, untracked | Before every commit |
| `git diff` | What lines changed (working dir vs last commit) | Before every commit |
| `git log` | History — authors, timestamps, messages | Finding when something broke |
| `git show` | One commit's changes in detail | Investigating a single change |

!!! warning "Trap — git diff after git add"
    `git diff` compares the working directory to the **staging area** by default.
    After `git add`, it shows *nothing* — your changes are staged. Use
    `git diff --staged` to see what's about to be committed.

### The save-and-upload sequence

The exam asks this as a direct ordering question ([T3-FN Q23](../pyqs/t3-2025-fn.md#q23-the-save-and-upload-sequence)):

```
git add → git commit → git push
```

Always in that order. The pipeline is one-directional: working directory → staging → local history → remote. Pushing before committing sends nothing; committing before staging commits an empty snapshot.

### Branching and the merge conflict

```bash
git checkout -b feature-analysis   # create + switch in one command
git pull origin main               # get latest main into your branch
```

**What a merge conflict is:** two team members modify the same line on different branches. Git doesn't know which change is correct — it's a genuine ambiguity no algorithm should resolve silently. Git pauses the merge, marks the file (`<<<<<<<` / `=======` / `>>>>>>>`), and a human edits the file to the intended truth, then commits the resolution.

### Why pull requests exist

A PR is a **conversation about a merge**: reviewers see the diff, comment, request changes, and the branch merges only when approved. It's how a team shares responsibility for what enters `main` — making "production-ready" mean something.

<div class="tx-anchor" markdown>

**Asked in 6 places:** [T3-FN Q3 — git diff](../pyqs/t3-2025-fn.md#q3-git-diff) · [T3-FN Q23 — the sequence](../pyqs/t3-2025-fn.md#q23-the-save-and-upload-sequence) · [T3-FN Q24 — merge conflicts](../pyqs/t3-2025-fn.md#q24-the-merge-conflict) · [T3-FN Q25 — git pull](../pyqs/t3-2025-fn.md#q25-getting-the-latest-main) · [T3-FN Q26 — why PRs](../pyqs/t3-2025-fn.md#q26-why-pull-requests-exist) · [T3-FN Q27 — branching](../pyqs/t3-2025-fn.md#q27-creating-a-feature-branch) · GA1

</div>

---

## SQLite — one database, one file

**What it is:** a complete SQL database engine inside a single `.db` file. No server process, no installation daemon, no configuration — just a file you can query, copy, and share.

```bash
sqlite3 students.db     # opens (or CREATES) the database
```

!!! success "The auto-create behaviour (a direct exam question)"
    If `students.db` doesn't exist, SQLite **creates a new empty database file**
    on open — it doesn't throw "File Not Found." This is zero-configuration by
    design. But it cuts both ways: **typo the database name and SQLite silently
    gives you a brand-new empty database** instead of the data you wanted.
    → [T1-AN Q3](../pyqs/t1-2026-an.md#q3-sqlite-startup-behaviour)

### When to use SQLite vs a server database

| SQLite | PostgreSQL |
|---|---|
| Scraping data, course projects, local APIs | Many machines/users writing simultaneously |
| Small dashboards, RAG metadata | Production multi-user systems |
| Portable — it's just a file | Server process, network access |

### The SQL the exam expects you to read

You won't write SQL in the exam, but you'll reason about it:

```sql
SELECT AVG(latency) FROM logs;         -- NULLs are skipped, not zeroed
SELECT * FROM orders WHERE status = 'late';
SELECT cuisine, AVG(rating) FROM reviews GROUP BY cuisine;
```

!!! warning "Trap — NULL handling in aggregates"
    `AVG`, `SUM`, and `COUNT(column)` **skip NULL values** — the average of
    `[10, 20, NULL]` is 15, not 10. `COUNT(*)` counts every row;
    `COUNT(latency)` counts only non-NULL values. This distinction is a
    favourite exam trick. → [T1-AN Q11](../pyqs/t1-2026-an.md#q11-avg-over-nulls-in-duckdb)

<div class="tx-anchor" markdown>

**Asked in:** [T1-AN Q3 — the auto-create](../pyqs/t1-2026-an.md#q3-sqlite-startup-behaviour) · [T1-AN Q11 — NULL in AVG](../pyqs/t1-2026-an.md#q11-avg-over-nulls-in-duckdb) · [T3-AN Q25 — JSON access patterns](../pyqs/t3-2025-an.md#q25-reading-the-json-response) · GA1

</div>

---

## HTTP clients — how APIs are called

**The request structure:**

```
METHOD URL HTTP/1.1        ← e.g. GET https://api.example.com/data
Headers                    ← Authorization, Content-Type
Body                       ← JSON payload (for POST/PUT)
```

**The response structure:**

```
Status code                ← 200, 404, 500...
Headers                    ← Content-Type, Cache-Control
Body                       ← JSON, text, file
```

### The status codes you must know cold

| Code | Meaning | The debugging action |
|---|---|---|
| **200** | OK — success | — |
| **401** | Unauthorized — *who are you?* | Check your API key |
| **403** | Forbidden — *you can't do this* | Check permissions |
| **404** | Not found | Check the URL |
| **429** | Rate limit — *slow down* | Wait, retry with backoff |
| **500** | Server error — *their problem* | Check backend code and database |

The 401 vs 403 distinction is the exam's favourite: **identity vs permission**. A locked door with no key (401) vs a key that doesn't fit this lock (403).

### requests — the Python HTTP client

```python
import requests
response = requests.get("https://api.example.com/data")
response.text     # raw string
response.json()   # parsed dictionary — you can do data["key"]
```

!!! warning "Trap — .text vs .json()"
    `.text` gives you the raw string; `.json()` parses it into a Python dict.
    After `.json()` you can index; after `.text` you can't. And `json.loads`
    requires **double quotes** — `json.loads("{'score': 10}")` crashes.
    → [T1-AN Q7](../pyqs/t1-2026-an.md#q7-requests-text-vs-json)

### Rate limits — the professional pattern

10 calls against a 60/minute limit *feels* safe, but limits are often per rolling window and shared across keys. The pattern: **throttle with `sleep()` between requests + handle errors + retry on 429 with backoff**. → [T3-AN Q26](../pyqs/t3-2025-an.md#q26-respecting-the-rate-limit)

<div class="tx-anchor" markdown>

**Asked in 8+ places:** [T1-AN Q7 — .text vs .json()](../pyqs/t1-2026-an.md#q7-requests-text-vs-json) · [T1-FN Q4 — response.json()](../pyqs/t1-2026-fn.md#q4-responsejson) · [T3-AN Q4 — the 401](../pyqs/t3-2025-an.md#q4-http-401) · [T3-FN Q4 — the 429](../pyqs/t3-2025-fn.md#q4-http-429) · [T3-AN Q23 — the HTTP library](../pyqs/t3-2025-an.md#q23-the-http-library) · [T3-AN Q26 — rate limits](../pyqs/t3-2025-an.md#q26-respecting-the-rate-limit) · [T3-AN Q27 — the 401 in a scenario](../pyqs/t3-2025-an.md#q27-the-401-diagnosis) · [T1-FN Q28 — debugging the 500](../pyqs/t1-2026-fn.md#q28-debugging-the-500)

</div>

---

## Data formats — which tool for which job

| Format | Best for | The exam angle |
|---|---|---|
| **JSON** | API responses, data exchange | Double quotes required; `weather[0]` for arrays |
| **YAML** | Configuration, GitHub Actions | **Spaces not tabs** — indentation is the syntax |
| **Markdown** | Documentation, READMEs | Converts to HTML; lightweight + human-readable |
| **Parquet** | Large numeric arrays, analytics | **Columnar** — the "odd one out" in efficiency questions |
| **CSV** | Sharing with non-technical stakeholders | Opens in Excel; the lowest common denominator |

!!! success "Must remember — the format family"
    - **JSON vs Python dict:** JSON requires double quotes; Python allows single.
      `json.loads("{'key': 1}")` throws `JSONDecodeError`.
    - **YAML indentation:** spaces, never tabs — mixing them produces parse errors.
    - **Parquet vs text formats:** XML/JSON/CSV are all text-based; Parquet is
      columnar binary — the efficiency answer when grouped against the others.
    - **CSV for humans:** when the audience is non-technical, CSV wins because
      it opens in Excel with zero friction.

<div class="tx-anchor" markdown>

**Asked in:** [T1-AN Q2 — YAML formatting](../pyqs/t1-2026-an.md#q2-yaml-formatting) · [T1-AN Q4 — Parquet vs CSV](../pyqs/t1-2026-an.md#q4-why-parquet-beats-csv) · [T3-AN Q2 — Markdown](../pyqs/t3-2025-an.md#q2-markdowns-purpose) · [T3-FN Q2 — Parquet for arrays](../pyqs/t3-2025-fn.md#q2-parquet-for-large-arrays) · [T3-FN Q20 — CSV for stakeholders](../pyqs/t3-2025-fn.md#q20-sharing-results-with-non-technical-stakeholders) · GA1

</div>

---

## Bash — the commands the exam expects

### File operations

```bash
ls -a          # list all files including hidden (dotfiles)
ls -lh         # human-readable sizes (-h is NOT "hidden"!)
cat file.txt   # print file contents
cp src dst     # copy
mv old new     # move / rename
rm file        # delete
mkdir dir      # create directory
```

!!! warning "Trap — ls -h vs ls -a"
    `-h` means **human-readable sizes** ("4.0K" not "4096"). `-a` means **all**
    (including dotfiles). The letters look like they should mean what they don't.
    → [T3-AN Q3](../pyqs/t3-2025-an.md#q3-listing-hidden-files)

### Redirection — the pipes and arrows

```bash
command > file     # stdout to file (replaces)
command >> file    # stdout to file (appends)
command 2> file    # stderr to file
command 2>&1       # stderr merged into stdout
command | filter   # pipe stdout to another command
```

`>` redirects **stdout only** and **truncates the file first**. The distinction matters in pipelines: errors go to stderr so they *don't* pollute your data file. → [T1-AN Q6](../pyqs/t1-2026-an.md#q6-shell-redirection)

### The pipeline philosophy

Bash excels at **gluing commands together**: download → filter → transform → run script → save logs → schedule. Small commands + pipes + files + automation. Every Linux server, Docker container, and CI runner gives you a shell.

<div class="tx-anchor" markdown>

**Asked in:** [T3-AN Q3 — hidden files](../pyqs/t3-2025-an.md#q3-listing-hidden-files) · [T1-AN Q6 — shell redirection](../pyqs/t1-2026-an.md#q6-shell-redirection) · GA1

</div>

---

## GitHub Pages — static hosting only

Serves HTML, CSS, images, and client-side JavaScript. **No server-side runtime, no database.** You cannot host a FastAPI backend on it — form submissions have nothing to receive them. The correct architecture: static frontend on Pages, backend on a real runtime.

→ [T1-FN Q3](../pyqs/t1-2026-fn.md#q3-fastapi-on-github-pages) — the exam asks this as a scenario

---

## uv — Python's modern package manager

The course teaches `uv` as the default Python tool: `uv init`, `uv add`, `uv run`. It's faster than pip and handles virtual environments automatically. For the exam, what matters is the concept: **dependencies are declared, installed reproducibly, and pinned** — same idea as Docker's `requirements.txt`.

---

## Self-check — can you answer these without looking?

??? question "1. What's the correct git sequence to save and upload your work?"
    `git add` → `git commit` → `git push`. The pipeline is one-directional:
    working directory → staging → local history → remote.

??? question "2. Two teammates edit the same line on different branches. What happens on merge?"
    Git creates a **merge conflict** marked with `<<<<<<<` / `=======` / `>>>>>>>`.
    A human resolves it manually and commits the resolution.

??? question "3. You run `sqlite3 new.db` and the file doesn't exist. What happens?"
    SQLite **creates a new empty database** — no error. This is why typos in the
    filename give you an empty database instead of your data.

??? question "4. What's the difference between `response.text` and `response.json()`?"
    `.text` returns the raw string. `.json()` parses it into a Python dictionary
    you can index with `data["key"]`.

??? question "5. Why does `json.loads(\"{'score': 10}\")` fail?"
    JSON requires **double quotes** for keys and string values. Single quotes are
    Python dict syntax, not JSON.

??? question "6. What does `ls -h` do — show hidden files?"
    No — `-h` gives **human-readable file sizes**. `-a` shows hidden files.
