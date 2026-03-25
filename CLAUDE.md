# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VineBond is a static multi-page website for wine tourism (exploring vineyards, booking experiences, discovering terroir). No build system, no package manager, no backend — pure HTML/CSS/JavaScript.

## Running Locally

Serve files via any HTTP server from the project root:

```bash
python -m http.server 8000
# or use VS Code Live Server extension
```

Opening HTML files via `file://` protocol also works — the i18n engine has a fallback for this case.

## Architecture

### Pages
Five standalone HTML pages: `index.html` (landing), `login.html`, `winery.html` (directory), `book.html` (booking), `vinemap.html` (interactive map).

### Shared JavaScript (`/js/`)
- **`i18n.js`** — Custom internationalization engine. Loads translations from `/assets/i18n/translations.json` (HTTP) or falls back to `window.VB_TRANSLATIONS_FALLBACK` (file://). Applies translations via HTML data attributes (`data-i18n`, `data-i18n-placeholder`, `data-i18n-html`, `data-i18n-page-title`). Dispatches `vb:i18n:ready` and `vb:i18n:changed` events on `document`. Prevents FOUC via `html.i18n-loading` class.
- **`ui-enhancements.js`** — Page progress bar, back-to-top button, topbar scroll state, mobile menu ESC key handler. Uses `requestAnimationFrame` throttling.
- **`vinemap.js`** — Leaflet.js 1.9.x integration for the interactive map. Contains hardcoded `RHEINGAU_VINEYARDS` dataset (40+ entries) with GG/1G classification, coordinates, soil/grape/altitude data, and bilingual descriptions.

### Styling (`/css/vinebond.css`)
Single shared stylesheet with CSS custom properties for the design system:
- Colors: `--burgundy` (#6B1F3C), `--gold` (#D4AF37), `--green` (#4A5D3E), `--terracotta`, `--oak`, `--cream`
- Fluid typography via `clamp()` (`--text-xs` through `--text-4xl`)
- Reusable component classes: `.btn`, `.btn-gold`, `.btn-burgundy`, `.winery-card`, `.filter-chip`, `.badge-gg`, `.badge-1g`, `.badge-organic`
- Custom wine glass SVG cursor applied site-wide

### Assets (`/assets/`)
- `/assets/figma-elements/` — SVG icons and design assets (custom cursor, map marker, buttons, logo)
- `/assets/i18n/translations.json` — Translation strings (English primary); `/assets/i18n/revise.json` — German reference

### Figma Integration
`.vscode/mcp.json` configures a Figma MCP server for design asset management.

## Key Conventions

- All vineyard data lives in `vinemap.js` (`RHEINGAU_VINEYARDS` array) — no external data source.
- Translations go in `/assets/i18n/translations.json`; the i18n engine reads keys matching the `data-i18n` attributes in HTML.
- German translations are present in `revise.json` but not currently active in the site.
- Map library (Leaflet.js) is loaded via CDN in `vinemap.html` — no local copy.
