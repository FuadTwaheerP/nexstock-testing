import { test, expect, isolated, language, openTab, route, reloadSettings, main, screenshot } from './support/settings';

test('F28-e switches English French and translates main navigation and settings @phase1 @settings', async ({ page }, info) => {
  await isolated(page, info, async () => {
    await language(page, 'fr');
    await expect(main(page).getByRole('heading', { name: 'Paramètres', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tableau de bord', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Produits', exact: true })).toBeVisible();
    await screenshot(page, info, 'french-settings'); await language(page, 'en');
    await expect(main(page).getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
  });
});
test('F28-e French persists on save reload and route navigation @phase1 @settings', async ({ page }, info) => {
  await isolated(page, info, async () => {
    await language(page, 'fr', true); await reloadSettings(page);
    await expect(main(page).getByRole('heading', { name: 'Paramètres', exact: true })).toBeVisible({ timeout: 30_000 });
    await route(page, '/products');
    await expect(main(page).getByRole('heading', { name: 'Produits', exact: true })).toBeVisible();
  });
});

test('F28-e French interface updates document language for assistive technology @phase1 @settings', async ({ page }, info) => {
  await isolated(page, info, async () => {
    await language(page, 'fr');
    await info.attach('document-language', { body: JSON.stringify({ expected: 'fr', actual: await page.locator('html').getAttribute('lang') }), contentType: 'application/json' });
    await expect(page.locator('html'), 'A French interface must expose French document language, not keep lang=en').toHaveAttribute('lang', 'fr');
  });
});
test('F28-e French company form labels contain translated text not raw keys @phase1 @settings', async ({ page }, info) => {
  await isolated(page, info, async () => {
    await language(page, 'fr');
    const panel = await openTab(page, 'company');
    await expect(panel.getByLabel("Nom de l'entreprise", { exact: true })).toBeVisible();
    // Browser-native required-field feedback is not treated as custom app translation.
    await expect(panel).not.toContainText(/(?:settings|common|company)\.[A-Za-z_]+/);
  });
});
