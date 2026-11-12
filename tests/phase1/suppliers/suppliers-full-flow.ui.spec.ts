import { test, expect, createSupplier, editSupplier, fillSupplier, saveSupplier, creditLimit, brnField, expectSupplierFields, openSupplierPicker, main, setStatus, filterStatus, supplierRow } from './support/suppliers';

test.describe('Suppliers & Vendor Management — Full Flow', () => {
  test('creates, edits, configures commercial terms, selects and deactivates a vendor @phase1 @suppliers @full-flow', async ({ page, supplier }) => {
    supplier.terms = 'Net 15';
    supplier.period = 15;
    await test.step('Create supplier and verify saved identity', async () => {
      await createSupplier(page, supplier);
      const form = await editSupplier(page, supplier);
      await expectSupplierFields(form, supplier);
      await form.getByRole('button', { name: 'Cancel', exact: true }).click();
    });
    await test.step('Update profile and commercial terms', async () => {
      const form = await editSupplier(page, supplier);
      supplier.contact = 'QA Full Flow Updated Contact';
      supplier.terms = 'Net 30';
      supplier.period = 30;
      await fillSupplier(form, supplier);
      await expect.soft(brnField(form), 'Full vendor flow requires BRN separately from optional Tax ID').toBeVisible();
      if (await brnField(form).isVisible()) await brnField(form).fill(supplier.brn);
      await expect.soft(creditLimit(form), 'Full vendor flow requires credit-limit configuration').toBeVisible();
      if (await creditLimit(form).isVisible()) await creditLimit(form).fill('10000');
      await saveSupplier(page, form, supplier);
      const reopened = await editSupplier(page, supplier);
      await expectSupplierFields(reopened, supplier);
      if (await brnField(reopened).isVisible()) await expect(brnField(reopened)).toHaveValue(supplier.brn);
      if (await creditLimit(reopened).isVisible()) await expect(creditLimit(reopened)).toHaveValue('10000');
      await reopened.getByRole('button', { name: 'Cancel', exact: true }).click();
    });
    await test.step('Select active vendor without submitting a purchase order', async () => {
      const picker = await openSupplierPicker(page);
      await picker.getByRole('button').filter({ hasText: supplier.name }).click();
      await expect(main(page).getByRole('button', { name: supplier.name, exact: true })).toBeVisible();
    });
    await test.step('Deactivate and retain the supplier profile', async () => {
      await setStatus(page, supplier, 'Inactive');
      await filterStatus(page, 'Active');
      await expect(supplierRow(page, supplier)).toHaveCount(0);
      await filterStatus(page, 'Inactive');
      await expect(supplierRow(page, supplier)).toHaveCount(1);
      await expectSupplierFields(await editSupplier(page, supplier), supplier);
    });
  });
});
