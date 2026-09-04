# What the ET actually looks like

<span class="tx-meta">**~6 min read** · Read this first — everything else on this site assumes you know this page.</span>

Everything below comes from four real papers (T1-2026 AN + FN, T3-2025 AN + FN), three live revision sessions (ET-1, ET-2, ET-3) where the professor solved papers question by question and explained the exam format, and the current syllabus. Nothing here is a guess.

## This term's big change — what ET-3 told us

The professor's final revision session (3 Sept 2026) was about the exam itself.
Three things to know:

| What he said | What it means for you |
|---|---|
| **About half the paper is subjective** — the other half stays objective | Roughly **20 marks objective + 20 marks written** on the 40-mark paper. Half your marks come from *writing* answers, not picking options. |
| **Question formats will be new** — "something you have probably never seen in the diploma level so far" | The *concepts* stay the ones you know — they'll be asked in **new shapes**. Study concepts, not memorized answers. |
| **One format is confirmed: agent-prompting** — given a software problem, *write the prompt you'd give a coding agent* (like Codex) to solve it | A full prompt with role, context, task, and constraints is the answer. Practice this — see [the prompting notes](../topics/llm-prompting.md). |

!!! success "The theme he repeated"
    *"We are least concerned about syntax."* No exact YAML, no exact Dockerfile
    strings, no pen-and-paper calculation. The paper measures **approach,
    reasoning, and critical thinking** — the "why" behind the "how." If you
    understand the concepts on this site, you're studying the right thing.

!!! info "How the subjective half is graded"
    Like an ROE: submissions are collected, then evaluated afterward — no live
    green-tick feedback. Subjective answers are graded by an LLM, so structure
    and keywords matter. The full method: [How to write answers an LLM grades well](llm-grading-guide.md).

**Half the paper being subjective is good news in one way:** the short-answer
method is *learnable in hours* — far faster than any topic you could still
cram. Read the [grading guide](llm-grading-guide.md) first, then practice on
[Mock-2 (subjective half)](../mock/subjective.md).

## The shape of the paper

| Fact | Detail |
|---|---|
| Total marks | **40** |
| Split this term | **~half objective, ~half subjective** *(announced in ET-3)* |
| Negative marking | **None. Zero.** *(verified in every paper)* |
| Duration | Fixed section time, shown before you start |
| Question types | MCQ · MSQ (multi-select) · numerical · **subjective / short answer** |

!!! success "Must remember"
    There is no negative marking. **Never leave a question blank.** A wrong guess costs the
    same as a skipped question — nothing. If 30 seconds are left, mark *something* on every
    unanswered question — and write *something* on every subjective question too: an LLM
    grader can only reward what's on the page.

## How the marks were laid out in recent papers

Previous terms climbed in difficulty and marks — this exact ramp appeared in
both T1-2026 shifts, and it's the best reference for how an ET is built:

```
Part 1 — 1-mark questions     (~8-9 questions)   warm-up, single facts
Part 2 — 2-mark questions     (~5 questions)     reasoning, "why does this happen"
Part 3 — 3-mark questions     (~2 questions)     diagnosis, multi-step thinking
Part 4 — Scenario blocks      (~3 blocks)        one story, 5-6 questions each
Part 5 — Short answers        (~2 questions)     write 200 words, graded by an LLM
```

With the subjective half at ~50% this term, expect the written territory to be
much bigger than two 2-mark questions — but the *kinds* of thinking (warm-up
recall → reasoning → diagnosis → scenario) are the same ladder.

!!! success "Must remember"
    The big marks sit at the **end** — in the scenario blocks and written
    answers. Students who run out of time on early 1-markers lose the 2- and
    3-mark territory. Move briskly through Part 1.

### What a scenario block is

One story, then 5-6 questions hanging off it. A real example (T1-2026, AN):

> *A student builds a FastAPI proxy that fetches movie data, passes it to an LLM for a
> summary, and returns it to a React frontend. Every refresh re-runs the LLM and costs
> money. So the student adds a cache header... then the browser blocks the local
> request... then a user tries prompt injection through the "Movie Title" field.*
>
> → 6 questions follow: Why did the browser block it? What does `max-age=3600` do? How do
> you force fresh data past the cache? How do you defend the LLM?

Each sub-question is worth 1-2 marks. **You don't write any code** — you pick the right option about code someone else wrote.

