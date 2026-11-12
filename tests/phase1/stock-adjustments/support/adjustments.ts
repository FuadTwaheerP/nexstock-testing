import { randomUUID } from 'node:crypto';
import { test as base, expect, type Locator, type Page } from 'playwright/test';
import { appPath, validateProductTestTarget } from '../../../../helpers/safety.mjs';

export { expect };
export const setting = (name: string, fallback: string) => process.env[name]?.trim() || fallback;
export function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}; see .env.example`);
  return value;
}
export const uniqueReason = (label: string) => `QA ${label} ${Date.now()}-${randomUUID().slice(0, 6)}`;
export type InventoryFixture = {
  branch: string; otherBranch: string; name: string; sku: string;
  initial: number; otherInitial: number; cost: number; selling: number; totalValue: number;
};
export function numeric(text: string) {
  const match = text.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  if (!match) throw new Error(`No numeric value in "${text}"`);
  return Number(match[0]);
}
export async function openRoute(page: Page, route: string, heading: string) {
  await page.goto(appPath(route, required('BASE_URL')), { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible({ timeout: 20_000 });
}
export async function openAdjustments(page: Page, branch: string) {
  await openRoute(page, '/inventory/adjustments', 'Stock Adjustments');
  const branchFilter = page.getByRole('main').getByRole('combobox').nth(1);
  await expect(branchFilter).not.toHaveText('');
  await branchFilter.click();
  await page.getByRole('option', { name: branch, exact: true }).click();
  await expect(page.getByRole('cell', { name: 'Loading...', exact: true })).toBeHidden();
}
export async function stock(page: Page, sku: string, branch: string) {
  await openRoute(page, '/stores', 'Stores & Branches');
  const table = page.getByRole('table');
  const header = table.getByRole('columnheader', { name: branch, exact: true });
  await expect(header).toBeVisible();
  const headers = await table.getByRole('columnheader').allTextContents();
  const index = headers.map(v => v.trim()).indexOf(branch);
  const row = table.getByRole('row').filter({ has: page.getByRole('cell', { name: sku, exact: true }) });
  await expect(row).toBeVisible();
  return numeric(await row.getByRole('cell').nth(index).innerText());
}
export async function productSnapshot(page: Page, sku: string) {
  await openRoute(page, '/products', 'Products');
  await page.getByRole('main').getByPlaceholder('Search...', { exact: true }).fill(sku);
  const row = page.getByRole('row').filter({ has: page.getByRole('cell', { name: sku, exact: true }) });
  await expect(row).toBeVisible();
  const priceIndex = (await page.getByRole('table').getByRole('columnheader').allTextContents()).map(v => v.trim()).indexOf('Price');
  const prices = await row.getByRole('cell').nth(priceIndex).innerText();
  const costMatch = prices.match(/Cost:\s*([^\n]+)/i);
  if (!costMatch) throw new Error('Test product must expose its cost price');
  const totalValue = page.getByText('Total Value', { exact: true }).locator('xpath=ancestor::*[count(.//p)>=2][1]').getByRole('paragraph').last();
  return { cost: numeric(costMatch[1]), selling: numeric(prices), totalValue: numeric(await totalValue.innerText()) };
}
export async function newAdjustment(page: Page, fixture: InventoryFixture, quantity: number, reason: string, notes = '') {
  await openAdjustments(page, fixture.branch);
  await page.getByRole('button', { name: 'New Adjustment', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'New Stock Adjustment' });
  await expect(dialog).toBeVisible();
  const selectors = dialog.getByRole('combobox');
  await selectors.nth(0).selectOption({ label: fixture.branch });
  await selectors.nth(1).selectOption({ label: `${fixture.name} (${fixture.sku})` });
  await dialog.getByPlaceholder('e.g. Breakage, Loss, Manual inventory').fill(reason);
  await dialog.getByRole('spinbutton').fill(String(quantity));
  await dialog.getByPlaceholder('Additional details...').fill(notes);
  return dialog;
}
export function historyRow(page: Page, reason: string) {
  return page.getByRole('main').getByRole('row')
    .or(page.getByRole('main').getByRole('button', { name: /^View adjustment / }))
    .filter({ has: page.getByText(reason, { exact: true }) });
}
export async function submitAdjustment(page: Page, dialog: Locator, reason: string) {
  await dialog.getByRole('button', { name: 'Create adjustment', exact: true }).click();
  await expect(dialog, 'Valid adjustment should close its dialog').toBeHidden({ timeout: 20_000 });
  await page.getByRole('main').getByPlaceholder('Search...', { exact: true }).fill(reason);
  await expect(historyRow(page, reason)).toHaveCount(1);
  await expect(historyRow(page, reason)).toContainText('Completed');
}
export async function adjust(page: Page, fixture: InventoryFixture, quantity: number, reason: string, notes = '') {
  await submitAdjustment(page, await newAdjustment(page, fixture, quantity, reason, notes), reason);
}
export async function expectBalance(page: Page, fixture: InventoryFixture, quantity: number) {
  expect(await stock(page, fixture.sku, fixture.branch), 'Selected branch stock must match the signed adjustment').toBe(quantity);
  expect(await stock(page, fixture.sku, fixture.otherBranch), 'Other branch must be unchanged').toBe(fixture.otherInitial);
}
export async function reloadHistory(page: Page, fixture: InventoryFixture, reason: string) {
  await openAdjustments(page, fixture.branch);
  await page.getByRole('main').getByPlaceholder('Search...', { exact: true }).fill(reason);
  await expect(historyRow(page, reason)).toHaveCount(1);
  return historyRow(page, reason);
}
export async function inspectHistory(page: Page, row: Locator) {
  await row.click();
  const detail = page.getByRole('dialog');
  await expect(detail, 'Clicking a saved adjustment must open its detail view').toBeVisible();
  return detail;
}

export const test = base.extend<{ inventory: InventoryFixture }>({
  inventory: async ({ page }, use, testInfo) => {
    testInfo.setTimeout(150_000);
    validateProductTestTarget(required('BASE_URL'));
    await openRoute(page, '/stores', 'Stores & Branches');
    const table = page.getByRole('table');
    await expect(table.getByRole('columnheader').nth(2)).toBeVisible();
    const headers = await table.getByRole('columnheader').allTextContents();
    const branch = setting('ADJUSTMENT_TEST_BRANCH', headers[2].trim());
    const otherBranch = headers.slice(2, -1).map(v => v.trim()).find(v => v !== branch);
    if (!otherBranch) throw new Error('At least two QA branches are required for branch isolation');
    const skuSetting = process.env.ADJUSTMENT_TEST_SKU?.trim();
    const row = skuSetting
      ? table.getByRole('row').filter({ has: page.getByRole('cell', { name: skuSetting, exact: true }) })
      : table.getByRole('row').filter({ has: page.getByRole('cell', { name: /^QA-/ }) }).first();
    await expect(row, 'A QA product must exist in the Stores inventory matrix (top 10 products)').toBeVisible();
    const cells = await row.getByRole('cell').allTextContents();
    const sku = cells[1].trim();
    if (!sku.startsWith('QA-') || !branch.startsWith('QA') || !otherBranch.startsWith('QA')) throw new Error('Stock adjustment tests only mutate QA-prefixed fixtures');
    const fixture: InventoryFixture = {
      branch, otherBranch, name: cells[0].trim(), sku,
      initial: numeric(cells[headers.map(v => v.trim()).indexOf(branch)]),
      otherInitial: numeric(cells[headers.map(v => v.trim()).indexOf(otherBranch)]),
      ...await productSnapshot(page, sku),
    };
    await testInfo.attach('inventory-baseline', { body: JSON.stringify(fixture, null, 2), contentType: 'application/json' });
    try {
      await use(fixture);
    } finally {
      // Read persisted stock even when submit/assertions failed, then compensate.
      const cleanupPage = await page.context().newPage();
      try {
        for (const [branch, baseline] of [[fixture.branch, fixture.initial], [fixture.otherBranch, fixture.otherInitial]] as const) {
          const current = await stock(cleanupPage, fixture.sku, branch);
          if (current !== baseline) {
            await adjust(cleanupPage, { ...fixture, branch }, baseline - current, uniqueReason('adjustment cleanup'));
          }
          expect(await stock(cleanupPage, fixture.sku, branch), 'Cleanup must restore original stock in both branches').toBe(baseline);
        }
      } finally {
        await cleanupPage.close();
      }
    }
  },
});
