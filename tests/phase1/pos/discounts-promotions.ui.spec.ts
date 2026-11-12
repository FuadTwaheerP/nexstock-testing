import { test, expect, addItem, discount, expectTotal, line, cart, total } from './support/pos';

test.describe('POS — Discounts & Promotions', () => {
  for (const mode of ['percentage', 'fixed amount']) {
    test(`recalculates an overall ${mode} discount @phase1 @pos`, async ({ page, pos }) => {
      await addItem(page, pos, 2);
      await discount(page, mode === 'percentage' ? 10 : 20, mode === 'percentage' ? '%' : 'Rs');
      await expectTotal(page, mode === 'percentage' ? pos.selling * 2 * 0.9 : pos.selling * 2 - 20);
    });
  }
  test('supports independent line percentage and fixed discounts @phase1 @pos', async ({ page, pos }) => {
    await addItem(page, pos, 2);
    const row = line(page, pos.name);
    const control = row.getByRole('button', { name: /discount/i }).or(row.getByRole('spinbutton', { name: /discount/i }));
    await expect(control, 'Line items must expose their own discount control').toBeVisible();
    await control.click();
    const form = page.getByRole('dialog').filter({ hasText: /discount/i });
    await form.getByRole('spinbutton', { name: 'Line discount', exact: true }).fill('10');
    await form.getByRole('button', { name: /apply|save/i }).click();
    await expectTotal(page, pos.selling * 2 * 0.9);
  });
  test('does not turn a negative discount into a surcharge @phase1 @pos', async ({ page, pos }) => {
    await addItem(page, pos);
    await discount(page, -10, '%');
    expect(await total(page), 'Negative discount must be rejected or leave total unchanged').toBeLessThanOrEqual(pos.selling);
  });
  test('rejects an excessive discount instead of creating a negative payable total @phase1 @pos', async ({ page, pos }) => {
    await addItem(page, pos);
    await discount(page, 150, '%');
    const invalid = await cart(page).getByPlaceholder('Discount', { exact: true }).evaluate((el: HTMLInputElement) => !el.checkValidity());
    if (!invalid) await expect(page.getByText(/discount.*(invalid|exceed|100|greater)|maximum.*discount/i).first(), 'Excessive discount must show validation').toBeVisible();
    expect(await total(page)).toBeGreaterThanOrEqual(0);
  });
});
