import {test,expect,main} from '../support/phase2';
import {openCatalog} from '../products-bulk/support/catalog';
import {seedValuationStock,restoreValuationStock} from '../reports/support/valuation-stock';
test('F06-c commit first positive count for an active QA item without a branch balance',async({page},info)=>{
 info.setTimeout(360_000);await restoreValuationStock(page);try{
  let data=await openCatalog(page),p:any;
  while(!p){p=data.data.find((r:any)=>/^QA-/.test(r.sku)&&r.type==='physical'&&!r.is_service&&!r.has_variants&&r.track_inventory!==false&&Number(r.cost_price)>0&&Array.isArray(r.branch_stocks)&&!r.branch_stocks.some((b:any)=>String(b.branch_id)==='1'));if(p||!await main(page).getByRole('button',{name:'Next',exact:true}).isEnabled())break;const next=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/products').then(async r=>{expect(r.ok()).toBe(true);return (await r.json()).data;});await main(page).getByRole('button',{name:'Next',exact:true}).click();data=await next;}
  expect(p,'A QA item with no branch-1 balance row is required; a zero row left by an earlier retest is not equivalent').toBeTruthy();await info.attach('missing-balance-row-positive-control',{body:JSON.stringify({id:p.id,sku:p.sku,branchStocksBefore:p.branch_stocks}),contentType:'application/json'});await seedValuationStock(page,p,info);
 }finally{await restoreValuationStock(page);}
});
