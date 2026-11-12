import { readFileSync } from 'node:fs';
import { test, expect, required, signIn, openLogin, expectProtected, expectAnonymous, logout, companyButton, openSignup, checklist, notice, isApplicationPost } from './support/security';
import { appPath } from '../../../helpers/safety.mjs';

test('@phase1 F24-a valid sign-in selects QA company survives refresh and protected deep link', async ({ page }) => {
  await signIn(page);
  await expectProtected(page);
  await page.reload();
  await expect(companyButton(page)).toBeVisible();
  await expectProtected(page, '/customers');
});
test('@phase1 F24-a anonymous protected UI and API are denied', async ({ page, browser }, info) => {
  await expectAnonymous(page);
  // Positive control: the very same API exists and serves an authenticated UI.
  await signIn(page);
  const api = new URL(appPath('/api/v1/customers', required('BASE_URL')));
  const loaded = page.waitForResponse(response => response.request().method() === 'GET' && new URL(response.url()).pathname === api.pathname);
  await expectProtected(page, '/customers');
  const positive = await loaded;
  expect(positive.ok()).toBe(true);
  expect(positive.headers()['content-type']).toContain('application/json');
  const guest = await browser.newContext({ serviceWorkers: 'block' });
  try {
    const response = await guest.request.get(positive.url(), { maxRedirects: 0 });
    const status = response.status();
    const location = response.headers().location;
    const loginRedirect = [302, 303, 307, 308].includes(status) && !!location && new URL(location, api).origin === api.origin && /\/login\/?$/.test(new URL(location, api).pathname);
    await info.attach('anonymous-api-access-status', { body: JSON.stringify({ path: api.pathname, authenticatedStatus: positive.status(), anonymousStatus: status, loginRedirect }), contentType: 'application/json' });
    expect([401, 403].includes(status) || loginRedirect, 'Authenticated customer API must not return private data to a fresh anonymous client').toBe(true);
  } finally { await guest.close(); }
});
test('@phase1 F24-a empty login is rejected without authentication POST', async ({ page }) => {
  await openLogin(page);
  const writes: string[] = [];
  page.on('request', request => { if (isApplicationPost(request)) writes.push(new URL(request.url()).pathname); });
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Welcome Back', exact: true })).toBeVisible();
  await expect.poll(async () => {
    const native = await page.locator('input').evaluateAll(elements => elements.some(element => !(element as HTMLInputElement).validity.valid));
    return native || /required|enter.*email|enter.*password/i.test(await notice(page).innerText()) || await page.getByText(/email.*required|password.*required/i).count() > 0;
  }).toBe(true);
  for (const label of ['Email Address', 'Password']) {
    await expect.poll(async () => {
      const input = page.getByLabel(label, { exact: true });
      return await input.getAttribute('aria-invalid') === 'true' || await input.evaluate((el: HTMLInputElement) => el.validity.valueMissing);
    }, { message: `Empty ${label} needs its own validation signal` }).toBe(true);
  }
  expect(writes, 'Empty form must be rejected before contacting authentication').toEqual([]);
});
test('@phase1 F24-a malformed email is rejected locally', async ({ page }) => {
  await openLogin(page);
  const writes: string[] = [];
  page.on('request', request => { if (isApplicationPost(request)) writes.push(new URL(request.url()).pathname); });
  await page.getByLabel('Email Address', { exact: true }).fill('not-an-email');
  await page.getByLabel('Password', { exact: true }).fill('SyntheticInvalidLogin1!');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  expect(await page.getByLabel('Email Address', { exact: true }).evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
  expect(writes).toEqual([]);
});
test('@phase1 F24-a one wrong password is rejected by server without imposing new-password length on login', async ({ page }, info) => {
  await openLogin(page);
  await page.getByLabel('Email Address', { exact: true }).fill(required('PRODUCT_TEST_EMAIL'));
  // Exactly ONE real failed attempt per full run. No brute force, retries,
  // account enumeration, lockout/rate-limit stress or repeated wrong passwords.
  await page.getByLabel('Password', { exact: true }).fill('x');
  const rejected = page.waitForResponse(response => response.request().method() === 'POST' && /\/(?:login|signin|sign-in)\/?$/.test(new URL(response.url()).pathname));
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  const response = await rejected;
  if (response.status() === 429) throw new Error('RATE LIMIT BLOCKER: login is throttled; do not retry or call it a credential-validation bug');
  await info.attach('single-rejected-login-status', { body: JSON.stringify({ status: response.status(), path: new URL(response.url()).pathname }), contentType: 'application/json' });
  expect([400, 401, 403]).toContain(response.status());
  await expect(page.getByText(/invalid.*(?:email|password|credentials)|incorrect.*(?:password|credentials)|login failed|sign.?in failed/i).first()).toBeVisible();
  await expectAnonymous(page);
});
test('@phase1 F24-a login password is masked and optional reveal can be reversed', async ({ page }) => {
  await openLogin(page);
  const input = page.getByLabel('Password', { exact: true });
  await expect(input).toHaveAttribute('type', 'password');
  await input.fill('SyntheticMaskingProbe1!');
  try {
    const reveal = input.locator('..').getByRole('button');
    await reveal.click();
    await expect(input).toHaveAttribute('type', 'text');
    await reveal.click();
    await expect(input).toHaveAttribute('type', 'password');
  } finally { await input.fill(''); }
});
test('@phase1 F24-a login uses POST without credentials in URL or response password fields', async ({ page }, info) => {
  let responsePromise: Promise<import('playwright/test').Response>;
  responsePromise = page.waitForResponse(response => response.request().method() === 'POST' && /\/(?:login|signin|sign-in)\/?$/.test(new URL(response.url()).pathname));
  await signIn(page);
  const response = await responsePromise;
  const request = response.request();
  const url = new URL(request.url());
  const urlParts = [...url.searchParams.values(), decodeURIComponent(url.pathname), url.username, url.password];
  expect(urlParts.some(value => value.includes(required('PRODUCT_TEST_PASSWORD')) || value.includes(required('PRODUCT_TEST_EMAIL'))), 'Authentication credentials must never be put in a URL').toBe(false);
  expect(request.method()).toBe('POST');
  if (process.env.TARGET_ENV === 'production') expect(url.protocol).toBe('https:');
  const exposed: string[] = [];
  const inspect = (value: unknown, prefix = '', depth = 0) => {
    if (!value || typeof value !== 'object' || depth > 10) return;
    if (Array.isArray(value)) { value.forEach(item => inspect(item, `${prefix}[].`, depth + 1)); return; }
    for (const [key, nested] of Object.entries(value)) {
      if (/^(?:password|passwordHash|password_hash|hashedPassword|resetCode|resetToken)$/i.test(key)) exposed.push(`${prefix}${key}`);
      else inspect(nested, `${prefix}${key}.`, depth + 1);
    }
  };
  inspect(await response.json());
  await info.attach('auth-response-field-audit', { body: JSON.stringify({ method: request.method(), path: url.pathname, status: response.status(), exposedFieldNames: exposed }), contentType: 'application/json' });
  expect(exposed, 'Login response must not expose a password, stored hash or reset secret').toEqual([]);
});
test('@phase1 F24-a logout blocks back reload and direct protected navigation', async ({ page }) => {
  await signIn(page);
  await expectProtected(page);
  await logout(page);
  await page.goBack();
  await page.reload();
  await expectAnonymous(page);
});
test('@phase1 F24-a logout removes access from another tab in the same browser context', async ({ page, context }) => {
  await signIn(page);
  const other = await context.newPage();
  try {
    await expectProtected(other, '/customers');
    await logout(page);
    await other.reload();
    await expect(other.getByRole('heading', { name: 'Welcome Back', exact: true })).toBeVisible();
    await expectAnonymous(other);
  } finally { await other.close(); }
});

for (const example of [
  { label: 'seven characters fail minimum', candidate: 'Aa1!abc', result: [false, true, true] },
  { label: 'eight compliant characters pass published checklist', candidate: 'Aa1!abcd', result: [true, true, true] },
  { label: 'missing uppercase fails uppercase', candidate: 'aa1!abcd', result: [true, false, true] },
  { label: 'missing number fails number', candidate: 'Aa!abcde', result: [true, true, false] },
  { label: 'eight characters without optional symbol satisfy mandatory indicators', candidate: 'Aa1abcde', result: [true, true, true] },
]) {
  test(`@phase1 F24-a signup feedback ${example.label}`, async ({ page }) => {
    await openSignup(page);
    await checklist(page, example.candidate, example.result);
    // Do not check Terms, submit signup, or claim this tests server hashing.
  });
}
test('@phase1 F24-a signup feedback requires lowercase and rejects uppercase-only candidate', async ({ page }) => {
  await openSignup(page);
  const input = page.getByLabel('Password', { exact: true });
  try {
    await input.fill('AA1!BCDE');
    const rule = page.getByText('Lowercase letter', { exact: true });
    await expect(rule, 'Confirmed policy requires lowercase guidance; signup currently omits it').toBeVisible();
    await expect(rule.locator('..').locator('svg.lucide-circle-check')).toHaveCount(0);
    await input.fill('Aa1!bcde');
    await expect(rule.locator('..').locator('svg.lucide-circle-check')).toHaveCount(1);
  } finally { await input.fill(''); }
});

test('@phase1 F24-a signup communicates symbols as optional rather than mandatory', async ({ page }) => {
  await openSignup(page);
  const input = page.getByLabel('Password', { exact: true });
  try {
    await input.fill('Aa1abcde');
    await expect(page.getByText(/(?:special character|symbol).*optional|optional.*(?:symbol|special character)/i), 'Optional symbol must not be presented as an unmet mandatory rule').toBeVisible();
  } finally { await input.fill(''); }
});

test('@phase1 F24-a signup strength bar increases to strongest when symbol is added', async ({ page }) => {
  await openSignup(page);
  const input = page.getByLabel('Password', { exact: true });
  // Revalidate accessible meter against actual widget once implemented.
  const bar = page.getByRole('progressbar').or(page.getByRole('meter')).first();
  try {
    await input.fill('Aa1abcde');
    await expect(bar, 'Confirmed requirement: visible password strength bar').toBeVisible();
    const before = Number(await bar.getAttribute('aria-valuenow'));
    await input.fill('Aa1abcd!');
    const after = Number(await bar.getAttribute('aria-valuenow'));
    const maximum = Number(await bar.getAttribute('aria-valuemax'));
    expect(Number.isFinite(before) && Number.isFinite(after) && maximum > 0).toBe(true);
    expect(after).toBeGreaterThan(before);
    expect(after).toBe(maximum);
  } finally { await input.fill(''); }
});

test('@phase1 F24-a backend bcrypt verification needs deployment-matched audit evidence', async ({}, info) => {
  const path = process.env.SECURITY_BCRYPT_AUDIT_PATH?.trim();
  expect(path, 'BACKEND EVIDENCE BLOCKER: bcrypt cannot be verified from browser login success or hidden inputs. Supply a deployment-matched backend audit/test record; no backend source/database is in this workspace.').toBeTruthy();
  const audit = JSON.parse(readFileSync(path!, 'utf8'));
  expect(audit.targetOrigin).toBe(new URL(required('BASE_URL')).origin);
  expect(audit.algorithm).toBe('bcrypt');
  for (const key of ['deploymentRevision', 'verifiedBy', 'verifiedAt', 'evidenceReference']) expect(typeof audit[key] === 'string' && audit[key].length > 0, `Missing independent audit field ${key}`).toBe(true);
  for (const assertion of ['bcrypt_hash_storage', 'no_plaintext_password_storage', 'correct_password_verified', 'wrong_password_rejected']) expect(audit.passedAssertions).toContain(assertion);
  info.annotations.push({ type: 'manual-backend-evidence', description: 'Validates a supplied audit record only; this browser test did not run the backend hashing assertions.' });
  await info.attach('backend-audit-reference-no-hashes', { body: JSON.stringify({ deploymentRevision: audit.deploymentRevision, algorithm: audit.algorithm, evidenceReference: audit.evidenceReference, verifiedAt: audit.verifiedAt }), contentType: 'application/json' });
});
