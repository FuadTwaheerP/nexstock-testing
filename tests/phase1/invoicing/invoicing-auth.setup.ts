import { writeFileSync } from 'node:fs';
import { test as setup, expect } from 'playwright/test';
import { appPath, validateProductTestTarget } from '../../../helpers/safety.mjs';
import { required, setting, route, stock, adjust, fixturePath, companyTax, setCompanyTax, type InvoiceFixture } from './support/invoicing';

setup('authenticate and prepare disposable invoice fixtures', async ({ page }) => {
  setup.setTimeout(150_000);
  validateProductTestTarget(required('BASE_URL'));
  writeFileSync(fixturePath, JSON.stringify({ prepared: false }));
  const company = setting('INVOICE_TEST_COMPANY', setting('PRODUCT_TEST_COMPANY', 'Nexstock QA Company'));
  await page.goto(appPath('/login', required('BASE_URL')));
  await page.getByLabel('Email Address', { exact: true }).fill(required('PRODUCT_TEST_EMAIL'));
  await page.getByLabel('Password', { exact: true }).fill(required('PRODUCT_TEST_PASSWORD'));
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  const chooser = page.getByRole('heading', { name: 'Choose a business', exact: true });
  const selected = page.getByRole('button', { name: company, exact: true });
  await expect(selected.or(chooser).first()).toBeVisible({ timeout: 20_000 });
  if (await chooser.isVisible()) await page.getByRole('button').filter({ has: page.getByRole('heading', { name: company, exact: true }) }).click();
  await expect(selected).toBeVisible();
  await page.context().storageState({ path: 'test-results/invoicing-auth.json' });

  await route(page, '/products');
  const skuSetting = process.env.INVOICE_TEST_SKU?.trim();
  const row = page.getByRole('row').filter({ has: page.getByRole('cell', { name: skuSetting || /^QA-ADD-/, exact: !!skuSetting }) }).first();
  await expect(row).toBeVisible();
  const cells = await row.getByRole('cell').allTextContents();
  const columns=(await page.getByRole('main').getByRole('columnheader').allTextContents()).map(x=>x.trim());
  const sku = cells[columns.indexOf('SKU')].trim();
  if (!sku.startsWith('QA-')) throw new Error('Invoice tests only use QA products');
  await row.getByRole('button',{name:'Actions',exact:true}).click();
  await page.getByRole('menuitem', { name: 'Edit', exact: true }).click();
  const edit = page.getByRole('dialog', { name: 'Edit Product', exact: true });
  const name = await edit.getByLabel('Product Name *', { exact: true }).inputValue();
  await edit.getByRole('button', { name: 'Cancel', exact: true }).click();

  await route(page, '/inventory/adjustments');
  await page.getByRole('button', { name: 'New Adjustment', exact: true }).click();
  const adjustment = page.getByRole('dialog', { name: 'New Stock Adjustment', exact: true });
  const branch = setting('INVOICE_TEST_BRANCH', (await adjustment.getByRole('combobox').first().locator('option:checked').innerText()).trim());
  await adjustment.getByRole('button', { name: 'Cancel', exact: true }).click();
  await route(page, '/stores');
  await expect(page.getByRole('table').getByRole('columnheader', { name: branch, exact: true })).toBeVisible();
  const headers = (await page.getByRole('table').getByRole('columnheader').allTextContents()).map(s => s.trim());
  const otherBranch = headers.slice(2, -1).find(s => s !== branch)!;
  if (!branch.startsWith('QA') || !otherBranch?.startsWith('QA')) throw new Error('Invoice fixtures require two QA branches');
  const taxBefore = await companyTax(page);
  const brandingBefore = {
    header: await page.getByLabel('Invoice Header', { exact: true }).inputValue(),
    footer: await page.getByLabel('Invoice Footer', { exact: true }).inputValue(),
  };
  const fixture: InvoiceFixture = {
    company, customer: 'QA Billing Automation Customer', email: 'qa.billing.customer@example.invalid',
    name, sku, branch, otherBranch, initial: await stock(page, sku, branch), otherInitial: await stock(page, sku, otherBranch),
    selling: 100, cost: 40, totalValue: 0, taxBefore, brandingBefore, references: [], prepared: true,
  };
  writeFileSync(fixturePath, JSON.stringify(fixture, null, 2));
  if (fixture.initial < 100) await adjust(page, fixture, 100 - fixture.initial, `QA invoice seed ${Date.now()}`);
  if (taxBefore.enabled || Number(taxBefore.rate) !== 0) await setCompanyTax(page, false, '0');

  await route(page, '/customers');
  await page.getByRole('main').getByPlaceholder('Search...', { exact: true }).fill(fixture.email);
  const customer = page.getByRole('main').getByRole('row').filter({ hasText: fixture.email });
  await expect(page.getByRole('heading', { name: 'Customers', exact: true })).toBeVisible();
  if (!await customer.count()) {
    await page.getByRole('button', { name: 'New Customer', exact: true }).first().click();
    const form = page.getByRole('dialog', { name: 'Add New Customer', exact: true });
    await form.getByLabel('Customer Name *', { exact: true }).fill(fixture.customer);
    await form.getByLabel('Company Name', { exact: true }).fill('QA Billing Business');
    await form.getByLabel('Email *', { exact: true }).fill(fixture.email);
    await form.getByLabel('Billing Address', { exact: true }).fill('QA Test Address, Ebene');
    await form.getByRole('button', { name: 'Add Customer', exact: true }).click();
    await expect(form).toBeHidden();
    await expect(customer).toHaveCount(1);
  }
  await customer.getByRole('button',{name:'Actions',exact:true}).click();
  await page.getByRole('menuitem', { name: 'Edit', exact: true }).click();
  const billingCustomer = page.getByRole('dialog', { name: 'Edit Customer', exact: true });
  await expect(billingCustomer.getByLabel('Email *', { exact: true })).toHaveValue(fixture.email);
  await billingCustomer.getByLabel('Business Registration Number (BRN)', { exact: true }).fill('QA-BILLING-BRN');
  await billingCustomer.getByLabel('VAT Number', { exact: true }).fill('QA-BILLING-VAT');
  await billingCustomer.getByLabel('Tax ID', { exact: true }).fill('QA-BILLING-TAX');
  await billingCustomer.getByRole('button', { name: 'Save Changes', exact: true }).click();
  await expect(billingCustomer).toBeHidden();
});
