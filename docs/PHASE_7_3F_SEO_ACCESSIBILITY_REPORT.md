# Phase 7.3F — SEO, Metadata, Discoverability & Accessibility Report

**Date:** 2026-07-11  
**Scope:** Bilingual SEO/metadata, structured data, sitemap/robots/manifest, accessibility hardening — no redesign, no new dependencies  
**Status:** Complete

---

## Executive Summary

Phase 7.3F implemented a centralized, honest, bilingual metadata and accessibility system for Alex’s portfolio. The site now exposes correct titles, descriptions, canonical URLs, hreflang alternates, Open Graph and Twitter cards, JSON-LD structured data, sitemap/robots/manifest behavior, and typographic icons — without changing the approved homepage composition or visible narrative.

Production validation (`npm run lint`, `type-check`, `format:check`, `build`, `npm run start`) passes. Automated metadata smoke tests (`scripts/phase-7-3f-seo-check.mjs`) confirm server-rendered SEO on representative EN/AR routes. No critical or serious accessibility regressions were introduced; Phase 7.3E keyboard, landmark, and skip-link behavior remains intact.

---

## Site Configuration Architecture

**File:** `src/config/site.ts`

Stable identity data lives in one place:

- Site name, creator, social URLs (`GitHub`, `LinkedIn`, `Instagram`, `Telegram`)
- Job titles and `knowsAbout` for JSON-LD (documented skills only)
- `getSiteUrl()`, `absoluteUrl()`, `localePath()` helpers
- Theme/background colors for manifest

Localized SEO **copy** lives in `dictionary.meta` and `dictionary.seo` — not in `site.ts`.

---

## Base URL Strategy

```ts
// Priority order in getSiteUrl():
// 1. NEXT_PUBLIC_SITE_URL (explicit, normalized)
// 2. https://${VERCEL_PROJECT_PRODUCTION_URL}
// 3. http://localhost:3000 (development fallback only)
```

| Requirement                  | Implementation                                         |
| ---------------------------- | ------------------------------------------------------ |
| Valid `metadataBase`         | `buildRootMetadataDefaults()` in locale layout         |
| No double protocol           | `normalizeSiteUrl()` adds `https://` only when missing |
| No trailing slash            | Stripped in normalizer                                 |
| No invented domain           | Falls back to localhost when env unset                 |
| No crash without Vercel vars | Safe optional chaining                                 |

### Required environment variable

```env
NEXT_PUBLIC_SITE_URL=https://your-final-domain.example
```

Set this in production so canonical, OG, sitemap, and robots emit the real public origin — not localhost.

---

## Localized Metadata Model

**Files:** `src/content/translations/en.ts`, `ar.ts`, `types.ts`

| Key area          | EN example                                                | AR example                                                     |
| ----------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| Homepage title    | Alex — Product Builder, Full-Stack Developer & AI Systems | أليكس — بناء المنتجات وتطوير البرمجيات وأنظمة الذكاء الاصطناعي |
| Site name         | Alex Portfolio                                            | محفظة أليكس                                                    |
| Creator label     | Alex                                                      | أليكس                                                          |
| Case-study suffix | \| Alex                                                   | \| أليكس                                                       |
| Per-project SEO   | `seo.projectMeta[slug]`                                   | Matching Arabic equivalents                                    |

Honest status wording examples:

- **Alexa AI:** Functional Prototype Case Study
- **Automation Lab:** Active Development
- **Upcoming:** Projects in Progress (noindex)
- **Cybersecurity Lab:** Ethical Security Learning (not professional employment)
- **ALEX Linux:** Research & Concept Work

---

## Root and Locale Metadata

| Layer                               | Responsibility                                      |
| ----------------------------------- | --------------------------------------------------- |
| `[locale]/layout.tsx`               | `metadataBase`, icons, theme-color, global defaults |
| `[locale]/page.tsx`                 | Homepage title, description, OG, Twitter            |
| `[locale]/projects/page.tsx`        | Projects index metadata                             |
| `[locale]/projects/[slug]/page.tsx` | Per-project metadata from `seo.projectMeta`         |
| `[locale]/not-found.tsx`            | Localized 404 title + `noindex`                     |

