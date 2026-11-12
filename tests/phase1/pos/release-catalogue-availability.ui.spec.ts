import { test, expect, route, openPOS, tile } from './support/pos';

test('release POS finds a QA catalogue item beyond the first product page', async ({ page }) => {
  await route(page, '/products');
  const next = page.getByRole('main').getByRole('button', { name: 'Next', exact: true });
  await expect(next, 'Fixture needs a catalogue larger than its first page').toBeEnabled();
  const first = await page.getByRole('main').getByRole('row').filter({ has: page.getByRole('cell', { name: /^QA-/ }) }).first().innerText();
  await next.click();
  const rows = page.getByRole('main').getByRole('row').filter({ has: page.getByRole('cell', { name: /^QA-/ }) });
  await expect(rows.first()).not.toHaveText(first);
  const sku = await rows.last().getByRole('cell').nth(3).innerText();
  expect(sku).toMatch(/^QA-/);
  await openPOS(page);
  await page.getByPlaceholder('Search products or scan barcode…').fill(sku);
  await expect(tile(page, sku), 'POS must expose items beyond the first 15-product page, even when out of stock').toBeVisible();
});
