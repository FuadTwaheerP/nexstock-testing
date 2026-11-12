import { test as setup, expect } from 'playwright/test';
import { appPath, validateProductTestTarget } from '../../../helpers/safety.mjs';
import { required, setting } from './support/adjustments';

setup('authenticate Stock Adjustments suite once', async ({ page }) => {
  setup.setTimeout(60_000);
  const baseURL = required('BASE_URL');
  validateProductTestTarget(baseURL);
  const company = setting('ADJUSTMENT_TEST_COMPANY', setting('STORE_TEST_COMPANY', setting('PRODUCT_TEST_COMPANY', 'Nexstock QA Company')));
  await page.goto(appPath('/login', baseURL));
  await page.getByLabel('Email Address', { exact: true }).fill(required('PRODUCT_TEST_EMAIL'));
  await page.getByLabel('Password', { exact: true }).fill(required('PRODUCT_TEST_PASSWORD'));
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  const chooser = page.getByRole('heading', { name: 'Choose a business', exact: true });
  const companyButton = page.getByRole('button', { name: company, exact: true });
  await expect(companyButton.or(chooser).first()).toBeVisible({ timeout: 20_000 });
  if (await chooser.isVisible()) {
    await page.getByRole('button').filter({ has: page.getByRole('heading', { name: company, exact: true }) }).click();
  }
  await expect(companyButton).toBeVisible({ timeout: 20_000 });
  await page.context().storageState({ path: 'test-results/adjustments-auth.json' });
});
