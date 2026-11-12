import { readFileSync, writeFileSync } from 'node:fs';
import { test as base, expect, type Page, type Locator } from 'playwright/test';
import { appPath, validateProductTestTarget } from '../../../../helpers/safety.mjs';
import { stock, adjust, type InventoryFixture } from '../../stock-adjustments/support/adjustments';
import { companyTax, setCompanyTax, withVAT } from '../../pos/support/pos';

export { expect, stock, adjust, companyTax, setCompanyTax, withVAT };
export const required = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}; see .env.example`);
  return value;
};
export const setting = (name: string, fallback: string) => process.env[name]?.trim() || fallback;
export type InvoiceFixture = InventoryFixture & {
  company: string; customer: string; email: string;
  prepared: boolean;
  taxBefore: { enabled: boolean; rate: string }; references: string[];
  brandingBefore: { header: string; footer: string };
};
export const fixturePath = 'test-results/invoicing-fixture.json';
export const fixtureData = (): InvoiceFixture => JSON.parse(readFileSync(fixturePath, 'utf8'));
export const money = (text: string) => Number(text.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/)?.[0]);
export const main = (page: Page) => page.getByRole('main');
export async function route(page: Page, path: string) {
  if (path === '/settings') { await companyTax(page); return; }
  await page.goto(appPath(path, required('BASE_URL')));
}
export function datePlus(days: number, from?: string) {
  const date = from ? new Date(`${from}T12:00:00Z`) : new Date(`${new Intl.DateTimeFormat('en-CA', { timeZone: 'Indian/Mauritius', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export async function openInvoices(page: Page) {
  await route(page, '/invoicing');
  await expect(main(page).getByRole('heading', { name: 'Invoices', exact: true })).toBeVisible();
  await expect(main(page).getByRole('table')).toBeVisible();
}
export async function newInvoice(page: Page) {
  await openInvoices(page);
  await main(page).getByRole('button', { name: 'New Invoice', exact: true }).click();
  await expect(main(page).getByRole('heading', { name: 'New Invoice', exact: true })).toBeVisible();
}
export const dates = (page: Page) => main(page).locator('input[type="date"]');
export async function fillDates(page: Page, issue = datePlus(0), due = datePlus(15, issue)) {
  await dates(page).nth(0).fill(issue);
  await dates(page).nth(1).fill(due);
  await dates(page).nth(1).press('Tab');
  await expect(dates(page).nth(0)).toHaveValue(issue);
  await expect(dates(page).nth(1)).toHaveValue(due);
}
export async function selectCustomer(page: Page, fixture: InvoiceFixture) {
  await main(page).getByRole('combobox').first().click();
  await page.getByRole('option').filter({ hasText: fixture.email }).click();
  await expect(main(page).getByRole('combobox').first()).toContainText(fixture.customer);
}
export async function addLine(page: Page, fixture: InvoiceFixture, quantity = 2, price = 100) {
  const index = await main(page).getByRole('spinbutton').count() - 1;
  await main(page).getByRole('button', { name: 'Add Row', exact: true }).click();
  // Payment Terms is now another combobox before the product rows. Target
  // the visible unselected product control instead of a positional offset.
  await main(page).getByRole('combobox').filter({ hasText: 'Choose product...' }).last().click();
  await page.getByRole('option').filter({ hasText: `${fixture.name} - Rs` }).click();
  await main(page).getByRole('spinbutton').nth(index).fill(String(quantity));
  await main(page).getByRole('spinbutton').nth(index + 1).fill(String(price));
}
export async function prepareInvoice(page: Page, fixture: InvoiceFixture, options: { issue?: string; due?: string; quantity?: number; price?: number } = {}) {
  await newInvoice(page);
  await selectCustomer(page, fixture);
  await fillDates(page, options.issue, options.due);
  await addLine(page, fixture, options.quantity ?? 2, options.price ?? 100);
}
export async function expectGrandTotal(page: Page, expected: number) {
  await expect.poll(async () => money(await main(page).getByText('Grand Total Due:', { exact: true }).locator('..').innerText())).toBeCloseTo(expected, 2);
}
export async function saveAction(page: Page, action = 'Save as Draft') {
  if (action === 'Save & Dispatch Email') throw new Error('Email dispatch is excluded from disposable billing tests');
  await main(page).getByRole('button', { name: 'Save Invoice', exact: true }).click();
  await page.getByRole('menuitem', { name: action, exact: true }).click();
}
export async function references(page: Page) {
  return main(page).getByRole('table').getByRole('row').filter({ has: page.getByRole('cell') }).evaluateAll(rows => rows.filter(r => r.querySelectorAll('td').length >= 8).map(r => r.querySelector('td')!.textContent!.trim()));
}
export async function persistInvoice(page: Page, action = 'Save as Draft') {
  const list = await page.context().newPage();
  let before: string[];
  try { await openInvoices(list); before = await references(list); }
  finally { await list.close(); }
  await saveAction(page, action);
  await expect.poll(async () => {
    if (new URL(page.url()).pathname.endsWith('/invoicing')) return 'saved';
    const notification = await page.getByRole('region', { name: 'Notifications alt+T' }).innerText();
    return /failed to create invoice|server error/i.test(notification) ? 'application-error' : 'pending';
  }, { timeout: 20_000, message: 'Invoice save must finish with a persisted record or a visible application error' }).not.toBe('pending');
  if (!new URL(page.url()).pathname.endsWith('/invoicing')) {
    const notification = await page.getByRole('region', { name: 'Notifications alt+T' }).innerText();
    throw new Error(`APPLICATION BLOCKER: valid QA invoice was not saved. UI reports: ${notification.replace(/\s+/g, ' ')}`);
  }
  await page.reload();
  await expect(main(page).getByRole('heading', { name: 'Invoices', exact: true })).toBeVisible();
  const added = (await references(page)).filter(ref => !before!.includes(ref));
  expect(added, 'Exactly one newly persisted invoice reference is required').toHaveLength(1);
  const fixture = fixtureData();
  fixture.references.push(added[0]);
  writeFileSync(fixturePath, JSON.stringify(fixture, null, 2));
  await base.info().attach('created-invoice-reference', { body: added[0], contentType: 'text/plain' });
  return added[0];
}
export async function createInvoice(page: Page, fixture: InvoiceFixture, action = 'Save as Draft', options: Parameters<typeof prepareInvoice>[2] = {}) {
  await prepareInvoice(page, fixture, options);
  return persistInvoice(page, action);
}
export async function findInvoice(page: Page, ref: string) {
  await openInvoices(page);
  await main(page).getByPlaceholder('Search by invoice ID or customer name...').fill(ref);
  const row = main(page).getByRole('row').filter({ has: page.getByRole('cell', { name: ref, exact: true }) });
  await expect(row).toHaveCount(1);
  return row;
}
export async function openInvoice(page: Page, ref: string) {
  const row = await findInvoice(page, ref);
  // Inspected deployed row actions: eye (view), download and send. Never
  // accidentally activate the send action while trying to view a document.
  await row.locator('button:has(svg.lucide-eye)').click();
  await expect(page).toHaveURL(new RegExp(`/invoicing/${ref}(?:[?#]|$)`));
  const detail = main(page);
  await expect(detail).toContainText(ref);
  return detail;
}
export async function requireControl(control: Locator, description: string) {
  await expect(control, description).toBeVisible();
  return control;
}
export async function issueInvoice(page: Page, ref: string) {
  const detail = await openInvoice(page, ref);
  await detail.getByRole('button', { name: 'Change Status', exact: true }).click();
  const status = page.getByRole('dialog', { name: 'Change Invoice Status', exact: true });
  await status.getByRole('combobox', { name: 'New Status', exact: true }).click();
  await page.getByRole('option', { name: 'Pending', exact: true }).click();
  await status.getByRole('button', { name: 'Update Status', exact: true }).click();
  await expect(status).toBeHidden();
  await expect(await findInvoice(page, ref)).toContainText(/unpaid|pending|overdue/i);
}
export async function recordPayment(page: Page, ref: string, amount: number) {
  const detail = await openInvoice(page, ref);
  const payment = detail.getByRole('button', { name: /record payment|add payment|receive payment/i });
  await requireControl(payment, 'Invoice must expose installment/deposit recording');
  await payment.click();
  const dialog = page.getByRole('dialog').filter({ hasText: /payment/i });
  await dialog.getByRole('spinbutton').fill(String(amount));
  return dialog;
}
export async function submitPayment(page: Page, dialog: Locator) {
  await dialog.getByRole('button', { name: /^(save|record payment|add payment|confirm payment)$/i }).click();
  await expect(dialog).toBeHidden();
  await page.reload();
}
export async function cancelInvoice(page: Page, ref: string) {
  const detail = await openInvoice(page, ref);
  await detail.getByRole('button', { name: 'Change Status', exact: true }).click();
  const status = page.getByRole('dialog', { name: 'Change Invoice Status', exact: true });
  await status.getByRole('combobox', { name: 'New Status', exact: true }).click();
  await page.getByRole('option', { name: 'Cancelled', exact: true }).click();
  await status.getByRole('button', { name: 'Update Status', exact: true }).click();
  await expect(status).toBeHidden();
  await expect(await findInvoice(page, ref)).toContainText(/cancelled|canceled|void/i);
}
export const test = base.extend<{ invoice: InvoiceFixture }>({
  invoice: async ({ page }, use, info) => {
    info.setTimeout(120_000);
    validateProductTestTarget(required('BASE_URL'));
    const fixture = fixtureData();
    await info.attach('invoice-fixture', { body: JSON.stringify(fixture, null, 2), contentType: 'application/json' });
    const responses: { method: string; path: string; status: number }[] = [];
    page.on('response', response => {
      const url = new URL(response.url());
      if (url.origin === new URL(required('BASE_URL')).origin && /invoice/i.test(url.pathname) && response.request().method() !== 'GET') responses.push({ method: response.request().method(), path: url.pathname, status: response.status() });
    });
    await page.context().addInitScript(() => {
      (window as any).__qaPrintCalls = 0;
      window.print = () => { (window as any).__qaPrintCalls++; };
    });
    try { await use(fixture); }
    finally { await info.attach('invoice-write-statuses', { body: JSON.stringify(responses, null, 2), contentType: 'application/json' }); }
  },
});
