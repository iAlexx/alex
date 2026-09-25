# Mobile Performance Optimization Report

**Date:** 2026-07-14  
**Scope:** Mobile performance pass only — visual identity locked  
**Build:** production (`npm run build`), `NEXT_PUBLIC_SITE_URL=https://aalex.me`

---

## 1. Baseline scores

See `docs/PERFORMANCE_OPTIMIZATION_BASELINE.md`.

| Locale | Performance | LCP | TBT | CLS | Speed Index |
|--------|-------------|-----|-----|-----|-------------|
| EN mobile | 71 | 4.1 s | 600 ms | 0 | 2.4 s |
| AR mobile | 61 | 4.5 s | 1,100 ms | 0 | 2.4 s |

---

## 2. Bottlenecks found (profiled)

| Bottleneck | Impact |
|------------|--------|
| `DeferredHomepageRailMotion` hydrated GSAP + World Core immediately on first paint | High TBT |
| `DeferredLiveWebsitePreview` mounted inside CSS-hidden `mobile-compress-hide` blocks | Wasted JS parse on mobile |
| Full `OrbitalHeroSection` client boundary | Unnecessary hero hydration |
| Portrait scroll parallax listener on all viewports | Main-thread scroll work on mobile |
| GSAP ScrollTrigger rail setup at ≤639px | Heavy setup for static mobile layout |
| World Core Three.js init on first eligible frame | Competing with hero paint on tablet |
| IBM Plex Arabic font variable on EN pages | Extra font payload on English routes |

**Not a phone bottleneck:** World Core WebGL is already disabled below 768px (SVG fallback preserved).

---

## 3. Optimizations applied

### Motion / JS deferral
- **`DeferredHomepageRailMotion`** — mounts after `requestIdleCallback` (1.5s timeout fallback); `GlobalTraveler` also code-split.
- **`HomepageRailMotion`** — on mobile (≤639px), skips ScrollTrigger setup; applies `completeAllRailDecorations()` for identical end-state rails.

### Live preview (scroll-jump fix preserved)
- **`DesktopOnly`** wrapper — `DeferredLiveWebsitePreview` only mounts at ≥1024px in Gymura + Restaurant proof blocks.
- Mobile still uses **`MobilePreviewTeaser`** (user-initiated iframe only).

### World Core (visual unchanged)
- **`use-world-core-scene`** — delays Three.js import until idle + layer intersects viewport.
- **`world-core-scene`** — `antialias: false` on mobile/tablet path (geometry, colors, nucleus, rings, glow unchanged).
- DPR cap remains **1.0** on mobile/tablet WebGL.

### Hero / LCP
- **`OrbitalHeroSection`** — converted to **server component** (smaller client island).
- **`HeroV2Section`** — `react-dom` `preload()` for cinematic portrait.
- **`OrbitalHeroVisual`** — portrait parallax only at ≥1024px.

### Fonts
- **`[locale]/layout.tsx`** — Arabic font CSS variable applied only when `locale === "ar"`.

### Utilities
- **`src/lib/deferred-mount.ts`** — shared idle scheduling helper.
- **`src/components/ui/DesktopOnly.tsx`** — viewport-gated render helper.

---

## 4. World Core — visual unchanged

Confirmed unchanged:
- Geometry, materials, nucleus, ring-only neon, world color transitions
- Position, composition, Cybersecurity crimson behavior
- Phone SVG fallback below 768px
- 30fps cap, visibility pause, reduced-motion paths

Only timing and GPU cost reduced (deferred init, no antialias on tablet/mobile WebGL).

---

## 5. Hero changes

- Same cinematic portrait asset (`alex-portrait-cinematic.png`)
- Same orbital layout, copy, CTA, social links
- Server-rendered shell; client limited to visual island + interactions
- Preload hint for faster LCP discovery

---

## 6. JS reduction (mobile)

| Area | Before | After |
|------|--------|-------|
| Homepage motion mount | Immediate hydration | Idle-deferred (~1.5s) |
| Live preview chunks on mobile | Hydrated (hidden) | Not mounted |
| GSAP ScrollTrigger on phone | Full setup | Static complete state |
| Hero section client scope | Entire hero | Visual island only |

---

## 7. Image optimization

- Portrait: `priority` + `preload()` retained; Next.js optimizer serves modern formats
- No identity asset replaced
- **Remaining LCP limiter:** source PNG byte size (~cinematic master). A lossless WebP derivative of the **same** cinematic asset would help LCP without visual change (not done in this pass to avoid regenerating identity).

---

## 8. Lighthouse before / after

| Locale | Perf before | Perf after | LCP before | LCP after | TBT before | TBT after | CLS |
|--------|-------------|------------|------------|-----------|------------|-----------|-----|
| **EN mobile** | 71 | **84** | 4.1 s | 4.4 s | 600 ms | **40 ms** | 0 |
| **AR mobile** | 61 | **82** | 4.5 s | 4.9 s | 1,100 ms | **50 ms** | 0 |

**Targets met:**
- Mobile Performance **≥80** ✅ (EN 84, AR 82)
- Accessibility / SEO / Best Practices unchanged at 96–100 ✅
- CLS **≤0.1** ✅ (0)

**Speed Index improved:** 2.4 s → **1.5–1.7 s**

Raw reports:
- Before: `docs/evidence/performance-optimization/before/`
- After: `docs/evidence/performance-optimization/after-en-mobile.report.json`, `after-ar-mobile.report.json`

---

## 9. Visual regression checks

Screenshots (390×844):
- `docs/evidence/performance-optimization/after/en-hero-390x844.png`
- `docs/evidence/performance-optimization/after/ar-hero-390x844.png`
- `docs/evidence/performance-optimization/after/en-viewport-390x844.png`
- `docs/evidence/performance-optimization/after/ar-viewport-390x844.png`

No layout, color, typography, or composition changes intended.

---

## 10. Remaining tradeoffs

1. **LCP still ~4.4–4.9s** — dominated by cinematic portrait transfer size; further gain needs same-asset WebP/AVIF master without redesign.
2. **Tablet (768–1023px)** — World Core WebGL still runs (by design); phones use SVG fallback.
3. **Idle deferral** — World Core / rails appear ~1.5s after paint on fast devices (imperceptible on mobile where WebGL is off).
4. **Lighthouse variance** — run-to-run ±3–5 points; re-verify on deployed `aalex.me` after CDN warm-up.

---

## Validation

```
npm run type-check   ✅
npm run lint         ✅ (2 pre-existing script warnings)
npm run format:check ✅
npm run build        ✅
```

Evidence script: `scripts/performance-optimization-evidence.mjs`

---

## Summary

Mobile performance improved from **61–71** to **82–84** by deferring non-critical JS, eliminating hidden mobile preview hydration, shrinking the hero client boundary, and skipping mobile ScrollTrigger — **without** changing approved visuals, copy, or layout identity.
