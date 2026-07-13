# Three Hero Lab Report — Lovable Source Reconstruction

## 1. Executive summary

The Three Hero Lab (`/en/three-hero-lab`, `/ar/three-hero-lab`) was rebuilt using **source-driven reconstruction** from `alex-core-builder`, not screenshot approximation.

Implementation ports:

- `Portrait.tsx` → `LovablePortraitPlate.tsx` (CSS mask, rim glows, grain, internal foreground SVG paths, scroll parallax)
- `Portfolio.tsx` Hero column → `LovableHeroVisual.tsx` + `three-hero-lab.css` (portrait stage, foreground SVG ellipses, **no identity badge**)
- `AlexCore.tsx` torus rings **only** → `orbit-rings-scene.ts` (vanilla Three.js, no orb/reactor/nodes)

**Excluded per scope:** central orb, icosahedron, glass shell, world nodes, remote Lovable asset URLs, Builder Frame, Threshold, floating panels.

Production homepage, navigation, sitemap, and other labs are unchanged.

Mapping document: `docs/LOVABLE_PORTRAIT_RECONSTRUCTION_MAP.md`

---

## 2. Source architecture (Lovable)

### Depth stack

```
z=0  Fixed AlexCore canvas (lg:w-[55%] h-screen) — torus rings BEHIND
z=0  World tint radial overlay on AlexCore container
z=1  Hero visual column (h-[62vh] lg:h-[86vh])
     ├─ Portrait wrapper w-[78%] h-[92%] max-w-[560px]
     │  └─ Portrait.tsx (mask, rims, grain, internal SVG paths IN FRONT of image)
     ├─ Hero foreground SVG ellipses (opacity-40 mix-blend-screen) IN FRONT
     └─ ~~Identity badge~~ removed in final correction
```

### Technology split

| Layer                 | Lovable                                          | Lab port                                  |
| --------------------- | ------------------------------------------------ | ----------------------------------------- |
| Large orbital paths   | Three.js torus rings (R3F)                       | Vanilla `three` in `orbit-rings-scene.ts` |
| Portrait mask / rims  | CSS                                              | `.lovable-portrait__*`                    |
| Foreground thin paths | SVG in Portrait.tsx                              | `LovablePortraitPlate` internal SVG       |
| Foreground ellipses   | SVG in Portfolio Hero                            | `LovableHeroForegroundSvg`                |
| Parallax              | `--pY` scroll on portrait; pointer on ring group | Same formulas                             |

### Key constants (from source)

- Background: `#05070B`
- Portrait mask: `radial-gradient(ellipse 78% 92% at 55% 45%, black 55%, transparent 92%)`
- Portrait wrap: `78% × 92%`, `max-width: 560px`
- Column height: `62vh` mobile, `86vh` desktop
- Torus radii: 1.35, 1.6, 1.85, 2.15 (tube 0.005–0.012)
- Camera: `position [0,0,5.5]`, `fov 42`

---

## 3. Production files

| File                                                         | Role                                 |
| ------------------------------------------------------------ | ------------------------------------ |
| `src/lib/three-hero/lovable-portrait-spec.ts`                | Shared constants from Lovable source |
| `src/lib/three-hero/orbit-rings-scene.ts`                    | Vanilla Three.js torus rings only    |
| `src/components/three-hero-lab/LovablePortraitPlate.tsx`     | Portrait.tsx port                    |
| `src/components/three-hero-lab/LovableHeroForegroundSvg.tsx` | Hero foreground ellipses             |
| `src/components/three-hero-lab/LovableHeroVisual.tsx`        | Full visual stack                    |
| `src/components/three-hero-lab/use-orbit-rings-scene.ts`     | Canvas lifecycle                     |
| `src/components/three-hero-lab/ThreeHeroComposition.tsx`     | 42/58 grid wiring                    |
| `src/components/three-hero-lab/three-hero-lab.css`           | Source-faithful dimensions + layers  |

Legacy orbital-approximation files (`ThreeHeroOrbitVisual.tsx`, `OrbitalPathsSvg.tsx`, etc.) are superseded but left in repo; not wired to the route.

Assets: `/images/alex/alex-portrait-cinematic.png` (authoritative Hero Lab portrait).

---

## 10. Final correction — cinematic portrait asset

### New portrait asset

- **Path:** `public/images/alex/alex-portrait-cinematic.png`
- **Dimensions:** 764×1024 (native vertical cinematic crop)
- **Replaces:** `alex-workstation-desktop.webp` / `alex-workstation-mobile.webp` on this route only

### Removed black background cause

- Deleted `.lovable-hero-visual__bg` solid panel (`var(--lovable-bg)` rectangle behind portrait column)
- Portrait wrapper and plate set to `background: transparent`
- Page background `#05070B` shows through masked edges naturally

### Removed badge

- Deleted `ALEX · IN THE SYSTEM` pill from `LovableHeroVisual.tsx`
- Removed all `.lovable-hero-visual__badge*` CSS
- No replacement badge; vertical gap closed

### Desktop alignment changes

- Grid adjusted to **43% / 57%** copy/visual
- Visual column nudged toward text (`margin-inline-start: -0.5rem to -1.5rem` EN; mirrored AR)
- Portrait wrap uses native **764:1024 aspect ratio**, `max-width: 580px`, `height: min(78vh, 82vh)`
- `object-position: 50% 44%` (EN) / `54% 44%` (AR) — photograph not mirrored

### Mobile layout changes

