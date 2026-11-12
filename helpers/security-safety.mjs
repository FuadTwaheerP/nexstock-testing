import { validateProductTestTarget } from './safety.mjs';

export function validateSecurityTarget(raw, env = process.env) {
  const url = validateProductTestTarget(raw, env);
  if (env.TARGET_ENV === 'production' && url.protocol !== 'https:') throw new Error('Production authentication requires HTTPS');
  return url;
}

// Only routine sign-in, sign-out and business selection may write in the
// unattended suite. Never allow account creation, policy edits or credential
// changes as an accidental consequence of clicking a form button.
export function securityRequestAllowed(raw, method, base, humanHandoff = false) {
  const url = new URL(raw);
  const target = new URL(base);
  const verb = method.toUpperCase();
  const read = ['GET', 'HEAD', 'OPTIONS'].includes(verb);
  if (url.origin !== target.origin) return read;
  const api = /\/api\//i.test(url.pathname);
  const credentials = /(?:password|reset|forgot|register|signup|revoke|logout-all)/i.test(url.pathname);
  if (api && credentials) {
    return humanHandoff && /(?:password|reset|forgot)/i.test(url.pathname) && !/(?:register|signup|revoke|logout-all)/i.test(url.pathname);
  }
  if (read) return true;
  return /\/(?:login|signin|sign-in|logout|signout|sign-out|(?:select|switch)-(?:business|company|tenant))(?:\/|$)/i.test(url.pathname);
}
