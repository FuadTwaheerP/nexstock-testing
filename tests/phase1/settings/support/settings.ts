import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { test as base, expect, type Page, type BrowserContext, type TestInfo } from 'playwright/test';
import { appPath } from '../../../../helpers/safety.mjs';
import { validateSecurityTarget } from '../../../../helpers/security-safety.mjs';
import { settingsRequestAllowed } from '../../../../helpers/settings-safety.mjs';
import { acceptApprovedQaBrn } from '../../../../helpers/settings-baseline.mjs';

export { expect };
export const journalPath = 'test-results/settings-run.json';
export const authPath = 'test-results/settings-auth.json';
// Not under test-results: a new run must not erase a pending compensation.
export const baselinePath = 'playwright/.auth/settings-baseline.json';
export const required = (key: string) => { const value = process.env[key]?.trim(); if (!value) throw new Error(`Missing ${key}; see .env.example`); return value; };
export const company = () => process.env.SETTINGS_TEST_COMPANY?.trim() || process.env.PRODUCT_TEST_COMPANY?.trim() || 'Nexstock QA Company';
export const main = (page: Page) => page.getByRole('main');
const operations = new WeakMap<BrowserContext, string>();
const apiSnapshots = new WeakMap<BrowserContext, any>();
const apiReads = new WeakMap<BrowserContext, Promise<void>>();
const settingsHeaders = new WeakMap<BrowserContext, Record<string, string>>();
const lastSavePayload = new WeakMap<BrowserContext, any>();
export async function apiSnapshot(context: BrowserContext) { await apiReads.get(context); return apiSnapshots.get(context); }
export function record(event: Record<string, unknown>) {
  const data = JSON.parse(readFileSync(journalPath, 'utf8')); data.events.push(event); writeFileSync(journalPath, JSON.stringify(data, null, 2));
}
export const baseline = (): any => JSON.parse(readFileSync(baselinePath, 'utf8'));
export function saveBaseline(data: any) { mkdirSync('playwright/.auth', { recursive: true }); writeFileSync(baselinePath, JSON.stringify(data, null, 2)); }
export function pending(value: boolean) { const data = baseline(); data.pending = value; saveBaseline(data); }
export async function migrateNewCompanyFields(page: Page) {
  const saved = baseline();
  if (saved.pending || 'companyEmail' in saved.api || 'website' in saved.api) return;
  // The old deployment rendered hard-coded demo fields that did not exist in
  // its settings GET. Never restore those placeholders over newly real data.
  expect(saved.profile['Company Email']).toBe('contact@nexstock.com');
  expect(saved.profile.Website).toBe('www.nexstock.com');
  const profile = await profileState(page), api = await apiSnapshot(page.context());
  expect(api && 'companyEmail' in api && 'website' in api).toBe(true);
  const expected = { ...saved.profile, 'Company Email': profile['Company Email'], Website: profile.Website };
  expect(profile, 'Only newly persisted email/website may migrate; unrelated profile changes must stop setup').toEqual(expected);
  expect(await taxState(page, false)).toEqual(saved.tax);
  expect(await localizationState(page, false)).toEqual(saved.localization);
  expect(profile['Company Email']).toBe(api.companyEmail || '');
  expect(profile.Website).toBe(api.website || '');
  const backup = `playwright/.auth/settings-baseline-before-release-fields-${Date.now()}.json`;
  copyFileSync(baselinePath, backup);
  saveBaseline({ ...saved, profile: expected, api: { ...saved.api, companyEmail: api.companyEmail, website: api.website }, releaseFieldMigration: { fields: ['Company Email', 'Website'], backup, migratedAt: new Date().toISOString(), reason: 'Deployed SET-001 now exposes persisted fields instead of old demo placeholders; no application write' } });
  record({ category: 'release-field-baseline-migration', fields: ['Company Email', 'Website'], originalPreservedPrivately: true, externalWrites: 0 });
}
export async function guard(context: BrowserContext, info: TestInfo) {
  const recorded = new Set<string>();
  context.on('response', response => {
    if (response.request().method() !== 'GET' || !response.ok() || new URL(response.url()).pathname !== '/app/api/v1/settings') return;
    const read = (async () => {
      const headers = await response.request().allHeaders();
      settingsHeaders.set(context, Object.fromEntries(Object.entries(headers).filter(([name]) => name === 'authorization' || name.startsWith('x-'))));
      const body = await response.json();
      const find = (item: any): any => {
        if (!item || typeof item !== 'object') return undefined;
        if ('companyName' in item && 'taxRegistered' in item) return item;
        for (const child of Object.values(item)) { const result = find(child); if (result) return result; }
      };
      const settings = find(body);
      apiSnapshots.set(context, settings);
      record({ category: 'settings-read-schema', keys: settings && Object.keys(settings), rootKeys: Object.keys(body) });
    })();
    apiReads.set(context, read); read.catch(() => undefined);
  });
  await context.route('**/*', async intercepted => {
    const req = intercepted.request(), url = new URL(req.url());
    let payload; try { payload = req.postDataJSON(); } catch { /* not JSON */ }
    const original = apiSnapshots.get(context) || (existsSync(baselinePath) ? baseline().api : undefined);
    if (settingsRequestAllowed(req.url(), req.method(), required('BASE_URL'), operations.get(context), payload, original)) {
      if (req.method() === 'PUT' && url.pathname === '/app/api/v1/settings') lastSavePayload.set(context, payload);
      return intercepted.continue();
    }
    const external = url.origin !== new URL(required('BASE_URL')).origin;
    const category = external ? 'external-telemetry' : /\/auth\/language$/.test(url.pathname) ? 'preference-sync-adapter' : 'unexpected-application-write';
    const key = `${req.method()} ${url.pathname} ${category}`;
    if (!recorded.has(key)) { recorded.add(key); record({ test: info.title, method: req.method(), path: url.pathname, category, operation: operations.get(context), keys: payload && Object.keys(payload), changedKeys: payload && Object.keys(payload).filter(key => JSON.stringify(payload[key]) !== JSON.stringify(original?.[key])), unchangedScopeTypes: payload && Object.fromEntries(['addressLine2','industry','numberOfEmployees','defaultBranch','termsAndConditions','privacyPolicy'].map(key => [key, { beforeNull: original?.[key] == null, beforeType: typeof original?.[key], beforeLength: typeof original?.[key] === 'string' ? original[key].length : undefined, afterNull: payload[key] == null, afterType: typeof payload[key], afterLength: typeof payload[key] === 'string' ? payload[key].length : undefined }])) }); }
    if (external) await intercepted.fulfill({ status: 204, body: '' }); else await intercepted.abort('blockedbyclient');
  });
}
export const qaHeader = (page: Page) => page.locator('header button[data-slot="dropdown-menu-trigger"]').filter({
  has: page.getByText(company(), { exact: true }).or(page.getByText(`${company()} Settings QA`, { exact: true })),
});
export async function verifyCompany(page: Page) {
  // Grounded in the inspected header: the trigger contains a hidden initial
  // and a visible company span. Match the exact span, not a hidden-icon name.
  await expect(qaHeader(page), 'Only the configured disposable QA company is in scope').toBeVisible({ timeout: 30_000 });
}
export async function route(page: Page, path = '/settings') {
  const loadedSettings = path === '/settings' ? page.waitForResponse(response => response.request().method() === 'GET' && new URL(response.url()).pathname === '/app/api/v1/settings', { timeout: 30_000 }).catch(() => null) : null;
  // A delayed third-party/deferred asset must not hold a usable app behind
  // DOMContentLoaded. Wait for our actual UI and settings data instead.
  await page.goto(appPath(path, required('BASE_URL')), { waitUntil: 'commit' });
  if (loadedSettings) {
    const response = await loadedSettings;
    expect(response, 'Settings snapshot requires a completed application GET, not placeholder inputs').not.toBeNull();
    expect(response!.ok()).toBe(true); await response!.finished();
    await verifyCompany(page);
    const api = await apiSnapshot(page.context());
    if (api?.companyName) await expect(main(page).locator('#company-name')).toHaveValue(api.companyName);
  } else await verifyCompany(page);
}
export async function signIn(page: Page) {
  await page.goto(appPath('/login', required('BASE_URL')), { waitUntil: 'commit' });
  await page.getByLabel('Email Address', { exact: true }).fill(required('PRODUCT_TEST_EMAIL'));
  await page.getByLabel('Password', { exact: true }).fill(required('PRODUCT_TEST_PASSWORD'));
  await page.getByRole('button', { name: /^(Sign In|Se connecter)$/ }).click();
  const chooser = page.getByRole('heading', { name: 'Choose a business', exact: true });
  await expect(chooser.or(qaHeader(page)).first()).toBeVisible({ timeout: 30_000 });
  if (await chooser.isVisible()) {
    const qaHeading = page.getByRole('heading', { name: company(), exact: true }).or(page.getByRole('heading', { name: `${company()} Settings QA`, exact: true }));
    await page.getByRole('button').filter({ has: qaHeading }).click();
  }
  await verifyCompany(page);
}
export async function reloadSettings(page: Page) {
  const loaded = page.waitForResponse(response => response.request().method() === 'GET' && new URL(response.url()).pathname === '/app/api/v1/settings', { timeout: 30_000 });
  await page.reload({ waitUntil: 'commit' });
  const response = await loaded;
  expect(response.ok()).toBe(true); await response.finished();
  await verifyCompany(page);
  await expect(main(page).locator('#company-name')).toBeVisible({ timeout: 30_000 });
}
export async function openTab(page: Page, tab: 'company' | 'localization' | 'advanced', fresh = false) {
  // Tab navigation within the current settings screen needs no document reload.
  // Snapshot readers explicitly request a fresh navigation to prove persistence.
  if (fresh || page.url() !== appPath('/settings', required('BASE_URL'))) await route(page);
  else await verifyCompany(page);
  await main(page).locator(`[role="tab"][id$="-trigger-${tab}"]`).click();
  const panel = main(page).locator(`[role="tabpanel"][id$="-content-${tab}"]`);
  await expect(panel).toBeVisible(); return panel;
}
export const profileFields = ['Company Name', 'Company Email', 'Phone Number', 'Website', 'Business Address', 'Address Line 2', 'Tax ID / EIN', 'City', 'State / Province', 'ZIP / Postal Code'];
// User-confirmed contract (20 Oct 2026): a company-level on/off control,
// not selectable precision or currency-symbol position. Its persistence
// adapter needs the missing Company control before deeper on/off checks can run.
export const decimalToggle = (panel: import('playwright/test').Locator) =>
  panel.getByRole('switch', { name: /decimal/i }).or(panel.getByRole('checkbox', { name: /decimal/i }));
