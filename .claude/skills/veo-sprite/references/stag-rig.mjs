// Cut-out rig: one painted standing stag (assets/raw/bosses/stag-base.jpg) -> body layer + 4 legs x 2 segments,
// animated with a 4-beat lateral walk (LH 0, LF .25, RH .5, RF .75; facing left, so near = left side).
//   node rig.mjs            -> stag-walk-rig.webp/.json, frames/*.png (forest bg), debug.png, overlay.png
// All coordinates below are SOURCE pixels of stag-base.jpg (2752x1536).
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KEYER } from '/Users/mrchuang/Documents/Projects/Gauntlet/Game-Week/tools/keyer.mjs';

const OUT = dirname(fileURLToPath(import.meta.url));
const SRC = '/Users/mrchuang/Documents/Projects/Gauntlet/Game-Week/assets/raw/bosses/stag-base.jpg';

// poly: first two points are the SEAM (top edge where the leg leaves the body); the rest go round the leg,
// through magenta gaps where legs separate. P = top pivot (elbow / stifle), J = knee / hock.
// phase = when the hoof lifts (fraction of the cycle). Lower-leg poly part is everything below the J split.
const RIG = {
  N: 8, SWING: 3 / 8, BOB: 3, OVERLAP: 24, FEATHER: 5, FAR_DARK: 0.86,
  cell: { w: 470, h: 700, top: 90, bottom: 646 },            // same scale/placement as assets/bosses/stag-walk.webp
  legs: {
    FF: { F: [1165, 1418], near: false, fore: true, phase: 0.75, P: [1180, 1045], J: [1195, 1250], R: 80,
      poly: [[1100, 1045], [1216, 1045], [1221, 1100], [1229, 1140], [1230, 1160], [1227, 1165], [1227, 1400], [1210, 1420], [1198, 1440], [1186, 1458], [1175, 1475],
        [1090, 1475], [1095, 1440], [1112, 1420], [1135, 1400], [1155, 1300], [1145, 1160], [1125, 1080]] },
    FH: { F: [1588, 1412], near: false, fore: false, phase: 0.5, P: [1600, 1050], J: [1690, 1195], R: 80,
      poly: [[1535, 1045], [1634, 1043], [1714, 1114], [1731, 1140], [1752, 1160], [1760, 1200], [1790, 1240], [1800, 1300],
        [1800, 1400], [1780, 1440], [1775, 1475], [1515, 1475], [1525, 1440], [1540, 1420], [1560, 1400], [1578, 1380],
        [1595, 1340], [1612, 1300], [1625, 1260], [1635, 1200], [1600, 1140], [1565, 1100], [1540, 1060]] },
    NF: { F: [1255, 1425], near: true, fore: true, phase: 0.25, P: [1275, 1050], J: [1258, 1240], R: 80,
      poly: [[1213, 1045], [1342, 1045], [1330, 1100], [1312, 1200], [1305, 1300], [1312, 1400], [1314, 1425], [1296, 1445],
        [1292, 1462], [1278, 1490], [1178, 1495], [1180, 1462], [1198, 1440], [1210, 1420], [1227, 1400], [1228, 1165], [1226, 1140], [1218, 1100]] },
    NH: { F: [1848, 1420], near: true, fore: false, phase: 0, P: [1720, 1068], J: [1845, 1190], R: 80,
      poly: [[1630, 1045], [1850, 1098], [1882, 1140], [1892, 1200], [1896, 1300], [1905, 1400], [1910, 1420], [1895, 1460],
        [1885, 1495], [1770, 1495], [1780, 1460], [1780, 1440], [1800, 1400], [1800, 1300], [1790, 1240], [1760, 1200],
        [1756, 1180], [1750, 1160], [1728, 1140], [1710, 1115]] },
  },
  // swing flex (degrees, + = rotates the hoof forward/left): fore: forearm forward, cannon folds back;
  // hind: gaskin lifts the hock back/up, cannon swings forward.
  flex: { FF: { upper: 30, lower: -84, hoof: -15 }, NF: { upper: 24, lower: -66, hoof: -15 }, FH: { upper: -6, lower: 26, hoof: -15 }, NH: { upper: -16, lower: 48, hoof: -24 } },
  JOINT_R: 30, FETLOCK_R: 22,
};

