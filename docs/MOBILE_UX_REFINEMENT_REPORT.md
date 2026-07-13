# Mobile UX Refinement Report

**Date:** 2026-07-13  
**Scope:** Homepage mobile (`/en`, `/ar`) — `max-width: 1023px` / `767px` only  
**Desktop:** Unchanged (approved layout preserved)

---

## Executive summary

Mobile homepage refinement delivers a **content-first, chapter-oriented** scroll experience without altering desktop layout, project facts, SEO, section order, World Core nucleus material, or approved Hero direction.

Key outcomes:

- Shared **mobile spacing tokens** and section rhythm applied globally via `mobile-ux.css`
- **Chapter markers** on major journey sections using localized eyebrow labels
- **Gymura mobile stack** reorders content: statement → meta → tech → CTA → preview → process rail
- **Tech Stack progressive disclosure** on homepage (6 visible + “Show more”) — desktop still shows full stack
- **World Core** reduced size/opacity on phones with preview safe-zones
- **CTA hierarchy** strengthened with full-width primary actions on narrow viewports
- **Arabic RTL** line-height and chapter marker adjustments; no layout mirroring
- **Security legal note** visually separated without alert styling

---

## Audit findings

Full pre-implementation audit: `docs/MOBILE_UX_REFINEMENT_AUDIT.md`

| Issue | Severity | Resolution |
| ----- | -------- | ---------- |
| Sections visually run together | High | `--mobile-section-block` padding + chapter markers |
| Gymura density | High | Mobile stack reorder + tech expand |
| Tech Stack pill walls | High | 6-item initial view + toggle |
| World Core overlaps previews | High | Smaller layer, lower opacity, bottom safe-zone |
| Weak CTA hierarchy | Medium | `.mobile-primary-cta` on primary actions |
| Arabic line-height pressure | Medium | 1.82 body line-height on RTL |
| Intelligence diagram density | Medium | Existing vertical stack preserved; calmer action column |
| Fragmented breakpoints | Medium | Centralized in `mobile-ux.css` for spacing/hero/core |

---

## Mobile design system

### Spacing tokens (`globals.css`)

| Token | Value |
| ----- | ----- |
| `--mobile-page-inline` | `clamp(1rem, 4.5vw, 1.25rem)` |
| `--mobile-section-block` | `clamp(4.5rem, 12vw, 6.5rem)` |
| `--mobile-section-gap` | `clamp(1.25rem, 4vw, 2rem)` |
| `--mobile-content-gap` | `clamp(0.875rem, 3vw, 1.25rem)` |
| `--mobile-small-gap` | `0.625rem` |
| `--mobile-reading-width` | `36rem` |
| `--mobile-chapter-accent` | world accent at 85% |

### Section rhythm

1. Chapter eyebrow (marker)
2. Title / wordmark
3. Main statement
4. Supporting copy
5. Metadata / Tech Stack
6. Primary CTA
7. Visual / preview / process
8. Optional details

---

## Spacing changes

- `journey-shell` uses `--mobile-section-block` vertical padding below 1024px
- `journey-composition` stacks as flex column with `--mobile-section-gap`
- Preview sections (`#world-brands`, `#world-systems`, `#world-security`) add bottom safe-zone for World Core
- Security framework aside separated with top border + gap
- Learning path vertical rail gap increased

---

## Typography changes

- Section H2 via `.world-chapter-header h2`: `clamp(1.625rem, 5.5vw, 2rem)`, line-height 1.25 (1.35 AR)
- Body paragraphs in journey content: line-height 1.72 EN / 1.82 AR
- Gymura wordmark: `clamp(2.25rem, 10vw, 3.25rem)` with RTL line-height adjustment
- Security legal note: brighter text (`0.88` opacity), padded block — not dim error styling
- Chapter markers: uppercase EN with letter-spacing; natural case AR without aggressive tracking

---

## Hero mobile

Preserved approved Hero direction. Mobile-only refinements in `mobile-ux.css`:

- Reduced visual min-height: `clamp(42svh, 48svh, 52svh)`
- CTAs stack full-width below 768px with 44px+ touch targets
- Composition gap uses mobile tokens
- Arabic copy-first order unchanged; portrait not mirrored

---

## Gymura mobile

- `gymura-mobile-stack` flex order on tablet/phone
- Content order: eyebrow → title → subtitle → bridge → statement → meta → tech → **CTA** → process rail → **preview**
- Tech Stack: 6 items + expand
- Primary case-study CTA uses `.mobile-primary-cta`
- Preview scroll-jump fix preserved (no layout changes to preview shell)

