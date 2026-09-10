# Web & APIs — 60-second sheets

<div class="tx-meta" markdown>

~6 min total · 5 concepts · Last-minute revision layer — [full treatment: W2](../weeks/week-2.md)

</div>

---

## CORS — Same-Origin Policy

**Origin = scheme + host + port.** Different ports = different origins, even on `localhost`.

The browser blocks JavaScript on one origin from reading a response from another — unless the **receiving server** explicitly allows it via `Access-Control-Allow-Origin`.

!!! success "Why it exists"
    Web apps load nested third-party JavaScript. If compromised, it could silently
    exfiltrate your data to `evil.com`. The policy is the guardrail; CORS is the gate.

??? question "Practice: Frontend on :3000, backend on :8000 — who fixes the CORS error?"
    The **backend**, by adding the allowed origin to its response headers. The
    frontend can't grant itself permission. → [T1-AN Q13](../pyqs/t1-2026-an.md#q13-fixing-the-cors-error)

---

## HTTP status codes — the family

| Code | Meaning | Action |
|---|---|---|
| **200** | OK | — |
| **401** | Unauthorized — *who are you?* | Check your API key |
| **403** | Forbidden — *you can't do this* | Check permissions |
| **404** | Not found | Check the URL |
| **429** | Rate limit — *slow down* | Wait, retry with backoff |
| **500** | Server error — *their problem* | Check backend + database |

!!! warning "Trap — 401 vs 403"
    **Identity vs permission.** A locked door with no key (401) vs a key that
    doesn't fit this lock (403).

??? question "Practice: A 500 error in a scenario — where do you look?"
    **Backend code and database layers** — not the frontend. Every layer the
    request crossed is suspect. → [T1-FN Q28](../pyqs/t1-2026-fn.md#q28-debugging-the-500)

---

## Caching — TTL, Cache-Control, cache-buster

| Concept | What it does |
|---|---|
| **TTL** | How long a cached copy is fresh — **always in seconds** (3600 = 1 hour) |
| **Cache-Control: public, max-age=3600** | Authorizes proxies + CDNs to serve copies |
| **Cache-buster (`?t=123`)** | A new URL = cache miss = fresh fetch from origin |

!!! warning "Trap — the units ladder"
    "max-age=7200 — how long?" → **2 hours**. Not milliseconds, not minutes, not
    days. Seconds, always.

??? question "Practice: How do you force fresh data past a cache?"
    Append a **random query parameter** (`?t=123`) — the URL changes, so the cache
    key changes, so it's a miss. → [T1-AN Q22](../pyqs/t1-2026-an.md#q22-forcing-fresh-data-past-the-cache)

---

## API gateway — the single entry point

**What it is:** one URL that routes to many backend services, with centralized authentication.

**Why:** 80 hardcoded URLs in a mobile app break during migrations; 80 separate auth implementations are inconsistent.

**The failure:** a single gateway = single point of failure. During a traffic spike, it crashes and takes the platform down.

**The fix:** multiple gateway instances behind a load balancer.

??? question "Practice: A 500 behind a gateway — what do you check?"
    **Every layer:** routing logic, auth middleware, the service itself, and the
    network between them. → [T1-FN Q28](../pyqs/t1-2026-fn.md#q28-debugging-the-500)

---

## HTTPS — why encryption matters

HTTP sends data in **cleartext** — anyone intercepting reads your token. HTTPS **encrypts** it end-to-end.

The professor's model: the **Caesar cipher** (shift every letter by 2) — a toy algorithm that perfectly explains the principle: scramble in transit, unscramble at the ends.

??? question "Practice: Why is HTTPS recommended for API tokens?"
    Tokens over HTTP are readable by anyone on the network path. HTTPS encrypts
    them so only sender and receiver can read. → [T1-FN Q6](../pyqs/t1-2026-fn.md#q6-why-https-for-tokens)


---

## Statelessness & durable storage — why servers are allowed to die

*Official topic 5: Web/API/Infra Fundamentals.*

**Stateless = the server remembers nothing between requests.** Any request can hit any instance; any instance can be killed and replaced. That's what makes scaling and deploys safe.

**State lives elsewhere — durably:**

| State | Lives in |
|---|---|
| Must survive | **database** |
| Fast lookups | **Redis / cache** |
| Work for later | **queue** → worker |
| Who you are between requests | **session store / token** |

!!! warning "Trap — the in-memory login dict"
    Works locally, works with one instance; the platform restarts the container
    (serverless does this constantly) and everyone's logged out — or a second
    instance means half your users "don't exist." Sessions belong in Redis/DB;
    in-memory caches are *disposable* (rebuildable) state.

!!! success "Must remember — the pattern that follows"
    Stateless API → durable queue → worker → database. Each part crashes,
    restarts, and scales independently — it's the serverless-limits workaround
    and the resilience story, unified.

→ Full treatment: [Week 2 — statelessness](../weeks/week-2.md#statelessness-durable-storage-why-servers-are-allowed-to-die)

---

## API error design — failing usefully

*Official topic 5: Web/API/Infra Fundamentals.*

**The code carries the category, the body carries the diagnosis:**

| Code | Meaning | Who fixes it |
|---|---|---|
| **400** | malformed request | caller |
| **401** | not authenticated — *who are you?* | caller (credentials) |
| **403** | authenticated, not permitted | caller (permissions) |
| **404** | doesn't exist (or hidden on purpose) | caller's URL |
| **422** | well-formed, semantically invalid (Pydantic) | caller's data |
| **429** | rate limit — slow down | caller, eventually |
| **500** | *our* code/dependencies failed | server team |

!!! success "Must remember — a useful error names the specifics"
    Field, problem, ideally the fix: `{"error": "quantity must be >= 1, got 0",
    "field": "quantity"}` — not a bare `400`. **Fail fast, fail loud:** reject
    bad input at the boundary *before* processing; silent acceptance is the 3am
    scenario where the error surfaces far from its cause.

!!! danger "Never leak internals"
    Stack traces to the client map your code (a security hole). Log the trace
    server-side; return a clean message + a request ID the user can quote.

!!! tip "CORS / authN / authZ are three different problems"
    CORS = the *browser's* cross-origin read rule (fixed by the server's response
    headers). Authentication = identity (401). Authorization = permission (403).
    Each failure is fixed by a different party — exams mix them deliberately.

→ Full treatment: [Week 2 — API error design](../weeks/week-2.md#api-error-design-failing-usefully)

---

## Identity vs delegated access — who's asking, on whose behalf

*Official topic 5: Web/API/Infra Fundamentals.*

- **Identity** — *who you are* (API key, session, JWT)
- **Delegated access** — *what you may do on someone else's behalf* (the OAuth flow: "connect this app to my Drive" — the app acts as you, within granted scopes)

| | API key (identity) | OAuth token (delegated) |
|---|---|---|
| Represents | the key's owner, fully | the user, limited to granted scopes |
| Scope | everything the key can do | only what was delegated |
| Revocation | rotate the key | user revokes the app's grant |

!!! success "Must remember — the exam shape"
    "A third-party app reads a user's calendar" = delegated access — the app
    holds a *scoped, revocable* token, never the user's password. Audit
    questions: what scopes? who granted? how revoked? **Least privilege:**
    minimum scope, minimum time, revocable by the user.

→ Full treatment: [Week 2 — identity vs delegated access](../weeks/week-2.md#identity-vs-delegated-access-whos-asking-and-on-whose-behalf)
