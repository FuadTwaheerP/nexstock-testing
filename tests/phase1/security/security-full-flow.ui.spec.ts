import { test, expect, signIn, expectProtected, openProfile, openSignup, readSecurityPolicy, verifyIdle, manualPasswordHandoff, logout, expectAnonymous, required } from './support/security';

test('@phase1 @full-flow Security authentication account recovery inactivity and logout lifecycle', async ({ page, browser }, info) => {
  await test.step('F24-a authenticate choose QA company refresh and deep link', async () => {
    await signIn(page); await expectProtected(page); await page.reload(); await expectProtected(page, '/customers');
  });
  await test.step('F24-b inspect the authenticated self-service account', async () => {
    const panel = await openProfile(page);
    await expect.soft(panel.getByText('Email Address', { exact: true }).locator('..').getByRole('textbox')).toHaveValue(required('PRODUCT_TEST_EMAIL'));
    const security = await openProfile(page, true);
    for (const id of ['currentPassword', 'newPassword', 'confirmPassword']) await expect(security.locator(`#${id}`)).toHaveAttribute('type', 'password');
    await expect.soft(security.getByText(/inactivity|idle timeout|session timeout/i).first(), 'Confirmed user-configurable inactivity requirement').toBeVisible();
  });
  await test.step('F24-c read actual policy without saving changes', async () => {
    const policy = await readSecurityPolicy(page);
    expect.soft(policy.autoLogoutPresent, 'Remove Auto-logout; inactivity must use PIN lock').toBe(false);
  });
  await test.step('F24-a logout clears protected access before other session checks', async () => { await logout(page); await expectAnonymous(page); });
  await test.step('F24-a confirmed signup guidance without account creation', async () => {
    await openSignup(page);
    await page.getByLabel('Password', { exact: true }).fill('Aa1abcd!');
    try {
      await expect.soft(page.getByText('Lowercase letter', { exact: true })).toBeVisible();
      await expect.soft(page.getByText(/(?:special character|symbol).*optional|optional.*(?:symbol|special character)/i)).toBeVisible();
      await expect.soft(page.getByRole('progressbar').or(page.getByRole('meter')).first()).toBeVisible();
    } finally { await page.getByLabel('Password', { exact: true }).fill(''); }
  });
  await test.step('F24-b human-only reset/update on separate disposable account', async () => {
    try { await manualPasswordHandoff(browser, info); }
    catch (error) { expect.soft(false, String(error)).toBe(true); }
  });
  await test.step('F24-c 30-minute PIN lock with active calibration and user-provisioned PIN', async () => {
    try { await verifyIdle(browser, info); }
    catch (error) { expect.soft(false, String(error)).toBe(true); }
  });
});
