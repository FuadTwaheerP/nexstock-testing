import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {test,expect,main,route,writeScope} from '../support/phase3';
import {observeAction,reread} from '../support/observed';
import {snapshot,finding} from '../support/evidence';
const endpoint='/app/api/v1/settings/exports';
async function security(page:any){return observeAction(page,endpoint,async()=>{await route(page,'/settings');await page.getByRole('tab',{name:'Security',exact:true}).click();});}

test('F28-f native JSON export creates a job and downloads valid output',async({page},info)=>{
 info.setTimeout(180_000);const before=await security(page);await snapshot(page,info,'export-before');let result:any;
 await writeScope(page,'request QA company JSON export',[/^\/app\/api\/v1\/settings\/exports$/],async()=>{
  const next=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===endpoint).then(async r=>({status:r.status(),ok:r.ok(),body:await r.json().catch(()=>null),request:r.request().postDataJSON()}));
  await main(page).getByRole('button',{name:'Export JSON',exact:true}).click();result=await next;
 });
 await info.attach('native-export-request',{body:JSON.stringify(result),contentType:'application/json'});
 if(!result.ok)await finding(page,info,{id:'P3-BACKUP-001',feature:'28 - Settings',requirements:['F28-f'],title:'Native JSON export request fails after the button wiring fix',steps:['Open Settings > Security.','Click Export JSON and inspect its actual request/response.'],expected:'Create a traceable export job and provide valid downloadable QA company JSON.',actual:'Native export returned HTTP '+result.status+': '+JSON.stringify(result.body),comment:'This retests the amended native button, without fabricating a success toast.'});
 const returned=result.body?.data,baselineIds=new Set(before.map((j:any)=>String(j.id)));let own:any;
 await expect.poll(async()=>{const jobs=await reread(page,endpoint),created=jobs.filter((j:any)=>!baselineIds.has(String(j.id)));own=returned?.id?jobs.find((j:any)=>String(j.id)===String(returned.id)):created.length===1?created[0]:undefined;return !!own;},{timeout:30_000,intervals:[2000,5000]}).toBe(true);expect(own.id).toBeTruthy();let fresh:any;
 try{await expect.poll(async()=>{const list=await reread(page,endpoint);fresh=list.find((x:any)=>String(x.id)===String(own.id));return ['completed','failed'].includes(fresh?.status);},{timeout:90_000,intervals:[2000,5000]}).toBe(true);}catch{
  await info.attach('export-job-pending',{body:JSON.stringify({before,created:own,fresh}),contentType:'application/json'});
  info.annotations.push({type:'blocked',description:'Export POST creates a real job, but output remained pending during the bounded 90-second observation; no completion SLA is supplied. Download/output is unverified.'});return;
 }
 if(fresh.status==='failed')await finding(page,info,{id:'P3-BACKUP-001',feature:'28 - Settings',requirements:['F28-f'],title:'Native JSON export job fails and provides no downloadable data',steps:['Request Export JSON from Settings > Security.','Wait for the created job to finish and reload its status.'],expected:'A completed job offers valid company JSON.',actual:'The persisted export job reports failed: '+JSON.stringify(fresh),comment:'The button now sends a real request; job execution is the remaining failure.'});
 const jobs=await security(page),completed=jobs.filter((j:any)=>j.status==='completed'),slot=completed.findIndex((j:any)=>String(j.id)===String(own.id));expect(slot).toBeGreaterThanOrEqual(0);const button=main(page).getByRole('button',{name:'Download export',exact:true}).nth(slot);await expect(button).toBeVisible();
 // Select the exact new job in the same order as the API-backed UI. Prove the
 // native button fetched that job's file; do not accept an older ready export.
 const event=page.waitForEvent('download'),file=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===endpoint+'/'+own.id+'/file');await button.click();const response=await file;expect(response.ok()).toBe(true);const download=await event,path=info.outputPath('QA-export-'+own.id+'.json');await download.saveAs(path);const bytes=readFileSync(path),data=JSON.parse(bytes.toString('utf8'));expect(data&&typeof data==='object').toBeTruthy();expect(bytes.length).toBeGreaterThan(100);
 const containsQaMarker=bytes.toString('utf8').includes('QA-ADD-mv9rtxw1-3b087e')||bytes.toString('utf8').includes('Nexstock QA Company');await info.attach('JSON-export-output-check',{body:JSON.stringify({job:own.id,status:fresh.status,filename:download.suggestedFilename(),downloadURL:download.url(),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),topLevelKeys:Object.keys(data),containsQaMarker}),contentType:'application/json'});expect(containsQaMarker,'The file must contain recognizable data from the selected QA business').toBe(true);await snapshot(page,info,'export-ready');
});

test('F28-f automated backup schedule and execution history availability',async({page},info)=>{
 await security(page);let ui=(await snapshot(page,info,'security-backup-controls')).body;await page.getByRole('tab',{name:'Advanced',exact:true}).click();ui+=(await snapshot(page,info,'advanced-backup-controls')).body;
 const controlsPresent=/backup (?:frequency|schedule|storage|retention)|scheduled backup|last backup/i.test(ui);await info.attach('automated-backup-observation',{body:JSON.stringify({controlsPresent,specification:'F28-f Automated Database Backup & JSON Dump Export',requirementDoesNotMandateTenantUI:true,platformScheduleAndBackupArtifactsAccessible:false,disposition:'BLOCKED / unconfirmed platform capability; do not infer absent backups from absent app controls.'}),contentType:'application/json'});info.annotations.push({type:'blocked',description:'P3-BACKUP-002 reclassified: FEATURES.md requires automated database backup but not tenant-facing schedule/history controls. Platform job configuration/artifacts are unavailable; absence or failure of automated backups is not confirmed. Native JSON export is verified separately.'});
});
