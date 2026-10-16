import { randomUUID } from 'node:crypto';
import { test as base, expect, type Locator, type Page } from 'playwright/test';
import { appPath, validateProductTestTarget } from '../../../../helpers/safety.mjs';

export type ProductInput = {
  name: string;
  sku: string;
  category?: string;
  unit?: string;
  cost?: string;
  sellingPrice?: string;
  minThreshold?: string;
  initialStock?: string;
  description?: string;
  barcode?: string;
};

export function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}; see .env.example`);
  return value;
}

export function setting(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

export function uniqueProduct(prefix: string): ProductInput {
  const id = `${Date.now().toString(36)}-${randomUUID().slice(0, 6)}`;
  return {
    name: `QA ${prefix} ${id}`,
    sku: `QA-${prefix.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-${id}`,
    cost: '40',
    sellingPrice: '100',
    minThreshold: '2',
    initialStock: '10',
    description: `Automated ${prefix} product ${id}`,
    barcode: `000${Date.now()}${Math.floor(Math.random() * 1000)}`,
  };
}

export const test = base;
export { expect };

async function chooseBusinessIfRequired(page: Page) {
  const company = setting('PRODUCT_TEST_COMPANY', 'Nexstock QA Company');
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

  // The desktop sidebar can be collapsed and therefore has no accessible
  // "Products" button. The selected-company button or Dashboard heading is a
  // stable indication that authentication and workspace selection completed.
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

  // A newly issued session can occasionally lose the first protected-route
  // navigation. Recover once instead of letting every following locator time out.
  if (await loginEmail.isVisible()) {
    await signInFromLoginPage(page);
    await page.goto(target);
  }

  await expect(ready).toBeVisible({ timeout: 20_000 });
}

test.beforeEach(async ({ page }, testInfo) => {
  // Production occasionally takes longer than the project-wide 30 seconds to
  // finish the initial login navigation. Give setup enough time without
  // weakening the individual feature assertions.
  testInfo.setTimeout(Math.max(testInfo.timeout, 90_000));
  const baseURL = required('BASE_URL');
  validateProductTestTarget(baseURL);

  await page.goto(appPath('/login', baseURL));
  await signInFromLoginPage(page);
});

export async function openProducts(page: Page) {
  const heading = page.getByRole('heading', { name: 'Products', exact: true });
  await gotoAuthenticated(page, '/products', heading);
}

export async function openProductSettings(page: Page) {
  const heading = page.getByRole('heading', { name: 'Settings', exact: true });
  await gotoAuthenticated(page, '/settings', heading);
  await page.getByRole('tab', { name: 'Products', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Product Categories', exact: true })).toBeVisible();
}

async function visible(locator: Locator): Promise<boolean> {
  return (await locator.count()) > 0 && await locator.first().isVisible();
}

export async function ensureCategory(page: Page, name = setting('PRODUCT_TEST_CATEGORY', 'QA Automation')) {
  await openProductSettings(page);
  if (await visible(page.getByText(name, { exact: true }))) return name;

  await page.getByPlaceholder('e.g. Home & Garden', { exact: true }).fill(name);
  await page.getByRole('button', { name: 'Add Category', exact: true }).click();
  await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
  return name;
}

export async function ensureUnit(
  page: Page,
  name = setting('PRODUCT_TEST_UNIT', 'Piece'),
  abbreviation = setting('PRODUCT_TEST_UNIT_ABBREVIATION', 'pcs'),
) {
  await openProductSettings(page);
  if (await visible(page.getByText(name, { exact: true }))) return { name, abbreviation };

  await page.getByPlaceholder('e.g. Kilogram', { exact: true }).fill(name);
  await page.getByPlaceholder('e.g. kg', { exact: true }).fill(abbreviation);
  await page.getByRole('button', { name: 'Add Unit', exact: true }).click();
  await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
  return { name, abbreviation };
}

export async function ensureCatalogFixtures(page: Page) {
  const category = await ensureCategory(page);
  const { name: unit } = await ensureUnit(page);
  return { category, unit };
}

export async function openNewProduct(page: Page) {
  await openProducts(page);
  await page.getByRole('button', { name: 'New Product', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Add New Product' });
  await expect(dialog).toBeVisible();
  return dialog;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function choose(page: Page, field: Locator, option: string, exact = true) {
  await field.click();
  const availableOptions = page.getByRole('option');
  await expect(
    availableOptions.first(),
    `The dropdown for "${option}" opened without any options. Confirm the catalog fixture exists for the selected business.`,
  ).toBeVisible({ timeout: 15_000 });

  const optionLocator = exact
    ? page.getByRole('option', { name: option, exact: true })
    : page.getByRole('option', { name: new RegExp(`(^|\\s)${escapeRegExp(option)}(\\s|\\(|$)`, 'i') });
  await expect(
    optionLocator.first(),
    `Expected "${option}" in dropdown; available options: ${JSON.stringify(await availableOptions.allTextContents())}`,
  ).toBeVisible();
  await optionLocator.first().click();
}

export async function fillBasicProduct(page: Page, input: ProductInput) {
  const category = input.category || setting('PRODUCT_TEST_CATEGORY', 'QA Automation');
  const unit = input.unit || setting('PRODUCT_TEST_UNIT', 'Piece');
  const dialog = page.getByRole('dialog', { name: /Add New Product|Edit Product/ });

  await dialog.getByLabel(/^Product Name/i).fill(input.name);
  await dialog.getByLabel(/^SKU/i).fill(input.sku);
  await choose(page, dialog.getByLabel(/^Category/i), category);
  // UOM options include the abbreviation in their accessible label, e.g. "Piece (pcs)".
  await choose(page, dialog.getByLabel(/^Unit of Measurement/i), unit, false);
  await dialog.getByLabel(/^Cost Price/i).fill(input.cost || '40');
  await dialog.getByLabel(/^Selling Price/i).fill(input.sellingPrice || '100');
  await dialog.getByLabel(/^Min Threshold/i).fill(input.minThreshold || '2');

  const stock = dialog.getByLabel(/^Initial Stock Level/i);
  if (await stock.count()) await stock.fill(input.initialStock || '10');
  await dialog.getByLabel(/^Description/i).fill(input.description || 'Automated QA product');

  if (input.barcode) {
    await dialog.getByRole('button', { name: 'Manual', exact: true }).click();
    await dialog.getByLabel(/^Barcode/i).fill(input.barcode);
  }
}

export async function addVariantOption(page: Page, name: string, values: string) {
  const panel = page.getByRole('tabpanel', { name: 'Variants' });
  await panel.getByLabel('Option Name (e.g., Size, Color, Material)', { exact: true }).fill(name);
  await panel.getByLabel('Values (comma-separated)', { exact: true }).fill(values);
  await panel.getByRole('button', { name: 'Add Option', exact: true }).click();
  await expect(panel.getByText(name, { exact: true })).toBeVisible();
}

export async function enableVariants(page: Page) {
  const dialog = page.getByRole('dialog', { name: /Add New Product|Edit Product/ });
  await dialog.getByRole('tab', { name: 'Variants', exact: true }).click();
  const checkbox = dialog.getByRole('checkbox', { name: /This product has variants/ });
  if (!await checkbox.isChecked()) await checkbox.check();
  return dialog.getByRole('tabpanel', { name: 'Variants' });
}

export async function populateGeneratedVariants(page: Page, skuPrefix: string, price = '110') {
  const panel = page.getByRole('tabpanel', { name: 'Variants' });
  const skuFields = panel.getByRole('textbox', { name: 'SKU', exact: true });
  const prices = panel.getByRole('spinbutton');
  await expect(skuFields.first()).toBeVisible();
  const count = await skuFields.count();
  expect(count, 'Expected one SKU input for each of the 8 generated variants').toBe(8);
  await expect(prices).toHaveCount(count * 2);
  for (let index = 0; index < count; index += 1) {
    await skuFields.nth(index).fill(`${skuPrefix}-V${index + 1}`);
    await prices.nth(index * 2).fill(String(Number(price) + index));
    await prices.nth(index * 2 + 1).fill('5');
  }
}

export async function uploadProductImage(page: Page, filePath: string) {
  const dialog = page.getByRole('dialog', { name: /Add New Product|Edit Product/ });
  await dialog.getByRole('tab', { name: 'Images', exact: true }).click();
  await dialog.locator('input[type="file"]').setInputFiles(filePath);
  await expect(dialog.getByRole('tabpanel', { name: 'Images' }).getByRole('img').first()).toBeVisible();
}

export function productRow(page: Page, sku: string) {
  return page.getByRole('row').filter({ hasText: sku });
}

export async function submitNewProduct(page: Page, product: ProductInput) {
  const dialog = page.getByRole('dialog', { name: 'Add New Product' });
  await dialog.getByRole('button', { name: 'Add Product', exact: true }).click();
  await expect(dialog).toBeHidden({ timeout: 20_000 });

  // The catalog is paginated and its default sort does not guarantee that a
  // newly created item is on the current page. Locate it by its unique SKU.
  const search = page.getByRole('main').getByPlaceholder('Search...', { exact: true });
  await search.fill(product.sku);
  await page.getByRole('main').getByRole('button', { name: 'Filter', exact: true }).click();
  await expect(productRow(page, product.sku)).toBeVisible({ timeout: 20_000 });
}

async function chooseRowAction(page: Page, sku: string, action: RegExp, confirmationText?: RegExp) {
  const row = productRow(page, sku);
  await expect(row).toBeVisible();
  const direct = row.getByRole('button', { name: action });
  if (await direct.count()) {
    await direct.first().click();
    return;
  }

  const buttons = row.getByRole('button');
  if (!await buttons.count()) throw new Error(`No product action control is accessible for ${sku}`);
  await buttons.last().click();
  const menuAction = page.getByRole('menuitem', { name: action }).or(page.getByRole('button', { name: action }));
  const confirmation = confirmationText
    ? page.getByRole('dialog').filter({ hasText: confirmationText })
    : page.getByRole('dialog').filter({ hasText: /$^/ });
  await expect.poll(async () =>
    ((await menuAction.count()) > 0 && await menuAction.last().isVisible())
    || ((await confirmation.count()) > 0 && await confirmation.isVisible()),
  { message: `Expected a ${action} action or confirmation after opening actions for ${sku}` }).toBe(true);
  if (await menuAction.count() && await menuAction.last().isVisible()) await menuAction.last().click();
}

export async function openEditProduct(page: Page, sku: string) {
  await chooseRowAction(page, sku, /^Edit/i);
  const dialog = page.getByRole('dialog', { name: /Edit Product/ });
  await expect(dialog).toBeVisible();
  return dialog;
}

export async function saveEditedProduct(page: Page) {
  const dialog = page.getByRole('dialog', { name: /Edit Product/ });
  await dialog.getByRole('button', { name: /Update Product|Save Changes|Save Product/ }).click();
  await expect(dialog).toBeHidden({ timeout: 20_000 });
}

export async function archiveProduct(page: Page, sku: string) {
  const destructiveAction = /^(Archive|Delete)/i;
  await chooseRowAction(page, sku, destructiveAction, /archive|delete/i);
  const confirmation = page.getByRole('dialog').filter({ hasText: /archive|delete/i });
  if (await confirmation.count()) {
    await confirmation.getByRole('button', { name: /Archive|Delete|Confirm/ }).last().click();
  }
  await expect(productRow(page, sku)).toBeHidden({ timeout: 20_000 });
}
