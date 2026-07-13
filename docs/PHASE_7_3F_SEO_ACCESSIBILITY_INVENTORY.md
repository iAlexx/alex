# Phase 7.3F — SEO & Accessibility Inventory

**Date:** 2026-07-11  
**Scope:** Pre-implementation audit baseline and post-implementation verification inventory  
**Status:** Complete

---

## 1. Existing Metadata Architecture (Pre-7.3F)

### Metadata entry points (before)

| Location                                    | Mechanism          | Content                                                          |
| ------------------------------------------- | ------------------ | ---------------------------------------------------------------- |
| `src/app/[locale]/layout.tsx`               | `generateMetadata` | Locale `description` from dictionary only                        |
| `src/app/[locale]/page.tsx`                 | `generateMetadata` | `dictionary.meta.title` + `description`                          |
| `src/app/[locale]/projects/page.tsx`        | `generateMetadata` | Generic projects index title                                     |
| `src/app/[locale]/projects/[slug]/page.tsx` | `generateMetadata` | Case-study `copy.title — copy.subtitle` (could overstate status) |
| `src/app/[locale]/not-found.tsx`            | None               | No localized SEO metadata                                        |

### Missing before 7.3F

| Item                                           | Status pre-7.3F           |
| ---------------------------------------------- | ------------------------- |
| `metadataBase`                                 | Missing                   |
| Canonical URLs                                 | Missing                   |
| Hreflang alternates                            | Missing                   |
| Open Graph (title, description, image, locale) | Missing                   |
| Twitter card metadata                          | Missing                   |
| `robots.ts`                                    | Missing                   |
| `sitemap.ts`                                   | Missing                   |
| `manifest.ts`                                  | Missing                   |
| Favicon / apple icon                           | Missing (Next.js default) |
| OG image assets / generation                   | Missing                   |
| JSON-LD structured data                        | Missing                   |
| Centralized site URL config                    | Missing                   |
| Per-project honest SEO copy                    | Missing                   |
| Incomplete-project indexing policy             | Missing                   |

### Duplicate / scattered definitions (before)

- `dictionary.meta.title` and `dictionary.meta.description` used directly in page `generateMetadata` without shared builder
- Case-study metadata reused visible `copy.subtitle`, including misleading lines such as “professional Red Team work”
- No single `site.ts` — domain would have been scattered if added ad hoc

### Hardcoded / placeholder values (before)

- Implicit localhost if any absolute URL were added manually
- No production domain configured (correct — must not invent)
- Default Next.js favicon placeholder

### Locale behavior gaps (before)

- `lang` / `dir` on `<html>` were correct via locale layout
- No `og:locale` / `alternateLocale`
- No per-locale canonical or hreflang pairs
- Arabic and English descriptions could not leak together (only one locale per route), but alternates were absent

### Routes with generic or risky metadata (before)

| Route                                  | Issue                                             |
| -------------------------------------- | ------------------------------------------------- |
| `/[locale]/projects`                   | Functional but no OG/Twitter/canonical            |
| `/[locale]/projects/cybersecurity-lab` | Subtitle implied professional Red Team employment |
| `/[locale]/projects/alexa-ai`          | Described as full case study via generic subtitle |
| `/[locale]/projects/automation-lab`    | No “active development” signal in metadata        |
| `/[locale]/projects/upcoming`          | No `noindex` policy                               |
| `/[locale]/not-found`                  | No `noindex` metadata                             |

---

## 2. OG Asset Inventory

### Approved public images (`public/`)

| Asset                        | Purpose                     | Notes                                                 |
| ---------------------------- | --------------------------- | ----------------------------------------------------- |
| `alex-workstation-*.jpg` (4) | Homepage hero / manifesto   | Real photos; not used as default OG for every project |
| `icon.svg`                   | Favicon (new 7.3F)          | Typographic “A” on obsidian                           |
| `apple-icon.svg`             | Apple touch icon (new 7.3F) | Matching typographic icon                             |

### OG image strategy (implemented)

| Type         | Path                                        | Rendering                                                      |
| ------------ | ------------------------------------------- | -------------------------------------------------------------- |
| Site default | `/[locale]/opengraph-image`                 | `ImageResponse` — Latin text only                              |
| Per project  | `/[locale]/projects/[slug]/opengraph-image` | `ImageResponse` — Latin text from `dictionary.seo.projectMeta` |

