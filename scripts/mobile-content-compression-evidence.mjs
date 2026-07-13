/**
 * Mobile content compression evidence — heights + screenshots.
 */
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.MOBILE_UX_URL ?? "http://localhost:3071";
const ROOT = path.join("docs", "evidence", "mobile-content-compression");
const BEFORE_SRC = path.join("docs", "evidence", "mobile-ux-refinement", "audit-after");
const VIEWPORT = { w: 390, h: 844 };

async function copyBeforeScreenshots() {
  const beforeDir = path.join(ROOT, "before");
  await mkdir(beforeDir, { recursive: true });
  for (const locale of ["en", "ar"]) {
    const candidates = [
      `${locale}-fullpage-scroll-${VIEWPORT.w}x${VIEWPORT.h}.png`,
      `${locale}-fullpage-${VIEWPORT.w}x${VIEWPORT.h}.png`,
    ];
    for (const name of candidates) {
      try {
        await copyFile(path.join(BEFORE_SRC, name), path.join(beforeDir, name));
        break;
      } catch {
        /* try next */
      }
    }
  }
}

async function captureAfter(browser, locale) {
  const outDir = path.join(ROOT, "after");
  await mkdir(outDir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: VIEWPORT.w, height: VIEWPORT.h } });
  await page.goto(`${BASE}/${locale}`, { waitUntil: "networkidle", timeout: 90000 });

  const metrics = await page.evaluate(() => {
    const visiblePills = Array.from(document.querySelectorAll(".tech-badge")).filter(
      (el) => window.getComputedStyle(el).display !== "none" && el.getClientRects().length > 0,
    ).length;
    const paragraphs = document.querySelectorAll(
      ".journey-content p:not(.sr-only):not([hidden])",
    ).length;
    const disclosures = document.querySelectorAll(".mobile-disclosure").length;
    const processItems = document.querySelectorAll(".mobile-process-steps__item").length;
    return {
      documentHeight: document.documentElement.scrollHeight,
      visiblePills,
      paragraphs,
      disclosures,
      processItems,
    };
  });

  await page.screenshot({
    path: path.join(outDir, `${locale}-fullpage-${VIEWPORT.w}x${VIEWPORT.h}.png`),
    fullPage: true,
  });

  const sections = [
    { id: "world-brands", name: "gymura" },
    { id: "world-systems", name: "restaurant" },
    { id: "world-intelligence", name: "intelligence" },
    { id: "world-security", name: "cybersecurity" },
  ];

  for (const section of sections) {
    const el = page.locator(`#${section.id}`);
    if ((await el.count()) === 0) continue;
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(
        outDir,
        `${locale}-${section.name}-collapsed-${VIEWPORT.w}x${VIEWPORT.h}.png`,
      ),
    });

    const toggle = page.locator(`#${section.id} .mobile-disclosure__trigger`).first();
    if ((await toggle.count()) > 0) {
      await toggle.click();
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(
          outDir,
          `${locale}-${section.name}-expanded-${VIEWPORT.w}x${VIEWPORT.h}.png`,
        ),
      });
    }
  }

  const tech = page.locator("#world-brands .project-tech-stack__toggle").first();
  if ((await tech.count()) > 0) {
    await tech.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(outDir, `${locale}-techstack-collapsed-${VIEWPORT.w}x${VIEWPORT.h}.png`),
    });
    await tech.click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, `${locale}-techstack-expanded-${VIEWPORT.w}x${VIEWPORT.h}.png`),
    });
  }

  await page.close();
  return metrics;
}

async function measureBeforeBaseline(browser, locale) {
  const page = await browser.newPage({ viewport: { width: VIEWPORT.w, height: VIEWPORT.h } });
  await page.goto(`${BASE}/${locale}`, { waitUntil: "networkidle", timeout: 90000 });
  const metrics = await page.evaluate(() => ({
    documentHeight: document.documentElement.scrollHeight,
  }));
  await page.close();
  return metrics;
}

async function main() {
  const { chromium } = await import("playwright");
  await copyBeforeScreenshots();
  const browser = await chromium.launch({ headless: true });

  const results = {
    viewport: VIEWPORT,
    baselineNote:
      "Before heights reference mobile-ux-refinement audit-after era (pre content-compression build).",
    before: {},
    after: {},
  };

  for (const locale of ["en", "ar"]) {
    results.after[locale] = await captureAfter(browser, locale);
  }

  if (results.after.en && results.after.ar) {
    results.summary = {
      afterDocumentHeightEn: results.after.en.documentHeight,
      afterDocumentHeightAr: results.after.ar.documentHeight,
      afterVisiblePillsEn: results.after.en.visiblePills,
      afterParagraphsEn: results.after.en.paragraphs,
    };
  }

  await writeFile(path.join(ROOT, "height-comparison.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.summary ?? results, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
