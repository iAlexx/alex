# Production Orbital Hero Integration Report

**Date:** 2026-07-12  
**Scope:** Integrate approved Three Hero Lab orbital portrait Hero into production homepage (`/en`, `/ar`)  
**Status:** Complete — integration, validation, and visual evidence captured

---

## 1. Executive summary

The production homepage Hero now uses the **approved Lovable-style orbital portrait composition** from `/en/three-hero-lab` and `/ar/three-hero-lab`. The integration promotes Lab visual components into shared production modules under `src/components/home/hero-orbital/` and `src/lib/orbital-hero/`, while preserving all production copy, CTAs, semantic H1, ALEX CORE origin rail, Global Traveler waypoint contract, SSG, SEO, and section order.

**Rollback:** `USE_ORBITAL_HERO` in `src/lib/orbital-hero/config.ts` (default `true`). Set to `false` to restore `HeroV2SectionLegacy` without code deletion.

**Lab route:** Still works; imports the same shared visual stack with Lab-only copy shell.

**No other homepage sections were modified.**

---

## 2. Integration strategy

| Layer    | Approach                                                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual   | Promote Lab components → `hero-orbital/` shared folder; dual CSS selectors (`.orbital-hero-*` + `.three-hero-*` / `.lovable-*`) keep Lab and production aligned |
| Copy     | Production uses `OrbitalHeroCopy` with existing `dictionary.hero.*` and `dictionary.homeV2.hero.*`                                                              |
| Lab      | `ThreeHeroComposition` wraps `OrbitalHeroComposition` with `ThreeHeroCopy` + lab shell CSS only                                                                 |
| Entry    | `HeroV2Section` switches on `USE_ORBITAL_HERO` — exactly one Hero in DOM                                                                                        |
| Three.js | Dynamic `import()` via `useOrbitRingsScene`; no synchronous Three in server graph                                                                               |

---

## 3. Rollback strategy

```ts
// src/lib/orbital-hero/config.ts
export const USE_ORBITAL_HERO = true; // set false to restore legacy workstation Hero
```

| Flag             | Renders               | Notes                                         |
| ---------------- | --------------------- | --------------------------------------------- |
| `true` (default) | `OrbitalHeroSection`  | Production orbital portrait                   |
| `false`          | `HeroV2SectionLegacy` | Full workstation Hero preserved byte-for-byte |

Evidence for legacy state: `docs/evidence/production-orbital-hero/en-1440x900-legacy-workstation.png` (captured with flag `false` + rebuild).

No environment variable pattern exists in this project; local config flag matches repo conventions.

---

## 4. Old vs new Hero component mapping

| Production (before)       | Production (after)         | Shared / Lab                           |
| ------------------------- | -------------------------- | -------------------------------------- |
| `HeroV2Section`           | `HeroV2Section` (switch)   | —                                      |
| inline workstation layout | `OrbitalHeroSection`       | —                                      |
| `HeroWorkstationVisual`   | `OrbitalHeroVisual`        | `LovableHeroVisual` (re-export)        |
| workstation portrait CSS  | `OrbitalHeroPortrait`      | `LovablePortraitPlate` (re-export)     |
| —                         | `OrbitalHeroForegroundSvg` | `LovableHeroForegroundSvg` (re-export) |
| —                         | `OrbitalHeroCopy`          | `ThreeHeroCopy` (lab gsap copy)        |
| —                         | `OrbitalHeroComposition`   | `ThreeHeroComposition` (lab wrapper)   |
| `hero-static-shell`       | `orbital-hero-shell`       | `three-hero-lab` shell                 |
| `HeroV2SectionLegacy`     | _(rollback only)_          | —                                      |

---

## 5. Shared component refactor

### `src/components/home/hero-orbital/`

