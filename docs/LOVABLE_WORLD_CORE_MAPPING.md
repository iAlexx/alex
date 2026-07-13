# Lovable World Core — Source Mapping

**Date:** 2026-07-12  
**Lovable reference:** `C:\Users\Master aLEX\alex-core-builder`  
**Production target:** `C:\Users\Master aLEX\Desktop\portfolio`  
**Status:** Pre-implementation inspection complete

---

## 1. Exact Lovable files inspected

| File                                                | Role                                              |
| --------------------------------------------------- | ------------------------------------------------- |
| `src/components/AlexCore.tsx`                       | Persistent 3D core + rings (R3F)                  |
| `src/components/Portfolio.tsx`                      | Fixed canvas host, world state, section observers |
| `src/components/Portrait.tsx`                       | Hero portrait (CSS mask — not World Core)         |
| `src/components/Kinetic.tsx`                        | `useInView` helper for section detection          |
| `src/styles.css`                                    | World brand colors, background, grain             |
| `src/assets/alex-portrait-cinematic.png.asset.json` | Remote portrait URL (not transferred)             |

No separate helper modules for AlexCore — logic is self-contained in `AlexCore.tsx` + `Portfolio.tsx`.

---

## 2. Source-to-production mapping table

| Lovable source  | Component / function             | Visual responsibility                                       | Relevant values                                                                                               | Reuse conceptually                                                         | Reimplement in production                      | Must NOT transfer                                                     | Production target                              |
| --------------- | -------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| `AlexCore.tsx`  | `Core`                           | Central icosahedron + inner emissive sphere + 4 torus rings | Icosahedron r=0.75; inner sphere r=0.5; rings r=1.35–2.15; tube 0.005–0.012; tilts per ring                   | One persistent object; color lerp; ring drift; pointer tilt; breathe scale | Vanilla Three.js scene (no R3F/Drei)           | `MeshTransmissionMaterial`, glass shell, 4 world nodes, pathway lines | `src/lib/world-core/world-core-scene.ts`       |
| `AlexCore.tsx`  | `WORLD_COLORS`                   | Active world accent                                         | core `#2F80FF`, brands `#F3EFE7`, systems `#E7A13B`, intel `#835BFF`, secure `#27D5E8`                        | Typed world palette + lerp                                                 | Map to production `WorldState` + CSS RGB vars  | Lovable `WorldKey` names (`intel`, `secure`)                          | `src/lib/world-core/world-colors.ts`           |
| `AlexCore.tsx`  | `useFrame` color lerp            | Smooth emissive transition                                  | `lerp(target, dt * 2)`                                                                                        | Interpolate ring/core emissive + lights                                    | rAF loop with capped dt                        | Always-on R3F frameloop                                               | `world-core-scene.ts` animate loop             |
| `AlexCore.tsx`  | `useFrame` pointer               | Desktop depth response                                      | `pointer.x * 0.55`, `pointer.y * 0.4`, slerp 0.06                                                             | Subtle pointer tilt on capable desktop                                     | Pointer on fixed layer only                    | Pointer on mobile                                                     | `world-core-controller.ts`                     |
| `AlexCore.tsx`  | `useFrame` ring spin             | Continuous ring rotation                                    | `z += 0.0035 * (i+1) * (0.4 + intensity)`                                                                     | World-scaled ring speed                                                    | Per-state `ringSpeed` multiplier               | Aggressive always-on spin                                             | `world-core-scene.ts`                          |
| `AlexCore.tsx`  | `useFrame` breathe               | Core scale pulse                                            | `sin(time * 0.6) * 0.02`                                                                                      | Subtle breathe                                                             | Optional; reduced on non-core worlds           | Large pulsing glow                                                    | `world-core-scene.ts`                          |
| `AlexCore.tsx`  | `AlexCore` Canvas                | Renderer host                                               | dpr `[1,1.75]`, camera `[0,0,5.5]` fov 42, fog `#05070B` 6–14                                                 | Perspective camera + alpha + fog                                           | `WebGLRenderer` capped DPR 1.5, 30fps          | `frameloop="always"` unpaused                                         | `src/components/world-core/WorldCoreLayer.tsx` |
| `AlexCore.tsx`  | Lights                           | Scene lighting                                              | ambient 0.35; key `#8fb2ff`; fill `#835BFF`; point follows world color                                        | Key/fill/point with world tint                                             | `DirectionalLight` + `PointLight` lerp         | `Environment preset="night"`                                          | `world-core-scene.ts`                          |
| `AlexCore.tsx`  | `Float` (Drei)                   | Idle float motion                                           | speed 0.8, rotation 0.15                                                                                      | Calm idle motion                                                           | Manual subtle Y oscillation                    | Drei Float dependency                                                 | `world-core-scene.ts` (optional, low amp)      |
| `Portfolio.tsx` | `WORLD_META`                     | Page tint per world                                         | tint rgba per world                                                                                           | Atmospheric radial tint on canvas host                                     | `--world-*` CSS vars + layer tint div          | Hardcoded English labels                                              | `world-colors.ts` + `world-core.css`           |
| `Portfolio.tsx` | Fixed canvas layer               | Persistent right-side 3D                                    | `fixed top-0 right-0 w-full lg:w-[55%] h-screen z-0 pointer-events-none`                                      | Fixed inline-end layer                                                     | `world-core-layer` with RTL `inset-inline-end` | Full-width on mobile unchanged                                        | `WorldCoreLayer.tsx` + `world-core.css`        |
| `Portfolio.tsx` | `useState(world)`                | Central world state                                         | Single `WorldKey` state lifted to Portfolio                                                                   | One controller owns state                                                  | `WorldCoreController`                          | Per-section direct canvas mutation                                    | `world-core-controller.ts`                     |
| `Portfolio.tsx` | Section `useInView` + `setWorld` | Section → world mapping                                     | Hero→core; Gymura→brands; Restaurant/Texas→systems; Alexa→intel; Secure→secure; Future/Manifesto/Contact→core | Intersection-based active section                                          | `IntersectionObserver` on `data-spine-section` | One-shot disconnect after first view                                  | `world-core-controller.ts`                     |
| `Portfolio.tsx` | `reduced` motion gate            | No canvas when reduced                                      | `prefers-reduced-motion` hides AlexCore entirely                                                              | Static fallback path                                                       | `WorldCoreFallback` SVG + CSS vars             | Empty div placeholder                                                 | `WorldCoreFallback.tsx`                        |
| `Portfolio.tsx` | Hero hover `setWorld`            | Preview world on nav hover                                  | Mouse enter/leave on world links                                                                              | Not transferred to production                                              | Traveler + scroll observer only                | Hover-driven world preview                                            | —                                              |
| `Kinetic.tsx`   | `useInView`                      | IO threshold helper                                         | threshold 0.2–0.3, disconnect on first intersect                                                              | Section visibility detection                                               | Multi-threshold IO for active section          | Disconnect after first view                                           | `world-core-controller.ts`                     |
| `Portrait.tsx`  | Portrait plate                   | Hero visual (separate)                                      | Mask, rims, parallax                                                                                          | Already in production orbital hero                                         | No change to portrait                          | Remote asset URL                                                      | `OrbitalHeroPortrait.tsx` (unchanged)          |
| `styles.css`    | `:root` brand vars               | CSS world colors                                            | `--brand-brands`, `--brand-systems`, etc.                                                                     | Align with production accents                                              | Map to `--world-accent-rgb` migration          | Lovable-only font/theme shell                                         | `globals.css`                                  |

