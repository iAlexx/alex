# Alex Portfolio

A premium, bilingual (English / Arabic), cinematic portfolio for **Alex** — Product Builder, Full-Stack Developer, AI Systems & Automation, Cybersecurity.

The full product specification lives in [`ALEX_PORTFOLIO_ROADMAP.md`](./ALEX_PORTFOLIO_ROADMAP.md). All build phases follow that roadmap.

## Current Status

- Phase 0 — Repository & Environment: complete
- Phase 1 — Content Foundation: complete
- Phase 4 — Project Case Study Pages: complete
- Phase 4.1 — Live website previews (Gymura, Restaurant Platform) and RTL/layout fixes: complete
- Phases 5+ (full Arabic QA, Gymura cinematic GSAP, global 3D): not started

## Stack

- Next.js (App Router) + React + strict TypeScript
- Tailwind CSS
- GSAP / ScrollTrigger and React Three Fiber will be added in later phases only

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en).

See [`docs/live-website-preview.md`](./docs/live-website-preview.md) for iframe embedding limitations and required CSP changes on **gymura.store** and **alnkha.site**.

## Scripts

| Script                 | Purpose                     |
| ---------------------- | --------------------------- |
| `npm run dev`          | Development server          |
| `npm run build`        | Production build            |
| `npm run lint`         | ESLint                      |
| `npm run type-check`   | TypeScript (`tsc --noEmit`) |
| `npm run format`       | Prettier write              |
| `npm run format:check` | Prettier check              |

## Architecture Principles

- All personal and project content lives in typed configuration under `src/content/`. Layout code never hardcodes profile values.
- Single source of truth for profile data: `src/content/profile/profile.ts` (professional email is `null` until one exists — UI must hide email actions).
- Project data follows the `PortfolioProject` model in `src/content/projects/types.ts`. No date fields, no fake metrics, honest statuses only.
- Bilingual by design: `/en` and `/ar` routes, LTR/RTL aware. Arabic content is completed in Phase 5.

## Branch Strategy

- `main` — stable, always builds
- `phase/<n>-<name>` — one branch per roadmap phase, merged into `main` after lint, type-check, and production build pass
