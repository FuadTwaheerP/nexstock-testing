import { randomUUID } from 'node:crypto';
import { test as base, expect, type Locator, type Page } from 'playwright/test';
import { appPath, validateProductTestTarget } from '../../../../helpers/safety.mjs';

export type StoreInput = {
  name: string;
  code: string;
  type?: 'Retail Store' | 'Warehouse' | 'Workshop';
  status?: 'Active' | 'Inactive';
  phone?: string;
  email?: string;
  address?: string;
};

export function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}; see .env.example`);
  return value;
}

export function setting(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

export function uniqueStore(prefix: string): StoreInput {
  const id = `${Date.now().toString(36)}-${randomUUID().slice(0, 6)}`;
  const compact = id.replace(/[^a-z0-9]/gi, '').slice(-10).toUpperCase();
  return {
    name: `QA ${prefix} ${id}`,
    code: `QA-${prefix.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)}-${compact}`,
    type: 'Retail Store',
    status: 'Active',
    phone: setting('STORE_TEST_PHONE', '51234567'),
    email: `qa.store.${compact.toLowerCase()}@${setting('STORE_TEST_EMAIL_DOMAIN', 'example.invalid')}`,
    address: setting('STORE_TEST_ADDRESS', '12 Cyber City, Ebene'),
  };
}

export const test = base;
export { expect };

async function chooseBusinessIfRequired(page: Page) {
  const company = setting('STORE_TEST_COMPANY', setting('PRODUCT_TEST_COMPANY', 'Nexstock QA Company'));
  const businessChooser = page.getByRole('heading', { name: 'Choose a business', exact: true });
  const authenticatedApp = page.getByRole('button', { name: company, exact: true })
    .or(page.getByRole('heading', { name: 'Dashboard', exact: true }));
  await expect(authenticatedApp.or(businessChooser).first()).toBeVisible({ timeout: 20_000 });

  if (await businessChooser.isVisible()) {
    const companyCard = page.getByRole('button').filter({
      has: page.getByRole('heading', { name: company, exact: true }),
    });
    await expect(companyCard, `Business "${company}" must be available to the test account`).toBeVisible();
    await companyCard.click();
  }

  await expect(authenticatedApp.first()).toBeVisible({ timeout: 20_000 });
}

async function signInFromLoginPage(page: Page) {
  await page.getByLabel('Email Address', { exact: true }).fill(required('PRODUCT_TEST_EMAIL'));
  await page.getByLabel('Password', { exact: true }).fill(required('PRODUCT_TEST_PASSWORD'));
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await chooseBusinessIfRequired(page);
}

async function gotoAuthenticated(page: Page, route: string, ready: Locator) {
  const target = appPath(route, required('BASE_URL'));
  const loginEmail = page.getByLabel('Email Address', { exact: true });
  await page.goto(target);
  await expect(ready.or(loginEmail).first()).toBeVisible({ timeout: 20_000 });
  if (await loginEmail.isVisible()) {
    await signInFromLoginPage(page);
    await page.goto(target);
  }
  await expect(ready).toBeVisible({ timeout: 20_000 });
}

test.beforeEach(async ({ page }, testInfo) => {
  testInfo.setTimeout(Math.max(testInfo.timeout, 90_000));
  const baseURL = required('BASE_URL');
  validateProductTestTarget(baseURL);
});

async function choose(page: Page, field: Locator, option: string) {
  await field.click();
  const choice = page.getByRole('option', { name: option, exact: true });
  await expect(choice, `Expected "${option}" in the dropdown`).toBeVisible();
  await choice.click();
}

export async function openStores(page: Page) {
  const heading = page.getByRole('heading', { name: 'Stores & Branches', exact: true });
  await gotoAuthenticated(page, '/stores', heading);
}

export async function openStockAdjustments(page: Page) {
  const heading = page.getByRole('heading', { name: 'Stock Adjustments', exact: true });
  await gotoAuthenticated(page, '/inventory/adjustments', heading);
}

export async function createStockAdjustment(
  page: Page,
  input: { storeName: string; productLabel: string; quantity: number; reason: string },
) {
  await openStockAdjustments(page);
  await page.getByRole('button', { name: 'New Adjustment', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'New Stock Adjustment' });
  await expect(dialog).toBeVisible();
  const selectors = dialog.getByRole('combobox');
  await selectors.nth(0).selectOption({ label: input.storeName });
  await dialog.getByPlaceholder('e.g. Breakage, Loss, Manual inventory').fill(input.reason);
  await selectors.nth(1).selectOption({ label: input.productLabel });
  await dialog.getByRole('spinbutton').fill(String(input.quantity));
  await dialog.getByRole('button', { name: 'Create adjustment', exact: true }).click();
  await expect(dialog).toBeHidden({ timeout: 20_000 });
  await expect(page.getByRole('table').getByText(input.reason, { exact: true })).toBeVisible({ timeout: 20_000 });
}

export async function openNewStore(page: Page) {
  await openStores(page);
  await page.getByRole('button', { name: 'New Store', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Add New Store Branch' });
  await expect(dialog).toBeVisible();
  return dialog;
}

export async function fillStore(page: Page, store: StoreInput, dialog = page.getByRole('dialog', { name: /Add New Store Branch|Edit Store Branch/ })) {
  await dialog.getByLabel('Store Name *', { exact: true }).fill(store.name);
  await dialog.getByLabel('Store Code *', { exact: true }).fill(store.code);
  await choose(page, dialog.getByLabel('Branch Type *', { exact: true }), store.type || 'Retail Store');
  await choose(page, dialog.getByLabel('Status', { exact: true }), store.status || 'Active');
  await dialog.getByLabel('Phone Number', { exact: true }).fill(store.phone || '');
  await dialog.getByLabel('Email Address', { exact: true }).fill(store.email || '');
  await dialog.getByLabel('Location Address', { exact: true }).fill(store.address || '');
}

export function storeCard(page: Page, code: string) {
  return page.locator('[data-slot="card"]').filter({ hasText: code });
}

function storeCards(page: Page) {
  return page.locator('[data-slot="card"]').filter({
    has: page.getByRole('button', { name: 'Edit Store', exact: true }),
  });
}

async function readStoreCard(page: Page, card: Locator): Promise<StoreInput> {
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: 'Edit Store', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Edit Store Branch' });
  await expect(dialog).toBeVisible();
  const store: StoreInput = {
    name: await dialog.getByLabel('Store Name *', { exact: true }).inputValue(),
    code: await dialog.getByLabel('Store Code *', { exact: true }).inputValue(),
    phone: await dialog.getByLabel('Phone Number', { exact: true }).inputValue(),
    email: await dialog.getByLabel('Email Address', { exact: true }).inputValue(),
    address: await dialog.getByLabel('Location Address', { exact: true }).inputValue(),
  };
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(dialog).toBeHidden();
  return store;
}

export async function existingStore(page: Page, index = 0): Promise<StoreInput> {
  await openStores(page);
  const cards = storeCards(page);
  expect(await cards.count(), 'At least one branch fixture is required').toBeGreaterThan(index);
  return readStoreCard(page, cards.nth(index));
}

export async function findOrCreateStore(
  page: Page,
  prefix: string,
  options: { fallbackAtCapacity?: boolean } = {},
): Promise<StoreInput> {
  await openStores(page);
  const token = `QA-${prefix.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)}-`;
  const matching = storeCards(page).filter({ hasText: token });
  if (await matching.count()) return readStoreCard(page, matching.first());

  const cards = storeCards(page);
  if (options.fallbackAtCapacity && await cards.count() >= 5) {
    return readStoreCard(page, cards.first());
  }
  return createStore(page, uniqueStore(prefix));
}

export async function submitNewStore(page: Page, store: StoreInput) {
  const dialog = page.getByRole('dialog', { name: 'Add New Store Branch' });
  await dialog.getByRole('button', { name: 'Add Store', exact: true }).click();
  await expect(dialog).toBeHidden({ timeout: 20_000 });
  await expect(storeCard(page, store.code)).toBeVisible({ timeout: 20_000 });
}

export async function createStore(page: Page, store = uniqueStore('store')) {
  await openNewStore(page);
  await fillStore(page, store);
  await submitNewStore(page, store);
  return store;
}

export async function openEditStore(page: Page, code: string) {
  const card = storeCard(page, code);
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: 'Edit Store', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Edit Store Branch' });
  await expect(dialog).toBeVisible();
  return dialog;
}

export async function saveEditedStore(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'Edit Store Branch' });
  await dialog.getByRole('button', { name: 'Save Changes', exact: true }).click();
  await expect(dialog).toBeHidden({ timeout: 20_000 });
}

export async function viewStoreInventory(page: Page, code: string, name: string) {
  const card = storeCard(page, code);
  await card.getByRole('button', { name: 'View Inventory', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: `Store Inventory: ${name}`, exact: true });
  await expect(dialog).toBeVisible();
  return dialog;
}

