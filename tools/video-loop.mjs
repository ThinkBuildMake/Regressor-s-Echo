// Find the best seamless loop in a Veo video: the window whose last frame matches its first most closely.
//   node tools/video-loop.mjs <in.mp4> [minLen=12] [maxLen=60] [fps=24]
// Compares downscaled silhouettes (anything far from the median border colour). Prints the best windows as
// first,next (1-based frame numbers at <fps>, as written by ffmpeg ... %03d.png) with their difference; lower is better.
// For a walk, check by eye that first..next is ONE stride (the same foot lifts again), not half of one.
import { execFileSync } from 'node:child_process';
const [mp4, minL = 12, maxL = 60, fps = 24] = process.argv.slice(2);
if (!mp4) { console.error('usage: node tools/video-loop.mjs <in.mp4> [minLen] [maxLen] [fps]'); process.exit(1); }
const W = 160, H = 90;
const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', mp4, '-vf', `fps=${fps},scale=${W}:${H}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 28 });
const N = raw.length / (W * H * 3), masks = [];
for (let f = 0; f < N; f++) {
  const o = f * W * H * 3, px = (p, c) => raw[o + p * 3 + c], border = [];
  for (let x = 0; x < W; x++) border.push(x, (H - 1) * W + x);
  const bg = [0, 1, 2].map((c) => border.map((p) => px(p, c)).sort((a, b) => a - b)[border.length >> 1]);
  const m = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) m[p] = Math.hypot(px(p, 0) - bg[0], px(p, 1) - bg[1], px(p, 2) - bg[2]) > 60 ? 1 : 0;
  masks.push(m);
}
const diff = (i, j) => { let s = 0; for (let p = 0; p < W * H; p++) s += masks[i][p] ^ masks[j][p]; return s; };
const best = [];
for (let i = 0; i < N; i++) for (let len = +minL; len <= +maxL && i + len < N; len++) best.push([i + 1, i + 1 + len, len, diff(i, i + len)]);
best.sort((a, b) => a[3] - b[3]);
console.log(`frames ${N} at ${fps} fps`);
for (const [a, b, len, d] of best.slice(0, 10)) console.log(`first=${a} next=${b} len=${len} diff=${d}`);
