import { test, expect, isolated, openTab, save, route, decimalToggle, setProfile, profileState } from './support/settings';

test('release company website saves and optional Tax ID can be cleared', async ({ page }, info) => {
  await isolated(page, info, async () => {
    await setProfile(page, { Website: 'https://qa.example.invalid', 'Tax ID / EIN': 'QA-TAX-CLEAR' });
    expect((await profileState(page)).Website).toBe('https://qa.example.invalid');
    await setProfile(page, { 'Tax ID / EIN': '' });
    expect((await profileState(page))['Tax ID / EIN']).toBe('');
  });
});

test('release decimal display off and on persists and changes POS amount formatting', async ({ page }, info) => {
  await isolated(page, info, async () => {
    let panel = await openTab(page, 'company', true);
    const before = await decimalToggle(panel).isChecked();
    try {
      for (const enabled of [false, true]) {
        panel = await openTab(page, 'company', true);
        await decimalToggle(panel).setChecked(enabled);
        await save(page, 'profile', panel.getByRole('button', { name: 'Save Changes', exact: true }));
        await expect(decimalToggle(await openTab(page, 'company', true))).toBeChecked({ checked: enabled });
        await route(page, '/pos');
        const total = page.getByRole('complementary').getByText('Total', { exact: true }).locator('..');
        if (enabled) await expect(total).toContainText(/Rs\s*0\.00(?:\s|$)/);
        else { await expect(total).toContainText(/Rs\s*0(?:\s|$)/); await expect(total).not.toContainText('0.00'); }
      }
    } finally {
      panel = await openTab(page, 'company', true);
      await decimalToggle(panel).setChecked(before);
      await save(page, 'profile', panel.getByRole('button', { name: 'Save Changes', exact: true }));
    }
  });
});

test('release company inclusive VAT preference persists independently of registration', async ({ page }, info) => {
  await isolated(page, info, async () => {
    let panel = await openTab(page, 'company', true);
    const toggle = panel.getByRole('switch', { name: 'Prices include VAT', exact: true });
    const before = await toggle.isChecked();
    try {
      await toggle.setChecked(!before);
      await save(page, 'tax', panel.getByRole('button', { name: 'Save Settings', exact: true }));
      panel = await openTab(page, 'company', true);
      await expect(panel.getByRole('switch', { name: 'Prices include VAT', exact: true })).toBeChecked({ checked: !before });
    } finally {
      panel = await openTab(page, 'company', true);
      await panel.getByRole('switch', { name: 'Prices include VAT', exact: true }).setChecked(before);
      await save(page, 'tax', panel.getByRole('button', { name: 'Save Settings', exact: true }));
    }
  });
});
