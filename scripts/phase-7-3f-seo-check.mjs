/**
 * Phase 7.3F — server-rendered metadata and asset smoke test (fetch-only, no Playwright).
 * Usage: QA_BASE_URL=http://localhost:3000 node scripts/phase-7-3f-seo-check.mjs
 */

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";

const PAGES = [
  "/en",
  "/ar",
  "/en/projects",
  "/ar/projects",
  "/en/projects/gymura",
  "/en/projects/restaurant-platform",
  "/en/projects/texas-funds",
  "/en/projects/alexa-ai",
  "/en/projects/automation-lab",
  "/en/projects/cybersecurity-lab",
  "/en/projects/alex-linux",
  "/en/projects/upcoming",
];

function pickMeta(html, name, attr = "name") {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)["']`, "i");
  const alt = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, "i");
  return html.match(re)?.[1] ?? html.match(alt)?.[1] ?? null;
}

function pickOg(html, property) {
  return pickMeta(html, property, "property");
}

function pickLink(html, rel, extra = "") {
  const re = new RegExp(`<link[^>]+rel=["']${rel}["']${extra}[^>]+href=["']([^"']*)["']`, "i");
  const alt = new RegExp(`<link[^>]+href=["']([^"']*)["'][^>]+rel=["']${rel}["']${extra}`, "i");
  return html.match(re)?.[1] ?? html.match(alt)?.[1] ?? null;
}

function pickHreflang(html) {
  const re =
    /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["'][^>]*>/gi;
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ lang: m[1], href: m[2] });
  }
  return out;
}

function pickJsonLdTypes(html) {
  const blocks = [
    ...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ];
  return blocks.map(([, body]) => {
    try {
      const parsed = JSON.parse(body.trim());
      if (parsed["@graph"]) return parsed["@graph"].map((n) => n["@type"]);
      return [parsed["@type"]];
    } catch {
      return ["parse-error"];
    }
  });
}

function inspectHtml(path, html) {
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? null;
  const lang = html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1] ?? null;
  const dir = html.match(/<html[^>]+dir=["']([^"']+)["']/i)?.[1] ?? null;
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  return {
    path,
    title,
    description: pickMeta(html, "description"),
    canonical: pickLink(html, "canonical"),
    hreflang: pickHreflang(html),
    ogTitle: pickOg(html, "og:title"),
    ogDescription: pickOg(html, "og:description"),
    ogImage: pickOg(html, "og:image"),
    ogLocale: pickOg(html, "og:locale"),
    twitterCard: pickMeta(html, "twitter:card"),
    robots: pickMeta(html, "robots"),
    lang,
    dir,
    h1Count,
    jsonLdTypes: pickJsonLdTypes(html),
  };
}

async function fetchText(path) {
  const res = await fetch(`${BASE}${path}`);
  const text = await res.text();
  return { path, status: res.status, type: res.headers.get("content-type"), text };
}

async function fetchHead(path) {
  const res = await fetch(`${BASE}${path}`, { method: "HEAD" });
  return { path, status: res.status, type: res.headers.get("content-type") };
}

async function main() {
  const pages = [];
  for (const path of PAGES) {
    const { status, text } = await fetchText(path);
    if (status !== 200) {
      pages.push({ path, error: `HTTP ${status}` });
      continue;
    }
    pages.push(inspectHtml(path, text));
  }

  const assets = await Promise.all([
    fetchText("/robots.txt"),
    fetchText("/sitemap.xml"),
    fetchHead("/manifest.webmanifest"),
    fetchHead("/icon.svg"),
    fetchHead("/apple-icon.svg"),
    fetchHead("/en/opengraph-image"),
    fetchHead("/en/projects/gymura/opengraph-image"),
    fetchHead("/ar/opengraph-image"),
  ]);

  const assetSummary = assets.map((a) => ({
    path: a.path,
    status: a.status,
    type: a.type,
    snippet: a.text ? a.text.slice(0, 200).replace(/\s+/g, " ") : undefined,
  }));

  const failures = [];
  for (const p of pages) {
    if (p.error) failures.push(`${p.path}: ${p.error}`);
    else {
      if (!p.title) failures.push(`${p.path}: missing title`);
      if (!p.description) failures.push(`${p.path}: missing description`);
      if (!p.canonical) failures.push(`${p.path}: missing canonical`);
      if (p.hreflang.length < 2) failures.push(`${p.path}: missing hreflang alternates`);
      if (!p.ogTitle) failures.push(`${p.path}: missing og:title`);
      if (!p.ogImage) failures.push(`${p.path}: missing og:image`);
      if (p.h1Count !== 1) failures.push(`${p.path}: h1 count ${p.h1Count} (expected 1)`);
      if (!p.lang) failures.push(`${p.path}: missing html lang`);
      if (!p.dir) failures.push(`${p.path}: missing html dir`);
    }
  }

  for (const a of assetSummary) {
    if (a.status !== 200) failures.push(`${a.path}: HTTP ${a.status}`);
  }

  const report = { base: BASE, pages, assets: assetSummary, failures };
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
