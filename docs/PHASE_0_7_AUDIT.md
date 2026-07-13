# Phase 0–7 Portfolio Audit

**Date:** July 11, 2026  
**Scope:** Phases 0 through 7 (no Phase 8, no code changes)  
**Validation:** `lint`, `type-check`, `format:check`, `build` — all passed (23 static pages)  
**Visual review:** Code-based inspection + limited runtime verification; full browser QA still recommended at listed breakpoints.

---

## A. Executive Summary

### Overall quality

The portfolio is a **technically sound, bilingual, statically generated Next.js 16 site** with honest project positioning, typed content architecture, and competent GSAP motion on the two flagship projects. It is **not yet a premium finished product**. The engineering foundation is ahead of the visual and content finish line.

What works: strict TypeScript, clean locale routing, centralized profile config, live previews for Gymura and Restaurant, cinematic flagship sections, and case study copy that is evidence-based rather than hype-driven.

What holds it back: a **long, repetitive homepage**, a **static Hero that is visually weaker than Gymura/Restaurant**, **placeholder galleries on every case study**, **English-only registry fields leaking into Arabic case studies**, **missing roadmap pages** (About, Lab, CV, dedicated Contact), and **motion patterns that are increasingly duplicated without a shared abstraction**.

### Strongest parts

1. **Typed bilingual content architecture** — dictionaries, project registry, profile singleton, locale routing.
2. **Flagship project hierarchy** — Gymura first, Restaurant second, live status and URLs preserved correctly.
3. **LiveWebsitePreview** — thoughtful click-to-load, viewport modes, LTR isolation, honest unavailable states, documented iframe limits.
4. **GSAP discipline** — scoped `useGSAP`, `matchMedia`, `immediateRender: false` on most reveals, reduced-motion branches, no global selectors.
5. **Honest product positioning** — no fake metrics, dates, testimonials, or email placeholder; Texas Funds and Restaurant live claims are supported by copy structure.

### Weakest parts

1. **Homepage length and visual sameness** — too many `rounded-2xl border border-line bg-ink/60` sections with `py-20 lg:py-28`; scroll fatigue before Contact.
2. **Hero vs flagship gap** — Hero is static, framed, and visually quiet; Gymura and Restaurant feel more “finished” than the introduction.
3. **Case study completeness** — `ProjectGallery` is a placeholder on all eight projects; flagship case studies still feel unfinished despite strong text.
4. **Arabic case study facts/capabilities** — role, technologies, and capability chips render **English registry strings** on `/ar` project pages.
5. **Restaurant order-card motion** — `getBoundingClientRect()` positioning during scrub is brittle across resize, font load, and breakpoints.
6. **Architecture drift from roadmap** — many planned pages and Phase 11 items (SEO, security headers, CV, contact system) do not exist yet.

### Is the portfolio ready for Phase 8 (global 3D)?

**No.** Phase 8 should be **delayed**. The site needs repair on localization leaks, homepage rhythm, Hero polish, case study media, motion hardening, and accessibility gaps before adding WebGL weight. A global 3D layer would amplify existing layout, performance, and inconsistency problems rather than solve them.

---

## B. Scorecard

| Area                  | Score | Brief rationale                                                                                                                             |
| --------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Architecture          | 7/10  | Solid App Router + typed content; missing pages, dead code, duplicated motion components, registry/dictionary overlap.                      |
| Code quality          | 7/10  | Strict TS, consistent patterns, Prettier/ESLint clean; near-duplicate case study motion files, unused motion primitives.                    |
| Content               | 6/10  | Strong flagship narratives; repetitive mid-page sections, generic differentiation/skills density, placeholder media everywhere.             |
| English copy          | 7/10  | Professional, evidence-based; some repetition between homepage and case studies.                                                            |
| Arabic copy           | 6/10  | Mostly complete homepage/case study prose; signature phrasing risks arrogance; registry English leaks on AR case studies.                   |
| RTL                   | 6/10  | Good `dir`, `bdi`, locale typography utilities; workflow LTR isolation correct; facts/capabilities not localized.                           |
| Homepage UX           | 5/10  | Clear story order but too long, visually uniform, weak Hero-to-flagship transition, redundant CTA patterns.                                 |
| Mobile UX             | 6/10  | Responsive grids generally work; very long scroll, dense Restaurant section, preview toolbar wraps heavily.                                 |
| Gymura experience     | 7/10  | Cinematic pin + compact preview work; lacks real brand imagery; duplicate visit CTAs; ecosystem panel still static.                         |
| Restaurant experience | 6/10  | Strong systems story and disclaimer; section too dense; brittle order-card math; desktop `gsap.set` hides content early.                    |
| Case studies          | 6/10  | Text depth good on flagship projects; every gallery is placeholder; capabilities duplicate module lists.                                    |
| Accessibility         | 6/10  | Skip link, landmarks, focus styles; mobile menu lacks trap/escape; external links lack “opens in new tab” cues; decorative workflow panels. |
| Performance           | 6/10  | SSG, minimal deps; Hero PNG, multiple client islands on homepage, GSAP + ScrollTrigger on long page, iframe cost on demand.                 |
| Security              | 5/10  | Sensible external link policies; no CSP/security headers; iframe embedding depends on third-party CSP (documented).                         |
| Maintainability       | 6/10  | Typed dictionaries scale well; duplicated motion/copy sources increase drift risk.                                                          |
| Visual consistency    | 5/10  | Coherent dark palette; over-reliance on one card idiom; Hero/Manifesto not aligned with flagship polish level.                              |
| Motion quality        | 6/10  | Competent GSAP usage; repetitive `opacity + y` reveals; two pin sections on one homepage; Restaurant positioning fragile.                   |

