# Docker & deployment — 60-second sheets

<div class="tx-meta" markdown>

~7 min total · 6 concepts · Last-minute revision layer — [full treatment: W2](../weeks/week-2.md)

</div>

---

## Docker: EXPOSE vs -p

```dockerfile
EXPOSE 8501        # documentation: "this app listens on 8501" — a LABEL
```

```bash
docker run -p 8501:8501 app   # THIS publishes the port to the host
```

!!! success "The one-liner"
    **EXPOSE is a label; `-p` is the bridge.** If a container runs but
    `localhost:8501` refuses to connect, you forgot `-p`.

??? question "Practice: Container runs, localhost:8501 doesn't connect. What's missing?"
    The `-p 8501:8501` flag on `docker run`. → [T1-AN Q28](../pyqs/t1-2026-an.md#q28-expose-vs--p)

---

## Docker: the missing install

A container that can't find the `requests` library is missing:

```dockerfile
RUN pip install -r requirements.txt
```

Containers are **isolated** — nothing from your laptop leaks in, including installed packages.

??? question "Practice: Why does the app work locally but crash in Docker?"
    The Dockerfile doesn't install dependencies. Containers share nothing with
    your laptop. → [T1-FN Q11](../pyqs/t1-2026-fn.md#q11-the-missing-pip-install)

---

## Docker: environment parity

An Ubuntu container built anywhere runs identically on Windows, macOS, Linux — the OS is inside the image. "Works on my machine" dies here.

??? question "Practice: You build on Linux, push to Docker Hub, colleague pulls on Windows. What happens?"
    **It runs successfully.** Docker packages the entire runtime environment.
    → [T1-FN Q5](../pyqs/t1-2026-fn.md#q5-docker-on-windows)

---

## Docker: layer caching

Docker rebuilds a layer only when its inputs change — and every layer **after** a changed layer rebuilds too.

```dockerfile
COPY requirements.txt .              # ← dependency list FIRST
RUN pip install -r requirements.txt # ← install (stays cached)
COPY . .                            # ← code LAST
```

!!! warning "Trap — the build-speed killer"
    Copy the code before `pip install` and **every code edit re-downloads every
    dependency**. Copy `requirements.txt` first so the install layer stays cached.

??? question "Practice: Why does `COPY . .` before `RUN pip install` ruin builds?"
    Every code edit invalidates the COPY layer → the install layer after it
    rebuilds → dependencies re-download on every minor change.
    → [T1-AN Q24 (short answer)](../pyqs/t1-2026-an.md#q24-docker-layer-caching)

---

## Serverless limits — RAM + time as a pair

| Limit | The story | The fix |
|---|---|---|
| **Time** | Edge function needs 40s, dies at 10s | Long jobs → containers/queues |
| **RAM** | 2GB file works on laptop, dies on function (128–512 MB) | Stream/chunk, don't load it all |

!!! success "The numbers"
    Your laptop: 8–32 GB RAM. Free-tier function: 128–512 MB. Edge timeout: ~10s.

??? question "Practice: A 2GB file crashes a serverless function but works locally. Why?"
    Free-tier functions enforce **strict RAM limits** (128–512 MB vs your laptop's
    8–32 GB). → [T1-FN Q10](../pyqs/t1-2026-fn.md#q10-serverless-memory-limits)

---

## GitHub Pages — static only

Serves HTML, CSS, images, client-side JS. **No server-side runtime, no database, no FastAPI backend.** Form submissions have nothing to receive them.

??? question "Practice: Can you host a FastAPI backend on GitHub Pages?"
    **No** — Pages serves only static files. The backend needs a real runtime.
    → [T1-FN Q3](../pyqs/t1-2026-fn.md#q3-fastapi-on-github-pages)
