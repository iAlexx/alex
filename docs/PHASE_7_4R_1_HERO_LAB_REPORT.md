# Phase 7.4R.1 — Hero Lab Experimental Route Report

**Date:** 2026-07-12  
**Status:** Complete  
**Routes:** `/en/hero-lab`, `/ar/hero-lab`

---

## 1. Executive Summary

Phase 7.4R.1 delivers an **isolated Hero visual laboratory** for comparing three distinct cinematic directions before any production merge. The production homepage (`/en`, `/ar`) was **not modified** in this phase.

The lab provides variant switching, desktop/mobile preview modes, motion replay/pause, reduced-motion preview, and a manual evaluation checklist — with only **one heavy WebGL scene active at a time**.

---

## 2. Lab Architecture

```
src/app/[locale]/hero-lab/page.tsx          (SSG, noindex metadata)
└── HeroLabShell.tsx                        (client orchestrator)
    ├── HeroLabControls.tsx                 (variant / device / motion)
    ├── HeroLabPreviewFrame                 (constrained viewport)
    │   └── ONE OF:
    │       ├── HeroLabVariantA + variant-a-architectural-scene (WebGL)
    │       ├── HeroLabVariantB + variant-b-glass-scene (WebGL)
    │       └── HeroLabVariantC (CSS/SVG spatial — no WebGL)
    ├── HeroLabDebugPanel                     (development only)
    └── HeroLabEvaluation                   (manual checklist)

src/lib/hero-lab/
├── webgl-utils.ts
├── use-lab-webgl-scene.ts                  (dispose / pause / resize)
├── variant-a-architectural-scene.ts
└── variant-b-glass-scene.ts

src/components/hero-lab/hero-lab.css        (lab-only styles — not in globals.css)
```

**Isolation:** No imports from `hero-lab` into production `HeroV2Section`, homepage `page.tsx`, sitemap, nav, or footer.

---

## 3. Route Implementation

| Route          | Locale  | Direction | Indexing                                  |
| -------------- | ------- | --------- | ----------------------------------------- |
| `/en/hero-lab` | English | LTR       | `robots: { index: false, follow: false }` |
| `/ar/hero-lab` | Arabic  | RTL       | `robots: { index: false, follow: false }` |

- **Not** in `sitemap.ts` (verified — no `hero-lab` in generated sitemap body)
- **Not** in `SiteHeader`, footer, or structured data
- Lab badge: `dictionary.heroLab.badge` — _Experimental Visual Lab_ / _مختبر بصري تجريبي_
- Back link to homepage only (not promoted in nav)

---

## 4. Variant A — Architectural Builder Frame

**Concept:** Four extruded world modules (Brands / Systems / Intelligence / Security) with metal faces, beveled edge lighting, and hub connectors.

**Implementation:**

- Native WebGL extruded box faces + emissive edge lines
- Portrait: `alex-portrait-desktop.webp` / `alex-portrait-mobile.webp` (~48% visual width)
- CSS fallback modules visible under/beside canvas for reduced-motion and WebGL failure
- Motion: mechanical line-mask headline; frame assemble 1.2–1.4s via shader `uAssemble`
- Pointer: damped perspective tilt (desktop)

**Files:** `variant-a-architectural-scene.ts`, `HeroLabVariantA.tsx`

---

## 5. Variant B — Glass Modular System

**Concept:** Layered translucent glass slabs with violet/blue primary paths and silver/amber accents.

**Implementation:**

- Five depth-separated glass quads with fresnel-style edge shader
- Internal pathway lines animate once on enter
- Portrait: **workstation** WebP integrated between glass layers (context preserved)
- Motion: soft opacity/depth reveal on copy; glass depth shift on open
- Pointer: subtle layer parallax via MVP tilt

**Files:** `variant-b-glass-scene.ts`, `HeroLabVariantB.tsx`

---

## 6. Variant C — Portrait-Centered Spatial Identity

**Concept:** Alex as visual core — editorial overlap of typography and portrait; world signals as rails and dimensional markers (no dominant 3D object).

**Implementation:**

