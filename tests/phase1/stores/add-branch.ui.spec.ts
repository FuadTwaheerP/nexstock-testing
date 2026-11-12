import {
  test, expect, findOrCreateStore, openNewStore, storeCard, openEditStore, saveEditedStore, openStores,
} from './support/stores';

test.describe('Stores & Branches — Add Branch / Store / Warehouse', () => {
  test('creates a branch with code, type, address and contact details @phase1 @stores', async ({ page }) => {
    // A clean account creates this fixture; later runs reuse it so the test is
    // repeatable on plans capped at five branches.
    const store = await findOrCreateStore(page, 'add');

    const card = storeCard(page, store.code);
    await expect(card).toContainText(store.name);
    await expect(card).toContainText(store.address!);
    await expect(card).toContainText(store.phone!);
    await expect(card).toContainText(store.email!);
    await expect(card).toContainText('Active');
  });

  test('captures branch tax registration details @phase1 @stores', async ({ page }) => {
    const dialog = await openNewStore(page);
    await dialog.getByRole('switch', { name: "Use the company's tax registration", exact: true }).uncheck();
    await expect(dialog.getByLabel('BRN', { exact: true })).toBeVisible();
    await expect(dialog.getByLabel('VAT number', { exact: true })).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    // Existing QA branch avoids exceeding the five-branch licence cap.
    const store = await findOrCreateStore(page, 'receipt', { fallbackAtCapacity: true });
    let edit = await openEditStore(page, store.code);
    const inherited = await edit.getByRole('switch', { name: "Use the company's tax registration", exact: true }).isChecked();
    await edit.getByRole('switch', { name: "Use the company's tax registration", exact: true }).uncheck();
    const original = { brn: await edit.getByLabel('BRN', { exact: true }).inputValue(), vat: await edit.getByLabel('VAT number', { exact: true }).inputValue() };
    try {
      await edit.getByLabel('BRN', { exact: true }).fill('QA-BRN-BRANCH');
      await edit.getByLabel('VAT number', { exact: true }).fill('QA-VAT-BRANCH');
      await saveEditedStore(page);
      await openStores(page);
      edit = await openEditStore(page, store.code);
      await expect(edit.getByRole('switch', { name: "Use the company's tax registration", exact: true })).not.toBeChecked();
      await expect(edit.getByLabel('BRN', { exact: true })).toHaveValue('QA-BRN-BRANCH');
      await expect(edit.getByLabel('VAT number', { exact: true })).toHaveValue('QA-VAT-BRANCH');
    } finally {
      if (!await page.getByRole('dialog', { name: 'Edit Store Branch' }).isVisible()) { await openStores(page); edit = await openEditStore(page, store.code); }
      await edit.getByRole('switch', { name: "Use the company's tax registration", exact: true }).uncheck();
      await edit.getByLabel('BRN', { exact: true }).fill(original.brn);
      await edit.getByLabel('VAT number', { exact: true }).fill(original.vat);
      await edit.getByRole('switch', { name: "Use the company's tax registration", exact: true }).setChecked(inherited);
      await saveEditedStore(page);
    }
  });

  test('offers retail store, warehouse and workshop branch types @phase1 @stores', async ({ page }) => {
    const dialog = await openNewStore(page);
    const branchType = dialog.getByLabel('Branch Type *', { exact: true });

    for (const type of ['Retail Store', 'Warehouse', 'Workshop']) {
      await branchType.click();
      const option = page.getByRole('option', { name: type, exact: true });
      await expect(option).toBeVisible();
      await option.click();
      await expect(branchType).toContainText(type);
    }
  });
});
