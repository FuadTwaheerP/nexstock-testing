import {
  test, expect, ensureCatalogFixtures, openNewProduct, fillBasicProduct, enableVariants,
  addVariantOption, populateGeneratedVariants, submitNewProduct, openEditProduct, uniqueProduct,
} from './support/products';

test.describe('Products & Catalog — Product Variants & Attributes', () => {
  test('creates Size, Color and Material combinations with independent SKUs and prices @phase1 @products', async ({ page }) => {
    test.setTimeout(120_000);
    const fixtures = await ensureCatalogFixtures(page);
    const product = { ...uniqueProduct('variants'), ...fixtures };
    await openNewProduct(page);
    await fillBasicProduct(page, product);
    await enableVariants(page);
    await addVariantOption(page, 'Size', 'S, M');
    await addVariantOption(page, 'Color', 'Red, Blue');
    await addVariantOption(page, 'Material', 'Cotton, Wool');
    await expect(page.getByText('Generated Variants (8)', { exact: true })).toBeVisible();
    await populateGeneratedVariants(page, product.sku, '110');
    await submitNewProduct(page, product);

    const edit = await openEditProduct(page, product.sku);
    await edit.getByRole('tab', { name: 'Variants', exact: true }).click();
    await expect(edit.getByText('Generated Variants (8)', { exact: true })).toBeVisible();
    await expect(edit.getByRole('textbox', { name: 'SKU', exact: true }).first()).toHaveValue(`${product.sku}-V1`);
  });
});
