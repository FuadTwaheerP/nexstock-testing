import { test, expect, newCustomer, createCustomer, editCustomer, expectFields, choose, brn, vat, track, openCustomers, searchCustomer } from './support/customers';

for (const type of ['Individual', 'Business'] as const) {
  test(`@phase1 F19-a create ${type} and reopen identity/contact/address`, async ({ page, customer }) => {
    customer.type = type;
    await createCustomer(page, customer);
    await expectFields(await editCustomer(page, customer), customer);
  });
}
test('@phase1 F19-a corporate BRN and VAT identifiers are separate persisted fields', async ({ page, customer }) => {
  const form = await newCustomer(page);
  await choose(page, form, 'Type', 'Business');
  await expect.soft(brn(form), 'F19-a requires a dedicated customer BRN field').toBeVisible();
  await expect.soft(vat(form), 'F19-a requires a dedicated customer VAT number field').toBeVisible();
  if (await brn(form).isVisible() && await vat(form).isVisible()) {
    await form.getByLabel('Customer Name *', { exact: true }).fill(customer.name);
    await form.getByLabel('Email *', { exact: true }).fill(customer.email);
    await brn(form).fill(`QA-BRN-${customer.token}`);
    await vat(form).fill(`QA-VAT-${customer.token}`);
    track(customer);
    await form.getByRole('button', { name: 'Add Customer', exact: true }).click();
    await expect(form).toBeHidden();
    await openCustomers(page); await searchCustomer(page, customer); track(customer, true);
    const reopened = await editCustomer(page, customer);
    await expect(brn(reopened)).toHaveValue(`QA-BRN-${customer.token}`);
    await expect(vat(reopened)).toHaveValue(`QA-VAT-${customer.token}`);
  }
});
test('@phase1 F19-a missing name and malformed email are rejected', async ({ page, customer }) => {
  const form = await newCustomer(page);
  await form.getByLabel('Email *', { exact: true }).fill(customer.email);
  await form.getByRole('button', { name: 'Add Customer', exact: true }).click();
  await expect(form).toBeVisible();
  await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/name|required/i);
  await form.getByLabel('Customer Name *', { exact: true }).fill(customer.name);
  await form.getByLabel('Email *', { exact: true }).fill('not-an-email');
  track(customer);
  await form.getByRole('button', { name: 'Add Customer', exact: true }).click();
  await expect(form).toBeVisible();
  expect(await form.getByLabel('Email *', { exact: true }).evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
  await form.getByRole('button', { name: 'Cancel', exact: true }).click();
  await openCustomers(page);
  await expect(await searchCustomer(page, customer, false)).toHaveCount(0);
});
test('@phase1 F19-a cancelling customer creation creates no record', async ({ page, customer }) => {
  const form = await newCustomer(page);
  await form.getByLabel('Customer Name *', { exact: true }).fill(customer.name);
  await form.getByLabel('Email *', { exact: true }).fill(customer.email);
  await form.getByRole('button', { name: 'Cancel', exact: true }).click();
  await openCustomers(page);
  await expect(await searchCustomer(page, customer, false)).toHaveCount(0);
});