---

## C. Issue List

### Critical

| ID      | Severity | Category           | Route                  | File(s)                                                                    | Problem                                                                                                                       | Why it matters                                                                                                  | Recommended fix                                                                                                                       | Before Phase 8? |
| ------- | -------- | ------------------ | ---------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| AUD-001 | Critical | RTL / Localization | `/ar/projects/*`       | `ProjectFacts.tsx`, `ProjectCapabilities.tsx`, `src/content/projects/*.ts` | Role, technologies, and capability chips render **English registry strings** on Arabic case study pages.                      | Breaks “complete Arabic version” claim; looks unfinished and unprofessional to Arabic readers.                  | Move role, technologies, capabilities into typed bilingual dictionary entries (like `projectTypes`); render locale-aware values.      | **Yes**         |
| AUD-002 | Critical | UX / Motion        | `/en`, `/ar` (desktop) | `RestaurantCinematicSection.tsx`                                           | `gsap.set()` hides connectors, stage nodes (0.35 opacity), modules, preview shell at mount on desktop before scroll progress. | Content appears faded/hidden until pin scrub runs; violates “readable without motion” and risks CLS perception. | Remove pre-hide `set()`; use timeline `from()` only with `immediateRender: false`, or show final state until ScrollTrigger activates. | **Yes**         |

### High

| ID      | Severity | Category         | Route                          | File(s)                                   | Problem                                                                                                                                                     | Why it matters                                                                                                                                 | Recommended fix                                                                                                                    | Before Phase 8? |
| ------- | -------- | ---------------- | ------------------------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| AUD-003 | High     | Architecture     | Site-wide                      | `src/app/[locale]/`                       | Roadmap pages **About, Lab, CV, Contact (dedicated), Cybersecurity page** do not exist. Nav dictionary includes `about`, `cv`; header uses hash links only. | Site architecture incomplete vs roadmap; visitors expect real pages, not anchor substitutes.                                                   | Add minimal pages or remove unused nav labels until pages exist; align header/footer with real routes.                             | **Yes**         |
| AUD-004 | High     | UX               | `/en`, `/ar`                   | `page.tsx`, most `sections/*`             | Homepage has **12 sections**, most with identical card chrome and `py-20 lg:py-28`.                                                                         | Scroll fatigue; flagship work competes with mid-page repetition; feels longer than necessary.                                                  | Shorten or merge sections (Skills + Process, Differentiation + Builder); reduce vertical padding; vary layout templates.           | **Yes**         |
| AUD-005 | High     | Visual / Product | `/en`, `/ar`                   | `HeroSection.tsx`                         | Hero is static, border-framed, smaller visual weight than Gymura/Restaurant cinematic sections.                                                             | First impression underwhelms relative to later sections; roadmap promised cinematic environmental portrait.                                    | Execute dedicated Hero polish phase: larger crop, reduced frame, webp variants, optional lightweight motion (not 3D).              | **Yes**         |
| AUD-006 | High     | Content          | `/[locale]/projects/*`         | `ProjectGallery.tsx`                      | **Every** case study ends with “Visual showcase in preparation” placeholder.                                                                                | Flagship projects look unfinished; weakens trust after strong copy and live previews.                                                          | Add real media for Gymura/Restaurant first; hide gallery section when no assets exist instead of showing placeholder on all pages. | **Yes**         |
| AUD-007 | High     | Motion           | `/en`, `/ar` (desktop ≥1024px) | `RestaurantCinematicSection.tsx`          | Order card position uses `getBoundingClientRect()` + hardcoded `top: -28` during scrub.                                                                     | Misalignment likely at 1024px, 1280px, 1440px, on resize, font load, and locale switch; motion decorates rather than explains when misaligned. | Replace with CSS grid slot indexing or precomputed percentage keyframes; refresh on resize; drop hardcoded offset.                 | **Yes**         |
| AUD-008 | High     | Performance      | `/en`, `/ar`                   | `HeroSection.tsx`, `ManifestoSection.tsx` | Workstation image imported as **PNG** (`alex-workstation-original.png`), used twice (Hero + Manifesto).                                                     | LCP and bandwidth cost; roadmap specifies webp/avif optimized variants.                                                                        | Generate and wire `alex-workstation-desktop.webp`, mobile crop, `priority` only on Hero.                                           | **Yes**         |
| AUD-009 | High     | Accessibility    | All routes                     | `MobileNavigation.tsx`                    | Mobile menu has no focus trap, Escape to close, or `aria-modal`; background scroll not locked.                                                              | Keyboard and screen reader users can tab behind open menu; WCAG dialog pattern gap.                                                            | Add focus trap, Escape handler, `aria-modal="true"`, body scroll lock.                                                             | **Yes**         |
| AUD-010 | High     | Security         | Site-wide                      | `next.config.ts`                          | No security headers (CSP, `X-Frame-Options`, `Referrer-Policy`, etc.).                                                                                      | Production readiness gap; roadmap Phase 11 expectation.                                                                                        | Add `headers()` in Next config with baseline CSP and security headers.                                                             | **Yes**         |

