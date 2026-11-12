import {type Page,type TestInfo} from 'playwright/test';
import {test,expect,route,main,writeScope,record,proof,bug} from '../../support/phase2';
import {datePlus,fillDates} from '../../../phase1/invoicing/support/invoicing';
import {captureInventory,changeInventory,restoreInventory,matrix,qaProduct} from '../../support/inventory';
import {readRoute} from '../../support/observed';
import {verifyPDF} from '../../support/pdf';
export {test,expect};
const endpoint='/app/api/v1/sales/quotations';
export async function quotes(page:Page){
 await page.goto('about:blank');const loaded=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===endpoint,{timeout:60_000}).then(async r=>({ok:r.ok(),body:await r.json()}));
 const [,r]=await Promise.all([route(page,'/quotations'),loaded]);expect(r.ok).toBe(true);await expect(main(page).getByRole('heading',{name:'Quotations',exact:true})).toBeVisible();return r.body.data;
}
export async function prepare(page:Page,info:TestInfo,commercial=false){
 await quotes(page);await main(page).getByRole('button',{name:'New Quotation',exact:true}).click();await expect(main(page).getByRole('heading',{name:'New Quotation',exact:true})).toBeVisible();
 await main(page).getByRole('combobox').first().click();await page.getByRole('option').filter({hasText:'qa.billing.customer@example.invalid'}).click();await fillDates(page,datePlus(0),datePlus(17));
 await main(page).getByRole('button',{name:'Add Row',exact:true}).click();await main(page).getByRole('combobox').filter({hasText:'Choose product...'}).click();await page.getByRole('option').filter({hasText:qaProduct.name+' - Rs'}).click();
 await main(page).getByRole('spinbutton').nth(0).fill('2');await main(page).getByRole('spinbutton').nth(1).fill(commercial?'100':'93.25');await main(page).getByRole('spinbutton').last().fill('10');
 const fields={notes:'QA-P2 quote notes '+Date.now(),terms:'QA-P2 custom terms: record only, no dispatch '+Date.now()};
 if(commercial){await main(page).getByText('Discount (%)',{exact:true}).locator('..').getByRole('spinbutton').fill('10');await main(page).getByRole('textbox',{name:'Notes',exact:true}).fill(fields.notes);await main(page).getByRole('textbox',{name:'Terms & conditions',exact:true}).fill(fields.terms);}
 await info.attach('quotation-editor',{body:await main(page).ariaSnapshot(),contentType:'text/plain'});return fields;
}
export async function create(page:Page,info:TestInfo,status:'draft'|'accepted'='draft',commercial=false){
 const fields=await prepare(page,info,commercial);let quote:any;
 await writeScope(page,'save isolated quotation for QA billing customer only',[/^\/app\/api\/v1\/sales\/quotations$/],async()=>{
  const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===endpoint).then(async r=>({ok:r.ok(),body:await r.json(),request:r.request().postDataJSON()}));await main(page).getByRole('button',{name:'Save Quotation',exact:true}).click();await page.getByRole('menuitem',{name:status==='draft'?'Save as Draft':'Mark Accepted & Save',exact:true}).click();const r=await saved;await info.attach('saved-quotation',{body:JSON.stringify(r),contentType:'application/json'});expect(r.ok).toBe(true);quote=r.body.data;expect(quote.id).toBeTruthy();record({category:'owned-fixture',kind:'quotation',id:quote.id,status});
 });
 const own=(await quotes(page)).find((q:any)=>String(q.id)===String(quote.id));expect(own).toBeTruthy();expect(own.customer).toBe('QA Billing Automation Customer');expect(own.status).toBe(status);expect(own.validUntil).toBe(datePlus(17));expect(own.items).toHaveLength(1);expect(own.items[0].quantity).toBe(2);expect(own.items[0].price).toBe(commercial?100:93.25);expect(own.discount).toBeCloseTo(commercial?18:18.65,2);expect(own.total).toBeCloseTo(commercial?162:167.85,2);
 if(commercial){expect(own.items[0].discountPercentage).toBe(10);expect(own.notes).toBe(fields.notes);expect(own.terms).toBe(fields.terms);}
 const row=main(page).getByRole('row').filter({has:page.getByRole('cell',{name:String(quote.id),exact:true})});await expect(row).toContainText(own.total.toFixed(2));await proof(page,info,'saved-quotation-list');return {quote:own,row,fields};
}
export async function detail(page:Page,info:TestInfo,row:any){
 await row.locator('button:has(svg.lucide-eye)').click();const control=main(page).getByRole('button',{name:'Print',exact:true}),missing=main(page).getByRole('heading',{name:'Invoice Not Found',exact:true});await expect(control.or(missing)).toBeVisible({timeout:30_000});
 await info.attach('quotation-detail-state',{body:JSON.stringify({url:page.url(),snapshot:await main(page).ariaSnapshot()}),contentType:'application/json'});if(await missing.isVisible())await bug(page,info,'P2-QUOTE-001','Saved quotation View opens the invoice route and cannot display the saved quotation.');expect(new URL(page.url()).pathname).toMatch(/\/app\/quotations\/\d+$/);
}
async function status(page:Page,info:TestInfo,q:any,value:'sent'|'accepted'|'rejected'){
 const label={sent:'Mark as sent',accepted:'Mark as accepted',rejected:'Mark as rejected'}[value];await writeScope(page,'change only owned QA quotation '+q.id+' to '+value,[new RegExp('^'+endpoint+'/'+q.id+'$')],async()=>{const next=page.waitForResponse(r=>r.request().method()==='PUT'&&new URL(r.url()).pathname===endpoint+'/'+q.id);await main(page).getByRole('button',{name:new RegExp('^'+label+'$','i')}).click();expect((await next).ok()).toBe(true);});const saved=await readRoute(page,'/quotations/'+q.id,endpoint+'/'+q.id);expect(saved.status).toBe(value);return saved;
}
async function pdf(page:Page,info:TestInfo,q:any){
 const next=page.waitForEvent('download');await main(page).getByRole('button',{name:'PDF',exact:true}).click();const download=await next,path=info.outputPath('quotation.pdf');await download.saveAs(path);await info.attach('quotation-pdf',{path,contentType:'application/pdf'});const parsed=await verifyPDF(path,info,[q.quoteNumber,'Nexstock QA Company','QA Billing Automation Customer',qaProduct.name]);expect(parsed.text.replace(/,/g,'')).toContain(q.total.toFixed(2));expect(parsed.text).toContain('Rs');expect(parsed.text).not.toMatch(/\$\s*\d/);return parsed;
}
export async function quoteScenario(page:Page,info:TestInfo,mode:string){
 info.setTimeout(420_000);const baseline=await captureInventory(page),source=baseline.balances.find((b:any)=>b.id==='1'),convert=mode==='convert'||mode==='full';if(convert)await changeInventory(page,source.id,source.branch,5);
 try{
  const {quote,fields}=await create(page,info,'draft',mode==='terms'||mode==='full');expect((await matrix(page)).find((b:any)=>b.id==='1').quantity).toBe(source.quantity+(convert?5:0));
  if(mode==='create')return;await quotes(page);const own=main(page).getByRole('row').filter({has:page.getByRole('cell',{name:String(quote.id),exact:true})});await detail(page,info,own);await expect(main(page)).toContainText(quote.quoteNumber);
  if(mode==='terms'){await expect(main(page)).toContainText(fields.notes);await expect(main(page)).toContainText(fields.terms);await expect(main(page).getByRole('columnheader',{name:'Disc. %',exact:true})).toBeVisible();await expect(main(page)).toContainText('10%');const parsed=await pdf(page,info,quote);expect(parsed.text).toContain(fields.terms);if(!parsed.text.includes(fields.notes))await bug(page,info,'P2-QUOTE-002','Customer-facing quotation Notes persist and display in the saved web document, but are omitted from the downloaded PDF; entered terms are included.');return;}
  if(mode==='pdf'){await pdf(page,info,quote);return;}
  let current=await status(page,info,quote,'sent');current=await status(page,info,current,'accepted');expect((await matrix(page)).find((b:any)=>b.id==='1').quantity).toBe(source.quantity+(convert?5:0));await readRoute(page,'/quotations/'+quote.id,endpoint+'/'+quote.id);
  if(mode==='status'){await status(page,info,current,'rejected');expect((await matrix(page)).find((b:any)=>b.id==='1').quantity).toBe(source.quantity);await proof(page,info,'quotation-status-pipeline');return;}
  if(mode==='full'){const parsed=await pdf(page,info,current);expect(parsed.text).toContain(fields.terms);if(!parsed.text.includes(fields.notes)){info.annotations.push({type:'confirmed-bug',description:'P2-QUOTE-002: Customer-facing quotation Notes are absent from the downloaded PDF despite persistence and web display.'});await proof(page,info,'P2-QUOTE-002-missing-pdf-notes');expect.soft(parsed.text,'[P2-QUOTE-002] Customer-facing quotation notes must reach the customer PDF').toContain(fields.notes);}}
  let result:any;page.once('dialog',d=>d.accept());await writeScope(page,'convert only owned QA quotation '+quote.id,[new RegExp('^'+endpoint+'/'+quote.id+'/convert$')],async()=>{const next=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===endpoint+'/'+quote.id+'/convert').then(async r=>({ok:r.ok(),body:await r.json()}));await main(page).getByRole('button',{name:/^Convert to invoice$/i}).click();const r=await next;await info.attach('quotation-conversion',{body:JSON.stringify(r),contentType:'application/json'});expect(r.ok).toBe(true);result=r.body.data;expect(String(result.quotation_id)).toBe(String(quote.id));});
  const invoice=await readRoute(page,'/invoicing/'+result.id,'/app/api/v1/sales/invoices/'+result.id);expect(invoice.invoiceNumber).toBe(result.invoice_number);expect(invoice.total).toBe(quote.total);expect(invoice.customer).toBe(quote.customer);expect(invoice.items[0].quantity).toBe(2);expect((await matrix(page)).find((b:any)=>b.id==='1').quantity).toBe(source.quantity+3);
  const saved=await readRoute(page,'/quotations/'+quote.id,endpoint+'/'+quote.id);expect(saved.status).toBe('converted');await expect(main(page).getByRole('button',{name:/^Convert to invoice$/i})).toHaveCount(0);await proof(page,info,'converted-quotation-prevents-second-conversion');
 }finally{await restoreInventory(page);}
}
