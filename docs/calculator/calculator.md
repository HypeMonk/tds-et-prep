# Grade calculator

<div class="tx-meta" markdown>

Use this **after ET marks are released** (but before grades are) · "what's my final grade?" · runs in your browser

</div>

Enter all five marks plus your bonus, press the button. GAA is your **best-7-of-9 average** (GA0 counts), out of 100.

<div class="tx-calc" id="tx-grader">

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

<span>ET <small>/100</small></span>
<input id="tx-in-et" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="e.g. 77.5">

</div>

<div class="tx-calc-field">

<span>Bonus <small>0–5</small></span>
<input id="tx-in-bonus" type="number" min="0" max="5" step="any" inputmode="decimal" placeholder="0 if none">

</div>

</div>

<p class="tx-calc-note">GAA is the average of your <strong>best 7 GAs out of 9</strong> (GA0 counts), out of 100. Every score can be a decimal. A box left empty counts as 0. <em>ET-3 update: bonus is 99% not happening this term — leave it at 0 unless that changes.</em></p>

<button class="tx-calc-go" id="tx-grad-go" type="button">Calculate my grade</button>

<div class="tx-calc-warn" id="tx-grad-warn" hidden></div>

<p class="tx-calc-stale" id="tx-grad-stale" hidden>Inputs changed — press the button to update.</p>

<div class="tx-calc-out" id="tx-grad-out" hidden>

<div class="tx-grade-banner" id="tx-grad-banner"></div>

<div id="tx-grad-table"></div>

<p id="tx-grad-next"></p>

</div>

</div>

??? note "Exactly what happens to your numbers"
    - Each component is weighted at **20%**: contribution = `score × 0.20`.
    - **Bonus** (0–5) is added flat, after the weights — so it can lift you
      across a grade boundary.
    - T is **rounded off** (normal rounding) before the grade is read:
      79.5 → 80 → A.
    - The breakdown table shows the exact unrounded T too, so you can see how
      the rounding landed.
    - A box left empty counts as **0** — the warning tells you which ones were.

!!! warning "Marks ≠ grade, officially"
    This computes the announced formula faithfully, but the grade on your
    transcript comes from the course team's official process. Treat this as a
    very good estimate, not a promise — especially near a boundary.

[ET marks not out yet? Use the estimator instead →](estimator.md)
