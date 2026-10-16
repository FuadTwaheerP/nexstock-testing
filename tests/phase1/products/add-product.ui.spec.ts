import {
  test, expect, ensureCatalogFixtures, openNewProduct, fillBasicProduct,
  submitNewProduct, productRow, uniqueProduct,
} from './support/products';

test.describe('Products & Catalog — Add Product', () => {
  test('creates a standard inventory product with catalog, pricing and barcode data @phase1 @products', async ({ page }) => {
    test.setTimeout(60_000);
    const fixtures = await ensureCatalogFixtures(page);
    const product = { ...uniqueProduct('add'), ...fixtures };

    await openNewProduct(page);
    await fillBasicProduct(page, product);
    await submitNewProduct(page, product);

    const row = productRow(page, product.sku);
    await expect(row).toContainText(product.name);
    await expect(row).toContainText(product.sku);
    await expect(row).toContainText(product.category);
  });

  test('supports a separate wholesale price @phase1 @products', async ({ page }) => {
    const dialog = await openNewProduct(page);
    const wholesalePrice = dialog.getByLabel(/Wholesale Price/i);
    await expect(wholesalePrice, 'Add Product must expose a separate wholesale-price field').toBeVisible();
    await wholesalePrice.fill('80');
    await expect(wholesalePrice).toHaveValue('80');
  });

  test('creates a service or labour item without inventory tracking @phase1 @products', async ({ page }) => {
    const dialog = await openNewProduct(page);
    const productType = dialog.getByLabel(/Product Type|Item Type/i);
    await expect(productType, 'Add Product must expose an inventory/service product-type selector').toBeVisible();
    await productType.click();
    await expect(
      page.getByRole('option', { name: /Service|Labou?r/i }).first(),
      'The product-type selector must include a service or labour option',
    ).toBeVisible();
  });
});
