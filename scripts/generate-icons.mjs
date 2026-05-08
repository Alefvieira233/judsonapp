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

// Placeholder screenshots referenced in public/manifest.json. They satisfy
// PWA install UI requirements (shortcuts + screenshots) until the team ships
// real captures. Same brand background + Bebas-style label as splashes.
const screenshotTargets = [
  { name: "screenshot-narrow.png", width: 1080, height: 1920, label: "Judson App" },
  { name: "screenshot-wide.png", width: 1920, height: 1080, label: "Judson App" },
];

function brandLabelSvg(width, height, label) {
  // Bebas Neue isn't installed at script-runtime, so we lean on a stack of
  // condensed system fallbacks. Output is intentionally simple — a gradient
  // strip + brand label centered. This is a placeholder, not the final art.
  const accent = "#DC2626";
  const fontSize = Math.round(Math.min(width, height) * 0.12);
  const subFontSize = Math.round(fontSize * 0.28);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A0A0A"/>
      <stop offset="100%" stop-color="#171717"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="0" y="${Math.round(height * 0.42)}" width="${width}" height="${Math.round(height * 0.005)}" fill="${accent}"/>
  <text x="50%" y="${Math.round(height * 0.5)}" text-anchor="middle" dominant-baseline="middle"
    font-family="Bebas Neue, Impact, Oswald, Arial Narrow, sans-serif"
    font-size="${fontSize}" font-weight="700" letter-spacing="6" fill="#FAFAFA">${label.toUpperCase()}</text>
  <text x="50%" y="${Math.round(height * 0.5 + fontSize * 0.85)}" text-anchor="middle" dominant-baseline="middle"
    font-family="Inter, Arial, sans-serif"
    font-size="${subFontSize}" letter-spacing="8" fill="#A3A3A3">PERSONAL TRAINER</text>
</svg>`;
}

async function generateScreenshots() {
  for (const { name, width, height, label } of screenshotTargets) {
    const out = resolve(root, name);
    await mkdir(dirname(out), { recursive: true });
    const svgBuf = Buffer.from(brandLabelSvg(width, height, label));
    await sharp(svgBuf).png().toFile(out);
    console.log("✓", name);
  }
}

async function main() {
  const svg = await readFile(source);
  await mkdir(root, { recursive: true });

  await generateIcons(svg);
  await generateSplashes(svg);
  await generateScreenshots();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
