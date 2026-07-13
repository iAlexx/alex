/**
 * Evidence for hero blend + world core layering fix.
 * Requires: npm run build && npx next start -p <port>
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BLEND_FIX_URL ?? "http://localhost:3045";
const OUT = path.join("docs", "evidence", "hero-blend-layering-fix");

async function scrollTo(page, id) {
  await page.evaluate((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ block: "center" });
  }, id);
  await page.waitForTimeout(1400);
}

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  const shots = [
    { name: "hero-desktop-1440x900.png", locale: "en", w: 1440, h: 900, scroll: "hero" },
    { name: "hero-mobile-390x844.png", locale: "en", w: 390, h: 844, scroll: "hero" },
    { name: "method-readable-1440x900.png", locale: "en", w: 1440, h: 900, scroll: "method" },
    { name: "gymura-readable-1440x900.png", locale: "en", w: 1440, h: 900, scroll: "world-brands" },
    {
      name: "intelligence-readable-1440x900.png",
      locale: "en",
      w: 1440,
      h: 900,
      scroll: "world-intelligence",
    },
    {
      name: "ar-gymura-readable-1440x900.png",
      locale: "ar",
      w: 1440,
      h: 900,
      scroll: "world-brands",
    },
  ];

  for (const shot of shots) {
    const page = await browser.newPage({ viewport: { width: shot.w, height: shot.h } });
    await page.goto(`${BASE}/${shot.locale}`, { waitUntil: "networkidle", timeout: 90000 });
    await scrollTo(page, shot.scroll);
    await page.screenshot({ path: path.join(OUT, shot.name) });
    console.log("Saved", shot.name);
    await page.close();
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
