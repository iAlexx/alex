# Phase 7.3D — Connected Rail Motion System

**Date:** July 11, 2026  
**Scope:** Restrained GSAP motion for Homepage V2 rails and spine only  
**Status:** Complete — no layout, copy, section order, or dependency changes

---

## Motion architecture

Four motion levels implemented:

| Level                 | Implementation                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **L1 Global Journey** | Per-section `spine-content-connector` draw + `journey-rail__spine-link` emphasis; header `ScrollProgressLine` unchanged (scroll-scrubbed page progress) |
| **L2 World Entry**    | World connector horizontal draw on section enter (`setupWorldSpine`)                                                                                    |
| **L3 Local Rail**     | Sequential line draw + node marker activation per chapter via shared utilities                                                                          |
| **L4 Interaction**    | Existing CSS hover/focus on buttons/links preserved; no new paragraph animations                                                                        |

**Stack:** existing `gsap`, `@gsap/react`, `ScrollTrigger`, central registration in `src/lib/motion/gsap.ts`.

**Orchestrator:** single client island `HomepageRailMotion` mounted once in `page.tsx` — scoped `useGSAP` + `gsap.matchMedia` for reduced motion and mobile.

---

## Shared rail-motion utilities

| File                                    | Role                                                                                                                             |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/motion/rail-motion-tokens.ts`  | Durations, easing, trigger positions, stagger                                                                                    |
| `src/lib/motion/journey-rail-motion.ts` | `prepLinesForDraw`, `drawLine`, `activateMarker`, `buildSequentialRailTimeline`, `bindOnceScrollTimeline`, `runScopedRailMotion` |

**Data hooks added:**

- `data-rail-motion-root` — JourneyRail container
- `data-rail-line` — segments, connectors, stems
- `data-rail-node` — nodes (text always visible)
- `data-rail-marker` — decorative markers only
- `data-rail-spine-link` — local spine link
- `data-rail-spine` — builder spine fragment
- `data-rail-connector` — world entry connector
- `data-world-order` — Builder Map semantic order (brands → security)

---

## Section motion summary

### Hero origin

- Alex Core marker activates (scale/opacity on marker only)
- Stem draws downward (`hero-origin-rail__stem`)
- Hero text and photo remain static

### Method rail

- Understand → Structure → Build → Refine sequential activation
- Horizontal segments draw between nodes (vertical border on mobile; nodes only)

### Builder Map

- Alex Core marker → trunk connector → branch rail → world nodes in **semantic order** (Brands, Systems, Intelligence, Security) — not visual RTL order

### Gymura rail

- Identity → Product → Commerce → Experience
- Restrained preview shell edge highlight after final node (no iframe animation)

### Restaurant rail

- Order → Cashier → Kitchen → Fulfillment → Management
- Operational segments + markers; preview column untouched

### Texas Funds

- Branch connector from Systems composition
- User → Telegram Bot → Calculation → Result micro-flow
- Case-study link always visible

### Intelligence architecture

- Connector lines draw (vertical/horizontal by class)
- Nodes activate in order: Local Model → Memory → Tools → Local/System Tools → Automation Lab
- Diagram `dir="ltr"` preserved; animation order semantic

### Security rails

- Main discipline path: Foundations → Systems & Web → Assessment → Red Team Direction
- Principles markers activate sequentially
- ALEX Linux branch border emphasis (research framing preserved)
- Legal statement never animated or hidden

### Future path

- Origin marker → dashed track mask reveal (`--future-draw`) → direction nodes → open endpoint with subtle glow (path stays open)

### Manifesto convergence

- Four world lines brighten slightly; core dot activates once
- Manifesto text and photo static throughout

### Contact resolution

- Vertical stem draws toward Let's Build label
- Social link group receives one short `y` emphasis (no per-button stagger)

---

## One-way activation

All section timelines use `ScrollTrigger` with:

- `once: true`
- `onEnter` → `timeline.play()`
- `onEnterBack` → `timeline.progress(1)` if incomplete (never reverse to empty)

Fast scroll: incomplete timelines complete via `onEnterBack` / refresh guard in `bindOnceScrollTimeline`.

---

## Reduced-motion behavior

`gsap.matchMedia("(prefers-reduced-motion: reduce)")`:

- All lines `scaleX/scaleY: 1`, markers at full opacity/scale
- Track masks (`--future-draw`, `--rail-track-draw`) set to complete
- No ScrollTrigger playback
- Static SSR diagram remains the baseline

---

## Mobile simplification

`max-width: 639px` matchMedia branch:

- Shorter stagger (0.08s vs 0.12s)
- Horizontal line draws skipped where vertical layout uses track borders
- Node marker activation only on process/operational rails
- No complex simultaneous branch choreography

---

## ScrollTrigger count and cleanup

**Approximate trigger count:** 18

| ID                                | Section              |
| --------------------------------- | -------------------- |
| `motion-hero-origin`              | Hero                 |
| `motion-method-rail`              | Method process       |
| `motion-builder-map`              | Builder Map          |
| `motion-spine-world-brands`       | Build Brands         |
| `motion-spine-world-systems`      | Build Systems        |
| `motion-spine-world-intelligence` | Intelligence         |
| `motion-spine-world-security`     | Security             |
| `motion-spine-future`             | Future               |
| `motion-gymura-rail`              | Gymura evolution     |
| `motion-restaurant-rail`          | Restaurant workflow  |
| `motion-texas-rail`               | Texas Funds          |
| `motion-intelligence-rail`        | Intelligence diagram |
| `motion-security-stages`          | Security discipline  |
| `motion-security-principles`      | Security principles  |
| `motion-alex-linux-branch`        | ALEX Linux branch    |
| `motion-future-rail`              | Future path          |
| `motion-manifesto-convergence`    | Manifesto            |
| `motion-contact-resolution`       | Contact              |

**Cleanup:** `useGSAP` return calls `mm.revert()` which kills matchMedia contexts and associated ScrollTriggers on unmount/locale navigation.

**Static fallback:** Timelines are built lazily on first `onEnter` — decorative prep (`scaleX/Y: 0`) runs only when the section enters view, not on hydration. SSR and no-JS users always see complete rails.

---

## Performance decisions

- Animate **transform** and **opacity on decorative markers only** — never headings or paragraphs
- CSS **mask-image** for dashed/vertical track reveals (no layout properties)
- **One trigger per section** (not per node)
- `will-change: transform` on decorative rail elements under `prefers-reduced-motion: no-preference` only
- No pinning, no scrub on local rails, no React state on scroll
- Static SSG build unchanged (23 pages)

---

## Accessibility decisions

- All animated lines remain `aria-hidden`
- Screen-reader summaries (`JourneyRailSummary`, `sr-only` diagram text) unchanged
- Node activation not announced (visual enhancement only)
- Semantic HTML, heading order, keyboard focus unchanged
- Color-independent information preserved in visible text

---

## Content preservation

Phase 7.3C copy untouched. No dictionary or visible string changes in this phase.

---

## Files created

| File                                              |
| ------------------------------------------------- |
| `src/lib/motion/rail-motion-tokens.ts`            |
| `src/lib/motion/journey-rail-motion.ts`           |
| `src/components/v2/motion/HomepageRailMotion.tsx` |
| `docs/PHASE_7_3D_MOTION_REPORT.md`                |

## Files modified

| File                                             | Change                                                                        |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| `src/components/v2/journey-rail/JourneyRail.tsx` | Motion data attributes on root, nodes, segments, spine link                   |
| `src/components/v2/JourneyShell.tsx`             | `data-rail-spine`, `data-rail-connector`                                      |
| `src/components/v2/BuilderMap.tsx`               | Semantic world order + motion hooks on map elements                           |
| `src/components/v2/HeroV2Section.tsx`            | Hero origin rail motion hooks                                                 |
| `src/components/v2/IntelligenceArchitecture.tsx` | Connector and node motion hooks                                               |
| `src/components/v2/ManifestoV2Section.tsx`       | Convergence line hooks                                                        |
| `src/components/v2/ContactV2Section.tsx`         | Resolution stem + group hook                                                  |
| `src/components/v2/FuturePathRail.tsx`           | Origin marker hook                                                            |
| `src/components/v2/SystemsTexasFundsBranch.tsx`  | Branch connector hooks                                                        |
| `src/app/[locale]/page.tsx`                      | Mount `HomepageRailMotion`                                                    |
| `src/app/globals.css`                            | Motion transform origins, track masks, contact stem, reduced-motion overrides |

---

## Validation results

| Command                | Result              |
| ---------------------- | ------------------- |
| `npm run lint`         | Pass                |
| `npm run type-check`   | Pass                |
| `npm run format:check` | Pass                |
| `npm run build`        | Pass (SSG 23 pages) |

---

## Manual visual review

Verify on `/en` and `/ar` at 320px, 375px, 768px, 1024px, 1280px, 1440px:

- [ ] All text visible before and during animation
- [ ] No text opacity 0 or replay on reverse scroll
- [ ] Method rail order correct
- [ ] Builder Map semantic order in Arabic (not mirrored visual order)
- [ ] Gymura Identity → Experience + preview highlight
- [ ] Restaurant Order → Management
- [ ] Texas User → Result after Restaurant
- [ ] Intelligence fork from Tools Registry
- [ ] Security legal statement always visible
- [ ] Future endpoint stays open
- [ ] Manifesto convergence subtle
- [ ] Contact feels human, not technical
- [ ] Reduced motion shows complete static rails
- [ ] Fast scroll leaves no half-drawn paths
- [ ] No horizontal overflow or scroll jank

---

Phase 7.3D complete. Phase beyond 7.3D not started.
