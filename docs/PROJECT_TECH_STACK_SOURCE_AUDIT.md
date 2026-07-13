# Project Tech Stack Source Audit

**Date:** 2026-07-13  
**Scope:** Gymura + Texas Funds Bot — source-repository evidence update  
**Portfolio modified only** — source repos read-only

---

## Source paths

| Project         | Repository path                          |
| --------------- | ---------------------------------------- |
| Gymura          | `C:/Users/Master aLEX/Desktop/GYMURA`    |
| Texas Funds Bot | `C:/Users/Master aLEX/Desktop/api texas` |

---

## Files inspected

### Gymura

- `package.json`, `package-lock.json`
- `tsconfig.json`, `next.config.ts`
- `DEPLOYMENT.md`, `ARCHITECT_MAP.md`, `SECURITY_REWARDS.md`
- `supabase/schema.sql`, `supabase/migrations/`
- `src/lib/supabase/server.ts`, `client.ts`, `admin.ts`
- `src/lib/validation/schemas.ts`
- `src/lib/store/useCart.ts`
- `src/app/api/admin/generate-report/route.ts`
- `src/lib/seo/site.ts`

### Texas Funds Bot

- `package.json`
- `tsconfig.json`, `next.config.mjs`
- `README.md`, `.env.example`, `railway.toml`
- `supabase/migrations/`, `supabase/README.md`
- `src/lib/telegram/bot-api.ts`, `userbot-client.ts`, `process-update.ts`
- `src/app/api/telegram/webhook/route.ts`
- `src/lib/report/report-screenshot.ts`
- `src/instrumentation.ts`
- `scripts/telegram-poll-dev.ts`, `set-telegram-webhook.ts`

---

## Gymura — confirmed technologies

| Technology   | Category   | Evidence                                                              |
| ------------ | ---------- | --------------------------------------------------------------------- |
| Next.js      | framework  | `package.json` (`next@16.2.6`), `next build` scripts                  |
| TypeScript   | language   | `package.json` devDependency, `tsconfig.json`, `.ts`/`.tsx` sources   |
| React        | library    | `package.json` (`react@19.2.4`)                                       |
| Tailwind CSS | library    | `package.json` (`tailwindcss@4`, `@tailwindcss/postcss`)              |
| Supabase     | platform   | `@supabase/ssr`, `@supabase/supabase-js`; `src/lib/supabase/*`        |
| PostgreSQL   | database   | `supabase/schema.sql` header; migrations; `postgres_changes` realtime |
| Vercel       | deployment | `DEPLOYMENT.md`; `VERCEL_URL` in `src/lib/seo/site.ts`                |
| Zod          | library    | `package.json`; `src/lib/validation/schemas.ts`                       |
| Zustand      | library    | `package.json`; `src/lib/store/useCart.ts`                            |
| Resend       | platform   | `package.json`; `src/app/api/admin/generate-report/route.ts`          |

### Gymura — removed from Tech Stack (capabilities, not technologies)

- E-commerce
- Brand Identity
- Product Design
- Brand Strategy
- Visual Identity
- Apparel Design
- Online Shopping Experience
- Content & Marketing

These remain in project copy, brand evolution rail, and `projectFacts` — not in `Tech Stack`.

### Gymura — considered but not confirmed

| Item                  | Reason omitted                                                                  |
| --------------------- | ------------------------------------------------------------------------------- |
| Stripe                | `stripe_session_id` column in schema only; no `stripe` npm package or imports   |
| Shopify / WooCommerce | No dependencies or integration code                                             |
| Framer Motion         | Present in `package.json` but omitted from homepage stack (animation UI helper) |

### Gymura final stacks

**Homepage (8):** Next.js, TypeScript, React, Tailwind CSS, Supabase, PostgreSQL, Vercel, Zod

**Case study (10):** homepage + Zustand, Resend

---

## Texas Funds — confirmed technologies

| Technology       | Category   | Evidence                                                           |
| ---------------- | ---------- | ------------------------------------------------------------------ |
| TypeScript       | language   | `package.json`, `tsconfig.json`, `npm run typecheck`               |
| Next.js          | framework  | `package.json` (`next@14`), App Router routes under `src/app/`     |
| React            | library    | `package.json` (`react@18`)                                        |
| Tailwind CSS     | library    | `package.json` (`tailwindcss@3`)                                   |
| Supabase         | platform   | `@supabase/supabase-js`; `src/lib/supabase/*`; `db:*` scripts      |
| PostgreSQL       | database   | `README.md` "Supabase (PostgreSQL, RLS)"; `supabase/migrations/`   |
| Telegram Bot API | platform   | `src/lib/telegram/bot-api.ts` → `api.telegram.org`                 |
| Webhooks         | protocol   | Production `src/app/api/telegram/webhook/route.ts`; `.env.example` |
| GramJS           | library    | `telegram` npm package; `TelegramClient` in `userbot-client.ts`    |
| Puppeteer        | tool       | `puppeteer-core` dependency; `report-screenshot.ts`                |
| Railway          | deployment | `railway.toml`, `README.md`, `.env.example`                        |
| Sentry           | tool       | `@sentry/node`; `src/instrumentation.ts`                           |
| Zod              | library    | `package.json`; validation under `src/lib/validation/`             |

### Texas Funds — integration modes

- **Production:** Telegram webhooks (`/api/telegram/webhook`)
- **Local dev:** Polling via `npm run telegram:poll` (documented in README)

### Texas Funds — replaced / omitted

| Item                                     | Action                                                          |
| ---------------------------------------- | --------------------------------------------------------------- |
| Automation (generic)                     | **Removed** — no specific tool confirmed under that label       |
| Telegraf / aiogram / python-telegram-bot | **Omitted** — project uses TypeScript + direct Bot API + GramJS |

### Texas Funds — considered but not confirmed for homepage

| Item                | Reason                                                          |
| ------------------- | --------------------------------------------------------------- |
| Axios               | HTTP client present; less architectural than core stack         |
| WhatsApp / Wasender | Optional channel; env-gated, not core Telegram product identity |

### Texas Funds final stacks

**Homepage (7):** TypeScript, Next.js, Supabase, PostgreSQL, Telegram Bot API, Webhooks, Railway

**Case study (13):** homepage + React, Tailwind CSS, GramJS, Puppeteer, Sentry, Zod

---

## Icon additions

New local SVG icons in `TechIcon.tsx`:

- `supabase`, `postgresql`, `vercel`, `railway`
- `zod`, `zustand`, `resend`
- `webhook`, `gramjs`, `puppeteer`, `sentry`

No new npm icon dependencies.

---

## Files modified (portfolio only)

- `src/lib/projects/tech-types.ts` — added `deployment` category
- `src/lib/projects/tech-catalog.ts` — source-audited entries; removed capability pseudo-tech + generic Automation
- `src/lib/projects/project-tech-stacks.ts` — Gymura + Texas Funds stacks
- `src/components/projects/tech-icons/TechIcon.tsx` — new icons
- `docs/PROJECT_TECH_STACK_SOURCE_AUDIT.md` — this report

**Unchanged:** UI components, section layout, project copy, live preview, Hero, World Core, SEO.

---

## Validation

| Command                | Result |
| ---------------------- | ------ |
| `npm run type-check`   | Pass   |
| `npm run lint`         | Pass   |
| `npm run format:check` | Pass   |
| `npm run build`        | Pass   |
