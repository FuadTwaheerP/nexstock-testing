import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
loadEnvFile('.env');
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ storageState: 'test-results/suppliers-auth.json' });
  const page = await context.newPage();
  let original, proposed;
  const find = x => { if (!x || typeof x !== 'object') return; if ('companyName' in x && 'taxRegistered' in x) return x; for (const y of Object.values(x)) { const r=find(y); if(r) return r; } };
  const loaded = page.waitForResponse(r => r.request().method()==='GET' && new URL(r.url()).pathname==='/app/api/v1/settings');
  await context.route('**/api/v1/settings', async route => {
    if (route.request().method()==='PUT') { proposed = route.request().postDataJSON(); await route.abort('blockedbyclient'); }
    else await route.continue();
  });
  await page.goto(new URL('settings', process.env.BASE_URL.replace(/\/?$/, '/')).href);
  original = find(await (await loaded).json());
  await page.locator('#company-name').waitFor();
  if (await page.locator('#company-name').inputValue() !== 'Nexstock QA Company') throw new Error('QA company form must be hydrated');
  await page.getByRole('button', { name: 'Save Changes', exact: true }).click();
  await page.waitForFunction(() => document.body.textContent.includes('Failed') || document.body.textContent.includes('failed'), null, {timeout:10000}).catch(()=>{});
  const summarize = values => Array.isArray(values) ? values.map(v => typeof v === 'object' ? { keys:Object.keys(v), id:v.id, name:v.name, type:v.type, active:v.isActive } : v) : {type:typeof values};
  const output = { externalWrites:0, before:summarize(original.paymentMethods), after:summarize(proposed?.paymentMethods) };
  writeFileSync('blob-report/archive/release-retest-2026-10-24/settings-save-diagnostic.json',JSON.stringify(output,null,2));
  console.log(JSON.stringify(output));
} finally { await browser.close(); }
