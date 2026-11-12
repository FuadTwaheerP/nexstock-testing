import { test as cleanup, expect } from 'playwright/test';
import { journal, cleanupSupplier, supplierRow } from './support/suppliers';

cleanup('verify newly created QA suppliers are retained inactive', async ({ page }, info) => {
  const entries = journal().entries;
  cleanup.setTimeout(Math.max(60_000, entries.length * 15_000));
  for (const entry of entries) await cleanupSupplier(page, entry.supplier, entry.saved);
  const lastSaved = entries.filter(entry => entry.saved).at(-1);
  if (lastSaved) {
    await cleanupSupplier(page, lastSaved.supplier, true);
    await expect(supplierRow(page, lastSaved.supplier).getByRole('cell', { name: 'Inactive', exact: true })).toBeVisible();
    const proof = info.outputPath('retained-inactive-supplier.png');
    await supplierRow(page, lastSaved.supplier).screenshot({ path: proof });
    await info.attach('supplier-cleanup-proof', { path: proof, contentType: 'image/png' });
  }
  await info.attach('supplier-fixture-journal', { body: JSON.stringify(entries, null, 2), contentType: 'application/json' });
});
