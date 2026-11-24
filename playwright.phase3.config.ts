import { defineConfig } from 'playwright/test';
import original from './playwright.config';
import { resolve } from 'node:path';

const moduleName = process.env.PHASE3_MODULE;
const stage = process.env.PHASE3_STAGE;
if (!moduleName || !stage) throw new Error('Use node scripts/run-phase3.mjs <module>');
const headed = process.argv.includes('--headed');
const desktop = { browserName: 'chromium' as const, viewport: headed ? null : { width: 1920, height: 1080 }, launchOptions: { args: ['--start-maximized'] } };
export default defineConfig({
  ...original, testDir: './tests/phase3', fullyParallel: false, workers: 1, retries: 0,
  timeout: 120_000, expect: { timeout: 30_000 },
  outputDir: resolve(stage, 'artifacts'),
  use: { ...original.use, actionTimeout: 30_000, navigationTimeout: 60_000 },
  reporter: [['list'], ['json', { outputFile: resolve(stage,'results.json') }], ['junit', { outputFile: resolve(stage,'junit.xml') }], ['html', { outputFolder: resolve(stage,'playwright-report'), open:'never' }]],
  projects: [
    { name: 'phase3-setup', testMatch: '**/support/auth.setup.ts', teardown: 'phase3-cleanup', use: desktop },
    { name: `phase3-${moduleName}`, testMatch: `**/${moduleName}/*.ui.spec.ts`, dependencies: ['phase3-setup'], use: { ...desktop, storageState: 'test-results/phase3-auth.json' } },
    { name: 'phase3-cleanup', testMatch: '**/support/cleanup.teardown.ts', use: { ...desktop, storageState: 'test-results/phase3-auth.json' } },
  ],
});
