/**
 * Final release evidence — screenshots + Lighthouse JSON.
 * Requires: npm run build && npx next start -p <port>
 *
 * Usage:
 *   RELEASE_EVIDENCE_URL=http://localhost:3080 node scripts/final-release-evidence.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const BASE = process.env.RELEASE_EVIDENCE_URL ?? "http://localhost:3080";
const ROOT = path.join("docs", "evidence", "final-release");

const DESKTOP = { w: 1440, h: 900 };
const MOBILE = { w: 390, h: 844 };

const DESKTOP_SECTIONS = [
  { id: "hero", name: "hero" },
  { id: "world-brands", name: "gymura" },
  { id: "world-systems", name: "restaurant" },
  { id: "world-systems", name: "texas", selector: "aside.systems-texas-branch" },
  { id: "world-intelligence", name: "intelligence" },
  { id: "world-security", name: "cybersecurity" },
  { id: "manifesto", name: "manifesto" },
  { id: "contact", name: "contact" },
];

const MOBILE_SECTIONS = [
  { id: "hero", name: "hero" },
  { id: "world-brands", name: "gymura-collapsed" },
  { id: "world-systems", name: "restaurant" },
  { id: "world-systems", name: "texas", selector: "aside.systems-texas-branch" },
  { id: "world-intelligence", name: "intelligence" },
  { id: "world-security", name: "cybersecurity" },
  { id: "contact", name: "contact" },
];

async function captureSection(page, locale, vp, section, outDir) {
  const tag = `${vp.w}x${vp.h}`;
  const target = section.selector ? page.locator(section.selector) : page.locator(`#${section.id}`);
  if ((await target.count()) === 0) return;
  await target.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await target.first().screenshot({
    path: path.join(outDir, `${locale}-${section.name}-${tag}.png`),
  });
}

async function captureScreenshots(browser) {
  for (const locale of ["en", "ar"]) {
    const desktopDir = path.join(ROOT, "desktop", locale);
    const mobileDir = path.join(ROOT, "mobile", locale);
    await mkdir(desktopDir, { recursive: true });
    await mkdir(mobileDir, { recursive: true });

    const desktopPage = await browser.newPage({
      viewport: { width: DESKTOP.w, height: DESKTOP.h },
    });
    await desktopPage.goto(`${BASE}/${locale}`, { waitUntil: "networkidle", timeout: 90000 });
    for (const section of DESKTOP_SECTIONS) {
      await captureSection(desktopPage, locale, DESKTOP, section, desktopDir);
    }
    await desktopPage.screenshot({
      path: path.join(desktopDir, `${locale}-fullpage-${DESKTOP.w}x${DESKTOP.h}.png`),
      fullPage: true,
    });
    await desktopPage.close();

    const mobilePage = await browser.newPage({
      viewport: { width: MOBILE.w, height: MOBILE.h },
    });
    await mobilePage.goto(`${BASE}/${locale}`, { waitUntil: "networkidle", timeout: 90000 });

    for (const section of MOBILE_SECTIONS) {
      await captureSection(mobilePage, locale, MOBILE, section, mobileDir);
    }

    const gymuraTeaser = mobilePage.locator("#world-brands .mobile-preview-teaser__open").first();
    if ((await gymuraTeaser.count()) > 0) {
      await gymuraTeaser.scrollIntoViewIfNeeded();
      await gymuraTeaser.click();
      await mobilePage.waitForTimeout(500);
      await mobilePage.locator("#world-brands").screenshot({
        path: path.join(mobileDir, `${locale}-gymura-preview-expanded-${MOBILE.w}x${MOBILE.h}.png`),
      });
    }

    await mobilePage.screenshot({
      path: path.join(mobileDir, `${locale}-fullpage-${MOBILE.w}x${MOBILE.h}.png`),
      fullPage: true,
    });
    await mobilePage.close();
    console.log("screenshots", locale);
  }
}

function runLighthouse(url, outPrefix, preset) {
  const outJson = path.join(ROOT, "lighthouse", `${outPrefix}.json`);
  const outHtml = path.join(ROOT, "lighthouse", `${outPrefix}.html`);
  mkdir(path.join(ROOT, "lighthouse"), { recursive: true });

  const presetFlag = preset === "desktop" ? "--preset=desktop" : "";
  const mobileFlags =
    preset === "mobile"
      ? "--form-factor=mobile --screenEmulation.mobile --throttling-method=simulate"
      : "";

  try {
    execSync(
      `npx lighthouse "${url}" ${presetFlag} ${mobileFlags} --only-categories=performance,accessibility,best-practices,seo --output=json --output=html --output-path="${outJson.replace(".json", "")}" --chrome-flags="--headless --no-sandbox" --quiet`,
      { stdio: "pipe", timeout: 180000 },
    );
    console.log("lighthouse", outPrefix);
    return { outJson, outHtml, ok: true };
  } catch (error) {
    console.warn("lighthouse failed", outPrefix, error.message?.slice(0, 200));
    return { ok: false, error: error.message?.slice(0, 300) };
  }
}

async function summarizeLighthouse() {
  const summary = [];
  const fs = await import("node:fs/promises");
  const dir = path.join(ROOT, "lighthouse");
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
      });
    }
  } catch {
    /* lighthouse optional */
  }
  await writeFile(path.join(ROOT, "lighthouse-summary.json"), JSON.stringify(summary, null, 2));
  return summary;
}

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(ROOT, { recursive: true });
  await mkdir(path.join(ROOT, "lighthouse"), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  await captureScreenshots(browser);
  await browser.close();

  const lighthouseRuns = [
    { url: `${BASE}/en`, name: "en-desktop", preset: "desktop" },
    { url: `${BASE}/ar`, name: "ar-desktop", preset: "desktop" },
    { url: `${BASE}/en`, name: "en-mobile", preset: "mobile" },
    { url: `${BASE}/ar`, name: "ar-mobile", preset: "mobile" },
  ];

  for (const run of lighthouseRuns) {
    runLighthouse(run.url, run.name, run.preset);
  }

  const summary = await summarizeLighthouse();
  await writeFile(
    path.join(ROOT, "evidence-manifest.json"),
    JSON.stringify({ base: BASE, lighthouse: summary }, null, 2),
  );
  console.log("evidence complete", ROOT);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
