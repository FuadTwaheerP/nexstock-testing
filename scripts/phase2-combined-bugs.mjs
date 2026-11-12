import {readFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve('blob-report/archive/phase2-2026-10-25');
const plan=JSON.parse(readFileSync('data/phase2-plan.json','utf8'));
const groups=new Map();
for(const m of plan.modules){
 const run=JSON.parse(readFileSync(join(root,m.slug+'-assessment.json'),'utf8'));
 const meta=JSON.parse(readFileSync('data/phase2-findings/'+m.slug+'.json','utf8'));
 if(run.counts['AUTOMATION REVIEW'])throw new Error('Unresolved automation in '+m.slug);
 for(const b of meta.bugs.filter(b=>run.bugs.includes(b.id)).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}))){
  const cases=run.cases.filter(c=>c.ids.includes(b.id)).sort((a,b)=>Number(/full.flow/i.test(a.title))-Number(/full.flow/i.test(b.title)));
  if(!cases.length)throw new Error('No confirmed execution for '+b.id);
  const entries=groups.get(b.id)||[];entries.push({module:m.module,slug:m.slug,b,meta,cases});groups.set(b.id,entries);
 }
}
const link=p=>resolve(p).replaceAll('\\','/');
const entries=[...groups.entries()];
const title=(id,sources)=>id==='RET-002'&&sources.length>1?'Invoice and quotation PDF export opens a public 404 page (existing RET-002)':sources[0].b.title;
const priority=sources=>sources.map(s=>s.b.priority).sort((a,b)=>['Critical','High','Medium','Low'].indexOf(a)-['Critical','High','Medium','Low'].indexOf(b))[0];
const date=s=>s==='2026-10-25'?'25 October 2026':s;
const paragraphs=(sources,key)=>sources.length===1?sources[0].b[key]:sources.map(s=>`**${s.module}:** ${s.b[key]}`).join('\n\n');
function render(id,sources){
 const modules=[...new Set(sources.map(s=>s.module))],requirements=[...new Set(sources.flatMap(s=>s.b.features))],dates=[...new Set(sources.map(s=>date(s.meta.testDate)))];
 let md=`## ${id}\n\n### Title\n\n${title(id,sources)}\n\n### Environment\n\n[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.\n\nModule${modules.length>1?'s':''}: ${modules.join('; ')}. Verified: ${dates.join('; ')}. Requirements: ${requirements.join(', ')}.\n\n### Priority\n\n${priority(sources)}\n\n### Step-by-step\n\n`;
 if(sources.length>1)md+='Reproduce either affected path below.\n\n';
 for(const s of sources){if(sources.length>1)md+=`**${s.module}**\n\n`;md+=s.b.steps.map((step,i)=>(i+1)+'. '+step).join('\n')+'\n\n';}
 md+=`### Expected Result\n\n${paragraphs(sources,'expected')}\n\n### Actual Result\n\n${paragraphs(sources,'actual')}\n\n### Attachment\n\n`;
 const used=new Set();
 for(const s of sources){
  const evidence=s.cases.flatMap(c=>(c.attachments||[]).filter(a=>a.name===id||s.b.evidenceNames?.includes(a.name)));
  let added=0;for(const a of evidence){if(used.has(a.path))continue;if(!existsSync(a.path))throw new Error('Missing attachment '+a.path);used.add(a.path);md+=`- [${s.module} — screenshot](${link(a.path)})\n`;if(++added>=(sources.length>1?1:2))break;}
  const context=s.cases.flatMap(c=>c.attachments||[]).find(a=>a.name==='error-context'&&a.path&&!used.has(a.path));
  if(context){if(!existsSync(context.path))throw new Error('Missing failure context');used.add(context.path);md+=`- [${s.module} — failure context](${link(context.path)})\n`;}
  const register=join(root,s.slug+'-assessment.json');if(!existsSync(register))throw new Error('Missing execution register');md+=`- [${s.module} — reviewed execution register](${link(register)})\n`;
 }
 md+='\n### Comment\n\n';
 if(sources.length>1)md+='This is one shared, previously logged ticket. Update/reopen **'+id+'** once; both affected paths are included here.\n\n';
 md+=paragraphs(sources,'comment')+'\n\n---\n\n';return md;
}
const option=name=>{const i=process.argv.indexOf(name);return i<0?undefined:process.argv[i+1];};
const offset=Number(option('--offset')??0),limit=Number(option('--limit')??entries.length);
if(!Number.isInteger(offset)||offset<0||!Number.isInteger(limit)||limit<1)throw new Error('Invalid range');
let md='';
if(offset===0){
 md='# Phase 2 — Detailed Bug Tickets\n\n';
 md+=`**${entries.length} unique confirmed tickets:** ${entries.filter(([id])=>id.startsWith('P2-')).length} Phase 2 tickets and ${entries.filter(([id])=>!id.startsWith('P2-')).length} existing ticket reproduced during Phase 2. Findings come from the 25–26 October 2026 test runs.\n\n`;
 md+='Duplicate failures are grouped under one ID. RET-002 includes both POS/invoice and quotation export paths. Corrected automation errors, blocked tests and unconfirmed mock observations are excluded from this bug list. Coverage limitations relevant to a ticket remain in its Comment.\n\n';
 md+='Attachment links refer to local evidence files; upload those files separately when sharing a ticket.\n\n';
 md+='| ID | Module | Title | Priority |\n| --- | --- | --- | --- |\n';
 for(const[id,sources]of entries)md+=`| [${id}](#${id.toLowerCase()}) | ${sources.map(s=>s.module).join('; ').replaceAll('|','/')} | ${title(id,sources).replaceAll('|','/')} | ${priority(sources)} |\n`;
 md+='\n';
}
for(const[id,sources]of entries.slice(offset,offset+limit))md+=render(id,sources);
process.stdout.write(md);
