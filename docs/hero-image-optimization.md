# Hero workstation image optimization (Phase 7.2)

Source (unchanged): `public/images/alex/alex-workstation-original.png`  
Original dimensions: **1086 × 1448** · **~2.0 MB** (PNG)

Regenerate derivatives:

```bash
node scripts/optimize-hero-images.mjs
```

## Output variants

| File                              | Dimensions | Approx. size | Usage                     |
| --------------------------------- | ---------- | ------------ | ------------------------- |
| `alex-workstation-desktop.webp`   | 960 × 831  | ~57 KB       | Hero LCP (≥640px)         |
| `alex-workstation-mobile.webp`    | 640 × 517  | ~29 KB       | Hero LCP (<640px)         |
| `alex-workstation-manifesto.webp` | 1200 × 575 | ~38 KB       | Manifesto background only |

## Crop intent

- **Desktop** — top ~65% of frame; emphasizes head, glasses, monitors, keyboard, RGB; less chair/body.
- **Mobile** — tighter center crop; Alex and main monitor remain visible.
- **Manifesto** — wide atmospheric band; not a repeat of the Hero composition.

## Next.js usage

- Hero: `getImageProps` + `<picture>` art direction (one LCP asset per viewport).
- Manifesto: separate smaller variant; avoids downloading the full Hero asset twice.
- Explicit `width` / `height` on all variants to prevent CLS.
- Hero `sizes`: `(max-width: 639px) 92vw, (max-width: 1024px) 80vw, 48vw`
- Manifesto `sizes`: `100vw` (decorative, lower opacity, not LCP)
