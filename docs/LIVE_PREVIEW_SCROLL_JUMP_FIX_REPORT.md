# Live Preview Scroll-Jump Fix Report

**Date:** 2026-07-13  
**Scope:** Gymura / Restaurant live preview launch scroll stability (EN + AR)  
**Status:** Complete

---

## 1. Root cause

The scroll jump when clicking **Launch Live Preview** was caused by **layout reflow inside `LiveWebsitePreview`**, not by hash navigation, form submission, or explicit `scrollIntoView()` calls.

### Primary cause — conditional in-flow mount

On launch, `previewState` switched from `idle` to `loading`. The component **removed** the in-flow idle placeholder and **inserted** a new in-flow iframe wrapper with computed pixel dimensions. Because idle and iframe states used different box models (`min-h-full flex-1` vs explicit `width`/`height`), the preview viewport height changed at the exact moment the iframe mounted. That pushed content below the Gymura section downward and shifted `window.scrollY`.

### Secondary contributors

| Factor                                        | Effect                                                                                                |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `ResizeObserver` depended on `previewState`   | Re-measured and updated `containerHeight` during the same transition, amplifying height recalculation |
| Loading overlay in document flow (before fix) | Participated in layout until iframe dimensions stabilized                                             |
| No scroll preservation on state change        | Browser kept the new (incorrect) scroll offset after reflow                                           |

### Ruled out

- No `scrollIntoView()` in preview code
- Launch button already `type="button"` (not a submit control)
- No `href="#"` on launch control
- No route/hash update on launch
- No GSAP `ScrollTrigger.refresh()` on homepage Gymura preview resize (case-study motion only)
- No autofocus / `.focus()` on iframe (added `tabIndex={-1}` as guard)

---

## 2. Fix

### Stable reserved viewport frame

- Added `.live-preview-viewport-frame` with fixed `min-height` per variant (`default`, `compact`, `compact-expanded`)
- Idle, unavailable, loading, and iframe layers are **absolutely positioned** inside the same frame
- Frame dimensions are measured via `ResizeObserver` on `frameRef` only (not affected by child swaps)

### Scroll preservation

- `runWithoutScrollJump()` captures `scrollX`/`scrollY` before launch/reload state updates
- `restoreScrollPosition()` corrects drift > 4px after paint
- `handleIframeLoad()` restores scroll after load completes
- Launch click uses `preventDefault()` and `focus({ preventScroll: true })`

### Iframe mount

- Iframe loads inside `.live-preview-viewport-stage` (absolute, centered)
- Loading overlay is absolute inside the iframe shell
- `tabIndex={-1}` prevents focus-driven scroll
- `loading="eager"` after explicit user launch (user-initiated load)

---

## 3. Files changed

| File                                             | Change                                                               |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| `src/components/projects/LiveWebsitePreview.tsx` | Stable frame, absolute overlays, scroll preservation, launch handler |
| `src/app/globals.css`                            | `.live-preview-viewport-*` layout classes                            |
| `scripts/live-preview-scroll-jump-test.mjs`      | Playwright regression test (new)                                     |
| `docs/LIVE_PREVIEW_SCROLL_JUMP_FIX_REPORT.md`    | This report                                                          |

**Not changed:** Gymura section content, iframe URL, World Core, Hero, preview chrome/controls, restaurant embed behavior beyond shared component fix.

---

## 4. Scroll validation (regression test)

Command: `node scripts/live-preview-scroll-jump-test.mjs` (against production build)

| Case                   | scrollY before | scrollY after | Drift   |
| ---------------------- | -------------- | ------------- | ------- |
| `/en` desktop 1440×900 | 1811           | 1811          | **0px** |
| `/ar` desktop 1440×900 | 1737           | 1737          | **0px** |
| `/en` mobile 390×844   | 4659           | 4659          | **0px** |
| `/ar` mobile 390×844   | 4469           | 4469          | **0px** |

Tolerance: ≤ 4px. All cases pass.

---

## 5. Build validation

| Command                | Result |
| ---------------------- | ------ |
| `npm run type-check`   | Pass   |
| `npm run lint`         | Pass   |
| `npm run format:check` | Pass   |
| `npm run build`        | Pass   |

---

## 6. Remaining iframe limitations

These are unchanged and expected:

- Cross-origin sites may block embedding via `X-Frame-Options` / CSP `frame-ancestors`
- `onload` does not guarantee visible storefront content inside the iframe
- Portfolio cannot inspect or manipulate iframe document content
- Timeout still falls back to **Preview Unavailable** after 12s
- Some browsers may still attempt internal focus behavior on cross-origin iframes; `tabIndex={-1}` and scroll restoration mitigate visible jumps

---

## 7. Regression test

```bash
npm run build
npx next start -p 3056
LIVE_PREVIEW_TEST_URL=http://localhost:3056 node scripts/live-preview-scroll-jump-test.mjs
```

Expected: four `PASS` lines, zero drift within tolerance.
