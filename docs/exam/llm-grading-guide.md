# How to write answers an LLM grades well

<span class="tx-meta">**~6 min read** · Worth more marks per minute than anything else on this site.</span>

Short-answer questions are new (first appeared Jan 2026), they're growing, and they are graded by **an LLM, not a human**. The professor said this explicitly in the ET-2 session — and told you what the grader rewards. This page turns that into a repeatable method.

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

### 5. Stay under the cap, spend it on points

200-word cap, live counter on screen. Aim for 120-170 words of dense, bulleted substance. Padding wastes your exam time and earns nothing.

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

!!! info "In the exam"
    The professor specifically flagged the client-scenario shape: *"What are the three
    most important follow-up questions you would ask based on these requirements?"* —
    testing whether you think about capabilities, constraints, and business context
    before building. Practice this shape in [Practice questions](../practice/index.md).

## Why we're confident about this page

Three independent sources agree: the professor's ET-2 session (structure, bullets, keywords), the TA's statement about P2 grading ("we give your answer and the rubric to an LLM"), and the marks pattern inside the Jan papers themselves. The method above is not invented — it's what the graders said they reward.

---

**Next:** [Pick your study plan →](../plan/index.md)
