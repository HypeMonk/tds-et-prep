# Exam-day cheat sheet

<a href="#" onclick="window.print(); return false;" class="tx-print-btn">
  🖨️ Print / Save as PDF
</a>

**Print this. Read it in the hour before you walk in.**

---

## The paper

- **80 marks · 90 minutes** · Section 1: 30 MCQ/MSQ, 39 marks (official topics 1–5) · Section 2: 9 written, 41 marks (topic 6) · **no negative marking — answer everything**

**The six official topics (memorize the list):**
1. Observability & Monitoring · 2. Data Pipeline Integrity · 3. CI/CD & Release Security · 4. Reliable AI/LLM Systems · 5. Web/API/Infra Fundamentals · 6. Applied AI Judgment
- MCQ + MSQ + numerical + **short answers (LLM-graded)**
- Marks ramp: 1-mark warm-ups → 2-mark reasoning → 3-mark diagnosis → scenario blocks → SA
- The big marks are at the END — move briskly through Part 1

## Short answers (the new section)

**Conclusion first → bold-reason bullets → one assumption/trade-off last.** Keywords the LLM grader wants: *constraints, assumptions, scalability.* Logic over length — 120–170 words.

## The professor's strategy hints

- Options are designed to guide you — eliminate the nonsense, the answer is what's left
- "Odd one out" (Parquet among text formats) → the outlier is the answer
- Longest, most detailed option in design questions → frequently correct

---

## 🟢 Must-remember — the green boxes

| Topic | The one thing |
|---|---|
| **CORS** | Origin = scheme+host+port. Only the **backend** can fix it (add the header) |
| **EXPOSE vs -p** | EXPOSE is a label; `-p` is the bridge |
| **RUN pip install** | Containers share nothing — install everything in the Dockerfile |
| **Layer caching** | `requirements.txt` first, code last — or every edit re-downloads deps |
| **TTL / max-age** | Always in **seconds**: 3600 = 1 hour, 7200 = 2 hours |
| **Cache-buster** | `?t=123` → new URL → cache miss → fresh fetch |
| **.env workflow** | `.env` + `.gitignore` + `os.getenv()` — never commit secrets |
| **401 vs 403** | Identity vs permission — no key vs wrong key |
| **500** | Server's problem — check backend + database, every layer crossed |
| **asyncio.gather** | Total = the **max**, not the sum. 4×1s + 1×10s = 10s |
| **Data leakage** | Test ≫ production = leakage. Memorization ≠ generalization |
| **Parquet** | Columnar binary — the "odd one out" vs text-based XML/JSON/CSV |
| **System > User** | LLMs weigh system prompts higher — the anti-injection defense |
| **Robust filter** | Lowercase + regex, never exact-string matching |
| **Structured Outputs** | Constrains generation (prevention). Python validation detects after |
| **RAG order** | Retrieve → Augment → Generate. Query is embedded before the LLM sees anything |
| **Chunk size** | 1–2 paragraphs (~200–500 words) — context vs focus |
| **Stale RAG docs** | Old chunks in the vector DB — the index, not the brain |
| **Race condition** | "Simultaneous" + "checks then writes" = both pass, both write |
| **Lookback + dedup** | Last ~3 days, keyed on (ID, timestamp) — never reprocess all history |
| **Serverless limits** | RAM (128–512 MB) + time (~10s edge) — long jobs go in containers |
| **Dependency pinning** | Reproducible = same install works tomorrow. Test upgrades separately |

---

## 🟡 Traps — where marks are lost

| Trap | The truth |
|---|---|
| "CORS is a server error" | It's a **browser** enforcement. curl/Postman are never blocked |
| "Add the CORS header to the fetch call" | Only the **backend** can grant permission |
| "`ls -h` shows hidden files" | `-h` = human-readable sizes. `-a` = all files |
| "`COUNT(col)` = `COUNT(*)`" | COUNT(*) counts rows; COUNT(col) skips NULLs |
| "AVG includes NULLs as zero" | NULLs are **skipped**: AVG of [10, 20, NULL] = 15 |
| "High test accuracy = good model" | Check for leakage first — memorized test rows inflate the score |
| "GitHub Pages can host FastAPI" | Static files only — no runtime, no database |
| "I'll push the secret and remove it later" | Git history is forever. Bots scan within minutes |
| "More parallelism fixes slow requests" | Gather = max, not sum. One hanger holds everything |
| "Reprocess all history to catch late data" | A failure of design — lookback + dedup instead |