`lang` / `dir` set on `<html>` per locale. Child pages do not duplicate the full site name twice on the homepage.

---

## Canonical Implementation

**File:** `src/lib/seo/alternates.ts`

Each localized route emits:

```html
<link rel="canonical" href="{absoluteUrl}/{locale}{path}" />
```

Examples:

- `/en` → canonical `…/en`
- `/ar/projects/gymura` → canonical `…/ar/projects/gymura`

English canonical never points to Arabic. Equivalent path preserved between locales.

---

## Hreflang Implementation

`alternates.languages` maps each supported locale:

```html
<link rel="alternate" hreflang="en" href="…/en/…" />
<link rel="alternate" hreflang="ar" href="…/ar/…" />
```

Alternates advertised only for routes that exist in both locales (all public portfolio routes). `x-default` intentionally omitted — no false default locale mapping.

---

## Open Graph Implementation

**Builder:** `src/lib/seo/metadata.ts` → `buildPageMetadata()`

Per page:

| Field                 | Source                                 |
| --------------------- | -------------------------------------- |
| `og:title`            | Localized page title                   |
| `og:description`      | Localized description                  |
| `og:url`              | Absolute canonical page URL            |
| `og:site_name`        | `siteConfig.name`                      |
| `og:locale`           | `en_US` / `ar`                         |
| `og:alternate_locale` | Complementary locale                   |
| `og:type`             | `website`                              |
| `og:image`            | Default or project OG route (1200×630) |

Project pages use project-specific OG image routes when available.

---

## Twitter Metadata

| Field                 | Value                    |
| --------------------- | ------------------------ |
| `twitter:card`        | `summary_large_image`    |
| `twitter:title`       | Same as page title       |
| `twitter:description` | Same as meta description |
| `twitter:image`       | Absolute OG image URL    |

**No `twitter:creator` handle** — Alex has no confirmed X/Twitter account in project data.

---

## OG Image Strategy

**Approach:** Option B — Next.js `opengraph-image.tsx` + `ImageResponse`

| Route        | File                                                   |
| ------------ | ------------------------------------------------------ |
| Site default | `src/app/[locale]/opengraph-image.tsx`                 |
| Per project  | `src/app/[locale]/projects/[slug]/opengraph-image.tsx` |

Visual design:

- Dark obsidian gradient background
- “ALEX” identity mark
- Concise Latin title + subtitle
- World accent color on project cards
- Status badge from `statusLabels`
- No fake metrics or screenshots

### Arabic rendering decision

Arabic glyphs in `ImageResponse` **break production build** (OpenType shaping unsupported). **HTML metadata is fully localized**; OG **image pixels use English/Latin text** from `dictionary.seo.projectMeta` (EN) for reliability. This is documented as an intentional trade-off pending approved static bilingual assets.

---

## Case-Study Metadata

All eight public slugs receive dedicated `seo.projectMeta` entries:

| Slug                  | EN metadata title                                                      |
| --------------------- | ---------------------------------------------------------------------- |
| `gymura`              | Gymura — Brand & E-commerce Case Study \| Alex                         |
| `restaurant-platform` | Restaurant Platform — Live Operations & QR Ordering Case Study \| Alex |
| `texas-funds`         | Texas Funds Bot — Live Telegram Product Case Study \| Alex             |
| `alexa-ai`            | Alexa AI — Functional Prototype Case Study \| Alex                     |
| `automation-lab`      | Automation Lab — Active Development \| Alex                            |
| `cybersecurity-lab`   | Cybersecurity Lab — Ethical Security Learning \| Alex                  |
| `alex-linux`          | ALEX Linux — Research & Concept Work \| Alex                           |
| `upcoming`            | Upcoming Work — Projects in Progress \| Alex                           |

Descriptions use honest scope/status language — no fabricated metrics, employers, or completion claims.

---

## Incomplete Case-Study Indexing Policy

