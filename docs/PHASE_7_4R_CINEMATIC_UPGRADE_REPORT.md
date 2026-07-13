# Phase 7.4R — Cinematic Identity and Motion Upgrade Report

**Date:** 2026-07-12  
**Status:** Complete (Stages A → B → C)  
**Plan reference:** `docs/PHASE_7_4R_CINEMATIC_UPGRADE_PLAN.md`

---

## 1. Executive Summary

Phase 7.4R upgrades the approved Homepage V2 into a cinematic, human-centered experience while preserving all content, bilingual routes, SEO, accessibility, SSG, live previews, and performance deferrals.

**Delivered:**

- **ALEX Builder Frame** around a face-forward portrait (derived from the approved real workstation source — not AI-generated)
- **Hero opening motion** (~1.6s, once per session) with kinetic headline masks
- **Global traveler** — one scrubbed electric-blue point on the Builder Spine across all narrative waypoints
- **World motion upgrades** — Gymura editorial mask, Restaurant order token, Texas data pulse, Intelligence/Security atmosphere, Future emphasis
- **Manifesto convergence** — calmer portrait variant + four-module frame collapse
- **Contact resolution** — traveler arrival + social link emphasis
- **Builder Map 3D refactored** — architectural module plates replace spherical glow nodes (single WebGL system retained)

**No new npm dependencies.** Native WebGL + existing GSAP only.

---

## 2. Hero Transformation

| Item     | Implementation                                                                               |
| -------- | -------------------------------------------------------------------------------------------- |
| Layout   | `HeroVisualStack` — atmosphere → WebGL frame → portrait plate (z-indexed depth)              |
| Copy     | Unchanged — `dictionary.hero` + `homeV2.hero`                                                |
| CTAs     | Preserved destinations; micro-interaction hover/focus added                                  |
| Opening  | `DeferredHeroMotion` — mask reveal, frame fade, world-color headline emphasis, session-gated |
| Pointer  | Desktop fine-pointer only; damped frame rotation via WebGL + CSS atmospheric shift           |
| Fallback | CSS `hero-builder-frame-fallback` modules for Tier C / WebGL failure                         |

---

## 3. Portrait Integration

| Asset                          | Dimensions | Size   | Notes                        |
| ------------------------------ | ---------- | ------ | ---------------------------- |
| `alex-portrait-desktop.webp`   | 720×900    | ~39 KB | Hero LCP (face-forward crop) |
| `alex-portrait-mobile.webp`    | 480×615    | ~20 KB | Mobile Hero                  |
| `alex-portrait-manifesto.webp` | 640×809    | ~28 KB | Manifesto (darker, calmer)   |

**Source:** `alex-workstation-original.png` (same person, identity preserved).  
**Missing:** `alex-portrait-cinematic.png` (Lovable remote only) — **requires Alex approval** if a dedicated studio portrait should replace derivatives.

**Generator:** `node scripts/optimize-portrait-images.mjs`

---

## 4. Builder Frame Architecture

```
HeroVisualStack (client wrapper)
├── hero-visual-stack__atmosphere (CSS radial)
├── hero-builder-frame-fallback (CSS modules — always present)
├── HeroBuilderFrame (client, dynamic)
│   └── import("builder-frame-scene") — async native WebGL
└── HeroPortraitPlate (server, priority image)
```

- Four world-colored architectural plates + connector channels + shoulder occluders
- **Not** a sphere, reactor, wings, or armor
- Tier A/B via `evaluateWebGLEligibility()`; pauses offscreen + hidden tab
- `devicePixelRatio` capped at 1.5; 30fps decorative loop

---

## 5. Kinetic Typography

- `HeroKineticHeadline` — full statement in SSR HTML
- English: word-level emphasis on _brands_, _software_, _intelligent systems_ with brief world-color migration
- Arabic: single `kinetic-line` block — no per-character splits; `dir="auto"` preserved
- Reduced motion: lines immediately visible (`data-hero-motion="static"`)

---

## 6. Global Traveler Implementation

- DOM: `GlobalTraveler` in `DeferredHomepageRailMotion`
- Controller: `src/lib/motion/global-traveler.ts`
- Fixed positioning; live anchor remeasure on scrub (viewport-correct)
- Waypoints via `spineWaypoint` on each `JourneyShell`
- Narrative order unchanged: core → method → brands → systems → intelligence → security → future → manifesto → contact
- RTL: follows rendered spine geometry; project order not reversed
- Reduced motion: traveler hidden; rails complete statically

---

## 7. Traveler Waypoint Architecture

