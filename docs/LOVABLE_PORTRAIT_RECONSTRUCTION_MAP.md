# Lovable Portrait Reconstruction Map

Source project: `C:\Users\Master aLEX\alex-core-builder`  
Production target: isolated `/en/three-hero-lab`, `/ar/three-hero-lab` only.

This document maps the **exact** Lovable portrait-scene implementation. Screenshots are verification only.

---

## Answers to the 12 inspection questions

| #   | Finding                                                                                                                                                                                                                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Workstation portrait renderer:** `src/components/Portrait.tsx` — `<img>` inside `.portrait-plate`                                                                                                                              |
| 2   | **Element hierarchy:** See stack diagram below                                                                                                                                                                                   |
| 3   | **Behind image:** `AlexCore` Three.js torus rings (fixed layer) + ambient color pool in Portrait + world tint overlay                                                                                                            |
| 4   | **In front of image:** Portrait internal SVG paths (`opacity-60`) + Hero foreground SVG ellipses (`opacity-40 mix-blend-screen`) + corner brackets                                                                               |
| 5   | **Technology split:** Torus orbital paths = **Three.js (R3F in Lovable)**; portrait mask/rim = **CSS**; front paths = **SVG**; AlexCore orb/nodes = **Three.js** (excluded from port)                                            |
| 6   | **Portrait mask:** CSS `mask-image` / `WebkitMaskImage`: `radial-gradient(ellipse 78% 92% at 55% 45%, black 55%, transparent 92%)`                                                                                               |
| 7   | **Crop strategy:** `object-cover w-full h-full` inside sized plate; hero wrapper `w-[78%] h-[92%] max-w-[560px]`                                                                                                                 |
| 8   | **Desktop scale:** Hero visual column `h-[86vh]`; portrait plate up to 560px wide at 78%×92% of column                                                                                                                           |
| 9   | **Mobile scale:** Hero visual column `h-[62vh]`; same 78%×92% portrait wrapper (no separate mobile asset)                                                                                                                        |
| 10  | **Z-index order:** Fixed AlexCore `z-0` → main `z-10` → inside hero column: rings canvas → tint → portrait (z-auto/isolate) → hero foreground SVG → badge                                                                        |
| 11  | **Glow/lighting:** Ambient radial pool (`-inset-10 blur-3xl opacity-70`); blue/violet `mix-blend-screen` rim overlays; bottom shadow gradient; grain `opacity-[0.09] mix-blend-overlay`; world tint radial on AlexCore container |
| 12  | **Parallax:** Portrait scroll parallax via `--pY` clamped `[-60,60]` at `-center * 0.08`; AlexCore pointer parallax on group `rotation.x/y`                                                                                      |

---

## Hero visual stack (Lovable `Portfolio.tsx` Hero + `Portrait.tsx`)

```
Portfolio (fixed layer, z-0, lg:w-[55%] h-screen)
└─ AlexCore Canvas — Three.js torus rings ONLY (port rings, NOT central orb)
   └─ world tint radial-gradient overlay

Hero section right column (relative h-[62vh] lg:h-[86vh])
├─ [BEHIND] absolute inset-0 — ring canvas fills column (replaces fixed AlexCore in lab)
├─ [BEHIND] world tint overlay on column
├─ absolute inset-0 flex center
│  └─ portrait wrapper w-[78%] h-[92%] max-w-[560px]
│     └─ Portrait component (isolate)
│        ├─ z:-10 ambient color pool (blur-3xl)
│        ├─ .portrait-plate (--pY parallax)
│        │  ├─ img (mask + object-cover + contrast/saturate)
│        │  ├─ blue rim mix-blend-screen opacity-70
│        │  ├─ violet rim mix-blend-screen opacity-60
│        │  ├─ bottom shadow gradient
│        │  └─ grain overlay
│        ├─ [IN FRONT] internal SVG paths opacity-60 viewBox 0 0 100 140
│        └─ corner brackets top-3 left-3 / bottom-3 right-3
├─ [IN FRONT] Hero foreground SVG ellipses opacity-40 mix-blend-screen viewBox 0 0 100 100
└─ identity badge bottom-4 left-4 md:left-8
```

---

## Reconstruction mapping table

