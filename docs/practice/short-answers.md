# Practice — short answers (LLM-graded)

<div class="tx-meta" markdown>

8 questions · the new exam section · practice the writing method, not just the content · [Grading guide](../exam/llm-grading-guide.md)

</div>

These are **not** real exam questions — they're our practice prompts in the exact format the exam uses: a scenario, a task, a 200-word cap, LLM grading. Write your answer **before** opening the model answer. Then compare structure, not just content.

**The template:** Conclusion first → bold-reason bullets → one assumption/trade-off last.

---

### SA-1 · The CORS fix

<div class="tx-question" markdown>

**🟡 Medium · ⭐⭐ · 2 marks · Topic: CORS · Short answer — max 200 words**

A developer deploys a React frontend on Vercel and a FastAPI backend on Railway. When the frontend calls the backend, the browser shows a CORS error. Explain why this happens and describe the correct fix, including which side must change.

</div>

??? success "Model answer"

    **The backend must add CORS headers permitting the frontend's origin.**

    - **Why it happens:** The browser's Same-Origin Policy blocks JavaScript on
      one origin from reading a response from another. Origin = scheme + host +
      port — the Vercel frontend and the Railway backend are on different hosts,
      so they are different origins. The policy exists because web apps load
      nested third-party JavaScript; a compromised library could otherwise
      exfiltrate data cross-origin.
    - **The fix:** The *receiving server* grants permission by adding
      `Access-Control-Allow-Origin: https://myapp.vercel.app` to its response
      headers. In FastAPI: `app.add_middleware(CORSMiddleware,
      allow_origins=["https://myapp.vercel.app"])`.
    - **Why the frontend can't fix it:** A client cannot grant itself permission
      to read another origin's response — that would defeat the security model.
      Adding headers to the fetch call is ineffective.
    - *Assumption:* the API is public; authentication is separate from CORS.

??? note "What the grader sees"
    Conclusion ✓ · mechanism (origin definition) ✓ · the fix with code ✓ · why
    the other side can't fix it ✓ · one assumption ✓ — five checkable points in
    ~140 words.

---

### SA-2 · The Docker build optimisation

<div class="tx-question" markdown>

**🟡 Medium · ⭐⭐ · 2 marks · Topic: Docker · Short answer — max 200 words**

A team's CI pipeline takes 12 minutes to build their Docker image, even for single-line code changes. The Dockerfile starts with `COPY . /app` followed by `RUN pip install -r requirements.txt`. Explain the problem and the fix.

</div>

??? success "Model answer"

    **The problem:** `COPY . /app` runs before `pip install`, so every code change
    invalidates the first layer and forces all subsequent layers to rebuild.

    - **Layer caching rule:** Docker rebuilds a layer only when its inputs change —
      and every layer *after* a changed layer rebuilds too.
    - **The consequence:** a single-line Python edit changes the `COPY` layer →
      the `pip install` layer after it rebuilds → dependencies re-download on
      every build, even though `requirements.txt` never changed.
    - **The fix:** copy `requirements.txt` first, install dependencies, then copy
      the code:
      ```dockerfile
      COPY requirements.txt .
      RUN pip install -r requirements.txt
      COPY . /app
      ```
      Now the install layer stays cached across code-only changes.
    - *Trade-off:* none — the final image is identical; only build speed improves.

??? note "What the grader sees"
    Problem stated ✓ · mechanism (layer invalidation) ✓ · fix with code ✓ ·
    trade-off ✓ — the "diagnose-a-failure" shape done right.

---

### SA-3 · The caching strategy

<div class="tx-question" markdown>

**🟡 Medium · ⭐⭐ · 2 marks · Topic: Caching · Short answer — max 200 words**

A product catalog API serves 10,000 requests per minute. The underlying database updates every 15 minutes. Users complain the API is slow. Propose a caching strategy with a specific TTL, and explain how you'd handle a product price change that must appear immediately.

</div>

