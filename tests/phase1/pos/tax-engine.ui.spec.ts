import { test, expect, addItem, withVAT, expectTotal, cart } from './support/pos';

test.describe('POS — Tax Engine', () => {
  test('calculates the configured 15 percent VAT and restores company settings @phase1 @pos', async ({ page, pos }) => {
    await withVAT(page, async () => {
      await addItem(page, pos);
      await expect(cart(page)).toContainText(/VAT|Tax/i);
      await expectTotal(page, pos.selling * 1.15);
    });
  });
  test('offers tax exemption and recalculates the taxable order @phase1 @pos', async ({ page, pos }) => {
    await withVAT(page, async () => {
      await addItem(page, pos);
      const exempt = cart(page).getByRole('switch', { name: /exempt|tax/i })
        .or(cart(page).getByRole('checkbox', { name: /exempt|tax/i }))
        .or(cart(page).getByRole('button', { name: /tax exempt|exempt tax|remove tax/i }));
      await expect(exempt, 'Checkout must expose the required tax-exempt toggle').toBeVisible();
      await exempt.click();
      await expectTotal(page, pos.selling);
    });
  });
});
