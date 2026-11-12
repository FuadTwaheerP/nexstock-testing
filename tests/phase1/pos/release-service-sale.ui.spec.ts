import { test, expect, route, openPOS, tile, completeSale } from './support/pos';

test('release service can be sold without inventory and retains No stock kept', async ({ page, pos }) => {
  const findService = async () => {
    await route(page, '/products');
    await page.getByRole('main').getByPlaceholder('Search...', { exact: true }).fill('QA-SERVICE-');
    await page.getByRole('main').getByRole('button', { name: 'Filter', exact: true }).click();
    return page.getByRole('row').filter({ has: page.getByRole('cell', { name: /^QA-SERVICE-/ }) }).first();
  };
  let row = await findService();
  const sku = await row.getByRole('cell').nth(3).innerText();
  const before = await row.getByRole('cell').nth(5).innerText();
  expect(before, 'Service fixture must explicitly be non-inventoried').toBe('No stock kept');
  await row.getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit', exact: true }).click();
  const editor = page.getByRole('dialog', { name: 'Edit Product', exact: true });
  await expect(editor.getByLabel('Product type', { exact: true })).toContainText('Service');
  const name = await editor.getByLabel('Product Name *', { exact: true }).inputValue();
  await editor.getByRole('button', { name: 'Cancel', exact: true }).click();
  await openPOS(page);
  await expect(tile(page, sku)).toBeEnabled();
  await tile(page, sku).click();
  await completeSale(page, { ...pos, sku, name });
  row = await findService();
  await expect(row.getByRole('cell').nth(5)).toHaveText(before);
});
