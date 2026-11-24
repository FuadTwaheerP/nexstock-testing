import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';

// Merge reviewed reports only. This script does not run or reclassify live tests.
const output = 'docs/DEVELOPER-BUGS-COMBINED.md';
const phase3Path = 'docs/phase3/PHASE3-BUGS.md';
const mvpPath = 'docs/final-mvp-2026-11-13/remaining-bugs.md';
const sections = ['Title', 'Environment', 'Priority', 'Step-by-step', 'Expected Result', 'Actual Result', 'Attachment', 'Comment'];
function parse(path) {
  const text = readFileSync(path, 'utf8').replaceAll('\r\n', '\n');
  return [...text.matchAll(/^## ([^\n]+)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map(match => {
    const fields = [...match[2].matchAll(/^### ([^\n]+)\n\n([\s\S]*?)(?=^### |$(?![\s\S]))/gm)];
    assert.deepEqual(fields.map(f => f[1]), sections, `Unexpected sections: ${match[1]}`);
    return {heading: match[1], id: match[1].split(' ')[0], fields: Object.fromEntries(fields.map(f => [f[1], f[2].replace(/\n\n---\s*$/, '').trim()]))};
  });
}
const phase3 = parse(phase3Path), mvp = parse(mvpPath);
assert.equal(phase3.length, 43);
assert.equal(mvp.length, 5);
const reviewed = JSON.parse(readFileSync('blob-report/archive/phase3-2026-11-17/findings.json', 'utf8'));
const metadata = new Map(reviewed.map(f => [f.id, f]));
const aliases = new Map([['MVP-FONT-001', 'P3-FONT-001'], ['MVP-LOOKUP-001', 'P3-LOOKUP-001']]);
const legacyTests = {
  'MVP-FONT-001': 'Settings upload of valid Regular and Italic TTF files; request bytes/content type, response, reload persistence and separate multipart diagnostic control.',
  'MVP-FONT-002': 'Create a stockless service with two font-capable Text definitions; compare submitted customFields, successful creation response, fresh product GET and reopened Custom Fields editor.',
  'MVP-LOOKUP-001': 'Fresh Invoice customer picker and Invoice/Quotation product pickers against verified active later-page records; compare API pagination metadata and complete exposed option lists.',
  'MVP-CUST-001': 'Active positive control, persisted deactivation, fresh Invoice customer GET and picker option eligibility; historical draft retention checked separately.',
  'P2-DOC-004': 'Classic dark invoice, quotation and credit-note computed brand text/borders and effective backgrounds; calculate unrounded contrast and compare the readable-colour control.'
};
const legacyFeatures = {
  'MVP-FONT-002': 'Features 2 / 10 / 11 / 22 - Product customization and billing documents',
  'MVP-CUST-001': 'Feature 19 - Customers; Feature 10 - Invoicing',
  'P2-DOC-004': 'Feature 22 - Document Design; Phase 2 residual'
};
for (const bug of phase3) {
  const evidence = metadata.get(bug.id);
  assert.ok(evidence, `Missing reviewed test: ${bug.id}`);
  bug.fields['Step-by-step'] = `**Test performed - 17 November 2026:** \`${evidence.test}\`. The numbered actions below identify the checks that produced this finding.\n\n${bug.fields['Step-by-step']}`;
  bug.fields['Actual Result'] = `**Observed failure - 17 November 2026:** ${bug.fields['Actual Result']}`;
  const stage = evidence.stage.replaceAll('\\', '/');
  bug.fields.Attachment += `\n- [Recorded execution results](${stage}/results.json)`;
}
for (const legacy of mvp) {
  const canonical = aliases.get(legacy.id);
  if (!canonical) {
    legacy.heading += ` - ${legacyFeatures[legacy.id]}`;
    legacy.fields['Step-by-step'] = `**Test performed - 13 November 2026:** ${legacyTests[legacy.id]}\n\n${legacy.fields['Step-by-step']}`;
    legacy.fields['Actual Result'] = `**Observed failure - 13 November 2026:** ${legacy.fields['Actual Result']}`;
    legacy.fields.Comment += '\n\n**Evidence age:** carried forward from the confirmed 13 November MVP report. This consolidation performs no new live retest and does not certify the deployed backend state on 17 November. Reproduce the recorded failure before closing this ticket.';
    continue;
  }
  const target = phase3.find(b => b.id === canonical);
  assert.ok(target);
  target.heading += `; includes ${legacy.id}`;
  if (canonical === 'P3-LOOKUP-001') {
    target.heading = 'P3-LOOKUP-001 - Features 7 / 10 / 11 - Shelf Life and billing pickers; includes MVP-LOOKUP-001';
    target.fields.Title = 'Customer/product pickers expose only the first page, excluding valid saved records from batch entry and billing';
  }
  target.fields.Environment += `\n\n**Earlier occurrence (${legacy.id}):** ${legacy.fields.Environment}`;
  target.fields['Step-by-step'] += `\n\n**Earlier test performed - 13 November 2026 (${legacy.id}):** ${legacyTests[legacy.id]}\n\n${legacy.fields['Step-by-step']}`;
  target.fields['Expected Result'] += `\n\n**Earlier MVP acceptance:** ${legacy.fields['Expected Result']}`;
  target.fields['Actual Result'] += `\n\n**Earlier observed failure - 13 November 2026 (${legacy.id}):** ${legacy.fields['Actual Result']}`;
  target.fields.Attachment += `\n\n**Earlier MVP evidence (${legacy.id}):**\n\n${legacy.fields.Attachment}`;
  target.fields.Comment += `\n\n**Consolidated earlier ticket ${legacy.id}:** ${legacy.fields.Comment}`;
  target.fields.Comment += '\n\n**Evidence boundary:** the 17 November test confirms only its explicitly described path; the earlier occurrences above retain their 13 November verification date. These are grouped as the same missing capability, without asserting an unverified shared implementation cause. No new live retest was performed for this consolidation.';
  target.fields.Priority = 'High';
}
const bugs = [...phase3, ...mvp.filter(b => !aliases.has(b.id))];
assert.equal(bugs.length, 46);
const intro = [
  '# NexStock - Consolidated developer bug list', '',
  'Compiled 17 November 2026 from the reviewed Phase 3 campaign and the five remaining final-MVP findings. **46 unique confirmed application tickets: 43 Phase 3 tickets plus 3 additional MVP/Phase 2 tickets.** All five original MVP IDs are accounted for below; two overlap with existing Phase 3 tickets and are merged rather than counted twice.', '',
  'Each ticket states the actual test performed, numbered reproduction steps, expected behavior, observed failure and evidence. A missing workflow is an availability failure; downstream validation or delivery is not claimed to have failed when it could not be exercised. Corrected automation errors, blocked dependencies and unconfirmed policy observations are excluded from this bug list.', '',
  '**Verification dates:** Phase 3 evidence is from 17 November; carried-forward MVP/Phase 2 evidence is from 13 November. This document merge did not execute a new live retest. Matching frontend fingerprints do not establish an unchanged backend. Existing Phase 3 acceptance figures remain scoped to its 61 requirements and are not recalculated from this combined list.', '',
  '| Original remaining-bugs.md ID | Location in this file | Test that produced the finding |',
  '| --- | --- | --- |',
  '| MVP-FONT-001 | P3-FONT-001 (merged) | Valid native TTF upload; JSON request loses bytes and returns HTTP 422. Reproduced again in Phase 3. |',
  '| MVP-FONT-002 | MVP-FONT-002 | Save two font-capable product fields; fresh GET and reopened editor lose both definitions despite HTTP 201. |',
  '| MVP-LOOKUP-001 | P3-LOOKUP-001 (merged) | Active later-page customers/products absent from Invoice/Quotation pickers; Phase 3 also confirms the first-15 limitation in batch entry. |',
  '| MVP-CUST-001 | MVP-CUST-001 | Persisted inactive customer still offered on a fresh Invoice; active positive control passes. |',
  '| P2-DOC-004 | P2-DOC-004 | Actual Classic dark text/background contrast is 2.991035:1 against the stated 3:1 acceptance threshold. |', '',
  '**Custom-font requirement:** upload and product-field persistence are failed prerequisites; complete custom text/selected-font output on Invoice/Quotation and their PDFs remains uncertified. No separate font-rendering defect is inferred.', '',
  'Sources: [Phase 3 bug report](phase3/PHASE3-BUGS.md), [five final-MVP findings](final-mvp-2026-11-13/remaining-bugs.md), [Phase 3 review limits and automation corrections](phase3/REVIEW-NOTES.md). Physical checks remain skipped as requested; external delivery and isolated-account checks remain blocked as documented in the [Phase 3 summary](phase3/SUMMARY.md).', ''
];
const content = [...intro, ...bugs.flatMap(b => [
  `## ${b.heading}`, '',
  ...sections.flatMap(section => [`### ${section}`, '', b.fields[section], '']),
  '---', ''
])].join('\n') + '\n';
// Verify the exact user-required ticket format and local evidence links before writing.
assert.equal((content.match(/^## /gm) || []).length, 46);
assert.equal((content.match(/^---$/gm) || []).length, 46);
assert.ok(content.endsWith('\n\n'));
const missing = [...content.matchAll(/\]\((C:\/[^)]+)\)/g)].map(m => m[1]).filter(path => !existsSync(path));
assert.deepEqual(missing, [], 'Broken absolute evidence links');
writeFileSync(output, content);
const verified = parse(output);
assert.equal(verified.length, 46);
assert.equal(new Set(verified.map(b => b.id)).size, 46);
console.log(JSON.stringify({output: resolve(output), uniqueTickets: bugs.length, phase3Tickets: phase3.length, originalMvpIdsCovered: mvp.map(b => b.id), mergedAliases: Object.fromEntries(aliases), evidenceLinksChecked: [...content.matchAll(/\]\((C:\/[^)]+)\)/g)].length, newLiveTests: 0}, null, 2));