!!! warning "Trap"
    Students see a long scenario and panic-skip it. Don't. Scenario questions are *easier
    per mark* than the 3-mark singles — the story gives you context, and the answers are
    usually visible in the story's logic.

## The four question types

**1. MCQ — one correct option.** The bulk of the paper. Mostly "why does this happen" or "what does this do", almost never "memorize this definition."

**2. MSQ — select all that apply.** Fewer of these (1-2 per paper). Multiple options are marked correct. There is no partial credit — all correct options must be chosen.

**3. Numerical.** Rare but real (the professor mentioned them in ET-1). Example: *asyncio.gather runs 5 requests; 4 take 1s, 1 takes 10s — total time?* → **10**.

**4. Subjective / short answer — half the paper this term.** First appeared in T1-2026 (2 questions × 2 marks, 200-word cap with a live counter), graded by an LLM — and now announced at **~50% of the exam**. Real examples: *"Explain the Dockerfile layer-caching error and why it ruins build speed"*, *"Should an inference endpoint use GET or POST? Justify technically"*, and the confirmed new format: *write the prompt you'd give a coding agent to fix this buggy script*.

!!! info "In the exam"
    With the subjective half at ~50%, this is now the highest-value skill on
    the paper — and the fastest one to learn. Our full method: [How to write answers an LLM grades well](llm-grading-guide.md), practice in [Mock-2 (subjective half)](../mock/subjective.md).

## What the questions are actually about

Not syntax. Not memorized definitions. The papers test one thing: **do you understand why a system behaves the way it does?**

The recurring shapes:

| Shape | Example from a real paper |
|---|---|
| **Why did this break?** | UI on `:3000` fetches API on `:8000` → browser throws CORS error. Why? |
| **What happens if...?** | You run `sqlite3 new.db` and the file doesn't exist. What happens? |
| **Pick the professional fix** | API returns 500 under load. What do you check? |
| **Spot the wrong belief** | "COUNT(column) and COUNT(*) are the same." True or false? |
| **Choose the right tool** | Storing large numeric arrays: XML, JSON, CSV or Parquet? |

!!! success "Must remember"
    Almost every question is a *scenario* + *one concept*. If you know the concept, the
    question takes 20 seconds. If you don't, the options can't save you. That's why this
    site is organized by concept, not by paper.

## Strategy the professor gave away

These came straight from the revision sessions:

!!! success "Study concepts, not answers"
    The professor's ET-3 advice on PYQs: use them to predict **the core
    concepts, not the exact questions** — this term's question shapes are new.
    The last three papers are enough; don't deep-dive older ones.

!!! success "The options are designed to guide you (objective half)"
    Read all four before answering. Many questions are built so that wrong options are
    *plausible-sounding nonsense* — eliminate those and the answer is what's left.

!!! warning "Trap — the odd one out"
    In format questions (XML / JSON / CSV / Parquet), three options share a property
    (text-based) and one doesn't (Parquet is columnar). The odd one is almost always the
    answer to "which is most efficient."

!!! warning "Trap — the longest option"
    In design questions, the longest, most detailed option — the one mentioning
    constraints, assumptions, edge cases — is frequently correct, because it mirrors
    professional best practice. Don't over-trust this, but when genuinely torn, it's a
    tiebreaker with a real hit rate.

!!! info "These option tricks cover the objective half"
    Elimination and option-reading only work where there *are* options. Half your
    marks are written answers now — for that half, the [LLM-grading guide](llm-grading-guide.md)
    is the strategy.

## What is NOT in this term's exam

!!! danger "OpenRefine is excluded"
    The professor said it explicitly in ET-2: not in this term's syllabus. If you see
    OpenRefine questions in old papers (text clustering, `value.toTitlecase()`), **skip
    them — you will not be asked.**

!!! danger "Geospatial is almost certainly out"
    Folium, GeoPandas and CRS appeared in T3-2025 and even T1-2026, but the current
    term's course content contains **zero geospatial material**. Learn only the
    30-second version: *distance functions expect (latitude, longitude) — swapped
    coordinates point somewhere else entirely.* That concept still transfers.

!!! danger "Spreadsheets and Seaborn are gone too"
    Old-syllabus leftovers. Don't study them for this exam.

---

**Next steps:** Read [How to write answers an LLM grades well](llm-grading-guide.md) (5 min), then pick your plan from [the plan chooser](../plan/index.md) — or jump straight into [PYQ solutions](../pyqs/index.md).
