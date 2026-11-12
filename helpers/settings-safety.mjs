import { securityRequestAllowed } from './security-safety.mjs';

// Settings writes are denied unless a UI save has explicitly opened the
// corresponding operation. Credentials, security, payments and deletion are
// never part of this suite. Extend adapters only after observing actual UI.
const mutable = {
  profile: ['companyName', 'companyEmail', 'website', 'phone', 'address', 'addressLine2', 'city', 'state', 'zipCode', 'taxNumber', 'decimalPlaces'],
  tax: ['taxRegistered', 'taxPercentage', 'businessRegistrationNumber', 'vatNumber', 'pricesIncludeTax'],
  localization: ['currency', 'language', 'country', 'timezone', 'dateFormat', 'timeFormat'],
};
const same = (a, b) => {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;
  const keys = Object.keys(a).sort();
  return JSON.stringify(keys) === JSON.stringify(Object.keys(b).sort()) && keys.every(key => same(a[key], b[key]));
};
const optionalEmpty = ['addressLine2', 'industry', 'numberOfEmployees', 'defaultBranch', 'termsAndConditions', 'privacyPolicy', 'companyEmail', 'website', 'vatNumber', 'taxNumber', 'businessRegistrationNumber'];
const samePaymentProjection = (proposed, original) => {
  const ui = ['id', 'name', 'enabled', 'icon'];
  const responseOnly = ['type', 'requires_reference', 'requires_terminal_id'];
  return Array.isArray(proposed) && Array.isArray(original) && proposed.length === original.length && proposed.every((method, index) =>
    method && original[index] && Object.keys(method).length === ui.length && ui.every(key => key in method && same(method[key], original[index][key])) &&
    Object.keys(original[index]).every(key => ui.includes(key) || responseOnly.includes(key)));
};
export function settingsRequestAllowed(raw, method, base, operation, payload, original) {
  if (securityRequestAllowed(raw, method, base)) return true;
  const url = new URL(raw), target = new URL(base);
  if (url.origin !== target.origin || method.toUpperCase() !== 'PUT') return false;
  if (url.pathname === `${target.pathname.replace(/\/$/, '')}/api/v1/auth/language`) {
    return payload && Object.keys(payload).length === 1 && ['en', 'fr'].includes(payload.language);
  }
  if (url.pathname === `${target.pathname.replace(/\/$/, '')}/api/v1/auth/theme`) {
    return operation === 'theme' && payload && Object.keys(payload).length === 1 && ['light', 'dark', 'system'].includes(payload.theme);
  }
  if (url.pathname !== `${target.pathname.replace(/\/$/, '')}/api/v1/settings` || !mutable[operation] || !original || !payload) return false;
  // The real UI sends a bulk settings object, including security/legal fields.
  // Refuse to transmit any changed unrelated field, rather than strip it and
  // accidentally test a request different from what the real UI submits.
  return Object.keys(payload).every(key => mutable[operation].includes(key) || same(payload[key], original[key]) ||
    (key === 'paymentMethods' && samePaymentProjection(payload[key], original[key])) ||
    (optionalEmpty.includes(key) && [null, ''].includes(payload[key]) && [null, ''].includes(original[key])));
}
