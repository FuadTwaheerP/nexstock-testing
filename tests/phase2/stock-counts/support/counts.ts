import {type Page,type TestInfo} from 'playwright/test';
import {test,expect,route,main,writeScope,record,proof,bug,number} from '../../support/phase2';
import {stock,adjust,productSnapshot,type InventoryFixture} from '../../../phase1/stock-adjustments/support/adjustments';
export {test,expect};
const branch='QA Inspection Store 20261017',otherBranch='QA edit mvc3rwe7-552fc5 Updated';
const sku='QA-ADD-mv9rtxw1-3b087e',name='QA add mv9rtxw1-3b087e';
export async function compensate(page:Page,f:InventoryFixture){
 const now=await stock(page,f.sku,f.branch);
 if(now!==f.initial)await writeScope(page,'restore captured QA count stock',[/^\/app\/api\/v1\/inventory\/branches\/1\/adjustments$/],()=>adjust(page,f,f.initial-now,'QA P2 count restore '+Date.now()));
 expect(await stock(page,f.sku,f.branch)).toBe(f.initial);expect(await stock(page,f.sku,f.otherBranch)).toBe(f.otherInitial);
}
async function reopen(page:Page,ref:string){await route(page,'/stock-counts');await main(page).getByRole('cell',{name:ref,exact:true}).click();await expect(main(page).getByRole('heading',{level:1}).filter({hasText:ref})).toBeVisible();}
async function history(page:Page){
 await page.goto('about:blank');const read=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/inventory/branches/1/adjustments').then(async r=>({ok:r.ok(),body:await r.json()}));
 await route(page,'/inventory/adjustments');const result=await read;expect(result.ok).toBe(true);await expect(main(page).getByRole('combobox').nth(1)).toContainText(branch);
 return result.body.data.data;
}
export async function abandon(page:Page,id:string,ref:string){
 await reopen(page,ref);const button=main(page).getByRole('button',{name:'Abandon',exact:true});
 if(!await button.count())return;
 page.once('dialog',d=>d.accept());await writeScope(page,'abandon only owned QA count '+ref,[new RegExp('^/app/api/v1/inventory/stock-counts/'+id+'(?:/[^/]+)?$')],async()=>{
  const saved=page.waitForResponse(r=>!['GET','HEAD','OPTIONS'].includes(r.request().method())&&new URL(r.url()).pathname.startsWith('/app/api/v1/inventory/stock-counts/'+id));await button.click();expect((await saved).ok()).toBe(true);
 });
}
export async function countScenario(page:Page,info:TestInfo,mode:'entry'|'variance'|'reconcile'|'full',delta=2){
 info.setTimeout(180_000);
 const f:InventoryFixture={branch,otherBranch,sku,name,initial:await stock(page,sku,branch),otherInitial:await stock(page,sku,otherBranch),...await productSnapshot(page,sku)};
 record({test:info.title,category:'stock-baseline',kind:'count-stock',fixture:f});let id:string|undefined,ref='',committed=false;
 try{
  await writeScope(page,'seed only QA count product',[/^\/app\/api\/v1\/inventory\/branches\/1\/adjustments$/],()=>adjust(page,f,3,'QA P2 count seed '+Date.now()));
  await route(page,'/stock-counts');await main(page).getByRole('button',{name:'Start a count',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Start a count',exact:true});await dialog.getByRole('combobox',{name:'Branch',exact:true}).selectOption({label:branch});
  const notes='QA-P2-count-'+Date.now().toString(36);await dialog.getByRole('textbox',{name:'Notes',exact:true}).fill(notes);let created:any;
  await writeScope(page,'open own physical count',[/^\/app\/api\/v1\/inventory\/stock-counts$/],async()=>{
   const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/app/api/v1/inventory/stock-counts').then(async r=>({ok:r.ok(),body:await r.json()}));
   await dialog.getByRole('button',{name:'Start a count',exact:true}).click();const result=await saved;expect(result.ok).toBe(true);created=result.body.data;
  });
  id=String(created.id);ref=created.reference;record({test:info.title,category:'owned-fixture',kind:'stock-count',id,reference:ref,notes});await expect(dialog).toBeHidden();
  const frozenItem=created.items.find((r:any)=>r.sku===sku),unitCost=Number(frozenItem.unit_cost);expect(frozenItem.expected_quantity).toBe(f.initial+3);expect(Number.isFinite(unitCost),'Count must expose a finite frozen unit cost for an arithmetic oracle').toBe(true);expect(unitCost).toBeGreaterThan(0);
  // No unrelated positive balance is exposed to a partial-count commit.
  expect(created.items.filter((r:any)=>r.sku!==sku).every((r:any)=>r.expected_quantity===0)).toBe(true);
  const row=main(page).getByRole('row').filter({has:page.getByText(sku,{exact:true})});await expect(row).toHaveCount(1);
  expect(Number(await row.getByRole('cell').nth(1).innerText())).toBe(f.initial+3);await row.getByRole('spinbutton').fill(String(f.initial+3+delta));
  expect(Number(await row.getByRole('cell').nth(3).innerText())).toBe(delta);
  await writeScope(page,'save own QA counted quantity',[new RegExp('^/app/api/v1/inventory/stock-counts/'+id+'(?:/[^/]+)?$')],async()=>{
   const saved=page.waitForResponse(r=>!['GET','OPTIONS','HEAD'].includes(r.request().method())&&new URL(r.url()).pathname.startsWith('/app/api/v1/inventory/stock-counts/'+id));await main(page).getByRole('button',{name:'Save counts',exact:true}).click();expect((await saved).ok()).toBe(true);
  });
  await reopen(page,ref);await expect(row.getByRole('spinbutton')).toHaveValue(String(f.initial+3+delta));expect(Number(await row.getByRole('cell').nth(3).innerText())).toBe(delta);
  expect(number(await row.getByRole('cell').nth(4).innerText()),'Saved cost variance must equal counted delta times the cost frozen when this count opened').toBeCloseTo(delta*unitCost,2);
  await info.attach('count-calculation',{body:JSON.stringify({reference:ref,sku,expected:f.initial+3,counted:f.initial+3+delta,quantityVariance:delta,frozenUnitCost:unitCost,currentCatalogueCost:f.cost,expectedVarianceValue:delta*unitCost,costBasisScope:'Arithmetic against the cost frozen at count creation; weighted-average acquisition-cost policy is not independently certified.'}),contentType:'application/json'});await proof(page,info,'saved-count-variance');
  const missingValue=!/variance\s+value|value\s+variance|Rs\s*-?\s*[\d,]+/i.test(await main(page).innerText());
  if(mode==='reconcile'||mode==='full'||mode==='variance'){
   const auditBefore=await history(page);await reopen(page,ref);
   page.once('dialog',d=>d.accept());await writeScope(page,'commit only own QA physical count',[new RegExp('^/app/api/v1/inventory/stock-counts/'+id+'(?:/[^/]+)?$')],async()=>{
    const saved=page.waitForResponse(r=>!['GET','HEAD','OPTIONS'].includes(r.request().method())&&new URL(r.url()).pathname.startsWith('/app/api/v1/inventory/stock-counts/'+id));await main(page).getByRole('button',{name:'Commit',exact:true}).click();const response=await saved;expect(response.ok()).toBe(true);committed=true;
   });
   await info.attach('committed-count-screen',{body:await main(page).ariaSnapshot(),contentType:'text/plain'});
   const balance=await stock(page,sku,branch);if(balance!==f.initial+3+delta)await bug(page,info,'P2-COUNT-003','Committed count expected QA product stock '+(f.initial+3+delta)+', got '+balance+'.');expect(await stock(page,sku,otherBranch)).toBe(f.otherInitial);
   const key=(r:any)=>String(r.id||r.reference||r.adjustment_number);let auditAfter=await history(page),added=auditAfter.filter((r:any)=>!auditBefore.some((b:any)=>key(b)===key(r))),transportError:unknown;
   if(!added.length){try{await expect.poll(async()=>{try{auditAfter=await history(page);added=auditAfter.filter((r:any)=>!auditBefore.some((b:any)=>key(b)===key(r)));return added.length;}catch(e){transportError=e;throw e;}},{timeout:20_000,intervals:[1000,2000,4000]}).toBeGreaterThan(0);}catch(e){if(transportError)throw transportError;}}
   await info.attach('count-adjustment-history',{body:JSON.stringify({reference:ref,stockBefore:f.initial+3,stockAfter:balance,delta,before:auditBefore,after:auditAfter,added}),contentType:'application/json'});
   const missingAdjustment=!added.length;
   if(!missingAdjustment){const own=added.find((r:any)=>r.type==='count'&&String(r.reason).includes(ref));expect(own,'New adjustment identifies this committed count').toBeTruthy();const item=own.items.find((r:any)=>r.product?.sku===sku);expect(Number(item.difference)).toBe(delta);expect(Number.isFinite(Number(item.unit_cost))).toBe(true);}
   if(missingAdjustment){info.annotations.push({type:'confirmed-bug',description:'P2-COUNT-004: Commit changes QA stock without generating a visible Stock Adjustments history entry.'});await proof(page,info,'P2-COUNT-004');}
   if((mode==='full'||mode==='variance')&&missingValue){await reopen(page,ref);if(!/variance\s+value|value\s+variance|Rs\s*-?\s*[\d,]+/i.test(await main(page).innerText()))await bug(page,info,'P2-COUNT-002','Saved and committed count calculates quantity variance but exposes no cost-based variance value; expected '+delta+' × frozen Rs '+unitCost+' = Rs '+(delta*unitCost)+'.');}
   if(missingAdjustment)throw new Error('[P2-COUNT-004] Stock reconciles but no adjustment history entry is generated.');
  }
 }finally{await compensate(page,f);if(id&&!committed)await abandon(page,id,ref);}
}
