import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { expect, type Page } from 'playwright/test';
import { findInvoice, openInvoice, route } from './invoicing';

export async function exportPDF(page: Page, ref: string, destination: string) {
  // The list's first column and URL use the internal record ID; the exported
  // document correctly uses its separately persisted invoiceNumber.
  const loaded=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/sales/invoices/'+ref).then(async r=>{expect(r.ok()).toBe(true);return (await r.json()).data;});
  await openInvoice(page,ref);const saved=await loaded;
  expect(String(saved.id)).toBe(ref);expect(saved.invoiceNumber).toMatch(/^(?:INV|POS)-/);
  await expect(page.getByRole('main')).toContainText(saved.invoiceNumber);
  await (await import('playwright/test')).test.info().attach('exported-invoice-identity-oracle',{body:JSON.stringify({id:saved.id,invoiceNumber:saved.invoiceNumber,status:saved.status,total:saved.total,amountPaid:saved.amountPaid,amountDue:saved.amountDue}),contentType:'application/json'});
  const row = await findInvoice(page, ref);
  // Support both a file download and a print-view popup. A popup must actually
  // contain the requested invoice; never rewrite a broken application URL.
  const exportButton = row.locator('button:has(svg.lucide-download)');
  await expect(exportButton, 'Saved invoice must expose its download action').toBeVisible();
  const outcomePromise = Promise.race([
    page.waitForEvent('download', { timeout: 20_000 }).then(download => ({ kind: 'download' as const, download })).catch(() => ({ kind: 'timeout' as const })),
    page.waitForEvent('popup', { timeout: 20_000 }).then(popup => ({ kind: 'popup' as const, popup })).catch(() => ({ kind: 'timeout' as const })),
  ]);
  await exportButton.click();
  const outcome = await outcomePromise;
  expect(outcome.kind, 'Invoice PDF action must produce a file or a usable print view').not.toBe('timeout');
  if (outcome.kind === 'download') await outcome.download.saveAs(destination);
  else if (outcome.kind === 'popup') {
    try {
      await outcome.popup.waitForLoadState('domcontentloaded');
      const body = await outcome.popup.locator('body').innerText();
      const proof = destination.replace(/\.pdf$/, '-export-popup.png');
      await outcome.popup.screenshot({ path: proof, fullPage: true });
      await (await import('playwright/test')).test.info().attach('invoice-export-popup', { path: proof, contentType: 'image/png' });
      expect(body, `APPLICATION: PDF/export opened ${new URL(outcome.popup.url()).pathname} instead of a usable invoice print view`).not.toMatch(/That page is not here|\b404\b/);
      await expect(outcome.popup.getByText(ref, { exact: false }).first()).toBeVisible();
      writeFileSync(destination, await outcome.popup.pdf({ format: 'A4', printBackground: true }));
    } finally { await outcome.popup.close(); }
  }
  const bytes = readFileSync(destination);
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
  expect(bytes.toString('latin1').slice(-1024)).toContain('%%EOF');
  const bundledPython = resolve(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe');
  const python = process.env.PDF_PYTHON || (existsSync(bundledPython) ? bundledPython : 'python');
  const result = JSON.parse(execFileSync(python, [resolve('tests/phase1/invoicing/support/inspect_invoice_pdf.py'), destination], { encoding: 'utf8', timeout: 30_000 }));
  expect(result.pages).toBeGreaterThan(0);
  expect(result.text,'PDF identity must match the exact saved invoice, not its internal record ID').toContain(saved.invoiceNumber);
  return {...result,invoiceNumber:saved.invoiceNumber} as { pages: number; text: string;invoiceNumber:string;colours:number[][] };
}
export async function withInvoiceBranding(page: Page, run: (footer: string) => Promise<void>) {
  await route(page, '/settings');
  const header = page.getByLabel('Invoice Header', { exact: true });
  const footer = page.getByLabel('Invoice Footer', { exact: true });
  const before = { header: await header.inputValue(), footer: await footer.inputValue() };
  const qaFooter = 'QA Test Bank | Account: QA-NOT-A-REAL-ACCOUNT | Payment notes: QA only - do not pay';
  try {
    await header.fill('QA Commercial Tax Invoice');
    await footer.fill(qaFooter);
    await page.getByRole('button', { name: 'Save Settings', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/saved|updated/i);
    await page.reload();
    await expect(page.getByLabel('Invoice Header', { exact: true })).toHaveValue('QA Commercial Tax Invoice');
    await expect(page.getByLabel('Invoice Footer', { exact: true })).toHaveValue(qaFooter);
    await (await import('playwright/test')).test.info().attach('saved-invoice-branding-oracle',{body:JSON.stringify({header:await page.getByLabel('Invoice Header',{exact:true}).inputValue(),footer:await page.getByLabel('Invoice Footer',{exact:true}).inputValue(),verifiedAfterReload:true}),contentType:'application/json'});
    await run(qaFooter);
  } finally {
    const restore = await page.context().newPage();
    try {
      await route(restore, '/settings');
      await restore.getByLabel('Invoice Header', { exact: true }).fill(before.header);
      await restore.getByLabel('Invoice Footer', { exact: true }).fill(before.footer);
      await restore.getByRole('button', { name: 'Save Settings', exact: true }).click();
      await expect(restore.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/saved|updated/i);
      await restore.reload();
      await expect(restore.getByLabel('Invoice Header', { exact: true })).toHaveValue(before.header);
      await expect(restore.getByLabel('Invoice Footer', { exact: true })).toHaveValue(before.footer);
    } finally { await restore.close(); }
  }
}