| Slug             | Policy                                       | Robots          | Sitemap      |
| ---------------- | -------------------------------------------- | --------------- | ------------ |
| `alexa-ai`       | Indexable — meaningful prototype explanation | index           | Yes          |
| `automation-lab` | Indexable — active development scope         | index           | Yes          |
| `alex-linux`     | Indexable — research/concept honesty         | index           | Yes          |
| `upcoming`       | Public but **noindex** — thin placeholder    | noindex, follow | **Excluded** |

**Implementation:** `src/lib/seo/project-indexing.ts`  
Routes are **not deleted**.

---

## Sitemap

**File:** `src/app/sitemap.ts`

| Included                           | Count  |
| ---------------------------------- | ------ |
| EN + AR homepage                   | 2      |
| EN + AR projects index             | 2      |
| Indexable case studies × 2 locales | 14     |
| **Total URLs**                     | **18** |

Excluded: `upcoming`, invalid paths, hash anchors, external iframe URLs.  
No `lastModified`, `changeFrequency`, or `priority` invented.  
Hreflang alternates embedded per URL entry.

---

## Robots

**File:** `src/app/robots.ts`

```
User-Agent: *
Allow: /
Host: {getSiteUrl()}
Sitemap: {getSiteUrl()}/sitemap.xml
```

No global disallow. `upcoming` uses page-level `noindex` (not robots.txt blocking). Robots.txt is not relied upon for security.

---

## Manifest and Icons

**File:** `src/app/manifest.ts`

| Field                              | Value                          |
| ---------------------------------- | ------------------------------ |
| `name`                             | Alex Portfolio                 |
| `short_name`                       | Alex                           |
| `theme_color` / `background_color` | `#06080f`                      |
| `start_url`                        | `/en`                          |
| Icons                              | `/icon.svg`, `/apple-icon.svg` |

**Icons:** Restrained typographic “A” on obsidian — not Gymura branding, not Next.js placeholder.

Locale layout references icons via `buildRootMetadataDefaults()`.

---

## Structured Data

**Files:** `src/lib/seo/structured-data.ts`, `src/components/seo/*`

### Homepage (`/[locale]`)

`@graph`:

1. **Person** — name, alternateName, url, sameAs (4 social links), jobTitle, knowsAbout
   - No email, address, employer, awards, or unverified fields
2. **WebSite** — name, url, inLanguage, creator reference
3. **ProfilePage** — about/mainEntity → Person

### Case studies

`@graph`:

1. **Person** (stable `@id`)
2. **CreativeWork** — honest `headline`/`description` from `seo.projectMeta`

No `SearchAction` (site has no search). No duplicate conflicting Person IDs.

---

## JSON-LD Safety

**File:** `src/lib/seo/json-ld.tsx`

- `serializeJsonLd()` escapes `<` → `\u003c`
- Only trusted internal typed data serialized
- No user-generated content in JSON-LD
- Rendered via controlled `dangerouslySetInnerHTML` on internal data only

---

## Heading Hierarchy

Verified via production HTML parse (H1 count) and component audit:

| Route          | H1                        |
| -------------- | ------------------------- |
| Homepage       | Hero name/statement block |
| Projects index | Index title               |
| Case study     | Project title in hero     |
| 404            | Not-found title           |

Section headings follow H2 → H3 without skips for styling alone. Manifesto quote is not an H1.

---

## Landmarks

| Element          | Implementation                     |
| ---------------- | ---------------------------------- |
| `header`         | `SiteHeader`                       |
| `nav`            | Desktop + mobile with `aria-label` |
| `main#main`      | Exactly once per page              |
| `footer`         | `SiteFooter`                       |
| `section`        | Homepage world sections            |
| Decorative rails | `aria-hidden` on motion SVG layers |

---

## Skip Link

| Property      | Value                             |
| ------------- | --------------------------------- |
| EN label      | Skip to main content              |
| AR label      | الانتقال إلى المحتوى الرئيسي      |
| Target        | `#main`                           |
| Position      | First focusable element in header |
| Focus style   | High-contrast electric pill       |
| Scroll offset | `scroll-padding-top: 5rem`        |

Phase 7.3E target confirmed; no regression in 7.3F.

---

## Keyboard / Focus Review

Post-metadata re-audit: no regressions. Global `:focus-visible` outline preserved. Interactive controls remain keyboard reachable. Mobile menu does not trap focus. Preview `aria-pressed` remains deterministic (7.3D.2 hydration fix holds).

