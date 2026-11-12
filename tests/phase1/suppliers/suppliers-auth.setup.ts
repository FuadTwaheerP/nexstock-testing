import { writeFileSync } from 'node:fs';
import { test as setup, expect } from 'playwright/test';
import { appPath, validateProductTestTarget } from '../../../helpers/safety.mjs';
import { required, companyName, journalPath, openSuppliers } from './support/suppliers';

setup('authenticate Suppliers suite and select disposable company', async ({ page }) => {
  setup.setTimeout(60_000);
  validateProductTestTarget(required('BASE_URL'));
  const company = companyName();
  writeFileSync(journalPath, JSON.stringify({ company, entries: [] }));
  await page.goto(appPath('/login', required('BASE_URL')));
  await page.getByLabel('Email Address', { exact: true }).fill(required('PRODUCT_TEST_EMAIL'));
  await page.getByLabel('Password', { exact: true }).fill(required('PRODUCT_TEST_PASSWORD'));
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  const chooser = page.getByRole('heading', { name: 'Choose a business', exact: true });
  const selected = page.getByRole('button', { name: company, exact: true });
  await expect(selected.or(chooser).first()).toBeVisible({ timeout: 20_000 });
  if (await chooser.isVisible()) await page.getByRole('button').filter({ has: page.getByRole('heading', { name: company, exact: true }) }).click();
  await expect(selected).toBeVisible();
  await page.context().storageState({ path: 'test-results/suppliers-auth.json' });
  await openSuppliers(page);
});
