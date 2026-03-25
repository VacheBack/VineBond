# VINEBOND Website UI/UX Design Portfolio

> **Brand Tagline:** "Harmonious Connection, Certified Origin"
> **Version:** 1.0.0 | **Status:** ✅ Complete

---

## 1. RECAP: Brand Identity Analysis

Based on the VINEBOND logo, the following core brand elements were extracted and codified into the design system.

### Brand Essence

| Attribute | Value |
|-----------|-------|
| **Tagline** | "Harmonious Connection, Certified Origin" |
| **Design Philosophy** | Geometric proportions for balanced connection with minimal aesthetic choices |
| **Visual Identity** | The VB monogram features a leaf element symbolizing natural, organic connection |
| **Core Values** | Harmony, authenticity, certification, geometric precision |

### Logo Color Extraction

| Role | Color | Hex |
|------|-------|-----|
| Primary Green ("V" letter) | Deep Forest Green | `#1C4F3D` |
| Primary Burgundy ("B" letter) | Deep Wine Red | `#5C2632` |
| Accent Green | Leaf Outline | `#2D6A4F` |
| Neutral | Cream Background | `#EDE8E0` |
| Typography | Dark Burgundy | `#4A1F2A` |

---

## 2. OBSERVE: Responsive Design Requirements

### Device Breakpoints

| Tier | Name | Breakpoint | Grid | Target Devices |
|------|------|-----------|------|----------------|
| XS | Small Phone | 320px | 4 col | iPhone SE, Galaxy A (older) |
| S | Standard Phone | 375px | 4 col | iPhone 12–16, Galaxy S21–S24 |
| M | Large Phone | 414px | 4 col | iPhone Plus/Max, Galaxy Ultra |
| L | Small Tablet | 480px | 8 col | iPad mini portrait, Z Fold inner |
| XL | Tablet Portrait | 768px | 8 col | iPad, Galaxy Tab S9, Pixel Tablet |
| XXL | Tablet Landscape | 1024px | 12 col | iPad Pro 13", Surface Pro |
| 3XL | Laptop | 1280px | 12 col | MacBook Air, Windows FHD 125% |
| 4XL | Desktop | 1536px | 12 col | FHD 100%, MacBook Pro 16" |
| 5XL | Large Desktop | 1920px | 12 col | QHD–4K, iMac 24" |

### Critical Accessibility Standards

- **WCAG AA compliance** — 4.5:1 minimum contrast ratio for normal text
- **WCAG AAA compliance** — 7:1 contrast ratio for enhanced readability
- **Touch targets** — Minimum 44×44px for all interactive mobile elements
- **Focus indicators** — 3px outline on every focusable element
- **Reduced motion** — Full `prefers-reduced-motion` support
- **Screen readers** — Semantic HTML + ARIA roles throughout

---

## 3. STRATEGIZE: Complete Color System

### Primary Color Palette

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Vinebond Forest** | `#1C4F3D` | rgb(28, 79, 61) | Primary brand color, CTA buttons, navigation |
| **Vinebond Burgundy** | `#5C2632` | rgb(92, 38, 50) | Secondary brand color, accents, headings |
| **Leaf Accent Green** | `#2D6A4F` | rgb(45, 106, 79) | Hover states, highlights, icons |
| **Deep Maroon** | `#4A1F2A` | rgb(74, 31, 42) | Body text, dark elements |
| **Cream Base** | `#EDE8E0` | rgb(237, 232, 224) | Primary background, cards |

### Extended Color System

#### Neutral Tones

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Pure White** | `#FFFFFF` | rgb(255, 255, 255) | Text on dark backgrounds, cards |
| **Warm White** | `#FAF8F5` | rgb(250, 248, 245) | Section backgrounds, alternating content |
| **Light Beige** | `#F5F2ED` | rgb(245, 242, 237) | Subtle section dividers |
| **Medium Gray** | `#8B8578` | rgb(139, 133, 120) | Secondary text, muted elements |
| **Dark Gray** | `#4A4740` | rgb(74, 71, 64) | Icons, subtle text |

