# Week 2 — APIs, deployment & the web platform

<span class="tx-meta">**~25 min read · examinable: 🔥🔥🔥 (the highest PYQ density of any week)** · GA: [GA2](https://exam.sanand.workers.dev/exam-tds-2026-05-ga2.js)</span>

This is the week the exam loves most. CORS, Docker, caching, secrets, deployment limits — nearly every 🔥🔥 topic in the [frequency table](../pyqs/index.md#the-priority-list-how-often-each-topic-is-asked) lives here. The course files are practical walkthroughs; this page adds what the exam actually asks: **the theory layer, the decision rules, and the traps.**

Course files: FastAPI · CORS middleware · Google OAuth · config management · Docker Compose · deployment platforms · logging/testing · observability · Cloudflare tunnels · local LLMs (LM Studio, Ollama, llama.cpp, vLLM, MLX).

---

## FastAPI — the exam's favourite backend

**What it is:** a Python framework that turns functions into HTTP endpoints. You write `@app.get("/predict")` above a function; the world can call it.

```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}
```

Run with `uv run uvicorn main:app --reload`. The `/docs` endpoint gives you automatic interactive documentation.

!!! success "The theory the exam tests"
    FastAPI appears in the exam almost always as the *backend in a scenario* — the
    CORS story, the LLM-proxy story, the reliability short-answer. You never write
    FastAPI code in the ET; you reason about **what it does**: it runs server-side,
    it sends response headers, it validates with Pydantic, it serves JSON.

→ GA2 drills this: `fastapi-metrics-cors-server`, `middleware-ratelimit-cors-server`

---

## CORS — the most-tested concept in the corpus

**Origin = scheme + host + port.** Change any one and you have a different origin:

```
http://localhost:3000   ← frontend
http://localhost:8000   ← backend API — DIFFERENT origin (port differs)
```

The browser's **Same-Origin Policy** blocks JavaScript on one origin from reading a response from another — unless the *receiving server* explicitly allows it via the `Access-Control-Allow-Origin` response header.

```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # the frontend's origin
)
```

!!! success "Must remember — the security rationale"
    Browsers block cross-origin reads because web apps load **nested third-party
    JavaScript libraries**. If a library is compromised, without this policy it could
    silently exfiltrate your data to `evil.com`. CORS is the *server's controlled
    permission* — the guardrail with a gate.

!!! warning "Trap — who can fix it"
    Only the **backend** can fix a CORS error. The frontend cannot grant itself
    permission — that would defeat the security model. If an option says "add the
    header to the fetch call," it's wrong.

!!! danger "Wrong belief"
    "CORS is a server error." No — it's a **browser enforcement**. `curl`, Postman,
    and Python scripts are never blocked by CORS; only browser JavaScript is.

→ **Asked in 6 places:** [T1-AN Q13 + Q18](../pyqs/t1-2026-an.md#q13-fixing-the-cors-error), [T1-FN Q2 + Q18](../pyqs/t1-2026-fn.md#q2-why-the-cors-error-happens), ET-1, GA2

---

## Caching — TTL, Cache-Control, and the cache-buster

Three exam questions in every recent paper come from this one family:

| Concept | What it is | The exam question |
|---|---|---|
| **TTL** (Time-To-Live) | How long a cached copy stays fresh | "How long does the cache hold data?" — seconds: 3600 = 1 hour, 7200 = 2 hours |
| **Cache-Control: public, max-age=3600** | The header that authorizes browsers, proxies and CDNs to serve copies | "What's the main benefit?" — identical requests stop reaching your origin |
| **Cache-buster (`?t=123`)** | A fake-new URL that forces a cache miss | "How do you force fresh data?" — change the URL, change the cache key |

!!! success "The professor's Twitter example (ET-1)"
    On a slow network, Twitter's sidebar and UI render instantly while tweets lag —
    the static assets come from your **local browser cache**, the dynamic content
    doesn't. That's caching in one image.

!!! warning "Trap — units"
    `max-age` is always in **seconds**. The options ladder: 7200 milliseconds /
    7200 minutes / 2 hours / 72 days — only "2 hours" survives the units check.

→ **Asked in 8+ places:** [T1-AN Q19 + Q22](../pyqs/t1-2026-an.md#q19-what-max-age3600-does), [T1-FN Q13 + Q19 + Q21](../pyqs/t1-2026-fn.md#q13-the-cache-control-headers-benefit), [T3-FN Q9](../pyqs/t3-2025-fn.md#q9-caching-an-hourly-updated-dashboard), ET-1 + ET-2

---

## Secrets — the .env workflow

The single most repeated security mark in the paper set:

```bash
# .env (stays on YOUR machine, never committed)
OPENAI_API_KEY=sk-...
DATABASE_URL=sqlite:///./dev.db
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

!!! success "Must remember"
    Once a secret is pushed to GitHub, it's in the **history forever** — clones,
    forks, scrapers. Deleting the file later doesn't delete the history. Bots scrape
    for keys within minutes. The workflow: `.env` + `.gitignore` + `os.getenv()`.

!!! success "The 12-factor principle behind it"
    **Same code, different values.** Your app runs identically in dev / staging /
    production by reading different environment variables — config lives in the
    environment, never in the code.

→ **Asked in 5+ places:** [T1-AN Q5](../pyqs/t1-2026-an.md#q5-what-goes-into-gitignore), [T1-FN Q8](../pyqs/t1-2026-fn.md#q8-why-env-files-exist), [T3-AN Q24](../pyqs/t3-2025-an.md#q24-where-the-api-key-lives), [T3-FN Q6](../pyqs/t3-2025-fn.md#q6-why-environment-variables), ET-1

---

## Docker — the exam's favourite deployment story

Four exam questions live here, all asked in every recent paper:

### 1. Environment parity

An Ubuntu container built anywhere runs identically on Windows, macOS, Linux — the OS is inside the image. "Works on my machine" dies.

### 2. The missing install

A container that crashes with "can't find the `requests` library" is missing:

```dockerfile
RUN pip install -r requirements.txt
```

Containers are **isolated** — nothing from your laptop leaks in, including installed packages. The Dockerfile must install everything itself.

### 3. EXPOSE vs -p

```dockerfile
EXPOSE 8501        # documentation: "this app listens on 8501" — a LABEL
```

```bash
docker run -p 8501:8501 app   # THIS publishes the port to the host
```

!!! success "The professor's one-liner (ET-2)"
    **EXPOSE is a label; `-p` is the bridge.** If a container runs but
    `localhost:8501` refuses to connect, you forgot `-p`.

### 4. Layer caching (short-answer territory)

```dockerfile
FROM python:3.12
COPY requirements.txt .      # ← copy ONLY the dependency list first
RUN pip install -r requirements.txt   # ← install (cached across code edits)
COPY . .                     # ← NOW copy the code
```

Docker rebuilds a layer only when its inputs change — and every layer *after* a changed layer rebuilds too. Copy the code first and every minor edit re-downloads all dependencies; copy `requirements.txt` first and the install layer stays cached.

!!! warning "Trap — docker logs"
    A container that crashed still has its stdout/stderr captured:
    `docker logs <container>` replays them. The first stop for any crash.

→ **Asked in 10+ places:** [T1-AN Q28](../pyqs/t1-2026-an.md#q28-expose-vs--p), [T1-FN Q5 + Q11](../pyqs/t1-2026-fn.md#q11-the-missing-pip-install), [T3-FN Q27 + Q30 + Q31](../pyqs/t3-2025-fn.md#q31-what-expose-does), T1-AN Q24 (SA: layer caching), ET-1 + ET-2

---

## Deployment platforms — know the tiers

| Platform | Best for | The exam angle |
|---|---|---|
| **GitHub Pages** | Static files only (HTML/CSS/JS) | **No backend, no database** — FastAPI on Pages fails |
| **Hugging Face Spaces** | ML demos, Gradio/Streamlit | Port 7860, Docker Spaces |
| **Vercel** | Serverless frontend/backend | **Strict timeouts** (~10s at the edge) |
| **Render / Railway** | Backend + DB + Redis | Full app hosting |
| **GCP Cloud Run / AWS ECS** | Managed Docker containers | Production containers |
| **Cloudflare Workers** | Edge functions | **300+ edge locations** — one crashing doesn't affect others |

!!! success "The two serverless limits the exam pairs"
    - **Time:** an edge function needing 40s dies at the 10s limit → [T1-AN Q17](../pyqs/t1-2026-an.md#q17-the-edge-function-timeout)
    - **RAM:** a 2GB file works on your laptop, dies on a free-tier function (128–512 MB) → [T1-FN Q10](../pyqs/t1-2026-fn.md#q10-serverless-memory-limits)

    Long jobs belong in containers, queues, or workers — not serverless functions.

!!! success "The resilience story (Cloudflare Workers)"
    When Vercel crashes, a Cloudflare Worker doing the same job **keeps serving** —
    it runs on 300+ independent edge locations, and one provider's outage doesn't
    touch them. → [T1-AN Q8](../pyqs/t1-2026-an.md#q8-cloudflare-workers-resilience)

→ GA2 drills this: `deploy-analytics-platform-server`, `compose-redis-tunnel-server`

---

## Google OAuth — sessions vs bearer tokens

Two ways a server remembers who you are:

| | Session cookie | Bearer token |
|---|---|---|
| Storage | Browser stores a cookie automatically | Client stores a token manually |
| Sending | Browser attaches it to every request | Client puts it in the `Authorization` header |
| Best for | Browser apps | APIs, scripts, mobile apps |

The `HttpOnly` cookie flag means JavaScript can't read it — protection against XSS stealing your session.

→ GA2: `oauth-jwks-verify-server`

---

## Config management — where each value lives

| Location | What belongs there |
|---|---|
| `.env` | Project-specific secrets and config (per-project) |
| `~/.bashrc` | Machine/user-level defaults (every terminal session) |
| GitHub Actions secrets | CI/CD values |
| Hugging Face Space secrets | Deployment values |

Golden rule: **commit code and `.env.example`; never commit `.env`.**

→ GA2: `config-precedence-server`

---

## Logging, testing & observability — the three signals

| Signal | Question it answers | Example |
|---|---|---|
| **Logs** | What exactly happened? | `user_id=12 login failed` |
| **Metrics** | How much / how fast? | `http_requests_total`, p95 latency |
| **Traces** | Where did time go? | API → DB → Payment (230ms → 180ms → 20ms) |

!!! success "The exam connection"
    This is the "debugging a 500" question's foundation ([T1-FN
    Q28](../pyqs/t1-2026-fn.md#q28-debugging-the-500)): with a gateway in the path,
    you check **every layer the request crossed** — and observability is how. Bad
    debugging: "it works on my laptop." Good debugging: the dashboard shows p95
    latency up, 500s up, `/search` slow, logs show DB timeout.

→ GA2: `observability-metrics-server`

---

## Cloudflare tunnels — exposing localhost safely

A tunnel gives your local app a public URL without deploying it — for webhook testing, demos, mobile testing. Key distinction the course teaches:

| Address | Meaning |
|---|---|
| `127.0.0.1` | Only my own machine |
| `0.0.0.0` | Listen on all interfaces (**not** a public URL — a common confusion) |
| `192.168.x.x` | My private Wi-Fi/LAN |
| Public IP | Internet-facing |

→ GA2: `ollama-tunnel-llm-server`, `compose-redis-tunnel-server`

---

## Local LLMs — the tool-selection table

| Tool | Best for |
|---|---|
| **LM Studio** | GUI, model search, local API — beginner-friendly |
| **Ollama** | Fast CLI prototyping, local REST API |
| **llama.cpp** | Deep control, GGUF models, CPU/GPU tuning |
| **vLLM** | Production GPU serving, batching |
| **MLX** | Apple Silicon native |

The legal idea worth one mark: **tool license and model license are separate** — a tool may be MIT while the model you download has its own terms.

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
