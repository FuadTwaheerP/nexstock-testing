import { test, expect, isolated, route, reloadSettings, theme, appearance, main, openTab } from './support/settings';

for (const dark of [false, true]) test(`F28-d ${dark ? 'dark' : 'light'} theme persists through reload and leaves forms usable @phase1 @settings`, async ({ page }, info) => {
  await isolated(page, info, async () => {
    // Always perform an explicit transition to the requested mode. A browser's
    // initial class can match before the account preference has hydrated.
    await route(page); await theme(page, !dark); await theme(page, dark); await reloadSettings(page);
    if (dark) await expect(page.locator('html')).toHaveClass(/\bdark\b/); else await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
    const input = main(page).locator('#company-name'); await expect(input).toBeVisible(); await input.focus(); await expect(input).toBeFocused();
    await expect(main(page).getByRole('button', { name: 'Save Changes', exact: true })).toBeEnabled();
    await route(page, '/products'); await expect(main(page).getByRole('table')).toBeVisible();
  });
});
test('F28-d exposes System Default appearance alongside light and dark @phase1 @settings', async ({ page }, info) => {
  await isolated(page, info, async () => {
    await route(page); await appearance(page, 'system');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await reloadSettings(page);
    await expect(page.locator('html')).toHaveClass(/\bdark\b/);
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);
  });
});
