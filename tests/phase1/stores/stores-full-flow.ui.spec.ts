import {
  test, expect, findOrCreateStore, openEditStore, saveEditedStore,
  storeCard, viewStoreInventory,
} from './support/stores';

test.describe('Stores & Branches — Full Store Flow', () => {
  test('creates, edits and inspects branch inventory @phase1 @stores @full-flow', async ({ page }) => {
    test.setTimeout(120_000);
    const store = await findOrCreateStore(page, 'flow', { fallbackAtCapacity: true });

    const editedName = `${store.name.replace(/(?: Updated| Final)+$/, '')} Final`;
    const dialog = await openEditStore(page, store.code);
    await dialog.getByLabel('Store Name *', { exact: true }).fill(editedName);
    await dialog.getByLabel('Phone Number', { exact: true }).fill('57654321');
    await saveEditedStore(page);
    await expect(storeCard(page, store.code)).toContainText(editedName);

    const inventory = await viewStoreInventory(page, store.code, editedName);
    await expect(inventory.getByRole('table')).toBeVisible();
    await inventory.getByRole('button', { name: 'Close', exact: true }).click();
  });
});
