// Draws a four-beat walk pose guide for a quadruped (stag-shaped silhouettes, facing left) to attach in
// Flow as a pose reference. Legs follow a lateral-sequence walk (left hind, left fore, right hind, right
// fore, a quarter cycle apart); a foot lifts while it swings forward. Near legs dark, far legs lighter.
//   node tools/gait-guide.mjs <out.png> [frames=4]
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const [out, n = '4'] = process.argv.slice(2);
if (!out) { console.error('usage: node tools/gait-guide.mjs <out.png> [frames]'); process.exit(1); }
const b = await chromium.launch(); const p = await b.newPage();
const url = await p.evaluate((N) => {
  const cw = 640, ch = 560, c = document.createElement('canvas'); c.width = cw * N; c.height = ch;
  const g = c.getContext('2d'); g.fillStyle = '#ff00ff'; g.fillRect(0, 0, c.width, ch); g.lineCap = 'round';
  // phase of each leg in the cycle (lateral walk) and its hip x offset (facing left: fore legs on the left)
  const legs = [ { name: 'far hind', phase: 0.0, x: 150, near: false }, { name: 'far fore', phase: 0.25, x: -150, near: false },
                 { name: 'near hind', phase: 0.5, x: 165, near: true }, { name: 'near fore', phase: 0.75, x: -135, near: true } ];
  for (let f = 0; f < N; f++) {
    const ox = f * cw + cw / 2, hipY = 270, t = f / N;
    const leg = (L) => {
      const ph = ((t + L.phase) % 1), swing = ph < 0.35;                    // 35% of the cycle in the air
      const u = swing ? ph / 0.35 : (ph - 0.35) / 0.65;                      // 0..1 within swing or stance
      const reach = 70, fx = swing ? reach - 2 * reach * (1 - u) : reach - 2 * reach * u; // hoof x: stance moves back, swing forward
      const footX = ox + L.x - fx, lift = swing ? Math.sin(u * Math.PI) * 55 : 0;
      const groundY = 500, hx = ox + L.x, hy = hipY + 10;
      const kx = (hx + footX) / 2 + (L.x > 0 ? 22 : -12), ky = (hy + groundY - lift) / 2 + (swing ? -20 : 0);
      g.strokeStyle = L.near ? '#1c1a24' : '#8a8798'; g.lineWidth = L.near ? 22 : 18;
      g.beginPath(); g.moveTo(hx, hy); g.lineTo(kx, ky); g.lineTo(footX, groundY - lift); g.stroke();
    };
    legs.filter((L) => !L.near).forEach(leg);
    g.fillStyle = '#4b4757'; g.beginPath(); g.ellipse(ox, hipY, 210, 75, 0, 0, Math.PI * 2); g.fill();   // body
    g.lineWidth = 46; g.strokeStyle = '#4b4757'; g.beginPath(); g.moveTo(ox - 160, hipY - 30); g.lineTo(ox - 225, hipY - 160); g.stroke(); // neck, head high
    g.beginPath(); g.ellipse(ox - 255, hipY - 175, 50, 26, -0.3, 0, Math.PI * 2); g.fill();              // head facing left
    legs.filter((L) => L.near).forEach(leg);
    g.fillStyle = '#000'; g.font = 'bold 34px sans-serif'; g.fillText(String(f + 1), f * cw + 24, 50);
  }
  return c.toDataURL('image/png');
}, Number(n));
writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); await b.close(); console.log(out);
