import { test, expect, createCustomer, openProfile, statementControl, agingLabel, main, openCustomers } from './support/customers';
import { readFileSync } from 'node:fs';

test('@phase1 F19-c customer-specific outstanding balance', async ({ page, customer }) => {
  await createCustomer(page, customer);
  const profile = await openProfile(page, customer);
  const balance = profile.locator('[data-slot="card"]').filter({ has: page.getByRole('heading', { name: 'Outstanding Balance', exact: true }) });
  await expect(balance, 'F19-c requires a customer balance, not lifetime Total Spent').toBeVisible();
  await expect(balance).toContainText(/0\.00/);
});
test('@phase1 F19-c empty profile export or named statement has an explicit empty state', async ({ page, customer }, info) => {
  await createCustomer(page, customer);
  const profile = await openProfile(page, customer);
  const statement = statementControl(profile).first();
  if (await statement.isVisible()) {
    await statement.click();
    await expect(page.getByText(/statement of account|account statement/i).first()).toBeVisible();
  } else {
    await profile.getByRole('button', { name: 'Export', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText('No invoices available to export.');
  }
  await info.attach('statement-coverage-limitation', { body: 'Valid empty export state only. A populated statement with invoice/payment reconciliation remains blocked by the missing independent QA ledger. A specific button label is not mandated.', contentType: 'text/plain' });
});
test('@phase1 F19-c aging buckets are available for the customer', async ({ page, customer }) => {
  await createCustomer(page, customer);
  const profile = await openProfile(page, customer);
  await expect(agingLabel(profile), 'F19-c requires customer aging balance tracking; a QA name containing aging is not an aging label').toBeVisible();
});
test('@phase1 F19-c reconcile independently seeded invoice payment and overdue balances', async ({ page, customer }, info) => {
  // Read-only fixture contract: never manufacture a payment or infer balances
  // from the UI being tested. Missing seed is a data blocker, not an app bug.
  const path = process.env.CUSTOMER_AR_SEED_PATH?.trim();
  expect(path, 'TEST DATA BLOCKER: No populated QA AR account found during inspection. Supply CUSTOMER_AR_SEED_PATH (README schema); this is not an application defect.').toBeTruthy();
  const seed = JSON.parse(readFileSync(path!, 'utf8'));
  expect(seed.company).toBe((await import('./support/customers')).companyName());
  expect(seed.email).toMatch(/^qa[.\w+-]*@example\.invalid$/);
  expect(seed.name).toMatch(/^QA /);
  expect(seed.invoiceAmount).toBeGreaterThan(0);
  expect(seed.paymentAmount).toBeGreaterThan(0);
  expect(seed.paymentAmount).toBeLessThan(seed.invoiceAmount);
  expect(seed.expectedOutstanding).toBeCloseTo(seed.invoiceAmount - seed.paymentAmount, 2);
  expect(Date.parse(seed.dueDate)).toBeLessThan(Date.now());
  await info.attach('independent-ar-expectation', { body: JSON.stringify(seed, null, 2), contentType: 'application/json' });
  await openCustomers(page);
  await main(page).getByPlaceholder('Search...', { exact: true }).fill(seed.email);
  const row = main(page).getByRole('row').filter({ has: page.getByRole('button') }).filter({ hasText: seed.email });
  await expect(row).toHaveCount(1);
  await row.getByRole('button').click();
  await page.getByRole('menuitem', { name: 'View Details', exact: true }).click();
  await expect(main(page).getByRole('heading', { name: seed.name, exact: true }).first()).toBeVisible();
  await expect(main(page).getByText(/outstanding balance|balance due/i).first().locator('..')).toContainText(seed.expectedOutstanding.toFixed(2));
  await expect(statementControl(main(page)).first()).toBeVisible();
  await statementControl(main(page)).first().click();
  await expect(page.getByText(seed.invoiceReference, { exact: false }).first()).toBeVisible();
  await expect(page.getByText(seed.paymentReference, { exact: false }).first()).toBeVisible();
  await expect(page.getByText(seed.agingBucket, { exact: true }).locator('..')).toContainText(seed.expectedOutstanding.toFixed(2));
});
