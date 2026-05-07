// Generate PWA PNG icons from public/icons/icon.svg using sharp.
// Run with: npm run icons
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import sharp from "sharp";

const root = resolve(process.cwd(), "public/icons");
const source = resolve(root, "icon.svg");

const targets = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-maskable-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

async function main() {
  const svg = await readFile(source);
  await mkdir(root, { recursive: true });

  for (const { name, size } of targets) {
    const out = resolve(root, name);
    await mkdir(dirname(out), { recursive: true });
    await sharp(svg).resize(size, size, { fit: "contain" }).png().toFile(out);
    console.log("✓", name);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
