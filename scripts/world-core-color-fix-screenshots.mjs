/**
 * Evidence for world core color activation fix.
 * Requires: npm run build && npx next start -p <port>
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.WORLD_CORE_FIX_URL ?? "http://localhost:3042";
const OUT = path.join("docs", "evidence", "world-core-color-fix");

async function scrollTo(page, id, block = "center") {
  await page.evaluate(
    ({ sectionId, blockPos }) => {
      document.getElementById(sectionId)?.scrollIntoView({ block: blockPos });
    },
    { sectionId: id, blockPos: block },
  );
  await page.waitForTimeout(1400);
}

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  const desktopShots = [
    { name: "01-hero-before-gymura-1440x900.png", scroll: "method", locale: "en" },
    { name: "02-gymura-active-1440x900.png", scroll: "world-brands", locale: "en" },
    {
      name: "03-between-gymura-systems-1440x900.png",
      scroll: "world-systems",
      block: "end",
      locale: "en",
    },
    { name: "04-systems-active-1440x900.png", scroll: "world-systems", locale: "en" },
    {
      name: "05-between-systems-intelligence-1440x900.png",
      scroll: "world-intelligence",
      block: "end",
      locale: "en",
    },
    { name: "06-intelligence-active-1440x900.png", scroll: "world-intelligence", locale: "en" },
    { name: "07-security-active-1440x900.png", scroll: "world-security", locale: "en" },
    { name: "ar-gymura-active-1440x900.png", scroll: "world-brands", locale: "ar" },
    { name: "ar-security-active-1440x900.png", scroll: "world-security", locale: "ar" },
  ];

  for (const shot of desktopShots) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/${shot.locale}`, { waitUntil: "networkidle", timeout: 90000 });
    await scrollTo(page, shot.scroll, shot.block ?? "center");
    await page.screenshot({ path: path.join(OUT, shot.name) });
    console.log("Saved", shot.name);
    await page.close();
  }

  const mobileShots = [
    { name: "en-hero-before-gymura-390x844.png", scroll: "method", locale: "en", w: 390, h: 844 },
    { name: "en-gymura-active-390x844.png", scroll: "world-brands", locale: "en", w: 390, h: 844 },
    {
      name: "en-restaurant-active-390x844.png",
      scroll: "world-systems",
      locale: "en",
      w: 390,
      h: 844,
    },
    { name: "ar-gymura-active-390x844.png", scroll: "world-brands", locale: "ar", w: 390, h: 844 },
  ];

  for (const shot of mobileShots) {
    const page = await browser.newPage({ viewport: { width: shot.w, height: shot.h } });
    await page.goto(`${BASE}/${shot.locale}`, { waitUntil: "networkidle", timeout: 90000 });
    await scrollTo(page, shot.scroll);
    await page.screenshot({ path: path.join(OUT, shot.name) });
    console.log("Saved", shot.name);
    await page.close();
  }

  // Scroll recording: hero → gymura → systems → intelligence
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    await page.goto(`${BASE}/en`, { waitUntil: "networkidle", timeout: 90000 });
    for (const id of [
      "hero",
      "method",
      "world-brands",
      "world-systems",
      "world-intelligence",
      "world-security",
    ]) {
      await scrollTo(page, id);
    }
    await page.close();
    await context.close();
    console.log("Saved scroll recording (see playwright output video in folder)");
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
