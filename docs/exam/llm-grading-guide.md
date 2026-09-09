# How to write answers an LLM grades well

<span class="tx-meta">**~9 min read** · **Section 2: 41 of 80 marks** · The fastest marks to gain on the exam.</span>

Section 2 of the end-term — **"Applied AI Judgment"**, 9 questions worth 41 marks — is graded offline by **an LLM, not a human**. The professor said this explicitly in the ET-2 and ET-3 sessions, and the official pattern confirms it. This page turns that into a repeatable method.

!!! success "Why this page first"
    Learning this method takes under an hour. 41 of 80 exam marks flow through
    it. No topic you could study in the same hour pays more.

## What's grading you

An LLM reads your answer against a hidden marking rubric (a checklist). It is looking for:

1. **Did you address what was asked?**
2. **Did you show reasoning, not just a conclusion?**
3. **Are the key technical ideas present and in the right order?**

It is *not* impressed by length. The professor's exact position, when a student asked if answers need to be long: **"logic over length."**

!!! success "Must remember"
    You are not writing to sound smart. You are writing so a checklist-reader can tick
    boxes fast. Every sentence should make one checkable point.

## The five rules

### 1. Structure before you write

Give the grader visible signposts. The professor named these exact words as what the LLM looks for: **constraints, assumptions, scalability.** When your answer names its assumptions before its conclusion, the grader finds the boxes it's ticking.

### 2. Bullet points beat paragraphs

The professor said it directly: structure your answers with bullets and clear headers. An LLM grader can't "skim" a wall of text as forgivingly as a tired human at 2am — a dense paragraph hides your good points. One point per bullet.

### 3. Say the *why*, not just the *what*

- "Use POST, not GET" — half the marks.
- "Use POST because the review text is a payload sent for processing; GET is for retrieval, has URL length limits, and can be cached or logged — leaking data" — full marks.

### 4. Name the trade-off

Professional answers acknowledge cost. Words like *however*, *at the cost of*, *this prevents X but requires Y* signal engineering judgment. (The longest, most trade-off-aware option winning MCQs is the same instinct.)

### 5. Spend the budget on points

~200-word cap per answer, live counter on screen. The official Section 2 questions carry **4–5 marks each** — that's not a 2-mark answer stretched thin, it's **5–7 checkable points**. Aim for 150-200 words of dense, bulleted substance: one bold reason per bullet, each earning its line. Padding wastes your 5-minute-per-question budget and earns nothing.

## A worked example — a real question

From the Jan 2026 paper (FN shift), worth 2 marks:

!!! example "The actual question"
    **Should an LLM/sentiment inference endpoint ideally operate via a GET mapped method,
    or a POST method? Provide a rigid technical justification analyzing payload limits
    and REST architectures.**

=== "❌ The answer that loses marks"

    > "POST is better because GET is not good for sending data and POST is more secure
    > and everyone uses POST for APIs these days."

    **Why it fails:** no reasoning, no technical vocabulary, "more secure" is vague and
    half-wrong (GET vs POST is not a security boundary), and it never mentions payload
    limits or REST semantics — the two things the question explicitly asked for.

=== "✅ The answer that earns the marks"

    > **Conclusion: POST.**
    >
    > - **REST semantics:** POST sends a body for the server to *process*; GET *retrieves*
    >   a resource without side effects. Sentiment analysis submits text for processing —
    >   that is a POST by design.
    > - **Payload limits:** GET carries data in the URL, which browsers and servers cap
    >   (~2 KB in places); review text can far exceed this. POST carries it in the request
    >   body with no such limit.
    > - **Caching side effect:** GET responses may be cached by proxies/CDNs — a
    >   URL-keyed cache could serve one user's sentiment result to another. POST is not
    >   cached by default.
    >
    > *Assumption:* the endpoint is a private API with authenticated callers; rate
    > limiting applies at the gateway either way.

    ~140 words. Four bullets, each one checkable. The grader finds
    "REST semantics ✓, payload limits ✓, caching ✓, assumption stated ✓" in seconds.

!!! success "Must remember the template"
    **Conclusion first → then bullets, each starting with a bold reason → end with one
    assumption or trade-off.** That skeleton fits every short-answer question in any
    paper.

## The other real example — design-flaw questions

The Jan AN paper asked: *"Identify the critical sequencing error in the Dockerfile. Explain how this order ruins layer caching."*

Same skeleton works:

!!! example "Model answer"

    > **The error:** `COPY . .` runs *before* `RUN pip install -r requirements.txt` — the
    > full source is copied before dependencies are installed.
    >
    > - **Layer caching rule:** Docker rebuilds a layer only when its inputs change.
    >   Layers after a changed layer must also rebuild.
    > - **Consequence:** every code edit changes the `COPY . .` layer → everything after
    >   it (including pip install) reruns → dependencies re-download on *every minor code
    >   update*, though `requirements.txt` never changed.
    > - **Fix:** copy `requirements.txt` first, `RUN pip install`, then `COPY . .`. Now
    >   dependency layers stay cached across code-only changes.
    > - *Trade-off:* none meaningful — image output is identical; only build speed improves.

## Common short-answer shapes to expect

| Shape | What they ask | Your first bullet should be |
|---|---|---|
| **Justify a choice** | GET vs POST, Parquet vs CSV, cache or not | The conclusion, then one bullet per reason |
| **Diagnose a failure** | why did it crash / get slow / return wrong data | The root cause in one sentence, then mechanism, then fix |
| **Improve a design** | make this endpoint reliable, secure, faster | The missing principle (validation, guardrail, cache), then how it applies |
| **Client questions** | "what 3 follow-up questions would you ask?" | Number them 1-2-3, one sentence of *why each matters* |
| **Write an agent prompt** | "write the prompt a coding agent needs to solve this" | See the section below — it has its own rules |

