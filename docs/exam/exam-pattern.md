# What the ET actually looks like

<span class="tx-meta">**~6 min read** · Read this first — everything else on this site assumes you know this page.</span>

The exam structure below is **officially announced** by the course team — not our inference from sessions or papers. Around it, everything else comes from four real papers (T1-2026 AN + FN, T3-2025 AN + FN) and three live revision sessions (ET-1, ET-2, ET-3).

## The official structure — 80 marks, 90 minutes

| Fact | Detail |
|---|---|
| Total marks | **80** |
| Duration | **90 minutes** (1.5 hours) |
| Negative marking | **None** — same as every paper before |
| Section 1 | **30 MCQ/MSQ questions · 39 marks** — graded automatically |
| Section 2 | **9 short-answer questions · 41 marks** — "Applied AI Judgment", graded offline by an LLM |

Marks per question are **not fixed** — within each section some questions carry 1 mark, some 2, and Section 2's questions are the heavy ones (4–5 marks each). One written answer can outweigh three objective questions.

!!! success "Must remember"
    There is no negative marking. **Never leave a question blank.** A wrong guess costs the
    same as a skipped question — nothing. If 30 seconds are left, mark *something* on every
    unanswered question — and write *something* on every short answer too: an LLM
    grader can only reward what's on the page.

### What "Applied AI Judgment" means

The official name for Section 2 sounds abstract, but it's simple in practice:

> **You're given a real situation involving an AI or data system — and your answer is the judgment you make about it.**

The situations look like: a flawed API design, a suspicious pattern in a dataset, a claim someone made about a model's performance, a buggy script, a client's vague request. Your answer shows four things:

- **What's really going on** — the mechanism, not the surface symptom
- **What the evidence supports** — and what it doesn't
- **What else it could be** — the alternative you tested before concluding
- **What to do next** — a safe, reversible action

No code, no syntax — *"we are least concerned about syntax"* (ET-3). The rubric rewards reasoning over conclusions: a well-argued alternative answer beats an asserted "correct" one. If you practiced the [P2-style thinking](llm-grading-guide.md) of *evidence → alternatives → safe action*, that is exactly this skill.

One confirmed question format inside this section: **agent-prompting** — given a software problem, *write the prompt you'd give a coding agent* (like Codex) to solve it. Role, context, task, constraints. Method: [the grading guide](llm-grading-guide.md).

## How the 90 minutes should be spent

With 39 questions on the paper, pace matters more than ever:

```
Section 1 — 30 questions, 39 marks   ~40-45 min   ≈ 80-90 seconds per MCQ
Section 2 — 9 questions, 41 marks    ~45-50 min   ≈ 5 minutes per written answer
```

!!! success "Must remember"
    Section 2 is worth **more than half the paper** (41 of 80). The classic mistake is
    burning 60 minutes perfecting MCQs and sprinting the written answers. When your
    Section-1 time budget is up, **move** — a missed MCQ costs 1-2 marks; a rushed
    or blank written answer costs 4-5.

## Section 1's four topic areas — the official map

The announcement names four areas. Every week of this course has a home in them — nothing you studied is wasted:

| Official area | Weeks that feed it | Where to revise |
|---|---|---|
| **Systems, APIs, Networking & Deployment** | Bridge, W1, W2 | [Web & APIs](../topics/web-apis.md) · [Docker & deployment](../topics/docker-deployment.md) |
| **Observability, Monitoring & Data Integrity** | W6 + the ETL/freshness thread | [Data & ML](../topics/data-ml.md) · [Week 6](../weeks/week-6.md) |
| **CI/CD, Infrastructure & Security** | W7 | [Git, security & practices](../topics/git-security.md) · [Week 7](../weeks/week-7.md) |
| **AI/LLM System Design & Governance** | W3, W4, W5, W8 | [LLMs & prompting](../topics/llm-prompting.md) · [RAG & agents](../topics/rag-agents.md) |

Some Section-1 questions will be **scenario-stemmed** — a short 2-3 sentence situation followed by one or two objective questions. That's the classic PYQ scenario-block style (the FastAPI-proxy story, the StreamFlix gateway), just compacted. The full scenarios live in Section 2.

## How marks were laid out in previous papers (history)

Past terms were 40-mark papers with a difficulty ramp — useful for how questions are *built*, not for this term's totals:

```
Part 1 — 1-mark questions     (~8-9 questions)   warm-up, single facts
Part 2 — 2-mark questions     (~5 questions)     reasoning, "why does this happen"
Part 3 — 3-mark questions     (~2 questions)     diagnosis, multi-step thinking
Part 4 — Scenario blocks      (~3 blocks)        one story, 5-6 questions each
Part 5 — Short answers        (~2 questions)     write 200 words, graded by an LLM
```

This term keeps the *kinds* of thinking (warm-up recall → reasoning → diagnosis → scenario judgment) but reorganizes them into the two official sections, with the written half grown from ~4 marks to 41.

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
| **Judge the situation** *(Section 2)* | A dashboard shows a suspicious spike. What is it, and what do you do? |

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

!!! success "The options are designed to guide you (Section 1)"
    Read all four before answering. Many questions are built so that wrong options are
    *plausible-sounding nonsense* — eliminate those and the answer is what's left.

!!! info "These option tricks cover Section 1 only"
    Elimination and option-reading work where there *are* options. Section 2 (41 marks)
    has none — for that, the [LLM-grading guide](llm-grading-guide.md) **is** the strategy.

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

**Next steps:** Read [How to write answers an LLM grades well](llm-grading-guide.md) — Section 2 is 41 marks and this method is how you collect them. Then take [Mock-1](../mock/mock-1.md) under a 90-minute timer.
