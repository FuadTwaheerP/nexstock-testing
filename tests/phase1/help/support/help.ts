import { readFileSync, writeFileSync } from 'node:fs';
import { test as base, expect, type Page, type Locator, type BrowserContext, type Browser, type TestInfo } from 'playwright/test';
import { appPath } from '../../../../helpers/safety.mjs';
import { validateSecurityTarget } from '../../../../helpers/security-safety.mjs';
import { helpRequestAllowed, readBuildMetadata } from '../../../../helpers/help-safety.mjs';
export { expect };
export type LegalKind = 'terms' | 'privacy';
export const authPath = 'test-results/help-auth.json';
export const journalPath = 'test-results/help-run.json';
export const delivery = JSON.parse(readFileSync(new URL('../../../../data/help-delivery-status.json', import.meta.url), 'utf8'));
export const required = (key: string) => { const value = process.env[key]?.trim(); if (!value) throw new Error(`Missing ${key}; see .env.example`); return value; };
export const company = () => process.env.HELP_TEST_COMPANY?.trim() || process.env.PRODUCT_TEST_COMPANY?.trim() || 'Nexstock QA Company';
export const main = (page: Page) => page.getByRole('main');
export const legalTitle = (kind: LegalKind) => kind === 'terms' ? /^(Terms of Service|Terms and Conditions|Terms & Conditions)$/i : /^Privacy Policy$/i;
export const entry = (scope: Page | Locator, kind: LegalKind): Locator => scope.getByRole('button', { name: legalTitle(kind) }).or(scope.getByRole('link', { name: legalTitle(kind) }));
const operations = new WeakMap<BrowserContext, 'signin' | 'logout'>();
export function record(event: Record<string, unknown>) {
  const journal = JSON.parse(readFileSync(journalPath, 'utf8')); journal.events.push(event); writeFileSync(journalPath, JSON.stringify(journal, null, 2));
}
export async function prerequisite(info: TestInfo, reason: string): Promise<never> {
  info.annotations.push({ type: 'prerequisite-blocked', description: reason });
  record({ test: info.title, category: 'prerequisite-blocked', reason });
  await info.attach('delivery-prerequisite', { body: reason, contentType: 'text/plain' });
  // Keep an incomplete check red in Playwright; never skip it or manufacture a
  // green pass. The assessment/report classifies this separately from bugs.
  throw new Error(`[PREREQUISITE BLOCKED] ${reason}`);
}
export async function guard(context: BrowserContext, info: TestInfo) {
  await context.route('**/*', async intercepted => {
    const req = intercepted.request(), url = new URL(req.url());
    if (helpRequestAllowed(req.url(), req.method(), required('BASE_URL'), operations.get(context))) return intercepted.continue();
    const external = url.origin !== new URL(required('BASE_URL')).origin;
    const category = external ? 'external-telemetry' : /\/auth\/login$/.test(url.pathname) ? 'prevented-legal-login-submit' : /\/auth\/(?:language|theme)$/.test(url.pathname) ? 'prevented-preference-sync' : 'unexpected-application-write';
    record({ test: info.title, method: req.method(), path: url.pathname, category });
    if (external) await intercepted.fulfill({ status: 204, body: '' }); else await intercepted.abort('blockedbyclient');
  });
}
export const qaHeader = (page: Page) => page.locator('header button[data-slot="dropdown-menu-trigger"]').filter({ has: page.getByText(company(), { exact: true }) });
export async function verifyCompany(page: Page) { await expect(qaHeader(page), 'Only the configured disposable QA company is in scope').toBeVisible({ timeout: 30_000 }); }
export async function signIn(page: Page) {
  operations.set(page.context(), 'signin');
  try {
    await page.goto(appPath('/login', required('BASE_URL')), { waitUntil: 'commit' });
    await page.getByLabel('Email Address', { exact: true }).fill(required('PRODUCT_TEST_EMAIL'));
    await page.getByLabel('Password', { exact: true }).fill(required('PRODUCT_TEST_PASSWORD'));
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    const chooser = page.getByRole('heading', { name: 'Choose a business', exact: true });
    await expect(chooser.or(qaHeader(page)).first()).toBeVisible({ timeout: 30_000 });
    if (await chooser.isVisible()) await page.getByRole('button').filter({ has: page.getByRole('heading', { name: company(), exact: true }) }).click();
    await verifyCompany(page);
  } finally { operations.delete(page.context()); }
}
export async function openHelp(page: Page) {
  await page.goto(appPath('/help-center', required('BASE_URL')), { waitUntil: 'commit' });
  await verifyCompany(page);
  await expect(main(page).getByRole('heading', { name: 'Help Center', exact: true })).toBeVisible({ timeout: 30_000 });
}
export async function openAdvanced(page: Page) {
  const ready = page.waitForResponse(r => r.request().method() === 'GET' && new URL(r.url()).pathname === '/app/api/v1/settings', { timeout: 30_000 });
  await page.goto(appPath('/settings', required('BASE_URL')), { waitUntil: 'commit' });
  const response = await ready; expect(response.ok()).toBe(true); await response.finished();
  await verifyCompany(page);
  await expect(main(page).locator('#company-name')).toHaveValue(company(), { timeout: 30_000 });
  await main(page).getByRole('tab', { name: 'Advanced', exact: true }).click();
  const panel = main(page).getByRole('tabpanel', { name: 'Advanced', exact: true });
  await expect(panel.getByRole('heading', { name: 'Legal & Documentation', exact: true })).toBeVisible();
  return panel;
}
export async function screenshot(page: Page, info: TestInfo, label: string) {
  const path = info.outputPath(`${label}.png`); await page.screenshot({ path, fullPage: true }); await info.attach(label, { path, contentType: 'image/png' });
}
export async function anonymous(browser: Browser, info: TestInfo, run: (page: Page) => Promise<void>, mobile = false, captureLabel = 'public-legal') {
  const context = await browser.newContext({ storageState: { cookies: [], origins: [] }, viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, locale: 'en-GB', serviceWorkers: 'block' });
  try {
    await guard(context, info);
    await context.addInitScript(() => { (window as any).__helpFormSubmits = 0; document.addEventListener('submit', () => { (window as any).__helpFormSubmits++; }, true); });
    const page = await context.newPage();
    try {
      await page.goto(appPath('/login', required('BASE_URL')), { waitUntil: 'commit' });
      // The desktop welcome hero is intentionally hidden at mobile widths.
      // Wait for the actual login form, not a desktop-only decoration.
      await expect(page.getByLabel('Email Address', { exact: true })).toBeVisible({ timeout: 30_000 });
      await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
      await page.getByLabel('Email Address', { exact: true }).fill('');
      await page.getByLabel('Password', { exact: true }).fill('');
      await run(page);
    } catch (error) { await screenshot(page, info, `${captureLabel}-failure`).catch(() => undefined); throw error; }
  } finally { await context.close(); }
}
async function keyboardActivate(page: Page, control: Locator) {
  let reached = false;
  for (let i = 0; i < 35; i++) {
    await page.keyboard.press('Tab');
    if (await control.evaluate(el => document.activeElement === el)) { reached = true; break; }
  }
  expect(reached, 'Legal entry must be reachable using normal Tab navigation').toBe(true);
  await control.press('Enter');
}
export async function openDocument(page: Page, kind: LegalKind, info: TestInfo, keyboard = false) {
  const control = entry(page, kind);
  if (await control.count() === 0) {
    await screenshot(page, info, `${kind}-entry-unavailable`);
    return prerequisite(info, `${kind}: no document entry is delivered on this surface. ${delivery[kind]} Document reading/focus checks are not passed.`);
  }
  await expect(control, `F30: ${kind} must have a visible document entry point`).toBeVisible({ timeout: 8_000 });
  const before = new Set(page.context().pages());
  const semantics = await control.evaluate(el => ({ tag: el.tagName, declaredType: el.getAttribute('type'), effectiveType: el instanceof HTMLButtonElement ? el.type : null, insideForm: !!el.closest('form') }));
  if (keyboard) await keyboardActivate(page, control); else await control.click();
  const submits = await page.evaluate(() => (window as any).__helpFormSubmits || 0);
  const requiredFeedback = await page.getByText('This field is required', { exact: true }).count();
  const evidence = { kind, ...semantics, submitEvents: submits, requiredFeedback, path: new URL(page.url()).pathname };
  record({ category: 'legal-entry-observation', ...evidence });
  await info.attach(`${kind}-entry-semantics`, { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' });
  if (submits > 0 || requiredFeedback > 0) {
    info.annotations.push({ type: 'confirmed-bug', description: 'HELP-001: legal control submits/validates the login form' });
    record({ test: info.title, category: 'confirmed-bug', id: 'HELP-001', kind, submitEvents: submits, requiredFeedback });
    throw new Error(`[HELP-001] ${kind} control submitted/validated the login form (submit events=${submits}, required-field messages=${requiredFeedback}). Pending legal text does not justify authentication side effects.`);
  }
  let document: { page: Page; root: Locator } | undefined;
  try { await expect.poll(async () => {
    for (const candidate of [page, ...page.context().pages().filter(p => !before.has(p))]) {
      const heading = candidate.getByRole('heading', { name: legalTitle(kind) });
      if (!(await heading.isVisible().catch(() => false))) continue;
      const modal = candidate.getByRole('dialog').filter({ has: heading });
      document = { page: candidate, root: await modal.count() ? modal : await main(candidate).count() ? main(candidate) : candidate.locator('body') };
      return true;
    }
    return false;
  }, { timeout: 8_000, message: `F30: ${kind} must open a readable HTML document, not validate/sign in the login form` }).toBe(true); }
  catch (error) {
    if (page.isClosed()) throw error;
    return prerequisite(info, `${kind}: no readable document opened. ${delivery[kind]} Not a legal-content pass or an independently confirmed missing-document bug.`);
  }
  const text = (await document!.root.innerText()).trim();
  await expect(document!.root.locator('p, li').filter({ hasText: /\S/ }).first(), 'Legal document needs readable body content, not only a heading').toBeVisible();
  if (/lorem ipsum|coming soon|policy goes here/i.test(text)) return prerequisite(info, `${kind}: only placeholder legal text is delivered. ${delivery[kind]}`);
  return { ...document!, text };
}
export async function publicLegal(browser: Browser, kind: LegalKind, info: TestInfo, mobileKeyboard = false) {
  await anonymous(browser, info, async page => {
    if (mobileKeyboard) expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'Mobile login/legal entry must not overflow horizontally').toBe(true);
    const document = await openDocument(page, kind, info, mobileKeyboard);
    if (mobileKeyboard) expect(await document.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'Mobile legal document must not overflow horizontally').toBe(true);
    await screenshot(document.page, info, `${kind}-${mobileKeyboard ? 'mobile-keyboard' : 'public'}-document`);
    const dialog = document.page.getByRole('dialog');
    if (await dialog.count()) {
      await document.page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(entry(page, kind), 'Closing the document should restore focus to its launcher').toBeFocused();
    } else if (document.page !== page) await document.page.close();
    else if (page.url() !== appPath('/login', required('BASE_URL'))) {
      await page.goBack({ waitUntil: 'commit' });
      await expect(entry(page, kind)).toBeVisible();
    }
    expect(await page.getByLabel('Email Address', { exact: true }).inputValue()).toBe('');
    expect(await page.getByLabel('Password', { exact: true }).inputValue()).toBe('');
  }, mobileKeyboard, kind);
}
export async function inAppLegal(page: Page, kind: LegalKind, info: TestInfo) {
  await openHelp(page);
  const document = await openDocument(page, kind, info);
  await screenshot(document.page, info, `${kind}-authenticated-document`);
}
export async function buildMetadata(page: Page, info: TestInfo) {
  await openHelp(page);
  const help = readBuildMetadata(await main(page).innerText());
  await screenshot(page, info, 'help-center-build-surface');
  const advanced = await openAdvanced(page);
  const settings = readBuildMetadata(await advanced.innerText());
  await screenshot(page, info, 'advanced-build-surface');
  const values = { version: help.version || settings.version, commit: help.commit || settings.commit, copyright: help.copyright || settings.copyright };
  await info.attach('visible-build-metadata', { body: JSON.stringify({ surfaces: ['Help Center', 'Settings → Advanced'], values, releaseOracle: delivery.release }, null, 2), contentType: 'application/json' });
  if (!values.version || !values.commit) return prerequisite(info, `Active version/commit is absent from the inspected UI. ${delivery.release} Release verification remains blocked, not a confirmed new application bug.`);
  info.annotations.push({ type: 'coverage-limitation', description: delivery.release });
  // Copyright is independently checked on the public login footer. Do not
  // invent a requirement to duplicate it on every authenticated screen.
  return values;
}
export async function logout(page: Page) {
  await openHelp(page);
  operations.set(page.context(), 'logout');
  try {
    const header=page.getByRole('banner');
    await header.getByRole('button',{name:'account',exact:true}).or(header.getByRole('button').filter({ hasText: /Admin|Manager|Cashier/ })).last().click();
    await page.getByRole('menuitem', { name: 'Log out', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Welcome Back', exact: true })).toBeVisible({ timeout: 30_000 });
  } finally { operations.delete(page.context()); }
}
export const test = base.extend<{ helpScope: void }>({
  helpScope: [async ({ context }, use, info) => {
    info.setTimeout(info.title.includes('@full-flow') ? 180_000 : 90_000);
    validateSecurityTarget(required('BASE_URL')); await guard(context, info); await use();
  }, { auto: true }],
});
