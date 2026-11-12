import test from 'node:test';
import assert from 'node:assert/strict';
import { helpRequestAllowed, readBuildMetadata, helpResultCategory } from '../helpers/help-safety.mjs';
import { readFileSync } from 'node:fs';
const base = 'https://nexstock.stylotech.mu/app';
for (const path of ['login', 'help-center', 'settings', 'api/v1/settings']) test(`legal suite permits read ${path}`, () => {
  assert.equal(helpRequestAllowed(`${base}/${path}`, 'GET', base), true);
});
test('public legal clicks cannot authenticate or select a business', () => {
  for (const path of ['login', 'select-business']) assert.equal(helpRequestAllowed(`${base}/api/v1/auth/${path}`, 'POST', base), false);
});
test('explicit session operations only permit their own endpoints', () => {
  assert.equal(helpRequestAllowed(`${base}/api/v1/auth/login`, 'POST', base, 'signin'), true);
  assert.equal(helpRequestAllowed(`${base}/api/v1/auth/select-business`, 'POST', base, 'signin'), true);
  assert.equal(helpRequestAllowed(`${base}/api/v1/auth/logout`, 'POST', base, 'logout'), true);
  assert.equal(helpRequestAllowed(`${base}/api/v1/auth/login`, 'POST', base, 'logout'), false);
  assert.equal(helpRequestAllowed(`${base}/api/v1/auth/logout`, 'POST', base, 'signin'), false);
  assert.equal(helpRequestAllowed('https://other.invalid/app/api/v1/auth/login', 'POST', base, 'signin'), false);
});
test('company policy edits, acceptance, credentials and transactions are forbidden', () => {
  for (const path of ['settings', 'auth/accept-terms', 'auth/register', 'auth/reset-password', 'sales', 'payments']) {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) assert.equal(helpRequestAllowed(`${base}/api/v1/${path}`, method, base, 'signin'), false);
  }
  assert.equal(helpRequestAllowed(`${base}/api/v1/auth/forgot-password`, 'GET', base), false);
});
test('build parsing requires labelled metadata, not arbitrary hex or release-note prose', () => {
  assert.deepEqual(readBuildMetadata('Version: v1.2.3\nCommit hash: abcdef123456\n© 2026 NexStock. All rights reserved.'), {
    version: '1.2.3', commit: 'abcdef123456', copyright: '© 2026 NexStock. All rights reserved.',
  });
  assert.deepEqual(readBuildMetadata('Release Notes See what is new in each version. Build ID 1234567'), { version: null, commit: null, copyright: null });
});

test('Help outcomes separate incomplete prerequisites from confirmed defects', () => {
  assert.equal(helpResultCategory('passed'), 'PASS');
  assert.equal(helpResultCategory('failed', [{ type: 'prerequisite-blocked' }]), 'BLOCKED');
  assert.equal(helpResultCategory('failed', [{ type: 'confirmed-bug' }, { type: 'prerequisite-blocked' }]), 'APPLICATION BUG');
  assert.equal(helpResultCategory('failed'), 'REVIEW REQUIRED');
});

test('Help traceability uses feature and case identities, never array positions', () => {
  const features = JSON.parse(readFileSync(new URL('../data/feature-matrix.json', import.meta.url), 'utf8'));
  const cases = JSON.parse(readFileSync(new URL('../data/phase1-cases.json', import.meta.url), 'utf8'));
  for (const feature of features.filter(f => f.automation?.includes('tests/phase1/help/'))) assert.match(feature.id, /^F30-[abc]$/);
  for (const item of cases.filter(c => c.automation?.includes('tests/phase1/help/'))) {
    assert.match(item.id, /^P1-06[123]$/); assert.match(item.feature, /^F30-[abc]$/);
  }
  for (const id of ['P1-061','P1-062','P1-063']) assert.match(cases.find(c => c.id === id).automation, /tests\/phase1\/help\//);
});