---

## Restaurant mobile

- Chapter marker: “Build Systems” / Arabic equivalent
- Platform column stacks with `--mobile-section-gap`
- Tech Stack expandable (6 + more)
- Workflow band retains vertical journey (existing `SystemsWorkflowBand` mobile behavior)
- Texas Funds branch: micro-flow `white-space: normal` for narrow screens

---

## Texas mobile

- Tech Stack expandable within branch
- Flow nodes wrap on small screens
- Concise hierarchy preserved: status → flow → tech → CTA

---

## Intelligence mobile

- Chapter marker + hidden duplicate eyebrow
- Tech Stack expandable
- Primary Alexa case-study CTA full-width on narrow viewports
- Secondary automation link remains lower emphasis
- Architecture diagram uses existing ≤639px vertical stack (connectors preserved)

---

## Cybersecurity mobile

- Chapter marker + crimson identity unchanged
- Tech Stack expandable
- Learning path vertical spacing increased
- ALEX Linux branch visually separated in `security-framework` aside
- Legal/scope note: `.security-legal-note` block with accent border and readable contrast
- Primary case-study CTA full-width capable

---

## Future mobile

- Chapter marker from `future.title`
- Composition gap via mobile tokens
- Path rail unchanged structurally

---

## Manifesto mobile

- No chapter marker (visually distinct band)
- Portrait band height reduced: `min(48vh, 26rem)` on phones

---

## Contact mobile

- Chapter marker: resolution label (“Let’s build” / Arabic)
- Existing contact resolution layout preserved

---

## Tech Stack behavior

| Context | Behavior |
| ------- | -------- |
| Homepage sections | 6 pills initially on ≤1023px; “Show N more” toggle |
| Desktop | All items visible; toggle hidden |
| Case studies | Full stack visible (no expandable flag) |
| Semantic list | `<ul>/<li>` preserved |
| Bilingual | RTL list direction; technical names LTR in badges |

New copy keys: `techStackShowMore`, `techStackShowLess` (EN + AR).

---

## CTA hierarchy

- `.mobile-primary-cta`: full width &lt;400px, min 16rem width above
- Applied to Gymura, Cybersecurity, Intelligence primary links
- Minimum 44px touch height maintained on buttons

---

## World Core mobile behavior

Preserved: exact nucleus, ring neon, world colors, activation logic, one canvas.

Mobile adjustments (`mobile-ux.css` + existing `world-core-layer--mobile`):

- Size: `clamp(140px, 38vw, 200px)`
- Opacity: 0.24 default; 0.18 during brands/systems/security; 0.2 intelligence
- Position: bottom-end negative space
- Tint opacity reduced
- No pointer interaction (existing)
- Preview sections padded to prevent overlap

---

## English behavior

- Chapter markers uppercase with accent line
- Comfortable 1.72 body line-height
- Gymura CTA before preview for clearer action path

---

## Arabic / RTL behavior

- Chapter markers: no forced uppercase; relaxed letter-spacing; 1.65 line-height
- Body line-height 1.82
- Tech Stack list `dir="rtl"`; badge content LTR
- Security legal note border flips to inline-end
- Photo and diagrams not mirrored

---

## Accessibility

- Tech Stack toggle: `aria-expanded`, focus-visible styles, 44px min height
- Chapter markers supplement (not replace) semantic headings
- Reduced motion: existing GSAP/World Core pause behavior preserved
- Touch targets ≥44px on primary CTAs and toggle
- No new decorative canvas or animation dependencies

---

## Performance impact

- **No new JS bundles** beyond small client `ProjectTechStack` (already client for expand)
- **No additional Three.js canvas**
- CSS-only mobile collapse for tech pills avoids layout thrash on desktop
- World Core opacity reduction lowers visual compositing cost on mobile
- No new remote assets
- Build output unchanged route count (SSG 48 pages)

---

## Files created

| File | Purpose |
| ---- | ------- |
| `docs/MOBILE_UX_REFINEMENT_AUDIT.md` | Pre-implementation audit |
| `docs/MOBILE_UX_REFINEMENT_REPORT.md` | This report |
| `src/app/mobile-ux.css` | Mobile-only spacing, hero, core, section rules |
| `scripts/mobile-ux-audit-screenshots.mjs` | Before evidence capture |
| `scripts/mobile-ux-after-screenshots.mjs` | After evidence + composites |

