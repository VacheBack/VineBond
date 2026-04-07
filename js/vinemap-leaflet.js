/**
 * VineBond — Leaflet.js Map Renderer
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements the VineMapAdapter renderer interface using Leaflet.js 1.9.x.
 * Used as the default/fallback renderer and for Apple platforms (Phase 1).
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  var map       = null;
  var osmLayer  = null;
  var darkMode  = false;

  /* ── Icon Factory ────────────────────────────────────────────────────── */

  function makeIcon(bgColor, label) {
    return L.divIcon({
      className: '',
      html: '<div style="'
        + 'background:' + bgColor + ';'
        + 'width:42px;height:42px;'
        + 'border-radius:50% 50% 50% 0;'
        + 'transform:rotate(-45deg);'
        + 'border:3px solid rgba(255,255,255,0.9);'
        + 'box-shadow:0 4px 12px rgba(0,0,0,0.25);'
        + 'display:flex;align-items:center;justify-content:center;'
        + '">'
        + '<span style="'
        + 'transform:rotate(45deg);'
        + 'color:#fff;font-weight:800;font-size:10px;'
        + "font-family:'Segoe UI',sans-serif;"
        + 'letter-spacing:0.02em;white-space:nowrap;'
        + '">' + label + '</span>'
        + '</div>',
      iconSize:    [42, 42],
      iconAnchor:  [21, 51],
      popupAnchor: [0, -53]
    });
  }

  var ggIcon = makeIcon('#5C2632', 'GG');
  var fgIcon = makeIcon('#B8960F', '1G');

  /* ── Renderer Interface ──────────────────────────────────────────────── */

  var LeafletRenderer = {

    init: function (containerEl, opts) {
      map = L.map(containerEl, {
        center: [opts.center.lat, opts.center.lng],
        zoom:   opts.zoom,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: true
      });

      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);
    },

    addMarker: function (vineyard) {
      var icon   = vineyard.type === 'GG' ? ggIcon : fgIcon;
      var marker = L.marker([vineyard.lat, vineyard.lng], { icon: icon, title: vineyard.name });
      marker.addTo(map);
      marker._onMap = true;
      return marker;
    },

    showMarker: function (ref) {
      if (!ref._onMap) { ref.addTo(map); ref._onMap = true; }
    },

    hideMarker: function (ref) {
      if (ref._onMap) { map.removeLayer(ref); ref._onMap = false; }
    },

    onMarkerClick: function (ref, cb) {
      ref.on('click', cb);
    },

    openPopup: function (ref, html) {
      ref.unbindPopup();
      ref.bindPopup(html, { maxWidth: 280, minWidth: 240 });
      ref.openPopup();
    },

    closePopup: function () {
      map.closePopup();
    },

    setView: function (lat, lng, zoom) {
      map.setView([lat, lng], zoom);
    },

    getZoom: function () {
      return map.getZoom();
    },

    onZoomEnd: function (cb) {
      map.on('zoomend', cb);
    },

    onMoveEnd: function (cb) {
      map.on('moveend', cb);
    },

    invalidateSize: function () {
      if (map) map.invalidateSize();
    },

    latLngToContainerPoint: function (lat, lng) {
      var pt = map.latLngToContainerPoint([lat, lng]);
      return { x: pt.x, y: pt.y };
    },

    setDarkMode: function (isDark) {
      darkMode = isDark;
      // Apply CSS filter to tile layer for dark mode
      var tilesEl = document.querySelector('#vinemap-container .leaflet-tile-pane');
      if (tilesEl) {
        tilesEl.style.filter = isDark
          ? 'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)'
          : 'none';
      }
    },

    addLabelOverlay: function (vineyard) {
      var label = L.marker([vineyard.lat, vineyard.lng], {
        icon: L.divIcon({
          className: 'vine-label',
          html: '<span class="vine-label-text">' + vineyard.name + '</span>',
          iconSize:   [200, 22],
          iconAnchor: [100, 68]
        }),
        interactive: false
      });
      // Labels start hidden
      label._onMap = false;
      return label;
    },

    showLabel: function (ref) {
      if (ref && !ref._onMap) { ref.addTo(map); ref._onMap = true; }
    },

    hideLabel: function (ref) {
      if (ref && ref._onMap) { map.removeLayer(ref); ref._onMap = false; }
    },

    getMap: function () {
      return map;
    }
  };

  window.VineMapLeaflet = LeafletRenderer;
})();
