import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
loadEnvFile('.env');
const fixture = JSON.parse(readFileSync('test-results/invoicing-fixture.json', 'utf8'));
const ref = process.argv[2];
if (!fixture.references.includes(ref)) throw new Error('Only a current-run synthetic invoice may be inspected');
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ storageState: 'test-results/invoicing-auth.json' });
  const page = await context.newPage();
  await page.goto(new URL(`invoicing/${ref}`, process.env.BASE_URL.replace(/\/?$/, '/')).href);
  await page.getByRole('main').getByText(fixture.customer, { exact: true }).waitFor();
  const text = await page.getByRole('main').innerText();
  writeFileSync(`blob-report/archive/release-retest-2026-10-24/invoice-${ref}-detail.txt`, text);
  console.log(text);
} finally { await browser.close(); }
