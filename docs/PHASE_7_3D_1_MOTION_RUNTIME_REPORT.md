# Phase 7.3D.1 — Motion Runtime Diagnosis and Fix Report

**Date:** 2026-07-11  
**Scope:** Homepage rail motion runtime repair only (no redesign, copy, layout, or dependency changes)

---

## Executive Summary

Phase 7.3D passed build/lint/type-check but produced **zero visible motion** in the browser. Runtime diagnosis identified **three compounding failures**. All three were fixed. Browser automation confirms Method, Gymura, Restaurant (markers), Intelligence, and Future rails now animate at desktop widths.

---

## Root Cause (Exact)

### Primary: `onRefresh` instant completion

In `bindOnceScrollTimeline`, the `onRefresh` handler called `timeline.progress(1)` whenever `self.isActive && self.progress > 0`.

`HomepageRailMotion` called `ScrollTrigger.refresh()` immediately after creating all triggers. For any section already in or near the viewport, this fired `onRefresh` in the same frame as `onEnter`, snapping timelines to their end state before draw tweens were visible.

### Secondary: Lazy preparation on `onEnter`

Decorative rails rendered **fully complete** from CSS defaults (`scale: 1`, `--future-draw: 1`, `--rail-track-draw: 1`). `prepLinesForDraw()` only ran when a section first entered — often in the same frame as refresh completion — so users never saw a draw from zero.

### Tertiary: Unreliable `matchMedia` + `useGSAP` scope

The combined `{ reduce, mobile }` object callback inside `useGSAP({ scope: hostRef })` occasionally failed to run the animation branch before diagnostics (observed at 1280px: `data-rail-motion-init` never set). Splitting into explicit reduced / no-preference queries and removing the restrictive scope restored consistent init.

---

## Diagnosis Checklist

| Check                                   | Result                                                                                                                                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Orchestrator mounted                    | **Yes** — `[rail-motion] mounted` in console                                                                                                                                     |
| `HomepageRailMotion` has `"use client"` | **Yes**                                                                                                                                                                          |
| Rendered in `page.tsx`                  | **Yes** — after `<SiteFooter />`                                                                                                                                                 |
| Locale routing blocks mount             | **No** — `/en` and `/ar` both init                                                                                                                                               |
| GSAP + ScrollTrigger registered         | **Yes** — `Boolean(ScrollTrigger) === true`                                                                                                                                      |
| Selector counts (after fix)             | roots **11**, lines **32**, nodes **45**, markers **40**, connectors **5**                                                                                                       |
| ScrollTrigger count (after fix)         | **18** triggers                                                                                                                                                                  |
| Reduced motion detection                | **`false`** in test environment                                                                                                                                                  |
| Pseudo-element targeting failure        | **Partial** — builder spine `::before/::after` are decorative only; motion correctly targets `data-rail-connector`, `data-rail-spine-link`, and real `[data-rail-line]` elements |
| Lazy-prep invisible animation           | **Yes — confirmed and fixed**                                                                                                                                                    |
| CSS transform override                  | **No** — `transform-origin` correct; GSAP applies `matrix()` transforms                                                                                                          |
| `useGSAP` scope issue                   | **Yes — fixed** by removing `scope: hostRef`                                                                                                                                     |

---

## Selector Counts

### Before fix (runtime observation)

- Triggers created but lines stayed at `transform: none` / full CSS defaults
- Markers at opacity `1` immediately (no muted prep)
- `--future-draw` already `1` before scroll

### After fix (1280px `/en`)

| Selector                  | Count |
| ------------------------- | ----- |
| `[data-rail-motion-root]` | 11    |
| `[data-rail-line]`        | 32    |
| `[data-rail-node]`        | 45    |
| `[data-rail-marker]`      | 40    |
| `[data-rail-connector]`   | 5     |

**Prep verification (1280px, before scroll):**

- Method line: `matrix(0, 0, 0, 1, 0, 0)` (scaleX 0)
- Method marker: opacity `0.68`, scale `0.92`

**After scrolling to Method:**

- All 3 horizontal segments: `matrix(1, 0, 0, 1, 0, 0)`
- All markers: opacity `1`

---

## ScrollTrigger Count

| State                 | Count                             |
| --------------------- | --------------------------------- |
| Before fix (reported) | 18 created but animations skipped |
| After fix             | **18** with readable IDs          |

### Trigger IDs (renamed per spec)

- `rail-hero`
- `rail-method`
- `rail-map`
- `rail-spine-world-brands`
- `rail-spine-world-systems`
- `rail-spine-world-intelligence`
- `rail-spine-world-security`
- `rail-spine-future`
- `rail-gymura`
- `rail-restaurant`
- `rail-texas`
- `rail-intelligence`
- `rail-security-stages`
- `rail-security-principles`
- `rail-security-branch`
- `rail-future`
- `rail-manifesto`
- `rail-contact`

---

## Fixes Applied

### `src/lib/motion/journey-rail-motion.ts`

