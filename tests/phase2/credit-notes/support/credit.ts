import {type Page,type TestInfo} from 'playwright/test';
import {test,expect,route,main,writeScope,record,proof,bug,blocked,observedPrintCalls} from '../../support/phase2';
import {datePlus,fillDates} from '../../../phase1/invoicing/support/invoicing';
import {captureInventory,changeInventory,restoreInventory,qaProduct} from '../../support/inventory';
import {verifyPDF} from '../../support/pdf';
export {test,expect};
const endpoint='/app/api/v1/sales/credit-notes';
async function freshInvoice(page:Page,info:TestInfo){
 const baseline=await captureInventory(page),branch=baseline.balances.find((b:any)=>b.id==='1');expect(branch).toBeTruthy();await changeInventory(page,branch.id,branch.branch,3);
 await route(page,'/invoicing');await main(page).getByRole('button',{name:'New Invoice',exact:true}).click();await main(page).getByRole('combobox').first().click();await page.getByRole('option').filter({hasText:'qa.billing.customer@example.invalid'}).click();await fillDates(page,datePlus(0),datePlus(15));await main(page).getByRole('button',{name:'Add Row',exact:true}).click();await main(page).getByRole('combobox').filter({hasText:'Choose product...'}).click();await page.getByRole('option').filter({hasText:qaProduct.name+' - Rs'}).click();
 let invoice:any;await writeScope(page,'create own paid QA invoice for linked credit only',[/^\/app\/api\/v1\/sales\/invoices$/],async()=>{
 const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/app/api/v1/sales/invoices').then(async r=>({ok:r.ok(),body:await r.json()}));await main(page).getByRole('button',{name:'Save Invoice',exact:true}).click();await page.getByRole('menuitem',{name:'Mark Paid & Save',exact:true}).click();const r=await saved;await info.attach('credit-source-invoice',{body:JSON.stringify(r),contentType:'application/json'});expect(r.ok).toBe(true);invoice=r.body.data;record({category:'owned-fixture',kind:'credit-source-invoice',id:invoice.id});});return invoice;
}
async function prepare(page:Page,info:TestInfo,invoice?:any){
 await route(page,'/credit-notes');await main(page).getByRole('button',{name:'Create Credit Note',exact:true}).click();await main(page).getByRole('combobox').first().click();await page.getByRole('option').filter({hasText:'qa.billing.customer@example.invalid'}).click();
 if(invoice){await main(page).getByRole('combobox').nth(1).click();const ref=invoice.invoiceNumber||invoice.invoice_number;expect(ref).toBeTruthy();await page.getByRole('option').filter({hasText:ref}).click();}
 await fillDates(page,datePlus(0),datePlus(15));await main(page).getByRole('button',{name:'Add Row',exact:true}).click();await main(page).getByRole('combobox').filter({hasText:'Choose product...'}).click();await page.getByRole('option').filter({hasText:qaProduct.name+' - Rs'}).click();await main(page).getByRole('spinbutton').nth(0).fill('1');await main(page).getByRole('spinbutton').nth(1).fill('100');await info.attach('credit-editor',{body:await main(page).ariaSnapshot(),contentType:'text/plain'});
}
async function create(page:Page,info:TestInfo,reason=false){
 const invoice=await freshInvoice(page,info);await prepare(page,info,invoice);let credit:any;
 const details='QA-P2 return '+Date.now().toString(36);
 await main(page).getByRole('combobox').filter({hasText:'Select a reason'}).click();await page.getByRole('option',{name:/product return/i}).click();await main(page).getByRole('textbox',{name:'Details (optional)',exact:true}).fill(details);
 await writeScope(page,'save credit linked to this test invoice only',[/^\/app\/api\/v1\/sales\/credit-notes$/],async()=>{const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===endpoint).then(async r=>({ok:r.ok(),status:r.status(),body:await r.json(),request:r.request().postDataJSON()}));await main(page).getByRole('button',{name:'Save Credit Note',exact:true}).click();await page.getByRole('menuitem',{name:'Save as Draft',exact:true}).click();const r=await saved;await info.attach('credit-save-response',{body:JSON.stringify(r),contentType:'application/json'});if(!r.ok)await bug(page,info,'P2-CN-001','The UI cannot save a valid invoice-linked credit note using its available fields: HTTP '+r.status+' '+JSON.stringify(r.body));credit=r.body.data;expect(credit.id).toBeTruthy();record({category:'owned-fixture',kind:'credit-note',id:credit.id,invoice:invoice.id});});
 await page.goto('about:blank');const loaded=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===endpoint,{timeout:60_000}).then(async r=>({ok:r.ok(),data:(await r.json()).data}));const [,r]=await Promise.all([route(page,'/credit-notes'),loaded]);expect(r.ok).toBe(true);const own=r.data.find((x:any)=>String(x.id)===String(credit.id));expect(own).toBeTruthy();expect(String(own.invoiceId)).toBe(String(invoice.id));expect(own.total).toBe(100);if(reason){expect(own.reasonCode).toBe('return');expect(own.notes).toBe(details);}await info.attach('saved-credit',{body:JSON.stringify(own),contentType:'application/json'});const row=main(page).getByRole('row').filter({has:page.getByRole('cell',{name:own.creditNoteNumber,exact:true})});await expect(row).toBeVisible();return {credit:own,row,details};
}
async function refund(page:Page,info:TestInfo,credit:any){
 let remaining=100;
 for(const amount of [40,60]){
  await main(page).getByRole('button',{name:'Record refund',exact:true}).click();const d=page.getByRole('dialog',{name:'Record refund',exact:true});await expect(d.getByRole('spinbutton')).toHaveValue(remaining.toFixed(2));
  if(amount===40){let posted=0;const observe=(r:any)=>{if(r.method()==='POST'&&new URL(r.url()).pathname===endpoint+'/'+credit.id+'/payments')posted++;};page.on('request',observe);await d.getByRole('spinbutton').fill('101');await d.getByRole('button',{name:'Record refund',exact:true}).click();await expect(page.getByRole('region',{name:'Notifications alt+T'})).toContainText(/more than/i);expect(posted,'Over-refund is rejected before any financial write').toBe(0);page.off('request',observe);}
  await d.getByRole('spinbutton').fill(String(amount));await d.getByRole('combobox').click();await page.getByRole('option',{name:'Cash',exact:true}).click();await d.getByRole('textbox',{name:'Reference (optional)',exact:true}).fill('QA-ONLY-NO-CASH-'+Date.now());
  await writeScope(page,'record-only refund on this newly owned QA credit '+credit.id,[new RegExp('^'+endpoint+'/'+credit.id+'/payments$')],async()=>{const next=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===endpoint+'/'+credit.id+'/payments').then(async r=>({ok:r.ok(),body:await r.json(),request:r.request().postDataJSON()}));await d.getByRole('button',{name:'Record refund',exact:true}).click();const r=await next;await info.attach('credit-refund-'+amount,{body:JSON.stringify(r),contentType:'application/json'});expect(r.ok).toBe(true);expect(Number(r.body.data.amount)).toBe(amount);expect(Number(r.body.data.remaining_balance)).toBe(remaining-amount);});
  await expect(d).toBeHidden();remaining-=amount;await page.goto('about:blank');const next=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===endpoint+'/'+credit.id).then(async r=>{expect(r.ok()).toBe(true);return (await r.json()).data;});await route(page,'/credit-notes/'+credit.id);const fresh=await next;expect(Number(fresh.remainingBalance)).toBe(remaining);await expect(main(page)).toContainText(credit.creditNoteNumber);await proof(page,info,'credit-refund-balance-'+remaining);
 }
 await expect(main(page).getByRole('button',{name:'Record refund',exact:true})).toHaveCount(0);
 await info.attach('refund-scope',{body:'Two record-only QA cash refunds (40 + 60) settle a 100 credit; over-refund is rejected. Credit allocation and refund date/method history are explicitly not delivered and are not certified.',contentType:'text/plain'});
}
export async function creditScenario(page:Page,info:TestInfo,mode:string){
 info.setTimeout(300_000);
 try{
  if(mode==='restock'){
   await prepare(page,info);const ui=await main(page).ariaSnapshot();await proof(page,info,'credit-'+mode+'-editor');
   if(mode==='reason'&&!/Reason|Product return|Billing correction|Price concession/i.test(ui))await bug(page,info,'P2-CN-002','Credit Note editor provides no return/correction/concession reason field; deployed save payload hardcodes reason to an empty string.');
   if(mode==='restock'&&!/restock|return.*(?:warehouse|stock)|warehouse|Branch/i.test(ui))await bug(page,info,'P2-CN-003','Credit Note editor has no automatic restock option or receiving warehouse selector for returned inventory.');
   await blocked(info,'New reason/restock controls require current-contract persistence and stock adapter before certification.');
  }
  const {credit,row,details}=await create(page,info,mode==='reason'||mode==='full');if(mode==='create')return;await row.locator('button:has(svg.lucide-eye)').click();await expect(main(page).getByRole('heading',{name:/^Credit Note Details\b/})).toBeVisible();await expect(main(page)).toContainText(credit.creditNoteNumber);await info.attach('credit-detail',{body:await main(page).ariaSnapshot(),contentType:'text/plain'});await proof(page,info,'credit-detail');
  if(mode==='reason'){await expect(main(page)).toContainText(/Product return/i);await expect(main(page)).toContainText(details);return;}
  if(mode==='refund'||mode==='full'){await refund(page,info,credit);if(mode==='refund')return;}
  if(mode==='allocation'||mode==='full'){
   await blocked(info,'Credit allocation is explicitly not included in this release. Refund behavior is tested separately; P2-CN-004 is only partially delivered.');
  }
  if(mode==='pdf'){
   const before=observedPrintCalls(page);await main(page).getByRole('button',{name:'Print / Save as PDF',exact:true}).click();await expect.poll(()=>observedPrintCalls(page)).toBe(before+1);
   await route(page,'/credit-notes');const savedRow=main(page).getByRole('row').filter({has:page.getByRole('cell',{name:credit.creditNoteNumber,exact:true})});const next=page.waitForEvent('popup');await savedRow.getByRole('button',{name:'Download PDF',exact:true}).click();const popup=await next;await expect(popup).toHaveURL(new RegExp('/app/credit-notes/'+credit.id+'\\?print=true'));await expect(popup.getByRole('main')).toContainText('QA Billing Automation Customer');await expect(popup.getByRole('main')).toContainText(credit.creditNoteNumber);await expect.poll(()=>observedPrintCalls(page)).toBe(before+2);
   const path=info.outputPath('credit-note-print-view.pdf');await popup.pdf({path,format:'A4',printBackground:true});await info.attach('credit-note-print-view-pdf',{path,contentType:'application/pdf'});
   const pdf=await verifyPDF(path,info,[credit.creditNoteNumber,'Nexstock QA Company','QA Billing Automation Customer',qaProduct.name]);expect(Math.abs(pdf.sizes[0][0]-595.276)).toBeLessThan(2);expect(Math.abs(pdf.sizes[0][1]-841.89)).toBeLessThan(2);await popup.close();
   await info.attach('print-view-scope',{body:'List Download PDF opens the authenticated /app/credit-notes/id?print=true document and automatically requests print. Actual popup output captured as A4 PDF; browser print-to-PDF, not a native server download or physical printer.',contentType:'text/plain'});
  }
 }finally{await restoreInventory(page);}
}
