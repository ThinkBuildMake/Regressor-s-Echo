// Contact sheet: puts webp previews side by side (same height) on the forest colour, for reviewing a batch.
//   node tools/contact.mjs <out.jpg> <a.webp> <b.webp> ...
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
const [out, ...ins] = process.argv.slice(2);
const srcs = ins.map((p) => 'data:image/webp;base64,' + readFileSync(p).toString('base64'));
const b = await chromium.launch(); const pg = await b.newPage();
const url = await pg.evaluate(async (srcs) => { const im = await Promise.all(srcs.map(async (s) => { const i = new Image(); i.src = s; await i.decode(); return i; }));
  const h = 360, ws = im.map((i) => Math.round(i.width * h / i.height)), c = document.createElement('canvas'); c.width = ws.reduce((a, b) => a + b + 10, 0); c.height = h;
  const g = c.getContext('2d'); g.fillStyle = '#6f8f86'; g.fillRect(0, 0, c.width, h); let x = 0; im.forEach((i, k) => { g.drawImage(i, x, 0, ws[k], h); x += ws[k] + 10; }); return c.toDataURL('image/jpeg', 0.85); }, srcs);
writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); await b.close();
