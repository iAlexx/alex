/**
 * Portrait derivatives from alex-workstation-original.png (same identity, face-forward crop).
 * Run: node scripts/optimize-portrait-images.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SOURCE = "public/images/alex/alex-workstation-original.png";
const OUT_DIR = "public/images/alex";

/** @type {{ name: string; extract: { left: number; top: number; width: number; height: number }; resize: { width: number }; quality: number }[]} */
const VARIANTS = [
  {
    name: "alex-portrait-desktop.webp",
    extract: { left: 180, top: 0, width: 720, height: 900 },
    resize: { width: 720 },
    quality: 84,
  },
  {
    name: "alex-portrait-mobile.webp",
    extract: { left: 220, top: 20, width: 640, height: 820 },
    resize: { width: 480 },
    quality: 82,
  },
  {
    name: "alex-portrait-manifesto.webp",
    extract: { left: 200, top: 40, width: 680, height: 860 },
    resize: { width: 640 },
    quality: 80,
  },
];

await mkdir(OUT_DIR, { recursive: true });

const meta = await sharp(SOURCE).metadata();
console.log(`Source: ${meta.width}x${meta.height}`);

for (const variant of VARIANTS) {
  const outPath = path.join(OUT_DIR, variant.name);
  await sharp(SOURCE)
    .extract(variant.extract)
    .resize({ width: variant.resize.width })
    .webp({ quality: variant.quality })
    .toFile(outPath);

  const outMeta = await sharp(outPath).metadata();
  const { size } = await import("node:fs/promises").then((fs) => fs.stat(outPath));
  console.log(
    `${variant.name}: ${outMeta.width}x${outMeta.height}, ${(size / 1024).toFixed(1)} KB`,
  );
}
