// Match a keyed sprite sheet's colours to a reference sprite (per-channel mean/std over opaque pixels, alpha kept),
// then remove the magenta spill a video background leaves (pink) without turning dark areas green.
// Used on frames pulled from a Flow (Veo) video so they match the painted art.
//   node tools/colormatch.mjs <src.png> <ref.png|webp> <out.png> [--despill] [--blue-cap=N]
// --despill: for pale/white creatures (the stag): removes pink where red and blue both sit above green, and any green
// cast. Leave it off for colourful characters: it greys green capes and darkens crimson scarves (hero, 2026-11-04).
// --blue-cap=N: blue may rise at most N above max(red, green); for warm/neutral creatures whose thin parts (antennae)
// turn vivid blue (moth: 6). Leave it off for cool-white creatures like the stag.
import { chromium } from 'playwright'; import { readFileSync, writeFileSync } from 'node:fs';
const [src, ref, out] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const despill = process.argv.includes('--despill');
const blueCap = +(process.argv.find((a) => a.startsWith('--blue-cap='))?.split('=')[1] ?? -1);
const uri = (f) => `data:image/${f.endsWith('.webp') ? 'webp' : f.endsWith('.jpg') ? 'jpeg' : 'png'};base64,` + readFileSync(f).toString('base64');
const b = await chromium.launch(); const p = await b.newPage();
const res = await p.evaluate(async ([s, r, bc, ds]) => {
  const load = (u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = u; });
  const px = (img) => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return [c, g, g.getImageData(0, 0, c.width, c.height)]; };
  const stats = (d) => { const m = [0, 0, 0], q = [0, 0, 0]; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 220) { n++; for (let k = 0; k < 3; k++) { m[k] += d[i + k]; q[k] += d[i + k] ** 2; } }
    return m.map((v, k) => [v / n, Math.sqrt(q[k] / n - (v / n) ** 2)]); };
  const [, , rd] = px(await load(r)); const [c, g, sd] = px(await load(s));
  const rs = stats(rd.data), ss = stats(sd.data), d = sd.data;
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0) for (let k = 0; k < 3; k++) d[i + k] = Math.max(0, Math.min(255, (d[i + k] - ss[k][0]) * (rs[k][1] / ss[k][1]) + rs[k][0]));
  for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0) { if (ds) { if (d[i] > d[i + 1] + 3 && d[i + 2] > d[i + 1] + 3) d[i] = d[i + 1] + 3; const m = Math.max(d[i], d[i + 2]); if (d[i + 1] > m) d[i + 1] = m; } if (bc >= 0) d[i + 2] = Math.min(d[i + 2], Math.max(d[i], d[i + 1]) + bc); } // pink (red AND blue above green = magenta spill) -> no pink; red creatures keep their red; no green cast
  g.putImageData(sd, 0, 0); return { url: c.toDataURL('image/png'), rs, ss };
}, [uri(src), uri(ref), blueCap, despill]);
writeFileSync(out, Buffer.from(res.url.split(',')[1], 'base64')); await b.close();
console.log('ref', res.rs.map((x) => x.map(Math.round)), 'src', res.ss.map((x) => x.map(Math.round)));
