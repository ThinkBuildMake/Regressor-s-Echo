// Runs tests/check.html in a hidden browser and prints its RESULT line. Exit code 1 on failure.
import { chromium } from 'playwright';

const page = await (await chromium.launch()).newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(new URL('./check.html', import.meta.url).href);
const result = await (await page.waitForSelector('pre', { timeout: 60000 })).textContent();
console.log(result);
if (errors.length) console.log('Page errors:\n' + errors.join('\n'));
process.exit(result.includes('RESULT OK') && !errors.length ? 0 : 1);
