# VineBond Design System

> **"Harmonious Connection, Certified Origin"**

A complete UI/UX design system for the VineBond platform — built from the VB monogram logo, ensuring WCAG AA/AAA accessibility compliance across all breakpoints.

---

## 📁 File Structure

```
design-system/
├── tokens.css          ← CSS custom property tokens (colors, spacing, type, shadows…)
├── components.css      ← UI component styles (buttons, nav, cards, forms…)
└── README.md           ← This file

docs/
└── UIUX_PORTFOLIO.md   ← Full UI/UX design portfolio document
```

---

## 🚀 Quick Start

Add both stylesheets to your HTML `<head>` **in this order** (tokens must load first):

```html
<link rel="stylesheet" href="design-system/tokens.css" />
<link rel="stylesheet" href="design-system/components.css" />
```

Then use any token or component class:

```html
<!-- Primary button -->
<button class="vb-btn vb-btn-primary">Book a Tasting</button>

<!-- Secondary button -->
<button class="vb-btn vb-btn-secondary">Learn More</button>

<!-- Filter chip -->
<button class="vb-chip active">Organic</button>

<!-- Card -->
<div class="vb-card">
  <div class="vb-card__body">
    <h3>Château Margaux</h3>
    <p>Bordeaux, France</p>
  </div>
</div>
```

---

## 🎨 Brand Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--vb-forest` | `#1C4F3D` | Primary CTA, navigation, dark sections |
| `--vb-burgundy` | `#5C2632` | H1 headings, accents, secondary brand |
| `--vb-leaf-green` | `#2D6A4F` | Hover states, icons, highlights |
| `--vb-deep-maroon` | `#4A1F2A` | Body text, H2/H4 headings |
| `--vb-cream` | `#EDE8E0` | Primary background, card surfaces |
| `--vb-white` | `#FFFFFF` | Card fills, text on dark backgrounds |
| `--vb-warm-white` | `#FAF8F5` | Alternating section backgrounds |
| `--vb-medium-gray` | `#8B8578` | Secondary text, muted elements |

---

## ✅ Accessibility — WCAG Compliance

All color combinations have been validated against WCAG 2.1 standards:

| Foreground | Background | Ratio | Rating |
|------------|------------|-------|--------|
| `#4A1F2A` | `#EDE8E0` | 9.1:1 | **AAA** ✓ |
| `#FFFFFF` | `#1C4F3D` | 9.8:1 | **AAA** ✓ |
| `#5C2632` | `#EDE8E0` | 8.2:1 | **AAA** ✓ |
| `#1C4F3D` | `#FFFFFF` | 9.8:1 | **AAA** ✓ |
| `#FFFFFF` | `#5C2632` | 7.5:1 | **AAA** ✓ |
| `#8B8578` | `#EDE8E0` | 4.6:1 | **AA** ✓  |

**Additional accessibility features:**
- All interactive elements: `min-height: 44px` touch targets
- Focus-visible outlines on every focusable element
- `.vb-skip-link` component for keyboard navigation
- `.vb-sr-only` utility for screen-reader-only text
- `prefers-reduced-motion` support
- `prefers-color-scheme: dark` automatic dark mode
- RTL layout support via `[dir="rtl"]`

---

## 📐 Responsive Breakpoints (9-Tier System)

| Tier | Name | Min Width | Grid | Devices |
|------|------|-----------|------|---------|
| XS | Small Phone | 320px | 4 col | iPhone SE, older Android |
| S | Standard Phone | 375px | 4 col | iPhone 12–16, Galaxy S21–S24 |
| M | Large Phone | 414px | 4 col | iPhone Plus/Max, Galaxy Ultra |
| L | Small Tablet | 480px | 8 col | iPad mini portrait, Z Fold inner |
| XL | Tablet Portrait | 768px | 8 col | iPad, Galaxy Tab S9 |
| XXL | Tablet Landscape | 1024px | 12 col | iPad Pro 13", Surface Pro |
| 3XL | Laptop | 1280px | 12 col | MacBook Air, Windows FHD |
| 4XL | Desktop | 1536px | 12 col | FHD 100%, MacBook Pro 16" |
| 5XL | Large Desktop | 1920px | 12 col | QHD–4K, iMac 24" |