| Lovable source file                      | Exact element / component               | Visual responsibility                    | Key styles / values                                                                            | Action                                         | Production equivalent                        |
| ---------------------------------------- | --------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------- |
| `Portrait.tsx`                           | Root `div.relative.isolate`             | Portrait scene root                      | `aria-label`, `--pY` custom property                                                           | Adapt                                          | `LovablePortraitPlate.tsx`                   |
| `Portrait.tsx`                           | Ambient pool `absolute -inset-10 -z-10` | Blue/violet atmosphere behind portrait   | `blur-3xl opacity-70`; dual radial gradients at 30%/40% and 75%/60%                            | Copy values                                    | CSS `.lovable-portrait__ambient`             |
| `Portrait.tsx`                           | `.portrait-plate`                       | Parallax translate container             | `translate3d(0, var(--pY), 0)`; scroll clamp ±60px                                             | Reimplement                                    | `useLovablePortraitParallax.ts`              |
| `Portrait.tsx`                           | `<img>`                                 | Workstation/portrait image               | `object-cover w-full h-full`; mask ellipse 78% 92% at 55% 45%; `contrast(1.08) saturate(1.05)` | Adapt asset                                    | `ThreeHeroPortrait` → local webp             |
| `Portrait.tsx`                           | Blue rim overlay                        | Left rim light                           | `mix-blend-screen opacity-70`; radial 40%×60% at 12% 40%                                       | Copy                                           | CSS overlay                                  |
| `Portrait.tsx`                           | Violet rim overlay                      | Right rim light                          | `mix-blend-screen opacity-60`; radial 35%×55% at 88% 55%                                       | Copy                                           | CSS overlay                                  |
| `Portrait.tsx`                           | Bottom shadow                           | Blend into background                    | `linear-gradient(180deg, transparent 55%, rgba(5,7,11,0.55) 85%, #05070B 100%)`                | Copy                                           | CSS overlay                                  |
| `Portrait.tsx`                           | Grain layer                             | Fine texture                             | `opacity-0.09 mix-blend-overlay`; SVG turbulence data-uri                                      | Copy                                           | CSS overlay                                  |
| `Portrait.tsx`                           | Internal SVG (2 paths)                  | **Foreground** thin system paths         | `opacity-60`; viewBox `0 0 100 140`; stroke gradient `#pline`; dash paths at y≈22 and y≈118    | Copy paths                                     | `LovablePortraitForegroundSvg.tsx`           |
| `Portrait.tsx`                           | Corner spans                            | Framing brackets                         | `w-6 h-6 border-primary/50`; TL `border-t border-l`; BR `border-b border-r`                    | Copy                                           | CSS borders                                  |
| `Portfolio.tsx` Hero                     | Column container                        | Visual stage sizing                      | `relative h-[62vh] lg:h-[86vh] w-full`                                                         | Adapt to lab column                            | `.lovable-hero-visual`                       |
| `Portfolio.tsx` Hero                     | Portrait wrapper                        | Portrait scale                           | `w-[78%] h-[92%] max-w-[560px]` centered                                                       | Copy                                           | `.lovable-hero-visual__portrait-wrap`        |
| `Portfolio.tsx` Hero                     | Foreground SVG ellipses                 | **Foreground** orbit rings over portrait | `opacity-40 mix-blend-screen`; rx/ry 44×14 rotate -14°; rx/ry 38×20 rotate 22°                 | Copy                                           | `LovableHeroForegroundSvg.tsx`               |
| `Portfolio.tsx` Hero                     | Identity badge                          | System label                             | `bottom-4 left-4`; pill border; green pulse dot; mono 10px uppercase                           | Adapt copy                                     | `.lovable-hero-visual__badge`                |
| `Portfolio.tsx` main                     | Fixed AlexCore wrapper                  | **Behind** large orbital torus paths     | `fixed right-0 lg:w-[55%] h-screen z-0 pointer-events-none`                                    | **Copy fixed placement**                       | `.lovable-hero-visual__rings-fixed`          |
| `Portfolio.tsx` main                     | World tint on AlexCore                  | Atmospheric world color                  | `radial-gradient(ellipse at 60% 50%, tint, transparent 70%)`                                   | Copy (core tint)                               | CSS overlay                                  |
| `AlexCore.tsx`                           | Torus ring meshes (4)                   | **Behind** curved orbital paths          | radii 1.35–2.15; tube 0.005–0.012; tilts per ring; emissive `#2F80FF` intensity 0.6            | **Reimplement torus only** in vanilla Three.js | `orbit-rings-scene.ts`                       |
| `AlexCore.tsx`                           | Icosahedron / sphere / nodes            | Orb/reactor (NOT portrait paths)         | —                                                                                              | **Exclude**                                    | —                                            |
| `styles.css`                             | `:root --background`                    | Scene background                         | `#05070B`                                                                                      | Copy                                           | `--lovable-bg`                               |
| `styles.css`                             | `body` radial gradients                 | Page atmosphere                          | blue 20% 0%, violet 80% 100% at low opacity                                                    | Adapt scoped to visual                         | `.lovable-hero-visual__bg`                   |
| `alex-portrait-cinematic.png.asset.json` | Remote portrait URL                     | Lovable asset                            | `/__l5e/assets-v1/...`                                                                         | **Do not copy**                                | `/images/alex/alex-workstation-desktop.webp` |

---

## Three.js policy for production lab

Lovable uses Three.js **specifically for torus orbital rings** in `AlexCore.tsx`. The central icosahedron/sphere/nodes are **not** part of the portrait-path language and are excluded.

Production port:

- Vanilla `three` only (no R3F/Drei)
- **Torus rings only** — same radii, tilts, emissive material
- Canvas scoped to hero visual column (not full-page fixed)
- Dynamic import; not loaded on homepage

SVG/CSS ports unchanged from Lovable source.

---

## Desktop vs mobile

Lovable uses **one** Hero component; responsive differences:

| Property           | Mobile                 | Desktop (lg+)        |
| ------------------ | ---------------------- | -------------------- |
| Hero visual height | `62vh`                 | `86vh`               |
| AlexCore width     | `w-full`               | `w-[55%]` right      |
| Portrait wrapper   | `78% × 92%`, max 560px | same                 |
| Foreground/badge   | same structure         | `md:left-8` on badge |

Production lab: desktop = 58% grid column with `86vh` visual; mobile = stacked with `62vh` visual. Separate CSS breakpoints, same Lovable ratios.

---

## Verification assets

| File                                                                   | Purpose                   |
| ---------------------------------------------------------------------- | ------------------------- |
| `docs/evidence/three-hero-lab/references/reference-desktop.png`        | Lovable desktop reference |
| `docs/evidence/three-hero-lab/references/reference-mobile.png`         | Lovable mobile reference  |
| `docs/evidence/three-hero-lab/en-1440x900-lovable-portrait.png`        | Implementation desktop    |
| `docs/evidence/three-hero-lab/en-390x844-lovable-portrait.png`         | Implementation mobile     |
| `docs/evidence/three-hero-lab/comparison-desktop-reference-vs-lab.png` | Desktop side-by-side      |
| `docs/evidence/three-hero-lab/comparison-mobile-reference-vs-lab.png`  | Mobile side-by-side       |

---

_Mapping complete. Implementation follows this document._