### Medium

| ID      | Severity | Category            | Route                                    | File(s)                                                                                                      | Problem                                                                                                                          | Why it matters                                                                                                     | Recommended fix                                                                                                                             | Before Phase 8? |
| ------- | -------- | ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| AUD-011 | Medium   | Architecture        | `src/components/motion/`                 | `GymuraCaseStudyMotion.tsx`, `RestaurantCaseStudyMotion.tsx`                                                 | Near-identical case study motion wrappers (~200 lines duplicated).                                                               | Drift risk; harder to maintain Phase 8 integration.                                                                | Extract `ProjectCaseStudyMotion` with `previewShell` selector prop.                                                                         | **Yes**         |
| AUD-012 | Medium   | Architecture        | `src/components/motion/`                 | `ScrollReveal.tsx`, `SplitTextReveal.tsx`, `MotionProvider.tsx`, `useReducedMotion.ts`                       | **Unused** motion utilities (no imports elsewhere).                                                                              | Dead code noise; suggests incomplete Phase 6 plan.                                                                 | Wire into Builder/Differentiation or delete until needed.                                                                                   | Recommended     |
| AUD-013 | Medium   | Content duplication | `src/content/projects/*.ts`              | Registry `shortDescription`, `longDescription`, `capabilities` overlap dictionary case study copy (English). | Two sources of truth; registry fields largely unused in UI except capabilities/role/tech.                                        | Slim registry to structural data; keep prose in dictionaries only.                                                 | Recommended                                                                                                                                 |
| AUD-014 | Medium   | UX                  | `/en`, `/ar`                             | `GymuraCinematicSection.tsx`, `LiveWebsitePreview.tsx`                                                       | **Duplicate visit CTAs**: header actions, compact open link, case study hero CTA, preview toolbar link.                          | Button hierarchy diluted; same action repeated 3–4 times per flagship.                                             | Keep one primary + one persistent preview escape hatch; demote others to text links.                                                        | Recommended     |
| AUD-015 | Medium   | UX                  | `/en`, `/ar`                             | `page.tsx`                                                                                                   | Homepage order inserts **Live Products** (Texas Funds) between Building and Cybersecurity — not in roadmap Section 7 order.      | Acceptable product decision but increases length; Texas Funds gets less prominence than roadmap priority suggests. | Consider merging Texas Funds into Building/Live strip or moving higher.                                                                     | Optional        |
| AUD-016 | Medium   | Motion              | `/en`, `/ar`                             | `GymuraCinematicSection.tsx`, `RestaurantCinematicSection.tsx`                                               | Two desktop **pin** sections on one homepage (420px + 400px).                                                                    | Cumulative pinned scroll can feel heavy; sticky header + pin interaction needs careful QA.                         | Shorten pins further or pin only workflow sub-panel on Restaurant.                                                                          | Recommended     |
| AUD-017 | Medium   | Motion              | `/en`, `/ar`                             | `HomepageSectionMotion.tsx`                                                                                  | Six sections use identical `opacity + y` reveal; Builder Narrative and Differentiation do not (inconsistent).                    | Motion feels applied in batches, not art-directed.                                                                 | Wire Builder/Differentiation per `docs/homepage-motion-direction.md` or leave all static intentionally.                                     | Optional        |
| AUD-018 | Medium   | Documentation       | `docs/homepage-motion-direction.md`      | Restaurant section doc says “no pinning”                                                                     | Phase 7 implemented desktop pin (400px).                                                                                         | Doc/code drift misleads future work.                                                                               | Update doc to match implementation or remove pin per doc.                                                                                   | Recommended     |
| AUD-019 | Medium   | Live Preview        | `/[locale]/projects/*`                   | `LiveWebsitePreview.tsx`                                                                                     | `onLoad` treated as success; timeout fallback exists but no screenshot fallbacks configured for Gymura/Restaurant.               | Embed may be blocked by target site CSP; visitor sees unavailable state with no visual fallback.                   | Add sanctioned screenshot fallbacks or document that production portfolio domain must be allowlisted.                                       | Recommended     |
| AUD-020 | Medium   | SEO                 | Site-wide                                | Missing `sitemap.ts`, `robots.ts`, structured data                                                           | Roadmap Phase 11 items not implemented.                                                                                          | Discoverability and shareability limited at launch.                                                                | Add sitemap, robots, OG per route, Person/WebSite schema.                                                                                   | Before launch   |
| AUD-021 | Medium   | Navigation          | `/en`, `/ar`                             | `HeroSection.tsx`, `GymuraCinematicSection.tsx`                                                              | “Explore My Work” links to `#work` (Gymura only), not Restaurant or projects index.                                              | Minor IA confusion; Restaurant is second flagship but not in “work” anchor.                                        | Use `#work` as flagship block encompassing both, or link to `/projects`.                                                                    | Optional        |
| AUD-022 | Medium   | Content             | `/[locale]/projects/restaurant-platform` | Case study sections vs homepage                                                                              | System Modules section bullets duplicate homepage module chips (English in registry capabilities too).                           | Repetitive reading experience.                                                                                     | Case study should go deeper; homepage stays summary; deduplicate bullets.                                                                   | Recommended     |
| AUD-023 | Medium   | Arabic copy         | `/ar`                                    | `ar.ts` hero.signature                                                                                       | **"أبني إمبراطوريتي الخاصة، فكرةً تلو الأخرى"** — “empire” can read grandiose in Arabic professional contexts.                   | Tone risk for recruiters/clients in MENA; may sound self-mythologizing rather than ambitious.                      | Consider: **"أبني منتجاتي وعلاماتي، فكرةً تلو الأخرى"** or **"أبني ما أؤمن به، مشروعًا بعد مشروع"**.                                        | Recommended     |
| AUD-024 | Medium   | Arabic copy         | `/ar`                                    | `ar.ts` hero.headline                                                                                        | **"باني منتجات رقمية"** is understandable but less standard than **"مهندس منتجات"** / **"باني منتجات"** in tech hiring contexts. | Slightly non-standard phrasing for professional positioning.                                                       | User test with native readers; consider **"باني منتجات · مطوّر متكامل · …"** (drop "رقمية" or use "منتجات رقمية" as noun phrase elsewhere). | Optional        |
| AUD-025 | Medium   | Accessibility       | `/en`, `/ar`                             | `RestaurantWorkflow.tsx`                                                                                     | Ops panels are `aria-hidden` decorative skeletons; order card is `aria-hidden` while stages carry meaning.                       | Acceptable if stages are sufficient; order card label duplicated only visually in stages.                          | Keep stages as source of truth; add visible “example order” label not hidden if kept.                                                       | Optional        |
| AUD-026 | Medium   | Responsive          | 320–430px                                | `LiveWebsitePreview.tsx`                                                                                     | Preview toolbar uses `w-full flex-wrap` — on narrow screens chrome dominates iframe.                                             | Compact variant still feels toolbar-heavy on small phones.                                                         | Collapse toolbar to menu on `<375px` or stack with shorter labels in AR.                                                                    | Recommended     |

