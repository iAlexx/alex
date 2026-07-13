# World Core Nucleus Exact Restore

## Summary

Restored the inner nucleus to the **exact pre-lighting implementation** captured from the agent transcript at persistent World Core integration (2026-07-12). All nucleus lighting experiments were removed. Ring-only neon refinement is preserved and isolated so it does not alter nucleus materials or shared light intensities.

**Source of truth:** `scripts/_snapshot-world-core-scene-original.ts` — extracted from transcript line 1034 (`createWorldCoreScene` initial `Write`). Git history contains only `3b20ebc` (Create Next App); World Core files were never committed, so the transcript snapshot is the authoritative approved revision.

---

## 1. Nucleus code restored (exact)

| Property | Restored value |
| -------- | -------------- |
| Geometry | `IcosahedronGeometry(0.72, 2)` only |
| Material | `MeshPhysicalMaterial` |
| Base color | `#0a0e14` |
| Metalness | `1` |
| Roughness | `0.24` |
| Clearcoat | `0.8` |
| Clearcoat roughness | `0.18` |
| Nucleus emissive | **None** (no `emissive` on core mat) |
| Inner emissive sphere | `SphereGeometry(0.48)`, opacity `0.82`, emissive lerp from world color |
| Inner sphere intensity | `currentPreset.emissiveIntensity` (no security boost) |

### Scene lights (nucleus-affecting, exact)

| Light | Intensity |
| ----- | --------- |
| Ambient | `0.35` |
| Key `#8fb2ff` | `1.1` |
| Fill `#835BFF` | `0.5` |
| Point (world color) | `0.6` × security point boost only |
| Rim light | **Removed** (added in glow refinement) |

### Removed layers (not in approved snapshot)

- Reflection shell (`SphereGeometry 0.58`)
- Fresnel rim shell (`SphereGeometry 0.80`, BackSide)
- Hotspot meshes (3 or 4)
- Surface wash sphere
- `WORLD_CORE_LIGHTING` constants
- Nucleus emissive / sheen / nucleus security boost
- Dual/triple CSS nucleus halo gradients
- `WORLD_CORE_LIGHTING` boosted ambient/key/fill/rim/point

### CSS tint (exact pre–glow-refinement)

Single wide radial on `.world-core-layer__tint`:

```css
radial-gradient(
  ellipse 65% 55% at 78% 50%,
  rgb(var(--world-accent-rgb) / 0.1),
  rgb(var(--world-accent-rgb) / 0.04) 38%,
  transparent 72%
);
```

### Fallback SVG (exact pre–glow-refinement nucleus)

- Core gradient: `0.55 → 0.12 → 0` stops
- Center fill opacity: `0.35`
- No `wcf-rim`, no `wcf-halo` circle
- Ring stroke glow filter added **only** for ring neon (does not change nucleus fills)

---

## 2. Ring-only changes retained

| Feature | Value |
| ------- | ----- |
| Crisp ring emissive mul | `1.68` (`WORLD_CORE_RING_NEON`) |
| Glow shell scale | `1.025` |
| Glow shell opacity | `0.15` |
| Glow shell emissive | `0.38`, additive blending |
| Secondary glow color | `WORLD_RING_GLOW_HEX` per world |
| Mobile | No duplicate glow geometry; `×0.68` ring intensity |
| Security ring boost | `SECURITY_EMISSIVE_BOOST.ring: 1.1` (rings only) |
| Security point boost | `SECURITY_EMISSIVE_BOOST.point: 1.06` (point only) |

**Isolation:** `glowMat.emissiveIntensity` uses preset only — never multiplied by ring boost or ring neon constants. `coreMat` has no emissive and is never tinted in `applyAccentMaterials`.

---

## 3. Focused diff (nucleus)

Nucleus-related blocks in `world-core-scene.ts` now match `scripts/_snapshot-world-core-scene-original.ts` except:

- Import additions for ring neon (`resolveRingGlowHex`, `WORLD_CORE_RING_NEON`, `SECURITY_EMISSIVE_BOOST`)
- Ring loop extended with glow shells (no nucleus changes)
- `targetRingBoost` / `currentRingBoost` replace shared `targetEmissiveBoost` so security boost applies to rings/point only
- `ringMats` emissive uses `WORLD_CORE_RING_NEON.ringEmissiveMul` instead of `× 0.9`

Run locally:

```bash
git diff --no-index scripts/_snapshot-world-core-scene-original.ts src/lib/world-core/world-core-scene.ts
```

---

## 4. Files changed

| File | Change |
| ---- | ------ |
| `src/lib/world-core/world-core-scene.ts` | Nucleus + lights restored from snapshot; ring neon isolated |
| `src/lib/world-core/world-colors.ts` | Removed `WORLD_CORE_LIGHTING`; kept ring neon + ring-only security boost |
| `src/components/world-core/WorldCoreFallback.tsx` | Original nucleus gradients; ring SVG glow only |
| `src/components/world-core/world-core.css` | Single radial tint (pre–glow-refinement) |
| `scripts/_snapshot-world-core-scene-original.ts` | Reference snapshot (transcript) |
| `scripts/world-core-nucleus-exact-restore-evidence.mjs` | Evidence capture |

---

## 5. Evidence

Root: `docs/evidence/world-core-nucleus-exact-restore/`

| Set | Source |
| --- | ------ |
| `before/` | Approved pre-lighting captures from `docs/evidence/persistent-world-core/` |
| `after/` | Layer crop at same scroll targets, port 3067 build |
| `side-by-side-*.png` | Before vs after composites |

| File | World |
| ---- | ----- |
| `side-by-side-hero-core-blue.png` | Core |
| `side-by-side-gymura-silver.png` | Brands |
| `side-by-side-restaurant-amber.png` | Systems |
| `side-by-side-intelligence-violet.png` | Intelligence |
| `side-by-side-cybersecurity-crimson.png` | Security crimson |

![Nucleus restore — security](../evidence/world-core-nucleus-exact-restore/side-by-side-cybersecurity-crimson.png)

### Reproduce

```bash
npm run build
npx next start -p 3067
NUCLEUS_RESTORE_URL=http://localhost:3067 node scripts/world-core-nucleus-exact-restore-evidence.mjs
```

---

## 6. Validation

| Command | Result |
| ------- | ------ |
| `npm run type-check` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |

| Check | Status |
| ----- | ------ |
| Nucleus matches approved snapshot code | **Pass** |
| No reflection / Fresnel / hotspot layers | **Pass** |
| No `WORLD_CORE_LIGHTING` | **Pass** |
| Ring neon preserved | **Pass** |
| Security crimson permanent | **Pass** |
| One canvas | **Pass** |

---

## 7. Reference

- Integration report: `docs/PERSISTENT_WORLD_CORE_REPORT.md`
- Transcript snapshot: agent session `4525b890-8876-457e-9bff-96d1f125905d`, line 1034
- Ring neon prior work: `docs/WORLD_CORE_RING_NEON_REFINEMENT.md`
