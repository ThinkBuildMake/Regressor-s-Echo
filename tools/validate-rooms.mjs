// Checks the room layout: no overlapping rooms, and every opening on a shared edge has an opening on the other side.
import fs from 'fs';
const src = fs.readFileSync(process.argv[2], 'utf8');
const Phaser = { Scene: class {}, Game: class {}, Scale: {}, AUTO: 0 };
const ROOMS = new Function('Phaser', 'location', src.replace(/const game = new Phaser\.Game[\s\S]*$/, '') + '\nreturn ROOMS;')(Phaser, { search: '' });
const rs = ROOMS.map(([name, raw, pos], i) => {
  const w = Math.max(30, ...raw.map((r) => r.length)), rows = raw.map((r) => r.padEnd(w, '#'));
  while (rows.length < 17) rows.push('#'.repeat(w));
  const [x, y] = pos ?? [i * 31, 0];
  return { name, x, y, w, h: rows.length, rows, open: (tx, ty) => rows[ty - y]?.[tx - x] !== '#' && rows[ty - y]?.[tx - x] !== undefined };
});
let bad = 0;
for (const a of rs) for (const b of rs) {
  if (a === b) continue;
  if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) { console.log('OVERLAP', a.name, b.name); bad++; }
  if (a.x + a.w === b.x) { // a's right edge touches b's left edge
    for (let ty = Math.max(a.y, b.y); ty < Math.min(a.y + a.h, b.y + b.h); ty++) {
      const ao = a.open(a.x + a.w - 1, ty), bo = b.open(b.x, ty);
      if (ao !== bo) { console.log(`MISMATCH ${a.name} -> ${b.name} at world row ${ty}: ${ao ? 'open' : 'wall'} vs ${bo ? 'open' : 'wall'}`); bad++; }
    }
  }
}
// rightmost openings with nothing next door
for (const a of rs) for (let ty = a.y; ty < a.y + a.h; ty++) for (const [tx, nx] of [[a.x + a.w - 1, a.x + a.w], [a.x, a.x - 1]])
  if (a.open(tx, ty) && !rs.some((b) => b !== a && nx >= b.x && nx < b.x + b.w && ty >= b.y && ty < b.y + b.h)) { console.log('OPEN TO NOWHERE', a.name, 'row', ty - a.y); bad++; }
console.log(bad ? `${bad} problems` : 'layout OK');
