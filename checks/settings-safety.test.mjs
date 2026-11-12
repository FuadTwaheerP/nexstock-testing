import test from 'node:test';
import assert from 'node:assert/strict';
import { settingsRequestAllowed } from '../helpers/settings-safety.mjs';

const base = 'https://nexstock.stylotech.mu/app';
const path = `${base}/api/v1/settings`;
const original = { companyName: 'QA', phone: '123', taxRegistered: false, taxPercentage: 0, taxNumber: '', businessRegistrationNumber: '', language: 'en', currency: 'MUR', passwordMinLength: 8, maintenanceMode: false, privacyPolicy: null, receiptCustomization: { width: 80, logo: true } };
const allowed = (operation, payload, method = 'PUT', url = path) => settingsRequestAllowed(url, method, base, operation, payload, original);
test('settings saves require explicit operation and a server baseline', () => {
  assert.equal(allowed(undefined, original), false);
  assert.equal(settingsRequestAllowed(path, 'PUT', base, 'profile', original), false);
});
test('profile updates permit QA identity without unrelated changes', () => assert.equal(allowed('profile', { ...original, companyName: 'QA Settings', phone: '456' }), true));
test('tax settings permit VAT15 and BRN', () => assert.equal(allowed('tax', { ...original, taxRegistered: true, taxPercentage: 15, businessRegistrationNumber: 'QA' }), true));
test('localization permits currency and language', () => assert.equal(allowed('localization', { ...original, currency: 'USD', language: 'fr' }), true));
for (const field of ['passwordMinLength', 'maintenanceMode', 'privacyPolicy', 'receiptCustomization']) test(`every operation rejects unrelated ${field} changes`, () => {
  const value = field === 'passwordMinLength' ? 1 : field === 'maintenanceMode' ? true : field === 'privacyPolicy' ? 'different terms' : { width: 58, logo: true };
  for (const scope of ['profile', 'tax', 'localization']) assert.equal(allowed(scope, { ...original, [field]: value }), false);
});
test('does not permit cross-scope settings changes', () => {
  assert.equal(allowed('profile', { ...original, taxPercentage: 15 }), false);
  assert.equal(allowed('tax', { ...original, companyName: 'Wrong' }), false);
});
test('only empty optional null/string normalization is accepted', () => {
  assert.equal(allowed('profile', { ...original, privacyPolicy: '' }), true);
  assert.equal(allowed('profile', { ...original, privacyPolicy: ' ' }), false);
});
test('same nested values do not depend on object key order', () => assert.equal(allowed('profile', { ...original, receiptCustomization: { logo: true, width: 80 } }), true));
test('permits only en/fr language synchronization payload', () => {
  const url = `${base}/api/v1/auth/language`;
  assert.equal(allowed(undefined, { language: 'fr' }, 'PUT', url), true);
  assert.equal(allowed(undefined, { language: 'en', password: 'x' }, 'PUT', url), false);
  assert.equal(allowed(undefined, { language: 'de' }, 'PUT', url), false);
});
test('theme synchronization requires its scope and exact light/dark/system payload', () => {
  const url = `${base}/api/v1/auth/theme`;
  for (const theme of ['light', 'dark', 'system']) assert.equal(allowed('theme', { theme }, 'PUT', url), true);
  assert.equal(allowed(undefined, { theme: 'dark' }, 'PUT', url), false);
  assert.equal(allowed('theme', { theme: 'unrecognized' }, 'PUT', url), false);
  assert.equal(allowed('theme', { theme: 'dark', password: 'x' }, 'PUT', url), false);
  assert.equal(allowed('theme', { theme: 'dark' }, 'POST', url), false);
  assert.equal(allowed('theme', { theme: 'dark' }, 'PUT', 'https://example.com/app/api/v1/auth/theme'), false);
});
test('settings permits only the observed unchanged payment-method UI projection', () => {
  const baseline = { ...original, paymentMethods: [{ id: '1', name: 'Cash', enabled: true, icon: 'banknote', type: 'cash', requires_reference: false, requires_terminal_id: false }] };
  const projected = { id: '1', name: 'Cash', enabled: true, icon: 'banknote' };
  const allow = methods => settingsRequestAllowed(path, 'PUT', base, 'profile', { ...baseline, paymentMethods: methods }, baseline);
  assert.equal(allow([projected]), true);
  for (const change of [{ id: '2' }, { name: 'Other' }, { enabled: false }, { icon: 'card' }, { type: 'other' }]) assert.equal(allow([{ ...projected, ...change }]), false);
  assert.equal(allow([]), false);
  assert.equal(allow([projected, projected]), false);
});
for (const endpoint of ['users/me/password', 'auth/register', 'sales', 'settings/security', 'businesses', 'settings']) test(`rejects out-of-scope deletion ${endpoint}`, () => assert.equal(allowed('profile', original, 'DELETE', `${base}/api/v1/${endpoint}`), false));
test('rejects external settings writes', () => assert.equal(allowed('profile', original, 'PUT', 'https://example.com/app/api/v1/settings'), false));
