/**
 * Before/after World Core nucleus visibility — crops world-core-layer only.
 * Run twice: once before fix (LIGHTING_VARIANT=before), once after (after).
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.LIGHTING_URL ?? "http://localhost:3065";
const VARIANT = process.env.LIGHTING_VARIANT ?? "after";
const ROOT = path.join("docs", "evidence", "world-core-visible-lighting");
const OUT = path.join(ROOT, VARIANT);

const SHOTS = [
  { id: "hero", name: "hero-core-blue.png" },
  { id: "world-security", name: "cybersecurity-crimson.png" },
  { id: "world-brands", name: "gymura-silver.png" },
];

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const shot of SHOTS) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/en`, { waitUntil: "networkidle", timeout: 90000 });
    await page.evaluate((sectionId) => {
      document.getElementById(sectionId)?.scrollIntoView({ block: "center", behavior: "instant" });
    }, shot.id);
    await page.waitForTimeout(1800);
    const layer = page.locator("[data-world-core-layer]");
    await layer.waitFor({ timeout: 15000 });
    await layer.screenshot({ path: path.join(OUT, shot.name) });
    console.log(VARIANT, shot.name);
    await page.close();
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
