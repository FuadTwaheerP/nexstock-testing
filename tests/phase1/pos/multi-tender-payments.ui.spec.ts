import { test, expect, addItem, completeSale, charge, total } from './support/pos';

test.describe('POS — Multi-Tender Payments', () => {
  for (const method of ['Cash', 'Card', 'MCB Juice', 'Bank Transfer']) {
    test(`records a completed ${method} sale @phase1 @pos`, async ({ page, pos }) => {
      await addItem(page, pos);
      const { receipt, due } = await completeSale(page, pos, method);
      await expect(receipt).toContainText(method);
      await expect(receipt).toContainText(due.toFixed(2));
    });
  }
  test('splits payment between card and cash and accounts for cash change @phase1 @pos', async ({ page, pos }) => {
    await addItem(page, pos, 2);
    const due = await total(page);
    const dialog = await charge(page);
    const split = dialog.getByRole('button', { name: /split|add payment|add tender/i });
    await expect(split, 'Checkout must provide split-tender controls').toBeVisible();
    await split.click();
    await dialog.getByRole('button', { name: 'Add payment', exact: true }).click();
    await dialog.getByRole('combobox').nth(0).click();
    await page.getByRole('option', { name: 'Card', exact: true }).click();
    await dialog.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: 'Cash', exact: true }).click();
    const amounts = dialog.getByRole('spinbutton');
    await expect(amounts).toHaveCount(2);
    await amounts.nth(0).fill(String(due * 0.75));
    await amounts.nth(1).fill(String(due * 0.25 + 50));
    await expect(dialog).toContainText(/change/i);
    await expect(dialog).toContainText('50.00');
    await dialog.getByRole('button', { name: 'Complete Sale', exact: true }).click();
    await expect(dialog).toBeHidden({ timeout: 20_000 });
    const receipt = page.getByRole('dialog').filter({ hasText: /receipt|sale complete|payment successful/i });
    await expect(receipt).toContainText('Card');
    await expect(receipt).toContainText('Cash');
  });
});
