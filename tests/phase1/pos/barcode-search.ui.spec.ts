import { test, expect, tile, cart, line } from './support/pos';

test.describe('POS — Barcode Scanning & Search', () => {
  test('finds the correct product by SKU and product name @phase1 @pos', async ({ page, pos }) => {
    const search = page.getByPlaceholder('Search products or scan barcode…');
    for (const query of [pos.sku, pos.name]) {
      await search.fill(query);
      await expect(tile(page, pos.sku)).toBeVisible();
    }
    await search.fill(`no-such-product-${Date.now()}`);
    await expect(tile(page, pos.sku)).toHaveCount(0);
    await expect(page.getByRole('main')).toContainText(/no products|no results|nothing found/i);
  });

  test('one keyboard-wedge barcode scan adds exactly one unit @phase1 @pos', async ({ page, pos }) => {
    expect(pos.barcode, 'QA product must have a real persisted barcode').not.toBe('');
    const search = page.getByPlaceholder('Search products or scan barcode…');
    await search.pressSequentially(pos.barcode, { delay: 5 });
    await search.press('Enter');
    await expect(line(page, pos.name), 'Barcode + Enter must add the matched product to the order').toBeVisible();
    await expect(line(page, pos.name).locator('span.tabular-nums')).toHaveText('1');
    await expect(cart(page).getByRole('button', { name: /^Charge / })).toContainText(pos.selling.toFixed(2));
  });

  test('unknown barcode does not add an unrelated product @phase1 @pos', async ({ page, pos }) => {
    const search = page.getByPlaceholder('Search products or scan barcode…');
    await search.pressSequentially('999999999999999999999999');
    await search.press('Enter');
    await expect(cart(page).getByText('Your order is empty', { exact: true })).toBeVisible();
    await expect(line(page, pos.name)).toHaveCount(0);
  });
});