!!! info "In the exam"
    The professor specifically flagged the client-scenario shape: *"What are the three
    most important follow-up questions you would ask based on these requirements?"* —
    testing whether you think about capabilities, constraints, and business context
    before building. Practice this shape in [Practice questions](../practice/index.md).

## The confirmed new format: writing prompts for a coding agent

From ET-3 — this is a **confirmed question type**, not a guess: you'll be given
a software problem (for example, a buggy script) and asked to **write the
prompt you'd give a coding agent like Codex to solve it effectively.** The
prompt itself is your answer.

**What's being tested:** can you translate a problem into clear, complete,
unambiguous instructions — the same skill as writing for the LLM grader, aimed
at an LLM *worker* instead.

The professor named the trap himself: a prompt like *"Write this in Python"*
is too vague. A strong agent prompt carries four blocks:

```text
1. ROLE      — who the agent is: "You are a Senior Python Developer..."
2. CONTEXT   — the situation and what's wrong: "This bash script processes
               log files but has no error handling for missing files."
3. TASK      — the concrete outcome: "Refactor it into Python."
4. CONSTRAINTS — the rules the solution must obey: "Use the os module,
               handle missing input files gracefully, add type hints,
               keep the output format identical to the original."
```

!!! example "Worked example — the ET-3 scenario"

    **Given:** a bash script that processes log files. **Write the prompt for a
    coding agent to refactor it into Python.**

    > You are a Senior Python Developer. I have a bash script that reads every
    > file in `./logs/`, extracts lines containing "ERROR", and writes them to
    > `errors.txt`. It has no error handling — a missing input file crashes it,
    > and a missing `./logs/` directory silently produces an empty output.
    >
    > Refactor this into Python with these constraints:
    >
    > - Use the `os` and `pathlib` modules for file traversal — no subprocess
    >   calls to bash
    > - Handle both failure cases explicitly: log a clear message and exit
    >   with a non-zero status if `./logs/` is missing; skip and warn on any
    >   unreadable individual file
    > - Add type hints on all functions
    > - Keep the output format identical: same lines, same order, same file name
    > - Include a `if __name__ == "__main__":` entry point

    **Why this earns the marks:** role ✓, context ✓ (including the *specific*
    failure modes — that's the reasoning), task ✓, and five *checkable*
    constraints ✓. The grader's rubric for this question is literally looking
    for constraints — the professor said so: *"A successful answer must provide
    constraints."*

### Constraints are where the marks live

The difference between a 2/4 and a 4/4 on these questions is almost always
**specificity of constraints**. Compare:

| Weak prompt | Strong prompt |
|---|---|
| "Use the os module" | "Use `os.scandir()` for traversal — no `subprocess` calls to bash" |
| "add error handling" | "raise a clear error and exit non-zero if the directory is missing; skip and warn on unreadable files" |
| "make it testable" | "pure functions for parsing, I/O only in `main()`, so parsing can be unit-tested" |

Each strong version states **what to do, how, and what happens in the failure
case** — three things a grader can tick.

## The template, condensed

```text
[CONCLUSION or ROOT CAUSE — one bold line]

- **Reason 1:** <mechanism, not just claim>
- **Reason 2:** <the thing the question explicitly asked about>
- **Reason 3:** <the trade-off or edge case>

*Assumption:* <what you're taking as given>

--- for agent prompts, replace the reasons with: ---

[ROLE + CONTEXT — 2-3 lines]

[TASK — one concrete sentence]

Constraints:
- <specific, checkable rules — 3 to 5 of them>
- <include failure-case behaviour>
```

## Common mistakes that cost marks

- 🔴 **The wall of text.** 200 words in one paragraph. Your points exist, but
  the grader can't find them. Bullets. Always bullets.
- 🔴 **Answering a different question.** The prompt asked for *payload limits
  and REST architecture* — if your answer never says "payload" or "URL length,"
  you're losing marks regardless of quality. Re-read the question for its
  **nouns** and make sure each one appears in your answer.
- 🔴 **Vague adjectives instead of mechanisms.** "More secure," "faster,"
  "better design" — each one is a missed bullet. *Why* is it more secure?
  Name the mechanism: input exposure in logs, URL length caps, cache leakage.
- 🔴 **No failure-case thinking.** The professor's recurring theme: what
  happens when input is empty, the file is missing, the API times out? An
  answer that covers the happy path only reads as junior.
- 🔴 **Spending words on restating the question.** "This is a very interesting
  question about REST APIs..." — the grader is ticking boxes, not being
  entertained. Open with your conclusion.
- 🔴 **"Write this in Python" prompts.** For agent-prompt questions, the
  vagueness is the failure. Constraints, constraints, constraints.

## Practice this, don't just read it

Reading the method is not owning it. Write answers under a timer:

- [Mock-1](../mock/mock-1.md) and [Mock-2](../mock/mock-2.md) — full papers:
  Section 2 in each is 9 questions, 41 marks, ~5 minutes per answer, with
  self-scoring checklists
- [Short-answer practice](../practice/short-answers.md) — 24 questions with
  model answers and keyword checklists

## Why we're confident about this page

Four independent sources agree: the professor's ET-2 session (structure, bullets, keywords), the ET-3 session (the 50% split, the agent-prompt format, "constraints" as the rubric target), the TA's statement about P2 grading ("we give your answer and the rubric to an LLM"), and the marks pattern inside the Jan papers themselves. The method above is not invented — it's what the graders said they reward.

---

**Next:** [Practice it on Mock-1's Section 2 →](../mock/mock-1.md)
