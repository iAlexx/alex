import { chromium } from "playwright";

const BASE = process.env.MOTION_TEST_URL ?? "http://localhost:3000";

async function testViewport(width, locale = "en") {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const logs = [];
  const errors = [];

  page.on("console", (msg) => {
    if (msg.text().includes("[rail-motion]")) logs.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto(`${BASE}/${locale}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.documentElement.dataset.railMotionInit === "true", {
    timeout: 15000,
  });

  const before = await page.evaluate(() => {
    const line = document.querySelector(
      "#method [data-rail-line].journey-rail__segment--horizontal",
    );
    const marker = document.querySelector("#method [data-rail-marker]");
    return {
      width: window.innerWidth,
      stCount: window.ScrollTrigger?.getAll?.().length ?? null,
      lineTransform: line ? getComputedStyle(line).transform : "missing",
      lineDisplay: line ? getComputedStyle(line).display : "missing",
      markerOpacity: marker ? getComputedStyle(marker).opacity : "missing",
      markerInline: marker?.getAttribute("style") ?? null,
      lineInline: line?.getAttribute("style") ?? null,
    };
  });

  await page.locator("#method").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);

  const duringMethod = await page.evaluate(() => {
    const lines = Array.from(
      document.querySelectorAll("#method [data-rail-line].journey-rail__segment--horizontal"),
    );
    const markers = Array.from(document.querySelectorAll("#method [data-rail-marker]"));
    return {
      lineTransforms: lines.map((l) => getComputedStyle(l).transform),
      markerOpacities: markers.map((m) => getComputedStyle(m).opacity),
    };
  });

  await page.locator("#world-brands").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);

  const duringGymura = await page.evaluate(() => {
    const lines = Array.from(
      document.querySelectorAll("#world-brands [data-rail-line].journey-rail__segment--horizontal"),
    );
    return { lineTransforms: lines.map((l) => getComputedStyle(l).transform) };
  });

  await page.locator("#world-intelligence").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);

  const duringIntel = await page.evaluate(() => {
    const lines = Array.from(document.querySelectorAll("#world-intelligence [data-rail-line]"));
    return { lineTransforms: lines.map((l) => getComputedStyle(l).transform) };
  });

  await page.locator("#future").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);

  const duringFuture = await page.evaluate(() => {
    const track = document.querySelector("#future .journey-rail__track");
    return {
      futureDraw: track ? getComputedStyle(track).getPropertyValue("--future-draw").trim() : null,
    };
  });

  await browser.close();

  return {
    width,
    locale,
    logs,
    errors,
    before,
    duringMethod,
    duringGymura,
    duringIntel,
    duringFuture,
  };
}

async function main() {
  const results = [];
  for (const width of [1280, 768, 375]) {
    results.push(await testViewport(width, "en"));
  }
  results.push(await testViewport(1280, "ar"));
  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
