import { test, expect, createInvoice, openInvoice, requireControl, route } from './support/invoicing';
import { exportPDF, withInvoiceBranding } from './support/pdf';

test.describe('Invoicing — Branded PDF Export & Print', () => {
  test('can clear previously saved invoice header and payment instructions @phase1 @invoicing', async ({ page, invoice }, info) => {
    await withInvoiceBranding(page, async () => {
      await route(page, '/settings');
      await page.getByLabel('Invoice Header', { exact: true }).fill('');
      await page.getByLabel('Invoice Footer', { exact: true }).fill('');
      await page.getByRole('button', { name: 'Save Settings', exact: true }).click();
      await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/saved|updated/i);
      await page.reload();
      await info.attach('saved-branding-after-clear', { body: await page.screenshot(), contentType: 'image/png' });
      await expect(page.getByLabel('Invoice Header', { exact: true }), 'Cleared header must remain empty after reload').toHaveValue('');
      await expect(page.getByLabel('Invoice Footer', { exact: true }), 'Cleared payment instructions must remain empty after reload').toHaveValue('');
    });
  });
  test('exports a valid PDF matching the saved invoice identity and amounts @phase1 @invoicing', async ({ page, invoice }, info) => {
    const ref = await createInvoice(page, invoice);
    const path = info.outputPath('invoice.pdf');
    const pdf = await exportPDF(page, ref, path);
    await info.attach('invoice-pdf', { path, contentType: 'application/pdf' });
    expect(pdf.text).toContain(pdf.invoiceNumber);
    expect(pdf.text).toContain(invoice.customer);
    expect(pdf.text).toContain(invoice.company);
    expect(pdf.text).toContain(invoice.name);
    expect(pdf.text.replace(/,/g, '')).toMatch(/200(?:\.00)?/);
  });
  test('includes configured banking instructions and payment notes in the exported PDF @phase1 @invoicing', async ({ page, invoice }, info) => {
    await withInvoiceBranding(page, async () => {
      const ref = await createInvoice(page, invoice);
      const path = info.outputPath('branded-invoice.pdf');
      const pdf = await exportPDF(page, ref, path);
      await info.attach('branded-invoice-pdf', { path, contentType: 'application/pdf' });
      if(!['QA Commercial Tax Invoice','QA Test Bank','QA-NOT-A-REAL-ACCOUNT','QA only - do not pay'].every(text=>pdf.text.includes(text)))info.annotations.push({type:'confirmed-bug',description:'RET-002: Native PDF omits saved/reloaded company invoice header and banking/payment instructions.'});
      expect.soft(pdf.text).toContain('QA Commercial Tax Invoice');
      expect.soft(pdf.text).toContain('QA Test Bank');
      expect.soft(pdf.text).toContain('QA-NOT-A-REAL-ACCOUNT');
      expect.soft(pdf.text).toContain('QA only - do not pay');
    });
  });
  test('invokes browser printing for a saved invoice without a physical print job @phase1 @invoicing', async ({ page, invoice }) => {
    const ref = await createInvoice(page, invoice);
    const detail = await openInvoice(page, ref);
    const print = detail.getByRole('button', { name: /print/i });
    await requireControl(print, 'Invoice must provide a print action');
    await print.click();
    await expect.poll(() => page.evaluate(() => (window as any).__qaPrintCalls)).toBeGreaterThan(0);
  });
});