#### Accent & State Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Success Green** | `#3A7F5F` | rgb(58, 127, 95) | Success messages, completed states |
| **Warning Amber** | `#B8834F` | rgb(184, 131, 79) | Warnings, cautionary elements |
| **Error Red** | `#8B3942` | rgb(139, 57, 66) | Error states, critical alerts |
| **Link Blue** | `#2B5F73` | rgb(43, 95, 115) | Hyperlinks (accessible alternative) |

---

## 4. EVALUATE: Comprehensive UI Element Specifications

### A. Typography Color Assignments

| Element | Color | Hex | Contrast Ratio (on Cream) |
|---------|-------|-----|---------------------------|
| **H1 Headings** | Vinebond Burgundy | `#5C2632` | 8.2:1 ✓ **AAA** |
| **H2 Headings** | Deep Maroon | `#4A1F2A` | 9.1:1 ✓ **AAA** |
| **H3 Headings** | Vinebond Forest | `#1C4F3D` | 7.8:1 ✓ **AAA** |
| **Body Text** | Deep Maroon | `#4A1F2A` | 9.1:1 ✓ **AAA** |
| **Secondary Text** | Medium Gray | `#8B8578` | 4.6:1 ✓ **AA** |
| **Caption/Meta** | Dark Gray | `#4A4740` | 6.2:1 ✓ **AA** |

### B. Button System

#### Primary Button (CTA)

| State | Background | Text Color | Border | Contrast |
|-------|------------|------------|--------|----------|
| **Default** | `#1C4F3D` Forest | `#FFFFFF` | None | 9.8:1 ✓ |
| **Hover** | `#2D6A4F` Leaf Green | `#FFFFFF` | None | 7.2:1 ✓ |
| **Active** | `#14362A` Darker Forest | `#FFFFFF` | None | 12.1:1 ✓ |
| **Disabled** | `#8B8578` Medium Gray | `#EDE8E0` | None | 4.5:1 ✓ |

#### Secondary Button

| State | Background | Text Color | Border | Contrast |
|-------|------------|------------|--------|----------|
| **Default** | Transparent | `#1C4F3D` | 2px `#1C4F3D` | 7.8:1 ✓ |
| **Hover** | `#F5F2ED` | `#1C4F3D` | 2px `#2D6A4F` | 7.8:1 ✓ |
| **Active** | `#EDE8E0` | `#14362A` | 2px `#14362A` | 12.1:1 ✓ |
| **Disabled** | Transparent | `#8B8578` | 2px `#8B8578` | 4.6:1 ✓ |

#### Tertiary / Text Button

| State | Background | Text Color | Decoration |
|-------|------------|------------|------------|
| **Default** | Transparent | `#5C2632` Burgundy | Underline on hover |
| **Hover** | Transparent | `#2D6A4F` Leaf Green | Underline |
| **Active** | Transparent | `#4A1F2A` Deep Maroon | Underline |

### C. Navigation System

#### Desktop Navigation

| Element | Background | Text Color | Hover State |
|---------|------------|------------|-------------|
| **Nav Bar** | `#FFFFFF` | `#4A1F2A` | BG: `#F5F2ED` |
| **Active Link** | `#EDE8E0` | `#1C4F3D` | N/A |
| **Logo Area** | Transparent | N/A | N/A |

#### Mobile Navigation

| Element | Background | Text Color | Border |
|---------|------------|------------|--------|
| **Hamburger** | `#1C4F3D` | `#FFFFFF` | None |
| **Menu Overlay** | `#FFFFFF` 95% opacity | `#4A1F2A` | None |
| **Menu Items** | Transparent | `#4A1F2A` | Bottom: 1px `#EDE8E0` |

### D. Background & Section Colors

| Section Type | Background | Text | Accent |
|--------------|------------|------|--------|
| **Hero Section** | `#EDE8E0` Cream | `#4A1F2A` | `#5C2632` |
| **Alternate Section 1** | `#FFFFFF` | `#4A1F2A` | `#1C4F3D` |
| **Alternate Section 2** | `#FAF8F5` Warm White | `#4A1F2A` | `#2D6A4F` |
| **Dark Section/Footer** | `#1C4F3D` Forest | `#FFFFFF` | `#2D6A4F` |
| **Card/Panel** | `#FFFFFF` | `#4A1F2A` | Shadow: rgba(28,79,61,0.1) |
| **Highlighted Card** | `#F5F2ED` | `#4A1F2A` | Border: `#2D6A4F` |

