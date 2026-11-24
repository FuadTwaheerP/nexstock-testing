import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {type Page,type TestInfo} from 'playwright/test';
import {expect,route,main,writeScope,record} from './phase3';
import {readRoute,observeAction,reread,hasRead,observedCall} from './observed';
import {openAdjustments} from '../../phase1/stock-adjustments/support/adjustments';
const file='test-results/phase3-catalog-recovery.json';
const entries=()=>existsSync(file)?JSON.parse(readFileSync(file,'utf8')):[];
export function remember(value:any){const rows=entries(),i=rows.findIndex((r:any)=>r.id===value.id);if(i>=0)rows[i]={...rows[i],...value};else rows.push(value);writeFileSync(file,JSON.stringify(rows,null,2));}
export async function createProduct(page:Page,info:TestInfo,label:string,price=100,options:{processing?:boolean;expiry?:boolean;service?:boolean;customFields?:string[]}={}){
 const token=Date.now().toString(36),name='QA P3 '+label+' '+token,sku='QA-P3-'+label.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10)+'-'+token;
 await route(page,'/products');await main(page).getByRole('button',{name:'New Product',exact:true}).click();const form=page.getByRole('dialog',{name:'Add New Product',exact:true});
 await form.getByLabel('Product Name *',{exact:true}).fill(name);await form.getByLabel('SKU *',{exact:true}).fill(sku);
 for(const [field,option]of [[/^Category/,'QA Automation'],[/^Unit of Measurement/,'Piece']]){await form.getByLabel(field as RegExp).click();await page.getByRole('option').filter({hasText:option as string}).first().click();}
 if(options.expiry)await form.getByRole('checkbox',{name:'This product has an expiry date',exact:true}).check();
 if(options.processing){await form.getByRole('combobox',{name:'Product type',exact:true}).click();await page.getByRole('option',{name:/^Processing/}).click();}
 if(options.service){await form.getByRole('combobox',{name:'Product type',exact:true}).click();await page.getByRole('option',{name:/^Service/}).click();}
 await form.getByLabel('Cost Price',{exact:true}).fill('3');await form.getByLabel('Selling Price',{exact:true}).fill(String(price));if(!options.service){await form.getByLabel('Min Threshold',{exact:true}).fill('0');await form.getByLabel('Initial Stock Level',{exact:true}).fill('0');}await form.getByRole('combobox',{name:'VAT',exact:true}).click();await page.getByRole('option',{name:'Exempt',exact:true}).click();
 if(options.customFields){await form.getByRole('tab',{name:'Custom Fields',exact:true}).click();for(const name of options.customFields){await form.getByLabel('Field Name',{exact:true}).fill(name);await form.getByRole('checkbox',{name:'Supports custom fonts',exact:true}).check();await form.getByRole('button',{name:'Add Field',exact:true}).click();}await info.attach('submitted-font-field-definitions',{body:await form.ariaSnapshot(),contentType:'text/plain'});}
 let product:any;await writeScope(page,'create uniquely owned Phase 3 product',[/^\/app\/api\/v1\/products$/],async()=>{const saved=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/app/api/v1/products').then(async r=>({ok:r.ok(),body:await r.json(),request:r.request().postDataJSON()}));await form.getByRole('button',{name:'Add Product',exact:true}).click();const r=await saved;expect(r.ok).toBe(true);product=r.body.data;remember({...product,name,sku,module:process.env.PHASE3_MODULE,archived:false,restoreStock:0});record({category:'owned-fixture',kind:'product',id:product.id,name,sku});await info.attach('native-product-create-'+label,{body:JSON.stringify(r),contentType:'application/json'});});
 await info.attach('owned-product-'+label,{body:JSON.stringify(product),contentType:'application/json'});return product;
}
export async function product(page:Page,id:string){return readRoute(page,'/products/'+id,'/app/api/v1/products/'+id);}
export async function productData(page:Page,id:string){const endpoint='/app/api/v1/products/'+id;return hasRead(page,endpoint)?reread(page,endpoint):product(page,id);}
export const balance=(data:any,branchId:string)=>Number((data.branch_stocks||[]).find((b:any)=>String(b.branch_id)===String(branchId))?.physical_quantity||0);
export async function setStock(page:Page,p:any,branch:any,target:number){
 expect(p.sku).toMatch(/^QA-P3-/);expect(branch.name).toMatch(/^QA /);const current=balance(await productData(page,String(p.id)),String(branch.id));if(current===target)return;remember({id:p.id,branch,restoreStock:0});expect(entries().some((e:any)=>e.id===p.id&&e.sku===p.sku&&e.module===process.env.PHASE3_MODULE)).toBe(true);const endpoint='/app/api/v1/inventory/branches/'+branch.id+'/adjustments';if(!hasRead(page,endpoint))await observeAction(page,endpoint,()=>openAdjustments(page,branch.name));const body={branch_id:Number(branch.id),reason:'QA P3 owned fixture '+Date.now(),notes:'API fixture setup/recovery only',items:[{product_id:Number(p.id),variant_id:null,quantity_adjusted:target-current,unit_cost:3}]};const r=await observedCall(page,endpoint,'POST',body);record({category:'owned-fixture-api-stock',productId:p.id,branchId:branch.id,delta:target-current,status:r.status()});expect(r.ok()).toBe(true);expect(balance(await productData(page,String(p.id)),String(branch.id))).toBe(target);
}
export async function bundle(page:Page,p:any,branch:any){
 await product(page,String(p.id));const read=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/products/'+p.id+'/bundle'&&new URL(r.url()).searchParams.get('branch_id')===String(branch.id),{timeout:60_000}).then(async r=>({ok:r.ok(),body:await r.json()}));await main(page).getByRole('tab',{name:'Bundle',exact:true}).click();
 const selector=page.getByRole('tabpanel',{name:'Bundle',exact:true}).getByRole('combobox').first();await expect(selector).toBeVisible();if(!(await selector.innerText()).includes(branch.name)){await selector.click();await page.getByRole('option',{name:branch.name,exact:true}).click();}
 const r=await read;expect(r.ok).toBe(true);return r.body.data;
}
export async function saveRecipe(page:Page,p:any,components:any[]){
 const panel=page.getByRole('tabpanel',{name:'Bundle',exact:true});for(let i=0;i<components.length;i++){
  if(await panel.getByRole('spinbutton').count()<=i)await panel.getByRole('button',{name:'Add component',exact:true}).click();await panel.getByRole('combobox').nth(i+1).click();await page.getByRole('option').filter({hasText:components[i].sku}).click();await panel.getByRole('spinbutton').nth(i).fill(String(components[i].quantity));
 }
 let result:any;await writeScope(page,'save only owned QA bundle '+p.id,[new RegExp('^/app/api/v1/products/'+p.id+'/bundle$')],async()=>{
  const next=page.waitForResponse(r=>r.request().method()==='PUT'&&new URL(r.url()).pathname==='/app/api/v1/products/'+p.id+'/bundle',{timeout:15_000}).then(async r=>({ok:r.ok(),status:r.status(),body:await r.json(),request:r.request().postDataJSON()}));
  const invalid=components.some(c=>!Number.isInteger(Number(c.quantity))||Number(c.quantity)<1);
  const inline=invalid?panel.getByText('Enter a whole number of at least 1.',{exact:true}).first().waitFor({timeout:15_000}).then(()=>({ok:false,status:0,blockedBy:'inline validation',request:null})):null;
  // A corrected form deliberately makes no request. Observe its inline error
  // rather than timing out waiting for the old erroneous PUT.
  void next.catch(()=>{});if(inline)void inline.catch(()=>{});
  await panel.getByRole('button',{name:'Save recipe',exact:true}).click();result=inline?await Promise.race([next,inline]):await next;
 });return result;
}
export async function archiveOwned(page:Page,p:any){
 expect(entries().some((r:any)=>String(r.id)===String(p.id)&&r.sku===p.sku)).toBe(true);await route(page,'/products');await observeAction(page,'/app/api/v1/products',()=>main(page).getByPlaceholder('Search...',{exact:true}).fill(p.sku),u=>u.searchParams.get('search')===p.sku);const row=main(page).getByRole('row').filter({has:page.getByRole('cell',{name:p.sku,exact:true})});await expect(row).toBeVisible();await row.getByRole('button',{name:'Actions',exact:true}).click();await writeScope(page,'archive only this ledger-owned product '+p.id,[new RegExp('^/app/api/v1/products/'+p.id+'$')],async()=>{const next=page.waitForResponse(r=>r.request().method()==='PUT'&&new URL(r.url()).pathname==='/app/api/v1/products/'+p.id);await page.getByRole('menuitem',{name:'Archive',exact:true}).click();const response=await next;expect(response.ok(),'Owned product archive HTTP '+response.status()).toBe(true);expect((await response.json()).data.status).toBe('archived');});await route(page,'/products');const fresh=await observeAction(page,'/app/api/v1/products',()=>main(page).getByPlaceholder('Search...',{exact:true}).fill(p.sku),u=>u.searchParams.get('search')===p.sku);expect(fresh.data.filter((r:any)=>String(r.id)===String(p.id)&&r.status==='active')).toEqual([]);remember({id:p.id,archived:true});
}
export async function recoverCatalog(page:Page){
 for(const p of entries().filter((p:any)=>!p.archived&&p.module===process.env.PHASE3_MODULE&&p.bundleParent)){
  const saved=await bundle(page,p,p.branch);if(saved.is_bundle){const panel=page.getByRole('tabpanel',{name:'Bundle',exact:true});while(await panel.getByRole('button',{name:'Delete',exact:true}).count())await panel.getByRole('button',{name:'Delete',exact:true}).first().click();const r=await saveRecipe(page,p,[]);expect(r.ok).toBe(true);}
 }
 for(const p of entries().filter((p:any)=>!p.archived&&p.module===process.env.PHASE3_MODULE)){const current=await productData(page,p.id),nonzero=(current.branch_stocks||[]).filter((b:any)=>Number(b.physical_quantity)!==0);if(nonzero.length){const bs=hasRead(page,'/app/api/v1/branches')?await reread(page,'/app/api/v1/branches'):await readRoute(page,'/stores','/app/api/v1/branches');for(const b of nonzero){const branch=bs.find((x:any)=>String(x.id)===String(b.branch_id));expect(branch?.name).toMatch(/^QA /);await setStock(page,p,branch,0);}}expect((await productData(page,p.id)).branch_stocks.every((b:any)=>Number(b.physical_quantity)===0)).toBe(true);await archiveOwned(page,p);}
}
