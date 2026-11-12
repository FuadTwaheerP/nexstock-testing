import test from 'node:test';
import assert from 'node:assert/strict';
import { acceptApprovedQaBrn } from '../helpers/settings-baseline.mjs';

const saved = { origin: 'https://nexstock.stylotech.mu', company: 'Nexstock QA Company', pending: true, profile: { name: 'QA' }, tax: { enabled: false, rate: '0', brn: '' }, localization: { currency: 'MUR' }, language: 'en', dark: true, api: { businessRegistrationNumber: '', passwordMinLength: 8 } };
const observed = { ...saved, tax: { ...saved.tax, brn: 'QA-BRN-2026' }, apiBrn: 'QA-BRN-2026' };
test('accepts only approved BRN and preserves original object and unrelated API fields', () => {
  const next = acceptApprovedQaBrn(saved, observed, 'QA-BRN-2026');
  assert.equal(next.pending, false); assert.equal(next.tax.brn, 'QA-BRN-2026');
  assert.equal(saved.tax.brn, ''); assert.equal(next.api.passwordMinLength, 8);
});
test('refuses absent or different approval', () => {
  for (const value of [undefined, '', 'OTHER']) assert.throws(() => acceptApprovedQaBrn(saved, observed, value));
});
for (const key of ['company', 'origin', 'profile', 'localization', 'language', 'dark']) test(`refuses unrelated ${key} change`, () => {
  assert.throws(() => acceptApprovedQaBrn(saved, { ...observed, [key]: 'different' }, 'QA-BRN-2026'));
});
test('refuses additional tax or unexpected server BRN changes', () => {
  assert.throws(() => acceptApprovedQaBrn(saved, { ...observed, tax: { ...observed.tax, rate: '15' } }, 'QA-BRN-2026'));
  assert.throws(() => acceptApprovedQaBrn(saved, { ...observed, apiBrn: 'OTHER' }, 'QA-BRN-2026'));
});
