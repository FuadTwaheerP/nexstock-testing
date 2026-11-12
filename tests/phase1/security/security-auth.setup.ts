import { writeFileSync } from 'node:fs';
import { test as setup } from 'playwright/test';
import { validateSecurityTarget } from '../../../helpers/security-safety.mjs';
import { required, companyName, journalPath } from './support/security';

setup('validate disposable security scope without rotating credentials', async () => {
  validateSecurityTarget(required('BASE_URL'));
  required('PRODUCT_TEST_EMAIL'); required('PRODUCT_TEST_PASSWORD');
  writeFileSync(journalPath, JSON.stringify({ company: companyName(), events: [], constraints: ['no account creation', 'no unattended reset email', 'no agent credential rotation; a separately gated human handoff may change only its isolated account', 'no policy changes', 'no Phase 3 revocation or 2FA changes'] }, null, 2));
});
