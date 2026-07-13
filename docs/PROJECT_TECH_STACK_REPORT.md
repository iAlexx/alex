# Project Tech Stack Report

**Date:** 2026-07-13  
**Scope:** Bilingual Tech Stack system across homepage + case studies  
**Status:** Complete

---

## Executive summary

A shared, evidence-backed **Tech Stack** system (`Tech Stack` / `التقنيات المستخدمة`) now displays verified technologies as glass pills with local logos on every applicable project section. Technologies are defined once in a typed catalog, composed per project with `verifiedBy` audit trails, and rendered through `ProjectTechStack` + `TechnologyBadge`.

No new icon npm dependencies were added. Live Preview scroll preservation was not modified.

---

## Data architecture

| Layer   | Path                                      | Role                                                    |
| ------- | ----------------------------------------- | ------------------------------------------------------- |
| Types   | `src/lib/projects/tech-types.ts`          | `TechCategory`, `ProjectTechnology`, `ProjectTechStack` |
| Catalog | `src/lib/projects/tech-catalog.ts`        | Shared technology definitions + `verifiedBy`            |
| Stacks  | `src/lib/projects/project-tech-stacks.ts` | Per-project full + homepage subsets                     |

`getProjectTechnologies(projectId, { compact, maxItems })` resolves homepage vs case-study lists.

---

## Shared component architecture

| Component          | Path                                              |
| ------------------ | ------------------------------------------------- |
| `ProjectTechStack` | `src/components/projects/ProjectTechStack.tsx`    |
| `TechnologyBadge`  | `src/components/projects/TechnologyBadge.tsx`     |
| `TechIcon`         | `src/components/projects/tech-icons/TechIcon.tsx` |
| Styles             | `src/components/projects/project-tech-stack.css`  |

Props: `projectId`, `locale`, `dictionary`, `compact?`, `maxItems?`, `showLabel?`.

World accent borders use `data-tech-world` (`brands` / `systems` / `intelligence` / `security`).

---

## Icon / logo strategy

- **Local inline SVG** via `TechIcon` — no CDN, no runtime fetch, no emoji
- Monochrome `currentColor` treatment; restrained brand recognition
- Decorative icons `aria-hidden`; labels always visible
- Non-interactive badges use `<span>`; official docs links use `ExternalLink` where `url` is set
- **No new dependencies** — bundle impact: **0 KB** added packages

---

## Verified technologies per project

### Gymura (`gymura`)

| Technology                 | Category | Evidence                             |
| -------------------------- | -------- | ------------------------------------ |
| E-commerce                 | platform | `gymura.ts`, `projectFacts.gymura`   |
| Brand Identity             | tool     | same                                 |
| Product Design             | tool     | same                                 |
| Brand Strategy             | tool     | `gymura.ts` capabilities             |
| Visual Identity            | tool     | capabilities                         |
| Apparel Design             | tool     | capabilities                         |
| Online Shopping Experience | platform | capabilities, `homeV2.worlds.brands` |
| Content & Marketing        | tool     | capabilities                         |

**Homepage:** all 8 above.

### Restaurant Platform (`restaurant-platform`)

| Technology   | Category  | Evidence                                 |
| ------------ | --------- | ---------------------------------------- |
| Next.js      | framework | `restaurant-platform.ts`, `projectFacts` |
| React        | library   | same                                     |
| TypeScript   | language  | same                                     |
| Tailwind CSS | library   | same                                     |
| REST APIs    | protocol  | same                                     |

**Homepage / case study:** all 5 (only verified stack in this repo).

### Alexa AI (`alexa-ai`)

| Technology | Category  | Evidence                               |
| ---------- | --------- | -------------------------------------- |
| Ollama     | platform  | `alexa-ai.ts`, case study Architecture |
| FastAPI    | framework | same                                   |
| Next.js    | framework | same                                   |
| TypeScript | language  | same                                   |
| SQLite     | database  | case study Memory System               |
| ChromaDB   | database  | same                                   |
| Local LLMs | ai        | `projectFacts.alexa-ai`                |

