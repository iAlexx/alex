import { chromium } from "playwright";

const BASE = process.env.MOTION_TEST_URL ?? "http://localhost:3000";
const VIEWPORTS = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 900 },
  { name: "1024", width: 1024, height: 900 },
  { name: "1440", width: 1440, height: 900 },
];

async function testLocaleViewport(locale, viewport) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  const hydrationWarnings = [];
  const railLogs = [];

  page.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("hydration") || text.includes("Hydration")) {
      hydrationWarnings.push(text);
    }
    if (text.includes("[rail-motion]")) {
      railLogs.push(text);
    }
  });

  await page.goto(`${BASE}/${locale}#world-brands`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const gymuraButtons = await page.evaluate(() => {
    const group = document.querySelector(
      '#world-brands [aria-label*="preview" i], #world-brands [aria-label*="Preview" i]',
    );
    const buttons = Array.from(document.querySelectorAll("#world-brands button[aria-pressed]"));
    const pressed = buttons.filter((b) => b.getAttribute("aria-pressed") === "true");
    return {
      total: buttons.length,
      pressedCount: pressed.length,
      pressedLabels: pressed.map((b) => b.textContent?.trim() ?? ""),
      states: buttons.map((b) => ({
        label: b.textContent?.trim() ?? "",
        pressed: b.getAttribute("aria-pressed"),
      })),
      groupFound: Boolean(group),
    };
  });

  await page.locator("#world-systems").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const restaurantButtons = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("#world-systems button[aria-pressed]"));
    const pressed = buttons.filter((b) => b.getAttribute("aria-pressed") === "true");
    return {
      total: buttons.length,
      pressedCount: pressed.length,
      pressedLabels: pressed.map((b) => b.textContent?.trim() ?? ""),
    };
  });

  const railMotionInit = await page.evaluate(
    () => document.documentElement.dataset.railMotionInit === "true",
  );

  await page.locator('#world-brands button[aria-pressed="false"]').first().click();
  await page.waitForTimeout(300);

  const afterManualSelect = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("#world-brands button[aria-pressed]"));
    return buttons.map((b) => ({
      label: b.textContent?.trim() ?? "",
      pressed: b.getAttribute("aria-pressed"),
    }));
  });

  await browser.close();

  return {
    locale,
    viewport: viewport.name,
    hydrationWarnings,
    gymuraButtons,
    restaurantButtons,
    railMotionInit,
    railLogsCount: railLogs.length,
    afterManualSelect,
  };
}

async function main() {
  const results = [];
  for (const viewport of VIEWPORTS) {
    results.push(await testLocaleViewport("en", viewport));
  }
  results.push(await testLocaleViewport("ar", { name: "1440", width: 1440, height: 900 }));
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
