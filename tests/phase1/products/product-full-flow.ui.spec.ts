import { fileURLToPath } from 'node:url';
import {
  test, expect, ensureCatalogFixtures, openNewProduct, fillBasicProduct, enableVariants,
  addVariantOption, populateGeneratedVariants, uploadProductImage, submitNewProduct,
  productRow, openEditProduct, saveEditedProduct, archiveProduct, uniqueProduct,
} from './support/products';

const imagePath = fileURLToPath(new URL('../../fixtures/product-image.svg', import.meta.url));

test.describe('Products & Catalog — Full Product Flow', () => {
  test('creates, enriches, finds, edits and archives a catalog product @phase1 @products @full-flow', async ({ page }) => {
    test.setTimeout(180_000);
    const fixtures = await ensureCatalogFixtures(page);
    const product = { ...uniqueProduct('flow'), ...fixtures, cost: '50', sellingPrice: '150' };

    await openNewProduct(page);
    await fillBasicProduct(page, product);
    await enableVariants(page);
    await addVariantOption(page, 'Size', 'S, M');
    await addVariantOption(page, 'Color', 'Black, White');
    await addVariantOption(page, 'Material', 'Cotton, Wool');
    await populateGeneratedVariants(page, product.sku, '150');
    await uploadProductImage(page, imagePath);
    await submitNewProduct(page, product);

    const search = page.getByRole('main').getByPlaceholder('Search...', { exact: true });
    await search.fill(product.barcode!);
    await page.getByRole('main').getByRole('button', { name: 'Filter', exact: true }).click();
    await expect(productRow(page, product.sku)).toBeVisible();

    const edit = await openEditProduct(page, product.sku);
    const updatedName = `${product.name} Final`;
    await edit.getByLabel(/^Product Name/i).fill(updatedName);
    await edit.getByLabel(/^Selling Price/i).fill('175');
    await saveEditedProduct(page);
    await expect(productRow(page, product.sku)).toContainText(updatedName);

    await archiveProduct(page, product.sku);
  });
});
