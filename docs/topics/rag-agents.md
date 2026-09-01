# RAG & agents — 60-second sheets

<div class="tx-meta" markdown>

~7 min total · 6 concepts · Last-minute revision layer — [full: W4](../weeks/week-4.md) + [W5](../weeks/week-5.md)

</div>

*New content this term — no PYQ history but GA-tested and expected on the exam.*

---

## The RAG pipeline

```
Documents → Chunk → Embed → Vector DB
User query → Embed → Search → Retrieve top-K → Chunks + Query → LLM → Grounded answer
```

**R = Retrieve → A = Augment → G = Generate.** The query is embedded and matched against chunks **before** the LLM sees anything.

??? question "Practice: What happens FIRST in a RAG system?"
    **Convert the query to an embedding and search for similar chunks** — not
    generate, not store. R = first letter. → [T3-AN Q34](../pyqs/t3-2025-an.md#q34-what-happens-first)

---

## Chunking — the size trade-off

| Size | Problem |
|---|---|
| **Too small** (1–2 sentences) | Retrieved fragment lacks context to answer |
| **Too large** (whole document) | Embedding blurs + context window overflows |
| **Just right** (1–2 paragraphs, ~200–500 words) | Coherent enough to answer, focused enough to retrieve |

??? question "Practice: What chunk size for a customer support chatbot?"
    **Medium chunks** (~200–500 words) — context and focus balanced.
    → [T3-AN Q36](../pyqs/t3-2025-an.md#q36-choosing-the-chunk-size)

---

## Stale documents — the RAG maintenance problem

The vector database is a **snapshot**. Ingest v1, ship v2, forget to remove v1's chunks — both embed, both retrieve, and the LLM can't tell which is authoritative.

**The fix is operational:** re-ingest atomically, version or timestamp chunks, expire the old.

??? question "Practice: Chatbot returns outdated manual info. Why?"
    **Old chunks remain in the vector database** — v1 wasn't removed when v2 was
    ingested. → [T3-AN Q35](../pyqs/t3-2025-an.md#q35-stale-answers-from-old-manuals)

---

## asyncio.gather — the timing arithmetic

`asyncio.gather` launches all tasks simultaneously and returns only when **every task completes**.

!!! success "The professor's arithmetic"
    5 requests: 4 take 1s, 1 takes 10s. **Total: 10 seconds** — the max, not the
    sum (14s sequential) or the average (5s). Concurrency removes the *sum*,
    not the *max*.

??? question "Practice: 4 requests at 1s + 1 at 60s in gather. What happens?"
    **Waits 60s for all before returning.** One hanger holds everything hostage.
    → [T1-AN Q21](../pyqs/t1-2026-an.md#q21-asynciogather-with-a-hanger)

---

## Agents — the loop and the guardrails

An **agent** = a model that chooses and uses tools repeatedly to finish a goal.

```
Goal → Decide → Use a tool → Observe → (repeat) → Done
```

**The parts that matter:**
- **Tools** — what the agent can do (allow-list, deny by default)
- **Rules** — limits on steps, time, cost
- **Verifier** — checks whether the result is correct

!!! warning "Trap — LLM06 Excessive Agency"
    What's the worst single action your agent can take unsupervised? If the answer
    is "send_email" or "delete" without human approval, that's the vulnerability.

---

## MCP — Model Context Protocol

A **standard protocol** for connecting LLMs to external tools and data sources — the "USB-C of AI integrations." Instead of custom integrations per tool, MCP provides a common interface.

**Sandboxing** — running agent actions in isolated environments (containers, VMs, LXC) so a compromised agent can't damage your host or exfiltrate data.
