import { request, expect } from 'playwright/test';
import { validateTarget } from './safety.mjs';
export function required(name: string): string {
  const value = process.env[name]; if (!value) throw new Error(`Missing ${name}; see README prerequisites`); return value;
}
export async function api(write = false) {
  const base = (process.env.API_URL || 'http://localhost:8080/api/v1/').replace(/\/?$/, '/');
  validateTarget(base, process.env, write);
  const ctx = await request.newContext({ extraHTTPHeaders: {
    Authorization: `Bearer ${required('API_TOKEN')}`, 'X-Business-Id': required('BUSINESS_ID'),
    ...(process.env.BRANCH_ID ? {'X-Branch-Id': process.env.BRANCH_ID} : {}), Accept: 'application/json',
  }, ignoreHTTPSErrors: false });
  return {
    dispose: () => ctx.dispose(),
    async call(method: string, path: string, data?: unknown, status = 200) {
      const target = new URL(path, base);
      if (target.origin !== new URL(base).origin || !target.pathname.startsWith(new URL(base).pathname)) throw new Error('API path escaped its configured base');
      validateTarget(target.href, process.env, method !== 'GET');
      if (method !== 'GET' && !write) throw new Error('Read client cannot mutate');
      const res = await ctx.fetch(target.href, { method, data, maxRedirects: 0 });
      expect(res.status(), `${method} ${path}`).toBe(status);
      const body = await res.json();
      expect(body.success).toBe(status < 400);
      return body;
    },
  };
}
export function rows(data: unknown): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray((data as any).data)) return (data as any).data;
  throw new Error('Expected a list or Laravel paginated data, received another contract');
}
