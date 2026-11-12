import {type Page,type TestInfo} from 'playwright/test';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {test,expect,route,main,writeScope,proof,record,bug,blocked} from '../../support/phase2';
const recovery='test-results/phase2-held-recovery.json';
function remember(owned:any){const state=existsSync(recovery)?JSON.parse(readFileSync(recovery,'utf8')):{companyId:1,records:[]};state.records.push(owned);writeFileSync(recovery,JSON.stringify(state,null,2));}
function forget(id:any){if(!existsSync(recovery))return;const state=JSON.parse(readFileSync(recovery,'utf8'));state.records=state.records.filter((r:any)=>String(r.id)!==String(id));writeFileSync(recovery,JSON.stringify(state,null,2));}
export async function recoverHeld(page:Page){
 if(!existsSync(recovery))return;const state=JSON.parse(readFileSync(recovery,'utf8'));expect(state.companyId).toBe(1);
 for(const owned of state.records){
  await page.goto('about:blank');const next=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/sales/pos-held-orders').then(async r=>{expect(r.ok()).toBe(true);return (await r.json()).data;});await route(page,'/pos');const rows=await next;if(!rows.some((r:any)=>String(r.id)===String(owned.id))){forget(owned.id);continue;}
  await main(page).getByRole('button',{name:'Held',exact:true}).click();const d=page.getByRole('dialog',{name:'Held Orders',exact:true}),card=d.locator('div.rounded-xl.border.p-3').filter({has:page.getByRole('button',{name:'Resume',exact:true})}).filter({hasText:owned.label});expect(rows.filter((r:any)=>r.label===owned.label)).toHaveLength(1);await expect(card).toHaveCount(1);
  await writeScope(page,'recover only recorded owned QA service held order '+owned.id,[new RegExp('^/app/api/v1/sales/pos-held-orders/'+owned.id+'(?:/resume)?$')],async()=>{const saved=page.waitForResponse(r=>!['GET','HEAD','OPTIONS'].includes(r.request().method())&&new URL(r.url()).pathname.startsWith('/app/api/v1/sales/pos-held-orders/'+owned.id));await card.getByRole('button',{name:'Resume',exact:true}).click();expect((await saved).ok()).toBe(true);});await expect(d).toBeHidden();await expect(main(page).getByRole('complementary')).toContainText('QA service mvmgbd15-fba79b');forget(owned.id);
 }
}
export async function holdScenario(page:Page,info:TestInfo){
 await route(page,'/pos');await expect(page.getByPlaceholder('Search products or scan barcode…')).toBeVisible();
 const item=main(page).getByRole('button').filter({has:page.getByText('QA-SERVICE-mvmgbd15-fba79b',{exact:true})});await item.click();await item.click();
 const cart=main(page).getByRole('complementary');await expect(cart.getByRole('button',{name:'Charge Rs 200.00',exact:true})).toBeVisible();
 let owned:any;await writeScope(page,'hold only own QA service cart',[/^\/app\/api\/v1\/sales\/pos-held-orders$/],async()=>{
  const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/app/api/v1/sales/pos-held-orders').then(async r=>({ok:r.ok(),body:await r.json()}));
  await cart.getByRole('button',{name:'Hold',exact:true}).click();const result=await saved;expect(result.ok).toBe(true);owned=result.body.data;remember(owned);await info.attach('held-order-response',{body:JSON.stringify(result.body),contentType:'application/json'});record({test:info.title,category:'owned-fixture',kind:'held-order',record:owned});
 });
 await info.attach('post-hold-cart',{body:await cart.ariaSnapshot(),contentType:'text/plain'});
 await page.goto('about:blank');const loaded=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/sales/pos-held-orders').then(async r=>{const headers=await r.request().allHeaders();delete headers['if-none-match'];delete headers['if-modified-since'];return {ok:r.ok(),body:await r.json(),url:r.url(),headers};});
 await route(page,'/pos');const persisted=await loaded;await page.getByPlaceholder('Search products or scan barcode…').waitFor();expect(persisted.ok).toBe(true);await info.attach('held-order-readback',{body:JSON.stringify(persisted.body),contentType:'application/json'});
 await main(page).getByRole('button',{name:'Held',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Held Orders',exact:true});await expect(dialog).toBeVisible();
 await info.attach('held-orders-screen',{body:await dialog.ariaSnapshot(),contentType:'text/plain'});await proof(page,info,'held-order-list');
 const data=persisted.body.data,rows=Array.isArray(data)?data:data?.data||[];
 if(!rows.some((r:any)=>r.id===owned.id))await bug(page,info,'P2-POS-001','Hold returns a saved QA order ID, but the same-session fresh held-orders list omits it; the order cannot be resumed.');
 const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Indian/Mauritius',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(owned.created_at));
 const card=dialog.locator('div.rounded-xl.border.p-3').filter({has:page.getByRole('button',{name:'Resume',exact:true})}).filter({hasText:owned.label}).filter({hasText:time});
 try{await expect(card,'Only this newly created label/time card may be resumed').toHaveCount(1);}catch(error){if(await dialog.getByText('No orders on hold',{exact:true}).isVisible())await bug(page,info,'P2-POS-002','Persisted held order exists in the successful list response but Held Orders still says No orders on hold.');throw error;}
 expect(rows.filter((r:any)=>r.label===owned.label&&new Date(r.created_at).toISOString().slice(0,16)===new Date(owned.created_at).toISOString().slice(0,16))).toHaveLength(1);
 await writeScope(page,'resume and remove only new QA held order '+owned.id,[new RegExp('^/app/api/v1/sales/pos-held-orders/'+owned.id+'(?:/resume)?$')],async()=>{
  const saved=page.waitForResponse(r=>!['GET','HEAD','OPTIONS'].includes(r.request().method())&&new URL(r.url()).pathname.startsWith('/app/api/v1/sales/pos-held-orders/'+owned.id));await card.getByRole('button',{name:'Resume',exact:true}).click();expect((await saved).ok()).toBe(true);
 });
 forget(owned.id);
 await expect(dialog).toBeHidden();await expect(cart.getByRole('button',{name:'Charge Rs 200.00',exact:true})).toBeVisible();await expect(cart).toContainText('QA service mvmgbd15-fba79b');const restoredLine=cart.getByRole('listitem').filter({hasText:'QA service mvmgbd15-fba79b'});await expect(restoredLine).toHaveCount(1);await expect(restoredLine.locator('span.tabular-nums.w-8')).toHaveText('2');
 const fresh=await page.context().request.get(persisted.url,{headers:persisted.headers});expect(fresh.ok()).toBe(true);const remaining=(await fresh.json()).data;expect(remaining.some((r:any)=>String(r.id)===String(owned.id))).toBe(false);expect(remaining.map((r:any)=>String(r.id)).sort(),'Existing held orders are preserved').toEqual(rows.filter((r:any)=>String(r.id)!==String(owned.id)).map((r:any)=>String(r.id)).sort());
 await info.attach('held-order-resume-reconciliation',{body:JSON.stringify({ownedId:owned.id,label:owned.label,createdAt:owned.created_at,restoredQuantity:2,restoredTotal:200,otherHeldOrdersPreserved:remaining.length}),contentType:'application/json'});await proof(page,info,'resumed-qa-cart');
}
