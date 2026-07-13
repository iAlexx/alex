# Persistent World Core — Integration Report

**Date:** 2026-07-12  
**Scope:** One persistent Three.js World Core + homepage color migration  
**Status:** Complete

---

## 1. Executive summary

The production homepage now has **one persistent World Core** — a vanilla Three.js scene (central icosahedron + emissive core + four torus rings) fixed on the inline-end side of the viewport. It transitions across nine typed world states driven by `JourneyShell` section visibility, coordinated with the existing Global Traveler and a new `--world-*` CSS variable migration system.

**Single-canvas strategy:** Hero-local WebGL rings are disabled on the production homepage (`localWebGLRings={false}`). `BuilderMap3D` is suppressed when `USE_PERSISTENT_WORLD_CORE` is true. Exactly **one** homepage `<canvas>` remains.

**Hero composition:** Unchanged — 40/60 grid, cinematic portrait, static SVG rear rings, foreground paths.

**Mapping:** `docs/LOVABLE_WORLD_CORE_MAPPING.md`

---

## 2. Lovable source mapping

See `docs/LOVABLE_WORLD_CORE_MAPPING.md` for full file-by-file table.

Key transfers: fixed inline-end canvas, one persistent core object, torus rings, color lerp, section-driven world state, atmospheric tint.

Key omissions: R3F/Drei, Environment preset, glass transmission shell, four world nodes, pathway lines, `frameloop="always"`.

---

## 3. Production architecture

| Layer                    | Owner                                                |
| ------------------------ | ---------------------------------------------------- |
| World Core scene         | `src/lib/world-core/world-core-scene.ts`             |
| Section + CSS controller | `src/lib/world-core/world-core-controller.ts`        |
| React host               | `src/components/world-core/WorldCoreLayer.tsx`       |
| Mount point              | `DeferredHomepageRailMotion` (dynamic, `ssr: false`) |
| Hero rings (homepage)    | Static SVG only                                      |
| Hero rings (lab)         | `localWebGLRings` on `ThreeHeroComposition`          |
| Builder Map 3D           | Disabled when `USE_PERSISTENT_WORLD_CORE`            |

---

## 4. World-state model

```ts
type WorldState =
  | "core"
  | "method"
  | "brands"
  | "systems"
  | "intelligence"
  | "security"
  | "future"
  | "manifesto"
  | "contact";
```

| Section                  | Waypoint       | WorldState     |
| ------------------------ | -------------- | -------------- |
| Hero                     | `core`         | `core`         |
| Method (+ Builder Map)   | `method`       | `method`       |
| Gymura                   | `brands`       | `brands`       |
| Restaurant / Texas Funds | `systems`      | `systems`      |
| Intelligence             | `intelligence` | `intelligence` |
| Security                 | `security`     | `security`     |
| Future                   | `future`       | `future`       |
| Manifesto                | `manifesto`    | `manifesto`    |
| Contact                  | `contact`      | `contact`      |

---

## 5. Core geometry

- **Central body:** `IcosahedronGeometry(0.72, 2)` + `MeshPhysicalMaterial` (dark metallic)
- **Inner glow:** `SphereGeometry(0.48)` + emissive `MeshStandardMaterial`
- **Rings:** 4× `TorusGeometry` from `LOVABLE_TORUS_RINGS` (shared with orbital hero spec)
- **No** world nodes, particles, starfield, or glass shell

---

## 6. Color migration

CSS variables on `:root` (0.8s transition):

- `--world-accent-rgb`
- `--world-accent-soft-rgb`
- `--world-line-rgb`
- `--world-glow-rgb`
- `--world-surface-rgb`
- `--world-tint`
- `--world-transition-duration`

Applied by `applyWorldCssVariables()` in `world-core-controller.ts` on section change.

| World         | Accent character                 |
| ------------- | -------------------------------- |
| Core / Method | Electric blue                    |
| Brands        | Pearl / warm silver              |
| Systems       | Amber                            |
| Intelligence  | Violet                           |
| Security      | Cyan                             |
| Future        | Darker electric                  |
| Manifesto     | Resolved electric + multi traces |
| Contact       | Calm low-intensity blue          |

---

## 7. Global Traveler coordination

- Traveler unchanged — still scrubs between `data-spine-waypoint` anchors
- Controller reads active sections via `IntersectionObserver` + scroll sync
- `section.dataset.travelerActive` used as fallback resolver
- Hierarchy: section detection → CSS vars → core transform → (rails unchanged)

---

## 8. Hero preservation

- `OrbitalHeroVisual` composition CSS/layout **not modified**
- Homepage: `localWebGLRings={false}` → static `OrbitalHeroRingsStatic` only
- Lab route: `localWebGLRings` enabled for isolated evaluation
- No `<canvas>` in `#hero` on production homepage (verified)

---

## 9. Section-specific behavior

Presets in `section-presets.ts` control offset, scale, opacity, ring speed, emissive, camera Z:

- **Brands:** smaller, pearl emissive, lower opacity (preview-safe)
- **Systems:** amber, tighter mechanical ring speed
- **Intelligence:** violet, moderate translucency feel via emissive
- **Security:** cyan, slower ring drift, precise alignment
- **Future:** larger ring spread, core recedes
- **Manifesto:** reduced scale, slow motion
- **Contact:** edge-shifted, low opacity, subdued glow

