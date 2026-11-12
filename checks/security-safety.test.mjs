import test from 'node:test';
import assert from 'node:assert/strict';
import { securityRequestAllowed, validateSecurityTarget } from '../helpers/security-safety.mjs';

const base = 'https://nexstock.stylotech.mu/app';
for (const path of ['/app/api/v1/auth/login', '/app/api/v1/auth/logout', '/app/api/v1/auth/select-business']) {
  test(`security guard permits routine session action ${path}`, () => assert.equal(securityRequestAllowed(`${base.slice(0, -4)}${path}`, 'POST', base), true));
}
for (const path of ['/app/api/v1/auth/reset-password', '/app/api/v1/users/me/password', '/app/api/v1/auth/forgot-password', '/app/api/v1/auth/register', '/app/api/v1/settings', '/app/api/v1/users', '/app/api/v1/auth/logout-all']) {
  test(`unattended security guard blocks ${path}`, () => assert.equal(securityRequestAllowed(`${base.slice(0, -4)}${path}`, 'POST', base), false));
}
test('reset-code GET cannot send security email in unattended mode', () => assert.equal(securityRequestAllowed(`${base}/api/v1/auth/forgot-password`, 'GET', base), false));
test('unattended reset GET and incidental language writes are blocked too', () => {
  assert.equal(securityRequestAllowed(`${base}/api/v1/auth/reset`, 'GET', base), false);
  assert.equal(securityRequestAllowed(`${base}/api/v1/auth/language`, 'PUT', base), false);
});
test('public forgot-password document remains readable', () => assert.equal(securityRequestAllowed(`${base}/forgot-password`, 'GET', base), true));
test('manual handoff permits credential endpoint only in its separate context', () => {
  assert.equal(securityRequestAllowed(`${base}/api/v1/auth/reset-password`, 'POST', base, true), true);
  assert.equal(securityRequestAllowed(`${base}/api/v1/settings`, 'PUT', base, true), false);
  assert.equal(securityRequestAllowed(`${base}/api/v1/auth/register`, 'POST', base, true), false);
});
test('third-party POST is blocked', () => assert.equal(securityRequestAllowed('https://other.invalid/auth/login', 'POST', base), false));
test('security suite retains the disposable production opt-in guard', () => assert.throws(() => validateSecurityTarget(base, { ALLOWED_ORIGINS: 'https://nexstock.stylotech.mu', TARGET_ENV: 'production', ALLOW_WRITES: 'true', PRODUCT_TEST_ACCOUNT_DISPOSABLE: 'true' }), /forbidden/));
test('production credentials cannot use HTTP even with mutation opt-in', () => assert.throws(() => validateSecurityTarget('http://nexstock.stylotech.mu/app', { ALLOWED_ORIGINS: 'http://nexstock.stylotech.mu', TARGET_ENV: 'production', ALLOW_PRODUCTION_PRODUCT_TESTS: 'true', ALLOW_WRITES: 'true', PRODUCT_TEST_ACCOUNT_DISPOSABLE: 'true' }), /HTTPS/));
