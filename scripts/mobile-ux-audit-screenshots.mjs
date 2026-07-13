/**
 * Mobile UX audit evidence — captures section screenshots at mobile viewports.
 * Requires: npm run build && npx next start -p <port>
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.MOBILE_UX_URL ?? "http://localhost:3067";
const OUT = path.join("docs", "evidence", "mobile-ux-refinement", "audit-before");

const VIEWPORTS = [
  { w: 430, h: 932, tag: "430x932" },
  { w: 390, h: 844, tag: "390x844" },
  { w: 375, h: 667, tag: "375x667" },
  { w: 360, h: 800, tag: "360x800" },
  { w: 320, h: 568, tag: "320x568" },
];

const LOCALES = ["en", "ar"];

const SECTIONS = [
  { id: "hero", name: "hero" },
  { id: "method", name: "method" },
  { id: "world-brands", name: "gymura" },
  { id: "world-systems", name: "restaurant" },
  { id: "world-systems-texas", name: "texas" },
  { id: "world-intelligence", name: "intelligence" },
  { id: "world-security", name: "cybersecurity" },
  { id: "future", name: "future" },
  { id: "manifesto", name: "manifesto" },
  { id: "contact", name: "contact" },
];

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const locale of LOCALES) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
      await page.goto(`${BASE}/${locale}`, { waitUntil: "networkidle", timeout: 90000 });

      for (const section of SECTIONS) {
        const el = page.locator(`#${section.id}`);
        if ((await el.count()) === 0) continue;
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(600);
        const file = path.join(OUT, `${locale}-${section.name}-${vp.tag}.png`);
        await page.screenshot({ path: file });
      }

      await page.screenshot({
        path: path.join(OUT, `${locale}-fullpage-${vp.tag}.png`),
        fullPage: true,
      });
      console.log("captured", locale, vp.tag);
      await page.close();
    }
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