- **No WebGL** — CSS spatial rails, glow, four world signal nodes
- Workstation image dominant; copy overlays with gradient integration
- Motion: portrait resolve, rail draw, editorial vertical headline mask
- Kinetic typography strongest overlap emphasis

**Files:** `HeroLabVariantC.tsx`, spatial rules in `hero-lab.css`

---

## 7. Portrait Asset Use

| Variant | Asset                     | Rationale                                       |
| ------- | ------------------------- | ----------------------------------------------- |
| A       | `alex-portrait-*.webp`    | Face-forward for architectural frame void       |
| B       | `alex-workstation-*.webp` | Full workstation context through glass layers   |
| C       | `alex-workstation-*.webp` | Human/editorial center; monitors remain visible |

**Source:** Approved local Alex images only — no Lovable URLs, no generated faces, no aggressive identity-altering crops.

---

## 8. Typography Differences

| Variant | Style                                           |
| ------- | ----------------------------------------------- |
| A       | Mechanical horizontal line-mask assembly        |
| B       | Layered depth fade-in (glass-like softness)     |
| C       | Editorial vertical mask + larger headline scale |

Arabic: single line/word-group animation — **no per-character splits**. All copy from `dictionary.hero` + `dictionary.homeV2.hero`.

---

## 9. Motion Differences

| Control                | Behavior                                                 |
| ---------------------- | -------------------------------------------------------- |
| Replay Motion          | Remounts active variant + `resetAnimation()` on WebGL    |
| Pause Motion           | `setActive(false)` on scene; GSAP paused via flags       |
| Reduced Motion Preview | Static composition; WebGL skipped; CSS fallbacks visible |
| Variant switch         | Previous variant unmounted → full `dispose()`            |

---

## 10. WebGL Strategy

- **No new 3D library** — native WebGL + existing GSAP
- Variant A & B: dynamic `import()` of scene modules
- Variant C: zero WebGL
- Shared lifecycle: `use-lab-webgl-scene.ts` (ResizeObserver, IntersectionObserver, visibility pause, pointer cleanup)
- `devicePixelRatio` capped at 1.5; ~30fps decorative loops

---

## 11. Performance and Cleanup

On variant switch or unmount:

- `dispose()` → buffers, programs, `WEBGL_lose_context`
- `cancelAnimationFrame`
- Pointer listeners removed
- ResizeObserver disconnected
- GSAP timelines killed in `use-hero-lab-variant-motion`
- **One canvas maximum** per active A/B variant

Debug panel (development only): active variant, canvas state, renderer count, DPR, WebGL availability.

---

## 12. Desktop Behavior

Preview frame: full width up to 96rem container, min-height ~40rem at 1440×900. Variant A/B use two-column grid ≥900px. Variant C uses editorial grid with copy overlapping portrait.

---

## 13. Mobile Behavior

Device toggle sets `hero-lab-preview__frame--mobile` (390px-wide frame). True mobile composition — stacked visual then copy, not scaled desktop. Simplified WebGL geometry (`simplified: true`).

---

## 14. RTL Behavior

`/ar/hero-lab` inherits `dir="rtl"` from locale layout. Dictionary strings Arabic. Technical LTR tokens (ALEX CORE) preserved via existing patterns. Spatial rails use logical `inset-inline-*` properties.

---

## 15. Reduced-Motion Behavior

- Reduced Motion Preview toggle forces static state
- WebGL not initialized when preview active
- CSS fallback modules/slabs/signals fully visible
- All headline/copy readable without animation

---

## 16. Files Created

**Routes & pages**

- `src/app/[locale]/hero-lab/page.tsx`

**Components**

- `src/components/hero-lab/HeroLabShell.tsx`
- `src/components/hero-lab/HeroLabControls.tsx`
- `src/components/hero-lab/HeroLabCopy.tsx`
- `src/components/hero-lab/HeroLabPortrait.tsx`
- `src/components/hero-lab/HeroLabKineticHeadline.tsx`
- `src/components/hero-lab/HeroLabVariantA.tsx`
- `src/components/hero-lab/HeroLabVariantB.tsx`
- `src/components/hero-lab/HeroLabVariantC.tsx`
- `src/components/hero-lab/use-hero-lab-variant-motion.ts`
- `src/components/hero-lab/hero-lab.css`

