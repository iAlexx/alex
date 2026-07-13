# Phase 7.4R — Cinematic Identity and Motion Upgrade Plan

**Date:** 2026-07-12  
**Status:** Pre-implementation plan (required before code changes)  
**Foundation:** Current Next.js portfolio (production) — not Lovable migration

---

## 1. Existing Architecture Assessment

### Homepage composition (`src/app/[locale]/page.tsx`)

Server-rendered sections in fixed narrative order:

1. `HeroV2Section` — static workstation image, origin rail, no 3D
2. `MethodSection` — process rail + `BuilderMap` (HTML + Phase 7.4 WebGL)
3. `WorldBrandsSection` — Gymura editorial + live preview
4. `WorldSystemsSection` — Restaurant workflow + Texas branch
5. `WorldIntelligenceSection` — `IntelligenceArchitecture`
6. `WorldSecuritySection` — learning path + ALEX Linux branch
7. `FutureDirectionSection` — open vertical rail
8. `ManifestoV2Section` — workstation atmospheric band
9. `ContactV2Section` — social links resolution

Motion: `DeferredHomepageRailMotion` → async `HomepageRailMotion` + `journey-rail-motion.ts` (GSAP ScrollTrigger, one-way section rails).

Spine: `JourneyShell` renders `data-rail-spine` + `builder-spine` CSS fragments (`spine-tokens.ts`, `globals.css`).

3D: **Only** Builder Map — native WebGL (`builder-map-3d-scene.ts`, ~33 KB async), desktop eligibility gate, pauses offscreen/hidden tab.

Performance: GSAP deferred, previews deferred, ScrollProgressLine throttled (Phase 7.3G).

SEO: Centralized `buildHomeMetadata`, structured data, sitemap/robots — must remain untouched in content/facts.

### Gaps relative to 7.4R brief

| Area                    | Current                           | Target                                              |
| ----------------------- | --------------------------------- | --------------------------------------------------- |
| Hero identity           | Workstation photo beside text     | Portrait-centered ALEX Builder Frame                |
| Global narrative object | Spine node dots per section       | One scrubbed traveler on spine                      |
| Typography              | Static reveals / rail draw        | Section-specific kinetic masks                      |
| Builder Map 3D          | Core + world nodes (spatial dots) | Architectural four-module map                       |
| World sections          | Rail motion only                  | World entry + local tokens (order, pulse, geometry) |
| Manifesto               | Wide workstation band             | Converged frame + calmer portrait treatment         |

---

## 2. Lovable Ideas Being Referenced (Visual / Interaction Only)

From `C:\Users\Master aLEX\alex-core-builder` (reference folder):

| Idea                                                | Use in 7.4R                                            | Notes                                                          |
| --------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------- |
| Portrait radial masks + rim integration             | Hero + Manifesto portrait plates                       | CSS masks, not Lovable parallax scroll                         |
| World color keys (core/brands/systems/intel/secure) | Builder Frame modules, traveler tint, kinetic emphasis | Align with existing CSS accent tokens                          |
| Kinetic line-mask headline reveal                   | Hero opening + section titles                          | GSAP masks; Arabic by line/word group                          |
| Single journey glow point                           | Global traveler                                        | Follows **existing** Builder Spine — not Lovable scroll layout |
| Cinematic opening sequence timing (~1.4–2s)         | Hero `DeferredHeroMotion`                              | Once per session; no loading screen                            |
| Manifesto darker resolved mood                      | ManifestoV2 enhancement                                | Different composition from Hero                                |

---

## 3. Lovable Code / Assets Explicitly NOT Copied

| Item                                                | Reason                                          |
| --------------------------------------------------- | ----------------------------------------------- |
| `Portfolio.tsx` monolith                            | Wrong architecture; not migrating               |
| `@react-three/fiber`, `@react-three/drei`, `three`  | No new 3D dependency; extend raw WebGL          |
| `AlexCore.tsx` icosahedron / sphere / reactor rings | Spec forbids sphere/reactor/orb visual language |
| `alex-portrait-cinematic.png` via `__l5e` URL       | Remote Lovable asset — not production-safe      |
| Lovable internal asset URLs                         | All final assets must be local                  |
| Lovable scroll-jacking / full-page canvas           | Preserves Next.js SSG + semantic HTML           |
| Matrix rain, particle fields, elastic bounce        | Explicitly forbidden                            |

---

## 4. Portrait Asset Status

### Local (portfolio `public/images/alex/`)

