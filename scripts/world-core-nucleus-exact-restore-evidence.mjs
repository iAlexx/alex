/**
 * Nucleus exact-restore evidence — crops world-core-layer.
 * Before: docs/evidence/persistent-world-core (approved pre-lighting full-page)
 * After: this script (layer crop at same scroll targets)
 */
import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.NUCLEUS_RESTORE_URL ?? "http://localhost:3066";
const ROOT = path.join("docs", "evidence", "world-core-nucleus-exact-restore");
const AFTER = path.join(ROOT, "after");
const BEFORE = path.join(ROOT, "before");

const SHOTS = [
  { id: "hero", name: "hero-core-blue.png", before: "en-hero-core-1440x900.png" },
  { id: "world-brands", name: "gymura-silver.png", before: "en-brands-gymura-1440x900.png" },
  {
    id: "world-systems",
    name: "restaurant-amber.png",
    before: "en-systems-restaurant-1440x900.png",
  },
  {
    id: "world-intelligence",
    name: "intelligence-violet.png",
    before: "en-intelligence-1440x900.png",
  },
  { id: "world-security", name: "cybersecurity-crimson.png", before: "en-security-1440x900.png" },
];

const PERSISTENT = path.join("docs", "evidence", "persistent-world-core");

async function ensureBefore() {
  await mkdir(BEFORE, { recursive: true });
  for (const shot of SHOTS) {
    const src = path.join(PERSISTENT, shot.before);
    await copyFile(src, path.join(BEFORE, shot.name));
  }
}

async function captureAfter() {
  const { chromium } = await import("playwright");
  await mkdir(AFTER, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  for (const shot of SHOTS) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/en`, { waitUntil: "networkidle", timeout: 90000 });
    await page.evaluate((sectionId) => {
      document.getElementById(sectionId)?.scrollIntoView({ block: "center", behavior: "instant" });
    }, shot.id);
    await page.waitForTimeout(1800);
    await page.locator("[data-world-core-layer]").screenshot({ path: path.join(AFTER, shot.name) });
    console.log("after", shot.name);
    await page.close();
  }
  await browser.close();
}

async function compare() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  for (const shot of SHOTS) {
    const beforeB64 = (
      await import("node:fs/promises").then((fs) => fs.readFile(path.join(BEFORE, shot.name)))
    ).toString("base64");
    const afterB64 = (
      await import("node:fs/promises").then((fs) => fs.readFile(path.join(AFTER, shot.name)))
    ).toString("base64");
    const html = `<!DOCTYPE html><html><head><style>
body{margin:0;background:#06080f;font-family:system-ui;color:#e9edf6}
h1{font-size:13px;text-align:center;margin:12px 0 8px}
.row{display:flex;justify-content:center}
.col{display:flex;flex-direction:column;align-items:center}
.col img{max-height:460px;display:block}
.label{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#9aa4bb;margin:6px 0 10px}
</style></head><body><h1>${shot.name}</h1><div class="row">
<div class="col"><img src="data:image/png;base64,${beforeB64}"/><p class="label">Approved pre-lighting</p></div>
<div class="col"><img src="data:image/png;base64,${afterB64}"/><p class="label">Exact restore + ring neon</p></div>
</div></body></html>`;
    const htmlPath = path.join(ROOT, `compare-${shot.name.replace(".png", "")}.html`);
    await import("node:fs/promises").then((fs) => fs.writeFile(htmlPath, html));
    const page = await browser.newPage({ viewport: { width: 1400, height: 600 } });
    await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`);
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(ROOT, `side-by-side-${shot.name}`), fullPage: true });
    console.log("side-by-side", shot.name);
    await page.close();
  }
  await browser.close();
}

async function main() {
  await mkdir(ROOT, { recursive: true });
  await ensureBefore();
  await captureAfter();
  await compare();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
