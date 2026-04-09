/**
 * VineBond — VineMap Adapter (Shared Logic)
 * ─────────────────────────────────────────────────────────────────────────────
 * Platform-agnostic layer that wires filters, search, popups, labels, and UI
 * to whichever map renderer (Leaflet / Google Maps / Apple Maps) is active.
 *
 * The renderer must implement:
 *   init(containerEl, config)        → create the map
 *   addMarker(vineyard)              → returns marker ref
 *   showMarker(ref)                  → show on map
 *   hideMarker(ref)                  → hide from map
 *   openPopup(ref, html)             → open info popup
 *   closePopup()                     → close any open popup
 *   setView(lat, lng, zoom)          → pan + zoom
 *   getZoom()                        → current zoom level
 *   onZoomEnd(cb)                    → register zoom-end listener
 *   onMoveEnd(cb)                    → register move-end listener
 *   invalidateSize()                 → force layout recalc
 *   latLngToContainerPoint(lat,lng)  → { x, y } screen coords
 *   setDarkMode(isDark)              → apply/remove dark styling
 *   addLabelOverlay(vineyard)        → returns label ref
 *   showLabel(ref)                   → show label
 *   hideLabel(ref)                   → hide label
 *   getMap()                         → underlying map object (for external use)
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  var VINEYARDS = window.RHEINGAU_VINEYARDS || [];
  var config    = window.VB_MAP_CONFIG || {};

  var renderer  = null;   // set by init()
  var markers   = [];     // parallel to VINEYARDS
  var labels    = [];     // parallel to VINEYARDS
  var markerMap = {};     // id → { marker, label, vineyard, index }

  /* ── Filter State ────────────────────────────────────────────────────── */

  var filterState = {
    classification: new Set(),
    grape:          new Set(),
    village:        new Set(),
    tour:           new Set()
  };

  /* ── Label Constants ─────────────────────────────────────────────────── */

  var LABEL_MIN_ZOOM = config.labelMinZoom || 13;
  var LABEL_W = 200;
  var LABEL_H = 22;

  /* ── Popup Builder ───────────────────────────────────────────────────── */

  function buildPopupHTML(v) {
    var isDE = (localStorage.getItem('vb_lang') || 'en') === 'de';
    var desc = isDE ? v.desc_de : v.desc_en;
    var lbl  = isDE
      ? { estate: 'Weingut', grape: 'Rebsorte', soil: 'Boden', altitude: 'Höhe', tours: 'Touren', book: 'Besuch buchen' }
      : { estate: 'Estate',  grape: 'Grape',    soil: 'Soil',  altitude: 'Alt.', tours: 'Tours',  book: 'Book a Visit' };

    var typeColor   = v.type === 'GG' ? '#5C2632' : '#B8960F';
    var tourBadges  = v.tours.map(function (t) {
      return '<span style="display:inline-block;padding:2px 8px;border-radius:100px;font-size:10px;font-weight:600;background:#F0EDE6;color:#4A1F2A;margin:1px 2px;">' + t + '</span>';
    }).join('');

    return '<div style="font-family:\'Segoe UI\',sans-serif; padding:4px;">'
      + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">'
      +   '<span style="padding:3px 10px;border-radius:100px;font-size:11px;font-weight:800;background:' + typeColor + ';color:#fff;letter-spacing:0.05em;">' + v.type + '</span>'
      +   '<h4 style="margin:0;font-size:14px;color:#4A1F2A;font-weight:700;line-height:1.3;">' + v.name + '</h4>'
      + '</div>'
      + '<table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:10px;">'
      +   '<tr><td style="color:#8B8578;padding:2px 6px 2px 0;font-weight:600;white-space:nowrap;">' + lbl.estate + '</td><td style="color:#4A1F2A;">' + v.estate + '</td></tr>'
      +   '<tr><td style="color:#8B8578;padding:2px 6px 2px 0;font-weight:600;">' + lbl.grape + '</td><td style="color:#4A1F2A;">' + v.grape + '</td></tr>'
      +   '<tr><td style="color:#8B8578;padding:2px 6px 2px 0;font-weight:600;">' + lbl.soil + '</td><td style="color:#4A1F2A;">' + v.soil + '</td></tr>'
      +   '<tr><td style="color:#8B8578;padding:2px 6px 2px 0;font-weight:600;">' + lbl.altitude + '</td><td style="color:#4A1F2A;">' + v.altitude + ' &middot; ' + v.slope + '</td></tr>'
      +   '<tr><td style="color:#8B8578;padding:2px 6px 2px 0;font-weight:600;vertical-align:top;">' + lbl.tours + '</td><td style="color:#4A1F2A;">' + tourBadges + '</td></tr>'
      + '</table>'
      + '<p style="font-size:12px;color:#4A4740;line-height:1.5;margin:0 0 12px;">' + desc + '</p>'
      + '<a href="book.html" style="display:block;text-align:center;padding:9px 16px;background:linear-gradient(135deg,#1C4F3D,#4A1F2A);color:#FFFFFF;border-radius:10px;font-weight:700;font-size:12px;text-decoration:none;letter-spacing:0.04em;border:1.5px solid #D4AF37;">' + lbl.book + '</a>'
      + '</div>';
  }

  /* ── Label Collision Detection ───────────────────────────────────────── */

  function smartenLabels() {
    var zoom = renderer.getZoom();

    if (zoom < LABEL_MIN_ZOOM) {
      labels.forEach(function (lb) { if (lb) renderer.hideLabel(lb); });
      return;
    }

    // Restore filter-visible labels
    VINEYARDS.forEach(function (v, i) {
      if (markers[i] && markers[i]._visible) {
        renderer.showLabel(labels[i]);
      }
    });

    // Greedy collision pass — GG wins over 1G
    var priority = [];
    for (var i = 0; i < VINEYARDS.length; i++) {
      if (markers[i] && markers[i]._visible) priority.push(i);
    }
    priority.sort(function (a, b) {
      if (VINEYARDS[a].type === 'GG' && VINEYARDS[b].type !== 'GG') return -1;
      if (VINEYARDS[a].type !== 'GG' && VINEYARDS[b].type === 'GG') return  1;
      return 0;
    });

    var placed = [];
    priority.forEach(function (idx) {
      var v  = VINEYARDS[idx];
      var pt = renderer.latLngToContainerPoint(v.lat, v.lng);
      if (!pt) { renderer.hideLabel(labels[idx]); return; }

      var r = {
        l: pt.x - LABEL_W / 2,
        r: pt.x + LABEL_W / 2,
        t: pt.y - 68,
        b: pt.y - 46
      };
      var clash = placed.some(function (p) {
        return r.l < p.r && r.r > p.l && r.t < p.b && r.b > p.t;
      });
      if (clash) {
        renderer.hideLabel(labels[idx]);
      } else {
        placed.push(r);
      }
    });
  }

  /* ── Apply Filters ───────────────────────────────────────────────────── */

  function applyFilters() {
    var visibleCount = 0;

    VINEYARDS.forEach(function (v, i) {
      var visible = true;
      if (filterState.classification.size > 0 && !filterState.classification.has(v.type))   visible = false;
      if (filterState.grape.size > 0          && !filterState.grape.has(v.grape))            visible = false;
      if (filterState.village.size > 0        && !filterState.village.has(v.village))        visible = false;
      if (filterState.tour.size > 0           && !v.tours.some(function (t) { return filterState.tour.has(t); })) visible = false;

      if (visible) {
        renderer.showMarker(markers[i]);
        markers[i]._visible = true;
        visibleCount++;
      } else {
        renderer.hideMarker(markers[i]);
        renderer.hideLabel(labels[i]);
        markers[i]._visible = false;
      }
    });

    smartenLabels();

    var countEl = document.getElementById('vmResultCount');
    if (countEl) countEl.textContent = visibleCount;
    var totalEl = document.getElementById('vmTotalCount');
    if (totalEl) totalEl.textContent = VINEYARDS.length;

    var emptyState = document.getElementById('vmEmptyState');
    if (emptyState) emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
  }

  /* ── Sidebar Checkbox Filter Binding ─────────────────────────────────── */

  function bindCheckboxFilters(containerSelector, filterKey) {
    var container = document.querySelector(containerSelector);
    if (!container) return;
    container.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        if (cb.checked) {
          filterState[filterKey].add(cb.value);
        } else {
          filterState[filterKey].delete(cb.value);
        }
        applyFilters();
      });
    });
  }

  /* ── Desktop Search ──────────────────────────────────────────────────── */

  function initDesktopSearch() {
    var searchInput   = document.getElementById('vmSearchInput');
    var searchResults = document.getElementById('vmSearchResults');
    if (!searchInput || !searchResults) return;

    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      searchResults.innerHTML = '';
      if (q.length < 2) { searchResults.style.display = 'none'; return; }

      var matches = VINEYARDS.filter(function (v) {
        return v.name.toLowerCase().includes(q) ||
               v.estate.toLowerCase().includes(q) ||
               v.village.toLowerCase().includes(q);
      });

      if (matches.length === 0) { searchResults.style.display = 'none'; return; }

      matches.forEach(function (v) {
        var li = document.createElement('li');
        li.className = 'vm-search-item';
        li.innerHTML = '<span class="vm-search-name">' + v.name + '</span>'
          + '<span class="vm-search-badge vm-search-badge--' + v.type.toLowerCase() + '">' + v.type + '</span>';
        li.addEventListener('click', function () {
          renderer.setView(v.lat, v.lng, config.markerZoom || 15);
          renderer.openPopup(markerMap[v.id].marker, buildPopupHTML(v));
          searchResults.style.display = 'none';
          searchInput.value = v.name;
        });
        searchResults.appendChild(li);
      });
      searchResults.style.display = 'block';
    });

    document.addEventListener('click', function (e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }

  /* ── Mobile Search ───────────────────────────────────────────────────── */

  function normalizeStr(s) {
    return s.toLowerCase()
      .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
      .replace(/é|è|ê/g, 'e').replace(/à|â/g, 'a');
  }

  function initMobileSearch() {
    var msbSearch  = document.getElementById('vmMsbSearch');
    var msbResults = document.getElementById('vmMsbResults');
    var msbClear   = document.getElementById('vmMsbClear');
    if (!msbSearch || !msbResults) return;

    function positionDropdown() {
      var wrapper = document.getElementById('vmMsbWrapper');
      if (!wrapper) return;
      var r = wrapper.getBoundingClientRect();
      msbResults.style.top   = (r.bottom + 8) + 'px';
      msbResults.style.left  = r.left + 'px';
      msbResults.style.right = (window.innerWidth - r.right) + 'px';
    }

    msbSearch.addEventListener('input', function () {
      var q = normalizeStr(msbSearch.value.trim());
      msbResults.innerHTML = '';
      if (msbClear) msbClear.hidden = msbSearch.value.length === 0;

      if (q.length < 1) { msbResults.classList.remove('open'); return; }

      var matches = VINEYARDS.filter(function (v) {
        return normalizeStr(v.name).includes(q) || normalizeStr(v.village).includes(q);
      });

      if (matches.length === 0) { msbResults.classList.remove('open'); return; }

      matches.forEach(function (v) {
        var li = document.createElement('li');
        li.className = 'vm-msb-result';
        li.setAttribute('role', 'option');
        li.innerHTML =
          '<div class="vm-msb-result-info">'
          + '<span class="vm-msb-result-name">' + v.name + '</span>'
          + '<span class="vm-msb-result-sub">' + v.village + ' \u00B7 ' + v.type + '</span>'
          + '</div>'
          + '<span class="vm-search-badge vm-search-badge--' + v.type.toLowerCase() + '">' + v.type + '</span>';
        li.addEventListener('click', function () {
          renderer.setView(v.lat, v.lng, config.markerZoom || 15);
          renderer.openPopup(markerMap[v.id].marker, buildPopupHTML(v));
          msbSearch.value = v.name;
          if (msbClear) msbClear.hidden = false;
          msbResults.classList.remove('open');
        });
        msbResults.appendChild(li);
      });

      positionDropdown();
      msbResults.classList.add('open');
    });

    if (msbClear) {
      msbClear.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        msbSearch.value = '';
        msbSearch.focus();
        msbClear.hidden = true;
        msbResults.classList.remove('open');
        filterState.village.clear();
        applyFilters();
      });
    }

    document.addEventListener('click', function (e) {
      var wrapper = document.getElementById('vmMsbWrapper');
      // Also allow clicks inside the dropdown itself (now lives at body level)
      if (wrapper && !wrapper.contains(e.target) && !msbResults.contains(e.target)) {
        msbResults.classList.remove('open');
      }
    });
  }

  /* ── Calendar ────────────────────────────────────────────────────────── */

  function initCustomCalendar() {
    var msbDateBtn   = document.getElementById('vmMsbDateBtn');
    var msbDateLabel = document.getElementById('vmMsbDateLabel');
    var msbDateInput = document.getElementById('vmMsbDateInput');
    var calEl        = document.getElementById('vmCalendar');
    var calDays      = document.getElementById('vmCalDays');
    var calTitle     = document.getElementById('vmCalTitle');
    var calPrev      = document.getElementById('vmCalPrev');
    var calNext      = document.getElementById('vmCalNext');
    var calWeekdays  = document.getElementById('vmCalWeekdays');
    var calBackdrop  = document.getElementById('vmCalBackdrop');

    if (!msbDateBtn || !calEl) return;

    var MONTHS       = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var DAYS         = ['Mo','Tu','We','Th','Fr','Sa','Su'];

    var viewYear, viewMonth;
    var selectedDate = null;

    function formatVisitDate(y, m, d) { return d + ' ' + MONTHS_SHORT[m]; }
    function toDateStr(y, m, d) {
      return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    }

    calWeekdays.innerHTML = '';
    DAYS.forEach(function (d) {
      var span = document.createElement('span');
      span.className = 'vm-cal-weekday';
      span.textContent = d;
      calWeekdays.appendChild(span);
    });

    function renderMonth() {
      calTitle.textContent = MONTHS[viewMonth] + ' ' + viewYear;
      calDays.innerHTML = '';

      var firstDay    = new Date(viewYear, viewMonth, 1).getDay();
      var startOffset = (firstDay + 6) % 7;
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

      var today  = new Date();
      var todayY = today.getFullYear();
      var todayM = today.getMonth();
      var todayD = today.getDate();

      for (var i = 0; i < startOffset; i++) {
        var empty = document.createElement('button');
        empty.className = 'vm-cal-day empty';
        empty.setAttribute('aria-hidden', 'true');
        calDays.appendChild(empty);
      }

      for (var d = 1; d <= daysInMonth; d++) {
        var btn = document.createElement('button');
        btn.className = 'vm-cal-day';
        btn.textContent = d;
        btn.setAttribute('type', 'button');

        if (new Date(viewYear, viewMonth, d) < new Date(todayY, todayM, todayD)) btn.classList.add('past');
        if (viewYear === todayY && viewMonth === todayM && d === todayD) btn.classList.add('today');
        if (selectedDate && viewYear === selectedDate.y && viewMonth === selectedDate.m && d === selectedDate.d) btn.classList.add('selected');

        (function (day) {
          btn.addEventListener('click', function () {
            selectedDate = { y: viewYear, m: viewMonth, d: day };
            var dateStr = toDateStr(viewYear, viewMonth, day);
            if (msbDateInput) msbDateInput.value = dateStr;
            localStorage.setItem('vb_visit_date', dateStr);
            msbDateLabel.textContent = formatVisitDate(viewYear, viewMonth, day);
            closeCalendar();
          });
        })(d);

        calDays.appendChild(btn);
      }
    }

    function positionCalendar() {
      var rect = msbDateBtn.getBoundingClientRect();
      calEl.style.top  = (rect.bottom + 8) + 'px';
      calEl.style.left = Math.max(8, rect.right - 300) + 'px';
    }

    function openCalendar() {
      if (selectedDate) { viewYear = selectedDate.y; viewMonth = selectedDate.m; }
      else { var now = new Date(); viewYear = now.getFullYear(); viewMonth = now.getMonth(); }
      positionCalendar();
      renderMonth();
      calEl.classList.add('open');
      calBackdrop.classList.add('open');
    }

    function closeCalendar() {
      calEl.classList.remove('open');
      calBackdrop.classList.remove('open');
    }

    // Restore saved date
    var saved = localStorage.getItem('vb_visit_date') || '';
    if (saved) {
      var parts = saved.split('-');
      var sy = parseInt(parts[0], 10), sm = parseInt(parts[1], 10) - 1, sd = parseInt(parts[2], 10);
      selectedDate = { y: sy, m: sm, d: sd };
      if (msbDateInput) msbDateInput.value = saved;
      msbDateLabel.textContent = formatVisitDate(sy, sm, sd);
    }

    msbDateBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      calEl.classList.contains('open') ? closeCalendar() : openCalendar();
    });
    calPrev.addEventListener('click', function (e) {
      e.stopPropagation(); viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } renderMonth();
    });
    calNext.addEventListener('click', function (e) {
      e.stopPropagation(); viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } renderMonth();
    });
    calBackdrop.addEventListener('click', closeCalendar);
    document.addEventListener('click', function (e) {
      if (calEl.classList.contains('open') && !calEl.contains(e.target) && !msbDateBtn.contains(e.target)) closeCalendar();
    });
    window.addEventListener('resize', function () {
      if (calEl.classList.contains('open')) positionCalendar();
    });
  }

  /* ── Mobile Filter Bar ───────────────────────────────────────────────── */

  function initMobileFilterBar() {
    var filterToggle = document.getElementById('vmFilterToggle');
    var filterBar    = document.getElementById('vmFilterBar');
    var filterBadge  = document.getElementById('vmFilterBadge');
    if (!filterToggle || !filterBar) return;

    var selectEls = {
      classification: document.getElementById('fbarSelectClassification'),
      grape:          document.getElementById('fbarSelectGrape'),
      village:        document.getElementById('fbarSelectVillage'),
      tour:           document.getElementById('fbarSelectTour')
    };

    // Populate village select
    if (selectEls.village) {
      var uniqueVillages = [].concat(new Set(VINEYARDS.map(function (v) { return v.village; }))).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();
      uniqueVillages.forEach(function (village) {
        var opt = document.createElement('option');
        opt.value = village;
        opt.textContent = village;
        selectEls.village.appendChild(opt);
      });
    }

    function activeFbarCount() {
      return filterState.classification.size + filterState.grape.size + filterState.village.size + filterState.tour.size;
    }

    function updateFilterBarState() {
      var count = activeFbarCount();
      filterBadge.hidden = count === 0;
      filterBadge.textContent = count;
      filterToggle.classList.toggle('active', count > 0);
      Object.keys(selectEls).forEach(function (key) {
        if (selectEls[key]) selectEls[key].classList.toggle('active', filterState[key].size > 0);
      });
    }

    function updateCascadeDisabledState() {
      Object.keys(selectEls).forEach(function (key) {
        var sel = selectEls[key];
        if (!sel) return;
        Array.from(sel.options).forEach(function (opt) {
          if (!opt.value) return;
          var val = opt.value;
          var tc = key === 'classification' ? new Set([val]) : new Set(filterState.classification);
          var tg = key === 'grape'          ? new Set([val]) : new Set(filterState.grape);
          var tv = key === 'village'        ? new Set([val]) : new Set(filterState.village);
          var tt = key === 'tour'           ? new Set([val]) : new Set(filterState.tour);

          var matches = VINEYARDS.filter(function (v) {
            if (tc.size && !tc.has(v.type))    return false;
            if (tg.size && !tg.has(v.grape))   return false;
            if (tv.size && !tv.has(v.village)) return false;
            if (tt.size && !v.tours.some(function (t) { return tt.has(t); })) return false;
            return true;
          });
          opt.disabled = (sel.value !== val) && matches.length === 0;
        });
      });
    }

    filterToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = filterBar.classList.toggle('open');
      filterBar.setAttribute('aria-hidden', String(!isOpen));
      filterToggle.setAttribute('aria-expanded', String(isOpen));
    });

    Object.keys(selectEls).forEach(function (key) {
      var sel = selectEls[key];
      if (!sel) return;
      sel.addEventListener('change', function () {
        filterState[key].clear();
        if (sel.value) filterState[key].add(sel.value);

        var sidebarSection = document.querySelector('#filter' + key.charAt(0).toUpperCase() + key.slice(1));
        if (sidebarSection) {
          sidebarSection.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
            cb.checked = (cb.value === sel.value);
          });
        }
        applyFilters();
        updateFilterBarState();
        updateCascadeDisabledState();
      });
    });

    // Hook into Clear All
    var clearAllBtn = document.getElementById('vmClearFilters');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', function () {
        Object.keys(selectEls).forEach(function (key) {
          if (selectEls[key]) selectEls[key].value = '';
        });
        updateFilterBarState();
        updateCascadeDisabledState();
      });
    }

    updateFilterBarState();
    updateCascadeDisabledState();
  }

  /* ── Reset View ──────────────────────────────────────────────────────── */

  function initResetView() {
    var resetBtn = document.getElementById('vmResetView');
    if (!resetBtn) return;
    resetBtn.addEventListener('click', function () {
      renderer.setView(config.mapCenter.lat, config.mapCenter.lng, config.defaultZoom);
    });
  }

  /* ── Clear All Filters ───────────────────────────────────────────────── */

  function initClearAll() {
    var clearBtn = document.getElementById('vmClearFilters');
    if (!clearBtn) return;
    clearBtn.addEventListener('click', function () {
      Object.values(filterState).forEach(function (s) { s.clear(); });
      document.querySelectorAll('.vm-sidebar input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
      applyFilters();
    });
  }

  /* ── Dark Mode Observer ──────────────────────────────────────────────── */

  function initDarkModeObserver() {
    var html = document.documentElement;
    var isDark = html.getAttribute('data-theme') === 'dark';
    renderer.setDarkMode(isDark);

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === 'data-theme') {
          renderer.setDarkMode(html.getAttribute('data-theme') === 'dark');
        }
      });
    });
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
  }

  /* ── Public init() ───────────────────────────────────────────────────── */

  function init(mapRenderer, containerEl) {
    renderer = mapRenderer;

    // 1. Initialise the map
    renderer.init(containerEl, {
      center: config.mapCenter,
      zoom:   config.defaultZoom
    });

    // 1b. Apply region boundary (mask + restriction)
    if (window.VB_RHEINGAU_BOUNDARY && renderer.applyRegionBoundary) {
      renderer.applyRegionBoundary(
        window.VB_RHEINGAU_BOUNDARY,
        window.VB_BOUNDARY_CONFIG || {}
      );
    }

    // 2. Add markers + labels
    VINEYARDS.forEach(function (v, i) {
      var m = renderer.addMarker(v);
      m._visible = true;
      markers[i] = m;

      var lb = renderer.addLabelOverlay(v);
      labels[i] = lb;

      markerMap[v.id] = { marker: m, label: lb, vineyard: v, index: i };

      // Marker click → popup
      renderer.onMarkerClick(m, function () {
        renderer.openPopup(m, buildPopupHTML(v));
      });
    });

    // 3. Bind all UI
    bindCheckboxFilters('#filterClassification', 'classification');
    bindCheckboxFilters('#filterGrape', 'grape');
    bindCheckboxFilters('#filterVillage', 'village');
    bindCheckboxFilters('#filterTour', 'tour');

    initClearAll();
    initDesktopSearch();
    initMobileSearch();
    initCustomCalendar();
    initMobileFilterBar();
    initResetView();

    // 4. Label smartening on zoom/move
    renderer.onZoomEnd(smartenLabels);
    renderer.onMoveEnd(smartenLabels);

    // 5. Dark mode
    initDarkModeObserver();

    // 6. Initial filter pass (show all + labels)
    applyFilters();

    // 7. Fix flex-layout sizing
    setTimeout(function () { renderer.invalidateSize(); }, 200);
    window.addEventListener('resize', function () { renderer.invalidateSize(); });

    // 8. Expose map for external use
    window.vineMap = renderer.getMap();
  }

  /* ── Public API ──────────────────────────────────────────────────────── */

  window.VineMapAdapter = {
    init:           init,
    applyFilters:   applyFilters,
    buildPopupHTML: buildPopupHTML,
    filterState:    filterState,
    getMarkerMap:   function () { return markerMap; }
  };
})();
