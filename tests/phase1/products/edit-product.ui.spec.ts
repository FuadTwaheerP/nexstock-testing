import {
  test, expect, ensureCatalogFixtures, openNewProduct, fillBasicProduct, submitNewProduct,
  openEditProduct, saveEditedProduct, productRow, uniqueProduct,
} from './support/products';

test.describe('Products & Catalog — Edit Product', () => {
  test('updates product information, selling price and barcode @phase1 @products', async ({ page }) => {
    test.setTimeout(90_000);
    const fixtures = await ensureCatalogFixtures(page);
    const product = { ...uniqueProduct('edit'), ...fixtures };
    await openNewProduct(page);
    await fillBasicProduct(page, product);
    await submitNewProduct(page, product);

    const editedName = `${product.name} Updated`;
    const editedBarcode = `${product.barcode}9`;
    const dialog = await openEditProduct(page, product.sku);
    await dialog.getByLabel(/^Product Name/i).fill(editedName);
    await dialog.getByLabel(/^Selling Price/i).fill('125');
    await dialog.getByRole('button', { name: 'Manual', exact: true }).click();
    await dialog.getByLabel(/^Barcode/i).fill(editedBarcode);
    await saveEditedProduct(page);

    const row = productRow(page, product.sku);
    await expect(row).toContainText(editedName);
    await openEditProduct(page, product.sku);
    await expect(page.getByRole('dialog', { name: /Edit Product/ }).getByLabel(/^Selling Price/i)).toHaveValue('125');
    await expect(page.getByRole('dialog', { name: /Edit Product/ }).getByLabel(/^Barcode/i)).toHaveValue(editedBarcode);
  });

  test('updates per-product VAT classification @phase1 @products', async ({ page }) => {
    test.setTimeout(90_000);
    const fixtures = await ensureCatalogFixtures(page);
    const product = { ...uniqueProduct('edit-tax'), ...fixtures };
    await openNewProduct(page);
    await fillBasicProduct(page, product);
    await submitNewProduct(page, product);

    const dialog = await openEditProduct(page, product.sku);
    const taxClassification = dialog.getByLabel(/Tax Classification|VAT (?:Rate|Class)/i);
    await expect(taxClassification, 'Edit Product must expose per-product VAT classification').toBeVisible();
    await taxClassification.click();
    await expect(page.getByRole('option', { name: /Standard.*15%/i })).toBeVisible();
  });
});
