/* ─────────────────────────────────────────────────────────────
   VineBond Theme Manager  (window.VineBondTheme)
   OS-preference only — no manual toggle.
   Reacts to prefers-color-scheme changes in real time.
   ───────────────────────────────────────────────────────────── */
window.VineBondTheme = (function () {
  function apply() {
    var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', apply);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }

  return { apply: apply };
})();
