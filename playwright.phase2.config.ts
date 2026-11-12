import { defineConfig } from 'playwright/test';
import original from './playwright.config';
import { resolve } from 'node:path';

const moduleName = process.env.PHASE2_MODULE;
const stage = process.env.PHASE2_STAGE;
if (!moduleName || !stage) throw new Error('Use node scripts/run-phase2.mjs <module>');
const headed = process.argv.includes('--headed');
const desktop = { browserName: 'chromium' as const, viewport: headed ? null : { width: 1920, height: 1080 }, launchOptions: { args: ['--start-maximized'] } };
export default defineConfig({
  ...original, testDir: './tests/phase2', fullyParallel: false, workers: 1, retries: 0,
  timeout: 120_000, expect: { timeout: 12_000 },
  outputDir: resolve(stage, 'artifacts'),
  use: { ...original.use, actionTimeout: 12_000, navigationTimeout: 45_000 },
  reporter: [['list'], ['json', { outputFile: resolve(stage,'results.json') }], ['junit', { outputFile: resolve(stage,'junit.xml') }], ['html', { outputFolder: resolve(stage,'playwright-report'), open:'never' }]],
  projects: [
    { name: 'phase2-setup', testMatch: '**/support/auth.setup.ts', teardown: 'phase2-cleanup', use: desktop },
    { name: `phase2-${moduleName}`, testMatch: `**/${moduleName}/*.ui.spec.ts`, dependencies: ['phase2-setup'], use: { ...desktop, storageState: 'test-results/phase2-auth.json' } },
    { name: 'phase2-cleanup', testMatch: '**/support/cleanup.teardown.ts', use: { ...desktop, storageState: 'test-results/phase2-auth.json' } },
  ],
});