---

## Files modified

| File | Change |
| ---- | ------ |
| `src/app/globals.css` | Mobile tokens + import `mobile-ux.css` |
| `src/components/v2/JourneyShell.tsx` | `chapterLabel` + `data-chapter-label` |
| `src/components/v2/WorldChapterHeader.tsx` | `journey-chapter-eyebrow` class |
| `src/components/v2/WorldBrandsSection.tsx` | Mobile stack, chapter, expandable tech, CTA |
| `src/components/v2/WorldSystemsSection.tsx` | Chapter + expandable tech |
| `src/components/v2/WorldIntelligenceSection.tsx` | Chapter label |
| `src/components/v2/WorldSecuritySection.tsx` | Chapter + expandable tech + CTA |
| `src/components/v2/SystemsTexasFundsBranch.tsx` | Expandable tech |
| `src/components/v2/IntelligenceArchitecture.tsx` | Expandable tech + primary CTA |
| `src/components/v2/MethodSection.tsx` | Chapter label |
| `src/components/v2/FutureDirectionSection.tsx` | Chapter label |
| `src/components/v2/ContactV2Section.tsx` | Chapter label |
| `src/components/projects/ProjectTechStack.tsx` | Progressive disclosure |
| `src/components/projects/project-tech-stack.css` | Toggle + mobile-only collapse |
| `src/content/translations/en.ts` | Show more/less strings |
| `src/content/translations/ar.ts` | Show more/less strings |
| `src/content/translations/types.ts` | Type keys |

---

## Evidence paths

| Path | Contents |
| ---- | -------- |
| `docs/evidence/mobile-ux-refinement/audit-before/` | Pre-refinement screenshots (5 viewports × EN/AR) |
| `docs/evidence/mobile-ux-refinement/audit-after/` | Post-refinement screenshots (390×844, 320×568) |
| `docs/evidence/mobile-ux-refinement/composites/` | Before/after: Hero, Gymura, Restaurant, Cybersecurity |

Full-page scroll captures:

- `audit-after/en-fullpage-scroll-390x844.png`
- `audit-after/ar-fullpage-scroll-390x844.png`

---

## Validation results

| Check | Result |
| ----- | ------ |
| `npm run type-check` | Pass |
| `npm run lint` | Pass (1 pre-existing warning in snapshot script) |
| `npm run format:check` | Pre-existing warnings in unrelated evidence HTML + older docs; mobile source files formatted |
| `npm run build` | Pass — 48 static pages, SSG unchanged |
| Desktop unchanged | Yes — all rules scoped to `max-width: 1023px` / `767px` |
| 320px overflow | No horizontal overflow in audit captures |
| One canvas | World Core only |
| Preview scroll-jump | No changes to preview height logic |
| Nucleus / ring neon | Untouched |

---

## Remaining risks

1. **Intelligence diagram** on very small phones remains information-dense; full accordion layer switcher deferred (vertical stack is active).
2. **Mobile nav** does not yet include in-page section anchors (noted in audit as future enhancement).
3. **Chapter marker + WorldChapterHeader** duplicate is suppressed via `.journey-chapter-eyebrow` hide rule — verify if custom eyebrow markup is added elsewhere.
4. **format:check** fails on pre-existing evidence HTML from prior World Core tasks (not introduced by this refinement).

---

## Items requiring Alex approval

1. Gymura mobile order: **CTA before preview** (recommended hierarchy) — confirm preferred order if preview should remain above CTA.
2. Contact chapter marker uses **resolution label** (“Let’s build”) rather than “Contact” — confirm label choice.
3. Intelligence: accept **vertical diagram stack** vs. future accordion layer switcher.
4. Review before/after composites in `docs/evidence/mobile-ux-refinement/composites/`.

---

## Rejection gates

| Gate | Status |
| ---- | ------ |
| Sections have distinct boundaries | Addressed |
| World Core does not cover content | Addressed |
| Tech Stack not a pill wall | Addressed (6 + expand) |
| CTA hierarchy clear | Addressed |
| Arabic not mechanically mirrored | Addressed |
| 320px overflow | Clear in captures |
| Desktop unchanged | Confirmed |
| Mobile not heavier | No new canvas/deps |

---

*End of mobile UX refinement. Desktop redesign and new visual concepts out of scope.*
