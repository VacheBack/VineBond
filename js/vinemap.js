/**
 * VineBond — VineMap Orchestrator
 * ─────────────────────────────────────────────────────────────────────────────
 * Detects the user's platform, loads the appropriate map library (Google Maps
 * or Leaflet), and initialises the shared adapter with the chosen renderer.
 *
 * Script dependency order (loaded in vinemap.html):
 *   1. vinemap-data.js       — RHEINGAU_VINEYARDS dataset
 *   2. vinemap-config.js     — VB_MAP_CONFIG (placeholder key)
 *   3. vinemap-config.local.js — real API key override (gitignored, optional)
 *   4. vinemap-detect.js     — platform detection + dynamic loader
 *   5. vinemap-adapter.js    — shared filter/search/popup/label logic
 *   6. vinemap.js (this)     — orchestrator
 * ─────────────────────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  function renderFallbackNotice(target, failure) {
    if (!target || !failure || !failure.reason) return;

    var notice = document.createElement('div');
    notice.className = 'vm-map-fallback-notice';
    notice.style.cssText = [
      'margin: 0 0 12px 0',
      'padding: 10px 12px',
      'border-radius: 10px',
      'background: #fff7e6',
      'border: 1px solid #f2d39b',
      'color: #5a3f08',
      'font-size: 0.95rem',
      'line-height: 1.4'
    ].join(';');

    notice.textContent = 'Google Maps is unavailable (' + failure.reason + '). Showing the Leaflet fallback map. If you expect Google Maps, verify Billing, Maps JavaScript API enablement, and referrer restrictions for ' + window.location.origin + '/*.';

    target.parentNode.insertBefore(notice, target);
  }

  var container = document.getElementById('vinemap-container');
  if (!container) {
    console.error('[VineMap] #vinemap-container not found.');
    return;
  }

  VineMapDetect.loadMapLibrary(function (rendererName) {
    var renderer;
    var googleFailure = window.__VB_MAP_LAST_GOOGLE_FAILURE;

    if (rendererName === 'google' && window.VineMapGoogle) {
      renderer = window.VineMapGoogle;
    } else if (window.VineMapLeaflet) {
      renderer = window.VineMapLeaflet;
    } else {
      console.error('[VineMap] No map renderer available.');
      return;
    }

    if (rendererName === 'leaflet' && googleFailure && googleFailure.reason) {
      renderFallbackNotice(container, googleFailure);
    }

    VineMapAdapter.init(renderer, container);

    // Log which renderer is active
    console.info('[VineMap] Renderer: ' + rendererName);
  });
});
