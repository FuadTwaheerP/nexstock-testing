import { existsSync } from 'node:fs';
import { test as cleanup, expect } from 'playwright/test';
import { fixtureData, fixturePath, stock, adjust, companyTax, setCompanyTax } from './support/invoicing';

cleanup('restore invoice QA stock and company VAT settings', async ({ page }) => {
  cleanup.setTimeout(120_000);
  // Setup can fail before taking a baseline. Never guess compensation values.
  if (!existsSync(fixturePath)) throw new Error('No current-run invoice baseline exists; setup failed before mutation');
  const fixture = fixtureData();
  if (!fixture.prepared) {
    await cleanup.info().attach('cleanup', { body: 'Setup stopped before taking a baseline or mutating stock/settings; no compensation needed.', contentType: 'text/plain' });
    return;
  }
  try {
    for (const [branch, baseline] of [[fixture.branch, fixture.initial], [fixture.otherBranch, fixture.otherInitial]] as const) {
      const current = await stock(page, fixture.sku, branch);
      if (current !== baseline) await adjust(page, { ...fixture, branch }, baseline - current, `QA invoice cleanup ${Date.now()}`);
      expect(await stock(page, fixture.sku, branch)).toBe(baseline);
    }
  } finally {
    const current = await companyTax(page);
    if (current.enabled !== fixture.taxBefore.enabled || current.rate !== fixture.taxBefore.rate) await setCompanyTax(page, fixture.taxBefore.enabled, fixture.taxBefore.rate);
    const header = page.getByLabel('Invoice Header', { exact: true });
    const footer = page.getByLabel('Invoice Footer', { exact: true });
    if (await header.inputValue() !== fixture.brandingBefore.header || await footer.inputValue() !== fixture.brandingBefore.footer) {
      await header.fill(fixture.brandingBefore.header);
      await footer.fill(fixture.brandingBefore.footer);
      await page.getByRole('button', { name: 'Save Settings', exact: true }).click();
      await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/saved|updated/i);
    }
    expect(await companyTax(page)).toEqual(fixture.taxBefore);
    await expect(page.getByLabel('Invoice Header', { exact: true })).toHaveValue(fixture.brandingBefore.header);
    await expect(page.getByLabel('Invoice Footer', { exact: true })).toHaveValue(fixture.brandingBefore.footer);
    const proof = cleanup.info().outputPath('restored-invoice-settings.png');
    await page.getByRole('heading', { name: 'Invoice Customisation', exact: true }).locator('..').screenshot({ path: proof });
    await cleanup.info().attach('restored-invoice-settings', { path: proof, contentType: 'image/png' });
  }
});
