import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { test as setup, expect } from 'playwright/test';
import { appPath, validateProductTestTarget } from '../../../helpers/safety.mjs';
import { required, setting, route, money, stock, adjust, companyTax, type POSFixture } from './support/pos';

setup('authenticate and prepare disposable POS fixtures', async ({ page }) => {
  setup.setTimeout(150_000);
  writeFileSync('test-results/pos-fixture.json',JSON.stringify({prepared:false}));
  const baseURL = required('BASE_URL');
  validateProductTestTarget(baseURL);
  const company = setting('POS_TEST_COMPANY', setting('PRODUCT_TEST_COMPANY', 'Nexstock QA Company'));
  await page.goto(appPath('/login', baseURL));
  await page.getByLabel('Email Address', { exact: true }).fill(required('PRODUCT_TEST_EMAIL'));
  await page.getByLabel('Password', { exact: true }).fill(required('PRODUCT_TEST_PASSWORD'));
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  const chooser = page.getByRole('heading', { name: 'Choose a business', exact: true });
  const selectedCompany = page.getByRole('button', { name: company, exact: true });
  await expect(selectedCompany.or(chooser).first()).toBeVisible({ timeout: 20_000 });
  if (await chooser.isVisible()) await page.getByRole('button').filter({ has: page.getByRole('heading', { name: company, exact: true }) }).click();
  await expect(selectedCompany).toBeVisible({ timeout: 20_000 });
  await page.context().storageState({ path: 'test-results/pos-auth.json' });

  await route(page, '/products');
  const skuSetting = process.env.POS_TEST_SKU?.trim();
  const row = page.getByRole('row').filter({ has: page.getByRole('cell', { name: skuSetting || /^QA-ADD-/ }) }).first();
  await expect(row, 'Existing simple QA product is required for POS fixtures').toBeVisible();
  const cells = await row.getByRole('cell').allTextContents();
  const columns=(await page.getByRole('main').getByRole('columnheader').allTextContents()).map(x=>x.trim());
  let name = cells[columns.indexOf('Product')].trim();
  const sku = cells[columns.indexOf('SKU')].trim();
  expect(sku.startsWith('QA-')).toBe(true);
  const category = cells[columns.indexOf('Category')].trim();
  const selling = money(cells[columns.indexOf('Price')]);
  const cost = money(cells[columns.indexOf('Price')].split('Cost:')[1]);
  await row.getByRole('button',{name:'Actions',exact:true}).click();
  await page.getByRole('menuitem', { name: 'Edit', exact: true }).click();
  const edit = page.getByRole('dialog', { name: 'Edit Product', exact: true });
  name = await edit.getByLabel('Product Name *', { exact: true }).inputValue();
  const barcode = await edit.getByLabel('Barcode', { exact: true }).inputValue();
  await edit.getByRole('button', { name: 'Cancel', exact: true }).click();

  await route(page, '/inventory/adjustments');
  await page.getByRole('button', { name: 'New Adjustment', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'New Stock Adjustment', exact: true });
  const branch = setting('POS_TEST_BRANCH', (await dialog.getByRole('combobox').nth(0).locator('option:checked').innerText()).trim());
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await route(page, '/stores');
  const table = page.getByRole('table');
  await expect(table.getByRole('columnheader', { name: branch, exact: true })).toBeVisible();
  const otherBranch = (await table.getByRole('columnheader').allTextContents()).slice(2, -1).map(v => v.trim()).find(v => v !== branch)!;
  if (!branch.startsWith('QA') || !otherBranch?.startsWith('QA')) throw new Error('Only QA branches can be used');
  const fixture: POSFixture = {
    company, name, sku, barcode, category, branch, otherBranch, selling, cost, totalValue: 0,
    initial: await stock(page, sku, branch), otherInitial: await stock(page, sku, otherBranch),
    customer: 'QA POS Automation Customer',
  };
  // Save the baseline before mutations so cleanup can recover even after test failure.
  writeFileSync('test-results/pos-fixture.json', JSON.stringify({...fixture,prepared:true}, null, 2));
  if (fixture.initial < 20) await adjust(page, fixture, 20 - fixture.initial, `QA POS stock seed ${Date.now()}`);

  await route(page, '/customers');
  const customerSearch = page.getByRole('main').getByPlaceholder('Search...', { exact: true });
  await customerSearch.fill(fixture.customer);
  await expect(page.getByRole('heading', { name: 'Customers', exact: true })).toBeVisible();
  if (!await page.getByRole('main').getByText(fixture.customer, { exact: true }).count()) {
    await page.getByRole('button', { name: 'New Customer', exact: true }).first().click();
    const form = page.getByRole('dialog', { name: 'Add New Customer', exact: true });
    await form.getByLabel('Customer Name *', { exact: true }).fill(fixture.customer);
    await form.getByLabel('Email *', { exact: true }).fill('qa.pos.customer@example.invalid');
    await form.getByRole('button', { name: 'Add Customer', exact: true }).click();
    await expect(form).toBeHidden({ timeout: 20_000 });
  }

  // Methods are record-only fixtures. No provider credentials or real charges.
  // Remember attempted configuration to avoid creating duplicates on later runs
  // when the application fails to display a successfully added method.
  mkdirSync('playwright/.auth', { recursive: true });
  const ledgerPath = 'playwright/.auth/pos-tender-fixtures.json';
  const key = `${baseURL}|${company}`;
  const ledger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : {};
  ledger[key] ||= [];
  await companyTax(page);
  await page.getByRole('tab', { name: 'Payment', exact: true }).click();
  const panel = page.getByRole('tabpanel', { name: 'Payment', exact: true });
  for (const method of ['Cash', 'Card', 'MCB Juice', 'Bank Transfer']) {
    if (await panel.getByText(method, { exact: true }).count()) continue;
    await panel.getByPlaceholder('e.g., MCB Juice, Voucher, Store Credit...').fill(method);
    await panel.getByRole('button', { name: 'Add Method', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/added successfully|already exists/i);
    await companyTax(page);
    await page.getByRole('tab', { name: 'Payment', exact: true }).click();
    await expect(panel.getByText(method, { exact: true }), 'New record-only payment method must persist after full reload').toBeVisible();
    ledger[key].push(method);
    writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
  }
});
