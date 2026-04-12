/**
 * VineBond — Google Maps Renderer
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements the VineMapAdapter renderer interface using Google Maps JavaScript
 * API with AdvancedMarkerElement for custom vineyard markers.
 *
 * Target: Android mobile/tablet, Windows & Linux desktops.
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  var map              = null;
  var infoWindow       = null;  // single shared InfoWindow
  var isDarkMode       = false;
  var projHelper       = null;  // OverlayView for coordinate projection
/* ── Projection Helper (OverlayView) ─────────────────────────────────── */

  function createProjectionHelper() {
    var overlay = new google.maps.OverlayView();
    overlay.draw = function () {};
    overlay.onAdd = function () {};
    overlay.onRemove = function () {};
    overlay.setMap(map);
    return overlay;
  }

  /* ── Custom Marker HTML ──────────────────────────────────────────────── */

  function createMarkerContent(vineyard) {
    var bgColor = vineyard.type === 'GG' ? '#5C2632' : '#B8960F';
    var el = document.createElement('div');
    el.className = 'vb-gm-marker-wrap';
    el.innerHTML =
      '<div class="vb-gm-marker" style="background:' + bgColor + ';">'
      + '<span class="vb-gm-marker-label">' + vineyard.type + '</span>'
      + '</div>';
    return el;
  }

  /* ── Label Element ───────────────────────────────────────────────────── */

  function createLabelContent(vineyard) {
    var el = document.createElement('div');
    el.className = 'vb-gm-label';
    el.innerHTML = '<span class="vine-label-text">' + vineyard.name + '</span>';
    return el;
  }

  /* ── Renderer Interface ──────────────────────────────────────────────── */

  var GoogleRenderer = {

    init: function (containerEl, opts) {
      var mapOpts = {
        center:           { lat: opts.center.lat, lng: opts.center.lng },
        zoom:             opts.zoom,
        mapId:            'vinebond-map',
        zoomControl:      true,
        zoomControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
        mapTypeControl:   false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling:  'greedy'
      };

      map = new google.maps.Map(containerEl, mapOpts);
      infoWindow = new google.maps.InfoWindow();

      // Create projection helper after tiles load
      google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        projHelper = createProjectionHelper();
      });
    },

    addMarker: function (vineyard) {
      var content = createMarkerContent(vineyard);
      var marker = new google.maps.marker.AdvancedMarkerElement({
        map:      map,
        position: { lat: vineyard.lat, lng: vineyard.lng },
        content:  content,
        title:    vineyard.name
      });
      marker._vineyardData = vineyard;
      marker._contentEl = content;
      return marker;
    },

    showMarker: function (ref) {
      if (ref) ref.map = map;
    },

    hideMarker: function (ref) {
      if (ref) ref.map = null;
    },

    onMarkerClick: function (ref, cb) {
      ref.addEventListener('gmp-click', cb);
    },

    openPopup: function (ref, html) {
      infoWindow.setContent(html);
      infoWindow.open({ anchor: ref, map: map });
    },

    closePopup: function () {
      if (infoWindow) infoWindow.close();
    },

    setView: function (lat, lng, zoom) {
      map.setCenter({ lat: lat, lng: lng });
      map.setZoom(zoom);
    },

    getZoom: function () {
      return map ? map.getZoom() : 12;
    },

    onZoomEnd: function (cb) {
      map.addListener('zoom_changed', cb);
    },

    onMoveEnd: function (cb) {
      map.addListener('idle', cb);
    },

    invalidateSize: function () {
      if (map) google.maps.event.trigger(map, 'resize');
    },

    latLngToContainerPoint: function (lat, lng) {
      if (!projHelper || !projHelper.getProjection()) return null;
      var proj  = projHelper.getProjection();
      var point = proj.fromLatLngToContainerPixel(new google.maps.LatLng(lat, lng));
      if (!point) return null;
      return { x: point.x, y: point.y };
    },

    setDarkMode: function (dark) {
      isDarkMode = dark;
    },

    addLabelOverlay: function (vineyard) {
      var content = createLabelContent(vineyard);
      var label = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: vineyard.lat, lng: vineyard.lng },
        content:  content,
        title:    '',
        zIndex:   -1
      });
      // Labels start hidden (map = null)
      label._onMap = false;
      label._contentEl = content;
      return label;
    },

    showLabel: function (ref) {
      if (ref && !ref._onMap) {
        ref.map = map;
        ref._onMap = true;
      }
    },

    hideLabel: function (ref) {
      if (ref && ref._onMap) {
        ref.map = null;
        ref._onMap = false;
      }
    },

    getMap: function () {
      return map;
    }
  };

  window.VineMapGoogle = GoogleRenderer;
})();
