/**
 * VineBond — Rheingau Region Boundary Data
 * ─────────────────────────────────────────────────────────────────────────────
 * Polygon coordinates for the Rheingau-Taunus-Kreis boundary (NUTS-3: DE71D).
 * Used to draw a visible border, mask areas outside the region, and restrict
 * map panning to the Rheingau wine region.
 * ─────────────────────────────────────────────────────────────────────────────
 */

window.VB_RHEINGAU_BOUNDARY = [
  { lat: 50.20101, lng: 8.35389 },
  { lat: 50.14589, lng: 8.32765 },
  { lat: 50.10829, lng: 8.14074 },
  { lat: 50.08421, lng: 8.12925 },
  { lat: 50.03426, lng: 8.17514 },
  { lat: 49.97491, lng: 7.90815 },
  { lat: 50.04735, lng: 7.78659 },
  { lat: 50.06654, lng: 7.77400 },
  { lat: 50.12672, lng: 7.91809 },
  { lat: 50.18002, lng: 7.89455 },
  { lat: 50.20041, lng: 7.91236 },
  { lat: 50.22247, lng: 8.02773 },
  { lat: 50.26057, lng: 8.03783 },
  { lat: 50.27723, lng: 8.12191 },
  { lat: 50.26921, lng: 8.27850 },
  { lat: 50.29423, lng: 8.35456 },
  { lat: 50.24949, lng: 8.40617 },
  { lat: 50.20101, lng: 8.35389 }
];

window.VB_BOUNDARY_CONFIG = {
  lightMaskColor: '#FFFFFF',
  darkMaskColor:  '#0E1917',
  maskOpacity:    0.92,
  borderColor:    '#5C2632',
  borderWeight:   2,
  borderOpacity:  0.7
};
