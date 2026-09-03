// Grade estimator + grade calculator for the TDS T2-2026 final score.
//
// Formula (course team):
//   T = 0.20*GAA + 0.20*P1 + 0.20*ROE + 0.20*P2 + 0.20*ET + Bonus
// All five components are out of 100 (GAA = average of best 7 of the 9 GAs,
// including GA0 — computed by the student, entered directly). Bonus is 0-5
// and is added AFTER the weights.
//
// Grading: T is rounded (normal half-up) first, then
//   T < 40 = U (fail) | 40-49 E | 50-59 D | 60-69 C | 70-79 B | 80-89 A | >=90 S.
//
// The estimator inverts the formula: because round(T) >= G iff T >= G - 0.5,
// the ET needed for grade boundary G is
//   ET >= (G - 0.5 - Bonus - 0.2*(GAA+P1+ROE+P2)) / 0.2
// — the 0.5 round-off grace is accounted for.
//
// Nothing is computed live: results appear only when the user presses the
// button (or Enter). Boots itself on whichever page it finds
// (#tx-estimator / #tx-grader).
(function () {
  "use strict";

  var GRADES = [
    { key: "S", gpa: 10, min: 90 },
    { key: "A", gpa: 9, min: 80 },
    { key: "B", gpa: 8, min: 70 },
    { key: "C", gpa: 7, min: 60 },
    { key: "D", gpa: 6, min: 50 },
    { key: "E", gpa: 4, min: 40 },
    { key: "U", gpa: 0, min: 0 }
  ];

  var FIELDS = [
    { id: "tx-in-gaa", name: "GAA" },
    { id: "tx-in-p1", name: "P1" },
    { id: "tx-in-roe", name: "ROE" },
    { id: "tx-in-p2", name: "P2" },
    { id: "tx-in-et", name: "ET" }
  ];

  function gradeOf(t) {
    for (var i = 0; i < GRADES.length; i++) if (t >= GRADES[i].min) return GRADES[i];
    return GRADES[GRADES.length - 1];
  }

  function fmt(x) {
    // two decimals, trailing zeros trimmed, no "-0"
    var r = Math.round(x * 100) / 100;
    if (r === 0) r = 0; // normalizes -0
    return String(r);
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  // Reads the input boxes. Empty = 0 (remembered so we can warn about it),
  // anything non-numeric or out of range is flagged and blocks the result.
  // Returns { gaa, p1, roe, p2, et, bonus, blank: [...], bad: [...] }.
  function readInputs(withET) {
    var vals = { blank: [], bad: [], bonus: 0 };
    FIELDS.forEach(function (f) {
      if (f.id === "tx-in-et" && !withET) return;
      var el = document.getElementById(f.id);
      if (!el) return;
      var t = el.value.trim();
      if (t === "") {
        vals[f.name.toLowerCase()] = 0;
        vals.blank.push(f.name);
        el.classList.remove("tx-bad");
        return;
      }
      var v = parseFloat(t);
      if (isNaN(v) || v < 0 || v > 100) {
        vals.bad.push(f.name + " (0–100)");
        vals[f.name.toLowerCase()] = 0;
        el.classList.add("tx-bad");
        return;
      }
      el.classList.remove("tx-bad");
      vals[f.name.toLowerCase()] = v;
    });
    var b = document.getElementById("tx-in-bonus");
    if (b) {
      var bt = b.value.trim();
      if (bt !== "") {
        var bv = parseFloat(bt);
        if (isNaN(bv) || bv < 0 || bv > 5) {
          vals.bad.push("Bonus (0–5)");
          b.classList.add("tx-bad");
        } else {
          vals.bonus = bv;
          b.classList.remove("tx-bad");
        }
      } else {
        b.classList.remove("tx-bad");
      }
    }
    return vals;
  }

  // Smallest exact ET (out of 100) that secures round(T) >= target.
  function requiredET(target, v) {
    return (target - 0.5 - v.bonus - 0.2 * (v.gaa + v.p1 + v.roe + v.p2)) / 0.2;
  }

  function chip(kind, text) {
    return '<span class="tx-chip tx-' + kind + '">' + esc(text) + "</span>";
  }

  function showWarn(el, msg) {
    if (msg) {
      el.textContent = msg;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  }

  // Wires a calculator: button + Enter submit; typing only flags invalid
  // boxes and marks an existing result as stale.
  function wireSubmit(root, btnId, staleEl, out, render) {
    var btn = document.getElementById(btnId);
    if (btn) btn.addEventListener("click", render);
    root.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target && e.target.tagName === "INPUT") {
        e.preventDefault();
        render();
      }
    });
    root.addEventListener("input", function () {
      readInputs(root.id === "tx-grader"); // live red-flagging only
      if (!out.hidden && staleEl) {
        staleEl.hidden = false;
      }
    });
  }

  // ------------------------------------------------------------------
  // Estimator — before ET marks are out.
  // ------------------------------------------------------------------
  function initEstimator(root) {
    var out = document.getElementById("tx-est-out");
    var warn = document.getElementById("tx-est-warn");
    var stale = document.getElementById("tx-est-stale");
    var summary = document.getElementById("tx-est-summary");
    var table = document.getElementById("tx-est-table");

    function render() {
      if (stale) stale.hidden = true;
      var v = readInputs(false);
      if (v.bad.length) {
        out.hidden = true;
        showWarn(warn, "Fix the highlighted boxes: " + v.bad.join(", ") + ".");
        return;
      }
      showWarn(warn, v.blank.length
        ? "Assuming 0 for: " + v.blank.join(", ") + " — fill in everything you know."
        : "");
      out.hidden = false;

      var base = 0.2 * (v.gaa + v.p1 + v.roe + v.p2); // T without ET and bonus

      // Summary: pass line + ceiling.
      var reqPass = requiredET(40, v);
      var best = gradeOf(Math.round(base + 20 + v.bonus));
      var lines = [];
      if (reqPass <= 0) {
        lines.push("✅ <strong>You have already passed</strong> — even 0 in ET keeps you at E or better.");
      } else if (reqPass <= 100) {
        lines.push("🎯 You need at least <strong>" + fmt(reqPass) +
          " in ET</strong> (out of 100) to pass.");
      } else {
        lines.push("⚠️ <strong>Even 100 in ET cannot reach 40</strong> — the U cannot be avoided through ET alone.");
      }
      if (best.min >= 90) {
        lines.push("🚀 A perfect ET (100) can still take you to an <strong>S</strong>.");
      } else {
        lines.push("🚀 Best possible grade: <strong>" + best.key + "</strong> (a perfect ET gives T ≈ " +
          fmt(Math.round(base + 20 + v.bonus)) + ").");
      }
      summary.innerHTML = lines.join("<br>");

      // Full grade table, colour-coded by verdict.
      var rows = [];
      GRADES.forEach(function (g) {
        if (g.min === 0) {
          rows.push('<tr class="tx-row-no"><td><strong>U</strong></td><td>—</td><td class="tx-num">—</td><td>' +
            chip("no", "fail — total below 40") + "</td></tr>");
          return;
        }
        var req = requiredET(g.min, v);
        var cell, verdict, cls;
        if (req <= 0) {
          cell = "any";
          verdict = chip("ok", "already secured");
          cls = "tx-row-ok";
        } else if (req <= 100) {
          cell = fmt(req);
          verdict = chip("mid", "achievable");
          cls = "tx-row-mid";
        } else {
          cell = fmt(req);
          verdict = chip("no", "out of reach");
          cls = "tx-row-no";
        }
        rows.push('<tr class="' + cls + '"><td><strong>' + g.key + "</strong></td><td>" + g.gpa +
          '</td><td class="tx-num">' + cell + "</td><td>" + verdict + "</td></tr>");
      });
      table.innerHTML = "<table><thead><tr><th>Grade</th><th>GPA</th><th>ET needed (/100)</th><th>Verdict</th></tr></thead><tbody>" +
        rows.join("") + "</tbody></table>";
    }

    wireSubmit(root, "tx-est-go", stale, out, render);
  }

  // ------------------------------------------------------------------
  // Grade calculator — ET marks out, grade not yet out.
  // ------------------------------------------------------------------
  function initGrader(root) {
    var out = document.getElementById("tx-grad-out");
    var warn = document.getElementById("tx-grad-warn");
    var stale = document.getElementById("tx-grad-stale");
    var banner = document.getElementById("tx-grad-banner");
    var table = document.getElementById("tx-grad-table");
    var next = document.getElementById("tx-grad-next");

    function render() {
      if (stale) stale.hidden = true;
      var v = readInputs(true);
      if (v.bad.length) {
        out.hidden = true;
        showWarn(warn, "Fix the highlighted boxes: " + v.bad.join(", ") + ".");
        return;
      }
      if (v.blank.indexOf("ET") !== -1) {
        out.hidden = true;
        showWarn(warn, "Enter your ET score first — the calculator needs it.");
        return;
      }
      showWarn(warn, v.blank.length
        ? "Assuming 0 for: " + v.blank.join(", ") + " — fill in everything you know."
        : "");
      out.hidden = false;

      var parts = [
        { name: "GAA", score: v.gaa },
        { name: "P1", score: v.p1 },
        { name: "ROE", score: v.roe },
        { name: "P2", score: v.p2 },
        { name: "ET", score: v.et }
      ];
      var texact = v.bonus;
      var rows = parts.map(function (p) {
        var c = 0.2 * p.score;
        texact += c;
        return "<tr><td>" + p.name + '</td><td class="tx-num">' + fmt(p.score) +
          "</td><td>20%</td><td class=\"tx-num\">" + fmt(c) + "</td></tr>";
      });
      rows.push('<tr><td>Bonus</td><td class="tx-num">' + fmt(v.bonus) +
        '</td><td>flat</td><td class="tx-num">' + fmt(v.bonus) + "</td></tr>");

      var t = Math.round(texact);
      var g = gradeOf(t);

      banner.className = "tx-grade-banner" + (g.min === 0 ? " tx-fail" : "");
      banner.innerHTML = '<div class="tx-grade-letter">' + g.key + '</div><div><strong>' +
        (g.min === 0 ? "U — fail" : "Grade " + g.key) + "</strong> · GPA " + g.gpa +
        "<br>Final score <strong>" + t + "</strong> / 100 <small>(exact " + fmt(texact) +
        ", rounded)</small></div>";

      rows.push('<tr class="tx-row-total"><td><strong>T — final score</strong></td><td class="tx-num"></td><td></td><td class="tx-num"><strong>' +
        fmt(texact) + " → " + t + "</strong></td></tr>");
      table.innerHTML = "<table><thead><tr><th>Component</th><th>Score (/100)</th><th>Weight</th><th>Contribution</th></tr></thead><tbody>" +
        rows.join("") + "</tbody></table>";

      if (g.key === "S") {
        next.textContent = "🏆 S is the top grade — nothing above it.";
      } else {
        var idx = GRADES.indexOf(g);
        var upper = GRADES[idx - 1];
        var need = upper.min - 0.5 - texact;
        next.innerHTML = "You were <strong>" + fmt(need) + " marks</strong> short of grade " + upper.key +
          " (" + fmt(texact) + " exact vs " + fmt(upper.min - 0.5) + " needed before round-off).";
      }
    }

    wireSubmit(root, "tx-grad-go", stale, out, render);
  }

  function boot() {
    var est = document.getElementById("tx-estimator");
    var grd = document.getElementById("tx-grader");
    if (est) initEstimator(est);
    if (grd) initGrader(grd);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
