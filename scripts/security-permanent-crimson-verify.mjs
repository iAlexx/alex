import { chromium } from "playwright";

const BASE = process.env.VERIFY_URL ?? "http://localhost:3063";

async function state(page) {
  return page.evaluate(() => ({
    world: document.documentElement.dataset.worldState,
    phase: document.documentElement.dataset.securityPhase,
    accent: getComputedStyle(document.documentElement)
      .getPropertyValue("--world-accent-rgb")
      .trim(),
  }));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });

  const scrolls = [
    ["intro", "#world-security"],
    ["stage-01", "#world-security [data-rail-node]:nth-child(1)"],
    ["stage-03", "#world-security [data-rail-node]:nth-child(3)"],
    ["stage-04", "#world-security [data-rail-node]:nth-child(4)"],
    ["future", "#future"],
  ];

  for (const [label, sel] of scrolls) {
    await page.evaluate(
      (s) => document.querySelector(s)?.scrollIntoView({ block: "center", behavior: "instant" }),
      sel,
    );
    await page.waitForTimeout(1400);
    const s = await state(page);
    console.log(label, s);
    if (label !== "future" && s.accent !== "229, 72, 77")
      console.error("FAIL: not crimson at", label);
    if (label !== "future" && s.phase) console.error("FAIL: securityPhase still set at", label);
  }

  await browser.close();
}

main();
