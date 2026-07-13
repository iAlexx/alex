# Mobile UX Refinement Audit

**Date:** 2026-07-13  
**Routes audited:** `/en`, `/ar`  
**Viewports:** 430×932, 390×844, 375×667, 360×800, 320×568  
**Evidence (before):** `docs/evidence/mobile-ux-refinement/audit-before/`  
**Method:** Production build review + Playwright section captures + codebase structure audit

---

## Executive findings

Mobile currently reads as a **vertically stacked desktop layout** rather than an intentionally authored mobile experience. Sections lack consistent chapter separation, content density is high in world/project sections, the World Core competes with previews and rails, and Tech Stack pills create visual walls. Arabic RTL is structurally correct but shares the same density problems with additional line-height pressure.

**Desktop is approved and must not change.** All refinements target `max-width: 1023px` / `max-width: 767px` unless fixing shared overflow bugs.

---

## Global issues (all sections)

| Issue | Severity | Notes |
| ----- | -------- | ----- |
| Inconsistent breakpoints | High | 639 / 767 / 768 / 1023 / 1024 used across motion, World Core, rails, layout |
| Section boundary ambiguity | High | `py-14` rhythm insufficient; rails + atmosphere + spine compete with titles |
| Spine left gutter narrows content | Medium | `padding-inline-start: calc(var(--spine-inset) + 0.75rem)` below 1024px |
| World Core bottom accent | High | Fixed 180–260px square at 0.38 opacity overlaps previews/CTAs |
| Tech Stack density | High | 8 pills at `maxItems={8}` on homepage sections |
| Typography scale fragmentation | Medium | Mix of Tailwind, clamp wordmarks, rail labels, metadata |
| Global Traveler on mobile | Low | Reduced but still fixed; can overlap dense rails |
| Mobile nav lacks section jumps | Medium | Only Projects / Future / Security / Contact |

---

## Section audits

### 1. Header / mobile navigation

| | |
| - | - |
| **Hierarchy** | Logo + locale + hamburger — clear |
| **Density** | Acceptable |
| **Problems** | No in-page section list; scroll lock/focus trap need verification on change |
| **World Core** | No direct conflict |
| **EN** | Fine |
| **AR** | Locale switch + RTL header OK |
| **Keep** | Sticky header, 44px targets |
| **Simplify** | — |
| **Progressive** | Optional section anchor list in menu (future) |

### 2. Hero

| | |
| - | - |
| **Hierarchy** | Eyebrow → H1 → role → statement → paragraph → ALEX CORE → CTAs → socials → visual |
| **Density** | High — first viewport is copy-heavy before portrait |
| **Problems** | Visual `min-height: 65svh` pushes portrait far down; rings can overlap copy; social pills wrap to 2 rows tightly |
| **Overflow** | None at 320px |
| **Line length** | OK with max-width on copy |
| **World Core** | Static fallback bottom-end; rings in hero composition OK |
| **Keep** | Approved direction, portrait unmirror, copy-first on mobile |
| **Simplify** | Reduce visual block height; tighten vertical rhythm |
| **Progressive** | — |

### 3. Method

| | |
| - | - |
| **Hierarchy** | Chapter → title → Builder Map list (3D hidden on mobile) |
| **Density** | Medium — horizontal process rail stacks to vertical |
| **Problems** | 4-step rail + spine + builder list feels long; section end unclear |
| **Keep** | Builder Map simplified mobile list |
| **Simplify** | Stronger section top marker; increase block spacing |

### 4. Builder Map

| | |
| - | - |
| **Hierarchy** | Nodes in vertical list — OK |
| **Density** | Medium |
| **Problems** | Less rich than desktop (intentional) |
| **Keep** | No 3D on mobile |

### 5. Gymura (Brands)

| | |
| - | - |
| **Hierarchy** | Wordmark dominates → subtitle → bridge → description → status → **8 tech pills** → 4-stage rail → CTA → preview |
| **Density** | **Critical** — too many equal-weight blocks before preview |
| **Problems** | Editorial wordmark large; tech wall; process rail before CTA/preview; World Core near preview; CTA buried |
| **Tech Stack** | 8 items — 3+ rows |
| **Preview** | Stable height OK; controls need thumb space |
| **Keep** | Live preview, case study CTA, brand evolution story |
| **Simplify** | Mobile order: title → statement → status → compact stack (6) → CTA → preview → stages |
| **Progressive** | Tech stack “Show more”; stages as vertical timeline |

### 6. Restaurant (Systems)

