import {type Page,type TestInfo} from 'playwright/test';
import {readFileSync} from 'node:fs';
import {test,expect,route,main,record,writeScope,blocked,bug,proof,number} from '../../support/phase2';
export {test,expect};
export async function branches(page:Page){
  await page.goto('about:blank');
  const read=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/branches',{timeout:60_000}).then(async r=>{
    let body;try{body=await r.json();}catch(error){
      if(!String(error).includes('No resource with given identifier'))throw error;
      // Chromium can discard a just-replaced document's response buffer. Re-read
      // the same observed GET with its existing session headers, never a guessed
      // endpoint/token. The visible branch card remains the UI persistence check.
      const headers=await r.request().allHeaders();delete headers['if-none-match'];delete headers['if-modified-since'];
      const fresh=await page.context().request.get(r.url(),{headers});expect(fresh.ok()).toBe(true);body=await fresh.json();
    }return {ok:r.ok(),data:body.data};
  });
  const [,response]=await Promise.all([route(page,'/stores'),read]);expect(response.ok).toBe(true);const data=response.data;
  await expect(main(page).getByRole('heading',{name:'Stores & Branches',exact:true})).toBeVisible();
  const list=Array.isArray(data)?data:data.data;
  if(list.length)await expect(main(page).getByRole('heading',{name:list[0].name,exact:true})).toBeVisible();
  await main(page).evaluate(el=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
  return list;
}
export const card=(page:Page,name:string)=>main(page).locator('[data-slot="card"]').filter({has:page.getByRole('heading',{name,exact:true})});
export async function activeCount(page:Page){return number(await main(page).getByRole('paragraph').filter({hasText:/^\d+ Active locations$/}).innerText());}
export async function createBranch(page:Page,info:TestInfo){
  const owned=JSON.parse(readFileSync('blob-report/archive/phase2-2026-10-25/stores-lifecycle-1/safe-journal.json','utf8')).events.filter((e:any)=>e.category==='owned-fixture'&&e.kind==='branch');
  const existing=await branches(page),candidate=existing.find((b:any)=>owned.some((e:any)=>e.code===b.code&&e.name===b.name));
  if(candidate){const f={name:candidate.name,code:candidate.code,id:candidate.id,record:candidate};record({test:info.title,category:'owned-fixture',kind:'branch',name:f.name,code:f.code});await status(page,f,'Active');await branches(page);return f;}
  const inspection=existing.find((b:any)=>b.code==='QA-INSPECT-1017'&&b.name==='QA Inspection Store 20261017');
  if(inspection){const f={name:inspection.name,code:inspection.code,id:inspection.id,record:inspection,restoreStatus:'Active' as const,reusedActive:true};record({test:info.title,category:'owned-fixture',kind:'branch',name:f.name,code:f.code,restoreStatus:'Active'});await status(page,f,'Active');return f;}
  const token=Date.now().toString(36),name=`QA P2 close ${token}`,code='QA-P2-'+token.toUpperCase();
  await branches(page);record({test:info.title,category:'owned-fixture',kind:'branch',name,code});
  await main(page).getByRole('button',{name:'New Store',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Add New Store Branch',exact:true});
  await dialog.getByLabel('Store Name *',{exact:true}).fill(name);await dialog.getByLabel('Store Code *',{exact:true}).fill(code);
  await dialog.getByLabel('Branch Type *',{exact:true}).click();await page.getByRole('option',{name:'Retail Store',exact:true}).click();
  await expect(dialog.getByLabel('Store Name *',{exact:true})).toHaveValue(name);await expect(dialog.getByLabel('Store Code *',{exact:true})).toHaveValue(code);
  await writeScope(page,'create isolated zero-stock QA branch',[/^\/app\/api\/v1\/branches$/],async()=>{
    const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/app/api/v1/branches');
    await dialog.getByRole('button',{name:'Add Store',exact:true}).click();const response=await saved;
    const body=await response.json();await info.attach('branch-create-response',{body:JSON.stringify({status:response.status(),data:body}),contentType:'application/json'});if(body.error_key==='QUOTA_EXCEEDED')await blocked(info,'Company branch quota prevents a new isolated branch, and no earlier owned fixture is available. Not an application defect.');expect(response.ok(),'Valid QA branch creation must succeed').toBe(true);
  });
  await expect(dialog).toBeHidden();
  const records=await branches(page),saved=records.find((b:any)=>b.code===code);expect(saved,'Created QA branch must persist').toBeTruthy();
  await expect(card(page,name)).toBeVisible();return {name,code,id:saved.id,record:saved};
}
export async function status(page:Page,fixture:Awaited<ReturnType<typeof createBranch>>,value:'Active'|'Inactive'){
  expect(fixture.name).toMatch(/^QA (?:P2 close |Inspection Store 20261017$)/);await branches(page);const target=card(page,fixture.name);
  if(!await target.count())return false;
  await target.getByRole('button',{name:'Edit Store',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Edit Store Branch',exact:true});
  await expect(dialog.getByLabel('Store Code *',{exact:true})).toHaveValue(fixture.code);
  await dialog.getByLabel('Status',{exact:true}).click();await page.getByRole('option',{name:value,exact:true}).click();
  await writeScope(page,'set status of own QA branch '+fixture.id,[new RegExp('^/app/api/v1/branches/'+fixture.id+'$')],async()=>{
    const saved=page.waitForResponse(r=>!['GET','HEAD','OPTIONS'].includes(r.request().method())&&new URL(r.url()).pathname==='/app/api/v1/branches/'+fixture.id);
    await dialog.getByRole('button',{name:'Save Changes',exact:true}).click();expect((await saved).ok(),'QA branch status save must succeed').toBe(true);
  });
  await expect(dialog).toBeHidden();
  return true;
}
export async function recoverBranches(page:Page,owned:{name:string;code:string;restoreStatus?:'Active'|'Inactive'}[]){
  for(const candidate of owned){expect(candidate.name).toMatch(/^QA (?:P2 close |Inspection Store 20261017$)/);const records=await branches(page),found=records.find((b:any)=>b.code===candidate.code&&b.name===candidate.name);if(found)await status(page,{...candidate,id:found.id,record:found},candidate.restoreStatus||'Inactive');}
}
export async function closure(page:Page,info:TestInfo,checkCounts=false){
  const f=await createBranch(page,info);await branches(page);const before=await activeCount(page);
  try{
    if(checkCounts)expect(await activeCount(page),'Active QA fixture baseline').toBe(before);
    await status(page,f,'Inactive');const records=await branches(page),saved=records.find((b:any)=>b.id===f.id);
    await info.attach('branch-close-record',{body:JSON.stringify({before:f.record,after:saved}),contentType:'application/json'});
    if(!saved)await blocked(info,'Inactive branch is absent from the default branch list; no historical sales fixture or archived-branch viewer is available to prove retention. Do not assume hard deletion.');
    expect(saved.code).toBe(f.code);expect(saved.name).toBe(f.name);
    if(await card(page,f.name).count()){
      await card(page,f.name).getByRole('button',{name:'Edit Store',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Edit Store Branch',exact:true});
      if(!/Inactive/i.test(await dialog.getByLabel('Status',{exact:true}).innerText()))await bug(page,info,'P2-BRANCH-001','An Inactive status save does not survive a fresh branch read and reopening Edit.');
      await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
    }
    if(checkCounts)expect(await activeCount(page),'Closing the QA branch must reduce active count by exactly one').toBe(before-1);
    await proof(page,info,'closed-branch-retained');
  }finally{await status(page,f,'restoreStatus' in f?f.restoreStatus as 'Active':'Inactive');}
}
export async function staffScope(page:Page,info:TestInfo){
  const {staffScenario}=await import('../../users-rbac/support/staff');
  await staffScenario(page,info,'branch');
}
