/**
 * Capture Project Tech Stack evidence screenshots.
 * Requires: npm run build && npx next start -p <port>
 * Run: node scripts/project-tech-stack-screenshots.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.TECH_STACK_URL ?? "http://localhost:3056";
const OUT = path.join("docs", "evidence", "project-tech-stack");

const CAPTURES = [
  { url: "/en#world-brands", name: "homepage-gymura-en-desktop.png", width: 1440, height: 900 },
  { url: "/ar#world-brands", name: "homepage-gymura-ar-desktop.png", width: 1440, height: 900 },
  {
    url: "/en#world-systems",
    name: "homepage-restaurant-en-desktop.png",
    width: 1440,
    height: 900,
  },
  {
    url: "/ar#world-systems",
    name: "homepage-restaurant-ar-desktop.png",
    width: 1440,
    height: 900,
  },
  { url: "/en#world-systems", name: "homepage-texas-en-desktop.png", width: 1440, height: 1200 },
  {
    url: "/en#world-intelligence",
    name: "homepage-intelligence-en-desktop.png",
    width: 1440,
    height: 900,
  },
  { url: "/en#world-brands", name: "homepage-gymura-en-mobile-390.png", width: 390, height: 844 },
  { url: "/ar#world-brands", name: "homepage-gymura-ar-mobile-390.png", width: 390, height: 844 },
  {
    url: "/en#world-systems",
    name: "homepage-restaurant-en-mobile-390.png",
    width: 390,
    height: 844,
  },
  {
    url: "/ar#world-systems",
    name: "homepage-restaurant-ar-mobile-390.png",
    width: 390,
    height: 844,
  },
  { url: "/en#world-brands", name: "homepage-gymura-en-mobile-320.png", width: 320, height: 568 },
  { url: "/en/projects/gymura", name: "casestudy-gymura-en.png", width: 1440, height: 900 },
  { url: "/ar/projects/gymura", name: "casestudy-gymura-ar.png", width: 1440, height: 900 },
];

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
    await page.goto(`${BASE}${cap.url}`, { waitUntil: "networkidle" });
    await page.waitForSelector(".project-tech-stack", { timeout: 30000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT, cap.name), fullPage: false });
    console.log(`Saved ${cap.name}`);
    await page.close();
  }

  await browser.close();
  console.log(`Evidence saved to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
