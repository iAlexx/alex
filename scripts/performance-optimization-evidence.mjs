/**
 * Mobile performance optimization — Lighthouse + screenshots.
 * Usage: PERF_OPT_URL=http://localhost:3080 node scripts/performance-optimization-evidence.mjs
 */
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const BASE = process.env.PERF_OPT_URL ?? "http://localhost:3080";
const ROOT = path.join("docs", "evidence", "performance-optimization");
const BASELINE_SRC = path.join("docs", "evidence", "final-release", "lighthouse");

const MOBILE = { w: 390, h: 844 };
const RUNS = [
  { locale: "en", name: "en-mobile" },
  { locale: "ar", name: "ar-mobile" },
];

function runLighthouse(url, name) {
  const outBase = path.join(ROOT, name);
  mkdir(path.join(ROOT), { recursive: true });
  try {
    execSync(
      `npx lighthouse "${url}" --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --only-categories=performance,accessibility,best-practices,seo --output=json --output=html --output-path="${outBase}" --chrome-flags="--headless --no-sandbox" --quiet`,
      { stdio: "pipe", timeout: 180000 },
    );
    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error).slice(0, 300) };
  }
}

async function summarize(dir) {
  const fs = await import("node:fs/promises");
  const summary = [];
  try {
    const files = await fs.readdir(dir);
    for (const file of files.filter((f) => f.endsWith(".json"))) {
      const raw = await fs.readFile(path.join(dir, file), "utf8");
      const data = JSON.parse(raw);
      const cats = data.categories ?? {};
      summary.push({
        file,
        performance: Math.round((cats.performance?.score ?? 0) * 100),
        accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
        seo: Math.round((cats.seo?.score ?? 0) * 100),
        lcp: data.audits?.["largest-contentful-paint"]?.displayValue,
        cls: data.audits?.["cumulative-layout-shift"]?.displayValue,
        tbt: data.audits?.["total-blocking-time"]?.displayValue,
        speedIndex: data.audits?.["speed-index"]?.displayValue,
      });
    }
  } catch {
    /* optional */
  }
  return summary;
}

async function captureScreenshots(browser) {
  const afterDir = path.join(ROOT, "after");
  await mkdir(afterDir, { recursive: true });

  for (const run of RUNS) {
    const page = await browser.newPage({ viewport: { width: MOBILE.w, height: MOBILE.h } });
    await page.goto(`${BASE}/${run.locale}`, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(500);

    await page.locator("#hero").screenshot({
      path: path.join(afterDir, `${run.locale}-hero-${MOBILE.w}x${MOBILE.h}.png`),
    });

    const worldCore = page.locator("[data-world-core-layer]");
    if ((await worldCore.count()) > 0) {
      await worldCore.first().screenshot({
        path: path.join(afterDir, `${run.locale}-world-core-${MOBILE.w}x${MOBILE.h}.png`),
      });
    }

    await page.screenshot({
      path: path.join(afterDir, `${run.locale}-viewport-${MOBILE.w}x${MOBILE.h}.png`),
    });
    await page.close();
  }
}

async function main() {
  const beforeDir = path.join(ROOT, "before");
  await mkdir(beforeDir, { recursive: true });

  for (const run of RUNS) {
    try {
      await copyFile(
        path.join(BASELINE_SRC, `${run.name}.report.json`),
        path.join(beforeDir, `${run.name}.report.json`),
      );
      await copyFile(
        path.join(BASELINE_SRC, `${run.name}.report.html`),
        path.join(beforeDir, `${run.name}.report.html`),
      );
    } catch {
      console.warn("baseline copy missing", run.name);
    }
  }

  for (const run of RUNS) {
    const result = runLighthouse(`${BASE}/${run.locale}`, `after-${run.name}`);
    console.log("lighthouse", run.name, result);
  }

  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  await captureScreenshots(browser);
  await browser.close();

  const afterSummary = await summarize(ROOT);
  const beforeSummary = await summarize(beforeDir);

  await writeFile(
    path.join(ROOT, "comparison.json"),
    JSON.stringify({ before: beforeSummary, after: afterSummary }, null, 2),
  );
  console.log("evidence complete", ROOT);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
