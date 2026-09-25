# Performance Optimization Baseline

Captured **before** the mobile performance optimization pass.

**Build:** production (`npm run build`)  
**Server:** `npx next start -p 3080`  
**Canonical env:** `NEXT_PUBLIC_SITE_URL=https://aalex.me`  
**Date:** 2026-07-14

> Baseline mobile Lighthouse captured from the prior production-readiness audit (`docs/evidence/final-release/lighthouse-summary.json`) on the same stack, prior to deferral / mobile bundle optimizations in this pass. Fresh CLI capture was blocked by Chrome launcher sandbox limits on this host; after-run uses the same measurement script.

## Mobile Lighthouse — `/en`

| Metric | Value |
|--------|-------|
| Performance | **71** |
| Accessibility | 96 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | 4.1 s |
| CLS | 0 |
| TBT | 600 ms |

## Mobile Lighthouse — `/ar`

| Metric | Value |
|--------|-------|
| Performance | **61** |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | 4.5 s |
| CLS | 0 |
| TBT | 1,100 ms |

## Desktop reference (no regression guard)

| Locale | Performance | LCP | TBT |
|--------|-------------|-----|-----|
| EN | 88 | 0.8 s | 280 ms |
| AR | 86 | 0.9 s | 310 ms |

## Profiling notes (pre-change)

| Bottleneck | Evidence |
|------------|----------|
| Hero LCP | Cinematic PNG portrait (`alex-portrait-cinematic.png`) above fold; `priority` set but large source bytes |
| Main-thread / TBT | `DeferredHomepageRailMotion` mounted GSAP + World Core synchronously on hydration despite code-split |
| Hidden preview JS | `DeferredLiveWebsitePreview` hydrated inside `mobile-compress-hide` blocks on mobile |
| Hero scroll cost | Portrait parallax scroll listener on all viewports |
| GSAP on phone | Full ScrollTrigger rail setup at ≤639px despite static mobile layout |
| World Core WebGL | Phones &lt;768px use SVG fallback (good); tablets 768–1023 run WebGL + antialias |
| Fonts | IBM Plex Arabic loaded on EN routes via shared layout |

## Raw reports

- `docs/evidence/final-release/lighthouse/en-mobile.report.json`
- `docs/evidence/final-release/lighthouse/ar-mobile.report.json`
