import {test,expect,main,route,writeScope,record} from '../support/phase3';
import {readRoute,observedCall,allPages} from '../support/observed';
import {searchPicker,selectPicker} from '../support/picker';
import {snapshot} from '../support/evidence';
import {finding} from '../support/evidence';
import {datePlus,fillDates} from '../../phase1/invoicing/support/invoicing';
import {newCustomer,fillCustomer,uniqueCustomer,customerRow,searchCustomer} from '../../phase1/customers/support/customers';
const endpoint='/app/api/v1/customers';

async function create(page:any,info:any,late=false){
 const customer=uniqueCustomer('credit-retest');if(late)customer.name='QA CUST ZZZ RETEST '+customer.token;
 const form=await newCustomer(page);await fillCustomer(page,form,customer);
 await form.getByRole('switch',{name:'Allow credit',exact:true}).check();await form.getByLabel(/^Credit limit/).fill('25');await form.getByLabel(/^Credit expires/).fill('2026-12-19');
 let saved:any;await writeScope(page,'create only owned QA customer',[/^\/app\/api\/v1\/customers$/],async()=>{const next=page.waitForResponse((r:any)=>r.request().method()==='POST'&&new URL(r.url()).pathname===endpoint).then(async(r:any)=>({status:r.status(),ok:r.ok(),body:await r.json(),request:r.request().postDataJSON()}));await form.getByRole('button',{name:'Add Customer',exact:true}).click();saved=await next;});
 await info.attach('owned-credit-customer-created',{body:JSON.stringify(saved),contentType:'application/json'});if(!saved.ok)await finding(page,info,{id:'P3-CUST-002',feature:'19 - Customers',requirements:['F19-f'],title:'Native customer creation cannot persist valid credit settings',steps:['Open New Customer and enter a unique QA name and valid contact details.','Enable Allow credit, set limit 25 and future expiry 2026-12-19.','Submit Add Customer and inspect the native response.'],expected:'Create the customer with the configured credit enablement, limit and expiry.',actual:'HTTP '+saved.status+': '+JSON.stringify(saved.body),comment:'Only native form controls and an owned unique QA customer were used. Credit checkout enforcement is not inferred from failed configuration persistence.'});expect(saved.ok).toBe(true);record({category:'owned-fixture',kind:'customer',id:saved.body.data.id,name:customer.name,email:customer.email});return {...customer,id:saved.body.data.id};
}
async function deactivate(page:any,owned:any){
 await readRoute(page,'/customers',endpoint);const r=await observedCall(page,endpoint,'PUT',{status:'inactive'},'/'+owned.id);expect(r.ok()).toBe(true);const rows=await allPages(page,endpoint,await readRoute(page,'/customers',endpoint));expect(rows.find((x:any)=>String(x.id)===String(owned.id)).status).toBe('inactive');
}
test('P3-CUST-002 credit enable limit expiry persist through native create and edit',async({page},info)=>{
 info.setTimeout(240_000);let owned:any;
 try{owned=await create(page,info);const rows=await allPages(page,endpoint,await readRoute(page,'/customers',endpoint)),fresh=rows.find((x:any)=>String(x.id)===String(owned.id));expect(fresh.creditEnabled).toBe(true);expect(Number(fresh.creditLimit)).toBe(25);expect(fresh.creditExpiry?.slice(0,10)).toBe('2026-12-19');
  await searchCustomer(page,owned);await customerRow(page,owned).getByRole('button',{name:'Actions',exact:true}).click();await page.getByRole('menuitem',{name:'Edit',exact:true}).click();const edit=page.getByRole('dialog',{name:'Edit Customer',exact:true});await expect(edit.getByRole('switch',{name:'Allow credit',exact:true})).toBeChecked();await expect(edit.getByLabel(/^Credit limit/)).toHaveValue('25');await expect(edit.getByLabel(/^Credit expires/)).toHaveValue('2026-12-19');
  await edit.getByLabel(/^Credit limit/).fill('0');await edit.getByRole('button',{name:'Save Changes',exact:true}).click();await expect(page.getByText('Enter a credit limit above zero to allow credit.',{exact:true})).toBeVisible();await expect(edit).toBeVisible();
  await edit.getByLabel(/^Credit limit/).fill('50');await edit.getByLabel(/^Credit expires/).fill('2027-01-19');let result:any;
  await writeScope(page,'edit only owned QA credit settings',[new RegExp('^'+endpoint+'/'+owned.id+'$')],async()=>{const next=page.waitForResponse(r=>r.request().method()==='PUT'&&new URL(r.url()).pathname===endpoint+'/'+owned.id).then(async r=>({ok:r.ok(),body:await r.json(),request:r.request().postDataJSON()}));await edit.getByRole('button',{name:'Save Changes',exact:true}).click();result=await next;});expect(result.ok).toBe(true);
  const after=await allPages(page,endpoint,await readRoute(page,'/customers',endpoint)),changed=after.find((x:any)=>String(x.id)===String(owned.id));await info.attach('credit-settings-round-trip',{body:JSON.stringify({fresh,result,changed}),contentType:'application/json'});expect(Number(changed.creditLimit)).toBe(50);expect(changed.creditExpiry?.slice(0,10)).toBe('2027-01-19');await snapshot(page,info,'credit-settings-saved');
  info.annotations.push({type:'partial-coverage',description:'Credit enable/limit/expiry create/edit persistence and zero-limit rejection tested. Over-limit or expired-credit checkout enforcement is a separate requirement; no pass is inferred from these settings.'});
 }finally{if(owned)await deactivate(page,owned);}
});

