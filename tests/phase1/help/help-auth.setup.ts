import { writeFileSync } from 'node:fs';
import { test as setup } from 'playwright/test';
import { validateSecurityTarget } from '../../../helpers/security-safety.mjs';
import { authPath, journalPath, company, required, guard, signIn, delivery } from './support/help';
setup('authenticate Help suite and select disposable QA company', async ({ page, context }, info) => {
  setup.setTimeout(120_000); validateSecurityTarget(required('BASE_URL'));
  writeFileSync(journalPath, JSON.stringify({ company: company(), events: [], constraints: ['read-only business data', 'routine own-session login/logout only', 'no legal acceptance, policy edits, support messages, exports or transactions', 'Phase 3 excluded'], delivery, deferred: delivery.notCertified }, null, 2));
  await guard(context, info); await signIn(page); await context.storageState({ path: authPath });
});