---

## 3. Core geometry (Lovable → production)

| Element      | Lovable                                                                             | Production plan                                                        |
| ------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Central body | `icosahedronGeometry(0.75, 3)` + `meshPhysicalMaterial` metalness 1, roughness 0.22 | `IcosahedronGeometry(0.72, 2)` + `MeshPhysicalMaterial` dark `#0a0e14` |
| Inner glow   | `sphereGeometry(0.5)` emissive, intensity 1.8                                       | `SphereGeometry(0.48)` `MeshStandardMaterial` emissive lerp            |
| Glass shell  | `MeshTransmissionMaterial` (Drei)                                                   | **Omitted** — production-safe satin core only                          |
| Rings        | 4× `torusGeometry` (same radii as lab)                                              | Reuse `LOVABLE_TORUS_RINGS` from `portrait-spec.ts`                    |
| World nodes  | 4 spheres at ring radius                                                            | **Omitted** per scope                                                  |
| Pathways     | `lineBasicMaterial` to nodes                                                        | **Omitted**                                                            |

---

## 4. Camera, materials, lighting

| Parameter       | Lovable                                             | Production                            |
| --------------- | --------------------------------------------------- | ------------------------------------- |
| Camera position | `[0, 0, 5.5]`                                       | Same base; per-state `cameraZ` offset |
| FOV             | 42                                                  | 42                                    |
| Fog             | `#05070B`, near 6, far 14                           | Same                                  |
| Ring material   | `MeshStandardMaterial` metalness 0.9, emissive lerp | Same pattern                          |
| Key light       | `#8fb2ff`, intensity 1.1                            | Lerp toward world color               |
| Fill light      | `#835BFF`, 0.5                                      | Lerp; reduced on security/future      |
| Point light     | World color, 0.6                                    | Lerp with world state                 |

