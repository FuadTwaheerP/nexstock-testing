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
    await page.getByRole('tab', { name: 'Archived', exact: true }).click();
    const search = page.getByRole('main').getByPlaceholder('Search...', { exact: true });
    await search.fill(product.sku);
    await page.getByRole('main').getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(productRow(page, product.sku), 'Archived product must remain available as a historical record').toBeVisible();
    await productRow(page, product.sku).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Restore', exact: true }).click();
    await expect(productRow(page, product.sku)).toBeHidden();
    await page.getByRole('tab', { name: 'Catalogue', exact: true }).click();
    await search.fill(product.sku);
    await page.getByRole('main').getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(productRow(page, product.sku)).toContainText('Active');
    await archiveProduct(page, product.sku);
  });
});
