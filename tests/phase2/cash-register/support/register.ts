import {type Page,type TestInfo,type Dialog} from 'playwright/test';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {test,expect,route,main,writeScope,record,proof,bug,blocked,number} from '../../support/phase2';
import {sellQA} from '../../pos-extensions/support/fiscal';
export {test,expect};
const recovery='test-results/phase2-register-recovery.json';
const root='/app/api/v1/pos/register';
type Owned={id?:string;marker:string;opening:number;closed:boolean};
const save=(s:Owned)=>writeFileSync(recovery,JSON.stringify(s,null,2));
async function current(page:Page){
 await page.goto('about:blank');const read=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===root,{timeout:60_000}).then(async r=>({ok:r.ok(),body:await r.json()}));
 const [,response]=await Promise.all([route(page,'/cash-register'),read]);expect(response.ok).toBe(true);return response.body.data;
}
const figure=(page:Page,label:string)=>main(page).getByRole('paragraph').filter({hasText:new RegExp('^'+label+'$','i')}).locator('..').getByRole('paragraph').last();
async function closeOwned(page:Page,owned:Owned,delta=0){
 const session=await current(page);if(!session?.is_open){owned.closed=true;save(owned);return null;}
 expect(String(session.id),'Only the owned QA session may be closed').toBe(String(owned.id));expect(owned.marker).toMatch(/^QA-P2-shift-/);
 const expected=Number(session.expected_cash),actual=Number((expected+delta).toFixed(2));await expect(main(page).getByRole('heading',{name:'Session open',exact:true})).toBeVisible();
 await main(page).getByRole('spinbutton',{name:'Actual cash counted',exact:true}).fill(String(actual));await main(page).getByRole('textbox',{name:'Notes',exact:true}).fill(owned.marker+' closed by QA');
 const confirmations:string[]=[],accept=async(d:Dialog)=>{confirmations.push(d.message());await d.accept();};page.on('dialog',accept);let closed:any;
 try{await writeScope(page,'close only owned QA shift '+owned.id,[new RegExp('^'+root+'/'+owned.id+'/close$')],async()=>{
  const read=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===root+'/'+owned.id+'/close',{timeout:30_000}).then(async r=>({ok:r.ok(),body:await r.json()}));await main(page).getByRole('button',{name:'Close register',exact:true}).click();const result=await read;expect(result.ok).toBe(true);closed=result.body.data;
 });}finally{page.off('dialog',accept);}
 expect(closed.is_open).toBe(false);expect(Number(closed.actual_cash)).toBe(actual);expect(Number(closed.variance)).toBeCloseTo(delta,2);if(delta!==0)expect(confirmations).toHaveLength(1);
 owned.closed=true;save(owned);await expect(main(page).getByRole('heading',{name:'The register is closed',exact:true})).toBeVisible();return closed;
}
export async function recoverShift(page:Page){
 if(!existsSync(recovery))return;const owned:Owned=JSON.parse(readFileSync(recovery,'utf8'));if(owned.closed)return;
 const session=await current(page);if(!session?.is_open){owned.closed=true;save(owned);return;}
 if(!owned.id&&session.notes===owned.marker){owned.id=String(session.id);save(owned);}
 if(String(session.id)!==String(owned.id))throw new Error('An active register is not the recorded QA fixture. It was not changed.');await closeOwned(page,owned);
}
async function openOwned(page:Page,info:TestInfo){
 await recoverShift(page);const before=await current(page);if(before?.is_open)await blocked(info,'An existing register shift is open and is not owned by this test. Do not close or alter it to make automation pass.');
 await expect(main(page).getByRole('heading',{name:'The register is closed',exact:true})).toBeVisible();const owned:Owned={marker:'QA-P2-shift-'+Date.now().toString(36),opening:Number((100+(Date.now()%10000)/100).toFixed(2)),closed:false};save(owned);
 await main(page).getByRole('spinbutton',{name:'Opening float',exact:true}).fill(String(owned.opening));await main(page).getByRole('textbox',{name:'Notes',exact:true}).fill(owned.marker);
 await writeScope(page,'open only isolated QA register shift',[/^\/app\/api\/v1\/pos\/register$/],async()=>{
  const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===root,{timeout:30_000}).then(async r=>({ok:r.ok(),body:await r.json()}));await main(page).getByRole('button',{name:'Open register',exact:true}).click();const result=await saved;await info.attach('qa-shift-open',{body:JSON.stringify(result.body),contentType:'application/json'});expect(result.ok).toBe(true);owned.id=String(result.body.data.id);save(owned);record({test:info.title,category:'owned-fixture',kind:'cash-shift',id:owned.id,marker:owned.marker,opening:owned.opening});
 });
 const persisted=await current(page);expect(String(persisted.id)).toBe(owned.id);expect(persisted.is_open).toBe(true);expect(Number(persisted.opening_float)).toBe(owned.opening);expect(persisted.notes).toBe(owned.marker);
 await expect(main(page).getByRole('heading',{name:'Session open',exact:true})).toBeVisible();expect(number(await figure(page,'Opening float').innerText())).toBe(owned.opening);return owned;
}
async function moneyControls(page:Page,info:TestInfo){
 const controls=main(page).getByRole('button',{name:/cash\s*(in|out)|pay[ -]?(in|out)|petty cash/i});
 if(!await controls.count())await bug(page,info,'P2-REG-001','An active owned QA register has no Cash In, Cash Out, pay-in/pay-out or petty-cash entry controls.');
 await blocked(info,'Cash movement controls are now available. Inspect their amount/reason fields and verify ledger/expected-cash arithmetic before certifying the previously unavailable capability.');
}
async function reportControl(page:Page,info:TestInfo,kind:'X'|'Z'){
 const controls=main(page).getByRole('button',{name:new RegExp('\\b'+kind+'[ -]*report\\b|'+(kind==='X'?'mid.shift':'end.of.(?:day|shift)')+' report','i')});
 if(!await controls.count())await bug(page,info,'P2-REG-002',kind+'-report generation/printing is unavailable in the '+(kind==='X'?'active register':'closed-shift history')+' UI.');
 await blocked(info,'Shift report controls are now available. Inspect generated report content and thermal printing before certifying the formerly unavailable output.');
}
export async function registerScenario(page:Page,info:TestInfo,mode:string){
 info.setTimeout(240_000);let owned:Owned|undefined;
 try{
  owned=await openOwned(page,info);await proof(page,info,'owned-register-open');
  if(mode==='cash-in'||mode==='cash-out')await moneyControls(page,info);
  if(mode==='x-report')await reportControl(page,info,'X');
  const failures:{step:string;error:string}[]=[];
  if(mode==='full'){
   for(const [step,run] of [['Cash movements',()=>moneyControls(page,info)],['X-report',()=>reportControl(page,info,'X')]] as const){try{await run();}catch(error){failures.push({step,error:String(error)});}}
   await sellQA(page,info);const updated=await current(page);expect(Number(updated.expected_cash),'Expected drawer cash includes the QA cash sale').toBeCloseTo(owned.opening+100,2);expect(number(await figure(page,'Expected cash').innerText())).toBeCloseTo(owned.opening+100,2);
  }
  const delta=mode==='close-over'?4:mode==='close-short'?-3:0;const closed=await closeOwned(page,owned,delta);expect(closed).toBeTruthy();await info.attach('qa-shift-closed',{body:JSON.stringify(closed),contentType:'application/json'});
  expect(closed.cashier,'The closed QA shift must retain the configured logged-in actor').toBe(process.env.ADJUSTMENT_TEST_ACTOR||'Fuad Peerbocus');const amount=owned.opening.toFixed(2).replace('.','\\.'),row=main(page).getByRole('row').filter({has:page.locator('td:nth-child(3)').filter({hasText:new RegExp('^Rs\\s*'+amount+'$')})}).first();await expect(row).toBeVisible();await expect(row).toContainText(delta>0?'Over':delta<0?'Short':'Balanced');await expect(row).toContainText(String(closed.cashier));await proof(page,info,'owned-shift-history');
  if(mode==='z-report')await reportControl(page,info,'Z');
  if(mode==='full'){try{await reportControl(page,info,'Z');}catch(error){failures.push({step:'Z-report',error:String(error)});}await info.attach('full-flow-outcomes',{body:JSON.stringify(failures),contentType:'application/json'});expect(failures).toEqual([]);}
 }finally{await recoverShift(page);}
}
