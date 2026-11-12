import {readFileSync} from 'node:fs';
import {type Page,type TestInfo} from 'playwright/test';
import {test,expect,main,proof,bug,blocked,number,route,writeScope,record} from '../../support/phase2';
import {readRoute} from '../../support/observed';
import {openCatalog,parseCSV} from '../../products-bulk/support/catalog';
import {seedValuationStock,restoreValuationStock} from './valuation-stock';
import {captureInventory,changeInventory,restoreInventory} from '../../support/inventory';
import {sellQA} from '../../pos-extensions/support/fiscal';
import {datePlus,fillDates,cancelInvoice} from '../../../phase1/invoicing/support/invoicing';
export {test,expect};
const reports='/app/api/v1/reporting/reports';
async function products(page:Page){
 const first=await openCatalog(page);let all=[...first.data],pages=1;
 while(await main(page).getByRole('button',{name:'Next',exact:true}).isEnabled()){
  expect(pages++).toBeLessThan(100);const next=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/products').then(async r=>{expect(r.ok()).toBe(true);return (await r.json()).data;});await main(page).getByRole('button',{name:'Next',exact:true}).click();const data=await next;all.push(...data.data);await expect(main(page).getByRole('cell',{name:data.data[0].sku,exact:true})).toBeVisible();
 }expect(new Set(all.map((p:any)=>p.id)).size).toBe(first.total);return all;
}
async function openReports(page:Page){
 const summary=await readRoute(page,'/reports','/app/api/v1/reporting/business/summary');await expect(main(page).getByRole('heading',{name:'Reports & Analytics',exact:true})).toBeVisible();return summary;
}
async function reportTab(page:Page,label:string,type:string){
 const next=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===reports&&new URL(r.url()).searchParams.get('type')===type).then(async r=>{expect(r.ok()).toBe(true);return {data:(await r.json()).data,query:Object.fromEntries(new URL(r.url()).searchParams)};});await main(page).getByRole('tab',{name:label,exact:true}).click();const r=await next;await expect(main(page).getByRole('tabpanel',{name:label,exact:true})).toBeVisible();return r;
}
async function exportCSV(page:Page,info:TestInfo,label:string,type:string){
 const panel=main(page).getByRole('tabpanel',{name:label,exact:true});const next=page.waitForEvent('download');
 await writeScope(page,'generate QA-company report artifact only',[/^\/app\/api\/v1\/reporting\/reports\/generate$/],async()=>{
  const generated=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===reports+'/generate');await panel.getByRole('button',{name:'Export CSV',exact:true}).click();const response=await generated;expect(response.ok()).toBe(true);expect(response.request().postDataJSON()).toMatchObject({type,format:'csv'});
 });
 const download=await next,path=info.outputPath(type+'.csv');await download.saveAs(path);await info.attach(type+'-csv',{path,contentType:'text/csv'});return parseCSV(readFileSync(path,'utf8').replace(/^\uFEFF/,''));
}
async function valuation(page:Page,info:TestInfo,mode:string){
 let catalogue=await products(page);
 if(mode==='valuation-live'){const baseline=await captureInventory(page),b=baseline.balances.find((b:any)=>b.id==='1');await changeInventory(page,b.id,b.branch,1);catalogue=await products(page);}
 if(mode==='valuation'){
  const outside=catalogue.slice(15).find((p:any)=>/^QA-/.test(p.sku)&&!p.is_service&&!p.has_variants&&(p.type??'physical')==='physical'&&p.track_inventory!==false&&Number(p.cost_price??p.cost)>0);expect(outside).toBeTruthy();await seedValuationStock(page,outside,info);catalogue=await products(page);
 }
 await openReports(page);const r=await reportTab(page,'Category Valuation','categoryValuation'),expected=new Map<string,number>();
 for(const p of catalogue){const category=p.category_name??p.category??'Uncategorized';expected.set(category,(expected.get(category)||0)+Number(p.cost_price??p.cost??0)*Number(p.stock??0));}
 const columns:string[]=r.data.columns,category=columns.find(k=>/category/i.test(k)),cost=columns.find(k=>/cost|wholesale/i.test(k));expect(category).toBeTruthy();expect(cost).toBeTruthy();const actual=new Map<string,number>(r.data.rows.map((row:any)=>[String(row[category!]??'Uncategorized'),Number(row[cost!])]));
 await info.attach('valuation-independent-oracle',{body:JSON.stringify({catalogueRows:catalogue.length,expected:Object.fromEntries(expected),report:r}),contentType:'application/json'});
 for(const [label,value] of expected)expect(actual.get(label)||0,'Independent inventory cost valuation for '+label).toBeCloseTo(value,2);await proof(page,info,'server-inventory-valuation');
 if(mode==='csv'){
  const csv=await exportCSV(page,info,'Category Valuation','categoryValuation');expect(csv.length-1).toBe(r.data.rows.length);const normalized=csv[0].map(h=>h.toLowerCase().replace(/[\s_-]/g,'')),index=normalized.findIndex(h=>/cost|wholesale/.test(h));expect(index).toBeGreaterThanOrEqual(0);const total=csv.slice(1).reduce((n,row)=>n+number(row[index]),0);expect(total).toBeCloseTo([...expected.values()].reduce((n,v)=>n+v,0),2);
 }
}
async function lowStock(page:Page,info:TestInfo){
 const catalogue=await products(page),required=catalogue.filter((p:any)=>p.track_inventory!==false&&!p.is_service&&Number(p.stock??0)<=Number(p.reorder_point??0)).map((p:any)=>p.sku);await openReports(page);const r=await reportTab(page,'Low Stock','lowStockSummary'),missing=required.filter((sku:string)=>!r.data.rows.some((row:any)=>row.sku===sku));
 await info.attach('low-stock-completeness',{body:JSON.stringify({catalogue:catalogue.length,required,missing,report:r}),contentType:'application/json'});if(missing.length)await bug(page,info,'P2-REP-003','Server-backed Low Stock report omits '+missing.length+' eligible active depleted inventory SKUs from an independently paginated catalogue.');
 const panel=main(page).getByRole('tabpanel',{name:'Low Stock',exact:true});for(const sku of required)await expect(panel).toContainText(sku);await proof(page,info,'complete-low-stock-report');
}
async function ignoredDraft(page:Page,info:TestInfo){
 await route(page,'/invoicing');await main(page).getByRole('button',{name:'New Invoice',exact:true}).click();await main(page).getByRole('combobox').first().click();await page.getByRole('option').filter({hasText:'qa.billing.customer@example.invalid'}).click();await fillDates(page,datePlus(0),datePlus(15));await main(page).getByRole('button',{name:'Add Row',exact:true}).click();await main(page).getByRole('combobox').filter({hasText:'Choose product...'}).click();await page.getByRole('option').filter({hasText:'QA add mv9rtxw1-3b087e - Rs'}).click();await main(page).getByRole('spinbutton').nth(0).fill('1');await main(page).getByRole('spinbutton').nth(1).fill('777');let invoice:any;
 await writeScope(page,'create only a synthetic QA draft as a report exclusion control',[/^\/app\/api\/v1\/sales\/invoices$/],async()=>{const next=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/app/api/v1/sales/invoices').then(async r=>{expect(r.ok()).toBe(true);return (await r.json()).data;});await main(page).getByRole('button',{name:'Save Invoice',exact:true}).click();await page.getByRole('menuitem',{name:'Save as Draft',exact:true}).click();invoice=await next;});expect(invoice.status).toBe('draft');expect(invoice.total).toBe(777);record({category:'owned-fixture',kind:'report-exclusion-invoice',id:invoice.id});return invoice;
}
async function performance(page:Page,info:TestInfo){
 const inventory=await captureInventory(page),branch=inventory.balances.find((b:any)=>b.id==='1');await changeInventory(page,branch.id,branch.branch,3);
 const sku='QA-SERVICE-mvmgbd15-fba79b',source=(r:any)=>r.data.rows.find((x:any)=>x.sku===sku)||{units:0,revenue:0};await openReports(page);const before=await reportTab(page,'Product Performance','salesByProduct'),baseline=source(before);
 const {receipt}=await sellQA(page,info);await receipt.getByRole('button',{name:'Close',exact:true}).last().click();await openReports(page);const paid=await reportTab(page,'Product Performance','salesByProduct');expect(Number(source(paid).units)).toBe(Number(baseline.units)+1);expect(Number(source(paid).revenue)).toBeCloseTo(Number(baseline.revenue)+100,2);
 const draft=await ignoredDraft(page,info);await openReports(page);const afterDraft=await reportTab(page,'Product Performance','salesByProduct');expect(afterDraft.data.rows,'Draft transactions must not change any product-performance row').toEqual(paid.data.rows);await writeScope(page,'cancel only the owned report exclusion draft',[new RegExp('^/app/api/v1/sales/invoices/'+draft.id+'$')],()=>cancelInvoice(page,String(draft.id)));await openReports(page);const afterCancel=await reportTab(page,'Product Performance','salesByProduct');expect(afterCancel.data.rows,'Cancelled draft must stay excluded for every product').toEqual(paid.data.rows);
 const panel=main(page).getByRole('tabpanel',{name:'Product Performance',exact:true});
 for(const item of afterCancel.data.rows){const row=panel.getByRole('row').filter({has:page.getByRole('cell',{name:item.sku,exact:true})});await expect(row).toHaveCount(1);const cells=await row.getByRole('cell').allTextContents();expect(number(cells[2])).toBe(Number(item.units));expect(number(cells[3])).toBeCloseTo(Number(item.revenue),2);expect(number(cells[5])).toBeCloseTo(Number(item.revenue)-Number(item.cost),2);}
 const csv=await exportCSV(page,info,'Product Performance','salesByProduct');expect(csv.length-1).toBe(afterCancel.data.rows.length);await info.attach('product-performance-causal-oracle',{body:JSON.stringify({sku,knownPaidDelta:{units:1,revenue:100},excludedDraftId:draft.id,excludedAmount:777,before,paid,afterDraft,afterCancel,scope:'Quantity/revenue and exclusion controls; cost snapshot eligibility is not independently certified.'}),contentType:'application/json'});await proof(page,info,'product-performance-reconciled');
}
async function check(page:Page,info:TestInfo,mode:string){
 if(['valuation','valuation-current','valuation-live','csv'].includes(mode))return valuation(page,info,mode);if(mode==='low-stock')return lowStock(page,info);if(mode==='performance')return performance(page,info);
 await openReports(page);
 if(mode==='currency'){
  const results=[];for(const label of ['Stock Cost Value','Stock Selling Value','Sales Revenue (Paid)','Outstanding Balance','Total Credit Notes']){const text=await main(page).getByText(label,{exact:true}).locator('xpath=ancestor::*[count(.//p)>=2][1]').innerText();results.push({label,text});if(/\$\s*[\d,]/.test(text))await bug(page,info,'P2-REP-005','Reports still displays a dollar-prefixed amount in the MUR company: '+text);expect(text).toMatch(/Rs\s*[\d,]/);}await info.attach('report-currency-format',{body:JSON.stringify(results),contentType:'application/json'});await proof(page,info,'report-rs-currency');return;
 }
 const ui=await main(page).ariaSnapshot();await info.attach('report-capability-controls',{body:ui,contentType:'text/plain'});
 if(mode==='sales'){if(!/Cashier|Payment Method/i.test(ui)||!await main(page).locator('input[type="date"]').count())await bug(page,info,'P2-REP-001','The sales report still has no required cashier/payment-method and custom-date filter combination; the release explicitly excludes this capability.');return blocked(info,'New sales filters need independent non-zero reconciliation.');}
 if(mode==='tax'){await main(page).getByRole('combobox').first().click();const options=await page.getByRole('option').allTextContents();await page.keyboard.press('Escape');if(!options.some(s=>/vat|fiscal|tax/i.test(s)))await bug(page,info,'P2-REP-004','A VAT/fiscal report with tax classes is not available; this release explicitly excludes it.');return blocked(info,'New fiscal report needs tax-class reconciliation.');}
 if(mode==='pdf'){if(!await main(page).getByRole('button',{name:/PDF/i}).count())await bug(page,info,'P2-REP-006','The report export interface provides CSV but no PDF report action; this release explicitly excludes PDF reports.');return blocked(info,'New PDF report output needs actual file verification.');}
}
export async function reportScenario(page:Page,info:TestInfo,mode:string){
 info.setTimeout(mode==='full'?900_000:420_000);
 const run=async(m:string)=>{try{return await check(page,info,m);}finally{if(m==='valuation')await restoreValuationStock(page);if(['valuation-live','performance'].includes(m))await restoreInventory(page);}};
 if(mode!=='full')return run(mode);const outcomes=[];for(const m of ['sales','performance','valuation-current','valuation-live','low-stock','tax','csv','pdf','currency']){try{await test.step(m,()=>run(m));outcomes.push({step:m,status:'pass'});}catch(e){outcomes.push({step:m,status:'fail',error:String(e)});}}
 await info.attach('full-flow-outcomes',{body:JSON.stringify(outcomes),contentType:'application/json'});expect(outcomes.filter(o=>o.status==='fail')).toEqual([]);
}
