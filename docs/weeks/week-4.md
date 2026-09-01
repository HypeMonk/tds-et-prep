# Week 4 — RAG: Retrieval-Augmented Generation

<div class="tx-meta" markdown>

~18 min read · Examinable: 🔥🔥 (RAG scenario block in T3-AN; W4 is a whole course week — new territory the exam will test) · GA4 · [T3-AN Q33–37](../pyqs/t3-2025-an.md#q33-why-chunk-documents)

</div>

The RAG week — the entire pipeline from chunking documents to generating grounded answers. The T3-2025 AN paper has a **five-question scenario block on RAG** (Q33–37), and the GA drills it at full depth. This is new content with no PYQ history in the most recent paper, but it's a full course week — expect the exam to lean on it.

Course files: chunking strategies · contextual retrieval · GraphRAG · hybrid search · late chunking · LLM grounding · multimodal embeddings · query augmentation.

---

## The RAG pipeline — the one diagram to remember

```
Documents → Chunk → Embed → Store in vector DB
                                        ↓
User query → Embed → Search similar chunks → Retrieve top-K
                                        ↓
                Chunks + Query → LLM → Grounded answer
```

**R = Retrieve (find relevant chunks) → A = Augment (add them to the prompt) → G = Generate (the LLM composes an answer grounded on them).**

The exam tests the ORDER: what happens first? **The query is embedded and matched against chunk embeddings before the LLM sees anything.** → [T3-AN Q34](../pyqs/t3-2025-an.md#q34-what-happens-first)

---

## Chunking — the most underrated step

**Why it matters:** your embedding model has a token limit (512–8192 tokens). You can't embed a whole PDF at once. But chunks that are too small lose context; chunks too large dilute the signal.

!!! success "The trade-off — the exam's RAG tuning knob"
    - **Too small** (1–2 sentences): a retrieved fragment lacks the context to
      answer the question — "Can I return my laptop?" needs the *surrounding*
      policy paragraph, not one sentence.
    - **Too large** (entire documents): embeddings blur (the vector averages the
      whole document into mush) and context windows overflow.
    - **Just right** (1–2 paragraphs, ~200–500 words): coherent enough to answer,
      focused enough to retrieve precisely.

    → [T3-AN Q36](../pyqs/t3-2025-an.md#q36-choosing-the-chunk-size) — asked
    directly as a one-mark MCQ

### Why chunk at all? (not just for the token limit)

!!! success "The accuracy answer the exam wants"
    Chunks match queries with **relevant sections**, not whole documents. The
    query "return policy?" matches the *returns* chunk precisely — not the
    40-page manual that contains it, diluted across every other topic.
    → [T3-AN Q33](../pyqs/t3-2025-an.md#q33-why-chunk-documents)

### The five strategies (course depth)

| Strategy | How it works | Best for |
|---|---|---|
| **Fixed-size** | Split every N tokens with M overlap | Quick prototyping |
| **Recursive** | Try `\n\n` → `\n` → `. ` → ` ` in order | Respects structure |
| **Document-based** | Split on headings, sections, paragraphs | Structured docs |
| **Semantic** | Split where the topic changes | Mixed-content corpora |
| **Late chunking** | Embed the full document, then chunk the embeddings | Preserves cross-chunk context |

→ GA4: `rag-chunking-hybrid-search-server`, `late-chunking-context-retrieval-server`

---

## Embeddings and retrieval — finding the right chunks

**The mechanism:** both the query and the chunks are converted to vectors (embeddings). Retrieval = finding the chunks whose vectors are **closest** to the query's vector.

**Distance measures:**

| Measure | Best for |
|---|---|
| **Cosine similarity** | Text semantics — measures angle, not magnitude |
| **Euclidean distance** | Straight-line distance in vector space |
| **Dot product** | Fast, used when vectors are normalized |

→ GA4: `vector-search-rerank-api-server`, `ann-index-recall-latency-server`

---

## Hybrid search — dense + sparse together

**The problem with pure vector search:**

- **Keyword mismatch** — "myocardial infarction" ≠ "heart attack" in embedding space
- **Rare terms** — product codes, model numbers get diluted in dense vectors
- **Exact match needs** — legal terms, IDs should match exactly

**BM25 (sparse/keyword) search** has the opposite profile: great for exact terms, poor for semantic similarity.

**Hybrid = both, combined.** Dense finds synonyms; sparse finds exact terms; together they catch what either alone misses.

→ GA4: `rag-chunking-hybrid-search-server`, `rrf-fusion-server` (RRF = Reciprocal Rank Fusion, the standard way to combine results from both searches)

---

## Grounded answers — what the LLM does with retrieved chunks

!!! success "The 'Augment' step — the exam asks this directly"
    The retrieved chunks are placed in the prompt **as context**, and the LLM
    **generates an answer grounded on them** — not from its training data, not
    by copying verbatim, but by synthesizing an answer that uses the chunks as
    its evidence.

    "Can I return my laptop if I opened the box?" — the model reads the return
    policy chunk + the laptop specs chunk and composes an answer that addresses
    the *specific* question, which neither chunk states verbatim.

    → [T3-AN Q37](../pyqs/t3-2025-an.md#q37-how-the-llm-uses-retrieved-chunks)

!!! warning "Trap — what grounding does NOT mean"
    The model does **not** ignore the chunks and answer from training data (that's
    the hallucination path RAG exists to prevent). It also does **not** copy text
    verbatim — it synthesizes. The chunks are evidence, not a script.

→ GA4: `grounded-answer-api-server`, `llm-grounding`

---

## Stale documents — the RAG maintenance problem

!!! success "The Achilles heel the exam tests"
    The vector database is a **snapshot**. Ingest v1 of a manual, ship v2, forget
    to remove v1's chunks — now both embed, both retrieve, and the LLM can't tell
    which is authoritative. The chatbot returns outdated information even though
    newer versions exist.

    **The fix is operational:** re-ingest atomically, version or timestamp chunks,
    expire the old. The bug is in the index, not the brain.

    → [T3-AN Q35](../pyqs/t3-2025-an.md#q35-stale-answers-from-old-manuals)

---

## Contextual retrieval and query augmentation — advanced techniques

**Contextual retrieval:** add document-level context to each chunk before embedding, so a chunk that says "it costs $50" knows it's from the pricing document.

**Query augmentation:** rewrite or expand the user's query before searching — adding synonyms, generating hypothetical answers to embed instead of the raw question (HyDE), or breaking complex queries into sub-queries.

→ GA4: `semantic-cache-query-augmentation-server`, `hyde-hypothetical-retrieval-server`

---

## Self-check — can you answer these without looking?

??? question "1. What are the three steps of RAG, in order?"
    **Retrieve** (embed the query, search for similar chunks) → **Augment** (place
    chunks in the prompt as context) → **Generate** (the LLM composes an answer
    grounded on them). R = the first letter.

??? question "2. Why chunk documents instead of embedding them whole?"
    (a) Embedding models have token limits. (b) A whole document's embedding
    averages every topic into mush — a chunk embeds sharply and retrieves
    precisely. (c) Retrieved chunks fit the context window; whole documents
    may not.

??? question "3. What's the right chunk size and why?"
    **1–2 paragraphs, ~200–500 words.** Smaller loses context (can't answer on
    its own); larger dilutes the embedding signal and overflows context.

??? question "4. The chatbot returns outdated manual information. What's the cause?"
    **Old chunks remain in the vector database** — v1 wasn't removed when v2 was
    ingested. Both embed, both retrieve. The fix: re-ingest atomically, expire
    the old.

??? question "5. How does the LLM use the retrieved chunks?"
    As **context to generate an informed answer** — not ignored (hallucination),
    not copied verbatim (no synthesis). The chunks are evidence for composition.

??? question "6. What does hybrid search combine and why?"
    **Dense (vector) search** finds semantic matches (synonyms, paraphrases).
    **Sparse (keyword/BM25) search** finds exact terms (codes, names, legal terms).
    Together they catch what either alone misses.
