/**
 * VineBond — VineMap Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared configuration for all map renderers.
 *
 * API KEY SETUP:
 *   1. Copy this key pattern into js/vinemap-config.local.js (gitignored):
 *        window.VB_MAP_CONFIG.googleApiKey = 'AIzaSy...your-real-key';
 *   2. The local file overrides this placeholder automatically.
 *   3. Restrict the key in Google Cloud Console: HTTP referrer + Maps JS API only.
 * ─────────────────────────────────────────────────────────────────────────────
 */

window.VB_MAP_CONFIG = {
  googleApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  mapCenter: { lat: 50.005, lng: 8.025 },
  defaultZoom: 12,
  markerZoom: 15,
  labelMinZoom: 13,
  fallbackTimeoutMs: 8000
};
