import {test as cleanup,expect} from 'playwright/test';
import {readFileSync} from 'node:fs';
import {journalPath,guard,logout} from './phase3';
cleanup('audit Phase 3 scope and end only the QA session',async({page,context},info)=>{
 info.setTimeout(300_000);await guard(context,info);const journal=JSON.parse(readFileSync(journalPath,'utf8'));
 if(['products','adjustments','shelf-life','pos','order-queue','integrations','suppliers','document-design'].includes(process.env.PHASE3_MODULE||'')){const {recoverCatalog}=await import('./catalog');await recoverCatalog(page);}
 if(process.env.PHASE3_MODULE==='document-design'){const {restoreTemplate}=await import('./template');await restoreTemplate(page);}
 if(process.env.PHASE3_MODULE==='transfers'){const {recoverTransferStock}=await import('../transfers/support/transfers');await recoverTransferStock(page);}
 if(['credit-notes','reports','shelf-life'].includes(process.env.PHASE3_MODULE||'')){const {restoreInventory}=await import('./inventory');await restoreInventory(page);}
 await info.attach('phase3-safe-journal',{body:JSON.stringify(journal),contentType:'application/json'});
 expect(journal.events.filter((e:any)=>e.category==='unexpected-write'),'Blocked unintended writes are automation/scope issues, not application bugs').toEqual([]);
 if(journal.setupComplete)await logout(page);
});
