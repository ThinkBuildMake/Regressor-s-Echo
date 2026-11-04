// Runs tests/check.html in hidden browsers and prints its RESULT line. Exit code 1 on failure.
// `node tests/run.mjs "Room,Room"` runs only those rooms in one browser.
// With no filter, the rooms are split across TEST_WORKERS browsers (default 4) that play at the same time.
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

// Native rendering avoids slow software WebGL on macOS.
const args = process.platform === 'darwin' ? ['--use-angle=metal'] : [];

async function run(only) {
  const browser = await chromium.launch({ args });
  const page = await browser.newPage();
  const errors = [];
  let at = '';
  page.on('console', (m) => m.type() === 'info' && m.text().startsWith('at ') && (at = m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  // Missing art files are expected (the game draws stand-ins), so their load errors are ignored.
  page.on('console', (m) => m.type() === 'error' && !/assets\/|Failed to load resource/.test(m.text()) && errors.push('console: ' + m.text()));
  const url = new URL('./check.html', import.meta.url);
  if (only) url.searchParams.set('only', only);
  const start = Date.now();
  await page.goto(url.href);
  const result = await page.waitForSelector('pre', { timeout: 1500000 }).then((e) => e.textContent(), () => `RESULT FAIL timed out; last check started: ${at}`);
  await browser.close();
  return { result, errors, seconds: Math.round((Date.now() - start) / 1000) };
}

let results;
if (process.argv[2]) results = [await run(process.argv[2])];
else {
  // Room names from game.js. The filter splits on commas and matches substrings, so pass each name up to its first comma.
  const names = [...readFileSync(new URL('../game.js', import.meta.url), 'utf8').matchAll(/^  \[(['"])(.*?)\1, \[/gm)]
    .map((m) => m[2].split(',')[0]);
  // The long fights go first so they land in different groups; the rest fill in, lightest group first.
  const weight = { 'The moth': 6, 'The spectral stag': 6, 'The tree guardian': 4, Thornwood: 3, Sawmill: 3, Reliquary: 3, 'The clearing': 3 };
  const groups = Array.from({ length: +(process.env.TEST_WORKERS || 4) }, () => ({ rooms: [], load: 0 }));
  for (const name of [...names].sort((a, b) => (weight[b] ?? 1) - (weight[a] ?? 1))) {
    const g = groups.reduce((a, b) => (b.load < a.load ? b : a));
    g.rooms.push(name); g.load += weight[name] ?? 1;
  }
  results = await Promise.all(groups.map((g) => run(g.rooms.join(','))));
  results.forEach((r, i) => console.log(`worker ${i + 1}: ${r.seconds}s, ${groups[i].rooms.length} rooms`));
}
const fails = results.map((r) => r.result).filter((r) => !r.includes('RESULT OK')).map((r) => r.replace(/^RESULT FAIL /, ''));
const errors = results.flatMap((r) => r.errors);
console.log(fails.length ? `RESULT FAIL ${fails.join(' | ')}` : 'RESULT OK');
if (errors.length) console.log('Page errors:\n' + errors.join('\n'));
process.exit(!fails.length && !errors.length ? 0 : 1);
