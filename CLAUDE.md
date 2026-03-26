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

Opening HTML files via `file://` protocol also works.

## Architecture

### Pages
Five standalone HTML pages: `index.html` (landing), `login.html`, `winery.html` (directory), `book.html` (booking), `vinemap.html` (interactive map).

### Shared JavaScript (`/js/`)
- **`ui-enhancements.js`** — Page progress bar, back-to-top button, topbar scroll state, mobile menu ESC key handler. Uses `requestAnimationFrame` throttling.
- **`vinemap.js`** — Leaflet.js 1.9.x integration for the interactive map. Contains hardcoded `RHEINGAU_VINEYARDS` dataset (40+ entries) with GG/1G classification, coordinates, soil/grape/altitude data, and bilingual descriptions.
- **`vineclub.js`** — Loyalty membership module: credit calculation, tier logic, multi-step registration form, Stripe.js tokenisation, Canvas API certificate generation and download.

### Styling (`/css/vinebond.css`)
Single shared stylesheet with CSS custom properties for the design system:
- Colors: `--burgundy` (#6B1F3C), `--gold` (#D4AF37), `--green` (#4A5D3E), `--terracotta`, `--oak`, `--cream`
- Fluid typography via `clamp()` (`--text-xs` through `--text-4xl`)
- Reusable component classes: `.btn`, `.btn-gold`, `.btn-burgundy`, `.winery-card`, `.filter-chip`, `.badge-gg`, `.badge-1g`, `.badge-organic`
- Custom wine glass SVG cursor applied site-wide

### Assets (`/assets/`)
- `/assets/figma-elements/` — SVG icons and design assets (custom cursor, map marker, buttons, logo)

## Key Conventions

- All vineyard data lives in `vinemap.js` (`RHEINGAU_VINEYARDS` array) — no external data source.
- Map library (Leaflet.js) is loaded via CDN in `vinemap.html` — no local copy.