### Low / Polish

| ID      | Severity | Category      | Route                                 | File(s)                                                                                      | Problem                                                                          | Why it matters                                                             | Recommended fix                                                                    | Before Phase 8? |
| ------- | -------- | ------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------- |
| AUD-027 | Polish   | Visual        | `/en`, `/ar`                          | `RestaurantWorkflow.tsx`                                                                     | Horizontal 8-stage workflow cramped at exactly 1024px; labels wrap aggressively. | Readability vs “systems diagram” clarity.                                  | Allow horizontal scroll in LTR diagram container or reduce stage count on lg-only. | Optional        |
| AUD-028 | Polish   | Code comments | `ProjectHero.tsx`                     | Comment says motion is “Gymura cinematic only”                                               | Restaurant now uses same props.                                                  | Misleading for maintainers.                                                | Update comment.                                                                    | Optional        |
| AUD-029 | Polish   | Content       | `restaurant` homepage                 | `en.ts` / `ar.ts`                                                                            | `orderCardLabel` uses **Order #1042** — fictional order ID.                      | Not a metric claim, but could be read as fake demo data.                   | Use neutral label: “Active order” / “طلب نشط”.                                     | Optional        |
| AUD-030 | Polish   | Visual        | `ManifestoSection.tsx`                | Full-bleed background image without `next/image` priority/fill optimization on all viewports | Secondary LCP contributor on long scroll.                                        | Lazy load manifesto image; use separate mobile crop.                       | Optional                                                                           |
| AUD-031 | Polish   | UX            | `SiteHeader.tsx`                      | Sticky header over pinned sections                                                           | May feel cramped during Gymura/Restaurant pin.                                   | Verify z-index and scroll padding during pin; adjust `scroll-padding-top`. | Optional                                                                           |
| AUD-032 | Polish   | i18n          | External links                        | Site-wide                                                                                    | External links lack visible `(opens in new tab)` supplementary text.             | Screen reader expectation.                                                 | Add `sr-only` new-tab hint or `aria-label` suffix.                                 | Recommended     |
| AUD-033 | Polish   | Registry      | `gymura.ts`, `restaurant-platform.ts` | Gallery paths reference placeholder webp files not surfaced in UI                            | Dead paths in registry.                                                          | Remove or use when gallery is implemented.                                 | Optional                                                                           |

---

