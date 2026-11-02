// Cuts a sprite sheet painted on magenta into equal-size frames, aligned by the feet.
//   node tools/sheet.mjs <sheet.png|jpg> <out.webp> [--height=112] [--frames=8]
// Frames are found by the empty magenta columns between figures (or, with --frames=N, as N equal-width
// cells when figures overlap). Each frame is cut to its own
// bounds, scaled by one shared factor (so sizes stay consistent), centered sideways, and placed
// with its feet on the bottom edge. The median frame is <height> px tall (so every sheet shares one
// pixel scale); the output is as tall as the tallest frame and each cell as wide as the widest. Prints the frame size for Phaser's spritesheet loader.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { KEYER } from './keyer.mjs';

const [inPath, outPath, ...flags] = process.argv.slice(2);
const num = (name, d) => Number(flags.find((f) => f.startsWith(`--${name}=`))?.split('=')[1] ?? d);
const opt = { height: num('height', 112), frames: num('frames', 0) };
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
  g.putImageData(d, 0, 0);
  const solid = (x, y) => p[(y * W + x) * 4 + 3] > 40;
  // Columns that contain any figure pixels, grouped into runs = frames.
  const used = Array.from({ length: W }, (_, x) => { for (let y = 0; y < H; y++) if (solid(x, y)) return true; return false; });
  let runs = [];
  for (let x = 0; x < W; x++) {
    if (!used[x]) continue;
    let e = x;
    while (e + 1 < W && used[e + 1]) e++;
    runs.push([x, e]);
    x = e;
  }
  runs = runs.filter(([a, b]) => b - a > 8);
  // Figures whose scarves or cloaks overlap merge into one run. If the expected frame count is given
  // and doesn't match, cut between neighbours at the emptiest column near each expected boundary.
  if (opt.frames && runs.length !== opt.frames) {
    const n = opt.frames, mass = Array.from({ length: W }, (_, x) => { let m = 0; for (let y = 0; y < H; y++) m += solid(x, y); return m; });
    const cuts = [0];
    for (let i = 1; i < n; i++) {
      const mid = Math.round((i * W) / n), span = Math.round(W / n / 3);
      let best = mid;
      for (let x = mid - span; x <= mid + span; x++) if (mass[x] < mass[best]) best = x;
      cuts.push(best);
    }
    cuts.push(W);
    runs = cuts.slice(0, -1).map((c, i) => [c, cuts[i + 1] - 1]);
  }
  // The main body of a 1-D profile: runs of non-empty entries (gaps up to 3 px bridged), keep the one
  // with the most pixels. Drops stray specks such as a watermark or a neighbour's clipped scarf tip.
  const mainRun = (counts) => {
    let best = null, cur = null, gap = 0;
    counts.forEach((n, i) => {
      if (n > 1) { if (!cur) cur = { a: i, b: i, mass: 0 }; cur.b = i; cur.mass += n; gap = 0; }
      else if (cur && ++gap > 3) { if (!best || cur.mass > best.mass) best = cur; cur = null; gap = 0; }
    });
    if (cur && (!best || cur.mass > best.mass)) best = cur;
    return best ?? { a: 0, b: counts.length - 1 };
  };
  // In each cell, erase floating bits (a neighbour's clipped scarf tip, watermark specks): keep the
  // largest connected piece and any piece at least 20% its size (a detached scarf end), clear the rest.
  for (const [x0, x1] of runs) {
    const cw = x1 - x0 + 1, label = new Int32Array(cw * H), sizes = [0];
    for (let y = 0; y < H; y++) for (let x = 0; x < cw; x++) {
      if (label[y * cw + x] || !solid(x0 + x, y)) continue;
      const id = sizes.length, stack = [y * cw + x];
      label[y * cw + x] = id;
      let n = 0;
      while (stack.length) {
        const k = stack.pop(), kx = k % cw, ky = (k - kx) / cw;
        n++;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = kx + dx, ny = ky + dy;
          if (nx < 0 || ny < 0 || nx >= cw || ny >= H) continue;
          const nk = ny * cw + nx;
          if (!label[nk] && solid(x0 + nx, ny)) { label[nk] = id; stack.push(nk); }
        }
      }
      sizes.push(n);
    }
    const biggest = Math.max(...sizes);
    for (let y = 0; y < H; y++) for (let x = 0; x < cw; x++) {
      const k = y * cw + x, i = (y * W + x0 + x) * 4;
      if (sizes[label[k]] < biggest * 0.2 || (!label[k] && p[i + 3] > 0)) p[i + 3] = 0; // also faint pixels off the figure
    }
  }
  g.putImageData(d, 0, 0);
  // Bounding box of each frame's main figure: rows first, then columns within those rows.
  const boxes = runs.map(([x0, x1]) => {
    const rows = Array.from({ length: H }, (_, y) => { let n = 0; for (let x = x0; x <= x1; x++) n += solid(x, y); return n; });
    const r = mainRun(rows);
    const cols = Array.from({ length: x1 - x0 + 1 }, (_, i) => { let n = 0; for (let y = r.a; y <= r.b; y++) n += solid(x0 + i, y); return n; });
    const c = mainRun(cols);
    return { x0: x0 + c.a, x1: x0 + c.b, y0: r.a, y1: r.b };
  });
  // Scale so the typical (median) frame is --height px tall. Using the median, not the tallest, keeps
  // the hero the same size across sheets; a jump frame with a flying scarf just ends up taller.
  const heights = boxes.map((b) => b.y1 - b.y0 + 1).sort((a, b) => a - b);
  const s = opt.height / heights[Math.floor(heights.length / 2)];
  const fh = Math.ceil(heights[heights.length - 1] * s);
  const fw = Math.ceil(Math.max(...boxes.map((b) => b.x1 - b.x0 + 1)) * s) + 4;
  const out = document.createElement('canvas');
  out.width = fw * boxes.length; out.height = fh;
  const o = out.getContext('2d');
  boxes.forEach((b, i) => {
    const w = (b.x1 - b.x0 + 1) * s, h = (b.y1 - b.y0 + 1) * s;
    o.drawImage(c, b.x0, b.y0, b.x1 - b.x0 + 1, b.y1 - b.y0 + 1, i * fw + (fw - w) / 2, fh - h, w, h);
  });
  return { url: out.toDataURL('image/webp', 0.9), frames: boxes.length, fw, fh };
}, { src, opt });
await browser.close();
writeFileSync(outPath, Buffer.from(res.url.split(',')[1], 'base64'));
console.log(`${outPath}: ${res.frames} frames, ${res.fw}x${res.fh} each`);
