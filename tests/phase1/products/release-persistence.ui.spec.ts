import { test, expect, ensureCatalogFixtures, openNewProduct, fillBasicProduct, submitNewProduct, openEditProduct, saveEditedProduct, openProducts, uniqueProduct } from './support/products';

test('release product description and barcode can be cleared after reload', async ({ page }) => {
  const product = { ...uniqueProduct('clear'), ...await ensureCatalogFixtures(page) };
  await openNewProduct(page); await fillBasicProduct(page, product); await submitNewProduct(page, product);
  let dialog = await openEditProduct(page, product.sku);
  await dialog.getByLabel('Description', { exact: true }).fill('');
  await dialog.getByRole('button', { name: 'Manual', exact: true }).click();
  await dialog.getByLabel('Barcode', { exact: true }).fill('');
  await saveEditedProduct(page);
  await openProducts(page);
  await page.getByRole('main').getByPlaceholder('Search...', { exact: true }).fill(product.sku);
  await page.getByRole('main').getByRole('button', { name: 'Filter', exact: true }).click();
  dialog = await openEditProduct(page, product.sku);
  await expect(dialog.getByLabel('Description', { exact: true })).toHaveValue('');
  await expect(dialog.getByLabel('Barcode', { exact: true })).toHaveValue('');
});

test('release product inclusive VAT override survives save and full navigation', async ({ page }) => {
  const product = { ...uniqueProduct('vat-mode'), ...await ensureCatalogFixtures(page) };
  const dialog = await openNewProduct(page); await fillBasicProduct(page, product);
  await dialog.getByLabel('Price includes VAT', { exact: true }).click();
  await page.getByRole('option', { name: 'Yes, the price includes VAT', exact: true }).click();
  await submitNewProduct(page, product);
  await openProducts(page);
  await page.getByRole('main').getByPlaceholder('Search...', { exact: true }).fill(product.sku);
  await page.getByRole('main').getByRole('button', { name: 'Filter', exact: true }).click();
  const reopened = await openEditProduct(page, product.sku);
  await expect(reopened.getByLabel('Price includes VAT', { exact: true })).toContainText('Yes, the price includes VAT');
});
