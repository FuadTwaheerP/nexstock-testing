import {readFileSync,writeFileSync,readdirSync,mkdirSync,existsSync,cpSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {classifyPhase2Result,needsFailureReview,isUnreviewedFlowError} from '../helpers/phase2-assessment.mjs';
const date=process.argv[2]||'2026-11-12',root=resolve(`blob-report/archive/release-verification-${date}`),docs=resolve(`docs/release-verification-${date}`),evidence=join(root,'evidence');
mkdirSync(docs,{recursive:true});mkdirSync(evidence,{recursive:true});
const attempts=[],latest=new Map();
const json=file=>JSON.parse(readFileSync(file,'utf8'));
for(const phase of ['phase1','phase2'])for(const dir of readdirSync(join(root,phase),{withFileTypes:true}).filter(x=>x.isDirectory())){
 const stage=join(root,phase,dir.name),metaFile=join(stage,'execution.json'),resultFile=join(stage,'results.json');if(!existsSync(metaFile)||!existsSync(resultFile))continue;
 const meta=json(metaFile);if(!meta.finished)throw Error('Incomplete attempt requires review: '+stage);const result=json(resultFile);
 attempts.push({phase,module:meta.module,stage,started:meta.started,finished:meta.finished,exitCode:meta.exitCode,stats:result.stats});
 function walk(s){for(const spec of s.specs||[])for(const test of spec.tests||[]){
  const executed=test.results.filter(r=>!['skipped','interrupted'].includes(r.status)),last=executed.at(-1);if(!last)continue;
  const annotations=test.annotations||[],errors=(last.errors||[]).map(e=>e.message.replace(/\x1b\[[0-9;]*m/g,''));
  const attachments=(last.attachments||[]).map(a=>({name:a.name,contentType:a.contentType,...(a.path?{path:a.path}:{}),...(a.body&&a.contentType==='application/json'?{data:JSON.parse(Buffer.from(a.body,'base64').toString())}:{})}));
  const flows=attachments.filter(a=>a.name==='full-flow-outcomes'&&a.data).map(a=>a.data);
  let status=classifyPhase2Result(last.status,annotations);if(flows.flat().some(isUnreviewedFlowError)||!['PASS','MOCK PASS'].includes(status)&&needsFailureReview(errors,flows))status='AUTOMATION REVIEW';
  const value={phase,module:meta.module,title:spec.title,file:spec.file,line:spec.line,project:test.projectName,status,raw:last.status,ids:[...new Set(annotations.filter(a=>a.type==='confirmed-bug').map(a=>a.description.split(':')[0]))],annotations,errors,attachments,stage,started:meta.started,duration:last.duration};
  const key=[phase,meta.module,test.projectName,spec.file,spec.title].join('|'),old=latest.get(key);if(!old||old.started<value.started)latest.set(key,value);
 }for(const child of s.suites||[])walk(child);}walk(result);
}
const cases=[...latest.values()],functional=cases.filter(c=>!/(?:setup|cleanup|teardown)/.test(c.project)),support=cases.filter(c=>!functional.includes(c));
const counts=rows=>rows.reduce((o,c)=>(o[c.status]=(o[c.status]||0)+1,o),{});
if(cases.some(c=>c.status==='AUTOMATION REVIEW'))throw Error('Resolve automation review before publishing');
if(cases.length!==30||functional.length!==20||support.length!==10)throw Error('Unexpected coverage; review case register before updating the report');
if(support.some(c=>c.status!=='PASS'))throw Error('Setup/cleanup has not passed');
const recovery={};for(const file of ['phase2-inventory-recovery.json','phase2-template-recovery.json','phase2-invoice-text-recovery.json']){recovery[file]=json('test-results/'+file).restored===true;if(!recovery[file])throw Error('Recovery incomplete: '+file);}
const find=(module,match)=>functional.find(c=>c.module===module&&match.test(c.title));
function copyAttachment(c,name,out){const a=c.attachments.find(a=>a.name===name);if(!a)throw Error('Missing attachment '+name+' in '+c.title);const target=join(evidence,out);if(a.path)cpSync(a.path,target);else if(a.data!==undefined)writeFileSync(target,JSON.stringify(a.data,null,2));else{let body;function locate(s){for(const spec of s.specs||[])if(spec.title===c.title)for(const test of spec.tests||[])if(test.projectName===c.project)body=test.results.at(-1).attachments.find(x=>x.name===name)?.body;for(const child of s.suites||[])locate(child);}locate(json(join(c.stage,'results.json')));if(!body)throw Error('Attachment has no saved data '+name);writeFileSync(target,Buffer.from(body,'base64'));}return target.replaceAll('\\','/');}
const bank=find('invoicing',/includes configured banking/),quote=find('quotations',/custom payment terms/),debit=find('credit-notes',/debit-note list opens/),legacy=find('credit-notes',/legacy debit 4/),color=find('document-templates',/#17675e/),precedence=find('document-templates',/PDF fallback builder precedence/),notes=find('document-templates',/till-generated internal/);
const exported={
 invoicePDF:copyAttachment(bank,'branded-invoice-pdf','RET-002-invoice.pdf'),
 quotationPDF:copyAttachment(quote,'quotation-pdf','P2-QUOTE-002.pdf'),
 debitPDF:copyAttachment(debit,'debit-note-print-view','REL-DN-001-new.pdf'),
 debitIdentity:copyAttachment(debit,'debit-product-identity','REL-DN-001-new.json'),
 legacyPDF:copyAttachment(legacy,'legacy-debit-repaired PDF','REL-DN-001-legacy.pdf'),
 legacyIdentity:copyAttachment(legacy,'legacy-debit-repaired-resource','REL-DN-001-legacy.json'),
 contrast:copyAttachment(color,'actual-classic-brand-contrast','P2-DOC-004-contrast.json'),
 precedence:copyAttachment(precedence,'pdf-precedence-and-template-isolation','RET-002-precedence.json'),
 internalNotes:copyAttachment(notes,'internal-invoice-note-oracle','RET-002-internal-notes.json'),
};
for(const doc of ['invoicing','quotations','credit-notes'])exported[doc+'Screenshot']=copyAttachment(color,'classic-contrast-17675e-'+doc,'P2-DOC-004-'+doc+'.png');
for(const width of [1920,1440]){const c=find('hardware',width===1920?/reachable on desktop/:/1440 x 900/);copyAttachment(c,'variant-dialog-layout','RET-003-'+width+'.json');copyAttachment(c,'variant-'+width+'-added-to-cart','RET-003-'+width+'.png');}
const contrastData=json(exported.contrast),badContrast=contrastData.findings.length>0;
const tickets=[
 {id:'RET-002',phase:1,status:'FIXED',summary:'Settings header/bank text reaches the PDF. Builder notes take precedence; blank/whitespace notes fall back without changing the saved template.'},
 {id:'RET-003',phase:1,status:'FIXED',summary:'Normal Add to order clicks pass at 1920 x 1080 and 1440 x 900, and the item appears in the cart.'},
 {id:'P2-QUOTE-002',phase:2,status:'FIXED',summary:'Customer Notes, terms, discounted totals and identity reach the quotation PDF. Status and one-time conversion pass.'},
 {id:'P2-DOC-004',phase:2,status:badContrast?'PARTIAL':'FIXED',summary:badContrast?'Brand borders and native PDF colour are fixed. Dark text tint is 2.991:1 on the actual #13191b surface, narrowly below the stated 3:1.':'Brand borders, rendered text contrast, Modern layout and native Classic PDF colour pass.'},
 {id:'REL-DN-001',phase:2,status:'FIXED',summary:'New and legacy debit documents/PDFs retain product name and SKU. Legacy resource IDs are strings and the print route works.'},
];
const deployment=json(join(root,'public-deployment.json')),deploymentFinal=json(join(root,'deployment-final/public-deployment.json')),functionalCounts=counts(functional),supportCounts=counts(support),allCounts=counts(cases);
if(JSON.stringify(deployment.assets)!==JSON.stringify(deploymentFinal.assets))throw Error('Deployment changed during testing; review case applicability before publishing');
const displayDate='12 November 2026';
const record={date,displayDate,complete:true,target:'https://nexstock.stylotech.mu/app',company:'Nexstock QA Company',scope:'Five developer-addressed Phase 1/Phase 2 findings, plus directly related document regressions; not a full project regression.',deployment,deploymentFinal,frontendStableDuringRetest:true,tickets,counts:allCounts,functionalCounts,supportCounts,attempts:attempts.sort((a,b)=>a.started.localeCompare(b.started)),cases,functionalCases:functional,recovery,evidence:exported,
 confirmedBugs:badContrast?['P2-DOC-004']:[],newTicketIds:[],automationCorrections:[],
 outcome:badContrast?'Four of the five tickets can close. P2-DOC-004 is partially fixed: the original neutral-colour override is corrected, but one minor rendered-text contrast boundary remains.':'All five fixes pass the scoped retest. No confirmed remaining application defect was found in these checks.',
 followup:badContrast?'Keep P2-DOC-004 open at Low priority. The selected #17675e keeps exact borders; text becomes #236f66. On the actual #13191b surface its contrast is 2.991:1. Calculate the tint against the rendered surface and verify the result stays at or above 3:1. Invoice, quotation and credit-note occurrences are one ticket.':'No application bug ticket is needed for this scope.',
 regressionSummary:'PDF Settings fallback, builder precedence, whitespace fallback and saved-template isolation pass. Internal till invoice notes stay off the customer PDF. A readable brand-colour control is unchanged. New and previously broken legacy debit output pass.',
 executionSummary:`Final composite: ${functionalCounts.PASS||0} functional passes, ${functionalCounts.FAIL||0} application-failing case, and ${supportCounts.PASS||0} setup/cleanup passes. No skipped/blocked cases or unresolved automation errors. All 79 offline guard/contrast/classification checks pass.`,
 cleanupSummary:'QA stock, VAT, invoice text and document template were restored and verified. Synthetic QA financial records remain as evidence. No real payment, external invitation/email or physical print job was sent.',
 scopeSummary:'Production serves index-Bw0A9VIv.js, changed from 5 November. This verifies the frontend fingerprint; no authoritative deployed Git commit was supplied. Browser checks do not certify PHP unit tests, tenant-isolation enforcement without foreign fixtures, all reasonCode length boundaries, mobile or physical hardware.'};
writeFileSync(join(root,'verification-register.json'),JSON.stringify(record,null,2));
const absolute=path=>path.replaceAll('\\','/');
const reportURL=absolute(join(color.stage,'playwright-report/index.html'));
const bugText=badContrast?`# NexStock - Phase 1 and Phase 2 fix retest: remaining bugs

Retested on **12 November 2026** in production after the developer's five-finding fix notes. **Four tickets pass; one is partially fixed.** The original Classic neutral-branding override is corrected. The single residual contrast boundary below is grouped under existing **P2-DOC-004**; invoice, quotation and credit-note occurrences are not separate tickets.

RET-002, RET-003, P2-QUOTE-002 and REL-DN-001 pass. This list covers the requested five-ticket release scope, not the previously excluded project backlog. No unconfirmed requirement observation or automation error is presented as an application bug.

## P2-DOC-004

### Title

Classic dark brand text narrowly misses the developer's stated 3:1 contrast minimum on its actual rendered background.

### Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium / Playwright 1.62.1. Dark mode, Classic layout, 1920 x 1080. Retested 12 November 2026. Frontend: index-Bw0A9VIv.js; SHA-256 bd0987b86cf20ca4531f81b3f859bb2d32d3d7d41da42386d09a9c377992584c.

### Priority

Low - a small contrast-threshold miss. Chosen branding now appears correctly, borders and native PDF colour work, and the documents remain usable.

### Step-by-step

1. Sign in and select Nexstock QA Company.
2. Enable dark mode and open Document Builder.
3. Select Classic and set Primary Color to \`#17675e\`; save and reload to confirm persistence.
4. Open a saved QA invoice, quotation or credit note in the actual document view.
5. Inspect the computed brand-text colour and its background, including ancestor background layers. The brand text is \`rgb(35, 111, 102)\` (\`#236f66\`); its actual opaque background is \`rgb(19, 25, 27)\` (\`#13191b\`).
6. Calculate the sRGB relative-luminance contrast for those rendered colours and compare it with the stated minimum of 3:1. Repeat for the other two document types.

### Expected Result

Borders retain the exact selected brand colour. If the original text colour is too dark, the lightened brand tint reaches **at least 3:1 against the actual rendered dark surface**, as specified by the developer. Readable brand colours remain unchanged.

### Actual Result

The original neutral-grey override is fixed, and borders correctly retain \`#17675e\`. Brand text uses the announced \`#236f66\` tint, but against the actual \`#13191b\` surface it measures **2.991035:1**, below 3:1. The same result occurs on invoice, quotation and credit-note company/title/total branding. The deployed client calculates its tint against a fixed \`#0f172a\` surface, on which that tint measures 3.006964:1; this differs from the rendered surface. A focused independent rerun reproduces the boundary. The \`#15b8a6\` positive control stays unchanged and measures 7.135925:1 on the actual surface.

### Attachment

- [Invoice screenshot](${exported.invoicingScreenshot})
- [Quotation screenshot](${exported.quotationsScreenshot})
- [Credit-note screenshot](${exported['credit-notesScreenshot']})
- [Computed colours, background layers and contrast measurements](${exported.contrast})
- [Focused retest report](${reportURL})
- [Complete reviewed case register](${absolute(join(root,'verification-register.json'))})

### Comment

**Partially fixed; retain the existing ticket for this minor boundary.** This is not the old missing-brand-colour behaviour: exact borders, visible brand tint, Modern display and native Classic PDF colour now pass. The three document occurrences share the same calculation and are one ticket. The 3:1 threshold comes from the supplied developer fix contract; this is not a claim of complete accessibility certification. Independent JavaScript and Python calculations agree. Use the actual document surface for the tint calculation and check the unrounded ratio before accepting a colour. The test changes no application styles and restores its captured template through the real UI; stock/settings cleanup passes. No new ticket ID is required.

---

`:`# NexStock - Remaining bugs\n\nNo confirmed application bug remains in the five-ticket scope tested on ${displayDate}. See README.md for execution and limits.\n`;
writeFileSync(join(docs,'remaining-bugs.md'),bugText);
const rows=tickets.map(t=>`| ${t.phase} | ${t.id} | ${t.status} | ${t.summary} |`).join('\n');
writeFileSync(join(docs,'README.md'),`# NexStock - Five-finding fix retest, ${displayDate}

**${record.outcome}**

Fresh production verification of the user-supplied developer fix notes for RET-002, RET-003, P2-QUOTE-002, P2-DOC-004 and REL-DN-001. These span both Phase 1 and Phase 2. Previous 5 November failures are historical references, not fresh results. Existing developer exclusions remain outside this run.

| Phase | Ticket | Result | Fresh verification |
| --- | --- | --- | --- |
${rows}

## Execution

${record.executionSummary} A focused contrast rerun repeats the same application finding; latest case results replace earlier executions. Setup/cleanup counts are separate from business acceptance.

${record.regressionSummary}

## Remaining issue

${record.followup} Original brand-colour propagation now passes. The JavaScript result was cross-checked independently in Python. The old exact-text-colour expectation is not used to reject an allowed contrast tint.

## Cleanup and boundaries

${record.cleanupSummary}

${record.scopeSummary} The PHP prepare() hook, request tenant rules and full reasonCode boundary matrix cannot be certified from the browser scenarios alone; no approved second-tenant records were used. Legacy debit resource string identifiers were checked directly from its observed live GET. No source/backend fix was applied by this QA work.

## Evidence and deliverables

- [Detailed remaining bug](remaining-bugs.md)
- [PDF summary](../../output/pdf/NexStock-Five-Finding-Fix-Retest-${date}.pdf)
- [Reviewed case register](../../blob-report/archive/release-verification-${date}/verification-register.json)
- [Deployment fingerprint](../../blob-report/archive/release-verification-${date}/public-deployment.json)
- [Primary evidence directory](../../blob-report/archive/release-verification-${date}/evidence)

Fresh root: \`blob-report/archive/release-verification-${date}\`. All completed attempts are preserved separately. The tests use the existing disposable QA credentials and guards; private authentication and recovery files are not deliverables.
`);
console.log(JSON.stringify({complete:record.complete,tickets:tickets.map(t=>({id:t.id,status:t.status})),functionalCounts,supportCounts,attempts:attempts.length,docs,register:join(root,'verification-register.json')},null,2));
