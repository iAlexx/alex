/**
 * One-off hero image derivatives from alex-workstation-original.png.
 * Run: node scripts/optimize-hero-images.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SOURCE = "public/images/alex/alex-workstation-original.png";
const OUT_DIR = "public/images/alex";

/** @type {{ name: string; extract: { left: number; top: number; width: number; height: number }; resize: { width: number }; quality: number }[]} */
const VARIANTS = [
  {
    name: "alex-workstation-desktop.webp",
    extract: { left: 0, top: 0, width: 1086, height: 940 },
    resize: { width: 960 },
    quality: 82,
  },
  {
    name: "alex-workstation-mobile.webp",
    extract: { left: 60, top: 40, width: 966, height: 780 },
    resize: { width: 640 },
    quality: 80,
  },
  {
    name: "alex-workstation-manifesto.webp",
    extract: { left: 0, top: 120, width: 1086, height: 520 },
    resize: { width: 1200 },
    quality: 78,
  },
];

await mkdir(OUT_DIR, { recursive: true });

const meta = await sharp(SOURCE).metadata();
console.log(`Source: ${meta.width}x${meta.height}`);

for (const variant of VARIANTS) {
  const outPath = path.join(OUT_DIR, variant.name);
  const pipeline = sharp(SOURCE).extract(variant.extract).resize({ width: variant.resize.width });

  await pipeline.webp({ quality: variant.quality }).toFile(outPath);

  const outMeta = await sharp(outPath).metadata();
  const { size } = await import("node:fs/promises").then((fs) => fs.stat(outPath));
  console.log(
    `${variant.name}: ${outMeta.width}x${outMeta.height}, ${(size / 1024).toFixed(1)} KB`,
  );
}