---

## 5. World color map

| WorldState     | Lovable key               | Hex (Lovable) | Production accent                  |
| -------------- | ------------------------- | ------------- | ---------------------------------- |
| `core`         | core                      | `#2F80FF`     | `var(--color-electric)`            |
| `method`       | core (Philosophy/Builder) | `#2F80FF`     | electric blue                      |
| `brands`       | brands                    | `#F3EFE7`     | `var(--accent-brand)` pearl/silver |
| `systems`      | systems                   | `#E7A13B`     | `var(--accent-system)` amber       |
| `intelligence` | intel                     | `#835BFF`     | `var(--accent-intel)` violet       |
| `security`     | secure                    | `#27D5E8`     | `var(--accent-secure)` cyan        |
| `future`       | core                      | `#2F80FF`     | electric → darker space            |
| `manifesto`    | core + 4 dots             | multi         | resolved electric + world traces   |
| `contact`      | core                      | `#2F80FF`     | calm electric, low intensity       |

---

## 6. Section-state logic (Lovable → production)

| Lovable section | `setWorld` | Production `WorldState` | JourneyShell waypoint |
| --------------- | ---------- | ----------------------- | --------------------- |
| Hero            | core       | `core`                  | `core`                |
| Philosophy      | core       | `method`                | `method`              |
| Builder System  | core       | `method`                | `method`              |
| Gymura          | brands     | `brands`                | `brands`              |
| Restaurant      | systems    | `systems`               | `systems`             |
| Texas Bot       | systems    | `systems`               | `systems`             |
| Alexa AI        | intel      | `intelligence`          | `intelligence`        |
| Automation Lab  | intel      | `intelligence`          | `intelligence`        |
| Secure          | secure     | `security`              | `security`            |
| Alex Linux      | secure     | `security`              | `security`            |
| Future          | core       | `future`                | `future`              |
| Manifesto       | core       | `manifesto`             | `manifesto`           |
| Contact         | core       | `contact`               | `contact`             |

Production uses **one section per `spineWaypoint`** (Method includes Builder Map). Texas Funds shares `systems` with Restaurant.

---

## 7. Motion model

| Behavior       | Lovable                       | Production                                             |
| -------------- | ----------------------------- | ------------------------------------------------------ |
| Render loop    | R3F `frameloop="always"`      | Single rAF owner; pause hidden/offscreen; 30fps cap    |
| Color change   | Continuous lerp in `useFrame` | Same; 0.6–1.0s effective via `dt * 2`                  |
| Section change | Instant `setWorld` on inView  | IO center-band + traveler `data-travelerActive` sync   |
| Pointer        | R3F pointer in `useFrame`     | Desktop fine pointer only                              |
| Mobile         | Full fixed canvas (55% lg)    | Reduced scale 180–260px; simplified/static; no pointer |
| Reduced motion | Canvas not mounted            | `WorldCoreFallback` static SVG                         |

