// Shared magenta-background removal, injected into the hidden browser by tools/art.mjs and tools/sheet.mjs.
// Image models rarely paint exact #FF00FF, so the background's own "magenta strength" is measured first
// (the typical value among clearly magenta pixels), and each pixel's transparency is judged against it.
// A pixel that is part background, part painting gets the background's share removed from its color,
// so soft edges and mist stay soft without a pink fringe. Despill then clears any remaining purple tint.
export const KEYER = `
function keyMagenta(p) {
  const strength = (i) => Math.max(0, Math.min(p[i], p[i + 2]) - p[i + 1]);
  const hist = new Uint32Array(256);
  for (let i = 0; i < p.length; i += 4) { const m = strength(i); if (m > 90) hist[m]++; }
  let total = hist.reduce((a, b) => a + b, 0), seen = 0, bgM = 255;
  for (let m = 255; m > 90; m--) { seen += hist[m]; if (seen > total * 0.5) { bgM = m; break; } } // median
  let br = 0, bb = 0, n = 0;                                      // the background's actual red and blue
  for (let i = 0; i < p.length && n < 5000; i += 4) if (Math.abs(strength(i) - bgM) < 6) { br += p[i]; bb += p[i + 2]; n++; }
  br = n ? br / n : 255; bb = n ? bb / n : 255;
  for (let i = 0; i < p.length; i += 4) {
    const [r, g, b] = [p[i], p[i + 1], p[i + 2]];
    let a = 1 - strength(i) / bgM;
    if (a < 0.06) { p[i + 3] = 0; continue; }
    a = Math.min(1, a);
    const bgG = br - bgM;                                         // background green, from strength = min(r,b) - g
    p[i] = Math.min(255, Math.max(0, (r - (1 - a) * br) / a));
    p[i + 1] = Math.min(255, Math.max(0, (g - (1 - a) * Math.max(0, bgG)) / a));
    p[i + 2] = Math.min(255, Math.max(0, (b - (1 - a) * bb) / a));
    p[i + 3] = Math.round(a * 255);
    if (a < 0.98) {                                               // despill only where background mixed in
      p[i] = Math.min(p[i], p[i + 1] + 40 * a);
      p[i + 2] = Math.min(p[i + 2], p[i + 1] + 44 * a);
    }
  }
}`;
