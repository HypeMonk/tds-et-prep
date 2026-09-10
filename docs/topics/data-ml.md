# Data & ML — 60-second sheets

<div class="tx-meta" markdown>

~7 min total · 6 concepts · Last-minute revision layer — [full: W6](../weeks/week-6.md) + [W8](../weeks/week-8.md)

</div>

---

## Parquet vs text formats

| | CSV/JSON/XML | Parquet |
|---|---|---|
| Structure | Text-based, row-oriented | **Columnar binary** |
| Reading one column | Parse every row | Read only that column |
| Size | Baseline | **5–10× smaller** |
| Types | Everything is a string | Real types preserved |

!!! success "The "odd one out" pattern"
    When XML, JSON, CSV are grouped in an efficiency question, **Parquet** (the
    columnar outlier) is the answer.

??? question "Practice: Why are Parquet queries faster than CSV on remote files?"
    Columnar storage — DuckDB downloads **only the requested columns**, not the
    whole file. → [T1-AN Q4](../pyqs/t1-2026-an.md#q4-why-parquet-beats-csv)

---

## ML data leakage — the signature

**Test accuracy wildly above production accuracy = leakage until proven otherwise.**

Two ways it happens:
1. **Temporal leakage:** shuffling a chronological dataset — the model trains on tomorrow's patterns
2. **Feature leakage:** rolling stats computed before the train/test split — features contain future information

!!! danger "Wrong belief — '94% test accuracy means a good model'"
    If 200 test rows were in the training data, the model **memorized** them.
    After cleanup, the honest number appears (76% in the exam's example).

??? question "Practice: 99.2% test, 52% production. What caused the collapse?"
    **Shuffling created temporal leakage; rolling stats before the split caused
    feature leakage.** → [T1-AN Q16](../pyqs/t1-2026-an.md#q16-the-fraud-model-collapse)

---

## Pandas — the exam's favourite operations

```python
# Drop rows with missing text (for text analysis only)
df.dropna(subset=['review_text'])

# Filter + aggregate (the professor's exact line)
df.groupby('cuisine')['rating'].mean()
```

!!! warning "Trap — the NLP dropna"
    For **text analysis**, rows with no text are pure noise — drop them. But their
    **ratings still count** for non-text questions. Cleaning is per-question.

??? question "Practice: Average rating per cuisine — which operation?"
    `df.groupby('cuisine')['rating'].mean()` — split by cuisine, apply mean,
    combine. → [T3-FN Q22](../pyqs/t3-2025-fn.md#q22-average-rating-per-cuisine)

---

## ETL — the lookback + dedup pattern

**The problem:** late-arriving data that your daily pipeline already passed over.

**The wrong fix:** reprocess all history daily — "cost-extensive," a failure of design.

**The right pattern:**
1. **Lookback window** — process the last ~3 days, catching late arrivals
2. **Deduplication** — key on (order_id, update_timestamp); newest version wins

??? question "Practice: Orders from 2 days ago get updated. How do you catch them?"
    **Lookback window + dedup on order ID and update timestamp.**
    → [T3-FN Q8](../pyqs/t3-2025-fn.md#q8-late-arriving-orders)

---

## Finetuning — when and when not

!!! success "The escalation ladder (cheapest first)"
    ```
    1. Better prompting       → free, immediate
    2. RAG (retrieval)        → model looks up facts
    3. Tools/function calling → model delegates
    4. Finetuning             → last resort, for stable repeated behaviour only
    ```

**Good for:** a fixed schema, a known format, a specialised vocabulary — stable, repeated behaviour.

**NOT good for:** changing facts, one-off tasks, unreliable workflows.

---

## Quantization — the trade-off

| Precision | Size | Quality |
|---|---|---|
| FP16 (baseline) | — | Full |
| INT8 | ~2× smaller | Near-full |
| INT4 | ~4× smaller | Noticeable loss |

**Smaller + faster + cheaper** at the cost of some quality. The right level depends on the use case.

---

## Reading metrics — averages lie, percentiles don't

*Official topic 1: Observability & Monitoring.*

**The mean hides the tail.** 95 requests at 100ms + 5 at 5,000ms → mean ~345ms, which describes *neither* experience. Report:

- **p50 (median)** — the typical experience
- **p95** — what your slow-but-normal users feel
- **p99** — the tail, where bugs live (a memory leak shows in p99 long before the mean moves)

!!! success "Must remember — latency targets are percentile targets"
    "p95 under 500ms" is an SLO; "average under 500ms" is a wish. The mean is
    dominated by the bulk of requests — the slow tail that users complain about
    is invisible in it.

!!! warning "Trap — rates vs raw counts"
    "400 errors yesterday" is meaningless alone. 400/500 requests = catastrophe;
    400/4M = noise. Always ask: **count of what, over what denominator, in what
    window?** A rising error *count* with flat traffic is an incident; with
    doubled traffic it's Tuesday.

!!! warning "Trap — averaging averages"
    Averaging per-day averages gives equal weight to a quiet Sunday and a Black
    Friday. Aggregate from raw events, or report percentiles per window.

### Health checks vs readiness — deployment's version of the same idea

| | Liveness | Readiness |
|---|---|---|
| Question | is the process up? | can I serve real traffic? |
| Checks | process responds at all | DB connected, cache warm, dependencies up |
| Failing it means | restart me | don't route users to me yet |

!!! danger "Wrong belief — \"health check green = safe to receive traffic\""
    A service can be alive with a dead DB connection — passing liveness, failing
    readiness. **Readiness is the one that gates traffic.** A load balancer
    watching only liveness keeps routing to a service that errors on every request.

### Cost tracking for AI systems

LLM features burn money per request — treat cost as a first-class metric: **tokens in/out per request, cost per request, cost per *successful* request, daily spend vs budget.** A runaway agent loop spends more in an afternoon than a month of normal traffic. Same alerting principles (rates, thresholds), applied to dollars.

→ Full treatment: [Week 6 — reading metrics](../weeks/week-6.md#reading-metrics-correctly-averages-lie-percentiles-dont)

---

## Data pipeline integrity — the five properties

*Official topic 2: Data Pipeline Integrity.*

A pipeline you can trust has five properties, each protecting the next:

**1 · Stable identity + change detection.** Every row needs an identity that survives re-reads (natural key, surrogate key, or content hash). "Changed" = *the identity's payload differs from last time* — not "I saw it again." A re-seen unchanged row is a no-op.

**2 · Partial/failed run safety.** The run died halfway — 60% written, 40% missing, dashboard already reading.

!!! success "Must remember — staging + atomic swap"
    Write to a staging table and swap atomically when complete — readers never
    see a half-state. Alternatively, record run boundaries so downstream knows a
    load is partial. Never write row-by-row into the live table.

**3 · Idempotency — safe retries.** The write succeeded but the confirmation was lost; the retry doubles the row. **Idempotent = same result run once or ten times:** unique constraint on the natural key (`ON CONFLICT DO NOTHING`), dedup before write, or check-then-write against a processed-log.

!!! danger "Wrong belief — \"retries are rare, we'll handle them if they happen\""
    Any pipeline that can be retried **must** be idempotent — retries always
    happen eventually. A webhook redelivery, a queue replay, a crash-restart:
    duplicates are normal input, not exceptions.

**4 · Reproducibility.** Same input + same code + same pinned dependencies = same output. Data: pinned snapshots, versioned queries, raw events retained. Models: fixed seeds, pinned libraries, experiment logs (parameters, metrics, artifacts). Without it, "the number changed" is undiagnosable.

**5 · Provenance when correcting data.** You fixed 300 rows. Six months later: *which, why, who decided, what did they say before?* Keep a correction log (row ID, old → new, reason, timestamp, who) or append-only versions.

!!! danger "Wrong belief — correcting data means overwriting it"
    **Corrections never destroy the record of what was corrected.** You may need
    to un-correct, or justify the correction to an auditor, later. The correction
    log (old value, new value, reason, who, when) is part of the correction.

!!! success "Must remember — the chain in one line"
    *identity → atomicity → idempotency → reproducibility → provenance.* Each
    property protects the next.

→ Full treatment: [Week 6 — pipeline integrity](../weeks/week-6.md#data-pipeline-integrity-five-properties-of-a-pipeline-you-can-trust)
