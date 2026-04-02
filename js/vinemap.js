/**
 * VineBond — VineMap Leaflet.js Integration (v2.0 — Two-Panel Layout)
 * ─────────────────────────────────────────────────────────────────────────────
 * Design System: VINEBOND Brand Identity v2.0
 * GG Markers:    Vinebond Burgundy #5C2632
 * 1G Markers:    Gold Warm #B8960F
 * Popup CTA:     Vinebond Forest #1C4F3D (9.8:1 AAA on white)
 * Region:        Rheingau (Hessen, Germany)
 * Focus:         Grosses Gewächs (GG) & Erstes Gewächs (1G) Einzellagen
 * Library:       Leaflet.js 1.9.x (loaded via CDN in vinemap.html)
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ── 1. Vineyard Dataset ─────────────────────────────────────────────────── */

const RHEINGAU_VINEYARDS = [
  /* ── Grosses Gewächs (GG) ──────────────────────────────────────────────── */
  {
    id: 'johannisberg',
    name: 'Schloss Johannisberg',
    village: 'Johannisberg',
    type: 'GG',
    lat: 49.9858, lng: 7.9985,
    estate: 'Fürst von Metternich / Oetker Collection',
    grape: 'Riesling',
    soil: 'Lösslehm über Taunus-Quarzit',
    altitude: '145 m',
    slope: 'Süd',
    tours: ['Tasting', 'Cellar Tour'],
    desc_en: 'The world\'s oldest Riesling estate, continuously cultivated for over 1,200 years. The GG displays a characteristic mineral tension from deep loess over quartzite soils.',
    desc_de: 'Das älteste Riesling-Weingut der Welt — seit über 1.200 Jahren ununterbrochen bewirtschaftet. Das GG zeigt ausgeprägte mineralische Spannung aus tiefem Löss über Quarzit.'
  },
  {
    id: 'berg-schlossberg',
    name: 'Rüdesheimer Berg Schlossberg',
    village: 'Rüdesheim',
    type: 'GG',
    lat: 49.9792, lng: 7.9118,
    estate: 'Weingut Georg Breuer',
    grape: 'Riesling',
    soil: 'Quarzit, Phyllit-Schiefer',
    altitude: '80–240 m',
    slope: 'Süd, Südwest',
    tours: ['Tasting', 'Vineyard Walk'],
    desc_en: 'Steep south-facing slope with deep slate soils. The GG from Breuer is renowned for its extraordinary mineral precision and long-term ageing potential.',
    desc_de: 'Steile Süd- und Südwestlage mit tiefen Phyllitböden. Das GG von Breuer steht für außergewöhnliche mineralische Präzision und langes Alterungspotenzial.'
  },
  {
    id: 'marcobrunn',
    name: 'Erbacher Marcobrunn',
    village: 'Erbach',
    type: 'GG',
    lat: 49.9975, lng: 8.0510,
    estate: 'Schloss Schönborn / Knyphausen',
    grape: 'Riesling',
    soil: 'Schwerer Lehm über Kalkstein',
    altitude: '88 m',
    slope: 'Ost, Südost',
    tours: ['Tasting', 'Cellar Tour', 'Vineyard Walk'],
    desc_en: 'Historically the most significant Einzellage of the Rheingau, referenced in records since the 12th century. Rich, powerful style with excellent structure.',
    desc_de: 'Historisch bedeutendste Einzellage des Rheingaus, urkundlich seit dem 12. Jahrhundert belegt. Reicher, kraftvoller Ausbau mit exzellenter Struktur.'
  },
  {
    id: 'baiken',
    name: 'Rauenthaler Baiken',
    village: 'Rauenthal',
    type: 'GG',
    lat: 50.0282, lng: 8.0942,
    estate: 'Weingut Robert Weil',
    grape: 'Riesling',
    soil: 'Phyllitschiefer, Taunusquarzit',
    altitude: '200–280 m',
    slope: 'Süd',
    tours: ['Tasting', 'Vineyard Walk'],
    desc_en: 'The highest-elevated GG site in the Rheingau. A cool microclimate creates pronounced acidity and subtle spice, signature of the Rauenthal terroir.',
    desc_de: 'Höchstgelegene GG-Lage des Rheingaus. Ein kühles Mikroklima erzeugt ausgeprägte Säure und subtile Würze — charakteristisch für das Rauenthaler Terroir.'
  },
  {
    id: 'grafenberg',
    name: 'Kiedricher Gräfenberg',
    village: 'Kiedrich',
    type: 'GG',
    lat: 50.0432, lng: 8.1138,
    estate: 'Weingut Robert Weil',
    grape: 'Riesling',
    soil: 'Phyllitschiefer mit Quarzadern',
    altitude: '180–240 m',
    slope: 'Süd, Südost',
    tours: ['Tasting', 'Vineyard Walk', 'Cellar Tour'],
    desc_en: 'The flagship vineyard of Robert Weil. Consistently produces complex, elegant Rieslings with exceptional depth and a silky mineral finish.',
    desc_de: 'Flaggschiff-Weinberg von Robert Weil. Erzeugt beständig komplexe, elegante Rieslinge mit außergewöhnlicher Tiefe und einem seidigen mineralischen Abgang.'
  },
  {
    id: 'hollenberg',
    name: 'Assmannshäuser Höllenberg',
    village: 'Assmannshausen',
    type: 'GG',
    lat: 49.9882, lng: 7.8912,
    estate: 'Weingut Georg Breuer / August Kesseler',
    grape: 'Spätburgunder',
    soil: 'Roter Phyllitschiefer',
    altitude: '100–200 m',
    slope: 'Süd, Südost',
    tours: ['Tasting', 'Cellar Tour'],
    desc_en: 'The only red-wine GG site in the Rheingau. Pinot Noir on red Phyllit slate produces an elegant, Burgundy-inspired style unique in Germany.',
    desc_de: 'Einzige Rotwein-GG-Lage im Rheingau. Spätburgunder auf rotem Phyllitschiefer ergibt einen eleganten, Burgund-inspirierten Stil, einzigartig in Deutschland.'
  },
  {
    id: 'rothenberg',
    name: 'Geisenheimer Rothenberg',
    village: 'Geisenheim',
    type: 'GG',
    lat: 49.9848, lng: 7.9658,
    estate: 'Weingut Wegeler',
    grape: 'Riesling',
    soil: 'Lehm, Sand, Kies über Grauwacke',
    altitude: '90–130 m',
    slope: 'Süd',
    tours: ['Tasting'],
    desc_en: 'A magnificent south-facing slope above the Rhine. Produces full-bodied, ripe Rieslings with substantial fruit weight and creamy texture.',
    desc_de: 'Prächtige Südhanglage über dem Rhein. Erzeugt vollmundige, reife Rieslinge mit substanziellem Fruchtgewicht und cremiger Textur.'
  },
  {
    id: 'nussbrunnen',
    name: 'Hattenheimer Nussbrunnen',
    village: 'Hattenheim',
    type: 'GG',
    lat: 50.0092, lng: 8.0628,
    estate: 'Weingut Balthasar Ress',
    grape: 'Riesling',
    soil: 'Tiefgründiger Lehm über Mergel',
    altitude: '95 m',
    slope: 'Südost',
    tours: ['Tasting', 'Vineyard Walk', 'Cellar Tour'],
    desc_en: 'A terraced site of exceptional depth. Renowned for opulent, creamy Riesling structure and the characteristic "Nussbrunnen" mineral spring note.',
    desc_de: 'Terrassenlage mit außergewöhnlicher Tiefgründigkeit. Bekannt für opulente, cremige Rieslingstruktur und die charakteristische mineralische "Nussbrunnennote".'
  },
  {
    id: 'domdechanei',
    name: 'Hochheimer Domdechanei',
    village: 'Hochheim',
    type: 'GG',
    lat: 50.0096, lng: 8.3524,
    estate: 'Domdechant Werner',
    grape: 'Riesling',
    soil: 'Lösslehm, sandig-lehmig',
    altitude: '95–110 m',
    slope: 'Süd',
    tours: ['Tasting', 'Cellar Tour'],
    desc_en: 'The easternmost GG site in the Rheingau, bordering the Main. Warm, full-bodied wines with generous fruit and a long, spicy finish.',
    desc_de: 'Östlichste GG-Lage des Rheingaus, grenzt an den Main. Warme, vollmundige Weine mit generöser Frucht und langem, würzigem Abgang.'
  },
  {
    id: 'jesuitengarten',
    name: 'Winkeler Jesuitengarten',
    village: 'Winkel',
    type: 'GG',
    lat: 49.9985, lng: 8.0138,
    estate: 'Weingut Wegeler / Fritz Allendorf',
    grape: 'Riesling',
    soil: 'Lösslehm über Kies',
    altitude: '88 m',
    slope: 'Süd',
    tours: ['Tasting', 'Vineyard Walk'],
    desc_en: 'A historic Jesuit monastery vineyard. Produces fine, elegant Riesling with a characteristic floral bouquet and delicate mineral structure.',
    desc_de: 'Historische Klosterlage der Jesuiten. Feiner, eleganter Riesling mit charakteristischem Blütenbukett und zarter mineralischer Struktur.'
  },

  /* ── Erstes Gewächs (1G) ────────────────────────────────────────────────── */
  {
    id: 'steinberg',
    name: 'Steinberg (Kloster Eberbach)',
    village: 'Hattenheim',
    type: '1G',
    lat: 50.0388, lng: 8.1552,
    estate: 'Hessische Staatsweingüter Kloster Eberbach',
    grape: 'Riesling',
    soil: 'Devonischer Schiefer',
    altitude: '160–220 m',
    slope: 'Süd, Südost',
    tours: ['Tasting', 'Vineyard Walk', 'Cellar Tour'],
    desc_en: 'A walled Cistercian monastery vineyard (Clos) of extraordinary historical significance, founded in 1135. The 1G from this site is a benchmark of German viticulture.',
    desc_de: 'Ummauerte Zisterzienserklosterlage (Clos) von außergewöhnlicher historischer Bedeutung, gegründet 1135. Das 1G gilt als Maßstab des deutschen Weinbaus.'
  },
  {
    id: 'rottland',
    name: 'Rüdesheimer Berg Rottland',
    village: 'Rüdesheim',
    type: '1G',
    lat: 49.9802, lng: 7.9202,
    estate: 'Weingut Leitz / Josef Spreitzer',
    grape: 'Riesling',
    soil: 'Schiefer, Quarzit',
    altitude: '80–200 m',
    slope: 'Süd',
    tours: ['Tasting', 'Vineyard Walk'],
    desc_en: 'A steep slate slope adjacent to Berg Schlossberg. Produces powerful, mineral Rieslings with firm acidity and impressive concentration.',
    desc_de: 'Steile Schieferlage angrenzend an den Schlossberg. Kräftiger, mineralischer Riesling mit fester Säure und beeindruckender Konzentration.'
  },
  {
    id: 'jungfer',
    name: 'Hallgartener Jungfer',
    village: 'Hallgarten',
    type: '1G',
    lat: 50.0148, lng: 8.0805,
    estate: 'Weingut Ress / Fürst Löwenstein',
    grape: 'Riesling',
    soil: 'Tonschiefer, Lehm',
    altitude: '120–160 m',
    slope: 'Süd, Südost',
    tours: ['Tasting'],
    desc_en: 'A classic Rheingau hillside site. Elegant Riesling with mineral coolness and a refined, persistent finish.',
    desc_de: 'Klassische Rheingauer Hängenlage. Eleganter Riesling mit mineralischer Kühle und einem verfeinerten, langanhaltenden Abgang.'
  },
  {
    id: 'sonnenberg',
    name: 'Eltville Sonnenberg',
    village: 'Eltville',
    type: '1G',
    lat: 50.0231, lng: 8.1128,
    estate: 'Schloss Eltz / Hessische Staatsweingüter',
    grape: 'Riesling',
    soil: 'Lösslehm, Mergel',
    altitude: '100 m',
    slope: 'Süd',
    tours: ['Tasting', 'Vineyard Walk', 'Cellar Tour'],
    desc_en: 'A south-exposed slope near the historic Altstadt of Eltville. Ripe, approachable Riesling with generous texture and sunny fruit character.',
    desc_de: 'Südexponierte Hängelage nahe der historischen Altstadt von Eltville. Reifer, zugänglicher Riesling mit generöser Textur und sonnigem Fruchtcharakter.'
  }
];

