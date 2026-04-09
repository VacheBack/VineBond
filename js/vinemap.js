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
 * Renderer loaded dynamically by vinemap-detect.js:
 *   • Google Maps → js/vinemap-google.js (all platforms)
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
    if (rendererName !== 'google' || !window.VineMapGoogle) {
      VineMapDetect.showMapError(container, 'Map could not be loaded. Please check your API key.');
      return;
    }
    var renderer = window.VineMapGoogle;

    VineMapAdapter.init(renderer, container);
    console.info('[VineMap] Renderer: ' + rendererName);
  });
});
