import { test, expect, createCustomer, editCustomer, fillCustomer, saveCustomer, expectFields, setStatus, openCustomers, main, choose, invoicePicker, draftInvoice, openProfile } from './support/customers';

test('@phase1 F19-b update customer identity contact address and type', async ({ page, customer }) => {
  await createCustomer(page, customer);
  const form = await editCustomer(page, customer);
  const updated = { ...customer, name: `${customer.name} Updated`, company: `${customer.company} Updated`, email: `qa.updated.${customer.token}@example.invalid`, phone: '+23059876543', address: 'QA Updated Address, Port Louis', type: 'Business' as const };
  await fillCustomer(page, form, updated);
  await saveCustomer(page, form, updated);
  const reopened = await editCustomer(page, updated);
  await expectFields(reopened, updated);
});
test('@phase1 F19-b clear optional company phone and address', async ({ page, customer }) => {
  await createCustomer(page, customer);
  const form = await editCustomer(page, customer);
  const updated = { ...customer, company: '', phone: '', address: '' };
  await fillCustomer(page, form, updated);
  await saveCustomer(page, form, updated);
  const reopened = await editCustomer(page, updated);
  for (const label of ['Company Name', 'Phone Number', 'Billing Address']) {
    await expect.soft(reopened.getByLabel(label, { exact: true }), `Cleared optional ${label} must remain blank after reload`).toHaveValue('');
  }
});
test('@phase1 F19-b retain inactive customer filter and reactivate', async ({ page, customer }) => {
  await createCustomer(page, customer);
  const inactive = await setStatus(page, customer, 'Inactive');
  await main(page).getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: 'Inactive', exact: true }).click();
  await expect(main(page).getByRole('row').filter({ hasText: customer.email })).toHaveCount(1);
  const active = await setStatus(page, inactive, 'Active');
  await expectFields(await editCustomer(page, active), active);
});
test('@phase1 F19-b inactive customer is not offered for a new invoice', async ({ page, customer }) => {
  await createCustomer(page, customer);
  await invoicePicker(page);
  const active = page.getByRole('option').filter({ hasText: customer.email });
  await expect(active, 'Positive control: this customer must first be available while active').toBeVisible();
  await active.press('Escape');
  await setStatus(page, customer, 'Inactive');
  await invoicePicker(page);
  await expect(page.getByRole('option').filter({ hasText: customer.email }), 'Archived/inactive customer must not be eligible for a new invoice per P1-050').toHaveCount(0);
});
test('@phase1 F19-b later-sorting active customer remains selectable for billing', async ({ page, customer }) => {
  customer.name = `QA CUST ZZZ ${customer.token}`;
  await createCustomer(page, customer);
  await invoicePicker(page);
  await expect(page.getByRole('option').filter({ hasText: customer.email }), 'An active QA customer must not disappear because the picker loads only an initial subset; the present QA company has more than fifteen records').toBeVisible();
});
test('@phase1 F19-b inactive customer retains its historical draft invoice', async ({ page, customer }) => {
  await createCustomer(page, customer);
  const reference = await draftInvoice(page, customer);
  const inactive = await setStatus(page, customer, 'Inactive');
  await openProfile(page, inactive);
  await expect(main(page).getByRole('tabpanel')).toContainText(reference);
});
