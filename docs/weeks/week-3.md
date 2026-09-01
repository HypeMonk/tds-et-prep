# Week 3 — Prompt engineering & LLM fundamentals

<div class="tx-meta" markdown>

~20 min read · Examinable: 🔥🔥 (structured outputs, system prompts — asked + growing) · GA3 · [ET-1 session](../sessions/et-01.md)

</div>

The week on making LLMs do what you want reliably. The exam cares about three things from here: **prompt anatomy, system vs user prompts, and structured outputs**. Everything else (embeddings, similarity search, prompt caching) feeds Week 4's RAG.

Course files: prompt engineering (3 parts) · AI coding assistants · context engineering · LangSmith/LiteLLM · LLM architecture survey · LLM CLI tools · multimodal inputs · prompt caching · similarity search · structured output · vector embeddings.

---

## Prompt anatomy — the structure the exam tests

A good prompt answers the model's hidden questions before it asks them:

```text
Bad prompt  = vague wish
Good prompt = task + context + constraints + output format + examples when needed
```

| The model's hidden question | What you provide |
|---|---|
| What is the task? | Explain, summarize, classify, extract, rewrite |
| Who is the audience? | Beginner, developer, manager, examiner |
| What context matters? | Source text, data, scenario, goal |
| What should output look like? | Markdown, table, JSON, bullets, code |
| What should be avoided? | Hallucination, extra prose, unsupported claims |
| How will quality be judged? | Rubric, examples, acceptance criteria |

!!! success "The exam connection"
    [T3-AN Q29](../pyqs/t3-2025-an.md#q29-designing-the-prompt) asks exactly this:
    which prompt structure is most effective for sentiment classification?
    The answer is the one with **clear instructions + specified output format +
    separated input data** — the anatomy above.

---

## System vs user prompts — the hierarchy

LLMs take input in **two roles**:

| | System prompt (developer) | User prompt |
|---|---|---|
| Carries | Core operational rules, safety constraints, identity | The transient question or task |
| Set by | The developer | The end user |
| Weight | **Higher** — the model obeys it more diligently | Lower — subordinate to system rules |

!!! success "Must remember — why the hierarchy exists"
    LLMs are mathematically tuned to assign **significantly higher attention
    weights to system prompts**. This ensures the model adheres to its core
    operational rules **even if a user tries to override them** — which is the
    structural defense against prompt injection.

    A user typing "ignore previous instructions" in the user prompt cannot easily
    override rules set in the system prompt — the model weighs the system prompt
    more heavily by design.

!!! warning "Trap — what role separation does NOT do"
    It doesn't *block* users from typing forbidden words (that's input filtering),
    and it doesn't make the model incapable of error. It makes the model **more
    resistant** to override attempts — a defense layer, not a wall.

<div class="tx-anchor" markdown>