---

## 10. Desktop / mobile / RTL

| Breakpoint      | Behavior                                                |
| --------------- | ------------------------------------------------------- |
| Desktop ≥1024   | Fixed inline-end, ~38–52vw, WebGL when eligible         |
| Tablet 768–1023 | Reduced scale/opacity, WebGL if eligible                |
| Mobile <768     | 180–260px chapter accent, bottom-inline-end, no pointer |
| RTL             | `inset-inline-end` — no photograph or ring mirror       |

---

## 11. Reduced motion / fallback

- Reduced motion: no WebGL init; `WorldCoreFallback` static SVG silhouette
- WebGL failure / save-data: same fallback
- Fallback driven by `--world-*` CSS variables
- No ring rotation when reduced

---

## 12. Lifecycle

- One rAF owner, 30fps cap
- Pause when tab hidden or layer offscreen
- Dynamic `import()` for Three.js scene module
- Full dispose on unmount (geometries, materials, renderer)
- `WorldCoreLayer` loaded with `ssr: false` (no hydration mismatch)

---

## 13. Performance

| Metric                      | Result                                                   |
| --------------------------- | -------------------------------------------------------- |
| Homepage canvases (desktop) | **1**                                                    |
| Hero canvas                 | **0**                                                    |
| Projects route canvases     | **0**                                                    |
| Builder Map 3D              | Suppressed (static map only)                             |
| Console errors (Playwright) | **0**                                                    |
| Scene chunk                 | Dynamic import of `world-core-scene.ts` + shared `three` |

Lighthouse LCP/TBT not re-run in this pass; recommend post-deploy measurement.

---

## 14. Validation

| Command              | Result                              |
| -------------------- | ----------------------------------- |
| `npm run type-check` | ✅                                  |
| `npm run lint`       | ✅                                  |
| `npm run build`      | ✅ SSG `/en`, `/ar`                 |
| Single canvas verify | ✅ 1 homepage, 0 projects           |
| Hydration            | ✅ No React #418 after `ssr: false` |

---

## 15. Files created

- `docs/LOVABLE_WORLD_CORE_MAPPING.md`
- `src/lib/world-core/config.ts`
- `src/lib/world-core/types.ts`
- `src/lib/world-core/world-colors.ts`
- `src/lib/world-core/section-presets.ts`
- `src/lib/world-core/eligibility.ts`
- `src/lib/world-core/world-core-scene.ts`
- `src/lib/world-core/world-core-controller.ts`
- `src/components/world-core/WorldCoreLayer.tsx`
- `src/components/world-core/WorldCoreFallback.tsx`
- `src/components/world-core/use-world-core-scene.ts`
- `src/components/world-core/world-core.css`
- `scripts/persistent-world-core-screenshots.mjs`
- `docs/evidence/persistent-world-core/*` (21 screenshots)

---

## 16. Files modified

- `src/components/v2/motion/DeferredHomepageRailMotion.tsx` — mount World Core
- `src/components/home/hero-orbital/OrbitalHeroVisual.tsx` — `localWebGLRings` prop
- `src/components/home/hero-orbital/OrbitalHeroComposition.tsx` — pass prop
- `src/components/three-hero-lab/ThreeHeroComposition.tsx` — lab WebGL rings
- `src/components/v2/map3d/BuilderMap3D.tsx` — suppressed for single canvas
- `src/app/globals.css` — `--world-*` variables

**Not modified:** section copy, CTAs, SEO, case studies, live previews, traveler core logic, portrait asset.

---

## 17. Evidence paths

`docs/evidence/persistent-world-core/`

Desktop EN: hero, brands, systems, intelligence, security, future, manifesto, contact  
Desktop AR: hero, brands, security, contact  
Mobile: hero/gymura/restaurant/intelligence/security at 390×844 and 320×568  
Reduced motion: `en-brands-reduced-motion-1440x900.png`

Scroll recordings were not captured in this pass (screenshots only).

---

## 18. Rollback

Set `USE_PERSISTENT_WORLD_CORE = false` in `src/lib/world-core/config.ts`:

- Removes World Core layer (or gate mount in `DeferredHomepageRailMotion`)
- Re-enables `BuilderMap3D`
- Hero remains static SVG rings (re-enable `localWebGLRings` separately if desired)

---

## 19. Known risks

| Risk                                                           | Mitigation                                               |
| -------------------------------------------------------------- | -------------------------------------------------------- |
| World Core may overlap preview-heavy sections on small laptops | Per-state opacity/offset presets; brands/systems reduced |
| Three.js chunk size additive on homepage                       | Single dynamic import; Builder Map 3D disabled           |
| Section IO may lag fast scroll                                 | Traveler `data-traveler-active` fallback                 |
| Manifesto multi-color traces simplified                        | Single primary with soft secondary RGB                   |

---

## 20. Items requiring Alex approval

1. Persistent World Core visual weight vs content on desktop
2. Builder Map 3D disabled in favor of single canvas (static map remains)
3. Mobile World Core placement (bottom-inline-end accent)
4. Post-deploy Lighthouse confirmation

---

**Stop point:** Persistent World Core + color migration complete. No section content redesign.
