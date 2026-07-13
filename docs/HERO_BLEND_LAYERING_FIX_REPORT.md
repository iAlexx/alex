# Hero Blend & World Core Layering Fix Report

**Date:** 2026-07-13  
**Scope:** Targeted visual correction — Hero panel edge + World Core text overlap only  
**Status:** Complete

---

## 1. Issues fixed

| Issue                      | Symptom                                       | Fix                                                                 |
| -------------------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| Hero rectangular footprint | Faint box on inline-end / lower-right of Hero | Feathered masks, removed hard overflow clip, softened tints/shadows |
| World Core over text       | Nucleus/rings painting above section copy     | Homepage `#main` stacking above fixed core layer                    |

Color activation behavior from the prior fix is **unchanged** (`data-world-active`, center-band activation, no continuity bands).

---

## 2. Root cause — Hero rectangle

1. **`overflow-hidden` on Hero shell** — clipped the visual stack, exposing a hard rectangular boundary.
2. **`.lovable-hero-visual__rings-fixed`** — fixed 55% viewport panel with `inset: 0` tint fill; gradient stopped at 70% leaving a perceptible box edge.
3. **`.lovable-portrait__shadow`** — bottom fade to solid `rgba(5,7,11,1)` created a hard lower edge on the portrait plate.
4. **Duplicate hero tint** — hero `tint-fixed` + persistent World Core tint stacked in the same inline-end zone on production.

---

## 3. Root cause — text overlap

1. **`WorldCoreLayer` is a sibling of `#main`** (rendered after main in `DeferredHomepageRailMotion`) with `position: fixed; z-index: 0`.
2. **`#main` had no stacking context** — fixed World Core could paint above in-flow section content despite `journey-content z-[1]` inside isolated shells.
3. **Core sat near dense copy** — section presets kept nucleus relatively centered on inline-end for Method/Gymura/Systems.

---

## 4. Changes made

### Hero blending (`orbital-hero.css`, `OrbitalHeroSection.tsx`, `OrbitalHeroVisual.tsx`)

- Removed `overflow-hidden` from Hero shell; use `overflow-x: clip` + `overflow-y: visible` only.
- Softened Hero shell radial overlay (lower intensity, earlier transparent falloff).
- Added radial **mask** on `.lovable-hero-visual__rings-fixed` to feather all edges (RTL-aware).
- Replaced full-rect `tint-fixed` with extended soft radial; hide when `data-world-core-persistent` is set.
- Portrait bottom shadow now fades to **transparent** (no solid obsidian block).
- Moved tint from inline style to CSS (removed duplicate `LOVABLE_CORE_TINT` panel).

### World Core layering (`page.tsx`, `JourneyShell.tsx`, `world-core.css`, `WorldCoreLayer.tsx`, `section-presets.ts`)

- `#main` → `relative z-[1]` on homepage so all content stacks above World Core.
- `journey-content` → `z-[2]` for reliable content paint order inside shells.
- World Core layer: left-edge linear mask to soften inline-start boundary.
- Content-heavy worlds: slight `translateX` inline-end + lower layer opacity via `data-world-state`.
- Scene presets: increased `offsetX` + reduced opacity for Method/Brands/Systems/Intelligence/Security.
- `WorldCoreLayer` sets `data-world-core-persistent` on `<html>` to suppress duplicate hero tint.

---

## 5. Files changed

| File                                                      |
| --------------------------------------------------------- |
| `src/app/[locale]/page.tsx`                               |
| `src/components/home/hero-orbital/OrbitalHeroSection.tsx` |
| `src/components/home/hero-orbital/OrbitalHeroVisual.tsx`  |
| `src/components/home/hero-orbital/orbital-hero.css`       |
| `src/components/v2/JourneyShell.tsx`                      |
| `src/components/world-core/WorldCoreLayer.tsx`            |
| `src/components/world-core/world-core.css`                |
| `src/lib/world-core/section-presets.ts`                   |
| `scripts/hero-blend-layering-fix-screenshots.mjs`         |

**Not changed:** Hero copy/CTAs, World Core geometry, Global Traveler, section content, color activation controller, SEO.

---

## 6. Validation

| Command                | Result |
| ---------------------- | ------ |
| `npm run type-check`   | ✅     |
| `npm run lint`         | ✅     |
| `npm run format:check` | ✅     |
| `npm run build`        | ✅     |

---

## 7. Evidence

`docs/evidence/hero-blend-layering-fix/`

- `hero-desktop-1440x900.png`
- `hero-mobile-390x844.png`
- `method-readable-1440x900.png`
- `gymura-readable-1440x900.png`
- `intelligence-readable-1440x900.png`
- `ar-gymura-readable-1440x900.png`

---

## 8. Remaining risks

| Risk                                                       | Mitigation                                                     |
| ---------------------------------------------------------- | -------------------------------------------------------------- |
| Hero fixed rings mask may soften ring extremities slightly | Mask tuned to 76% transparent falloff — composition preserved  |
| Lower core opacity on content sections                     | Intentional readability trade; core remains visible inline-end |
| `journey-content z-[2]` applies site-wide to JourneyShell  | Safe — only raises content above decorative layers             |

---

**Stop point:** Hero blend + layering fix only. No redesign.
