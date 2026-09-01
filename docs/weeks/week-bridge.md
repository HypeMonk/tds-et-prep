# Bridge course (Week 0) — the foundations

<div class="tx-meta" markdown>

~8 min read · Examinable: 🔥 (assumed knowledge — basics woven into every scenario) · GA0 · GA1

</div>

The bridge course covers fundamentals the exam treats as assumed knowledge: terminal navigation, file operations, virtual environments, HTTP basics, and git fundamentals. You won't see standalone "what is `cd`" questions, but these skills appear inside every scenario.

Course files: installation · file structure · path reading · terminal navigation · basic scripting · virtual environments · uv workflow · VS Code setup · HTTP fundamentals · API testing with curl · Chrome DevTools · git basics · GitHub SSH login.

---

## The terminal — navigation and file operations

```bash
pwd              # where am I?
ls -la           # what's here? (all files, details)
cd ~/projects    # go to a directory
mkdir new-dir    # create a directory
touch file.txt   # create an empty file
cp src dst       # copy
mv old new       # move / rename
rm file          # delete
```

**The exam connection:** these appear inside scenario questions — "the student navigates to the project directory and runs..." You're expected to read them fluently, not be tested on them directly.

---

## Virtual environments and uv — Python dependency isolation

**The problem:** project A needs pandas 2.0, project B needs pandas 1.5. Installing both globally breaks one of them.

**The solution:** virtual environments — isolated Python installations per project. `uv` handles this automatically:

```bash
uv init my-project    # create a project
uv add requests       # add a dependency (creates .venv automatically)
uv run script.py      # run in the project's environment
```

**The exam connection:** this is the same reproducibility concept as Docker's `requirements.txt` and pinned dependencies — **same code, same environment, everywhere**.

---

## HTTP fundamentals — the request-response model

```
Client (browser/curl/Python) → HTTP Request → Server → HTTP Response → Client
```

Every request has: a **method** (GET/POST/PUT/DELETE), a **URL**, **headers**, and optionally a **body**.
Every response has: a **status code**, **headers**, and a **body**.

**curl** — the terminal's HTTP client for testing APIs:

```bash
curl https://api.example.com/data                    # GET
curl -X POST -H "Content-Type: application/json" \
     -d '{"key": "value"}' \
     https://api.example.com/data                   # POST with JSON
```

**The exam connection:** the entire HTTP status-code family (200/401/403/404/429/500) lives here — tested in every paper.

---

## Chrome DevTools — seeing what the browser does

**What it's for:** inspecting network requests, viewing JavaScript console output, examining the DOM, profiling performance.

**The exam connection:** DevTools is where you'd *see* a CORS error in real life — the browser console shows the blocked request. Knowing it exists connects the theory to the debugging.

→ GA0: `use-devtools` · GA1: `use-devtools`

---

## Git basics — the daily commands

The bridge course covers the same git workflow as Week 1, at a gentler pace:

```bash
git init              # start tracking a directory
git add .             # stage everything
git commit -m "msg"   # save a snapshot
git push origin main  # upload to GitHub
git pull origin main  # download and merge
```

Full treatment with the exam questions: [Week 1 — Git](week-1.md#git-the-exams-workflow-questions).

---

## What GA0 tests (the practice questions)

GA0 has 25 questions covering a mix of old-style fundamentals and ET-flavored theory:
- **Chart reading** (axis-scale manipulation, what does this chart claim)
- **Binary evaluation rubric** (how to grade a model's output)
- **Property-based testing** (Hypothesis invariants — [T1-AN Q10](../pyqs/t1-2026-an.md#q10-property-based-testing-invariant))
- **Unicode, CSS selectors, JSON sorting, SQL averages** (classic TDS GA1 topics)
- **DevTools, GitHub, GitHub Actions** (tool identification)

GA0 is effectively a **mini-ET in disguise** — its chart-reading and property-based-testing questions match the theory-question style the exam uses.
