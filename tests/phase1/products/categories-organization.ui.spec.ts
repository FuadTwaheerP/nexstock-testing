import {
  test, expect, ensureCategory, openNewProduct, openProductSettings,
} from './support/products';

test.describe('Products & Catalog — Categories & Organization', () => {
  test('creates a category and exposes it in the product form @phase1 @products', async ({ page }) => {
    test.setTimeout(60_000);
    const category = await ensureCategory(page);
    const dialog = await openNewProduct(page);
    const categoryField = dialog.getByLabel(/^Category/i);
    await categoryField.click();
    await expect(page.getByRole('option', { name: category, exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  });

  test('supports multi-level parent and child category hierarchy @phase1 @products', async ({ page }) => {
    await ensureCategory(page);
    await openProductSettings(page);
    const parentCategory = page.getByLabel(/Parent Category/i);
    await expect(parentCategory, 'Category creation must expose a parent-category selector').toBeVisible();
    await parentCategory.click();
    await expect(page.getByRole('option').first(), 'Parent-category selector must list existing categories').toBeVisible();
  });

  test('supports product tag grouping @phase1 @products', async ({ page }) => {
    const dialog = await openNewProduct(page);
    const tags = dialog.getByLabel(/Tags?/i);
    await expect(tags, 'Add Product must expose a tag assignment control').toBeVisible();
  });
});
