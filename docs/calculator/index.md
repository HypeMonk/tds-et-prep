# Calculator

<div class="tx-meta" markdown>

Two tools, one formula · pick by what you already know · runs entirely in your browser

</div>

## Which one do you need?

<div class="grid cards" markdown>

- 🎯 **[Grade estimator](estimator.md)**

    **ET marks not out yet.** You know your GAA, P1, ROE, P2 — find out how much
    you need in the ET to pass, and to reach every grade.

- 🧮 **[Grade calculator](calculator.md)**

    **ET marks are out, grade isn't.** Enter all five scores plus bonus and see
    your final score T, your grade, and how close you were to the next one.

</div>

!!! info "This is NOT the official grading"
    This page models the grading scheme the course team announced for T2-2026.
    It is our best, careful reading of that announcement — the course team's
    calculation is the only one that counts. If anything differs, trust them.

## The formula both tools use

```
T = 0.20×GAA + 0.20×P1 + 0.20×ROE + 0.20×P2 + 0.20×ET + Bonus
```

Every component is scored out of 100 first, then weighted:

| Component | What it is | Weight |
|---|---|---|
| **GAA** | Grading-assignments average — average of your **best 7 GAs out of 9** (GA0 counts) | 20% |
| **P1** | Project 1 | 20% |
| **ROE** | Remote Online Exam | 20% |
| **P2** | Project 2 | 20% |
| **ET** | End-term exam | 20% |
| **Bonus** | Flat bonus, up to **5 marks**, added *after* the weights | +0–5 |

!!! info "Bonus this term: 99% not happening"
    In the final revision session (ET-3), the course team said they found no
    major unresolvable issues in the assessments, so bonus marks are *"99%"*
    off the table this term. The field stays because it's part of the formula
    — but enter `0` unless something changes.

So T can reach **105** (100 from the five components + 5 bonus) — that's expected, though with no bonus this term the realistic cap is 100.

## The grade scale

T is rounded off (normal rounding) first, then the grade is read from the table:

| Final score T | Grade | GPA |
|---|---|---|
| 90 and above | **S** | 10 |
| 80 – 89 | **A** | 9 |
| 70 – 79 | **B** | 8 |
| 60 – 69 | **C** | 7 |
| 50 – 59 | **D** | 6 |
| 40 – 49 | **E** | 4 |
| below 40 | **U** (fail) | 0 |

!!! tip "Two details the tools handle for you"
    - **Round-off grace:** since T is rounded before grading, 39.5 becomes 40
      and passes. The estimator's "ET needed" numbers already include this
      half-mark grace.
    - **Bonus lifts you across boundaries:** bonus is added to T *before*
      grading, so it can take you from B to A. Both tools count it that way.
