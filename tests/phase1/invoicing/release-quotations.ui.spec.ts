import { test, expect, route, main, addLine, fillDates, datePlus, stock } from './support/invoicing';

test('release quotation saves after reload and uses Valid Until rather than invoice Due Date', async ({ page, invoice }, info) => {
  await route(page, '/quotations');
  const refs = async () => main(page).getByRole('table').getByRole('row').filter({ has: page.getByRole('cell') }).evaluateAll(rows => rows.map(row => row.querySelector('td')?.textContent?.trim()).filter(Boolean));
  await expect(main(page).getByRole('heading', { name: 'Quotations', exact: true })).toBeVisible();
  const before = await refs();
  const initialStock = await stock(page, invoice.sku, invoice.branch);
  await route(page, '/create-quotation');
  await expect(main(page).getByText('Valid Until', { exact: true })).toBeVisible();
  await main(page).getByRole('combobox').first().click();
  await page.getByRole('option').filter({ hasText: invoice.email }).click();
  await fillDates(page, datePlus(0), datePlus(30));
  await addLine(page, invoice, 1, 137.25);
  await main(page).getByRole('button', { name: 'Save Quotation', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Save as Draft', exact: true }).click();
  await expect(page).toHaveURL(/\/quotations(?:[?#]|$)/);
  await page.reload();
  await expect(main(page).getByRole('heading', { name: 'Quotations', exact: true })).toBeVisible();
  const after = await refs();
  const added = after.filter(ref => !before.includes(ref));
  expect(added).toHaveLength(1);
  const row = main(page).getByRole('row').filter({ has: page.getByRole('cell', { name: added[0]!, exact: true }) });
  await expect(row).toContainText(invoice.customer);
  await expect(row).toContainText('137.25');
  expect(await stock(page, invoice.sku, invoice.branch), 'A draft quotation must not deduct stock').toBe(initialStock);
  await info.attach('qa-quotation-reference', { body: added[0]!, contentType: 'text/plain' });
});
