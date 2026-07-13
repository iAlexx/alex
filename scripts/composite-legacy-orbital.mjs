import path from "node:path";
import sharp from "sharp";

const OUT = path.join("docs", "evidence", "production-orbital-hero");
const left = path.join(OUT, "en-1440x900-legacy-workstation.png");
const right = path.join(OUT, "en-1440x900.png");
const out = path.join(OUT, "before-legacy-vs-after-orbital.png");

const [l, r] = await Promise.all([
  sharp(left).resize(720, 900, { fit: "contain", background: "#05070b" }).toBuffer(),
  sharp(right).resize(720, 900, { fit: "contain", background: "#05070b" }).toBuffer(),
]);

const svg = Buffer.from(`<svg width="1480" height="940">
  <rect width="1480" height="940" fill="#05070b"/>
  <text x="360" y="28" fill="#8ea0b8" font-family="sans-serif" font-size="14" text-anchor="middle">Legacy workstation Hero</text>
  <text x="1120" y="28" fill="#8ea0b8" font-family="sans-serif" font-size="14" text-anchor="middle">Production orbital Hero</text>
</svg>`);

await sharp(svg)
  .composite([
    { input: l, left: 20, top: 40 },
    { input: r, left: 760, top: 40 },
  ])
  .png()
  .toFile(out);

console.log("Saved", out);
