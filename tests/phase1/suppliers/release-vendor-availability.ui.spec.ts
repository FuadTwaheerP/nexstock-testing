import { test, expect, createSupplier, setStatus, openSupplierPicker, uniqueSupplier } from './support/suppliers';

test('release purchase-order vendor picker excludes inactive supplier with an active positive control', async ({ page, supplier }) => {
  supplier.name = `QA SUP 000 release inactive ${supplier.token}`;
  await createSupplier(page, supplier);
  const active = uniqueSupplier('000 release active control');
  await createSupplier(page, active);
  await setStatus(page, supplier, 'Inactive');
  const picker = await openSupplierPicker(page);
  await expect(picker.getByRole('button').filter({ hasText: active.name })).toBeVisible();
  await expect(picker.getByRole('button').filter({ hasText: supplier.name })).toHaveCount(0);
  // Do not submit a purchase order. Both QA vendors are retained inactive by
  // the journal-based suite cleanup, preserving their identities.
});
