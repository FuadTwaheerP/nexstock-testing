import { existsSync, readFileSync } from 'node:fs';
import { test as cleanup, expect } from 'playwright/test';
import { guard, restore, auditBaseline, journalPath, language, screenshot, authPath, baselinePath, baseline, pending, openTab } from './support/settings';

cleanup('restore original QA settings verify journal and log out', async ({ browser }, info) => {
  cleanup.setTimeout(120_000);
  if (!existsSync(authPath) || !existsSync(baselinePath)) { await info.attach('setup-incomplete', { body: 'Setup ended before capturing a baseline; no settings changes were attempted.', contentType: 'text/plain' }); return; }
  const context = await browser.newContext({ storageState: authPath, viewport: null, serviceWorkers: 'block' });
  const page = await context.newPage();
  try {
  await guard(context, info);
  if (baseline().pending) await auditBaseline(page); else await restore(page);
  const journal = JSON.parse(readFileSync(journalPath, 'utf8'));
  await info.attach('settings-journal-no-auth', { body: JSON.stringify(journal, null, 2), contentType: 'application/json' });
  expect(journal.events.filter((entry: any) => entry.category === 'unexpected-application-write'), 'Blocked unexpected writes are automation adapter/safety failures, not application defects').toEqual([]);
  const originalLanguage = baseline().language;
  await language(page, originalLanguage); pending(false);
  await openTab(page, 'company');
  await page.locator('#business-registration-number').scrollIntoViewIfNeeded();
  await screenshot(page, info, 'settings-approved-baseline-proof');
  await page.getByRole('banner').getByRole('button').filter({ hasText: /Admin|Manager|Cashier/ }).last().click();
  await page.getByRole('menuitem', { name: /^(Log out|Se déconnecter|Déconnexion)$/ }).click();
  await expect(page.getByRole('heading', { name: /^(Welcome Back|Bon retour)$/ })).toBeVisible();
  await screenshot(page, info, 'settings-public-login-proof');
  } catch (error) {
    await screenshot(page, info, 'settings-recovery-blocked').catch(() => undefined);
    // End only this QA session even if the app prevents baseline restoration.
    try {
      await page.getByRole('banner').getByRole('button').filter({ hasText: /Admin|Manager|Cashier/ }).last().click();
      await page.getByRole('menuitem', { name: /^(Log out|Se déconnecter|Déconnexion)$/ }).click();
      await expect(page.getByRole('heading', { name: /^(Welcome Back|Bon retour)$/ })).toBeVisible();
      await screenshot(page, info, 'settings-public-login-after-blocker');
    } catch { /* preserve the original recovery failure */ }
    throw error;
  } finally { await context.close(); }
});
