import { existsSync, readFileSync } from 'node:fs';
import { test as cleanup, expect } from 'playwright/test';
import { journalPath, fixturePath, fixtureData, receiptState, guard, logout, route, main } from './support/hardware';

cleanup('verify unchanged configuration and stock no application writes then log out', async ({ page, context }, info) => {
  cleanup.setTimeout(90_000);
  await guard(context, info);
  const setupJournal=JSON.parse(readFileSync(journalPath,'utf8'));
  if (setupJournal.setupComplete && existsSync(fixturePath)) {
    const data = fixtureData();
    expect(await receiptState(page), 'Read-only suite must preserve saved receipt configuration').toEqual(data.receipt);
    if (data.scanner) {
      await route(page, '/products');
      await main(page).getByPlaceholder('Search...', { exact: true }).fill(data.scanner.sku);
      const row = main(page).getByRole('row').filter({ has: page.getByRole('cell', { name: data.scanner.sku, exact: true }) });
      // Capture and compare the same DOM text representation. textContent
      // concatenates the quantity/status; innerText separates them by a newline.
      const stockIndex=(await main(page).getByRole('columnheader').allTextContents()).indexOf('Stock');expect(stockIndex).toBeGreaterThanOrEqual(0);
      await expect.poll(async () => (await row.getByRole('cell').nth(stockIndex).innerText()).replace(/\s+/g, ' ').trim(),
        { message: 'Read-only cart/scanner checks must not change catalog stock' }).toBe(data.scanner.stock.replace(/\s+/g, ' ').trim());
    }
  }
  const journal = JSON.parse(readFileSync(journalPath, 'utf8'));
  expect(journal.events.filter((event: any) => event.category === 'unexpected-application-write'), 'Unexpected business writes are automation/safety errors, not app defects').toEqual([]);
  await info.attach('hardware-run-journal-no-auth', { body: JSON.stringify(journal, null, 2), contentType: 'application/json' });
  await logout(page);
  const path = info.outputPath('hardware-public-login-proof.png');
  await page.screenshot({ path, fullPage: true });
  await info.attach('hardware-cleanup-public-login', { path, contentType: 'image/png' });
});
