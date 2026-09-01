# PYQ solutions — four real papers, fully solved

**T1-2026 (Jan) + T3-2025 (Sept) · both shifts · every question in original text, with the officially marked answer and the full reasoning.**

The papers colour-code correct answers (green) — so every answer here is the official one, not our guess. The reasoning is ours. Code snippets that appear as images in the PDFs are reconstructed and marked *(reconstructed)*.

## How to use these pages

1. **Cover the answer** and attempt each question yourself — they're collapsible precisely so the page works as practice, not as reading.
2. Open **Answer** to check. Only if you got it wrong (or slowly), open **Why** for the reasoning.
3. The ⭐ questions repeat across papers and revision sessions — miss one twice and go read its topic sheet.

## The four papers

| Paper | What it is | Special value |
|---|---|---|
| **[T1-2026 AN — solved](t1-2026-an.md)** | The most recent paper (Jan 2026, morning) — 28 questions including the **first-ever short answers** | The professor solved this live in ET-1 |
| **[T1-2026 FN — solved](t1-2026-fn.md)** | Afternoon twin — ~60% shared topics, different angle on each | Links to AN for shared concepts; full treatment of the new ones |
| **[T3-2025 AN — solved](t3-2025-an.md)** | Sept 2025, morning — four scenario blocks (geospatial ⛔, weather API, LLM sentiment, **RAG**) | The RAG block is fully current — W4 is a whole RAG week |
| **[T3-2025 FN — solved](t3-2025-fn.md)** | Sept 2025, afternoon — data-engineering practice + git/Docker/pandas scenarios | **The professor solved this live in ET-2** |

## The priority list — how often each topic is asked

Built from all four papers + both revision sessions. **This table is the study order.**

### 🔥🔥 Asked everywhere (guaranteed marks)

| Topic | Appears in | Where to learn it |
|---|---|---|
| **CORS / same-origin** | T1-AN ×2, T1-FN ×2, ET-1, course W2 | [T1-AN Q13](t1-2026-an.md#q13-fixing-the-cors-error-medium-starstar) |
| **Docker: EXPOSE vs -p** | T1-AN, T3-FN ×2, ET-2 | [T1-AN Q28](t1-2026-an.md#q28-expose-vs--p-easy-starstar) |
| **Docker: RUN pip install** | T1-AN, T1-FN, T3-FN, ET-1 | [T1-FN Q11](t1-2026-fn.md#q11-the-missing-pip-install-medium-star) |
| **Docker: parity/packaging** | T1-FN, T3-FN, ET-1 | [T1-FN Q5](t1-2026-fn.md#q5-docker-on-windows-easy-star) |
| **Caching: TTL, max-age, cache-buster** | T1-AN ×2, T1-FN ×2, T3-AN, T3-FN, ET-1 + ET-2 | [T1-AN Q19](t1-2026-an.md#q19-what-max-age3600-does-easy-starstar) |
| **.env + .gitignore** | T1-AN, T1-FN, T3-AN, T3-FN, ET-1 | [T1-AN Q5](t1-2026-an.md#q5-what-goes-into-gitignore-medium-star) |
| **HTTP status codes** | T3-AN ×2, T3-FN, T1-FN, ET-2 | [T3-AN Q4](t3-2025-an.md#q4-http-401-easy-starstar) |
| **asyncio.gather = max** | T1-AN, T1-FN, ET-1 | [T1-AN Q21](t1-2026-an.md#q21-asynciogather-with-a-hanger-medium-starstar) |
| **ML data leakage** | T1-AN, T1-FN, ET-1 | [T1-AN Q16](t1-2026-an.md#q16-the-fraud-model-collapse-hard-star) |
| **Parquet (columnar)** | T1-AN, T3-FN, ET-2 | [T1-AN Q4](t1-2026-an.md#q4-why-parquet-beats-csv-medium-star) |
| **System vs user prompts** | T1-AN, T1-FN, ET-1, W3 | [T1-AN Q23](t1-2026-an.md#q23-defending-the-llm-from-the-input-field-medium-starstar) |
| **Prompt injection + filters** | T1-AN, T1-FN ×2, ET-1, W7 | [T1-FN Q12](t1-2026-fn.md#q12-bypassing-the-word-filter-medium-starstar) |

### 🔥 Asked in 2–3 sources (high value)

Structured outputs · serverless limits (RAM + timeout) · race conditions · Pydantic/fail-fast validation · git lifecycle + branching + PR · pandas groupby/dropna · ETL lookback + idempotency · API gateway + redundancy · dependency pinning · reproducibility manifests · timezone handling · PII minimization · RAG fundamentals (chunking, retrieval, staleness)

### Asked once (know it when you see it)

SQLite auto-create · YAML rules · shell redirection · localtunnel · Hypothesis invariants · DuckDB NULL handling · Pydantic coercion · CSV-for-stakeholders · rate-limit etiquette · lineage metadata · recommendation segmenting

## ⛔ Skip these in old papers

| Topic | Status | The 30-second version |
|---|---|---|
| **OpenRefine** | Professor: excluded this term | Interactive GUI data cleaning; its *concepts* (normalize→dedupe, replayable operations) are covered under pandas/ETL |
| **Geospatial** (Folium, GeoPandas, CRS) | Not in current course content | Degrees aren't metres; swapped coordinates give realistic garbage ([T1-AN Q15](t1-2026-an.md#q15-haversine-vs-utm-vs-raw-degrees-hard-star)) |
| **Seaborn, spreadsheets** | Old-syllabus leftovers | Recognize the names only |

## The exam within the exam

Worth repeating from the [exam pattern page](../exam/exam-pattern.md):

- **No negative marking** — answer everything.
- The **short answers** (new in T1-2026) are LLM-graded — the [grading guide](../exam/llm-grading-guide.md) teaches the format, and both T1 papers carry worked model answers (AN Q24–25, FN Q24–25).
- The FN/AN papers share ~60% of topics — studying one shift thoroughly covers most of the other.
