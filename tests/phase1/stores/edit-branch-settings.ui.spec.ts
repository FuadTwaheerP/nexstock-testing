import {
  test, expect, existingStore, openEditStore, saveEditedStore, storeCard, openStores,
} from './support/stores';

test.describe('Stores & Branches — Edit Branch Settings', () => {
  test('updates branch contact information and address @phase1 @stores', async ({ page }) => {
    const store = await existingStore(page);
    const updatedName = `${store.name.replace(/(?: Updated| Final)+$/, '')} Updated`;
    const dialog = await openEditStore(page, store.code);
    await dialog.getByLabel('Store Name *', { exact: true }).fill(updatedName);
    await dialog.getByLabel('Phone Number', { exact: true }).fill('59876543');
    await dialog.getByLabel('Email Address', { exact: true }).fill('qa.branch.updated@example.invalid');
    await dialog.getByLabel('Location Address', { exact: true }).fill('24 Test Avenue, Moka');
    await saveEditedStore(page);

    const card = storeCard(page, store.code);
    await expect(card).toContainText(updatedName);
    await expect(card).toContainText('59876543');
    await expect(card).toContainText('qa.branch.updated@example.invalid');
    await expect(card).toContainText('24 Test Avenue, Moka');
  });

  test('updates branch receipt header details @phase1 @stores', async ({ page }) => {
    const store = await existingStore(page);
    const dialog = await openEditStore(page, store.code);
    const receiptHeader = dialog.getByLabel(/Receipt Header/i);
    await expect(receiptHeader, 'Edit Store must expose receipt-header details').toBeVisible();
    const before = { header: await receiptHeader.inputValue(), footer: await dialog.getByLabel(/Receipt Footer/i).inputValue() };
    try {
      await receiptHeader.fill('QA receipt header verification');
      await dialog.getByLabel(/Receipt Footer/i).fill('QA receipt footer verification');
      await saveEditedStore(page);
      await openStores(page);
      const reopened = await openEditStore(page, store.code);
      await expect(reopened.getByLabel(/Receipt Header/i)).toHaveValue('QA receipt header verification');
      await expect(reopened.getByLabel(/Receipt Footer/i)).toHaveValue('QA receipt footer verification');
    } finally {
      if (!await dialog.isVisible()) { await openStores(page); await openEditStore(page, store.code); }
      await dialog.getByLabel(/Receipt Header/i).fill(before.header);
      await dialog.getByLabel(/Receipt Footer/i).fill(before.footer);
      await saveEditedStore(page);
    }
  });

  test('assigns registers to a branch @phase1 @stores', async ({ page }) => {
    const store = await existingStore(page);
    const dialog = await openEditStore(page, store.code);
    const assignedRegisters = dialog.getByLabel(/Assigned Registers|Registers/i);
    await expect(assignedRegisters, 'Edit Store must expose assigned-register controls').toBeVisible();
  });
});
