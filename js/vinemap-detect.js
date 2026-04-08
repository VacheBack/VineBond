/**
 * VineBond — Platform Detection & Dynamic Map Library Loader
 * ─────────────────────────────────────────────────────────────────────────────
 * Detects user platform and loads the appropriate map library:
 *   • Google Maps  → Android, Windows, Linux, ChromeOS
 *   • Apple MapKit → iPhone, iPad, Mac (Safari / WebKit)
 *
 * Override via localStorage for testing:
 *   localStorage.setItem('vb_map_provider', 'google' | 'apple')
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  var config = window.VB_MAP_CONFIG || {};

  /**
   * Detect the target map platform.
   * Returns 'google' | 'apple'
   */
  function getPlatform() {
    // Allow localStorage override for testing
    var override = localStorage.getItem('vb_map_provider');
    if (override === 'google' || override === 'apple') return override;

    // navigator.userAgentData (Chromium 90+) — most reliable
    if (navigator.userAgentData && navigator.userAgentData.platform) {
      var p = navigator.userAgentData.platform.toLowerCase();
      if (p === 'macos' || p === 'ios') return 'apple';
      return 'google';
    }

    // Fallback: classic User-Agent string
    var ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua))    return 'apple';
    if (/Macintosh.*Mac OS X/i.test(ua)) return 'apple';
    return 'google';
  }

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
      + '&v=weekly';

    injectScript(src, null, function () {
      if (timedOut) return;
      clearTimeout(timer);
      done(false);
    });
  }

  /* ── Apple MapKit JS loader ────────────────────────────────────────────── */

  function _loadAppleMaps(done) {
    var token = config.appleToken || '';
    if (!token || token === 'YOUR_MAPKIT_JS_TOKEN') {
      console.warn('[VineMap] No valid Apple MapKit JS token.');
      done(false);
      return;
    }

    var timedOut = false;
    var timer = setTimeout(function () {
      timedOut = true;
      done(false);
    }, config.fallbackTimeoutMs || 8000);

    injectScript(
      'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js',
      function () {
        if (timedOut) return;
        clearTimeout(timer);

        // Initialise MapKit with the token before the renderer runs
        mapkit.init({
          authorizationCallback: function (authDone) {
            authDone(token);
          }
        });

        injectScript('js/vinemap-apple.js',
          function () { done(true);  },
          function () { done(false); }
        );
      },
      function () {
        if (timedOut) return;
        clearTimeout(timer);
        done(false);
      }
    );
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
   * Load the correct map library for the current platform, then invoke
   * callback(rendererName) where rendererName is 'google' | 'apple' | 'error'.
   */
  function loadMapLibrary(callback) {
    var platform = getPlatform();

    if (platform === 'google') {
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

    } else {
      // Apple platform
      _loadAppleMaps(function (ok) {
        if (ok) {
          callback('apple');
        } else {
          console.error('[VineMap] Apple MapKit JS failed to load.');
          callback('error');
        }
      });
    }
  }

  /* ── Public API ────────────────────────────────────────────────────────── */

  window.VineMapDetect = {
    getPlatform:    getPlatform,
    loadMapLibrary: loadMapLibrary,
    showMapError:   showMapError
  };

})();