**Arabic OG image limitation:** `ImageResponse` Arabic shaping fails at production build (`substFormat` error). HTML metadata remains fully localized; OG **images** use English/Latin strings only. Documented in final report.

---

## 3. Case-Study Indexing Decisions

| Slug                  | Classification            | Robots          | Sitemap | Rationale                                             |
| --------------------- | ------------------------- | --------------- | ------- | ----------------------------------------------------- |
| `gymura`              | Indexable meaningful page | index, follow   | Yes     | Live brand with substantial case study                |
| `restaurant-platform` | Indexable meaningful page | index, follow   | Yes     | Live platform with full case study                    |
| `texas-funds`         | Indexable meaningful page | index, follow   | Yes     | Live product used by real users                       |
| `alexa-ai`            | Indexable meaningful page | index, follow   | Yes     | Honest prototype page answers “what is Alexa AI?”     |
| `automation-lab`      | Indexable meaningful page | index, follow   | Yes     | Active development page with useful scope description |
| `cybersecurity-lab`   | Indexable meaningful page | index, follow   | Yes     | Learning lab with ethical framing; metadata corrected |
| `alex-linux`          | Indexable meaningful page | index, follow   | Yes     | Research/concept page; metadata states not a release  |
| `upcoming`            | Public but **noindex**    | noindex, follow | **No**  | Thin placeholder; avoids low-value indexed URL        |

**Policy:** Routes are **not deleted**. `upcoming` remains reachable but is excluded from sitemap and carries `noindex`.

---

## 4. Accessibility Findings

### Severity summary

| Severity | Count (app-controlled) | Status            |
| -------- | ---------------------- | ----------------- |
| Critical | 0                      | —                 |
| Serious  | 0 unresolved           | —                 |
| Moderate | 2 report-only          | Carried from 7.3E |
| Minor    | 3 report-only          | Documented        |

### Heading hierarchy

| Route                       | H1 count | Notes                                           |
| --------------------------- | -------- | ----------------------------------------------- |
| `/[locale]`                 | 1        | `HeroV2Section` H1 only                         |
| `/[locale]/projects`        | 1        | Projects index heading                          |
| `/[locale]/projects/[slug]` | 1        | `ProjectHero` H1                                |
| `/[locale]/not-found`       | 1        | Localized not-found H1                          |
| Section H2/H3               | Logical  | World chapters H2; submodules H3 under chapters |

**No change required:** Manifesto quote is not an H1. Footer uses H2 under page H1 (acceptable on long homepage). Rail node labels are not promoted to headings.

### Landmarks

| Landmark           | Present       | Notes                                          |
| ------------------ | ------------- | ---------------------------------------------- |
| `<header>`         | Yes           | Sticky site header                             |
| `<nav aria-label>` | Yes           | Desktop + mobile; distinct mobile drawer label |
| `<main id="main">` | Yes           | Exactly one per page                           |
| `<footer>`         | Yes           | Navigation + connect columns                   |
| `<section>`        | Yes           | Homepage world sections                        |
| Decorative rails   | `aria-hidden` | SVG motion layers (7.3D)                       |

### Skip link (Phase 7.3E carry-forward)

| Check                | Result                                                  |
| -------------------- | ------------------------------------------------------- |
| Exists               | Yes — first focusable element in `SiteHeader`           |
| Target               | `#main` (consistent across app; not `#main-content`)    |
| Localized EN/AR      | Yes via `dictionary.a11y.skipToContent`                 |
| Visible on focus     | Yes — `sr-only focus:not-sr-only` + electric background |
| Sticky header offset | `scroll-padding-top: 5rem` + `scroll-mt-20` on sections |

### Keyboard / focus (re-audit post-7.3F)

| Control          | Status                                               |
| ---------------- | ---------------------------------------------------- |
| Header links     | Focus ring via global `:focus-visible`               |
| Locale switcher  | Keyboard operable                                    |
| Mobile menu      | Opens/closes; backdrop closes; no trap               |
| Hero CTAs        | Anchor links, keyboard reachable                     |
| Preview toolbar  | Labeled group; device buttons use `aria-pressed`     |
| Case-study links | Standard links                                       |
| External links   | `rel="noopener noreferrer"` + supplemental a11y text |
| 404 navigation   | Keyboard accessible home/projects links              |

**No keyboard blockers found** after metadata-only changes.

### Accessible names

