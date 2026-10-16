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

  test('supports Standard VAT 15%, Zero-Rated and Exempt classifications per product @phase1 @products', async ({ page }) => {
    const dialog = await openNewProduct(page);
    const taxClassification = dialog.getByLabel(/Tax Classification|VAT (?:Rate|Class)/i);
    await expect(taxClassification, 'Add Product must expose a per-product tax-classification selector').toBeVisible();
    await taxClassification.click();
    await expect(page.getByRole('option', { name: /Standard.*15%/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /Zero.?Rated.*0%/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /Exempt/i })).toBeVisible();
  });

  test('supports tax-inclusive and tax-exclusive product pricing @phase1 @products', async ({ page }) => {
    const dialog = await openNewProduct(page);
    const pricingMode = dialog.getByRole('switch', { name: /Tax.*Inclusive|Inclusive.*Tax/i })
      .or(dialog.getByRole('checkbox', { name: /Tax.*Inclusive|Inclusive.*Tax/i })).first();
    await expect(pricingMode, 'Add Product must expose a tax-inclusive/exclusive pricing toggle').toBeVisible();
  });
});