test('MVP-LOOKUP-001 MVP-CUST-001 later-page active customer search and inactive exclusion on Invoice and Quotation',async({page},info)=>{
 info.setTimeout(300_000);let owned:any;
 try{owned=await create(page,info,true);const initial=await readRoute(page,'/customers',endpoint),all=await allPages(page,endpoint,initial);expect(all.some((x:any)=>String(x.id)===String(owned.id)&&x.status==='active')).toBe(true);await info.attach('later-customer-oracle',{body:JSON.stringify({id:owned.id,name:owned.name,email:owned.email,total:all.length,initialContainsOwned:(Array.isArray(initial)?initial:initial.data).some((x:any)=>String(x.id)===String(owned.id))}),contentType:'application/json'});
  for(const kind of ['invoice','quotation']){await route(page,'/create-'+kind);await selectPicker(page,main(page).getByRole('combobox').first(),owned.email.toLowerCase(),endpoint,info);await expect(main(page).getByRole('combobox').first()).toContainText(owned.name);await snapshot(page,info,kind+'-later-active-customer');}
  await deactivate(page,owned);
  for(const kind of ['invoice','quotation']){await route(page,'/create-'+kind);await searchPicker(page,main(page).getByRole('combobox').first(),owned.email.toLowerCase(),endpoint,info);await expect(page.getByRole('option').filter({hasText:owned.email})).toHaveCount(0);await expect(page.getByText('No active customer matches.',{exact:true})).toBeVisible();await snapshot(page,info,kind+'-inactive-excluded');await page.keyboard.press('Escape');}
 }finally{if(owned)await deactivate(page,owned);}
});

test('MVP-CUST-001 Invoice and Quotation refuse a customer deactivated after selection',async({page,context},info)=>{
 info.setTimeout(300_000);let owned:any;const admin=await context.newPage();
 try{owned=await create(page,info);
  for(const kind of ['invoice','quotation']){
   await readRoute(admin,'/customers',endpoint);const active=await observedCall(admin,endpoint,'PUT',{status:'active'},'/'+owned.id);expect(active.ok()).toBe(true);
   await route(page,'/create-'+kind);await selectPicker(page,main(page).getByRole('combobox').first(),owned.email,endpoint,info);await fillDates(page,datePlus(0),datePlus(15));await main(page).getByRole('button',{name:'Add Row',exact:true}).click();await selectPicker(page,main(page).getByRole('combobox',{name:'Select Product',exact:true}),'QA-ADD-mv9rtxw1-3b087e','/app/api/v1/products',info);
   await deactivate(admin,owned);const destination='/app/api/v1/sales/'+(kind==='invoice'?'invoices':'quotations');let saved:any;
   await writeScope(page,'inactive owned customer validation on QA '+kind+' draft',[new RegExp('^'+destination+'$')],async()=>{const next=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===destination).then(async r=>({ok:r.ok(),status:r.status(),body:await r.json(),request:r.request().postDataJSON()}));await main(page).getByRole('button',{name:kind==='invoice'?'Save Invoice':'Save Quotation',exact:true}).click();await page.getByRole('menuitem',{name:'Save as Draft',exact:true}).click();saved=await next;});
   await info.attach(kind+'-inactive-customer-backend-refusal',{body:JSON.stringify(saved),contentType:'application/json'});
   if(saved.ok)await finding(page,info,{id:'MVP-CUST-001',feature:'19 - Customers / Billing documents',requirements:['F19-b'],title:'A customer deactivated after selection is still accepted by new billing documents',steps:['Select an owned active customer in New '+kind+' and prepare a valid QA item.','Deactivate the same customer in another page and verify the persisted status.','Save the prepared '+kind+' as Draft.'],expected:'Reject the now-inactive customer before creating a new document.',actual:'The native request succeeds with HTTP '+saved.status+' and creates document '+saved.body.data.id+'.',comment:'Only an owned inactive contact and synthetic QA draft are used. UI search exclusion is a separate tested path. No dispatch or payment is requested.',continue:true});
   else{expect(saved.status).toBe(422);expect(JSON.stringify(saved.body)).toMatch(/inactive|customer/i);}
   await snapshot(page,info,kind+'-inactive-request-result');
  }
 }finally{if(owned)await deactivate(admin,owned);await admin.close();}
});
