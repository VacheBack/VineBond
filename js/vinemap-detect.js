/**
 * VineBond — Map Library Loader
 * ─────────────────────────────────────────────────────────────────────────────
 * Loads Google Maps JavaScript API on all platforms (Android, iOS, Windows,
 * Linux, Mac). Shows an inline error if the API key is missing or the script
 * fails to load.
 *
 * Override for testing:
 *   localStorage.setItem('vb_map_provider', 'google')
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  var config = window.VB_MAP_CONFIG || {};

  /* ── Script injection helper ───────────────────────────────────────────── */

  function injectScript(src, onload, onerror) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    if (onload)  s.onload  = onload;
    if (onerror) s.onerror = onerror;
    document.head.appendChild(s);
  }

  /* ── Google Maps loader ────────────────────────────────────────────────── */

  function _loadGoogleMaps(done) {
    var key = config.googleApiKey || '';
    if (!key || key === 'YOUR_GOOGLE_MAPS_API_KEY') {
      console.warn('[VineMap] No valid Google Maps API key.');
      done(false);
      return;
    }

    var timedOut = false;
    var timer = setTimeout(function () {
      timedOut = true;
      done(false);
    }, config.fallbackTimeoutMs || 8000);

    window.__vbGoogleMapsReady = function () {
      if (timedOut) return;
      clearTimeout(timer);
      done(true);
    };

    var src = 'https://maps.googleapis.com/maps/api/js'
      + '?key='       + encodeURIComponent(key)
      + '&libraries=marker'
      + '&callback=__vbGoogleMapsReady'
      + '&loading=async'
      + '&v=weekly';

    injectScript(src, null, function () {
      if (timedOut) return;
      clearTimeout(timer);
      done(false);
    });
  }

  /* ── Error display ─────────────────────────────────────────────────────── */

  function showMapError(containerEl, message) {
    if (!containerEl) return;
    containerEl.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;'
      + 'height:100%;gap:12px;color:#5C2632;font-family:\'Segoe UI\',sans-serif;padding:32px;text-align:center;">'
      + '<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">'
      + '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'
      + '</svg>'
      + '<p style="margin:0;font-size:0.95rem;font-weight:600;">' + message + '</p>'
      + '</div>';
  }

  /**
   * Load Google Maps, then invoke callback('google' | 'error').
   */
  function loadMapLibrary(callback) {
    _loadGoogleMaps(function (ok) {
      if (ok) {
        injectScript('js/vinemap-google.js', function () {
          callback('google');
        });
      } else {
        console.error('[VineMap] Google Maps failed to load.');
        callback('error');
      }
    });
  }

  /* ── Public API ────────────────────────────────────────────────────────── */

  window.VineMapDetect = {
    loadMapLibrary: loadMapLibrary,
    showMapError:   showMapError
  };

})();
