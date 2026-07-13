/**
 * Evidence for Cybersecurity cyan → red-team → cyan color transition.
 * Requires: npm run build && npx next start -p <port>
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SECURITY_RED_TEAM_URL ?? "http://localhost:3058";
const OUT = path.join("docs", "evidence", "security-red-team-transition");

async function scrollToElement(page, selector, block = "center") {
  await page.evaluate(
    ({ sel, blockPos }) => {
      document.querySelector(sel)?.scrollIntoView({ block: blockPos, behavior: "instant" });
    },
    { sel: selector, blockPos: block },
  );
  await page.waitForTimeout(1500);
}

async function scrollToSection(page, id, block = "center") {
  await page.evaluate(
    ({ sectionId, blockPos }) => {
      document.getElementById(sectionId)?.scrollIntoView({ block: blockPos, behavior: "instant" });
    },
    { sectionId: id, blockPos: block },
  );
  await page.waitForTimeout(1500);
}

async function readPhase(page) {
  return page.evaluate(() => document.documentElement.dataset.securityPhase ?? "security");
}

async function readCoreBox(page) {
  return page.evaluate(() => {
    const layer = document.querySelector("[data-world-core-layer]");
    if (!layer) return null;
    const r = layer.getBoundingClientRect();
    return { w: r.width, h: r.height, top: r.top, left: r.left };
  });
}

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  const desktopShots = [
    {
      name: "en-security-intro-cyan-1440x900.png",
      locale: "en",
      run: async (page) => {
        await scrollToSection(page, "world-security", "start");
      },
      expectPhase: "security",
    },
    {
      name: "en-security-fundamentals-cyan-1440x900.png",
      locale: "en",
      run: async (page) => {
        await scrollToSection(page, "world-security", "start");
        await scrollToElement(page, "#world-security [data-rail-node]:nth-child(1)", "center");
      },
      expectPhase: "security",
    },
    {
      name: "en-security-red-team-crimson-1440x900.png",
      locale: "en",
      run: async (page) => {
        await scrollToElement(page, "[data-security-red-team-anchor]", "center");
      },
      expectPhase: "red-team",
    },
    {
      name: "en-security-scrollback-cyan-1440x900.png",
      locale: "en",
      run: async (page) => {
        await scrollToElement(page, "[data-security-red-team-anchor]", "center");
        await scrollToElement(page, "#world-security [data-rail-node]:nth-child(2)", "center");
      },
      expectPhase: "security",
    },
    {
      name: "ar-security-intro-cyan-1440x900.png",
      locale: "ar",
      run: async (page) => {
        await scrollToSection(page, "world-security", "start");
      },
      expectPhase: "security",
    },
    {
      name: "ar-security-red-team-crimson-1440x900.png",
      locale: "ar",
      run: async (page) => {
        await scrollToElement(page, "[data-security-red-team-anchor]", "center");
      },
      expectPhase: "red-team",
    },
  ];

  let coreBaseline = null;

  for (const shot of desktopShots) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/${shot.locale}`, { waitUntil: "networkidle", timeout: 90000 });
    await shot.run(page);
    const phase = await readPhase(page);
    const coreBox = await readCoreBox(page);
    if (!coreBaseline && coreBox) coreBaseline = coreBox;
    if (coreBaseline && coreBox) {
      const dw = Math.abs(coreBox.w - coreBaseline.w);
      const dh = Math.abs(coreBox.h - coreBaseline.h);
      if (dw > 1 || dh > 1) {
        console.warn(`Core size drift in ${shot.name}:`, coreBaseline, coreBox);
      }
    }
    console.log(shot.name, "phase=", phase, "expected=", shot.expectPhase);
    await page.screenshot({ path: path.join(OUT, shot.name) });
    await page.close();
  }

  const mobileShots = [
    {
      name: "en-security-cyan-390x844.png",
      locale: "en",
      w: 390,
      h: 844,
      run: async (page) => {
        await scrollToElement(page, "#world-security [data-rail-node]:nth-child(1)", "center");
      },
    },
    {
      name: "en-security-red-team-390x844.png",
      locale: "en",
      w: 390,
      h: 844,
      run: async (page) => {
        await scrollToElement(page, "[data-security-red-team-anchor]", "center");
      },
    },
    {
      name: "en-security-cyan-320x568.png",
      locale: "en",
      w: 320,
      h: 568,
      run: async (page) => {
        await scrollToSection(page, "world-security", "start");
      },
    },
    {
      name: "en-security-red-team-320x568.png",
      locale: "en",
      w: 320,
      h: 568,
      run: async (page) => {
        await scrollToElement(page, "[data-security-red-team-anchor]", "center");
      },
    },
    {
      name: "ar-security-red-team-390x844.png",
      locale: "ar",
      w: 390,
      h: 844,
      run: async (page) => {
        await scrollToElement(page, "[data-security-red-team-anchor]", "center");
      },
    },
  ];

  for (const shot of mobileShots) {
    const page = await browser.newPage({ viewport: { width: shot.w, height: shot.h } });
    await page.goto(`${BASE}/${shot.locale}`, { waitUntil: "networkidle", timeout: 90000 });
    await shot.run(page);
    const phase = await readPhase(page);
    console.log(shot.name, "phase=", phase);
    await page.screenshot({ path: path.join(OUT, shot.name) });
    await page.close();
  }

  // Scroll recording: cyan → crimson → cyan
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
    });
    const page = await context.newPage();
    await page.goto(`${BASE}/en`, { waitUntil: "networkidle", timeout: 90000 });
    await scrollToSection(page, "world-security", "start");
    await page.waitForTimeout(900);
    await scrollToElement(page, "#world-security [data-rail-node]:nth-child(2)", "center");
    await page.waitForTimeout(900);
    await scrollToElement(page, "[data-security-red-team-anchor]", "center");
    await page.waitForTimeout(1200);
    await scrollToElement(page, "#world-security [data-rail-node]:nth-child(1)", "center");
    await page.waitForTimeout(1200);
    await page.close();
    await context.close();
    console.log("Saved scroll recording video in", OUT);
  }

  await browser.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
