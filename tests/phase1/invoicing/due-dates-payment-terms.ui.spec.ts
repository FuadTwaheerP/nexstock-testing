import { test, expect, prepareInvoice, main, dates, datePlus, persistInvoice, findInvoice, saveAction } from './support/invoicing';

test.describe('Invoicing — Due Dates & Commercial Terms', () => {
  for (const [term, days] of [['Due on receipt', 0], ['Net 15', 15], ['Net 30', 30], ['Net 60', 60]] as const) {
    test(`calculates ${term} across a month boundary @phase1 @invoicing`, async ({ page, invoice }) => {
      const issue = '2026-01-31';
      await prepareInvoice(page, invoice, { issue, due: issue });
      const terms = main(page).getByRole('combobox', { name: /payment terms|commercial terms|terms/i });
      await expect(terms, `Required commercial term ${term} must be selectable`).toBeVisible();
      await terms.click();
      await page.getByRole('option', { name: new RegExp(term, 'i') }).click();
      await expect(dates(page).nth(1)).toHaveValue(datePlus(days, issue));
    });
  }
  test('persists a manually selected due date @phase1 @invoicing', async ({ page, invoice }) => {
    const due = datePlus(30);
    await prepareInvoice(page, invoice, { due });
    const ref = await persistInvoice(page);
    const row = await findInvoice(page, ref);
    const displayedDate = await row.getByRole('cell').nth(4).innerText();
    const [year, month, day] = due.split('-');
    expect(displayedDate).toMatch(new RegExp(`${day}[/.-]${month}[/.-]${year}|${month}[/.-]${day}[/.-]${year}|${due}`));
  });
  test('rejects a due date earlier than the issue date @phase1 @invoicing', async ({ page, invoice }) => {
    await prepareInvoice(page, invoice, { issue: datePlus(0), due: datePlus(-1) });
    await saveAction(page);
    await expect(page.getByRole('region', { name: 'Notifications alt+T' }), 'Chronology must be rejected with a user-facing date-validation message, not a server error').toContainText(/due.*(before|earlier|after|invalid)|date.*invalid/i);
    await expect(main(page).getByRole('heading', { name: 'New Invoice', exact: true })).toBeVisible();
  });
});
