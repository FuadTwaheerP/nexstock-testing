import { defineConfig, devices } from 'playwright/test';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { validateTarget } from './helpers/safety.mjs';

const envFile = fileURLToPath(new URL('.env', import.meta.url));
if (existsSync(envFile)) loadEnvFile(envFile);
const moduleSuiteIgnores = ['**/phase2/**', '**/auth/onboarding-process.ui.spec.ts', '**/products/**', '**/stores/**', '**/stock-adjustments/**', '**/pos/**', '**/invoicing/**', '**/suppliers/**', '**/customers/**', '**/security/**', '**/hardware/**', '**/settings/**', '**/help/**'];

validateTarget(process.env.BASE_URL || 'http://localhost:3000');
export default defineConfig({
  testDir: './tests', fullyParallel: false, workers: 1, retries: 0,
  timeout: 30_000, expect: { timeout: 10_000 }, forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]],
  use: { baseURL: process.env.BASE_URL || 'http://localhost:3000', locale: 'en-GB', timezoneId: 'Indian/Mauritius',
    trace: 'off', screenshot: 'only-on-failure', video: 'off', serviceWorkers: 'block' },
  projects: [
    { name: 'chromium-smoke', testMatch: '**/*.ui.spec.ts', testIgnore: moduleSuiteIgnores, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox-smoke', testMatch: '**/*.ui.spec.ts', testIgnore: moduleSuiteIgnores, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-smoke', testMatch: '**/*.ui.spec.ts', testIgnore: moduleSuiteIgnores, use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-smoke', testMatch: '**/*.ui.spec.ts', testIgnore: moduleSuiteIgnores, use: { ...devices['iPhone 13'], defaultBrowserType: 'webkit' } },
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
    {
      name: 'stores-setup',
      testMatch: '**/stores/stores-auth.setup.ts',
      use: {
        browserName: 'chromium',
        viewport: null,
        launchOptions: { args: ['--start-maximized'] },
      },
    },
    {
      name: 'chromium-stores',
      testMatch: '**/stores/*.ui.spec.ts',
      dependencies: ['stores-setup'],
      use: {
        browserName: 'chromium',
        viewport: null,
        storageState: 'test-results/stores-auth.json',
        launchOptions: { args: ['--start-maximized'] },
      },
    },
    {
      name: 'adjustments-setup',
      testMatch: '**/stock-adjustments/adjustments-auth.setup.ts',
      use: { browserName: 'chromium', viewport: null, launchOptions: { args: ['--start-maximized'] } },
    },
    {
      name: 'chromium-adjustments',
      testMatch: '**/stock-adjustments/*.ui.spec.ts',
      dependencies: ['adjustments-setup'],
      use: {
        browserName: 'chromium', viewport: null,
        storageState: 'test-results/adjustments-auth.json',
        launchOptions: { args: ['--start-maximized'] },
      },
    },
    {
      name: 'pos-setup',
      testMatch: '**/pos/pos-auth.setup.ts',
      teardown: 'pos-cleanup',
      use: { browserName: 'chromium', viewport: null, launchOptions: { args: ['--start-maximized'] } },
    },
    {
      name: 'chromium-pos',
      testMatch: '**/pos/*.ui.spec.ts',
      dependencies: ['pos-setup'],
      use: {
        browserName: 'chromium', viewport: null,
        storageState: 'test-results/pos-auth.json',
        launchOptions: { args: ['--start-maximized'] },
      },
    },
    {
      name: 'pos-cleanup',
      testMatch: '**/pos/pos-cleanup.teardown.ts',
      use: { browserName: 'chromium', storageState: 'test-results/pos-auth.json' },
    },
    {
      name: 'invoicing-setup', testMatch: '**/invoicing/invoicing-auth.setup.ts', teardown: 'invoicing-cleanup',
      use: { browserName: 'chromium', viewport: null, launchOptions: { args: ['--start-maximized'] } },
    },
    {
      name: 'chromium-invoicing', testMatch: '**/invoicing/*.ui.spec.ts', dependencies: ['invoicing-setup'],
      use: { browserName: 'chromium', viewport: null, storageState: 'test-results/invoicing-auth.json', launchOptions: { args: ['--start-maximized'] } },
    },
    {
      name: 'invoicing-cleanup', testMatch: '**/invoicing/invoicing-cleanup.teardown.ts',
      use: { browserName: 'chromium', storageState: 'test-results/invoicing-auth.json' },
    },
    {
      name: 'suppliers-setup', testMatch: '**/suppliers/suppliers-auth.setup.ts', teardown: 'suppliers-cleanup',
      use: { browserName: 'chromium', viewport: null, launchOptions: { args: ['--start-maximized'] } },
    },
    {
      name: 'chromium-suppliers', testMatch: '**/suppliers/*.ui.spec.ts', dependencies: ['suppliers-setup'],
      use: { browserName: 'chromium', viewport: null, storageState: 'test-results/suppliers-auth.json', launchOptions: { args: ['--start-maximized'] } },
    },
    {
      name: 'suppliers-cleanup', testMatch: '**/suppliers/suppliers-cleanup.teardown.ts',
      use: { browserName: 'chromium', storageState: 'test-results/suppliers-auth.json' },
    },
    {
      name: 'customers-setup', testMatch: '**/customers/customers-auth.setup.ts', teardown: 'customers-cleanup',
      use: { browserName: 'chromium', viewport: null, launchOptions: { args: ['--start-maximized'] } },
    },
    {
      name: 'chromium-customers', testMatch: '**/customers/*.ui.spec.ts', dependencies: ['customers-setup'],
      use: { browserName: 'chromium', viewport: null, actionTimeout: 10_000, navigationTimeout: 30_000, storageState: 'test-results/customers-auth.json', launchOptions: { args: ['--start-maximized'] } },
    },
    {
      name: 'customers-cleanup', testMatch: '**/customers/customers-cleanup.teardown.ts',
      use: { browserName: 'chromium', viewport: null, actionTimeout: 10_000, storageState: 'test-results/customers-auth.json', launchOptions: { args: ['--start-maximized'] } },
    },
    {
      name: 'security-setup', testMatch: '**/security/security-auth.setup.ts', teardown: 'security-cleanup',
      use: { browserName: 'chromium', viewport: null, launchOptions: { args: ['--start-maximized'] } },
    },
    {
      name: 'chromium-security', testMatch: '**/security/*.ui.spec.ts', dependencies: ['security-setup'],
      use: { browserName: 'chromium', viewport: null, actionTimeout: 10_000, navigationTimeout: 30_000, launchOptions: { args: ['--start-maximized'] } },
    },
    {
      name: 'security-cleanup', testMatch: '**/security/security-cleanup.teardown.ts',
      use: { browserName: 'chromium', viewport: null, actionTimeout: 10_000, launchOptions: { args: ['--start-maximized'] } },
    },
    {
      name: 'hardware-setup', testMatch: '**/hardware/hardware-auth.setup.ts', teardown: 'hardware-cleanup',
      use: { browserName: 'chromium', viewport: null, launchOptions: { args: ['--start-maximized', '--window-size=1920,1080'] } },
    },
    {
      name: 'chromium-hardware', testMatch: '**/hardware/*.ui.spec.ts', dependencies: ['hardware-setup'],
      use: { browserName: 'chromium', viewport: null, actionTimeout: 10_000, navigationTimeout: 30_000, storageState: 'test-results/hardware-auth.json', launchOptions: { args: ['--start-maximized', '--window-size=1920,1080'] } },
    },
    {
      name: 'hardware-cleanup', testMatch: '**/hardware/hardware-cleanup.teardown.ts',
      use: { browserName: 'chromium', viewport: null, actionTimeout: 10_000, storageState: 'test-results/hardware-auth.json', launchOptions: { args: ['--start-maximized', '--window-size=1920,1080'] } },
    },
    {
      name: 'settings-setup', testMatch: '**/settings/settings-auth.setup.ts', teardown: 'settings-cleanup',
      use: { browserName: 'chromium', viewport: null, launchOptions: { args: ['--start-maximized', '--window-size=1920,1080'] } },
    },
    {
      name: 'chromium-settings', testMatch: '**/settings/*.ui.spec.ts', dependencies: ['settings-setup'],
      use: { browserName: 'chromium', viewport: null, actionTimeout: 10_000, navigationTimeout: 30_000, storageState: 'test-results/settings-auth.json', launchOptions: { args: ['--start-maximized', '--window-size=1920,1080'] } },
    },
    {
      name: 'settings-cleanup', testMatch: '**/settings/settings-cleanup.teardown.ts',
      use: { browserName: 'chromium', viewport: null, actionTimeout: 10_000, launchOptions: { args: ['--start-maximized', '--window-size=1920,1080'] } },
    },
    {
      name: 'help-setup', testMatch: '**/help/help-auth.setup.ts', teardown: 'help-cleanup',
      use: { browserName: 'chromium', viewport: null, launchOptions: { args: ['--start-maximized', '--window-size=1920,1080'] } },
    },
    {
      name: 'chromium-help', testMatch: '**/help/*.ui.spec.ts', dependencies: ['help-setup'],
      use: { browserName: 'chromium', viewport: null, actionTimeout: 10_000, navigationTimeout: 30_000, storageState: 'test-results/help-auth.json', launchOptions: { args: ['--start-maximized', '--window-size=1920,1080'] } },
    },
    {
      name: 'help-cleanup', testMatch: '**/help/help-cleanup.teardown.ts',
      use: { browserName: 'chromium', viewport: null, launchOptions: { args: ['--start-maximized', '--window-size=1920,1080'] } },
    },
    { name: 'api-read', testMatch: '**/*.read.spec.ts' },
    { name: 'api-write', testMatch: '**/*.write.spec.ts' },
  ],
});
