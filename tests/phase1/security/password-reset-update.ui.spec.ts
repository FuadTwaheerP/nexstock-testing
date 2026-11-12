import { test, expect, openForgot, notice, signIn, openProfile, manualPasswordHandoff, isApplicationPost, route, main } from './support/security';

test('@phase1 release SEC-004 removes unenforced company security controls', async ({ page }) => {
  await signIn(page);
  await route(page, '/settings');
  await main(page).getByRole('tab', { name: 'Security', exact: true }).click();
  const panel = main(page).getByRole('tabpanel');
  await expect(panel.getByRole('heading', { name: 'Password Requirements', exact: true })).toBeVisible();
  for (const label of ['Auto-logout', 'Session Timeout (Minutes)', 'Minimum Password Length', 'Password Expiry (Days)', 'Maximum Concurrent Sessions', 'Require Symbols']) {
    await expect(panel.getByText(label, { exact: true })).toHaveCount(0);
  }
  for (const label of ['At least 8 characters', 'Lowercase letter', 'Uppercase letter', 'Number']) await expect(panel.getByText(label, { exact: true })).toBeVisible();
});

test('@phase1 F24-b self-service reset form and return to login are accessible', async ({ page }) => {
  await openForgot(page);
  await expect(page.getByLabel('Email Address', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send Reset Code', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Back to Sign In', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Welcome Back', exact: true })).toBeVisible();
});
test('@phase1 F24-b empty and malformed reset emails are rejected without dispatch', async ({ page }) => {
  await openForgot(page);
  const writes: string[] = [];
  page.on('request', request => { if (isApplicationPost(request)) writes.push(new URL(request.url()).pathname); });
  await page.getByRole('button', { name: 'Send Reset Code', exact: true }).click();
  await expect.poll(async () => {
    return await page.getByLabel('Email Address', { exact: true }).evaluate((el: HTMLInputElement) => !el.validity.valid)
      || /email|required/i.test(await notice(page).innerText()) || await page.getByText(/email.*required/i).count() > 0;
  }).toBe(true);
  await page.getByLabel('Email Address', { exact: true }).fill('not-an-email');
  await page.getByRole('button', { name: 'Send Reset Code', exact: true }).click();
  expect(await page.getByLabel('Email Address', { exact: true }).evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
  expect(writes, 'Invalid reset email must be rejected before any delivery request').toEqual([]);
});
test('@phase1 F24-b password update controls are masked and remain untouched', async ({ page }) => {
  await signIn(page);
  const panel = await openProfile(page, true);
  await panel.getByRole('button', { name: 'Change', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Change Password', exact: true });
  for (const label of ['Current Password', 'New Password', 'Confirm New Password']) {
    await expect(dialog.getByLabel(label, { exact: true })).toHaveAttribute('type', 'password');
    await expect(dialog.getByLabel(label, { exact: true })).toHaveValue('');
  }
  await expect(dialog.getByRole('button', { name: 'Update Password', exact: true })).toBeVisible();
  await expect(dialog.getByRole('meter', { name: 'Password strength', exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  // Never enter, submit, capture or restore a new password here.
});
test('@phase1 F24-b self-service security profile belongs to the signed-in account', async ({ page }) => {
  await signIn(page);
  const panel = await openProfile(page);
  const email = panel.getByText('Email Address', { exact: true }).locator('..').getByRole('textbox');
  await expect(email, 'Self-service security must show the authenticated account, not a demo identity').toHaveValue(process.env.PRODUCT_TEST_EMAIL!.trim());
});
test('@phase1 F24-b reset completion and update require isolated-account human handoff', async ({ browser }, info) => {
  await manualPasswordHandoff(browser, info);
});
