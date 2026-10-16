export function validateTarget(raw, env = process.env, write = false) {
  const url = new URL(raw);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid target URL');
  const allowed = (env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:8080').split(',').map(v => v.trim());
  if (!allowed.includes(url.origin)) throw new Error('Target origin is not explicitly allowlisted');
  if (write && (url.hostname.toLowerCase() === 'nexstock.stylotech.mu' || !['local','staging'].includes(env.TARGET_ENV))) throw new Error('Writes are forbidden on production or an unknown environment');
  if (write && (env.ALLOW_WRITES !== 'true' || !env.BUSINESS_ID || env.DISPOSABLE_BUSINESS_ID !== env.BUSINESS_ID)) throw new Error('Writes require an explicitly identified disposable business');
  return url;
}
export function validateOnboardingTarget(raw, env = process.env) {
  const url = validateTarget(raw, env);
  const productionOverride = env.TARGET_ENV === 'production' && env.ALLOW_PRODUCTION_ONBOARDING === 'true';
  if (!productionOverride && (url.hostname.toLowerCase() === 'nexstock.stylotech.mu' || !['local', 'staging'].includes(env.TARGET_ENV))) {
    throw new Error('Onboarding writes are forbidden on production or an unknown environment');
  }
  if (env.ALLOW_WRITES !== 'true' || env.ONBOARDING_ACCOUNT_DISPOSABLE !== 'true') {
    throw new Error('Onboarding requires explicit write opt-in and a disposable account');
  }
  return url;
}
export function validateProductTestTarget(raw, env = process.env) {
  const url = validateTarget(raw, env);
  const productionOverride = env.TARGET_ENV === 'production' && env.ALLOW_PRODUCTION_PRODUCT_TESTS === 'true';
  if (!productionOverride && (url.hostname.toLowerCase() === 'nexstock.stylotech.mu' || !['local', 'staging'].includes(env.TARGET_ENV))) {
    throw new Error('Product test writes are forbidden on production or an unknown environment');
  }
  if (env.ALLOW_WRITES !== 'true' || env.PRODUCT_TEST_ACCOUNT_DISPOSABLE !== 'true') {
    throw new Error('Product tests require explicit write opt-in and a disposable test account');
  }
  return url;
}
export function appPath(route, base = process.env.BASE_URL || 'http://localhost:3000') {
  return `${base.replace(/\/+$/, '')}/${route.replace(/^\/+/, '')}`;
}