| Asset                             | Status                                | Role in 7.4R                                  |
| --------------------------------- | ------------------------------------- | --------------------------------------------- |
| `alex-workstation-original.png`   | **Present** (1086×1448, ~2 MB source) | Identity source — real Alex                   |
| `alex-workstation-desktop.webp`   | Present                               | Current Hero LCP                              |
| `alex-workstation-mobile.webp`    | Present                               | Current mobile Hero                           |
| `alex-workstation-manifesto.webp` | Present                               | Current Manifesto band                        |
| `alex-portrait-desktop.webp`      | **To create**                         | Face-focused crop from original (same person) |
| `alex-portrait-mobile.webp`       | **To create**                         | Tighter mobile portrait crop                  |
| `alex-portrait-manifesto.webp`    | **To create**                         | Calmer Manifesto portrait variant             |

### Missing (blocks dedicated cinematic portrait)

- `alex-portrait-cinematic.png` — referenced in Lovable only via `.asset.json` + remote URL; **not on disk** in either repo.

### Decision

- **Do not** generate or import a new face.
- **Do** derive optimized portrait WebPs from `alex-workstation-original.png` with face-forward crops (identity preserved).
- **Flag for Alex approval:** dedicated studio portrait file can replace derivatives when provided locally.
- If portrait derivatives fail, **keep workstation Hero temporarily** and document blocker.

---

## 5. Builder Frame Design

### Visual language

- **ALEX Builder Frame:** four modular architectural plates (Brands / Systems / Intelligence / Security) + thin illuminated channels + shallow depth layers.
- Materials: polished dark metal, dark glass feel, narrow edge LEDs — **not** wings, armor, helmet, reactor, or sphere.
- Portrait sits on a dedicated plane; frame sits **behind** body; max 1–2 foreground shoulder occluders — **never over face**.

### Implementation tiers

| Tier                                    | Hero frame                                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| A (desktop capable)                     | Native WebGL `builder-frame-scene.ts` — async chunk, shared lifecycle patterns with map3d |
| B (tablet / modest)                     | Reduced geometry WebGL (fewer plates, no pointer lighting)                                |
| C (mobile / save-data / low capability) | CSS/SVG modular frame (`hero-builder-frame--static`)                                      |
| Reduced motion                          | Static assembled frame + visible text; no opening scrub                                   |

### Pointer (desktop Tier A/B)

- Frame rotation: ≤ 6° combined axis
- Portrait depth: 2–6px translateZ/translate
- Background atmosphere: 4–10px shift
- Damped; disabled on `(hover: none)` / touch

---

## 6. Traveler Architecture

### Principles

- **One** DOM traveler (`data-global-traveler`, `aria-hidden`)
- Registered waypoints on spine anchors — **not** page-height SVG or hardcoded Y pixels
- Scrubbed Y (and spine X) via single GSAP ScrollTrigger timeline
- Local section rails remain **one-way** on world entry (existing `bindOnceScrollTimeline`)
- Traveler arrival triggers `data-world-active` on section → existing rail timelines fire

### Waypoint order (narrative — unchanged)

`hero (core)` → `method` → `world-brands` → `world-systems` → `world-intelligence` → `world-security` → `future` → `manifesto` → `contact`

### Technical

```
GlobalTravelerController
├── registerWaypoint(sectionId, worldTint)
├── measureAnchors() — query [data-spine-waypoint] in each JourneyShell
├── buildScrubTimeline() — interpolate top/ tint along spine inset
├── onSectionEnter — set --traveler-tint, pulse local spine ::after
└── refresh on resize (ResizeObserver, debounced)
```

RTL: traveler follows **rendered** spine geometry (`inset-inline-start`); project order unchanged.

Reduced motion: static traveler at hero origin or hidden; all rails `completeAllRailDecorations`.

Mobile: side rail traveler, 5px core / reduced glow, straight segment interpolation.

---

## 7. Motion Hierarchy

| Level | System                                      | Dominance rule                 |
| ----- | ------------------------------------------- | ------------------------------ |
| L1    | Global traveler scrub                       | One point on spine             |
| L2    | World entry color activation                | On traveler arrival            |
| L3    | Local rail / token (order, pulse, geometry) | After L2                       |
| L4    | Kinetic typography                          | Section titles / Hero headline |
| L5    | Micro-interactions                          | Hover/focus only               |

Only one level at full strength at a time; sequence: arrive → activate → local motion → typography settle → calm.

---

## 8. Existing WebGL Disposition

### Phase 7.4 Builder Map (`builder-map-3d-scene.ts`)

**Decision: REFACTOR in place — do not add second canvas system.**

- Replace decorative dot/sphere nodes with **architectural module plates** matching Builder Frame vocabulary
- Keep: eligibility, dynamic import, IntersectionObserver, visibility pause, 30fps cap, dispose path
- Remove: any sphere/icosahedron language if present in shaders/meshes
- Single `BuilderMap3D` host — no duplicate WebGL contexts on homepage

