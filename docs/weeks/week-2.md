# Week 2 — APIs, deployment & the web platform

<div class="tx-meta" markdown>

~25 min read · Examinable: 🔥🔥🔥 (highest PYQ density) · GA2 · [ET-1 session](../sessions/et-01.md)

</div>

This is the week the exam loves most. CORS, Docker, caching, secrets, deployment limits — nearly every 🔥🔥 topic in the [frequency table](../pyqs/index.md#the-priority-list-how-often-each-topic-is-asked) lives here. The course files are practical walkthroughs; this page adds what the exam actually asks: **the theory layer, the decision rules, and the traps.**

Course files: FastAPI · CORS middleware · Google OAuth · config management · Docker Compose · deployment platforms · logging/testing · observability · Cloudflare tunnels · local LLMs (LM Studio, Ollama, llama.cpp, vLLM, MLX).

---

## FastAPI — the exam's favourite backend

**What it is:** a Python framework that turns functions into HTTP endpoints. You write a decorator above a function; the world can call it over HTTP and get JSON back.

```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}
```

Run it with `uv run uvicorn main:app --reload`, and two magic URLs appear: `/docs` (interactive Swagger UI where you can click and test every endpoint) and `/redoc` (clean documentation). FastAPI reads your Python type hints to generate both — the same type hints that power its request validation.

**Why it matters for the exam:** FastAPI appears almost always as the *backend in a scenario* — the CORS story, the LLM-proxy story, the reliability short-answer. You never write FastAPI code in the ET; you reason about **what it does**:

- It runs **server-side** — it can read environment variables, touch databases, and hold secrets that the browser must never see.
- It **sends response headers** — which is where CORS permission and `Cache-Control` live.
- It **validates with Pydantic** — declare `age: int` in a request model and a string `"25"` is coerced, `"abc"` is a clean 422 error, a missing field never reaches your function ([T1-FN Q14](../pyqs/t1-2026-fn.md#q14-pydantic-type-coercion)).
- It **serves JSON** — `response.json()` on the client parses what FastAPI returned.

The exam's FastAPI scenarios follow one pattern: *a student builds a FastAPI app, something goes wrong (browser blocks it, LLM bill explodes, one request hangs the server), and you diagnose why.* Understanding the four points above is enough to diagnose all of them.

<div class="tx-anchor" markdown>

**Asked in:** GA2 (`fastapi-metrics-cors-server`, `middleware-ratelimit-cors-server`) · [T1-FN Q24 — the FastAPI reliability short-answer](../pyqs/t1-2026-fn.md#q24-making-the-endpoint-reliable)

</div>

---

## CORS — the most-tested concept in the corpus

### What an origin is

**Origin = scheme + host + port.** Change any one of the three and you have a different origin:

```
http://localhost:3000   ← frontend (React dev server)
http://localhost:8000   ← backend API — DIFFERENT origin (port differs)
https://localhost:3000  ← different again (scheme differs)
```

This is why "they're both on localhost" doesn't help — the ports differ, so the browser treats them as strangers.

### The policy and its reason

The browser's **Same-Origin Policy** stops JavaScript on one origin from reading a response from another origin — unless the *receiving server* explicitly allows it via the `Access-Control-Allow-Origin` response header. In FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # the frontend's origin
)
```

!!! success "Must remember — the security rationale (the professor's own words)"
    Browsers block cross-origin reads because web apps load **heavily nested
    third-party JavaScript libraries**. If one is compromised, it could execute
    background requests to an external server and **exfiltrate sensitive client
    data**. The Same-Origin Policy is the guardrail; CORS is the server's controlled
    permission — the gate in the guardrail.

    Picture it: you're logged into your bank in one tab. You open `evil.com` in
    another. Evil.com's JavaScript tries `fetch("https://bank.com/api/me")` — and
    the browser blocks the *read*, because bank.com never said evil.com could listen.

### Who can fix it — and who can't

!!! warning "Trap — only the backend can fix a CORS error"
    The **server that sends the response** grants permission — so only the backend
    can add the header. The frontend cannot grant itself permission (that would
    defeat the entire security model). If an option says "add the header to the fetch
    call," it's wrong.

!!! danger "Wrong belief — 'CORS is a server error'"
    No — it's a **browser enforcement**. `curl`, Postman, and Python scripts are
    never blocked by CORS; only browser JavaScript is. Your API may even be working
    perfectly — it's the browser's read that's refused.

<div class="tx-anchor" markdown>

**Asked in 6 places:** [T1-AN Q13 — the fix](../pyqs/t1-2026-an.md#q13-fixing-the-cors-error) · [T1-AN Q18 — the error side](../pyqs/t1-2026-an.md#q18-why-the-browser-blocked-it) · [T1-FN Q2 — the reason](../pyqs/t1-2026-fn.md#q2-why-the-cors-error-happens) · [T1-FN Q18 — the local HTML block](../pyqs/t1-2026-fn.md#q18-the-local-html-block) · [ET-1 session](../sessions/et-01.md) · GA2

</div>

---

## Caching — TTL, Cache-Control, and the cache-buster

Three exam questions in every recent paper come from this one family. Understand the flow and all three fall:

```
Browser → Proxy → CDN → Origin server
   ↕         ↕      ↕
  each layer can keep a copy — if the response says it may
```

### TTL — Time-To-Live

How long a cached copy stays fresh. After the TTL expires, the next request goes to the origin again. The **units are always seconds**: 3600 = 1 hour, 7200 = 2 hours, 300 = 5 minutes.

### Cache-Control — the header that grants permission

```
Cache-Control: public, max-age=3600
```

- `public` = intermediaries (proxies, CDNs) may cache — not just your own browser
- `max-age=3600` = the copy is fresh for 3600 seconds

Within that window, repeat requests **never reach the origin** — which is why the student's LLM bill collapsed in the FastAPI scenario: the same movie summary was served from a cache for an hour instead of re-invoking the LLM every refresh.

### The cache-buster — forcing a fresh fetch

```
https://api.example.com/data        ← cached
https://api.example.com/data?t=123  ← NEW URL = cache miss → origin hit
```

Caches key on the full URL. Change the URL (append a random query parameter) and the cache has never seen it — it must fetch. This is why deployments bump `app.js?v=3`: one character invalidates every user's cached copy at once.

!!! success "The professor's Twitter example (ET-1)"
    On a slow network, Twitter's sidebar and UI render instantly while the tweets
    lag. The static assets come from your **local browser cache** — saved on a
    previous visit, no network needed. The dynamic content (your timeline) can't be
    cached and must be fetched. That's caching in one image: **cache what doesn't
    change; fetch what does.**

!!! warning "Trap — the units ladder"
    "The API uses `max-age=7200`. How long does the cache hold data?" The options:
    7200 milliseconds / 7200 minutes / 2 hours / 72 days. Only "2 hours" survives
    the units check. When the exam offers four unit-interpretations of one number,
    it's testing whether you know the *convention* (seconds), not the arithmetic.

### The dashboard pattern (ET-2's arithmetic)

A dataset updating hourly but queried every few seconds is the perfect cache candidate: one write per hour, ~3600 reads. A **5-minute TTL** means the database is hit once per interval regardless of user count — the professor's exact example of balancing freshness against database conservation.

<div class="tx-anchor" markdown>

**Asked in 8+ places:** [T1-AN Q19 — what max-age does](../pyqs/t1-2026-an.md#q19-what-max-age3600-does) · [T1-AN Q22 — the cache-buster](../pyqs/t1-2026-an.md#q22-forcing-fresh-data-past-the-cache) · [T1-FN Q13 — the benefit](../pyqs/t1-2026-fn.md#q13-the-cache-control-headers-benefit) · [T1-FN Q19 — the units](../pyqs/t1-2026-fn.md#q19-reading-the-cache-duration) · [T1-FN Q21 — forcing fresh](../pyqs/t1-2026-fn.md#q21-forcing-a-fresh-fetch) · [T3-FN Q9 — the dashboard TTL](../pyqs/t3-2025-fn.md#q9-caching-an-hourly-updated-dashboard) · [ET-1](../sessions/et-01.md) · [ET-2](../sessions/et-02.md)

</div>

---

## Secrets — the .env workflow

The single most repeated security mark in the paper set — asked in at least one form in **every paper**:

```bash
# .env — stays on YOUR machine, never committed
OPENAI_API_KEY=sk-...
DATABASE_URL=sqlite:///./dev.db
SECRET_KEY=generated-with-openssl-rand-hex-32
```

```gitignore
# .gitignore — add BEFORE the first commit
.env
*.env
```

```python
# load in code
import os
key = os.getenv("OPENAI_API_KEY")
```

### Why the history is the problem

!!! success "Must remember"
    Once a secret is pushed to GitHub, it's in the **history forever** — clones,
    forks, scrapers all have it. Deleting the file later doesn't delete the history.
    Bots scan GitHub for API keys **within minutes** of a push. The only safe
    workflow: `.env` + `.gitignore` + `os.getenv()`.

    The professor's escalation: scraped keys → impersonation → "a security disaster."

### The principle behind it (12-factor)

**Same code, different values.** Your app runs identically in dev / staging / production by reading different environment variables — config lives in the *environment*, never in the *code*. That's why `.env` exists at all: it's the environment, in a file, for local development.

### Where each value lives

| Location | What belongs there |
|---|---|
| `.env` | Project-specific secrets and config |
| `~/.bashrc` | Machine/user-level defaults (every terminal session) |
| GitHub Actions secrets | CI/CD values |
| Hugging Face Space secrets | Deployment values |

Golden rule: **commit code and `.env.example`; never commit `.env`.** The `.env.example` file (with empty values) tells teammates what to create.

<div class="tx-anchor" markdown>

**Asked in 5+ places:** [T1-AN Q5 — the .gitignore MSQ](../pyqs/t1-2026-an.md#q5-what-goes-into-gitignore) · [T1-FN Q8 — why .env exists](../pyqs/t1-2026-fn.md#q8-why-env-files-exist) · [T3-AN Q24 — where the API key lives](../pyqs/t3-2025-an.md#q24-where-the-api-key-lives) · [T3-FN Q6 — environment variables](../pyqs/t3-2025-fn.md#q6-why-environment-variables) · [ET-1](../sessions/et-01.md)

</div>

---

## Docker — the exam's favourite deployment story

Four exam questions live here, all asked in every recent paper. Together they cover Docker's entire examinable surface.

### 1. Environment parity — the core promise

An Ubuntu container built anywhere runs identically on Windows, macOS, Linux — because the OS is *inside the image*. Docker packages the entire runtime: operating system, system libraries, Python, your dependencies, your code. The host machine's setup becomes irrelevant. "Works on my machine" stops being an excuse.

The exam asks this as: *you build on Linux, push to Docker Hub, a colleague pulls on Windows — what happens?* It just works ([T1-FN Q5](../pyqs/t1-2026-fn.md#q5-docker-on-windows)).

### 2. The missing install — isolation cuts both ways

A container that crashes with "can't find the `requests` library" is missing one line:

```dockerfile
RUN pip install -r requirements.txt
```

Containers are **isolated by design** — nothing from your laptop leaks in, *including your installed packages*. The Dockerfile must install everything itself. The professor paired these two ideas deliberately: parity works *because* isolation is total.

### 3. EXPOSE vs -p — documentation vs the bridge

```dockerfile
EXPOSE 8501        # documentation: "this app listens on 8501" — a LABEL
```

```bash
docker run -p 8501:8501 app   # THIS publishes the port to the host
```

!!! success "The professor's one-liner (ET-2)"
    **EXPOSE is a label; `-p` is the bridge.** EXPOSE tells other containers and
    tooling which port the app uses — it does not make the port reachable from your
    machine. Only `-p host:container` at runtime does that. If a container runs but
    `localhost:8501` refuses to connect, you forgot `-p`.

### 4. Layer caching — the build-speed question

Docker builds images in **layers**, one instruction per layer. The caching rule: a layer rebuilds only when its inputs change — and every layer *after* a changed layer rebuilds too.

```dockerfile
FROM python:3.12
COPY requirements.txt .      # ← copy ONLY the dependency list first
RUN pip install -r requirements.txt   # ← install (stays cached)
COPY . .                     # ← NOW copy the code
```

Copy the code first (`COPY . .` before `RUN pip install`) and every minor code edit changes the COPY layer — which invalidates the install layer — which re-downloads every dependency on every build. Copy `requirements.txt` first and the install layer stays cached across code-only changes. Same final image; completely different build speed.

!!! warning "Trap — reading the crash"
    A container that exited still has its stdout/stderr captured:
    `docker logs <container>` replays them. The first stop for any crash — the box
    keeps the diary.

<div class="tx-anchor" markdown>

**Asked in 10+ places:** [T1-AN Q28 — EXPOSE vs -p](../pyqs/t1-2026-an.md#q28-expose-vs--p) · [T1-AN Q24 — layer caching SA](../pyqs/t1-2026-an.md#q24-docker-layer-caching) · [T1-FN Q5 — parity](../pyqs/t1-2026-fn.md#q5-docker-on-windows) · [T1-FN Q11 — missing install](../pyqs/t1-2026-fn.md#q11-the-missing-pip-install) · [T3-FN Q27 — the run command](../pyqs/t3-2025-fn.md#q27-running-with-the-port-published) · [T3-FN Q29 — docker logs](../pyqs/t3-2025-fn.md#q29-reading-the-crash-logs) · [T3-FN Q30 — why Docker](../pyqs/t3-2025-fn.md#q28-why-docker-for-deployment) · [T3-FN Q31 — the install line](../pyqs/t3-2025-fn.md#q30-the-dockerfile-install-line) · [T3-FN Q32 — EXPOSE](../pyqs/t3-2025-fn.md#q31-what-expose-does) · [ET-1](../sessions/et-01.md) · [ET-2](../sessions/et-02.md)

</div>

---

## Deployment platforms — know the tiers

| Platform | Best for | The exam angle |
|---|---|---|
| **GitHub Pages** | Static files only (HTML/CSS/JS) | **No backend, no database** — FastAPI on Pages fails |
| **Hugging Face Spaces** | ML demos, Gradio/Streamlit | Port 7860, Docker Spaces |
| **Vercel** | Serverless frontend/backend | **Strict timeouts** (~10s at the edge) |
| **Render / Railway** | Backend + DB + Redis | Full app hosting |
| **GCP Cloud Run / AWS ECS** | Managed Docker containers | Production containers |
| **Cloudflare Workers** | Edge functions | **300+ edge locations** — independent failure |

### The two serverless limits — the exam's favourite pair

!!! success "RAM + Time — memorize them as a pair"
    - **Time:** an edge function needing 40 seconds dies at the 10-second limit →
      [T1-AN Q17](../pyqs/t1-2026-an.md#q17-the-edge-function-timeout). Serverless
      platforms enforce hard ceilings — no negotiation, no warning.
    - **RAM:** a 2GB file works on your laptop (8–32 GB), dies on a free-tier
      function (128–512 MB) → [T1-FN Q10](../pyqs/t1-2026-fn.md#q10-serverless-memory-limits).
      The fix is streaming/chunking, not a bigger plan.

    Long jobs belong in containers, queues, or workers — not serverless functions.

### The resilience story — why edge locations don't care

When Vercel crashes, a Cloudflare Worker doing the same job **keeps serving** — it runs on 300+ independent edge locations, and one provider's outage doesn't touch them. This is the architecture of edge computing: code runs *near the user*, replicated everywhere, with no single origin to fail ([T1-AN Q8](../pyqs/t1-2026-an.md#q8-cloudflare-workers-resilience)).

### The port trap

Locally you use `8000`; many platforms inject `$PORT`. The platform-safe pattern:

```bash
uv run uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
```

<div class="tx-anchor" markdown>

**Asked in:** GA2 (`deploy-analytics-platform-server`, `compose-redis-tunnel-server`) · [T1-AN Q8 — edge resilience](../pyqs/t1-2026-an.md#q8-cloudflare-workers-resilience) · [T1-AN Q17 — the timeout](../pyqs/t1-2026-an.md#q17-the-edge-function-timeout) · [T1-FN Q10 — the RAM limit](../pyqs/t1-2026-fn.md#q10-serverless-memory-limits) · [T1-FN Q3 — GitHub Pages](../pyqs/t1-2026-fn.md#q3-fastapi-on-github-pages)

</div>

---

## Statelessness & durable storage — why servers are allowed to die

*On the official topic list: Web/API/Infra Fundamentals.*

**Stateless** means: the server keeps *nothing* in memory between requests. Any request can go to any instance, and any instance can be killed and replaced at any moment. That's what makes scaling and deploys safe — no instance is special because no instance *remembers* anything.

**Where does state go? Everywhere else — durably:**

| State | Lives in |
|---|---|
| Data that must survive | **Database** |
| Fast, temporary lookups | **Redis / cache** |
| Work to be done later | **Queue** (a worker picks it up) |
| User identity between requests | **Session store / token** |

**The trap the exam tests:** an app keeps a Python dictionary of logged-in users in memory. It works locally, works with one instance — then the platform restarts the container (serverless does this *constantly*) and everyone is logged out, or a second instance is added and half the users "don't exist." The fix: sessions in Redis/DB, files in object storage, in-memory caches treated as *disposable* (rebuildable) state.

**The architectural pattern that follows:** API (stateless) → queue (durable) → worker (does the slow thing) → database (durable). Each part can crash, restart, and scale independently — that's the serverless-limits workaround ([the two limits](#deployment-platforms-know-the-tiers) above) and the resilience story, unified.

---

## API error design — failing usefully

*On the official topic list: Web/API/Infra Fundamentals.*

Returning the *right* error is a design skill, not a formality. The rules:

**1. The status code carries the category.**

| Code | Meaning | Who can fix it |
|---|---|---|
| **400** | malformed request (bad JSON, missing field, failed validation) | the caller |
| **401** | not authenticated — *who are you?* | the caller (credentials) |
| **403** | authenticated, not permitted — *I know you, you can't do this* | the caller (permissions) or the owner |
| **404** | resource doesn't exist (or is hidden on purpose) | the caller's URL |
| **422** | well-formed request, semantically invalid (Pydantic's validation errors) | the caller's data |
| **429** | rate limit exceeded — slow down / retry later | the caller (eventually) |
| **500** | *our* code or dependencies failed | the server team |

**2. The body carries the diagnosis.** `400 Bad Request` alone tells the caller nothing. A useful error names the field, the problem, and ideally the fix: `{"error": "quantity must be >= 1, got 0", "field": "quantity"}`. Pydantic + FastAPI give this nearly free.

**3. Fail fast, fail loud — never silently.** Reject bad input at the boundary with a clear error *before* processing. The alternative — accepting it and failing downstream — produces the 3am-debugging scenario: the error surfaces far from its cause. (The same principle as [the sentiment API case](../sessions/et-03.md).)

**4. Never leak internals in errors.** Stack traces to the client are a security hole (they map your code); log the trace server-side, return a clean message + a request ID the user can quote.

!!! tip "CORS / auth / authorization — three distinct concerns"
    Exams mix these deliberately. **CORS** = *the browser's* rule about reading
    cross-origin responses (fixed by the *server's* response headers). **AuthN** =
    verifying identity (401 when it fails). **AuthZ** = verifying permission (403
    when it fails). A request can pass all three checks, fail any one of them, and
    each failure is fixed by a different party.

---

## Identity vs delegated access — who's asking, and on whose behalf

*On the official topic list: Web/API/Infra Fundamentals.*

Builds directly on [sessions vs bearer tokens](#google-oauth-sessions-vs-bearer-tokens):

- **Identity** = *who you are* — the user or service making the request (API key, session, JWT).
- **Delegated access** = *what you're allowed to do on someone else's behalf* — the classic OAuth flow: "connect this app to my Google Drive" means the app acts *as you*, but only within the scopes you granted.

| | API key (identity) | OAuth token (delegated) |
|---|---|---|
| Represents | the key's owner, fully | the user, limited to granted scopes |
| Scope | everything the key can do | only what was delegated (read email, not delete) |
| Revocation | rotate the key | user revokes the app's grant — key survives |

**The exam shape:** "A third-party app reads a user's calendar." That's delegated access — the app never holds the user's password, holds a *scoped, revocable* token instead. The design principle: **least privilege** — grant the minimum scope, for the minimum time, revocable by the user. When you audit such a system, the questions are: what scopes? who granted? how revoked?

---

## Safe git history changes — rewriting is surgery

*On the official topic list: Web/API/Infra Fundamentals.*

Sometimes history must change: a secret was committed, a giant file bloats the repo, garbage commits must go before a public release. The safe procedure:

**1. Stop the bleeding first.** If a secret is in history, **rotate it immediately** — treat it as leaked the moment it was pushed, whatever you do to history afterwards. Removing it from the repo does not un-leak it ([secrets](#secrets-the-env-workflow)).

**2. Rewrite on a branch, review, then force-push.**

```bash
git filter-repo --path .env --invert-paths   # or BFG for large files
git push --force-with-lease                   # safer than --force
```

- **`--force-with-lease` over `--force`:** it refuses to overwrite if someone pushed in the meantime — history rewrites are the one place a plain force-push silently destroys teammates' work.
- **Coordinate first:** everyone must rebase after a rewrite; announce it, or you'll spend the day untangling diverged histories.

**3. What changes and what doesn't.** Rewriting changes commit hashes from the rewrite point back — every commit ID after the affected history is *new*. Tags, open PRs, and local clones all reference the old IDs. This is why rewrites are rare, announced, and treated as surgery — not routine cleanup.

!!! warning "Trap — 'I deleted the file, so the secret is gone'"
    Deleting the file in a new commit leaves it in every previous commit — still
    cloneable by anyone. History rewrite (or rotation) is the only real fix.

→ Short-note version: [Web & APIs](../topics/web-apis.md) · [Git, security & practices](../topics/git-security.md)

---

## Google OAuth — sessions vs bearer tokens

Two ways a server remembers who you are, and the exam's identity questions live on this distinction:

| | Session cookie | Bearer token |
|---|---|---|
| Storage | Browser stores a cookie automatically | Client stores a token manually |
| Sending | Browser attaches it to every request | Client puts it in the `Authorization` header |
| Visibility | `HttpOnly` flag → JavaScript can't read it | Readable by whoever holds it |
| Best for | Browser apps | APIs, scripts, mobile apps |

The `HttpOnly` cookie flag is the security detail worth knowing: it prevents XSS attacks from stealing your session — JavaScript simply cannot access the cookie, even when running on your page.

→ GA2: `oauth-jwks-verify-server`

---

## Logging, testing & observability — the three signals

When your app runs in production, these are the three ways to understand it from outside:

| Signal | Question it answers | Example |
|---|---|---|
| **Logs** | What exactly happened? | `user_id=12 login failed` |
| **Metrics** | How much / how fast? | `http_requests_total`, p95 latency |
| **Traces** | Where did this request spend time? | API → DB → Payment (230ms → 180ms → 20ms) |

!!! success "The exam connection — debugging a 500"
    With a gateway in the path, a 500 error could originate from **any layer the
    request crossed**: routing logic, auth middleware, the service itself, or the
    network between them ([T1-FN Q28](../pyqs/t1-2026-fn.md#q28-debugging-the-500)).
    Observability is how you tell them apart. Bad debugging: "it works on my
    laptop." Good debugging: the dashboard shows p95 latency up, 500s up, `/search`
    slow, logs show DB timeout — now you know where to look.

The practical stack: Python's `logging` module (`logger.info()`, `logger.error()`), pytest for tests, FastAPI's `TestClient` for endpoint tests, Prometheus for metrics (your app exposes `/metrics`, Prometheus scrapes it).

<div class="tx-anchor" markdown>

**Asked in:** GA2 (`observability-metrics-server`) · [T1-FN Q28 — debugging the 500](../pyqs/t1-2026-fn.md#q28-debugging-the-500)

</div>

---

## Cloudflare tunnels — exposing localhost safely

A tunnel gives your local app a public URL without deploying it — for webhook testing, demos, sharing with a professor. The course's key distinction (and the exam's hidden trap):

| Address | Meaning |
|---|---|
| `127.0.0.1` / `localhost` | Only my own machine |
| `0.0.0.0` | Listen on all local interfaces — **not** a public URL |
| `192.168.x.x` | My private Wi-Fi/LAN — other devices on same network |
| Public IP | Internet-facing (router/ISP) |

The common confusion: binding to `0.0.0.0` makes your server *listen* everywhere on your machine's network interfaces — it does **not** put you on the internet. For that, you need a tunnel (or a deployment).

→ GA2: `ollama-tunnel-llm-server`, `compose-redis-tunnel-server`

---

## Local LLMs — the tool-selection table

| Tool | Best for | Why you'd pick it |
|---|---|---|
| **LM Studio** | GUI, model search, local API | Beginner-friendly, no terminal |
| **Ollama** | Fast CLI prototyping, local REST API | Developer's default for local models |
| **llama.cpp** | Deep control, GGUF models, CPU/GPU tuning | Systems-minded, maximum offline |
| **vLLM** | Production GPU serving, batching | Backend/ML engineer, throughput |
| **MLX / mlx-lm** | Apple Silicon native | Mac-only, M-chip optimized |

The legal idea worth one mark: **tool license and model license are separate** — a tool may be MIT while the model you download has its own terms (check the model card on Hugging Face).

→ GA2: `local-llm-structured-server`

---

## Self-check — can you answer these without looking?

??? question "1. Frontend on :3000, backend on :8000 — the browser blocks the fetch. Who fixes it, and how?"
    The **backend**, by adding `Access-Control-Allow-Origin` for the frontend's origin.
    The frontend can't grant itself permission. Different ports = different origins.

??? question "2. Your Docker container runs but `localhost:8501` refuses to connect. What did you forget?"
    The `-p 8501:8501` flag on `docker run`. `EXPOSE 8501` in the Dockerfile is
    documentation only — a label, not a bridge.

??? question "3. A 2GB file loads fine on your laptop but crashes a serverless function. Why?"
    Free-tier functions enforce strict RAM limits (128–512 MB vs your laptop's
    8–32 GB). The fix: stream/chunk, don't load it all — or use a container.

??? question "4. `max-age=7200` — how long is the cache fresh?"
    **2 hours.** `max-age` is always in seconds: 7200 ÷ 3600 = 2.

??? question "5. Why does copying all your code before `pip install` ruin Docker build speed?"
    Every code edit changes the `COPY` layer, which invalidates all later layers —
    including the dependency install. Copy `requirements.txt` first so the install
    layer stays cached across code-only changes.

??? question "6. What's the difference between a session cookie and a bearer token?"
    A session cookie is stored by the browser and attached automatically (with
    `HttpOnly` protection). A bearer token is stored by the client and sent manually
    in the `Authorization` header — better for APIs and scripts.
