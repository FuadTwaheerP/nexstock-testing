import { test as cleanup,expect } from 'playwright/test';
import { readFileSync,writeFileSync,existsSync } from 'node:fs';
import { journalPath,guard,logout } from './phase2';
cleanup('audit Phase 2 write scope and log out QA session',async({page,context},info)=>{
  if(process.env.PHASE2_MODULE==='stock-transfers')info.setTimeout(480_000);
  await guard(context,info);
  const setup=JSON.parse(readFileSync(journalPath,'utf8'));
  if(setup.setupComplete===false){await info.attach('setup-not-complete',{body:'No module cases ran because setup failed. Do not reuse stale auth or attempt business recovery without a successfully selected QA company. Retain private recovery ledgers for the next authenticated run.',contentType:'text/plain'});expect(setup.events.filter((e:any)=>e.category==='unexpected-write')).toEqual([]);return;}
  try{
    if(process.env.PHASE2_MODULE==='pos-extensions'){const {recoverHeld}=await import('../pos-extensions/support/hold');await recoverHeld(page);}
    if(process.env.PHASE2_MODULE==='notifications'){const {restoreNotificationScope}=await import('../notifications/support/notifications');await restoreNotificationScope(page);}
    if(process.env.PHASE2_MODULE==='reports'){const {restoreValuationStock}=await import('../reports/support/valuation-stock');await restoreValuationStock(page);}
    if(process.env.PHASE2_MODULE==='document-templates'){const {restoreTemplate}=await import('../document-templates/support/templates');const {restoreInvoiceText}=await import('../document-templates/support/release');try{await restoreTemplate(page);}finally{await restoreInvoiceText(page);}}
    if(['credit-notes','purchase-orders','goods-receipts','bills-payable','supplier-history','reports','notifications'].includes(process.env.PHASE2_MODULE||'')){const {restoreInventory}=await import('./inventory');await restoreInventory(page);}
    if(process.env.PHASE2_MODULE==='cash-register'){const {recoverShift}=await import('../cash-register/support/register');await recoverShift(page);}
    if(process.env.PHASE2_MODULE==='stock-transfers'){const {recoverTransferStock}=await import('../stock-transfers/support/transfers');await recoverTransferStock(page);}
    if(process.env.PHASE2_MODULE==='stock-counts'){
      const j=JSON.parse(readFileSync(journalPath,'utf8'));
      const {compensate,abandon}=await import('../stock-counts/support/counts');
      const first=new Map();for(const e of j.events.filter((e:any)=>e.category==='stock-baseline'&&e.kind==='count-stock'))if(!first.has(e.fixture.branch+'|'+e.fixture.sku))first.set(e.fixture.branch+'|'+e.fixture.sku,e.fixture);
      for(const f of first.values())await compensate(page,f as any);
      for(const e of j.events.filter((e:any)=>e.category==='owned-fixture'&&e.kind==='stock-count'&&e.id))await abandon(page,e.id,e.reference);
      await abandon(page,'1','SC-SFCOQS');
    }
    if(process.env.PHASE2_MODULE==='stores-lifecycle'){
      const j=JSON.parse(readFileSync(journalPath,'utf8'));
      const {recoverBranches}=await import('../stores-lifecycle/support/branches');
      await recoverBranches(page,j.events.filter((e:any)=>e.category==='owned-fixture'&&e.kind==='branch'));
      const path='test-results/phase2-branches-recovery.json';
      if(existsSync(path)){const data=JSON.parse(readFileSync(path,'utf8'));await recoverBranches(page,data.branches);data.branches=[];writeFileSync(path,JSON.stringify(data,null,2));}
    }
    const recoveryPath='test-results/phase2-products-recovery.json';
    if(process.env.PHASE2_MODULE==='products-bulk'&&existsSync(recoveryPath)){
      const recovery=JSON.parse(readFileSync(recoveryPath,'utf8'));
      const {archiveOwned}=await import('../products-bulk/support/catalog');
      for(const sku of [...recovery.skus]){await archiveOwned(page,sku);recovery.skus=recovery.skus.filter((s:string)=>s!==sku);writeFileSync(recoveryPath,JSON.stringify(recovery,null,2));}
      await info.attach('fixture-recovery',{body:'Earlier owned CSV test products were safely archived; recovery queue is empty.',contentType:'text/plain'});
    }
    const j=JSON.parse(readFileSync(journalPath,'utf8'));await info.attach('safe-write-journal',{body:JSON.stringify(j,null,2),contentType:'application/json'});expect(j.events.filter((e:any)=>e.category==='unexpected-write'),'Unexpected writes require an automation fix, not a product bug').toEqual([]);
  }
  finally{await logout(page);}
});
