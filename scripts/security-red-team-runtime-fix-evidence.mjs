/**
 * Production evidence for security red-team runtime fix.
 * Requires: npm run build && npx next start -p <port>
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SECURITY_FIX_URL ?? "http://localhost:3063";
const OUT = path.join("docs", "evidence", "security-red-team-runtime-fix");

async function scrollTo(page, selector, block = "center") {
  await page.evaluate(
    ({ sel, blockPos }) => {
      document.querySelector(sel)?.scrollIntoView({ block: blockPos, behavior: "instant" });
    },
    { sel: selector, blockPos: block },
  );
  await page.waitForTimeout(1600);
}

async function readState(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const discipline = document.querySelector(
      '#world-security .journey-rail[data-spine-anchor="discipline"]',
    );
    return {
      world: root.dataset.worldState,
      phase: root.dataset.securityPhase ?? "defense",
      accentRgb: cs.getPropertyValue("--world-accent-rgb").trim(),
      railColor: discipline
        ? getComputedStyle(discipline).getPropertyValue("--rail-world-color").trim()
        : null,
      coreW: document.querySelector("[data-world-core-layer]")?.getBoundingClientRect().width,
    };
  });
}

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  const desktop = [
    {
      name: "en-defense-stage02-1440x900.png",
      locale: "en",
      sel: "#world-security [data-rail-node]:nth-child(2)",
      expect: "defense",
    },
    {
      name: "en-red-team-stage04-1440x900.png",
      locale: "en",
      sel: '[data-security-red-team-anchor="true"]',
      expect: "red-team",
    },
    {
      name: "en-defense-scrollback-1440x900.png",
      locale: "en",
      sel: "#world-security [data-rail-node]:nth-child(2)",
      expect: "defense",
      after: '[data-security-red-team-anchor="true"]',
    },
    {
      name: "ar-defense-stage02-1440x900.png",
      locale: "ar",
      sel: "#world-security [data-rail-node]:nth-child(2)",
      expect: "defense",
    },
    {
      name: "ar-red-team-stage04-1440x900.png",
      locale: "ar",
      sel: '[data-security-red-team-anchor="true"]',
      expect: "red-team",
    },
  ];

  let baselineCoreW = null;

  for (const shot of desktop) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/${shot.locale}`, { waitUntil: "networkidle", timeout: 90000 });
    if (shot.after) await scrollTo(page, shot.after);
    await scrollTo(page, shot.sel);
    const state = await readState(page);
    if (!baselineCoreW && state.coreW) baselineCoreW = state.coreW;
    if (baselineCoreW && state.coreW && Math.abs(state.coreW - baselineCoreW) > 1) {
      console.warn("Core width drift", shot.name, baselineCoreW, state.coreW);
    }
    console.log(shot.name, state, "expected", shot.expect);
    if (state.phase !== shot.expect) console.error("PHASE MISMATCH", shot.name);
    await page.screenshot({ path: path.join(OUT, shot.name) });
    await page.close();
  }

  const mobile = [
    {
      name: "en-defense-390x844.png",
      locale: "en",
      w: 390,
      h: 844,
      sel: "#world-security [data-rail-node]:nth-child(2)",
      expect: "defense",
    },
    {
      name: "en-red-team-390x844.png",
      locale: "en",
      w: 390,
      h: 844,
      sel: '[data-security-red-team-anchor="true"]',
      expect: "red-team",
    },
  ];

  for (const shot of mobile) {
    const page = await browser.newPage({ viewport: { width: shot.w, height: shot.h } });
    await page.goto(`${BASE}/${shot.locale}`, { waitUntil: "networkidle", timeout: 90000 });
    await scrollTo(page, shot.sel);
    const state = await readState(page);
    console.log(shot.name, state, "expected", shot.expect);
    await page.screenshot({ path: path.join(OUT, shot.name) });
    await page.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    await page.goto(`${BASE}/en`, { waitUntil: "networkidle", timeout: 90000 });
    await scrollTo(page, "#world-security [data-rail-node]:nth-child(2)");
    await scrollTo(page, '[data-security-red-team-anchor="true"]');
    await page.waitForTimeout(1000);
    await scrollTo(page, "#world-security [data-rail-node]:nth-child(2)");
    await page.waitForTimeout(1000);
    await page.close();
    await context.close();
    console.log("Saved transition video");
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
