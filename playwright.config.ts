import { defineConfig, devices } from 'playwright/test';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { validateTarget } from './helpers/safety.mjs';

const envFile = fileURLToPath(new URL('.env', import.meta.url));
if (existsSync(envFile)) loadEnvFile(envFile);

validateTarget(process.env.BASE_URL || 'http://localhost:3000');
export default defineConfig({
  testDir: './tests', fullyParallel: false, workers: 1, retries: 0,
  timeout: 30_000, expect: { timeout: 10_000 }, forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]],
  use: { baseURL: process.env.BASE_URL || 'http://localhost:3000', locale: 'en-GB', timezoneId: 'Indian/Mauritius',
    trace: 'off', screenshot: 'only-on-failure', video: 'off', serviceWorkers: 'block' },
  projects: [
    { name: 'chromium-smoke', testMatch: '**/*.ui.spec.ts', testIgnore: ['**/auth/onboarding-process.ui.spec.ts', '**/products/**'], use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox-smoke', testMatch: '**/*.ui.spec.ts', testIgnore: ['**/auth/onboarding-process.ui.spec.ts', '**/products/**'], use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-smoke', testMatch: '**/*.ui.spec.ts', testIgnore: ['**/auth/onboarding-process.ui.spec.ts', '**/products/**'], use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-smoke', testMatch: '**/*.ui.spec.ts', testIgnore: ['**/auth/onboarding-process.ui.spec.ts', '**/products/**'], use: { ...devices['iPhone 13'], defaultBrowserType: 'webkit' } },
    { name: 'chromium-onboarding', testMatch: '**/auth/onboarding-process.ui.spec.ts', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'chromium-products',
      testMatch: '**/products/*.ui.spec.ts',
      use: {
        browserName: 'chromium',
        viewport: null,
        launchOptions: { args: ['--start-maximized'] },
      },
    },
    { name: 'api-read', testMatch: '**/*.read.spec.ts' },
    { name: 'api-write', testMatch: '**/*.write.spec.ts' },
  ],
});
