// Cuts a sprite sheet painted on magenta into equal-size frames, aligned by the head and the feet.
//   node tools/sheet.mjs <sheet.png|jpg> <out.webp> [--height=112] [--frames=8] [--rows=1] [--normalize]
// --frames     figures per row (default 1). --rows: rows of figures; frames come out in reading order.
// --height     the median figure's height in output pixels, so every sheet shares one pixel scale.
// --normalize  scale every frame to that height (for run cycles, where the model drew him at slightly
//              different sizes from frame to frame).
//
// Each figure is found as a connected shape, not by cutting straight lines between figures, because
// figures overlap side to side (feet under the next figure's cape). The biggest connected shapes are
// the figures; smaller detached pieces (a scarf tip) join the nearest figure, and specks are dropped.
// Frames are lined up by the middle of the head and by the feet, so a flaring cape can't make him jitter.
// Also writes <out>.json with each frame's head and feet x, for anchoring poses in the game.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { KEYER } from './keyer.mjs';

const [inPath, outPath, ...flags] = process.argv.slice(2);
if (!inPath || !outPath) { console.error('usage: node tools/sheet.mjs <sheet> <out.webp> [--height=112] [--frames=N] [--rows=R] [--normalize]'); process.exit(1); }
const num = (name, d) => Number(flags.find((f) => f.startsWith(`--${name}=`))?.split('=')[1] ?? d);
const opt = { height: num('height', 112), frames: num('frames', 1), rows: num('rows', 1), normalize: flags.includes('--normalize') };
const mime = /\.jpe?g$/i.test(inPath) ? 'image/jpeg' : 'image/png';
const src = `data:${mime};base64,${readFileSync(inPath).toString('base64')}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.addScriptTag({ content: KEYER });
const res = await page.evaluate(async ({ src, opt }) => {
  const img = new Image();
  img.src = src;
  await img.decode();
  const W = img.width, H = img.height;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, W, H), p = d.data;
  keyMagenta(p); // shared with tools/art.mjs
  // Shapes are found from solid pixels only, so figures whose soft edges touch stay separate.
  const solid = (k) => p[k * 4 + 3] > 200;

  // Label connected shapes (8-connected) across the whole sheet.
  const label = new Int32Array(W * H), comps = [null];
  for (let k = 0; k < W * H; k++) {
    if (label[k] || !solid(k)) continue;
    const id = comps.length, stack = [k], comp = { id, n: 0, x0: W, x1: 0, y0: H, y1: 0, sx: 0, sy: 0 };
    label[k] = id;
    while (stack.length) {
      const q = stack.pop(), x = q % W, y = (q - x) / W;
      comp.n++; comp.sx += x; comp.sy += y;
      comp.x0 = Math.min(comp.x0, x); comp.x1 = Math.max(comp.x1, x); comp.y0 = Math.min(comp.y0, y); comp.y1 = Math.max(comp.y1, y);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const nk = ny * W + nx;
        if (!label[nk] && solid(nk)) { label[nk] = id; stack.push(nk); }
      }
    }
    comps.push(comp);
  }
  // Hand the soft edge pixels back to the shape next to them (a few passes of growing outward).
  for (let pass = 0; pass < 4; pass++) {
    const grow = [];
    for (let k = 0; k < W * H; k++) {
      if (label[k] || p[k * 4 + 3] === 0) continue;
      const x = k % W, y = (k - x) / W;
      for (const nk of [k - 1, k + 1, k - W, k + W]) {
        if (nk < 0 || nk >= W * H || (nk % W === 0 && x === W - 1) || (x === 0 && nk % W === W - 1)) continue;
        if (label[nk]) { grow.push(k, label[nk]); break; }
      }
    }
    if (!grow.length) break;
    for (let i = 0; i < grow.length; i += 2) {
      const k = grow[i], id = grow[i + 1], x = k % W, y = (k - x) / W, cp = comps[id];
      label[k] = id;
      cp.x0 = Math.min(cp.x0, x); cp.x1 = Math.max(cp.x1, x); cp.y0 = Math.min(cp.y0, y); cp.y1 = Math.max(cp.y1, y);
    }
  }
  const all = comps.slice(1).sort((a, b) => b.n - a.n);
  const count = opt.frames * opt.rows;
  const figures = all.slice(0, count);
  if (figures.length < count) return { error: `found ${figures.length} figures, expected ${count}` };
  // Reading order: group into rows by vertical centre, then left to right.
  figures.forEach((f) => { f.cx = f.sx / f.n; f.cy = f.sy / f.n; f.parts = [f.id]; });
  figures.sort((a, b) => a.cy - b.cy);
  const ordered = Array.from({ length: opt.rows }, (_, r) => figures.slice(r * opt.frames, (r + 1) * opt.frames).sort((a, b) => a.cx - b.cx)).flat();
  // Detached pieces at least 0.5% of the smallest figure join the figure whose box is nearest.
  const minFig = Math.min(...ordered.map((f) => f.n));
  const gap = (a, b) => Math.max(0, a.x0 - b.x1, b.x0 - a.x1) + Math.max(0, a.y0 - b.y1, b.y0 - a.y1);
  for (const piece of all.slice(count)) {
    if (piece.n < minFig * 0.005) continue;
    const near = ordered.reduce((best, f) => (gap(piece, f) < gap(piece, best) ? f : best));
    if (gap(piece, near) > 40) continue;
    near.parts.push(piece.id);
    near.x0 = Math.min(near.x0, piece.x0); near.x1 = Math.max(near.x1, piece.x1);
    near.y0 = Math.min(near.y0, piece.y0); near.y1 = Math.max(near.y1, piece.y1);
  }
  // Head anchor: centre of the figure's own pixels in its top quarter.
  for (const f of ordered) {
    const own = new Set(f.parts);
    let sx = 0, sn = 0;
    for (let y = f.y0; y <= f.y0 + (f.y1 - f.y0) * 0.25; y++) for (let x = f.x0; x <= f.x1; x++) if (own.has(label[y * W + x])) { sx += x; sn++; }
    f.hx = sn ? sx / sn : (f.x0 + f.x1) / 2;
  }

  // Scale: the median figure is opt.height tall (or every figure, with --normalize).
  const heights = ordered.map((f) => f.y1 - f.y0 + 1).sort((a, b) => a - b);
  const shared = opt.height / heights[Math.floor(heights.length / 2)];
  const scaleOf = (f) => (opt.normalize ? opt.height / (f.y1 - f.y0 + 1) : shared);
  const fh = opt.normalize ? opt.height : Math.ceil(heights[heights.length - 1] * shared);
  const left = Math.max(...ordered.map((f) => (f.hx - f.x0) * scaleOf(f)));
  const right = Math.max(...ordered.map((f) => (f.x1 - f.hx) * scaleOf(f)));
  const fw = Math.ceil(left + right) + 4, anchor = left + 2; // head x within every cell

  const out = document.createElement('canvas');
  out.width = fw * ordered.length; out.height = fh;
  const o = out.getContext('2d');
  ordered.forEach((f, i) => {
    // Copy only this figure's own pixels, so a neighbour's cape can't leak in.
    const bw = f.x1 - f.x0 + 1, bh = f.y1 - f.y0 + 1, own = new Set(f.parts);
    const part = document.createElement('canvas');
    part.width = bw; part.height = bh;
    const pg = part.getContext('2d'), pd = pg.createImageData(bw, bh);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      const k = (f.y0 + y) * W + f.x0 + x;
      if (!own.has(label[k])) continue;
      const si = k * 4, di = (y * bw + x) * 4;
      pd.data[di] = p[si]; pd.data[di + 1] = p[si + 1]; pd.data[di + 2] = p[si + 2]; pd.data[di + 3] = p[si + 3];
    }
    pg.putImageData(pd, 0, 0);
    const s = scaleOf(f), w = bw * s, h = bh * s;
    o.drawImage(part, i * fw + anchor - (f.hx - f.x0) * s, fh - h, w, h);
  });
  // Where each frame's head and feet are (x within the frame): the head is the alignment anchor,
  // the feet are the rightmost solid pixel in the bottom 30% (used to anchor feet-first slides).
  const od = o.getImageData(0, 0, out.width, fh).data, meta = [];
  for (let i = 0; i < ordered.length; i++) {
    let feet = 0;
    for (let y = Math.floor(fh * 0.7); y < fh; y++) for (let x = 0; x < fw; x++) if (od[(y * out.width + i * fw + x) * 4 + 3] > 120) feet = Math.max(feet, x);
    meta.push({ head: Math.round(anchor), feet });
  }
  return { url: out.toDataURL('image/webp', 0.9), frames: ordered.length, fw, fh, meta };
}, { src, opt });
await browser.close();
if (res.error) { console.error(res.error); process.exit(1); }
writeFileSync(outPath, Buffer.from(res.url.split(',')[1], 'base64'));
writeFileSync(outPath.replace(/\.webp$/, '.json'), JSON.stringify({ frameWidth: res.fw, frameHeight: res.fh, frames: res.meta }, null, 1));
console.log(`${outPath}: ${res.frames} frames, ${res.fw}x${res.fh} each`);
