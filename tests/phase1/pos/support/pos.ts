import { readFileSync } from 'node:fs';
import { test as base, expect, type Page, type Locator, type BrowserContext } from 'playwright/test';
import { appPath, validateProductTestTarget } from '../../../../helpers/safety.mjs';
import { stock, adjust, type InventoryFixture } from '../../stock-adjustments/support/adjustments';

export { expect, stock, adjust };
export const setting = (name: string, fallback: string) => process.env[name]?.trim() || fallback;
export function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}; see .env.example`);
  return value;
}
export const marker = () => `QA POS ${Date.now()}`;
export type POSFixture = InventoryFixture & { barcode: string; category: string; customer: string; company: string };
export function fixtureData(): POSFixture {
  return JSON.parse(readFileSync('test-results/pos-fixture.json', 'utf8'));
}
export const money = (text: string) => Number(text.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/)?.[0]);
const printCounters = new WeakMap<BrowserContext, { count: number }>();
export const observedPrintCalls = (page: Page) => printCounters.get(page.context())?.count ?? 0;
export async function route(page: Page, path: string) {
  await page.goto(appPath(path, required('BASE_URL')));
}
export async function openPOS(page: Page) {
  await route(page, '/pos');
  await expect(page.getByPlaceholder('Search products or scan barcode…')).toBeVisible({ timeout: 20_000 });
  await expect(cart(page)).toBeVisible();
}
export const cart = (page: Page) => page.getByRole('main').getByRole('complementary');
export function tile(page: Page, sku: string) {
  return page.getByRole('main').getByRole('button').filter({ has: page.getByText(sku, { exact: true }) });
}
export function line(page: Page, name: string) {
  return cart(page).getByRole('listitem').filter({ has: page.getByText(name, { exact: true }) });
}
export function quantityControl(row: Locator, kind: 'plus' | 'minus' | 'remove') {
  return row.locator(`button:has(svg.lucide-${kind === 'remove' ? 'x' : kind})`);
}
export async function addItem(page: Page, fixture: POSFixture, quantity = 1) {
  await expect(tile(page, fixture.sku)).toBeEnabled();
  for (let count = 0; count < quantity; count++) await tile(page, fixture.sku).click();
  await expect(line(page, fixture.name)).toHaveCount(1);
}
export async function total(page: Page, label = 'Total') {
  return money(await cart(page).getByText(label, { exact: true }).locator('..').innerText());
}
export async function expectTotal(page: Page, amount: number) {
  await expect.poll(() => total(page), { message: 'Cart total must match independent arithmetic' }).toBeCloseTo(amount, 2);
}
export async function discount(page: Page, amount: number, type: '%' | 'Rs') {
  await cart(page).getByRole('combobox').click();
  await page.getByRole('option', { name: type, exact: true }).click();
  await cart(page).getByPlaceholder('Discount', { exact: true }).fill(String(amount));
}
export async function charge(page: Page) {
  await cart(page).getByRole('button', { name: /^Charge / }).click();
  const dialog = page.getByRole('dialog', { name: 'Complete Payment', exact: true });
  await expect(dialog).toBeVisible();
  return dialog;
}
export async function tender(page: Page, method: string) {
  const dialog = await charge(page);
  const button = dialog.getByRole('button', { name: method, exact: true });
  await expect(button, `Configured ${method} tender must be available in checkout`).toBeVisible();
  await button.click();
  return dialog;
}
export async function completeSale(page: Page, fixture: POSFixture, method = 'Cash', received?: number) {
  const due = await total(page);
  const dialog = await tender(page, method);
  // Non-cash tenders settle the exact due amount and intentionally hide the
  // cash-received input. Do not wait for a cash-only control on Card/Bank.
  if (method === 'Cash') await dialog.getByRole('spinbutton').fill(String(received ?? due));
  const submit = dialog.getByRole('button', { name: 'Complete Sale', exact: true });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(dialog).toBeHidden({ timeout: 20_000 });
  const receipt = page.getByRole('dialog').filter({ hasText: /receipt|sale complete|payment successful/i });
  await expect(receipt, 'Successful checkout must expose a receipt or completion view').toBeVisible();
  await expect(receipt).toContainText(fixture.name);
  return { receipt, due };
}
export async function selectCustomer(page: Page, name: string, query = name) {
  await cart(page).getByRole('button', { name: /Tap to change/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Select Customer', exact: true });
  await dialog.getByPlaceholder('Search…', { exact: true }).fill(query);
  const customer = dialog.getByRole('button').filter({ has: page.getByText(name, { exact: true }) });
  await expect(customer, 'Named QA customer must be available in customer search').toBeVisible();
  await customer.click();
  await expect(cart(page).getByRole('button', { name: /Tap to change/ })).toContainText(name);
}
export async function companyTax(page: Page) {
  const loaded = page.waitForResponse(response => response.request().method() === 'GET' && new URL(response.url()).pathname === '/app/api/v1/settings');
  await route(page, '/settings');
  const response = await loaded;
  expect(response.ok(), `A real company settings snapshot is required before a scoped VAT write (HTTP ${response.status()})`).toBe(true);
  const find = (value: any): any => {
    if (!value || typeof value !== 'object') return;
    if ('companyName' in value && 'taxRegistered' in value) return value;
    for (const child of Object.values(value)) { const found = find(child); if (found) return found; }
  };
  const saved = find(await response.json());
  expect(saved).toBeTruthy();
  await expect(page.locator('#company-name')).toHaveValue(saved.companyName);
  await expect(page.getByRole('heading', { name: 'Tax & Invoicing', exact: true })).toBeVisible();
  const enabled = page.getByRole('switch', { name: 'Tax Registered', exact: true });
  await expect(enabled).toBeVisible();
  return { enabled: await enabled.isChecked(), rate: await page.getByLabel('Tax Percentage (%)', { exact: true }).inputValue() };
}
export async function setCompanyTax(page: Page, enabled: boolean, rate: string) {
  await companyTax(page);
  await page.getByRole('switch', { name: 'Tax Registered', exact: true }).setChecked(enabled);
  await page.getByLabel('Tax Percentage (%)', { exact: true }).fill(rate);
  await page.getByRole('button', { name: 'Save Settings', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/saved|updated/i);
}
export async function withVAT(page: Page, run: () => Promise<void>) {
  const before = await companyTax(page);
  try {
    await setCompanyTax(page, true, '15');
    const saved = await companyTax(page);
    expect(saved.enabled).toBe(true);
    expect(Number(saved.rate)).toBe(15);
    await openPOS(page);
    await run();
  } finally {
    const cleanup = await page.context().newPage();
    try { await setCompanyTax(cleanup, before.enabled, before.rate); }
    finally { await cleanup.close(); }
  }
}
export const test = base.extend<{ pos: POSFixture }>({
  pos: async ({ page }, use, info) => {
    info.setTimeout(120_000);
    validateProductTestTarget(required('BASE_URL'));
    const fixture = fixtureData();
    await info.attach('pos-fixture', { body: JSON.stringify(fixture, null, 2), contentType: 'application/json' });
    const prints = { count: 0 };
    printCounters.set(page.context(), prints);
    await page.context().exposeBinding('__qaRecordPrint', () => { prints.count++; });
    // Standard Print uses a child print window. Instrument the entire context,
    // and keep the counter in the runner even if that child closes itself.
    await page.context().addInitScript(() => {
      (window as any).__qaPrintCalls = 0;
      window.print = () => {
        (window as any).__qaPrintCalls++;
        void (window as any).__qaRecordPrint();
      };
    });
    await openPOS(page);
    await use(fixture);
  },
});
