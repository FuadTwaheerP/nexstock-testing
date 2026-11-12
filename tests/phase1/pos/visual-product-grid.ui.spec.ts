import { test, expect, tile } from './support/pos';

test.describe('POS — Visual Product Grid', () => {
  test('uses the catalog category for product tiles and category navigation @phase1 @pos', async ({ page, pos }) => {
    await expect(tile(page, pos.sku), 'POS category label must match the saved catalog category').toContainText(pos.category);
    const category = page.getByRole('main').getByRole('button', { name: pos.category, exact: true });
    await expect(category).toBeVisible();
    await category.click();
    await expect(tile(page, pos.sku)).toBeVisible();
    await page.getByRole('button', { name: /^All Products/ }).click();
    await expect(tile(page, pos.sku)).toBeVisible();
  });

  test('marks out-of-stock tiles unavailable and keeps stocked items selectable @phase1 @pos', async ({ page, pos }) => {
    await expect(tile(page, pos.sku)).toBeEnabled();
    const unavailable = page.getByRole('main').getByRole('button', { name: /^Out / }).first();
    await expect(unavailable, 'Fixture catalog must include an out-of-stock product').toBeDisabled();
    const label = await unavailable.innerText();
    expect(label).toContain('Out');
  });
});
