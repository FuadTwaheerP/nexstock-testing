import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
loadEnvFile('.env');
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ storageState: 'test-results/suppliers-auth.json' });
  const page = await context.newPage();
  const loaded = page.waitForResponse(r => r.request().method()==='GET' && new URL(r.url()).pathname==='/app/api/v1/settings');
  await page.goto(new URL('settings', process.env.BASE_URL.replace(/\/?$/, '/')).href);
  const response = await loaded, body = await response.json();
  const find = x => { if (!x || typeof x !== 'object') return; if ('companyName' in x && 'taxRegistered' in x) return x; for (const y of Object.values(x)) { const result=find(y); if(result) return result; } };
  const data = find(body);
  await page.getByRole('banner').getByRole('button', { name: 'Nexstock QA Company', exact: true }).waitFor();
  const output = { status: response.status(), keys: Object.keys(data || {}), relevant: data && Object.fromEntries(Object.entries(data).filter(([key]) => /decimal|include.*tax|vat.*number|companyEmail|website/i.test(key))) };
  writeFileSync('blob-report/archive/release-retest-2026-10-24/settings-schema-diagnostic.json', JSON.stringify(output,null,2));
  console.log(JSON.stringify(output));
} finally { await browser.close(); }
