# Mobile Content Compression Report

**Date:** 2026-07-13  
**Scope:** Homepage mobile only (`max-width: 1023px`)  
**Desktop:** Unchanged

---

## Executive summary

Mobile homepage scroll length was reduced by **~38%** (EN/AR at 390×844) through deliberate content prioritization—not typography shrinking or content deletion. Secondary copy, process rails, full tech stacks, architecture diagrams, and live preview iframes move behind accessible disclosures or mobile-only teasers. Desktop layout and full content remain intact.

---

## Before / after document height

| Locale | Before (px) | After (px) | Reduction |
| ------ | ----------- | ---------- | --------- |
| EN 390×844 | 16,365 | 10,175 | **37.8%** |
| AR 390×844 | 15,601 | 9,693 | **37.9%** |

**Source:** `docs/evidence/mobile-content-compression/height-comparison.json`  
**Before baseline:** `docs/evidence/mobile-ux-refinement/audit-after/` full-page captures (post spacing refinement, pre content compression).

Target was 25–35%; achieved **~38%** while preserving all content in repository and behind disclosures.

---

## Content moved behind disclosure

| Section | Collapsed (initial) | Behind disclosure |
| ------- | ------------------- | ----------------- |
| **Method** | Opener + 4 compact steps | Narrative, full rail, principles, Builder Map |
| **Gymura** | Statement, meta, 4 tech, CTA, 3 process steps, preview teaser | Extended copy, bridge, full brand-evolution rail |
| **Restaurant** | Statement, 4 tech, 3 workflow steps, CTA, preview teaser | Bridge, problem, full 5-stage rail, capabilities |
| **Intelligence** | Statement, 3 core layers, 4 tech, primary CTA | Full description, architecture diagram, automation CTA |
| **Cybersecurity** | Statement, 4 tech, 4-stage path, ALEX Linux, legal | Bridge, intro paragraphs, principles |
| **Future** | Title + compact intro + direction labels | Full intro + FuturePathRail |
| **Manifesto** | Primary quote | Supporting paragraph |
| **Hero social** | 4 pills | 5th link via “More links” |

---

## Copy summaries created

New keys in `homeV2.mobile` (EN + AR):

- `gymura.statement`
- `systems.statement`
- `intelligence.statement`
- `security.statement`
- `future.intro`
- `contact.intro`
- Disclosure labels: `moreDetails`, `viewProcess`, `showFullStack`, `openLivePreview`, `showArchitecture`, `showMoreSocial`

Meaning preserved; no invented claims. Arabic authored concisely (not mechanical truncation).

---

## Tech Stack reductions

- Homepage mobile initial count: **4** (was 6)
- Toggle label: **Show all technologies** / **عرض جميع التقنيات**
- CSS collapse via `data-mobile-initial="4"` (`nth-child(n+5)` hidden)
- Case-study pages unchanged (full stack)

---

## Process simplifications

- **`MobileProcessSteps`**: vertical numbered summary (number, title, one line)
- Gymura: 3 of 4 brand-evolution steps visible initially
- Restaurant: 3 of 5 workflow stages visible initially
- Security: compact 4-stage learning path (full descriptions, no horizontal rail)
- Method: 4 steps compact; full horizontal rail in disclosure

---

## Preview changes

- **`MobilePreviewTeaser`**: poster + “Open live preview” button
- Iframe loads **only after** user action (no eager iframe on mobile)
- Gymura + Restaurant use teaser on mobile; desktop full preview unchanged
- `html.mobile-preview-expanded` reduces World Core prominence during preview

---

## Accessibility

- **`MobileDisclosure`**: `button` + `aria-expanded` + `aria-controls`
- Collapsed panels use `hidden` (no focusable children)
- `prefers-reduced-motion`: disclosure animation disabled
- Legal/security note remains visible (not collapsed)
- Semantic headings/order preserved

---

## RTL behavior

- Disclosure triggers full-width, centered text
- Process step numbers `dir="ltr"`
- Tech Stack list `dir="rtl"` on Arabic
- Mobile summaries in natural Arabic

---

## Desktop preservation

