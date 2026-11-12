import {type Page,type TestInfo} from 'playwright/test';
import {test,expect,route,main,writeScope,record,proof,bug,observedPrintCalls,blocked} from '../../support/phase2';
import {selectCustomer} from '../../../phase1/pos/support/pos';
import {exportPDF} from '../../../phase1/invoicing/support/pdf';
export {test,expect};
export async function sellQA(page:Page,info:TestInfo,resumed=false){
 const total=resumed?200:100;if(!resumed)await route(page,'/pos');await page.getByPlaceholder('Search products or scan barcode…').waitFor();await selectCustomer(page,'QA Billing Automation Customer');
 if(!resumed)await main(page).getByRole('button').filter({has:page.getByText('QA-SERVICE-mvmgbd15-fba79b',{exact:true})}).click();await main(page).getByRole('complementary').getByRole('button',{name:'Charge Rs '+total.toFixed(2),exact:true}).click();
 const payment=page.getByRole('dialog',{name:'Complete Payment',exact:true});await payment.getByRole('spinbutton').fill(String(total));let sale:any;
 await writeScope(page,'record only QA service sale - no gateway or stock',[/^\/app\/api\/v1\/pos\/sales$/],async()=>{
  const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/app/api/v1/pos/sales').then(async r=>({ok:r.ok(),status:r.status(),body:await r.json()}));
  await payment.getByRole('button',{name:'Complete Sale',exact:true}).click();const result=await saved;await info.attach('qa-sale-response',{body:JSON.stringify(result),contentType:'application/json'});expect(result.ok).toBe(true);sale=result.body.data;record({test:info.title,category:'owned-fixture',kind:'POS-sale',record:sale});
 });
 await expect(payment).toBeHidden();const receipt=page.getByRole('dialog',{name:'Transaction Receipt',exact:true});await expect(receipt).toContainText('QA Billing Automation Customer');await expect(receipt).toContainText('QA service mvmgbd15-fba79b');await expect(receipt).toContainText('Rs '+total.toFixed(2));await expect(receipt).toContainText(String(sale.id));
 expect(sale.amount_due).toBe(0);expect(sale.amount_paid).toBe(total);await proof(page,info,'qa-sale-receipt');return {sale,receipt};
}
export async function receiptScenario(page:Page,info:TestInfo){
 const {receipt}=await sellQA(page,info),before=observedPrintCalls(page);await receipt.getByRole('button',{name:'Standard Print',exact:true}).click();await expect.poll(()=>observedPrintCalls(page)).toBe(before+1);
}
export async function formalScenario(page:Page,info:TestInfo,resumed=false){
 const total=resumed?200:100,{sale,receipt}=await sellQA(page,info,resumed);
 await info.attach('receipt-controls',{body:await receipt.ariaSnapshot(),contentType:'text/plain'});
 await receipt.getByRole('button',{name:'Close',exact:true}).last().click();await main(page).getByRole('button',{name:'History',exact:true}).click();
 const history=page.getByRole('dialog',{name:'Sales History',exact:true});const ownRow=history.getByRole('row').filter({has:page.getByRole('cell',{name:String(sale.id),exact:true})});await expect(ownRow).toBeVisible();await info.attach('sale-history-controls',{body:await history.ariaSnapshot(),contentType:'text/plain'});await history.getByRole('button',{name:'Close',exact:true}).last().click();
 await page.goto('about:blank');const loaded=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/sales/invoices').then(async r=>({ok:r.ok(),body:await r.json()}));await route(page,'/invoicing');const data=await loaded;expect(data.ok).toBe(true);await expect(main(page).getByRole('table')).toBeVisible();
 await main(page).getByPlaceholder('Search by invoice ID or customer name...').fill(String(sale.id));
 const row=main(page).getByRole('row').filter({has:page.getByRole('cell',{name:String(sale.id),exact:true})});await info.attach('commercial-invoice-list',{body:await main(page).ariaSnapshot(),contentType:'text/plain'});
 try{await row.waitFor({state:'visible',timeout:12_000});}catch(error){if(!await main(page).getByRole('heading',{name:'Invoices',exact:true}).isVisible())throw error;await bug(page,info,'P2-POS-003','POS checkout, receipt and sales history expose only a receipt; the recorded sale has no available formal A4 invoice action or matching invoice-list row after search settles.');}
 await row.locator('button:has(svg.lucide-eye)').click();
 try{await main(page).getByText('QA Billing Automation Customer',{exact:true}).first().waitFor({timeout:12_000});}catch(error){
  await info.attach('formal-document-readiness-diagnostic',{body:JSON.stringify({url:page.url(),snapshot:await main(page).ariaSnapshot(),classification:'Readiness/transport failure requires review; a spinner alone is not a confirmed application defect.'}),contentType:'application/json'});throw error;
 }
 await info.attach('formal-invoice-view',{body:await main(page).ariaSnapshot(),contentType:'text/plain'});await proof(page,info,'formal-invoice-view');
 await expect(main(page).getByRole('heading',{name:'INVOICE',exact:true})).toBeVisible();await expect(main(page)).toContainText('Rs '+total.toFixed(2));await expect(main(page)).toContainText('Paid in Full');
 const before=observedPrintCalls(page);await main(page).getByRole('button',{name:'Print',exact:true}).click();await expect.poll(()=>observedPrintCalls(page)).toBe(before+1);
 const destination=info.outputPath('pos-formal-invoice.pdf');
 try{const pdf=await exportPDF(page,String(sale.id),destination);await info.attach('formal-invoice-pdf',{path:destination,contentType:'application/pdf'});for(const text of [pdf.invoiceNumber,'Nexstock QA Company','QA Billing Automation Customer','QA service mvmgbd15-fba79b'])expect(pdf.text).toContain(text);expect(pdf.text.replace(/,/g,'')).toContain(total.toFixed(2));}
 catch(error){if(String(error).includes('APPLICATION: PDF/export opened')&&/404|That page is not here/i.test(String(error)))await bug(page,info,'RET-002','Known Round 1 invoice export defect reproduced for a new QA POS sale: export opens a public 404 page instead of the invoice PDF/print view.');throw error;}
}
