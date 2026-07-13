/**
 * Build side-by-side before/after composites from cropped world-core-layer shots.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join("docs", "evidence", "world-core-visible-lighting");
const PAIRS = ["hero-core-blue.png", "cybersecurity-crimson.png", "gymura-silver.png"];

async function main() {
  const { chromium } = await import("playwright");
  await mkdir(ROOT, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (const name of PAIRS) {
    const beforeB64 = (await readFile(path.join(ROOT, "before", name))).toString("base64");
    const afterB64 = (await readFile(path.join(ROOT, "after", name))).toString("base64");
    const html = `<!DOCTYPE html>
<html><head><style>
body{margin:0;background:#06080f;display:flex;flex-direction:column;align-items:center;font-family:system-ui,sans-serif;color:#e9edf6}
h1{font-size:14px;font-weight:600;margin:12px 0 8px}
.row{display:flex;gap:0}
.col{display:flex;flex-direction:column;align-items:center}
.col img{display:block;max-height:520px;width:auto}
.label{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#9aa4bb;margin:6px 0 10px}
</style></head><body>
<h1>${name}</h1>
<div class="row">
<div class="col"><img src="data:image/png;base64,${beforeB64}" alt="before"/><p class="label">Before</p></div>
<div class="col"><img src="data:image/png;base64,${afterB64}" alt="after"/><p class="label">After</p></div>
</div>
</body></html>`;

    const htmlPath = path.join(ROOT, `compare-${name.replace(".png", "")}.html`);
    await writeFile(htmlPath, html);

    const page = await browser.newPage({ viewport: { width: 1280, height: 640 } });
    await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`);
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(ROOT, `side-by-side-${name}`),
      fullPage: true,
    });
    console.log("Saved side-by-side", name);
    await page.close();
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
