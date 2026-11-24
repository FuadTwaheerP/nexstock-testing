import {readFileSync,readdirSync,existsSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root=process.env.PHASE3_ARCHIVE_ROOT||'blob-report/archive/retest-2026-11-19';
const plan=JSON.parse(readFileSync('data/phase3-plan.json','utf8'));
const strip=s=>String(s||'').replace(/\x1b\[[0-9;]*m/g,'');
function flatten(result){const rows=[];function walk(s){for(const p of s.specs||[])for(const t of p.tests||[])rows.push({key:[p.file,p.title,t.projectName].join('|'),file:p.file,title:p.title,project:t.projectName,annotations:t.annotations||[],result:t.results?.at(-1)});for(const c of s.suites||[])walk(c);}walk(result);return rows;}
const cases=[],modules=[];
for(const module of plan.modules){
 const stages=readdirSync(root).filter(s=>new RegExp('^'+module.slug+'-\\d+$').test(s)).sort((a,b)=>Number(a.split('-').at(-1))-Number(b.split('-').at(-1))),latest=new Map();let lastFinished,globalErrors=[];
 for(const stage of stages){const path=join(root,stage,'results.json');if(!existsSync(path))continue;const result=JSON.parse(readFileSync(path,'utf8'));for(const c of flatten(result))if(c.result)latest.set(c.key,{...c,stage:resolve(root,stage)});lastFinished=stage;globalErrors=(result.errors||[]).map(e=>strip(e.message));}
 const collection=join(root,'compile',module.slug,'results.json'),expected=existsSync(collection)?flatten(JSON.parse(readFileSync(collection,'utf8'))):[...latest.values()];
 for(const e of expected){const c=latest.get(e.key);if(!c)continue;const errors=(c.result.errors||[]).map(x=>strip(x.message)),support=c.project.endsWith('-setup')||c.project.endsWith('-cleanup')||c.title.startsWith('support ')||c.annotations.some(a=>a.type==='support-only')||c.title==='recover stock added by the two earlier owned standalone credit attempts',app=errors.some(s=>/^Error:\s*\[(?:P3-|P2-|MVP-|RET-|REL-)/.test(s)),unhandled=errors.filter(s=>!/^Error:\s*\[(?:P3-|P2-|MVP-|RET-|REL-|BLOCKED)/.test(s));
  const classification=unhandled.length?'AUTOMATION REVIEW':app?'APPLICATION FAIL':errors.length?'BLOCKED':c.result.status!=='passed'?'NOT EXECUTED':support?'SUPPORT PASS':c.annotations.some(a=>a.type==='blocked')?'BLOCKED':c.annotations.some(a=>a.type==='partial-coverage')?'PARTIAL':'PASS';
  cases.push({module:module.slug,key:c.key,file:c.file,title:c.title,project:c.project,stage:c.stage,rawStatus:c.result.status,support,classification,errors:errors.map(s=>s.slice(0,1600)),annotations:c.annotations,attachments:(c.result.attachments||[]).map(a=>({name:a.name,path:a.path,...(a.body&&a.contentType==='application/json'?{json:JSON.parse(Buffer.from(a.body,'base64').toString())}:{})}))});
 }
 modules.push({module:module.slug,lastFinished,collected:expected.length,executed:expected.filter(e=>latest.has(e.key)).length,globalErrors});
}
const index={generatedAt:new Date().toISOString(),modules,cases};writeFileSync(join(root,'execution-index.json'),JSON.stringify(index,null,2));
const counts=Object.fromEntries([...new Set(cases.map(c=>c.classification))].map(k=>[k,cases.filter(c=>c.classification===k).length]));
console.log(JSON.stringify({completedModules:modules.filter(m=>m.lastFinished).length,counts,review:cases.filter(c=>c.classification==='AUTOMATION REVIEW').map(c=>({module:c.module,title:c.title,stage:c.stage,errors:c.errors})),pendingModules:modules.filter(m=>!m.lastFinished).map(m=>m.module)},null,2));
