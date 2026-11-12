import {
  test, expect, createStockAdjustment, existingStore, openStores, viewStoreInventory,
} from './support/stores';

async function matrixData(page: import('@playwright/test').Page, branchNames: string[]) {
  await openStores(page);
  const table = page.getByRole('table');
  const rows = table.getByRole('row');
  const headings = (await rows.first().locator('th, td').allTextContents()).map((value) => value.trim());
  const productCells = await rows.nth(1).locator('th, td').allTextContents();
  const productName = productCells[0].trim();
  const sku = productCells[1].trim();
  const quantities = new Map<string, number>();

  for (const branchName of branchNames) {
    const index = headings.indexOf(branchName);
    expect(index, `Inventory matrix must contain a column for ${branchName}`).toBeGreaterThan(1);
    const match = productCells[index]?.match(/-?\d+(?:\.\d+)?/);
    expect(match, `Inventory matrix must show a numeric stock value for ${branchName}`).toBeTruthy();
    quantities.set(branchName, Number(match![0]));
  }

  return { productName, sku, quantities };
}

test.describe('Stores & Branches — Independent Branch Stock Levels', () => {
  test('shows separate stock columns and branch-specific inventory views @phase1 @stores', async ({ page }) => {
    test.setTimeout(120_000);
    const first = await existingStore(page, 0);
    const second = await existingStore(page, 1);
    await openStores(page);

    const matrix = page.getByRole('table');
    await expect(matrix.getByText(first.name, { exact: true })).toBeVisible();
    await expect(matrix.getByText(second.name, { exact: true })).toBeVisible();

    const firstInventory = await viewStoreInventory(page, first.code, first.name);
    await expect(firstInventory).toContainText(`Current stock levels and statuses for products in the ${first.code} branch.`);
    await firstInventory.getByRole('button', { name: 'Close', exact: true }).click();

    const secondInventory = await viewStoreInventory(page, second.code, second.name);
    await expect(secondInventory).toContainText(`Current stock levels and statuses for products in the ${second.code} branch.`);
  });

  test('adjusting stock in one branch leaves the other branch unchanged @phase1 @stores', async ({ page }) => {
    test.setTimeout(120_000);
    const first = await existingStore(page, 0);
    const second = await existingStore(page, 1);
    const before = await matrixData(page, [first.name, second.name]);
    const firstBefore = before.quantities.get(first.name)!;
    const secondBefore = before.quantities.get(second.name)!;
    const productLabel = `${before.productName} (${before.sku})`;
    const marker = Date.now();
    let incrementApplied = false;

    try {
      await createStockAdjustment(page, {
        storeName: first.name,
        productLabel,
        quantity: 1,
        reason: `QA branch isolation +1 ${marker}`,
      });
      incrementApplied = true;

      const after = await matrixData(page, [first.name, second.name]);
      expect(after.quantities.get(first.name)).toBe(firstBefore + 1);
      expect(after.quantities.get(second.name)).toBe(secondBefore);
    } finally {
      if (incrementApplied) {
        await createStockAdjustment(page, {
          storeName: first.name,
          productLabel,
          quantity: -1,
          reason: `QA branch isolation cleanup ${marker}`,
        });
      }
    }

    const restored = await matrixData(page, [first.name, second.name]);
    expect(restored.quantities.get(first.name)).toBe(firstBefore);
    expect(restored.quantities.get(second.name)).toBe(secondBefore);
  });
});
