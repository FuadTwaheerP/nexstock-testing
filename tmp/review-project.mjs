import {readdirSync,readFileSync,writeFileSync,statSync,mkdirSync} from 'node:fs';
import {join,relative,extname} from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(), files=[];
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){if(entry.isDirectory()&&['node_modules','.git'].includes(entry.name))continue;const path=join(dir,entry.name);if(entry.isDirectory())walk(path);else files.push(path);}}
walk(root);
const rel=p=>relative(root,p).replaceAll('\\','/');
const source=files.filter(p=>/^(tests|helpers|checks|scripts|data|docs|\.github)\//.test(rel(p))||!rel(p).includes('/'))
 .filter(p=>/\.(?:ts|mjs|py|md|json|yml|txt)$/.test(p)&&!/(?:package-lock\.json|debug\.log)$/.test(p));
const inventory=source.map(path=>{const body=readFileSync(path,'utf8');return {path:rel(path),bytes:Buffer.byteLength(body),sha256:createHash('sha256').update(body).digest('hex'),lines:body.split('\n').length,
 tests:[...body.matchAll(/\b(?:test|setup|cleanup)\s*\(\s*(['"`])([^\n]*?)\1/g)].map(m=>m[2]),
 exports:[...body.matchAll(/export\s+(?:async\s+)?(?:function|const|class)\s+(\w+)/g)].map(m=>m[1]),
 bugIds:[...new Set(body.match(/\b(?:P2-[A-Z]+-\d{3}|RET-\d{3}|REL-DN-\d{3}|(?:HELP|SET|SUP|CUST|POS|SA|HW|INV|SEC)-\d{3})\b/g)||[])],
 imports:[...body.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(m=>m[1])};});
const results=[], invalid=[];
for(const path of files.filter(p=>/(?:^|[\\/])results\.json$/.test(p))){try{const value=JSON.parse(readFileSync(path,'utf8')),cases=[];function collect(s){for(const spec of s.specs||[])for(const test of spec.tests||[])cases.push({file:spec.file,title:spec.title,project:test.projectName,status:test.status,raw:(test.results||[]).at(-1)?.status,annotations:test.annotations||[]});for(const sub of s.suites||[])collect(sub);}collect(value);results.push({path:rel(path),startTime:value.stats?.startTime,stats:value.stats,cases,topErrors:(value.errors||[]).length});}catch(e){invalid.push({path:rel(path),error:e.message});}}
const groups={};for(const p of files){const key=rel(p).split('/')[0];groups[key]??={files:0,bytes:0};groups[key].files++;groups[key].bytes+=statSync(p).size;}
const report={reviewDate:'2026-11-12',groups,source:inventory,reports:results,invalid};
mkdirSync('tmp/project-review',{recursive:true});writeFileSync('tmp/project-review/index.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({files:files.length,sourceFiles:inventory.length,sourceBytes:inventory.reduce((a,x)=>a+x.bytes,0),reportCount:results.length,invalid,reportCases:results.reduce((n,r)=>n+r.cases.length,0),reportsByCampaign:Object.fromEntries([...new Set(results.map(r=>r.path.split('/').slice(0,3).join('/')))].map(c=>[c,results.filter(r=>r.path.startsWith(c+'/')).length]))},null,2));
for(const filename of ['data/feature-matrix.json','data/phase1-cases.json','data/phase2-plan.json','blob-report/archive/release-verification-2026-11-05/targeted-case-register.json','blob-report/archive/release-verification-2026-11-04/verification-register.json','blob-report/archive/phase1-round2-2026-10-26/verification-register.json']){const value=JSON.parse(readFileSync(filename,'utf8'));console.log('SCHEMA '+filename+' '+JSON.stringify(Array.isArray(value)?{length:value.length,fields:Object.keys(value[0])}:{fields:Object.fromEntries(Object.entries(value).map(([k,v])=>[k,Array.isArray(v)?{length:v.length}:typeof v]))}));}
