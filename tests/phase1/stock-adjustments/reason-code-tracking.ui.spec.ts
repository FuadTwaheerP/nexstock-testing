import { test, expect, adjust, expectBalance, reloadHistory, inspectHistory, uniqueReason } from './support/adjustments';

test.describe('Stock Adjustments — Reason Code Tracking', () => {
  for (const reason of ['Damaged stock', 'Shrinkage', 'Theft', 'Expired lot', 'Opening balance correction']) {
    test(`retains ${reason.toLowerCase()} as the adjustment reason @phase1 @stock-adjustments`, async ({ page, inventory }) => {
      const marker = uniqueReason(reason);
      const delta = reason === 'Opening balance correction' ? 1 : -1;
      if (delta < 0) await adjust(page, inventory, 1, uniqueReason('seed reason test'));
      await adjust(page, inventory, delta, marker);
      await expectBalance(page, inventory, inventory.initial + (delta < 0 ? 0 : 1));
      await expect(await reloadHistory(page, inventory, marker)).toContainText(marker);
    });
  }

  test('retains justification notes for later inspection @phase1 @stock-adjustments', async ({ page, inventory }) => {
    const reason = uniqueReason('notes retention');
    const notes = `QA justification for ${inventory.sku}: counted one extra unit ${Date.now()}`;
    await adjust(page, inventory, 1, reason, notes);
    const detail = await inspectHistory(page, await reloadHistory(page, inventory, reason));
    await expect(detail.getByText(notes, { exact: true }), 'Saved adjustment notes must be retrievable from history').toBeVisible();
  });
});
