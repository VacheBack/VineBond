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
  var maskPolygon      = null;  // inverted polygon for region mask
  var boundaryConfigRef = null; // stored config for dark-mode color updates
  var boundaryBounds   = null;  // LatLngBounds for fitBounds / reset

  /* ── World-covering outer path for inverted polygon ──────────────────── */

  var WORLD_BOUNDS = [
    { lat: -85, lng: -180 },
    { lat:  85, lng: -180 },
    { lat:  85, lng:  180 },
    { lat: -85, lng:  180 }
  ];

  /* ── Dark Mode Style ─────────────────────────────────────────────────── */

  var DARK_STYLES = [
    { elementType: 'geometry',            stylers: [{ color: '#1a2e2a' }] },
    { elementType: 'labels.text.stroke',  stylers: [{ color: '#0E1917' }] },
    { elementType: 'labels.text.fill',    stylers: [{ color: '#A8A298' }] },
    { featureType: 'administrative',      elementType: 'geometry.stroke', stylers: [{ color: '#2a4a42' }] },
    { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#6e8a7e' }] },
    { featureType: 'landscape.natural',   elementType: 'geometry', stylers: [{ color: '#1a2e2a' }] },
    { featureType: 'poi',                 elementType: 'geometry', stylers: [{ color: '#1e3830' }] },
    { featureType: 'poi',                 elementType: 'labels.text.fill', stylers: [{ color: '#7a9a8e' }] },
    { featureType: 'poi.park',            elementType: 'geometry.fill', stylers: [{ color: '#1e3830' }] },
    { featureType: 'poi.park',            elementType: 'labels.text.fill', stylers: [{ color: '#5a8a6e' }] },
    { featureType: 'road',                elementType: 'geometry', stylers: [{ color: '#253e38' }] },
    { featureType: 'road',                elementType: 'geometry.stroke', stylers: [{ color: '#1a2e28' }] },
    { featureType: 'road',                elementType: 'labels.text.fill', stylers: [{ color: '#8a9e96' }] },
    { featureType: 'road.highway',        elementType: 'geometry', stylers: [{ color: '#2a4a40' }] },
    { featureType: 'road.highway',        elementType: 'geometry.stroke', stylers: [{ color: '#1a3a32' }] },
    { featureType: 'transit',             elementType: 'geometry', stylers: [{ color: '#1e3830' }] },
    { featureType: 'transit.station',     elementType: 'labels.text.fill', stylers: [{ color: '#7a9a8e' }] },
    { featureType: 'water',               elementType: 'geometry', stylers: [{ color: '#0e2420' }] },
    { featureType: 'water',               elementType: 'labels.text.fill', stylers: [{ color: '#4a7a6e' }] }
  ];

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
        gestureHandling:  'greedy',
        styles:           isDarkMode ? DARK_STYLES : []
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
      ref.addListener('click', cb);
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
      if (map) {
        map.setOptions({ styles: dark ? DARK_STYLES : [] });
      }
      if (maskPolygon && boundaryConfigRef) {
        maskPolygon.setOptions({
          fillColor: dark ? boundaryConfigRef.darkMaskColor : boundaryConfigRef.lightMaskColor
        });
      }
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

    applyRegionBoundary: function (coords, cfg) {
      boundaryConfigRef = cfg;

      // Build LatLngBounds from boundary coordinates
      boundaryBounds = new google.maps.LatLngBounds();
      var innerPath = coords.map(function (c) {
        var ll = new google.maps.LatLng(c.lat, c.lng);
        boundaryBounds.extend(ll);
        return ll;
      });

      // Inverted polygon: world fill with Rheingau hole
      maskPolygon = new google.maps.Polygon({
        paths:         [WORLD_BOUNDS, innerPath],
        strokeColor:   cfg.borderColor   || '#5C2632',
        strokeOpacity: cfg.borderOpacity || 0.7,
        strokeWeight:  cfg.borderWeight  || 2,
        fillColor:     isDarkMode ? (cfg.darkMaskColor || '#0E1917') : (cfg.lightMaskColor || '#FFFFFF'),
        fillOpacity:   cfg.maskOpacity   || 0.92,
        clickable:     false,
        zIndex:        1000
      });
      maskPolygon.setMap(map);

      // Fit map to boundary extent
      map.fitBounds(boundaryBounds);

      // Lock minZoom after fitBounds settles
      google.maps.event.addListenerOnce(map, 'idle', function () {
        map.setOptions({ minZoom: map.getZoom() });
      });

      // Restrict panning to boundary
      map.setOptions({
        restriction: {
          latLngBounds: boundaryBounds,
          strictBounds: true
        }
      });
    },

    fitToBoundary: function () {
      if (map && boundaryBounds) {
        map.fitBounds(boundaryBounds);
      }
    },

    getMap: function () {
      return map;
    }
  };

  window.VineMapGoogle = GoogleRenderer;
})();