### New Hero WebGL (`builder-frame-scene.ts`)

- Separate async chunk (Hero only)
- Shares `evaluateWebGLEligibility` helper extracted from map3d eligibility
- Does **not** load on case-study routes

---

## 9. Performance Strategy

Preserve Phase 7.3G deferrals:

- Hero WebGL + Hero motion: dynamic import after paint (same pattern as `DeferredHomepageRailMotion`)
- H1 + CTAs + portrait `<img>` server-rendered with explicit dimensions (no CLS)
- Canvas `setActive(false)` when offscreen or `document.hidden`
- `devicePixelRatio` cap 1.5
- No iframe changes
- Capability tiers downgrade to CSS/SVG — full static site on WebGL failure
- Bundle measurement before/after in final report

**No new npm dependencies** — native WebGL + existing GSAP only.

---

## 10. Mobile Strategy

- Intentional mobile Hero: portrait prominent, CSS frame, no pointer parallax
- Vertical spine traveler (smaller, no trail)
- World spatial effects → CSS layers (Gymura edge light, Security plates, Intelligence depth via box-shadow/borders)
- Operational/order token: simple CSS translate along rail (or static nodes if reduced capability)
- No horizontal overflow; `overflow-x: clip` on hero shell

---

## 11. Reduced-Motion Strategy

`prefers-reduced-motion: reduce`:

- `completeAllRailDecorations` immediately (existing)
- No traveler scrub; optional static dot at core
- No Hero opening timeline; no kinetic masks
- No order token travel; nodes fully visible
- WebGL eligibility returns false → CSS static frame
- All copy visible in HTML without JS

---

## 12. Implementation Stages

### Stage A — Hero Transformation

1. Generate portrait WebPs from approved original
2. `builder-frame-scene.ts` + `HeroBuilderFrame.tsx` + CSS fallback
3. Restructure `HeroV2Section` — portrait stack + semantic copy preserved
4. `HeroKineticHeadline` + `DeferredHeroMotion` (opening 1.4–2s, session-gated)
5. Pointer depth layer (desktop)
6. Verify: face visible, no overflow, reduced motion static

### Stage B — World Motion Upgrade

1. `GlobalTraveler` + waypoint anchors on `JourneyShell`
2. Integrate traveler into `HomepageRailMotion`
3. Refactor `builder-map-3d-scene.ts` → architectural modules
4. Method energy pass + module separation hints (CSS)
5. Gymura editorial silver layers + title mask + preview edge light
6. Restaurant order token (`data-order-token`)
7. Texas data pulse
8. Intelligence spatial CSS layers + sequenced rail emphasis
9. Security cyan boundary geometry
10. Future narrowed glow + depth nodes

### Stage C — Manifesto and Final Integration

1. Manifesto portrait variant + frame convergence (CSS/SVG)
2. Contact traveler resolution + social link emphasis
3. Selected micro-interactions (buttons, links, focus parity)
4. Global color migration on spine (CSS custom properties)
5. Performance cleanup audit (rAF, observers, ST kill)
6. Accessibility regression pass
7. Full validation + visual evidence
8. `docs/PHASE_7_4R_CINEMATIC_UPGRADE_REPORT.md`

---

## 13. Risks

| Risk                                        | Mitigation                                                        |
| ------------------------------------------- | ----------------------------------------------------------------- |
| Portrait crop feels like a different person | Conservative crop from same source; Alex approval flag            |
| Two WebGL contexts on homepage              | Strict dispose; only Hero + Map; both pause offscreen             |
| Traveler desync on resize/locale            | Debounced remeasure; kill/recreate single scrub ST                |
| Arabic kinetic breaks shaping               | Line/word-group masks only; `dir=auto` + bidi isolation on tokens |
| Hero LCP regression                         | Portrait WebP ≤ workstation size; `priority` retained             |
| Builder Frame reads as sci-fi armor         | Plate-based geometry audit in visual review                       |
| ScrollTrigger duplication                   | `bindOnceScrollTimeline` + single global traveler controller      |

---

## 14. Validation Checklist (Post-Implementation)

- `npm run lint`, `type-check`, `format:check`, `build`
- Production server: `/en`, `/ar` at specified breakpoints
- Reduced motion, keyboard nav, preview deferral, offscreen canvas pause
- Screenshots: Hero desktop/mobile, Builder Map, Gymura, Restaurant token, Intelligence, Security, Manifesto
- 32 completion criteria from Phase 7.4R brief §30

---

_Plan approved for implementation — proceeding Stages A → B → C._
