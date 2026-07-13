/**
 * Phase 7.4 — Builder Map 3D smoke checks (fetch-based).
 * Usage: QA_BASE_URL=http://localhost:3003 node scripts/phase-7-4-3d-check.mjs
 */

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3003";

const ROUTES = ["/en", "/ar", "/en/projects/gymura"];

async function auditRoute(path) {
  const res = await fetch(`${BASE}${path}`);
  const html = await res.text();
  const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
  const hasMap3dChunk = scripts.some((src) => /builder-map-3d|map3d/i.test(src));
  const hasThree = scripts.some((src) => /three/i.test(src));
  const hasBuilderMapHost = html.includes("data-map3d-host");
  const hasMethodSection = html.includes('id="method"');
  return {
    path,
    status: res.status,
    scriptCount: scripts.length,
    hasMap3dChunkInInitialHtml: hasMap3dChunk,
    hasThreeInInitialHtml: hasThree,
    hasBuilderMapHostOnHome: path.includes("/projects") ? null : hasBuilderMapHost,
    hasMethodSection: path.includes("/projects") ? null : hasMethodSection,
    htmlKb: Math.round(Buffer.byteLength(html, "utf8") / 1024),
  };
}

async function fetchChunkSizes(url) {
  const absolute =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `${BASE}${url.startsWith("/") ? url : `/${url}`}`;
  const res = await fetch(absolute);
  if (!res.ok) return { path: url, status: res.status, kb: 0 };
  const buf = await res.arrayBuffer();
  return { path: url, status: res.status, kb: Math.round(buf.byteLength / 1024) };
}

async function main() {
  const routes = [];
  for (const path of ROUTES) {
    routes.push(await auditRoute(path));
  }

  // Probe homepage scripts for map3d async chunk presence in build manifest via HTML
  const homeRes = await fetch(`${BASE}/en`);
  const homeHtml = await homeRes.text();
  const scriptSrcs = [...homeHtml.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(
    (m) => m[1],
  );

  const scriptSizes = [];
  let totalKb = 0;
  for (const src of scriptSrcs) {
    const meta = await fetchChunkSizes(src);
    scriptSizes.push(meta);
    totalKb += meta.kb;
  }

  const failures = [];
  for (const r of routes) {
    if (r.status !== 200) failures.push(`${r.path}: HTTP ${r.status}`);
    if (r.hasMap3dChunkInInitialHtml)
      failures.push(`${r.path}: map3d scene chunk in synchronous script list`);
    if (r.hasThreeInInitialHtml) failures.push(`${r.path}: three.js in initial scripts`);
    if (r.hasBuilderMapHostOnHome === false)
      failures.push(`${r.path}: missing Builder Map 3D host on homepage`);
  }

  console.log(
    JSON.stringify(
      {
        base: BASE,
        routes,
        homepageScripts: {
          count: scriptSizes.length,
          totalKb,
          largest: scriptSizes.sort((a, b) => b.kb - a.kb).slice(0, 6),
        },
        failures,
      },
      null,
      2,
    ),
  );

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
