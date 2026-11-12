import {type Page,type TestInfo} from 'playwright/test';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {test,expect,route,main,record,writeScope,proof,blocked} from '../../support/phase2';
import {branches} from '../../stores-lifecycle/support/branches';
import {stock,adjust,productSnapshot,type InventoryFixture} from '../../../phase1/stock-adjustments/support/adjustments';
export {test,expect};
const recovery='test-results/phase2-transfer-recovery.json';
const observedReads=new WeakMap<Page,{url:string;headers:Record<string,string>}>();
export async function restoreTransferStock(page:Page,f:InventoryFixture,ids:Record<string,string>){
 expect(f.sku).toMatch(/^QA-/);
 for(const [branch,baseline] of [[f.branch,f.initial],[f.otherBranch,f.otherInitial]] as const){
  expect(branch).toMatch(/^QA /);const now=await stock(page,f.sku,branch);
  if(now!==baseline)await writeScope(page,'restore QA transfer branch '+ids[branch],[new RegExp('^/app/api/v1/inventory/branches/'+ids[branch]+'/adjustments$')],()=>adjust(page,{...f,branch},baseline-now,'QA P2 transfer restore '+Date.now()));
  expect(await stock(page,f.sku,branch)).toBe(baseline);
 }
}
async function transferList(page:Page){
 const observed=observedReads.get(page);
 if(observed&&new URL(page.url()).pathname==='/app/transfers'){
  // Keep the real UI mounted between transitions. Re-read only the identical
  // observed GET with existing session headers, never a guessed endpoint or a
  // mutation. Headers remain in memory and are never attached to reports.
  await page.keyboard.press('Escape');const response=await page.context().request.get(observed.url,{headers:observed.headers,maxRedirects:0});expect(response.ok()).toBe(true);return (await response.json()).data.data;
 }
 await page.goto('about:blank');const read=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/inventory/transfers',{timeout:45_000}).then(async r=>{const headers=await r.request().allHeaders();delete headers['if-none-match'];delete headers['if-modified-since'];observedReads.set(page,{url:r.url(),headers});return {ok:r.ok(),body:await r.json()};});await route(page,'/transfers');const result=await read;expect(result.ok).toBe(true);await expect(main(page).getByRole('heading',{name:'Stock Transfers',exact:true})).toBeVisible();return result.body.data.data;
}
const ownedRow=(page:Page,id:string|number)=>main(page).getByRole('row').filter({has:page.locator('td:first-child').filter({hasText:new RegExp('^'+String(id)+'$')})});
async function detail(page:Page,transfer:any){const records=await transferList(page),current=records.find((r:any)=>String(r.id)===String(transfer.id));expect(current).toBeTruthy();const label=['transit','in_transit','dispatched','shipped'].includes(current.status)?'In Transit|Dispatched|Shipped':['received','completed'].includes(current.status)?'Received|Completed':current.status.replaceAll('_',' ');await expect(ownedRow(page,transfer.id).getByRole('cell').nth(4)).toHaveText(new RegExp('^(?:'+label+')$','i'));await ownedRow(page,transfer.id).getByRole('button').click();const dialog=page.getByRole('dialog',{name:'Transfer Details #'+transfer.id,exact:true});await expect(dialog).toBeVisible();return dialog;}
async function cancelDraft(page:Page,transfer:any){
 const records=await transferList(page),found=records.find((t:any)=>String(t.id)===String(transfer.id));if(!found||['cancelled','received','completed'].includes(found.status))return;
 if(!['draft','submitted','pending','pending_approval'].includes(found.status))return;
 const panel=main(page).getByText(transfer.reference_number,{exact:true}).first().locator('xpath=ancestor::div[.//button[normalize-space(.)="Cancel"]][1]');
 await expect(panel).toHaveCount(1);const refs=[...new Set((await panel.innerText()).match(/TRN-[A-Z0-9]+/g)||[])];expect(refs,'Cancel must target only this owned transfer card').toEqual([transfer.reference_number]);
 await panel.getByRole('button',{name:'Cancel',exact:true}).click();const confirm=page.getByRole('dialog').filter({has:page.getByRole('heading',{name:'Cancel Transfer',exact:true})});await expect(confirm).toBeVisible();await confirm.getByPlaceholder('Enter reason...',{exact:true}).fill('QA automation cleanup of owned transfer '+transfer.id);
 await writeScope(page,'cancel only owned QA draft '+transfer.id,[new RegExp('^/app/api/v1/inventory/transfers/'+transfer.id+'(?:/[^/]+)?$')],async()=>{const saved=page.waitForResponse(r=>!['GET','HEAD','OPTIONS'].includes(r.request().method())&&new URL(r.url()).pathname.startsWith('/app/api/v1/inventory/transfers/'+transfer.id));await confirm.getByRole('button',{name:'Confirm Cancellation',exact:true}).click();expect((await saved).ok()).toBe(true);});await expect(confirm).toBeHidden();
}
export async function recoverTransferStock(page:Page){if(existsSync(recovery)){
 const state=JSON.parse(readFileSync(recovery,'utf8'));
 if(state.restored)return;
 if(state.transfer){
  await cancelDraft(page,state.transfer);const records=await transferList(page),current=records.find((r:any)=>String(r.id)===String(state.transfer.id));
  if(current&&['transit','in_transit','dispatched','shipped'].includes(current.status)){
   const f=state.fixture,quantity=state.transfer.items[0].quantity_requested,now=await stock(page,f.sku,f.branch);
   if(now<quantity)await writeScope(page,'recover stock needed for own QA shipment receipt',[new RegExp('^/app/api/v1/inventory/branches/'+state.ids[f.branch]+'/adjustments$')],()=>adjust(page,f,quantity-now,'QA P2 transfer recovery seed '+Date.now()));
   const view=await detail(page,state.transfer);await writeScope(page,'complete only owned in-transit QA shipment '+current.id,[new RegExp('^/app/api/v1/inventory/transfers/'+current.id+'(?:/[^/]+)?$')],async()=>{const saved=page.waitForResponse(r=>!['GET','HEAD','OPTIONS'].includes(r.request().method())&&new URL(r.url()).pathname.startsWith('/app/api/v1/inventory/transfers/'+current.id));await view.getByRole('button',{name:'Mark as Received / Complete',exact:true}).click();expect((await saved).ok()).toBe(true);});
  }
 }
 if(state.transfer){const record=(await transferList(page)).find((r:any)=>String(r.id)===String(state.transfer.id));expect(record,'Owned transfer history must persist').toBeTruthy();expect(['cancelled','completed','received'],'No owned pending shipment may remain after recovery').toContain(record.status);}
 if(state.fixture)await restoreTransferStock(page,state.fixture,state.ids);
 state.restored=true;state.restoredAt=new Date().toISOString();writeFileSync(recovery,JSON.stringify(state,null,2));
}}
export async function startTransfer(page:Page,info:TestInfo,createOnly=false){
 info.setTimeout(480_000);
 await recoverTransferStock(page);
 const locations=await branches(page),source=locations.find((b:any)=>b.name==='QA Inspection Store 20261017'),dest=locations.find((b:any)=>b.name==='QA edit mvc3rwe7-552fc5 Updated');expect(source).toBeTruthy();expect(dest).toBeTruthy();
 const sku='QA-ADD-mv9rtxw1-3b087e',name='QA add mv9rtxw1-3b087e';
 const f:InventoryFixture={branch:source.name,otherBranch:dest.name,sku,name,initial:await stock(page,sku,source.name),otherInitial:await stock(page,sku,dest.name),...await productSnapshot(page,sku)};
 const ids={[source.name]:String(source.id),[dest.name]:String(dest.id)};record({test:info.title,category:'stock-baseline',kind:'transfer-stock',fixture:f,ids});writeFileSync(recovery,JSON.stringify({fixture:f,ids},null,2));
 try{
  await writeScope(page,'seed own QA transfer inventory',[new RegExp('^/app/api/v1/inventory/branches/'+source.id+'/adjustments$')],()=>adjust(page,f,5,'QA P2 transfer seed '+Date.now()));
  await route(page,'/transfers');await main(page).getByRole('button',{name:'New Transfer',exact:true}).click();const dialog=page.getByRole('dialog',{name:'New Transfer',exact:true});
  await expect(dialog.getByRole('combobox').nth(0)).toBeEnabled();
  await dialog.getByRole('combobox').nth(0).click();await page.getByRole('option',{name:source.name,exact:true}).click();await dialog.getByRole('combobox').nth(1).click();await page.getByRole('option',{name:dest.name,exact:true}).click();
  await dialog.getByRole('button',{name:'Next',exact:true}).click();await dialog.getByRole('button',{name:'Add Product',exact:true}).first().click();await dialog.getByRole('combobox').click();await page.getByRole('option',{name:name+' ('+sku+')',exact:true}).click();await dialog.getByRole('spinbutton').fill('2');await dialog.getByRole('button',{name:'Next',exact:true}).click();
  await expect(dialog).toContainText(source.name);await expect(dialog).toContainText(dest.name);let saved:any;
  await writeScope(page,'create only QA interbranch transfer',[/^\/app\/api\/v1\/inventory\/transfers$/],async()=>{
   const next=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/app/api/v1/inventory/transfers').then(async r=>({ok:r.ok(),status:r.status(),body:await r.json()}));await dialog.getByRole('button',{name:'Confirm transfer',exact:true}).click();const result=await next;await info.attach('transfer-create-response',{body:JSON.stringify(result),contentType:'application/json'});expect(result.ok).toBe(true);saved=result.body.data;
  });
  record({test:info.title,category:'owned-fixture',kind:'stock-transfer',id:saved.id,reference:saved.reference_number});writeFileSync(recovery,JSON.stringify({fixture:f,ids,transfer:saved},null,2));await expect(dialog).toBeHidden();
  let current=(await transferList(page)).find((r:any)=>r.id===saved.id);expect(current).toBeTruthy();await expect(ownedRow(page,saved.id)).toContainText('Draft');
  let view=await detail(page,saved);await expect(view).toContainText(f.sku);await expect(view).toContainText('2 units');await expect(view).toContainText(f.branch);await expect(view).toContainText(f.otherBranch);await expect(view).toContainText('Fuad Peerbocus');await proof(page,info,'created-qa-transfer');
  if(!createOnly){
   const states=[current.status];
   for(let step=0;step<8&&!['received','completed'].includes(current.status);step++){
    view=await detail(page,saved);const buttons=await view.getByRole('button').allTextContents();await info.attach('transfer-stage-'+step,{body:JSON.stringify({status:current.status,buttons,screen:await view.ariaSnapshot()}),contentType:'application/json'});
    const action=buttons.map(s=>s.trim()).find(s=>/^(Submit|Approve|Approve & Ship|Start Packing|Mark Packed|Pack|Dispatch|Ship|Receive|Receive Transfer|Confirm Receipt|Mark as Received|Mark as Received \/ Complete|Mark Shipped|Dispatch Shipment)$/i.test(s));
    if(!action)await blocked(info,'Rediscover action controls for reachable transfer status '+current.status+': '+buttons.join(', '));
    await writeScope(page,'advance only owned QA transfer '+saved.id+' using '+action,[new RegExp('^/app/api/v1/inventory/transfers/'+saved.id+'(?:/[^/]+)?$')],async()=>{
     const next=page.waitForResponse(r=>!['GET','HEAD','OPTIONS'].includes(r.request().method())&&new URL(r.url()).pathname.startsWith('/app/api/v1/inventory/transfers/'+saved.id)).then(async r=>({ok:r.ok(),status:r.status(),body:await r.json()}));await view.getByRole('button',{name:action,exact:true}).click();const result=await next;await info.attach('transfer-transition-'+step,{body:JSON.stringify(result),contentType:'application/json'});expect(result.ok).toBe(true);
    });
    current=(await transferList(page)).find((r:any)=>r.id===saved.id);states.push(current.status);
    if(['transit','dispatched','in_transit','shipped'].includes(current.status))await info.attach('in-transit-balances',{body:JSON.stringify({status:current.status,source:await stock(page,f.sku,f.branch),destination:await stock(page,f.sku,f.otherBranch)}),contentType:'application/json'});
   }
   await info.attach('transfer-status-progression',{body:JSON.stringify(states),contentType:'application/json'});expect(states.some(s=>['transit','dispatched','in_transit','shipped'].includes(s))).toBe(true);expect(['received','completed']).toContain(current.status);
   expect(await stock(page,f.sku,f.branch),'Received transfer subtracts two from seeded source balance').toBe(f.initial+3);expect(await stock(page,f.sku,f.otherBranch),'Received transfer adds two to destination balance').toBe(f.otherInitial+2);
   view=await detail(page,saved);await expect(view).toContainText(f.sku);await expect(view).toContainText('Fuad Peerbocus');await expect(view.getByText('Pending',{exact:true})).toHaveCount(0);expect(await view.getByText(/^\d{2}\/\d{2}\/\d{4}$/).count()).toBeGreaterThanOrEqual(3);await info.attach('received-transfer-detail',{body:await view.ariaSnapshot(),contentType:'text/plain'});await proof(page,info,'received-qa-transfer-history');
  }
 }finally{await recoverTransferStock(page);}
}
export async function transferCheck(page:Page,info:TestInfo,stage:string){await test.step(stage,()=>startTransfer(page,info,stage==='Create transfer prerequisite'));}
