/* ── VineBond Nav Role Module ──────────────────────────────────────────────
   window.VineBondNav
   Reads VineBondAuth.getRole() on DOMContentLoaded and rewrites #navUtility
   to reflect the authenticated user's role state.
   Also updates #navSheet .nav-sheet-utility when present (all pages).
   Depends on: js/auth.js (must load first)
   ─────────────────────────────────────────────────────────────────────────── */

window.VineBondNav = (function () {
  'use strict';

  // ── SVG Icon Snippets ─────────────────────────────────────────────────────
  var ICON_DASHBOARD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:16px;height:16px;" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>';
  var ICON_BOOK      = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:16px;height:16px;" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  var ICON_SIGNOUT   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:16px;height:16px;" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';
  var ICON_SIGNIN    = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:16px;height:16px;" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

  // ── Build topbar HTML for each role ──────────────────────────────────────

  function _guestCta() {
    return '';
  }

  function _userCta(name) {
    var initials = (name || 'U').split(' ').slice(0, 2)
      .map(function (w) { return w[0].toUpperCase(); }).join('');
    return '<div class="vb-user-chip">' +
             '<div class="vb-avatar" aria-hidden="true">' + initials + '</div>' +
             '<span class="vb-display-name">' + _esc(name) + '</span>' +
           '</div>' +
           '<a href="book.html" class="btn btn-primary btn-sm">' +
             ICON_BOOK + '<span>My Bookings</span>' +
           '</a>' +
           '<button class="btn btn-secondary btn-sm" onclick="VineBondAuth.logout()">' +
             ICON_SIGNOUT + '<span>Sign Out</span>' +
           '</button>';
  }

  function _adminCta() {
    return '<a href="admin.html" class="btn btn-primary btn-sm">' +
             ICON_DASHBOARD + '<span>Dashboard</span>' +
           '</a>' +
           '<span class="vb-admin-badge">Admin</span>' +
           '<button class="btn btn-secondary btn-sm" onclick="VineBondAuth.logout()">' +
             ICON_SIGNOUT + '<span>Sign Out</span>' +
           '</button>';
  }

  function _mobGuestCta() {
    return '';
  }

  function _mobUserCta(name) {
    var initials = (name || 'U').split(' ').slice(0, 2)
      .map(function (w) { return w[0].toUpperCase(); }).join('');
    return '<div class="vb-user-chip">' +
             '<div class="vb-avatar" aria-hidden="true">' + initials + '</div>' +
             '<span class="vb-display-name">' + _esc(name) + '</span>' +
           '</div>' +
           '<button class="btn btn-secondary" onclick="VineBondAuth.logout()">' +
             ICON_SIGNOUT + '<span>Sign Out</span>' +
           '</button>';
  }

  function _mobAdminCta() {
    return '<a href="admin.html" class="btn btn-primary">' +
             ICON_DASHBOARD + '<span>Dashboard</span>' +
           '</a>' +
           '<button class="btn btn-secondary" onclick="VineBondAuth.logout()">' +
             ICON_SIGNOUT + '<span>Sign Out</span>' +
           '</button>';
  }

  // ── XSS Guard ────────────────────────────────────────────────────────────
  function _esc(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── Main Render ──────────────────────────────────────────────────────────
  function render() {
    if (typeof window.VineBondAuth === 'undefined') return;

    var role = VineBondAuth.getRole();
    var name = VineBondAuth.getDisplayName() || 'Guest';
    var cta  = document.getElementById('navUtility');

    if (cta) {
      if (role === VineBondAuth.ROLES.ADMIN) {
        cta.innerHTML = _adminCta();
      } else if (role === VineBondAuth.ROLES.USER) {
        cta.innerHTML = _userCta(name);
      } else {
        cta.innerHTML = _guestCta();
      }
    }

    // Mobile sheet utility (all pages)
    var mobCta = document.querySelector('#navSheet .nav-sheet-utility');
    if (mobCta) {
      if (role === VineBondAuth.ROLES.ADMIN) {
        mobCta.innerHTML = _mobAdminCta();
      } else if (role === VineBondAuth.ROLES.USER) {
        mobCta.innerHTML = _mobUserCta(name);
      } else {
        mobCta.innerHTML = _mobGuestCta();
      }
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, { once: true });
  } else {
    render();
  }

  return { render: render };
})();
