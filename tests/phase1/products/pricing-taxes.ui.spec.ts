import {
  test, expect, ensureCatalogFixtures, openNewProduct, fillBasicProduct,
  submitNewProduct, openEditProduct, uniqueProduct,
} from './support/products';

test.describe('Products & Catalog — Pricing Rules & Taxes', () => {
  test('persists product cost and standard selling price @phase1 @products', async ({ page }) => {
    test.setTimeout(90_000);
    const fixtures = await ensureCatalogFixtures(page);
    const product = { ...uniqueProduct('pricing'), ...fixtures, cost: '40', sellingPrice: '100' };
    await openNewProduct(page);
    await fillBasicProduct(page, product);
    await submitNewProduct(page, product);

    const dialog = await openEditProduct(page, product.sku);
    await expect(dialog.getByLabel(/^Cost Price/i)).toHaveValue('40');
    await expect(dialog.getByLabel(/^Selling Price/i)).toHaveValue('100');
  });

  test('supports company-rate Standard VAT, Zero-Rated and Exempt classifications per product @phase1 @products', async ({ page }) => {
    const dialog = await openNewProduct(page);
    const taxClassification = dialog.getByLabel('VAT', { exact: true });
    await expect(taxClassification, 'Add Product must expose a per-product tax-classification selector').toBeVisible();
    await taxClassification.click();
    await expect(page.getByRole('option', { name: /Standard.*[\d.]+%/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /Zero.?Rated.*0%/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /Exempt/i })).toBeVisible();
  });

  test('supports tax-inclusive and tax-exclusive product pricing @phase1 @products', async ({ page }) => {
    const dialog = await openNewProduct(page);
    const pricingMode = dialog.getByLabel('Price includes VAT', { exact: true });
    await expect(pricingMode, 'Add Product must expose a tax-inclusive/exclusive pricing toggle').toBeVisible();
    await pricingMode.click();
    for (const mode of ['Company default (prices exclude VAT)', 'Yes, the price includes VAT', 'No, VAT is added on top']) {
      await expect(page.getByRole('option', { name: mode, exact: true })).toBeVisible();
    }
  });
});
