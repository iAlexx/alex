/**
 * Functional checks for production orbital Hero integration.
 * Requires production server: npx next start -p <port>
 */
const BASE = process.env.PRODUCTION_HERO_URL ?? "http://localhost:3034";

const ROUTES = [
  "/en",
  "/ar",
  "/en/three-hero-lab",
  "/ar/three-hero-lab",
  "/en/projects",
  "/ar/projects",
];

async function checkRoute(page, route) {
  const errors = [];
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 90000 });

  const h1Count = await page.locator("h1").count();
  if (route.includes("three-hero-lab")) {
    if (h1Count < 1) errors.push(`expected h1 on lab route, got ${h1Count}`);
  } else if (route.endsWith("/en") || route.endsWith("/ar")) {
    if (h1Count !== 1) errors.push(`homepage h1 count ${h1Count}, expected 1`);
  }

  if (route.endsWith("/en") || route.endsWith("/ar")) {
    const labBadge = await page.getByText("TRUE 3D HERO LAB").count();
    if (labBadge > 0) errors.push("lab badge leaked to homepage");

    const inSystem = await page.getByText("ALEX · IN THE SYSTEM").count();
    if (inSystem > 0) errors.push("ALEX · IN THE SYSTEM badge present");

    const hero = page.locator("#hero");
    if ((await hero.count()) !== 1) errors.push("missing #hero");

    const waypoint = page.locator('#hero [data-spine-waypoint="core"]');
    if ((await waypoint.count()) !== 1) errors.push("missing core spine waypoint");

    const rail = page.locator("#hero [data-rail-motion-root]");
    if ((await rail.count()) !== 1) errors.push("missing hero-origin-rail root");

    const portrait = page.locator("#hero .lovable-portrait__image");
    if ((await portrait.count()) !== 1) errors.push("portrait image count != 1");

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });
    if (overflow) errors.push("horizontal overflow detected");
  }

  return errors;
}

async function main() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));

  const results = [];
  for (const route of ROUTES) {
    const errors = await checkRoute(page, route);
    results.push({ route, errors });
  }

  await browser.close();

  let failed = false;
  for (const { route, errors } of results) {
    if (errors.length) {
      failed = true;
      console.error(`FAIL ${route}:`, errors.join("; "));
    } else {
      console.log(`OK ${route}`);
    }
  }

  if (consoleErrors.length) {
    failed = true;
    console.error("Console errors:", consoleErrors.slice(0, 10));
  } else {
    console.log("No console errors observed.");
  }

  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
