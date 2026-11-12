import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
loadEnvFile('.env');
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ storageState: 'test-results/suppliers-auth.json' });
  const page = await context.newPage();
  await page.goto(new URL('customers', process.env.BASE_URL.replace(/\/?$/, '/')).href);
  await page.getByRole('banner').getByRole('button', { name: 'Nexstock QA Company', exact: true }).waitFor();
  await page.getByRole('main').getByPlaceholder('Search...', { exact: true }).fill('qa.billing.customer@example.invalid');
  const row = page.getByRole('row').filter({ hasText: 'qa.billing.customer@example.invalid' });
  await row.getByRole('button').click();
  await page.getByRole('menuitem', { name: 'View Details', exact: true }).click();
  await page.getByRole('main').getByRole('heading', { name: 'QA Billing Automation Customer', exact: true }).first().waitFor();
  let text = await page.getByRole('main').innerText();
  text += '\nCONTROLS\n' + await page.getByRole('main').ariaSnapshot();
  const statement = page.getByRole('tab', { name: 'Statement', exact: true });
  if (await statement.count() === 1) {
    await statement.click();
    await page.getByRole('heading', { name: /statement/i }).waitFor();
    text += '\nSTATEMENT\n' + await page.getByRole('main').ariaSnapshot();
  }
  writeFileSync('blob-report/archive/release-retest-2026-10-24/ar-ui-diagnostic.txt', text);
  console.log(text);
} finally { await browser.close(); }
