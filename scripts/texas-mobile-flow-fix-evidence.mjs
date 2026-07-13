/**
 * Texas Funds mobile flow — before/after evidence screenshots.
 * Requires: npm run build && npx next start -p <port>
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.TEXAS_FLOW_URL ?? "http://localhost:3072";
const ROOT = path.join("docs", "evidence", "texas-mobile-flow-fix");

const SHOTS = [
  { locale: "en", w: 390, h: 844, tag: "390x844" },
  { locale: "ar", w: 390, h: 844, tag: "390x844" },
  { locale: "en", w: 320, h: 568, tag: "320x568" },
];

const EXTRA_VIEWPORTS = [
  { w: 430, h: 932, tag: "430x932" },
  { w: 375, h: 667, tag: "375x667" },
];

async function ensureBeforeDir() {
  await mkdir(path.join(ROOT, "before"), { recursive: true });
}

async function validateFlow(page) {
  return page.evaluate(() => {
    const rail = document.querySelector(".systems-texas-branch .journey-rail--micro-flow");
    if (!rail) return { ok: false, reason: "rail not found" };

    const track = rail.querySelector(".journey-rail__track");
    const nodes = Array.from(rail.querySelectorAll(".journey-rail__node"));
    const segments = Array.from(rail.querySelectorAll(".journey-rail__segment--horizontal"));
    const trackStyle = track ? getComputedStyle(track) : null;
    const rects = nodes.map((node) => {
      const body = node.querySelector(".journey-rail__node-body");
      const title = node.querySelector(".journey-rail__node-title");
      const bodyRect = body?.getBoundingClientRect();
      const titleRect = title?.getBoundingClientRect();
      return {
        height: bodyRect?.height ?? 0,
        top: bodyRect?.top ?? 0,
        bottom: bodyRect?.bottom ?? 0,
        left: bodyRect?.left ?? 0,
        titleClipped:
          title && titleRect
            ? titleRect.width < title.scrollWidth - 1 || titleRect.height < title.scrollHeight - 1
            : false,
      };
    });

    let overlap = false;
    for (let i = 0; i < rects.length - 1; i += 1) {
      if (rects[i].bottom > rects[i + 1].top + 1) overlap = true;
    }

    const horizontalStack =
      rects.length >= 2 &&
      Math.abs(rects[0].top - rects[1].top) < 8 &&
      rects[1].left > rects[0].left;

    return {
      ok: !overlap && !horizontalStack && rects.every((r) => r.height >= 44),
      overlap,
      horizontalStack,
      nodeCount: nodes.length,
      segmentCount: segments.length,
      trackDisplay: trackStyle?.display ?? null,
      trackGridColumns: trackStyle?.gridTemplateColumns ?? null,
      minNodeHeight: rects.length ? Math.min(...rects.map((r) => r.height)) : 0,
      titleClipped: rects.some((r) => r.titleClipped),
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
}

async function captureTexasFlow(browser, locale, vp, outDir) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto(`${BASE}/${locale}`, { waitUntil: "networkidle", timeout: 90000 });

  const branch = page.locator("aside.systems-texas-branch");
  await branch.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const flow = page.locator("aside.systems-texas-branch .journey-rail--micro-flow");
  await flow.screenshot({
    path: path.join(outDir, `${locale}-${vp.tag}.png`),
  });

  const metrics = await validateFlow(page);
  await page.close();
  return metrics;
}

async function main() {
  const { chromium } = await import("playwright");
  await ensureBeforeDir();

  const browser = await chromium.launch({ headless: true });
  const afterDir = path.join(ROOT, "after");
  await mkdir(afterDir, { recursive: true });

  const results = { shots: [], validation: [] };

  for (const shot of SHOTS) {
    const metrics = await captureTexasFlow(browser, shot.locale, shot, afterDir);
    results.shots.push(`${shot.locale}-${shot.tag}`);
    results.validation.push({ ...shot, ...metrics });
    console.log("after captured", shot.locale, shot.tag, metrics);
  }

  for (const locale of ["en", "ar"]) {
    for (const vp of EXTRA_VIEWPORTS) {
      const metrics = await captureTexasFlow(browser, locale, vp, afterDir);
      results.validation.push({ locale, ...vp, ...metrics });
      console.log("extra validation", locale, vp.tag, metrics);
    }
  }

  await browser.close();
  await writeFile(path.join(ROOT, "validation.json"), JSON.stringify(results, null, 2));
  console.log("evidence complete", ROOT);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
