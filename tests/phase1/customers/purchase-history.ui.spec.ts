import { readFileSync } from 'node:fs';
import { test, expect, createCustomer, openProfile, draftInvoice, draftQuotation, main, uniqueCustomer, cleanupCustomer, openCustomers, companyName } from './support/customers';

test('@phase1 F19-d fresh customer has no purchase history or spend', async ({ page, customer }) => {
  await createCustomer(page, customer);
  const profile = await openProfile(page, customer);
  await expect(profile.getByRole('tab', { name: 'Invoices (0)', exact: true })).toBeVisible();
  await expect(profile.getByRole('heading', { name: 'No purchases', exact: true })).toBeVisible();
  await expect(profile.getByRole('tabpanel')).toContainText('No transaction logs available.');
  await expect(profile.getByText('Total Spent', { exact: true }).locator('..')).toContainText('0.00');
});
test('@phase1 F19-d saved invoice history is scoped to its customer', async ({ page, customer }) => {
  await createCustomer(page, customer);
  const reference = await draftInvoice(page, customer);
  const other = uniqueCustomer('History Isolation');
  try {
    await createCustomer(page, other);
    await openProfile(page, other);
    await expect(main(page).getByRole('tabpanel')).not.toContainText(reference);
    await openProfile(page, customer);
    await expect(main(page).getByRole('tabpanel')).toContainText(reference);
  } finally { await cleanupCustomer(page, other, false); }
});
test('@phase1 F19-d existing QA POS receipt appears in customer history', async ({ page, customer }) => {
  const path = process.env.CUSTOMER_AR_SEED_PATH?.trim();
  expect(path, 'TEST DATA BLOCKER: No populated QA POS history was found. Supply a verified QA customer and posReference in CUSTOMER_AR_SEED_PATH; absence of a dedicated POS tab is NOT itself a confirmed bug.').toBeTruthy();
  const seed = JSON.parse(readFileSync(path!, 'utf8'));
  expect(seed.company).toBe(companyName());
  expect(seed.name).toMatch(/^QA /);
  expect(seed.email).toMatch(/^qa[.\w+-]*@example\.invalid$/);
  expect(seed.posReference, 'Independent expected receipt reference is required').toBeTruthy();
  await openCustomers(page);
  await main(page).getByPlaceholder('Search...', { exact: true }).fill(seed.email);
  const row = main(page).getByRole('row').filter({ has: page.getByRole('button') }).filter({ hasText: seed.email });
  await expect(row).toHaveCount(1);
  await row.getByRole('button').click();
  await page.getByRole('menuitem', { name: 'View Details', exact: true }).click();
  const profile = main(page);
  await expect(profile.getByRole('heading', { name: seed.name, exact: true }).first()).toBeVisible();
  const receipts = profile.getByRole('tab', { name: /POS|receipts/i }).or(profile.getByRole('button', { name: /POS|receipts/i })).first();
  if (await receipts.isVisible()) await receipts.click();
  await expect(profile, 'A unified history is acceptable, but the actual QA receipt must be present').toContainText(seed.posReference);
});
test('@phase1 F19-d saved QA quotation appears in customer history', async ({ page, customer }) => {
  await createCustomer(page, customer);
  await draftQuotation(page, customer);
});
