# World Core Color Activation Fix Report

**Date:** 2026-07-12  
**Scope:** Fix rectangular panel + premature world color visibility only  
**Status:** Complete

---

## 1. Executive summary

Two production issues were fixed without changing World Core geometry, Hero composition, section content, or Global Traveler behavior:

1. **Rectangular inline-end panel** — removed hard bounded tint and `overflow: hidden` clipping on the World Core layer; replaced with transparent host + extended soft radial atmosphere.
2. **Premature / stacked world colors** — replaced always-on section `background-image` atmospheres and continuity color bands with **exclusive** `data-world-active="1"` activation driven by viewport center-band crossing.

---

## 2. Root cause — rectangular panel

| Source                    | Issue                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `.world-core-layer`       | `overflow: hidden` + fixed `48vw` box clipped canvas/tint, creating a visible rectangular boundary           |
| `.world-core-layer__tint` | `inset: 0` fill with `rgba()` gradient inside the box — left edge of the 52vw host read as a hard panel edge |
| JS inline tint            | Controller set opaque `WORLD_TINT` gradient on full layer bounds                                             |

**Fix:** `background: transparent`, `overflow: visible`, tint uses extended negative inset with `rgb(var(--world-accent-rgb) / …)` radial fading to `transparent 72%` with no solid fill.

---

## 3. Root cause — premature world colors

| Source                                            | Issue                                                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `.atmosphere-brands`, `.atmosphere-systems`, etc. | Always-on `background-image` on entire `journey-shell` — visible before section activation                    |
| Continuity `::before` / `::after`                 | Colored linear gradients between sections (brand→systems, systems→intel, etc.) created persistent color bands |
| `data-world-entered="1"` (traveler)               | Sticky flag + `.atmosphere-brands::before` linear gradient — sections stayed tinted after first visit         |
| `pickActiveSection()` (old)                       | Max visibility ratio at 12% threshold — activated worlds too early while previous section still dominant      |

**Fix:**

- Section atmospheres moved to `::after` pseudo-elements with `opacity: 0; visibility: hidden` by default
- Only `[data-world-active="1"]` enables atmosphere
- Continuity pseudo-elements default to `background: transparent !important; opacity: 0`
- New `section-activation.ts` uses viewport band `top ≤ 55vh` AND `bottom ≥ 45vh`, closest anchor to center wins — **one active section only**

Global Traveler **not modified** — world activation uses separate `data-world-active` attribute set by World Core controller.

---

## 4. Activation logic — before / after

### Before

```ts
// Max intersection ratio across all sections; threshold 12%
// Fallback: data-traveler-active
```

### After

```ts
// pickActiveWorldSection()
// Band: rect.top <= 55vh && rect.bottom >= 45vh
// Winner: closest activation anchor (38% section height) to viewport center
// syncSectionWorldActive(sectionId) — exactly one data-world-active="1"
```

Debug (dev only): `?worldDebug=1` logs active world, section id, accent RGB, atmosphere layer count (must be 1).

---

## 5. Atmosphere — before / after

### Before

- Full-section `background-image` on `.atmosphere-*` classes (always visible)
- Continuity gradients with brand/system/intel/secure color mixes
- Brands `::before` 135° linear gradient on `data-world-entered`

### After

- No always-on section background tint
- Active-only `::after` soft radial (0.06–0.09 peak opacity)
- Continuity bands disabled (transparent, hidden)
- Transition: `750ms` via `--world-transition-duration`

---

## 6. World-state exclusivity

At any moment:

| Property                            | Count                    |
| ----------------------------------- | ------------------------ |
| Active world (`--world-accent-rgb`) | 1                        |
| `data-world-active="1"` sections    | 1                        |
| Visible atmosphere `::after` layers | ≤ 1                      |
| World Core tint                     | 1 (matches active world) |

Inactive sections: atmosphere `opacity: 0; visibility: hidden`.

---

## 7. Desktop / mobile / RTL

- **Desktop:** Soft radial atmosphere only on active section; World Core tint extends beyond host bounds (no box edge)
- **Mobile:** Lower atmosphere opacity (0.05 peak); same activation band logic
- **RTL:** `inset-inline-end` unchanged; no mirror flip on core or photograph

---

## 8. Files changed

| File                                           | Change                                                |
| ---------------------------------------------- | ----------------------------------------------------- |
| `src/lib/world-core/section-activation.ts`     | **New** — band-based exclusive activation             |
| `src/lib/world-core/world-core-controller.ts`  | Rewritten picker + `data-world-active` sync + debug   |
| `src/lib/world-core/world-colors.ts`           | Transition 750ms; tint via CSS vars                   |
| `src/components/world-core/world-core.css`     | Transparent layer, soft extended radial tint          |
| `src/components/world-core/WorldCoreLayer.tsx` | Removed JS tint injection                             |
| `src/app/globals.css`                          | Active-only atmospheres; continuity bands neutralized |

**Not changed:** World Core scene geometry, Hero, Global Traveler, section copy, traveler logic.

---

## 9. Validation

| Check                  | Result         |
| ---------------------- | -------------- |
| `npm run type-check`   | ✅             |
| `npm run lint`         | ✅             |
| `npm run format:check` | ✅             |
| `npm run build`        | ✅ SSG intact  |
| One homepage canvas    | ✅ (unchanged) |

---

## 10. Evidence paths

`docs/evidence/world-core-color-fix/`

- `01-hero-before-gymura-1440x900.png`
- `02-gymura-active-1440x900.png`
- `03-between-gymura-systems-1440x900.png`
- `04-systems-active-1440x900.png`
- `05-between-systems-intelligence-1440x900.png`
- `06-intelligence-active-1440x900.png`
- `07-security-active-1440x900.png`
- Mobile EN/AR gymura, restaurant, hero-before-gymura
- Scroll recording (Playwright video in same folder)

---

## 11. Remaining risks

| Risk                                | Note                                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| Section eyebrow accent colors       | Static per-world text classes remain (by design — not atmosphere blocks)                  |
| Security `::before` clip-path frame | Only visible when security is `data-world-active` — may still read as structural frame    |
| Between-section handoff             | Narrow band may briefly show nearest-world fallback — tuned via center-distance tie-break |

---

## 12. Debug usage (development)

```
http://localhost:3000/en?worldDebug=1
```

Console logs: `activeWorld`, `activeSectionId`, `previousWorld`, `accentRgb`, `atmosphereLayers`, `activationProgress`.

No visible debug UI in production.

---

**Stop point:** Color blending and activation timing fixed only.
