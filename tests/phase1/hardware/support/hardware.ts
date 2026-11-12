import { readFileSync, writeFileSync } from 'node:fs';
import { test as base, expect, type Page, type BrowserContext, type TestInfo } from 'playwright/test';
import { appPath } from '../../../../helpers/safety.mjs';
import { validateSecurityTarget, securityRequestAllowed } from '../../../../helpers/security-safety.mjs';

export { expect };
export const journalPath = 'test-results/hardware-run.json';
export const fixturePath = 'test-results/hardware-fixture.json';
export const authPath = 'test-results/hardware-auth.json';
export function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}; see .env.example`);
  return value;
}
export const companyName = () => process.env.HARDWARE_TEST_COMPANY?.trim() || process.env.PRODUCT_TEST_COMPANY?.trim() || 'Nexstock QA Company';
export const main = (page: Page) => page.getByRole('main');
export const companyButton = (page: Page) => page.getByRole('banner').getByRole('button', { name: companyName(), exact: true });
export async function route(page: Page, path: string) {
  await page.goto(appPath(path, required('BASE_URL')), { waitUntil: 'domcontentloaded' });
  await expect(companyButton(page), 'Only the configured QA company is in scope').toBeVisible();
}
export function record(entry: Record<string, unknown>) {
  const data = JSON.parse(readFileSync(journalPath, 'utf8'));
  data.events.push(entry);
  writeFileSync(journalPath, JSON.stringify(data, null, 2));
}
export async function guard(context: BrowserContext, info: TestInfo) {
  const recorded = new Set<string>();
  await context.route('**/*', async intercepted => {
    const request = intercepted.request();
    if (securityRequestAllowed(request.url(), request.method(), required('BASE_URL'))) return intercepted.continue();
    const url = new URL(request.url());
    const external = url.origin !== new URL(required('BASE_URL')).origin;
    const category = external ? 'external-telemetry' : /\/auth\/language\/?$/.test(url.pathname) ? 'prevented-preference-sync' : 'unexpected-application-write';
    const key = `${request.method()} ${url.pathname} ${category}`;
    if (!recorded.has(key)) {
      recorded.add(key);
      record({ test: info.title, method: request.method(), path: url.pathname, category });
    }
    if (external) await intercepted.fulfill({ status: 204, body: '' });
    else await intercepted.abort('blockedbyclient');
  });
}
export async function signIn(page: Page) {
  await page.goto(appPath('/login', required('BASE_URL')), { waitUntil: 'domcontentloaded' });
  await page.getByLabel('Email Address', { exact: true }).fill(required('PRODUCT_TEST_EMAIL'));
  await page.getByLabel('Password', { exact: true }).fill(required('PRODUCT_TEST_PASSWORD'));
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  const chooser = page.getByRole('heading', { name: 'Choose a business', exact: true });
  await expect(companyButton(page).or(chooser).first()).toBeVisible({ timeout: 20_000 });
  if (await chooser.isVisible()) await page.getByRole('button').filter({ has: page.getByRole('heading', { name: companyName(), exact: true }) }).click();
  await expect(companyButton(page)).toBeVisible();
}
export async function logout(page: Page) {
  const header=page.getByRole('banner');
  await header.getByRole('button',{name:'account',exact:true}).or(header.getByRole('button').filter({ hasText: /Admin|Manager|Cashier/ })).last().click();
  await page.getByRole('menuitem', { name: 'Log out', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Welcome Back', exact: true })).toBeVisible();
}
export type ScannerFixture = { sku: string; name: string; barcode: string; stock: string; selling: number; customizable: boolean; service?: boolean };
export type ReceiptState = { width: string; header: string; footer: string; logo: boolean; barcode: boolean };
export type HardwareFixture = { company: string; scanner: ScannerFixture | null; scannerBlocker?: string; receipt: ReceiptState };
export const fixtureData = (): HardwareFixture => JSON.parse(readFileSync(fixturePath, 'utf8'));
export function scannerFixture(minimumStock = 1) {
  const data = fixtureData();
  expect(data.scanner, `SCANNER DATA BLOCKER: ${data.scannerBlocker || 'An in-stock QA-prefixed product with a persisted barcode is required'}`).not.toBeNull();
  const available = Number(data.scanner!.stock.replace(/,/g, '').match(/^\d+/)?.[0]);
  expect(data.scanner!.service || available >= minimumStock, `SCANNER DATA BLOCKER: scenario needs ${minimumStock} available units; fixture has ${available}. No stock is seeded by this suite.`).toBe(true);
  return data.scanner!;
}
export async function receiptSettings(page: Page) {
  await route(page, '/settings');
  await main(page).getByRole('tab', { name: 'Customization', exact: true }).click();
  await main(page).getByRole('tab', { name: 'Receipt Customization', exact: true }).click();
  const panel = main(page).getByRole('tabpanel', { name: 'Receipt Customization', exact: true });
  await expect(panel.getByRole('heading', { name: 'Receipt Template', exact: true })).toBeVisible();
  return panel;
}
export async function receiptState(page: Page): Promise<ReceiptState> {
  const panel = await receiptSettings(page);
  return {
    width: (await panel.getByRole('combobox', { name: 'Receipt Paper Width', exact: true }).innerText()).trim(),
    header: await panel.getByLabel('Receipt Header Text', { exact: true }).inputValue(),
    footer: await panel.getByLabel('Receipt Footer Text', { exact: true }).inputValue(),
    logo: await panel.getByRole('switch', { name: 'Show Logo on Receipt', exact: true }).isChecked(),
    barcode: await panel.getByRole('switch', { name: 'Show Barcode', exact: true }).isChecked(),
  };
}
export async function paperPreview(page: Page, width: '58mm' | '80mm') {
  const panel = await receiptSettings(page);
  const input = panel.getByRole('combobox', { name: 'Receipt Paper Width', exact: true });
  await input.click();
  await page.getByRole('option', { name: new RegExp(`^${width} \\(`) }).click();
  await expect(input).toContainText(width);
  const preview = panel.getByText('Receipt Preview', { exact: true }).locator('..').locator(':scope > div');
  await expect(preview).toBeVisible();
  for (const label of ['Subtotal:', 'Tax:', 'Total:']) await expect(preview.getByText(label, { exact: true })).toBeVisible();
  // This is a sample template smoke check, not a real receipt or physical-mm measurement.
  return preview;
}
export const search = (page: Page) => page.getByPlaceholder('Search products or scan barcode…');
export const cart = (page: Page) => main(page).getByRole('complementary');
export const tile = (page: Page, sku: string) => main(page).getByRole('button').filter({ has: page.getByText(sku, { exact: true }) });
export const line = (page: Page, name: string) => cart(page).getByRole('listitem').filter({ has: page.getByText(name, { exact: true }) });
export async function openPOS(page: Page) {
  await route(page, '/pos');
  await expect(search(page)).toBeVisible();
  await expect(cart(page).getByText('Your order is empty', { exact: true })).toBeVisible();
}
export async function confirmCustomization(page: Page, fixture: ScannerFixture) {
  if (!fixture.customizable) return;
  const dialog = page.getByRole('dialog', { name: 'Customize Product', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: fixture.name, exact: true })).toBeVisible();
  // Do not reset an incorrect quantity to make a duplicate-scan defect pass.
  const quantity = await dialog.innerText();
  expect(quantity.match(/Quantity:\s*×\s*(\d+)/)?.[1], 'One scan must start with one customization unit').toBe('1');
  await expect(dialog.getByRole('radio', { name: 'Standard (No Variant)', exact: true })).toBeChecked();
  await dialog.getByRole('button', { name: 'Add to Order', exact: true }).click();
  await expect(dialog).toBeHidden();
}
export async function scan(page: Page, fixture: ScannerFixture, quantity: number, delay = 5) {
  await search(page).fill('');
  await search(page).pressSequentially(fixture.barcode, { delay });
  await expect(search(page), 'Barcode must remain a string, including leading zeroes').toHaveValue(fixture.barcode);
  await search(page).press('Enter');
  await confirmCustomization(page, fixture);
  await expect(line(page, fixture.name)).toHaveCount(1);
  await expect(line(page, fixture.name).locator('span.tabular-nums')).toHaveText(String(quantity));
  await expect(cart(page).locator('div.group')).toHaveCount(1);
  const subtotal = cart(page).getByText('Subtotal', { exact: true }).locator('..');
  await expect(subtotal).toContainText((quantity * fixture.selling).toFixed(2));
}
export async function discoverScanner(page: Page): Promise<{ scanner: ScannerFixture | null; scannerBlocker?: string }> {
  await openPOS(page);
  const wanted = process.env.HARDWARE_TEST_SKU?.trim();
  if (wanted && !wanted.startsWith('QA-')) throw new Error('Hardware fixture SKU must be QA-prefixed');
  const tiles = wanted ? tile(page, wanted) : main(page).getByRole('button').filter({ has: page.getByText(/^QA-/) });
  await tiles.first().waitFor({ state: 'visible', timeout: 15_000 }).catch(() => undefined);
  let chosen: import('playwright/test').Locator | undefined;
  // Prefer a simple enabled item to isolate keyboard-wedge counting from the
  // customization dialog. Services are sellable without stock by this release.
  for (const candidate of await tiles.all()) if (await candidate.isEnabled()) {
    if (!chosen) chosen = candidate;
    if (!/Customize/.test(await candidate.innerText())) { chosen = candidate; break; }
  }
  if (!chosen) return { scanner: null, scannerBlocker: 'No enabled QA product tile; supply an in-stock QA fixture. No stock was seeded.' };
  const sku = (await chosen.getByText(/^QA-/).innerText()).trim();
  const customizable = /Customize/.test(await chosen.innerText());
  const service = /Service/.test(await chosen.innerText());
  await route(page, '/products');
  await main(page).getByPlaceholder('Search...', { exact: true }).fill(sku);
  const row = main(page).getByRole('row').filter({ has: page.getByRole('cell', { name: sku, exact: true }) });
  await expect(row).toBeVisible();
  const stockIndex=(await main(page).getByRole('columnheader').allTextContents()).indexOf('Stock');expect(stockIndex).toBeGreaterThanOrEqual(0);const stock = (await row.getByRole('cell').nth(stockIndex).innerText()).trim();
  await row.getByRole('button',{name:'Actions',exact:true}).click();
  await page.getByRole('menuitem', { name: 'Edit', exact: true }).click();
  const edit = page.getByRole('dialog', { name: 'Edit Product', exact: true });
  const name = await edit.getByLabel('Product Name *', { exact: true }).inputValue();
  const barcode = await edit.getByLabel('Barcode', { exact: true }).inputValue();
  const selling = Number(await edit.getByLabel('Selling Price', { exact: true }).inputValue());
  await edit.getByRole('button', { name: 'Cancel', exact: true }).click();
  if (!barcode) return { scanner: null, scannerBlocker: `Chosen QA fixture ${sku} has no persisted barcode; no product was changed.` };
  return { scanner: { sku, name, barcode, stock, selling, customizable, service } };
}
export async function openHistory(page: Page) {
  await page.getByRole('button', { name: 'History', exact: true }).click();
  const history = page.getByRole('dialog', { name: 'Sales History', exact: true });
  await expect(history).toBeVisible();
  const loaded = page.waitForResponse(response => response.request().method() === 'GET' && /sales|receipts/i.test(new URL(response.url()).pathname), { timeout: 5_000 }).catch(() => null);
  await history.getByRole('button', { name: 'All time', exact: true }).click();
  const response = await loaded;
  if (response) { await response.finished(); expect(response.ok(), 'History request must succeed before classifying empty data').toBe(true); }
  return history;
}
export async function printExistingReceipt(page: Page, info: TestInfo) {
  const history = await openHistory(page);
  if (await history.getByText('No sales found', { exact: true }).isVisible()) {
    await info.attach('empty-all-time-history', { body: 'No completed sale available in QA history. No sale, payment, refund or hold was created. Receipt printing cannot be certified.', contentType: 'text/plain' });
    throw new Error('RECEIPT DATA BLOCKER: All-time QA history has no saved sales. A pre-existing synthetic QA receipt is required; no sale is created to bypass this prerequisite.');
  }
  const reference = process.env.HARDWARE_RECEIPT_REFERENCE?.trim();
  expect(reference, 'RECEIPT DATA BLOCKER: supply an approved synthetic QA receipt reference; never select an unrelated transaction').toBeTruthy();
  await history.getByRole('textbox').fill(reference!);
  // Provisional adapter: no receipt rows exist in the inspected deployment.
  // Missing adapter is a blocker, not proof that Reprint is absent in the app.
  const row = history.getByRole('row').filter({ hasText: reference! });
  expect(await row.count(), 'RECEIPT ADAPTER BLOCKER: inspect actual seeded history before validating its row/reprint adapter').toBe(1);
  const reprint = row.getByRole('button', { name: /reprint|view receipt/i });
  expect(await reprint.count(), 'RECEIPT ADAPTER BLOCKER: unvalidated reprint control; inspect seeded UI before ticketing').toBe(1);
  const printCalls = () => Promise.all(page.context().pages().map(p => p.evaluate(() => (window as any).__hardwarePrintCalls || 0).catch(() => 0))).then(values => values.reduce((a, b) => a + b, 0));
  const before = await printCalls();
  await reprint.click();
  await expect.poll(printCalls, { message: 'App must request native browser printing; instrumented invocation only, not native-dialog/physical proof' }).toBeGreaterThan(before);
  expect(await printCalls(), 'One reprint action must not invoke printing twice').toBe(before + 1);
  await info.attach('print-invocation-scope', { body: 'Observed app window.print invocation only. The function was intercepted to prevent paper output. Native dialog, 58/80mm physical layout and printer transport are not certified.', contentType: 'text/plain' });
}
export async function physicalEvidence(scope: 'printers' | 'scanners', info: TestInfo) {
  const path = process.env.HARDWARE_ACCEPTANCE_PATH?.trim();
  expect(path, `HARDWARE EVIDENCE BLOCKER: ${scope} require actual human/device acceptance evidence; browser simulation cannot certify physical devices. See README.`).toBeTruthy();
  const audit = JSON.parse(readFileSync(path!, 'utf8'));
  expect(audit.targetOrigin).toBe(new URL(required('BASE_URL')).origin);
  expect(audit.company).toBe(companyName());
  for (const key of ['verifiedBy', 'verifiedAt', 'browserVersion', 'evidenceReference']) expect(typeof audit[key] === 'string' && audit[key].length > 0, `Missing actual manual evidence field ${key}`).toBe(true);
  const assertions = scope === 'printers' ? ['thermal_58mm_output_no_clipping', 'thermal_80mm_output_no_clipping', 'native_dialog_cancel_no_sale_mutation']
    : ['usb_hid_scan_verified', 'bluetooth_hid_scan_verified', 'leading_zero_preserved', 'rapid_repeat_count_correct', 'keyboard_after_scan_usable'];
  for (const assertion of assertions) expect(audit[scope]?.passedAssertions).toContain(assertion);
  const devices = scope === 'printers' ? ['printer58Model', 'printer80Model'] : ['usbScannerModel', 'bluetoothScannerModel'];
  for (const device of devices) expect(typeof audit[scope]?.[device] === 'string' && audit[scope][device].length > 0).toBe(true);
  info.annotations.push({ type: 'manual-hardware-evidence', description: 'Validates a supplied acceptance record only; no physical device was exercised by this browser test.' });
  await info.attach(`${scope}-manual-evidence-reference`, { body: JSON.stringify({ verifiedBy: audit.verifiedBy, verifiedAt: audit.verifiedAt, evidenceReference: audit.evidenceReference }), contentType: 'application/json' });
}
export const test = base.extend<{ hardwareScope: void }>({
  hardwareScope: [async ({ context }, use, info) => {
    info.setTimeout(info.title.includes('@full-flow') ? 180_000 : 75_000);
    validateSecurityTarget(required('BASE_URL'));
    expect(fixtureData().company).toBe(companyName());
    await guard(context, info);
    await context.addInitScript(() => {
      (window as any).__hardwarePrintCalls = 0;
      window.print = () => { (window as any).__hardwarePrintCalls++; };
    });
    await use();
  }, { auto: true }],
});