---

## 8. What will be transferred

- One fixed inline-end canvas layer across homepage scroll
- One persistent central core + torus rings
- Smooth emissive/light color interpolation
- Single active world state driven by section visibility
- World-specific transform presets (scale, position, opacity, ring speed)
- CSS atmospheric tint tied to active world
- Shared torus ring constants with approved orbital hero
- Pause/offscreen/hidden-tab lifecycle discipline

---

## 9. What will NOT be transferred

- React Three Fiber, Drei, `Environment`, `Float`, `MeshTransmissionMaterial`
- Four directional world nodes + pathway lines
- Lovable routing, Nav, monolithic Portfolio
- Remote portrait / asset URLs
- `frameloop="always"` without pause
- Hover-preview world switching in Hero footer
- Identity badge / black panel / English-only copy
- Second homepage canvas (Hero WebGL rings retired on production homepage)

---

## 10. Production architecture plan

### Decision: **Strategy B** — replace Hero-only WebGL with one shared persistent World Core

| Current                                                          | After                                                |
| ---------------------------------------------------------------- | ---------------------------------------------------- |
| `OrbitalHeroVisual` owns `useOrbitRingsScene` (hero-local WebGL) | Hero uses **static SVG rings only** on homepage      |
| No persistent homepage 3D                                        | `WorldCoreLayer` fixed inline-end, one canvas        |
| Traveler sets `--global-spine-tint` only                         | `WorldCoreController` also sets `--world-*` RGB vars |
| `orbit-rings-scene.ts` hero-only                                 | Retained for **lab route** (`localWebGLRings` prop)  |

### File plan

| Path                                                      | Role                                       |
| --------------------------------------------------------- | ------------------------------------------ |
| `src/lib/world-core/types.ts`                             | `WorldState`, presets, API types           |
| `src/lib/world-core/world-colors.ts`                      | Hex + RGB + CSS variable writers           |
| `src/lib/world-core/section-presets.ts`                   | Per-world transform/light presets          |
| `src/lib/world-core/world-core-scene.ts`                  | Vanilla Three.js persistent scene          |
| `src/lib/world-core/world-core-controller.ts`             | Section observer, traveler sync, lifecycle |
| `src/lib/world-core/eligibility.ts`                       | WebGL eligibility (extends orbital rules)  |
| `src/components/world-core/WorldCoreLayer.tsx`            | Homepage fixed layer host                  |
| `src/components/world-core/WorldCoreFallback.tsx`         | Static SVG fallback                        |
| `src/components/world-core/use-world-core-scene.ts`       | Dynamic import + hook                      |
| `src/components/world-core/world-core.css`                | Placement, mobile, RTL                     |
| `src/components/v2/motion/DeferredHomepageRailMotion.tsx` | Mount `WorldCoreLayer`                     |
| `src/app/globals.css`                                     | `--world-accent-rgb` migration vars        |
| `OrbitalHeroVisual.tsx`                                   | `localWebGLRings` prop; default `false`    |

### Hero preservation

- 40/60 grid, portrait, mask, rims, grain, foreground SVG **unchanged**
- Hero rear rings remain **static SVG** (already approved fallback)
- Persistent World Core provides continuous 3D language on inline-end (Lovable Portfolio pattern)
- No second canvas in Hero DOM

### Global Traveler coordination

- Controller reads `section.dataset.travelerActive` on traveler `onUpdate` (via custom event or shared scroll listener)
- Hierarchy: traveler arrival → CSS color migration → core transform → rail emphasis (rails unchanged)

---

## 11. Render-loop limitations (Lovable vs production)

| Lovable issue              | Production mitigation                       |
| -------------------------- | ------------------------------------------- |
| Always rendering           | `setActive(false)` when hidden/offscreen    |
| No dispose on route change | Full dispose on unmount / locale navigation |
| dpr up to 1.75             | Cap 1.5 desktop, 1.0 mobile                 |
| No save-data check         | `assessWorldCoreEligibility()` gates WebGL  |

---

_Mapping complete. Implementation proceeds per this plan._
