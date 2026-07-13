# World Core Lighting & Glow Refinement

## Summary

Refined persistent World Core nucleus readability without changing geometry, size, position, camera, ring count, motion, or world activation logic. The nucleus stays dark and premium while active world color is more visible through controlled emissive zones, rim separation, boosted lights, and a subtle CSS nucleus glow.

---

## Problem

World Core geometry and crimson world identity were correct, but the central nucleus appeared too dark and flat. Active world color was not readable enough on the sphere surface.

---

## Changes

### Three.js scene (`world-core-scene.ts`)

| Layer                                | Change                                                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Nucleus** (`MeshPhysicalMaterial`) | Dark charcoal base preserved; added world-driven `emissive` at 0.17; metalness/reflectivity tuned for specular reads |
| **Reflection shell**                 | Inner sphere (r=0.58) with world emissive, opacity 0.28                                                              |
| **Inner glow**                       | Existing glow sphere opacity raised to 0.34                                                                          |
| **Fresnel rim**                      | BackSide shell (r=0.80), opacity 0.21 — silhouette separation                                                        |
| **Hotspots**                         | 3 small emissive zones at fixed offsets for world-colored reflections                                                |
| **Rings**                            | Global emissive multiplier **1.26×** (~26% brighter)                                                                 |
| **Lights**                           | Key 1.1→1.38 (+25%), fill 0.5→0.62 (+24%), new rim light 0.5, point 0.6→0.72 (+20%)                                  |
| **Security**                         | Retains small extra boost on top of global multipliers                                                               |

Constants live in `WORLD_CORE_LIGHTING` (`world-colors.ts`).

### CSS host glow (`world-core.css`)

Dual radial on `.world-core-layer__tint`:

- Tight nucleus glow (~0.10 peak opacity)
- Wider atmosphere (~0.08 peak)
- No rectangular panel; max opacity within 0.08–0.12 range

### Static fallback (`WorldCoreFallback.tsx`)

- Brighter core gradient and rim ring
- Ring stroke opacity +20–25%
- Core center opacity 0.35→0.42

---

## Unchanged

- World Core size, position, geometry radii, ring thickness, camera, motion presets
- Section layout, color activation logic, permanent crimson security behavior
- Global Traveler behavior
- No postprocessing or bloom libraries

---

## Lighting multipliers (`WORLD_CORE_LIGHTING`)

| Parameter          | Before (approx) | After |
| ------------------ | --------------- | ----- |
| Key light          | 1.10            | 1.38  |
| Fill light         | 0.50            | 0.62  |
| Rim light          | —               | 0.50  |
| Point light        | 0.60            | 0.72  |
| Nucleus emissive   | 0               | 0.17  |
| Ring emissive mul  | 1.00            | 1.26  |
| Glow emissive mul  | 1.00            | 1.28  |
| Reflection opacity | —               | 0.28  |
| Rim shell opacity  | —               | 0.21  |

---

## Evidence

`docs/evidence/world-core-lighting-glow/`

| File                                       | World               |
| ------------------------------------------ | ------------------- |
| `after-hero-core-blue-1440x900.png`        | Core blue           |
| `after-gymura-silver-1440x900.png`         | Brands silver       |
| `after-restaurant-amber-1440x900.png`      | Systems amber       |
| `after-intelligence-violet-1440x900.png`   | Intelligence violet |
| `after-cybersecurity-crimson-1440x900.png` | Security crimson    |

Capture: `node scripts/world-core-lighting-glow-screenshots.mjs`

---

## Validation

| Command                | Result |
| ---------------------- | ------ |
| `npm run type-check`   | Pass   |
| `npm run lint`         | Pass   |
| `npm run format:check` | Pass   |
| `npm run build`        | Pass   |

World Core layer dimensions verified unchanged across world screenshots.

---

## Files changed

- `src/lib/world-core/world-colors.ts`
- `src/lib/world-core/world-core-scene.ts`
- `src/components/world-core/world-core.css`
- `src/components/world-core/WorldCoreFallback.tsx`
- `scripts/world-core-lighting-glow-screenshots.mjs`