**Asked in:** [T1-AN Q23 — defending the LLM from injection](../pyqs/t1-2026-an.md#q23-defending-the-llm-from-the-input-field) · [T1-FN Q15 — why the separation works](../pyqs/t1-2026-fn.md#q15-system-vs-user-prompts) · [ET-1 session](../sessions/et-01.md)

</div>

---

## Structured Outputs — guaranteed JSON from an LLM

**The problem:** LLMs return free-form text. Your application needs typed, validated data — a JSON object with specific fields, or your parser crashes.

**The wrong fix:** regex parsing, string splitting, "hoping the model formats it correctly." Brittle — breaks on every model update.

**The right fix:** Structured Outputs (via Instructor + Pydantic, or the API's native constraint parameter). You define a schema; the LLM fills it:

```python
class Movie(BaseModel):
    title: str
    year: int
    rating: float

# The LLM returns a typed Movie object — not a string to parse
movie = client.messages.create(
    ...,
    response_model=Movie,
)
print(movie.year)  # 2014 (int, not string!)
```

!!! success "What Structured Outputs guarantees — and what it doesn't"
    **Guaranteed:** the output is valid against your schema. The model's token
    generation is *constrained* at the sampling level — it cannot produce JSON
    that violates the schema.

    **NOT guaranteed:** factual accuracy. The model can still be wrong about the
    content — it's just grammatically correct. A hallucinated movie title in
    valid JSON is still a hallucination.

    → [T1-AN Q20](../pyqs/t1-2026-an.md#q20-what-structured-outputs-guarantees)

### Structured Outputs vs Python validation — the exam's sharpest distinction

!!! success "The one-sentence difference"
    **Structured Outputs constrains token generation** (invalid JSON cannot be
    produced). **Python validation detects errors after generation** (the model
    produced bad JSON, your code catches it). Prevention vs detection — different
    layers, both belong in a real system.

    → [T1-FN Q22](../pyqs/t1-2026-fn.md#q22-structured-outputs-vs-python-validation)

### The enforcement chain (worth memorizing)

```
1. Pin the format in the prompt     → "Respond with exactly one word: positive, negative, or neutral"
2. Validate the response             → try: parse JSON, check fields
3. Escalate to Structured Outputs    → when it must never break
```

[T3-AN Q31](../pyqs/t3-2025-an.md#q31-inconsistent-output-formats) tests step 1; [T1-AN Q20](../pyqs/t1-2026-an.md#q20-what-structured-outputs-guarantees) tests step 3.

<div class="tx-anchor" markdown>

**Asked in 4 places:** [T1-AN Q20 — what it guarantees](../pyqs/t1-2026-an.md#q20-what-structured-outputs-guarantees) · [T1-FN Q22 — vs Python validation](../pyqs/t1-2026-fn.md#q22-structured-outputs-vs-python-validation) · [T1-FN Q20 — the malformed JSON crash](../pyqs/t1-2026-fn.md#q20-the-malformed-json-crash) · [T3-AN Q31 — enforcing format in prompts](../pyqs/t3-2025-an.md#q31-inconsistent-output-formats) · GA3

</div>

---

## LLM API calls — the production questions

### The HTTP verb: POST, not GET

LLM inference *processes* submitted data — that's POST by REST semantics. The payload (review text, question, document) goes in the **request body**, not the URL. GET is for retrieval without side effects.

→ [T3-AN Q28](../pyqs/t3-2025-an.md#q28-the-http-verb-for-the-llm-call) — asked as a one-mark MCQ here, and as a 2-mark short answer in [T1-FN Q25](../pyqs/t1-2026-fn.md#q25-get-or-post)

### Cost and scale awareness

500 reviews at $0.002 each = $1.00 and ~17 minutes sequential. The professional approach:

- **Batch** — respect rate limits, group efficiently
- **Track costs** — it's real money; monitor spend per run
- **Handle errors** — retries with backoff, fallbacks
- **Cache results** — identical input → stored output, never pay twice

→ [T3-AN Q30](../pyqs/t3-2025-an.md#q30-cost-and-scale-awareness)

### The division of labour

The LLM judges each item; **your code does the math.** Asking the LLM to count or calculate re-introduces hallucination into a step that should be exact. The model returns verdicts; pandas sums them.

→ [T3-AN Q32](../pyqs/t3-2025-an.md#q32-computing-the-percentage)

<div class="tx-anchor" markdown>

**Asked in:** [T3-AN Q28 — the HTTP verb](../pyqs/t3-2025-an.md#q28-the-http-verb-for-the-llm-call) · [T3-AN Q30 — cost and scale](../pyqs/t3-2025-an.md#q30-cost-and-scale-awareness) · [T3-AN Q32 — the percentage](../pyqs/t3-2025-an.md#q32-computing-the-percentage) · [T1-FN Q25 — GET vs POST SA](../pyqs/t1-2026-fn.md#q25-get-or-post) · GA3

</div>

---

## Vector embeddings — the foundation for RAG

**What an embedding is:** a fixed-length list of numbers (a vector) that represents the *meaning* of a text. Texts with similar meanings have vectors that are close together in high-dimensional space.

```
"King" − "Man" + "Woman" ≈ "Queen"
```

This isn't magic — the embedding model places semantically related concepts in similar geometric regions.

```python
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="The cat sat on the mat.",
)
embedding = response.data[0].embedding  # 1536 dimensions
```

**Why it matters:** embeddings power semantic search, RAG (Week 4), and recommendation systems. When the exam asks about "converting a query to an embedding and searching for similar chunks" — that's this.

→ The RAG questions in [T3-AN Q33–37](../pyqs/t3-2025-an.md#q33-why-chunk-documents) all build on this concept.

---

## Similarity search — finding the nearest neighbours

Once texts are embeddings, "find similar" becomes a geometry problem: which vectors are closest? Common distance measures:

| Measure | Best for |
|---|---|
| **Cosine similarity** | Text semantics — measures angle, not magnitude |
| **Euclidean distance** | Straight-line distance in vector space |
| **Dot product** | Fast, used when vectors are normalized |

The exam's cosine-similarity question (GA3: `cosine-similarity-server`) tests whether you know that semantic similarity = geometric proximity.

---

## Context engineering — managing the window

LLMs have a **context window** — a maximum number of tokens they can process at once. Context engineering is the discipline of fitting the most useful information into that window:

- **What to include:** the task, the critical context, recent conversation
- **What to leave out:** irrelevant history, redundant examples, padding
- **The "lost in the middle" problem:** models attend most to the beginning and end of the context — information buried in the middle gets less attention

This connects directly to RAG (Week 4): chunking strategies exist partly to manage context windows, and the [context-assembly question in GA4](../weeks/week-4.md) tests it.

---

## Prompt caching — saving money on repeated prefixes

When you send the same system prompt (or prefix) repeatedly, the provider can cache the processed tokens. Subsequent requests with the same prefix are cheaper and faster — you pay for the cached input at a reduced rate.

**The exam angle:** this pairs with the caching family from Week 2 — same concept (cache what doesn't change), applied to LLM tokens instead of HTTP responses.

---

## Self-check — can you answer these without looking?

??? question "1. Why do developers put core rules in the System prompt instead of the User prompt?"
    LLMs assign **higher attention weights to system prompts** — the model obeys
    them more diligently, making it harder for users to override the rules through
    their input.

??? question "2. What does Structured Outputs guarantee — and what does it NOT?"
    **Guaranteed:** valid JSON against your schema (token generation is constrained).
    **NOT guaranteed:** factual accuracy — the model can still be wrong, just
    grammatically correct.

??? question "3. What's the difference between Structured Outputs and Python validation?"
    Structured Outputs **constrains generation** (prevention — bad JSON can't be
    produced). Python validation **detects errors after** (the model already
    produced bad JSON, your code catches it).

??? question "4. An LLM returns 'negative', 'Negative', and 'neg' inconsistently. What do you do?"
    Pin the format in the prompt: "Respond with exactly one word: positive,
    negative, or neutral in lowercase." If it must never break, escalate to
    Structured Outputs.

??? question "5. Should an LLM inference endpoint use GET or POST? Why?"
    **POST** — the review text is a payload submitted for processing (REST
    semantics), it exceeds URL length limits (payload limits), and GET responses
    may be cached by proxies (leaking one user's result to another).

??? question "6. What is an embedding?"
    A fixed-length vector of numbers that represents the **meaning** of a text.
    Similar meanings → nearby vectors. This is the foundation of semantic search
    and RAG.
