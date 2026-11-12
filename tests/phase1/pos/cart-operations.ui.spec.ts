import { test, expect, addItem, line, quantityControl, cart, expectTotal } from './support/pos';

test.describe('POS — Cart Operations', () => {
  test('merges repeated items, changes quantity, removes the line and recalculates @phase1 @pos', async ({ page, pos }) => {
    await addItem(page, pos, 2);
    const row = line(page, pos.name);
    await expect(row).toHaveCount(1);
    await expectTotal(page, pos.selling * 2);
    await quantityControl(row, 'plus').click();
    await expectTotal(page, pos.selling * 3);
    await quantityControl(row, 'minus').click();
    await expectTotal(page, pos.selling * 2);
    await row.hover();
    await quantityControl(row, 'remove').click();
    await expect(cart(page).getByText('Your order is empty', { exact: true })).toBeVisible();
    await expectTotal(page, 0);
  });

  test('allows an administrator to override the unit selling price @phase1 @pos', async ({ page, pos }) => {
    await addItem(page, pos);
    const row = line(page, pos.name);
    const control = row.getByRole('button', { name: /edit price|override price|unit price/i })
      .or(row.getByRole('spinbutton', { name: /price/i }));
    await expect(control, 'Admin cart must expose a permitted unit-price override').toBeVisible();
    if (await control.getAttribute('type') === 'number') await control.fill('80');
    else {
      await control.click();
      await page.getByRole('spinbutton', { name: /price/i }).fill('80');
      await page.getByRole('button', { name: /save|apply/i }).click();
    }
    await expectTotal(page, 80);
  });

  test('asks for confirmation before clearing and preserves cart on cancel @phase1 @pos', async ({ page, pos }) => {
    await addItem(page, pos, 2);
    let nativeConfirmation = false;
    const cancelNative = async (dialog: import('playwright/test').Dialog) => {
      nativeConfirmation = true;
      await dialog.dismiss();
    };
    page.once('dialog', cancelNative);
    await cart(page).getByRole('button', { name: 'Clear', exact: true }).click();
    page.off('dialog', cancelNative);
    if (nativeConfirmation) {
      await expectTotal(page, pos.selling * 2);
      page.once('dialog', dialog => dialog.accept());
      await cart(page).getByRole('button', { name: 'Clear', exact: true }).click();
      await expect(cart(page).getByText('Your order is empty', { exact: true })).toBeVisible();
      return;
    }
    const confirm = page.getByRole('alertdialog').or(page.getByRole('dialog').filter({ hasText: /clear.*(cart|order)|remove all/i }));
    await expect(confirm, 'Clear must ask for confirmation before discarding the order').toBeVisible();
    await confirm.getByRole('button', { name: /cancel|keep/i }).click();
    await expectTotal(page, pos.selling * 2);
    await cart(page).getByRole('button', { name: 'Clear', exact: true }).click();
    await confirm.getByRole('button', { name: /clear|confirm|yes/i }).click();
    await expect(cart(page).getByText('Your order is empty', { exact: true })).toBeVisible();
  });
});