**Homepage:** all 7.

### Texas Funds (`texas-funds`)

| Technology       | Category | Evidence                         |
| ---------------- | -------- | -------------------------------- |
| Telegram Bot API | platform | `texas-funds.ts`, `projectFacts` |
| Automation       | tool     | same                             |

**Homepage:** both (only verified implementation technologies).

### Cybersecurity Lab (`cybersecurity-lab`)

| Technology               | Category | Evidence                               |
| ------------------------ | -------- | -------------------------------------- |
| Linux                    | platform | `cybersecurity-lab.ts`, `projectFacts` |
| Python                   | language | same, case study                       |
| Networking               | tool     | same                                   |
| Web Technologies         | tool     | same                                   |
| Web Security             | security | capabilities                           |
| API Security             | security | capabilities                           |
| Vulnerability Assessment | security | capabilities                           |
| Active Directory         | platform | capabilities, `homeV2.worlds.security` |
| Red Team Methodology     | security | capabilities, case study               |

**Homepage:** 8-item subset (omits API Security on homepage to fit limit).

### Automation Lab (`automation-lab`)

| Technology       | Category | Evidence                                                       |
| ---------------- | -------- | -------------------------------------------------------------- |
| n8n              | platform | `automation-lab.ts`, `projectFacts`, intelligence architecture |
| API Integrations | tool     | same                                                           |
| AI Workflows     | ai       | same                                                           |

**Case study only** on homepage intelligence section (Alexa stack shown there).

### Alex Linux (`alex-linux`)

| Technology | Category | Evidence                        |
| ---------- | -------- | ------------------------------- |
| Linux      | platform | `alex-linux.ts`, `projectFacts` |

**Case study only.**

### Upcoming (`upcoming`)

Empty stack — `technologies: []` in registry.

---

## Technologies omitted (insufficient evidence in this repo)

| Technology                               | Why omitted                                              |
| ---------------------------------------- | -------------------------------------------------------- |
| Supabase, PostgreSQL, Prisma             | No references anywhere in portfolio repo                 |
| ESC/POS, Windows Spooler, Vitest, Vercel | Not documented for restaurant in this workspace          |
| Stripe, Shopify, WooCommerce             | Not documented for Gymura                                |
| Python (Alexa AI)                        | Not named in alexa-ai registry/case study (FastAPI only) |
| Node.js (Texas Funds)                    | Not in `texas-funds.ts` or case study                    |
| Telegraf / aiogram                       | Bot framework not documented                             |
| Burp Suite, Nmap, OWASP                  | Not named in cybersecurity content                       |
| Docker, AWS, Redis, MongoDB              | No project attribution                                   |

> **Note:** This portfolio repo documents stacks in typed content; linked application repositories were not present for direct `package.json` audit. All entries trace to `src/content/projects/*.ts` and `src/content/translations/en.ts`.

---

## Homepage placement

| Section                    | Project       | Placement                                      |
| -------------------------- | ------------- | ---------------------------------------------- |
| `WorldBrandsSection`       | Gymura        | After status/role, before brand evolution rail |
| `WorldSystemsSection`      | Restaurant    | After intro copy, before workflow band         |
| `SystemsTexasFundsBranch`  | Texas Funds   | After description, before case study link      |
| `IntelligenceArchitecture` | Alexa AI      | After header copy, before architecture diagram |
| `WorldSecuritySection`     | Cybersecurity | After intro paragraphs, before discipline rail |

Live preview frames unchanged.

---

## Case-study placement

`ProjectTechStack` added after `ProjectFacts` on `/[locale]/projects/[slug]` — full verified stack, all public projects except `upcoming`.

---

## English / Arabic behavior

| Item             | EN                         | AR                                         |
| ---------------- | -------------------------- | ------------------------------------------ |
| Section label    | Tech Stack                 | التقنيات المستخدمة                         |
| Title alignment  | LTR left                   | RTL right                                  |
| Badge row        | LTR wrap                   | `dir="rtl"`, `justify-content: flex-start` |
| Technology names | Latin in `<bdi dir="ltr">` | same                                       |

