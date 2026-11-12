import { readFileSync,writeFileSync,readdirSync,existsSync } from 'node:fs';
import { resolve,join } from 'node:path';
import { classifyPhase2Result,isUnreviewedFlowError,needsFailureReview } from '../helpers/phase2-assessment.mjs';
const moduleName=process.argv[2];
const root=resolve(process.env.PHASE2_ARCHIVE_ROOT || 'blob-report/archive/phase2-2026-10-25');
const latest=new Map();const attempts=[];
for(const dir of readdirSync(root,{withFileTypes:true}).filter(x=>x.isDirectory()&&x.name.startsWith(moduleName+'-'))){
 const stage=join(root,dir.name),metaPath=join(stage,'execution.json'),resultPath=join(stage,'results.json');
 if(!existsSync(metaPath)||!existsSync(resultPath))continue;
 const meta=JSON.parse(readFileSync(metaPath,'utf8'));if(!meta.finished)continue;
 attempts.push({stage,meta,result:JSON.parse(readFileSync(resultPath,'utf8'))});
}
attempts.sort((a,b)=>a.meta.started.localeCompare(b.meta.started));
for(const {stage,result} of attempts){
 function walk(suites){for(const s of suites){for(const spec of s.specs||[])for(const test of spec.tests||[]){
  const executed=test.results.filter(x=>!['skipped','interrupted'].includes(x.status));if(!executed.length)continue;
  const final=executed.at(-1),annotations=test.annotations||[];
  const ids=[...new Set(annotations.filter(a=>a.type==='confirmed-bug').map(a=>a.description.split(':')[0]))];
  const status=classifyPhase2Result(final.status,annotations);
  latest.set(test.projectName+'|'+spec.file+'|'+spec.title,{module:moduleName,title:spec.title,file:spec.file,line:spec.line,project:test.projectName,status,raw:final.status,ids,annotations,stage,
   errors:final.errors?.map(e=>e.message.replace(/\x1b\[[0-9;]*m/g,'')),attachments:final.attachments?.filter(a=>a.path).map(a=>({name:a.name,path:a.path})),
   flowOutcomes:(final.attachments||[]).filter(a=>a.name==='full-flow-outcomes'&&a.body).map(a=>JSON.parse(Buffer.from(a.body,'base64').toString()))});
 }walk(s.suites||[]);}}
 walk(result.suites||[]);
}
const plan=JSON.parse(readFileSync('data/phase2-plan.json','utf8')).modules.find(m=>m.slug===moduleName);
const cases=[...latest.values()].filter(c=>!plan?.supersededTests?.includes(c.title)),counts={};
for(const c of cases){
 c.automationReviewSteps=(c.flowOutcomes||[]).flat().filter(isUnreviewedFlowError);
 if(c.automationReviewSteps.length||!['PASS','MOCK PASS'].includes(c.status)&&needsFailureReview(c.errors,c.flowOutcomes))c.status='AUTOMATION REVIEW';
 counts[c.status]=(counts[c.status]||0)+1;
}
const assessment={module:moduleName,counts,bugs:[...new Set(cases.flatMap(c=>c.ids))],attempts:attempts.map(a=>({stage:a.stage,stats:a.result.stats})),cases};
writeFileSync(join(root,`${moduleName}-assessment.json`),JSON.stringify(assessment,null,2));console.log(JSON.stringify({module:moduleName,counts,bugs:assessment.bugs}));
if(counts['AUTOMATION REVIEW'])process.exitCode=1;
