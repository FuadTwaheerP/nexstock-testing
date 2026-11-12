import { test as cleanup, expect } from 'playwright/test';
import { journal, cleanupCustomer, customerRow, editCustomer } from './support/customers';

cleanup('retain synthetic customers inactive without deleting history', async ({ page }, info) => {
  const data = journal();
  cleanup.setTimeout(Math.max(60_000, data.entries.length * 20_000));
  for (const entry of data.entries) await cleanupCustomer(page, entry.customer, entry.saved);
  const last = data.entries.filter(entry => entry.saved).at(-1);
  if (last) {
    await cleanupCustomer(page, last.customer, true);
    await expect(customerRow(page, last.customer).getByRole('cell', { name: 'Inactive', exact: true })).toBeVisible();
    // The wide list can clip its right-hand Status column. Show the persisted
    // editor status too, so the proof is readable at ordinary screen widths.
    const editor = await editCustomer(page, last.customer);
    await expect(editor.getByRole('combobox', { name: 'Status', exact: true })).toHaveText('Inactive');
    const path = info.outputPath('retained-inactive-customer.png');
    await page.screenshot({ path, fullPage: true });
    await info.attach('customer-cleanup-proof', { path, contentType: 'image/png' });
    await editor.getByRole('button', { name: 'Cancel', exact: true }).click();
  }
  await info.attach('customer-fixture-journal', { body: JSON.stringify(data, null, 2), contentType: 'application/json' });
});
