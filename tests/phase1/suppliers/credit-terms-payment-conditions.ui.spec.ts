import { test, expect, createSupplier, editSupplier, saveSupplier, newSupplier, fillSupplier, creditLimit, openSupplierPicker, main, submitAndObserveValidation, track, openSuppliers } from './support/suppliers';

test.describe('Suppliers — Credit Terms & Payment Conditions', () => {
  for (const days of [15, 30, 60]) {
    test(`persists Net ${days} and its allowed credit period @phase1 @suppliers`, async ({ page, supplier }) => {
      await createSupplier(page, supplier);
      const form = await editSupplier(page, supplier);
      supplier.terms = `Net ${days}`;
      supplier.period = days;
      await form.getByRole('textbox', { name: 'Payment Terms', exact: true }).fill(supplier.terms);
      await form.getByRole('spinbutton', { name: 'Credit Period', exact: true }).fill(String(days));
      await saveSupplier(page, form, supplier);
      const reopened = await editSupplier(page, supplier);
      await expect(reopened.getByRole('textbox', { name: 'Payment Terms', exact: true })).toHaveValue(supplier.terms);
      await expect(reopened.getByRole('spinbutton', { name: 'Credit Period', exact: true })).toHaveValue(String(days));
      await reopened.getByRole('button', { name: 'Cancel', exact: true }).click();
      const picker = await openSupplierPicker(page);
      await picker.getByRole('button').filter({ hasText: supplier.name }).click();
      await expect(main(page).getByRole('button', { name: supplier.name, exact: true })).toBeVisible();
      // Deliberately never submit the Phase 2 purchase order form.
    });
  }
  test('persists a credit limit when adding a supplier @phase1 @suppliers', async ({ page, supplier }) => {
    const form = await newSupplier(page);
    await fillSupplier(form, supplier);
    await expect(creditLimit(form), 'F18-c requires a supplier credit limit, not a minimum order value').toBeVisible();
    await creditLimit(form).fill('10000');
    track(supplier);
    await form.getByRole('button', { name: 'Add Supplier', exact: true }).click();
    await expect(form).toBeHidden({ timeout: 20_000 });
    await openSuppliers(page);
    const reopened = await editSupplier(page, supplier);
    track(supplier, true);
    await expect(creditLimit(reopened)).toHaveValue('10000');
  });
  test('persists an edited supplier credit limit @phase1 @suppliers', async ({ page, supplier }) => {
    await createSupplier(page, supplier);
    const form = await editSupplier(page, supplier);
    await expect(creditLimit(form), 'Saved supplier must support maintaining its credit limit').toBeVisible();
    await creditLimit(form).fill('15000');
    await saveSupplier(page, form, supplier);
    await expect(creditLimit(await editSupplier(page, supplier))).toHaveValue('15000');
  });
  test('observes negative credit days without assuming configured terms equal overdue days @phase1 @suppliers', async ({ page, supplier }, info) => {
    await createSupplier(page, supplier);
    const form = await editSupplier(page, supplier);
    await form.getByRole('spinbutton', { name: 'Credit Period', exact: true }).fill('-1');
    // The user allowed negative days when they mean an exceeded due date.
    // Whether this editable Credit Period stores that counter or agreed terms
    // is not established. Observe both legitimate outcomes, not a guessed bug.
    const outcome = await submitAndObserveValidation(page, form, 'Save Changes', /credit period.*(?:negative|zero|greater|invalid|positive)|non.negative|at least 0/i);
    if (outcome === 'rejected') await form.getByRole('button', { name: 'Cancel', exact: true }).click();
    await openSuppliers(page);
    const reopened = await editSupplier(page, supplier);
    await expect(reopened.getByRole('spinbutton', { name: 'Credit Period', exact: true })).toHaveValue(outcome === 'saved' ? '-1' : String(supplier.period));
    info.annotations.push({ type: 'policy-observation', description: 'Not a policy pass or a confirmed bug; configured Credit Period versus overdue-day counter needs product clarification.' });
    await info.attach('negative-day-observation', { body: JSON.stringify({ outcome, configuredPeriodMeaningUnconfirmed: true }), contentType: 'application/json' });
  });
});
