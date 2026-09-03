# Grade estimator

<div class="tx-meta" markdown>

Use this **before** ET marks are released · "how much do I need in the ET?" · runs in your browser

</div>

Enter your marks, press the button. GAA is your **best-7-of-9 average** (GA0 counts), out of 100.

<div class="tx-calc" id="tx-estimator">

<div class="tx-calc-grid">

<div class="tx-calc-field">

<span>GAA <small>/100</small></span>
<input id="tx-in-gaa" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="e.g. 71.43">

</div>

<div class="tx-calc-field">

<span>P1 <small>/100</small></span>
<input id="tx-in-p1" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="e.g. 80">

</div>

<div class="tx-calc-field">

<span>ROE <small>/100</small></span>
<input id="tx-in-roe" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="e.g. 65">

</div>

<div class="tx-calc-field">

<span>P2 <small>/100</small></span>
<input id="tx-in-p2" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="e.g. 90">

</div>

<div class="tx-calc-field">

<span>Bonus <small>0–5</small></span>
<input id="tx-in-bonus" type="number" min="0" max="5" step="any" inputmode="decimal" placeholder="0 if none">

</div>

</div>

<button class="tx-calc-go" id="tx-est-go" type="button">How much do I need?</button>

<div class="tx-calc-warn" id="tx-est-warn" hidden></div>

<p class="tx-calc-stale" id="tx-est-stale" hidden>Inputs changed — press the button to update.</p>

<div class="tx-calc-out" id="tx-est-out" hidden>

<div class="tx-calc-summary" id="tx-est-summary"></div>

<div id="tx-est-table"></div>

</div>

</div>

??? note "Reading the table"
    - 🟢 **Already secured** — even a 0 in ET keeps you at that grade or better.
    - 🟡 **Achievable** — you need the ET score shown in that row.
    - 🔴 **Out of reach** — even a perfect 100 in ET can't get you there.
    - A box left empty counts as **0**, so fill in everything you know — the
      warning tells you which boxes were treated as 0.
    - **Enter** works too — no need to reach for the button.

??? info "How the numbers are computed"
    The formula is `T = 0.20×(GAA + P1 + ROE + P2 + ET) + Bonus`. For each grade
    boundary G, the estimator solves for the ET that makes T reach G. Because T
    is **rounded off** before grading, the calculation uses G − 0.5 — the
    half-mark round-off grace is already included, so the numbers are the true
    minimum.

    GAA is the average of your **best 7 GAs out of 9** (GA0 included) — compute
    it yourself and enter it out of 100. If a component's marks aren't out yet,
    enter your best estimate.

[After the ET marks are released, switch to the grade calculator →](calculator.md)
