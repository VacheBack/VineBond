/* VineBond global UI enhancements: back-to-top and small UX helpers */
(() => {
  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  onReady(() => {
    const backToTop = document.querySelector('[data-back-to-top]');
    const siteHeader = document.getElementById('siteHeader');

    const syncScrollUI = () => {
      if (backToTop) {
        backToTop.classList.toggle('show', window.scrollY > 420);
        backToTop.setAttribute('aria-hidden', window.scrollY > 420 ? 'false' : 'true');
      }

      if (siteHeader) {
        siteHeader.classList.toggle('scrolled', window.scrollY > 40);
      }
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          syncScrollUI();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', syncScrollUI, { passive: true });

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    function _closeNavSheet() {
      const sheet = document.getElementById('navSheet');
      if (!sheet || !sheet.classList.contains('open')) return;
      sheet.classList.remove('open');
      const backdrop = document.getElementById('navBackdrop');
      if (backdrop) backdrop.classList.remove('visible');
      const trigger = document.getElementById('navMobileTrigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    const sheetClose = document.getElementById('navSheetClose');
    if (sheetClose) sheetClose.addEventListener('click', _closeNavSheet);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') _closeNavSheet();
    });

    syncScrollUI();
  });
})();

/* Orientation change — preserve scroll position across reflows */
(() => {
  let savedScrollY = 0;
  const evt = 'onorientationchange' in window ? 'orientationchange' : 'resize';
  let orientationTimer = null;

  window.addEventListener(evt, () => {
    savedScrollY = window.scrollY || window.pageYOffset;
    clearTimeout(orientationTimer);
    orientationTimer = setTimeout(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.scrollTo(0, savedScrollY);
        });
      });
    }, 100);
  }, { passive: true });
})();

/* Winery search */
(() => {
  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  };
  onReady(() => {
    const input = document.getElementById('winerySearch');
    if (!input) return;
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = `winery.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    });
    if (window.location.pathname.includes('winery')) {
      input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        document.querySelectorAll('.winery-card').forEach(card => {
          const name = (card.dataset.name || '').toLowerCase();
          const region = (card.dataset.region || '').toLowerCase();
          card.style.display = (!q || name.includes(q) || region.includes(q)) ? '' : 'none';
        });
      });
    }
  });
})();

/* ── Featured Estates Carousel (index.html) ─────────────────── */
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('estatesTrack');
    if (!track || !window.VineBondWineries) return;
    const wineries = window.VineBondWineries.getAll().slice(0, 6);
    track.innerHTML = wineries.map(w => {
      const badgeClass = w.badgeClass || '';
      const badgeLabel = w.badgeLabel || w.type || '';
      const headerBg = w.headerGradient || 'linear-gradient(135deg,#5C2632,#4A1F2A)';
      const emoji = w.emoji || '\uD83C\uDF77';
      const name = w.name || '';
      const region = w.regionLabel || w.region || '';
      return '<div class="estate-card">' +
        '<div class="estate-card-header" style="background:' + headerBg + '">' + emoji + '</div>' +
        '<div class="estate-card-body">' +
        '<p class="estate-card-name">' + name + '</p>' +
        '<p class="estate-card-region">' + region + '</p>' +
        '<span class="estate-card-badge ' + badgeClass + '">' + badgeLabel + '</span>' +
        '</div></div>';
    }).join('');
    const viewport = document.getElementById('estatesViewport');
    const cardW = 246;
    document.getElementById('estatesNext') && document.getElementById('estatesNext').addEventListener('click', function() {
      viewport.scrollBy({ left: cardW * 2, behavior: 'smooth' });
    });
    document.getElementById('estatesPrev') && document.getElementById('estatesPrev').addEventListener('click', function() {
      viewport.scrollBy({ left: -cardW * 2, behavior: 'smooth' });
    });
  });
})();

/* ── Filter Sidebar + Sort (winery.html) ────────────────────── */
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    var sidebar = document.getElementById('filterSidebar');
    if (!sidebar) return;
    var checkboxes = sidebar.querySelectorAll('.sidebar-filter-cb');
    var priceSlider = document.getElementById('priceSlider');
    var priceVal = document.getElementById('priceVal');
    var clearBtn = document.getElementById('sidebarClear');
    var countEl = document.getElementById('resultsCount');

    function applyFilters() {
      var types = Array.prototype.slice.call(sidebar.querySelectorAll('[data-filter-type="type"]:checked')).map(function(c) { return c.value; });
      var regions = Array.prototype.slice.call(sidebar.querySelectorAll('[data-filter-type="region"]:checked')).map(function(c) { return c.value; });
      var n = 0;
      document.querySelectorAll('.winery-card').forEach(function(card) {
        var ok = (!types.length || types.indexOf(card.dataset.type) > -1) &&
                 (!regions.length || regions.indexOf(card.dataset.region) > -1);
        card.style.display = ok ? '' : 'none';
        if (ok) n++;
      });
      if (countEl) countEl.textContent = n;
    }

    checkboxes.forEach(function(cb) { cb.addEventListener('change', applyFilters); });

    if (priceSlider) {
      priceSlider.addEventListener('input', function() {
        if (priceVal) priceVal.textContent = '\u20AC' + priceSlider.value;
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        checkboxes.forEach(function(cb) { cb.checked = false; });
        if (priceSlider) { priceSlider.value = 300; if (priceVal) priceVal.textContent = '\u20AC300'; }
        document.querySelectorAll('.winery-card').forEach(function(c) { c.style.display = ''; });
        if (countEl) countEl.textContent = document.querySelectorAll('.winery-card').length;
        document.querySelectorAll('.filter-chip').forEach(function(b) {
          b.classList.toggle('active', b.dataset.filter === 'all');
        });
        var rs = document.getElementById('regionSelect');
        if (rs) rs.value = 'all';
      });
    }

    var sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        var grid = document.getElementById('wineryGrid');
        if (!grid) return;
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.winery-card'));
        var v = sortSelect.value;
        cards.sort(function(a, b) {
          if (v === 'az') return (a.dataset.name || '').localeCompare(b.dataset.name || '');
          if (v === 'region') return (a.dataset.region || '').localeCompare(b.dataset.region || '');
          return 0;
        });
        cards.forEach(function(c) { grid.appendChild(c); });
      });
    }
  });
})();
