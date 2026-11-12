import { test, expect, isolated, baseline, setTax, taxState, openTab } from './support/settings';
import { vat15 } from './support/flows';
test('F28-c enables and persists default VAT 15 percent and POS reflects the rate @phase1 @settings', async ({ page }, info) => {
  await isolated(page, info, () => vat15(page));
});
test('F28-c disabling tax registration persists without deleting legal identity @phase1 @settings', async ({ page }, info) => {
  await isolated(page, info, async () => {
    await setTax(page, { ...baseline().tax, enabled: false }); const state = await taxState(page);
    expect(state.enabled).toBe(false); expect(state.brn).toBe(baseline().tax.brn);
  });
});
test('F28-c system settings expose tax inclusive exclusive pricing mode @phase1 @settings', async ({ page }) => {
  const panel = await openTab(page, 'company');
  const mode = panel.getByRole('switch', { name: 'Prices include VAT', exact: true });
  await expect(mode, 'F28-c requires tax-inclusive/exclusive pricing toggle; Tax Registered is a different setting').toBeVisible();
});