## D. Roadmap Deviations

| Deviation                                                                                | Type        | Notes                                                                             |
| ---------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------- |
| **No About, Lab, CV, Contact, Cybersecurity standalone pages**                           | Risky       | Only homepage + projects index + case studies exist. Nav labels imply more.       |
| **Live Products section added (Texas Funds)**                                            | Improvement | Honest live product surfacing; adds homepage length.                              |
| **Restaurant label/status = Live** (roadmap once said “Active Development”)              | Improvement | Matches `alnkha.site` reality and user facts.                                     |
| **Phase 6/7 use GSAP only, no product gallery 3D, no apparel visuals**                   | Acceptable  | Correct per phased dependency rules; roadmap visual direction partially deferred. |
| **Phase 7 Restaurant desktop pin** vs `docs/homepage-motion-direction.md` (“no pinning”) | Risky       | Doc outdated; implementation chose short pin.                                     |
| **Homepage motion on 6 sections via `HomepageSectionMotion`**                            | Improvement | Matches Phase 7 guidance; Builder/Differentiation omitted.                        |
| **No MDX case studies**                                                                  | Acceptable  | Typed TS dictionaries work; MDX deferred.                                         |
| **No sitemap, robots, structured data, security headers, analytics**                     | Risky       | Phase 11 not started — expected at this stage.                                    |
| **No CV download, contact form, email system**                                           | Acceptable  | Phases 9–10 not started; email correctly `null`.                                  |
| **Gymura case study sections differ from roadmap’s 17-part list**                        | Acceptable  | Shorter honest structure; fewer brand-specific media sections.                    |
| **`projectType` removed from registry (Phase 5.1)**                                      | Improvement | Localized `projectTypes` in dictionaries.                                         |
| **Role/capabilities/technologies still English in registry**                             | Incorrect   | Phase 5.1 incomplete for facts sheet.                                             |

---

## E. Quick Wins

### Under 15 minutes

- Update `ProjectHero.tsx` outdated motion comment.
- Update `docs/homepage-motion-direction.md` Restaurant pin note.
- Add `sr-only` “opens in new tab” to external link pattern in `SiteFooter` / `ContactSection`.
- Change `orderCardLabel` to neutral “Active order” / “طلب نشط”.
- Delete or comment unused exports: `MotionProvider` (empty pass-through).

### Under 1 hour

- Hide `ProjectGallery` when no real media exists (instead of universal placeholder).
- Wire `HomepageSectionMotion` on `DifferentiationSection` and `BuilderNarrative` for consistency.
- Add `ScrollTrigger.refresh()` on Restaurant resize during desktop session (debounced).
- Remove duplicate “Visit” button from one Gymura surface (keep preview + hero primary).
- Add `next.config.ts` baseline security headers.

### Under half a day

- Localize `ProjectFacts` role + technologies and `ProjectCapabilities` via dictionary maps.
- Refactor `GymuraCaseStudyMotion` + `RestaurantCaseStudyMotion` into shared `ProjectCaseStudyMotion`.
- Fix Restaurant desktop `gsap.set` pre-hide pattern.
- Generate Hero webp assets and swap `next/image` sources.
- Add minimal `/[locale]/about` or remove About/CV from nav dictionary until ready.

---

## F. Recommended Repair Phases

### Phase 7.1 — Critical fixes (before any 3D)

- AUD-001 Arabic case study facts/capabilities localization
- AUD-002 Restaurant desktop content pre-hide
- AUD-007 Order card positioning hardening
- AUD-009 Mobile menu accessibility
- AUD-010 Baseline security headers

### Phase 7.2 — Hero and visual polish

- AUD-005 Hero composition, crop, frame, webp, balance with text
- AUD-008 Image optimization (Hero + Manifesto)
- AUD-031 Sticky header + pin interaction QA
- Saved tasks: manifesto overlay redesign (still out of scope until planned)

### Phase 7.3 — Content and case study polish

- AUD-006 Real media or conditional gallery hiding
- AUD-004 Homepage length and template variety
- AUD-014 CTA hierarchy cleanup
- AUD-022 Restaurant/Gymura case study deduplication
- AUD-003 Missing pages or nav alignment

### Phase 7.4 — Performance and accessibility hardening

- AUD-016 Pin duration budget on homepage
- AUD-020 SEO foundation (sitemap, robots, OG, schema)
- AUD-026 Mobile preview toolbar compaction
- AUD-012 Dead code cleanup or intentional wiring
- Full responsive QA matrix (320–1440px)

### Phase 8 — Global 3D (only if justified after 7.1–7.4)

- Hero ambient depth, flagship transitions, manifesto atmosphere — **not** a site-wide always-on canvas by default.

---

## G. Phase 8 Recommendation

### Should Phase 8 start now?

**No. Delay.**

### Which issues must be fixed first?

1. Arabic case study English leaks (AUD-001)
2. Restaurant motion reliability and readability (AUD-002, AUD-007)
3. Hero visual parity with flagship sections (AUD-005, AUD-008)
4. Case study placeholder fatigue (AUD-006)
5. Homepage density (AUD-004)
6. Mobile menu a11y (AUD-009)

