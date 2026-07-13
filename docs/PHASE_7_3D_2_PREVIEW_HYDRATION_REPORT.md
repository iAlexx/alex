# Phase 7.3D.2 — Live Website Preview Hydration Stability Fix

**Date:** 2026-07-11  
**Scope:** Targeted hydration fix for `LiveWebsitePreview` only

---

## Exact Hydration Mismatch Source

**File:** `src/components/projects/LiveWebsitePreview.tsx`

**Function:** `defaultViewport()` used inside lazy `useState` initialization:

```ts
const [viewport, setViewport] = useState<ViewportMode>(() => defaultViewport());

function defaultViewport(): ViewportMode {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < MOBILE_BREAKPOINT ? "mobile" : "desktop";
}
```

### Differing server/client values (before fix)

| Environment                   | `viewport` state | Desktop `aria-pressed` | Mobile `aria-pressed` |
| ----------------------------- | ---------------- | ---------------------- | --------------------- |
| SSR (`window` undefined)      | `"desktop"`      | `"true"`               | `"false"`             |
| Client first render at ≤639px | `"mobile"`       | `"false"`              | `"true"`              |
| Client first render at ≥640px | `"desktop"`      | `"true"`               | `"false"`             |

React logged mismatches on `aria-pressed` and active button `className` for Gymura and Restaurant previews whenever the physical viewport was below 640px.

**Contributing factor:** A `resize` listener only forced `"mobile"` (never restored `"desktop"`), but the primary hydration break was the `useState` initializer reading `window.innerWidth` during the first client render.

**Not involved:** `ResizeObserver` (container sizing only), `matchMedia`, rail-motion files.

---

## Final Deterministic Initialization Strategy

```ts
const DEFAULT_VIEWPORT_MODE: ViewportMode = "desktop";

const [viewport, setViewport] = useState<ViewportMode>(DEFAULT_VIEWPORT_MODE);
const [hasUserSelectedMode, setHasUserSelectedMode] = useState(false);
```

- Server and first client render always use `"desktop"`.
- No `window`, `matchMedia`, or `document` access during render or lazy state init.
- `aria-pressed` is derived from `viewport` — identical on SSR and hydration.

---

## Post-Mount Responsive Behavior

After hydration, a `useEffect` syncs viewport from window width **only when the user has not manually selected a mode**:

```ts
useEffect(() => {
  if (hasUserSelectedMode) return;
  const syncViewportFromWindow = () => {
    const next = viewportForWindowWidth(window.innerWidth);
    setViewport((current) => (current === next ? current : next));
  };
  syncViewportFromWindow();
  window.addEventListener("resize", syncViewportFromWindow);
  return () => window.removeEventListener("resize", syncViewportFromWindow);
}, [hasUserSelectedMode]);
```

| Viewport width | Post-mount auto mode (if no user selection) |
| -------------- | ------------------------------------------- |
| < 640px        | `mobile`                                    |
| ≥ 640px        | `desktop`                                   |

This preserves prior responsive intent without affecting hydration.

---

## User-Selection Preservation

```ts
const selectViewport = useCallback((mode: ViewportMode) => {
  setHasUserSelectedMode(true);
  setViewport(mode);
}, []);
```

Once the user clicks Desktop / Tablet / Mobile:

- `hasUserSelectedMode` is `true`
- Resize listener and post-mount sync no longer overwrite the choice
- Manual selection verified in browser automation (Tablet click holds after sync)

---

## ResizeObserver Safety

Unchanged — still:

- Starts in `useEffect` after mount
- Observes `viewportRef` for `containerWidth` / `containerHeight`
- Disconnects on cleanup
- Does not touch `viewport` or `aria-pressed`
- Gymura `compact-expanded` height scaling preserved

---

## Files Modified

- `src/components/projects/LiveWebsitePreview.tsx`
- `scripts/preview-hydration-check.mjs` (diagnostic only, not a dependency)

**Not modified:** rail-motion files, layout, copy, preview dimensions, colors.

---

## Browser Console Result

Playwright headless tests at `http://localhost:3000`:

| Route | Viewport | Hydration warnings |
| ----- | -------- | ------------------ |
| `/en` | 375px    | **0**              |
| `/en` | 768px    | **0**              |
| `/en` | 1024px   | **0**              |
| `/en` | 1440px   | **0**              |
| `/ar` | 1440px   | **0**              |

`aria-pressed`: exactly **one** `true` per preview instance at all widths.

---

## Gymura Preview Result

- `compact-expanded` variant unchanged visually
- Device switcher works; manual Tablet selection confirmed
- No duplicate Visit CTA (unchanged)
- Post-mount: Mobile auto-selected at 375px after hydration (no mismatch)

---

## Restaurant Preview Result

- `compact` variant unchanged
- Standalone external link row preserved
- Device switcher and `aria-pressed` stable
- No hydration warnings

---

## Rail-Motion Regression Result

- `data-rail-motion-init="true"` confirmed on all test viewports
- `[rail-motion]` diagnostics still emit (23 log lines per page load)
- No rail-motion files modified

---

## Validation

| Command                | Result |
| ---------------------- | ------ |
| `npm run lint`         | ✓ Pass |
| `npm run type-check`   | ✓ Pass |
| `npm run format:check` | ✓ Pass |
| `npm run build`        | ✓ Pass |

---

**Phase 7.3D.2 complete.**
