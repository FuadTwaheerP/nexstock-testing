import { test as cleanup, expect } from 'playwright/test';
import { fixtureData, stock, adjust } from './support/pos';

cleanup('restore QA stock after POS tests', async ({ page }) => {
  cleanup.setTimeout(90_000);
  const fixture = fixtureData();
  if((fixture as any).prepared===false)return;
  for (const [branch, baseline] of [[fixture.branch, fixture.initial], [fixture.otherBranch, fixture.otherInitial]] as const) {
    const current = await stock(page, fixture.sku, branch);
    if (current !== baseline) await adjust(page, { ...fixture, branch }, baseline - current, `QA POS cleanup ${Date.now()}`);
    expect(await stock(page, fixture.sku, branch)).toBe(baseline);
  }
});
