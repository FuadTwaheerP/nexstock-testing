import { test, expect, prepareInvoice, persistInvoice, expectGrandTotal, newInvoice, saveAction, selectCustomer, fillDates, addLine, findInvoice, main, dates, withVAT, createInvoice } from './support/invoicing';

test.describe('Invoicing — Create Tax Invoice', () => {
  test('builds two units at 100 and recalculates quantity, price and cart discount @phase1 @invoicing', async ({ page, invoice }) => {
    await prepareInvoice(page, invoice);
    await expectGrandTotal(page, 200);
    await main(page).getByRole('spinbutton').nth(0).fill('3');
    await main(page).getByRole('spinbutton').nth(1).fill('80');
    await expectGrandTotal(page, 240);
    await main(page).getByRole('spinbutton').last().fill('10');
    await expectGrandTotal(page, 216);
  });
  test('requires a customer before saving @phase1 @invoicing', async ({ page, invoice }) => {
    await newInvoice(page);
    await fillDates(page);
    await addLine(page, invoice);
    await saveAction(page);
    await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/select.*customer|customer.*required/i);
    await expect(main(page).getByRole('heading', { name: 'New Invoice', exact: true })).toBeVisible();
  });
  test('requires invoice items before saving @phase1 @invoicing', async ({ page, invoice }) => {
    await newInvoice(page);
    await selectCustomer(page, invoice);
    await fillDates(page);
    await saveAction(page);
    await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/add.*item|item.*required|at least one/i);
  });
  test('requires a due date before saving @phase1 @invoicing', async ({ page, invoice }) => {
    await newInvoice(page);
    await selectCustomer(page, invoice);
    await addLine(page, invoice);
    await dates(page).nth(1).fill('');
    await expect(dates(page).nth(1)).toHaveValue('');
    await saveAction(page);
    await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/due date/i);
  });
  test('persists a draft with its fiscal reference, customer and total after reload @phase1 @invoicing', async ({ page, invoice }) => {
    await prepareInvoice(page, invoice);
    const ref = await persistInvoice(page);
    const row = await findInvoice(page, ref);
    await expect(row).toContainText(invoice.customer);
    await expect(row).toContainText('200.00');
    await expect(row).toContainText(/draft/i);
  });
  test('supports customer BRN for fiscal invoice identity @phase1 @invoicing', async ({ page, invoice }) => {
    await prepareInvoice(page, invoice);
    const ref = await persistInvoice(page);
    const detail = await (await import('./support/invoicing')).openInvoice(page, ref);
    await expect(detail).toContainText('QA-BILLING-BRN');
    await expect(detail).toContainText('QA-BILLING-VAT');
    await expect(detail).toContainText('QA Test Address, Ebene');
  });
  test('persists a paid invoice using record-only Mark Paid and Save @phase1 @invoicing', async ({ page, invoice }) => {
    const ref = await createInvoice(page, invoice, 'Mark Paid & Save');
    await expect((await findInvoice(page, ref)).getByRole('cell').nth(5)).toHaveText('Paid');
    const detail = await (await import('./support/invoicing')).openInvoice(page, ref);
    await expect(detail.getByText('Total Amount Due:', { exact: true }).locator('..')).toContainText('0.00');
  });
  test('calculates 15 percent VAT and persists the taxable total @phase1 @invoicing', async ({ page, invoice }) => {
    await withVAT(page, async () => {
      await prepareInvoice(page, invoice);
      await expectGrandTotal(page, 230);
      const ref = await persistInvoice(page);
      await expect(await findInvoice(page, ref)).toContainText('230.00');
    });
  });
});
