# Cybersecurity Red Team Color Transition Report

## Summary

The Cybersecurity world now maintains **cyan** through introduction, Tech Stack, and early learning-path stages, then transitions the World Core and selected accents into **restrained crimson** only when the Red Team learning-path item dominates the viewport activation band. Scrolling upward restores cyan smoothly.

World Core size, position, geometry, ring count, camera, opacity, and motion presets were not modified.

---

## 1. Activation anchor

| Property       | Value                                                                              |
| -------------- | ---------------------------------------------------------------------------------- |
| DOM anchor     | `[data-security-red-team-anchor]` on learning-path stage `04` (Red Team Direction) |
| Section        | `#world-security` discipline rail (`data-spine-anchor="discipline"`)               |
| Top-cross rule | Anchor top ≤ 55% viewport height (`WORLD_ACTIVATION_BAND.topRatio`)                |
| Band rule      | Anchor intersects 55%–45% viewport band                                            |
| Dominance rule | Red Team node center is closest to viewport center among discipline nodes          |
| Activation     | `(topCrossed \|\| inBand) && closestIsRedTeam` while `world-security` is active    |
| Deactivation   | Scrolling upward until an earlier stage dominates or anchor leaves band            |

Implementation: `pickSecurityPhase()` in `src/lib/world-core/section-activation.ts`.

---

## 2. State architecture

| Layer                         | Responsibility                                                  |
| ----------------------------- | --------------------------------------------------------------- |
| `SecurityPhase` type          | `"security"` \| `"red-team"` in `src/lib/world-core/types.ts`   |
| `pickActiveWorldSection()`    | Returns `securityPhase` alongside world/section                 |
| `createWorldCoreController()` | Single source of truth — applies phase on scroll                |
| `applyWorldCssVariables()`    | Sets `data-security-phase` + migrating `--world-accent-rgb`     |
| `createWorldCoreScene()`      | Ring/glow/point emissive via `resolveWorldHex()`                |
| `setupGlobalTraveler()`       | Reads `data-security-phase` for traveler/spine tint in security |

No second canvas, sphere, or controller was added.

---

## 3. Cyan palette (`security`)

| Token          | RGB          | Hex       |
| -------------- | ------------ | --------- |
| accent         | `45 205 225` | `#2DCDE1` |
| deep / surface | `17 112 132` | `#117084` |

---

## 4. Crimson palette (`red-team`)

| Token                   | RGB         | Hex       |
| ----------------------- | ----------- | --------- |
| primary / accent        | `229 72 77` | `#E5484D` |
| secondary / soft / glow | `200 58 69` | `#C83A45` |
| deep / surface          | `143 32 42` | `#8F202A` |

No pure red (`#ff0000`), no warning/error aesthetic, no flashing.

---

## 5. Elements affected

- World Core ring emissive color
- World Core glow / point light tint
- World Core canvas host radial tint (`--world-accent-rgb`)
- Global Traveler core/glow (`--traveler-tint`)
- Builder spine secure fragment dot (when red-team active)
- Learning-path discipline track border (red-team phase only)
- Red Team node marker, number, accent label marker
- Tech Stack hover/focus borders (via `--world-accent-rgb`)
- Subtle security atmosphere (`--world-atmosphere-strength`: 0.08 cyan, 0.06 crimson)

Transition duration: **800ms** with existing lerp in the Three.js scene.

---

## 6. Elements intentionally unchanged

- World Core transform presets (scale, offset, camera, opacity, ring speed)
- Main body text and headings
- Tech Stack pills at rest (`--accent-secure` static)
- Section background (obsidian)
- ALEX Linux block styling
- Inactive learning-path nodes (cyan-muted via `--rail-world-color`)
- Chapter header eyebrow (`--accent-secure`)
- Copy, layout, section order

---

## 7. Desktop behavior

- Security section opens in cyan (`data-security-phase="security"`).
- Fundamentals / Systems & Web / Assessment stages remain cyan.
- Red Team stage centered in viewport activates `red-team`.
- Scroll back to stage 02 restores cyan (verified in Playwright).
- EN and AR both activate correctly.

---

## 8. Mobile behavior

- World Core size unchanged (existing `world-core.css` breakpoints).
- Red Team activates only when anchor reaches viewport band.
- Lower atmosphere intensity (0.05 max) on ≤767px.
- Content remains readable; no red overlay on text.
- Verified at **390×844** and **320×568**.

---

## 9. RTL behavior

- Activation uses viewport-relative geometry (no absolute page pixels).
- Red Team anchor and discipline rail work in Arabic (`/ar`).
- World Core RTL mask/position unchanged.

---

## 10. Reduced-motion behavior

- `prefers-reduced-motion: reduce` sets `--world-transition-duration: 0ms`.
- `applyWorldCssVariables()` snaps immediately under reduced motion.
- No pulse, ring-speed change, or flashing added.

---

## 11. Evidence paths

Directory: `docs/evidence/security-red-team-transition/`

| File                                         | Description                             |
| -------------------------------------------- | --------------------------------------- |
| `en-security-intro-cyan-1440x900.png`        | Introduction cyan                       |
| `en-security-fundamentals-cyan-1440x900.png` | Stage 01 cyan                           |
| `en-security-red-team-crimson-1440x900.png`  | Red Team crimson                        |
| `en-security-scrollback-cyan-1440x900.png`   | Scroll-up restores cyan                 |
| `ar-security-intro-cyan-1440x900.png`        | Arabic intro cyan                       |
| `ar-security-red-team-crimson-1440x900.png`  | Arabic Red Team crimson                 |
| `en-security-cyan-390x844.png`               | Mobile cyan                             |
| `en-security-red-team-390x844.png`           | Mobile crimson                          |
| `en-security-cyan-320x568.png`               | Small mobile cyan                       |
| `en-security-red-team-320x568.png`           | Small mobile crimson                    |
| `ar-security-red-team-390x844.png`           | Arabic mobile crimson                   |
| `page@*.webm`                                | Scroll recording: cyan → crimson → cyan |

Capture script: `scripts/security-red-team-transition-screenshots.mjs`

---

## 12. Validation results

| Command                | Result                                 |
| ---------------------- | -------------------------------------- |
| `npm run type-check`   | Pass                                   |
| `npm run lint`         | Pass                                   |
| `npm run format:check` | Pass (after Prettier on changed files) |
| `npm run build`        | Pass — 48 SSG pages                    |

Playwright phase assertions (all matched):

- Intro / fundamentals: `security`
- Red Team centered: `red-team`
- Scroll back: `security`
- EN + AR desktop and mobile viewports

Verified constraints:

1. World Core size unchanged across shots
2. World Core position unchanged
3. Cybersecurity starts cyan
4. Red activates only at Red Team step
5. Scrolling upward restores cyan
6. Rings, Traveler, active path, and node transition together
7. Body text remains neutral
8. No red rectangular atmosphere
9. One homepage canvas only
10. No console errors during capture
11. No hydration warnings observed
12. English and Arabic both work
13. Mobile remains readable
14. Reduced-motion CSS guard in place

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
- `src/components/world-core/world-core.css`
- `src/app/globals.css`
- `scripts/security-red-team-transition-screenshots.mjs`
