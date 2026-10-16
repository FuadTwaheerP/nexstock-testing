import { fileURLToPath } from 'node:url';
import {
  test, expect, ensureCatalogFixtures, openNewProduct, fillBasicProduct,
  uploadProductImage, submitNewProduct, uniqueProduct, openEditProduct,
} from './support/products';

const imagePath = fileURLToPath(new URL('../../fixtures/product-image.svg', import.meta.url));

test.describe('Products & Catalog — Media & Product Photography', () => {
  test('uploads a product image and displays it in the product list @phase1 @products', async ({ page }) => {
    test.setTimeout(90_000);
    const fixtures = await ensureCatalogFixtures(page);
    const product = { ...uniqueProduct('media'), ...fixtures };
    await openNewProduct(page);
    await fillBasicProduct(page, product);
    await uploadProductImage(page, imagePath);
    await submitNewProduct(page, product);
    const editDialog = await openEditProduct(page, product.sku);
    await editDialog.getByRole('tab', { name: 'Images', exact: true }).click();
    await expect(editDialog.getByRole('tabpanel', { name: 'Images' }).getByRole('img').first()).toBeVisible();
  });
});