### Does the site actually need a global 3D layer?

**Not yet.** The site is not fully convincing in 2D + motion. Global 3D would increase bundle size, GPU demand, and art-direction surface before core UX issues are fixed.

### Where would 3D add real value?

- Hero environmental depth (subtle parallax field, not full scene)
- Gymura product presentation (floating apparel frames) **if** real assets exist
- Section transitions (Hero → Gymura, Manifesto atmosphere)
- Optional performance-mode off switch with static fallbacks

### Where would 3D make the experience worse?

- Long homepage with already heavy scroll + two pin timelines
- Mobile first paint before content clarity
- Restaurant **systems** diagram (clarity beats decoration)
- Case study reading pages (readability conflict)
- Low-end Android devices and reduced-motion users if fallback is weak

---

## H. Final Honest Opinion

### What feels premium today

- Dark cinematic palette and typography discipline
- Gymura and Restaurant homepage cinematic sections (desktop)
- LiveWebsitePreview interaction design and honesty about iframe limits
- Bilingual homepage copy structure and MixedText/`bdi` handling
- Evidence-based case study writing without fake metrics

### What still feels unfinished

- Hero and Manifesto compared to flagship sections
- Universal “Visual showcase in preparation” on every case study
- Repetitive card-grid middle homepage
- Arabic project facts sheet showing English chips
- Restaurant order-card animation when alignment drifts
- Missing top-level pages the roadmap promises

### What could impress a recruiter or client

- Live deployed products (Gymura, alnkha.site) with embedded previews
- Restaurant workflow thinking explained as one system
- Breadth positioning (product + full-stack + AI + security) backed by project diversity
- Clean codebase and static bilingual generation

### What could reduce trust

- Placeholder galleries after strong “live product” claims
- English capability chips on Arabic pages
- Over-long homepage implying padding over curation
- “Empire” signature tone in Arabic if audience is conservative corporate
- Preview embed failures without screenshot fallback on production

### What makes this portfolio different from generic portfolios

- Typed honest status model (no fake progress bars)
- Flagship-first storytelling with real URLs
- Systems-thinking Restaurant presentation vs brand-first Gymura
- Security and automation woven into identity, not bolted on
- GSAP used with reduced-motion and scoped architecture — not animation soup

---

## Detailed Audit Notes (by requested area)

### 1. Repository and Architecture

**Strengths:** Next.js 16 App Router, React 19, strict TS (`noUncheckedIndexedAccess`), Tailwind v4 tokens, `/[locale]` routing with `generateStaticParams`, profile singleton, dictionary-driven UI, minimal dependencies (only GSAP added).

**Weaknesses:**

- Only 3 route groups: home, projects index, project slug. No `about`, `lab`, `cv`, `contact`, `cybersecurity` routes.
- `src/content/projects/*.ts` English prose duplicates `caseStudies` in dictionaries.
- Motion layer has duplicate case study wrappers and unused primitives.
- `MotionProvider` is a no-op wrapper, never used in layout.
- No `middleware.ts` for locale detection (redirect `/` → `/en` in `next.config.ts` only).
- `components/three/` directory from roadmap does not exist (correct for Phase 7).

**Files needing improvement:** `ProjectFacts.tsx`, `ProjectCapabilities.tsx`, `GymuraCaseStudyMotion.tsx`, `RestaurantCaseStudyMotion.tsx`, `ScrollReveal.tsx`, `SplitTextReveal.tsx`, `next.config.ts`, project registry files.

### 2. Homepage Audit (top to bottom)

| Section            | Assessment                                                                              |
| ------------------ | --------------------------------------------------------------------------------------- |
| Header             | Clear; sticky; skip link present. Nav items partially fake (Lab → `#building`).         |
| Hero               | Static; weakest visual block; CV disabled correctly with Coming Soon.                   |
| Builder Narrative  | Strong copy; no motion; large type repeats pattern.                                     |
| Gymura             | Strongest brand section; good preview; pin works; ecosystem list still basic.           |
| Restaurant         | Strong systems story; **too dense** (workflow + 16 modules + preview); long pin target. |
| Currently Building | Useful; cards duplicate projects index style.                                           |
| Live Products      | Good Texas Funds credibility; placement lengthens page.                                 |
| Cybersecurity      | Solid; legal callout good; visually same card grid.                                     |
| Differentiation    | Generic capability grid — could merge with Builder or Skills.                           |
| Skills             | Comprehensive; chip density high; motion wired.                                         |
| Process            | Clear 7-step; border-start rail works; motion wired.                                    |
| Manifesto          | Emotional beat; image reuse; no motion (correct per saved tasks).                       |
| Contact            | Clear CTAs; Telegram/LinkedIn/GitHub; email correctly absent.                           |
| Footer             | Clean; signature repeats Hero; location shown.                                          |

**Cross-cutting:** Excessive vertical spacing (`py-20 lg:py-28` × 12), repeated `rounded-2xl border border-line bg-ink/60`, weak Hero→Gymura transition, no visual break between flagship and catalog sections.