| Section         | `spineWaypoint` | Tint         |
| --------------- | --------------- | ------------ |
| Hero            | `core`          | electric     |
| Method          | `method`        | electric     |
| Gymura / Brands | `brands`        | brand silver |
| Systems         | `systems`       | amber        |
| Intelligence    | `intelligence`  | violet       |
| Security        | `security`      | cyan         |
| Future          | `future`        | electric     |
| Manifesto       | `manifesto`     | electric     |
| Contact         | `contact`       | electric     |

`data-traveler-active` / `data-world-entered` on sections coordinate local rail triggers.

---

## 8. World Color Migration

- `--global-spine-tint` updated by traveler scrub
- Spine `::after` glow intensifies on active section
- World atmospheres: brands gradient wash, security clip-path boundary, intelligence node depth
- Body paragraph colors unchanged — contrast preserved

---

## 9. Method and Builder Map

- Method content unchanged; `spineWaypoint="method"` added
- **Builder Map 3D refactored in place** — rectangular module plates + edge-lit shader (no spheres)
- Single `BuilderMap3D` host — no duplicate canvas
- HTML semantic map remains authoritative

---

## 10. Gymura Enhancement

- Editorial wordmark horizontal mask on rail enter
- Preview shell brand edge-light (existing pattern strengthened)
- Brands atmosphere gradient on `data-world-entered`
- Live preview dominance preserved

---

## 11. Restaurant Token

- `data-order-token` amber capsule on operational rail
- GSAP one-way travel across workflow nodes after rail draw
- `aria-hidden`; static complete state in reduced motion

---

## 12. Texas Pulse

- `data-texas-pulse` on Texas micro-flow rail
- Sequential GSAP translate through User → Bot → Calculation → Result
- Amber + restrained electric accent via box-shadow

---

## 13. Intelligence Spatial Upgrade

- Core node depth emphasis on world entry (`intel-arch-node--core` box-shadow)
- Existing grid architecture preserved — no AI brain / particle cloud
- Accurate technical claims unchanged

---

## 14. Security Geometry

- Cyan clip-path boundary pseudo-element on section enter
- Learning path content unchanged; legal framing preserved
- No glitch / Matrix / terminal effects

---

## 15. Future Treatment

- Traveler active state narrows spine emphasis on dashed fragment
- Open endpoint remains incomplete — no fake progress

---

## 16. Manifesto Treatment

- Portrait variant (`alex-portrait-manifesto.webp`) — darker opacity
- `manifesto-frame-convergence` — four subtle module plates behind copy
- Existing convergence lines + core marker motion retained

---

## 17. Contact Resolution

- Traveler reaches `contact` waypoint
- Social links receive brief group box-shadow emphasis (no long stagger)
- Telegram / LinkedIn / GitHub / Instagram only — no email/form

---

## 18. Micro-Interactions

- Hero CTA hover lift + electric glow (pointer fine only)
- Focus-visible outlines on CTAs
- Preview / spine / link emphasis tied to rail + traveler hierarchy

---

## 19. Mobile Behavior

- CSS Builder Frame fallback (no Hero WebGL below 768px)
- Portrait-forward stack; occluders hidden <1024px
- Smaller traveler core/glow; simplified scrub
- Vertical spine preserved

---

## 20. RTL Behavior

- Layout RTL for Arabic; Restaurant/Texas/Intelligence technical LTR rails preserved
- Traveler follows `inset-inline-start` spine geometry
- Narrative order not reversed

---

## 21. Reduced-Motion Behavior

- `completeAllRailDecorations()` — immediate static rails
- Traveler hidden; order/texas tokens static
- Hero opening skipped; kinetic lines unmasked
- WebGL eligibility false → CSS frame only

---

## 22. Accessibility

- One H1 preserved in `HeroKineticHeadline`
- Canvas + traveler `aria-hidden`
- Decorative tokens `aria-hidden`
- All copy in server HTML
- Focus states on interactive controls
- No motion-only information

---

## 23. Performance Impact

| Module                    | Source size (approx.) | Loading                                 |
| ------------------------- | --------------------- | --------------------------------------- |
| `builder-frame-scene.ts`  | ~14 KB                | Dynamic import on Hero mount (desktop)  |
| `builder-map-3d-scene.ts` | ~15 KB                | IntersectionObserver (unchanged policy) |
| `HeroBuilderFrame.tsx`    | ~5 KB                 | Client wrapper                          |
| `global-traveler.ts`      | ~5 KB                 | Bundled with deferred motion chunk      |

- GSAP + motion still deferred via `DeferredHomepageRailMotion`
- Hero motion deferred via `DeferredHeroMotion`
- Portrait WebP ≤ prior workstation Hero sizes
- No continuous full-page 60fps after settle

**Lighthouse:** Formal before/after not re-run in this session. Baseline remains Phase 7.3G (`docs/PHASE_7_3G_PERFORMANCE_REPORT.md`). No structural LCP regression expected — portrait `priority` + explicit dimensions retained.

