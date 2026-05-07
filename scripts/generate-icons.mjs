// Generate PWA PNG icons + Apple splash screens from public/icons/icon.svg.
// Run with: npm run icons
import { readFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import sharp from "sharp";

const root = resolve(process.cwd(), "public/icons");
const source = resolve(root, "icon.svg");

const iconTargets = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-maskable-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

// Apple splash screens — pixel sizes match recent iPhone/iPad models. iOS only
// uses an apple-touch-startup-image when the media query matches the device
// exactly, so we cover the most common modern viewports.
const splashTargets = [
  { name: "splash-1290x2796.png", width: 1290, height: 2796 }, // iPhone 14/15 Pro Max
  { name: "splash-1179x2556.png", width: 1179, height: 2556 }, // iPhone 14/15 Pro
  { name: "splash-1170x2532.png", width: 1170, height: 2532 }, // iPhone 12/13/14
  { name: "splash-1125x2436.png", width: 1125, height: 2436 }, // iPhone X/Xs/11 Pro
  { name: "splash-828x1792.png",  width: 828,  height: 1792 }, // iPhone XR/11
  { name: "splash-750x1334.png",  width: 750,  height: 1334 }, // iPhone 6/7/8/SE2
];

async function generateIcons(svg) {
  for (const { name, size } of iconTargets) {
    const out = resolve(root, name);
    await mkdir(dirname(out), { recursive: true });
    await sharp(svg).resize(size, size, { fit: "contain" }).png().toFile(out);
    console.log("✓", name);
  }
}

async function generateSplashes(svg) {
  // Render the logo once at a generous size, then composite onto each splash.
  const logoPng = await sharp(svg)
    .resize(420, 420, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  for (const { name, width, height } of splashTargets) {
    const out = resolve(root, name);
    await mkdir(dirname(out), { recursive: true });

    // Logo scaled to ~30% of the shorter edge.
    const logoSize = Math.round(Math.min(width, height) * 0.3);
    const scaledLogo = await sharp(logoPng)
      .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    await sharp({
      create: { width, height, channels: 4, background: "#0A0A0A" },
    })
      .composite([{ input: scaledLogo, gravity: "center" }])
      .png()
      .toFile(out);
    console.log("✓", name);
  }
}

async function main() {
  const svg = await readFile(source);
  await mkdir(root, { recursive: true });

  await generateIcons(svg);
  await generateSplashes(svg);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