### 3. Hero Audit (polish deferred — recommendations only)

| Topic                | Current state                                           | Recommendation                                                                         |
| -------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Crop                 | Full image in bordered frame, `object-cover`            | Desktop: 45–55% visual field, tighter crop on workstation; mobile: portrait crop asset |
| Frame                | `rounded-2xl border border-line`                        | Remove heavy border; use soft vignette blend into background                           |
| Size                 | `max-w-md` on mobile, 0.9fr column desktop              | Increase desktop presence; align with roadmap environmental portrait                   |
| Text/image balance   | Text dominates on desktop because image feels contained | Push image larger; reduce frame padding                                                |
| Headline             | `text-4xl`–`6xl`, works                                 | Arabic: verify line breaks at 375px                                                    |
| Buttons              | 3 buttons + disabled CV                                 | Consider 2 primaries; CV as footer/link until Phase 9                                  |
| Signature            | Below buttons, italic                                   | Keep out of headline; consider moving nearer Manifesto only                            |
| vs Gymura/Restaurant | Hero feels **weaker**                                   | Expected until polish phase — prioritize after AUD-001                                 |

### 4. Gymura Audit

**Homepage:** Pin 420px, scrub 0.6, glow parallax, compact preview with `motionShell`, ecosystem panel reveal. **Case study:** Motion on sections 0, 1, 3; live preview full variant; visit CTA in hero.

**Issues:** No real product/brand imagery; duplicate visit paths; `ProjectGallery` placeholder undermines flagship; scroll scrub on glow runs entire section height on tablet (minor). GSAP cleanup via `mm.revert()` — good. No hydration flash on Gymura (uses `from` not `set` hide). Pin spacing enabled — good.

### 5. Restaurant Platform Audit

**Homepage:** 8-stage workflow, LTR diagram, conceptual disclaimer present, compact preview, primary/secondary modules, pin 400px.

**Issues:**

- Order card `left` callback per stage during scrub — brittle (AUD-007).
- Desktop initial `gsap.set` opacity on modules/stages (AUD-002).
- Section very long — workflow + 16 chips + preview in one scroll unit.
- Ops panels decorative — fine if disclaimer clear (it is).
- `@1024px`: 8 columns in one row tight; `@1440px`: more space but card travel distance grows.

**Case study:** Motion on sections 0, 3, 4, 7, 8 — appropriate. Capabilities still English on AR.

### 6. Live Preview Audit

**Strengths:** Click-to-load default, generation counter for timeouts, ResizeObserver scaling, LTR shell, `aria-pressed` viewport buttons, `referrerPolicy`, lazy iframe, compact variant, documented CSP limitations in `docs/live-website-preview.md`.

**Weaknesses:**

- `onLoad` does not prove visible render (acknowledged in docs).
- No `screenshotFallback` configured for Gymura/Restaurant.
- Toolbar busy on mobile; three external link patterns when unavailable.
- Embedding requires target sites to allowlist portfolio production domain.
- No `sandbox` (intentional per docs).
- Reload disabled in idle state (correct).

### 7. Arabic and RTL Audit

**Strengths:** `dir={directions[locale]}` on `<html>`, IBM Plex Sans Arabic, locale-aware line-height, no letter-spacing on Arabic headings, `MixedText`/`bdi` for domains and tech, workflow `dir="ltr"` with `dir="auto"` labels, live preview shell LTR, previous/next cards use `text-end`/`text-start`.

**Weaknesses:**

- **AUD-001** English role/tech/capabilities on case studies.
- Signature “إمبراطوريتي” tone (AUD-023).
- “باني منتجات رقمية” slightly non-standard (AUD-024).
- Texas Funds / Alexa AI / Gymura kept in Latin script (acceptable for product names).
- Narrative lines use short punctuation lines — works in Arabic.

### 8. Responsive Audit (code-based)

| Breakpoint | Risks                                                                                |
| ---------- | ------------------------------------------------------------------------------------ |
| 320px      | Restaurant stage labels wrap; preview toolbar stacks; long Arabic headlines          |
| 375px      | Primary mobile target — toolbar + pin QA needed                                      |
| 430px      | Slightly better; same issues                                                         |
| 768px      | Tablet: no pin; Restaurant vertical timeline; 2-col grids OK                         |
| 1024px     | Pin activates; Restaurant horizontal workflow cramped; order card alignment critical |
| 1280px     | Order card travel distance increases                                                 |
| 1440px     | Homepage max-width `6xl` — plenty of margin; pin duration still fixed px             |

**Touch targets:** Most buttons `min-h-11`/`min-h-12` — pass. Preview reload disabled state OK.

### 9. Motion and GSAP Audit

**Registration:** `src/lib/motion/gsap.ts` registers once — good.

**Homepage ScrollTrigger budget (approx):** Gymura pin (1), Restaurant pin (1), HomepageSectionMotion × 6 (6), Gymura/Restaurant client bundles. Case study pages add more per project.

