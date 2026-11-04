// Fit a native sheet (from tools/video-frames.mjs) into the cells of an existing game sheet, so it drops in:
// same cell size, and the creature at the same height and position (matched on the union of opaque pixels).
//   node tools/video-fit.mjs <native.png> <nFrames> <target.webp> <out base> [--match=i:j]   (target's .json gives its cell size)
// --match=i:j sizes by one pose instead of the union: source frame i (0-based) to target frame j. Use it when the new
// motion is bigger than the old (a wider wingbeat would otherwise shrink the creature), e.g. wings-up to wings-up.
// Writes <out>.png, <out>.webp and <out>.json.
import { chromium } from 'playwright'; import { readFileSync, writeFileSync } from 'node:fs'; import { execFileSync } from 'node:child_process';
const [src, n, target, out] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const match = process.argv.find((a) => a.startsWith('--match='))?.split('=')[1].split(':').map(Number) ?? null;
if (!out) { console.error('usage: node tools/video-fit.mjs <native.png> <nFrames> <target.webp> <out base>'); process.exit(1); }
const { frameWidth: TW, frameHeight: TH } = JSON.parse(readFileSync(target.replace(/\.webp$/, '.json')));
const uri = (f) => `data:image/${f.endsWith('.webp') ? 'webp' : 'png'};base64,` + readFileSync(f).toString('base64');
const b = await chromium.launch(); const p = await b.newPage();
const r = await p.evaluate(async ([s, t, n, TW, TH, match]) => {
  const load = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u; });
  const data = (img) => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, c.width, c.height); };
  const union = (d, cw, only = -1) => { let t = 1e9, bt = -1, l = 1e9, rt = -1; for (let y = 0; y < d.height; y++) for (let x = 0; x < d.width; x++) if (d.data[(y * d.width + x) * 4 + 3] > 128 && (only < 0 || Math.floor(x / cw) === only)) { const cx = x % cw; t = Math.min(t, y); bt = Math.max(bt, y); l = Math.min(l, cx); rt = Math.max(rt, cx); } return [l, t, rt, bt]; };
  const si = await load(s), ti = await load(t), sw = si.width / n;
  const [sl, st, , sb] = union(data(si), sw, match ? match[0] : -1), [tl, tt, , tb] = union(data(ti), TW, match ? match[1] : -1);
  let k = (tb - tt) / (sb - st), dx = tl - sl * k, dy = tt - st * k;
  // Keep every frame inside the cell: shrink if the whole motion is too big, then shift it in.
  const [ul, ut, ur, ub] = union(data(si), sw), pad = 4;
  const fit = Math.min(1, (TW - 2 * pad) / ((ur - ul) * k), (TH - 2 * pad) / ((ub - ut) * k));
  if (fit < 1) { const cx = tl, cy = tb; k *= fit; dx = cx - sl * k; dy = cy - sb * k; }
  dx = Math.min(Math.max(dx, pad - ul * k), TW - pad - ur * k); dy = Math.min(Math.max(dy, pad - ut * k), TH - pad - ub * k);
  const c = document.createElement('canvas'); c.width = TW * n; c.height = TH; const g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
  for (let i = 0; i < n; i++) { g.save(); g.beginPath(); g.rect(i * TW, 0, TW, TH); g.clip(); g.drawImage(si, i * sw, 0, sw, si.height, i * TW + dx, dy, sw * k, si.height * k); g.restore(); }
  return { url: c.toDataURL('image/png'), k, dx, dy, src: [sl, st, sb], dst: [tl, tt, tb] };
}, [uri(src), uri(target), +n, TW, TH, match]);
await b.close();
writeFileSync(`${out}.png`, Buffer.from(r.url.split(',')[1], 'base64'));
execFileSync('cwebp', ['-quiet', '-exact', '-q', '90', '-alpha_q', '100', `${out}.png`, '-o', `${out}.webp`]);
writeFileSync(`${out}.json`, JSON.stringify({ frameWidth: TW, frameHeight: TH, frames: [] }, null, 1) + '\n');
console.log(JSON.stringify({ scale: +r.k.toFixed(4), dx: Math.round(r.dx), dy: Math.round(r.dy), cell: [TW, TH] }));
