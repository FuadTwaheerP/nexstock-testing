import { test, publicLegal, inAppLegal } from './support/help';
test('F30-a public Terms opens without submitting login @phase1 @help', async ({ browser }, info) => {
  await publicLegal(browser, 'terms', info);
});
test('F30-a Terms supports mobile keyboard access and document focus return @phase1 @help', async ({ browser }, info) => {
  await publicLegal(browser, 'terms', info, true);
});
test('F30-a platform Terms is accessible from authenticated Help Center @phase1 @help', async ({ page }, info) => {
  await inAppLegal(page, 'terms', info);
});
