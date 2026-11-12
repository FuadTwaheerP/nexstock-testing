import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {type Page,type TestInfo} from 'playwright/test';
import {test,expect,main,route,writeScope,record,proof,bug,blocked} from '../../support/phase2';
import {readRoute} from '../../support/observed';
import {qaProduct,captureInventory,restoreInventory,matrix} from '../../support/inventory';
import {datePlus} from '../../../phase1/invoicing/support/invoicing';
import {verifyPDF} from '../../support/pdf';
export {test,expect};
const vendorFile='test-results/phase2-purchasing-fixture.json';
export const orders='/app/api/v1/purchasing/purchase-orders';
export async function vendor(page:Page,info:TestInfo){
 let f=existsSync(vendorFile)?JSON.parse(readFileSync(vendorFile,'utf8')):undefined;
 await route(page,'/suppliers');await main(page).getByRole('heading',{name:'Suppliers',exact:true}).waitFor();
 if(f){expect(f.name).toMatch(/^QA P2 Vendor /);await main(page).getByPlaceholder('Search...', {exact:true}).fill(f.name);await expect(main(page).getByRole('row').filter({has:page.getByRole('button',{name:'Actions for '+f.name,exact:true})})).toHaveCount(1);return f;}
 const token=Date.now().toString(36);f={name:'QA P2 Vendor '+token,code:'QA-P2-'+token.toUpperCase(),email:'qa.p2.vendor.'+token+'@example.invalid'};
 await main(page).getByRole('button',{name:'New Supplier',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Add Supplier',exact:true});await dialog.getByRole('textbox',{name:/^Supplier Name/}).fill(f.name);await dialog.getByRole('textbox',{name:'Code',exact:true}).fill(f.code);await dialog.getByRole('textbox',{name:'Email Address',exact:true}).fill(f.email);
 await writeScope(page,'create isolated QA purchasing supplier',[/^\/app\/api\/v1\/suppliers$/],async()=>{const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/app/api/v1/suppliers').then(async r=>({ok:r.ok(),body:await r.json()}));await dialog.getByRole('button',{name:'Add Supplier',exact:true}).click();const r=await saved;expect(r.ok).toBe(true);f.id=String(r.body.data.id);record({category:'owned-fixture',kind:'purchasing-supplier',...f});writeFileSync(vendorFile,JSON.stringify(f,null,2));});await expect(dialog).toBeHidden();return f;
}
export async function createPO(page:Page,info:TestInfo,quantity=4){
 const v=await vendor(page,info);await route(page,'/purchasing/orders');await main(page).getByRole('link',{name:'New Purchase Order',exact:true}).click();await main(page).getByRole('button',{name:'Select a supplier...',exact:true}).click();await main(page).getByPlaceholder('Search...', {exact:true}).fill(v.name);await main(page).getByRole('list').getByRole('button').filter({has:page.getByText(v.name,{exact:true})}).click();
 await expect(main(page).locator('input[name="currency"]'),'The PO defaults to the QA business currency').toHaveValue('MUR');await main(page).locator('input[name="expectedDeliveryDate"]').fill(datePlus(7));const notes='QA-P2-PO-'+Date.now().toString(36);await main(page).locator('[name="notes"]').fill(notes);
 await main(page).getByRole('button',{name:'Select a product...',exact:true}).click();await main(page).getByPlaceholder('Search...', {exact:true}).fill(qaProduct.sku);await main(page).getByRole('list').getByRole('button').filter({has:page.getByText(qaProduct.sku,{exact:true})}).click();
 await main(page).locator('input[name="items.0.quantity"]').fill(String(quantity));await main(page).locator('input[name="items.0.unitPrice"]').fill('25');await main(page).locator('input[name="taxAmount"]').fill('10');await main(page).locator('input[name="discountAmount"]').fill('5');await main(page).locator('input[name="shippingCost"]').fill('2');await proof(page,info,'purchase-order-editor');let po:any;
 const branch=main(page).locator('select[name="branchId"]');if(await branch.count())await branch.selectOption({label:'QA Inspection Store 20261017'});
 await writeScope(page,'create own QA purchase order without external supplier transmission',[/^\/app\/api\/v1\/purchasing\/purchase-orders$/],async()=>{const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===orders).then(async r=>({ok:r.ok(),status:r.status(),body:await r.json(),request:r.request().postDataJSON()}));await main(page).getByRole('button',{name:'Create Purchase Order',exact:true}).click();const r=await saved;await info.attach('created-purchase-order',{body:JSON.stringify(r),contentType:'application/json'});
  if(!r.ok&&r.status===422&&r.body.data?.branchId){const ui=await main(page).ariaSnapshot();await info.attach('delivery-branch-required-but-unavailable',{body:ui,contentType:'text/plain'});if(/Delivery (?:Location|Branch)|Warehouse|Branch/i.test(ui))await blocked(info,'A branch control may now exist; inspect its exact deployed selector before changing the valid-fixture adapter.');const reason='P2-PO-001: Server requires branchId (Choose the branch the goods are delivered to), but the current PO form has no delivery branch/warehouse control and submits no branchId.';if(process.env.PHASE2_MODULE!=='purchase-orders')await blocked(info,'Confirmed Purchasing prerequisite failure '+reason+' No received PO can be provisioned through the deployed UI; downstream receipt/linkage is unverified.');await bug(page,info,'P2-PO-001',reason);}
  expect(r.ok).toBe(true);po=r.body.data.data||r.body.data;expect(po.id).toBeTruthy();record({category:'owned-fixture',kind:'purchase-order',id:po.id,number:po.poNumber,notes,vendor:v.id});});
 const current=await openPO(page,po.id);expect(current.notes).toBe(notes);expect(current.currency).toBe('MUR');expect(String(current.branchId)).toBe('1');expect(current.totalAmount).toBe(quantity*25+7);expect(current.items[0].quantityOrdered).toBe(quantity);expect(String(current.supplier.id)).toBe(v.id);await proof(page,info,'saved-purchase-order');return current;
}
export async function openPO(page:Page,id:string){const data=await readRoute(page,'/purchasing/orders/'+id,orders+'/'+id),po=data.data||data;await expect(main(page).getByRole('heading',{level:1}).filter({hasText:po.poNumber})).toBeVisible();return po;}
export async function advancePO(page:Page,info:TestInfo,po:any){
 for(const [label,status] of [['Approve','approved'],['Mark as Ordered','ordered']]){
  await writeScope(page,'advance only owned QA PO '+po.id+' '+status,[new RegExp('^'+orders+'/'+po.id+'$')],async()=>{const saved=page.waitForResponse(r=>r.request().method()==='PUT'&&new URL(r.url()).pathname===orders+'/'+po.id).then(async r=>({ok:r.ok(),body:await r.json()}));await main(page).getByRole('button',{name:label,exact:true}).click();const r=await saved;expect(r.ok).toBe(true);});po=await openPO(page,po.id);expect(po.status).toBe(status);
 }return po;
}
export async function receive(page:Page,info:TestInfo,po:any,accepted:number,rejected=0){
 await main(page).getByRole('button',{name:'Receive Goods',exact:true}).click();await main(page).getByRole('spinbutton',{name:'Accepted',exact:true}).fill(String(accepted));await main(page).getByRole('spinbutton',{name:'Rejected',exact:true}).fill(String(rejected));if(rejected)await main(page).getByPlaceholder('Reason for rejection',{exact:true}).fill('QA-P2 damaged packaging '+po.poNumber);
 await writeScope(page,'receive only own QA PO '+po.id,[new RegExp('^'+orders+'/'+po.id+'/receive$')],async()=>{const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===orders+'/'+po.id+'/receive').then(async r=>({ok:r.ok(),status:r.status(),body:await r.json(),request:r.request().postDataJSON()}));await main(page).getByRole('button',{name:'Confirm Receipt & Update Stock',exact:true}).click();const r=await saved;await info.attach('goods-receipt-'+accepted+'-'+rejected,{body:JSON.stringify(r),contentType:'application/json'});expect(r.ok).toBe(true);});return openPO(page,po.id);
}
export async function poScenario(page:Page,info:TestInfo,mode:string){
 info.setTimeout(300_000);let po:any;
 try{
  if(mode==='fulfilment'||mode==='full')await captureInventory(page);po=await createPO(page,info);
  if(mode==='create')return;
  if(mode==='location'){
   const detail=await main(page).ariaSnapshot();await route(page,'/purchasing/orders/new');await expect(main(page).getByRole('heading',{name:'New Purchase Order',exact:true})).toBeVisible();const editor=await main(page).ariaSnapshot();await info.attach('delivery-location-controls',{body:JSON.stringify({detail,editor}),contentType:'application/json'});
   const branch=main(page).getByRole('combobox',{name:'Deliver to *',exact:true});await expect(branch).toBeVisible();await branch.selectOption({label:'QA Inspection Store 20261017'});await expect(branch).toHaveValue(String(po.branchId));expect(String((await openPO(page,po.id)).branchId)).toBe('1');return;
  }
  if(mode==='pdf'){
   const result=Promise.race([page.waitForEvent('download',{timeout:20_000}).then(d=>({download:d})),page.waitForResponse(r=>new URL(r.url()).pathname===orders+'/'+po.id+'/pdf',{timeout:20_000}).then(async r=>r.ok()?new Promise<never>(()=>{}):{error:{status:r.status(),text:(await r.text()).slice(0,400)}})]);await main(page).getByRole('button',{name:'Print',exact:true}).click();const outcome=await result;if('error'in outcome)await bug(page,info,'P2-PO-002','PO Print/PDF returns HTTP '+outcome.error.status+' instead of a PDF: '+outcome.error.text);if('download'in outcome){const path=info.outputPath('purchase-order.pdf');await outcome.download.saveAs(path);await verifyPDF(path,info,[po.poNumber,po.supplier.name,qaProduct.name]);await info.attach('purchase-order-pdf',{path,contentType:'application/pdf'});}return;
  }
  po=await advancePO(page,info,po);if(mode==='status')return;
  po=await receive(page,info,po,1);expect(po.status).toBe('partially_received');expect(po.items[0].quantityReceived).toBe(1);po=await receive(page,info,po,3);expect(po.items[0].quantityReceived).toBe(4);expect(po.status).toBe('received');await proof(page,info,'fully-received-order');await info.attach('terminal-status-scope',{body:'Actual functional lifecycle draft -> approved -> ordered -> partially_received -> received. Received is the deployed terminal fulfillment label; no label-only Closed defect is assumed.',contentType:'text/plain'});
 }finally{if(mode==='fulfilment'||mode==='full')await restoreInventory(page);}
}
