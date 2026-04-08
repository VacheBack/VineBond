/**
 * VineBond — VineMap Orchestrator
 * ─────────────────────────────────────────────────────────────────────────────
 * Loads Google Maps and initialises the shared adapter.
 *
 * Script dependency order (loaded in vinemap.html):
 *   1. vinemap-data.js       — RHEINGAU_VINEYARDS dataset
 *   2. vinemap-config.js     — VB_MAP_CONFIG (placeholder key)
 *   3. vinemap-config.local.js — real API key override (gitignored, optional)
 *   4. vinemap-detect.js     — dynamic loader
 *   5. vinemap-adapter.js    — shared filter/search/popup/label logic
 *   6. vinemap.js (this)     — orchestrator
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
    if (rendererName === 'google' && window.VineMapGoogle) {
      VineMapAdapter.init(window.VineMapGoogle, container);
      console.info('[VineMap] Renderer: google');
    } else {
      console.error('[VineMap] No map renderer available.');
    }
  });
});
