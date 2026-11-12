import { test, expect, isolated, baseline, setProfile, profileState, setTax, taxState } from './support/settings';
import { separateTaxAndVatFields } from './support/flows';

test('F28-a saves company name contact and registered address then restores @phase1 @settings', async ({ page }, info) => {
  await isolated(page, info, async () => {
    const values = { ...baseline().profile, 'Company Name': `${baseline().company} Settings QA`, 'Phone Number': '+23051234567', 'Business Address': 'QA Settings Registered Office', 'City': 'QA Ebene', 'ZIP / Postal Code': '72202' };
    await setProfile(page, values); expect(await profileState(page)).toEqual(values);
  });
});
test('F28-a saves company email after reload @phase1 @settings', async ({ page }, info) => {
  await isolated(page, info, async () => {
    await setProfile(page, { 'Company Email': 'qa-settings@example.com' });
    expect((await profileState(page))['Company Email']).toBe('qa-settings@example.com');
  });
});
test('F28-a saves independent BRN and Tax ID fields without changing tax registration @phase1 @settings', async ({ page }, info) => {
  await isolated(page, info, async () => {
    await setProfile(page, { 'Tax ID / EIN': 'QA-TAX-2026' });
    await setTax(page, { ...baseline().tax, brn: 'QA-BRN-2026' });
    expect.soft((await profileState(page))['Tax ID / EIN']).toBe('QA-TAX-2026'); expect((await taxState(page)).brn).toBe('QA-BRN-2026');
    await setTax(page, { ...baseline().tax, brn: '' });
    expect((await taxState(page)).brn, 'Optional BRN must support clearing after save and reload; approving a QA baseline must not hide SET-002').toBe('');
  });
});
test('F28-a exposes separate Tax ID and VAT number for a registered company @phase1 @settings', async ({ page }, info) => {
  await isolated(page, info, async () => {
    // A VAT field may legitimately be conditional on registration. Do not
    // ticket absence while the company is not registered without checking it.
    await setTax(page, { ...baseline().tax, enabled: true, rate: '15' });
    await separateTaxAndVatFields(page);
  });
});
