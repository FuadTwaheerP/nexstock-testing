import { test, expect, createSupplier, editSupplier, expectSupplierFields, newSupplier, fillSupplier, main, supplierRow, openSuppliers, track, submitAndObserveValidation, brnField } from './support/suppliers';

test.describe('Suppliers — Add Supplier', () => {
  test('stores optional BRN separately from Tax ID on creation @phase1 @suppliers', async ({ page, supplier }) => {
    const form = await newSupplier(page);
    await fillSupplier(form, supplier);
    await expect(brnField(form), 'BRN and Tax ID must be separate optional fields (confirmed requirement)').toBeVisible();
    await brnField(form).fill(supplier.brn);
    track(supplier);
    await form.getByRole('button', { name: 'Add Supplier', exact: true }).click();
    await expect(form).toBeHidden({ timeout: 20_000 });
    await openSuppliers(page);
    const reopened = await editSupplier(page, supplier);
    track(supplier, true);
    await expect(brnField(reopened)).toHaveValue(supplier.brn);
    await expect(reopened.getByRole('textbox', { name: 'Tax ID', exact: true })).toHaveValue(supplier.taxID);
  });
  test('persists company, contact, identifier, address and commercial details @phase1 @suppliers', async ({ page, supplier }) => {
    await createSupplier(page, supplier);
    const form = await editSupplier(page, supplier);
    await expectSupplierFields(form, supplier);
  });
  test('supports name-only creation as advertised by the form @phase1 @suppliers', async ({ page, supplier }) => {
    const form = await newSupplier(page);
    await expect(form).toContainText('Only the name is required.');
    await fillSupplier(form, supplier, 'name-only');
    track(supplier);
    await form.getByRole('button', { name: 'Add Supplier', exact: true }).click();
    await expect(form, 'Advertised name-only contract must either work or the help text must accurately state requirements').toBeHidden({ timeout: 15_000 });
    await openSuppliers(page);
    await main(page).getByPlaceholder('Search...', { exact: true }).fill(supplier.token);
    await expect(supplierRow(page, supplier)).toHaveCount(1);
    track(supplier, true);
  });
  test('rejects a missing supplier name @phase1 @suppliers', async ({ page, supplier }) => {
    const form = await newSupplier(page);
    await form.getByRole('textbox', { name: 'Email Address', exact: true }).fill(supplier.email);
    track(supplier);
    await form.getByRole('button', { name: 'Add Supplier', exact: true }).click();
    await expect(form).toBeVisible();
    const invalid = await form.getByRole('textbox', { name: /^Supplier Name/ }).evaluate((el: HTMLInputElement) => !el.checkValidity());
    if (!invalid) await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText('Supplier name is required');
  });
  test('rejects a malformed email before creating a supplier @phase1 @suppliers', async ({ page, supplier }) => {
    const form = await newSupplier(page);
    await fillSupplier(form, supplier, 'minimum');
    await form.getByRole('textbox', { name: 'Email Address', exact: true }).fill('not-an-email');
    track(supplier);
    const outcome = await submitAndObserveValidation(page, form, 'Add Supplier', /invalid.*email|valid email|email.*invalid/i);
    if (outcome === 'saved') track(supplier, true);
    expect(outcome, 'Malformed email must be rejected rather than saved').toBe('rejected');
  });
  test('cancel leaves no new supplier record @phase1 @suppliers', async ({ page, supplier }) => {
    const form = await newSupplier(page);
    await fillSupplier(form, supplier);
    await form.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(form).toBeHidden();
    await openSuppliers(page);
    await main(page).getByPlaceholder('Search...', { exact: true }).fill(supplier.token);
    await expect(supplierRow(page, supplier)).toHaveCount(0);
  });
});
