/**
 * Capture persistent World Core evidence from production runtime.
 * Requires: npm run build && npx next start -p <port>
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.WORLD_CORE_URL ?? "http://localhost:3040";
const OUT = path.join("docs", "evidence", "persistent-world-core");

const SCROLL_TARGETS = [
  { id: "hero", name: "en-hero-core-1440x900.png", locale: "en" },
  { id: "world-brands", name: "en-brands-gymura-1440x900.png", locale: "en" },
  { id: "world-systems", name: "en-systems-restaurant-1440x900.png", locale: "en" },
  { id: "world-intelligence", name: "en-intelligence-1440x900.png", locale: "en" },
  { id: "world-security", name: "en-security-1440x900.png", locale: "en" },
  { id: "future", name: "en-future-1440x900.png", locale: "en" },
  { id: "manifesto", name: "en-manifesto-1440x900.png", locale: "en" },
  { id: "contact", name: "en-contact-1440x900.png", locale: "en" },
  { id: "hero", name: "ar-hero-core-1440x900.png", locale: "ar" },
  { id: "world-brands", name: "ar-brands-1440x900.png", locale: "ar" },
  { id: "world-security", name: "ar-security-1440x900.png", locale: "ar" },
  { id: "contact", name: "ar-contact-1440x900.png", locale: "ar" },
];

const MOBILE_TARGETS = [
  { id: "hero", name: "en-hero-390x844.png", locale: "en", w: 390, h: 844 },
  { id: "world-brands", name: "en-gymura-390x844.png", locale: "en", w: 390, h: 844 },
  { id: "world-systems", name: "en-restaurant-390x844.png", locale: "en", w: 390, h: 844 },
  { id: "world-intelligence", name: "en-intelligence-390x844.png", locale: "en", w: 390, h: 844 },
  { id: "world-security", name: "en-security-390x844.png", locale: "en", w: 390, h: 844 },
  { id: "hero", name: "en-hero-320x568.png", locale: "en", w: 320, h: 568 },
  { id: "hero", name: "ar-hero-390x844.png", locale: "ar", w: 390, h: 844 },
  { id: "world-brands", name: "ar-gymura-390x844.png", locale: "ar", w: 390, h: 844 },
];

async function scrollToSection(page, id) {
  await page.evaluate((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ block: "center" });
  }, id);
  await page.waitForTimeout(1200);
}

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const t of SCROLL_TARGETS) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/${t.locale}`, { waitUntil: "networkidle", timeout: 90000 });
    await scrollToSection(page, t.id);
    await page.waitForSelector("[data-world-core-layer]", { timeout: 15000 });
    await page.screenshot({ path: path.join(OUT, t.name) });
    console.log("Saved", t.name);
    await page.close();
  }

  for (const t of MOBILE_TARGETS) {
    const page = await browser.newPage({ viewport: { width: t.w, height: t.h } });
    await page.goto(`${BASE}/${t.locale}`, { waitUntil: "networkidle", timeout: 90000 });
    await scrollToSection(page, t.id);
    await page.screenshot({ path: path.join(OUT, t.name) });
    console.log("Saved", t.name);
    await page.close();
  }

  // Reduced motion fallback
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE}/en`, { waitUntil: "networkidle", timeout: 90000 });
    await scrollToSection(page, "world-brands");
    await page.screenshot({ path: path.join(OUT, "en-brands-reduced-motion-1440x900.png") });
    console.log("Saved en-brands-reduced-motion-1440x900.png");
    await page.close();
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