- Order preserved: eyebrow → H1 → role → statements → CTAs → portrait
- Visual height `min(65svh, 70svh)`; full width minus safe margins
- Same cinematic asset (no workstation derivatives)
- 320px: tighter title spacing, CTA min-height 48px (`min-h-12`)

### Portrait sizing

- Single `alex-portrait-cinematic.png` for all breakpoints
- `object-fit: cover` with aspect-ratio-matched wrapper to avoid aggressive crop
- Head, monitor, keyboard, and arm preserved in frame

### Mask and overlays

Exact Lovable treatment retained:

- Radial mask `ellipse 78% 92% at 55% 45%`
- Blue/violet rim (`mix-blend-mode: screen`)
- Bottom dissolve gradient
- Grain overlay `opacity: 0.09`

### Orbit depth ordering

```
z=0  Fixed Three.js torus rings (behind)
z=3  Masked portrait plate
z=4  Portrait internal SVG paths + hero foreground ellipses (in front)
     Corner marks on portrait
```

### Runtime screenshot paths

| File                                                          | Viewport           |
| ------------------------------------------------------------- | ------------------ |
| `docs/evidence/three-hero-lab/en-1440x900-final.png`          | EN desktop         |
| `docs/evidence/three-hero-lab/ar-1440x900-final.png`          | AR desktop         |
| `docs/evidence/three-hero-lab/en-1280x800-final.png`          | EN laptop          |
| `docs/evidence/three-hero-lab/en-390x844-final.png`           | EN mobile          |
| `docs/evidence/three-hero-lab/ar-390x844-final.png`           | AR mobile          |
| `docs/evidence/three-hero-lab/en-320x568-final.png`           | EN small mobile    |
| `docs/evidence/three-hero-lab/reference-desktop-vs-final.png` | Desktop comparison |
| `docs/evidence/three-hero-lab/reference-mobile-vs-final.png`  | Mobile comparison  |

Capture: `THREE_HERO_LAB_URL=http://localhost:<port> node scripts/three-hero-lab-screenshots.mjs`

### Remaining differences from Lovable

1. AlexCore world nodes / connector line — excluded (orb scope)
2. Lab route header chrome (`TRUE 3D HERO LAB` badge) — isolated lab shell only
3. Mobile reference top world labels — from Lovable nav, not portrait source

---

## 12. Final correction — cinematic portrait asset

### New portrait asset

- **Path:** `public/images/alex/alex-portrait-cinematic.png` (764×1024)
- **Replaces:** `alex-workstation-desktop.webp` / `alex-workstation-mobile.webp` on this route only
- **No remote Lovable URL**

### Removed problems

| Issue                                   | Fix                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Black rectangular panel behind portrait | Removed opaque visual-column background; portrait wrapper and plate are `background: transparent` |
| Dark card/container                     | No box, border, or fill on `.lovable-hero-visual__portrait-wrap`                                  |
| `ALEX · IN THE SYSTEM` badge            | Deleted from `LovableHeroVisual.tsx`; no replacement                                              |
| Workstation derivative crops            | Single cinematic PNG for all breakpoints                                                          |
| Duplicate portrait layers               | One `Image` in `LovablePortraitPlate.tsx`                                                         |

### Desktop alignment (1440×900)

- Grid: **43% copy / 57% visual**
- Visual column nudged toward text via negative `margin-inline` (`clamp(-2.5rem, -3.5vw, -1rem)`)
- Portrait height: `min(78vh, 82vh)`; max width **580px**; native **764:1024** aspect ratio preserved
- `object-position`: `48% 46%` (EN), `52% 46%` (AR) — head, monitor, keyboard, arm retained

### Mobile layout

- Order: eyebrow → H1 → role → statement → paragraph → ALEX CORE → CTAs → **portrait**
- Visual height: `clamp(58svh, 65svh, 70svh)`
- Same cinematic asset; `object-position: 50% 48%` (EN), `52% 48%` (AR)
- Transparent masked edges; no black card

### Mask and overlays (Lovable-exact)

- Radial mask: `ellipse 78% 92% at 55% 45%`, black 55% → transparent 92%
- Blue rim (`screen`, 0.70), violet rim (`screen`, 0.60), bottom fade, grain (0.09 overlay)
- No opaque layer behind the masked image

### Orbit depth ordering

1. Fixed Three.js torus rings (behind)
2. Portrait plate (masked cinematic PNG)
3. Portrait internal SVG paths (in front)
4. Hero foreground SVG ellipses (in front)
5. Corner brackets

### Runtime screenshot paths

| File                             | Viewport         |
| -------------------------------- | ---------------- |
| `en-1440x900-final.png`          | Desktop EN       |
| `ar-1440x900-final.png`          | Desktop AR       |
| `en-1280x800-final.png`          | Desktop EN       |
| `en-390x844-final.png`           | Mobile EN        |
| `ar-390x844-final.png`           | Mobile AR        |
| `en-320x568-final.png`           | Mobile EN narrow |
| `reference-desktop-vs-final.png` | Side-by-side     |
| `reference-mobile-vs-final.png`  | Side-by-side     |

### Remaining differences from Lovable

1. AlexCore world nodes / connector line — excluded (orb scope)
2. Lab route header chrome (`TRUE 3D HERO LAB` badge) — isolated lab shell only
3. Mobile reference top world labels — from Lovable nav, not portrait source

---

## 13. Stop boundary

Final Hero Lab correction complete. No merge into production homepage.
