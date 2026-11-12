import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve('blob-report/archive/phase1-round2-2026-10-26');
const latest=new Map(),attempts=[];
const decode=a=>a.body?Buffer.from(a.body,'base64').toString():a.path&&existsSync(a.path)?readFileSync(a.path,'utf8'):'';
for(const name of readdirSync(root)){
 const stage=join(root,name),metaPath=join(stage,'execution.json'),resultsPath=join(stage,'results.json');
 if(!existsSync(metaPath)||!existsSync(resultsPath))continue;
 const meta=JSON.parse(readFileSync(metaPath,'utf8'));if(!meta.finished)continue;
 attempts.push({stage,meta,result:JSON.parse(readFileSync(resultsPath,'utf8'))});
}
attempts.sort((a,b)=>a.meta.started.localeCompare(b.meta.started));
for(const {stage,meta,result} of attempts){
 function walk(suites){for(const s of suites){for(const spec of s.specs||[])for(const t of spec.tests||[]){
  const r=t.results.filter(r=>!['skipped','interrupted'].includes(r.status)).at(-1);if(!r)continue;
  const c={module:meta.module,title:spec.title,file:spec.file,line:spec.line,project:t.projectName,raw:r.status,stage,annotations:t.annotations||[],errors:(r.errors||[]).map(e=>e.message.replace(/\x1b\[[0-9;]*m/g,'')),attachments:r.attachments||[],durationMs:r.duration};
  c.status=r.status==='passed'?(t.projectName.startsWith('chromium-')?'PASS':'SUPPORT PASS'):'AUTOMATION REVIEW';
  if(r.status!=='passed'){
   const layout=(c.attachments.filter(a=>a.name==='variant-dialog-layout').map(decode).filter(Boolean).map(JSON.parse))[0];
   if(meta.module==='hardware'&&layout?.buttonReceivesPointer===false&&c.errors.every(e=>/intercepts pointer events/.test(e))){c.status='APPLICATION FAIL';c.bug='RET-003';}
   if(meta.module==='invoicing'&&c.errors.length&&c.errors.every(e=>/Expected substring: "(?:QA Commercial Tax Invoice|QA Test Bank|QA-NOT-A-REAL-ACCOUNT|QA only - do not pay)"/.test(e))){c.status='APPLICATION FAIL';c.bug='RET-002 (remaining branding coverage)';}
   if(meta.module==='help'){
    const steps=c.attachments.filter(a=>a.name==='full-flow-failed-steps').map(decode).filter(Boolean).flatMap(s=>JSON.parse(s));
    const knownSteps=steps.every(s=>/^Error: \[(?:HELP-001|PREREQUISITE BLOCKED)\]/.test(s.error));
    if(!steps.length||knownSteps){
     if(c.annotations.some(a=>a.type==='confirmed-bug'&&a.description.startsWith('HELP-001'))){c.status='APPLICATION FAIL';c.bug='HELP-001';}
     else if(c.annotations.some(a=>a.type==='prerequisite-blocked'))c.status='BLOCKED';
    }
   }
  }
  latest.set(c.project+'|'+c.file+'|'+c.title,c);
 }walk(s.suites||[]);}}
 walk(result.suites||[]);
}
const cases=[...latest.values()];
const definitions=[
 ['T022','RET-003','hardware',/Add to Order remains reachable on desktop/],
 ['T034','RET-002','invoicing',/^exports a valid PDF/],
 ['T035','RET-002','invoicing',/^includes configured banking/],
 ['T058','RET-002','invoicing',/^creates a Net 30/],
 ['T073','RET-001','pos',/^finds and links an existing/],
 ['T085','RET-001','pos',/^searches, builds an order/],
 ['T180','RET-004','suppliers',/^release purchase-order vendor/],
];
const primary=definitions.map(([id,bug,module,match])=>{
 const found=cases.filter(c=>c.module===module&&match.test(c.title));
 if(found.length!==1)throw new Error('Missing or ambiguous primary case '+id);
 return {...found[0],originalCaseId:id,originalBug:bug};
});
const additional=cases.filter(c=>c.project.startsWith('chromium-')&&!primary.some(p=>p.project===c.project&&p.file===c.file&&p.title===c.title));
const count=items=>items.reduce((r,c)=>(r[c.status]=(r[c.status]||0)+1,r),{});
const helpJournalPath=cases.find(c=>c.module==='help')?.stage;
const help=helpJournalPath&&existsSync(join(helpJournalPath,'help-run.json'))?JSON.parse(readFileSync(join(helpJournalPath,'help-run.json'),'utf8')):undefined;
const ticketDefinitions=[
 {id:'RET-001',title:'Existing POS customer selection',detail:'Existing QA customer selection and full checkout, receipt printing and new-order reset.'},
 {id:'RET-002',title:'Invoice export and branding',detail:'PDF export, canonical saved invoice number and amounts; configured header, banking instructions and payment notes.'},
 {id:'RET-003',title:'Basic-variant action footer',detail:'Normal pointer access to Add to order at 1920 x 1080; additional 1440 x 900 check.'},
 {id:'RET-004',title:'Inactive supplier eligibility',detail:'Active positive control selectable, inactive vendor excluded from new purchase orders.'},
];
const tickets=ticketDefinitions.map(t=>{const checks=primary.filter(c=>c.originalBug===t.id);return {...t,status:checks.every(c=>c.status==='PASS')?'FIXED':checks.some(c=>c.status==='PASS')?'PARTIAL':checks.every(c=>c.status==='APPLICATION FAIL')?'OPEN':'UNVERIFIED',cases:checks.map(c=>({id:c.originalCaseId,status:c.status,stage:c.stage}))};});
const review={scope:'Phase 1 Round 2: seven previously failing cases grouped into RET-001 to RET-004. Phase 2 excluded. HELP-001 is supplementary from the combined Phase 1 list.',generatedAt:new Date().toISOString(),timezone:'Indian/Mauritius',deployment:JSON.parse(readFileSync(join(root,'public-deployment.json'),'utf8')),primaryCounts:count(primary),additionalCounts:count(additional),supportCounts:count(cases.filter(c=>!c.project.startsWith('chromium-'))),tickets,primary,additional,cases,helpActivations:help?.events.filter(e=>e.category==='legal-entry-observation')||[],unexpectedHelpWrites:help?.events.filter(e=>e.category==='unexpected-application-write')||[],attempts:attempts.map(({stage,meta,result})=>({stage,started:meta.started,finished:meta.finished,stats:result.stats}))};
writeFileSync(join(root,'verification-register.json'),JSON.stringify(review,null,2));
console.log(JSON.stringify({primary:review.primaryCounts,additional:review.additionalCounts,support:review.supportCounts,tickets:tickets.map(t=>({id:t.id,status:t.status})),helpActivations:review.helpActivations.map(e=>({kind:e.kind,submitEvents:e.submitEvents,requiredFeedback:e.requiredFeedback})),reviewRequired:cases.filter(c=>c.status==='AUTOMATION REVIEW').map(c=>({title:c.title,errors:c.errors.map(e=>e.slice(0,240))}))}));
if(cases.some(c=>c.status==='AUTOMATION REVIEW')||review.unexpectedHelpWrites.length)process.exitCode=1;
