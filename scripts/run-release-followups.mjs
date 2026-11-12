import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve(process.env.RELEASE_VERIFICATION_ROOT||'blob-report/archive/release-verification-2026-10-30');
const jobs=[
 ['phase2','credit-notes','cash-refund.ui.spec.ts','return-reasons.ui.spec.ts','pdf-print.ui.spec.ts','release-debit-print.ui.spec.ts'],
 ['phase2','quotations'],
 ['phase2','dashboard','--grep','isolate a branch|widgets bind|saved revenue trend|top products exposes'],
 ['phase2','purchase-orders'],
 ['phase2','pos-extensions'],
 ['phase2','bills-payable','--grep','transaction reference'],
 ['phase2','reports','export-formats.ui.spec.ts','inventory-valuation.ui.spec.ts','low-stock.ui.spec.ts','product-performance.ui.spec.ts','--grep-invert','standard report PDF'],
 ['phase2','document-templates','--grep','saved primary theme'],
 ['phase2','stock-counts'],
 ['phase2','audit-logs','--grep','filter controls|fresh audit full flow'],
 ['phase2','products-bulk','export-branch-stock.ui.spec.ts','export-catalog.ui.spec.ts'],
 ['phase2','goods-receipts','--grep','cost'],
 ['phase2','notifications','overdue-invoices.ui.spec.ts'],
 ['phase2','supplier-history'],
 ['phase1','hardware','--grep','release basic-variant'],
 ['phase1','help','terms-of-service.ui.spec.ts','privacy-policy.ui.spec.ts','--grep','public .*without submitting|supports mobile keyboard'],
 ['phase1','pos','customer-linking.ui.spec.ts','pos-full-flow.ui.spec.ts','--grep','finds and links|searches, builds an order'],
 ['phase1','suppliers','release-vendor-availability.ui.spec.ts'],
 ['phase1','invoicing','branded-pdf-print.ui.spec.ts','invoicing-full-flow.ui.spec.ts','--grep','exports a valid PDF|includes configured banking|creates a Net 30'],
];
const review=process.argv.includes('--review'),selected=process.argv.slice(2).filter(a=>a!=='--review');let queue=process.env.RELEASE_JOB_FILE?JSON.parse(readFileSync(process.env.RELEASE_JOB_FILE,'utf8')).jobs:selected.length?jobs.filter(j=>selected.includes(j[1])):jobs;
if(review)queue=queue.flatMap(([phase,module])=>{
 if(phase!=='phase2')return [];const file=join(root,'phase2',module+'-assessment.json');if(!existsSync(file))return [];const assessment=JSON.parse(readFileSync(file,'utf8'));
 const cases=assessment.cases.filter(c=>c.status==='AUTOMATION REVIEW');if(cases.some(c=>c.project!==`phase2-${module}`))throw new Error('Review setup/cleanup manually before resuming '+module);
 const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return cases.length?[[phase,module,'--grep',cases.map(c=>escape(c.title)+'$').join('|')]]:[];
});
const manifest={started:new Date().toISOString(),pid:process.pid,mode:review?'Rerun reviewed automation corrections':'Release fix verification',jobs:[]};mkdirSync(root,{recursive:true});const file=join(root,'followups-'+Date.now()+'.json');
function save(){writeFileSync(file,JSON.stringify(manifest,null,2));}
async function execute(script,args,env){const child=spawn(process.execPath,[script,...args],{env:{...process.env,...env},stdio:'inherit'});return new Promise((done,reject)=>{child.once('error',reject);child.once('close',done);});}
for(const [phase,module,...args]of queue){
 const item={phase,module,args,started:new Date().toISOString()};manifest.jobs.push(item);save();
 const parent=join(root,phase),env={PHASE2_ARCHIVE_ROOT:join(root,'phase2'),RELEASE_RUN_ROOT:join(root,'phase1')};
 item.exitCode=await execute(phase==='phase2'?'scripts/run-phase2.mjs':'scripts/run-release-retest.mjs',[module,...args],env);
 if(phase==='phase2')item.assessmentCode=await execute('scripts/assess-phase2.mjs',[module],env);
 const stages=readdirSync(parent).filter(s=>s.startsWith(module+'-')&&/^\d+$/.test(s.slice(module.length+1))).sort((a,b)=>Number(a.slice(module.length+1))-Number(b.slice(module.length+1)));
 item.stage=join(parent,stages.at(-1));const result=JSON.parse(readFileSync(join(item.stage,'results.json'),'utf8'));item.stats=result.stats;item.finished=new Date().toISOString();save();
 const support=[];function walk(s){for(const x of s.specs||[])for(const t of x.tests||[])if(/setup|cleanup|teardown/.test(t.projectName))support.push(t);for(const x of s.suites||[])walk(x);}walk(result);
 if(support.some(t=>!['expected','skipped'].includes(t.status))){manifest.stopped='Setup/cleanup requires review before proceeding';break;}
}
manifest.finished=new Date().toISOString();save();
