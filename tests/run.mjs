// Runs tests/check.html in a hidden browser and prints its RESULT line. Exit code 1 on failure.
import { chromium } from 'playwright';

// Native rendering avoids slow software WebGL on macOS.
const page = await (await chromium.launch({ args: process.platform === 'darwin' ? ['--use-angle=metal'] : [] })).newPage();
const errors = [];
let at = '';
page.on('console', (m) => m.type() === 'info' && m.text().startsWith('at ') && (at = m.text()));
page.on('pageerror', (e) => errors.push(e.message));
// Missing art files are expected (the game draws stand-ins), so their load errors are ignored.
page.on('console', (m) => m.type() === 'error' && !/assets\/|Failed to load resource/.test(m.text()) && errors.push('console: ' + m.text()));
const url = new URL('./check.html', import.meta.url);
if (process.argv[2]) url.searchParams.set('only', process.argv[2]);
await page.goto(url.href);
const result = await page.waitForSelector('pre', { timeout: 600000 }).then((e) => e.textContent(), () => `RESULT FAIL timed out; last check started: ${at}`);
console.log(result);
if (errors.length) console.log('Page errors:\n' + errors.join('\n'));
process.exit(result.includes('RESULT OK') && !errors.length ? 0 : 1);
