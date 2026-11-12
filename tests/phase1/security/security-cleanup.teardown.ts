import { readFileSync } from 'node:fs';
import { test as cleanup, expect } from 'playwright/test';
import { journalPath, openLogin } from './support/security';

cleanup('verify unattended run did not attempt credential or policy changes', async ({ page }, info) => {
  const data = JSON.parse(readFileSync(journalPath, 'utf8'));
  const blocked = data.events.filter((entry: any) => entry.type === 'blocked-write' && entry.category !== 'external-telemetry' && entry.category !== 'prevented-preference-sync');
  await info.attach('security-run-journal-no-credentials', { body: JSON.stringify(data, null, 2), contentType: 'application/json' });
  expect(blocked, 'Unexpected state-changing requests are safety/automation findings, not proof of an app defect').toEqual([]);
  await openLogin(page);
  await page.getByLabel('Email Address', { exact: true }).fill('');
  await page.getByLabel('Password', { exact: true }).fill('');
  const path = info.outputPath('security-public-login-proof.png');
  await page.screenshot({ path, fullPage: true });
  await info.attach('public-login-proof-no-credentials', { path, contentType: 'image/png' });
});
