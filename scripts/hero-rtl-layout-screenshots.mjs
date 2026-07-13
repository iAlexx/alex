/**
 * Capture Arabic Hero RTL layout evidence.
 * Requires: npm run build && npx next start -p <port>
 * Run: node scripts/hero-rtl-layout-screenshots.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.HERO_RTL_URL ?? "http://localhost:3048";
const OUT = path.join("docs", "evidence", "hero-rtl-layout-fix");

const CAPTURES = [
  { locale: "en", width: 1440, height: 900, name: "en-desktop-1440x900.png" },
  { locale: "ar", width: 1440, height: 900, name: "ar-desktop-1440x900.png" },
  { locale: "en", width: 390, height: 844, name: "en-mobile-390x844.png" },
  { locale: "ar", width: 390, height: 844, name: "ar-mobile-390x844.png" },
];

async function captureHero(page, outPath) {
  await page.waitForSelector(".lovable-portrait__image", { timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`Saved ${outPath}`);
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("Playwright not installed. Run: npx playwright install chromium");
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const cap of CAPTURES) {
    const page = await browser.newPage({ viewport: { width: cap.width, height: cap.height } });
    await page.goto(`${BASE}/${cap.locale}`, { waitUntil: "networkidle" });
    await captureHero(page, path.join(OUT, cap.name));
    await page.close();
  }

  await browser.close();
  console.log(`Evidence saved to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
