/**
 * Capture Hero Lab screenshots — Phase 7.4R.1.
 * Requires: npm run build && npx next start -p 3010
 * Run: node scripts/hero-lab-screenshots.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.HERO_LAB_URL ?? "http://localhost:3010";
const OUT = path.join("docs", "evidence", "hero-lab");

const SHOTS = [
  { name: "variant-a-desktop", url: `${BASE}/en/hero-lab`, variant: "a", device: "desktop" },
  { name: "variant-b-desktop", url: `${BASE}/en/hero-lab`, variant: "b", device: "desktop" },
  { name: "variant-c-desktop", url: `${BASE}/en/hero-lab`, variant: "c", device: "desktop" },
  { name: "variant-a-mobile", url: `${BASE}/en/hero-lab`, variant: "a", device: "mobile" },
  { name: "variant-b-mobile", url: `${BASE}/en/hero-lab`, variant: "b", device: "mobile" },
  { name: "variant-c-mobile", url: `${BASE}/en/hero-lab`, variant: "c", device: "mobile" },
];

async function main() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    console.error("Playwright not installed. Run: npx playwright install chromium");
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const shot of SHOTS) {
    const page = await browser.newPage({
      viewport:
        shot.device === "mobile" ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    });
    await page.goto(shot.url, { waitUntil: "networkidle", timeout: 60000 });

    const variantBtn = page.getByRole("button", {
      name: new RegExp(
        shot.variant === "a"
          ? "Architectural|إطار"
          : shot.variant === "b"
            ? "Glass|زجاج"
            : "Portrait|مكانية",
        "i",
      ),
    });
    await variantBtn.click();
    if (shot.device === "mobile") {
      await page.getByRole("button", { name: /Mobile|الجوال/i }).click();
    } else {
      await page.getByRole("button", { name: /Desktop|سطح/i }).click();
    }
    await page.waitForTimeout(2200);

    const preview = page.locator(".hero-lab-preview__frame");
    const outPath = path.join(OUT, `${shot.name}.png`);
    await preview.screenshot({ path: outPath });
    console.log(`Saved ${outPath}`);
    await page.close();
  }

  await browser.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
