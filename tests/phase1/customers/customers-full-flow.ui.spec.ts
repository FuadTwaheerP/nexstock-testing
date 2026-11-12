import { test, expect, createCustomer, editCustomer, fillCustomer, saveCustomer, openProfile, expectAR, expectHistorySources, draftInvoice, draftQuotation, setStatus, brn, vat, main } from './support/customers';

test('@phase1 @full-flow Customers and AR create edit history balances archive lifecycle', async ({ page, customer }) => {
  await test.step('F19-a create and persist corporate identity', async () => {
    customer.type = 'Business';
    await createCustomer(page, customer);
    const form = await editCustomer(page, customer);
    await expect.soft(form.getByRole('combobox', { name: 'Type', exact: true })).toHaveText(customer.type);
    await expect.soft(brn(form), 'BRN must have a dedicated field').toBeVisible();
    await expect.soft(vat(form), 'VAT number must have a dedicated field').toBeVisible();
    await form.getByRole('button', { name: 'Cancel', exact: true }).click();
  });
  await test.step('F19-b edit supported contact details and reopen', async () => {
    const form = await editCustomer(page, customer);
    customer.address = 'QA Full Flow Address, Port Louis';
    await fillCustomer(page, form, customer);
    await saveCustomer(page, form, customer);
    const reopened = await editCustomer(page, customer);
    // Keep remaining stages observable when a type-persistence defect occurs.
    await expect.soft(reopened.getByLabel('Billing Address', { exact: true })).toHaveValue(customer.address);
    await reopened.getByRole('button', { name: 'Cancel', exact: true }).click();
  });
  await test.step('F19-c check customer balances statement and aging entry points', async () => { await expectAR(await openProfile(page, customer)); });
  await test.step('F19-d inspect invoice POS and quotation history', async () => { await expectHistorySources(await openProfile(page, customer)); });
  let reference: string | undefined;
  await test.step('F19-d create safe draft and verify customer history', async () => {
    // Record a genuine failed application save, then still exercise archive.
    try { reference = await draftInvoice(page, customer); }
    catch (error) { expect.soft(false, String(error)).toBe(true); }
  });
  await test.step('F19-d attempt safe quotation draft and verify history', async () => {
    try { await draftQuotation(page, customer); }
    catch (error) { expect.soft(false, String(error)).toBe(true); }
  });
  await test.step('F19-b archive without deleting account or existing history', async () => {
    const inactive = await setStatus(page, customer, 'Inactive');
    const profile = await openProfile(page, inactive);
    await expect(profile.getByText('Inactive', { exact: true })).toBeVisible();
    if (reference) await expect(main(page).getByRole('tabpanel')).toContainText(reference);
    else await test.info().attach('history-retention-blocker', { body: 'No saved draft reference: historical retention assertion remains blocked, not passed.', contentType: 'text/plain' });
  });
});
