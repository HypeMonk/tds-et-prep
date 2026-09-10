# Practice — core patterns (fresh scenarios)

<div class="tx-meta" markdown>

~18 questions · PYQ-heavy topics with new scenarios · tests whether you've learned the concept or just the answer · [Week 1](../weeks/week-1.md) · [Week 2](../weeks/week-2.md)

</div>

These are the topics the exam asks about in every paper — CORS, Docker, caching, secrets, status codes, asyncio, data formats — but in **different scenarios** than the PYQs. If you can answer these, you've learned the concept, not just the past paper.

---

## CORS — new angles

### P19 · The file:// origin

<div class="tx-question" markdown>

**🟡 Medium · ⭐⭐ · 1 mark · Topic: CORS**

You open an HTML file directly from your filesystem (`file:///C:/project/index.html`) and it tries to fetch from `http://localhost:8000/api`. The browser blocks it. Why?

- **A.** The API server is not running
- **B.** The HTML file needs to be served from a web server first
- **C.** Browsers don't allow JavaScript in local files
- **D.** A `file://` page is a different origin from `http://localhost:8000` — the Same-Origin Policy blocks the read

</div>

??? success "Answer"
    **D** — A `file://` page is a different origin from `http://localhost:8000` — the Same-Origin Policy blocks the read.

