import { spawn } from 'node:child_process';
import { mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync, cpSync, createWriteStream } from 'node:fs';
import { resolve, join } from 'node:path';

const modules = {
  products: ['--project=chromium-products'],
  stores: ['--project=chromium-stores', '--grep-invert', 'registers|@full-flow'],
  adjustments: ['--project=chromium-adjustments'],
  pos: ['--project=chromium-pos'],
  invoicing: ['--project=chromium-invoicing'],
  suppliers: ['--project=chromium-suppliers'],
  customers: ['--project=chromium-customers'],
  security: ['--project=chromium-security', '--grep-invert', 'backend bcrypt|isolated-account|@full-flow|F24-c'],
  settings: ['--project=chromium-settings'],
  hardware: ['--project=chromium-hardware', 'barcode-scanner-compatibility.ui.spec.ts', '--grep-invert', 'physical acceptance'],
  help: ['--project=chromium-help'],
};
const name = process.argv[2];
if (!modules[name]) throw new Error(`Choose one of: ${Object.keys(modules).join(', ')}`);
const parent = resolve(process.env.RELEASE_RUN_ROOT || (name === 'help' ? 'blob-report/archive/help-round1-2026-10-25' : 'blob-report/archive/release-retest-2026-10-24'));
mkdirSync(parent, { recursive: true });
let attempt = 1;
while (existsSync(join(parent, `${name}-${attempt}`))) attempt++;
const stage = join(parent, `${name}-${attempt}`);
mkdirSync(stage);
const extra = process.argv.slice(3);
// Isolate Playwright artifacts without deleting the shared, module-namespaced
// authentication/compensation ledgers in test-results. This also permits
// independent read-only suites to run without erasing another suite's state.
mkdirSync('test-results', { recursive: true });
const args = ['node_modules/playwright/cli.js', 'test', '--config=playwright.release.config.ts', ...modules[name], ...extra, '--output', join(stage, 'artifacts')];
const meta = { module: name, attempt, started: new Date().toISOString(), args, scope: name === 'help' ? 'Help round 1 continuation; Terms approval and production release reference not ready, per developer response received 25 October 2026' : 'Deployed release retest; original QA account and existing production guards', stage };
writeFileSync(join(stage, 'execution.json'), JSON.stringify(meta, null, 2));
console.log(`RELEASE_EVIDENCE=${stage}`);
const log = createWriteStream(join(stage, 'console.log'));
const child = spawn(process.execPath, args, { cwd: process.cwd(), env: { ...process.env, RELEASE_STAGE_PATH: stage }, stdio: ['ignore', 'pipe', 'pipe'] });
for (const stream of [child.stdout, child.stderr]) stream.on('data', data => { process.stdout.write(data); log.write(data); });
const exitCode = await new Promise((done, reject) => { child.on('error', reject); child.on('close', done); });
await new Promise(done => log.end(done));
// Do not copy .env, any *-auth.json, storage state or private recovery ledgers.
if (existsSync('test-results')) {
  for (const item of readdirSync('test-results', { withFileTypes: true })) {
    if (item.isFile() && item.name === `${name}-run.json` && /^(?:settings|security|hardware|help)-run\.json$/.test(item.name)) cpSync(join('test-results', item.name), join(stage, item.name), { errorOnExist: true, force: false });
  }
}
meta.finished = new Date().toISOString(); meta.exitCode = exitCode;
writeFileSync(join(stage, 'execution.json'), JSON.stringify(meta, null, 2));
if (existsSync(join(stage, 'results.json'))) {
  const result = JSON.parse(readFileSync(join(stage, 'results.json'), 'utf8'));
  console.log('RELEASE_STATS=' + JSON.stringify(result.stats));
}
process.exitCode = Number(exitCode ?? 1);