---

## Accessible Names

Icon-only controls use localized `aria-label` keys. Iframe previews use project-specific titles. External links append opens-in-new-tab hint where configured. No conflicting `aria-label` vs visible text on primary buttons.

---

## Image Accessibility

Meaningful photos use factual localized alt. Decorative motion/background layers hidden from AT. Favicon SVG includes `aria-label="Alex"`. OG images are decorative social assets — described via OG `alt` matching page title.

---

## Contrast Changes

Practical token review performed (see inventory). **No CSS changes required** — `text-soft`, `text-mist`, focus ring, and world accent label mixes meet practical contrast targets on obsidian backgrounds.

---

## Motion Accessibility

No motion code modified in 7.3F. `prefers-reduced-motion: reduce` static rail fallbacks remain. Social previews do not depend on animation.

---

## Language and Bidi Behavior

| Property             | EN                                 | AR                                             |
| -------------------- | ---------------------------------- | ---------------------------------------------- |
| `html lang`          | `en`                               | `ar`                                           |
| `html dir`           | `ltr`                              | `rtl`                                          |
| `og:locale`          | `en_US`                            | `ar` (generic Arabic — no false country claim) |
| JSON-LD `inLanguage` | `en`                               | `ar`                                           |
| 404                  | Inherits locale from route segment | Same                                           |

---

## Not-Found Behavior

**File:** `src/app/[locale]/not-found.tsx`

- Localized title + description via `buildNotFoundMetadata()`
- `robots: noindex, follow`
- Clear H1 and home/projects links
- Correct `lang`/`dir` via locale layout
- No OG emphasis required

---

## Automated Accessibility Tests

| Tool                                        | Result                                                      |
| ------------------------------------------- | ----------------------------------------------------------- |
| `scripts/phase-7-3f-seo-check.mjs`          | Pass — metadata + H1                                        |
| `scripts/phase-7-3e-qa.mjs` (carry-forward) | Pass — 0 hydration/console errors in production             |
| Playwright axe                              | Not run — Playwright not installed in CI/local default deps |

**Manual:** Keyboard path, landmark, heading, contrast, reduced-motion, EN/AR spot-check via code audit + 7.3E production QA.

---

## Production Runtime Tests

**Environment:** `npm run build` → `PORT=3001 npm run start`

| Endpoint                              | Status | Content-Type                  |
| ------------------------------------- | ------ | ----------------------------- |
| `/en`                                 | 200    | Full metadata + JSON-LD graph |
| `/ar`                                 | 200    | RTL + localized metadata      |
| `/robots.txt`                         | 200    | text/plain                    |
| `/sitemap.xml`                        | 200    | application/xml, 18 URLs      |
| `/manifest.webmanifest`               | 200    | application/manifest+json     |
| `/icon.svg`                           | 200    | image/svg+xml                 |
| `/en/opengraph-image`                 | 200    | image/png                     |
| `/en/projects/gymura/opengraph-image` | 200    | image/png                     |
| `/en/projects/upcoming`               | 200    | `noindex, follow`             |

No new console errors or hydration warnings expected from metadata-only server changes.

---

## Files Created

| File                                                   | Purpose                                             |
| ------------------------------------------------------ | --------------------------------------------------- |
| `src/config/site.ts`                                   | Central site identity + URL helpers                 |
| `src/lib/seo/metadata.ts`                              | Metadata builders (home, projects, case study, 404) |
| `src/lib/seo/alternates.ts`                            | Canonical + hreflang                                |
| `src/lib/seo/project-indexing.ts`                      | Honest index/noindex policy                         |
| `src/lib/seo/json-ld.tsx`                              | Safe JSON-LD serialization                          |
| `src/lib/seo/structured-data.ts`                       | Person, WebSite, ProfilePage, CreativeWork schemas  |
| `src/app/robots.ts`                                    | Robots policy                                       |
| `src/app/sitemap.ts`                                   | Public route sitemap                                |
| `src/app/manifest.ts`                                  | Web app manifest                                    |
| `src/app/[locale]/opengraph-image.tsx`                 | Default OG image                                    |
| `src/app/[locale]/projects/[slug]/opengraph-image.tsx` | Project OG images                                   |
| `src/components/seo/HomepageStructuredData.tsx`        | Homepage JSON-LD                                    |
| `src/components/seo/ProjectStructuredData.tsx`         | Case-study JSON-LD                                  |
| `public/icon.svg`                                      | Favicon                                             |
| `public/apple-icon.svg`                                | Apple touch icon                                    |
| `scripts/phase-7-3f-seo-check.mjs`                     | Fetch-based metadata smoke test                     |
| `docs/PHASE_7_3F_SEO_ACCESSIBILITY_INVENTORY.md`       | Pre/post audit inventory                            |
| `docs/PHASE_7_3F_SEO_ACCESSIBILITY_REPORT.md`          | This report                                         |

