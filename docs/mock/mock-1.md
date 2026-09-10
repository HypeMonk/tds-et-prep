# Mock-1 — full paper, official pattern

<div class="tx-meta" markdown>

**80 marks · 90 minutes** · Section 1: 30 MCQ/MSQ, 39 marks (official topics 1–5) · Section 2: 9 short answers, 41 marks (topic 6 — Applied AI Judgment) · [Answer key at the bottom](#answer-key)

</div>

!!! warning "Simulate the real thing"
    Set a timer for **90 minutes**. Budget roughly **40–45 minutes for Section 1** and
    **45–50 minutes for Section 2** — the written half is worth more than half the
    paper, so don't let MCQs eat into it. There is no negative marking: answer
    everything. Write each Section-2 answer (max ~200 words) before scrolling to
    the answer key.

---

## Section 1 · MCQ / MSQ — 39 marks

*30 questions · 21 one-mark + 9 two-mark · ~40–45 minutes · every question tagged to its official topic · MSQs marked "pick all correct"*

### Topic 1 · Observability & Monitoring

### M1

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · T1: Metrics**

Your API's *average* response time is 180ms, but support tickets say "the site is slow." The metric most likely to reveal what users are complaining about:

- **A.** Total requests per day
- **B.** p95 or p99 latency — the slow tail the average hides
- **C.** Average CPU usage
- **D.** Error count

</div>

### M2

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T1: Metrics**

Error *count* rose from 400 to 800 yesterday. Traffic also doubled. The correct reading:

- **A.** Reliability halved — urgent incident
- **B.** Error *rate* is unchanged — investigate only if rates, not counts, moved
- **C.** The monitoring is broken
- **D.** Traffic is the incident

</div>

### M3

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · T1: Health checks**

A service passes its health check while its database connection is down, and the load balancer keeps sending it traffic. The design flaw:

- **A.** The health check tests liveness (process up) when the balancer needs readiness (can serve real traffic)
- **B.** The load balancer should not check health
- **C.** The database needs a health check too — that alone fixes it
- **D.** The service needs more instances

</div>

### M4

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · T1: AI cost tracking — MSQ, pick all correct**

Your company ships an LLM feature. Cost monitoring worth setting up:

- **A.** Tokens in/out and cost per request
- **B.** Cost per *successful* request — failed calls cost money too
- **C.** Daily spend against a budget, with alerts on anomalies
- **D.** The model's parameter count

</div>

### Topic 2 · Data Pipeline Integrity

### M5

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T2: Idempotency**

A pipeline crash restarted and re-processed 30 minutes of orders — revenue doubled for that window. The property the pipeline lacked:

- **A.** Idempotency — running twice produced different results than running once
- **B.** Scalability
- **C.** Compression
- **D.** Encryption

</div>

### M6

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T2: Change detection**

Your daily scraper re-reads a page. The correct signal that content *actually changed*:

- **A.** The page was fetched again today
- **B.** The scrape took longer than yesterday
- **C.** The content hash differs from the stored hash for the same identity
- **D.** The page's URL changed

</div>

### M7

<div class="tx-question" markdown>

**🔴 Hard · 2 marks · T2: Failed runs — MSQ, pick all correct**

A load job died halfway: 60% of rows written to the live table, 40% missing, dashboards already reading it. Designs that prevent this:

- **A.** Write to a staging table, then swap atomically — readers never see a half-state
- **B.** Retry the job immediately without any record of what was already written
- **C.** Record run boundaries so downstream knows a load is partial
- **D.** Use a unique constraint on the natural key so a retry can't double rows

</div>

### M8

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T2: Provenance**

Six months after you corrected 300 wrong rows, an auditor asks: which rows, why, and what they said before. The practice that makes this answerable:

- **A.** Trust your memory
- **B.** Re-run the pipeline and hope
- **C.** Email the auditor a screenshot of the dashboard
- **D.** A correction log (or append-only versions) recording row ID, old → new value, reason, and who decided — kept at correction time

</div>

### Topic 3 · CI/CD & Release Security

### M9

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T3: Secret isolation**

Your CI runs tests on every pull request, including forks from strangers. The rule:

- **A.** PR tests get full secrets — testing needs the real environment
- **B.** PR tests see zero secrets; deploy credentials only flow to trusted triggers (maintainer merges)
- **C.** Secrets should be hardcoded so tests always pass
- **D.** Only maintainers can open PRs, so secrets are safe

</div>

### M10

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · T3: Leaked secrets**

A real API key was pushed to a public repo an hour ago. First action:

- **A.** Delete the file and commit again
- **B.** Nothing — an hour is too short to matter
- **C.** Make the repo private
- **D.** Rotate (revoke + regenerate) the key at the provider, then clean the history

</div>

### M11

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · T3: Supply chain — MSQ, pick all correct**

Ways to harden your build against dependency risk:

- **A.** Pin exact versions with a lockfile — no floating `latest`
- **B.** Verify hashes so you install what was reviewed
- **C.** Add more dependencies — redundancy is safety
- **D.** Review dependency-change diffs in CI, not just your own code

</div>

### M12

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T3: Rollouts**

The point of a canary deploy (1–5% of traffic first):

- **A.** It saves money on infrastructure
- **B.** Canary deploys skip testing
- **C.** A bad deploy hurts 5% of users for minutes instead of everyone for an hour — with health-rate checks and auto-rollback
- **D.** It is required by cloud providers

</div>

### Topic 4 · Reliable AI/LLM Systems

### M13

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · T4: Structured output**

The advantage of schema-enforced structured outputs over asking the model nicely for JSON:

- **A.** Structured outputs are cheaper
- **B.** Structured outputs are faster to prompt
- **C.** The output is valid against the schema by construction — no parser-breaking surprises
- **D.** There is no advantage

</div>

### M14

<div class="tx-question" markdown>

**🔴 Hard · 2 marks · T4: Authorization**

An internal LLM assistant must never reveal salary-band documents. The strongest design:

- **A.** Put "never reveal salary bands" in the system prompt
- **B.** Fine-tune the model to refuse
- **C.** Filter the words "salary bands" from outputs
- **D.** Retrieve only from permitted corpora — restricted documents are physically not in the retrieval set, with permission checks in code

</div>

### M15

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · T4: Verification — MSQ, pick all correct**

An LLM drafts customer emails before they're sent. Verification steps worth running:

- **A.** Schema validation — output has the required fields
- **B.** Trust the model — it was prompted carefully
- **C.** Constraint checks in code — no discounts above policy, real product names
- **D.** A second pass (model or human) reviews before sending

</div>

### M16

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T4: Grounding**

A RAG chatbot quoted last year's prices after Finance updated the folder. The structural fix:

- **A.** Re-ingest the new documents and expire the old chunks — retrieval physically cannot serve stale text
- **B.** System prompt: "always be accurate"
- **C.** Lower the temperature
- **D.** Add a disclaimer to answers

</div>

### Topic 5 · Web/API/Infra Fundamentals

### M17

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · T5: API errors**

A user with a valid API key requests an endpoint their tier doesn't include. Return:

- **A.** 401 — authentication failed
- **B.** 403 — authenticated, not permitted
- **C.** 500 — server error
- **D.** 429 — rate limited

</div>

### M18

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T5: Statelessness**

An app stores logged-in users in an in-memory Python dict. It breaks the moment the platform restarts the container or scales to two instances. Why:

- **A.** Python dicts are slow
- **B.** The container needs more RAM
- **C.** In-memory state dies with the instance and is invisible to other instances — sessions belong in durable shared storage (Redis/DB)
- **D.** Dicts aren't thread-safe

</div>

### M19

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T5: Delegated access**

A third-party app reads your calendar through Google OAuth, without ever seeing your password. This is:

- **A.** Identity-based access — the app is you
- **B.** Session-based access
- **C.** A security violation
- **D.** Delegated access — a scoped, revocable token limited to what you granted

</div>

### M20

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · T5: Error design — MSQ, pick all correct**

Your API rejects a malformed request. A *well-designed* error response:

- **A.** Uses the right status code (400/422 — the caller can fix it)
- **B.** Names the field, the problem, and ideally the fix in the body
- **C.** Includes the full stack trace so the caller sees what happened
- **D.** Returns a request ID the user can quote when reporting it

</div>

### M21

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T5: Git history**

A secret was committed and pushed. "I deleted the file in a new commit" — what's still true:

- **A.** The secret is gone for good
- **B.** The secret remains in every previous commit, still cloneable — rotate the key, then rewrite history
- **C.** Deleting the file rewrites history automatically
- **D.** Only maintainers can see old commits

</div>

### M22

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · T5: Docker**

A Dockerfile contains `EXPOSE 8000`. The service is still unreachable from the host because:

- **A.** `EXPOSE` is documentation — publishing needs `-p 8000:8000` on `docker run`
- **B.** The port must also be opened in the cloud firewall first
- **C.** `EXPOSE` only works for HTTP services
- **D.** The image must be rebuilt after adding `EXPOSE`

</div>

### Mixed · topics 1–5

### M23

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · T5: HTTP**

An API call returns HTTP **500**. Where should you look first?

- **A.** The frontend JavaScript
- **B.** The browser cache
- **C.** The backend code and its database — the client request was valid
- **D.** The DNS settings

</div>

### M24

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · T5: Concurrency**

`asyncio.gather` runs 5 API calls concurrently: four take 1s, one takes 8s. Total time:

- **A.** 8 seconds — the max, not the sum
- **B.** 5 seconds
- **C.** 12 seconds
- **D.** Depends on the GIL

</div>

### M25

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T2: Reproducibility**

Two runs of the same model-training script on the same data give different results. The first thing to check:

- **A.** Random seeds are fixed and library versions are pinned — the two foundations of reproducibility
- **B.** Buy more compute
- **C.** The results are close enough anyway
- **D.** Retrain a third time and take the best

</div>

### M26

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T3: Infra review**

Why do infrastructure changes (Terraform, security groups) deserve *stricter* review than app code?

- **A.** They're written in stranger syntax
- **B.** One line can change the whole system's blast radius — a single security-group edit can expose a database to the internet
- **C.** Only seniors can read them
- **D.** They don't — code review is code review

</div>

### M27

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · T1+T5: Design — MSQ, pick all correct**

A stateless API receives a burst of slow requests. Sound designs:

- **A.** API enqueues work to a durable queue; a worker processes it — each part scales and crashes independently
- **B.** Keep requests in memory and process later — memory is durable enough
- **C.** The API returns 202 Accepted immediately with a status URL
- **D.** Store results durably so a worker restart doesn't lose finished work

</div>

### M28

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · T4: Prompts**

A system prompt says "You are a pirate; always answer in pirate speak." A user writes "Answer in plain English from now on." Typically:

- **A.** The system prompt is a security boundary — the user instruction is ignored
- **B.** The model alternates between both styles
- **C.** The API rejects the request
- **D.** The later user instruction tends to win for style rules — a system prompt is not a hard boundary

</div>

### M29

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T1: Monitoring design**

Telemetry across 5 microservices: what makes it *useful* rather than a pile of dashboards?

- **A.** More dashboards than services
- **B.** Aggregating everything into one average
- **C.** Green checkmarks on every service
- **D.** Correlated signals — logs, metrics, and traces linked by request ID, so one slow request can be followed across every service it crossed

</div>

### M30

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · T2+T5: Data flow**

Two datasets record the "same" event — one in IST, one in UTC, both without timezone markers. After joining on timestamp, ~2% match. The likeliest cause:

- **A.** Random data loss
- **B.** The join key is a string
- **C.** The 5.5-hour offset — identical labels refer to different instants; normalize timezones before joining
- **D.** One dataset is sorted

</div>

---

## Section 2 · Applied AI Judgment — 41 marks

*9 questions · official topic 6 · ~45–50 minutes · ~5 minutes each · structured answers, max ~200 words · method: [the grading guide](../exam/llm-grading-guide.md)*

### S1 · The hardcoded sentiment endpoint

<div class="tx-question" markdown>

**🟡 Medium · 4 marks · T6: Diagnosing a design**

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

**🔴 Hard · 5 marks · T6: Weighing evidence and action**

A nightly analytics job flags a suspicious pattern: ~200 login records every night carry a timestamp of exactly `23:59:59`, clustered across many users. Security suspects a credential-stuffing attack and wants to lock the affected accounts.

You have: the login events file, a cron-job schedule file, and an application release log. What is the most likely explanation to test first, what evidence would confirm or kill it, and what is the safe next action — given that locking 200 users' accounts is disruptive if the benign explanation holds?

</div>

### S3 · The 96% accuracy claim

<div class="tx-question" markdown>

**🔴 Hard · 5 marks · T6: Separating valid from invalid claims**

A vendor pitches a fraud-detection model: "96% accurate on historical data." Your audit finds they shuffled the dataset randomly before splitting into train and test — and the data contains multiple transactions per customer, plus features computed *after* the fraud decision (e.g., `chargeback_filed`).

Name the problems with the evaluation, what each does to the 96% figure, and what a trustworthy evaluation would look like.

</div>

### S4 · Write the Codex prompt

<div class="tx-question" markdown>

**🔴 Hard · 5 marks · T6: Writing robust prompts**

A Python script is supposed to watch a folder for new `.csv` sales reports and append them to a master file. In practice it:

- crashes the whole run if any single CSV is malformed
- silently appends the *same* file twice if it runs while a file is still being written
- has no log of what it did

**Write the prompt you would give a coding agent** (like Codex) to fix this script. The prompt itself is your answer.

</div>

### S5 · Three questions for the client

<div class="tx-question" markdown>

**🟢 Easy · 4 marks · T6: High-leverage questions**

A client says: *"We want AI to automate our hiring screening."* That's everything you know. What are the three most important follow-up questions you would ask before building anything — one sentence each on why the answer changes the design?

</div>

### S6 · Design the rubric

<div class="tx-question" markdown>

**🔴 Hard · 5 marks · T6: Designing rubrics to catch flawed AI analysis**

Your team is about to ship an AI system that writes first-draft market analyses. Leadership asks you to design the review rubric — the checklist a reviewer uses to catch a flawed analysis before it ships.

List the dimensions you would check (with one line each on what flawed analysis looks like there), and state what the rubric should *never* reward.

</div>

### S7 · The agent with too much power

<div class="tx-question" markdown>

**🔴 Hard · 5 marks · T6: Probability and impact of errors**

You're deploying a research agent that can: search the web, read files on a shared drive, and send summary emails to a mailing list. A security reviewer asks: "If an attacker gets prompt injection into this agent, what's the worst that happens?"

Describe the guardrails you'd implement — at least four distinct layers — and, crucially, rank them by which failure modes they cover (which errors are likely, which are merely possible, which are catastrophic) and say which single layer you'd keep if you could only keep one, and why.

</div>

### S8 · The pipeline that lies

<div class="tx-question" markdown>

**🟡 Medium · 4 marks · T6: Precise minimal fixes**

A team's CI pipeline: on every push, it runs the unit tests and deploys to production if they pass. Last month, production broke twice — once from a config change no test covered, once from a dependency update that changed behaviour.

What's missing, and what would you add? Order your additions by what you'd do first — and justify why the *minimal* fix beats a grand redesign.

</div>

### S9 · The 500 spike

<div class="tx-question" markdown>

**🔴 Hard · 4 marks · T6: Judgment under uncertainty**

At 2pm, your API's error rate jumps from 0.1% to 8%, almost all HTTP 500. Three things happened around the same time: a deployment went out at 1:45pm, a marketing email went out at 1:50pm (traffic is up ~40%), and a downstream payment provider had a "degraded performance" incident starting ~1:55pm.

In what order do you investigate, what would each hypothesis predict, and what's the safe immediate action while you investigate?

</div>

---

## Scoring guide

| Score | Interpretation |
|---|---|
| **64+ / 80** | Exam-ready |
| **48–63 / 80** | Close — review your weakest topic in the [week notes](../learn/index.md), retake [Mock-2](mock-2.md) |
| **< 48 / 80** | Start from the [exam pattern page](../exam/exam-pattern.md), then the [topic map](../learn/index.md#the-six-official-exam-topics-where-each-lives) |

---

## Answer key

!!! warning "Don't peek until you've answered everything"

| Q | Answer | Topic | Where to review |
|---|---|---|---|
| M1 | **B** — p95/p99, the tail the mean hides | T1 | [Reading metrics](../topics/data-ml.md#reading-metrics-averages-lie-percentiles-dont) |
| M2 | **B** — rate unchanged, count misleads | T1 | [Reading metrics](../topics/data-ml.md#reading-metrics-averages-lie-percentiles-dont) |
| M3 | **A** — liveness tested, readiness needed | T1 | [Reading metrics](../topics/data-ml.md#reading-metrics-averages-lie-percentiles-dont) |
| M4 | **A, B, C** — not parameter count | T1 | [Reading metrics](../topics/data-ml.md#reading-metrics-averages-lie-percentiles-dont) |
| M5 | **A** — not idempotent | T2 | [Pipeline integrity](../topics/data-ml.md#data-pipeline-integrity-the-five-properties) |
| M6 | **C** — hash differs for same identity | T2 | [Pipeline integrity](../topics/data-ml.md#data-pipeline-integrity-the-five-properties) |
| M7 | **A, C, D** — blind retry is the trap | T2 | [Pipeline integrity](../topics/data-ml.md#data-pipeline-integrity-the-five-properties) |
| M8 | **D** — correction log at correction time | T2 | [Pipeline integrity](../topics/data-ml.md#data-pipeline-integrity-the-five-properties) |
| M9 | **B** — trust of trigger gates secrets | T3 | [Release security](../topics/git-security.md#release-security-what-cicd-must-get-right) |
| M10 | **D** — rotate first | T3 | [Secrets](../topics/git-security.md#secrets-the-env-workflow) |
| M11 | **A, B, D** — fewer deps, not more | T3 | [Release security](../topics/git-security.md#release-security-what-cicd-must-get-right) |
| M12 | **C** — bounded blast radius | T3 | [Release security](../topics/git-security.md#release-security-what-cicd-must-get-right) |
| M13 | **C** — valid by construction | T4 | [Structured outputs](../topics/llm-prompting.md#structured-outputs) |
| M14 | **D** — not in the corpus at all | T4 | [Reliability discipline](../topics/llm-prompting.md#reliability-discipline-for-llm-systems) |
| M15 | **A, C, D** — never "trust the model" | T4 | [Reliability discipline](../topics/llm-prompting.md#reliability-discipline-for-llm-systems) |
| M16 | **A** — expire old chunks | T4 | [RAG staleness](../topics/rag-agents.md) |
| M17 | **B** — 403, not 401 | T5 | [API error design](../topics/web-apis.md#api-error-design-failing-usefully) |
| M18 | **C** — state must be durable + shared | T5 | [Statelessness](../topics/web-apis.md#statelessness-durable-storage-why-servers-are-allowed-to-die) |
| M19 | **D** — scoped, revocable token | T5 | [Delegated access](../topics/web-apis.md#identity-vs-delegated-access-whos-asking-on-whose-behalf) |
| M20 | **A, B, D** — never stack traces | T5 | [API error design](../topics/web-apis.md#api-error-design-failing-usefully) |
| M21 | **B** — old commits still hold it | T5 | [Git history](../topics/git-security.md#safe-git-history-changes-rewriting-is-surgery) |
| M22 | **A** — EXPOSE is documentation | T5 | [EXPOSE vs -p](../topics/docker-deployment.md) |
| M23 | **C** — 500 = server-side | T5 | [Status codes](../topics/web-apis.md#http-status-codes-the-family) |
| M24 | **A** — the max, not the sum | T5 | [asyncio](../topics/rag-agents.md#asynciogather-the-timing-arithmetic) |
| M25 | **A** — seeds + pins | T2 | [Pipeline integrity](../topics/data-ml.md#data-pipeline-integrity-the-five-properties) |
| M26 | **B** — whole-system blast radius | T3 | [Release security](../topics/git-security.md#release-security-what-cicd-must-get-right) |
| M27 | **A, C, D** — memory is not durable | T1+T5 | [Statelessness](../topics/web-apis.md#statelessness-durable-storage-why-servers-are-allowed-to-die) |
| M28 | **D** — not a hard boundary | T4 | [Prompts](../topics/llm-prompting.md) |
| M29 | **D** — correlated signals, request ID | T1 | [Week 6](../weeks/week-6.md) |
| M30 | **C** — the 5.5-hour offset | T2+T5 | [ETL pattern](../topics/data-ml.md) |

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
    - **Safe next action:** *don't lock accounts yet* — pull a sample of the flagged records, check their success flags and event details, and notify security with the finding. Locking 200 accounts is disruptive and slow to undo; investigation is cheap and reversible. **Probability × impact:** a benign-cause mistake costs an apology; a real attack caught 2 hours later costs little more. Act on evidence, not alarm.

??? note "Self-check"

    Benign-first hypothesis ✓ · named confirm/kill evidence ✓ · sample-before-action ✓ · reversibility reasoning ✓

### S3 · model answer

??? success "Model answer — the 96% accuracy claim"

    **Problem 1 — data leakage from shuffling:** with multiple transactions per customer, random shuffling puts the same customer's transactions in both train and test. The model memorizes customers, not fraud patterns. The 96% is recall of memorized data — meaningless on new customers.

    **Problem 2 — target leakage from post-decision features:** `chargeback_filed` is only known *after* the fraud decision. A model using it at "prediction time" is reading the answer. Any accuracy built on it is fictitious.

    **Problem 3 — class imbalance honesty:** if fraud is ~4% of data, "96% accurate" is the accuracy of predicting *nothing is fraud*. Precision/recall on the fraud class is the number that matters.

    **Trustworthy evaluation:** split by customer (all of one customer's transactions on one side); drop or time-gate post-decision features; report precision/recall on the fraud class; test on a time period after training data ends.

??? note "Self-check"

    Both leakages named with mechanism ✓ · imbalance point ✓ · correct evaluation design ✓

### S4 · model answer

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

### S5 · model answer

??? success "Model answer — three questions for the hiring client"

    1. **What decision exactly will the AI's output feed — auto-reject, ranking, or assistive summary?** (The stakes and required accuracy differ by orders of magnitude; auto-reject needs the strongest fairness guarantees.)
    2. **What data exists on past hiring decisions, and does it encode historical biases?** (A model trained on biased decisions reproduces them — and hiring is a legally sensitive domain.)
    3. **How will you measure fairness and effectiveness before and after deployment — and who audits it?** (Without defined metrics, neither compliance nor improvement is verifiable.)

    *Also strong:* human-in-the-loop requirement · legal/regulatory constraints · volume of applicants.

??? note "Self-check"

    Three numbered questions ✓ · why for each ✓ · at least one touches bias/fairness ✓

### S6 · model answer

??? success "Model answer — design the rubric"

    **Dimensions to check (any five):**

    1. **Evidence traceability** — every material claim cites a source at the right granularity; flawed = vague citations ("studies show") or numbers with no origin
    2. **Mechanism** — the analysis explains *how* the observed pattern could arise, not just that it exists; flawed = correlation stated as cause
    3. **Alternatives considered** — rival explanations tested and rejected on evidence; flawed = one story, no competitors
    4. **Calibration** — confidence matches evidence; flawed = "will," "proves," "certainly" on thin support
    5. **Decision safety** — the recommended action is reversible and proportionate; flawed = irreversible action on an uncertain analysis
    6. **Numbers verified** — arithmetic and units check out; flawed = the LLM's confident wrong math

    **What the rubric must never reward:** fluency and confidence — the very things AI drafts are *best* at. A confident, well-written, unevidenced analysis should score zero, not near-full. Rubrics grade the substance, never the polish.

??? note "Self-check"

    ≥5 dimensions ✓ · flawed-example for each ✓ · "never reward fluency/confidence" ✓

### S7 · model answer

??? success "Model answer — the agent with too much power"

    **Guardrail layers (any four):**

    1. **Tool allow-list, deny by default** — only `search_web` and `read_file`; no email, no delete, no shell
    2. **Human approval for the dangerous tool** — `send_email` drafts, a human clicks send
    3. **Sandboxing** — container execution, contained blast radius
    4. **Budget limits** — max steps, cost, runtime; looping agents halt
    5. **Output validation** — schema-checked responses before they reach users

    **Ranking by failure coverage (probability × impact):** prompt injection is *likely* (any public content can carry it); silent over-spend is *possible*; destructive tool use is *rare but catastrophic*. The allow-list covers the catastrophic class by removing the capability; human approval covers the likely-but-reversible class.

    **The one to keep: the tool allow-list.** Capability restriction is deterministic — an agent without a tool cannot be made to misuse it. Instruction-level defenses are probabilistic; architecture is not.

??? note "Self-check"

    ≥4 layers ✓ · probability×impact ranking ✓ · one layer chosen with reasoning ✓

### S8 · model answer

??? success "Model answer — the pipeline that lies"

    **What's missing (ordered, minimal first):**

    1. **Staging + rollback** — tests passing ≠ production-safe; config and dependencies behave differently in prod. Contains the blast radius of every other gap while they're fixed
    2. **Behavioural tests for config and dependency surfaces** — the two failures were exactly the untested surfaces
    3. **Pinned dependencies + lockfile** — the silent behaviour-change failure mode

    **Why minimal beats grand:** each addition directly addresses an observed failure, is small enough to review, and can ship this week. A redesign (Kubernetes! multi-environment!) would touch everything, introduce new risk, and delay the fixes the incident report already justifies. *Minimal, targeted, ordered by risk.*

??? note "Self-check"

    ≥3 additions ordered ✓ · tied to the two observed failures ✓ · minimal-vs-grand justification ✓

### S9 · model answer

??? success "Model answer — the 500 spike"

    **Order of investigation:**

    1. **The deployment (1:45pm)** — highest prior: new code is the classic cause of a sudden 500 jump. Prediction: errors trace to code paths touched by the deploy. First check: error logs/stack traces, and whether rolling back stops it.
    2. **The payment provider (1:55pm)** — 500s are *our* server failing, but if our code mishandles their degraded responses (unhandled timeouts bubbling as 500), this explains it. Prediction: errors cluster in payment-dependent endpoints.
    3. **The traffic surge (1:50pm)** — load alone usually causes 429s/timeouts, not 500s — unless it exposes a latent bug. Prediction: errors correlate with request rate.

    **Safe immediate action:** roll back the deployment — reversible in minutes, addresses the highest-probability cause, and doesn't block the other investigations. Meanwhile check the provider status page and watch whether errors concentrate in payment flows.

??? note "Self-check"

    Deployment first with reasoning ✓ · each hypothesis's prediction ✓ · rollback as the reversible action ✓ · 500-vs-load distinction ✓

---

**Next:** review your weakest topic in the [week notes](../learn/index.md), then take [Mock-2](mock-2.md) — a fresh paper in the same structure.
