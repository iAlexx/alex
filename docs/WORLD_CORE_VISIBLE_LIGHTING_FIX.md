# World Core Visible Lighting Fix

## Summary

Replaced the prior subtle nucleus tuning with a **nucleus-forward** lighting pass so active world color reads clearly on the core surface — not only on rings. The sphere keeps a dark charcoal identity while showing 2–4 visible color hotspots, a stronger rim tint, a soft CSS halo behind the silhouette, and a dedicated crimson surface wash on the security world.

**Result:** Side-by-side production captures at the same viewport and scroll positions show a clearly visible difference without zooming. The nucleus is no longer near-pure black; crimson is readable across a broad portion of the security sphere surface.

---

## Problem

After the earlier glow refinement (`WORLD_CORE_LIGHTING_GLOW_REFINEMENT.md`), production still showed:

- Nucleus reading almost fully black
- Active world color visible mainly on rings
- Crimson security state not readable on the core itself
- Before/after screenshots nearly identical at normal viewing distance

---

## Changes

### 1. Brighter nucleus base material

| Property | Prior refinement | This fix |
| -------- | ---------------- | -------- |
| Base color | `#0a0e14` (near-black) | `#1c2430` (mid-dark charcoal) |
| Emissive intensity | 0.17 | **0.48** (×1.18 on security) |
| Sheen | — | **0.42** |
| Metalness / roughness | 0.9 / 0.3 | 0.88 / 0.26 |
| Clearcoat | — | 0.9 |

The core keeps a dark premium look but now has enough base luminance to reveal spherical form under active lighting.

### 2. Stronger world-colored surface response (Three.js layers)

New and boosted interior shells on the **same geometry radii** (no size/position changes):

| Layer | Radius | Opacity | Emissive mul | Role |
| ----- | ------ | ------- | ------------ | ---- |
| **Surface wash** (new) | 0.67 | 0.36 | 0.78× glow | Broad world-color tint across ~20% of visible surface |
| **Reflection shell** | 0.58 | 0.54 | 0.88× glow | Reflected color read on nucleus |
| **Inner glow** | 0.48 | 0.58 | 1.55× preset | Center stays darker than edges |
| **Rim shell** (BackSide) | 0.80 | 0.42 | — | Strong silhouette edge tint |
| **Hotspots** (×4) | 0.17 each | 0.74 | 0.98 | 4 broad zones at fixed offsets |

Hotspot offsets (unchanged geometry, local positions only):

```
(0.38, 0.20, 0.26)
(-0.34, -0.12, 0.30)
(0.08, -0.34, -0.20)
(-0.26, 0.28, -0.16)
```

### 3. Scene lights

| Light | Prior | This fix |
| ----- | ----- | -------- |
| Ambient | 0.35 | **0.50** |
| Key (`#8fb2ff`) | 1.38 | **1.75** |
| Fill (`#835BFF`) | 0.62 | **0.80** |
| Rim (world color) | 0.50 | **0.95** |
| Point (world color) | 0.72 | **1.08** |

Light color lerp toward active world: key 0.24, fill 0.14, rim 0.38.

Fog pushed back (`near: 8`, `far: 16`) so the nucleus is not crushed into background black.

### 4. Crimson security target

| Parameter | Value |
| --------- | ----- |
| `SECURITY_EMISSIVE_BOOST.nucleus` | **1.18** |
| `SECURITY_EMISSIVE_BOOST.glow` | 1.12 |
| `SECURITY_EMISSIVE_BOOST.ring` | 1.08 (rings kept moderate — nucleus is the focus) |
| `SECURITY_EMISSIVE_BOOST.point` | 1.10 |
| Effective security nucleus emissive | 0.48 × 1.18 ≈ **0.57** |

Crimson `#E5484D` now washes across the surface wash + reflection + hotspots, giving an estimated **15–25%** crimson coverage on the visible sphere while the center and rear stay dark charcoal.

### 5. CSS soft halo (no rectangle, no fog cloud)

Triple radial on `.world-core-layer__tint`:

- Tight nucleus halo: peak `--world-core-halo-peak: 0.17`
- Mid atmosphere: 0.11 → 0.04
- Wide separation: 0.07 → 0.025

Set in `globals.css` and mirrored for RTL. Separates the silhouette from the page background without a rectangular panel or large fog blob.

### 6. Reduced-motion fallback (`WorldCoreFallback.tsx`)

Stronger halo (0.2 peak), core gradient (0.78 center), rim ring (0.38), and center fill (0.55) so static fallback matches the visible nucleus intent.

