import { test as base, expect } from 'playwright/test';
import { appPath, validateTarget } from './safety.mjs';
export { expect, appPath };
export const test = base.extend({
  context: async ({ context }, use) => {
    // Anonymous smoke only. Fail closed for every non-read request, including telemetry.
    await context.route('**/*', async route => {
      const req = route.request();
      if (!['GET','HEAD','OPTIONS'].includes(req.method())) return route.abort('blockedbyclient');
      try { validateTarget(req.url()); } catch { return route.abort('blockedbyclient'); }
      await route.continue();
    });
    await context.addInitScript(() => localStorage.setItem('nexstock-language', 'en'));
    await use(context);
  },
});
