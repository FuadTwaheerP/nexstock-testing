import { test, expect, createInvoice, findInvoice, issueInvoice, recordPayment, submitPayment, cancelInvoice, datePlus, openInvoice } from './support/invoicing';

test.describe('Invoicing — Invoice Lifecycle', () => {
  test('progresses draft to unpaid, partially paid and paid @phase1 @invoicing', async ({ page, invoice }) => {
    const ref = await createInvoice(page, invoice);
    await expect(await findInvoice(page, ref)).toContainText(/draft/i);
    await issueInvoice(page, ref);
    await submitPayment(page, await recordPayment(page, ref, 50));
    await expect((await openInvoice(page, ref)).getByText('Partially Paid', { exact: true })).toBeVisible();
    await submitPayment(page, await recordPayment(page, ref, 150));
    await expect((await findInvoice(page, ref)).getByRole('cell').nth(5)).toHaveText('Paid');
  });
  test('cancels a draft while preserving its invoice reference @phase1 @invoicing', async ({ page, invoice }) => {
    const ref = await createInvoice(page, invoice);
    await cancelInvoice(page, ref);
    await page.reload();
    await expect(await findInvoice(page, ref)).toContainText(/cancelled|canceled|void/i);
  });
  test('marks an issued unpaid invoice overdue using persisted past dates @phase1 @invoicing', async ({ page, invoice }) => {
    const ref = await createInvoice(page, invoice, 'Save as Draft', { issue: datePlus(-30), due: datePlus(-1) });
    await issueInvoice(page, ref);
    await expect(await findInvoice(page, ref)).toContainText(/overdue/i);
  });
  test('allocates increasing references and never reuses a cancelled number @phase1 @invoicing', async ({ page, invoice }) => {
    const first = await createInvoice(page, invoice);
    const second = await createInvoice(page, invoice);
    await cancelInvoice(page, second);
    const third = await createInvoice(page, invoice);
    expect(new Set([first, second, third]).size).toBe(3);
    const sequence = (ref: string) => {
      const match = ref.match(/(\d+)\D*$/);
      expect(match, 'Fiscal reference must expose a sequential numeric component').not.toBeNull();
      return Number(match![1]);
    };
    expect(sequence(second)).toBeGreaterThan(sequence(first));
    expect(sequence(third)).toBeGreaterThan(sequence(second));
    await expect(await openInvoice(page, second)).toContainText(/cancelled|canceled|void/i);
  });
});