const overlay = process.argv.includes('--overlay');
const src = 'data:image/jpeg;base64,' + readFileSync(SRC).toString('base64');
const b = await chromium.launch(); const page = await b.newPage();
await page.addScriptTag({ content: KEYER });
const res = await page.evaluate(async ({ src, RIG, overlay }) => {
  const img = new Image(); img.src = src; await img.decode();
  const W = img.width, H = img.height;
  const cv = (w = W, h = H) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const K = cv(); { const g = K.getContext('2d'); g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, W, H); keyMagenta(d.data); g.putImageData(d, 0, 0); g.clearRect(0, 0, W, 4); g.clearRect(0, H - 4, W, 4); g.clearRect(0, 0, 4, H); g.clearRect(W - 4, 0, 4, H); }
  { // drop stray brush specks: connected blobs (alpha > 20) smaller than 600 px
    const g = K.getContext('2d'), d = g.getImageData(0, 0, W, H), p = d.data, seen = new Uint8Array(W * H), st = new Int32Array(W * H);
    for (let s0 = 0; s0 < W * H; s0++) { if (seen[s0] || p[s0 * 4 + 3] <= 20) continue;
      let n = 0, top = 0; st[top++] = s0; seen[s0] = 1; const blob = [];
      while (top) { const q = st[--top]; blob.push(q); n++; const x = q % W;
        for (const r of [q - 1, q + 1, q - W, q + W]) if (r >= 0 && r < W * H && !seen[r] && Math.abs((r % W) - x) <= 1 && p[r * 4 + 3] > 20) { seen[r] = 1; st[top++] = r; } }
      if (n < 600) for (const q of blob) p[q * 4 + 3] = 0; }
    g.putImageData(d, 0, 0); }
  const kd = K.getContext('2d').getImageData(0, 0, W, H).data;
  const path = (g, pts) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const legs = RIG.legs, names = ['FF', 'FH', 'NF', 'NH'];

  // rest hoof contact H0 = lowest solid pixel inside the leg polygon (centre of that row's run)
  for (const n of names) {
    const L = legs[n], t = cv(); L.name = n; const g = t.getContext('2d'); path(g, L.poly); g.fill();
    const m = g.getImageData(0, 0, W, H).data; let best = null;
    for (let y = H - 1; y > 0 && !best; y--) { let xs = []; for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; if (m[i + 3] > 128 && kd[i + 3] > 160) xs.push(x); } if (xs.length > 8) best = [(xs[0] + xs[xs.length - 1]) / 2, y]; }
    L.H0 = best;
  }

  // ---- layers
  const legMask = (L) => { const t = cv(), g = t.getContext('2d'); g.filter = `blur(${RIG.FEATHER}px)`; g.fillStyle = '#fff';
    const p = L.poly.map((q, i) => i < 2 ? [q[0], q[1] - RIG.OVERLAP] : q); path(g, p); g.fill(); return t; };
  const layers = {};
  for (const n of names) {
    const L = legs[n], m = legMask(L);
    // split lines through J (perpendicular to the whole leg) and F (perpendicular to the cannon); each joint also gets a disk so bends never open a gap
    const unit = (v) => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l]; };
    const aJ = unit(sub(L.H0, L.P)), aF = unit(sub(L.H0, L.J));
    const hp = (g, Q, a, side) => { const big = 4000, nx = -a[1], ny = a[0]; g.beginPath(); g.moveTo(Q[0] - nx * big, Q[1] - ny * big); g.lineTo(Q[0] + nx * big, Q[1] + ny * big);
      g.lineTo(Q[0] + nx * big + side * a[0] * big, Q[1] + ny * big + side * a[1] * big); g.lineTo(Q[0] - nx * big + side * a[0] * big, Q[1] - ny * big + side * a[1] * big); g.closePath(); g.fill(); };
    const disk = (g, Q, r) => { g.beginPath(); g.arc(Q[0], Q[1], r, 0, Math.PI * 2); g.fill(); };
    const seg = (which) => {
      const s = cv(), sg = s.getContext('2d'); sg.fillStyle = '#fff';
      if (which === 0) { hp(sg, L.J, aJ, -1); disk(sg, L.J, RIG.JOINT_R); }
      if (which === 1) { hp(sg, L.J, aJ, 1); sg.globalCompositeOperation = 'destination-in'; hp(sg, L.F, aF, -1); sg.globalCompositeOperation = 'source-over'; disk(sg, L.J, RIG.JOINT_R); disk(sg, L.F, RIG.FETLOCK_R); }
      if (which === 2) { hp(sg, L.F, aF, 1); disk(sg, L.F, RIG.FETLOCK_R); }
      const c = cv(), g = c.getContext('2d'); g.drawImage(m, 0, 0);
      g.globalCompositeOperation = 'destination-in'; g.filter = 'blur(1.5px)'; g.drawImage(s, 0, 0); g.filter = 'none';
      g.globalCompositeOperation = 'source-in'; if (!L.near) g.filter = `brightness(${RIG.FAR_DARK})`; g.drawImage(K, 0, 0);
      return c;
    };
    layers[n] = [seg(0), seg(1), seg(2)];
  }
  const body = cv(); { const g = body.getContext('2d'); g.drawImage(K, 0, 0); g.globalCompositeOperation = 'destination-out'; g.filter = 'blur(1.5px)';
    for (const n of names) { path(g, legs[n].poly); g.fill(); } }

  if (overlay) {
    const c = cv(), g = c.getContext('2d'); g.fillStyle = '#6f8f86'; g.fillRect(0, 0, W, H); g.drawImage(K, 0, 0);
    const col = { FF: '#f00', FH: '#fa0', NF: '#0af', NH: '#0f0' };
    for (const n of names) { const L = legs[n]; g.strokeStyle = col[n]; g.lineWidth = 2; path(g, L.poly); g.stroke();
      g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.moveTo(...L.poly[0]); g.lineTo(...L.poly[1]); g.stroke();
      for (const p of [L.P, L.J, L.F, L.H0]) { g.fillStyle = col[n]; g.beginPath(); g.arc(p[0], p[1], 7, 0, 7); g.fill(); } }
    const o = cv(900, 620); o.getContext('2d').drawImage(c, 1040, 900, 900, 620, 0, 0, 900, 620);
    const lay = cv(), lg = lay.getContext('2d'); lg.fillStyle = '#334'; lg.fillRect(0, 0, W, H); lg.drawImage(body, 0, 0);
    const o2 = cv(900, 620); o2.getContext('2d').drawImage(lay, 1040, 900, 900, 620, 0, 0, 900, 620);
    return { overlay: o.toDataURL('image/png'), bodyonly: o2.toDataURL('image/png'), H0: names.map((n) => n + ' ' + legs[n].H0) };
  }

  // ---- animation
  const { w: CW, h: CH, top, bottom } = RIG.cell, S = (bottom - top) / (1483 - 70), OX = 16 - 852 * S, OY = top - 70 * S;
  const rad = Math.PI / 180, ease = (s) => (1 - Math.cos(Math.PI * s)) / 2;
  const sim = (Q, Q2, ang, k) => { const a = k * Math.cos(ang), bb = k * Math.sin(ang); return [a, bb, -bb, a, Q2[0] - (a * Q[0] - bb * Q[1]), Q2[1] - (bb * Q[0] + a * Q[1])]; };
  const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
  const ap = (m, p) => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];
  const angK = (v0, v1) => [Math.atan2(v0[0] * v1[1] - v0[1] * v1[0], v0[0] * v1[0] + v0[1] * v1[1]), Math.hypot(...v1) / Math.hypot(...v0)];

  const pose = (L, t, bob) => {   // transforms (source -> source) for upper, lower, hoof
    const P2 = [L.P[0], L.P[1] + bob], u = (((t - L.phase) % 1) + 1) % 1, c0 = sub(L.H0, L.F), v0 = sub(L.F, L.P);
    const aim = (x) => angK(v0, sub([x - c0[0], L.H0[1] - c0[1]], P2));      // whole-leg angle/scale that puts the hoof contact at (x, ground)
    let ang, k, fu = 0, fl = 0, fh = 0, lifted = false;
    if (u >= RIG.SWING) { const w = (u - RIG.SWING) / (1 - RIG.SWING); [ang, k] = aim(L.H0[0] - L.R + 2 * L.R * w); }
    else { const s = u / RIG.SWING, [ab, kb] = aim(L.H0[0] + L.R), [af, kf] = aim(L.H0[0] - L.R), e = ease(s), f = Math.sin(Math.PI * s), F = RIG.flex[L.name];
      ang = ab + (af - ab) * e; k = kb + (kf - kb) * e; fu = F.upper * rad * f; fl = F.lower * rad * f; fh = F.hoof * rad * f; lifted = s > 0; }
    const U = sim(L.P, P2, ang + fu, k), Lo = sim(L.J, ap(U, L.J), ang + fu + fl, k), Ho = sim(L.F, ap(Lo, L.F), fu + fl + fh, 1);
    return { T: [U, Lo, Ho], hoof: ap(Ho, L.H0), lifted };
  };

  const sheet = cv(CW * RIG.N, CH), sg = sheet.getContext('2d'), frames = [], dbg = cv(CW * RIG.N, CH), dg = dbg.getContext('2d'), info = [];
  sg.imageSmoothingQuality = 'high';
  const M0 = [S, 0, 0, S, OX, OY];
  for (let f = 0; f < RIG.N; f++) {
    const t = f / RIG.N, bob = -RIG.BOB * Math.cos(4 * Math.PI * t), cell = [1, 0, 0, 1, f * CW, 0];
    const Mc = mul(cell, M0), poses = Object.fromEntries(names.map((n) => [n, pose(legs[n], t, bob)]));
    sg.save(); sg.beginPath(); sg.rect(f * CW, 0, CW, CH); sg.clip();
    const drawLeg = (n) => poses[n].T.forEach((m, i) => { sg.setTransform(...mul(Mc, m)); sg.drawImage(layers[n][i], 0, 0); });
    drawLeg('FF'); drawLeg('FH');
    sg.setTransform(...mul(Mc, [1, 0, 0, 1, 0, bob])); sg.drawImage(body, 0, 0);
    drawLeg('NH'); drawLeg('NF');
    sg.restore(); sg.setTransform(1, 0, 0, 1, 0, 0);
    const up = names.filter((n) => poses[n].lifted);
    info.push({ frame: f + 1, lifted: up, hoofY: Object.fromEntries(names.map((n) => [n, Math.round(L0y(n) - poses[n].hoof[1])])) });
    function L0y(n) { return legs[n].H0[1]; }
    // single frame on forest bg for gif
    const fr = cv(CW, CH), fg = fr.getContext('2d'); fg.fillStyle = '#6f8f86'; fg.fillRect(0, 0, CW, CH); fg.drawImage(sheet, f * CW, 0, CW, CH, 0, 0, CW, CH);
    frames.push(fr.toDataURL('image/png'));
  }
  // debug strip: forest bg, ground line per leg, lifted label
  dg.fillStyle = '#6f8f86'; dg.fillRect(0, 0, dbg.width, CH); dg.drawImage(sheet, 0, 0);
  const lab = { NH: 'near hind (LH)', NF: 'near fore (LF)', FH: 'far hind (RH)', FF: 'far fore (RF)' };
  for (let f = 0; f < RIG.N; f++) { for (const n of names) { const y = legs[n].H0[1] * S + OY; dg.fillStyle = legs[n].near ? 'rgba(255,255,0,.6)' : 'rgba(255,128,0,.6)'; dg.fillRect(f * CW + (legs[n].H0[0] - 90) * S + OX, y, 180 * S, 1); }
    dg.fillStyle = '#000'; dg.font = 'bold 22px sans-serif'; dg.fillText(`${f + 1}: ${info[f].lifted.map((n) => lab[n]).join(', ') || '-'}`, f * CW + 10, 680); }
  return { sheet: sheet.toDataURL('image/webp', 0.92), frames, debug: dbg.toDataURL('image/png'), info, S };
}, { src, RIG, overlay });
await b.close();
const save = (p, url) => writeFileSync(join(OUT, p), Buffer.from(url.split(',')[1], 'base64'));
if (overlay) { save('overlay.png', res.overlay); save('bodyonly.png', res.bodyonly); console.log(res.H0.join('\n')); process.exit(0); }
save('stag-walk-rig.webp', res.sheet); save('debug.png', res.debug);
mkdirSync(join(OUT, 'frames'), { recursive: true }); res.frames.forEach((u, i) => save(`frames/f${i}.png`, u));
writeFileSync(join(OUT, 'stag-walk-rig.json'), JSON.stringify({ frameWidth: RIG.cell.w, frameHeight: RIG.cell.h, frames: [] }, null, 1));
// self-check: exactly one hoof lifted per frame, order LH, LF, RH, RF, stance hooves on their ground (|dy| < 0.5 src px)
const order = res.info.map((r) => r.lifted.join('')).filter(Boolean);
for (const r of res.info) for (const [n, dy] of Object.entries(r.hoofY)) if (!r.lifted.includes(n) && Math.abs(dy) > 0.5) throw new Error(`frame ${r.frame} ${n} planted hoof off ground by ${dy}`);
if (res.info.some((r) => r.lifted.length !== 1)) throw new Error('expected exactly one lifted hoof per frame');
console.log(res.info.map((r) => `f${r.frame}: lifted ${r.lifted} hoofLift(src px) ${JSON.stringify(r.hoofY)}`).join('\n'), '\norder', order.join(' '), 'scale', res.S.toFixed(4));
