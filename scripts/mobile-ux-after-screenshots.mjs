/**
 * Mobile UX refinement — after screenshots + before/after composites.
 * Requires: npm run build && npx next start -p <port>
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const BASE = process.env.MOBILE_UX_URL ?? "http://localhost:3067";
const ROOT = path.join("docs", "evidence", "mobile-ux-refinement");
const OUT = path.join(ROOT, "audit-after");
const BEFORE = path.join(ROOT, "audit-before");
const COMPOSITES = path.join(ROOT, "composites");

const VIEWPORTS = [
  { w: 390, h: 844, tag: "390x844" },
  { w: 320, h: 568, tag: "320x568" },
];

const LOCALES = ["en", "ar"];

const SECTIONS = [
  { id: "hero", name: "hero" },
  { id: "world-brands", name: "gymura" },
  { id: "world-systems", name: "restaurant" },
  { id: "world-intelligence", name: "intelligence" },
  { id: "world-security", name: "cybersecurity" },
  { id: "manifesto", name: "manifesto" },
  { id: "contact", name: "contact" },
];

const COMPOSITE_SECTIONS = ["hero", "gymura", "restaurant", "cybersecurity"];

async function captureSections(browser) {
  await mkdir(OUT, { recursive: true });

  for (const locale of LOCALES) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
      await page.goto(`${BASE}/${locale}`, { waitUntil: "networkidle", timeout: 90000 });

      for (const section of SECTIONS) {
        const el = page.locator(`#${section.id}`);
        if ((await el.count()) === 0) continue;
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(700);
        await page.screenshot({
          path: path.join(OUT, `${locale}-${section.name}-${vp.tag}.png`),
        });
      }

      await page.screenshot({
        path: path.join(OUT, `${locale}-fullpage-scroll-${vp.tag}.png`),
        fullPage: true,
      });
      console.log("after captured", locale, vp.tag);
      await page.close();
    }
  }
}

async function buildComposites(browser) {
  await mkdir(COMPOSITES, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 420, height: 2400 } });

  for (const locale of ["en"]) {
    for (const section of COMPOSITE_SECTIONS) {
      const beforePath = path.resolve(BEFORE, `${locale}-${section}-390x844.png`);
      const afterPath = path.resolve(OUT, `${locale}-${section}-390x844.png`);
      const beforeUrl = pathToFileURL(beforePath).href;
      const afterUrl = pathToFileURL(afterPath).href;

      const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:16px;background:#0a0e14;color:#c5d0e6;font:600 13px/1.4 system-ui,sans-serif">
<p style="margin:0 0 8px;opacity:.85">Before — ${section}</p>
<img src="${beforeUrl}" width="390" alt="before" style="display:block;border:1px solid #1e2a3d;border-radius:8px" />
<p style="margin:20px 0 8px;opacity:.85">After — ${section}</p>
<img src="${afterUrl}" width="390" alt="after" style="display:block;border:1px solid #1e2a3d;border-radius:8px" />
</body></html>`;

      await page.setContent(html, { waitUntil: "load" });
      await page.waitForTimeout(200);
      await page.screenshot({
        path: path.join(COMPOSITES, `${locale}-${section}-before-after-390x844.png`),
        fullPage: true,
      });
      console.log("composite", section);
    }
  }

  await page.close();
}

async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  await captureSections(browser);
  await buildComposites(browser);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
