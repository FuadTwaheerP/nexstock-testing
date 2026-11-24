import {type Page,type TestInfo} from 'playwright/test';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {proof} from './phase3';
import {expect} from 'playwright/test';
export const root=resolve(process.env.PHASE3_ARCHIVE_ROOT||'blob-report/archive/phase3-2026-11-17');
const findings=resolve(root,'findings.json');
export async function snapshot(page:Page,info:TestInfo,label:string){
 const state={url:page.url(),body:await page.locator('body').ariaSnapshot()};await info.attach(label,{body:JSON.stringify(state),contentType:'application/json'});await proof(page,info,label);return state;
}
export async function finding(page:Page,info:TestInfo,value:{id:string;feature:string;requirements:string[];title:string;steps:string[];expected:string;actual:string;comment:string;priority?:string;continue?:boolean}){
 mkdirSync(root,{recursive:true});const all=existsSync(findings)?JSON.parse(readFileSync(findings,'utf8')):[];
 const campaignDate=process.env.PHASE3_TEST_DATE||'17 November 2026';
 const evidence=await snapshot(page,info,value.id),entry={...value,environment:'Production https://nexstock.stylotech.mu/app; Nexstock QA Company; Windows/Chromium/Playwright 1.62.1; 1920 x 1080; '+campaignDate+'.',priority:value.priority||'High',lastVerified:new Date().toISOString(),stage:process.env.PHASE3_STAGE,url:evidence.url,attachments:[info.outputPath(value.id+'.png')],test:info.title};
 const existing=all.findIndex((f:any)=>f.id===value.id);if(existing>=0)all[existing]=entry;else all.push(entry);writeFileSync(findings,JSON.stringify(all,null,2));
 const docsRoot=resolve(process.env.PHASE3_DOCS_ROOT||'docs/phase3'),doc=resolve(docsRoot,'PHASE3-BUGS.md');mkdirSync(docsRoot,{recursive:true});
 const body=['# NexStock - Cumulative application retest bugs','Campaign: '+campaignDate+'. Updated after each confirmed finding. Application bugs only; automation corrections, blocked dependencies and user-requested physical skips are tracked separately.',''];
 for(const f of all.sort((a:any,b:any)=>Number(a.requirements[0].slice(1,3))-Number(b.requirements[0].slice(1,3))||a.id.localeCompare(b.id))){body.push('## '+f.id+' - Feature '+f.feature,'','### Title','',f.title,'','### Environment','',f.environment+' Requirements: '+f.requirements.join(', ')+'.','', '### Priority','',f.priority,'','### Step-by-step','',...f.steps.map((s:string,i:number)=>(i+1)+'. '+s),'','### Expected Result','',f.expected,'','### Actual Result','',f.actual,'','### Attachment','',...f.attachments.map((a:string)=>'- [Live screenshot]('+a.replaceAll('\\','/')+')'),'- Execution: `'+String(f.stage).replaceAll('\\','/')+'` (JSON/HTML report contains the live page snapshot).','','### Comment','',f.comment,'','---','');}
 writeFileSync(doc,body.join('\n')+'\n');info.annotations.push({type:'confirmed-bug',description:value.id+': '+value.actual});if(value.continue){expect.soft(false,'['+value.id+'] '+value.actual).toBe(true);return;}throw new Error('['+value.id+'] '+value.actual);
}