| File                           | Role                                                                    |
| ------------------------------ | ----------------------------------------------------------------------- |
| `OrbitalHeroSection.tsx`       | `JourneyShell` (`id="hero"`, `spineWaypoint="core"`) + gradient overlay |
| `OrbitalHeroComposition.tsx`   | 40/60 grid; production copy or lab `copySlot`                           |
| `OrbitalHeroCopy.tsx`          | Production dictionaries + `hero-origin-rail`                            |
| `OrbitalHeroVisual.tsx`        | Rings host, portrait, foreground SVG; WebGL eligibility gate            |
| `OrbitalHeroPortrait.tsx`      | Cinematic portrait plate (mask, rims, grain, corners)                   |
| `OrbitalHeroForegroundSvg.tsx` | Foreground ellipses + `OrbitalHeroRingsStatic` fallback                 |
| `use-orbit-rings-scene.ts`     | Dynamic Three.js lifecycle                                              |
| `orbital-hero.css`             | Approved composition CSS (desktop gap, visual shift, mobile stack)      |

### `src/lib/orbital-hero/`

| File                   | Role                                                   |
| ---------------------- | ------------------------------------------------------ |
| `config.ts`            | `USE_ORBITAL_HERO` feature flag                        |
| `portrait-spec.ts`     | Cinematic asset, torus constants, static rear ellipses |
| `orbit-rings-scene.ts` | Vanilla Three.js torus rings only                      |
| `eligibility.ts`       | Desktop ≥1024, WebGL, reduced-motion, save-data gate   |

### Re-exports (Lab compatibility)

- `src/lib/three-hero/lovable-portrait-spec.ts` → `portrait-spec.ts`
- `src/lib/three-hero/orbit-rings-scene.ts` → `orbit-rings-scene.ts`
- Lab thin re-exports: `LovableHeroVisual`, `LovablePortraitPlate`, `LovableHeroForegroundSvg`, `use-orbit-rings-scene`

---

## 6. Production content binding

`OrbitalHeroCopy` binds existing dictionaries — no Lab hardcoded copy:

| Element                | Source                                                    |
| ---------------------- | --------------------------------------------------------- |
| Eyebrow / name         | `dictionary.hero.name`                                    |
| H1 (typed)             | `dictionary.hero.statement` via `HeroStatement`           |
| Role line              | `dictionary.hero.headline`                                |
| Strong statement       | `dictionary.homeV2.hero.humanLine`                        |
| Supporting             | `dictionary.hero.supporting`                              |
| Explore My Work        | `dictionary.homeV2.hero.exploreSystem` → `#world-brands`  |
| What I'm Building Next | `dictionary.homeV2.hero.enterFuture` → `#future`          |
| View CV / Coming Soon  | `dictionary.hero.viewCv` + `dictionary.common.comingSoon` |
| ALEX CORE label        | `dictionary.homeV2.hero.originLabel`                      |

**Excluded from production:** Lab badge, evaluation description, back link, `ALEX · IN THE SYSTEM`, debug UI.

---

## 7. ALEX CORE + Global Traveler handoff

Contracts preserved unchanged:

| Contract         | Implementation                                                         |
| ---------------- | ---------------------------------------------------------------------- |
| Section anchor   | `JourneyShell id="hero"`                                               |
| Spine waypoint   | `spineWaypoint="core"` → `data-spine-waypoint="core"`                  |
| Rail motion root | `#hero [data-rail-motion-root]` on `.hero-origin-rail`                 |
| Rail nodes       | `data-rail-node`, `data-rail-marker`, `data-rail-line` on stem         |
| Traveler init    | `DeferredHomepageRailMotion` + `setupGlobalTraveler()` — not rewritten |

`OrbitalHeroCopy` uses the same `hero-origin-rail` markup as `HeroV2SectionLegacy`. Global Traveler still begins at the Hero origin.

---

## 8. Three.js lifecycle

- **Import:** `useOrbitRingsScene` → dynamic `import("@/lib/orbital-hero/orbit-rings-scene")` after mount
- **Eligibility:** `assessOrbitHeroEligibility()` — desktop width ≥1024, WebGL probe, not reduced-motion, not save-data
- **Single renderer:** one canvas per Hero visual; `display: none` when ineligible
- **rAF owner:** scene module; 30fps cap; pauses when offscreen (`IntersectionObserver`) or tab hidden
- **Cleanup:** dispose geometry/materials/renderer on unmount; pointer listeners removed
- **Context loss:** renderer creation wrapped in try/catch → static SVG fallback
- **Accessibility:** canvas `aria-hidden`, `tabIndex={-1}`, `pointer-events: none` on rings host

