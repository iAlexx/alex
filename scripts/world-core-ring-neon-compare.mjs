/**
 * Side-by-side before (pre–nucleus-first fix) vs after (ring neon + dark nucleus).
 */
import { mkdir, copyFile, access } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join("docs", "evidence", "world-core-ring-neon-refinement");
const GLOW_SRC = path.join("docs", "evidence", "world-core-lighting-glow");
const VISIBLE_BEFORE = path.join("docs", "evidence", "world-core-visible-lighting", "before");

const PAIRS = [
  { name: "hero-core-blue.png", glow: "after-hero-core-blue-1440x900.png" },
  { name: "gymura-silver.png", glow: "after-gymura-silver-1440x900.png" },
  { name: "restaurant-amber.png", glow: "after-restaurant-amber-1440x900.png" },
  { name: "intelligence-violet.png", glow: "after-intelligence-violet-1440x900.png" },
  { name: "cybersecurity-crimson.png", glow: "after-cybersecurity-crimson-1440x900.png" },
];

async function ensureBefore() {
  const beforeDir = path.join(ROOT, "before");
  await mkdir(beforeDir, { recursive: true });
  for (const pair of PAIRS) {
    const dest = path.join(beforeDir, pair.name);
    const glowPath = path.join(GLOW_SRC, pair.glow);
    const visiblePath = path.join(VISIBLE_BEFORE, pair.name);
    try {
      await access(glowPath);
      await copyFile(glowPath, dest);
    } catch {
      await copyFile(visiblePath, dest);
    }
  }
}

async function main() {
  const { chromium } = await import("playwright");
  await ensureBefore();
  await mkdir(ROOT, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (const pair of PAIRS) {
    const beforeB64 = (
      await import("node:fs/promises").then((fs) =>
        fs.readFile(path.join(ROOT, "before", pair.name)),
      )
    ).toString("base64");
    const afterB64 = (
      await import("node:fs/promises").then((fs) =>
        fs.readFile(path.join(ROOT, "after", pair.name)),
      )
    ).toString("base64");

    const html = `<!DOCTYPE html>
<html><head><style>
body{margin:0;background:#06080f;font-family:system-ui,sans-serif;color:#e9edf6}
h1{font-size:13px;font-weight:600;margin:12px 0 8px;text-align:center}
.row{display:flex;gap:0;justify-content:center}
.col{display:flex;flex-direction:column;align-items:center}
.col img{display:block;max-height:480px;width:auto}
.label{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#9aa4bb;margin:6px 0 10px}
</style></head><body>
<h1>${pair.name}</h1>
<div class="row">
<div class="col"><img src="data:image/png;base64,${beforeB64}" alt="before"/><p class="label">Before (dark nucleus)</p></div>
<div class="col"><img src="data:image/png;base64,${afterB64}" alt="after"/><p class="label">After (ring neon)</p></div>
</div>
</body></html>`;

    const htmlPath = path.join(ROOT, `compare-${pair.name.replace(".png", "")}.html`);
    await import("node:fs/promises").then((fs) => fs.writeFile(htmlPath, html));

    const page = await browser.newPage({ viewport: { width: 1400, height: 620 } });
    await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`);
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(ROOT, `side-by-side-${pair.name}`),
      fullPage: true,
    });
    console.log("side-by-side", pair.name);
    await page.close();
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
