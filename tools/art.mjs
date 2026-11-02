// Turns raw generated art into game-ready WebP, using a hidden browser (no image libraries needed).
//   node tools/art.mjs <in.png|jpg> <out.webp> [--key] [--mirror] [--height=1088] [--crop=x,y,w,h]
// --key     remove the magenta background, keeping soft edges (see tools/keyer.mjs).
// --mirror  append a flipped copy so the layer repeats sideways with no visible seam.
// --crop    keep only this rectangle of the source (in source pixels), e.g. to trim a border.
// Output is scaled to --height (1088 = the game's 544px screen at double resolution).
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { KEYER } from './keyer.mjs';

const [inPath, outPath, ...flags] = process.argv.slice(2);
if (!inPath || !outPath) { console.error('usage: node tools/art.mjs <in> <out.webp> [--key] [--mirror] [--height=1088]'); process.exit(1); }
const opt = { key: flags.includes('--key'), mirror: flags.includes('--mirror'),
  height: Number(flags.find((f) => f.startsWith('--height='))?.split('=')[1] ?? 1088),
  crop: flags.find((f) => f.startsWith('--crop='))?.split('=')[1].split(',').map(Number) };
const mime = /\.jpe?g$/i.test(inPath) ? 'image/jpeg' : 'image/png';
const src = `data:${mime};base64,${readFileSync(inPath).toString('base64')}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.addScriptTag({ content: KEYER });
const out = await page.evaluate(async ({ src, opt }) => {
  const img = new Image();
  img.src = src;
  await img.decode();
  const [cx, cy, cw, ch] = opt.crop ?? [0, 0, img.width, img.height];
  const h = opt.height, w = Math.round((cw * h) / ch);
  const c = document.createElement('canvas');
  c.width = opt.mirror ? w * 2 : w;
  c.height = h;
  const g = c.getContext('2d');
  g.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
  if (opt.key) {
    const d = g.getImageData(0, 0, w, h);
    keyMagenta(d.data);
    g.putImageData(d, 0, 0);
  }
  if (opt.mirror) { g.save(); g.translate(w * 2, 0); g.scale(-1, 1); g.drawImage(c, 0, 0, w, h, 0, 0, w, h); g.restore(); }
  return c.toDataURL('image/webp', 0.85);
}, { src, opt });
await browser.close();
writeFileSync(outPath, Buffer.from(out.split(',')[1], 'base64'));
console.log(`${outPath}: ${Math.round(readFileSync(outPath).length / 1024)} KB`);
