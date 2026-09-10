// Focus mode: one button, hides both sidebars and the tabs, widens the page.
// Esc exits as well. The preference is remembered per browser.
(function () {
  var KEY = "etprep-focus";
  function apply(on) {
    document.body.classList.toggle("focus-mode", on);
    var b = document.getElementById("focus-toggle");
    if (b) b.textContent = on ? "✖" : "⛶"; // ✖ when on, ⛶ when off
    try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (e) {}
  }
  function boot() {
    var b = document.createElement("button");
    b.id = "focus-toggle";
    b.title = "Focus mode (hide sidebars) — Esc to exit";
    b.setAttribute("aria-label", "Toggle focus mode");
    b.addEventListener("click", function () {
      apply(!document.body.classList.contains("focus-mode"));
    });
    document.body.appendChild(b);
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    apply(saved === "1");
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("focus-mode")) apply(false);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