- `.mobile-compress-hide` / `.mobile-compress-only` / `.lg:hidden` pattern
- No desktop reorder, collapse, or preview changes
- Tech Stack `expandable` toggle hidden ≥1024px
- All compression CSS scoped to `max-width: 1023px`

---

## Performance impact

- **Fewer eager iframes** on mobile (preview on demand)
- No new animation libraries
- Small client components: `MobileDisclosure`, `MobilePreviewTeaser`, `HeroSocialLinks`
- World Core lower opacity + hidden during disclosure/preview
- SSG route count unchanged (48 pages)

---

## Files created

| File | Purpose |
| ---- | ------- |
| `src/components/mobile/MobileDisclosure.tsx` | Shared accessible disclosure |
| `src/components/mobile/mobile-disclosure.css` | Disclosure styles |
| `src/components/mobile/MobileProcessSteps.tsx` | Compact vertical steps |
| `src/components/mobile/MobilePreviewTeaser.tsx` | Lazy preview expand |
| `src/components/mobile/mobile-preview-teaser.css` | Teaser styles |
| `src/app/mobile-content.css` | Compression utilities + World Core rules |
| `scripts/mobile-content-compression-evidence.mjs` | Evidence capture |
| `docs/evidence/mobile-content-compression/` | Screenshots + height JSON |

---

## Files modified

| File | Change |
| ---- | ------ |
| `src/app/globals.css` | Import `mobile-content.css` |
| `src/content/translations/types.ts` | `homeV2.mobile` types |
| `src/content/translations/en.ts` | Mobile copy + disclosure labels |
| `src/content/translations/ar.ts` | Arabic mobile copy |
| `src/components/projects/ProjectTechStack.tsx` | Default 4 items, custom labels |
| `src/components/projects/project-tech-stack.css` | `data-mobile-initial="3"` rule |
| `src/components/v2/hero/HeroSocialLinks.tsx` | 4 pills + expand (client) |
| `src/components/v2/WorldBrandsSection.tsx` | Mobile compression + teaser |
| `src/components/v2/WorldSystemsSection.tsx` | Mobile compression + teaser |
| `src/components/v2/WorldSecuritySection.tsx` | Statement + compact path |
| `src/components/v2/IntelligenceArchitecture.tsx` | 3 layers + disclosure diagram |
| `src/components/v2/WorldIntelligenceSection.tsx` | Hide bridge on mobile |
| `src/components/v2/MethodSection.tsx` | Compact steps + disclosure |
| `src/components/v2/FutureDirectionSection.tsx` | Compact future list |
| `src/components/v2/ContactV2Section.tsx` | Shorter mobile intro |
| `src/components/v2/ManifestoV2Section.tsx` | Supporting in disclosure |
| `src/components/v2/SystemsTexasFundsBranch.tsx` | 4 tech pills |

---

## Evidence paths

| Path | Contents |
| ---- | -------- |
| `docs/evidence/mobile-content-compression/before/` | EN/AR full-page (from prior audit-after) |
| `docs/evidence/mobile-content-compression/after/` | EN/AR full-page + section collapsed/expanded |
| `docs/evidence/mobile-content-compression/height-comparison.json` | Height metrics |

---

## Validation

| Check | Result |
| ----- | ------ |
| `npm run type-check` | Pass |
| `npm run lint` | Pass (1 pre-existing warning) |
| `npm run build` | Pass — 48 SSG pages |
| Desktop unchanged | Yes — compression classes hidden ≥1024px |
| 25%+ height reduction | **37.8%** EN / **37.9%** AR |
| Legal note visible | Yes (security) |
| Preview scroll-jump | Unchanged (iframe shell only loads on expand) |
| One World Core canvas | Yes |

---

## Remaining risks

1. **DOM duplication** for desktop/mobile blocks increases HTML size (hidden via CSS); acceptable for SSG clarity.
2. **Paragraph count in DOM** remains high (collapsed content still in document); visible viewport density is what improved.
3. **Intelligence diagram** in disclosure is still dense when expanded—acceptable as opt-in.
4. **Hero social expand** is client-only; 4 pills visible without JS.

---

*End of mobile content compression. Desktop redesign out of scope.*
