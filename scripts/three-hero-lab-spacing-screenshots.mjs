/**
 * Desktop spacing correction screenshots for Three Hero Lab.
 * Requires: npm run build && npx next start -p <port>
 */
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.THREE_HERO_LAB_URL ?? "http://localhost:3030";
const OUT = path.join("docs", "evidence", "three-hero-lab");

async function compositeSideBySide(leftPath, rightPath, outPath, labelLeft, labelRight) {
  const sharp = (await import("sharp")).default;
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

async function capture(page, locale, outName) {
  await page.goto(`${BASE}/${locale}/three-hero-lab`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForSelector(".lovable-portrait__image", { timeout: 30000 });
  await page.waitForTimeout(2800);
  const outPath = path.join(OUT, outName);
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`Saved ${outPath}`);
}

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  const enPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await capture(enPage, "en", "en-1440x900-spacing-final.png");
  await enPage.close();

  const arPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await capture(arPage, "ar", "ar-1440x900-spacing-final.png");
  await arPage.close();

  await browser.close();

  const before = path.join(OUT, "en-1440x900-spacing-before.png");
  const after = path.join(OUT, "en-1440x900-spacing-final.png");
  if (
    await readFile(before)
      .then(() => true)
      .catch(() => false)
  ) {
    await compositeSideBySide(
      before,
      after,
      path.join(OUT, "before-vs-after-spacing.png"),
      "Before spacing",
      "After spacing",
    );
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
