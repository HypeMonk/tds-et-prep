# Mock-1 — full paper, official pattern

<div class="tx-meta" markdown>

**80 marks · 90 minutes** · Section 1: 30 MCQ/MSQ, 39 marks · Section 2: 9 short answers, 41 marks · [Answer key at the bottom](#answer-key)

</div>

!!! warning "Simulate the real thing"
    Set a timer for **90 minutes**. Budget roughly **40–45 minutes for Section 1** and
    **45–50 minutes for Section 2** — the written half is worth more than half the
    paper, so don't let MCQs eat into it. There is no negative marking: answer
    everything. Write each Section-2 answer (max ~200 words) before scrolling to
    the answer key.

---

## Section 1 · MCQ / MSQ — 39 marks

*30 questions · 21 one-mark + 9 two-mark · ~40–45 minutes · MSQs are marked "pick all correct"*

### A · Systems, APIs, Networking & Deployment

### M1

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Systems: CORS**

A React app on `http://localhost:3000` calls an API on `http://localhost:8000`. The browser console shows a CORS error. Who must change for this to work?

- **A.** The backend — it must send `Access-Control-Allow-Origin` permitting the frontend's origin
- **B.** The frontend — it must add a CORS header to its fetch call
- **C.** Both — CORS requires changes on both sides
- **D.** Neither — the browser must be launched with security disabled

</div>

### M2

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Systems: HTTP**

An API call returns HTTP **500**. Where should you look first?

- **A.** The frontend JavaScript
- **B.** The backend code and its database
- **C.** The browser cache
- **D.** The DNS settings

</div>

### M3

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Systems: HTTP clients**

`response.text()` vs `response.json()` in Python's `requests` — the difference:

- **A.** `.text` is faster; `.json` is more accurate
- **B.** `.text` works only for HTML; `.json` works for everything
- **C.** `.text` returns a string; `.json` parses the body as JSON and raises on invalid JSON
- **D.** They are interchangeable

</div>

### M4

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · Systems: Docker**

A Dockerfile contains `EXPOSE 8000`. The service is still unreachable from the host. Why?

- **A.** `EXPOSE` publishes nothing — you need `-p 8000:8000` on `docker run`
- **B.** The port must also be opened in the cloud firewall first
- **C.** `EXPOSE` only works for HTTP services
- **D.** The image must be rebuilt after adding `EXPOSE`

</div>

### M5

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · Systems: APIs — MSQ, pick all correct**

Your FastAPI endpoint receives a payload where `quantity` arrives as the string `"5"`. With a Pydantic model declaring `quantity: int`, which statements are true?

- **A.** Pydantic converts `"5"` to the integer `5` and the request succeeds
- **B.** Pydantic guarantees the value is a *valid* quantity for your business logic
- **C.** A payload missing the `quantity` field is rejected with a validation error before your code runs
- **D.** Validation happens at the boundary, so downstream code can trust the type

</div>

### M6

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · Systems: Deployment**

A teammate's script works on their laptop but crashes on the server with `ModuleNotFoundError`. The most professional fix:

- **A.** Install the missing module manually on the server each time it crashes
- **B.** Switch the server to the same OS as the laptop
- **C.** Copy the teammate's entire Python folder to the server
- **D.** Ship a pinned `requirements.txt` and install from it in deployment

</div>

### M7

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Systems: Concurrency**

`asyncio.gather` runs 5 API calls concurrently: four take 1s, one takes 8s. Total time:

- **A.** 8 seconds
- **B.** 5 seconds
- **C.** 12 seconds
- **D.** Depends on the GIL

</div>

### M8

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Systems: API design**

Why is POST the right method for an ML inference endpoint?

- **A.** POST responses are cached better
- **B.** POST is faster for JSON
- **C.** The payload goes in the request body — no URL length limits, no exposure in logs, auth headers supported
- **D.** GET cannot return JSON

</div>

### B · Observability, Monitoring & Data Integrity

### M9

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · Observability: Shell**

You run `grep -r "TODO"` with no file argument. The terminal appears to hang. What's happening?

- **A.** The search is running very slowly
- **B.** grep is waiting on standard input — no search origin was given
- **C.** grep crashed and must be killed
- **D.** The directory has no matching files

</div>

### M10

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Observability: Data formats**

You query a 20-column analytics table but only ever read 3 columns. Best storage format:

- **A.** CSV — universal compatibility
- **B.** JSON — structured
- **C.** Parquet — columnar, so you read only the 3 columns' bytes
- **D.** XML — schema validation

</div>

### M11

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Observability: Monitoring**

Production is misbehaving intermittently. The first thing good observability gives you:

- **A.** A faster CPU
- **B.** Fewer users, so fewer failures
- **C.** Automatic bug fixes
- **D.** Logs, metrics and traces that show *where* in the stack the failure lives

</div>

### M12

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · Observability: Data integrity — MSQ, pick all correct**

Before joining two datasets on a timestamp, which checks protect the result's integrity?

- **A.** Confirm both timestamps are in the same timezone (or convert first)
- **B.** Check the freshness of each source — when was each last updated?
- **C.** Rename the columns to match
- **D.** Look for duplicate keys that would multiply rows after the join

</div>

### M13

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · Observability: Data integrity**

Two datasets record the "same" event — one in IST, one in UTC, both without timezone markers. After joining on timestamp, ~2% match. The likeliest cause:

- **A.** Random data loss
- **B.** The join key is a string
- **C.** The 5.5-hour offset — identical labels refer to different instants
- **D.** One dataset is sorted

</div>

### M14

<div class="tx-question" markdown>

**🔴 Hard · 2 marks · Observability: Measurement**

A daily ETL job changes its extraction window. The next day, a dashboard metric drops 30%, and the operations team reports nothing changed in reality. The most useful first check:

- **A.** Reinstall the dashboard
- **B.** Average the two days and move on
- **C.** Ask the operations team to recheck reality
- **D.** Compare the job's extraction window and row counts before vs after the change — the measurement changed, not the world

</div>

### M15

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · Observability: ETL**

Why does a well-designed ETL job reprocess a lookback window with deduplication?

- **A.** To make the job run longer and use idle compute
- **B.** To avoid needing a primary key
- **C.** Because the database requires it
- **D.** To catch late-arriving or updated records while keeping each event exactly once

</div>

### C · CI/CD, Infrastructure & Security

### M16

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · CI/CD: Secrets**

When should `.gitignore` list `.env`?

- **A.** After the first commit, so the file history is preserved
- **B.** Before anything is committed — tracked files are never ignored
- **C.** `.gitignore` cannot exclude `.env` files
- **D.** Only in public repositories

</div>

### M17

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · CI/CD: Secrets**

A real API key was pushed to a public repo an hour ago. First action:

- **A.** Delete the file and commit again
- **B.** Nothing — an hour is too short to matter
- **C.** Make the repo private
- **D.** Rotate (revoke + regenerate) the key at the provider, then clean the history

</div>

### M18

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · CI/CD: Shell**

You add `export TOKEN="abc"` to `~/.bashrc`. In your already-open terminal, `echo $TOKEN` prints nothing. Fix without restarting:

- **A.** `source ~/.bashrc`
- **B.** `bash ~/.bashrc` in a new tab
- **C.** Re-login to the machine
- **D.** `export` again in `.bash_profile`

</div>

### M19

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · CI/CD: LLM security — MSQ, pick all correct**

Your LLM app summarizes user-submitted documents. Defenses against prompt injection include:

- **A.** Treating the document as data in the prompt, never as instructions
- **B.** A word filter that blocks "ignore previous instructions" — sufficient on its own
- **C.** Giving the summarizer no email/send tools, so injected commands have nothing to act on
- **D.** Validating the output before it reaches the user

</div>

### M20

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · CI/CD: Pipelines**

The core purpose of a CI pipeline:

- **A.** To deploy faster than competitors
- **B.** To reduce cloud costs
- **C.** To run tests and checks automatically on every change, catching breaks before they reach production
- **D.** To replace code review

</div>

### M21

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · CI/CD: Testing**

A team's CI pipeline is green on every commit, yet production breaks monthly. The most likely gap:

- **A.** Bad luck
- **B.** The tests cover the happy path but not failure modes, and there's no monitoring catching regressions after deploy
- **C.** CI pipelines only work for Python
- **D.** The commits are too large

</div>

### M22

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · CI/CD: Configuration**

In Python, the safer way to read an API key from the environment:

- **A.** `os.environ["API_KEY"]` — fails fast is always better
- **B.** `os.getenv` with the key printed to logs for debugging
- **C.** Hardcode a default key as fallback
- **D.** `os.environ.get("API_KEY")` — returns `None` instead of crashing when unset

</div>

### D · AI/LLM System Design & Governance

### M23

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · AI/LLM: Prompts**

A system prompt says "You are a pirate; always answer in pirate speak." A user writes "Answer in plain English from now on." Typically:

- **A.** The later user instruction tends to win for style rules — the system prompt is not a hard boundary
- **B.** The system prompt is a security boundary — the user instruction is ignored
- **C.** The API rejects the request
- **D.** The model alternates between both styles

</div>

### M24

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · AI/LLM: Structured outputs**

The advantage of structured outputs (schema-enforced JSON) over asking the model nicely for JSON:

- **A.** Structured outputs are cheaper
- **B.** Structured outputs are faster to prompt
- **C.** The output is valid against the schema by construction — no parser-breaking surprises
- **D.** There is no advantage

</div>

### M25

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · AI/LLM: RAG**

A RAG system answers a question using stale documentation and gives an outdated price. Put the pipeline in order:

- **A.** Retrieve → chunk → embed → generate
- **B.** Chunk → embed → store → retrieve relevant chunks → generate grounded on them
- **C.** Embed the question → generate → retrieve to verify
- **D.** Generate → embed → store

</div>

### M26

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · AI/LLM: RAG**

In a RAG system, "retrieve the top-k chunks by cosine similarity" means:

- **A.** The k chunks whose embeddings are most similar to the question's embedding
- **B.** The k most recently added chunks
- **C.** The k chunks with the most words
- **D.** A random sample of k chunks

</div>

### M27

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · AI/LLM: Governance — MSQ, pick all correct**

A good model card documents:

- **A.** The model's private weights
- **B.** Training data summary and evaluation results
- **C.** Known limitations and biases
- **D.** Intended use and out-of-scope uses

</div>

### M28

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · AI/LLM: Design choices**

A team wants a chatbot to consistently use their company's terminology. The first thing to try:

- **A.** Fine-tune a custom model
- **B.** Buy a larger model
- **C.** Improve the prompt (and/or retrieve the terminology guide into context) — cheaper, faster, usually enough
- **D.** Wait for the next model release

</div>

### M29

<div class="tx-question" markdown>

**🔴 Hard · 2 marks · AI/LLM: RAG**

A support chatbot was built with RAG over the product manuals. After a major product update, it confidently answers with old information. The most direct fix:

- **A.** Make the system prompt say "be accurate"
- **B.** Add more manuals from other products
- **C.** Lower the temperature
- **D.** Re-ingest the updated manuals and expire/remove the old chunks, so retrieval can't serve stale text

</div>

### M30

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · AI/LLM: Hallucination**

The most reliable way to reduce hallucination in an LLM app that answers from company documents:

- **A.** Ask the model to try harder
- **B.** Ground it: retrieve the relevant documents and have it answer from them — no documents, no answer
- **C.** Use longer answers
- **D.** Increase the temperature

</div>

---

## Section 2 · Applied AI Judgment — 41 marks

*9 questions · ~45–50 minutes · ~5 minutes each · structured answers, max ~200 words · method: [the grading guide](../exam/llm-grading-guide.md)*

### S1 · The hardcoded sentiment endpoint

<div class="tx-question" markdown>

**🟡 Medium · 4 marks · Judgment: API design**

A teammate ships this FastAPI endpoint:

```python
@app.get("/sentiment")
def get_sentiment(text: str = None):
    result = {"sentiment": "positive"}
    return result
```

Users report: empty requests still return "positive", and downstream systems fail silently on bad input. Identify **all the design flaws** you can find, and describe the corrected design — method, validation, error behaviour.

</div>

### S2 · The midnight login spike

<div class="tx-question" markdown>

**🔴 Hard · 5 marks · Judgment: Data integrity**

A nightly analytics job flags a suspicious pattern: ~200 login records every night carry a timestamp of exactly `23:59:59`, clustered across many users. Security suspects a credential-stuffing attack and wants to lock the affected accounts.

You have: the login events file, a cron-job schedule file, and an application release log. What is the most likely explanation to test first, what evidence would confirm or kill it, and what is the safe next action — given that locking 200 users' accounts is disruptive if the benign explanation holds?

</div>

### S3 · The stale pricing bot

<div class="tx-question" markdown>

**🟡 Medium · 4 marks · Judgment: RAG**

A company's sales chatbot answers pricing questions using RAG over a pricing document folder. Finance updates prices quarterly. This quarter, the bot quoted three customers last year's price, and sales lost those deals when the quotes couldn't be honored.

What went wrong in the system design (name the specific gap), and what would you change so the bot *cannot* quote a stale price — not just is less likely to?

</div>

### S4 · The agent with too much power

<div class="tx-question" markdown>

**🔴 Hard · 5 marks · Judgment: Agent safety**

You're deploying a research agent that can: search the web, read files on a shared drive, and send summary emails to a mailing list. A security reviewer asks: "If an attacker gets prompt injection into this agent, what's the worst that happens?"

Describe the guardrails you'd implement — at least four distinct layers — and say which single layer you'd keep if you could only keep one, and why.

</div>

### S5 · Write the Codex prompt

<div class="tx-question" markdown>

**🔴 Hard · 5 marks · Judgment: Agent prompting**

A Python script is supposed to watch a folder for new `.csv` sales reports and append them to a master file. In practice it:

- crashes the whole run if any single CSV is malformed
- silently appends the *same* file twice if it runs while a file is still being written
- has no log of what it did

**Write the prompt you would give a coding agent** (like Codex) to fix this script. The prompt itself is your answer.

</div>

### S6 · Three questions for the client

<div class="tx-question" markdown>

**🟢 Easy · 4 marks · Judgment: Requirements**

A client says: *"We want AI to automate our support."* That's all you know. What are the three most important follow-up questions you would ask before building anything — one sentence each on *why it matters*?

</div>

### S7 · The 96% accuracy claim

<div class="tx-question" markdown>

**🔴 Hard · 5 marks · Judgment: Model evaluation**

A vendor pitches a fraud-detection model: "96% accurate on historical data." Your audit finds they shuffled the dataset randomly before splitting into train and test — and the data contains multiple transactions per customer, plus features computed *after* the fraud decision (e.g., `chargeback_filed`).

Name the problems with the evaluation, what each does to the 96% figure, and what a trustworthy evaluation would look like.

</div>

### S8 · The pipeline that lies

<div class="tx-question" markdown>

**🟡 Medium · 4 marks · Judgment: CI/CD**

A team's CI pipeline: on every push, it runs the unit tests and deploys to production if they pass. Last month, production broke twice — once from a config change no test covered, once from a dependency update that changed behaviour.

What's missing from this pipeline, and what would you add? Order your additions by what you'd do first.

</div>

### S9 · The 500 spike

<div class="tx-question" markdown>

**🔴 Hard · 5 marks · Judgment: Debugging**

At 2pm, your API's error rate jumps from 0.1% to 8%, almost all HTTP 500. Three things happened around the same time: a deployment went out at 1:45pm, a marketing email went out at 1:50pm (traffic is up ~40%), and a downstream payment provider had a "degraded performance" incident starting ~1:55pm.

How do you debug this — in what order do you investigate, what would each hypothesis predict, and what's the safe immediate action while you investigate?

</div>

---

## Scoring guide

| Score | Interpretation |
|---|---|
| **64+ / 80** | Exam-ready |
| **48–63 / 80** | Close — review the buckets you missed, retake [Mock-2](mock-2.md) |
| **< 48 / 80** | Start from the [exam pattern page](../exam/exam-pattern.md), then the [week notes](../learn/index.md) |

---

## Answer key

!!! warning "Don't peek until you've answered everything"

| Q | Answer | Bucket | Where to review |
|---|---|---|---|
| M1 | **A** — backend adds the CORS header | Systems | [CORS](../topics/web-apis.md#cors-same-origin-policy) |
| M2 | **B** — 500 = server-side | Systems | [Status codes](../topics/web-apis.md#http-status-codes-the-family) |
| M3 | **C** — string vs parsed JSON | Systems | [HTTP clients](../topics/web-apis.md) |
| M4 | **A** — EXPOSE is documentation | Systems | [EXPOSE vs -p](../topics/docker-deployment.md#docker-expose-vs--p) |
| M5 | **A, C, D** — coercion yes, guarantee no | Systems | [Pydantic](../pyqs/t1-2026-fn.md) |
| M6 | **D** — pinned requirements | Systems | [Docker & deployment](../topics/docker-deployment.md) |
| M7 | **A** — the max, not the sum | Systems | [asyncio](../topics/rag-agents.md#asynciogather-the-timing-arithmetic) |
| M8 | **C** — body, limits, logs, auth | Systems | [GET vs POST](../sessions/et-03.md) |
| M9 | **B** — waiting on stdin | Observability | [grep -r](../sessions/et-03.md) |
| M10 | **C** — columnar reads | Observability | [Parquet](../topics/data-ml.md#parquet-vs-text-formats) |
| M11 | **D** — locate the failure layer | Observability | [Week 6](../weeks/week-6.md) |
| M12 | **A, B, D** — timezone, freshness, dupes | Observability | [ETL pattern](../topics/data-ml.md#etl-the-lookback--dedup-pattern) |
| M13 | **C** — the 5.5-hour offset | Observability | [Timezone joins](../practice/short-answers.md) |
| M14 | **D** — the measurement changed | Observability | [Week 6](../weeks/week-6.md) |
| M15 | **D** — late data, once each | Observability | [ETL pattern](../topics/data-ml.md#etl-the-lookback--dedup-pattern) |
| M16 | **B** — before the first commit | CI/CD | [Secrets](../topics/git-security.md#secrets-the-env-workflow) |
| M17 | **D** — rotate first | CI/CD | [Secrets](../topics/git-security.md#secrets-the-env-workflow) |
| M18 | **A** — source it | CI/CD | [Shell config](../sessions/et-03.md) |
| M19 | **A, C, D** — filters alone aren't enough | CI/CD | [Prompt injection](../topics/git-security.md) |
| M20 | **C** — automated checks | CI/CD | [Week 7](../weeks/week-7.md) |
| M21 | **B** — untested failure modes | CI/CD | [Week 7](../weeks/week-7.md) |
| M22 | **D** — .get() returns None | CI/CD | [os module](../sessions/et-03.md) |
| M23 | **A** — not a hard boundary | AI/LLM | [Prompts](../topics/llm-prompting.md) |
| M24 | **C** — valid by construction | AI/LLM | [Structured outputs](../topics/llm-prompting.md#structured-outputs) |
| M25 | **B** — chunk → embed → store → retrieve → generate | AI/LLM | [RAG pipeline](../topics/rag-agents.md#the-rag-pipeline) |
| M26 | **A** — most similar embeddings | AI/LLM | [RAG](../topics/rag-agents.md) |
| M27 | **B, C, D** — not the weights | AI/LLM | [Model cards](../topics/data-ml.md) |
| M28 | **C** — prompting first | AI/LLM | [Fine-tuning vs prompting](../topics/data-ml.md) |
| M29 | **D** — re-ingest + expire old | AI/LLM | [RAG staleness](../topics/rag-agents.md) |
| M30 | **B** — grounding | AI/LLM | [RAG](../topics/rag-agents.md) |

---

## Model answers — Section 2

*Score yourself honestly against each checklist — tick only what's actually on your page.*

### S1 · model answer

??? success "Model answer — the hardcoded endpoint"

    **Flaws (any three):**

    - **Functionally dead:** the hardcoded `"positive"` is returned regardless of input — no model, no reading of `text`
    - **No validation:** empty/missing text isn't rejected — it silently returns garbage
    - **Wrong method:** GET puts text in the URL — exposed in logs, truncated by length limits
    - **Silent failure:** no error responses, so bad data propagates downstream

    **Corrected design:**

    ```python
    class SentimentRequest(BaseModel):
        text: str

    @app.post("/sentiment")
    def analyze(req: SentimentRequest):
        if not req.text.strip():
            raise HTTPException(400, "text cannot be empty")
        return {"sentiment": run_model(req.text)}
    ```

    POST (body payload, no limits, auth headers) · Pydantic schema at the boundary (fail fast, 400) · real inference · explicit errors, never silent.

??? note "Self-check"

    ≥3 flaws ✓ · POST with reason ✓ · validation with 400 ✓ · real inference ✓

### S2 · model answer

??? success "Model answer — the midnight login spike"

    **Most likely explanation to test first:** a benign batch/logging artifact — an app or cron job that stamps end-of-day events with a `23:59:59` timestamp instead of the true event time, exactly like a month-end posting batch.

    - **Evidence that confirms:** the cron schedule file shows a job at 23:59; the release log shows the pattern started with a specific release; the "spike" rows are heterogeneous (many users, one record each) rather than attack-shaped
    - **Evidence that kills it:** the spike rows show failed logins, impossible geographies, or the pattern predates every release — then the attack hypothesis strengthens
    - **Safe next action:** *don't lock accounts yet* — pull a sample of the flagged records, check their success flags and event details, and notify security with the finding. Locking is disruptive and irreversible-in-trust; investigation is cheap and reversible.

??? note "Self-check"

    Benign-first hypothesis ✓ · named confirm/kill evidence ✓ · sample-before-action ✓ · reversibility reasoning ✓

### S3 · model answer

??? success "Model answer — the stale pricing bot"

    **The gap:** the RAG pipeline ingests documents once and never expires them. Retrieval serves whatever chunks rank highest — including outdated ones — and the model has no way to know a chunk is stale. Freshness was never part of the design.

    **The fix — make staleness impossible, not unlikely:**

    - Version the corpus: on each price change, re-ingest and *delete/expire* old price chunks (by version or effective-date metadata), so retrieval physically cannot serve them
    - Attach effective dates to chunks and filter retrieval by `effective_date <= today < expiry`
    - Optionally: refuse pricing questions whose retrieved evidence is older than the last finance update — no document, no answer

    *Note:* prompt-level "be careful with dates" is a mitigation, not a fix — the structural answer is what earns the marks.

??? note "Self-check"

    Named the gap (no expiry/versioning) ✓ · structural fix ✓ · said why prompting alone fails ✓

### S4 · model answer

??? success "Model answer — the agent with too much power"

    **Guardrail layers (any four):**

    1. **Tool allow-list, deny by default** — the agent can only `search_web` and `read_file`; no email, no delete, no shell
    2. **Human approval for the dangerous tool** — `send_email` drafts, a human clicks send
    3. **Sandboxing** — container execution, contained blast radius
    4. **Budget limits** — max steps, max cost, max runtime; looping agents halt
    5. **Output validation** — schema-checked responses before they reach users
    6. **Scope file reads** — read-only access to specific folders, not the whole drive

    **The one to keep: the tool allow-list.** Capability restriction is the reliable layer — an agent without a tool cannot be *made* to misuse it, no matter how good the injection is. Instruction-level defenses (fencing, system prompts) are probabilistic; architecture is deterministic.

??? note "Self-check"

    ≥4 layers ✓ · each with mechanism ✓ · one layer chosen with reasoning ✓

### S5 · model answer

??? success "Model answer — the Codex prompt"

    > You are a Senior Python Developer. I have a script that watches a folder for new `.csv` sales reports and appends them to `master.csv`. It has three defects: it crashes the entire run if any single CSV is malformed; it can append a file twice if the script runs while the file is still being written; and it keeps no record of what it processed.
    >
    > Fix it with these constraints:
    >
    > - **Malformed CSVs:** skip the file, log a warning naming the file and the error, continue with the rest — never crash the run
    > - **Partial writes:** only process files that are complete — e.g. require the file to be unchanged (size + mtime) across two checks a few seconds apart, or process only files older than N minutes
    > - **Exactly-once:** track processed filenames (with a hash) in a state file; skip already-processed files even across restarts
    > - **Logging:** one log line per file processed, skipped, or failed — with counts in a final summary
    > - Add type hints; the folder and master path come from CLI arguments

??? note "Self-check"

    Role ✓ · context with the three defects ✓ · task ✓ · ≥5 specific constraints incl. failure behaviour ✓ · exactly-once/log thinking ✓

### S6 · model answer

??? success "Model answer — three questions for the client"

    1. **What does "support" mean here — which queries, volumes, and channels?** (Defines scope: an FAQ bot for 200 tickets/month is a different build from full ticket triage.)
    2. **What's the acceptable failure mode — wrong answer to a customer, or no answer?** (AI systems fail; which failure is tolerable determines the design and the human-in-the-loop requirement.)
    3. **What data exists and can we use it — transcripts, knowledge base, privacy constraints?** (Grounding data availability and legality decides what's buildable at all.)

    *Alternates that earn credit:* how will you measure success · what happens to the human agents · what's the escalation path when the AI is unsure.

??? note "Self-check"

    Three numbered questions ✓ · each with why ✓ · scope/failure/data themes ✓

### S7 · model answer

??? success "Model answer — the 96% accuracy claim"

    **Problem 1 — data leakage from shuffling:** with multiple transactions per customer, random shuffling puts the same customer's transactions in both train and test. The model memorizes customers, not fraud patterns. The 96% is recall of memorized data — meaningless on new customers.

    **Problem 2 — target leakage from post-decision features:** `chargeback_filed` is only known *after* the fraud decision. A model using it at "prediction time" is reading the answer. Any accuracy built on it is fictitious.

    **Problem 3 — class imbalance honesty:** if fraud is ~4% of data, "96% accurate" is the accuracy of predicting *nothing is fraud*. Precision/recall on the fraud class is the number that matters.

    **Trustworthy evaluation:** split by customer (all of one customer's transactions in one side); drop or time-gate post-decision features; report precision/recall on the fraud class; test on a time period after training data ends.

??? note "Self-check"

    Both leakages named with mechanism ✓ · imbalance point ✓ · correct evaluation design ✓

### S8 · model answer

??? success "Model answer — the pipeline that lies"

    **What's missing (ordered):**

    1. **A staging environment + manual or canary deploy** — tests passing ≠ production-safe; config and dependencies behave differently in prod
    2. **Integration/behavioural tests** — unit tests missed the config change because nothing tested config; the dependency update changed behaviour nothing asserted
    3. **Pinned dependencies + a lockfile** — prevents silent behaviour changes from `pip install` resolving newer versions
    4. **Post-deploy monitoring with rollback** — the pipeline ends at deploy; it should end at "verified healthy in prod, else rollback"

    **First addition:** staging + rollback — it contains the blast radius of every other gap while the tests catch up.

??? note "Self-check"

    ≥3 additions ✓ · ordered with reasoning ✓ · staging/rollback prioritized ✓

### S9 · model answer

??? success "Model answer — the 500 spike"

    **Order of investigation:**

    1. **The deployment (1:45pm)** — highest prior: new code is the classic cause of a sudden 500 jump. Prediction: errors trace to code paths touched by the deploy; error messages reference new code. First check: error logs/stack traces, and whether rolling back stops it.
    2. **The payment provider (1:55pm)** — 500s are *our* server failing, but if our code mishandles their degraded responses (e.g., unhandled timeouts bubbling as 500), this explains it. Prediction: errors cluster in payment-dependent endpoints.
    3. **The traffic surge (1:50pm)** — load alone usually causes 429s/timeouts, not 500s — unless it exposes a latent bug (race, resource exhaustion). Prediction: errors correlate with request rate.

    **Safe immediate action:** roll back the deployment — reversible in minutes, addresses the highest-probability cause, and doesn't block the other investigations. Meanwhile page/check the provider status and watch whether errors concentrate in payment flows.

??? note "Self-check"

    Deployment first with reasoning ✓ · each hypothesis's prediction ✓ · rollback as the reversible action ✓ · distinguishes 500 vs load errors ✓

---

**Next:** review your weakest bucket in the [week notes](../learn/index.md), then take [Mock-2](mock-2.md) — a fresh paper in the same structure.
