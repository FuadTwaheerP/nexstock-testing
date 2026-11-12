import { test, expect, addItem, tender, total } from './support/pos';

test.describe('POS — Change Calculator', () => {
  for (const overpayment of [0, 50]) {
    test(`calculates cash change of ${overpayment} @phase1 @pos`, async ({ page, pos }) => {
      await addItem(page, pos, 2);
      const due = await total(page);
      const dialog = await tender(page, 'Cash');
      await dialog.getByRole('spinbutton').fill(String(due + overpayment));
      await expect(dialog.getByRole('button', { name: 'Complete Sale', exact: true })).toBeEnabled();
      if (overpayment) {
        await expect(dialog).toContainText(/change/i);
        await expect(dialog).toContainText('50.00');
      } else await expect(dialog).not.toContainText(/insufficient|remaining due/i);
    });
  }
  test('prevents completing an underpaid cash sale @phase1 @pos', async ({ page, pos }) => {
    await addItem(page, pos);
    const due = await total(page);
    const dialog = await tender(page, 'Cash');
    await dialog.getByRole('spinbutton').fill(String(due - 1));
    await expect(dialog.getByRole('button', { name: 'Complete Sale', exact: true })).toBeDisabled();
  });
});