| | |
| - | - |
| **Hierarchy** | Title → problem → tech → workflow → proof/preview |
| **Density** | High — workflow + proof band |
| **Problems** | Workflow stages need clearer vertical steps; order token animation disabled (good) |
| **Keep** | Workflow as main story |
| **Simplify** | Vertical step cards; compact tech stack |

### 7. Texas Funds

| | |
| - | - |
| **Hierarchy** | Branch block — concise |
| **Density** | Medium |
| **Problems** | Micro-flow `nowrap` may clip at 320px |
| **Simplify** | Vertical/stacked flow nodes |

### 8. Intelligence

| | |
| - | - |
| **Hierarchy** | Header → architecture diagram |
| **Density** | **High** — diagram complex on phone |
| **Problems** | Many layers visible; connector lines; small labels |
| **Keep** | World color, architecture concept |
| **Simplify** | One active layer; compact switcher |
| **Progressive** | Layer accordion / tabs on mobile |

### 9. Cybersecurity

| | |
| - | - |
| **Hierarchy** | Intro → tech (8) → learning path → principles → ALEX Linux branch |
| **Density** | **High** |
| **Problems** | Learning path vertical OK but tight; tech pills above path; World Core behind text; legal block needs separation |
| **Keep** | Permanent crimson, vertical discipline rail, ALEX Linux as research |
| **Simplify** | Tech 6 + more; stage spacing; legal callout styling |

### 10. Future

| | |
| - | - |
| **Hierarchy** | Open-vertical rail — readable |
| **Density** | Medium |
| **Keep** | Calm tone |

### 11. Manifesto

| | |
| - | - |
| **Hierarchy** | Full-bleed image + overlay |
| **Density** | Low content, high scroll height (`min-h 60vh`) |
| **Simplify** | Slightly reduce mobile image band height |

### 12. Contact / Footer

| | |
| - | - |
| **Hierarchy** | Resolution stem + social — clear |
| **Density** | OK |
| **Keep** | Contact resolution rail |

---

## World Core mobile interference

| Viewport | Behavior | Problem |
| -------- | -------- | ------- |
| ≥768 | WebGL + inline-end panel | N/A (desktop approved) |
| ≤767 | Static fallback, bottom-end, 0.38 opacity | Overlaps Gymura/Restaurant preview zones |
| ≤767 | Same transform presets as desktop | No mobile-specific scene offset |

**Required:** Smaller footprint, lower opacity in dense worlds, safe padding on preview sections, no pointer, never cover headings/CTAs/tech stack.

---

## Tech Stack mobile

- Homepage sections use `compact` + `maxItems={8}` → often 3–4 rows
- `white-space: nowrap` on labels — OK with wrap but crowded
- Arabic `dir=rtl` on list — correct

**Required:** Show 6 primary, expand for rest on homepage; maintain full list on case studies.

---

## Arabic-specific

| Issue | Detail |
| ----- | ------ |
| Line height | Needs ≥1.75 on body in AR |
| Hero | Copy-first correct; rings behind text |
| Tech labels | LTR isolation correct |
| Spine | Left spine in RTL may feel visually asymmetric — acceptable with journey system |
| Wordmarks | Gymura Latin wordmark in AR page — intentional brand asset |

---

## English-specific

| Issue | Detail |
| ----- | ------ |
| Hero H1 | 4–5 lines at 390px — acceptable |
| Metadata | Role line dense with separators |

---

## Implementation priority

1. **P0** — Mobile spacing tokens + section chapter separation  
2. **P0** — World Core content-safe mobile behavior  
3. **P0** — Tech Stack progressive disclosure (homepage)  
4. **P1** — Gymura mobile content order  
5. **P1** — Hero visual height reduction  
6. **P1** — Cybersecurity + Restaurant spacing  
7. **P2** — Intelligence layer collapse  
8. **P2** — Texas flow nowrap fix  

---

## Rejection gates (pre-implementation baseline)

| Gate | Current state |
| ---- | ------------- |
| Sections run together | **Fail** |
| Section boundaries clear | **Fail** |
| World Core covers content | **Partial fail** (Gymura/Security) |
| Tech Stack wall | **Fail** |
| CTA hierarchy | **Partial fail** (Gymura) |
| 320px overflow | **Pass** |
| Arabic mirrored | **Pass** |

---

## Evidence index

| Pattern | Path |
| ------- | ---- |
| EN full page 390×844 | `audit-before/en-fullpage-390x844.png` |
| AR full page 390×844 | `audit-before/ar-fullpage-390x844.png` |
| Per-section | `audit-before/{en\|ar}-{section}-{viewport}.png` |
