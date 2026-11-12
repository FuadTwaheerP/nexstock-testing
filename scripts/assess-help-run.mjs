import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join, relative, isAbsolute } from 'node:path';
import { helpResultCategory } from '../helpers/help-safety.mjs';

const stage = resolve(process.argv[2] || 'blob-report/archive/help-round1-2026-10-25/help-2');
const local = relative(process.cwd(), stage);
if (local.startsWith('..') || isAbsolute(local)) throw new Error('Assessment target must be an existing run inside this workspace');
const result = JSON.parse(readFileSync(join(stage, 'results.json'), 'utf8'));
const cases = [];
function visit(suites) {
  for (const suite of suites) {
    for (const spec of suite.specs || []) for (const test of spec.tests || []) {
      const final = test.results?.at(-1);
      cases.push({ title: spec.title, file: spec.file, line: spec.line, project: test.projectName,
        rawStatus: final?.status, category: helpResultCategory(final?.status, test.annotations),
        annotations: test.annotations || [], error: (final?.errors || []).map(e => e.message).join('\n').replace(/\x1b\[[0-9;]*m/g,''),
        attachments: (final?.attachments || []).filter(a => a.path).map(a => ({ name: a.name, path: a.path, exists: existsSync(a.path) })) });
    }
    visit(suite.suites || []);
  }
}
visit(result.suites || []);
const journal = JSON.parse(readFileSync(join(stage, 'help-run.json'), 'utf8'));
const categories = {};
for (const item of cases) categories[item.category] = (categories[item.category] || 0) + 1;
const assessment = { testDate: '2026-10-25', stage, rawStats: result.stats, categories,
  uniqueConfirmedBugs: [...new Set(journal.events.filter(e => e.category === 'confirmed-bug').map(e => e.id))],
  unexpectedWrites: journal.events.filter(e => e.category === 'unexpected-application-write').length,
  legalActivations: journal.events.filter(e => e.category === 'legal-entry-observation'), delivery: journal.delivery, cases };
writeFileSync(join(stage, 'help-assessment.json'), JSON.stringify(assessment, null, 2));
console.log(JSON.stringify({ categories, uniqueConfirmedBugs: assessment.uniqueConfirmedBugs, unexpectedWrites: assessment.unexpectedWrites, rawStats: result.stats }));
if (categories['REVIEW REQUIRED'] || assessment.unexpectedWrites) process.exitCode = 1;