---

## 24. Old WebGL Cleanup

- Phase 7.4 Builder Map **refactored**, not duplicated
- Spherical glow shader replaced with rectangular edge-lit modules
- No dead canvas hosts; dispose paths unchanged

---

## 25. Components Created

- `src/components/v2/hero/HeroPortraitPlate.tsx`
- `src/components/v2/hero/HeroBuilderFrame.tsx`
- `src/components/v2/hero/HeroVisualStack.tsx`
- `src/components/v2/hero/HeroKineticHeadline.tsx`
- `src/components/v2/hero/DeferredHeroMotion.tsx`
- `src/components/v2/motion/GlobalTraveler.tsx`

---

## 26. Components Modified

- `HeroV2Section.tsx`
- `JourneyShell.tsx`
- `DeferredHomepageRailMotion.tsx`
- `HomepageRailMotion.tsx`
- `MethodSection.tsx`, all world sections, `ManifestoV2Section.tsx`, `ContactV2Section.tsx`
- `SystemsWorkflowBand.tsx`, `SystemsTexasFundsBranch.tsx`
- `BuilderMap.tsx` (unchanged API; 3D scene internals updated)

---

## 27. Components Deleted

None.

---

## 28. Assets Created

- `public/images/alex/alex-portrait-desktop.webp`
- `public/images/alex/alex-portrait-mobile.webp`
- `public/images/alex/alex-portrait-manifesto.webp`
- `scripts/optimize-portrait-images.mjs`

---

## 29. Assets Replaced

- Hero primary image: workstation → portrait derivatives
- Manifesto background: workstation band → portrait manifesto variant

Workstation WebPs retained on disk for rollback reference.

---

## 30. Bundle Before/After

| Metric              | Phase 7.4 (before) | Phase 7.4R (after)                      |
| ------------------- | ------------------ | --------------------------------------- |
| New npm deps        | 0                  | 0                                       |
| Homepage 3D systems | 1 (map only)       | 2 async (hero frame + map) — both gated |
| Map 3D chunk        | ~33 KB async       | ~33 KB async (refactored geometry)      |
| Hero frame chunk    | —                  | ~14 KB async (estimated minified)       |

---

## 31. Lighthouse Before/After

Not captured in this session. Recommend post-deploy spot-check on `/en` mobile + desktop using Phase 7.3G methodology.

---

## 32. Runtime Cleanup Results

- WebGL: `dispose()` on unmount; context lost handlers
- ScrollTrigger: `teardownGlobalTraveler()` on motion revert
- Resize: debounced anchor refresh
- IntersectionObserver + visibility pause on both canvases

---

## 33. Validation Results

| Command                | Result                    |
| ---------------------- | ------------------------- |
| `npm run type-check`   | ✅ Pass                   |
| `npm run lint`         | ✅ Pass                   |
| `npm run format:check` | ✅ Pass                   |
| `npm run build`        | ✅ Pass (42 static pages) |

**Runtime browser matrix:** Production server visual pass recommended on `npm run build && npx next start` at breakpoints listed in plan §27. Dev server was available at `http://localhost:3001` during implementation.

---

## 34. Visual Evidence

Automated screenshots were not captured in this environment (browser MCP unavailable). **Manual review checklist:**

- [ ] Hero desktop — portrait integrated in frame, face visible
- [ ] Hero mobile — simplified CSS frame, no overflow
- [ ] Builder Map — architectural plates, no spheres
- [ ] Gymura — silver atmosphere + title mask
- [ ] Restaurant — order token on rail
- [ ] Intelligence — layered node depth
- [ ] Security — cyan boundary geometry
- [ ] Manifesto — converged modules + portrait shadow

---

## 35. Remaining Risks

| Risk                         | Severity | Mitigation                                                         |
| ---------------------------- | -------- | ------------------------------------------------------------------ |
| Portrait crop approval       | Medium   | Alex to confirm face-forward derivatives or supply studio portrait |
| Traveler perf on long pages  | Low      | Live remeasure only on scrub; debounced resize                     |
| Hero WebGL on Tier B tablets | Low      | Simplified geometry + CSS fallback visible                         |
| Visual review incomplete     | Medium   | Alex manual screenshot pass before deploy                          |

---

## 36. Items Requiring Alex's Approval

1. **Portrait derivatives** — face-forward crops from workstation original vs. dedicated `alex-portrait-cinematic.png` if available locally
2. **Deploy** — no deployment changes made in this phase
3. **Optional studio portrait** — if provided, run `optimize-portrait-images.mjs` with updated extract regions

---

_Phase 7.4R complete per plan Stages A, B, C. Production foundation intact._
