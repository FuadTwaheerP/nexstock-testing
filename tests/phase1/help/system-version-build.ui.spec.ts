import { test, expect, anonymous, buildMetadata, screenshot } from './support/help';
test('F30-c public login displays NexStock copyright and year @phase1 @help', async ({ browser }, info) => {
  await anonymous(browser, info, async page => {
    await expect(page.getByText(/©\s*\d{4}\s+NexStock\. All rights reserved\./)).toBeVisible();
    await screenshot(page, info, 'public-copyright');
  });
});
test('F30-c active platform version and commit are visible @phase1 @help', async ({ page }, info) => {
  await buildMetadata(page, info);
});
