/**
 * Regression test — live preview launch must not jump page scroll.
 * Requires: npm run build && npx next start -p <port>
 * Run: node scripts/live-preview-scroll-jump-test.mjs
 */

const BASE = process.env.LIVE_PREVIEW_TEST_URL ?? "http://localhost:3052";
const TOLERANCE_PX = 4;

const CASES = [
  { locale: "en", width: 1440, height: 900, name: "en-desktop" },
  { locale: "ar", width: 1440, height: 900, name: "ar-desktop" },
  { locale: "en", width: 390, height: 844, name: "en-mobile" },
  { locale: "ar", width: 390, height: 844, name: "ar-mobile" },
];

async function runCase(page, { locale, width, height, name }) {
  await page.setViewportSize({ width, height });
  await page.goto(`${BASE}/${locale}#world-brands`, { waitUntil: "networkidle" });

  const launchButton = page
    .locator('button:has-text("Launch Live Preview"), button:has-text("تشغيل المعاينة المباشرة")')
    .first();
  await launchButton.waitFor({ state: "visible", timeout: 30000 });
  await launchButton.scrollIntoViewIfNeeded();

  const scrollBefore = await page.evaluate(() => window.scrollY);
  await launchButton.click();

  await page.waitForSelector("iframe[title]", { timeout: 15000 });
  await page.waitForTimeout(1200);

  const scrollAfter = await page.evaluate(() => window.scrollY);
  const drift = Math.abs(scrollAfter - scrollBefore);

  if (drift > TOLERANCE_PX) {
    throw new Error(
      `${name}: scroll drift ${drift}px (before=${scrollBefore}, after=${scrollAfter}, tolerance=${TOLERANCE_PX}px)`,
    );
  }

  console.log(
    `PASS ${name}: scroll drift ${drift}px (before=${scrollBefore}, after=${scrollAfter})`,
  );
}

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("Playwright not installed. Run: npx playwright install chromium");
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    for (const testCase of CASES) {
      await runCase(page, testCase);
    }
    console.log("All live preview scroll-jump regression checks passed.");
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
