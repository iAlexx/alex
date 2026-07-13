# aalex.me — Vercel Deployment Checklist

Use this checklist when connecting **aalex.me** and **www.aalex.me** to the portfolio on Vercel.

## Before you start

- [ ] GitHub repository is pushed and builds cleanly (`npm run build`)
- [ ] You have access to **Vercel** and **Hostinger DNS**
- [ ] You are **not** deleting MX, SPF, DKIM, DMARC, or unrelated TXT records

## 1. Vercel project

1. Import or open the portfolio repository in Vercel.
2. Confirm settings:
   - **Framework:** Next.js (auto-detected)
   - **Build command:** `npm run build`
   - **Install command:** `npm install`
   - **Output:** default (Next.js)
   - **Node.js:** 20.x (or latest LTS Vercel offers)
3. Add environment variable for **Production** (and Preview if desired):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SITE_URL` | `https://aalex.me` |

4. Deploy once and confirm the `.vercel.app` preview loads `/en` and `/ar`.

## 2. Add domains in Vercel

1. **Project → Settings → Domains**
2. Add **`aalex.me`**
3. Add **`www.aalex.me`**
4. Set **`aalex.me`** as the **primary** domain
5. Configure **`www.aalex.me`** to **redirect permanently** to **`https://aalex.me`**

   > `vercel.json` in the repo also declares a www → apex redirect. Use **one** source of truth in Vercel; avoid duplicate conflicting redirects.

## 3. Copy DNS records from Vercel (do not guess)

1. In the Vercel domain panel, open DNS instructions for **`aalex.me`**
2. Copy the **exact** records Vercel shows (A / ALIAS / CNAME — whatever Vercel provides for your plan)
3. Repeat for **`www.aalex.me`**

**Do not** hardcode assumed IP addresses in Hostinger. Always use the values shown in **your** Vercel project.

## 4. Hostinger DNS zone

1. Log in to Hostinger → **Domains** → **aalex.me** → **DNS / DNS Zone**
2. Remove **only** conflicting records for:
   - Apex (`@` or root)
   - `www`
3. **Keep** email-related records (MX, SPF, DKIM, DMARC) and unrelated TXT verification records
4. Add the Vercel records exactly as copied from step 3
5. Save changes

## 5. Wait for propagation & SSL

- [ ] DNS propagation (often 5–60 minutes; sometimes up to 24h)
- [ ] Vercel shows both domains as **Valid**
- [ ] HTTPS certificate issued for apex and www

## 6. Post-deploy smoke tests

Open in a browser (production):

- [ ] `https://aalex.me` → loads site (redirects to `/en` or locale)
- [ ] `https://www.aalex.me` → **301** to `https://aalex.me`
- [ ] `https://aalex.me/en` and `https://aalex.me/ar`
- [ ] View page source: canonical URLs use `https://aalex.me` (not localhost, not `.vercel.app`)
- [ ] `https://aalex.me/robots.txt`
- [ ] `https://aalex.me/sitemap.xml` (no lab routes)
- [ ] `https://aalex.me/manifest.webmanifest`
- [ ] `https://aalex.me/en/opengraph-image` (1200×630)
- [ ] Lab routes return `noindex, nofollow` if visited directly:
  - `/en/hero-lab`, `/en/three-hero-lab`, `/en/codex-hero-lab` (+ `/ar` variants)

## 7. Optional automated verification (local against production)

After deploy, you can re-run against production:

```bash
RELEASE_VERIFY_URL=https://aalex.me \
RELEASE_CANONICAL_HOST=aalex.me \
node scripts/final-release-verify.mjs
```

## 8. Social / OG preview

Paste `https://aalex.me/en` into:

- LinkedIn post inspector
- WhatsApp / Telegram link preview
- X (Twitter) card validator

Confirm title, description, and OG image render correctly.

---

**Primary domain:** `https://aalex.me`  
**Redirect:** `www.aalex.me` → apex  
**Required env:** `NEXT_PUBLIC_SITE_URL=https://aalex.me`
