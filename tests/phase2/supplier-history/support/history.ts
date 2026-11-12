import {type Page,type TestInfo} from 'playwright/test';
import {test,expect,main,proof,bug,blocked} from '../../support/phase2';
import {readRoute} from '../../support/observed';
import {vendor,createPO,advancePO,receive} from '../../purchase-orders/support/purchasing';
import {createBill,pay} from '../../bills-payable/support/bills';
import {captureInventory,restoreInventory} from '../../support/inventory';
export {test,expect};
export async function supplierHistory(page:Page,info:TestInfo,mode:string){
 info.setTimeout(360_000);let v:any,bill:any,po:any;
 try{
  v=await vendor(page,info);
  if(mode==='orders'||mode==='receipts'){await captureInventory(page);po=await createPO(page,info);if(mode==='receipts')po=await receive(page,info,await advancePO(page,info,po),4);}
  else{bill=await createBill(page,info);if(mode==='payments'||mode==='full'){bill=await pay(page,info,bill,20,'cash','QA-P2-HISTORY-'+Date.now().toString(36));expect(bill.amountPaid).toBe(20);expect(bill.amountDue).toBe(87);}}
  const supplier=await readRoute(page,'/suppliers/'+v.id,'/app/api/v1/suppliers/'+v.id);await expect(main(page).getByRole('heading',{level:1}).filter({hasText:v.name})).toBeVisible();await info.attach('supplier-ledger-baseline',{body:JSON.stringify({supplier,ownedBill:bill,ownedPO:po}),contentType:'application/json'});
  await main(page).getByRole('tab',bill?{name:'Bills & payments',exact:true}:{name:/^Purchase Orders/}).click();await info.attach('supplier-history-view',{body:await main(page).ariaSnapshot(),contentType:'text/plain'});await proof(page,info,'supplier-history');
  if(bill){
   const panel=main(page).getByRole('tabpanel',{name:'Bills & payments',exact:true});const row=panel.getByRole('row').filter({has:page.getByRole('cell').filter({hasText:bill.billNumber})});await expect(row).toHaveCount(1);const cells=row.getByRole('cell');await expect(cells.nth(3)).toHaveText('Rs 107.00');await expect(cells.nth(4)).toHaveText('Rs '+Number(bill.amountPaid).toFixed(2));await expect(cells.nth(5)).toHaveText('Rs '+Number(bill.amountDue).toFixed(2));
   if(bill.amountPaid){expect(bill.payments).toHaveLength(1);const payment=bill.payments[0],saved=panel.getByRole('cell',{name:payment.reference,exact:true}).locator('..');await expect(saved).toContainText('Cash');await expect(saved).toContainText('Rs 20.00');expect(Number(payment.amount)).toBe(20);}
   await info.attach('supplier-owned-ledger-reconciliation',{body:JSON.stringify({supplierId:v.id,billId:bill.id,total:bill.total,paid:bill.amountPaid,due:bill.amountDue,payments:bill.payments}),contentType:'application/json'});return;
  }
  else await expect(main(page)).toContainText(po.poNumber);
 }finally{if(mode==='orders'||mode==='receipts')await restoreInventory(page);}
}