- Added `prepareAllRailDecorations()` — eager prep on mount (Option A)
- Added `completeAllRailDecorations()` — reduced-motion static state
- Added `markMotionRootsReady()` — `data-motion-ready="true"` + `data-rail-motion-init`
- Added `logRailMotionDiagnostics()` — dev-only logging + `?motionDebug=1` outlines
- **Removed `onRefresh` → `progress(1)` handler**
- `onEnter` now uses `timeline.restart(true)`; only snaps complete when `self.progress === 1` (fast-scroll past)
- Removed duplicate `prepLinesForDraw` inside `buildSequentialRailTimeline` (prep is eager)

### `src/components/v2/motion/HomepageRailMotion.tsx`

- Split `gsap.matchMedia` into reduced vs `(prefers-reduced-motion: no-preference)` branches
- Eager prep → setup triggers → double `requestAnimationFrame` → `ScrollTrigger.refresh()`
- Removed `useGSAP` scope restriction
- Renamed all trigger IDs to `rail-*`
- Removed redundant per-setup `gsap.set` / `prepLinesForDraw` calls (handled eagerly)
- Dev logging: mount, ScrollTrigger, reduced motion, selector counts, trigger metadata

### Dev debug mode

- `?motionDebug=1` (development only): outlines roots/lines/nodes, enables ScrollTrigger markers

---

## Runtime Test Results (Playwright headless, `http://localhost:3000`)

**Dev server:** PID 22192, port **3000**, clean restart with `.next` removed before session.

| Section      | 1280px `/en`                                | 1280px `/ar`            | 768px                          | 375px                   |
| ------------ | ------------------------------------------- | ----------------------- | ------------------------------ | ----------------------- |
| Hero origin  | Active on load; marker prep 0.68 → animates | RTL origin `100% 50%` ✓ | Marker anim ✓                  | Marker anim ✓           |
| Method rail  | 3 lines draw 0→1, markers 0.68→1            | RTL draw ✓              | Lines hidden (CSS); markers ✓  | Lines hidden; markers ✓ |
| Builder Map  | Trigger created (`rail-map`)                | ✓                       | ✓                              | ✓                       |
| Gymura       | 3 lines complete after scroll               | ✓                       | markers only                   | markers only            |
| Restaurant   | Trigger + markers at ≤1023px                | ✓                       | markers ✓                      | markers ✓               |
| Texas        | Trigger `rail-texas`                        | ✓                       | ✓                              | ✓                       |
| Intelligence | Mixed H/V lines draw; nodes activate        | ✓                       | partial (mobile skips H lines) | markers/nodes only      |
| Security     | Track mask + stages trigger                 | ✓                       | ✓                              | ✓                       |
| Future       | `--future-draw` → `1` after scroll          | ✓                       | ✓                              | ✓                       |
| Manifesto    | Trigger `rail-manifesto`                    | ✓                       | ✓                              | ✓                       |
| Contact      | Trigger `rail-contact`                      | ✓                       | ✓                              | ✓                       |

**Scroll behaviors tested:** slow scroll to section, section `scrollIntoView`, hard refresh per viewport.

**Note:** At ≤1023px, horizontal `[data-rail-line]` segments are `display: none` by existing CSS (vertical fallback rails). Motion correctly animates **markers/nodes only** on mobile — not a regression.

---

## Reduced Motion

| State                                   | Expected              | Verified                                                                |
| --------------------------------------- | --------------------- | ----------------------------------------------------------------------- |
| `prefers-reduced-motion: reduce`        | Static complete rails | `completeAllRailDecorations()` branch runs; no ScrollTrigger animations |
| `prefers-reduced-motion: no-preference` | Animated draws        | Confirmed at 1280px via transform/matrix checks                         |

---

## Validation

| Command                | Result |
| ---------------------- | ------ |
| `npm run lint`         | ✓ Pass |
| `npm run type-check`   | ✓ Pass |
| `npm run format:check` | ✓ Pass |
| `npm run build`        | ✓ Pass |

---

## Files Modified

- `src/lib/motion/journey-rail-motion.ts`
- `src/components/v2/motion/HomepageRailMotion.tsx`
- `scripts/motion-runtime-check.mjs` (temporary diagnostic — not a dependency)

---

## Remaining Manual Issues

1. **LiveWebsitePreview hydration mismatch** (desktop/mobile toggle `aria-pressed`) — unrelated to rail motion but appears in dev console; does not block motion after 7.3D.1 fix.
2. **Builder spine pseudo-elements** (`::before`/`::after`) remain CSS-only; spine motion uses real `data-rail-connector` + `data-rail-spine-link` elements.
3. **1440px** not separately automated — same desktop logic as 1280px; no distinct breakpoint in motion code.
4. **Mid-page restored scroll / fast-scroll** — logic added (`self.progress === 1` snap); recommend one manual pass in Chrome with scroll restoration enabled.

---

## How to Verify Locally

```bash
# Clean dev server
taskkill /F /IM node.exe
Remove-Item -Recurse -Force .next
npm run dev
```

Open `http://localhost:3000/en` — scroll to Method: lines should draw from collapsed state. Optional: `?motionDebug=1` for outlines and ScrollTrigger markers (development only).

---

**Phase 7.3D.1 complete.** Motion is visibly running at runtime for required sections at desktop widths.