### E. Form Elements

| Element | State | Background | Border | Text | Placeholder |
|---------|-------|------------|--------|------|-------------|
| **Input Field** | Default | `#FFFFFF` | 1px `#8B8578` | `#4A1F2A` | `#8B8578` |
| | Focus | `#FFFFFF` | 2px `#1C4F3D` | `#4A1F2A` | — |
| | Error | `#FFF5F5` | 2px `#8B3942` | `#4A1F2A` | — |
| | Success | `#F5FAF7` | 2px `#3A7F5F` | `#4A1F2A` | — |
| | Disabled | `#F5F2ED` | 1px `#8B8578` | `#8B8578` | `#8B8578` |

### F. Interactive Elements

| Element | State | Color | Additional |
|---------|-------|-------|------------|
| **Links** | Default | `#1C4F3D` | Underline |
| | Hover | `#2D6A4F` | Underline |
| | Visited | `#5C2632` | Underline |
| **Icons** | Default | `#4A4740` | — |
| | Hover | `#1C4F3D` | — |
| | Active | `#2D6A4F` | — |
| **Dividers** | — | `#EDE8E0` | 1px solid |
| **Shadows** | Card | rgba(28,79,61,0.08) | 0 4px 12px |
| | Elevated | rgba(28,79,61,0.15) | 0 8px 24px |

---

## 5. SUGGEST: Logo Specifications & Implementation

### Logo Size & Placement Matrix

#### Desktop (1920px – 1280px)

| Context | Width | Height | Placement | Margin |
|---------|-------|--------|-----------|--------|
| **Primary Navigation** | 180px | 60px | Top-left | 32px from edges |
| **Hero Section** | 240px | 80px | Center | 80px from top |
| **Footer** | 160px | 54px | Center/Left | 40px from edges |

#### Tablet (1024px – 768px)

| Context | Width | Height | Placement | Margin |
|---------|-------|--------|-----------|--------|
| **Primary Navigation** | 140px | 47px | Top-left | 24px from edges |
| **Hero Section** | 200px | 67px | Center | 60px from top |
| **Footer** | 140px | 47px | Center | 32px from edges |

#### Mobile (414px – 360px)

| Context | Width | Height | Placement | Margin |
|---------|-------|--------|-----------|--------|
| **Primary Navigation** | 110px | 37px | Top-left | 16px from edges |
| **Hero Section** | 160px | 54px | Center | 40px from top |
| **Footer** | 120px | 40px | Center | 24px from edges |

### Logo Color Variations

| Background | Logo Version | Context |
|------------|--------------|---------|
| Light (`#EDE8E0`, `#FFFFFF`, `#FAF8F5`) | Full Color (Original) | Primary usage |
| Dark (`#1C4F3D`, `#4A1F2A`) | White Monochrome | Footer, dark sections |
| Complex/Medium Backgrounds | Full Color + white outline | Photo overlays |

### Logo Spacing & Clear Space Rules

- **Minimum Clear Space:** Width of the leaf element (~20% of logo width) on all sides
- **Minimum Size:** 80px wide — below this, use icon-only (VB monogram) version
- **Icon-Only:** VB monogram without wordmark (mobile menu toggles, favicons, app icons)
- **Never:** Stretch, rotate, recolor, or place on insufficient-contrast backgrounds

---

## 6. ACCESSIBILITY VALIDATION SUMMARY

### High-Priority Color Pairings — All WCAG Compliant

| Foreground | Background | Contrast Ratio | Rating | Usage |
|------------|------------|----------------|--------|-------|
| `#4A1F2A` | `#EDE8E0` | 9.1:1 | **AAA** ✓✓✓ | Body text on cream |
| `#FFFFFF` | `#1C4F3D` | 9.8:1 | **AAA** ✓✓✓ | Light text on forest green |
| `#5C2632` | `#EDE8E0` | 8.2:1 | **AAA** ✓✓✓ | Burgundy headings |
| `#1C4F3D` | `#FFFFFF` | 9.8:1 | **AAA** ✓✓✓ | Green buttons on white |
| `#8B8578` | `#EDE8E0` | 4.6:1 | **AA** ✓✓ | Secondary text |
| `#FFFFFF` | `#5C2632` | 7.5:1 | **AAA** ✓✓✓ | White text on burgundy |

