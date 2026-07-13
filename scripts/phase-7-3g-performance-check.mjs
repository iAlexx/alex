/**
 * Phase 7.3G — production performance smoke checks (fetch-based).
 * Usage: QA_BASE_URL=http://localhost:3002 node scripts/phase-7-3g-performance-check.mjs
 */

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3002";

const ROUTES = [
  { path: "/en", label: "home-en" },
  { path: "/ar", label: "home-ar" },
  { path: "/en/projects/gymura", label: "gymura" },
  { path: "/en/projects/restaurant-platform", label: "restaurant" },
];

function extractScripts(html) {
  const scripts = [];
  const re = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  return scripts;
}

function extractStyles(html) {
  const styles = [];
  const re = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    styles.push(match[1]);
  }
  return styles;
}

async function fetchSize(url) {
  const res = await fetch(url, { redirect: "follow" });
  const buf = await res.arrayBuffer();
  return { url, status: res.status, bytes: buf.byteLength, type: res.headers.get("content-type") };
}

async function auditRoute(route) {
  const res = await fetch(`${BASE}${route.path}`);
  const html = await res.text();
  const scripts = extractScripts(html);
  const styles = extractStyles(html);
  const hasIframe = /<iframe/i.test(html);
  const hasGymuraInHtml = /gymura\.store/i.test(html);
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  const overflowGuard = /overflow-x/i.test(html);

  const scriptSizes = [];
  let scriptTotal = 0;
  for (const src of scripts) {
    const absolute = src.startsWith("http") ? src : `${BASE}${src}`;
    const meta = await fetchSize(absolute);
    scriptSizes.push(meta);
    scriptTotal += meta.bytes;
  }

  let styleTotal = 0;
  for (const href of styles) {
    const absolute = href.startsWith("http") ? href : `${BASE}${href}`;
    const meta = await fetchSize(absolute);
    styleTotal += meta.bytes;
  }

  return {
    ...route,
    status: res.status,
    htmlBytes: Buffer.byteLength(html, "utf8"),
    scriptCount: scripts.length,
    scriptTotalBytes: scriptTotal,
    styleTotalBytes: styleTotal,
    hasIframeInInitialHtml: hasIframe,
    hasExternalProjectUrlInHtml: hasGymuraInHtml,
    h1Count,
    overflowGuard,
    largestScripts: scriptSizes
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 5)
      .map((s) => ({ url: s.url.replace(BASE, ""), kb: Math.round(s.bytes / 1024) })),
  };
}

async function checkAssets() {
  const paths = ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest", "/icon.svg"];
  const results = [];
  for (const path of paths) {
    const res = await fetch(`${BASE}${path}`, { method: "HEAD" });
    results.push({ path, status: res.status });
  }
  return results;
}

async function main() {
  const routes = [];
  for (const route of ROUTES) {
    routes.push(await auditRoute(route));
  }
  const assets = await checkAssets();

  const failures = [];
  for (const r of routes) {
    if (r.status !== 200) failures.push(`${r.path}: HTTP ${r.status}`);
    if (r.hasIframeInInitialHtml) failures.push(`${r.path}: iframe in initial HTML`);
    if (r.path.startsWith("/en") && r.path === "/en" && r.hasExternalProjectUrlInHtml) {
      // gymura URL may appear in link href, not iframe — allowed
    }
    if (r.h1Count !== 1) failures.push(`${r.path}: h1 count ${r.h1Count}`);
  }

  const report = { base: BASE, routes, assets, failures };
  console.log(JSON.stringify(report, null, 2));

  if (failures.length) {
    console.error(`\n${failures.length} failure(s):`);
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
