import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
const index=JSON.parse(readFileSync('tmp/project-review/index.json','utf8'));
const scriptRoles={
 'assess-help-run.mjs':'Classifies one Help run into application failures, prerequisites and review-required cases.',
 'assess-phase1-round2.mjs':'Composes the latest executed Phase 1 Round 2 cases and original four-ticket verdicts.',
 'assess-phase2.mjs':'Combines completed module attempts using the latest project/file/title result and reviewed classifications.',
 'assess-release-fixes.mjs':'Builds the broad 4 November release register from scoped Phase 1/2 cases and recovery state.',
 'build-phase1-round2-summary.py':'Produces the concise Phase 1 Round 2 PDF.',
 'build-release-fix-summary.py':'Produces the concise 4 November release PDF.',
 'build-release-verification.py':'Produces the 24 October release report from its verification register.',
 'diagnose-invoice-pdf.mjs':'Scoped invoice export/settings diagnostic; not a generic read-only utility.',
 'diagnose-settings-save.mjs':'Settings-save diagnostic using the guarded QA fixture.',
 'discover-phase2.mjs':'Inspects Phase 2 routes/UI/contracts and saves discovery evidence.',
 'discover-release-surface.mjs':'Inspects deployed release controls and saves discovery evidence.',
 'inspect-phase2-pdf.py':'Extracts PDF text/page sizes for test assertions.',
 'inspect-qa-invoice.mjs':'Inspects an existing QA invoice.',
 'inspect-release-ar.mjs':'Inspects release customer AR surfaces.',
 'inspect-release-settings.mjs':'Inspects the deployed release settings surface.',
 'inspect-round2-deployment.mjs':'Records public production frontend fingerprint for Round 2.',
 'inspect-round2-invoice.mjs':'Inspects the saved Round 2 invoice/PDF evidence.',
 'phase2-combined-bugs.mjs':'Builds consolidated Phase 2 Markdown from reviewed module findings.',
 'phase2-report-markdown.mjs':'Builds one detailed Phase 2 module report from finding metadata and assessment.',
 'phase2-summary.mjs':'Builds the original Phase 2 summary/coverage representation.',
 'read-release-client.mjs':'Reads the downloaded deployed client to inspect observed release contracts.',
 'run-phase2.mjs':'Allocates a new module attempt directory, invokes Playwright and archives execution/log/journal.',
 'run-release-followups.mjs':'Runs the selected release jobs serially, optionally rerunning automation-review cases.',
 'run-release-retest.mjs':'Runs a scoped Phase 1 release module with isolated JSON/JUnit/HTML artifacts.',
 'run-round2-retest.mjs':'Serial Phase 2 campaign runner with manifest/resume/stop and cleanup checks; default dated archive is historical.',
 'verify-release-pdf.py':'Inspects generated release-PDF content/layout properties.',
};
const special={
 'helpers/safety.mjs':'Origin/protocol, disposable-business, write-opt-in, production UI exceptions and /app path validation.',
 'helpers/ui.ts':'Original anonymous read-only browser fixture; blocks mutations and unknown origins.',
 'helpers/api.ts':'Original authenticated API client, envelope/status checks and write scope validation.',
 'helpers/help-safety.mjs':'Help request allowance, labelled build metadata parsing and result classification.',
 'helpers/security-safety.mjs':'HTTPS QA target validation and credential/session request boundary.',
 'helpers/settings-safety.mjs':'Scoped Settings bulk-payload checks; preserves unrelated captured fields.',
 'helpers/settings-baseline.mjs':'Allows only the specifically approved QA BRN baseline adoption.',
 'helpers/phase2-assessment.mjs':'Separates mocks, bugs, blockers and unreviewed flow/transport/cleanup errors.',
 'playwright.config.ts':'Loads .env; defines the main projects, lifecycle dependencies, reporters and execution defaults.',
 'playwright.phase2.config.ts':'Selects one Phase 2 module and isolated stage/report directories.',
 'playwright.release.config.ts':'Adds isolated release evidence and desktop viewport to main projects.',
 'package.json':'Pinned runtime dependency and npm commands; default smoke does not collect tests in the current tree.',
 'AGENTS.md':'Required bug-report sections, reproduction numbering, separators, deduplication and classification.',
 '.github/workflows/qa.yml':'Manual GitHub Actions Chromium smoke workflow; current empty smoke project needs attention before relying on CI.',
 'tests/phase2/support/phase2.ts':'Shared guarded QA fixture, session/company verification, scoped mutations, proof/classification and numeric parsing.',
 'tests/phase2/support/auth.setup.ts':'Clears stale auth/journal, signs in and stores the selected QA-company session.',
 'tests/phase2/support/cleanup.teardown.ts':'Module-specific recovery, unexpected-write audit and logout, with failed-setup handling.',
 'tests/phase2/support/inventory.ts':'Captures/reconciles/restores owned QA SKU inventory using finite guarded adjustments.',
 'tests/phase2/support/observed.ts':'Observes actual GET URLs and rereads identical requests with headers kept in memory.',
 'tests/phase2/support/pdf.ts':'Checks PDF signature/EOF and parsed required content using Python.',
};
const esc=s=>String(s).replaceAll('|','\\|').replaceAll('\n',' ');
function role(f){const p=f.path,name=p.split('/').at(-1);if(special[p])return special[p];if(p.startsWith('scripts/'))return scriptRoles[name]||'Project utility.';if(p.startsWith('checks/'))return 'Offline regression checks for '+name.replace('.test.mjs','').replaceAll('-',' ')+'.';if(p.endsWith('.spec.ts'))return name.includes('full-flow')?'Integrated module journey, retaining step outcomes and independent failures.':'Independent UI requirements/regression scenarios.';if(/auth\.setup\.ts$/.test(p))return 'Module authentication and fixture/baseline setup.';if(/cleanup\.teardown\.ts$/.test(p))return 'Module restoration/recovery, scope verification and session cleanup.';if(p.includes('/support/'))return 'Module UI adapters, business oracles and scoped fixture/recovery logic.';if(p.startsWith('data/phase2-findings/'))return 'Historical structured module tickets, corrections and acceptance limits; later release records can supersede status.';if(p.startsWith('data/'))return 'Requirements, case design, agreed contract or release scope data.';if(p.startsWith('docs/release-verification-'))return 'Dated release verdict, detailed findings or policy clarification.';if(p.startsWith('docs/phase2/bugs/'))return 'Reviewed original Phase 2 findings, evidence, corrections and limits.';if(p.endsWith('failure-tickets.md')||p.endsWith('failure-tickets.json'))return 'Historical detailed findings; preserve original date and apply later retest verdicts.';if(name==='README.md')return 'Usage, fixtures, historical execution results and scope limits; check date against later retests.';if(p.startsWith('docs/'))return 'Project specification, test design, traceability or historical validation.';return 'Project source/configuration/document.';}
const lines=['# NexStock project file map','','Generated for the 12 November 2026 reconstruction. Read [PROJECT-HANDOVER.md](PROJECT-HANDOVER.md) first for status, chronology, requirements and continuation.','','This index covers all 388 source/document/configuration files in the initial content scan. It excludes dependency internals, credential values, private browser state, generated HTML assets and duplicate binary evidence. The dependency lock, SVG fixture, private/runtime directories and archive layout are described separately below. Literal test declarations are listed for navigation; generated loop cases and actual execution are established by Playwright discovery and reviewed registers, not this text extractor.','','## Runtime, private data and generated artifacts','','- `package-lock.json`: registry lock for the pinned Playwright package and dependencies.','- `tests/fixtures/product-image.svg`: original image fixture; release retesting uses a supported PNG input rather than treating unsupported SVG as an app defect.','- `.env`: local target, allowlist, explicit disposable-production opt-ins and credentials. Values are excluded from this index.','- `.env.example`: configuration reference covering module prerequisites and manual-evidence options.','- `.gitignore`: excludes dependencies, .env, browser auth, default reports, test results, blob archive and logs.','- `playwright/.auth/`: private baseline/fixture state; retain approved BRN adoption backup and payment-method fixture history.','- `test-results/`: authentication, recovery ledgers, collection records, diagnostics and downloaded public client.','- `blob-report/archive/`: preserved campaigns; see handover chronology. Each attempt can contain execution.json, results.json, junit.xml, console.log, safe journals, report assets, screenshots and document/CSV downloads.','- `playwright-report/`: most recently generated default report only.','- `output/pdf/`: the three historical one-page QA summaries.','- `tmp/`: historical PDF renders and reconstruction intermediates; not additional live test executions.','- `debug.log`: historical diagnostic output; use dated completed execution records for verdicts.','- `node_modules/`: installed third-party runtime; package internals are not NexStock application source.','- `.git/`: QA-repository history, not the tested application source history.','','## Source files',''];
const groups=new Map();for(const f of index.source){const key=f.path.startsWith('tests/')?f.path.split('/').slice(0,3).join('/'):f.path.startsWith('docs/')?f.path.split('/').slice(0,f.path.startsWith('docs/phase2/')||f.path.startsWith('docs/release-')?2:1).join('/'):f.path.split('/').slice(0,-1).join('/')||'Repository root';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(f);}
for(const [group,files] of groups){lines.push('### '+group,'','| File | Lines | Responsibility |','| --- | ---: | --- |');for(const f of files.sort((a,b)=>a.path.localeCompare(b.path)))lines.push(`| [${esc(f.path)}](../${f.path}) | ${f.lines} | ${esc(role(f))} |`);const detailed=files.filter(f=>f.tests.length||f.exports.length);if(detailed.length){lines.push('','Declarations and reusable entry points:','');for(const f of detailed){lines.push('- `'+f.path+'`');if(f.exports.length)lines.push('  - Exports: '+f.exports.map(x=>'`'+x+'`').join(', ')+'.');for(const test of f.tests)lines.push('  - Case: '+esc(test));}}lines.push('');}
writeFileSync('docs/PROJECT-FILE-MAP.md',lines.join('\n'));
const unresolved=[];for(const f of index.source.filter(f=>/\.(ts|mjs)$/.test(f.path)))for(const imp of f.imports.filter(i=>i.startsWith('.'))){const base=resolve(dirname(f.path),imp);if(![base,base+'.ts',base+'.js',base+'.mjs',base+'/index.ts',base+'/index.js'].some(existsSync))unresolved.push({file:f.path,import:imp});}
console.log(JSON.stringify({indexedFiles:index.source.length,fileMapLines:lines.length,unresolvedRelativeImports:unresolved},null,2));
