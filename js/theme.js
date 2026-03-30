/* ─────────────────────────────────────────────────────────────
   VineBond Theme Manager  (window.VineBondTheme)
   Tri-state: 'light' | 'dark' | 'system'
   Persists to localStorage key 'vb_theme'
   Syncs across tabs via storage event
   ───────────────────────────────────────────────────────────── */
window.VineBondTheme = (function () {
  var KEY = 'vb_theme';

  /* Resolve 'system' to actual 'light' or 'dark' */
  function resolve(pref) {
    if (pref === 'dark')  return 'dark';
    if (pref === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /* Apply resolved theme to <html> element */
  function apply(pref) {
    var actual = resolve(pref || 'system');
    document.documentElement.setAttribute('data-theme', actual);
    document.documentElement.setAttribute('data-theme-pref', pref || 'system');
    updateButton(pref || 'system');
  }

  /* Update toggle button icon/label */
  function updateButton(pref) {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    var sunIcon  = btn.querySelector('.theme-icon-sun');
    var moonIcon = btn.querySelector('.theme-icon-moon');
    var autoIcon = btn.querySelector('.theme-icon-auto');

    if (sunIcon)  sunIcon.style.display  = pref === 'dark'   ? 'block' : 'none';
    if (moonIcon) moonIcon.style.display = pref === 'light'  ? 'block' : 'none';
    if (autoIcon) autoIcon.style.display = pref === 'system' ? 'block' : 'none';

    var labels = { light: 'Switch to dark mode', dark: 'Switch to system theme', system: 'Switch to light mode' };
    btn.setAttribute('aria-label', labels[pref] || 'Toggle theme');
  }

  /* Cycle: system → dark → light → system */
  function cycle() {
    var cur  = localStorage.getItem(KEY) || 'system';
    var next = cur === 'system' ? 'dark' : cur === 'dark' ? 'light' : 'system';
    localStorage.setItem(KEY, next);
    apply(next);
  }

  /* Multi-tab sync */
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) apply(e.newValue || 'system');
  });

  /* OS preference change (only matters when pref is 'system') */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if ((localStorage.getItem(KEY) || 'system') === 'system') apply('system');
  });

  /* Wire up button click once DOM is ready */
  function init() {
    var btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', cycle);
    apply(localStorage.getItem(KEY) || 'system');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { cycle: cycle, apply: apply };
})();
