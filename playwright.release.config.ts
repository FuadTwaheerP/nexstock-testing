import { defineConfig } from 'playwright/test';
import original from './playwright.config';
import { resolve } from 'node:path';

const stage = process.env.RELEASE_STAGE_PATH;
if (!stage) throw new Error('Use scripts/run-release-retest.mjs to preserve isolated release evidence');
const headed = process.argv.includes('--headed');
export default defineConfig({
  ...original,
  use: { ...original.use, actionTimeout: 10_000, navigationTimeout: 30_000 },
  projects: original.projects?.map(project => ({ ...project, use: { ...project.use, ...(!headed ? { viewport: { width: 1920, height: 1080 } } : {}) } })),
  reporter: [
    ['list'], ['json', { outputFile: resolve(stage, 'results.json') }],
    ['junit', { outputFile: resolve(stage, 'junit.xml') }],
    ['html', { outputFolder: resolve(stage, 'playwright-report'), open: 'never' }],
  ],
});
