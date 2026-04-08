/**
 * VineBond — VineMap Orchestrator
 * ─────────────────────────────────────────────────────────────────────────────
 * Script dependency order (loaded in vinemap.html):
 *   1. vinemap-data.js         — RHEINGAU_VINEYARDS dataset
 *   2. vinemap-config.js       — VB_MAP_CONFIG (placeholder keys)
 *   3. vinemap-config.local.js — real API / token overrides (gitignored)
 *   4. vinemap-detect.js       — platform detection + dynamic loader
 *   5. vinemap-adapter.js      — shared filter / search / popup / label logic
 *   6. vinemap.js (this)       — orchestrator
 *
 * Renderers are loaded dynamically by vinemap-detect.js:
 *   • Google  → js/vinemap-google.js (Android, Windows, Linux)
 *   • Apple   → js/vinemap-apple.js  (iPhone, iPad, Mac)
 * ─────────────────────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var container = document.getElementById('vinemap-container');
  if (!container) {
    console.error('[VineMap] #vinemap-container not found.');
    return;
  }

  VineMapDetect.loadMapLibrary(function (rendererName) {
    var renderer = null;

    if (rendererName === 'google' && window.VineMapGoogle) {
      renderer = window.VineMapGoogle;
    } else if (rendererName === 'apple' && window.VineMapApple) {
      renderer = window.VineMapApple;
    } else {
      // 'error' or renderer script failed to expose the expected global
      VineMapDetect.showMapError(
        container,
        rendererName === 'apple'
          ? 'Apple Maps could not be loaded. Please check your MapKit JS token.'
          : 'Map could not be loaded. Please check your API key.'
      );
      return;
    }

    VineMapAdapter.init(renderer, container);
    console.info('[VineMap] Renderer: ' + rendererName);
  });
});
