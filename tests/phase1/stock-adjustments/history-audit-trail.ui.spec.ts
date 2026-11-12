import { test, expect, adjust, reloadHistory, inspectHistory, uniqueReason, setting } from './support/adjustments';

test.describe('Stock Adjustments — History & Audit Trail', () => {
  test('persists one completed history record with the correct user and timestamp @phase1 @stock-adjustments', async ({ page, inventory }) => {
    const reason = uniqueReason('audit attribution');
    const started = Date.now();
    await adjust(page, inventory, 1, reason, 'QA attribution and timestamp verification');
    const row = await reloadHistory(page, inventory, reason);
    const cells = row.getByRole('cell');
    await expect(cells.nth(2)).toHaveText(setting('ADJUSTMENT_TEST_ACTOR', 'Fuad Peerbocus'));
    await expect(cells.nth(3)).toHaveText('Completed');
    await expect(cells.nth(4)).toHaveText('1 product(s)');
    const timestamp = await cells.nth(0).innerText();
    const parsed = Date.parse(`${timestamp} +0400`);
    expect(Number.isFinite(parsed), `History timestamp must be parseable: ${timestamp}`).toBe(true);
    expect(parsed).toBeGreaterThanOrEqual(started - 60_000);
    expect(parsed).toBeLessThanOrEqual(Date.now() + 60_000);
  });

  test('exposes product, signed quantity and before/after balances for an adjustment @phase1 @stock-adjustments', async ({ page, inventory }) => {
    const reason = uniqueReason('audit detail');
    await adjust(page, inventory, 1, reason, 'QA detailed movement evidence');
    const detail = await inspectHistory(page, await reloadHistory(page, inventory, reason));
    await expect(detail.getByText(inventory.sku, { exact: true }), 'Adjustment history must identify the affected SKU').toBeVisible();
    await expect(detail.getByText(/before|previous quantity/i)).toBeVisible();
    await expect(detail.getByText(/after|new quantity/i)).toBeVisible();
    await expect(detail.getByText('+1', { exact: true })).toBeVisible();
  });
});
