import {test,expect,main,writeScope} from '../support/phase3';
import {note} from '../support/notes';
import {product,balance} from '../support/catalog';
import {captureInventory,restoreInventory} from '../support/inventory';
import {finding} from '../support/evidence';
import {readRoute,observedCall} from '../support/observed';
test('F13-f standalone credit note persists without invoice reference',async({page},info)=>{info.setTimeout(180_000);await captureInventory(page);try{const before=await product(page,'4'),n=await note(page,info,'credit'),after=await product(page,'4');const delta=balance(after,'1')-balance(before,'1');await info.attach('standalone-credit-result',{body:JSON.stringify({requestedUIAction:'Save as Draft',returned:n,stockBefore:before.branch_stocks,stockAfter:after.branch_stocks}),contentType:'application/json'});
if(n.status!=='draft'||delta!==0)await finding(page,info,{id:'P3-CN-002',feature:'13 - Credit Notes',requirements:['F13-f'],title:'Save as Draft does not preserve an unissued credit without stock effects',steps:['Create a standalone QA credit, Invoice ID None, reason Billing correction, one physical QA item quantity 1 price 100.','Choose Save Credit Note > Save as Draft.','Reload the credit and compare QA product stock before and after.'],expected:'Save as Draft retains a non-issued draft and leaves stock unchanged.',actual:'Reloaded status='+n.status+'; physical stock delta='+delta+'.',comment:'Stock changes are compensated; synthetic financial records remain auditable.'});expect(delta).toBe(0);expect(n.status).toBe('draft');
}finally{await restoreInventory(page);}});

test('P3-CN-002 native issue preserves correction stock and restocks returns only once',async({page},info)=>{
 info.setTimeout(480_000);await captureInventory(page);
 try{for(const reason of ['billing','return'] as const){
  const before=await product(page,'4'),draft=await note(page,info,'credit',undefined,reason);expect(draft.status).toBe('draft');expect(balance(await product(page,'4'),'1')).toBe(balance(before,'1'));
  const endpoint='/app/api/v1/sales/credit-notes/'+draft.id;await readRoute(page,'/credit-notes/'+draft.id,endpoint);let issued:any;
  await writeScope(page,'issue only owned synthetic QA credit '+draft.id,[new RegExp('^'+endpoint+'/issue$')],async()=>{const next=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===endpoint+'/issue').then(async r=>({status:r.status(),ok:r.ok(),body:await r.json()}));await main(page).getByRole('button',{name:'Issue credit note',exact:true}).click();issued=await next;});
  expect(issued.ok).toBe(true);const fresh=await readRoute(page,'/credit-notes/'+draft.id,endpoint),after=await product(page,'4'),delta=balance(after,'1')-balance(before,'1');
  await info.attach('credit-issue-'+reason,{body:JSON.stringify({draft,issued,fresh,stockBefore:before.branch_stocks,stockAfter:after.branch_stocks,expectedDelta:reason==='return'?1:0,actualDelta:delta}),contentType:'application/json'});
  if(fresh.status==='draft'||delta!==(reason==='return'?1:0))await finding(page,info,{id:'P3-CN-002',feature:'13 - Credit Notes',requirements:['F13-f'],title:'Credit issue does not apply the correct reason-specific stock effect',steps:['Save a standalone QA credit as Draft with '+reason+' reason.','Issue it using Issue credit note.','Reload the credit and compare product stock.'],expected:'Issue the credit; Product return restocks one unit and Billing correction restocks none.',actual:'Issued status='+fresh.status+'; '+reason+' stock delta='+delta+'.',comment:'Only synthetic credits are issued. Captured stock is restored.'});
  await readRoute(page,'/credit-notes/'+draft.id,endpoint);const duplicate=await observedCall(page,endpoint,'POST',{},'/issue'),last=await product(page,'4');
  await info.attach('credit-duplicate-issue-'+reason,{body:JSON.stringify({status:duplicate.status(),stock:last.branch_stocks}),contentType:'application/json'});expect([200,204,400,409,422]).toContain(duplicate.status());expect(balance(last,'1')).toBe(balance(after,'1'));
 }}finally{await restoreInventory(page);}
});