**Libraries**

- `src/lib/hero-lab/webgl-utils.ts`
- `src/lib/hero-lab/use-lab-webgl-scene.ts`
- `src/lib/hero-lab/variant-a-architectural-scene.ts`
- `src/lib/hero-lab/variant-b-glass-scene.ts`

**Tooling**

- `scripts/hero-lab-screenshots.mjs`

**Evidence**

- `docs/evidence/hero-lab/*.png` (6 screenshots)

---

## 17. Files Modified

| File                                | Change                                                    |
| ----------------------------------- | --------------------------------------------------------- |
| `src/content/translations/types.ts` | Added `heroLab` dictionary type                           |
| `src/content/translations/en.ts`    | Added `heroLab` copy                                      |
| `src/content/translations/ar.ts`    | Added `heroLab` Arabic copy                               |
| `package.json`                      | Added `playwright` devDependency (screenshot script only) |
| `package-lock.json`                 | Lockfile update                                           |

**Production homepage files modified:** **None** (`page.tsx`, `HeroV2Section.tsx`, `sitemap.ts` unchanged in this phase).

---

## 18. Production Homepage Regression Result

| Check                      | Result                   |
| -------------------------- | ------------------------ |
| `/en` homepage composition | Unchanged                |
| `/ar` homepage composition | Unchanged                |
| `HeroV2Section.tsx`        | Not edited in 7.4R.1     |
| Sitemap entries            | Homepage + projects only |
| Nav / footer links         | No hero-lab link         |

---

## 19. Validation Results

| Command                   | Result                                         |
| ------------------------- | ---------------------------------------------- |
| `npm run lint`            | Pass                                           |
| `npm run type-check`      | Pass                                           |
| `npm run format:check`    | Pass                                           |
| `npm run build`           | Pass — includes `/en/hero-lab`, `/ar/hero-lab` |
| Production `/en/hero-lab` | HTTP 200, `noindex` present                    |
| Production `/ar/hero-lab` | HTTP 200                                       |

---

## 20. Screenshot Paths

| File                                           | Description                 |
| ---------------------------------------------- | --------------------------- |
| `docs/evidence/hero-lab/variant-a-desktop.png` | Variant A — desktop preview |
| `docs/evidence/hero-lab/variant-b-desktop.png` | Variant B — desktop preview |
| `docs/evidence/hero-lab/variant-c-desktop.png` | Variant C — desktop preview |
| `docs/evidence/hero-lab/variant-a-mobile.png`  | Variant A — mobile preview  |
| `docs/evidence/hero-lab/variant-b-mobile.png`  | Variant B — mobile preview  |
| `docs/evidence/hero-lab/variant-c-mobile.png`  | Variant C — mobile preview  |

**Regenerate:** `npm run build && npx next start -p 3010` then `node scripts/hero-lab-screenshots.mjs`

**Recordings:** Not captured in this environment (screenshots only).

---

## 21. Known Limitations

1. **Variant A/B WebGL** is native — material quality is strong but not physically based; no Three.js refraction.
2. **Workstation portrait** is not a studio headshot — Variant A uses face-forward derivative; B/C preserve workstation context per spec.
3. **Playwright** added as devDependency solely for automated lab screenshots — not used at runtime.
4. **Screen recordings** per desktop variant not produced — screenshot evidence only.
5. Lab CTAs link to homepage anchors but use `tabIndex={-1}` inside preview (decorative in lab context).

---

## 22. Items Requiring Alex's Selection

1. **Which variant direction** (A, B, or C) should inform a future production Hero polish — if any.
2. **Whether to invest in dedicated studio portrait** locally before production merge.
3. **Whether Variant A or B WebGL quality** is sufficient, or whether approved Three.js migration is desired for a future phase.
4. **Playwright devDependency** — keep for regression screenshots or remove after review.

---

**No Hero Lab variant was merged into the production homepage.** Stop point per Phase 7.4R.1 scope.
