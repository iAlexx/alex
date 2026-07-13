# Cybersecurity Permanent Crimson World Report

## Summary

The Cybersecurity section now uses a **single permanent crimson world identity**. The internal `defense` / `red-team` substate system, stage-04 activation, `data-security-phase`, and `data-security-red-team-anchor` have been removed.

When `world-security` is the active homepage world, all accent systems transition to crimson and remain crimson for the entire section — stages 01 through 04, intro, Tech Stack, and principles rail. Crimson clears only when another main world (e.g. Future) becomes active.

---

## Removed

| Item                                            | Status  |
| ----------------------------------------------- | ------- |
| `SecurityPhase` type (`defense`, `red-team`)    | Removed |
| `pickSecurityPhase()`                           | Removed |
| `data-security-phase` on `<html>`               | Removed |
| `data-security-red-team-anchor` on stage 04     | Removed |
| Red Team hysteresis / reading-line activation   | Removed |
| Cyan security palette / restoration logic       | Removed |
| `resolveSecurityTravelerTint()` phase branching | Removed |

---

## Permanent crimson palette

| Token                   | RGB           | Hex       |
| ----------------------- | ------------- | --------- |
| primary / accent        | `229, 72, 77` | `#E5484D` |
| secondary / line / soft | `200, 58, 69` | `#C83A45` |
| deep / surface          | `143, 32, 42` | `#8F202A` |

Applied via:

- `WORLD_RGB.security` / `WORLD_HEX.security` in `world-colors.ts`
- `--accent-secure: #e5484d` in `globals.css`
- `applyWorldCssVariables("security")` when section is active

---

## Elements affected (entire security section)

- World Core torus rings, glow emissive, point light
- `--world-accent-rgb` and related CSS variables
- Global Traveler (`var(--accent-secure)`)
- Cybersecurity journey rails (`--rail-world-color`)
- Builder spine secure fragment
- Tech Stack hover/focus (via `--world-accent-rgb`)
- Subtle security atmosphere (`--world-atmosphere-strength: 0.07`)

### Three.js visibility

Security world applies permanent emissive boost: rings **1.30×**, point **1.20×**. Core body stays dark (`#0a0e14`).

---

## Elements unchanged

- World Core size, position, geometry, ring count, camera, motion presets
- Main body text, headings at rest
- Full section background (obsidian)
- Tech Stack pills at rest
- ALEX Linux block
- Copy, layout, section order
- Other worlds (Brands, Systems, Intelligence, Future, etc.)

---

## Expected behavior

| Scroll position                            | World          | Accent            |
| ------------------------------------------ | -------------- | ----------------- |
| Before Cybersecurity                       | Previous world | Previous color    |
| Enter Cybersecurity                        | `security`     | Crimson (~800ms)  |
| Stages 01–04, intro, scroll within section | `security`     | Crimson (no cyan) |
| Leave to Future                            | `future`       | Future blue       |
| Scroll back into Cybersecurity             | `security`     | Crimson again     |

---

## Architecture

Single world state — no substates:

```
pickActiveWorldSection() → { world: "security", sectionId: "world-security" }
applyWorldCssVariables("security")
setWorldState("security")
```

One controller, one canvas, no phase parameter on scene handle.

---

## Validation

| Check                                | Result    |
| ------------------------------------ | --------- |
| `npm run type-check`                 | Pass      |
| `npm run lint`                       | Pass      |
| `npm run format:check`               | Pass      |
| `npm run build`                      | Pass      |
| Cybersecurity never cyan when active | Verified  |
| Stages 01–04 same crimson            | Verified  |
| EN + AR                              | Verified  |
| Reduced motion instant snap          | Preserved |

---

## Files changed

- `src/lib/world-core/types.ts`
- `src/lib/world-core/world-colors.ts`
- `src/lib/world-core/section-activation.ts`
- `src/lib/world-core/world-core-controller.ts`
- `src/lib/world-core/world-core-scene.ts`
- `src/lib/motion/global-traveler.ts`
- `src/components/v2/journey-rail/JourneyRail.tsx`
- `src/components/v2/WorldSecuritySection.tsx`
- `src/app/globals.css`
- `src/components/world-core/world-core.css`
- `src/lib/map3d/builder-map-3d-scene.ts`
