import {
  test, expect, ensureCatalogFixtures, openNewProduct, openProducts, fillBasicProduct,
  submitNewProduct, archiveProduct, productRow, uniqueProduct,
} from './support/products';

test.describe('Products & Catalog — Delete / Archive Product', () => {
  test('archives a product and removes it from the active product list @phase1 @products', async ({ page }) => {
    test.setTimeout(90_000);
    const fixtures = await ensureCatalogFixtures(page);
    const product = { ...uniqueProduct('archive'), ...fixtures };
    await openNewProduct(page);
    await fillBasicProduct(page, product);
    await submitNewProduct(page, product);
    await archiveProduct(page, product.sku);
  });

  test('preserves an archived product as a recoverable historical record @phase1 @products', async ({ page }) => {
    test.setTimeout(90_000);
    const fixtures = await ensureCatalogFixtures(page);
    const product = { ...uniqueProduct('archive-history'), ...fixtures };
    await openNewProduct(page);
    await fillBasicProduct(page, product);
    await submitNewProduct(page, product);
    await archiveProduct(page, product.sku);

    await openProducts(page);
    const statusFilter = page.getByRole('main').getByRole('combobox', { name: /Status/i })
      .or(page.getByRole('main').getByLabel(/Status/i)).first();
    await expect(statusFilter, 'Products must provide an Archived status/filter for soft-deleted records').toBeVisible();
    await statusFilter.click();
    await page.getByRole('option', { name: /Archived/i }).click();
    const search = page.getByRole('main').getByPlaceholder('Search...', { exact: true });
    await search.fill(product.sku);
    await page.getByRole('main').getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(productRow(page, product.sku), 'Archived product must remain available as a historical record').toBeVisible();
  });
});
