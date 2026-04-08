# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VineBond is a static multi-page wine tourism platform (exploring vineyards, booking experiences, discovering terroir). No build system, no backend — pure HTML/CSS/JavaScript with localStorage for state.

## Commands

```bash
npm run serve                                        # Python HTTP server at localhost:8000
npm test                                             # Playwright E2E tests (headless)
npm run test:headed                                  # Playwright with browser UI visible
npx playwright test tests/auth.spec.js               # Run a single test file
npx playwright test --grep "TC-01"                   # Run tests matching a pattern
```

Playwright auto-starts the Python server before running tests.

## Architecture

### Pages (7 HTML files)

| File | Purpose |
|------|---------|
| `index.html` | Landing page — has its own inline `<style>` block, does NOT link `vinebond.css` |
| `login.html` | Email-based auth; role assigned by email domain |
| `winery.html` | Searchable directory of wine estates |
| `book.html` | Tasting reservation form |
| `vinemap.html` | Interactive Leaflet.js map of Rheingau vineyard sites |
| `vineclub.html` | VineClub loyalty membership — 3-step registration + certificate download |
| `admin.html` | Admin dashboard — winery CRUD, document upload; auth-gated before DOM paint |

### JavaScript Modules (`/js/`)

All modules use global `window.*` namespaces (no module bundler).

- **`auth.js`** (`window.VineBondAuth`) — localStorage-backed role system (GUEST/USER/ADMIN). Admin detection: email domain `@vinebond.com` or `@winery.com`. Keys: `vb_role`, `vb_email`, `vb_display_name`.
- **`nav-role.js`** (`window.VineBondNav`) — Renders role-specific topbar CTAs into `#topbarCta`. Escapes user display names to prevent XSS.
- **`winery-data.js`** (`window.VineBondWineries`) — CRUD layer over `localStorage` (`vb_wineries`). Falls back to `DEFAULT_WINERIES` (6 pre-configured estates). Admin-added wineries persist across page loads.
- **`vineclub.js`** — Multi-step registration, Stripe.js card tokenisation, Canvas API certificate generation (800×560px PNG download), URL hash routing (`#certificate/{tier}`).
- **`ui-enhancements.js`** — Page progress bar, back-to-top button, topbar `.scrolled` class, winery search filtering. Uses `requestAnimationFrame` throttling.
- **`theme.js`** (`window.VineBondTheme`) — OS-preference-only dark mode. Sets `data-theme` attribute on `<html>` based on `prefers-color-scheme`. No manual toggle — reacts to system changes in real time.
- **`orientation-lock.js`** — Injects a portrait-mode overlay to block landscape use on mobile.

#### VineMap Multi-Renderer System

The map uses an adapter pattern supporting multiple renderers (Google Maps for Android/Windows, Leaflet as fallback). Scripts must load in this order in `vinemap.html`:

1. **`vinemap-data.js`** (`window.RHEINGAU_VINEYARDS`) — 14 classified vineyard sites (10 GG + 4 1G) shared by all renderers.
2. **`vinemap-config.js`** (`window.VB_MAP_CONFIG`) — Shared config: center coords, zoom levels, API key placeholder.
3. **`vinemap-config.local.js`** — Real Google Maps API key override (**gitignored**, optional). Copy pattern from `vinemap-config.js` comments.
4. **`vinemap-detect.js`** — Platform detection + dynamic library loader. Override via `localStorage.setItem('vb_map_provider', 'google' | 'leaflet')`.
5. **`vinemap-leaflet.js`** / **`vinemap-google.js`** — Renderer implementations. Each exposes the same interface (`init`, `addMarker`, `showMarker`, `hideMarker`, `openPopup`, `setView`, `setDarkMode`, etc.).
6. **`vinemap-adapter.js`** — Platform-agnostic layer wiring filters, search, popups, and labels to whichever renderer is active.
7. **`vinemap.js`** — Orchestrator: detects platform, loads renderer, initialises the adapter.

### Styling

- **`css/vinebond.css`** — Shared stylesheet for all pages except `index.html`. Actual CSS custom property names differ from the old list:
  - Colors: `--vb-forest` (#1C4F3D), `--vb-burgundy` (#5C2632), `--vb-leaf-green` (#2D6A4F), `--vb-deep-maroon` (#4A1F2A), `--vb-cream` (#EDE8E0), `--gold` (#D4AF37)
  - Shadows: `--vb-shadow-sm/md/lg/el` (green-tinted, rgba 28,79,61)
  - Radii: `--radius-sm` (8px) through `--radius-2xl` (30px)
  - Motion: `--transition: 0.28s cubic-bezier(0.4,0,0.2,1)`
  - Typography: `--text-xs` through `--text-4xl` via `clamp()`
- **`design-system/tokens.css`** — Extended token definitions (available for future use).
- **`design-system/components.css`** — Pre-built component classes (`.vb-btn`, `.vb-card`, `.vb-chip`, `.vb-avatar`, `.vb-admin-badge`, `.vb-sr-only`). Includes `prefers-reduced-motion` and dark-mode support.

### Assets

- `/assets/figma-elements/` — SVG icons, custom wine glass cursor, map marker, logo

## Key Conventions

- **No CSS framework** — all styling is custom via `vinebond.css` and the `design-system/` folder.
- **Winery data source:** `window.VineBondWineries` (localStorage-backed) for the directory; `window.RHEINGAU_VINEYARDS` in `vinemap-data.js` for the map. These are separate datasets.
- **Admin auth guard:** `admin.html` runs an inline script before the `<body>` to redirect non-admins to `login.html` — this intentionally blocks DOM paint to prevent flash.
- **Google Maps API key:** Placeholder in `vinemap-config.js`; real key goes in `vinemap-config.local.js` (gitignored). Override provider via `localStorage.setItem('vb_map_provider', 'google' | 'leaflet')`.
- **Stripe key:** `pk_test_REPLACE_WITH_YOUR_STRIPE_KEY` in `vineclub.js` — must be replaced for real payments.
- **Document uploads** in admin are demo-only: files are stored in `localStorage` (`vb_verification_docs`). Production would need server-side storage.
- **Winery ID generation** uses kebab-case slugs with umlaut substitution (ä→ae, ö→oe, ü→ue, ß→ss).
- **CSS class prefix** for new admin/role UI: `vb-admin-`, `vb-role-`. General components use `vb-`.
- Leaflet.js is CDN-loaded in `vinemap.html` — no local copy. Google Maps is dynamically loaded by `vinemap-detect.js`. Stripe.js is CDN-loaded in `vineclub.html`.
- **Deployment:** Netlify (`netlify.toml`). SPA-style redirect: all routes → `index.html`.

## Testing

Three spec files in `tests/`:
- **`auth.spec.js`** — Role detection, localStorage persistence, nav CTA rendering per role, admin access control, and logout.
- **`winery-filter-cascade.spec.js`** — Cascading filter dropdown behavior on `winery.html` (11 test cases: village/grape/classification cross-filtering, clear-all, zero-option hiding, result count).
- **`vinemap-google.spec.js`** — Google Maps renderer tests.

Config: `playwright.config.js` (Chromium only, 15s timeout, screenshots on failure).

## Regression Testing

After any change touching more than two components or files (styling overhauls, JS module edits, new features), always trigger the `regression-tester` subagent **in the background** (`run_in_background: true`) so it runs in its own context window without consuming tokens from the current conversation. Do not wait for it — continue responding to the user immediately and let the notification arrive when it finishes.
