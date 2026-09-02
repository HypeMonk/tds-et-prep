# Mock ET — full paper

<div class="tx-meta" markdown>

40 marks · ~25 questions · the real structure: marks ramp → scenario blocks → short answers · [Answer key at the bottom](#answer-key)

</div>

!!! warning "Simulate the real thing"
    Set a timer for **60 minutes**. Answer every question — there is no negative
    marking. For the short answers, write your response (max 200 words each)
    before scrolling to the answer key. The marks ramp is real: don't get stuck
    on a 1-marker.

---

## Part 1 · One-mark questions (9 questions, 9 marks)

*~15 minutes — move briskly, these are warm-ups*

### M1

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Topic: Data formats**

Which data serialization format preserves column types and enables reading only the columns you need?

- **A.** CSV
- **B.** JSON
- **C.** Parquet
- **D.** XML

</div>

### M2

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Topic: Bash**

Which command shows all files in a directory, including hidden ones?

- **A.** `ls -h`
- **B.** `ls -a`
- **C.** `ls -r`
- **D.** `ls -l`

</div>

### M3

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Topic: HTTP**

An API returns HTTP 429. What does this indicate?

- **A.** The server encountered an unhandled exception
- **B.** The client has exceeded the permitted number of requests
- **C.** The client has not provided valid authentication credentials
- **D.** The requested resource has been moved permanently

</div>

### M4

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Topic: Git**

Which command shows the differences between your working directory and the last commit?

- **A.** `git status`
- **B.** `git log`
- **C.** `git diff`
- **D.** `git show`

</div>

### M5

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · Topic: Secrets · MSQ — pick all correct**

Which files should be added to `.gitignore` before the first commit? *(four filenames shown; two are correct)*

- **A.** `.env`
- **B.** `README.md`
- **C.** `credentials.json`
- **D.** `requirements.txt`

</div>

### M6

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Topic: Docker**

You run `docker run -p 8080:80 myapp`. The Dockerfile contains `EXPOSE 80`. What does the `-p` flag do that `EXPOSE` doesn't?

- **A.** Installs the application's dependencies
- **B.** Actually publishes the port to the host machine
- **C.** Documents which port the app listens on
- **D.** Configures the container's network interface

</div>

### M7

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Topic: Concurrency**

You run three API calls with `asyncio.gather`. They take 1s, 2s, and 5s respectively. What is the total execution time?

- **A.** 1 second
- **B.** ~2.7 seconds
- **C.** 5 seconds
- **D.** 8 seconds

</div>

### M8

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Topic: LLM APIs**

What does the "Structured Outputs" feature guarantee?

- **A.** 100% factually accurate responses
- **B.** The output is valid against your JSON schema
- **C.** The model will not hallucinate
- **D.** Faster response times

</div>

### M9

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Topic: RAG**

In a RAG system, what happens first when a user asks a question?

- **A.** The LLM generates a response from its training data
- **B.** The query is converted to an embedding and similar chunks are retrieved
- **C.** The question is stored for future analytics
- **D.** The model is fine-tuned on the user's question

</div>

---

## Part 2 · Two-mark questions (5 questions, 10 marks)

*~15 minutes — reasoning and diagnosis*

### M10

<div class="tx-question" markdown>

**🟡 Medium · 1 mark (2-mark tier) · Topic: CORS**

Your frontend on `https://app.example.com` fetches from `https://api.example.net`. The browser blocks the request. Who must fix this and how?

- **A.** The frontend — add CORS headers to the fetch call
- **B.** The backend — add `Access-Control-Allow-Origin: https://app.example.com` to the response headers
- **C.** The DNS provider — configure a CNAME record
- **D.** The browser — disable the Same-Origin Policy

</div>

### M11

<div class="tx-question" markdown>

**🟡 Medium · 1 mark (2-mark tier) · Topic: Docker**

A Python app container starts and immediately crashes with `ModuleNotFoundError: No module named 'pandas'`. The Dockerfile copies the code and runs it. What is missing?

- **A.** A `FROM python:3.12` base image
- **B.** An `EXPOSE 8000` directive
- **C.** A `RUN pip install -r requirements.txt` instruction
- **D.** A `CMD ["python", "app.py"]` command

</div>

### M12

<div class="tx-question" markdown>

**🟡 Medium · 1 mark (2-mark tier) · Topic: Caching**

Your API adds `Cache-Control: public, max-age=1800`. What is the main effect?

- **A.** The server pauses 1800ms before responding
- **B.** Browsers, proxies, and CDNs may serve cached copies for 30 minutes — identical requests stop reaching the origin
- **C.** The response body is encrypted for 1800 seconds
- **D.** The client is limited to one request per 30 minutes

</div>

### M13

<div class="tx-question" markdown>

**🟡 Medium · 1 mark (2-mark tier) · Topic: Validation**

Your server expects an integer for `quantity`. An API sends the string `"5"`. Using Pydantic with `quantity: int`, what happens?

- **A.** The server crashes — string types are incompatible
- **B.** Pydantic automatically converts `"5"` to the integer `5`
- **C.** The request is rejected with a 500 error
- **D.** The variable is deleted due to wrong format

</div>

### M14

<div class="tx-question" markdown>

**🟡 Medium · 1 mark (2-mark tier) · Topic: ML evaluation**

A model achieves 96% test accuracy. After removing 100 test samples that accidentally appeared in the training data, accuracy drops to 78%. What does this reveal?

- **A.** Removing training data naturally reduces accuracy
- **B.** The 96% was inflated by data leakage — the model memorized the leaked examples
- **C.** The model needs more epochs
- **D.** The test set is too small

</div>

---

## Part 3 · Three-mark questions (2 questions, 6 marks)

*~10 minutes — multi-step diagnosis*

### M15

<div class="tx-question" markdown>

**🔴 Hard · 1 mark (3-mark tier) · Topic: ML evaluation**

A fraud detection model achieves 99% test accuracy but 54% in production. The dataset is chronological, the split used `shuffle=True`, and rolling statistics were computed before splitting. What caused the collapse?

- **A.** Model overfitting — common above 95% accuracy
- **B.** Shuffling created temporal leakage; rolling stats before the split caused feature leakage
- **C.** The production data has a different distribution
- **D.** Fraud patterns evolve; historical models always fail

</div>

### M16

<div class="tx-question" markdown>

**🔴 Hard · 1 mark (3-mark tier) · Topic: Agents**

Your research agent has access to `search_web`, `read_file`, `send_email`, and `delete_file`. After a prompt injection, it calls `delete_file` on a critical document. Which TWO design principles were violated?

- **A.** The model was too small for the task
- **B.** Destructive tools should require human approval
- **C.** Tools should be allow-listed (deny by default)
- **D.** The system prompt should have been longer

</div>

---

## Part 4 · Scenario block 1 — the microservice platform (M17–M21)

*~10 minutes — read the passage, then answer*

<div class="tx-scenario" markdown>

**Read the passage carefully:**

A streaming platform serves 40 million users across 150 countries. Their mobile app, web player, and smart TV apps connect to 65 different backend microservices — user profiles, recommendations, encoding, billing, and analytics.

Managing 65 different API endpoints created chaos: mobile developers hardcoded URLs that broke during server migrations, and each service implemented its own authentication inconsistently.

The engineering team deployed an API gateway — a single entry point that routes requests to appropriate backends, with authentication happening once at the gateway using OAuth tokens.

However, last month the gateway crashed during a traffic spike, taking down the platform for 18 minutes. The team now runs multiple gateway instances behind a load balancer, with health checks and circuit breakers.

</div>

### M17

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Topic: API architecture**

What is the primary benefit of the API gateway's centralized routing?

- **A.** It makes the backend services run faster
- **B.** The client knows one URL; the gateway routes to the correct service
- **C.** It eliminates the need for backend services
- **D.** It caches all API responses automatically

</div>

### M18

<div class="tx-question" markdown>

**🟢 Easy · 1 mark · Topic: API architecture**

Why did running multiple gateway instances behind a load balancer fix the outage problem?

- **A.** It made each instance run faster
- **B.** If one instance fails during a traffic spike, others continue serving
- **C.** It reduced the total number of requests
- **D.** It eliminated the need for authentication

</div>

### M19

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · Topic: HTTP status codes**

A request through the gateway returns a 500 error. Which layers should you investigate?

- **A.** Only the mobile app's request formatting
- **B.** The gateway's routing logic, authentication middleware, the backend service, and network connectivity
- **C.** Only the database query performance
- **D.** Only the CDN cache configuration

</div>

### M20

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · Topic: API architecture**

Why did the team implement OAuth authentication at the gateway instead of in each of the 65 services?

- **A.** OAuth is faster at the gateway
- **B.** Users authenticate once instead of 65 times; the auth code lives in one place instead of 65 inconsistent implementations
- **C.** The gateway has more storage for tokens
- **D.** OAuth doesn't work in individual microservices

</div>

### M21

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · Topic: Architecture**

What is the role of the circuit breaker the team added?

- **A.** It prevents electricity overloads in the data center
- **B.** When a backend service fails repeatedly, the circuit breaker stops sending requests to it — preventing cascading failures and giving it time to recover
- **C.** It encrypts traffic between the gateway and backends
- **D.** It limits each user to a fixed number of requests per minute

</div>

---

## Part 5 · Short-answer questions (M22–M23) — LLM-graded

*~10 minutes — write your answers before looking at the key*

### M22

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · Topic: Docker · Short answer — max 200 words**

A team's CI pipeline takes 15 minutes to build their Docker image. The Dockerfile starts with `COPY . /app`, followed by `RUN pip install -r requirements.txt`. Even single-line code changes trigger full rebuilds including dependency re-downloads. Explain the problem structurally and describe the fix.

</div>

### M23

<div class="tx-question" markdown>

**🟡 Medium · 2 marks · Topic: RAG · Short answer — max 200 words**

A company's RAG chatbot answers questions from product manuals. When a manual is updated, the chatbot still returns information from the old version. Explain why this happens and describe the operational fix.

</div>

---

## Part 6 · Remaining scenario block (M24–M25)

### M24

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · Topic: Serverless**

An edge function processes video thumbnails and needs 45 seconds, but the platform enforces a 10-second timeout. What type of solution is needed?

- **A.** A faster model
- **B.** A container, queue, or worker — not a serverless function
- **C.** More memory
- **D.** A CDN

</div>

### M25

<div class="tx-question" markdown>

**🟡 Medium · 1 mark · Topic: ETL**

Your daily order-processing pipeline only looks at yesterday's data. Orders from 3 days ago that were updated yesterday are missed. What pattern fixes this?

- **A.** Reprocess all historical data
- **B.** Lookback window with deduplication on order ID and timestamp
- **C.** Run the job every hour instead of daily
- **D.** Process only today's data going forward

</div>

---

## Scoring guide

| Score | Interpretation |
|---|---|
| **32+ / 40** | Exam-ready — you know the material |
| **25–31 / 40** | Close — review the topics you missed in the [short notes](../revise/index.md) |
| **18–24 / 40** | Study needed — read the relevant [week notes](../learn/index.md), then retake |
| **< 18 / 40** | Start from the [exam pattern page](../exam/exam-pattern.md) and work through the weeks |

---

## Answer key

!!! warning "Don't peek until you've answered everything"

| Q | Answer | Topic | Where to review |
|---|---|---|---|
| M1 | **C** — Parquet (columnar, typed) | Data formats | [Parquet](../topics/data-ml.md#parquet-vs-text-formats) |
| M2 | **B** — `ls -a` (all files) | Bash | [Bash](../pyqs/t3-2025-an.md#q3-listing-hidden-files) |
| M3 | **B** — Rate limit exceeded | HTTP | [Status codes](../topics/web-apis.md#http-status-codes-the-family) |
| M4 | **C** — `git diff` | Git | [Git](../topics/git-security.md#git-the-daily-loop) |
| M5 | **A + C** — `.env` and `credentials.json` | Secrets | [Secrets](../topics/git-security.md#secrets-the-env-workflow) |
| M6 | **B** — Actually publishes the port | Docker | [EXPOSE vs -p](../topics/docker-deployment.md#docker-expose-vs--p) |
| M7 | **C** — 5 seconds (the max) | Asyncio | [asyncio](../topics/rag-agents.md#asynciogather-the-timing-arithmetic) |
| M8 | **B** — Valid against your schema | LLM APIs | [Structured Outputs](../topics/llm-prompting.md#structured-outputs) |
| M9 | **B** — Query embedded, chunks retrieved | RAG | [RAG pipeline](../topics/rag-agents.md#the-rag-pipeline) |
| M10 | **B** — Backend adds the CORS header | CORS | [CORS](../topics/web-apis.md#cors-same-origin-policy) |
| M11 | **C** — `RUN pip install` missing | Docker | [Missing install](../topics/docker-deployment.md#docker-the-missing-install) |
| M12 | **B** — 30 min cached copies | Caching | [Caching](../topics/web-apis.md#caching-ttl-cache-control-cache-buster) |
| M13 | **B** — Converts "5" to 5 | Validation | [Pydantic](../pyqs/t1-2026-fn.md#q14-pydantic-type-coercion) |
| M14 | **B** — Inflated by leakage | ML eval | [Leakage](../topics/data-ml.md#ml-data-leakage-the-signature) |
| M15 | **B** — Temporal + feature leakage | ML eval | [Leakage](../pyqs/t1-2026-an.md#q16-the-fraud-model-collapse) |
| M16 | **B + C** — Human approval + allow-list | Agents | [Agent guardrails](../practice/new-topics.md#p7-the-tool-guardrail) |
| M17 | **B** — One URL, gateway routes | API arch | [Gateway](../topics/web-apis.md#api-gateway-the-single-entry-point) |
| M18 | **B** — Others continue serving | API arch | [Gateway](../pyqs/t1-2026-fn.md#q27-surviving-the-crash) |
| M19 | **B** — Every layer crossed | HTTP | [500 debugging](../pyqs/t1-2026-fn.md#q28-debugging-the-500) |
| M20 | **B** — Auth once, one implementation | API arch | [Gateway](../sessions/et-01.md#api-gateway--redundancy-the-80-microservice-story) |
| M21 | **B** — Stops requests to failing service | Architecture | [Circuit breaker](../weeks/week-2.md#api-gateway--redundancy) |
| M22 | *See model answer below* | Docker | [Layer caching](../practice/short-answers.md#sa-2-the-docker-build-optimisation) |
| M23 | *See model answer below* | RAG | [Stale docs](../practice/short-answers.md#sa-5-the-rag-design-question) |
| M24 | **B** — Container/queue/worker | Serverless | [Serverless limits](../topics/docker-deployment.md#serverless-limits-ram--time-as-a-pair) |
| M25 | **B** — Lookback + dedup | ETL | [ETL](../topics/data-ml.md#etl-the-lookback--dedup-pattern) |

### M22 model answer

> **Problem:** `COPY . /app` runs before `RUN pip install`, so every code change
> invalidates the COPY layer, which forces the install layer (and everything
> after) to rebuild.
>
> - **Layer caching rule:** a layer rebuilds only when its inputs change; every
>   layer after a changed layer rebuilds too.
> - **Consequence:** single-line edits re-download all dependencies despite
>   `requirements.txt` being unchanged.
> - **Fix:** `COPY requirements.txt .` → `RUN pip install -r requirements.txt`
>   → `COPY . /app`. The install layer stays cached across code-only changes.
> - *Trade-off:* none — identical image, faster builds.

### M23 model answer

> **Cause:** the vector database is a snapshot — old manual chunks were not
> removed when the new version was ingested. Both versions embed, both retrieve,
> and the LLM cannot tell which is authoritative.
>
> - **Mechanism:** the RAG pipeline retrieves chunks by embedding similarity;
>   old and new versions of the same section have similar embeddings and both
>   match the query.
> - **Fix:** re-ingest atomically — when a manual updates, remove the old
>   version's chunks and insert the new version's in one operation. Version or
>   timestamp the chunks so the retrieval layer can prefer the current version.
> - **Prevention:** treat the vector DB like a cache with an invalidation
>   strategy, not a permanent store.
> - *Assumption:* the manual system can notify the RAG pipeline when content
>   changes.
