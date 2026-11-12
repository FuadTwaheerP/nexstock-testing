import { test, expect, prepareInvoice, persistInvoice, expectGrandTotal, main, dates, datePlus, issueInvoice, recordPayment, submitPayment, findInvoice, openInvoice, withVAT } from './support/invoicing';
import { exportPDF, withInvoiceBranding } from './support/pdf';

test.describe('Invoicing & Commercial Sales Billing — Full Flow', () => {
  test('creates a Net 30 tax invoice, issues, part-pays, settles and exports/prints @phase1 @invoicing @full-flow', async ({ page, invoice }, info) => {
    await withVAT(page, async () => {
      await withInvoiceBranding(page, async () => {
        await prepareInvoice(page, invoice);
        const terms = main(page).getByRole('combobox', { name: /payment terms|commercial terms|terms/i });
        await expect.soft(terms, 'Full commercial flow requires Net 30 terms').toBeVisible();
        if (await terms.isVisible()) {
          await terms.click();
          await page.getByRole('option', { name: /Net 30/i }).click();
          await expect(dates(page).nth(1)).toHaveValue(datePlus(30));
        }
        await expectGrandTotal(page, 230);
        const ref = await persistInvoice(page);
        await issueInvoice(page, ref);
        await submitPayment(page, await recordPayment(page, ref, 50));
        const partial = await openInvoice(page, ref);
        await expect(partial.getByText('Partially Paid', { exact: true })).toBeVisible();
        await expect(partial.locator('#receipt-content').getByText('Total Amount Due:', { exact: true }).locator('..')).toContainText('180.00');
        await submitPayment(page, await recordPayment(page, ref, 180));
        await expect((await findInvoice(page, ref)).getByRole('cell',{name:'Paid',exact:true})).toBeVisible();
        const path = info.outputPath('full-flow-invoice.pdf');
        const pdf = await exportPDF(page, ref, path);
        await info.attach('full-flow-pdf', { path, contentType: 'application/pdf' });
        expect(pdf.text).toContain(invoice.customer);
        if(!pdf.text.includes('QA Test Bank'))info.annotations.push({type:'confirmed-bug',description:'RET-002: Native invoice PDF omits banking instructions verified as saved/reloaded in company settings.'});
        expect.soft(pdf.text).toContain('QA Test Bank');
        expect(pdf.text).toMatch(/230(?:\.00)?/);
        const detail = await openInvoice(page, ref);
        await detail.getByRole('button', { name: /print/i }).click();
        await expect.poll(() => page.evaluate(() => (window as any).__qaPrintCalls)).toBeGreaterThan(0);
      });
    });
  });
});
