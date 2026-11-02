// Turns raw generated art into game-ready WebP, using a hidden browser (no image libraries needed).
//   node tools/art.mjs <in.png|jpg> <out.webp> [--key] [--mirror] [--height=1088] [--crop=x,y,w,h]
// --key     remove the flat magenta (#FF00FF) background, keeping soft edges: each pixel's magenta
//           share becomes transparency and is subtracted from its color (no pink fringe).
// --mirror  append a flipped copy so the layer repeats sideways with no visible seam.
// --crop    keep only this rectangle of the source (in source pixels), e.g. to trim a border.
// Output is scaled to --height (1088 = the game's 544px screen at double resolution).
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const [inPath, outPath, ...flags] = process.argv.slice(2);
if (!inPath || !outPath) { console.error('usage: node tools/art.mjs <in> <out.webp> [--key] [--mirror] [--height=1088]'); process.exit(1); }
const opt = { key: flags.includes('--key'), mirror: flags.includes('--mirror'),
  height: Number(flags.find((f) => f.startsWith('--height='))?.split('=')[1] ?? 1088),
  crop: flags.find((f) => f.startsWith('--crop='))?.split('=')[1].split(',').map(Number) };
const mime = /\.jpe?g$/i.test(inPath) ? 'image/jpeg' : 'image/png';
const src = `data:${mime};base64,${readFileSync(inPath).toString('base64')}`;

const browser = await chromium.launch();
const page = await browser.newPage();
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
    const d = g.getImageData(0, 0, w, h), p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const [r, gr, b] = [p[i], p[i + 1], p[i + 2]];
      // Magenta-ness: magenta has red and blue high and green at 0; foliage and greys don't.
      const m = Math.max(0, Math.min(r, b) - gr);
      let a = 1 - m / 255;
      if (a < 0.04) { p[i + 3] = 0; continue; }
      a = Math.min(1, a * 1.02);
      // Remove magenta's share from the color: pixel = a*color + (1-a)*magenta.
      p[i] = Math.min(255, Math.max(0, (r - (1 - a) * 255) / a));
      p[i + 1] = Math.min(255, Math.max(0, gr / a));
      p[i + 2] = Math.min(255, Math.max(0, (b - (1 - a) * 255) / a));
      p[i + 3] = Math.round(a * 255);
      // Despill: leftover magenta shows as a purple tint, so red and blue may not exceed green by much.
      // (Fine for forest art; turn this off for art that is meant to be purple.)
      p[i] = Math.min(p[i], p[i + 1]);
      p[i + 2] = Math.min(p[i + 2], p[i + 1] + 4);
    }
    g.putImageData(d, 0, 0);
  }
  if (opt.mirror) { g.save(); g.translate(w * 2, 0); g.scale(-1, 1); g.drawImage(c, 0, 0, w, h, 0, 0, w, h); g.restore(); }
  return c.toDataURL('image/webp', 0.85);
}, { src, opt });
await browser.close();
writeFileSync(outPath, Buffer.from(out.split(',')[1], 'base64'));
console.log(`${outPath}: ${Math.round(readFileSync(outPath).length / 1024)} KB`);
