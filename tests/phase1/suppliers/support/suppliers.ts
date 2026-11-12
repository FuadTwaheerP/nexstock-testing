import { randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { test as base, expect, type Page, type Locator } from 'playwright/test';
import { appPath, validateProductTestTarget } from '../../../../helpers/safety.mjs';

export { expect };
export const required = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}; see .env.example`);
  return value;
};
export const setting = (name: string, fallback: string) => process.env[name]?.trim() || fallback;
export const companyName = () => setting('SUPPLIER_TEST_COMPANY', setting('PRODUCT_TEST_COMPANY', 'Nexstock QA Company'));
export const journalPath = 'test-results/suppliers-fixtures.json';
export type Supplier = {
  token: string; name: string; code: string; email: string;
  company: string; contact: string; phone: string; address1: string; address2: string;
  city: string; state: string; postal: string; country: string; brn: string; taxID: string; vat: string;
  currency: string; terms: string; period: number; notes: string; preferred: boolean;
};
export type Journal = { company: string; entries: { supplier: Supplier; saved: boolean }[] };
export const journal = (): Journal => JSON.parse(readFileSync(journalPath, 'utf8'));
export function track(supplier: Supplier, saved = false) {
  const data = journal();
  const found = data.entries.find(entry => entry.supplier.token === supplier.token);
  if (found) { found.supplier = { ...supplier }; found.saved ||= saved; }
  else data.entries.push({ supplier: { ...supplier }, saved });
  writeFileSync(journalPath, JSON.stringify(data, null, 2));
}
export function uniqueSupplier(label: string): Supplier {
  const token = `${Date.now().toString(36)}-${randomUUID().slice(0, 6)}`;
  return {
    token, name: `QA SUP ${label} ${token}`, code: `QA-SUP-${token.toUpperCase()}`,
    email: `qa.supplier.${token}@example.invalid`, company: 'QA Vendor Company', contact: 'QA Vendor Contact',
    phone: '+23051234567', address1: 'QA Test Building', address2: 'QA Floor 2',
    city: 'Ebene', state: 'Plaines Wilhems', postal: '72201', country: 'Mauritius',
    brn: `QA-BRN-${token}`, taxID: `QA-TAX-${token}`, vat: `QA-VAT-${token}`, currency: 'MUR',
    terms: 'Net 30', period: 30, notes: `QA supplier test ${token}; no purchases or payments`, preferred: true,
  };
}
export const main = (page: Page) => page.getByRole('main');
export async function openSuppliers(page: Page) {
  // The heading is server-rendered before the client supplier-list request
  // completes. Opening Edit early lets that pending list response reset inputs.
  const listPath = new URL(appPath('/api/v1/suppliers', required('BASE_URL'))).pathname;
  const loaded = page.waitForResponse(response => response.request().method() === 'GET' && new URL(response.url()).pathname === listPath);
  await page.goto(appPath('/suppliers', required('BASE_URL')));
  const response = await loaded;
  await response.finished();
  expect(response.ok(), 'Supplier list must finish loading successfully before editing').toBeTruthy();
  await expect(main(page).getByRole('heading', { name: 'Suppliers', exact: true })).toBeVisible();
  await expect(page.getByRole('banner').getByRole('button', { name: companyName(), exact: true }), 'Supplier mutations must stay in the configured disposable company').toBeVisible();
  await expect(main(page).getByRole('button', { name: 'New Supplier', exact: true })).toBeEnabled();
  await main(page).evaluate(element => new Promise<boolean>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(element.isConnected)))));
}
export function supplierRow(page: Page, supplier: Supplier) {
  return main(page).getByRole('row').filter({ has: page.getByRole('button', { name: /^Actions for / }) }).filter({ hasText: supplier.token });
}
export async function searchSupplier(page: Page, supplier: Supplier, mustExist = true) {
  const input = main(page).getByPlaceholder('Search...', { exact: true });
  if (await input.inputValue() !== supplier.token) {
    // Search is server-side and debounced. A matching row can already be in the
    // unfiltered list; that does NOT mean search has settled. Its late response
    // resets an open editor, so wait for this token's actual search response.
    const listPath = new URL(appPath('/api/v1/suppliers', required('BASE_URL'))).pathname;
    const searched = page.waitForResponse(response => {
      const url = new URL(response.url());
      return response.request().method() === 'GET' && url.pathname === listPath && [...url.searchParams.values()].some(value => value.includes(supplier.token));
    });
    await input.fill(supplier.token);
    const response = await searched;
    await response.finished();
    expect(response.ok(), 'Supplier search must complete before opening its editor').toBeTruthy();
    await main(page).evaluate(element => new Promise<boolean>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(element.isConnected)))));
  }
  const row = supplierRow(page, supplier);
  if (mustExist) await expect(row, 'QA supplier must persist and remain searchable').toHaveCount(1);
  return row;
}
export async function newSupplier(page: Page) {
  await openSuppliers(page);
  await main(page).getByRole('button', { name: 'New Supplier', exact: true }).click();
  const form = page.getByRole('dialog', { name: 'Add Supplier', exact: true });
  await expect(form).toBeVisible();
  return form;
}
export const textFields = (supplier: Supplier) => ({
  'Code': supplier.code, 'Company Name': supplier.company, 'Contact Person': supplier.contact,
  'Email Address': supplier.email, 'Phone Number': supplier.phone,
  'Address Line 1': supplier.address1, 'Address Line 2': supplier.address2,
  'City': supplier.city, 'State': supplier.state, 'Postal Code': supplier.postal, 'Country': supplier.country,
  'Tax ID': supplier.taxID, 'VAT Number': supplier.vat, 'Currency': supplier.currency,
  'Payment Terms': supplier.terms, 'Internal Notes': supplier.notes,
});
export async function fillSupplier(form: Locator, supplier: Supplier, mode: 'full' | 'minimum' | 'name-only' = 'full') {
  await form.getByRole('textbox', { name: /^Supplier Name/ }).fill(supplier.name);
  if (mode === 'name-only') return;
  await form.getByRole('textbox', { name: 'Code', exact: true }).fill(supplier.code);
  await form.getByRole('textbox', { name: 'Email Address', exact: true }).fill(supplier.email);
  if (mode === 'minimum') return;
  for (const [label, value] of Object.entries(textFields(supplier))) await form.getByRole('textbox', { name: label, exact: true }).fill(value);
  await form.getByRole('spinbutton', { name: 'Credit Period', exact: true }).fill(String(supplier.period));
  await form.getByRole('switch', { name: 'Preferred', exact: true }).setChecked(supplier.preferred);
  await expectSupplierFields(form, supplier);
}
export async function createSupplier(page: Page, supplier: Supplier, mode: Parameters<typeof fillSupplier>[2] = 'full') {
  const form = await newSupplier(page);
  await fillSupplier(form, supplier, mode);
  track(supplier);
  await form.getByRole('button', { name: 'Add Supplier', exact: true }).click();
  await expect(form, 'Valid supplier must save, not just show a success notification').toBeHidden({ timeout: 20_000 });
  await openSuppliers(page);
  const row = await searchSupplier(page, supplier);
  track(supplier, true);
  return row;
}
export async function actionMenu(page: Page, supplier: Supplier) {
  const route = new URL(appPath('/suppliers', required('BASE_URL')));
  const current = new URL(page.url());
  if (current.origin !== route.origin || current.pathname !== route.pathname || !await main(page).getByRole('heading', { name: 'Suppliers', exact: true }).isVisible()) await openSuppliers(page);
  const row = await searchSupplier(page, supplier);
  const menu = page.getByRole('menu');
  await expect(async () => {
    if (!await menu.isVisible()) await row.getByRole('button', { name: /^Actions for / }).click();
    await expect(menu).toBeVisible({ timeout: 1500 });
  }, 'Supplier action menu must be open before choosing an action').toPass({ timeout: 15_000 });
  return menu;
}
export async function editSupplier(page: Page, supplier: Supplier) {
  const menu = await actionMenu(page, supplier);
  const reads: import('playwright/test').Request[] = [];
  const observe = (request: import('playwright/test').Request) => {
    if (request.method() === 'GET' && ['fetch', 'xhr'].includes(request.resourceType()) && new URL(request.url()).origin === new URL(required('BASE_URL')).origin) reads.push(request);
  };
  page.on('request', observe);
  const form = page.getByRole('dialog', { name: 'Edit Supplier', exact: true });
  try {
    await menu.getByRole('menuitem', { name: 'Edit Profile', exact: true }).click();
    await expect(form).toBeVisible();
    const results = await Promise.all(reads.map(async request => {
      const response = await request.response();
      await response?.finished();
      return { path: new URL(request.url()).pathname, status: response?.status() };
    }));
    await test.info().attach('supplier-editor-load-responses', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
    // Finish any reads triggered by opening the editor and their render commit
    // before filling. This is a render barrier, not an arbitrary fixed sleep.
    await form.evaluate(element => new Promise<boolean>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(element.isConnected)))));
  } finally { page.off('request', observe); }
  await expect(form.getByRole('textbox', { name: /^Supplier Name/ })).toHaveValue(supplier.name);
  return form;
}
export async function saveSupplier(page: Page, form: Locator, supplier: Supplier) {
  track(supplier);
  const submitted = await form.locator('input, textarea').evaluateAll(elements => elements.map(element => {
    const input = element as HTMLInputElement;
    return { id: input.id, value: input.value };
  }));
  await test.info().attach('supplier-editor-before-save', { body: JSON.stringify(submitted, null, 2), contentType: 'application/json' });
  // Record and finish actual UI-triggered writes before reloading; closing a
  // dialog is not proof that its asynchronous save request has completed.
  const writes: import('playwright/test').Request[] = [];
  const observe = (request: import('playwright/test').Request) => {
    if (['POST', 'PUT', 'PATCH'].includes(request.method()) && new URL(request.url()).origin === new URL(required('BASE_URL')).origin) writes.push(request);
  };
  page.on('request', observe);
  try {
    await form.getByRole('button', { name: 'Save Changes', exact: true }).click();
    await expect(form).toBeHidden({ timeout: 20_000 });
    const results = await Promise.all(writes.map(async request => {
      const response = await request.response();
      await response?.finished();
      return {
        method: request.method(), path: new URL(request.url()).pathname, status: response?.status(), failed: request.failure()?.errorText,
        // Only this suite's UI-triggered supplier payload, never headers/tokens.
        submitted: /\/suppliers\/\d+$/.test(new URL(request.url()).pathname) ? request.postDataJSON() : undefined,
      };
    }));
    await test.info().attach('supplier-save-responses', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
  } finally { page.off('request', observe); }
  await openSuppliers(page);
  await searchSupplier(page, supplier);
  track(supplier, true);
}
export async function expectSupplierFields(form: Locator, supplier: Supplier) {
  await expect(form.getByRole('textbox', { name: /^Supplier Name/ })).toHaveValue(supplier.name);
  for (const [label, value] of Object.entries(textFields(supplier))) await expect(form.getByRole('textbox', { name: label, exact: true }), `${label} must survive save/reload`).toHaveValue(value);
  await expect(form.getByRole('spinbutton', { name: 'Credit Period', exact: true })).toHaveValue(String(supplier.period));
  await expect(form.getByRole('switch', { name: 'Preferred', exact: true })).toBeChecked({ checked: supplier.preferred });
}
export async function setStatus(page: Page, supplier: Supplier, status: 'Active' | 'Inactive') {
  if (!supplier.name.startsWith('QA SUP ') || !supplier.code.startsWith('QA-SUP-')) throw new Error('Only this suite\'s QA suppliers may change status');
  const menu = await actionMenu(page, supplier);
  await menu.getByRole('menuitem', { name: status === 'Inactive' ? 'Deactivate' : 'Activate', exact: true }).click();
  await expect(supplierRow(page, supplier).getByRole('cell', { name: status, exact: true })).toBeVisible();
  await openSuppliers(page);
  await searchSupplier(page, supplier);
  await expect(supplierRow(page, supplier).getByRole('cell', { name: status, exact: true })).toBeVisible();
}
export async function filterStatus(page: Page, status: string) {
  await main(page).getByRole('combobox').first().click();
  await page.getByRole('option', { name: status, exact: true }).click();
}
export async function openSupplierPicker(page: Page) {
  await page.goto(appPath('/purchasing/orders/new', required('BASE_URL')));
  await expect(main(page).getByRole('heading', { name: 'New Purchase Order', exact: true })).toBeVisible();
  await main(page).getByRole('button', { name: 'Select a supplier...', exact: true }).click();
  return main(page).getByRole('list');
}
export function creditLimit(form: Locator) {
  return form.getByRole('spinbutton', { name: /credit limit|credit amount|credit ceiling/i });
}
export function brnField(form: Locator) {
  return form.getByRole('textbox', { name: /\bBRN\b|business registration number/i });
}
export async function submitAndObserveValidation(page: Page, form: Locator, submitName: string, message: RegExp) {
  // Observe a real native invalid event; calling checkValidity() here would
  // dispatch that event itself and could manufacture a false rejection signal.
  await form.evaluate(el => {
    el.removeAttribute('data-qa-invalid-event');
    el.addEventListener('invalid', () => el.setAttribute('data-qa-invalid-event', 'true'), { capture: true, once: true });
  });
  await form.getByRole('button', { name: submitName, exact: true }).click();
  let outcome: 'pending' | 'saved' | 'rejected' = 'pending';
  await expect.poll(async () => {
    if (!await form.isVisible()) return outcome = 'saved';
    if (await form.getAttribute('data-qa-invalid-event') === 'true') return outcome = 'rejected';
    const feedback = await page.getByRole('region', { name: 'Notifications alt+T' }).innerText();
    if (message.test(feedback) || await form.getByText(message).count()) return outcome = 'rejected';
    return outcome;
  }, { message: 'Submission must finish with explicit validation or a completed save' }).not.toBe('pending');
  return outcome as 'saved' | 'rejected';
}
export async function cleanupSupplier(page: Page, supplier: Supplier, saved: boolean) {
  await openSuppliers(page);
  const row = await searchSupplier(page, supplier, saved);
  // Invalid/cancelled submissions never become saved fixtures. If one is visible,
  // deactivate it too; never delete records or touch suppliers from another run.
  if (!saved && await row.count() === 0) return;
  await expect(row).toHaveCount(1);
  if (!await row.getByRole('cell', { name: 'Inactive', exact: true }).isVisible()) await setStatus(page, supplier, 'Inactive');
  await expect(supplierRow(page, supplier).getByRole('cell', { name: 'Inactive', exact: true })).toBeVisible();
}
export const test = base.extend<{ supplier: Supplier }>({
  supplier: async ({ page }, use, info) => {
    info.setTimeout(info.title.includes('@full-flow') ? 240_000 : 180_000);
    validateProductTestTarget(required('BASE_URL'));
    const supplier = uniqueSupplier(info.title.replace(/[^a-z ]/gi, '').slice(0, 18).trim());
    await info.attach('supplier-fixture', { body: JSON.stringify(supplier, null, 2), contentType: 'application/json' });
    try { await use(supplier); }
    finally {
      const entry = journal().entries.find(entry => entry.supplier.token === supplier.token);
      if (entry) {
        const cleanup = await page.context().newPage();
        try { await cleanupSupplier(cleanup, entry.supplier, entry.saved); }
        finally { await cleanup.close(); }
      }
    }
  },
});
