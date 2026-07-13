/**
 * World Core lighting/glow evidence — key world colors.
 * Requires: npm run build && npx next start -p <port>
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.WORLD_LIGHTING_URL ?? "http://localhost:3065";
const OUT = path.join("docs", "evidence", "world-core-lighting-glow");

const SHOTS = [
  { id: "hero", name: "after-hero-core-blue-1440x900.png", label: "Core blue" },
  { id: "world-brands", name: "after-gymura-silver-1440x900.png", label: "Gymura silver" },
  { id: "world-systems", name: "after-restaurant-amber-1440x900.png", label: "Restaurant amber" },
  {
    id: "world-intelligence",
    name: "after-intelligence-violet-1440x900.png",
    label: "Intelligence violet",
  },
  {
    id: "world-security",
    name: "after-cybersecurity-crimson-1440x900.png",
    label: "Cybersecurity crimson",
  },
];

async function scrollTo(page, id) {
  await page.evaluate((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ block: "center", behavior: "instant" });
  }, id);
  await page.waitForTimeout(1600);
}

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  let baseline = null;

  for (const shot of SHOTS) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/en`, { waitUntil: "networkidle", timeout: 90000 });
    await scrollTo(page, shot.id);
    await page.waitForSelector("[data-world-core-layer]", { timeout: 15000 });

    const box = await page.evaluate(() => {
      const el = document.querySelector("[data-world-core-layer]");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height, top: r.top, left: r.left };
    });

    if (!baseline && box) baseline = box;
    if (baseline && box) {
      const dw = Math.abs(box.w - baseline.w);
      const dh = Math.abs(box.h - baseline.h);
      if (dw > 1 || dh > 1) {
        console.warn("Size drift at", shot.label, baseline, box);
      }
    }

    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--world-accent-rgb").trim(),
    );
    console.log(shot.label, accent);

    await page.screenshot({ path: path.join(OUT, shot.name) });
    await page.close();
  }

  await browser.close();
  console.log("Saved to", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
