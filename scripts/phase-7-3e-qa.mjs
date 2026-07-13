import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const WIDTHS = [320, 375, 768, 1024, 1280, 1440];

const INTERNAL_ROUTES = [
  "/en",
  "/ar",
  "/en/projects",
  "/ar/projects",
  "/en/projects/gymura",
  "/en/projects/restaurant-platform",
  "/en/projects/alexa-ai",
  "/en/projects/automation-lab",
  "/en/projects/cybersecurity-lab",
  "/en/projects/texas-funds",
  "/en/projects/alex-linux",
];

const HOMEPAGE_ANCHORS = [
  "hero",
  "method",
  "world-brands",
  "world-systems",
  "world-intelligence",
  "world-security",
  "future",
  "manifesto",
  "contact",
];

const CASE_STUDY_LINKS = [
  "/en/projects/gymura",
  "/en/projects/restaurant-platform",
  "/en/projects/cybersecurity-lab",
  "/en/projects/texas-funds",
];

async function auditPage(page, label) {
  const consoleIssues = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === "error") pageErrors.push(text);
    if (
      text.includes("hydration") ||
      text.includes("Hydration") ||
      text.includes("Warning:") ||
      text.includes("React")
    ) {
      consoleIssues.push({ type, text: text.slice(0, 300) });
    }
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await page.goto(`${BASE}${label.path}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(label.wait ?? 1200);

  const dom = await page.evaluate(
    ({ anchors }) => {
      const h1Count = document.querySelectorAll("h1").length;
      const main = document.querySelector("main#main");
      const overflowX =
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      const anchorResults = anchors.map((id) => ({
        id,
        exists: Boolean(document.getElementById(id)),
      }));
      const pressedButtons = document.querySelectorAll('button[aria-pressed="true"]').length;
      const railInit = document.documentElement.dataset.railMotionInit === "true";
      const dir = document.documentElement.getAttribute("dir");
      const lang = document.documentElement.getAttribute("lang");
      return {
        h1Count,
        hasMain: Boolean(main),
        overflowX,
        anchorResults,
        pressedButtons,
        railInit,
        dir,
        lang,
        title: document.title,
      };
    },
    { anchors: HOMEPAGE_ANCHORS },
  );

  if (label.scroll) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
  }

  return {
    path: label.path,
    viewport: label.viewport,
    consoleIssues,
    pageErrors,
    dom,
  };
}

async function testFooterAnchors(page) {
  await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
  const results = [];
  for (const { href, expectId } of [
    { href: "/en#future", expectId: "future" },
    { href: "/en#world-security", expectId: "world-security" },
    { href: "/en#contact", expectId: "contact" },
  ]) {
    await page.goto(`${BASE}${href}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const visible = await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (!el) return { exists: false, inView: false };
      const rect = el.getBoundingClientRect();
      return {
        exists: true,
        inView: rect.top < window.innerHeight && rect.bottom > 80,
      };
    }, expectId);
    results.push({ href, ...visible });
  }
  return results;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = { pages: [], overflow: [], footerAnchors: [], routes: [] };

  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const res = await auditPage(page, {
      path: "/en",
      viewport: width,
      scroll: true,
      wait: 1800,
    });
    results.pages.push(res);
    if (res.dom.overflowX) results.overflow.push({ width, path: "/en" });
    await page.close();
  }

  const arPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  results.pages.push(
    await auditPage(arPage, { path: "/ar", viewport: 1280, scroll: true, wait: 1800 }),
  );
  await arPage.close();

  const routePage = await browser.newPage();
  for (const route of INTERNAL_ROUTES) {
    const res = await routePage.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    results.routes.push({ route, status: res?.status() ?? 0 });
  }
  await routePage.close();

  const footerPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  results.footerAnchors = await testFooterAnchors(footerPage);
  await footerPage.close();

  const csPage = await browser.newPage();
  for (const route of CASE_STUDY_LINKS) {
    const res = await csPage.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    results.routes.push({ route, status: res?.status() ?? 0 });
  }
  await csPage.close();

  const notFoundPage = await browser.newPage();
  const nf = await notFoundPage.goto(`${BASE}/en/invalid-page-xyz`, {
    waitUntil: "networkidle",
  });
  results.notFoundStatus = nf?.status() ?? 0;
  results.notFoundHasContent = await notFoundPage.evaluate(
    () => document.body.innerText.length > 20,
  );
  await notFoundPage.close();

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
