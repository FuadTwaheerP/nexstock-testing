import { test, expect, createSupplier, editSupplier, fillSupplier, saveSupplier, expectSupplierFields, setStatus, filterStatus, supplierRow, openSuppliers, searchSupplier, brnField } from './support/suppliers';

test.describe('Suppliers — Edit / Deactivate Supplier', () => {
  test('edits and clears optional BRN independently of Tax ID @phase1 @suppliers', async ({ page, supplier }) => {
    await createSupplier(page, supplier);
    const form = await editSupplier(page, supplier);
    await expect(brnField(form), 'Edit Supplier requires its own optional BRN control').toBeVisible();
    await brnField(form).fill(supplier.brn);
    await saveSupplier(page, form, supplier);
    const reopened = await editSupplier(page, supplier);
    await expect(brnField(reopened)).toHaveValue(supplier.brn);
    await expect(reopened.getByRole('textbox', { name: 'Tax ID', exact: true })).toHaveValue(supplier.taxID);
    await brnField(reopened).fill('');
    await saveSupplier(page, reopened, supplier);
    const cleared = await editSupplier(page, supplier);
    await expect(brnField(cleared)).toHaveValue('');
    await expect(cleared.getByRole('textbox', { name: 'Tax ID', exact: true })).toHaveValue(supplier.taxID);
  });
  test('updates name, contact, fiscal identifier and address after reload @phase1 @suppliers', async ({ page, supplier }) => {
    await createSupplier(page, supplier);
    const form = await editSupplier(page, supplier);
    supplier.name += ' Updated';
    supplier.company = 'QA Updated Vendor Company';
    supplier.contact = 'QA Updated Contact';
    supplier.email = `qa.supplier.updated.${supplier.token}@example.invalid`;
    supplier.phone = '+23051234568';
    supplier.address1 = 'QA Updated Building';
    supplier.taxID += '-UPDATED';
    supplier.notes = 'QA updated supplier notes';
    await fillSupplier(form, supplier);
    await saveSupplier(page, form, supplier);
    await expectSupplierFields(await editSupplier(page, supplier), supplier);
  });
  test('clears optional contact and address fields without restoring stale values @phase1 @suppliers', async ({ page, supplier }) => {
    await createSupplier(page, supplier);
    const form = await editSupplier(page, supplier);
    const optional = ['Company Name', 'Contact Person', 'Phone Number', 'Address Line 1', 'Address Line 2', 'City', 'State', 'Postal Code', 'Country', 'Tax ID', 'Internal Notes'];
    for (const label of optional) await form.getByRole('textbox', { name: label, exact: true }).fill('');
    const beforeSave = Object.fromEntries(await Promise.all(optional.map(async label => [label, await form.getByRole('textbox', { name: label, exact: true }).inputValue()])));
    expect(beforeSave, 'Cleared inputs must still be empty before Save; do not misclassify an editor reset as a persistence failure').toEqual(Object.fromEntries(optional.map(label => [label, ''])));
    await saveSupplier(page, form, supplier);
    const reopened = await editSupplier(page, supplier);
    const actual = Object.fromEntries(await Promise.all(optional.map(async label => [label, await reopened.getByRole('textbox', { name: label, exact: true }).inputValue()])));
    expect(actual, 'Optional fields, including Tax ID, must stay blank after save/reload').toEqual(Object.fromEntries(optional.map(label => [label, ''])));
  });
  test('deactivates without deleting identity and respects status filters @phase1 @suppliers', async ({ page, supplier }) => {
    await createSupplier(page, supplier);
    await setStatus(page, supplier, 'Inactive');
    await filterStatus(page, 'Active');
    await expect(supplierRow(page, supplier)).toHaveCount(0);
    await filterStatus(page, 'Inactive');
    await expect(supplierRow(page, supplier)).toHaveCount(1);
    await expectSupplierFields(await editSupplier(page, supplier), supplier);
  });
  test('reactivates the same supplier identity rather than creating a duplicate @phase1 @suppliers', async ({ page, supplier }) => {
    await createSupplier(page, supplier);
    await setStatus(page, supplier, 'Inactive');
    await setStatus(page, supplier, 'Active');
    await openSuppliers(page);
    await searchSupplier(page, supplier);
    await expect(supplierRow(page, supplier)).toHaveCount(1);
    await expect(supplierRow(page, supplier).getByRole('cell', { name: 'Active', exact: true })).toBeVisible();
  });
});
