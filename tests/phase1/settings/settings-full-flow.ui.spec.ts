import { test, expect, isolated, setProfile, profileState, language, theme, openTab, screenshot, decimalToggle } from './support/settings';
import { vat15, separateTaxAndVatFields } from './support/flows';

test('System Settings and Localization integrated flow @phase1 @settings @full-flow', async ({ page }, info) => {
  await isolated(page, info, async () => {
    await test.step('Company profile save and reload', async () => { await setProfile(page, { 'Business Address': 'QA Integrated Settings Office' }); expect((await profileState(page))['Business Address']).toBe('QA Integrated Settings Office'); });
    await test.step('Currency MUR', async () => { await expect((await openTab(page, 'localization')).locator('#loc-currency')).toContainText('MUR (Rs)'); });
    await test.step('Fiscal default VAT 15 percent', () => vat15(page));
    await test.step('Light and dark themes', async () => { await openTab(page, 'company'); await theme(page, false); await theme(page, true); });
    await test.step('French and English language switching', async () => { await language(page, 'fr', true); await screenshot(page, info, 'integrated-french'); await language(page, 'en', true); });
    await test.step('Required missing-capability gates', async () => {
      const company = await openTab(page, 'company');
      await expect.soft(company.getByRole('switch', { name: 'Prices include VAT', exact: true }), 'Tax pricing mode').toBeVisible();
      await expect.soft(decimalToggle(company), 'Company decimal display on/off; fixed 2dp when enabled').toBeVisible();
      await theme(page, false);
      await separateTaxAndVatFields(page);
    });
  });
});
