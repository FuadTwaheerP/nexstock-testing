import { test, expect, signIn, readSecurityPolicy, verifyIdle, openProfile } from './support/security';

test('@phase1 F24-c read inactivity policy without changing security settings', async ({ page }) => {
  await signIn(page);
  const policy = await readSecurityPolicy(page);
  expect(policy.minimumLength).toBeGreaterThan(0);
  expect(policy.companyTimeoutMinutes).toBeGreaterThan(0);
  expect(policy.minimumLength).toBe(8);
  expect(policy.requireUppercase).toBe(true);
  expect(policy.requireNumbers).toBe(true);
  expect(policy.requireSymbols).toBe(false);
});
test('@phase1 F24-c obsolete Auto-logout control is removed', async ({ page }) => {
  await signIn(page);
  const policy = await readSecurityPolicy(page);
  expect(policy.autoLogoutPresent, 'Confirmed requirement: remove Auto-logout; inactivity uses PIN lock').toBe(false);
});

test('@phase1 F24-c user security settings expose configurable inactivity PIN lock', async ({ page }) => {
  await signIn(page);
  const panel = await openProfile(page, true);
  await expect(panel.getByText(/inactivity|idle timeout|session timeout/i).first(), 'User settings must expose configurable inactivity; current user Security has password/2FA/demo sessions only').toBeVisible();
  const setting = panel.getByRole('spinbutton').or(panel.getByRole('combobox')).first();
  await expect(setting).toBeVisible();
  await expect(setting).toBeEnabled();
});

test('@phase1 F24-c user-provisioned PIN lock after 30 minutes with activity calibration and reload', async ({ browser }, info) => {
  await verifyIdle(browser, info);
});