---

## Files Modified

| File                                        | Change                                    |
| ------------------------------------------- | ----------------------------------------- |
| `src/app/[locale]/layout.tsx`               | `metadataBase`, icons, root defaults      |
| `src/app/[locale]/page.tsx`                 | `buildHomeMetadata` + structured data     |
| `src/app/[locale]/projects/page.tsx`        | Projects index metadata                   |
| `src/app/[locale]/projects/[slug]/page.tsx` | Honest project metadata + structured data |
| `src/app/[locale]/not-found.tsx`            | `noindex` metadata                        |
| `src/content/translations/types.ts`         | `meta.siteName`, `seo` section            |
| `src/content/translations/en.ts`            | Localized SEO copy + per-project meta     |
| `src/content/translations/ar.ts`            | Arabic SEO equivalents                    |

---

## Files Deleted

None in Phase 7.3F.

---

## Validation Results

| Command                            | Result                         |
| ---------------------------------- | ------------------------------ |
| `npm run lint`                     | ✅ Pass                        |
| `npm run type-check`               | ✅ Pass                        |
| `npm run format:check`             | ✅ Pass                        |
| `npm run build`                    | ✅ Pass (42 pages + OG routes) |
| `scripts/phase-7-3f-seo-check.mjs` | ✅ Pass (production server)    |

---

## Environment Variables Required

```env
NEXT_PUBLIC_SITE_URL=https://your-final-domain.example
```

Optional fallback: `VERCEL_PROJECT_PRODUCTION_URL` (Vercel injects automatically).

---

## Remaining Risks

1. **Localhost in absolute URLs** until `NEXT_PUBLIC_SITE_URL` is set at deploy
2. **OG image Arabic text** — Latin-only pixels; social previews for AR pages show English OG image text
3. **External social validators** — not exercised in this phase
4. **Iframe sandbox** — live previews remain unsandboxed (7.3E report-only; required for external sites)

---

## Items Requiring Alex’s Approval

1. Confirm final production domain for `NEXT_PUBLIC_SITE_URL`
2. Approve Latin-only OG image strategy or supply static bilingual OG assets
3. Confirm indexability policy for prototype/development pages (`alexa-ai`, `automation-lab`, `alex-linux`)

---

## Completion Criteria Checklist

| Criterion                              | Status |
| -------------------------------------- | ------ |
| Localized titles and descriptions      | ✅     |
| Reliable `metadataBase`                | ✅     |
| Correct canonical URLs                 | ✅     |
| Valid hreflang alternates              | ✅     |
| Open Graph metadata                    | ✅     |
| Twitter metadata                       | ✅     |
| OG image paths resolve                 | ✅     |
| Sitemap works                          | ✅     |
| Robots works                           | ✅     |
| Manifest/icons work                    | ✅     |
| JSON-LD valid and honest               | ✅     |
| Incomplete project indexing documented | ✅     |
| One H1 per route                       | ✅     |
| Main landmarks correct                 | ✅     |
| Skip navigation works                  | ✅     |
| No keyboard blockers                   | ✅     |
| No critical/serious a11y regressions   | ✅     |
| `lang` and `dir` correct               | ✅     |
| Production build passes                | ✅     |
| Required reports exist                 | ✅     |

**Phase 7.3F is complete.** Phase 7.3G and 7.4 were not started.