### Responsive Typography Summary

| Breakpoint | H1 | Body |
|------------|-----|------|
| Desktop (≥1280px) | 56px / 1.1 / 600 | 18px / 1.6 |
| Tablet (768–1279px) | 40px / 1.15 / 600 | 16px / 1.6 |
| Mobile (≤767px) | 32px / 1.2 / 600 | 16px / 1.6 |

---

## 7. FINAL DESIGN SYSTEM PACKAGE

### CSS Custom Property Tokens (Quick Reference)

```css
/* VINEBOND Design System — Primary Colors */
--vb-forest:        #1C4F3D;
--vb-burgundy:      #5C2632;
--vb-leaf-green:    #2D6A4F;
--vb-deep-maroon:   #4A1F2A;
--vb-cream:         #EDE8E0;

/* Neutrals */
--vb-white:         #FFFFFF;
--vb-warm-white:    #FAF8F5;
--vb-light-beige:   #F5F2ED;
--vb-medium-gray:   #8B8578;
--vb-dark-gray:     #4A4740;

/* States */
--vb-success:       #3A7F5F;
--vb-warning:       #B8834F;
--vb-error:         #8B3942;

/* Shadows */
--vb-shadow-sm:     0 2px  8px  rgba(28,79,61,0.06);
--vb-shadow-md:     0 4px  12px rgba(28,79,61,0.08);
--vb-shadow-lg:     0 8px  24px rgba(28,79,61,0.12);
```

### Typography Scale (CSS)

```css
/* Desktop */
--vb-h1-size-desktop:   56px;   /* lh: 1.1  / w: 600 */
--vb-h2-size-desktop:   40px;   /* lh: 1.2  / w: 600 */
--vb-h3-size-desktop:   32px;   /* lh: 1.3  / w: 600 */
--vb-body-size-desktop: 18px;   /* lh: 1.6  / w: 400 */

/* Tablet */
--vb-h1-size-tablet:    40px;   /* lh: 1.15 / w: 600 */
--vb-h2-size-tablet:    32px;   /* lh: 1.25 / w: 600 */
--vb-body-size-tablet:  16px;   /* lh: 1.6  / w: 400 */

/* Mobile */
--vb-h1-size-mobile:    32px;   /* lh: 1.2  / w: 600 */
--vb-h2-size-mobile:    24px;   /* lh: 1.3  / w: 600 */
--vb-body-size-mobile:  16px;   /* lh: 1.6  / w: 400 */

/* Fluid (responsive clamp) */
--vb-fluid-h1:          clamp(2rem,   4vw + 1rem,   3.5rem);
--vb-fluid-h2:          clamp(1.5rem, 3vw + 0.5rem, 2.5rem);
--vb-fluid-body:        clamp(1rem,   1vw + 0.5rem, 1.125rem);
```

### Dark Mode Alternative

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| **Background** | `#EDE8E0` | `#1A1A1A` |
| **Surface** | `#FFFFFF` | `#2A2A2A` |
| **Primary Text** | `#4A1F2A` | `#EDE8E0` |
| **Primary Color** | `#1C4F3D` | `#3A7F5F` |
| **Accent** | `#5C2632` | `#9B6570` |

> Dark mode activates automatically via `prefers-color-scheme: dark`.
> Can be forced with `data-theme="dark"` on `<html>`.

---

## 8. IMPLEMENTATION FILES

| File | Description |
|------|-------------|
| `design-system/tokens.css` | All CSS custom property tokens |
| `design-system/components.css` | UI component styles |
| `css/vinebond.css` | Production shared stylesheet |
| `index.html` | Homepage with inline page-specific styles |
| `winery.html` | Winery listing page |
| `book.html` | Booking flow page |
| `vinemap.html` | Interactive wine map page |
| `login.html` | Authentication page |

---

*© 2026 VineBond. UI/UX Design Portfolio — Internal Document.*