/* ── 2. Map Initialisation ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_CENTER = [50.005, 8.025];
  const DEFAULT_ZOOM = 12;

  const map = L.map('vinemap-container', {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    zoomControl: true,
    attributionControl: true,
    scrollWheelZoom: true
  });

  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  const topoLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles &copy; Esri', maxZoom: 19 }
  );

  L.control.layers(
    { 'OpenStreetMap': osmLayer, 'Topographic': topoLayer },
    {},
    { position: 'bottomright', collapsed: true }
  ).addTo(map);

  /* ── 3. Custom Icons — VINEBOND palette ──────────────────────────────── */

  const makeIcon = (bgColor, label) => L.divIcon({
    className: '',
    html: `
      <div style="
        background:${bgColor};
        width:42px; height:42px;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:3px solid rgba(255,255,255,0.9);
        box-shadow:0 4px 12px rgba(0,0,0,0.25);
        display:flex; align-items:center; justify-content:center;
      ">
        <span style="
          transform:rotate(45deg);
          color:#fff;
          font-weight:800;
          font-size:10px;
          font-family:'Segoe UI',sans-serif;
          letter-spacing:0.02em;
          white-space:nowrap;
        ">${label}</span>
      </div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -44]
  });

  const ggIcon         = makeIcon('#5C2632', 'GG');
  const firstGrowthIcon = makeIcon('#B8960F', '1G');

  /* ── 4. Marker + Label Layers ──────────────────────────────────────── */

  const allMarkers = [];
  const allLabels  = [];
  const markerMap  = {};

  RHEINGAU_VINEYARDS.forEach(v => {
    const icon = v.type === 'GG' ? ggIcon : firstGrowthIcon;
    const marker = L.marker([v.lat, v.lng], { icon, title: v.name });
    marker.bindPopup(() => buildPopup(v), { maxWidth: 280, minWidth: 240 });
    marker._vineyardData = v;
    marker.addTo(map);
    allMarkers.push(marker);
    markerMap[v.id] = marker;

    /* Always-visible name label */
    const label = L.marker([v.lat, v.lng], {
      icon: L.divIcon({
        className: 'vine-label',
        html: `<span class="vine-label-text">${v.name}</span>`,
        iconSize: [120, 20],
        iconAnchor: [-6, 36]
      }),
      interactive: false
    });
    label._vineyardData = v;
    label.addTo(map);
    allLabels.push(label);
  });

  /* ── 5. Filter State ───────────────────────────────────────────────── */

  const filterState = {
    classification: new Set(),  // empty = all
    grape: new Set(),
    village: new Set(),
    tour: new Set()
  };

  function applyFilters() {
    let visibleCount = 0;
    RHEINGAU_VINEYARDS.forEach((v, i) => {
      const marker = allMarkers[i];
      const label  = allLabels[i];
      let visible  = true;

      if (filterState.classification.size > 0 && !filterState.classification.has(v.type)) visible = false;
      if (filterState.grape.size > 0 && !filterState.grape.has(v.grape)) visible = false;
      if (filterState.village.size > 0 && !filterState.village.has(v.village)) visible = false;
      if (filterState.tour.size > 0 && !v.tours.some(t => filterState.tour.has(t))) visible = false;

      if (visible) {
        if (!map.hasLayer(marker)) marker.addTo(map);
        if (!map.hasLayer(label))  label.addTo(map);
        visibleCount++;
      } else {
        if (map.hasLayer(marker)) map.removeLayer(marker);
        if (map.hasLayer(label))  map.removeLayer(label);
      }
    });

    /* Update result count */
    const countEl = document.getElementById('vmResultCount');
    if (countEl) countEl.textContent = visibleCount;
    const totalEl = document.getElementById('vmTotalCount');
    if (totalEl) totalEl.textContent = RHEINGAU_VINEYARDS.length;

    /* Show / hide empty state */
    const emptyState = document.getElementById('vmEmptyState');
    if (emptyState) emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
  }

  /* ── 6. Sidebar Filter Binding ─────────────────────────────────────── */

  function bindCheckboxFilters(containerSelector, filterKey) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          filterState[filterKey].add(cb.value);
        } else {
          filterState[filterKey].delete(cb.value);
        }
        applyFilters();
      });
    });
  }

  bindCheckboxFilters('#filterClassification', 'classification');
  bindCheckboxFilters('#filterGrape', 'grape');
  bindCheckboxFilters('#filterVillage', 'village');
  bindCheckboxFilters('#filterTour', 'tour');

  /* Clear all filters */
  const clearBtn = document.getElementById('vmClearFilters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      Object.values(filterState).forEach(s => s.clear());
      document.querySelectorAll('.vm-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
      applyFilters();
    });
  }

  /* ── 7. Search on Map ──────────────────────────────────────────────── */

  const searchInput = document.getElementById('vmSearchInput');
  const searchResults = document.getElementById('vmSearchResults');

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      searchResults.innerHTML = '';
      if (q.length < 2) { searchResults.style.display = 'none'; return; }

      const matches = RHEINGAU_VINEYARDS.filter(v =>
        v.name.toLowerCase().includes(q) || v.estate.toLowerCase().includes(q) || v.village.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        searchResults.style.display = 'none';
        return;
      }

      matches.forEach(v => {
        const li = document.createElement('li');
        li.className = 'vm-search-item';
        li.innerHTML = `<span class="vm-search-name">${v.name}</span><span class="vm-search-badge vm-search-badge--${v.type.toLowerCase()}">${v.type}</span>`;
        li.addEventListener('click', () => {
          map.setView([v.lat, v.lng], 15);
          markerMap[v.id].openPopup();
          searchResults.style.display = 'none';
          searchInput.value = v.name;
        });
        searchResults.appendChild(li);
      });
      searchResults.style.display = 'block';
    });

    /* Close search on outside click */
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }

  /* ── 8. Reset View ─────────────────────────────────────────────────── */

  const resetBtn = document.getElementById('vmResetView');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    });
  }

  /* ── 9. Popup Builder — VINEBOND colors ────────────────────────────── */

  function buildPopup(v) {
    const isDE = (localStorage.getItem('vb_lang') || 'en') === 'de';
    const desc = isDE ? v.desc_de : v.desc_en;
    const labels = isDE
      ? { estate: 'Weingut', grape: 'Rebsorte', soil: 'Boden', altitude: 'Höhe', tours: 'Touren', book: 'Besuch buchen' }
      : { estate: 'Estate',  grape: 'Grape',    soil: 'Soil',  altitude: 'Alt.', tours: 'Tours',  book: 'Book a Visit' };

    const typeColor = v.type === 'GG' ? '#5C2632' : '#B8960F';
    const tourBadges = v.tours.map(t => `<span style="display:inline-block;padding:2px 8px;border-radius:100px;font-size:10px;font-weight:600;background:#F0EDE6;color:#4A1F2A;margin:1px 2px;">${t}</span>`).join('');

    return `
      <div style="font-family:'Segoe UI',sans-serif; padding:4px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <span style="
            padding:3px 10px;
            border-radius:100px;
            font-size:11px;
            font-weight:800;
            background:${typeColor};
            color:#fff;
            letter-spacing:0.05em;
          ">${v.type}</span>
          <h4 style="margin:0;font-size:14px;color:#4A1F2A;font-weight:700;line-height:1.3;">${v.name}</h4>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:10px;">
          <tr>
            <td style="color:#8B8578;padding:2px 6px 2px 0;font-weight:600;white-space:nowrap;">${labels.estate}</td>
            <td style="color:#4A1F2A;">${v.estate}</td>
          </tr>
          <tr>
            <td style="color:#8B8578;padding:2px 6px 2px 0;font-weight:600;">${labels.grape}</td>
            <td style="color:#4A1F2A;">${v.grape}</td>
          </tr>
          <tr>
            <td style="color:#8B8578;padding:2px 6px 2px 0;font-weight:600;">${labels.soil}</td>
            <td style="color:#4A1F2A;">${v.soil}</td>
          </tr>
          <tr>
            <td style="color:#8B8578;padding:2px 6px 2px 0;font-weight:600;">${labels.altitude}</td>
            <td style="color:#4A1F2A;">${v.altitude} · ${v.slope}</td>
          </tr>
          <tr>
            <td style="color:#8B8578;padding:2px 6px 2px 0;font-weight:600;vertical-align:top;">${labels.tours}</td>
            <td style="color:#4A1F2A;">${tourBadges}</td>
          </tr>
        </table>
        <p style="font-size:12px;color:#4A4740;line-height:1.5;margin:0 0 12px;">${desc}</p>
        <a href="book.html" style="
          display:block;
          text-align:center;
          padding:9px 16px;
          background:linear-gradient(135deg,#1C4F3D,#4A1F2A);
          color:#FFFFFF;
          border-radius:10px;
          font-weight:700;
          font-size:12px;
          text-decoration:none;
          letter-spacing:0.04em;
          border:1.5px solid #D4AF37;
        ">${labels.book}</a>
      </div>`;
  }

  /* ── 10. Initial count ─────────────────────────────────────────────── */

  applyFilters();

  /* ── 11. Fix Leaflet map size in flex layout ───────────────────────── */

  setTimeout(() => map.invalidateSize(), 200);
  window.addEventListener('resize', () => map.invalidateSize());

  /* ── 12. Expose map for external use ───────────────────────────────── */

  window.vineMap = map;
});