**Reduced motion:** Branches exist in cinematic sections and `HomepageSectionMotion`; CSS global reduce also zeroes transitions — good.

**Risks:** Restaurant `gsap.set` pre-hide; order card rect math; no `ScrollTrigger.refresh()` on Restaurant homepage resize (only case study preview has ResizeObserver refresh); language switch is full navigation (OK).

**Phase 8 readiness:** Motion foundation is adequate for **targeted** 3D integration hooks (`motionShell` pattern), not for global canvas without cleanup budget.

### 10. Accessibility Audit

**Pass:** `#main` landmark, skip link, `focus-visible` styles, semantic headings in sections, iframe `title`, `aria-pressed` on viewport switcher, `prefers-reduced-motion` CSS, workflow `<ol>` semantics.

**Gaps:** Mobile menu (AUD-009), external link labeling (AUD-032), decorative ops panels hidden from AT (OK if stages readable), color-only status in workflow emphasis (stages have text labels — OK), live preview idle state requires button (OK).

### 11. Content and Product Positioning Audit

**Within seconds, a visitor can understand:**

- Alex builds products across brand, systems, AI, security — **yes** (Hero headline).
- Gymura and Restaurant are live flagships — **yes**.
- Texas Funds is live — **yes** (Live Products).
- Other work is in progress — **yes** (Building section + status badges).
- How to contact — **yes** (Contact/footer).

**Risks:** Homepage length delays “what is live” discovery; differentiation section is generic; no About page for deeper founder story. No exaggerated claims found. Texas Funds “real users” stated — ensure legally accurate (user-provided fact).

### 12. Project Case Study Audit

| Project           | Strength               | Weakness                                           |
| ----------------- | ---------------------- | -------------------------------------------------- |
| Gymura            | Brand narrative depth  | No media gallery; English capabilities on AR       |
| Restaurant        | Systems lifecycle copy | Module list repetition; English capabilities on AR |
| Alexa AI          | Technical depth        | Placeholder gallery; prototype status              |
| Automation Lab    | Clear scope            | Thin vs flagship                                   |
| Cybersecurity Lab | Legal framing          | Placeholder gallery                                |
| Texas Funds       | Real usage honesty     | No live link/preview; shorter case study           |
| ALEX Linux        | Honest research status | Appropriately cautious                             |
| Upcoming          | Honest private status  | Minimal by design                                  |

**Navigation:** Previous/next works across priority order. All 8 slugs generate statically.

### 13. Performance Audit

**Build:** 23 static pages, Turbopack compile ~1.9s — excellent.

**Risks:**

- Hero PNG (large) × 2 sections
- Multiple client components hydrate on homepage (Gymura + Restaurant + 6× HomepageSectionMotion wrappers)
- GSAP + ScrollTrigger client bundle
- iframe loads on user action (good) but heavy when launched
- `scroll-behavior: smooth` global (minor INP concern)

**No bundle analyzer run** — recommended before Phase 8.

### 14. Security and Privacy Audit

**Pass:** `email: null`, no secrets in repo, external links `noopener noreferrer`, referrerPolicy on previews, no user input forms yet, public URLs only.

**Gaps:** No CSP/security headers, no rate limiting (no form), gallery/registry paths reference internal asset notes in `docs/` only (good). Texas Funds and Restaurant claims are product-level not security disclosures.

### 15. Manual Visual Review Status

**Automated browser review:** Not run to completion (prior session instability; no new dev server started per instructions).

**Pages requiring manual visual QA:**

- `/en`, `/ar` at 375px, 768px, 1024px, 1440px
- `/en/projects`, `/ar/projects`
- `/en/projects/gymura`, `/ar/projects/gymura`
- `/en/projects/restaurant-platform`, `/ar/projects/restaurant-platform`

**Priority checks:**

1. Restaurant order card alignment during pin scrub (1024 vs 1440)
2. Arabic case study facts sheet English chips
3. Live preview embed success for gymura.store and alnkha.site on production domain
4. Mobile preview toolbar overflow
5. Pin handoff Gymura → Restaurant → Building
6. `prefers-reduced-motion: reduce` full workflow static display

### 16. Validation Results

| Command                | Result                 |
| ---------------------- | ---------------------- |
| `npm run lint`         | Pass                   |
| `npm run type-check`   | Pass                   |
| `npm run format:check` | Pass                   |
| `npm run build`        | Pass — 23 static pages |

---

## Appendix: Arabic Phrasing Opinion (requested strings)

| String                                        | Assessment                                                                                                                           |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **باني منتجات رقمية**                         | Understandable and differentiated; slightly uncommon vs **باني منتجات** or **مهندس منتجات**. Acceptable if intentional founder tone. |
| **أبني علامات تجارية وبرمجيات وأنظمة ذكية**   | Strong parallel to English hero; natural Arabic, good verb-driven voice. **Keep.**                                                   |
| **أبني إمبراطوريتي الخاصة، فكرةً تلو الأخرى** | Grammatically fine; culturally may sound grandiose for corporate audiences. Consider softening while keeping ambition.               |

---

_End of audit. No source files were modified during this review._