??? success "Model answer"

    **Proposed strategy:** Cache API responses at the application layer with a
    5-minute TTL.

    - **Why caching:** The workload is asymmetric — 1 database update per 15
      minutes vs 10,000 reads per minute. Without caching, the database handles
      every read; with a 5-minute TTL, it handles at most 3 queries per 15
      minutes.
    - **TTL choice:** 5 minutes means data is at most 5 minutes stale, which is
      acceptable for a catalog that changes every 15 minutes. A longer TTL (15
      min) would be freshest-aligned but less responsive to errors.
    - **Immediate price change:** Add a cache invalidation hook — when a price
      is updated in the database, the application explicitly evicts that
      product's cache entry. The next request fetches fresh data and re-caches
      it. Alternatively, use a cache-buster URL parameter (`?v=<timestamp>`)
      for that specific product.
    - *Trade-off:* slight staleness (≤5 min) in exchange for ~99.97% reduction
      in database load.

??? note "What the grader sees"
    Strategy with specific TTL ✓ · the arithmetic ✓ · immediate-change handling ✓ ·
    trade-off ✓ — the "improve-a-design" shape with numbers.

---

### SA-4 · The API reliability improvement

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · Topic: API design · Short answer — max 200 words**

A sentiment analysis API receives malformed inputs: sometimes the `text` field is missing, sometimes it's an empty string, sometimes it's a number instead of a string. The API crashes unpredictably. Describe the structural improvements needed to make it reliable.

</div>

??? success "Model answer"

    **The principle:** validate at the boundary — reject what you can't process,
    loudly and consistently.

    - **Pydantic model:** declare the request schema
      (`class SentimentRequest(BaseModel): text: str = Field(min_length=1)`)
      so missing fields, empty strings, and wrong types all return automatic 422
      errors — before the code runs.
    - **Type coercion:** Pydantic converts compatible types (the number `25` to
      the string `"25"`) while rejecting incompatible ones — the crash-prone
      ambiguity is resolved at the boundary.
    - **Response model:** declare the output schema
      (`response_model=SentimentResponse`) so the API contract is visible to
      clients and consistent.
    - **Error format:** structured error details (field, reason, received type)
      rather than a stack trace — a client can programmatically handle the error.
    - *Trade-off:* stricter contracts reject sloppy callers — that is the point.

??? note "What the grader sees"
    Principle named ✓ · Pydantic with code ✓ · coercion explained ✓ · response
    model ✓ · error format ✓ · trade-off ✓ — the exact same structure as the
    real T1-FN Q24.

---

### SA-5 · The RAG design question

<div class="tx-question" markdown>

**🔴 Hard · NEW · 2 marks · Topic: RAG · Short answer — max 200 words**

A company wants to build a support chatbot that answers questions from 200 product manuals using RAG. Describe the pipeline you would build, including how you'd handle chunking and what you'd do when manuals are updated.

</div>

??? success "Model answer"

    **Pipeline:** chunk → embed → store → retrieve → augment → generate.

    - **Chunking:** split each manual into 1–2 paragraph chunks (~200–500 words)
      — large enough to be self-contained, small enough to retrieve precisely.
      Use heading-aware splitting so chunks respect the manual's structure.
    - **Embedding + storage:** embed each chunk and store in a vector database
      with metadata (manual ID, version, section, ingest timestamp).
    - **Retrieval:** embed the user's query, retrieve the top-K closest chunks
      (cosine similarity), optionally combine with keyword search (hybrid) for
      exact terms like error codes.
    - **Generation:** place the retrieved chunks in the prompt as context and
      let the LLM compose a grounded answer.
    - **Updates:** when a manual changes, re-ingest the new version
      atomically and expire the old chunks (by version or timestamp) — otherwise
      both versions embed and the LLM can't tell which is authoritative.
    - *Constraint:* I'd validate the answer cites the retrieved chunks before
      returning it, to catch hallucination.

??? note "What the grader sees"
    Full pipeline ✓ · chunk size with reasoning ✓ · hybrid search mentioned ✓ ·
    update handling (the stale-doc problem) ✓ · constraint stated ✓ — new-topic
    short-answer practice.

---

### SA-6 · The agent guardrail design

<div class="tx-question" markdown>

**🔴 Hard · NEW · 2 marks · Topic: Agents · Short answer — max 200 words**

You're building a research agent that can search the web, read files, and send summary emails. Describe the guardrails you'd implement to prevent it from causing harm, even if compromised by prompt injection.

