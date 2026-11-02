// Onion skin: stacks every frame of a cut sheet on top of each other, half see-through, on the forest
// colour, and lists each frame's box. A body that drifts shows up doubled; a stray piece shows up as a
// lone speck. For the critic: judge the frames the game plays, not the raw sheet.
//   node tools/onion.mjs <cut.webp> <frames> <out.png>
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const [inPath, n, outPath] = process.argv.slice(2);
if (!inPath || !n || !outPath) { console.error('usage: node tools/onion.mjs <cut.webp> <frames> <out.png>'); process.exit(1); }
const src = `data:image/webp;base64,${readFileSync(inPath).toString('base64')}`;

const browser = await chromium.launch();
const page = await browser.newPage();
const res = await page.evaluate(async ({ src, n }) => {
  const img = new Image(); img.src = src; await img.decode();
  const fw = img.width / n, fh = img.height, s = 3;
  const c = document.createElement('canvas'); c.width = fw * s; c.height = fh * s;
  const g = c.getContext('2d');
  g.fillStyle = '#6f8f86'; g.fillRect(0, 0, c.width, c.height);
  g.globalAlpha = 1 / n + 0.15;
  for (let i = 0; i < n; i++) g.drawImage(img, i * fw, 0, fw, fh, 0, 0, fw * s, fh * s);
  g.globalAlpha = 1;
  // Each frame's box of solid pixels, and whether anything touches the cell edge.
  const t = document.createElement('canvas'); t.width = img.width; t.height = fh;
  const tg = t.getContext('2d'); tg.drawImage(img, 0, 0);
  const d = tg.getImageData(0, 0, img.width, fh).data, boxes = [];
  for (let i = 0; i < n; i++) {
    let x0 = fw, x1 = -1, y0 = fh, y1 = -1, edge = false;
    for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) if (d[(y * img.width + Math.round(i * fw) + x) * 4 + 3] > 120) {
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); if (x === 0 || x >= fw - 1) edge = true;
    }
    boxes.push({ frame: i + 1, box: [x0, y0, x1, y1], touchesEdge: edge });
  }
  return { url: c.toDataURL('image/png'), boxes };
}, { src, n: Number(n) });
await browser.close();
writeFileSync(outPath, Buffer.from(res.url.split(',')[1], 'base64'));
console.log(JSON.stringify(res.boxes));
