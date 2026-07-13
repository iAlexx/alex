# World Core Ring Neon Refinement

## Summary

Reverted all nucleus-first changes from `WORLD_CORE_VISIBLE_LIGHTING_FIX` and applied a **ring-only** neon edge refinement. The inner nucleus is restored to the last approved dark charcoal appearance; active world color now reads more clearly on the orbital torus rings via stronger emissive + a soft additive glow shell per ring.

---

## 1. Nucleus values reverted

Restored to pre–`WORLD_CORE_VISIBLE_LIGHTING_FIX` / `WORLD_CORE_LIGHTING_GLOW_REFINEMENT` approved state:

| Parameter | Visible-fix (reverted) | Restored |
| --------- | ---------------------- | -------- |
| Base color | `#1c2430` | **`#0a0e14`** |
| Nucleus emissive | 0.48 (×1.18 security) | **0.17** |
| Surface wash | r=0.67, opacity 0.36 | **Removed** |
| Hotspots | 4 × r=0.17 | **3 × r=0.09** |
| Reflection shell opacity | 0.54 | **0.28** |
| Inner glow opacity | 0.58 | **0.34** |
| Fresnel rim opacity | 0.42 | **0.21** |
| Sheen / nucleus boost | 0.42 / security 1.18 | **Removed** |
| Scene lights | ambient 0.5, key 1.75… | **ambient 0.38, key 1.38, fill 0.62, rim 0.5, point 0.72** |
| Fog | near 8, far 16 | **near 6, far 14** |
| CSS triple nucleus halo | `--world-core-halo-peak: 0.17` | **Removed — dual subtle atmosphere restored** |
| `SECURITY_EMISSIVE_BOOST.nucleus` | 1.18 | **Removed** |

---

## 2. Ring values changed

| Parameter | Prior approved | Ring neon |
| --------- | -------------- | --------- |
| Crisp ring emissive mul | 1.26× | **1.68×** (~+33%) |
| Glow shell opacity | — | **0.15** (desktop) |
| Glow shell scale | — | **1.025** (no tube thickness change) |
| Glow shell emissive | — | **0.38** |
| Glow shell blending | — | Additive, depthWrite off |
| Mobile intensity | — | **×0.68** (~32% reduction) |
| Security ring boost | ring 1.1, point 1.06 | **Unchanged** |

### Per-world glow colors (`WORLD_RING_GLOW_HEX`)

| World | Crisp ring | Soft glow shell |
| ----- | ---------- | --------------- |
| Core / Method | `#4f8dff` | `#6fa0ff` |
| Brands | `#c8d0dc` | `#b8c0cc` |
| Systems | `#d4a054` | `#e7a13b` |
| Intelligence | `#9b7ed9` | `#835bff` |
| Security | `#E5484D` | `#C83A45` |
| Future | `#3a6fcc` | `#2f5ab4` |

Security deep falloff token preserved: `#8F202A` (`SECURITY_CRIMSON_DEEP_HEX`).

---

## 3. Glow implementation

**Approach A** — duplicate torus per ring inside a `THREE.Group`:

- Original torus = crisp emissive line (unchanged geometry / tube)
- Second mesh shares geometry, scaled **1.025×**, additive transparent emissive shell
- Each ring group rotates together (motion unchanged)
- **Skipped on mobile/tablet** (`options.mobile`) — only boosted crisp ring emissive with reduced multiplier

No EffectComposer, bloom, postprocessing, or external textures.

---

## 4. Desktop behavior

- Dark nucleus with restrained physical shading
- Rings show clearly saturated world color with faint energized edge
- Section-specific layer opacity presets unchanged (content-heavy worlds at 0.82)
- Dual subtle CSS atmosphere tint (not nucleus-centered halo)

---

## 5. Mobile behavior

- No duplicate glow geometry (performance)
- Ring emissive at **68%** of desktop neon intensity
- Existing mobile layer opacity (0.38) and scale presets preserved
- No horizontal overflow

---

## 6. Reduced-motion behavior

- No added movement
- Static `WorldCoreFallback` SVG with ring stroke glow filter
- Dark nucleus gradient preserved (center fill opacity 0.42)

---

## 7. Fallback behavior

`WorldCoreFallback.tsx`:

- Removed nucleus halo fill circle
- Dark core gradient + subtle rim (approved pre–visible-fix values)
- Ring ellipses use `feGaussianBlur` filter + `--world-glow-rgb` stroke
- Stroke opacity increased for ring clarity only

---

## 8. Evidence

Root: `docs/evidence/world-core-ring-neon-refinement/`

### Before (dark nucleus, pre–visible-fix)

Copied from `docs/evidence/world-core-lighting-glow/` approved captures.

| File | World |
| ---- | ----- |
| `before/hero-core-blue.png` | Core blue |
| `before/gymura-silver.png` | Brands silver |
| `before/restaurant-amber.png` | Systems amber |
| `before/intelligence-violet.png` | Intelligence violet |
| `before/cybersecurity-crimson.png` | Security crimson |

### After (ring neon + reverted nucleus)

| File | World |
| ---- | ----- |
| `after/hero-core-blue.png` | Core blue |
| `after/gymura-silver.png` | Brands silver |
| `after/restaurant-amber.png` | Systems amber |
| `after/intelligence-violet.png` | Intelligence violet |
| `after/cybersecurity-crimson.png` | Security crimson |

### Side-by-side

| File |
| ---- |
| `side-by-side-hero-core-blue.png` |
| `side-by-side-gymura-silver.png` |
| `side-by-side-restaurant-amber.png` |
| `side-by-side-intelligence-violet.png` |
| `side-by-side-cybersecurity-crimson.png` |

![Security crimson comparison](../evidence/world-core-ring-neon-refinement/side-by-side-cybersecurity-crimson.png)

### Reproduce

```bash
npm run build
npx next start -p 3066

RING_NEON_VARIANT=after RING_NEON_URL=http://localhost:3066 node scripts/world-core-ring-neon-evidence.mjs
node scripts/world-core-ring-neon-compare.mjs
```

---

## 9. Validation results

| Command | Result |
| ------- | ------ |
| `npm run type-check` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| `npm run format:check` | Pass (source files) |

### Acceptance

| Criterion | Status |
| --------- | ------ |
| Nucleus dark charcoal, no color wash | **Pass** |
| No nucleus halo | **Pass** |
| Rings visibly clearer colored glow | **Pass** |
| Ring thickness unchanged | **Pass** |
| All world colors distinct | **Pass** |
| Security permanently crimson | **Pass** |
| One canvas only | **Pass** |
| No bloom / postprocessing | **Pass** |

---

## Files changed

- `src/lib/world-core/world-colors.ts` — reverted nucleus constants; added `WORLD_CORE_RING_NEON`, `WORLD_RING_GLOW_HEX`
- `src/lib/world-core/world-core-scene.ts` — reverted nucleus layers; ring glow shells
- `src/components/world-core/world-core.css` — reverted CSS tint (removed triple halo)
- `src/components/world-core/WorldCoreFallback.tsx` — dark nucleus + SVG ring glow
- `src/app/globals.css` — removed `--world-core-halo-peak`
- `scripts/world-core-ring-neon-evidence.mjs`
- `scripts/world-core-ring-neon-compare.mjs`