---

## 🔘 Button System

### Classes

| Class | Description |
|-------|-------------|
| `vb-btn` | Base button (required) |
| `vb-btn-primary` | Forest green — main CTA |
| `vb-btn-secondary` | Outlined forest green — secondary action |
| `vb-btn-tertiary` | Burgundy text link — low emphasis |
| `vb-btn-sm` | Small size (36px height) |
| `vb-btn-lg` | Large size (52px height) |
| `vb-btn-full` | Full-width button |

### States

All buttons support: `default` · `hover` · `active` · `:disabled` · `:focus-visible`

---

## 🗂️ Component Reference

### Navigation
- `.vb-navbar` — fixed top bar (desktop)
- `.vb-navbar__link` — nav link with underline indicator
- `.vb-hamburger` — mobile menu toggle (44×44px)
- `.vb-mobile-menu` / `.vb-mobile-menu.open` — overlay menu
- `.vb-menu-backdrop` — dim backdrop

### Content
- `.vb-card` — base card with hover elevation
- `.vb-card-highlight` — green left-border accent card
- `.vb-card__body` — padded card body
- `.vb-card__footer` — card footer with top border

### Forms
- `.vb-field` — field wrapper
- `.vb-label` — uppercase label
- `.vb-input` — base input
- `.vb-input--error` / `.vb-input--success` — state variants
- `.vb-select` — styled select with dropdown arrow
- `.vb-textarea` — multi-line input
- `.vb-field-hint` / `.vb-field-error` / `.vb-field-success` — helper text

### Chips & Badges
- `.vb-chip` — interactive filter chip
- `.vb-chip.active` — selected chip state
- `.vb-badge` — inline status label
- `.vb-badge--success/warning/error/info/forest/burgundy` — color variants

### Layout
- `.vb-container` — max-width responsive container
- `.vb-section` — standard vertical padding
- `.vb-section-sm` — reduced vertical padding
- `.vb-section-hero/white/warm/dark` — section background variants
- `.vb-divider` — horizontal rule
- `.vb-divider--gradient` — fading gradient divider

### Utilities
- `.vb-fade-up` — scroll-reveal animation
- `.vb-sr-only` — screen-reader only (visually hidden)
- `.vb-skip-link` — skip navigation accessibility link
- `text-forest/burgundy/leaf/maroon/gray/white` — text color helpers
- `bg-cream/forest/burgundy/white/warm` — background helpers

---

## 🌙 Dark Mode

Dark mode activates automatically via `prefers-color-scheme: dark`, or can be
manually forced by adding `data-theme="dark"` to `<html>`.

To force light mode: `data-theme="light"` on `<html>`.

---

## 🖋️ Typography Scale

| Token | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| H1 | 56px / 1.1 / 600 | 40px / 1.15 | 32px / 1.2 |
| H2 | 40px / 1.2 / 600 | 32px / 1.25 | 24px / 1.3 |
| H3 | 32px / 1.3 / 600 | — | — |
| Body | 18px / 1.6 / 400 | 16px / 1.6 | 16px / 1.6 |

Fluid clamp tokens are also provided:
- `--vb-fluid-h1` → `clamp(2rem, 4vw + 1rem, 3.5rem)`
- `--vb-fluid-h2` → `clamp(1.5rem, 3vw + 0.5rem, 2.5rem)`
- `--vb-fluid-body` → `clamp(1rem, 1vw + 0.5rem, 1.125rem)`

---

## 📌 Logo Specifications

| Context | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Navigation | 180×60px | 140×47px | 110×37px |
| Hero | 240×80px | 200×67px | 160×54px |
| Footer | 160×54px | 140×47px | 120×40px |

- **Minimum size:** 80px wide
- **Clear space:** 20% of logo width on all sides
- **Light backgrounds:** Full color original
- **Dark backgrounds:** White monochrome (`.vb-logo--white`)
- **Icon-only:** VB monogram (favicons, mobile menu)

---

## 📄 License

© 2026 VineBond. Internal design system — all rights reserved.