| Element                | Status                               |
| ---------------------- | ------------------------------------ |
| Icon-only menu toggle  | Localized `openMenu` / `closeMenu`   |
| Locale toggle          | `switchLanguage`                     |
| Preview reload / open  | Localized labels                     |
| Iframe previews        | Project-specific `title` from copy   |
| Live status            | Text label, not color-only           |
| Builder Map / diagrams | `summary` / `aria-label` on diagrams |

### Image accessibility

| Image                    | Alt strategy                            |
| ------------------------ | --------------------------------------- |
| Hero workstation         | Factual localized `heroImageAlt`        |
| Manifesto photo          | Factual localized `manifestoImageAlt`   |
| Project gallery          | Descriptive alt from copy where present |
| Decorative rails / glows | `aria-hidden` / empty alt               |
| Icons (favicon)          | `aria-label="Alex"` in SVG              |

### Color & contrast (practical review)

| Token / usage                                       | Approx. contrast on `#06080f`  | Result                              |
| --------------------------------------------------- | ------------------------------ | ----------------------------------- |
| `text-soft` (#e9edf6) body                          | ~15.5:1                        | Pass                                |
| `text-mist` (#9aa4bb) secondary                     | ~7.0:1                         | Pass                                |
| `text-electric` (#4f8dff) links                     | ~5.5:1                         | Pass for UI components / large text |
| World accent labels (brands/systems/intel/security) | Mixed with `color-mist` in CSS | Pass for small labels               |
| Skip link focus (electric on obsidian)              | High                           | Pass                                |
| Disabled preview controls                           | Muted but legible              | Acceptable                          |

**No contrast code changes required** — existing tokens meet practical WCAG targets for this dark system.

### Motion accessibility

| Check                            | Result                         |
| -------------------------------- | ------------------------------ |
| `prefers-reduced-motion: reduce` | Static rails (7.3D CSS)        |
| Metadata changes affect motion   | No — motion untouched          |
| Decorative motion semantic       | Information duplicated in text |
| Autoplay / flashing              | None                           |

### Language & direction

| Check                | Result               |
| -------------------- | -------------------- |
| `<html lang>`        | `en` / `ar`          |
| `<html dir>`         | `ltr` / `rtl`        |
| OG locale            | `en_US` / `ar`       |
| JSON-LD `inLanguage` | Matches route locale |

---

## 5. Automated Test Results (7.3F)

**Script:** `scripts/phase-7-3f-seo-check.mjs`  
**Server:** `npm run start` on **http://localhost:3001** (production build)

| Check                                         | Result                      |
| --------------------------------------------- | --------------------------- |
| Metadata on 12 representative routes          | Pass                        |
| Canonical + hreflang (2 alternates per page)  | Pass                        |
| OG + Twitter on all tested pages              | Pass                        |
| JSON-LD on homepage + case studies            | Pass                        |
| H1 count = 1 per route                        | Pass                        |
| `/robots.txt`                                 | 200                         |
| `/sitemap.xml`                                | 200, 18 URLs, no `upcoming` |
| `/manifest.webmanifest`                       | 200                         |
| `/icon.svg`, `/apple-icon.svg`                | 200                         |
| OG images (`/en/opengraph-image`, project OG) | 200 `image/png`             |
| `upcoming` robots                             | `noindex, follow`           |

---

## 6. Validation Commands

| Command                | Result                             |
| ---------------------- | ---------------------------------- |
| `npm run lint`         | Pass                               |
| `npm run type-check`   | Pass                               |
| `npm run format:check` | Pass                               |
| `npm run build`        | Pass (42 static pages + OG routes) |

---

## 7. Remaining Manual Limitations

- External social platform card validators (Facebook, X, LinkedIn) not run — OG URLs verified locally only
- Playwright accessibility tree audit unavailable in this environment; keyboard/landmark audit performed via code review + 7.3E production QA carry-forward
- Production absolute URLs use `http://localhost:3000` until `NEXT_PUBLIC_SITE_URL` is configured at deploy time

---

## 8. Items Requiring Alex Approval

1. **Production domain** — set `NEXT_PUBLIC_SITE_URL` when the final public URL is known
2. **OG image Latin-only strategy** — acceptable for social previews, or provide approved static bilingual OG assets
3. **Indexable thin pages** — confirm `alexa-ai` / `automation-lab` / `alex-linux` should remain indexed (current policy: yes, with honest metadata)
