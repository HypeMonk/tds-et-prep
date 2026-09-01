# LLMs & prompting — 60-second sheets

<div class="tx-meta" markdown>

~6 min total · 5 concepts · Last-minute revision layer — [full treatment: W3](../weeks/week-3.md)

</div>

---

## System vs user prompts

| | System prompt | User prompt |
|---|---|---|
| Carries | Core rules, safety, identity | The transient question |
| Set by | The developer | The end user |
| Weight | **Higher** — the model obeys it more | Lower |

!!! success "Why the hierarchy exists"
    LLMs assign **higher attention weights to system prompts**. A user typing
    "ignore previous instructions" can't easily override rules set in the system
    prompt — the model weighs system instructions more heavily by design.

??? question "Practice: Why separate core rules into a System prompt?"
    Models pay **closer attention to System prompts**, reducing user override
    attempts. → [T1-FN Q15](../pyqs/t1-2026-fn.md#q15-system-vs-user-prompts)

---

## Structured Outputs

**What it guarantees:** valid JSON against your schema — token generation is *constrained* so invalid JSON cannot be produced.

**What it does NOT guarantee:** factual accuracy — the model can still be wrong, just grammatically correct.

!!! success "The one-sentence difference from Python validation"
    **Structured Outputs constrains generation** (prevention — bad JSON can't
    happen). **Python validation detects errors after** (the model already
    produced bad JSON, your code catches it).

??? question "Practice: What's the key difference between Structured Outputs and Python validation?"
    Constrain generation vs detect after — prevention vs detection.
    → [T1-FN Q22](../pyqs/t1-2026-fn.md#q22-structured-outputs-vs-python-validation)

---

## Prompt injection + the robust filter

**The root cause:** an LLM receives one flat stream of text — your system prompt and a hostile sentence arrive in the same channel. The model can't inherently tell instructions from data.

**The defense layers (in order):**
1. Role separation (system vs user)
2. Input normalization — **lowercase + regex**, not exact-string matching
3. Output validation (Pydantic schema)
4. Tool allow-listing (deny by default)
5. Human approval for destructive actions

!!! danger "Wrong belief — 'I'll just tell the model to ignore attacks'"
    You can't make a model immune by prompt alone. You CAN make a successful
    injection **worthless** by limiting what the system can do.

??? question "Practice: Blocking 'ignore' fails against 'IGNORE'. What's more robust?"
    **Convert to lowercase + use regex for character substitutions.**
    → [T1-FN Q23](../pyqs/t1-2026-fn.md#q23-the-robust-filter)

---

## OWASP LLM Top 10 — the vocabulary

| Code | Risk | One-liner |
|---|---|---|
| **LLM01** | Prompt Injection | Untrusted text becomes instructions |
| **LLM02** | Information Disclosure | Model reveals secrets/PII |
| **LLM05** | Improper Output Handling | Output used unsanitised → XSS/SQLi |
| **LLM06** | Excessive Agency | Agent can do more than its task |
| **LLM07** | System Prompt Leakage | Your prompt becomes public |
| **LLM10** | Unbounded Consumption | Runaway tokens/cost |

!!! success "The audit question for your own project"
    **LLM06:** What is the worst single action my agent can take unsupervised?
    Most student projects fail this on first audit.

---

## Embeddings — the foundation for RAG

An **embedding** is a fixed-length vector of numbers representing the *meaning* of a text. Similar meanings → nearby vectors.

```
"King" − "Man" + "Woman" ≈ "Queen"
```

This powers semantic search, RAG, and recommendation systems — the query is embedded, matched against chunk embeddings, and the closest ones are retrieved.

??? question "Practice: What is an embedding?"
    A vector of numbers that encodes a text's meaning — the foundation of semantic
    search and RAG.
