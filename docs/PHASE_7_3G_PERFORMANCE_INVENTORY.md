# Phase 7.3G — Performance Inventory

**Date:** 2026-07-11  
**Scope:** Pre-change audit baseline and post-optimization verification  
**Status:** Complete

---

## 1. Baseline Architecture

| Item                 | Value                                                              |
| -------------------- | ------------------------------------------------------------------ |
| Framework            | Next.js **16.2.10** (Turbopack build)                              |
| React                | **19.2.4**                                                         |
| Rendering            | App Router — **SSG** for `/[locale]`, projects index, case studies |
| Static pages (build) | **42** prerendered routes (+ OG image routes)                      |
| Dynamic routes       | `opengraph-image` handlers only                                    |
| i18n                 | `/en`, `/ar` via `generateStaticParams`                            |
| Dependencies         | `next`, `react`, `react-dom`, `gsap`, `@gsap/react`                |
| Bundle analyzer      | **Not installed** (not added in this phase)                        |

### Homepage client boundaries (`"use client"`)

| Component                    | Route scope                  | Requires client? | Notes                              |
| ---------------------------- | ---------------------------- | ---------------- | ---------------------------------- |
| `LanguageSwitcher`           | All pages                    | Yes              | Locale navigation                  |
| `MobileNavigation`           | All pages                    | Yes              | Menu state                         |
| `ScrollProgressLine`         | All pages (header)           | Yes              | Scroll listener                    |
| `DeferredHomepageRailMotion` | Homepage only                | Yes              | Loads GSAP async post-paint        |
| `DeferredLiveWebsitePreview` | Homepage Gymura + Restaurant | Yes              | Loads preview JS async             |
| `HomepageRailMotion`         | Homepage (deferred)          | Yes              | GSAP + ScrollTrigger orchestration |
| `LiveWebsitePreview`         | Case studies (direct)        | Yes              | Iframe + ResizeObserver            |
| `GymuraCaseStudyMotion`      | Gymura case study            | Yes              | GSAP case-study motion             |
| `RestaurantCaseStudyMotion`  | Restaurant case study        | Yes              | GSAP case-study motion             |

All V2 homepage sections (`HeroV2Section`, world sections, `ManifestoV2Section`, etc.) remain **Server Components**.

---

## 2. Asset Inventory

### Local images (`public/images/alex/`)

| File                              | Dimensions | Size       | Usage                        |
| --------------------------------- | ---------- | ---------- | ---------------------------- |
| `alex-workstation-desktop.webp`   | 960×831    | **57 KB**  | Hero LCP (≥640px)            |
| `alex-workstation-mobile.webp`    | 640×517    | **29 KB**  | Hero LCP (<640px)            |
| `alex-workstation-manifesto.webp` | 1200×575   | **39 KB**  | Manifesto background (lazy)  |
| `alex-workstation-original.png`   | 1086×1448  | **2.0 MB** | Source only — **not served** |

### Icons / OG

| Asset                   | Size                   | Usage                     |
| ----------------------- | ---------------------- | ------------------------- |
| `public/icon.svg`       | <1 KB                  | Favicon                   |
| `public/apple-icon.svg` | <1 KB                  | Apple touch               |
| OG routes               | Generated PNG 1200×630 | Social previews (dynamic) |

### Referenced but absent on disk

Project registry references `/images/gymura/placeholder-*.webp`, `/images/restaurant/placeholder-*.webp`, etc. — **files not present**; galleries use placeholder paths only when case-study content enables gallery (no broken homepage requests).

---

## 3. Bundle Inventory (production `.next/static/chunks`)

### Before optimization (representative)

| Chunk               | ~Size  | Contents                                           |
| ------------------- | ------ | -------------------------------------------------- |
| `0iec5q4ack_04.js`  | 222 KB | Next/React framework runtime                       |
| `07u_h6i539_wj.js`  | 147 KB | Homepage + shared client (included GSAP path)      |
| `3tf707ij2-g0o.js`  | 135 KB | GSAP + ScrollTrigger + motion (sync with homepage) |
| `0cz1d0mv5g_q7.js`  | 110 KB | Shared app code                                    |
| `2ql1c8tmmx7ed.css` | 98 KB  | Global CSS (Tailwind v4 compiled)                  |

### After optimization

| Chunk               | ~Size  | Contents                                        |
| ------------------- | ------ | ----------------------------------------------- |
| `0iec5q4ack_04.js`  | 222 KB | Framework runtime                               |
| `1mfjqidm5qp0a.js`  | 142 KB | Homepage + shared (GSAP removed from sync path) |
| `2f8m9ylezwuue.js`  | 112 KB | **Async** — GSAP + ScrollTrigger                |
| `22e5pb_4c_5jk.js`  | 41 KB  | **Async** — rail motion modules                 |
| `3eb0qj4xo6jzp.js`  | 10 KB  | **Async** — deferred preview wrapper            |
| `3ds3he_yipdcd.css` | 99 KB  | Global CSS                                      |

**Homepage initial `<script>` tags (after):** 9 scripts, ~**648 KB** transferred (lab fetch). GSAP 112 KB + 41 KB chunks **not** in homepage initial script list.

---

## 4. GSAP / ScrollTrigger Cost

