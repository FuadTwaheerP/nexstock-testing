import {readFileSync,writeFileSync,mkdirSync,copyFileSync,existsSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
const root=resolve('blob-report/archive/final-mvp-2026-11-13'),out=join(root,'evidence');mkdirSync(out,{recursive:true});
const register=JSON.parse(readFileSync(join(root,'verification-register.json'),'utf8'));if(!register.complete)throw new Error('Review all cases first');
const index=[];
for(const item of register.cases.filter(c=>c.status==='APPLICATION FAIL')){
 const prefix=item.title.includes('upload two')?'font-prerequisites':item.title.startsWith('MVP-FONT invoice')?'invoice-picker':item.title.startsWith('MVP-FONT quotation')?'quotation-picker':item.title.includes('inactive customer')?'inactive-customer':item.title.includes('later-sorting')?'customer-pagination':'classic-contrast';
 const result=JSON.parse(readFileSync(join(resolve(item.stage),'results.json'),'utf8'));let selected;
 function walk(s){for(const spec of s.specs||[])for(const test of spec.tests||[])if(spec.title===item.title&&test.projectName===item.project)selected=test.results.at(-1);for(const child of s.suites||[])walk(child);}walk(result);if(!selected)throw new Error('Missing result '+item.key);
 const bodies=[],files=[];
 for(const [position,a] of selected.attachments.entries()){
  if(a.body){const text=Buffer.from(a.body,'base64').toString('utf8');let value=text;try{value=JSON.parse(text);}catch{}bodies.push({name:a.name,contentType:a.contentType,value});}
  if(a.path&&existsSync(a.path)&&['.png','.pdf'].includes(extname(a.path))){const name=prefix+'-'+String(position).padStart(2,'0')+'-'+a.name.replace(/[^a-zA-Z0-9-]+/g,'-').slice(0,70)+extname(a.path);copyFileSync(a.path,join(out,name));files.push({name:a.name,path:join(out,name).replaceAll('\\','/')});}
 }
 const jsonPath=join(out,prefix+'-observations.json');writeFileSync(jsonPath,JSON.stringify({case:item.key,ticketIds:item.ticketIds,review:item.review,stage:item.stage,observations:bodies},null,2));index.push({case:item.key,ticketIds:item.ticketIds,json:jsonPath.replaceAll('\\','/'),files});
}
// Keep the positive multipart setup proof from its original, separate attempt.
const setup=JSON.parse(readFileSync(join(root,'phase2/document-templates-3/results.json'),'utf8')),diagnostics=[];
function setupWalk(s){for(const spec of s.specs||[])for(const test of spec.tests||[])for(const r of test.results||[])for(const a of r.attachments||[])if(a.name.includes('diagnostic-fixture-setup')&&a.body)diagnostics.push({name:a.name,value:JSON.parse(Buffer.from(a.body,'base64').toString())});for(const child of s.suites||[])setupWalk(child);}setupWalk(setup);
writeFileSync(join(out,'diagnostic-font-setup.json'),JSON.stringify({scope:'Owned QA fixture setup, not a Settings UI pass',uploads:diagnostics},null,2));
const productSetup=JSON.parse(readFileSync(join(root,'phase2/document-templates-4/results.json'),'utf8')),productProof=[];
function productWalk(s){for(const spec of s.specs||[])for(const test of spec.tests||[])for(const r of test.results||[])for(const a of r.attachments||[])if(['font-capable-product-editor','saved-font-product'].includes(a.name)&&a.body){const text=Buffer.from(a.body,'base64').toString();let value=text;try{value=JSON.parse(text);}catch{}productProof.push({name:a.name,value});}for(const child of s.suites||[])productWalk(child);}productWalk(productSetup);
writeFileSync(join(out,'owned-product-create.json'),JSON.stringify(productProof,null,2));
writeFileSync(join(out,'index.json'),JSON.stringify(index,null,2));console.log(JSON.stringify(index.map(x=>({tickets:x.ticketIds,json:x.json,files:x.files.map(f=>({name:f.name,path:f.path}))})),null,2));
