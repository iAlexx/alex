/**
 * Capture final Three Hero Lab screenshots from production runtime.
 * Requires: npm run build && npx next start -p <port>
 * Run: node scripts/three-hero-lab-screenshots.mjs
 */
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.THREE_HERO_LAB_URL ?? "http://localhost:3012";
const OUT = path.join("docs", "evidence", "three-hero-lab");
const REF = path.join(OUT, "references");

const DESKTOP_CAPTURES = [
  { locale: "en", width: 1440, height: 900, name: "en-1440x900-final.png" },
  { locale: "ar", width: 1440, height: 900, name: "ar-1440x900-final.png" },
  { locale: "en", width: 1280, height: 800, name: "en-1280x800-final.png" },
];

const MOBILE_CAPTURES = [
  { locale: "en", width: 390, height: 844, name: "en-390x844-final.png" },
  { locale: "ar", width: 390, height: 844, name: "ar-390x844-final.png" },
  { locale: "en", width: 320, height: 568, name: "en-320x568-final.png" },
];

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
    console.error("Playwright not installed.");
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });
  await mkdir(REF, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (const spec of DESKTOP_CAPTURES) {
    const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height } });
    await page.goto(`${BASE}/${spec.locale}/three-hero-lab`, {
      waitUntil: "networkidle",
      timeout: 90000,
    });
    await captureHero(page, path.join(OUT, spec.name));
    await page.close();
  }

  for (const spec of MOBILE_CAPTURES) {
    const page = await browser.newPage({ viewport: { width: spec.width, height: spec.height } });
    await page.goto(`${BASE}/${spec.locale}/three-hero-lab`, {
      waitUntil: "networkidle",
      timeout: 90000,
    });
    await page.locator("[data-lovable-hero-visual]").scrollIntoViewIfNeeded();
    await captureHero(page, path.join(OUT, spec.name));
    await page.close();
  }

  await browser.close();

  const refDesktop = path.join(REF, "reference-desktop.png");
  const refMobile = path.join(REF, "reference-mobile.png");
  const finalDesktop = path.join(OUT, "en-1440x900-final.png");
  const finalMobile = path.join(OUT, "en-390x844-final.png");

  if (
    await readFile(refDesktop)
      .then(() => true)
      .catch(() => false)
  ) {
    await compositeSideBySide(
      refDesktop,
      finalDesktop,
      path.join(OUT, "reference-desktop-vs-final.png"),
      "Reference (Desktop)",
      "Final (Desktop)",
    );
  }

  if (
    await readFile(refMobile)
      .then(() => true)
      .catch(() => false)
  ) {
    await compositeSideBySide(
      refMobile,
      finalMobile,
      path.join(OUT, "reference-mobile-vs-final.png"),
      "Reference (Mobile)",
      "Final (Mobile)",
    );
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