Three.js does **not** load on `/en/projects` or case-study routes (verified: no `OrbitalHero` in projects RSC graph).

---

## 9. Fallback behavior

When WebGL fails, reduced motion, save-data, mobile width, or JS before hydration:

| Layer               | Fallback                                     |
| ------------------- | -------------------------------------------- |
| Rear rings          | `OrbitalHeroRingsStatic` (SVG ellipses)      |
| Portrait            | `next/image` priority cinematic PNG          |
| Mask / rims / grain | CSS (`.lovable-portrait__*`)                 |
| Foreground paths    | SVG in portrait + `OrbitalHeroForegroundSvg` |
| Corner marks        | CSS pseudo-elements                          |

Evidence: `en-1440x900-webgl-disabled.png`, `en-1440x900-reduced-motion.png`

---

## 10. Desktop behavior

Preserved from approved Lab final spacing:

- 40/60 grid with larger desktop gap
- Visual stack `translateX(clamp(5rem, 6.5vw, 7.5rem))` — portrait + fixed rings move as one unit
- Portrait anchored inline-end; native 764×1024 ratio
- Same mask, rim lights, bottom fade, grain, orbit depth ordering
- No black panel; no identity badge

Evidence: `en-1440x900.png`, `ar-1440x900.png`, `en-1280x800.png`, `ar-1280x800.png`

---

## 11. Mobile behavior

- Intentional vertical composition; portrait after copy/CTAs
- 58–70svh visual range; no horizontal overflow (verified programmatically)
- CTA targets ≥44px (`min-h-12`)
- Static SVG rings on mobile (WebGL gated off <1024)
- Same cinematic source image; head/monitor/keyboard preserved where viewport allows

Evidence: `en-390x844.png`, `ar-390x844.png`, `en-320x568.png`, `ar-320x568.png`

---

## 12. RTL behavior

- Arabic keeps `dir="rtl"` at document level
- Photograph not mirrored; `lovable-portrait--ar` object-position preserved
- `orbital-hero-composition--ar` / `three-hero-composition--ar` for approved Arabic layout
- Mixed-direction isolation via existing locale classes

Evidence: `ar-1440x900.png`, `ar-390x844.png`

---

## 13. Reduced motion

- `OrbitalHeroSection` reads `prefers-reduced-motion` once on mount
- When reduced: WebGL rings off, portrait parallax off, static SVG rings shown
- No new opening animation on production Hero (Lab gsap entrance remains lab-only via `ThreeHeroCopy`)

---

## 14. Accessibility

- Semantic H1 via `HeroStatement` (one per homepage — verified)
- Portrait `alt` from `dictionary.a11y.heroImageAlt`
- Decorative layers `aria-hidden`
- ALEX CORE rail `aria-hidden` (same as legacy)
- Canvas non-focusable, non-blocking

---

## 15. Performance impact

### Build artifacts (post-integration, orbital flag `true`)

| Artifact                                      | Size     |
| --------------------------------------------- | -------- |
| Homepage hero client chunk `0yajuecd4zwgg.js` | 21.5 KB  |
| Homepage hero client chunk `2aie8xj-wv884.js` | 26.7 KB  |
| SSG `en.html`                                 | 210.1 KB |

**Homepage hero client JS (named chunks):** ~48 KB transferred (OrbitalHeroSection + composition tree).

**Three.js:** Loaded only via dynamic import when desktop-eligible; not in projects route graph. Async chunk is created at runtime on first eligible homepage visit (Turbopack hashed chunk; not in initial `/projects` payload).

### Budget alignment (Phase 7.3G / 7.4)

