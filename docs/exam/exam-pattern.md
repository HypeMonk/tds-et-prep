# What the ET actually looks like

**~6 min read · Read this first — everything else on this site assumes you know this page.**

Everything below comes from four real papers (T1-2026 AN + FN, T3-2025 AN + FN) and two live revision sessions (ET-1, ET-2) where the professor solved these papers question by question. Nothing here is a guess.

## The shape of the paper

| Fact | Detail |
|---|---|
| Total marks | **40** |
| Questions | ~20 (plus sub-questions inside scenario blocks) |
| Negative marking | **None. Zero.** (verified in every paper) |
| Duration | Fixed section time, shown before you start |
| Question types | MCQ · MSQ (multi-select) · numerical · **short answer (new)** |

> 🟢 **Must remember:** There is no negative marking. **Never leave a question blank.** A wrong guess costs the same as a skipped question — nothing. If 30 seconds are left, mark *something* on every unanswered question.

## How the marks are laid out

The paper climbs in difficulty and marks. This exact ramp appeared in both T1-2026 shifts:

```
Part 1 — 1-mark questions     (~8-9 questions)   warm-up, single facts
Part 2 — 2-mark questions     (~5 questions)     reasoning, "why does this happen"
Part 3 — 3-mark questions     (~2 questions)     diagnosis, multi-step thinking
Part 4 — Scenario blocks      (~3 blocks)        one story, 5-6 questions each
Part 5 — Short answers        (~2 questions)     NEW — write 200 words, graded by an LLM
```

> 🟢 **Must remember:** The big marks sit at the *end*, in the scenario blocks and short answers. Students who run out of time on early 1-markers lose the 2- and 3-mark territory. Move briskly through Part 1.

### What a scenario block is

One story, then 5-6 questions hanging off it. A real example (T1-2026, AN):

> *A student builds a FastAPI proxy that fetches movie data, passes it to an LLM for a summary, and returns it to a React frontend. Every refresh re-runs the LLM and costs money. So the student adds a cache header... then the browser blocks the local request... then a user tries prompt injection through the "Movie Title" field.*
>
> → 6 questions follow: Why did the browser block it? What does `max-age=3600` do? How do you force fresh data past the cache? How do you defend the LLM?

Each sub-question is worth 1-2 marks. **You don't need to write any code** — you pick the right option about code someone else wrote.

> 🟡 **Trap:** Students see a long scenario and panic-skip it. Don't. Scenario questions are *easier* per mark than the 3-mark singles — the story gives you context, and the answers are usually visible in the story's logic.

## The four question types

**1. MCQ — one correct option.** The bulk of the paper. Mostly "why does this happen" or "what does this do", almost never "memorize this definition."

**2. MSQ — select all that apply.** Fewer of these (1-2 per paper). In the PDFs, multiple options are marked correct. There is no partial credit — all correct options must be chosen.

**3. Numerical.** Rare but real (the professor mentioned them in ET-1). Example: *asyncio.gather runs 5 requests; 4 take 1s, 1 takes 10s — total time?* → **10**.

**4. Short answer — the new one.** Appears first in T1-2026 (Jan 2026), 2 questions × 2 marks, capped at 200 words with a live word counter. Graded by an LLM, not a human. Real examples: *"Explain the Dockerfile layer-caching error and why it ruins build speed"* and *"Should an inference endpoint use GET or POST? Justify technically."*

> 🔵 **In the exam:** The short-answer section is growing — the professor said subjective questions are being introduced "to test structural thinking" at degree level. Expect at least as many as Jan had. Our full guide: [How to write answers an LLM grades well](llm-grading-guide.md).

## What the questions are actually about

Not syntax. Not memorized definitions. The papers test one thing: **do you understand why a system behaves the way it does?**

The recurring shapes:

| Shape | Example from a real paper |
|---|---|
| **Why did this break?** | UI on :3000 fetches API on :8000 → browser throws CORS error. Why? |
| **What happens if...?** | You run `sqlite3 new.db` and the file doesn't exist. What happens? |
| **Pick the professional fix** | API returns 500 under load. What do you check? |
| **Spot the wrong belief** | "COUNT(column) and COUNT(*) are the same." True or false? |
| **Choose the right tool** | Storing large numeric arrays: XML, JSON, CSV or Parquet? |

> 🟢 **Must remember:** Almost every question is a *scenario* + *one concept*. If you know the concept, the question takes 20 seconds. If you don't, the options can't save you. That's why this site is organized by concept, not by paper.

## Strategy the professor gave away

These came straight from the revision sessions:

> 🟢 **Practice the recent papers.** The professor pointed at the practice portal and said: old papers exist, but *"don't take a very old paper, which might not be very relevant."* T3-2025 and T1-2026 are the relevant era.

> 🟢 **The options are designed to guide you.** Read all four before answering. Many questions are built so that wrong options are *plausible-sounding nonsense* — eliminate those and the answer is what's left.

> 🟡 **Trap — the "odd one out" pattern:** In format questions (XML/JSON/CSV/Parquet), three options share a property (text-based) and one doesn't (Parquet is columnar). The odd one is almost always the answer to "which is most efficient."

> 🟡 **Trap — the longest option:** In design/practice questions, the longest, most detailed option (the one mentioning constraints, assumptions, edge cases) is frequently correct — it mirrors professional best practice. Don't over-trust this, but when genuinely torn, it's a tiebreaker with a real hit rate.

## What is NOT in this term's exam

> 🔴 **OpenRefine is excluded.** The professor said it explicitly in ET-2: not in this term's syllabus. If you see OpenRefine questions in old papers (text clustering, `value.toTitlecase()`), **skip them — you will not be asked.**

> 🔴 **Geospatial (Folium, GeoPandas, CRS) is almost certainly out.** It appeared in T3-2025 and even T1-2026, but the current term's course content contains zero geospatial material. Learn only the 30-second version: *distance functions expect (latitude, longitude) — swapped coordinates point somewhere else entirely.* That concept still transfers.

> 🔴 **Spreadsheets and Seaborn are gone too** — old-syllabus leftovers. Don't study them for this exam.

---

**Next steps:** Read [How to write answers an LLM grades well](llm-grading-guide.md) (5 min), then pick your plan from [the plan chooser](../plan/index.md) — or jump straight into [PYQ solutions](../pyqs/index.md).
