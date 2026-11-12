import { test, expect, openTab, route, isolated, save, decimalToggle } from './support/settings';

test('F28-b MUR currency agrees between company and localization and persists @phase1 @settings', async ({ page }, info) => {
  await isolated(page, info, async () => {
    const company = await openTab(page, 'company'); await expect(company.locator('#default-currency')).toContainText('MUR (Rs)');
    const loc = await openTab(page, 'localization'); await expect(loc.locator('#loc-currency')).toContainText('MUR (Rs)');
    await save(page, 'localization', loc.getByRole('button', { name: 'Save Settings', exact: true }));
    await expect((await openTab(page, 'localization')).locator('#loc-currency')).toContainText('MUR (Rs)');
  });
});
test('F28-b QA two-decimal POS display places Rs before the amount @phase1 @settings', async ({ page }) => {
  await route(page, '/pos'); const cart = page.getByRole('complementary'); await expect(cart.getByText('Your order is empty', { exact: true })).toBeVisible();
  // Rs and the amount are separate spans; textContent may concatenate them.
  // The requirement fixes prefix order, not a mandatory whitespace character.
  for (const label of ['Subtotal', 'Total']) await expect(cart.getByText(label, { exact: true }).locator('..')).toContainText(/Rs\s*0\.00(?:\s|$)/);
});
test('F28-b Company settings exposes decimal display enable disable control @phase1 @settings', async ({ page }) => {
  const company = await openTab(page, 'company');
  await expect(decimalToggle(company), 'F28-b: user confirmed Company settings must allow decimals on/off; enabled precision is fixed at 2dp').toBeVisible();
  // Do not demand a symbol-position selector, precision dropdown or separator
  // setting: none is required. Existing QA state cannot prove a new-company
  // default. Toggle/save/reload and Rs 0 versus Rs 0.00 need a verified control
  // adapter and captured baseline after the BRN recovery blocker is resolved.
});
