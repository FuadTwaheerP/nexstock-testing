import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve(process.env.RELEASE_VERIFICATION_ROOT||'blob-report/archive/release-verification-2026-11-04');
const scopePath='data/release-verification-2026-11-04.json',scope=JSON.parse(readFileSync(scopePath,'utf8'));
const recoveryFiles=['phase2-inventory-recovery.json','phase2-report-stock-recovery.json','phase2-template-recovery.json','phase2-notification-preferences.json'];const recovery=Object.fromEntries(recoveryFiles.filter(f=>existsSync('test-results/'+f)).map(f=>[f,JSON.parse(readFileSync('test-results/'+f,'utf8')).restored===true]));recovery.pendingOwnedHeldOrders=JSON.parse(readFileSync('test-results/phase2-held-recovery.json','utf8')).records.length;recovery.pendingNotificationTriggerInvoices=JSON.parse(readFileSync('test-results/phase2-notification-invoices.json','utf8')).invoices.filter(i=>!i.cancelled).length;
const interruptedAttempts=[];
const phase2=Object.keys(scope.phase2Claimed).flatMap(module=>{
 const p=join(root,'phase2',module+'-assessment.json');if(!existsSync(p))throw Error('Missing assessment '+module);
 return JSON.parse(readFileSync(p,'utf8')).cases.map(c=>({...c,phase:2,status:c.status==='FAIL'?'APPLICATION FAIL':c.status}));
});
const attempts=[],latest=new Map();
for(const phase of ['phase1','phase2'])for(const dir of readdirSync(join(root,phase),{withFileTypes:true}).filter(d=>d.isDirectory())){
 const stage=join(root,phase,dir.name),meta=join(stage,'execution.json'),result=join(stage,'results.json');if(!existsSync(meta)||!existsSync(result))continue;
 const execution=JSON.parse(readFileSync(meta,'utf8'));if(!execution.finished){interruptedAttempts.push({phase,stage,started:execution.started,module:execution.module,note:'Interrupted extra queue; captured QA stock was recovered and final cleanup subsequently passed.'});continue;}const data=JSON.parse(readFileSync(result,'utf8'));attempts.push({phase,stage,...execution,stats:data.stats});
 if(phase!=='phase1')continue;
 function walk(s){for(const spec of s.specs||[])for(const test of spec.tests||[]){const final=test.results.filter(r=>!['skipped','interrupted'].includes(r.status)).at(-1);if(!final)continue;
  const annotations=test.annotations||[],errors=(final.errors||[]).map(e=>e.message.replace(/\x1b\[[0-9;]*m/g,''));let ids=[...new Set(annotations.filter(a=>a.type==='confirmed-bug').map(a=>a.description.split(':')[0]))];
  const bankErrors=errors.length&&errors.every(e=>/Expected substring: "(?:QA Commercial Tax Invoice|QA Test Bank|QA-NOT-A-REAL-ACCOUNT|QA only - do not pay)"/.test(e));
  // Explicit reviewed application failure: saved/reloaded settings and the
  // downloaded PDF are preserved separately as the oracle. Never mask a
  // timeout, cleanup error or unrelated assertion with this classification.
  if(final.status==='failed'&&/configured banking/.test(spec.title)&&bankErrors)ids=['RET-002'];
  let status=final.status==='passed'?'PASS':'AUTOMATION REVIEW';
  if(final.status==='failed'&&ids.includes('RET-002')&&bankErrors)status='APPLICATION FAIL';
  if(final.status==='failed'&&ids.includes('RET-003')&&errors.every(e=>/intercepts pointer events/.test(e)))status='APPLICATION FAIL';
  const c={phase:1,module:execution.module,title:spec.title,file:spec.file,line:spec.line,project:test.projectName,status,raw:final.status,ids,annotations,errors,stage,started:execution.started,attachments:final.attachments||[]};
  const key=[c.project,c.file,c.title].join('|'),old=latest.get(key);if(!old||old.started<c.started)latest.set(key,c);
 }for(const child of s.suites||[])walk(child);}walk(data);
}
const cases=[...latest.values(),...phase2],functional=cases.filter(c=>!/(?:setup|cleanup|teardown)/.test(c.project));
const byModule=(module,phase)=>functional.filter(c=>c.module===module&&c.phase===phase);
const allPass=cs=>cs.length>0&&cs.every(c=>c.status==='PASS');
const primary=[
 {id:'RET-001',phase:1,module:'pos',status:allPass(byModule('pos',1))?'FIXED':'REVIEW',note:'Existing QA customer lookup (lowercase/uppercase), VAT checkout, receipt print and a fresh empty order.'},
 {id:'RET-002',phase:1,module:'invoicing',status:byModule('invoicing',1).some(c=>c.status==='APPLICATION FAIL')?'PARTIAL':allPass(byModule('invoicing',1))?'FIXED':'REVIEW',note:'Native invoice/quotation downloads and identity/amounts work. Company Settings header and bank/payment notes remain absent from invoice PDFs. Credit/debit print views are checked separately.'},
 {id:'RET-003',phase:1,module:'hardware',status:byModule('hardware',1).some(c=>c.status==='APPLICATION FAIL')?'OPEN':allPass(byModule('hardware',1))?'FIXED':'REVIEW',note:'Variant scroll content covers the action footer at 1920 x 1080 and 1440 x 900.'},
 {id:'RET-004',phase:1,module:'suppliers',status:allPass(byModule('suppliers',1))&&byModule('purchase-orders',2).some(c=>c.title.startsWith('RET-004')&&c.status==='PASS')?'FIXED':'REVIEW',note:'Active positive control remains selectable, inactive QA vendor is excluded, and API rejects an inactive supplier with HTTP 422.'},
];
const help={id:'HELP-001',phase:1,module:'help',status:allPass(byModule('help',1))?'FIXED':'REVIEW',note:'Public Terms/Privacy desktop and mobile navigation do not submit or validate login. Legal wording/approval are outside this check.'};
const notes={
 'purchase-orders':'Delivery branch and MUR default persist; approval, partial/final receiving and real PO PDF pass.',
 'pos-extensions':'Persisted held cart resumes with two units/Rs 200; other holds remain; checkout and formal invoice pass.',
 quotations:'Saved quote route/status/PDF and one-time conversion pass; acceptance moves no stock. Notes, terms and line/document discount arithmetic persist.',
 'stock-counts':'Frozen-cost variance arithmetic, exact count-linked adjustment history and first positive balance creation pass. Stock is restored.',
 dashboard:'Configured revenue/orders/AOV, chart and product ranking bind live stats; branch selector reconciles displayed stock value.',
 reports:'Complete low-stock and inventory valuation; product sales quantity/revenue delta and draft/cancelled exclusion; CSV and Rs formatting.',
 'products-bulk':'CSV/JSON include the complete catalogue; branch columns and totals reconcile against Store Inventory.',
 'goods-receipts':'Restock estimate uses cost Rs 40 rather than selling price Rs 100.',
 'audit-logs':'Fresh create/update/delete/export logs; module/user/action/date filters; actor search with a no-match control.',
 'document-templates':'Saved text, native Classic PDF colour and Modern display pass. Classic dark invoice/quotation/credit-note views override the chosen brand colour, contrary to the confirmed user policy.',
 notifications:'Unique past-due invoice alert arrived within the immediate delivery check; trigger invoice cancelled and preferences restored.',
 'bills-payable':'Bank/cheque reference and method persist with correct balances; payment dialog defaults to the selected bill amount due.',
 'supplier-history':'Supplier PO/receipt linkage and bill/payment ledger show the owned documents, amounts and references.',
 'credit-notes':'Reason code/details persist. Refunds 40 + 60 settle a 100 credit; over-refund is rejected. Allocation is explicitly not delivered.',
};
const tickets=Object.entries(scope.phase2Claimed).flatMap(([module,ids])=>ids.map(id=>{
 const cs=byModule(module,2);let status=cs.length&&cs.some(c=>c.status==='PASS')&&!cs.some(c=>c.status==='AUTOMATION REVIEW'||c.status==='BLOCKED'||c.status==='APPLICATION FAIL'&&c.ids.includes(id))?'FIXED':'REVIEW';if(id==='P2-QUOTE-002'&&cs.some(c=>c.status==='APPLICATION FAIL'&&c.ids.includes(id)))status='PARTIAL';
 if(id==='P2-CN-004'&&cs.some(c=>c.title.includes('partial and final QA cash refunds')&&c.status==='PASS'))status='PARTIAL';
 if(id==='P2-DOC-004')status=allPass(cs)?'FIXED':cs.some(c=>c.status==='BLOCKED')?'UNCONFIRMED':cs.some(c=>c.ids.includes(id))&&scope.darkBrandingPolicy==='preserve'?'PARTIAL':'REVIEW';
 return {id,phase:2,module,status,note:id==='P2-QUOTE-002'?'Notes/terms and discounts persist and the web view displays them, but customer-facing Notes are missing from the actual quotation PDF; terms and totals print correctly.':notes[module],evidence:cs.map(c=>({title:c.title,status:c.status,stage:c.stage}))};
}));
function counts(rows){const out={};for(const r of rows)out[r.status]=(out[r.status]||0)+1;return out;}
const blockers=cases.filter(c=>c.status==='AUTOMATION REVIEW'),pending=[...primary,help,...tickets].filter(t=>t.status==='REVIEW');
const report={generatedAt:new Date().toISOString(),target:scope.target,company:scope.company,source:scope.source,archive:root,deployment:JSON.parse(readFileSync(join(root,'public-deployment.json'),'utf8')),complete:!blockers.length&&!pending.length&&Object.values(recovery).every(v=>v===true||v===0),recovery,interruptedAttempts,
 counts:{phase1Round2:counts(primary),help:help.status,phase2Claimed:counts(tickets),phase2Excluded:scope.notIncluded.length,functional:counts(functional),support:counts(cases.filter(c=>!functional.includes(c)))},
 primary,help,phase2:tickets,notIncluded:scope.notIncluded,partialDelivery:scope.partialDelivery,limits:scope.limits,
 confirmedBugs:[...new Set(functional.filter(c=>c.status==='APPLICATION FAIL').flatMap(c=>c.ids))],unconfirmedObservations:scope.darkBrandingPolicy==='preserve'?[]:['Classic dark document colour policy is unconfirmed.'],policyConfirmation:scope.darkBrandingPolicyConfirmation,
 additionalFindings:[{id:'REL-DN-001',module:'debit-note print',status:'OPEN',note:'Corrected print route opens, but a debit created for the selected QA product displays Item 4 and a missing SKU instead of its product identity. New finding, not an original release ticket.'}],
 automationCorrections:['Recovered the captured QA stock baseline after an extra queue was interrupted; final cleanup is checked independently.','Updated product/customer Actions menus and catalogue column lookup.','Scoped the redesigned cart by main/list item and quantity control.','Matched headings with status badges and widget labels with changed descriptions.','Accepted the canonical POS invoice-number prefix; verified actual PDF identity.','Filled newly required credit reasons and debit due date; used a valid linked QA fixture.','Waited for fresh held-order reads and respected cached dashboard responses.','Reconciled count value against frozen unit cost and parsed -Rs negative amounts.','Used labelled audit controls and waited for modal dismissal before further actions.'],
 attempts:attempts.sort((a,b)=>a.started.localeCompare(b.started)),cases,functionalCases:functional};
writeFileSync(join(root,'verification-register.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({complete:report.complete,counts:report.counts,confirmedBugs:report.confirmedBugs,pending:pending.map(t=>t.id),automationReview:blockers.map(c=>({module:c.module,title:c.title}))},null,2));
if(!report.complete)process.exitCode=1;
