import { resolve } from 'node:path';
import { test as setup, expect } from 'playwright/test';
import { appPath, validateProductTestTarget } from '../../../helpers/safety.mjs';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}; see .env.example`);
  return value;
}

setup('authenticate Stores suite once', async ({ page }) => {
  const baseURL = required('BASE_URL');
  const company = process.env.STORE_TEST_COMPANY?.trim()
    || process.env.PRODUCT_TEST_COMPANY?.trim()
    || 'Nexstock QA Company';
  validateProductTestTarget(baseURL);

  await page.goto(appPath('/login', baseURL));
  await page.getByLabel('Email Address', { exact: true }).fill(required('PRODUCT_TEST_EMAIL'));
  await page.getByLabel('Password', { exact: true }).fill(required('PRODUCT_TEST_PASSWORD'));
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();

  const businessChooser = page.getByRole('heading', { name: 'Choose a business', exact: true });
  const companyButton = page.getByRole('button', { name: company, exact: true });
  await expect(companyButton.or(businessChooser).first()).toBeVisible({ timeout: 20_000 });
  if (await businessChooser.isVisible()) {
    const companyCard = page.getByRole('button').filter({
      has: page.getByRole('heading', { name: company, exact: true }),
    });
    await expect(companyCard, `Business "${company}" must be available`).toBeVisible();
    await companyCard.click();
  }
  await expect(companyButton).toBeVisible({ timeout: 20_000 });
  await page.context().storageState({ path: resolve('test-results/stores-auth.json') });
});
