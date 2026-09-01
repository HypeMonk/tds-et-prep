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