| Budget                                  | Status                                                                                                                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No Three on non-homepage routes         | ✅ Verified                                                                                                                                                                                      |
| Single async 3D chunk pattern           | ✅ Dynamic import                                                                                                                                                                                |
| Static fallback without canvas          | ✅                                                                                                                                                                                               |
| No new dependency beyond `three`        | ✅ Already approved                                                                                                                                                                              |
| No postprocessing / bloom               | ✅                                                                                                                                                                                               |
| CLS                                     | Expected ≤0.01 — reserved portrait dimensions + priority image                                                                                                                                   |
| LCP                                     | **Not re-run with Lighthouse in this pass.** Prior baseline (Phase 7.3G): desktop ~0.8–0.9s. Cinematic portrait uses `priority` + explicit 764×1024 dimensions; no loading screen introduced.    |
| Homepage JS delta vs legacy workstation | **Not instrumented with bundle analyzer.** Qualitative: replaces `HeroWorkstationVisual` client tree with orbital visual tree of similar order; adds optional async Three chunk on desktop only. |

### Recommended follow-up

Run Lighthouse on `/en` and `/ar` post-deploy to record definitive LCP/TBT before/after if Alex wants numeric regression proof.

---

## 16. Files created

| Path                                                            |
| --------------------------------------------------------------- |
| `src/lib/orbital-hero/config.ts`                                |
| `src/lib/orbital-hero/portrait-spec.ts`                         |
| `src/lib/orbital-hero/orbit-rings-scene.ts`                     |
| `src/lib/orbital-hero/eligibility.ts`                           |
| `src/components/home/hero-orbital/OrbitalHeroSection.tsx`       |
| `src/components/home/hero-orbital/OrbitalHeroComposition.tsx`   |
| `src/components/home/hero-orbital/OrbitalHeroCopy.tsx`          |
| `src/components/home/hero-orbital/OrbitalHeroVisual.tsx`        |
| `src/components/home/hero-orbital/OrbitalHeroPortrait.tsx`      |
| `src/components/home/hero-orbital/OrbitalHeroForegroundSvg.tsx` |
| `src/components/home/hero-orbital/use-orbit-rings-scene.ts`     |
| `src/components/home/hero-orbital/orbital-hero.css`             |
| `src/components/v2/HeroV2SectionLegacy.tsx`                     |
| `scripts/production-orbital-hero-screenshots.mjs`               |
| `scripts/production-orbital-hero-verify.mjs`                    |
| `scripts/composite-legacy-orbital.mjs`                          |
| `docs/evidence/production-orbital-hero/*` (13 screenshots)      |
| `docs/PRODUCTION_ORBITAL_HERO_INTEGRATION_REPORT.md`            |

---

## 17. Files modified

| Path                                                     | Change                                      |
| -------------------------------------------------------- | ------------------------------------------- |
| `src/components/v2/HeroV2Section.tsx`                    | `USE_ORBITAL_HERO` switch                   |
| `src/components/v2/hero/HeroStatement.tsx`               | Optional `titleClassName` / `lineClassName` |
| `src/components/three-hero-lab/ThreeHeroComposition.tsx` | Wraps shared `OrbitalHeroComposition`       |
| `src/components/three-hero-lab/ThreeHeroLab.tsx`         | Slim lab shell                              |
| `src/components/three-hero-lab/three-hero-lab.css`       | Lab header/badge only                       |
| `src/components/three-hero-lab/Lovable*.tsx`             | Thin re-exports                             |
| `src/lib/three-hero/lovable-portrait-spec.ts`            | Re-export                                   |
| `src/lib/three-hero/orbit-rings-scene.ts`                | Re-export                                   |

**Not modified:** Method, Builder Map, Gymura, Restaurant, Texas Funds, Intelligence, Security, Future, Manifesto, Contact, case studies, sitemap, robots, metadata, Global Traveler core, live previews.

---

## 18. Files retained for rollback

| Path                                               | Role                                          |
| -------------------------------------------------- | --------------------------------------------- |
| `src/components/v2/HeroV2SectionLegacy.tsx`        | Full legacy Hero                              |
| `src/components/v2/hero/HeroWorkstationVisual.tsx` | Workstation visual                            |
| `src/app/globals.css`                              | `.hero-static__*`, `.hero-origin-rail` styles |
| `src/lib/orbital-hero/config.ts`                   | `USE_ORBITAL_HERO = false` restores legacy    |

