import { test, expect, tile, addItem, quantityControl, line, discount, expectTotal, selectCustomer, completeSale, withVAT, cart, observedPrintCalls } from './support/pos';

test.describe('POS & Checkout — Full Flow', () => {
  test('searches, builds an order, links a customer, discounts, checks out and reviews receipt @phase1 @pos @full-flow', async ({ page, pos }, info) => {
    await withVAT(page, async () => {
      await test.step('Search and inspect product grid', async () => {
        await page.getByPlaceholder('Search products or scan barcode…').fill(pos.sku);
        await expect(tile(page, pos.sku)).toBeVisible();
        await expect.soft(tile(page, pos.sku)).toContainText(pos.category);
      });
      await test.step('Build and edit the cart', async () => {
        await addItem(page, pos);
        await quantityControl(line(page, pos.name), 'plus').click();
        await expectTotal(page, pos.selling * 2 * 1.15);
      });
      await test.step('Link customer and apply cart discount', async () => {
        await selectCustomer(page, pos.customer);
        await discount(page, 10, '%');
        await expectTotal(page, pos.selling * 2 * 0.9 * 1.15);
      });
      await test.step('Record cash tender and verify receipt', async () => {
        const { receipt } = await completeSale(page, pos, 'Cash', pos.selling * 3);
        await expect(receipt).toContainText(pos.customer);
        await expect(receipt).toContainText('Cash');
        await expect(receipt).toContainText(/change/i);
        await expect(receipt).toContainText(/VAT|Tax/i);
        await info.attach('completed-qa-receipt', {body:await page.screenshot(),contentType:'image/png'});
        await receipt.getByRole('button', { name: 'Standard Print', exact: true }).click();
        await expect.poll(() => observedPrintCalls(page)).toBeGreaterThan(0);
        await receipt.getByRole('button', { name: 'Close', exact: true }).last().click();
      });
      await test.step('New sale starts with empty cart and walk-in customer', async () => {
        await expect(cart(page)).toContainText('Your order is empty');
        await expect(cart(page)).toContainText('Walk-in Customer');
      });
    });
  });
});
