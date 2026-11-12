import { test, expect, createInvoice, issueInvoice, recordPayment, submitPayment, openInvoice, findInvoice } from './support/invoicing';

test.describe('Invoicing — Installments & Partial Payments', () => {
  test('retains a 50 deposit and settles the remaining 150 after reload @phase1 @invoicing', async ({ page, invoice }) => {
    const ref = await createInvoice(page, invoice);
    await issueInvoice(page, ref);
    await submitPayment(page, await recordPayment(page, ref, 50));
    let detail = await openInvoice(page, ref);
    await expect(detail.getByText('Partially Paid', { exact: true })).toBeVisible();
    await expect(detail).toContainText(/50\.00/);
    await expect(detail).toContainText(/150\.00/);
    await submitPayment(page, await recordPayment(page, ref, 150));
    await expect((await findInvoice(page, ref)).getByRole('cell').nth(5)).toHaveText('Paid');
    detail = await openInvoice(page, ref);
    await expect(detail.getByText('Total Amount Due:', { exact: true }).locator('..')).toContainText(/0\.00/);
  });

  for (const amount of [0, -10]) {
    test(`rejects invalid installment ${amount} on a 200 invoice @phase1 @invoicing`, async ({ page, invoice }) => {
      const ref = await createInvoice(page, invoice);
      await issueInvoice(page, ref);
      const dialog = await recordPayment(page, ref, amount);
      const submit = dialog.getByRole('button', { name: /^(save|record payment|add payment|confirm payment)$/i });
      await submit.click();
      await expect(dialog, 'Invalid installment must not close as a successful payment').toBeVisible();
      const nativeInvalid = await dialog.getByRole('spinbutton').evaluate((el: HTMLInputElement) => !el.validity.valid);
      if (!nativeInvalid) await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/invalid payment amount|amount.*(?:greater|positive|invalid|required)|greater than.*0|must.*0/i);
      await page.reload();
      await expect((await findInvoice(page, ref)).getByRole('cell').nth(5)).toHaveText('Pending');
      const detail = await openInvoice(page, ref);
      await expect(detail.getByText('Total Amount Due:', { exact: true }).locator('..')).toContainText('200.00');
    });
  }
});