</div>

??? success "Model answer"

    **Principle:** assume the model will be compromised — design so that a
    compromised agent still can't cause serious harm.

    - **Tool allow-listing (deny by default):** the agent can only call
      `search_web` and `read_file`. No `delete`, no `execute`, no database
      writes — tools it doesn't have, it can't misuse.
    - **Human approval for destructive actions:** `send_email` requires a human
      click before execution. The agent drafts; the human approves. A
      compromised agent can draft malicious emails but cannot send them.
    - **Sandboxing:** the agent runs in a container — even if it tries to access
      the host filesystem or network beyond its allow-list, the sandbox contains
      the blast radius.
    - **Budget limits:** maximum steps per task (e.g., 20), maximum cost per
      session (e.g., $1), maximum execution time. A looping agent is halted
      and reported, not left to run overnight.
    - **Output validation:** the agent's responses pass through a schema before
      reaching the user — malformed or dangerous output is caught at the boundary.
    - *Trade-off:* these limits reduce the agent's autonomy — that is by design.

??? note "What the grader sees"
    Principle stated ✓ · five defense layers ✓ · each with its mechanism ✓ ·
    trade-off ✓ — the OWASP LLM06 answer in full.

---

### SA-7 · The data pipeline diagnosis

<div class="tx-question" markdown>

**🟡 Medium · ⭐ · 2 marks · Topic: ETL · Short answer — max 200 words**

A daily ETL job that processes customer orders is producing duplicate records. Investigation reveals: the job runs at midnight, processes "yesterday's" orders, but some orders from 2 days ago are updated yesterday and get re-processed. The job has no deduplication logic. Describe the fix.

</div>

??? success "Model answer"

    **Fix:** implement a lookback window with deduplication.

    - **Lookback window:** instead of processing only yesterday's orders
      (midnight to midnight), process the last 3 days. This catches orders that
      were placed earlier but *updated* yesterday — the late-arriving data.
    - **Deduplication:** key on (order_id, last_updated_timestamp). When the
      job re-sees an order it has already processed, it compares timestamps:
      if the order hasn't changed, skip it; if it has been updated, overwrite
      with the newer version. The newest record always wins.
    - **Why not reprocess all history:** "cost-extensive" — wasted compute,
      excessive time, potential database lockups. The lookback catches the same
      data at a fraction of the cost.
    - **Idempotency:** with this pattern, running the job twice produces the
      same result as running it once — the dedup handles the overlap.
    - *Assumption:* the order system provides a reliable `last_updated`
      timestamp on every record.

??? note "What the grader sees"
    Both components named ✓ · mechanism for each ✓ · why the alternative fails ✓ ·
    idempotency connection ✓ · assumption ✓ — the professor's flagship pattern.

---

### SA-8 · The client follow-up questions

<div class="tx-question" markdown>

**🟡 Medium · NEW · 2 marks · Topic: Requirements analysis · Short answer — max 200 words**

A client says: "We want a dashboard that shows our sales data." This is all the information you have. What are the three most important follow-up questions you would ask before building anything?

</div>

??? success "Model answer"

    **The three questions:**

    1. **What decision will this dashboard inform?** (The use case determines
       everything: a daily standup needs different data than a quarterly board
       review. If no one can name the decision, the dashboard may not be needed.)

    2. **What data exists, in what systems, and how fresh is it?** (Sales data
       may live in a CRM, an ERP, and a spreadsheet — with different update
       frequencies. The data's availability and freshness constrain what's
       buildable and what "real-time" means in practice.)

    3. **Who will use it, on what device, and how often?** (A sales manager on
       a phone checking hourly needs a different design than an analyst on a
       desktop doing deep dives. The audience determines the layout, the level
       of detail, and the performance requirements.)

    *Assumption:* the client has at least a rough idea of what "sales data"
    means (revenue, units, pipeline, or all three) — if not, a fourth question
    would nail down the metrics.

??? note "What the grader sees"
    Three numbered questions ✓ · each with its reasoning ✓ · the constraint/
    assumption at the end ✓ — this is the exact scenario the professor described
    as the new subjective format.
