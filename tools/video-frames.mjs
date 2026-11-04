// Frames pulled from a Veo video (magenta background) -> one keyed, aligned sprite sheet, unscaled.
//   node tools/video-frames.mjs <framesDir> <outBase> <first> <next> [n=8] [--mirror] [--anchor=feet|center] [--rot=0] [--t0=50 --t1=120]
// framesDir holds 001.png... (ffmpeg -i in.mp4 -vf fps=24 dir/%03d.png). first..next = one loop (from tools/video-loop.mjs):
// n frames are taken evenly from it. Keys the background (median border colour, soft threshold t0..t1), then aligns every
// frame: --anchor=feet (default) = torso centre x + one shared ground line; center = bbox centre (flyers, hanging things).
// Writes <outBase>.png at native size; then tools/colormatch.mjs and tools/video-fit.mjs.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const a = process.argv.slice(2);
const [dir, out] = a; const first = +a[2], next = +a[3], n = +(a[4] && !a[4].startsWith('--') ? a[4] : 8);
const flag = (k, d) => +(a.find((f) => f.startsWith(`--${k}=`))?.split('=')[1] ?? d);
const anchor = a.find((f) => f.startsWith('--anchor='))?.split('=')[1] ?? 'feet';
const mirror = a.includes('--mirror'), t0 = flag('t0', 50), t1 = flag('t1', 120);
const probe = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', `${dir}/001.png`]).toString().trim().split(',').map(Number);
const [W, H] = probe;
const load = (i) => execFileSync('ffmpeg', ['-v', 'error', '-i', `${dir}/${String(i).padStart(3, '0')}.png`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 28 });

const rot = flag('rot', 0); // start the loop at cell `rot` of the stride (e.g. on the left-hind lift)
const idx = Array.from({ length: n }, (_, k) => first + Math.round((((k + rot) % n) * (next - first)) / n));
const frames = idx.map((i) => {
  const px = load(i);
  // Background = median of the border pixels (compression shifts it away from #FF00FF).
  const border = [];
  for (let x = 0; x < W; x += 4) border.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y += 4) border.push(y * W, y * W + W - 1);
  const bg = [0, 1, 2].map((c) => border.map((p) => px[p * 3 + c]).sort((p, q) => p - q)[border.length >> 1]);
  const rgba = Buffer.alloc(W * H * 4);
  let x0 = W, x1 = 0, y0 = H, y1 = 0;
  for (let p = 0; p < W * H; p++) {
    const c = [px[p * 3], px[p * 3 + 1], px[p * 3 + 2]];
    const d = Math.hypot(c[0] - bg[0], c[1] - bg[1], c[2] - bg[2]);
    const al = Math.min(1, Math.max(0, (d - t0) / (t1 - t0)));
    if (al > 0) for (let k = 0; k < 3; k++) rgba[p * 4 + k] = Math.min(255, Math.max(0, Math.round((c[k] - (1 - al) * bg[k]) / al)));
    // Edge despill: half-transparent edge pixels keep a magenta fringe; pull red and blue down towards green.
    if (al > 0 && al < 1) { const g = rgba[p * 4 + 1]; rgba[p * 4] = Math.min(rgba[p * 4], g + 22); rgba[p * 4 + 2] = Math.min(rgba[p * 4 + 2], g + 38); }
    rgba[p * 4 + 3] = Math.round(al * 255);
    if (al > 0.5) { const x = p % W, y = (p / W) | 0; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  }
  // Anchor: x = centroid of the torso band (40-65% down the box), y = hoof line (bottom).
  let sx = 0, cnt = 0;
  for (let y = Math.round(y0 + 0.4 * (y1 - y0)); y < y0 + 0.65 * (y1 - y0); y++)
    for (let x = x0; x <= x1; x++) if (rgba[(y * W + x) * 4 + 3] > 128) { sx += x; cnt++; }
  if (anchor === 'center') return { i, bg, rgba, box: [x0, y0, x1, y1], ax: (x0 + x1) / 2, ay: (y0 + y1) / 2 };
  return { i, bg, rgba, box: [x0, y0, x1, y1], ax: sx / cnt, ay: y1 };
});
// Camera is locked: one ground line for all frames (a lifted lowest foot must not move the body).
if (anchor === 'feet') { const gy = Math.max(...frames.map((f) => f.ay)); frames.forEach((f) => { f.ay = gy; }); }
// Union box relative to each anchor.
const L = Math.min(...frames.map((f) => f.box[0] - f.ax)) - 12, R = Math.max(...frames.map((f) => f.box[2] - f.ax)) + 12;
const T = Math.min(...frames.map((f) => f.box[1] - f.ay)) - 12, B = anchor === 'center' ? Math.max(...frames.map((f) => f.box[3] - f.ay)) + 12 : 10;
const cw = Math.round(R - L), ch = Math.round(B - T);
const sheet = Buffer.alloc(cw * n * ch * 4);
frames.forEach((f, k) => {
  const ox = Math.round(f.ax + L), oy = Math.round(f.ay + T);
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const sxp = ox + x, syp = oy + y;
    if (sxp < 0 || syp < 0 || sxp >= W || syp >= H) continue;
    const dx = mirror ? cw - 1 - x : x;
    f.rgba.copy(sheet, ((y * cw * n) + k * cw + dx) * 4, (syp * W + sxp) * 4, (syp * W + sxp) * 4 + 4);
  }
});
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${cw * n}x${ch}`, '-i', '-', '-frames:v', '1', `${out}.png`], { input: sheet });
console.log(JSON.stringify({ frames: idx, cell: [cw, ch], bg: frames[0].bg }));
