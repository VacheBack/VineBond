/**
 * VineBond — Apple MapKit JS Renderer
 * ─────────────────────────────────────────────────────────────────────────────
 * Implements the VineMapAdapter renderer interface using Apple MapKit JS.
 * Target: iPhone, iPad, Mac (Safari / WebKit).
 *
 * Requires mapkit.js to be loaded and initialized (via vinemap-detect.js)
 * before this file is executed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  var map       = null;
  var container = null;
  var isDark    = false;
  var _suppressSelectEvent = false;

  var BURGUNDY = '#5C2632';
  var GOLD     = '#B8960F';

  /* ── Marker SVG ─────────────────────────────────────────────────────────── */

  function markerSVG(color) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 42" width="28" height="42">'
      + '<path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 28 14 28S28 24.5 28 14C28 6.268 21.732 0 14 0z"'
      + ' fill="' + color + '" stroke="#fff" stroke-width="1.5"/>'
      + '<circle cx="14" cy="14" r="5" fill="#fff" fill-opacity="0.7"/>'
      + '</svg>';
  }

  /* ── Zoom ↔ Latitude-Delta helpers ──────────────────────────────────────── */

  function zoomToLatDelta(zoom) {
    // zoom 12 → ~0.2°, zoom 15 → ~0.025°
    return 0.8 / Math.pow(2, zoom - 10);
  }

  function latDeltaToZoom(latDelta) {
    return Math.round(10 + Math.log2(0.8 / latDelta));
  }

  /* ── Renderer ───────────────────────────────────────────────────────────── */

  window.VineMapApple = {

    init: function (containerEl, options) {
      container = containerEl;
      var delta = zoomToLatDelta(options.zoom);

      map = new mapkit.Map(containerEl, {
        region: new mapkit.CoordinateRegion(
          new mapkit.Coordinate(options.center.lat, options.center.lng),
          new mapkit.CoordinateSpan(delta, delta * 1.5)
        ),
        colorScheme: isDark
          ? mapkit.Map.ColorSchemes.Dark
          : mapkit.Map.ColorSchemes.Light,
        mapType:          mapkit.Map.MapTypes.Standard,
        showsCompass:     mapkit.FeatureVisibility.Adaptive,
        showsZoomControl: true,
        showsScale:       mapkit.FeatureVisibility.Adaptive
      });

      // Central select listener — fires per-annotation click callbacks
      map.addEventListener('select', function (event) {
        if (_suppressSelectEvent) return;
        var ann = event.annotation;
        if (ann && ann._clickCallback) ann._clickCallback();
      });
    },

    addMarker: function (v) {
      var color = v.type === 'GG' ? BURGUNDY : GOLD;
      var svg   = markerSVG(color);

      var ann = new mapkit.Annotation(
        new mapkit.Coordinate(v.lat, v.lng),
        function () {
          var wrap = document.createElement('div');
          wrap.className = 'vb-mk-marker-wrap';
          wrap.innerHTML = svg;
          return wrap;
        },
        {
          // Default anchor: center-bottom of element = coordinate point.
          // anchorOffset(0,0) keeps the teardrop tip on the coordinate.
          anchorOffset:   new DOMPoint(0, 0),
          accessibilityLabel: v.name,
          data: { id: v.id }
        }
      );

      ann._popupHTML     = '';
      ann._clickCallback = null;
      ann._visible       = true;
      ann._onMap         = false;

      // Custom callout: MapKit calls this when the annotation is selected.
      // Returning the full element means MapKit places it directly (no extra bubble).
      ann.callout = {
        calloutElementForAnnotation: function (a) {
          var wrapper = document.createElement('div');
          wrapper.className = 'vb-mk-callout';
          wrapper.innerHTML = a._popupHTML;
          return wrapper;
        }
      };

      map.addAnnotation(ann);
      ann._onMap = true;
      return ann;
    },

    showMarker: function (m) {
      if (m && !m._onMap) {
        map.addAnnotation(m);
        m._onMap = true;
      }
    },

    hideMarker: function (m) {
      if (m && m._onMap) {
        map.removeAnnotation(m);
        m._onMap = false;
      }
    },

    onMarkerClick: function (m, cb) {
      m._clickCallback = cb;
    },

    openPopup: function (ref, html) {
      ref._popupHTML = html;
      _suppressSelectEvent = true;
      // Deselect first to force callout refresh if same annotation is re-opened
      if (map.selectedAnnotation === ref) {
        map.selectedAnnotation = null;
      }
      map.selectedAnnotation = ref;
      setTimeout(function () { _suppressSelectEvent = false; }, 100);
    },

    closePopup: function () {
      _suppressSelectEvent = true;
      map.selectedAnnotation = null;
      setTimeout(function () { _suppressSelectEvent = false; }, 100);
    },

    setView: function (lat, lng, zoom) {
      var delta = zoomToLatDelta(zoom);
      map.setRegionAnimated(new mapkit.CoordinateRegion(
        new mapkit.Coordinate(lat, lng),
        new mapkit.CoordinateSpan(delta, delta * 1.5)
      ));
    },

    getZoom: function () {
      return latDeltaToZoom(map.region.span.latitudeDelta);
    },

    onZoomEnd: function (cb) {
      map.addEventListener('region-change-end', cb);
    },

    onMoveEnd: function (cb) {
      map.addEventListener('region-change-end', cb);
    },

    invalidateSize: function () {
      // MapKit JS handles resize automatically via ResizeObserver — no-op.
    },

    latLngToContainerPoint: function (lat, lng) {
      if (!map) return null;
      var pt = map.convertCoordinateToPointOnPage(new mapkit.Coordinate(lat, lng));
      if (!pt) return null;
      var rect    = container.getBoundingClientRect();
      var scrollX = window.pageXOffset || 0;
      var scrollY = window.pageYOffset || 0;
      return {
        x: pt.x - (rect.left + scrollX),
        y: pt.y - (rect.top  + scrollY)
      };
    },

    setDarkMode: function (dark) {
      isDark = dark;
      if (map) {
        map.colorScheme = dark
          ? mapkit.Map.ColorSchemes.Dark
          : mapkit.Map.ColorSchemes.Light;
      }
    },

    addLabelOverlay: function (v) {
      var label = new mapkit.Annotation(
        new mapkit.Coordinate(v.lat, v.lng),
        function () {
          var el = document.createElement('div');
          el.className  = 'vb-mk-label';
          el.textContent = v.name;
          return el;
        },
        {
          // Positive y = up in MapKit. Move center-bottom 46px above coordinate
          // so the label box sits at [pt.y-68 … pt.y-46] — matches collision detection.
          anchorOffset: new DOMPoint(0, 46),
          enabled:      false   // non-interactive: doesn't trigger select
        }
      );

      label._onMap = false;
      return label;
    },

    showLabel: function (lb) {
      if (lb && !lb._onMap) {
        map.addAnnotation(lb);
        lb._onMap = true;
      }
    },

    hideLabel: function (lb) {
      if (lb && lb._onMap) {
        map.removeAnnotation(lb);
        lb._onMap = false;
      }
    },

    getMap: function () {
      return map;
    }
  };

})();