| Item                    | Detail                                                                                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Import path             | Single registration in `src/lib/motion/gsap.ts`                                                                                                    |
| Plugins                 | `ScrollTrigger`, `useGSAP` only                                                                                                                    |
| Duplicate registration  | None                                                                                                                                               |
| Homepage triggers       | ~15 `ScrollTrigger` instances (hero, method, map, 5 world spines, gymura, restaurant, texas, intelligence, security×3, future, manifesto, contact) |
| Case-study triggers     | Additional triggers on Gymura/Restaurant motion pages                                                                                              |
| Continuous loops        | None                                                                                                                                               |
| Per-frame React updates | None (transform/opacity via GSAP)                                                                                                                  |
| Debug code              | `console.info` gated `NODE_ENV === 'development'`; `?motionDebug=1` markers dev-only                                                               |
| Reduced motion          | `matchMedia` static complete rails                                                                                                                 |

**Post-7.3G:** GSAP loads via `DeferredHomepageRailMotion` — not in homepage synchronous JS graph.

---

## 5. Live Preview Cost

| Check                                                          | Result                                                           |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| Iframe before user action                                      | **No** — `previewState === 'idle'` renders launch button only    |
| External network to gymura.store / alnkha.site on initial HTML | **No iframe**; link `href` only                                  |
| `autoLoadWhenVisible` on homepage                              | **false** (default)                                              |
| Duplicate iframes on reload                                    | Prevented via `iframeKey` increment                              |
| ResizeObserver                                                 | Single observer on viewport; disconnected on unmount             |
| Load timeout                                                   | 12s, cleared on unmount                                          |
| Homepage preview JS                                            | Deferred via `DeferredLiveWebsitePreview`                        |
| Case-study preview                                             | Direct `LiveWebsitePreview` (appropriate — primary page feature) |

---

## 6. Font Inventory

| Family               | Loader             | Subsets / weights          | Strategy                         |
| -------------------- | ------------------ | -------------------------- | -------------------------------- |
| Geist Sans           | `next/font/google` | Latin, variable            | CSS variable `--font-geist-sans` |
| Geist Mono           | `next/font/google` | Latin, variable            | CSS variable `--font-geist-mono` |
| IBM Plex Sans Arabic | `next/font/google` | Arabic; 400, 500, 600, 700 | CSS variable `--font-arabic`     |

- Self-hosted by Next.js at build time (no runtime Google CDN request)
- `font-display` handled by Next font loader
- Weight 500 used via Tailwind `font-medium` and CSS — **kept**
- No duplicate font files observed

---

## 7. Hydration Surfaces

| Surface                                      | Risk                   | Status                 |
| -------------------------------------------- | ---------------------- | ---------------------- |
| `LiveWebsitePreview` viewport `aria-pressed` | Was hydration mismatch | Fixed 7.3D.2 — stable  |
| `LanguageSwitcher`                           | Low                    | Stable                 |
| `MobileNavigation`                           | Low                    | Stable                 |
| `HomepageRailMotion`                         | Client-only deferred   | No SSR markup mismatch |
| Header/footer                                | Server-rendered        | Stable                 |

---

## 8. Known Production Warnings / Risks

| ID      | Severity | Finding                                                                                  |
| ------- | -------- | ---------------------------------------------------------------------------------------- |
| PERF-01 | P2       | Mobile **lab** LCP ~4.1–4.6s (simulated 4G) — Hero image + JS parse on mid-tier CPU      |
| PERF-02 | P2       | Homepage HTML ~170 KB (EN) / ~181 KB (AR) — large static content + JSON-LD               |
| PERF-03 | P2       | Global CSS ~99 KB — rail/motion rules substantial but active                             |
| PERF-04 | P3       | `alex-workstation-original.png` 2 MB on disk — unused; accidental reference risk         |
| PERF-05 | P3       | Case-study pages load GSAP sync (~789 KB script graph) for Gymura/Restaurant motion      |
| PERF-06 | P3       | `ScrollProgressLine` updated on scroll — mitigated with `requestAnimationFrame` throttle |
| PERF-07 | P3       | Header `backdrop-blur-sm` — minor GPU cost; visually required                            |

**P0 / P1:** None reproduced.

---

## 9. Findings by Severity

### P0 — Blocking

None.

### P1 — Severe regression

None.

### P2 — Meaningful optimization opportunity

- GSAP on homepage moved to async chunk ✅ (7.3G)
- Preview interactive bundle deferred on homepage ✅ (7.3G)
- Mobile lab LCP dominated by Hero image weight + main-thread work — **documented for 3D budget**; no blind Hero image changes

### P3 — Minor / deferred

- Case-study GSAP deferral (only 2 routes)
- Placeholder image assets not on disk
- Original PNG archival storage off-repo
- Lighthouse JSON artifacts excluded from repo

---

## 10. Static Generation Verification

Build output confirms:

- `● /[locale]` — SSG (`/en`, `/ar`)
- `● /[locale]/projects` — SSG
- `● /[locale]/projects/[slug]` — SSG (16 paths)
- `○ /robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` — static
- `ƒ opengraph-image` — dynamic image generation only

`getSiteUrl()` uses env at build for metadata URLs — does **not** force dynamic HTML rendering.

---

## 11. Automated Check Scripts

| Script                                     | Purpose                                                |
| ------------------------------------------ | ------------------------------------------------------ |
| `scripts/phase-7-3g-performance-check.mjs` | Route 200, HTML/JS size, no initial iframe, H1, assets |
| `scripts/phase-7-3f-seo-check.mjs`         | Metadata regression guard                              |

**Lighthouse:** Run manually via `npx lighthouse` against production server (documented in final report). Lab measurements only — not field CWV.

---

## 12. Test Port

| Phase               | Port     | Build                  |
| ------------------- | -------- | ---------------------- |
| Baseline Lighthouse | **3002** | Pre-optimization       |
| Post-optimization   | **3003** | After deferred loading |

Commands: `npm run build` → `PORT=3003 npm run start`