---

## 🔴 Wrong beliefs — commonly held, always wrong

| Wrong belief | The reality |
|---|---|
| "Structured Outputs guarantees accuracy" | Only syntax — the model can still be wrong, grammatically |
| "Fine-tuning makes the AI know your business" | It changes behaviour, not facts. Prompt → RAG → tools → finetune, in that order |
| "I can make the model immune to injection" | You can only make a successful injection **worthless** — limit what it can do |
| "Encryption means the data is safe at rest" | HTTPS protects in transit; the endpoints still see plaintext |
| "OpenRefine questions will be on the exam" | **Excluded this term** — the professor said so explicitly |
| "Old PYQs are the best prep" | Only the recent era (T3-2025, T1-2026) matches current patterns |

---

## The marks ramp — budget your time

```
Part 1 (1-mark, ~9 questions)  →  15 minutes max, move briskly
Part 2 (2-mark, ~5 questions)  →  15 minutes
Part 3 (3-mark, ~2 questions)  →  10 minutes
Part 4 (scenario blocks)       →  20 minutes — the big marks, don't rush
Part 5 (short answers)         →  15 minutes — structure matters
```

**If you're running short:** answer every remaining MCQ with your best guess (no negative marking), then write at least a structured skeleton for each short answer.

---

## Decision rules — the task → tool table

| Task | Tool | Why |
|---|---|---|
| Share results with a non-technical manager | **CSV** | Opens in Excel, zero friction |
| Store large numeric arrays efficiently | **Parquet** | Columnar, 5–10× smaller, typed |
| Expose a local app to the internet | **Tunnel** (localtunnel/ngrok/Cloudflare) | Public URL without deploying |
| Deploy an ML demo | **HuggingFace Spaces** | Free, Gradio/Streamlit support |
| Run a long batch job | **Container / VM** | No serverless time limits |
| Handle a burst of short requests | **Serverless/edge** | Scales automatically, pay per use |
| Catch late-arriving data in ETL | **Lookback + dedup** | Last N days, keyed on ID + timestamp |
| Cache API responses | **TTL matching update frequency** | Bounded staleness, bounded load |
| Secure an LLM from injection | **System/user roles + filtered input** | Role separation is primary, filtering is secondary |
| Make an LLM return reliable JSON | **Structured Outputs** | Constrains generation, not just validates after |


**Official-topic must-remembers (new):**

- 🟢 **p95/p99 beats the mean** — the average hides the slow tail; latency targets are percentile targets
- 🟢 **Rates, not counts** — "400 errors" means nothing without the denominator and window
- 🟢 **Liveness ≠ readiness** — "process up" vs "can serve traffic"; readiness gates routing
- 🟢 **Idempotent writes** — `ON CONFLICT DO NOTHING` / unique keys: a retry must be a no-op
- 🟢 **Staging + atomic swap** — readers never see a half-loaded table
- 🟢 **Corrections keep provenance** — old value, new value, reason, who, when — never destroy the record
- 🟢 **Untrusted triggers see no secrets** — fork-PR CI runs with zero credentials
- 🟢 **A prompt is not a security boundary** — authorization lives in code and retrieval scope, never in the system prompt
- 🟢 **Stateless servers, durable state** — sessions in Redis/DB, work in queues; memory is disposable
- 🟢 **Identity vs delegated access** — who you are vs what you're allowed on someone's behalf; tokens are scoped and revocable
- 🟡 **Deleted ≠ gone** — a secret in history stays in every past commit; rotate first, then `filter-repo` + `--force-with-lease`
- 🟡 **Canary before full rollout** — 5% of users for 2 minutes beats everyone for an hour; auto-rollback on error *rates*
