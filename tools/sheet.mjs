// Cuts a sprite sheet painted on magenta into equal-size frames, aligned by the feet.
//   node tools/sheet.mjs <sheet.png|jpg> <out.webp> [--height=112] [--frames=8] [--rows=1]
// --frames is per row; with --rows=2 the rows are cut apart first and frames come out in reading order.
// --normalize scales every frame to the same height (for run cycles, where the model drew him at
//             slightly different sizes from frame to frame).
// Frames are lined up by the middle of the head, not the outline, so a flaring scarf can't make
// the body jitter. Frames are found by the empty magenta columns between figures (or, with --frames=N, as N equal-width
// cells when figures overlap). Each frame is cut to its own
// bounds, scaled by one shared factor (so sizes stay consistent), centered sideways, and placed
// with its feet on the bottom edge. The median frame is <height> px tall (so every sheet shares one
// pixel scale); the output is as tall as the tallest frame and each cell as wide as the widest. Prints the frame size for Phaser's spritesheet loader.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { KEYER } from './keyer.mjs';

const [inPath, outPath, ...flags] = process.argv.slice(2);
const num = (name, d) => Number(flags.find((f) => f.startsWith(`--${name}=`))?.split('=')[1] ?? d);
const opt = { height: num('height', 112), frames: num('frames', 0), rows: num('rows', 1), normalize: flags.includes('--normalize') };
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
  // Rows: cut the sheet into horizontal bands at the emptiest row near each expected boundary.
  const rowMass = Array.from({ length: H }, (_, y) => { let m = 0; for (let x = 0; x < W; x++) m += solid(x, y); return m; });
  const bandCuts = [0];
  for (let i = 1; i < opt.rows; i++) {
    const mid = Math.round((i * H) / opt.rows), span = Math.round(H / opt.rows / 3);
    let best = mid;
    for (let y = mid - span; y <= mid + span; y++) if (rowMass[y] < rowMass[best]) best = y;
    bandCuts.push(best);
  }
  bandCuts.push(H);
  const cells = [];
  for (let bi = 0; bi < opt.rows; bi++) {
    const Y0 = bandCuts[bi], Y1 = bandCuts[bi + 1] - 1;
    // Columns that contain any figure pixels, grouped into runs = frames.
    const used = Array.from({ length: W }, (_, x) => { for (let y = Y0; y <= Y1; y++) if (solid(x, y)) return true; return false; });
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
      const n = opt.frames, mass = Array.from({ length: W }, (_, x) => { let m = 0; for (let y = Y0; y <= Y1; y++) m += solid(x, y); return m; });
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
    for (const r of runs) cells.push([r[0], r[1], Y0, Y1]);
  }
  // In each cell, erase floating bits (a neighbour's clipped scarf tip, watermark specks): keep the
  // largest connected piece and any piece at least 20% its size (a detached scarf end), clear the rest.
  for (const [x0, x1, Y0, Y1] of cells) {
    const cw = x1 - x0 + 1, CH = Y1 - Y0 + 1, label = new Int32Array(cw * CH), sizes = [0];
    for (let y = 0; y < CH; y++) for (let x = 0; x < cw; x++) {
      if (label[y * cw + x] || !solid(x0 + x, Y0 + y)) continue;
      const id = sizes.length, stack = [y * cw + x];
      label[y * cw + x] = id;
      let n = 0;
      while (stack.length) {
        const k = stack.pop(), kx = k % cw, ky = (k - kx) / cw;
        n++;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = kx + dx, ny = ky + dy;
          if (nx < 0 || ny < 0 || nx >= cw || ny >= CH) continue;
          const nk = ny * cw + nx;
          if (!label[nk] && solid(x0 + nx, Y0 + ny)) { label[nk] = id; stack.push(nk); }
        }
      }
      sizes.push(n);
    }
    const biggest = Math.max(...sizes);
    for (let y = 0; y < CH; y++) for (let x = 0; x < cw; x++) {
      const k = y * cw + x, i = ((Y0 + y) * W + x0 + x) * 4;
      if (sizes[label[k]] < biggest * 0.2 || (!label[k] && p[i + 3] > 0)) p[i + 3] = 0; // also faint pixels off the figure
    }
  }
  g.putImageData(d, 0, 0);
  // Bounding box of each frame's main figure: rows first, then columns within those rows.
  const boxes = cells.map(([x0, x1, Y0, Y1]) => {
    const rows = Array.from({ length: Y1 - Y0 + 1 }, (_, i) => { let n = 0; for (let x = x0; x <= x1; x++) n += solid(x, Y0 + i); return n; });
    const r = mainRun(rows), ya = Y0 + r.a, yb = Y0 + r.b;
    const cols = Array.from({ length: x1 - x0 + 1 }, (_, i) => { let n = 0; for (let y = ya; y <= yb; y++) n += solid(x0 + i, y); return n; });
    const c = mainRun(cols);
    // Anchor: the middle of his head (the top quarter of the figure), so a flaring scarf or
    // cloak doesn't shift the body from frame to frame.
    let sx = 0, sn = 0;
    for (let y = ya; y <= ya + (yb - ya) * 0.25; y++) for (let x = x0 + c.a; x <= x0 + c.b; x++) if (solid(x, y)) { sx += x; sn++; }
    return { x0: x0 + c.a, x1: x0 + c.b, y0: ya, y1: yb, hx: sn ? sx / sn : (x0 + c.a + x0 + c.b) / 2 };
  });
  // Scale so the typical (median) frame is --height px tall. Using the median, not the tallest, keeps
  // the hero the same size across sheets; a jump frame with a flying scarf just ends up taller.
  const heights = boxes.map((b) => b.y1 - b.y0 + 1).sort((a, b) => a - b);
  const shared = opt.height / heights[Math.floor(heights.length / 2)];
  const scaleOf = (b) => (opt.normalize ? opt.height / (b.y1 - b.y0 + 1) : shared);
  const fh = opt.normalize ? opt.height : Math.ceil(heights[heights.length - 1] * shared);
  const left = Math.max(...boxes.map((b) => (b.hx - b.x0) * scaleOf(b))), right = Math.max(...boxes.map((b) => (b.x1 - b.hx) * scaleOf(b)));
  const fw = Math.ceil(left + right) + 4, anchor = left + 2; // head x within every cell
  const out = document.createElement('canvas');
  out.width = fw * boxes.length; out.height = fh;
  const o = out.getContext('2d');
  boxes.forEach((b, i) => {
    const s = scaleOf(b), w = (b.x1 - b.x0 + 1) * s, h = (b.y1 - b.y0 + 1) * s;
    o.drawImage(c, b.x0, b.y0, b.x1 - b.x0 + 1, b.y1 - b.y0 + 1, i * fw + anchor - (b.hx - b.x0) * s, fh - h, w, h);
  });
  return { url: out.toDataURL('image/webp', 0.9), frames: boxes.length, fw, fh };
}, { src, opt });
await browser.close();
writeFileSync(outPath, Buffer.from(res.url.split(',')[1], 'base64'));
console.log(`${outPath}: ${res.frames} frames, ${res.fw}x${res.fh} each`);
