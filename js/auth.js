/* ── VineBond Auth Module ──────────────────────────────────────────────────
   window.VineBondAuth
   Manages role-based authentication state via localStorage.
   Roles: GUEST (unauthenticated) | USER (regular) | ADMIN (corporate email)
   Admin domains: vinebond.com, winery.com
   localStorage keys: vb_role, vb_email, vb_display_name
   ─────────────────────────────────────────────────────────────────────────── */

window.VineBondAuth = (function () {
  'use strict';

  var ROLES = { GUEST: 'GUEST', USER: 'USER', ADMIN: 'ADMIN' };
  var ADMIN_DOMAINS = ['vinebond.com', 'winery.com'];
  var KEYS = { role: 'vb_role', email: 'vb_email', name: 'vb_display_name' };

  // ── Helpers ──────────────────────────────────────────────────────────────

  function detectRole(email) {
    if (!email || typeof email !== 'string') return ROLES.USER;
    var domain = email.toLowerCase().split('@')[1] || '';
    for (var i = 0; i < ADMIN_DOMAINS.length; i++) {
      if (domain === ADMIN_DOMAINS[i]) return ROLES.ADMIN;
    }
    return ROLES.USER;
  }

  function displayNameFromEmail(email) {
    if (!email || typeof email !== 'string') return 'User';
    var local = email.split('@')[0] || 'User';
    // Capitalise first letter, replace dots/underscores/hyphens with spaces
    return local.replace(/[._-]/g, ' ')
                .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  // ── Public API ───────────────────────────────────────────────────────────

  function setRole(email) {
    var role = detectRole(email);
    try {
      localStorage.setItem(KEYS.role, role);
      localStorage.setItem(KEYS.email, email || '');
      localStorage.setItem(KEYS.name, displayNameFromEmail(email));
    } catch (e) {
      // localStorage unavailable (private browsing hard limit) — silent fail
    }
  }

  function getRole() {
    try {
      return localStorage.getItem(KEYS.role) || ROLES.GUEST;
    } catch (e) {
      return ROLES.GUEST;
    }
  }

  function getEmail() {
    try { return localStorage.getItem(KEYS.email) || null; } catch (e) { return null; }
  }

  function getDisplayName() {
    try { return localStorage.getItem(KEYS.name) || null; } catch (e) { return null; }
  }

  function isAdmin() {
    return getRole() === ROLES.ADMIN;
  }

  function isLoggedIn() {
    return getRole() !== ROLES.GUEST;
  }

  function logout() {
    try {
      localStorage.removeItem(KEYS.role);
      localStorage.removeItem(KEYS.email);
      localStorage.removeItem(KEYS.name);
    } catch (e) { /* noop */ }
    window.location.href = 'index.html';
  }

  return {
    ROLES: ROLES,
    detectRole: detectRole,
    setRole: setRole,
    getRole: getRole,
    getEmail: getEmail,
    getDisplayName: getDisplayName,
    isAdmin: isAdmin,
    isLoggedIn: isLoggedIn,
    logout: logout
  };
})();
