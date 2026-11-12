import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
loadEnvFile('.env');
const fixture = JSON.parse(readFileSync('test-results/invoicing-fixture.json', 'utf8'));
const ref = fixture.references.at(-1);
if (!ref || !fixture.company.startsWith('Nexstock QA')) throw new Error('Only an existing current-run QA invoice may be inspected');
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ storageState: 'test-results/invoicing-auth.json', serviceWorkers: 'block' });
  const page = await context.newPage();
  const diagnostic = { ref, errors: [], downloads: [], popups: [], responses: [], printCalls: 0 };
  await context.addInitScript(() => { window.__qaPdfPrint = 0; window.print = () => { window.__qaPdfPrint++; }; });
  const popupReads = [];
  page.on('pageerror', error => diagnostic.errors.push(error.message));
  page.on('download', download => diagnostic.downloads.push(download.suggestedFilename()));
  page.on('popup', popup => {
    const read = (async () => {
      const response = await popup.waitForLoadState('domcontentloaded').then(() => null).catch(() => null);
      diagnostic.popups.push({ url: popup.url().split('?')[0], title: await popup.title(), body: (await popup.locator('body').innerText()).slice(0,1200), printCalls: await popup.evaluate(() => window.__qaPdfPrint) });
    })();
    popupReads.push(read);
  });
  page.on('response', response => { if (/pdf|download|export/i.test(new URL(response.url()).pathname)) diagnostic.responses.push({ path: new URL(response.url()).pathname, status: response.status(), type: response.headers()['content-type'] }); });
  await page.goto(new URL('invoicing', process.env.BASE_URL.replace(/\/?$/, '/')).href, { waitUntil: 'domcontentloaded' });
  await page.getByRole('main').getByPlaceholder('Search by invoice ID or customer name...').fill(ref);
  const row = page.getByRole('row').filter({ has: page.getByRole('cell', { name: ref, exact: true }) });
  await row.locator('button:has(svg.lucide-download)').click({ timeout: 10000 });
  await page.waitForFunction(() => window.__qaPdfPrint > 0, null, { timeout: 10000 }).catch(() => {});
  await Promise.all(popupReads);
  diagnostic.printCalls = await page.evaluate(() => window.__qaPdfPrint);
  const output = 'blob-report/archive/release-retest-2026-10-24/invoice-pdf-diagnostic.json';
  writeFileSync(output, JSON.stringify(diagnostic, null, 2));
  console.log(JSON.stringify(diagnostic));
} finally { await browser.close(); }
