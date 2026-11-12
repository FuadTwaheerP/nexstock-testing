import { securityRequestAllowed } from './security-safety.mjs';

// Viewing legal information must never submit credentials, accept a contract,
// edit company policy text, or invoke exports/health checks as a side effect.
export function helpRequestAllowed(raw, method, base, operation) {
  const url = new URL(raw), target = new URL(base), verb = method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(verb)) return securityRequestAllowed(raw, verb, base);
  if (url.origin !== target.origin || verb !== 'POST') return false;
  const api = `${target.pathname.replace(/\/$/, '')}/api/v1/auth/`;
  return operation === 'signin' && ['login', 'select-business'].some(path => url.pathname === api + path) ||
    operation === 'logout' && url.pathname === api + 'logout';
}

export function readBuildMetadata(text) {
  return {
    version: text.match(/\b(?:platform\s+|system\s+|application\s+|app\s+)?version\s*[:#]?\s*v?(\d+(?:\.\d+){0,3}(?:[-+][\w.-]+)?)/i)?.[1] || null,
    commit: text.match(/\b(?:commit(?:\s+hash)?|git\s+(?:revision|commit))\s*[:#]?\s*([a-f\d]{7,64})\b/i)?.[1] || null,
    copyright: text.match(/(?:©|copyright)\s*(?:\d{4}(?:\s*[-–]\s*\d{4})?)\s+NexStock[^\n]*/i)?.[0] || null,
  };
}

// A combined flow can contain both a real UI defect and unavailable legal
// prerequisites. Do not let the latter hide the former, or turn either green.
export function helpResultCategory(status, annotations = []) {
  if (status === 'passed') return 'PASS';
  if (annotations.some(a => a.type === 'confirmed-bug')) return 'APPLICATION BUG';
  if (annotations.some(a => a.type === 'prerequisite-blocked')) return 'BLOCKED';
  return 'REVIEW REQUIRED';
}
