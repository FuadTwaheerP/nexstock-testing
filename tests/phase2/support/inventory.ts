import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {type Page} from 'playwright/test';
import {expect,main,writeScope,record} from './phase2';
import {branches} from '../stores-lifecycle/support/branches';
import {adjust,numeric} from '../../phase1/stock-adjustments/support/adjustments';
const file='test-results/phase2-inventory-recovery.json';
export const qaProduct={sku:'QA-ADD-mv9rtxw1-3b087e',name:'QA add mv9rtxw1-3b087e'};
export async function matrix(page:Page){
 const bs=await branches(page),table=main(page).getByRole('table'),headers=(await table.getByRole('columnheader').allTextContents()).map(s=>s.trim());
 const row=table.getByRole('row').filter({has:page.getByRole('cell',{name:qaProduct.sku,exact:true})});await expect(row).toHaveCount(1);const cells=await row.getByRole('cell').allTextContents();
 return bs.filter((b:any)=>headers.includes(b.name)).map((b:any)=>({id:String(b.id),branch:b.name,quantity:numeric(cells[headers.indexOf(b.name)])}));
}
export async function captureInventory(page:Page){
 await restoreInventory(page);const balances=await matrix(page);expect(balances.length).toBeGreaterThan(1);expect(balances.every((b:any)=>b.branch.startsWith('QA ')&&Number.isFinite(b.quantity))).toBe(true);const state={module:process.env.PHASE2_MODULE,...qaProduct,balances,restored:false};writeFileSync(file,JSON.stringify(state,null,2));record({category:'stock-baseline',kind:'module-stock',...state});return state;
}
export async function changeInventory(page:Page,id:string,branch:string,delta:number){
 expect(Number.isFinite(delta),'Never submit an invalid stock adjustment').toBe(true);expect(branch).toMatch(/^QA /);
 const f={...qaProduct,branch,otherBranch:branch,initial:0,otherInitial:0,cost:40,selling:100,totalValue:0};
 await writeScope(page,'adjust only disposable QA stock '+qaProduct.sku,[new RegExp('^/app/api/v1/inventory/branches/'+id+'/adjustments$')],()=>adjust(page,f,delta,'QA P2 '+process.env.PHASE2_MODULE+' '+Date.now()));
}
export async function restoreInventory(page:Page){
 if(!existsSync(file))return;const state=JSON.parse(readFileSync(file,'utf8'));if(state.restored)return;expect(state.module,'Resolve previous module stock recovery before new financial writes').toBe(process.env.PHASE2_MODULE);expect(state.sku).toBe(qaProduct.sku);expect(state.balances.every((b:any)=>Number.isFinite(b.quantity)),'Only finite captured quantities may be restored').toBe(true);
 const current=await matrix(page);for(const b of state.balances){const now=current.find((x:any)=>x.id===b.id);expect(now).toBeTruthy();if(now.quantity!==b.quantity)await changeInventory(page,b.id,b.branch,b.quantity-now.quantity);}
 const after=await matrix(page);for(const b of state.balances)expect(after.find((x:any)=>x.id===b.id).quantity).toBe(b.quantity);state.restored=true;writeFileSync(file,JSON.stringify(state,null,2));
}
