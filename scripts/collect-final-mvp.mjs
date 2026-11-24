import {readFileSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join,relative} from 'node:path';
const root=resolve(process.argv[2]||'blob-report/archive/final-mvp-2026-11-13');
const reviewPath=join(root,'manual-review.json');
const reviews=existsSync(reviewPath)?JSON.parse(readFileSync(reviewPath,'utf8')):[];
const latest=new Map(),attempts=[];
for(const phase of ['phase1','phase2']){
 const parent=join(root,phase);if(!existsSync(parent))continue;
 for(const dir of readdirSync(parent)){
  const stage=join(parent,dir);if(!existsSync(join(stage,'execution.json'))||!existsSync(join(stage,'results.json')))continue;
  const meta=JSON.parse(readFileSync(join(stage,'execution.json'),'utf8'));if(!meta.finished)continue;
  const result=JSON.parse(readFileSync(join(stage,'results.json'),'utf8'));
  attempts.push({phase,module:meta.module,attempt:meta.attempt,stage:relative(process.cwd(),stage).replaceAll('\\','/'),started:meta.started,finished:meta.finished,stats:result.stats});
  function walk(suite){
   for(const spec of suite.specs||[])for(const t of spec.tests||[]){
    const key=[phase,meta.module,t.projectName,spec.file.replaceAll('\\','/'),spec.title].join('|');
    const run=t.results.at(-1),support=/setup|cleanup|teardown/.test(t.projectName);
    const item={key,phase,module:meta.module,project:t.projectName,file:spec.file.replaceAll('\\','/'),line:spec.line,title:spec.title,support,scope:spec.file.includes('release-custom-fonts')?'Explicit custom-font task':'Phase 1/2 MVP regression',attempt:meta.attempt,finished:meta.finished,stage:relative(process.cwd(),stage).replaceAll('\\','/'),rawStatus:t.status,annotations:t.annotations||[],status:t.status==='expected'?'PASS':t.status==='skipped'?'SKIPPED':'REVIEW',errors:(run?.errors||[]).map(e=>e.message),attachments:(run?.attachments||[]).filter(a=>a.path).map(a=>({name:a.name,path:a.path.replaceAll('\\','/')}))};
    const review=reviews.find(r=>r.key===key);if(review)Object.assign(item,{status:review.status,ticketIds:review.ticketIds||[],review:review.reason});
    if(!latest.has(key)||latest.get(key).finished<item.finished)latest.set(key,item);
   }
   for(const child of suite.suites||[])walk(child);
  }walk(result);
 }
}
const cases=[...latest.values()].sort((a,b)=>a.key.localeCompare(b.key));
const count=items=>items.reduce((out,c)=>(out[c.status]=(out[c.status]||0)+1,out),{});
const output={generatedAt:new Date().toISOString(),scope:'Fresh final MVP regression plus explicitly requested custom-font workflow; Phase 3 otherwise paused. Latest completed execution of each exact case replaces previous executions.',functional:count(cases.filter(c=>!c.support)),functionalByScope:{mvp:count(cases.filter(c=>!c.support&&c.scope==='Phase 1/2 MVP regression')),fonts:count(cases.filter(c=>!c.support&&c.scope==='Explicit custom-font task'))},support:count(cases.filter(c=>c.support)),attempts:attempts.sort((a,b)=>a.started.localeCompare(b.started)),cases};
output.complete=!cases.some(c=>c.status==='REVIEW');
writeFileSync(join(root,'verification-register.json'),JSON.stringify(output,null,2));
console.log(JSON.stringify({functional:output.functional,support:output.support,attempts:attempts.length,needsReview:cases.filter(c=>c.status==='REVIEW').map(c=>({key:c.key,errors:c.errors}))},null,2));
