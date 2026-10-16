import {
  test, expect, ensureUnit, openNewProduct,
} from './support/products';

test.describe('Products & Catalog — Units of Measure', () => {
  test('adds pieces, boxes, kg, meters and liters and exposes them to products @phase1 @products', async ({ page }) => {
    test.setTimeout(90_000);
    const units = [
      ['Piece', 'pcs'],
      ['Box', 'box'],
      ['Kilogram', 'kg'],
      ['Meter', 'm'],
      ['Liter', 'L'],
    ] as const;

    for (const [name, abbreviation] of units) await ensureUnit(page, name, abbreviation);

    const dialog = await openNewProduct(page);
    const unitField = dialog.getByLabel(/^Unit of Measurement/i);
    for (const [name] of units) {
      await unitField.click();
      await expect(page.getByRole('option', { name: new RegExp(name, 'i') })).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });
});
