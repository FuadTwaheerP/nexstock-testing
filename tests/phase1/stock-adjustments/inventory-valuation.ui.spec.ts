import { test, expect, adjust, expectBalance, productSnapshot, uniqueReason } from './support/adjustments';

test.describe('Stock Adjustments — Inventory Valuation Impact', () => {
  test('updates stock-on-hand value at cost after positive and negative adjustments @phase1 @stock-adjustments', async ({ page, inventory }) => {
    expect(inventory.cost, 'Fixture must have a positive cost').toBeGreaterThan(0);
    expect(inventory.cost, 'Fixture cost and selling price must differ to detect sale-price valuation').not.toBe(inventory.selling);
    await adjust(page, inventory, 10, uniqueReason('valuation +10'));
    await expectBalance(page, inventory, inventory.initial + 10);
    expect.soft((await productSnapshot(page, inventory.sku)).totalValue, 'Adding ten units must increase cost valuation by ten times unit cost').toBeCloseTo(inventory.totalValue + 10 * inventory.cost, 2);
    await adjust(page, inventory, -3, uniqueReason('valuation -3'));
    await expectBalance(page, inventory, inventory.initial + 7);
    expect.soft((await productSnapshot(page, inventory.sku)).totalValue, 'Removing three units must decrease cost valuation by three times unit cost').toBeCloseTo(inventory.totalValue + 7 * inventory.cost, 2);
  });
});
