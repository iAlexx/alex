/**
 * Final production release verification.
 * Requires: NEXT_PUBLIC_SITE_URL=https://aalex.me npm run build && npx next start -p <port>
 *
 * Usage:
 *   RELEASE_VERIFY_URL=http://localhost:3080 node scripts/final-release-verify.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.RELEASE_VERIFY_URL ?? "http://localhost:3080";
const CANONICAL_HOST = process.env.RELEASE_CANONICAL_HOST ?? "aalex.me";
const OUT_DIR = path.join("docs", "evidence", "final-release");

const LOCALES = ["en", "ar"];
const LAB_ROUTES = [
  "/en/hero-lab",
  "/ar/hero-lab",
  "/en/three-hero-lab",
  "/ar/three-hero-lab",
  "/en/codex-hero-lab",
  "/ar/codex-hero-lab",
];

const PROJECT_SLUGS = [
  "gymura",
  "restaurant-platform",
  "alexa-ai",
  "automation-lab",
  "cybersecurity-lab",
  "texas-funds",
  "alex-linux",
  "upcoming",
];

const PUBLIC_ROUTES = [
  ...LOCALES.map((l) => `/${l}`),
  ...LOCALES.map((l) => `/${l}/projects`),
  ...LOCALES.flatMap((l) => PROJECT_SLUGS.map((s) => `/${l}/projects/${s}`)),
];

const OVERFLOW_VIEWPORTS = [
  { w: 430, h: 932 },
  { w: 390, h: 844 },
  { w: 375, h: 667 },
  { w: 360, h: 800 },
  { w: 320, h: 568 },
  { w: 768, h: 1024 },
  { w: 1280, h: 800 },
  { w: 1440, h: 900 },
];

const SOCIAL_URLS = [
  "https://github.com/iAlexx",
  "https://www.linkedin.com/in/ialexx",
  "https://instagram.com/_x1c",
  "https://t.me/xdevalex",
  "https://gymura.store",
];

function pickMeta(html, name, attr = "name") {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)["']`, "i");
  const alt = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, "i");
  return html.match(re)?.[1] ?? html.match(alt)?.[1] ?? null;
}

function pickLink(html, rel) {
  const re = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]+href=["']([^"']*)["']`, "i");
  const alt = new RegExp(`<link[^>]+href=["']([^"']*)["'][^>]+rel=["']${rel}["']`, "i");
  return html.match(re)?.[1] ?? html.match(alt)?.[1] ?? null;
}

async function fetchRoute(route) {
  const res = await fetch(`${BASE}${route}`, { redirect: "follow" });
  const text = await res.text();
  return { route, status: res.status, text, url: res.url };
}

async function auditRoutes() {
  const results = { public: [], labs: [], assets: [] };
  const failures = [];

  for (const route of PUBLIC_ROUTES) {
    const { status } = await fetchRoute(route);
    results.public.push({ route, status });
    if (status !== 200) failures.push(`${route}: HTTP ${status}`);
  }

  for (const route of LAB_ROUTES) {
    const { status, text } = await fetchRoute(route);
    const robots = pickMeta(text, "robots");
    const noindex = robots?.includes("noindex") ?? false;
    const nofollow = robots?.includes("nofollow") ?? false;
    results.labs.push({ route, status, robots, noindex, nofollow });
    if (status !== 200) failures.push(`${route}: HTTP ${status}`);
    if (!noindex || !nofollow) failures.push(`${route}: expected noindex,nofollow (got ${robots})`);
  }

  for (const asset of [
    "/robots.txt",
    "/sitemap.xml",
    "/manifest.webmanifest",
    "/icon.svg",
    "/en/opengraph-image",
  ]) {
    const res = await fetch(`${BASE}${asset}`);
    results.assets.push({ asset, status: res.status });
    if (res.status !== 200) failures.push(`${asset}: HTTP ${res.status}`);
  }

  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  for (const lab of ["hero-lab", "three-hero-lab", "codex-hero-lab"]) {
    if (sitemap.includes(lab)) failures.push(`sitemap.xml includes lab route: ${lab}`);
  }

  return { results, failures };
}

async function auditSeo() {
  const failures = [];
  const pages = [];

  for (const locale of LOCALES) {
    const { text, route } = await fetchRoute(`/${locale}`);
    const canonical = pickLink(text, "canonical");
    const lang = text.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1];
    const dir = text.match(/<html[^>]+dir=["']([^"']+)["']/i)?.[1];
    const h1Count = (text.match(/<h1[\s>]/gi) ?? []).length;
    const ogImage = pickMeta(text, "og:image", "property");

    pages.push({ route, canonical, lang, dir, h1Count, ogImage });

    if (h1Count !== 1) failures.push(`/${locale}: h1 count ${h1Count}`);
    if (lang !== locale) failures.push(`/${locale}: lang=${lang}`);
    if (dir !== (locale === "ar" ? "rtl" : "ltr")) failures.push(`/${locale}: dir=${dir}`);
    if (!canonical) failures.push(`/${locale}: missing canonical`);
    if (canonical?.includes("localhost")) failures.push(`/${locale}: localhost canonical`);
    if (canonical && !canonical.includes(CANONICAL_HOST))
      failures.push(`/${locale}: canonical host mismatch (${canonical})`);
    if (!ogImage) failures.push(`/${locale}: missing og:image`);
  }

  return { pages, failures };
}

async function auditLinks(page) {
  const failures = [];
  const internal = [];
  const external = [];

  await page.goto(`${BASE}/en`, { waitUntil: "networkidle", timeout: 90000 });
  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a[href]")).map((a) => ({
      href: a.getAttribute("href") ?? "",
      text: (a.textContent ?? "").trim().slice(0, 80),
    })),
  );

  for (const link of links) {
    if (!link.href || link.href === "#") {
      failures.push(`placeholder href: "${link.text}"`);
      continue;
    }
    if (link.href.startsWith("mailto:")) continue;
    if (link.href.startsWith("/") || link.href.startsWith(`${BASE}`)) {
      internal.push(link.href);
      continue;
    }
    if (link.href.startsWith("http")) external.push(link.href);
  }

  for (const href of [...new Set(internal)].slice(0, 40)) {
    const pathOnly = href.replace(BASE, "");
    if (pathOnly.startsWith("#")) continue;
    const res = await fetch(`${BASE}${pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`}`);
    if (res.status >= 400) failures.push(`broken internal: ${href} (${res.status})`);
  }

  const externalWarnings = [];
  for (const url of SOCIAL_URLS) {
    try {
      const res = await fetch(url, { method: "GET", redirect: "follow" });
      if (res.status >= 400)
        externalWarnings.push(`external ${url}: HTTP ${res.status} (may be bot-blocked)`);
    } catch (error) {
      externalWarnings.push(`external ${url}: ${error.message}`);
    }
  }

  const externalOnPage = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href^="http"]')).map((a) => ({
      href: a.getAttribute("href"),
      rel: a.getAttribute("rel") ?? "",
      target: a.getAttribute("target") ?? "",
    })),
  );

  for (const link of externalOnPage) {
    if (link.href?.includes("gymura.store") || link.href?.includes("github.com")) {
      if (!link.rel.includes("noopener")) {
        failures.push(`missing noopener: ${link.href}`);
      }
    }
  }

  return {
    internalCount: internal.length,
    externalCount: external.length,
    externalWarnings,
    failures,
  };
}

async function auditOverflow(browser) {
  const failures = [];
  const results = [];

  for (const locale of LOCALES) {
    for (const vp of OVERFLOW_VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
      await page.goto(`${BASE}/${locale}`, { waitUntil: "networkidle", timeout: 90000 });
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      }));
      results.push({ locale, ...vp, ...metrics });
      if (metrics.overflow) failures.push(`${locale} ${vp.w}x${vp.h}: horizontal overflow`);
      await page.close();
    }
  }

  return { results, failures };
}

async function auditWorldCore(browser) {
  const failures = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${BASE}/en`, { waitUntil: "networkidle", timeout: 90000 });
  const homeCanvases = await page.locator("canvas").count();
  if (homeCanvases < 1) failures.push("homepage: expected at least one canvas");
  if (homeCanvases > 2) failures.push(`homepage: too many canvases (${homeCanvases})`);

  await page.goto(`${BASE}/en/projects/gymura`, { waitUntil: "networkidle", timeout: 90000 });
  const projectCanvases = await page.locator("canvas").count();
  if (projectCanvases > 0)
    failures.push(`gymura project: unexpected canvas count ${projectCanvases}`);

  await page.close();
  return { homeCanvases, projectCanvases, failures };
}

async function auditTexasFlow(browser) {
  const failures = [];
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE}/en#world-systems`, { waitUntil: "networkidle", timeout: 90000 });
  await page.locator("aside.systems-texas-branch").scrollIntoViewIfNeeded();

  const metrics = await page.evaluate(() => {
    const nodes = Array.from(
      document.querySelectorAll(".journey-rail--micro-flow .journey-rail__node-body"),
    );
    const rects = nodes.map((n) => n.getBoundingClientRect());
    let overlap = false;
    for (let i = 0; i < rects.length - 1; i += 1) {
      if (rects[i].bottom > rects[i + 1].top + 1) overlap = true;
    }
    const track = document.querySelector(".journey-rail--micro-flow .journey-rail__track");
    const display = track ? getComputedStyle(track).display : null;
    return {
      overlap,
      display,
      nodeCount: nodes.length,
      minHeight: Math.min(...rects.map((r) => r.height)),
    };
  });

  if (metrics.overlap) failures.push("texas mobile flow: node overlap");
  if (metrics.display !== "grid")
    failures.push(`texas mobile flow: track display=${metrics.display}`);
  if (metrics.minHeight < 44)
    failures.push(`texas mobile flow: min node height ${metrics.minHeight}`);

  await page.close();
  return { metrics, failures };
}

async function auditLivePreviewScroll(browser) {
  const failures = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/en#world-brands`, { waitUntil: "networkidle", timeout: 90000 });

  const button = page
    .locator('button:has-text("Launch Live Preview"), button:has-text("تشغيل المعاينة المباشرة")')
    .first();

  if ((await button.count()) === 0) {
    await page.close();
    return { skipped: "no launch button visible", failures };
  }

  await button.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const before = await page.evaluate(() => window.scrollY);
  await button.click();
  await page.waitForSelector("iframe[title]", { timeout: 15000 });
  await page.waitForTimeout(1200);
  const after = await page.evaluate(() => window.scrollY);
  const drift = Math.abs(after - before);
  if (drift > 4) failures.push(`live preview scroll drift: ${drift}px`);

  await page.close();
  return { drift, failures };
}

async function auditDisclosures(browser) {
  const failures = [];
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE}/en`, { waitUntil: "networkidle", timeout: 90000 });

  const triggers = page.locator(".mobile-disclosure__trigger");
  const count = await triggers.count();
  if (count === 0) {
    await page.close();
    return { count: 0, failures };
  }

  const first = triggers.first();
  await first.scrollIntoViewIfNeeded();
  const expandedBefore = await first.getAttribute("aria-expanded");
  await first.click();
  await page.waitForTimeout(300);
  const expandedAfter = await first.getAttribute("aria-expanded");
  if (expandedBefore === expandedAfter) failures.push("disclosure: aria-expanded unchanged");

  const panelId = await first.getAttribute("aria-controls");
  if (panelId) {
    const panel = page.locator(`#${panelId}`);
    const hidden = await panel.getAttribute("hidden");
    if (expandedAfter === "true" && hidden !== null) {
      failures.push("disclosure: panel still hidden when expanded");
    }
  }

  await page.close();
  return { count, failures };
}

async function auditConsoleErrors(browser) {
  const failures = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  for (const locale of LOCALES) {
    await page.goto(`${BASE}/${locale}`, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(800);
  }

  const filtered = errors.filter(
    (e) => !e.includes("favicon") && !e.includes("ResizeObserver") && !e.includes("404"),
  );
  if (filtered.length) failures.push(...filtered.map((e) => `console: ${e.slice(0, 200)}`));

  await page.close();
  return { errors: filtered, failures };
}

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(OUT_DIR, { recursive: true });

  const report = {
    base: BASE,
    canonicalHost: CANONICAL_HOST,
    timestamp: new Date().toISOString(),
    sections: {},
    failures: [],
    warnings: [],
  };

  const routes = await auditRoutes();
  report.sections.routes = routes.results;
  report.failures.push(...routes.failures);

  const seo = await auditSeo();
  report.sections.seo = seo.pages;
  report.failures.push(...seo.failures);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const links = await auditLinks(page);
  report.sections.links = {
    internalCount: links.internalCount,
    externalCount: links.externalCount,
    externalWarnings: links.externalWarnings,
  };
  report.failures.push(...links.failures);
  report.warnings.push(...(links.externalWarnings ?? []));

  const overflow = await auditOverflow(browser);
  report.sections.overflow = overflow.results;
  report.failures.push(...overflow.failures);

  const worldCore = await auditWorldCore(browser);
  report.sections.worldCore = worldCore;
  report.failures.push(...worldCore.failures);

  const texas = await auditTexasFlow(browser);
  report.sections.texasFlow = texas.metrics;
  report.failures.push(...texas.failures);

  const preview = await auditLivePreviewScroll(browser);
  report.sections.livePreview = preview;
  report.failures.push(...preview.failures);

  const disclosures = await auditDisclosures(browser);
  report.sections.disclosures = disclosures;
  report.failures.push(...disclosures.failures);

  const consoleAudit = await auditConsoleErrors(browser);
  report.sections.console = consoleAudit;
  report.failures.push(...consoleAudit.failures);

  await browser.close();

  report.pass = report.failures.length === 0;
  report.status = report.pass
    ? "READY TO DEPLOY"
    : report.failures.some((f) => !f.includes("console"))
      ? "NOT READY — BLOCKERS FOUND"
      : "READY WITH NON-BLOCKING WARNINGS";

  await writeFile(path.join(OUT_DIR, "verify-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ status: report.status, failures: report.failures }, null, 2));

  if (!report.pass && report.status === "NOT READY — BLOCKERS FOUND") {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
