/* ── VineBond Winery Data Module ───────────────────────────────────────────
   window.VineBondWineries
   Manages the winery dataset with localStorage persistence.
   Falls back to DEFAULT_WINERIES when localStorage is empty.
   Admin-added wineries are persisted across page loads.
   ─────────────────────────────────────────────────────────────────────────── */

window.VineBondWineries = (function () {
  'use strict';

  var STORAGE_KEY = 'vb_wineries';

  // ── Default Dataset — Rheingau Estates ───────────────────────────────────
  var DEFAULT_WINERIES = [
    {
      id: 'schloss-johannisberg',
      name: 'Schloss Johannisberg',
      searchName: 'schloss johannisberg',
      region: 'rheingau',
      village: 'Johannisberg',
      type: 'GG',
      grape: 'Riesling',
      classification: 'Grosses Gewächs',
      soil: 'Lösslehm, Quarzit',
      regionLabel: 'Johannisberg, Rheingau',
      description: "The world's oldest Riesling estate, continuously cultivated for over 1,200 years. Legendary terroir above the Rhine bend.",
      headerGradient: 'linear-gradient(135deg,#4A1F2A,#5C2632)',
      emoji: '🏰',
      badgeClass: 'badge-gg',
      badgeLabel: 'GG',
      addedBy: 'default',
      createdAt: null
    },
    {
      id: 'weingut-georg-breuer',
      name: 'Weingut Georg Breuer',
      searchName: 'weingut georg breuer berg schlossberg ruedesheim',
      region: 'rheingau',
      village: 'Rüdesheim',
      type: 'GG',
      grape: 'Riesling',
      classification: 'Grosses Gewächs',
      soil: 'Quarzit, Phyllit-Schiefer',
      regionLabel: 'Rüdesheim, Rheingau',
      description: 'Berg Schlossberg GG — steep south-facing slate slopes with extraordinary mineral precision and long-term ageing potential.',
      headerGradient: 'linear-gradient(135deg,#4A1F2A,#7A304A)',
      emoji: '🍇',
      badgeClass: 'badge-gg',
      badgeLabel: 'GG',
      addedBy: 'default',
      createdAt: null
    },
    {
      id: 'weingut-robert-weil',
      name: 'Weingut Robert Weil',
      searchName: 'weingut robert weil graefenberg baiken kiedrich',
      region: 'rheingau',
      village: 'Kiedrich',
      type: 'GG',
      grape: 'Riesling',
      classification: 'Grosses Gewächs',
      soil: 'Phyllitschiefer, Quarzit',
      regionLabel: 'Kiedrich, Rheingau',
      description: "Kiedricher Gräfenberg & Rauenthaler Baiken — two of the Rheingau's most celebrated GG sites, defined by cool minerality and silky texture.",
      headerGradient: 'linear-gradient(135deg,#2A1030,#5C2632)',
      emoji: '🌿',
      badgeClass: 'badge-gg',
      badgeLabel: 'GG',
      addedBy: 'default',
      createdAt: null
    },
    {
      id: 'kloster-eberbach-steinberg',
      name: 'Kloster Eberbach — Steinberg',
      searchName: 'kloster eberbach steinberg hessische staatsweingueter hattenheim',
      region: 'rheingau',
      village: 'Hattenheim',
      type: '1G',
      grape: 'Riesling',
      classification: 'Erstes Gewächs',
      soil: 'Devonischer Schiefer',
      regionLabel: 'Hattenheim, Rheingau',
      description: 'Walled Cistercian Clos vineyard founded in 1135 AD. Hessische Staatsweingüter\'s Steinberg 1G is a benchmark of German wine heritage.',
      headerGradient: 'linear-gradient(135deg,#14362A,#1C4F3D)',
      emoji: '🏛',
      badgeClass: 'badge-1g',
      badgeLabel: '1G',
      addedBy: 'default',
      createdAt: null
    },
    {
      id: 'schloss-schoenborn-marcobrunn',
      name: 'Schloss Schönborn — Marcobrunn',
      searchName: 'schloss schoenborn marcobrunn erbach knyphausen',
      region: 'rheingau',
      village: 'Erbach',
      type: 'GG',
      grape: 'Riesling',
      classification: 'Grosses Gewächs',
      soil: 'Lehm, Kalkstein',
      regionLabel: 'Erbach, Rheingau',
      description: 'Historically the most significant Einzellage of the Rheingau, referenced in records since the 12th century. Rich, powerful style with excellent structure.',
      headerGradient: 'linear-gradient(135deg,#4A1F2A,#6E2840)',
      emoji: '⛲',
      badgeClass: 'badge-gg',
      badgeLabel: 'GG',
      addedBy: 'default',
      createdAt: null
    },
    {
      id: 'august-kesseler-hoellenberg',
      name: 'August Kesseler — Höllenberg',
      searchName: 'august kesseler hoellenberg assmannshausen pinot noir spaetburgunder',
      region: 'rheingau',
      village: 'Assmannshausen',
      type: 'GG',
      grape: 'Spätburgunder (Pinot Noir)',
      classification: 'Grosses Gewächs',
      soil: 'Roter Phyllitschiefer',
      regionLabel: 'Assmannshausen, Rheingau',
      description: 'The only red-wine GG site in the Rheingau. Pinot Noir on red Phyllit slate produces an elegant, Burgundy-inspired style unique in Germany.',
      headerGradient: 'linear-gradient(135deg,#5C2632,#7A304A)',
      emoji: '🍷',
      badgeClass: 'badge-gg',
      badgeLabel: 'GG',
      addedBy: 'default',
      createdAt: null
    },
    {
      id: 'weingut-wegeler-rothenberg',
      name: 'Weingut Wegeler — Rothenberg',
      searchName: 'weingut wegeler geisenheimer rothenberg geisenheim',
      region: 'rheingau',
      village: 'Geisenheim',
      type: 'GG',
      grape: 'Riesling',
      classification: 'Grosses Gewächs',
      soil: 'Lehm, Sand, Grauwacke',
      regionLabel: 'Geisenheim, Rheingau',
      description: 'A magnificent south-facing slope above the Rhine. Produces full-bodied, ripe Rieslings with substantial fruit weight and creamy texture.',
      headerGradient: 'linear-gradient(135deg,#14362A,#2D6A4F)',
      emoji: '🌾',
      badgeClass: 'badge-gg',
      badgeLabel: 'GG',
      addedBy: 'default',
      createdAt: null
    },
    {
      id: 'balthasar-ress-nussbrunnen',
      name: 'Balthasar Ress — Nussbrunnen',
      searchName: 'balthasar ress hattenheimer nussbrunnen hattenheim',
      region: 'rheingau',
      village: 'Hattenheim',
      type: 'GG',
      grape: 'Riesling',
      classification: 'Grosses Gewächs',
      soil: 'Lehm, Mergel',
      regionLabel: 'Hattenheim, Rheingau',
      description: 'A terraced site of exceptional depth. Renowned for opulent, creamy Riesling structure and the characteristic mineral spring note.',
      headerGradient: 'linear-gradient(135deg,#2A1030,#4A1F2A)',
      emoji: '🌰',
      badgeClass: 'badge-gg',
      badgeLabel: 'GG',
      addedBy: 'default',
      createdAt: null
    },
    {
      id: 'weingut-leitz-rottland',
      name: 'Weingut Leitz — Berg Rottland',
      searchName: 'weingut leitz ruedesheimer berg rottland ruedesheim',
      region: 'rheingau',
      village: 'Rüdesheim',
      type: '1G',
      grape: 'Riesling',
      classification: 'Erstes Gewächs',
      soil: 'Schiefer, Quarzit',
      regionLabel: 'Rüdesheim, Rheingau',
      description: 'A steep slate slope adjacent to Berg Schlossberg. Produces powerful, mineral Rieslings with firm acidity and impressive concentration.',
      headerGradient: 'linear-gradient(135deg,#1C4F3D,#2D6A4F)',
      emoji: '⛰️',
      badgeClass: 'badge-1g',
      badgeLabel: '1G',
      addedBy: 'default',
      createdAt: null
    },
    {
      id: 'domdechant-werner-domdechanei',
      name: 'Domdechant Werner — Domdechanei',
      searchName: 'domdechant werner hochheimer domdechanei hochheim',
      region: 'rheingau',
      village: 'Hochheim',
      type: 'GG',
      grape: 'Riesling',
      classification: 'Grosses Gewächs',
      soil: 'Lösslehm',
      regionLabel: 'Hochheim, Rheingau',
      description: 'The easternmost GG site in the Rheingau, bordering the Main. Warm, full-bodied wines with generous fruit and a long, spicy finish.',
      headerGradient: 'linear-gradient(135deg,#4A1F2A,#5C2632)',
      emoji: '🏘️',
      badgeClass: 'badge-gg',
      badgeLabel: 'GG',
      addedBy: 'default',
      createdAt: null
    }
  ];

  // ── Slug Generator ───────────────────────────────────────────────────────
  function toSlug(name) {
    return name.toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
  }

  // ── Badge Metadata ────────────────────────────────────────────────────────
  var BADGE_MAP = {
    'GG':      { cls: 'badge-gg',      label: 'GG' },
    '1G':      { cls: 'badge-1g',      label: '1G' },
    'organic': { cls: 'badge-organic', label: 'Organic' },
    'global':  { cls: 'badge-region',  label: 'Global' }
  };

  // Gradient presets for the admin add form
  var GRADIENT_PRESETS = {
    burgundy: 'linear-gradient(135deg,#4A1F2A,#5C2632)',
    maroon:   'linear-gradient(135deg,#4A1F2A,#7A304A)',
    violet:   'linear-gradient(135deg,#2A1030,#5C2632)',
    forest:   'linear-gradient(135deg,#14362A,#1C4F3D)',
    green:    'linear-gradient(135deg,#14362A,#2D6A4F)'
  };

  // ── Storage Helpers ──────────────────────────────────────────────────────
  function _read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { /* noop */ }
    return null;
  }

  function _write(arr) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (e) { /* noop — quota exceeded or unavailable */ }
  }

  // ── Public API ───────────────────────────────────────────────────────────

  function getAll() {
    return _read() || DEFAULT_WINERIES.slice();
  }

  function getById(id) {
    return getAll().filter(function (w) { return w.id === id; })[0] || null;
  }

  function addWinery(data) {
    var all = getAll();
    var badge = BADGE_MAP[data.type] || BADGE_MAP['global'];
    var winery = {
      id:             toSlug(data.name),
      name:           data.name,
      searchName:     (data.name + ' ' + (data.searchExtra || '')).toLowerCase(),
      region:         data.region || 'rheingau',
      village:        data.village || '',
      type:           data.type || 'GG',
      grape:          data.grape || '',
      classification: data.classification || '',
      soil:           data.soil || '',
      regionLabel:    data.regionLabel || '',
      description:    data.description || '',
      headerGradient: GRADIENT_PRESETS[data.gradientKey] || GRADIENT_PRESETS.burgundy,
      emoji:          data.emoji || '🍷',
      badgeClass:     badge.cls,
      badgeLabel:     data.type === 'global' ? (data.regionLabel.split(',')[0] || 'Global') : badge.label,
      addedBy:        'admin',
      createdAt:      new Date().toISOString()
    };
    // Prevent duplicate ids
    if (all.some(function (w) { return w.id === winery.id; })) {
      winery.id = winery.id + '-' + Date.now();
    }
    all.push(winery);
    _write(all);
    return winery;
  }

  function updateWinery(id, data) {
    var all = getAll();
    var idx = -1;
    all.forEach(function (w, i) { if (w.id === id) idx = i; });
    if (idx === -1) return false;
    var badge = BADGE_MAP[data.type] || BADGE_MAP[all[idx].type] || BADGE_MAP['global'];
    all[idx] = Object.assign({}, all[idx], data, {
      id:        id,
      badgeClass: badge.cls,
      badgeLabel: badge.label,
      addedBy:   all[idx].addedBy,
      createdAt: all[idx].createdAt
    });
    _write(all);
    return true;
  }

  function deleteWinery(id) {
    var all = getAll();
    var filtered = all.filter(function (w) { return w.id !== id; });
    if (filtered.length === all.length) return false;
    _write(filtered);
    return true;
  }

  function resetToDefaults() {
    _write(DEFAULT_WINERIES.slice());
  }

  return {
    getAll: getAll,
    getById: getById,
    addWinery: addWinery,
    updateWinery: updateWinery,
    deleteWinery: deleteWinery,
    resetToDefaults: resetToDefaults,
    GRADIENT_PRESETS: GRADIENT_PRESETS
  };
})();
