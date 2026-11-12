import { test, expect, adjust, expectBalance, reloadHistory, inspectHistory, productSnapshot, uniqueReason } from './support/adjustments';

test.describe('Stock Adjustments — Full Flow', () => {
  test('adds opening stock, records a loss, checks valuation and verifies audit evidence @phase1 @stock-adjustments @full-flow', async ({ page, inventory }) => {
    const opening = uniqueReason('flow opening balance');
    await test.step('Create positive adjustment with reason and notes', async () => {
      await adjust(page, inventory, 10, opening, 'QA full-flow opening stock');
      await expectBalance(page, inventory, inventory.initial + 10);
    });
    const loss = uniqueReason('flow damaged stock');
    const notes = `QA full-flow: three damaged units ${Date.now()}`;
    await test.step('Create negative adjustment and preserve other branch stock', async () => {
      await adjust(page, inventory, -3, loss, notes);
      await expectBalance(page, inventory, inventory.initial + 7);
    });
    await test.step('Verify cost valuation', async () => {
      expect.soft((await productSnapshot(page, inventory.sku)).totalValue).toBeCloseTo(inventory.totalValue + 7 * inventory.cost, 2);
    });
    await test.step('Verify persisted reasons and audit evidence', async () => {
      await expect(await reloadHistory(page, inventory, opening)).toContainText('Completed');
      const detail = await inspectHistory(page, await reloadHistory(page, inventory, loss));
      await expect.soft(detail.getByText(notes, { exact: true }), 'Full flow must retain readable justification notes').toBeVisible();
      await expect.soft(detail.getByText(inventory.sku, { exact: true }), 'Full flow must expose the adjusted SKU').toBeVisible();
    });
  });
});
