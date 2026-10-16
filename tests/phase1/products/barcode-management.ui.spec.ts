import {
  test, expect, ensureCatalogFixtures, openNewProduct, fillBasicProduct,
  submitNewProduct, productRow, uniqueProduct,
} from './support/products';

test.describe('Products & Catalog — Barcode Scanning & Management', () => {
  test('accepts manual barcode entry and finds the product by exact barcode @phase1 @products', async ({ page }) => {
    test.setTimeout(90_000);
    const fixtures = await ensureCatalogFixtures(page);
    const product = { ...uniqueProduct('barcode'), ...fixtures };
    await openNewProduct(page);
    await fillBasicProduct(page, product);
    await submitNewProduct(page, product);

    const search = page.getByRole('main').getByPlaceholder('Search...', { exact: true });
    await search.fill(product.barcode!);
    await page.getByRole('main').getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(productRow(page, product.sku)).toBeVisible();
  });

  test('scanner mode accepts keyboard-wedge barcode input @phase1 @products', async ({ page }) => {
    const dialog = await openNewProduct(page);
    const barcode = `9${Date.now()}`;
    const barcodeField = dialog.getByLabel(/^Barcode/i);
    await expect(barcodeField).toHaveAttribute('placeholder', /Ready to scan/i);
    await barcodeField.click();
    await expect(barcodeField).toBeFocused();
    await page.keyboard.type(barcode);
    await page.keyboard.press('Enter');
    await expect(barcodeField).toHaveValue(barcode);
  });
});
