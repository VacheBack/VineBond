/* VineBond global UI enhancements: page progress, back-to-top, and small UX helpers */
(() => {
  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  onReady(() => {
    const progressBar = document.querySelector('[data-page-progress] > span');
    const backToTop = document.querySelector('[data-back-to-top]');
    const topbar = document.getElementById('topbar');

    const syncScrollUI = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;

      if (progressBar) progressBar.style.width = `${pct}%`;

      if (backToTop) {
        backToTop.classList.toggle('show', window.scrollY > 420);
        backToTop.setAttribute('aria-hidden', window.scrollY > 420 ? 'false' : 'true');
      }

      if (topbar) {
        topbar.classList.toggle('scrolled', window.scrollY > 40);
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

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const bar = document.getElementById('topbar');
      if (bar && bar.classList.contains('menu-open')) {
        bar.classList.remove('menu-open');
      }
    });

    syncScrollUI();
  });
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
