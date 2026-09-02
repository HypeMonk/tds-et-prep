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
- **B.** A `file://` page is a different origin from `http://localhost:8000` — the Same-Origin Policy blocks the read
- **C.** Browsers don't allow JavaScript in local files
- **D.** The HTML file needs to be served from a web server first

</div>

??? success "Answer — B"
    A `file://` page is a different origin from `http://localhost:8000` — the Same-Origin Policy blocks the read.

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
- **B.** CORS is a browser-only enforcement — curl, Postman, and Python scripts are never blocked; only browser JavaScript is
- **C.** The React app is sending the request with wrong headers
- **D.** The API needs to return different data format for browsers

</div>

??? success "Answer — B"
    CORS is a browser-only enforcement — curl is never blocked.

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

- **A.** The app is listening on the wrong interface inside the container
- **B.** You forgot `-p 3000:3000` on `docker run` — the port is not published to the host
- **C.** The container doesn't have network access
- **D.** Port 3000 is already in use on the host

</div>

??? success "Answer — B"
    You forgot `-p 3000:3000` on `docker run` — the port is not published to the host.

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

??? success "Answer — B"
    `COPY . /app` is the first instruction — every code change invalidates the first layer, and every subsequent layer rebuilds.

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
- **B.** `private` tells the CDN it may NOT cache, and `max-age=0` tells the browser the response is immediately stale — every request goes to the origin
- **C.** The CDN charges per header, and you're sending too many
- **D.** `max-age=0` means the CDN caches for 0 seconds but still counts the request

</div>

??? success "Answer — B"
    `private` tells the CDN it may NOT cache, and `max-age=0` means immediately stale — every request hits the origin.

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

- **A.** Upgrade the database to a larger instance
- **B.** Cache the query results with a TTL of 5–30 minutes — the database goes from 12,000 queries/hour to 2–12 queries/hour
- **C.** Move the dashboard to a CDN
- **D.** Reduce the number of users who can access the dashboard

</div>

??? success "Answer — B"
    Cache the query results with a TTL of 5–30 minutes.

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
- **B.** Rotate every key that was in the file — the git history still contains the .env, and anyone who cloned the repo has the secrets
- **C.** Delete the GitHub repository and create a new one
- **D.** Ask GitHub to purge the commit from their servers

</div>

??? success "Answer — B"
    Rotate every key — the git history still contains the secrets.

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
- **B.** Your key is valid, but your account doesn't have permission for this endpoint
- **C.** The endpoint doesn't exist
- **D.** You're making too many requests

</div>

??? success "Answer — B"
    Your key is valid, but your account doesn't have permission for this endpoint.

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
- **B.** ~900ms — the average
- **C.** 2 seconds — the slowest response
- **D.** 2.7 seconds — the sequential sum

</div>

??? success "Answer — C"
    2 seconds — the slowest response.

??? note "Why"
    Gather launches all tasks simultaneously and returns only when **every task
    completes**. The total is the **max**, not the sum (D — that would be
    sequential) or the average (B). Concurrency removes the sum, not the max —
    one slow API is still the bottleneck.

    → [W5 — asyncio](../topics/rag-agents.md#asynciogather-the-timing-arithmetic)

---

## Data formats & SQL — new scenarios

### P28 · The Parquet advantage in practice

<div class="tx-question" markdown>

**🟡 Medium · ⭐⭐ · 1 mark · Topic: Data formats**

You have a 2GB CSV file with 50 columns. You only need to analyse 3 columns. Converting to Parquet and querying with DuckDB is much faster. Why?

- **A.** Parquet files are compressed with gzip by default
- **B.** Parquet is columnar — DuckDB reads only the 3 requested columns, touching a fraction of the 2GB
- **C.** DuckDB has a query cache that CSV readers don't
- **D.** Parquet stores data in memory while CSV reads from disk

</div>

??? success "Answer — B"
    Parquet is columnar — DuckDB reads only the 3 requested columns.

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

- **A.** The average treating NULLs as 0
- **B.** The average of only the non-NULL rows — NULLs are skipped by aggregate functions
- **C.** An error should have been raised
- **D.** The result is NULL because NULLs are present

</div>

??? success "Answer — B"
    The average of only the non-NULL rows — NULLs are skipped.

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
- **B.** `df.groupby('department')['salary'].mean()`
- **C.** `df.filter('department')['salary'].mean()`
- **D.** `df['salary'].mean()` grouped by `df['department']`

</div>

??? success "Answer — B"
    `df.groupby('department')['salary'].mean()`

??? note "Why"
    **groupby = split–apply–combine**: split rows by department, apply `mean()` to
    each group's salary column, combine into one table. Sort (A) arranges but
    doesn't aggregate; filter (C) selects rows by condition (and takes callables,
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

??? success "Answer — B"
    Use a lookback window with deduplication on order ID + update timestamp.

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
- **B.** Race condition — use a database lock or atomic decrement so only one booking succeeds
- **C.** Cache invalidation — clear the cache between requests
- **D.** Load balancer failure — add a second server instance

</div>

??? success "Answer — B"
    Race condition — use a database lock or atomic decrement.

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

- **A.** The model overfitted to the training data
- **B.** Random shuffling on a time series creates temporal leakage — future data appeared in the training set, so the model "predicted" patterns it had already seen
- **C.** The production data has a different distribution
- **D.** The model needs more training epochs

</div>

??? success "Answer — B"
    Random shuffling on a time series creates temporal leakage.

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

??? success "Answer — B"
    Both install from a `requirements.txt` with pinned versions.

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
- **B.** `data['weather']` returns a **list**, not a dict — you must index into it first: `data['weather'][0]['description']`
- **C.** The API requires authentication for this field
- **D.** You need to use `json.loads` before accessing fields

</div>

??? success "Answer — B"
    `data['weather']` returns a list — you must index into it first.

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
- **B.** Written to a temporary file first, then atomically renamed to `output.csv` — a reader never sees a half-written file
- **C.** Run the script more frequently so crashes are caught sooner
- **D.** Used a database instead of a CSV file

</div>

??? success "Answer — B"
    Written to a temporary file first, then atomically renamed.

??? note "Why"
    **Idempotency** (running twice = same result as once) requires atomic writes:
    build the output in a temp file, then `mv` (rename) it to the final name in
    one operation. A rename is atomic on POSIX — either the old file or the new
    file exists, never a half-written version. This is the same pattern as
    [T3-AN Q11](../pyqs/t3-2025-an.md#q11-idempotent-etl-scripts) with the
    crash scenario made explicit.

    → [W6 — ETL patterns](../topics/data-ml.md#etl-the-lookback--dedup-pattern)