---

## Mobile behavior

- Pills wrap naturally; no horizontal scroll
- Compact sizing at `max-width: 639px` (32–34px height)
- Screenshots at 390×844 and 320×568 captured

---

## Accessibility

- Semantic `<section>` + `<h3>` + `<ul>` / `<li>`
- Decorative logos `aria-hidden`
- External links: `ExternalLink` + screen-reader new-tab hint
- Non-link badges: no keyboard focus trap
- `focus-visible` ring on linked badges only

---

## Performance impact

- No new npm packages
- CSS ~3 KB; SVG icons inlined in one component
- No layout shift (badges in document flow with reserved pill height)
- No impact on Three.js, World Core, or Live Preview

---

## Files created

- `src/lib/projects/tech-types.ts`
- `src/lib/projects/tech-catalog.ts`
- `src/lib/projects/project-tech-stacks.ts`
- `src/components/projects/ProjectTechStack.tsx`
- `src/components/projects/TechnologyBadge.tsx`
- `src/components/projects/tech-icons/TechIcon.tsx`
- `src/components/projects/project-tech-stack.css`
- `scripts/project-tech-stack-screenshots.mjs`
- `docs/PROJECT_TECH_STACK_REPORT.md`

## Files modified

- `src/content/translations/types.ts` — `techStackLabel`
- `src/content/translations/en.ts` — `Tech Stack`
- `src/content/translations/ar.ts` — `التقنيات المستخدمة`
- `src/components/v2/WorldBrandsSection.tsx`
- `src/components/v2/WorldSystemsSection.tsx`
- `src/components/v2/SystemsTexasFundsBranch.tsx`
- `src/components/v2/IntelligenceArchitecture.tsx`
- `src/components/v2/WorldSecuritySection.tsx`
- `src/app/[locale]/projects/[slug]/page.tsx`

---

## Screenshot paths

`docs/evidence/project-tech-stack/`

- `homepage-gymura-en-desktop.png`
- `homepage-gymura-ar-desktop.png`
- `homepage-restaurant-en-desktop.png`
- `homepage-restaurant-ar-desktop.png`
- `homepage-texas-en-desktop.png`
- `homepage-intelligence-en-desktop.png`
- `homepage-gymura-en-mobile-390.png`
- `homepage-gymura-ar-mobile-390.png`
- `homepage-restaurant-en-mobile-390.png`
- `homepage-restaurant-ar-mobile-390.png`
- `homepage-gymura-en-mobile-320.png`
- `casestudy-gymura-en.png`
- `casestudy-gymura-ar.png`

---

## Validation results

| Command                | Result              |
| ---------------------- | ------------------- |
| `npm run type-check`   | Pass                |
| `npm run lint`         | Pass                |
| `npm run format:check` | Pass                |
| `npm run build`        | Pass (48 SSG pages) |

---

## Known limitations

1. Stack evidence is portfolio-documentation-based; application repo `package.json` files were not in this workspace.
2. Gymura shows brand/commerce stack (no implementation frameworks documented).
3. Texas Funds shows only 2 verified implementation technologies.
4. Restaurant stack is limited to 5 registry entries — no database/deployment chips until documented.
5. `ProjectFacts` still lists legacy `technologies` text row separately from visual Tech Stack badges.

---

## Items requiring Alex approval

1. **Restaurant extended stack** — add Supabase, PostgreSQL, Vercel, Vitest, ESC/POS, etc. only after linking architecture docs or repo evidence.
2. **Gymura implementation stack** — if Gymura storefront uses a specific CMS/framework, document it in `gymura.ts` before adding badges.
3. **Texas Funds runtime** — confirm bot language/framework for additional badges.
4. **Cybersecurity tools** — approve naming specific tools (Nmap, Burp) if desired on case study.
5. **Replace `ProjectFacts` technologies row** with Tech Stack-only display to avoid duplication (optional UX cleanup).
