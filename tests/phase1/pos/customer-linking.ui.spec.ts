import { test, expect, cart, selectCustomer, addItem, charge } from './support/pos';

test.describe('POS — Customer Linking', () => {
  test('starts a fresh order with the walk-in customer @phase1 @pos', async ({ page, pos }) => {
    await expect(cart(page).getByRole('button', { name: /Tap to change/ })).toContainText('Walk-in Customer');
    await addItem(page, pos);
    await expect(await charge(page)).toContainText('Walk-in Customer');
  });

  test('finds and links an existing customer to checkout @phase1 @pos', async ({ page, pos }) => {
    for (const query of [pos.customer.toLowerCase(), pos.customer.toUpperCase(), pos.customer]) await selectCustomer(page, pos.customer, query);
    await addItem(page, pos);
    await expect(await charge(page)).toContainText(pos.customer);
  });

  test('offers customer quick-add from the POS customer picker @phase1 @pos', async ({ page, pos }) => {
    await cart(page).getByRole('button', { name: /Tap to change/ }).click();
    const dialog = page.getByRole('dialog', { name: 'Select Customer', exact: true });
    const quickAdd = dialog.getByRole('button', { name: /add customer|new customer|create customer/i });
    await expect(quickAdd, 'POS must offer quick-add without leaving checkout').toBeVisible();
    await quickAdd.click();
    const form = page.getByRole('dialog', { name: 'Add customer', exact: true });
    await expect(form).toBeVisible();
    await form.getByLabel('Name *', { exact: true }).fill(`QA POS Quick ${Date.now()}`);
    await form.getByLabel(/^Email/i).fill(`qa.pos.quick.${Date.now()}@example.invalid`);
    await form.getByRole('button', { name: 'Add and select', exact: true }).click();
    await expect(cart(page).getByRole('button', { name: /Tap to change/ })).toContainText('QA POS Quick');
  });
});