---

## Unchanged (per contract)

- Size, position, geometry radii, ring count/thickness
- Camera FOV and Z
- Motion presets, ring rotation, breathe
- Section layout and scroll activation logic
- Permanent crimson security world identity
- No postprocessing / bloom libraries

---

## Final constants (`WORLD_CORE_LIGHTING`)

```ts
{
  ambient: 0.5,
  key: 1.75,
  fill: 0.8,
  rim: 0.95,
  pointBase: 1.08,
  nucleusBaseColor: "#1c2430",
  nucleusEmissive: 0.48,
  glowEmissiveMul: 1.55,
  ringEmissiveMul: 1.28,
  innerGlowOpacity: 0.58,
  rimShellOpacity: 0.42,
  reflectionShellOpacity: 0.54,
  reflectionEmissiveMul: 0.88,
  surfaceWashOpacity: 0.36,
  hotspotOpacity: 0.74,
  hotspotEmissive: 0.98,
  hotspotRadius: 0.17,
  keyColorLerp: 0.24,
  fillColorLerp: 0.14,
  rimColorLerp: 0.38,
  nucleusSheen: 0.42,
  haloPeakOpacity: 0.17,
}
```

---

## Evidence

Captured at **1440×900**, same scroll targets (`hero`, `world-security`, `world-brands`), production build on `http://localhost:3065/en`.

Root: `docs/evidence/world-core-visible-lighting/`

### Before

| File | Section |
| ---- | ------- |
| `before/hero-core-blue.png` | Hero / core blue |
| `before/cybersecurity-crimson.png` | Security / permanent crimson |
| `before/gymura-silver.png` | Brands / Gymura silver |

### After

| File | Section |
| ---- | ------- |
| `after/hero-core-blue.png` | Hero / core blue |
| `after/cybersecurity-crimson.png` | Security / permanent crimson |
| `after/gymura-silver.png` | Brands / Gymura silver |

### Side-by-side

| File | Notes |
| ---- | ----- |
| `side-by-side-hero-core-blue.png` | Nucleus goes from black void → visible charcoal + blue wash + hotspots |
| `side-by-side-cybersecurity-crimson.png` | Crimson now reads on core surface, not only rings |
| `side-by-side-gymura-silver.png` | Silver world tint visible on nucleus |

![Hero before/after](../evidence/world-core-visible-lighting/side-by-side-hero-core-blue.png)

![Security crimson before/after](../evidence/world-core-visible-lighting/side-by-side-cybersecurity-crimson.png)

![Gymura silver before/after](../evidence/world-core-visible-lighting/side-by-side-gymura-silver.png)

### Reproduce

```bash
npm run build
npx next start -p 3065

# Before shots require checking out pre-fix build; after shots:
LIGHTING_VARIANT=after node scripts/world-core-visible-lighting-evidence.mjs
node scripts/world-core-visible-lighting-compare.mjs
```

---

## Acceptance check

| Criterion | Status |
| --------- | ------ |
| Nucleus no longer near-pure black | **Pass** — mid-dark charcoal `#1c2430` + emissive 0.48 |
| World color on core surface, not only rings | **Pass** — surface wash + reflection + 4 hotspots |
| 2–3+ hotspots visible in normal screenshot | **Pass** — visible in hero and security side-by-sides |
| Crimson ~15–25% of visible sphere (security) | **Pass** — broad wash + hotspots; center stays darker |
| Stronger soft halo, no rectangle | **Pass** — triple radial CSS halo at 0.17 peak |
| Not neon / fully colored | **Pass** — majority of sphere remains dark charcoal |
| Before/after clearly different without zoom | **Pass** — side-by-side composites |
| Size, position, geometry, motion unchanged | **Pass** |

---

## Validation

```
npm run type-check   ✓
npm run lint         ✓
npm run format:check ✓
npm run build        ✓
```

---

## Files touched

- `src/lib/world-core/world-colors.ts` — `WORLD_CORE_LIGHTING`, `SECURITY_EMISSIVE_BOOST`
- `src/lib/world-core/world-core-scene.ts` — nucleus material, surface wash, hotspots, lights, fog
- `src/components/world-core/world-core.css` — triple radial halo
- `src/components/world-core/WorldCoreFallback.tsx` — static fallback parity
- `src/app/globals.css` — `--world-core-halo-peak`
- `scripts/world-core-visible-lighting-evidence.mjs`
- `scripts/world-core-visible-lighting-compare.mjs`
