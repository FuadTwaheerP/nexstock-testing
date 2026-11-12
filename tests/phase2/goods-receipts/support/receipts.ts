import {type Page,type TestInfo} from 'playwright/test';
import {readFileSync} from 'node:fs';
import {test,expect,main,proof,bug,blocked,route,writeScope,record,number} from '../../support/phase2';
import {captureInventory,restoreInventory,matrix,qaProduct} from '../../support/inventory';
import {openCatalog} from '../../products-bulk/support/catalog';
import {createPO,advancePO,receive,openPO} from '../../purchase-orders/support/purchasing';
export {test,expect};
async function standaloneGRN(page:Page,info:TestInfo){
 info.setTimeout(Math.max(info.timeout,180_000));const contract=JSON.parse(readFileSync('data/phase2-grn-contract.json','utf8'));expect(contract.requiredUserInputs).toEqual(['supplier','product','quantity']);await info.attach('confirmed-standalone-grn-contract',{body:JSON.stringify(contract),contentType:'application/json'});
 const observations:any[]=[],candidate=/\b(?:GRN|Goods Receipts?|Stock Receipts?|Receive Shipment|Ad.?hoc Receipt|New Receipt|Create Receipt|Receive Goods)\b/i;
 for(const [path,heading]of [['/purchasing/orders','Purchase Orders'],['/suppliers','Suppliers'],['/store-inventory',null]] as const){
  await route(page,path);if(heading)await expect(main(page).getByRole('heading',{name:heading,exact:true,level:1})).toBeVisible();else await expect(main(page).getByText(qaProduct.sku,{exact:true})).toBeVisible();
  const navigation=await page.getByRole('navigation').ariaSnapshot(),screen=await main(page).ariaSnapshot(),actions=await main(page).getByRole('button').or(main(page).getByRole('link')).allTextContents();observations.push({path,navigation,screen,actions});await proof(page,info,'standalone-grn-surface-'+observations.length);
  if(candidate.test(navigation)||actions.some(name=>candidate.test(name)))await blocked(info,'A possible standalone GRN entry now exists. Inspect its actual form before adapting minimum-input creation; do not classify a missing feature from old UI assumptions.');
 }
 await info.attach('standalone-grn-availability',{body:JSON.stringify({observations,scope:'Live navigation and purchasing/supplier/inventory surfaces; no GRN entry is exposed. This is a UI availability check, not a claim about unpublished backend endpoints.'}),contentType:'application/json'});
 await main(page).getByRole('button',{name:/^Restock\b/}).click();const d=page.getByRole('dialog',{name:'Restock Order',exact:true});
 try{await info.attach('existing-restock-is-not-grn',{body:await d.ariaSnapshot(),contentType:'text/plain'});if(await d.getByRole('combobox',{name:/supplier/i}).count()||await d.getByRole('textbox',{name:/supplier/i}).count())await blocked(info,'Restock now exposes supplier input; inspect whether it creates the required standalone GRN before classifying the gap.');await bug(page,info,'P2-GRN-003','No standalone no-PO GRN entry is available in the inspected purchasing, supplier or inventory UI. Existing Restock changes stock but offers no supplier input/receipt form. The confirmed minimum GRN requires supplier, product and quantity; every other detail is optional.');}finally{await d.getByRole('button',{name:'Cancel',exact:true}).click();}
}
async function poReceipt(page:Page,info:TestInfo,mode:string){
 info.setTimeout(Math.max(info.timeout,360_000));const baseline=await captureInventory(page);
 try{
  let po=await advancePO(page,info,await createPO(page,info));const id=po.id;await info.attach('receipt-stock-baseline',{body:JSON.stringify(baseline.balances),contentType:'application/json'});
  po=await receive(page,info,po,1,mode==='damage'||mode==='full'?1:0);expect(po.items[0].quantityReceived).toBe(1);expect(po.status).toBe('partially_received');
  const afterFirst=await matrix(page);await info.attach('receipt-first-stock',{body:JSON.stringify(afterFirst),contentType:'application/json'});
  const changed=afterFirst.filter((b:any)=>b.quantity!==baseline.balances.find((a:any)=>a.id===b.id).quantity);expect(changed,'Accepted receipt should change one QA branch').toHaveLength(1);expect(changed[0].quantity-baseline.balances.find((b:any)=>b.id===changed[0].id).quantity).toBe(1);expect(changed[0].id).toBe('1');
  po=await openPO(page,id);await proof(page,info,'received-quantity-persistence');
  if(mode==='receive'||mode==='stock')return;
  if(mode==='damage'||mode==='full'){
   await info.attach('saved-damaged-receipt-state',{body:JSON.stringify({order:po,screen:await main(page).ariaSnapshot()}),contentType:'application/json'});
   const reason='QA-P2 damaged packaging '+po.poNumber;let visible=false;try{await expect.poll(async()=>visible=(await main(page).innerText()).includes(reason),{timeout:12_000}).toBe(true);}catch{}
   if(!visible)await bug(page,info,'P2-GRN-001','Receipt accepts one item and rejects one with a reason, but reopening PO detail exposes no retained rejection reason/history after data settles. Stock correctly increments only the accepted quantity.');
   await proof(page,info,'retained-damage-reason');return;
  }
  po=await receive(page,info,po,3);expect(po.items[0].quantityReceived).toBe(4);expect(po.status).toBe('received');const final=await matrix(page);for(const b of baseline.balances)expect(final.find((x:any)=>x.id===b.id).quantity).toBe(b.quantity+(b.id==='1'?4:0));await openPO(page,id);await proof(page,info,'multiple-deliveries-completed');
 }finally{await restoreInventory(page);}
}
async function adHocRestock(page:Page,info:TestInfo){
 info.setTimeout(Math.max(info.timeout,360_000));const baseline=await captureInventory(page),product=(await openCatalog(page)).data.find((p:any)=>p.sku===qaProduct.sku);expect(product).toBeTruthy();let handler:any;const pattern='**/app/api/v1/inventory/branches/1/adjustments';
 try{
  await route(page,'/store-inventory');await expect(main(page).getByText(qaProduct.sku,{exact:true})).toBeVisible();await main(page).getByRole('button',{name:/^Restock\b/}).click();const d=page.getByRole('dialog',{name:'Restock Order',exact:true});await expect(d.getByLabel('Select all',{exact:true})).toBeChecked();await d.getByLabel('Select all',{exact:true}).uncheck();await expect(d.locator('input[type="checkbox"]:checked')).toHaveCount(0);
  await d.getByPlaceholder('Search name or SKU',{exact:true}).fill(qaProduct.sku);const row=d.getByText(qaProduct.sku,{exact:true}).locator('xpath=ancestor::div[input[@type="checkbox"]][1]');await row.getByRole('checkbox').check();await row.getByRole('spinbutton').fill('1');await expect(d).toContainText('1 item(s) selected');let payload:any;
  handler=async(intercepted:any)=>{if(intercepted.request().method()!=='POST')return intercepted.fallback();payload=intercepted.request().postDataJSON();try{expect(payload.branch_id).toBe(1);expect(payload.items).toHaveLength(1);expect(payload.items[0]).toMatchObject({product_id:Number(product.id),variant_id:null,quantity_adjusted:1});expect(payload.reason).toBe('Restock');record({category:'validated-restock-payload',productId:product.id,sku:qaProduct.sku,branchId:1,quantity:1});return intercepted.fallback();}catch(e){record({category:'unexpected-write',reason:'Prevented non-isolated Restock payload'});await intercepted.abort('blockedbyclient');throw e;}};
  await page.context().route(pattern,handler);let result:any;await writeScope(page,'receive only one QA item through existing standalone Restock UI',[/^\/app\/api\/v1\/inventory\/branches\/1\/adjustments$/],async()=>{const next=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/app/api/v1/inventory/branches/1/adjustments').then(async r=>({ok:r.ok(),data:(await r.json()).data}));await d.getByRole('button',{name:'Confirm Restock Order',exact:true}).click();result=await next;expect(result.ok).toBe(true);});await expect(d).toBeHidden();await page.context().unroute(pattern,handler);handler=undefined;
  const after=await matrix(page);for(const before of baseline.balances)expect(after.find((b:any)=>b.id===before.id).quantity).toBe(before.quantity+(before.id==='1'?1:0));await info.attach('standalone-restock-result',{body:JSON.stringify({request:payload,adjustment:result.data,before:baseline.balances,after,scope:'Existing stock-only Restock intake. The user requires a separate GRN with supplier, product and quantity mandatory; this stock check does not certify GRN acceptance.'}),contentType:'application/json'});await proof(page,info,'standalone-qa-restock-persistence');
 }finally{if(handler)await page.context().unroute(pattern,handler);await restoreInventory(page);}
}
async function restockCost(page:Page,info:TestInfo){
 info.setTimeout(Math.max(info.timeout,180_000));const product=(await openCatalog(page)).data.find((p:any)=>p.sku===qaProduct.sku);expect(product).toBeTruthy();const cost=Number(product.cost_price),selling=Number(product.selling_price);expect(cost).toBeGreaterThan(0);expect(selling).not.toBe(cost);await route(page,'/store-inventory');await expect(main(page).getByText(qaProduct.sku,{exact:true})).toBeVisible();await main(page).getByRole('button',{name:/^Restock\b/}).click();const d=page.getByRole('dialog',{name:'Restock Order',exact:true});
 try{await expect(d.getByLabel('Select all',{exact:true})).toBeChecked();await d.getByLabel('Select all',{exact:true}).uncheck();await d.getByPlaceholder('Search name or SKU',{exact:true}).fill(qaProduct.sku);const row=d.getByText(qaProduct.sku,{exact:true}).locator('xpath=ancestor::div[input[@type="checkbox"]][1]');await row.getByRole('checkbox').check();await row.getByRole('spinbutton').fill('1');const line=number(await row.getByText('Cost',{exact:true}).locator('..').innerText()),total=number(await d.locator('p.text-2xl').innerText());await info.attach('restock-cost-oracle',{body:JSON.stringify({sku:product.sku,quantity:1,productCost:cost,sellingPrice:selling,displayedLineCost:line,displayedEstimatedCost:total,scope:'Read-only estimate inspection; confirmation never clicked.'}),contentType:'application/json'});if(Math.abs(line-cost)>0.001||Math.abs(total-cost)>0.001)await bug(page,info,'P2-GRN-002','Standalone Restock labels its amounts as cost but shows line '+line+' / total '+total+' for one QA item whose cost is '+cost+' and selling price is '+selling+'.');await proof(page,info,'restock-cost-estimate');}finally{await d.getByRole('button',{name:'Cancel',exact:true}).click();}
}
export async function receiptScenario(page:Page,info:TestInfo,mode:string){
 if(mode==='grn-minimal')return standaloneGRN(page,info);if(mode==='adhoc')return adHocRestock(page,info);if(mode==='cost')return restockCost(page,info);if(mode!=='full')return poReceipt(page,info,mode);info.setTimeout(600_000);const outcomes=[];
 for(const [step,run]of [['Standalone GRN with only mandatory inputs',()=>standaloneGRN(page,info)],['Existing stock-only Restock',()=>adHocRestock(page,info)],['Restock cost estimate',()=>restockCost(page,info)],['PO receipt, stock and damage',()=>poReceipt(page,info,'full')]] as const){try{await test.step(step,run);outcomes.push({step,status:'pass'});}catch(e){outcomes.push({step,status:'fail',error:String(e)});}}
 await info.attach('full-flow-outcomes',{body:JSON.stringify(outcomes),contentType:'application/json'});expect(outcomes.filter(o=>o.status==='fail')).toEqual([]);
}