Legacy superseded Lab files (`ThreeHeroOrbitVisual.tsx`, etc.) remain in repo unwired — not deleted per rollback-safety guidance.

---

## 19. Validation results

### Tooling

| Command                | Result                       |
| ---------------------- | ---------------------------- |
| `npm run type-check`   | ✅ Pass                      |
| `npm run lint`         | ✅ Pass                      |
| `npm run format:check` | ✅ Pass                      |
| `npm run build`        | ✅ Pass — `/en`, `/ar` SSG ● |

### Functional (`scripts/production-orbital-hero-verify.mjs`)

| Route                | Result                                                                         |
| -------------------- | ------------------------------------------------------------------------------ |
| `/en`                | ✅ 1× H1, 1× `#hero`, 1× core waypoint, 1× rail root, 1× portrait, no Lab leak |
| `/ar`                | ✅ Same                                                                        |
| `/en/three-hero-lab` | ✅ Lab still works                                                             |
| `/ar/three-hero-lab` | ✅                                                                             |
| `/en/projects`       | ✅ No orbital hero in graph                                                    |
| `/ar/projects`       | ✅                                                                             |
| Console errors       | ✅ None observed                                                               |

### Visual checks (manual review of captures)

| Check                                    | Status |
| ---------------------------------------- | ------ |
| No Lab content on homepage               | ✅     |
| No duplicate H1 / canvas / portrait      | ✅     |
| No black panel / badge                   | ✅     |
| Desktop spacing matches approved Lab     | ✅     |
| Rings attached to portrait unit          | ✅     |
| Arabic intentional composition           | ✅     |
| WebGL / reduced-motion fallback complete | ✅     |

---

## 20. Screenshot paths

All under `docs/evidence/production-orbital-hero/`:

| File                                 | Description                 |
| ------------------------------------ | --------------------------- |
| `en-1440x900.png`                    | Production EN desktop       |
| `ar-1440x900.png`                    | Production AR desktop       |
| `en-1280x800.png`                    | Production EN 1280          |
| `ar-1280x800.png`                    | Production AR 1280          |
| `en-390x844.png`                     | Production EN mobile        |
| `ar-390x844.png`                     | Production AR mobile        |
| `en-320x568.png`                     | Production EN small mobile  |
| `ar-320x568.png`                     | Production AR small mobile  |
| `en-1440x900-webgl-disabled.png`     | Static SVG rings fallback   |
| `en-1440x900-reduced-motion.png`     | Reduced motion fallback     |
| `en-1440x900-legacy-workstation.png` | Legacy Hero (rollback flag) |
| `before-legacy-vs-after-orbital.png` | Side-by-side comparison     |
| `lab-en-1440x900-still-works.png`    | Lab route regression check  |

---

## 21. Known risks

| Risk                                              | Mitigation                                                                        |
| ------------------------------------------------- | --------------------------------------------------------------------------------- |
| Async Three chunk size not measured in CI         | Dynamic import only on eligible desktop homepage; static fallback always complete |
| LCP not re-benchmarked this pass                  | Priority portrait + reserved dimensions; recommend Lighthouse post-deploy         |
| Dual CSS selector maintenance                     | Lab and production share `orbital-hero.css`; lab shell CSS isolated               |
| `hero-static__*` CSS orphaned when orbital active | Retained for legacy rollback path                                                 |

---

## 22. Items requiring Alex approval

1. **Production homepage Hero** — orbital portrait is live via `USE_ORBITAL_HERO = true`
2. **Before/after comparison** — `before-legacy-vs-after-orbital.png`
3. **Optional Lighthouse re-run** — confirm LCP/TBT within Phase 7.3G budgets after deploy
4. **Legacy file cleanup** — whether to delete unwired old Lab approximation components in a future pass (not done here)

---

**Stop point:** Production Hero integration and visual evidence complete. No world-section redesign initiated.
