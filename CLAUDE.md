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

### Pages (5 HTML files)

| File | Purpose |
|------|---------|
| `index.html` | Landing page — has its own inline `<style>` block, does NOT link `vinebond.css` |
| `winery.html` | Searchable directory of wine estates |
| `book.html` | Tasting reservation form |
| `vinemap.html` | Interactive Google Maps map of Rheingau vineyard sites |
| `admin.html` | Admin dashboard — winery CRUD, document upload; auth-gated before DOM paint |

### JavaScript Modules (`/js/`)

All modules use global `window.*` namespaces (no module bundler).

- **`auth.js`** (`window.VineBondAuth`) — localStorage-backed role system (GUEST/USER/ADMIN). Admin detection: email domain `@vinebond.com` or `@winery.com`. Keys: `vb_role`, `vb_email`, `vb_display_name`.
- **`nav-role.js`** (`window.VineBondNav`) — Renders role-specific topbar CTAs into `#topbarCta` and into `#navSheet .nav-sheet-utility` (mobile sheet). Escapes user display names to prevent XSS.
- **`winery-data.js`** (`window.VineBondWineries`) — CRUD layer over `localStorage` (`vb_wineries`). Falls back to `DEFAULT_WINERIES` (6 pre-configured estates). Admin-added wineries persist across page loads.
- **`ui-enhancements.js`** — Page progress bar, back-to-top button, topbar `.scrolled` class, winery search filtering. Uses `requestAnimationFrame` throttling.
- **`theme.js`** (`window.VineBondTheme`) — OS-preference-only dark mode. Sets `data-theme` attribute on `<html>` based on `prefers-color-scheme`. No manual toggle — reacts to system changes in real time.
- **`orientation-lock.js`** — Injects a portrait-mode overlay to block landscape use on mobile.

#### VineMap Script Load Order

Scripts must load in this order in `vinemap.html`:

1. **`vinemap-data.js`** (`window.RHEINGAU_VINEYARDS`) — 14 classified vineyard sites (10 GG + 4 1G).
2. **`vinemap-boundary.js`** (`window.VB_RHEINGAU_BOUNDARY`) — Hessen state boundary polygon (lat/lng array) used for the map border overlay and panning restriction.
3. **`vinemap-config.js`** (`window.VB_MAP_CONFIG`) — Shared config: center coords, zoom levels, API key placeholder.
4. **`vinemap-config.local.js`** — Real Google Maps API key override (**gitignored**, optional).
5. **`vinemap-detect.js`** (`window.VineMapDetect`) — Dynamically loads Google Maps JS API. Shows an inline error if the key is missing or the script fails.
6. **`vinemap-google.js`** — Google Maps renderer. Exposes the shared renderer interface (`init`, `addMarker`, `showMarker`, `hideMarker`, `openPopup`, `setView`, `setDarkMode`, etc.).
7. **`vinemap-adapter.js`** — Platform-agnostic layer wiring filters, search, popups, and labels to whichever renderer is active.
8. **`vinemap.js`** — Orchestrator: triggers the loader, initialises the adapter once the renderer is ready.

Google Maps is the only supported renderer. There is no Leaflet fallback.

### Styling

- **`css/vinebond.css`** — Shared stylesheet for all pages except `index.html`. Actual CSS custom property names:
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
- **Admin auth guard:** `admin.html` runs an inline script before the `<body>` to redirect non-admins to the index — this intentionally blocks DOM paint to prevent flash.
- **Google Maps API key:** Placeholder in `vinemap-config.js`; real key goes in `vinemap-config.local.js` (gitignored).
- **Document uploads** in admin are demo-only: files are stored in `localStorage` (`vb_verification_docs`).
- **Winery ID generation** uses kebab-case slugs with umlaut substitution (ä→ae, ö→oe, ü→ue, ß→ss).
- **CSS class prefix** for admin/role UI: `vb-admin-`, `vb-role-`. General components use `vb-`.
- **vinemap.html z-index stack:** mobile search bar (`#vmMsbWrapper`) and filter row (`#vmFilterRow`) sit at z-index 1001; nav backdrop is 1099; nav sheet (`#navSheet`) is 1100. Do not lower the nav sheet below 1100 or the sheet will render behind the map overlays.
- **Deployment:** Netlify (`netlify.toml`). SPA-style redirect: all routes → `index.html`.

## Testing

Six spec files in `tests/`:
- **`auth.spec.js`** — Role detection, localStorage persistence, nav CTA rendering per role, admin access control, and logout.
- **`winery-filter-cascade.spec.js`** — Cascading filter dropdown behavior on `winery.html` (11 test cases: village/grape/classification cross-filtering, clear-all, zero-option hiding, result count).
- **`vinemap-google.spec.js`** — Google Maps renderer tests.
- **`regression-nav-responsive.spec.js`** — Nav breakpoint regression: `.nav-primary` hidden ≤1024px, hamburger sheet contains all links, no JS errors across 5 pages.
- **`regression-nav-boundary.spec.js`** — Exact pixel boundary: nav-primary visible at 1025px, hidden at 1024px.
- **`bug-fixes.spec.js`** — Hamburger right-alignment across widths, scroll-lock layout shift, filter bar stickiness.

Config: `playwright.config.js` (Chromium only, 15s timeout, screenshots on failure).

## Regression Testing

After any change touching more than two components or files (styling overhauls, JS module edits, new features), always trigger the `regression-tester` subagent **in the background** (`run_in_background: true`) so it runs in its own context window without consuming tokens from the current conversation. Do not wait for it — continue responding to the user immediately and let the notification arrive when it finishes.
