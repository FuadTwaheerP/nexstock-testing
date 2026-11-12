import { readFileSync, writeFileSync } from 'node:fs';
import { test as setup } from 'playwright/test';
import { validateSecurityTarget } from '../../../helpers/security-safety.mjs';
import { required, companyName, signIn, guard, journalPath, fixturePath, authPath, receiptState, discoverScanner } from './support/hardware';

setup('authenticate Hardware suite and discover existing read-only QA fixtures', async ({ page, context }, info) => {
  setup.setTimeout(120_000);
  validateSecurityTarget(required('BASE_URL'));
  writeFileSync(journalPath, JSON.stringify({ setupComplete:false, company: companyName(), events: [], constraints: ['no sales/payments/refunds', 'no stock or product changes', 'no setting saves', 'no physical output', 'Phase 3 excluded'] }, null, 2));
  await guard(context, info);
  await signIn(page);
  await context.storageState({ path: authPath });
  const receipt = await receiptState(page);
  const scanner = await discoverScanner(page);
  writeFileSync(fixturePath, JSON.stringify({ company: companyName(), receipt, ...scanner }, null, 2));
  const journal=JSON.parse(readFileSync(journalPath,'utf8'));journal.setupComplete=true;writeFileSync(journalPath,JSON.stringify(journal,null,2));
  await info.attach('hardware-fixture-no-auth', { body: JSON.stringify({ company: companyName(), receipt, ...scanner }, null, 2), contentType: 'application/json' });
});
