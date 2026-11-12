import { randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { test as base, expect, type Page, type Locator } from 'playwright/test';
import { appPath, validateProductTestTarget } from '../../../../helpers/safety.mjs';

export { expect };
export function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}; see .env.example`);
  return value;
}
export const companyName = () => process.env.CUSTOMER_TEST_COMPANY?.trim() || process.env.PRODUCT_TEST_COMPANY?.trim() || 'Nexstock QA Company';
export const journalPath = 'test-results/customers-fixtures.json';
export type Customer = {
  token: string; name: string; email: string; company: string; phone: string;
  address: string; type: 'Individual' | 'Business'; status: 'Active' | 'Inactive' | 'Suspended';
};
type Journal = { company: string; entries: { customer: Customer; saved: boolean }[]; drafts: { token: string; kind: string; reference: string }[] };
export const journal = (): Journal => JSON.parse(readFileSync(journalPath, 'utf8'));
export function track(customer: Customer, saved = false) {
  const data = journal();
  const entry = data.entries.find(entry => entry.customer.token === customer.token);
  if (entry) { entry.customer = { ...customer }; entry.saved ||= saved; }
  else data.entries.push({ customer: { ...customer }, saved });
  writeFileSync(journalPath, JSON.stringify(data, null, 2));
}
export function uniqueCustomer(label: string): Customer {
  const token = `${Date.now().toString(36)}-${randomUUID().slice(0, 6)}`;
  // Newest-first names keep core fixtures easy to locate. A separate later-
  // sorting fixture verifies selection does not depend on this ordering.
  const newestFirst = String(9_999_999_999_999 - Date.now());
  return { token, name: `QA CUST 0${newestFirst} ${label} ${token}`, email: `qa.customer.${token}@example.invalid`, company: `QA Customer Business ${token}`,
    phone: '+23051234567', address: 'QA Test Building, Ebene, Mauritius 72201', type: 'Individual', status: 'Active' };
}
export const main = (page: Page) => page.getByRole('main');
export async function route(page: Page, path: string) { await page.goto(appPath(path, required('BASE_URL'))); }
const isCustomerList = (response: import('playwright/test').Response) => response.request().method() === 'GET'
  && new URL(response.url()).pathname === new URL(appPath('/api/v1/customers', required('BASE_URL'))).pathname;
export async function openCustomers(page: Page) {
  const loaded = page.waitForResponse(isCustomerList);
  await route(page, '/customers');
  const response = await loaded;
  await response.finished();
  expect(response.ok(), 'Customer list must finish loading before forms are opened').toBeTruthy();
  await expect(main(page).getByRole('heading', { name: 'Customers', exact: true })).toBeVisible();
  await expect(page.getByRole('banner').getByRole('button', { name: companyName(), exact: true }), 'Only the configured disposable company is in scope').toBeVisible();
}
export function customerRow(page: Page, customer: Customer) {
  return main(page).getByRole('row').filter({ has: page.getByRole('button') }).filter({ hasText: customer.token });
}
export async function searchCustomer(page: Page, customer: Customer, mustExist = true) {
  const input = main(page).getByPlaceholder('Search...', { exact: true });
  if (await input.inputValue() !== customer.token) {
    await input.fill(customer.token);
    // Unlike Suppliers, Customers filters the loaded list client-side (verified
    // with a read-only transport probe). Wait for the render, not a nonexistent
    // search HTTP response. The initial list request is awaited above.
    await input.evaluate(element => new Promise<boolean>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(element.isConnected)))));
  }
  const row = customerRow(page, customer);
  if (mustExist) await expect(row).toHaveCount(1);
  return row;
}
export async function choose(page: Page, form: Locator, name: string, value: string) {
  await form.getByRole('combobox', { name, exact: true }).click();
  await page.getByRole('option', { name: value, exact: true }).click();
}
export async function newCustomer(page: Page) {
  await openCustomers(page);
  await main(page).getByRole('button', { name: 'New Customer', exact: true }).click();
  const form = page.getByRole('dialog', { name: 'Add New Customer', exact: true });
  await expect(form).toBeVisible();
  return form;
}
export const fields = (customer: Customer) => ({ 'Customer Name *': customer.name, 'Company Name': customer.company, 'Email *': customer.email, 'Phone Number': customer.phone, 'Billing Address': customer.address });
export async function fillCustomer(page: Page, form: Locator, customer: Customer) {
  for (const [label, value] of Object.entries(fields(customer))) await form.getByLabel(label, { exact: true }).fill(value);
  await choose(page, form, 'Type', customer.type);
  await choose(page, form, 'Status', customer.status);
  await expectFields(form, customer);
}
export async function expectFields(form: Locator, customer: Customer) {
  for (const [label, value] of Object.entries(fields(customer))) await expect(form.getByLabel(label, { exact: true }), `${label} must persist after fresh navigation`).toHaveValue(value);
  await expect(form.getByRole('combobox', { name: 'Type', exact: true })).toHaveText(customer.type);
  await expect(form.getByRole('combobox', { name: 'Status', exact: true })).toHaveText(customer.status);
}
export async function submit(page: Page, form: Locator, label: string) {
  const writes: import('playwright/test').Request[] = [];
  const observe = (request: import('playwright/test').Request) => {
    if (['POST', 'PUT', 'PATCH'].includes(request.method()) && /\/customers(?:\/\d+)?$/.test(new URL(request.url()).pathname)) writes.push(request);
  };
  page.on('request', observe);
  try {
    await form.getByRole('button', { name: label, exact: true }).click();
    await expect(form, 'Valid customer save must complete').toBeHidden({ timeout: 20_000 });
    const results = await Promise.all(writes.map(async request => {
      const response = await request.response();
      await response?.finished();
      return { method: request.method(), path: new URL(request.url()).pathname, status: response?.status(), submitted: request.postDataJSON() };
    }));
    await base.info().attach('customer-save-responses', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
    expect(results.length, 'Saving a customer must issue a real persistence request').toBeGreaterThan(0);
    for (const result of results) expect(result.status, 'Customer write must succeed').toBeLessThan(400);
  } finally { page.off('request', observe); }
}
export async function createCustomer(page: Page, customer: Customer) {
  const form = await newCustomer(page);
  await fillCustomer(page, form, customer);
  track(customer);
  await submit(page, form, 'Add Customer');
  await openCustomers(page);
  const row = await searchCustomer(page, customer);
  track(customer, true);
  return row;
}
export async function menu(page: Page, customer: Customer) {
  await openCustomers(page);
  const row = await searchCustomer(page, customer);
  await row.getByRole('button').click();
  const actions = page.getByRole('menu');
  await expect(actions).toBeVisible();
  return actions;
}
export async function editCustomer(page: Page, customer: Customer) {
  await (await menu(page, customer)).getByRole('menuitem', { name: 'Edit', exact: true }).click();
  const form = page.getByRole('dialog', { name: 'Edit Customer', exact: true });
  await expect(form.getByLabel('Customer Name *', { exact: true })).toHaveValue(customer.name);
  return form;
}
export async function saveCustomer(page: Page, form: Locator, customer: Customer) {
  track(customer);
  await submit(page, form, 'Save Changes');
  await openCustomers(page);
  await searchCustomer(page, customer);
  track(customer, true);
}
export async function openProfile(page: Page, customer: Customer) {
  await (await menu(page, customer)).getByRole('menuitem', { name: 'View Details', exact: true }).click();
  await expect(main(page).getByRole('heading', { name: customer.name, exact: true }).first()).toBeVisible();
  await expect(main(page).getByRole('tab', { name: /^Invoices \(/ })).toBeVisible();
  return main(page);
}
export async function setStatus(page: Page, customer: Customer, status: Customer['status']) {
  if (!customer.name.startsWith('QA CUST ') || !customer.email.endsWith('@example.invalid')) throw new Error('Only this suite\'s synthetic customers may change status');
  const form = await editCustomer(page, customer);
  await choose(page, form, 'Status', status);
  const updated = { ...customer, status };
  await saveCustomer(page, form, updated);
  await expect(customerRow(page, updated).getByRole('cell', { name: status, exact: true })).toBeVisible();
  return updated;
}
export async function cleanupCustomer(page: Page, customer: Customer, saved: boolean) {
  await openCustomers(page);
  const row = await searchCustomer(page, customer, saved);
  if (!saved && !await row.count()) return;
  if (!await row.getByRole('cell', { name: 'Inactive', exact: true }).isVisible()) await setStatus(page, customer, 'Inactive');
}
export async function invoicePicker(page: Page) {
  // Absence assertions must not run against a temporarily empty dropdown.
  // A fresh observed form route also avoids stale client-side customer caches.
  const loaded = page.waitForResponse(isCustomerList);
  await route(page, '/create-invoice');
  const response = await loaded;
  await response.finished();
  expect(response.ok(), 'Invoice customer options must finish loading').toBeTruthy();
  await expect(main(page).getByRole('heading', { name: 'New Invoice', exact: true })).toBeVisible();
  await main(page).getByRole('combobox').first().click();
  return page.getByRole('listbox');
}
async function saveDraftDocument(page: Page, customer: Customer, kind: 'Invoice' | 'Quotation') {
  const listRoute = kind === 'Invoice' ? '/invoicing' : '/quotations';
  if (kind === 'Invoice') await invoicePicker(page);
  else {
    const loaded = page.waitForResponse(isCustomerList);
    await route(page, '/create-quotation');
    const response = await loaded;
    await response.finished();
    expect(response.ok(), 'Quotation customer options must finish loading').toBeTruthy();
    await main(page).getByRole('combobox').first().click();
  }
  await page.getByRole('option').filter({ hasText: customer.email }).click();
  await main(page).getByRole('button', { name: 'Add Row', exact: true }).click();
  await main(page).getByRole('combobox').nth(1).click();
  const product = page.getByRole('option', { name: /^QA / }).first();
  await expect(product, 'Draft-history fixture requires an existing synthetic QA product, never a real product').toBeVisible();
  await product.click();
  // Invoice line items are card containers, not table rows.
  await main(page).getByRole('spinbutton').nth(0).fill('1');
  await main(page).getByRole('spinbutton').nth(1).fill('200');
  const due = new Date(); due.setUTCDate(due.getUTCDate() + 30);
  await main(page).locator('input[type="date"]').nth(1).fill(due.toISOString().slice(0, 10));
  await main(page).getByRole('button', { name: `Save ${kind}`, exact: true }).click();
  // Never dispatch an email, take payment, issue a fiscal document or delete it.
  await page.getByRole('menuitem', { name: 'Save as Draft', exact: true }).click();
  const notification = page.getByRole('region', { name: 'Notifications alt+T' });
  const savedPath = new URL(appPath(listRoute, required('BASE_URL'))).pathname;
  await expect.poll(async () => new URL(page.url()).pathname.replace(/\/$/, '') === savedPath ? 'saved' : /fail|error|unable/i.test(await notification.innerText()) ? 'failed' : 'pending', { timeout: 20_000 }).not.toBe('pending');
  expect(new URL(page.url()).pathname.replace(/\/$/, ''), `APPLICATION BLOCKER: QA draft ${kind} did not save. ${await notification.innerText()}`).toBe(savedPath);
  const document = main(page).getByRole('row').filter({ hasText: customer.name }).first();
  await expect(document, `Saved QA ${kind} must appear in its register`).toBeVisible();
  const reference = (await document.getByRole('cell').first().innerText()).trim();
  expect(reference, 'Saved document must have a reference').not.toBe('');
  const data = journal(); data.drafts.push({ token: customer.token, kind, reference });
  writeFileSync(journalPath, JSON.stringify(data, null, 2));
  return reference;
}
export async function draftInvoice(page: Page, customer: Customer) {
  const reference = await saveDraftDocument(page, customer, 'Invoice');
  await openProfile(page, customer);
  await expect(main(page).getByRole('tabpanel'), 'Saved QA draft must appear on its own customer profile').toContainText(reference);
  return reference;
}
export async function draftQuotation(page: Page, customer: Customer) {
  const reference = await saveDraftDocument(page, customer, 'Quotation');
  const profile = await openProfile(page, customer);
  const source = profile.getByRole('tab', { name: /quotation|quote/i }).or(profile.getByRole('button', { name: /quotation|quote/i })).first();
  if (await source.isVisible()) await source.click();
  // Unified history is valid too: no dedicated quotation tab is required.
  await expect(profile, 'Persisted QA quotation must be present in customer history').toContainText(reference);
  return reference;
}
export function brn(form: Locator) { return form.getByRole('textbox', { name: /\bBRN\b|business registration number/i }); }
export function vat(form: Locator) { return form.getByRole('textbox', { name: /VAT (number|registration)/i }); }
export const statementControl = (profile: Locator) => profile.getByRole('button', { name: /statement/i }).or(profile.getByRole('tab', { name: /statement/i })).or(profile.getByRole('link', { name: /statement/i }));
export const agingLabel = (profile: Locator) => profile.getByText(/^(?:aging|ageing)(?:\s+.*)?$|^(?:1.?30|31.?60|61.?90|90\+)\s*days$/i).first();
export async function expectAR(profile: Locator) {
  await expect.soft(profile.getByText(/outstanding balance|balance due/i).first(), 'F19-c: customer-specific outstanding balance is required; Total Spent is not a balance').toBeVisible();
  // A generic Export could serve as a statement on a populated account. Its
  // label alone cannot prove or disprove that; use the seeded ledger check.
  await expect.soft(agingLabel(profile), 'F19-c: aging balance tracking is required').toBeVisible();
}
export async function expectHistorySources(profile: Locator) {
  await expect.soft(profile.getByRole('tab', { name: /^Invoices \(/ })).toBeVisible();
  await base.info().attach('history-source-observation', { body: 'Visible profile has invoice and top-product views. Dedicated POS/quotation tabs are not mandatory. Populated source checks, not tab names, determine coverage; POS data is currently unavailable.', contentType: 'text/plain' });
}
export const test = base.extend<{ customer: Customer }>({
  customer: async ({ page }, use, info) => {
    info.setTimeout(info.title.includes('@full-flow') ? 300_000 : 150_000);
    validateProductTestTarget(required('BASE_URL'));
    const customer = uniqueCustomer(info.title.replace(/[^a-z ]/gi, '').slice(0, 14).trim());
    await info.attach('customer-fixture', { body: JSON.stringify(customer, null, 2), contentType: 'application/json' });
    try { await use(customer); }
    finally {
      const entry = journal().entries.find(entry => entry.customer.token === customer.token);
      if (entry) {
        const cleanup = await page.context().newPage();
        try { await cleanupCustomer(cleanup, entry.customer, entry.saved); }
        finally { await cleanup.close(); }
      }
    }
  },
});