??? note "Why"
    Origin = scheme + host + port. `file://` has a different **scheme** from
    `http://` — so they're different origins even though both are "on your
    computer." The fix: serve the HTML from a local server (making the scheme
    match), or add CORS headers on the backend. This is the T1-FN Q18 scenario
    with the mechanism named.

    → [W2 — CORS](../weeks/week-2.md#cors-the-most-tested-concept-in-the-corpus)

---

### P20 · CORS doesn't block curl

<div class="tx-question" markdown>

**🟢 Easy · ⭐⭐ · 1 mark · Topic: CORS**

Your API works perfectly when tested with `curl` but shows a CORS error when called from a React app. What does this tell you?

- **A.** The API has a bug that only manifests in browser contexts
- **B.** The React app is sending the request with wrong headers
- **C.** CORS is a browser-only enforcement — curl, Postman, and Python scripts are never blocked; only browser JavaScript is
- **D.** The API needs to return different data format for browsers

</div>

??? success "Answer"
    **C** — CORS is a browser-only enforcement — curl is never blocked.

??? note "Why"
    The Same-Origin Policy is implemented in the **browser's JavaScript engine**.
    curl doesn't run JavaScript, doesn't have an origin, and doesn't enforce the
    policy. Your API may be working perfectly — it's the browser's *read* of the
    response that's refused. This distinction is the difference between debugging
    the server (wrong) and adding the CORS header (right).

    → [W2 — CORS wrong belief](../topics/docker-deployment.md)

---

## Docker — new scenarios

### P21 · The two-app container

<div class="tx-question" markdown>

**🟡 Medium · ⭐⭐ · 1 mark · Topic: Docker**

Your Dockerfile builds successfully, the container starts, and the app logs "Server running on port 3000" — but `curl http://localhost:3000` from your host machine gets "connection refused." What's wrong?

- **A.** You forgot `-p 3000:3000` on `docker run` — the port is not published to the host
- **B.** The app is listening on the wrong interface inside the container
- **C.** The container doesn't have network access
- **D.** Port 3000 is already in use on the host

</div>

??? success "Answer"
    **A** — You forgot `-p 3000:3000` on `docker run` — the port is not published to the host.

??? note "Why"
    The app is running and listening **inside the container** — the log proves it.
    But the container's port 3000 is not mapped to the host's port 3000. The
    `EXPOSE 3000` in the Dockerfile is documentation only; `-p` is the actual
    bridge. This is the same EXPOSE-vs-`-p` question with the symptom described
    from the outside.

    → [W2 — EXPOSE vs -p](../topics/docker-deployment.md#docker-expose-vs--p)

---

### P22 · The Dockerfile that never caches

<div class="tx-question" markdown>

**🔴 Hard · ⭐⭐ · 1 mark · Topic: Docker**

Your CI pipeline takes 8 minutes to build a Docker image, even when you only changed one line of Python code. The Dockerfile starts with `COPY . /app`. Why is the build so slow?

- **A.** The base image is too large
- **B.** `COPY . /app` is the first instruction — every code change invalidates the first layer, and every subsequent layer (including dependency installation) rebuilds from scratch
- **C.** Docker builds are always slow when the project has many files
- **D.** The CI runner doesn't have a Docker cache

</div>

??? success "Answer"
    **B** — `COPY . /app` is the first instruction — every code change invalidates the first layer, and every subsequent layer rebuilds.

??? note "Why"
    Docker layer caching: a layer rebuilds when its inputs change, and every layer
    **after** a changed layer rebuilds too. `COPY . /app` first means the code
    layer changes on every edit → the `pip install` layer after it rebuilds →
    dependencies re-download. The fix: `COPY requirements.txt` first, `RUN pip
    install`, then `COPY . /app` — now the install layer stays cached.

    → [W2 — layer caching](../topics/docker-deployment.md#docker-layer-caching)

---

## Caching — new scenarios

### P23 · The CDN pricing surprise

<div class="tx-question" markdown>

**🟡 Medium · ⭐⭐ · 1 mark · Topic: Caching**

Your API returns `Cache-Control: private, max-age=0`. Your CDN bill is unexpectedly high. Why?

- **A.** The CDN is misconfigured and caching anyway
- **B.** `max-age=0` means the CDN caches for 0 seconds but still counts the request
- **C.** The CDN charges per header, and you're sending too many
- **D.** `private` tells the CDN it may NOT cache, and `max-age=0` tells the browser the response is immediately stale — every request goes to the origin

</div>

??? success "Answer"
    **D** — `private` tells the CDN it may NOT cache, and `max-age=0` means immediately stale — every request hits the origin.

??? note "Why"
    Two directives working together to prevent caching:
    - `private` = only the user's own browser may cache; shared caches (CDNs,
      proxies) may not
    - `max-age=0` = the copy is stale the moment it arrives

    The fix depends on the data: if the response is the same for all users, use
    `public, max-age=<sensible TTL>` to let the CDN serve copies. If it's
    user-specific, the CDN correctly shouldn't cache it.

    → [W2 — caching](../topics/web-apis.md#caching-ttl-cache-control-cache-buster)

---

### P24 · The dashboard performance problem

<div class="tx-question" markdown>

**🟡 Medium · ⭐⭐ · 1 mark · Topic: Caching**

A dashboard queries a database that updates every 6 hours. 200 users view the dashboard every minute. The database is struggling. What's the fix?

- **A.** Cache the query results with a TTL of 5–30 minutes — the database goes from 12,000 queries/hour to 2–12 queries/hour
- **B.** Upgrade the database to a larger instance
- **C.** Move the dashboard to a CDN
- **D.** Reduce the number of users who can access the dashboard

</div>

??? success "Answer"
    **A** — Cache the query results with a TTL of 5–30 minutes.

??? note "Why"
    The workload is asymmetric: 1 update per 6 hours vs ~200 reads per minute.
    A TTL of 5–30 minutes means the database is queried once per interval
    instead of 200 times per minute — a 1000×+ reduction — while the data is at
    most 30 minutes stale (acceptable for data that changes every 6 hours). This
    is the ET-2 professor's dashboard-caching arithmetic with fresh numbers.

    → [W2 — the dashboard pattern](../weeks/week-2.md#caching-ttl-cache-control-and-the-cache-buster)

---

## Secrets & security — new scenarios

### P25 · The committed .env file

<div class="tx-question" markdown>

**🔴 Hard · ⭐⭐ · 1 mark · Topic: Secrets**

You accidentally committed your `.env` file (containing API keys) to a public GitHub repo 3 days ago. You deleted it in the next commit. What must you do now?

- **A.** Nothing — deleting the file removed the secrets
- **B.** Delete the GitHub repository and create a new one
- **C.** Rotate every key that was in the file — the git history still contains the .env, and anyone who cloned the repo has the secrets
- **D.** Ask GitHub to purge the commit from their servers

</div>

??? success "Answer"
    **C** — Rotate every key — the git history still contains the secrets.

??? note "Why"
    Git stores a full history of every commit. Deleting the file in a later
    commit adds a new commit — it doesn't remove the earlier one. Anyone who
    cloned the repo in the last 3 days has the `.env` file. Bots scan GitHub for
    API keys within minutes of a push. The only safe action: **rotate (revoke and
    regenerate) every key that was exposed**, then audit for unauthorized usage.

    → [W2 — secrets](../topics/git-security.md#secrets-the-env-workflow)

---

## HTTP & asyncio — new scenarios

### P26 · The 403 vs 401 in practice

<div class="tx-question" markdown>

**🟢 Easy · ⭐⭐ · 1 mark · Topic: HTTP status codes**

You're authenticated with a valid API key, but the API returns 403 when you try to access an admin endpoint. What does this mean?

- **A.** Your API key is invalid or expired — get a new one
- **B.** The endpoint doesn't exist
- **C.** Your key is valid, but your account doesn't have permission for this endpoint
- **D.** You're making too many requests

</div>

??? success "Answer"
    **C** — Your key is valid, but your account doesn't have permission for this endpoint.

??? note "Why"
    **401 = who are you?** (authentication failed — the key is wrong or expired).
    **403 = I know you, but you can't do this** (authorization failed — the key
    is valid but the account lacks permission). The question says "authenticated
    with a valid key" — so authentication succeeded, and the failure is on the
    authorization side.

    → [W1 — status codes](../topics/web-apis.md#http-status-codes-the-family)

---

### P27 · The asyncio pipeline

<div class="tx-question" markdown>

**🟡 Medium · ⭐⭐ · 1 mark · Topic: Concurrency**

You use `asyncio.gather` to call 3 APIs. API A responds in 200ms, API B in 500ms, API C in 2 seconds. What's the total time?

- **A.** 200ms — the fastest response
- **B.** 2 seconds — the slowest response
- **C.** ~900ms — the average
- **D.** 2.7 seconds — the sequential sum

</div>

??? success "Answer"
    **B** — 2 seconds — the slowest response.

??? note "Why"
    Gather launches all tasks simultaneously and returns only when **every task
    completes**. The total is the **max**, not the sum (D — that would be
    sequential) or the average (C). Concurrency removes the sum, not the max —
    one slow API is still the bottleneck.

    → [W5 — asyncio](../topics/rag-agents.md#asynciogather-the-timing-arithmetic)

---

## Data formats & SQL — new scenarios

### P28 · The Parquet advantage in practice

<div class="tx-question" markdown>

**🟡 Medium · ⭐⭐ · 1 mark · Topic: Data formats**

You have a 2GB CSV file with 50 columns. You only need to analyse 3 columns. Converting to Parquet and querying with DuckDB is much faster. Why?

- **A.** Parquet files are compressed with gzip by default
- **B.** Parquet stores data in memory while CSV reads from disk
- **C.** DuckDB has a query cache that CSV readers don't
- **D.** Parquet is columnar — DuckDB reads only the 3 requested columns, touching a fraction of the 2GB

</div>

??? success "Answer"
    **D** — Parquet is columnar — DuckDB reads only the 3 requested columns.

??? note "Why"
    CSV is row-based: reading 3 of 50 columns means parsing every row to extract
    those 3 values — the full 2GB is scanned. Parquet is columnar: each column's
    values live together, so DuckDB reads only the 3 columns' blocks — about 6%
    of the data. This is the same Parquet-vs-CSV question with the mechanism
    emphasised over the "which is faster" framing.

    → [W1 — data formats](../topics/data-ml.md#parquet-vs-text-formats)

---

### P29 · The NULL average

<div class="tx-question" markdown>

**🟢 Easy · ⭐ · 1 mark · Topic: SQL**

You run `SELECT AVG(rating) FROM reviews` and get 3.8. Then you notice 50 rows have NULL ratings. What was actually calculated?

- **A.** The average of only the non-NULL rows — NULLs are skipped by aggregate functions
- **B.** The average treating NULLs as 0
- **C.** An error should have been raised
- **D.** The result is NULL because NULLs are present

</div>

??? success "Answer"
    **A** — The average of only the non-NULL rows — NULLs are skipped.

??? note "Why"
    SQL's three-valued logic: NULL means *unknown*, not zero. `AVG`, `SUM`, and
    `COUNT(column)` **skip NULL values**. The average of `[4, 5, NULL, 3]` is 4
    (average of 4, 5, 3), not 3 (average of 4, 5, 0, 3). `COUNT(*)` counts all
    rows; `COUNT(rating)` counts only non-NULL values.

    → [W1 — SQLite](../weeks/week-1.md#sqlite-one-database-one-file)

---

### P30 · The groupby pattern

<div class="tx-question" markdown>

**🟢 Easy · ⭐⭐ · 1 mark · Topic: pandas**

You have a DataFrame `df` with columns `department`, `salary`, and `years`. You want the average salary per department. Which is correct?

- **A.** `df.sort_values('department')['salary'].mean()`
- **B.** `df.filter('department')['salary'].mean()`
- **C.** `df.groupby('department')['salary'].mean()`
- **D.** `df['salary'].mean()` grouped by `df['department']`

</div>

??? success "Answer"
    **C** — `df.groupby('department')['salary'].mean()`

??? note "Why"
    **groupby = split–apply–combine**: split rows by department, apply `mean()` to
    each group's salary column, combine into one table. Sort (A) arranges but
    doesn't aggregate; filter (B) selects rows by condition (and takes callables,
    not column names); D is not valid pandas syntax. The professor taught this
    exact pattern in ET-2.

    → [W6 — pandas](../topics/data-ml.md#pandas-the-exams-favourite-operations)

---

### P31 · The ETL pattern in practice

<div class="tx-question" markdown>

**🟡 Medium · ⭐⭐ · 1 mark · Topic: ETL**

Your daily ETL job processes yesterday's orders. Some orders from 3 days ago were updated yesterday. Your job misses them because it only looks at yesterday's data. What's the professional fix?

- **A.** Reprocess all historical data daily to catch every update
- **B.** Use a lookback window (process the last 3–5 days) with deduplication on order ID + update timestamp
- **C.** Run the job more frequently (every hour instead of daily)
- **D.** Ask the upstream team to stop updating old orders

</div>

??? success "Answer"
    **B** — Use a lookback window with deduplication on order ID + update timestamp.

??? note "Why"
    The professor's flagship ETL pattern: **lookback window** catches late-arriving
    updates without reprocessing history; **deduplication on (order_id,
    update_timestamp)** means re-seeing a row is harmless — the newest version
    wins. A is "a failure of design" (cost-extensive, slow, database-locking);
    C doesn't help if the job still only looks at yesterday; D is not how
    businesses work.

    → [W6 — ETL](../topics/data-ml.md#etl-the-lookback--dedup-pattern)

---

### P32 · Race condition — the ticket booking

<div class="tx-question" markdown>

**🟡 Medium · ⭐ · 1 mark · Topic: Databases**

Two users simultaneously try to book the last available seat on a flight. The server checks "is a seat available?", gets "yes" for both, and books both — overselling the flight. What is this called and what's the fix?

- **A.** Deadlock — restart the server
- **B.** Load balancer failure — add a second server instance
- **C.** Cache invalidation — clear the cache between requests
- **D.** Race condition — use a database lock or atomic decrement so only one booking succeeds

</div>

??? success "Answer"
    **D** — Race condition — use a database lock or atomic decrement.

??? note "Why"
    **Check-then-act race:** two processes read "available" in the same instant,
    both proceed to write. The fix is atomicity: a database lock (the check and
    write happen as one unit), a unique constraint (the DB rejects the second
    insert), or an atomic decrement (`UPDATE flights SET seats = seats - 1 WHERE
    seats > 0` — only one succeeds). Nothing else in the stack rescues you for
    free.

    → [W1 — race conditions](../topics/git-security.md#race-conditions-the-simultaneous-write)

---

### P33 · Data leakage — the new scenario

<div class="tx-question" markdown>

**🔴 Hard · ⭐ · 1 mark · Topic: ML evaluation**

A stock price model achieves 97% test accuracy. The dataset is a time series, and the train/test split was done randomly (shuffled). In production, accuracy drops to 61%. What went wrong?

- **A.** Random shuffling on a time series creates temporal leakage — future data appeared in the training set, so the model "predicted" patterns it had already seen
- **B.** The model overfitted to the training data
- **C.** The production data has a different distribution
- **D.** The model needs more training epochs

</div>

??? success "Answer"
    **A** — Random shuffling on a time series creates temporal leakage.

??? note "Why"
    Time-series data must be split **chronologically** — train on the past, test
    on the future. Random shuffling mixes future rows into the training set, so
    the model learns tomorrow's patterns and "predicts" them brilliantly. In
    production, there is no future to peek at — the honest number appears. This
    is the same concept as [T1-AN Q16](../pyqs/t1-2026-an.md#q16-the-fraud-model-collapse)
    with a different domain (stocks instead of fraud).

    → [W8 — data leakage](../topics/data-ml.md#ml-data-leakage-the-signature)

---

### P34 · Dependency pinning in practice

<div class="tx-question" markdown>

**🟢 Easy · ⭐ · 1 mark · Topic: Reproducibility**

Your teammate's pipeline works on their machine but fails on yours with an import error. They installed packages with `pip install pandas` (unpinned); you have a different version. What's the fix?

- **A.** Install the exact same version they have: `pip install pandas==2.2.0`
- **B.** Both install from a `requirements.txt` with pinned versions (`pandas==2.2.0`)
- **C.** Use a virtual environment so versions don't conflict
- **D.** Update both machines to the latest version of every package

</div>

??? success "Answer"
    **B** — Both install from a `requirements.txt` with pinned versions.

??? note "Why"
    Pinning ensures the **same install works identically everywhere** — your
    machine, their machine, the CI runner, the production server. A fixes the
    immediate problem but not the systemic one; C isolates environments but
    doesn't ensure the same versions; D risks breaking code that depends on
    specific versions. The professional pattern: `requirements.txt` with exact
    versions, committed to git, installed identically everywhere.

    → [W1 — dependency management](../topics/git-security.md#dependency-management-the-middle-path)

---

### P35 · The JSON parsing trap

<div class="tx-question" markdown>

**🟢 Easy · ⭐ · 1 mark · Topic: JSON**

An API returns a JSON response where the `weather` field is an array of objects. You try `data['weather']['description']` and get a TypeError. Why?

- **A.** The JSON is malformed
- **B.** The API requires authentication for this field
- **C.** `data['weather']` returns a **list**, not a dict — you must index into it first: `data['weather'][0]['description']`
- **D.** You need to use `json.loads` before accessing fields

</div>

??? success "Answer"
    **C** — `data['weather']` returns a list — you must index into it first.

??? note "Why"
    JSON structure: `"weather": [{"description": "clear sky", ...}]` — the value
    is an **array of objects**, not a single object. Chaining `['description']`
    directly onto an array is a TypeError. You must index into the array (`[0]`)
    before accessing keys. This is the same concept as
    [T3-AN Q25](../pyqs/t3-2025-an.md#q25-reading-the-json-response) with the
    error type named.

    → [W1 — JSON parsing](../weeks/week-1.md#data-formats-which-tool-for-which-job)

---

### P36 · The ETL idempotency check

<div class="tx-question" markdown>

**🟡 Medium · ⭐ · 1 mark · Topic: ETL**

Your ETL script writes directly to `output.csv`. A crash mid-write leaves a corrupted file. The next scheduled run reads the corrupted file and produces garbage. What should you have done?

- **A.** Added error handling to catch the crash
- **B.** Used a database instead of a CSV file
- **C.** Run the script more frequently so crashes are caught sooner
- **D.** Written to a temporary file first, then atomically renamed to `output.csv` — a reader never sees a half-written file

</div>

??? success "Answer"
    **D** — Written to a temporary file first, then atomically renamed.

??? note "Why"
    **Idempotency** (running twice = same result as once) requires atomic writes:
    build the output in a temp file, then `mv` (rename) it to the final name in
    one operation. A rename is atomic on POSIX — either the old file or the new
    file exists, never a half-written version. This is the same pattern as
    [T3-AN Q11](../pyqs/t3-2025-an.md#q11-idempotent-etl-scripts) with the
    crash scenario made explicit.

    → [W6 — ETL patterns](../topics/data-ml.md#etl-the-lookback--dedup-pattern)


---

## Official-topic drill — T1/T2/T5

*New questions targeting the official study-guide sub-topics that had no coverage before.*

### P37 · The percentile report

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T1: Metrics**

A dashboard reports "average latency 150ms" and "p99 latency 4 seconds" for the same service. The correct interpretation:

- **A.** The dashboard has a bug — the numbers are inconsistent
- **B.** Typical requests are fast, but 1 in 100 is catastrophic — the mean averages away a severe tail. Investigate the slow tail
- **C.** Average is the better number; ignore p99
- **D.** p99 means 99% of requests take 4 seconds

</div>

??? success "Answer"
    **B** — A low mean with a high p99 is the signature of a tail problem: most
    users are fine, the unluckiest 1% suffer. The mean can't see it; percentiles can.

??? note "Why"
    The mean is dominated by the *bulk* of requests; p99 is defined by the *worst*.
    Both numbers are true simultaneously — that's exactly why percentiles exist.

    → [Reading metrics](../topics/data-ml.md#reading-metrics-averages-lie-percentiles-dont)

---

### P38 · The half-loaded table

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T2: Partial runs**

An ETL job crashed midway through loading a table, and a BI tool queried the table during the crash. The design that prevents anyone from ever reading a half-loaded table:

- **A.** Load faster so crashes are less likely
- **B.** Load into a staging table and swap atomically when complete — readers see all-or-nothing
- **C.** Tell the BI team to refresh later
- **D.** Retry the job; duplicates are better than missing rows

</div>

??? success "Answer"
    **B** — Atomic swap (or run-boundary marking) means a partial load is never
    visible. Speed, hopes, and duplicates don't fix visibility.

??? note "Why"
    The pattern: **staging + atomic swap**. Readers either see the previous complete
    load or the new complete load — never the middle.

    → [Pipeline integrity](../topics/data-ml.md#data-pipeline-integrity-the-five-properties)

---

### P39 · The retry that doubled

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T2: Idempotency**

A webhook handler processes payment notifications. The payment provider retries failed deliveries — automatically, up to 5 times. The handler must be:

- **A.** Fast, so retries never happen
- **B.** Idempotent — a duplicate notification for the same payment must be a no-op (unique payment ID check before processing)
- **C.** Asynchronous, so order doesn't matter
- **D.** Encrypted, so retries are safe

</div>

??? success "Answer"
    **B** — If the provider retries (and it will), the same notification arrives
    twice. Without a check-then-process on the payment ID, you double-record.

??? note "Why"
    **Retries are certain, not possible** — any system that receives deliveries
    (webhooks, queue messages, imports) must treat duplicates as normal input.

    → [Pipeline integrity](../topics/data-ml.md#data-pipeline-integrity-the-five-properties)

---

### P40 · What the error rate said

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T1: Rates vs counts**

Monday: 500 errors from 50,000 requests. Tuesday: 600 errors from 90,000 requests. The correct comparison:

- **A.** Tuesday is worse — 100 more errors
- **B.** Monday is worse — 1.0% error rate vs Tuesday's 0.67%; counts without denominators mislead
- **C.** They're equal — close enough
- **D.** Tuesday's traffic is the problem

</div>

??? success "Answer"
    **B** — 500/50,000 = 1.0%; 600/90,000 = 0.67%. Reliability *improved* on
    Tuesday despite more errors — the rate is the comparable number.

??? note "Why"
    Always: **count of what, over what denominator, in what window.** Raw counts
    track traffic; rates track health.

    → [Reading metrics](../topics/data-ml.md#reading-metrics-averages-lie-percentiles-dont)

---

### P41 · The audit question

<div class="tx-question" markdown>

**🔴 Hard · 1 mark · T2: Provenance**

An auditor asks your data team to prove that a corrected revenue figure is trustworthy. The strongest evidence:

- **A.** The team lead's assurance that the correction was right
- **B.** A correction log showing: the original wrong value, the corrected value, the reason, who approved, and when — with the raw data still recoverable
- **C.** The corrected dashboard itself
- **D.** An email thread agreeing the number looked wrong

</div>

??? success "Answer"
    **B** — Provenance is the *record*: original → correction → reason → authority
    → timestamp. Assurance and dashboards are claims; the log is evidence.

??? note "Why"
    **Corrections never destroy the record of what was corrected.** Append-only
    versions or a correction log — that's what makes corrections auditable.

    → [Pipeline integrity](../topics/data-ml.md#data-pipeline-integrity-the-five-properties)

---

### P42 · The fork PR

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T3: Secret isolation**

Your CI workflow runs on `pull_request` (including forks) and its steps reference `$DEPLOY_KEY`. A first-time contributor's PR includes `run: echo $DEPLOY_KEY`. What should happen — and why it's a design failure if it works:

- **A.** The echo prints the key into the public build log — untrusted triggers must never see secrets; scope secrets to trusted events only
- **B.** Nothing — contributors are trustworthy
- **C.** The echo fails silently
- **D.** GitHub blocks PRs with echo commands

</div>

??? success "Answer"
    **A** — Fork PR code is untrusted code. If untrusted triggers can reference
    secrets, a one-line "test" exfiltrates them. Secret visibility must be gated
    by trigger trust.

??? note "Why"
    Same principle as prompt injection: **untrusted input must never reach
    privileged capabilities.**

    → [Release security](../topics/git-security.md#release-security-what-cicd-must-get-right)

---

### P43 · Two dashboards, one truth

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T5: Statelessness**

Two identical API instances behind a load balancer. A user logs in on instance A; their next request hits instance B and appears logged out. The diagnosis:

- **A.** The load balancer is misrouting
- **B.** Session state lives in instance A's memory — in-memory state is invisible to other instances. Sessions belong in shared durable storage
- **C.** Instance B is a different app version
- **D.** The user's cookies are disabled

</div>

??? success "Answer"
    **B** — The classic statelessness failure. Any instance must be able to serve
    any request — which requires state (sessions, carts, uploads) to live
    outside the instances.

??? note "Why"
    In-memory state works until the second instance or the first restart — then
    it's a mystery bug. Redis/DB for sessions; treat memory as disposable cache.

    → [Statelessness](../topics/web-apis.md#statelessness-durable-storage-why-servers-are-allowed-to-die)

---

### P44 · The calendar app's access

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · T5: Delegated access**

A scheduling app asks for "read your calendar" via Google OAuth. A user later finds the app's practices suspicious and wants it gone. The correct remedy and why it works:

- **A.** Change the Google password — tokens expire instantly then
- **B.** Revoke the app's grant in Google settings — the scoped token dies without touching the password, because the app never had it
- **C.** Delete the app's account on its own site — that always kills Google access
- **D.** Revoke and change the password — both are required

</div>

??? success "Answer"
    **B** — Delegated access means the app holds a scoped, revocable token, not
    your credentials. Revocation ends it; the password was never exposed.

??? note "Why"
    This is the entire point of OAuth delegation: **least privilege, revocable
    by the user, credentials never shared.**

    → [Identity vs delegated access](../topics/web-apis.md#identity-vs-delegated-access-whos-asking-on-whose-behalf)

---

### P45 · The rewritten history

<div class="tx-question" markdown>

**🔴 Hard · 1 mark · T5: Git history**

After `git filter-repo` removes a leaked key from history and the team force-pushes, a teammate's local repo still shows the old commits and their pushes are rejected. Why — and the fix:

- **A.** Their clone is haunted; re-install git
- **B.** The rewrite changed every commit hash from the rewrite point back — their local history now diverges. They must re-clone (or hard-reset to the new remote). This is why rewrites are announced
- **C.** They need to push harder
- **D.** filter-repo undid itself

</div>

??? success "Answer"
    **B** — Rewriting history invalidates every hash from the rewrite point back.
    Old clones reference dead IDs. Announce, coordinate, re-clone.

??? note "Why"
    Hashes are content addresses — change the content (drop a commit), change the
    address. **`--force-with-lease`** protects the push; coordination protects
    the team.

    → [Git history](../topics/git-security.md#safe-git-history-changes-rewriting-is-surgery)

---

### P46 · The strongest boundary

<div class="tx-question" markdown>

**🔴 Hard · 1 mark · T4: Authorization**

"Only the sales team may see the client list" — for an LLM assistant with RAG over company documents. Rank from strongest to weakest:

- **A.** System prompt instruction > post-hoc output filter > retrieval scoping
- **B.** Retrieval scoping (client list not in the sales team's corpus) > permission checks in code > system prompt instruction
- **C.** All three are equivalent — defense in depth means any one suffices
- **D.** Fine-tuning > everything

</div>

??? success "Answer"
    **B** — Architectural controls (what *can* be retrieved, what code enforces)
    are deterministic; prompt instructions are requests the model can be talked
    out of.

??? note "Why"
    **A prompt is not a security boundary.** What the system cannot access, it
    cannot leak — no matter how clever the injection.

    → [Reliability discipline](../topics/llm-prompting.md#reliability-discipline-for-llm-systems)
