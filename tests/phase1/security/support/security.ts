import { readFileSync, writeFileSync } from 'node:fs';
import { test as base, expect, type Page, type BrowserContext, type Browser, type TestInfo } from 'playwright/test';
import { appPath } from '../../../../helpers/safety.mjs';
import { validateSecurityTarget, securityRequestAllowed } from '../../../../helpers/security-safety.mjs';

export { expect };
export function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}; see .env.example`);
  return value;
}
export const companyName = () => process.env.SECURITY_TEST_COMPANY?.trim() || process.env.PRODUCT_TEST_COMPANY?.trim() || 'Nexstock QA Company';
export const journalPath = 'test-results/security-run.json';
export const main = (page: Page) => page.getByRole('main');
export const companyButton = (page: Page) => page.getByRole('banner').getByRole('button', { name: companyName(), exact: true });
export const notice = (page: Page) => page.getByRole('region', { name: 'Notifications alt+T' });
export const isApplicationPost = (request: import('playwright/test').Request) => request.method() === 'POST'
  && new URL(request.url()).origin === new URL(required('BASE_URL')).origin;
export async function route(page: Page, path: string) {
  // App readiness is asserted by each caller. Do not wait for unrelated
  // third-party resources to finish the window load event.
  await page.goto(appPath(path, required('BASE_URL')), { waitUntil: 'domcontentloaded' });
}
export function record(entry: Record<string, unknown>) {
  const data = JSON.parse(readFileSync(journalPath, 'utf8'));
  data.events.push(entry);
  writeFileSync(journalPath, JSON.stringify(data, null, 2));
}
export async function guardContext(context: BrowserContext, info: TestInfo, humanHandoff = false) {
  const blocked: { method: string; path: string; category: string }[] = [];
  await context.route('**/*', async intercepted => {
    const request = intercepted.request();
    if (!securityRequestAllowed(request.url(), request.method(), required('BASE_URL'), humanHandoff)) {
      const url = new URL(request.url());
      const external = url.origin !== new URL(required('BASE_URL')).origin;
      const entry = { method: request.method(), path: url.pathname, category: external ? 'external-telemetry' : /\/auth\/language\/?$/.test(url.pathname) ? 'prevented-preference-sync' : 'credential-or-application-write' };
      if (!blocked.some(item => item.path === entry.path && item.method === entry.method)) {
        blocked.push(entry);
        record({ type: 'blocked-write', test: info.title, ...entry });
      }
      // Suppress out-of-scope telemetry locally without transmitting it or
      // inducing SDK retry loops. This is not a telemetry functional check.
      if (external) await intercepted.fulfill({ status: 204, body: '' });
      else await intercepted.abort('blockedbyclient');
    } else await intercepted.continue();
  });
  return blocked;
}
export async function openLogin(page: Page) {
  await route(page, '/login');
  await expect(page.getByRole('heading', { name: 'Welcome Back', exact: true })).toBeVisible();
  await expect(page.getByLabel('Email Address', { exact: true })).toBeVisible();
}
export async function chooseCompany(page: Page) {
  const chooser = page.getByRole('heading', { name: 'Choose a business', exact: true });
  await expect(companyButton(page).or(chooser).first()).toBeVisible({ timeout: 20_000 });
  if (await chooser.isVisible()) {
    await page.getByRole('button').filter({ has: page.getByRole('heading', { name: companyName(), exact: true }) }).click();
  }
  await expect(companyButton(page), 'Security tests must use the configured disposable company').toBeVisible();
}
export async function signIn(page: Page) {
  await openLogin(page);
  await page.getByLabel('Email Address', { exact: true }).fill(required('PRODUCT_TEST_EMAIL'));
  await page.getByLabel('Password', { exact: true }).fill(required('PRODUCT_TEST_PASSWORD'));
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await chooseCompany(page);
  record({ type: 'authenticated', test: base.info().title, company: companyName() });
}
export async function openAccountMenu(page: Page) {
  const button = page.getByRole('banner').getByRole('button').filter({ hasText: /Admin|Manager|Cashier/ }).last();
  await expect(button).toBeVisible();
  await button.click();
  const menu = page.getByRole('menu');
  await expect(menu.getByRole('menuitem', { name: 'Log out', exact: true })).toBeVisible();
  return menu;
}
export async function logout(page: Page) {
  await (await openAccountMenu(page)).getByRole('menuitem', { name: 'Log out', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Welcome Back', exact: true })).toBeVisible();
}
export async function expectProtected(page: Page, path = '/products') {
  await route(page, path);
  await expect(companyButton(page)).toBeVisible();
  await expect(main(page).getByRole('heading', { name: path === '/products' ? 'Products' : 'Customers', exact: true })).toBeVisible();
}
export async function expectAnonymous(page: Page, path = '/products') {
  await route(page, path);
  await expect(page.getByRole('heading', { name: 'Welcome Back', exact: true }), 'Protected deep link must require authentication').toBeVisible();
  await expect(companyButton(page)).toHaveCount(0);
}
export async function openSignup(page: Page) {
  await openLogin(page);
  await page.getByRole('button', { name: 'Create Account', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Create Account', exact: true })).toBeVisible();
}
export const publishedPolicy = ['At least 8 characters', 'Uppercase letter', 'Number'];
export async function checklist(page: Page, candidate: string, expected: boolean[]) {
  await page.getByLabel('Password', { exact: true }).fill(candidate);
  try {
    for (const [index, label] of publishedPolicy.entries()) {
      const indicator = page.getByText(label, { exact: true }).locator('..').locator('svg.lucide-circle-check');
      await expect(indicator, `Signup's published ${label} indicator must match this synthetic candidate`).toHaveCount(expected[index] ? 1 : 0);
    }
  } finally { await page.getByLabel('Password', { exact: true }).fill(''); }
}
export async function openForgot(page: Page) {
  await openLogin(page);
  await page.getByRole('button', { name: 'Forgot password?', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Forgot Password?', exact: true })).toBeVisible();
}
export async function openProfile(page: Page, security = false) {
  await route(page, '/profile');
  await expect(main(page).getByRole('heading', { name: 'My Profile', exact: true })).toBeVisible();
  await expect(companyButton(page)).toBeVisible();
  await main(page).getByRole('tab', { name: security ? 'Security' : 'Personal Information', exact: true }).click();
  return main(page).getByRole('tabpanel');
}
export async function readSecurityPolicy(page: Page) {
  await route(page, '/settings');
  await main(page).getByRole('tab', { name: 'Security', exact: true }).click();
  const panel = main(page).getByRole('tabpanel');
  await expect(panel.getByRole('heading', { name: 'Company Security Policies', exact: true })).toBeVisible();
  const number = async (label: string) => Number(await panel.getByText(label, { exact: true }).locator('..').getByRole('spinbutton').inputValue());
  const checked = async (label: string) => (await panel.getByText(label, { exact: true }).locator('..').getByRole('switch').getAttribute('aria-checked')) === 'true';
  const policy = {
    minimumLength: await number('Minimum Password Length'), requireUppercase: await checked('Require Uppercase'),
    requireNumbers: await checked('Require Numbers'), requireSymbols: await checked('Require Symbols'),
    companyTimeoutMinutes: await number('Session Timeout (Minutes)'),
    autoLogoutPresent: await panel.getByText('Auto-logout', { exact: true }).count() > 0,
  };
  await base.info().attach('read-only-security-policy', { body: JSON.stringify(policy, null, 2), contentType: 'application/json' });
  return policy;
}
export function agreedIdleMinutes() {
  // Latest user confirmation supersedes the earlier 15-minute proposal.
  const configured = process.env.SECURITY_IDLE_TIMEOUT_MINUTES?.trim() || '30';
  const minutes = Number(configured);
  expect(Number.isFinite(minutes) && minutes >= 1 && minutes <= 1440, 'Confirmed idle threshold must be 1–1440 minutes').toBe(true);
  return minutes;
}
async function advance(page: Page, ms: number) {
  if (process.env.SECURITY_IDLE_CLOCK === 'wall') {
    for (let remaining = ms; remaining > 0; remaining -= Math.min(remaining, 30_000)) await page.waitForTimeout(Math.min(remaining, 30_000));
  } else {
    await page.clock.fastForward(ms);
  }
}
export async function verifyIdle(browser: Browser, info: TestInfo) {
  expect(process.env.SECURITY_PIN_PROVISIONED, 'PIN PREREQUISITE BLOCKER: user must set the QA account PIN during onboarding / approved human handoff and confirm SECURITY_PIN_PROVISIONED=true. Agent never creates or changes credentials. No elapsed-time PIN-lock claim without that fixture.').toBe('true');
  const minutes = agreedIdleMinutes();
  const ms = minutes * 60_000;
  if (process.env.SECURITY_IDLE_CLOCK === 'wall') info.setTimeout(ms * 2 + 240_000);
  await info.attach('idle-test-scope', { body: JSON.stringify({ minutes, expected: 'PIN lock, not logout', mode: process.env.SECURITY_IDLE_CLOCK === 'wall' ? 'wall-clock' : 'client-clock simulation; not real elapsed-time certification', calibration: 'active session first, separate idle session second; never simultaneous valid logins' }), contentType: 'application/json' });
  // An active control distinguishes an inactivity finding from an absolute
  // expiry / client-clock artifact. Do not modify JWTs, cookies or server time.
  for (const active of [true, false]) {
    const context = await browser.newContext({ viewport: null, locale: 'en-GB', timezoneId: 'Indian/Mauritius', serviceWorkers: 'block' });
    await guardContext(context, info);
    const page = await context.newPage();
    try {
      if (process.env.SECURITY_IDLE_CLOCK !== 'wall') await page.clock.install();
      await signIn(page);
      await expectProtected(page);
      if (active) {
        const steps = 4;
        for (let index = 0; index < steps; index++) {
          await advance(page, (ms + 30_000) / steps);
          if (!await companyButton(page).isVisible() || await pinPrompt(page).isVisible()) throw new Error('CALIBRATION BLOCKER: active control expired or locked; absolute expiry, a different idle policy, or clock simulation may be responsible. Not a confirmed inactivity defect.');
          await main(page).getByRole('heading', { name: 'Products', exact: true }).click();
        }
        await logout(page);
      } else {
        await advance(page, Math.max(1_000, ms - 30_000));
        await expect(companyButton(page), 'Session should remain authenticated before its confirmed idle deadline').toBeVisible();
        await expect(pinPrompt(page)).not.toBeVisible();
        await advance(page, 90_000);
        // A warning timer scheduled by a suspended-tab callback may require a
        // second advance. Keep this explicit rather than firing every poll.
        if (process.env.SECURITY_IDLE_CLOCK !== 'wall' && !await pinPrompt(page).isVisible()) await advance(page, 60_000);
        await expect(page.getByRole('heading', { name: 'Welcome Back', exact: true }), 'Inactivity must lock with PIN, not log out').not.toBeVisible();
        await expect(pinPrompt(page), 'IDLE OBSERVATION: PIN required after inactivity; client-clock-only failures require wall-clock confirmation before ticketing.').toBeVisible();
        await expect(main(page).getByRole('heading', { name: 'Products', exact: true })).not.toBeVisible();
        await page.reload();
        await expect(pinPrompt(page), 'Reload must not bypass PIN lock').toBeVisible();
      }
    } finally {
      // Do not log out other contexts/users or edit session policy settings.
      if (await companyButton(page).isVisible()) await logout(page).catch(() => undefined);
      await context.close();
    }
  }
}
// Contract locator: revalidate against actual PIN UI once implemented. Never mock it.
export const pinPrompt = (page: Page) => page.getByRole('dialog').filter({ hasText: /PIN/i })
  .or(page.getByRole('heading', { name: /enter.*PIN|unlock.*PIN|session locked/i })).first();
export async function manualPasswordHandoff(browser: Browser, info: TestInfo) {
  expect(process.env.SECURITY_INTERACTIVE_HANDOFF, 'HANDOFF BLOCKER: reset completion / password update must be performed by the human on an isolated account. Safe unattended checks do not change credentials. See README.').toBe('true');
  expect(info.project.use.headless, 'Interactive password handoff requires --headed or --debug').toBe(false);
  const email = required('SECURITY_HANDOFF_EMAIL');
  expect(email.toLowerCase(), 'Never rotate the shared account used by the other module suites').not.toBe(required('PRODUCT_TEST_EMAIL').toLowerCase());
  const context = await browser.newContext({ viewport: null, locale: 'en-GB', timezoneId: 'Indian/Mauritius', serviceWorkers: 'block' });
  await guardContext(context, info, true);
  const page = await context.newPage();
  let matchingLogin = false;
  const responses: Promise<void>[] = [];
  page.on('response', response => {
    if (response.request().method() === 'POST' && /\/(?:login|signin|sign-in)$/.test(new URL(response.url()).pathname) && response.ok()) {
      responses.push((async () => {
        const result = await response.json();
        const actualEmail = result.user?.email || result.data?.user?.email || result.email;
        matchingLogin = typeof actualEmail === 'string' && actualEmail.toLowerCase() === email.toLowerCase();
      })().catch(() => undefined));
    }
  });
  try {
    await info.attach('human-handoff-instructions', { body: 'In the separate browser, manually request and complete reset using the configured isolated mailbox; manually enter/confirm/submit every new credential. Manually test rejected old/invalid/reused codes and signed-in password update, then log in with the final credential and select the configured QA company. Resume the Playwright inspector only when done. The agent never enters, captures or restores new passwords. These manual assertions are not certified by simply reaching the dashboard.', contentType: 'text/plain' });
    await openForgot(page);
    info.setTimeout(20 * 60_000);
    await page.pause();
    await Promise.all(responses);
    expect(matchingLogin, 'Handoff must finish with the configured isolated account, not the shared QA account').toBe(true);
    await expect(companyButton(page)).toBeVisible();
    await expectProtected(page);
    record({ type: 'human-assisted-password-handoff', test: info.title, postcondition: 'isolated account authenticated; reset/update steps require manual evidence' });
  } finally { await context.close(); }
}
export const test = base.extend<{ securityScope: void }>({
  securityScope: [async ({ context, page }, use, info) => {
    info.setTimeout(info.title.includes('@full-flow') ? 180_000 : 90_000);
    validateSecurityTarget(required('BASE_URL'));
    const blocked = await guardContext(context, info);
    const statuses: { method: string; path: string; status: number }[] = [];
    page.on('response', response => {
      if (response.request().method() !== 'GET' && new URL(response.url()).origin === new URL(required('BASE_URL')).origin) statuses.push({ method: response.request().method(), path: new URL(response.url()).pathname, status: response.status() });
    });
    try { await use(); }
    finally {
      await info.attach('security-network-statuses-no-secrets', { body: JSON.stringify({ statuses, blocked }, null, 2), contentType: 'application/json' });
      if (!page.isClosed() && await companyButton(page).isVisible()) await logout(page).catch(() => undefined);
    }
  }, { auto: true }],
});
