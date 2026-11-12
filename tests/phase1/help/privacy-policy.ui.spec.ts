import { test, publicLegal, inAppLegal } from './support/help';
test('F30-b public Privacy opens without submitting login @phase1 @help', async ({ browser }, info) => {
  await publicLegal(browser, 'privacy', info);
});
test('F30-b Privacy supports mobile keyboard access and document focus return @phase1 @help', async ({ browser }, info) => {
  await publicLegal(browser, 'privacy', info, true);
});
test('F30-b platform Privacy is accessible from authenticated Help Center @phase1 @help', async ({ page }, info) => {
  await inAppLegal(page, 'privacy', info);
});
