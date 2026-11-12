import {type Page,type TestInfo} from 'playwright/test';
import {test,expect,main,route,writeScope,record,proof,bug,blocked} from '../../support/phase2';
import {readRoute} from '../../support/observed';
import {captureInventory,restoreInventory} from '../../support/inventory';
import {createPO,advancePO,receive,vendor} from '../../purchase-orders/support/purchasing';
import {datePlus} from '../../../phase1/invoicing/support/invoicing';
export {test,expect};
export const endpoint='/app/api/v1/purchasing/bills';
export async function bills(page:Page){const data=await readRoute(page,'/purchasing/bills',endpoint);await expect(main(page).getByRole('heading',{name:'Bills',exact:true})).toBeVisible();return data.data||data;}
export const billRow=(page:Page,ref:string)=>main(page).getByRole('row').filter({has:page.getByRole('cell',{name:ref,exact:true})});
export async function createBill(page:Page,info:TestInfo,overdue=false,linked=false){
 const v=await vendor(page,info),po=linked?await receive(page,info,await advancePO(page,info,await createPO(page,info)),4):{supplier:v};if(linked)expect(po.status).toBe('received');await bills(page);await main(page).getByRole('button',{name:'New Bill',exact:true}).click();const dialog=page.getByRole('dialog',{name:'New Bill',exact:true});
 const supplier=dialog.locator('select[name="supplierId"]');await expect(supplier.locator('option')).not.toHaveCount(1);await info.attach('bill-supplier-options',{body:JSON.stringify(await supplier.locator('option').allTextContents()),contentType:'application/json'});
 if(!await supplier.locator('option').evaluateAll((es,id)=>es.some(e=>(e as HTMLOptionElement).value===id),String(po.supplier.id)))await bug(page,info,'P2-AP-001','New Bill supplier selector does not include the active QA purchasing supplier and has no search or pagination control, preventing entry against the newly received PO.');await supplier.selectOption(String(po.supplier.id));
 if(linked){const order=dialog.locator('select[name="purchaseOrderId"]');await expect(order.locator('option')).not.toHaveCount(1);if(!await order.locator('option').evaluateAll((es,id)=>es.some(e=>(e as HTMLOptionElement).value===id),String(po.id)))await bug(page,info,'P2-AP-001','New Bill linked PO selector omits the newly received QA PO and offers no search/pagination.');await order.selectOption(String(po.id));}
 const reference='QA-P2-BILL-'+Date.now().toString(36);await dialog.locator('[name="referenceNumber"]').fill(reference);await dialog.locator('[name="issueDate"]').fill(datePlus(overdue?-40:0));await dialog.locator('[name="dueDate"]').fill(datePlus(overdue?-10:15));await dialog.locator('[name="subtotal"]').fill('97');await dialog.locator('[name="tax"]').fill('10');await dialog.locator('[name="notes"]').fill('QA bookkeeping only; no real supplier payment '+reference);let bill:any;
 await writeScope(page,'record isolated QA vendor bill',[/^\/app\/api\/v1\/purchasing\/bills$/],async()=>{const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===endpoint).then(async r=>({ok:r.ok(),status:r.status(),body:await r.json()}));await dialog.getByRole('button',{name:'Create Bill',exact:true}).click();const r=await saved;await info.attach('created-vendor-bill',{body:JSON.stringify(r),contentType:'application/json'});expect(r.ok).toBe(true);bill=r.body.data.data||r.body.data;record({category:'owned-fixture',kind:'vendor-bill',id:bill.id,number:bill.billNumber,reference,po:po.id});});await expect(dialog).toBeHidden();const own=(await bills(page)).find((b:any)=>String(b.id)===String(bill.id));expect(own).toBeTruthy();expect(own.total).toBe(107);expect(own.amountDue).toBe(107);if(linked)expect(String(own.purchaseOrderId)).toBe(String(po.id));expect(own.referenceNumber).toBe(reference);expect(own.dueDate).toBe(datePlus(overdue?-10:15));await expect(billRow(page,own.billNumber)).toBeVisible();await proof(page,info,'saved-vendor-bill');return own;
}
export async function paymentDialog(page:Page,bill:any){const row=billRow(page,bill.billNumber);await row.getByRole('button',{name:/pay/i}).click();const d=page.getByRole('dialog',{name:'Record Payment',exact:true});await expect(d).toContainText(bill.billNumber);await expect.poll(async()=>Number(await d.getByRole('spinbutton').inputValue()),{message:'Payment dialog defaults to this bill\'s outstanding amount'}).toBe(Number(bill.amountDue));return d;}
export async function pay(page:Page,info:TestInfo,bill:any,amount:number,method:string,reference?:string){
 const d=await paymentDialog(page,bill);await d.getByRole('spinbutton').fill(String(amount));await d.locator('input[type="date"]').fill(datePlus(0));await d.getByRole('combobox').selectOption(method);
 if(reference)await d.getByRole('textbox',{name:/reference|transaction|cheque/i}).fill(reference);
 await writeScope(page,'bookkeeping entry only for own QA bill '+bill.id,[new RegExp('^'+endpoint+'/'+bill.id+'/payments$')],async()=>{const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===endpoint+'/'+bill.id+'/payments').then(async r=>({ok:r.ok(),body:await r.json(),request:r.request().postDataJSON()}));await d.getByRole('button',{name:'Confirm Payment',exact:true}).click();const r=await saved;await info.attach('manual-payment-'+method,{body:JSON.stringify(r),contentType:'application/json'});expect(r.ok).toBe(true);});await expect(d).toBeHidden();return (await bills(page)).find((b:any)=>String(b.id)===String(bill.id));
}
export async function billScenario(page:Page,info:TestInfo,mode:string){
 info.setTimeout(420_000);await captureInventory(page);
 try{
  let bill=await createBill(page,info,mode==='aging',mode==='create'||mode==='full');if(mode==='create'||mode==='direct')return;
  if(mode==='reference'){
   for(const [amount,method]of [[20,'bank_transfer'],[30,'cheque']] as const){const reference='QA-P2-REF-'+method+'-'+Date.now().toString(36);bill=await pay(page,info,bill,amount,method,reference);const payment=bill.payments?.find((p:any)=>p.reference===reference);await info.attach('saved-payment-reference-'+method,{body:JSON.stringify({billId:bill.id,number:bill.billNumber,reference,payment,balance:bill.amountDue}),contentType:'application/json'});expect(payment,'Payment reference must persist in the fresh bill read').toBeTruthy();expect(Number(payment.amount)).toBe(amount);expect(payment.paymentMethod).toBe(method);await proof(page,info,'persisted-reference-'+method);}
   expect(bill.amountPaid).toBe(50);expect(bill.amountDue).toBe(57);return;
  }
  if(mode==='aging'){
   const row=billRow(page,bill.billNumber);await expect(row).toContainText('107.00');await info.attach('overdue-bill-view',{body:JSON.stringify({bill,screen:await main(page).ariaSnapshot()}),contentType:'application/json'});await proof(page,info,'past-due-payable');
   await expect(row).toContainText('(Overdue)');expect(bill.amountDue).toBe(107);await info.attach('aging-scope',{body:'Past-due date and outstanding amount verified with the explicit Overdue label. Future due dates are independently exercised by normal bill creation. No unrequested age-bucket policy is assumed.',contentType:'text/plain'});return;
  }
  for(const [amount,method] of [[20,'cash'],[30,'bank_transfer'],[57,'cheque']] as const){const before=bill.amountPaid;bill=await pay(page,info,bill,amount,method);expect(bill.amountPaid).toBe(before+amount);expect(bill.amountDue).toBe(107-bill.amountPaid);expect(bill.status).toBe(bill.amountDue===0?'paid':'partial');}
  await proof(page,info,'fully-paid-qa-bill');
 }finally{await restoreInventory(page);}
}
