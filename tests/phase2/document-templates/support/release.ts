import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {type Page} from 'playwright/test';
import {expect,route,writeScope} from '../../support/phase2';
const file='test-results/phase2-invoice-text-recovery.json';
export async function invoiceText(page:Page){
 await route(page,'/settings');const header=page.getByLabel('Invoice Header',{exact:true}),footer=page.getByLabel('Invoice Footer',{exact:true});
 await expect(page.getByLabel('Company Name',{exact:true})).toHaveValue('Nexstock QA Company');
 return {header:await header.inputValue(),footer:await footer.inputValue()};
}
export async function setInvoiceText(page:Page,state:{header:string;footer:string}){
 await invoiceText(page);await page.getByLabel('Invoice Header',{exact:true}).fill(state.header);await page.getByLabel('Invoice Footer',{exact:true}).fill(state.footer);
 await writeScope(page,'save/restore only QA invoice text fields',[/^\/app\/api\/v1\/settings$/],async()=>{
  const next=page.waitForResponse(r=>r.request().method()==='PUT'&&new URL(r.url()).pathname==='/app/api/v1/settings');
  await page.getByRole('button',{name:'Save Settings',exact:true}).click();expect((await next).ok()).toBe(true);
 });
 expect(await invoiceText(page)).toEqual(state);
}
export async function captureInvoiceText(page:Page){
 await restoreInvoiceText(page);const baseline=await invoiceText(page);writeFileSync(file,JSON.stringify({baseline,restored:false},null,2));return baseline;
}
export async function restoreInvoiceText(page:Page){
 if(!existsSync(file))return;const saved=JSON.parse(readFileSync(file,'utf8'));if(saved.restored)return;
 if(JSON.stringify(await invoiceText(page))!==JSON.stringify(saved.baseline))await setInvoiceText(page,saved.baseline);
 expect(await invoiceText(page)).toEqual(saved.baseline);saved.restored=true;writeFileSync(file,JSON.stringify(saved,null,2));
}
