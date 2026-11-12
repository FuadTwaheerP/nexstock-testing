import {type Page,type TestInfo} from 'playwright/test';
import {test,expect,main,writeScope,proof,bug} from '../../support/phase2';
import {readRoute} from '../../support/observed';
import {createBill,pay,bills,billRow,endpoint as billEndpoint} from '../../bills-payable/support/bills';
import {exportCatalog} from '../../products-bulk/support/catalog';
import {datePlus} from '../../../phase1/invoicing/support/invoicing';
export {test,expect};
const endpoint='/app/api/v1/settings/audit-logs';
async function logs(page:Page){const data=await readRoute(page,'/audit-logs',endpoint);await expect(main(page).getByRole('heading',{name:'Audit Logs',exact:true,level:1})).toBeVisible();return data.data;}
async function freshEntries(page:Page,info:TestInfo,before:any[],predicate:(r:any)=>boolean){
 let after=await logs(page),added=after.filter((r:any)=>!before.some(b=>String(b.id)===String(r.id))),matches=added.filter(predicate);let transport:unknown;
 if(!matches.length){try{await expect.poll(async()=>{try{after=await logs(page);added=after.filter((r:any)=>!before.some(b=>String(b.id)===String(r.id)));matches=added.filter(predicate);return matches.length;}catch(e){transport=e;throw e;}},{timeout:20_000,intervals:[1000,2000,4000]}).toBeGreaterThan(0);}catch(e){if(transport)throw transport;}}
 await info.attach('audit-before-after',{body:JSON.stringify({beforeIds:before.map(r=>r.id),after,added,matches}),contentType:'application/json'});return matches;
}
async function stream(page:Page,info:TestInfo,mode:string){
 const started=new Date();
 const before=await logs(page);let bill:any;
 if(mode==='export'){await exportCatalog(page,info,'CSV');const matches=await freshEntries(page,info,before,r=>/export/i.test(r.action+' '+r.details));if(!matches.length)await bug(page,info,'P2-AUD-003','A real product CSV export downloads successfully, but no new export activity entry appears in fresh audit reads over 20 seconds.');return;}
 bill=await createBill(page,info);let baseline=before;
 if(mode==='update'||mode==='delete')baseline=await logs(page);
 if(mode==='update'){await bills(page);bill=await pay(page,info,bill,20,'cash');expect(bill.amountPaid).toBe(20);}
 if(mode==='delete'){
  expect(bill.referenceNumber).toMatch(/^QA-P2-BILL-/);expect(bill.amountPaid).toBe(0);expect(bill.status).toBe('unpaid');await bills(page);const row=billRow(page,bill.billNumber);page.once('dialog',d=>d.accept());await writeScope(page,'delete only unused unpaid bill created by this audit case',[new RegExp('^'+billEndpoint+'/'+bill.id+'$')],async()=>{const saved=page.waitForResponse(r=>r.request().method()==='DELETE'&&new URL(r.url()).pathname===billEndpoint+'/'+bill.id);await row.locator('button:has(svg.lucide-trash2)').click();expect((await saved).ok()).toBe(true);});expect((await bills(page)).some((b:any)=>String(b.id)===String(bill.id))).toBe(false);
 }
 const expected=mode==='create'?/creat/i:mode==='update'?/updat/i:/delet/i;
 const matches=await freshEntries(page,info,baseline,r=>r.module==='Purchasing'&&expected.test(r.action)&&/Bill/i.test(r.details)&&(mode==='update'||JSON.stringify(r).includes(bill.referenceNumber)));
 if(!matches.length)await bug(page,info,'P2-AUD-002','A completed own QA bill '+mode+' operation is absent from fresh audit activity reads.');
 const dates=new Set([started,new Date()].flatMap(d=>[d.toISOString().slice(0,10),new Intl.DateTimeFormat('en-CA',{timeZone:'Indian/Mauritius',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)]));
 for(const m of matches){expect(m.user).toBe('Fuad Peerbocus');expect(m.timestamp).toMatch(/^\d{4}-\d{2}-\d{2} /);expect(dates.has(m.timestamp.slice(0,10)),'Fresh action date must belong to this execution, not the original campaign date').toBe(true);expect(m.module).toBe('Purchasing');}await proof(page,info,'audited-bill-'+mode);
}
async function filter(page:Page,info:TestInfo,mode:string){
 const current=await logs(page);expect(current.length).toBeGreaterThan(0);
 if(mode==='module'){
  const loaded=page.waitForResponse(r=>{const u=new URL(r.url());return r.request().method()==='GET'&&u.pathname===endpoint&&u.searchParams.get('module')?.toLowerCase()==='products';}).then(async r=>{expect(r.ok()).toBe(true);return (await r.json()).data;});
  await main(page).getByRole('combobox',{name:'Module',exact:true}).click();await page.getByRole('option',{name:'Products',exact:true}).click();const result=await loaded;
  await info.attach('audit-products-filter',{body:JSON.stringify(result),contentType:'application/json'});
  if(result.data.some((r:any)=>r.module!=='Products'))await bug(page,info,'P2-AUD-001','Selecting Products returns audit entries belonging to other modules.');
  expect(result.data.length,'Known product export activity must remain visible under the Products filter').toBeGreaterThan(0);expect(result.data.length).toBeLessThanOrEqual(Number(result.total));await proof(page,info,'audit-module-filter');
  await main(page).getByRole('combobox',{name:'Module',exact:true}).click();await page.getByRole('option',{name:'All Modules',exact:true}).click();await expect(main(page).getByRole('cell',{name:current[0].details,exact:true}).first()).toBeVisible();return;
 }
 if(mode==='search'){
  const actor=current[0].user;const query=async()=>{const loaded=page.waitForResponse(r=>{const u=new URL(r.url());return r.request().method()==='GET'&&u.pathname===endpoint&&u.searchParams.get('search')===actor;}).then(async r=>{expect(r.ok()).toBe(true);return (await r.json()).data;});await main(page).getByPlaceholder('Search by user, action, or details...', {exact:true}).fill(actor);return loaded;};let result=await query();
  if(!result.data.length){const again=await logs(page);expect(again.some((r:any)=>r.user===actor)).toBe(true);result=await query();}
  await info.attach('audit-actor-search',{body:JSON.stringify({actor,knownEntry:current.find((r:any)=>r.user===actor),result}),contentType:'application/json'});if(!result.data.length)await bug(page,info,'P2-AUD-004','Searching the exact displayed actor '+actor+' returns zero audit entries on two fresh attempts, although fresh unfiltered activity contains that actor.');expect(result.data.every((r:any)=>JSON.stringify(r).toLowerCase().includes(actor.toLowerCase()))).toBe(true);await proof(page,info,'audit-search');const absent='QA-NO-SUCH-ACTOR-'+Date.now(),none=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===endpoint&&new URL(r.url()).searchParams.get('search')===absent).then(async r=>{expect(r.ok()).toBe(true);return (await r.json()).data;});await main(page).getByPlaceholder('Search by user, action, or details...', {exact:true}).fill(absent);const negative=await none;expect(negative.data,'A nonexistent actor/control term returns no rows').toEqual([]);expect(Number(negative.total)).toBe(0);await info.attach('audit-search-negative-control',{body:JSON.stringify({query:absent,result:negative}),contentType:'application/json'});return;
 }
 if(mode==='date'){
  await main(page).getByRole('combobox',{name:'Date Range',exact:true}).click();await page.getByRole('option',{name:'Custom Range',exact:true}).click();const inputs=main(page).locator('input[type="date"]');await expect(inputs).toHaveCount(2);
  const range=async(from:string,to:string)=>{const next=page.waitForResponse(r=>{const u=new URL(r.url()),values=[...u.searchParams.values()];return r.request().method()==='GET'&&u.pathname===endpoint&&values.includes(from)&&values.includes(to);}).then(async r=>{expect(r.ok()).toBe(true);return {query:Object.fromEntries(new URL(r.url()).searchParams),data:(await r.json()).data};});await inputs.nth(1).fill(to);await inputs.nth(0).fill(from);return next;};
  const from=datePlus(-1),to=datePlus(0),positive=await range(from,to);expect(positive.data.data.length).toBeGreaterThan(0);for(const entry of positive.data.data)expect(entry.timestamp.slice(0,10)>=from&&entry.timestamp.slice(0,10)<=to).toBe(true);
  const negative=await range(datePlus(1),datePlus(2));expect(negative.data.data).toEqual([]);expect(Number(negative.data.total)).toBe(0);await info.attach('audit-custom-range-reconciliation',{body:JSON.stringify({positive,negative}),contentType:'application/json'});await proof(page,info,'audit-custom-range-filtered');return;
 }
 await main(page).getByRole('combobox',{name:'Module',exact:true}).click();const modules=await page.getByRole('option').allTextContents();await page.keyboard.press('Escape');await main(page).getByRole('combobox',{name:'User',exact:true}).click();const users=await page.getByRole('option').allTextContents();await page.keyboard.press('Escape');await expect(main(page).getByRole('combobox',{name:'Action',exact:true})).toBeVisible();await info.attach('audit-filter-controls',{body:JSON.stringify({users,modules,recordedModules:[...new Set(current.map((r:any)=>r.module))],screen:await main(page).ariaSnapshot()}),contentType:'application/json'});
 if(users.length===1&&!await main(page).getByRole('combobox',{name:/action/i}).count())await bug(page,info,'P2-AUD-001','Audit user selector contains All Users only despite named actors in the log; no Action Type control is available, and Filters opens no additional filter UI.');
 const actor=current[0].user;await main(page).getByRole('combobox',{name:'User',exact:true}).click();let next=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===endpoint).then(async r=>{expect(r.ok()).toBe(true);return (await r.json()).data;});await page.getByRole('option',{name:actor,exact:true}).click();let selected=await next;expect(selected.data.length).toBeGreaterThan(0);expect(selected.data.every((r:any)=>r.user===actor)).toBe(true);
 await main(page).getByRole('combobox',{name:'Action',exact:true}).click();next=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===endpoint).then(async r=>{expect(r.ok()).toBe(true);return (await r.json()).data;});await page.getByRole('option',{name:'Created',exact:true}).click();selected=await next;expect(selected.data.length).toBeGreaterThan(0);expect(selected.data.every((r:any)=>r.user===actor&&r.action.toLowerCase()==='created')).toBe(true);await proof(page,info,'audit-user-action-filter');
}
export async function auditScenario(page:Page,info:TestInfo,mode:string){
 info.setTimeout(mode==='full'?600_000:300_000);if(['search','filters','date','module'].includes(mode))return filter(page,info,mode);if(mode!=='full')return stream(page,info,mode);
 const outcomes=[];for(const m of ['create','update','delete','export','module','search','filters','date']){try{await test.step(m,()=>['module','search','filters','date'].includes(m)?filter(page,info,m):stream(page,info,m));outcomes.push({step:m,status:'pass'});}catch(e){outcomes.push({step:m,status:'fail',error:String(e)});}}await info.attach('full-flow-outcomes',{body:JSON.stringify(outcomes),contentType:'application/json'});expect(outcomes.filter(o=>o.status==='fail')).toEqual([]);
}
