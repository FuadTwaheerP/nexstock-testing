import { test, expect, adjust, expectBalance, newAdjustment, uniqueReason, stock, openAdjustments, historyRow } from './support/adjustments';

test.describe('Stock Adjustments — Create Adjustment', () => {
  test('applies positive and negative quantities and persists exact balances @phase1 @stock-adjustments', async ({ page, inventory }) => {
    await adjust(page, inventory, 10, uniqueReason('opening balance +10'));
    await expectBalance(page, inventory, inventory.initial + 10);
    await adjust(page, inventory, -3, uniqueReason('damaged -3'));
    await expectBalance(page, inventory, inventory.initial + 7);
  });

  test('rejects removal greater than available branch stock @phase1 @stock-adjustments', async ({ page, inventory }) => {
    const reason = uniqueReason('overdraw');
    const dialog = await newAdjustment(page, inventory, -(inventory.initial + 1), reason);
    await dialog.getByRole('button', { name: 'Create adjustment', exact: true }).click();
    await expect.soft(page.getByText(/insufficient[ _-]stock|not enough stock|cannot.*negative|exceeds.*stock/i).first(), 'Overdraw must display a clear insufficient-stock error').toBeVisible();
    expect(await stock(page, inventory.sku, inventory.branch)).toBe(inventory.initial);
    await openAdjustments(page, inventory.branch);
    await page.getByRole('main').getByPlaceholder('Search...', { exact: true }).fill(reason);
    await expect(historyRow(page, reason), 'Rejected overdraw must not create a history record').toHaveCount(0);
  });

  test('rejects a zero quantity without creating history @phase1 @stock-adjustments', async ({ page, inventory }) => {
    const reason = uniqueReason('zero quantity');
    const dialog = await newAdjustment(page, inventory, 0, reason);
    const submit = dialog.getByRole('button', { name: 'Create adjustment', exact: true });
    if (await submit.isEnabled()) {
      await submit.click();
      await expect(dialog, 'A zero-quantity adjustment must not be accepted').toBeVisible();
      const invalidInput = await dialog.getByRole('spinbutton').evaluate((input: HTMLInputElement) => !input.checkValidity());
      if (!invalidInput) await expect(page.getByText(/non.?zero|cannot be zero|quantity.*(required|invalid|greater)|enter.*quantity|fill in all required fields/i).first()).toBeVisible();
    } else {
      await expect(submit).toBeDisabled();
    }
    expect(await stock(page, inventory.sku, inventory.branch)).toBe(inventory.initial);
    await openAdjustments(page, inventory.branch);
    await page.getByRole('main').getByPlaceholder('Search...', { exact: true }).fill(reason);
    await expect(historyRow(page, reason), 'Rejected zero quantity must not create a history record').toHaveCount(0);
  });
});
