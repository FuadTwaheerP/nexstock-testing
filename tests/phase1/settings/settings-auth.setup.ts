import { existsSync, writeFileSync } from 'node:fs';
import { test as setup } from 'playwright/test';
import { validateSecurityTarget } from '../../../helpers/security-safety.mjs';
import { required, company, baseline, baselinePath, saveBaseline, journalPath, authPath, guard, signIn, auditBaseline, adoptApprovedBrn, restore, profileState, taxState, localizationState, apiSnapshot, screenshot, migrateNewCompanyFields } from './support/settings';

setup('authenticate Settings suite select QA company and capture recoverable baseline', async ({ page, context }, info) => {
  setup.setTimeout(180_000); validateSecurityTarget(required('BASE_URL'));
  writeFileSync(journalPath, JSON.stringify({ company: company(), events: [], constraints: ['no credentials/security/privacy changes', 'no sales/payments', 'restore QA baseline', 'Phase 3 excluded'] }, null, 2));
  await guard(context, info); await signIn(page); await context.storageState({ path: authPath });
  if (existsSync(baselinePath)) {
    try {
      await migrateNewCompanyFields(page);
      if (baseline().pending && process.env.SETTINGS_ACCEPT_QA_BRN) await adoptApprovedBrn(page);
      else if (baseline().pending && baseline().brnAcceptance?.value === 'QA-BRN-2026') await restore(page);
      await auditBaseline(page);
      // Prior i18n runs may have restored the browser display but not the
      // separately saved company language. All other baseline fields have
      // just matched; compensate that test preference instead of adopting it.
      if ((await apiSnapshot(context))?.language !== baseline().api.language) {
        await restore(page);
        await auditBaseline(page);
      }
    }
    catch (error) { await screenshot(page, info, 'settings-pending-recovery-proof'); throw error; }
  }
  const profile = await profileState(page), tax = await taxState(page, false), localization = await localizationState(page, false);
  const language = (await page.locator('html').getAttribute('lang')) === 'fr' ? 'fr' : 'en';
  const dark = /\bdark\b/.test(await page.locator('html').getAttribute('class') || '');
  const api = await apiSnapshot(context);
  setup.expect(api, 'Settings GET baseline is required before transmitting bulk settings saves').toBeTruthy();
  const brnAcceptance = existsSync(baselinePath) ? baseline().brnAcceptance : undefined;
  const releaseFieldMigration = existsSync(baselinePath) ? baseline().releaseFieldMigration : undefined;
  saveBaseline({ origin: new URL(required('BASE_URL')).origin, company: company(), capturedAt: new Date().toISOString(), pending: false, profile, tax, localization, language, dark, api, brnAcceptance, releaseFieldMigration });
});
