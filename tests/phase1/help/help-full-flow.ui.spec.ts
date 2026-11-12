import { test, expect, anonymous, openHelp, inAppLegal, openDocument, buildMetadata, screenshot } from './support/help';
test('Help Center is reachable from app navigation without altering the QA company @phase1 @help', async ({ page }, info) => {
  await openHelp(page);
  await page.getByRole('button', { name: 'Products', exact: true }).click();
  await expect(page.getByRole('main').getByRole('heading', { name: 'Products', exact: true })).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Help Center', exact: true }).click();
  await expect(page.getByRole('main').getByRole('heading', { name: 'Help Center', exact: true })).toBeVisible();
  await screenshot(page, info, 'authenticated-help-center');
});
test('Help Center Legal and Compliance integrated flow @phase1 @help @full-flow', async ({ browser, page }, info) => {
  const failures: { step: string; error: string }[] = [];
  const attempt = async (label: string, run: () => Promise<unknown>) => {
    await test.step(label, async () => { try { await run(); } catch (error) { failures.push({ step: label, error: String(error) }); } });
  };
  // Independent steps continue after a failed capability, with a failing final
  // assertion and attached details. Nothing is marked skip or expected failure.
  for (const kind of ['terms', 'privacy'] as const) {
    await attempt(`Anonymous ${kind}`, () => anonymous(browser, info, async guest => { await openDocument(guest, kind, info); }, false, kind));
    await attempt(`Authenticated ${kind}`, () => inAppLegal(page, kind, info));
  }
  await attempt('Active platform build identity', () => buildMetadata(page, info));
  await openHelp(page); await screenshot(page, info, 'help-full-flow-final');
  await info.attach('full-flow-failed-steps', { body: JSON.stringify(failures, null, 2), contentType: 'application/json' });
  expect(failures, 'Integrated flow is incomplete: distinguish confirmed UI bugs from PREREQUISITE BLOCKED steps; neither is a full-flow pass').toEqual([]);
});
