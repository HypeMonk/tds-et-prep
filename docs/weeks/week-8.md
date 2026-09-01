# Week 8 — ML platforms & model operations

<div class="tx-meta" markdown>

~15 min read · Examinable: 🔥 (new content, GA8-tested — expect fresh questions) · GA8

</div>

The ML platforms week — BigQuery ML, MLflow, finetuning, quantization, HuggingFace. No PYQ history, but GA8 tests all of it at depth. The exam's new-question territory.

Course files: cloud storage for ML · BigQuery ML · MLflow · finetuning strategy · HuggingFace ecosystem · finetuning techniques · quantization · Gemma finetuning.

---

## BigQuery ML — SQL that trains models

**What it is:** train and run ML models with SQL, where your data already lives. `CREATE MODEL` is like `CREATE TABLE`, except the result is a trained model.

```sql
CREATE MODEL `my.dataset.penguin_model`
OPTIONS(model_type='logistic_reg') AS
SELECT * FROM `my.dataset.penguins` WHERE is_train = TRUE;
```

**When to use it:** structured data already in BigQuery — churn, demand, fraud flags, segmentation, forecasting. A strong baseline before a custom Python workflow.

**When NOT to:** custom feature engineering, deep learning, GPU training, interactive prediction services.

### The four words to keep straight

| Term | Meaning |
|---|---|
| **Feature** | Input the model uses (`body_mass_g`, `island`) |
| **Label** | Answer the model predicts (`species`) |
| **Train set** | Rows used to fit the model (~80%) |
| **Test set** | Held-out rows used to judge it (~20%) |

!!! danger "Wrong belief — 'high test accuracy means a good model'"
    **Never evaluate on training rows.** A model can memorise the training set
    and still fail on new data — this is the data-leakage question from the
    papers ([T1-AN Q16](../pyqs/t1-2026-an.md#q16-the-fraud-model-collapse),
    [T1-FN Q17](../pyqs/t1-2026-fn.md#q17-the-94-76-accuracy-drop)).

→ GA8: `leakage-safe-bqml-server`

---

## MLflow — the experiment record

**The problem it solves:** "best model" means nothing if nobody can answer — best compared with which run, trained on which data, with which parameters, and where is the model file?

**The mental model:**

```
experiment: "wine-baseline"
├── run: depth-2
│   ├── parameters: n_estimators=100, max_depth=2
│   ├── metrics: accuracy=0.91
│   └── artifacts: trained model, plots, data summary
└── run: depth-5
    ├── parameters: n_estimators=100, max_depth=5
    ├── metrics: accuracy=0.94
    └── artifacts: trained model, plots, data summary
```

| Word | Think of it as |
|---|---|
| **Experiment** | Project folder |
| **Run** | One lab attempt |
| **Parameter** | Recipe setting (chosen) |
| **Metric** | Measured outcome |
| **Artifact** | Saved file (model, plot, data) |

**The exam angle:** MLflow questions test whether you understand **experiment tracking as reproducibility** — the same discipline as pinning dependencies and archiving raw inputs.

→ GA8: `mlflow-evidence-promotion-server`, `mlflow-fingerprint-server`

---

## Finetuning — when and when not to

!!! success "The decision rule the course teaches"
    **Fine-tuning is not a button that makes an AI "know your business."** It is
    a costly way to change a model's *behaviour*. Before you train, prove that
    prompting, retrieval (RAG), or tools cannot solve the real problem more
    safely and cheaply.

### What finetuning IS good for

- A support assistant that always produces a particular schema and tone
- Classifying a fixed set of document types
- Extracting fields from invoices in a known format
- Teaching a specialised vocabulary or response convention

### What finetuning is NOT good for

- **Changing facts** — the model will memorise and hallucinate
- **One-off tasks** — the cost isn't justified
- **Unreliable workflows** — bad examples make the model confidently wrong

### The escalation ladder (cheapest first)

```
1. Better prompting       → free, immediate
2. RAG (retrieval)        → the model looks up facts instead of memorising
3. Tools/function calling → the model delegates to the right system
4. Finetuning             → last resort, for stable repeated behaviour only
```

→ GA8: `peft-repair-server`, `lora-quant-budget-server`

---

## Quantization — smaller, faster, cheaper models

**What it is:** reducing the precision of model weights (from 16-bit floats to 8-bit or 4-bit integers), making the model smaller and faster at a small cost in accuracy.

| Precision | Size reduction | Quality |
|---|---|---|
| **FP16** (baseline) | — | Full |
| **INT8** | ~2× smaller | Near-full |
| **INT4** | ~4× smaller | Noticeable loss |

**The exam angle:** quantization questions test the **trade-off** — you get smaller/faster/cheaper models at the cost of some quality. The right answer depends on the use case (a chatbot on a phone vs a medical diagnosis tool).

→ GA8: `quantized-model-admission-server`, `lora-quant-budget-server`

---

## HuggingFace ecosystem — the model hub

**What it is:** the GitHub of ML models — a hub for pretrained models, datasets, and spaces (live demos).

**Key concepts for the exam:**
- **Model hub** — download pretrained models with one line
- **Spaces** — deploy Gradio/Streamlit demos for free
- **Transformers library** — the Python API for using models
- **License separation** — the tool (transformers) is Apache-2.0; each *model* has its own license

→ GA8: `verifiable-model-bundle-server`, `modelcard-carbon-server`

---

## Self-check — can you answer these without looking?

??? question "1. Why should you never evaluate a model on its training data?"
    The model can **memorise** the training rows and score perfectly while
    failing on new data. High test accuracy on leaked data is the signature of
    data leakage — the honest number only appears on truly held-out rows.

??? question "2. What problem does MLflow solve?"
    **Experiment tracking:** which run, trained on which data, with which
    parameters, achieved which metrics — and where is the model file? It turns
    the scavenger hunt into a record.

??? question "3. When is finetuning the right answer?"
    Only after proving that **prompting, RAG, and tools** can't solve the
    problem — and only for **stable, repeated behaviour** (a fixed schema, a
    known format, a specialised vocabulary). Not for changing facts.

??? question "4. What does quantization trade?"
    **Precision for size and speed.** FP16 → INT8 → INT4 gives progressively
    smaller/faster models at progressively more quality loss. The right level
    depends on the use case.
