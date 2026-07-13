/**
 * Capture production homepage orbital Hero evidence.
 * Requires: npm run build && npx next start -p <port>
 * Run: node scripts/production-orbital-hero-screenshots.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.PRODUCTION_HERO_URL ?? "http://localhost:3032";
const OUT = path.join("docs", "evidence", "production-orbital-hero");

const DESKTOP_CAPTURES = [
  { locale: "en", width: 1440, height: 900, name: "en-1440x900.png" },
  { locale: "ar", width: 1440, height: 900, name: "ar-1440x900.png" },
  { locale: "en", width: 1280, height: 800, name: "en-1280x800.png" },
  { locale: "ar", width: 1280, height: 800, name: "ar-1280x800.png" },
];

const MOBILE_CAPTURES = [
  { locale: "en", width: 390, height: 844, name: "en-390x844.png" },
  { locale: "ar", width: 390, height: 844, name: "ar-390x844.png" },
  { locale: "en", width: 320, height: 568, name: "en-320x568.png" },
  { locale: "ar", width: 320, height: 568, name: "ar-320x568.png" },
];

async function captureHero(page, outPath, { scrollVisual = false } = {}) {
  await page.waitForSelector(".lovable-portrait__image, .orbital-hero-portrait__image", {
    timeout: 30000,
  });
  if (scrollVisual) {
    const visual = page.locator("[data-lovable-hero-visual], [data-orbital-hero-visual]").first();
    if (await visual.count()) {
      await visual.scrollIntoViewIfNeeded();
    }
  }
  await page.waitForTimeout(2500);
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`Saved ${outPath}`);
}

async function compositeSideBySide(leftPath, rightPath, outPath, labelLeft, labelRight) {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn("sharp unavailable — skipping composite", outPath);
    return;
  }

  const left = sharp(leftPath).resize(720, 900, { fit: "contain", background: "#05070b" });
  const right = sharp(rightPath).resize(720, 900, { fit: "contain", background: "#05070b" });
  const [leftBuf, rightBuf] = await Promise.all([left.toBuffer(), right.toBuffer()]);

  const svg = `
    <svg width="1480" height="940">
      <rect width="1480" height="940" fill="#05070b"/>
      <text x="360" y="28" fill="#8ea0b8" font-family="sans-serif" font-size="14" text-anchor="middle">${labelLeft}</text>
      <text x="1120" y="28" fill="#8ea0b8" font-family="sans-serif" font-size="14" text-anchor="middle">${labelRight}</text>
    </svg>`;

  await sharp(Buffer.from(svg))
    .composite([
      { input: leftBuf, left: 20, top: 40 },
      { input: rightBuf, left: 760, top: 40 },
    ])
    .png()
    .toFile(outPath);
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
  const browser = await chromium.launch({ headless: true });

  for (const spec of DESKTOP_CAPTURES) {
    const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height } });
    await page.goto(`${BASE}/${spec.locale}`, { waitUntil: "networkidle", timeout: 90000 });
    await captureHero(page, path.join(OUT, spec.name));
    await page.close();
  }

  for (const spec of MOBILE_CAPTURES) {
    const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height } });
    await page.goto(`${BASE}/${spec.locale}`, { waitUntil: "networkidle", timeout: 90000 });
    await captureHero(page, path.join(OUT, spec.name), { scrollVisual: true });
    await page.close();
  }

  // WebGL disabled — static SVG rings fallback
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
          return null;
        }
        return original.call(this, type, ...args);
      };
    });
    await page.goto(`${BASE}/en`, { waitUntil: "networkidle", timeout: 90000 });
    await captureHero(page, path.join(OUT, "en-1440x900-webgl-disabled.png"));
    await page.close();
  }

  // Reduced motion — no WebGL rings
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE}/en`, { waitUntil: "networkidle", timeout: 90000 });
    await captureHero(page, path.join(OUT, "en-1440x900-reduced-motion.png"));
    await page.close();
  }

  // Lab route still works (shared visual)
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/en/three-hero-lab`, { waitUntil: "networkidle", timeout: 90000 });
    await captureHero(page, path.join(OUT, "lab-en-1440x900-still-works.png"));
    await page.close();
  }

  await browser.close();

  const legacy = path.join(OUT, "en-1440x900-legacy-workstation.png");
  const orbital = path.join(OUT, "en-1440x900.png");
  try {
    const { access } = await import("node:fs/promises");
    await access(legacy);
    await compositeSideBySide(
      legacy,
      orbital,
      path.join(OUT, "before-legacy-vs-after-orbital.png"),
      "Legacy workstation Hero",
      "Production orbital Hero",
    );
  } catch {
    console.warn(
      "Legacy screenshot missing — run legacy capture separately for before/after composite.",
    );
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
