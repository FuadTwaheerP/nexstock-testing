import { existsSync, readFileSync } from 'node:fs';
import { test as cleanup, expect } from 'playwright/test';
import { authPath, journalPath, guard, logout, screenshot } from './support/help';
cleanup('verify read-only Help journal and end QA session', async ({ browser }, info) => {
  cleanup.setTimeout(90_000);
  if (!existsSync(authPath)) throw new Error('SETUP BLOCKER: no Help auth state was captured; no business mutation was permitted');
  const context = await browser.newContext({ storageState: authPath, serviceWorkers: 'block', viewport: null });
  try {
    await guard(context, info); const page = await context.newPage();
    // Log out even if the journal reveals an adapter problem.
    try {
      const journal = JSON.parse(readFileSync(journalPath, 'utf8'));
      await info.attach('help-safe-request-journal', { body: JSON.stringify(journal, null, 2), contentType: 'application/json' });
      expect(journal.events.filter((e: any) => e.category === 'unexpected-application-write'), 'Unexpected writes are automation/safety failures, not application tickets').toEqual([]);
    } finally {
      await logout(page); await screenshot(page, info, 'help-public-login-proof');
    }
  } finally { await context.close(); }
});
