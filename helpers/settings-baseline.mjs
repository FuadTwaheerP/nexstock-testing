import { isDeepStrictEqual } from 'node:util';

// One-time acceptance explicitly authorized by the user. This is not a general
// "accept current state" switch: every other captured setting must still match.
export function acceptApprovedQaBrn(saved, observed, approvedBrn) {
  if (approvedBrn !== 'QA-BRN-2026' || !saved.pending) throw new Error('No matching pending QA BRN approval');
  const expectedTax = { ...saved.tax, brn: approvedBrn };
  for (const key of ['origin', 'company', 'profile', 'localization', 'dark', 'language']) {
    if (!isDeepStrictEqual(saved[key], observed[key])) throw new Error(`Cannot accept unrelated baseline difference: ${key}`);
  }
  if (!isDeepStrictEqual(expectedTax, observed.tax)) throw new Error('Only the approved QA BRN may differ in tax settings');
  if (![null, '', approvedBrn].includes(observed.apiBrn)) throw new Error('Unexpected server BRN during approval');
  return { ...saved, tax: expectedTax, api: { ...saved.api, businessRegistrationNumber: observed.apiBrn }, pending: false };
}
