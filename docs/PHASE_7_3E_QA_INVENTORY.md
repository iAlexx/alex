# Phase 7.3E — QA Inventory

**Date:** 2026-07-11  
**Status:** Post-fix audit complete

---

## P0 — Blocking

| ID  | Issue           | Status |
| --- | --------------- | ------ |
| —   | None reproduced | —      |

---

## P1 — Major

| ID    | Issue                                              | Route          | Fix                                                              | Status    |
| ----- | -------------------------------------------------- | -------------- | ---------------------------------------------------------------- | --------- |
| P1-01 | Footer `#building` / `#cybersecurity` dead anchors | `/en`, `/ar`   | Updated to `#future` / `#world-security` in `SiteFooter.tsx`     | **fixed** |
| P1-02 | No custom not-found page                           | invalid routes | Added `src/app/not-found.tsx` + `src/app/[locale]/not-found.tsx` | **fixed** |

---

## P2 — Moderate

| ID    | Issue                                     | Fix                                                           | Status          |
| ----- | ----------------------------------------- | ------------------------------------------------------------- | --------------- |
| P2-01 | `scroll-behavior: smooth` dev warning     | `data-scroll-behavior="smooth"` on `<html>`                   | **fixed**       |
| P2-02 | Locale switch dropped URL hash            | `LanguageSwitcher` preserves hash via `router.push`           | **fixed**       |
| P2-03 | Mobile menu no outside-click close        | Backdrop button in `MobileNavigation.tsx`                     | **fixed**       |
| P2-04 | Orphaned pre-V2 homepage tree (~21 files) | Deleted after zero-import verification                        | **fixed**       |
| P2-05 | Live preview iframe has no `sandbox`      | Intentional — external live sites require full iframe         | **report-only** |
| P2-06 | Dev rail-motion console logs              | Already `NODE_ENV === 'development'` gated; production silent | **verified**    |

---

## P3 — Deferred

| ID    | Issue                                                        | Status                                                     |
| ----- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| P3-01 | Formal SEO / metadata phase                                  | **deferred** (roadmap later phase)                         |
| P3-02 | QA scripts not in `package.json`                             | **deferred** — scripts exist in `scripts/`                 |
| P3-03 | Incomplete case studies (alexa-ai, automation-lab, upcoming) | **preserved** — routes work, content intentionally partial |
| P3-04 | CSP / security headers                                       | **deferred** (later hardening phase)                       |
| P3-05 | Lighthouse / performance budgeting                           | **deferred**                                               |

---

## Verified OK (No Change Required)

- Hydration mismatch (LiveWebsitePreview) — fixed 7.3D.2
- Rail motion runtime — fixed 7.3D.1
- Header nav anchors match V2 DOM IDs
- Hero CTAs (`#world-brands`, `#future`)
- Skip link in header
- `scroll-mt-20` + `scroll-padding-top: 5rem`
- External links use `rel="noopener noreferrer"`
- Single `<h1>` and `<main id="main">` on homepage
- Reduced-motion CSS fallbacks

---

## Automated Production QA Summary

**Server:** `npm run start` on **http://localhost:3000** (PID 29468)

| Check                                                   | Result               |
| ------------------------------------------------------- | -------------------- |
| Console errors (320–1440px, `/en` + `/ar`)              | **0**                |
| Hydration warnings                                      | **0**                |
| Horizontal overflow                                     | **0**                |
| Homepage anchors (9 IDs)                                | **all exist**        |
| Internal routes (12 tested)                             | **all 200**          |
| Footer anchors `#future`, `#world-security`, `#contact` | **land correctly**   |
| Invalid route `/en/invalid-page-xyz`                    | **404 with content** |
| Rail motion init (`data-rail-motion-init`)              | **true**             |
| Preview `aria-pressed` (2 previews)                     | **1 active each**    |
