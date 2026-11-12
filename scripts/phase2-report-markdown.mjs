import {readFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
const slug=process.argv[2],root=resolve('blob-report/archive/phase2-2026-10-25');
const run=JSON.parse(readFileSync(join(root,slug+'-assessment.json'),'utf8'));
const meta=JSON.parse(readFileSync('data/phase2-findings/'+slug+'.json','utf8'));
if(run.counts['AUTOMATION REVIEW'])throw new Error('Resolve automation issues before preparing final module tickets');
const clean=s=>s.replace(/(?:^|\s)@[\w-]+/g,'').trim(), link=p=>p.replaceAll('\\','/');
let md=`# ${meta.module} - Phase 2 findings\n\nTest date: **${meta.testDate}**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.\n\n## Execution summary\n\n`;
md+=`Final composite results: **${run.counts.PASS||0} passed, ${run.counts.FAIL||0} application-failing cases, ${run.counts.BLOCKED||0} blocked, 0 unresolved automation issues**.${run.counts['MOCK PASS']||run.counts['MOCK OBSERVATION']?` Separately: **${run.counts['MOCK PASS']||0} mocked UI passes and ${run.counts['MOCK OBSERVATION']||0} unconfirmed mock-based observations**; these are not live authorization/account-enforcement results.`:''} Duplicate failures are grouped into **${run.bugs.length} confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.\n\n`;
md+='A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.\n\n';
if(meta.limits?.length){md+='## Coverage limits / prerequisites\n\n'+meta.limits.map(s=>'- '+s).join('\n')+'\n\n';}
md+='## Confirmed application bugs\n\n';
if(!run.bugs.length)md+='No confirmed application bugs were found in the executed scope. This is not a pass for blocked/unverified requirements.\n\n';
for(const id of run.bugs){
 const b=meta.bugs.find(x=>x.id===id);if(!b)throw new Error('Missing reviewed ticket '+id);
 const cases=run.cases.filter(c=>c.ids.includes(id));
 md+=`## ${id}\n\n### Title\n\n${b.title}\n\n### Environment\n\nProduction NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; ${meta.testDate}. Requirements: ${b.features.join(', ')}.\n\n### Priority\n\n${b.priority}\n\n### Step-by-step\n\n${b.steps.map((s,i)=>(i+1)+'. '+s).join('\n')}\n\n### Expected Result\n\n${b.expected}\n\n### Actual Result\n\n${b.actual}\n\nAffected cases:\n\n${cases.map(c=>'- '+clean(c.title)).join('\n')}\n\n### Attachment\n\n`;
 const proofs=cases.flatMap(c=>(c.attachments||[]).filter(a=>a.name===id||b.evidenceNames?.includes(a.name)));
 for(const p of proofs.slice(0,3)){if(!existsSync(p.path))throw new Error('Missing evidence');md+=`- [${id} screenshot](${link(p.path)})\n`;}
 for(const c of cases.slice(0,2)){const p=c.attachments?.find(a=>a.name==='error-context');if(p?.path&&existsSync(p.path))md+=`- [${clean(c.title)} - failure context](${link(p.path)})\n`;}
 md+=`- [Reviewed execution register](${link(join(root,slug+'-assessment.json'))})\n\n### Comment\n\n${b.comment}\n\n---\n\n`;
}
if(meta.observations?.length)md+='## Unconfirmed observations / mocked scope — not confirmed bug tickets\n\n'+meta.observations.map(s=>'- '+s).join('\n')+'\n\n';
md+='## Corrected automation / maintenance - not application tickets\n\n'+(meta.automation||[]).map(s=>'- '+s).join('\n')+'\n\n';
md+='## Executed case register\n\n| Check | Final result | Evidence attempt |\n| --- | --- | --- |\n';
for(const c of run.cases)md+=`| ${clean(c.title).replaceAll('|','/')} | ${c.status}${c.ids.length?' - '+c.ids.join(', '):''} | ${c.stage.split(/[\\/]/).at(-1)} |\n`;
md+=`\nEvidence root: ${link(root)}. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.\n\n## Rerun\n\n\`\`\`powershell\nnode scripts/run-phase2.mjs ${slug}\nnode scripts/assess-phase2.mjs ${slug}\n\`\`\`\n\nAppend a spec filename to run a submodule independently or use \`--grep @full-flow\` for the integrated flow. Setup/cleanup remain required. Add \`--headed\` for a maximized visible browser.\n`;
process.stdout.write(md);