export async function profileState(page: Page, fresh = true) {
  const panel = await openTab(page, 'company', fresh), data: Record<string, string> = {};
  for (const label of profileFields) data[label] = await panel.getByLabel(label, { exact: true }).inputValue();
  return data;
}
export async function taxState(page: Page, fresh = true) {
  const panel = await openTab(page, 'company', fresh);
  return { enabled: await panel.locator('#tax-registered').isChecked(), rate: await panel.locator('#tax-percentage').inputValue(), brn: await panel.locator('#business-registration-number').inputValue(), header: await panel.locator('#invoice-header').inputValue(), footer: await panel.locator('#invoice-footer').inputValue() };
}
export async function localizationState(page: Page, fresh = true) {
  const panel = await openTab(page, 'localization', fresh);
  const data: Record<string, string> = {};
  for (const id of ['loc-currency', 'loc-country', 'timezone', 'date-format', 'time-format', 'loc-language']) data[id] = (await panel.locator(`#${id}`).innerText()).trim();
  return data;
}
export async function screenshot(page: Page, info: TestInfo, name: string) {
  const path = info.outputPath(`${name}.png`); await page.screenshot({ path, fullPage: true }); await info.attach(name, { path, contentType: 'image/png' });
}
export async function save(page: Page, operation: string, button: import('playwright/test').Locator) {
  await verifyCompany(page); await apiSnapshot(page.context()); pending(true); operations.set(page.context(), operation);
  const methodsBefore = JSON.parse(JSON.stringify((await apiSnapshot(page.context()))?.paymentMethods || []));
  try {
    const requests: string[] = [];
    const listener = (req: import('playwright/test').Request) => { if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method())) requests.push(new URL(req.url()).pathname); };
    page.on('request', listener);
    try {
      const responsePromise = page.waitForResponse(response => response.request().method() === 'PUT' && new URL(response.url()).pathname === '/app/api/v1/settings', { timeout: 10_000 }).catch(() => null);
      await button.click();
      const response = await responsePromise;
      expect(response, 'AUTOMATION SAFETY BLOCKER: settings save request did not reach server; inspect settings-run journal before reporting a persistence bug').not.toBeNull();
      expect(response!.ok(), 'Settings save must return successful HTTP status').toBe(true);
      await response!.finished();
      await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/saved|updated|enregistr|mis à jour/i);
      // The deployed settings DTO projects payment methods to four UI fields.
      // Prove that omitting its response-only metadata did not change methods.
      const verification = await page.context().request.get(appPath('/api/v1/settings', required('BASE_URL')), { headers: settingsHeaders.get(page.context()) });
      expect(verification.ok()).toBe(true);
      const find = (value: any): any => {
        if (!value || typeof value !== 'object') return;
        if ('companyName' in value && 'taxRegistered' in value) return value;
        for (const child of Object.values(value)) { const found = find(child); if (found) return found; }
      };
      const persisted = find(await verification.json());
      expect(persisted?.paymentMethods, 'Unrelated settings saves must preserve all payment-method identities and response metadata').toEqual(methodsBefore);
    } finally { page.off('request', listener); record({ operation, observedWritePaths: requests }); }
  } finally { operations.delete(page.context()); }
}
export async function setProfile(page: Page, fields: Record<string, string>) {
  // Each separate write scope starts from a current GET. Otherwise a previous
  // successful profile save can look like an unrelated tax-payload change.
  const panel = await openTab(page, 'company', true);
  for (const [label, value] of Object.entries(fields)) await panel.getByLabel(label, { exact: true }).fill(value);
  await save(page, 'profile', panel.getByRole('button', { name: 'Save Changes', exact: true }));
}
export async function setTax(page: Page, state: any) {
  const panel = await openTab(page, 'company', true);
  await panel.locator('#tax-registered').setChecked(state.enabled); await panel.locator('#tax-percentage').fill(state.rate);
  await panel.locator('#business-registration-number').fill(state.brn);
  await save(page, 'tax', panel.getByRole('button', { name: 'Save Settings', exact: true }));
}
export async function choose(page: Page, id: string, option: string) {
  await page.locator(`#${id}`).click(); await page.getByRole('option', { name: option, exact: true }).click();
}
export async function language(page: Page, code: 'en' | 'fr', persist = false) {
  const panel = await openTab(page, 'localization');
  const selected = await panel.locator('#loc-language').innerText();
  if (!selected.includes(code === 'fr' ? 'Français' : 'English')) {
    pending(true); operations.set(page.context(), 'language');
    try {
      const sync = page.waitForResponse(response => response.request().method() === 'PUT' && new URL(response.url()).pathname === '/app/api/v1/auth/language');
      await choose(page, 'loc-language', code === 'fr' ? '🇫🇷 Français' : '🇬🇧 English');
      const response = await sync;
      expect(response.ok(), 'Language preference synchronization must succeed before navigation').toBe(true);
      await response.finished();
    }
    finally { operations.delete(page.context()); }
  }
  // Verify the functional switch independently. The document-language
  // accessibility regression has its own test so it cannot mask translation,
  // persistence and integrated-flow checks behind the same failure.
  await expect(main(page).getByRole('heading', { name: code === 'fr' ? 'Paramètres' : 'Settings', exact: true })).toBeVisible();
  if (persist) await save(page, 'localization', panel.getByRole('button', { name: /^(Save Settings|Enregistrer les paramètres)$/ }));
}
export async function appearance(page: Page, mode: 'light' | 'dark' | 'system') {
  const root = page.locator('html');
  await page.getByRole('banner').getByRole('button').filter({ hasText: /Admin|Manager|Cashier/ }).last().click();
  const expected = new RegExp(`^Theme: ${mode[0].toUpperCase() + mode.slice(1)}\\.`);
  operations.set(page.context(), 'theme');
  try {
    for (let step = 0; step < 3 && !await page.getByRole('button', { name: expected }).isVisible(); step++) {
      pending(true);
      const sync = page.waitForResponse(response => response.request().method() === 'PUT' && new URL(response.url()).pathname === '/app/api/v1/auth/theme');
      await page.getByRole('button', { name: /^Theme:/ }).click();
      const response = await sync;
      expect(response.ok(), 'Theme preference synchronization must succeed before navigation').toBe(true);
      await response.finished();
      record({ category: 'theme-preference-saved', testMode: mode, status: response.status(), payload: response.request().postDataJSON() });
    }
    await expect(page.getByRole('button', { name: expected })).toBeVisible();
  } finally { operations.delete(page.context()); }
  await page.keyboard.press('Escape');
  if (mode === 'dark') await expect(root).toHaveClass(/\bdark\b/);
  if (mode === 'light') await expect(root).not.toHaveClass(/\bdark\b/);
}
export async function theme(page: Page, dark: boolean) { await appearance(page, dark ? 'dark' : 'light'); }
export async function restore(page: Page) {
  if (!existsSync(baselinePath)) return;
  const data = baseline(); expect(data.origin).toBe(new URL(required('BASE_URL')).origin); expect(data.company).toBe(company());
  // Normalize labels through the supported language control, not hidden storage.
  await language(page, 'en');
  if (JSON.stringify(await profileState(page, false)) !== JSON.stringify(data.profile)) { await setProfile(page, data.profile); expect(await profileState(page)).toEqual(data.profile); }
  if (JSON.stringify(await taxState(page, false)) !== JSON.stringify(data.tax)) {
    await setTax(page, data.tax);
    let actual = await taxState(page);
    if (actual.brn !== data.tax.brn && data.tax.brn === '' && [null, ''].includes(data.api.businessRegistrationNumber)) {
      // Compensation only: replay the observed full UI payload, replacing
      // BRN with its original blank value. The same guard verifies unrelated
      // settings against the current GET; never weaken the functional test.
      const payload = { ...lastSavePayload.get(page.context()), businessRegistrationNumber: data.api.businessRegistrationNumber };
      const url = appPath('/api/v1/settings', required('BASE_URL'));
      expect(settingsRequestAllowed(url, 'PUT', required('BASE_URL'), 'tax', payload, await apiSnapshot(page.context()))).toBe(true);
      const headers = settingsHeaders.get(page.context());
      expect(headers?.authorization, 'Recovery requires the existing QA session; never create credentials').toBeTruthy();
      const response = await page.context().request.put(url, { headers, data: payload });
      const result = await response.json();
      record({ category: 'exact-baseline-compensation', field: 'businessRegistrationNumber', status: response.status(), success: result.success, code: result.code, message: result.message, headerNames: Object.keys(headers!) });
      expect(response.ok(), 'Exact-original QA BRN compensation must succeed').toBe(true);
      actual = await taxState(page);
      if (actual.brn !== '' && data.api.businessRegistrationNumber === '') {
        const nullablePayload = { ...payload, businessRegistrationNumber: null };
        expect(settingsRequestAllowed(url, 'PUT', required('BASE_URL'), 'tax', nullablePayload, await apiSnapshot(page.context()))).toBe(true);
        const nullableResponse = await page.context().request.put(url, { headers: settingsHeaders.get(page.context()), data: nullablePayload });
        record({ category: 'nullable-blank-compensation', field: 'businessRegistrationNumber', status: nullableResponse.status() });
        expect(nullableResponse.ok(), 'Nullable optional BRN recovery must succeed').toBe(true);
        actual = await taxState(page);
      }
    }
    expect(actual, 'Original tax identity must be restored; do not recapture a dirty baseline').toEqual(data.tax);
  }
  // Saving App Display also persists the company language. Restore both the
  // saved company setting and browser display preference, not just the UI.
  const currentApi = await apiSnapshot(page.context());
  if (currentApi?.language !== data.api.language) {
    expect(['en', 'fr']).toContain(data.api.language);
    await language(page, data.api.language, true);
    await localizationState(page);
    expect((await apiSnapshot(page.context())).language, 'Saved company language must be restored after i18n tests').toBe(data.api.language);
  }
  await language(page, data.language);
  await theme(page, data.dark);
  // Locale configuration fields are not altered by the basic language action.
  const loc = await localizationState(page, false); expect(loc).toEqual(data.localization);
  pending(false);
}
export async function auditBaseline(page: Page) {
  const data = baseline();
  expect(await profileState(page), 'RECOVERY BLOCKER: QA company identity does not match the preserved original baseline').toEqual(data.profile);
  const tax = await taxState(page, false);
  await page.locator('#business-registration-number').scrollIntoViewIfNeeded();
  expect(tax, 'RECOVERY BLOCKER: QA tax identity must match the preserved approved baseline; do not silently recapture changed data').toEqual(data.tax);
  expect(await localizationState(page, false)).toEqual(data.localization);
  // Appearance is a browser/account preference, not company identity. Restore
  // it after the fresh audit navigation, rather than require a new browser's
  // startup class to equal another context's captured preference. Same-session
  // reload persistence remains an independent, explicit failing regression.
  await theme(page, data.dark);
  pending(false);
}
export async function adoptApprovedBrn(page: Page) {
  const saved = baseline();
  expect(saved.company).toBe(company()); expect(saved.origin).toBe(new URL(required('BASE_URL')).origin);
  const profile = await profileState(page), tax = await taxState(page, false), localization = await localizationState(page, false);
  const api = await apiSnapshot(page.context());
  const observed = { origin: new URL(required('BASE_URL')).origin, company: company(), profile, tax, localization,
    dark: /\bdark\b/.test(await page.locator('html').getAttribute('class') || ''), language: await page.locator('html').getAttribute('lang'), apiBrn: api?.businessRegistrationNumber };
  const accepted = acceptApprovedQaBrn(saved, observed, process.env.SETTINGS_ACCEPT_QA_BRN);
  const backup = `playwright/.auth/settings-baseline-before-approved-brn-${Date.now()}.json`;
  copyFileSync(baselinePath, backup);
  accepted.brnAcceptance = { value: 'QA-BRN-2026', previousValue: saved.tax.brn, acceptedAt: new Date().toISOString(), backup, authority: 'Explicit user approval in this chat; BRN-clearing regression retained' };
  saveBaseline(accepted);
  record({ category: 'user-approved-baseline-change', field: 'BRN', previousValue: saved.tax.brn, approvedValue: 'QA-BRN-2026', originalPreservedPrivately: true });
}
export async function isolated(page: Page, info: TestInfo, run: () => Promise<void>) {
  try { await run(); }
  catch (error) { await screenshot(page, info, 'settings-failure-before-restore').catch(() => undefined); throw error; }
  finally {
    const recovery = await page.context().newPage();
    try { await restore(recovery); } finally { await recovery.close(); }
  }
}
export const test = base.extend<{ settingsScope: void }>({
  settingsScope: [async ({ context }, use, info) => {
    info.setTimeout(info.title.includes('@full-flow') ? 300_000 : 180_000);
    validateSecurityTarget(required('BASE_URL')); expect(baseline().pending, 'Pending previous recovery must be completed before another test').toBe(false);
    await guard(context, info);
    try { await use(); }
    finally {
      // Fixture teardown has a separate time budget, so a timed-out test cannot
      // strand the QA baseline merely because its in-body finally was cancelled.
      if (baseline().pending) {
        const recovery = await context.newPage();
        try { await restore(recovery); } finally { await recovery.close(); }
      }
    }
  }, { auto: true }],
});
