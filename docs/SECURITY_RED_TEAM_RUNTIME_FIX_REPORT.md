# Cybersecurity Red Team Runtime Fix Report

## Exact root cause

Three compounding failures prevented visible crimson activation in production:

1. **Wrong activation algorithm** — `pickSecurityPhase()` required the Red Team node to be _closest to viewport center by distance_ **and** pass a narrow top/band gate. When stage 04 was naturally visible (especially at the lower viewport while reading), stages 02–03 remained closer to center, so phase never switched to `red-team`.

2. **Phase tied to global section winner** — Phase evaluation returned `defense` whenever `world-security` was not the active homepage section. Scrolling slightly past stage 04 let `future` win, clearing `data-security-phase` and reverting World Core to blue before the user finished the Red Team step.

3. **CSS/visual binding gaps** — Section rail accents used hardcoded `--accent-secure` (`#4ec9e0`) via `--rail-world-color`, so learning-path markers stayed cyan even when `--world-accent-rgb` updated. Three.js security preset emissive intensity (0.45) made crimson rings too subtle against the dark core.

---

## Activation logic

### Before

- Gated on `activeSectionId === "world-security"`
- Required `(topCrossed || inBand) && closestIsRedTeam` using distance-to-center
- Phase name: `security`

### After

- **Independent** `pickSecurityPhase()` — no dependency on global section winner
- **Primary rule**: whichever discipline node straddles the reading line (52% viewport height) sets phase
- **Secondary rule**: Red Team center within 45–60% viewport band
- **Hysteresis**: while `red-team` and security section remains visible, `pickActiveWorldSection()` keeps `world: security` so `future` cannot steal colors prematurely
- Phase name: `defense` | `red-team`
- Anchor: `data-security-red-team-anchor="true"` on stage 04 (locale-agnostic)

---

## CSS cascade fix

Added high-specificity root binding so crimson cannot be overridden by stale inline values:

```css
html[data-security-phase="red-team"] {
  --world-accent-rgb: 229, 72, 77;
  --world-line-rgb: 200, 58, 69;
  --world-glow-rgb: 229, 72, 77;
  --world-surface-rgb: 143, 32, 42;
}
```

Discipline rail now migrates during red-team:

```css
html[data-security-phase="red-team"] #world-security .journey-rail[data-spine-anchor="discipline"] {
  --rail-world-color: rgb(var(--world-accent-rgb));
}
```

Verified in Playwright: rail color changes from `#4ec9e0` → `rgb(229, 72, 77)`.

---

## Three.js binding fix

- `setWorldState()` continues to call `resolveWorldHex(world, securityPhase)` — no hardcoded cyan in security path
- Red-team emissive boost: rings **1.30×**, point light **1.20×** (`SECURITY_RED_TEAM_EMISSIVE_BOOST`)
- Color interpolation uses `COLOR_LERP = 1.25` (~800ms smooth transition)
- Core body remains dark (`#0a0e14`); only rings, glow emissive, and point light tint change

---

## Final phase state model

| State      | When                                                 | `data-security-phase` |
| ---------- | ---------------------------------------------------- | --------------------- |
| `defense`  | Stages 01–03, intro, Tech Stack, or outside security | `defense`             |
| `red-team` | Stage 04 dominates reading line or center band       | `red-team`            |
| cleared    | Left cybersecurity section                           | attribute removed     |

Primary world remains `security`. Phase is a substate only.

---

## Color values

### Defense (cyan)

| Token          | Value          |
| -------------- | -------------- |
| accent         | `45, 205, 225` |
| deep / surface | `17, 112, 132` |

### Red-team (crimson)

| Token            | Value                   |
| ---------------- | ----------------------- |
| primary          | `229, 72, 77` (#E5484D) |
| secondary / line | `200, 58, 69` (#C83A45) |
| deep / surface   | `143, 32, 42` (#8F202A) |

---

## Elements affected

- World Core torus ring emissive
- World Core glow emissive + point light
- `--world-accent-rgb` and related CSS variables
- Discipline rail `--rail-world-color`
- Red Team marker, number, title accent
- Global Traveler tint (reads `data-security-phase`)
- Secure spine dot
- Tech Stack hover/focus (via `--world-accent-rgb`)
- Subtle security atmosphere

## Elements intentionally unchanged

- World Core size, position, geometry, camera, ring count, motion presets
- Headings, body text, Tech Stack pills at rest
- ALEX Linux block, section background, copy, layout
- Inactive stages 01–03 styling at rest
- Other worlds

---

## Desktop behavior

- Stages 01–03: `defense`, cyan accent `45, 205, 225`
- Stage 04 centered: `red-team`, crimson `229, 72, 77`, rail migrates
- Scroll upward to stage 02: returns to `defense`
- Natural scroll: crimson activates on wheel step 3 (stage 04 crosses reading line)
- World Core width unchanged: **691.19px** (1440×900)

---

## Mobile behavior

- World Core width unchanged: **202.80px** (390×844)
- Stage 04 activation verified at 390×844
- Lower atmosphere opacity on ≤767px

---

## RTL behavior

- Activation uses `data-security-red-team-anchor="true"` — no English text matching
- Arabic stage 04 activates crimson (verified)
- No layout or mirror changes

---

## Reduced motion

- `prefers-reduced-motion: reduce` → `--world-transition-duration: 0ms`
- Instant color snap, no added pulse or ring-speed change

---

## Debugging

`?worldDebug=1` (development only) logs on state change:

- active world / security phase
- anchor top/center, reading line, viewport center
- CSS accent RGB
- Three.js target hex
- security section visibility

---

## Evidence paths

`docs/evidence/security-red-team-runtime-fix/`

| File                                 | Description                 |
| ------------------------------------ | --------------------------- |
| `en-defense-stage02-1440x900.png`    | Stage 02 cyan               |
| `en-red-team-stage04-1440x900.png`   | Stage 04 crimson            |
| `en-defense-scrollback-1440x900.png` | Scroll-up restores cyan     |
| `ar-defense-stage02-1440x900.png`    | Arabic defense              |
| `ar-red-team-stage04-1440x900.png`   | Arabic crimson              |
| `en-defense-390x844.png`             | Mobile defense              |
| `en-red-team-390x844.png`            | Mobile crimson              |
| `page@*.webm`                        | cyan → crimson → cyan video |

Capture: `node scripts/security-red-team-runtime-fix-evidence.mjs` (requires `npm run build && npx next start`)

---

## Validation results

| Command                | Result                |
| ---------------------- | --------------------- |
| `npm run type-check`   | Pass                  |
| `npm run lint`         | Pass                  |
| `npm run format:check` | Pass (after Prettier) |
| `npm run build`        | Pass — 48 SSG pages   |

Playwright phase assertions: **all matched** (EN/AR desktop + mobile).

---

## Files changed

- `src/lib/world-core/types.ts`
- `src/lib/world-core/section-activation.ts`
- `src/lib/world-core/world-colors.ts`
- `src/lib/world-core/world-core-controller.ts`
- `src/lib/world-core/world-core-scene.ts`
- `src/lib/motion/global-traveler.ts`
- `src/components/v2/journey-rail/JourneyRail.tsx`
- `src/app/globals.css`
- `src/components/world-core/world-core.css`
- `scripts/security-red-team-runtime-fix-evidence.mjs`
