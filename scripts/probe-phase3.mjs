import {chromium} from 'playwright';
import {loadEnvFile} from 'node:process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {appPath,validateProductTestTarget} from '../helpers/safety.mjs';
loadEnvFile('.env');validateProductTestTarget(process.env.BASE_URL);
const plan=JSON.parse(readFileSync('data/phase3-plan.json')),root='blob-report/archive/phase3-2026-11-17/discovery';mkdirSync(root,{recursive:true});
const definitions={products:['/products','New Product'],stores:['/stores'],adjustments:['/inventory/adjustments'],transfers:['/transfers'], 'stock-counts':['/stock-counts','Start a count'],'shelf-life':['/expiry','Record a batch'],pos:['/pos'],'order-queue':['/orders'],invoicing:['/create-invoice'],'credit-notes':['/create-credit-note'],'debit-notes':['/create-debit-note'],'purchase-orders':['/purchasing/orders/new'],'goods-receipts':['/purchasing/orders'],'bills-payable':['/purchasing/bills','New Bill'],suppliers:['/suppliers'],customers:['/customers','New Customer'],reports:['/reports'],'custom-reports':['/saved-reports','Build a report'],'document-design':['/business/document-builder'],roles:['/users-roles'],security:['/settings'],'audit-logs':['/audit-logs'],integrations:['/integrations'],hardware:['/settings'],settings:['/settings'],notifications:['/notifications'],help:['/help-center']};
const browser=await chromium.launch();let context,page;
try{
 context=await browser.newContext({viewport:{width:1920,height:1080},serviceWorkers:'block'});let auth=true;const assetCache=new Map(),blocked=[];
 await context.addInitScript(()=>{window.print=()=>{};});
 await context.route('**/*',async route=>{const r=route.request(),u=new URL(r.url()),own=u.origin===new URL(process.env.BASE_URL).origin;
  if(own&&r.method()==='GET'&&/^\/app\/assets\/[\w-]+-[\w-]{8,}\.(js|css)$/.test(u.pathname)){
   if(!assetCache.has(u.href))assetCache.set(u.href,(async()=>{const p=await route.fetch();return{status:p.status(),contentType:p.headers()['content-type'],body:await p.body()};})());const a=await assetCache.get(u.href);return route.fulfill({status:a.status,contentType:a.contentType,body:a.body});
  }
  if(['GET','HEAD','OPTIONS'].includes(r.method()))return route.continue();
  if(own&&r.method()==='POST'&&(/\/auth\/(?:refresh|logout)$/.test(u.pathname)||auth&&/\/auth\/(login|select-business)$/.test(u.pathname)))return route.continue();
  if(!own)return route.fulfill({status:204,body:''});blocked.push({path:u.pathname,method:r.method()});return route.abort('blockedbyclient');
 });
 page=await context.newPage();page.setDefaultTimeout(12_000);await page.goto(appPath('/login'),{waitUntil:'domcontentloaded'});await page.getByLabel('Email Address',{exact:true}).fill(process.env.PRODUCT_TEST_EMAIL);await page.getByLabel('Password',{exact:true}).fill(process.env.PRODUCT_TEST_PASSWORD);await page.getByRole('button',{name:'Sign In',exact:true}).click();
 const company=process.env.PRODUCT_TEST_COMPANY,chooser=page.getByRole('heading',{name:'Choose a business',exact:true}),selected=page.getByRole('banner').getByRole('button',{name:company,exact:true});await selected.or(chooser).first().waitFor({timeout:30_000});if(await chooser.isVisible())await page.getByRole('button').filter({has:page.getByRole('heading',{name:company,exact:true})}).click();await selected.waitFor();auth=false;await context.storageState({path:'test-results/phase3-probe-auth.json'});
 const navigation=await page.getByRole('navigation').ariaSnapshot();writeFileSync(root+'/navigation.txt',navigation);const chosen=process.argv.slice(2),modules=plan.modules.filter(m=>definitions[m.slug]&&(!chosen.length||chosen.includes(m.slug)));
 for(const module of modules){const [path,open]=definitions[module.slug],reads=[],surfaces=[];const pending=[];
  const observe=r=>{const u=new URL(r.url());if(r.request().method()!=='GET'||!u.pathname.includes('/api/'))return;pending.push((async()=>{let summary;try{const j=await r.json(),d=j.data;summary={keys:Object.keys(j),dataKeys:d&&typeof d==='object'?Object.keys(d).slice(0,45):[],itemCount:Array.isArray(d)?d.length:Array.isArray(d?.data)?d.data.length:undefined};}catch{}reads.push({path:u.pathname+u.search,status:r.status(),...summary});})());};page.on('response',observe);
  async function capture(label){await page.getByRole('main',{includeHidden:true}).waitFor();await page.getByRole('main',{includeHidden:true}).evaluate(el=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));surfaces.push({label,url:page.url(),snapshot:await page.locator('body').ariaSnapshot()});}
  try{
   await page.goto(appPath(path),{waitUntil:'domcontentloaded'});await selected.waitFor();await page.waitForLoadState('networkidle',{timeout:7000}).catch(()=>{});await capture('base');
   if(open&&await page.getByRole('button',{name:open,exact:true}).count()){await page.getByRole('button',{name:open,exact:true}).first().click();await capture('new-form');for(const tab of await page.getByRole('dialog').getByRole('tab').all()){await tab.click();await capture('new-form-tab-'+await tab.innerText());}const basic=page.getByRole('dialog').getByRole('tab',{name:'Basic Info',exact:true});if(await basic.count()){await basic.click();const type=page.getByRole('dialog').getByRole('combobox',{name:/Product type/i});if(await type.count()){await type.click();await capture('product-types');await page.keyboard.press('Escape');}}await page.getByRole('dialog').getByRole('button',{name:'Cancel',exact:true}).click();}
   const tabs=await page.getByRole('main').getByRole('tab').allTextContents();for(const name of tabs){const tab=page.getByRole('main').getByRole('tab',{name,exact:true});if(await tab.count()!==1)continue;await tab.click();await page.waitForLoadState('networkidle',{timeout:4000}).catch(()=>{});await capture('tab-'+name);}
   await page.screenshot({path:root+'/'+module.slug+'.png',fullPage:true});
  }catch(error){surfaces.push({label:'probe-error',message:String(error),url:page.url()});await page.keyboard.press('Escape').catch(()=>{});}
  let incomplete=false;await Promise.race([Promise.allSettled(pending),new Promise(done=>setTimeout(()=>{incomplete=true;done();},5000))]);if(incomplete)surfaces.push({label:'diagnostic-read-timeout',message:'Response-body collection exceeded its bounded diagnostic wait; no application failure inferred.'});page.off('response',observe);writeFileSync(root+'/'+module.slug+'.json',JSON.stringify({module,reads,surfaces,blocked:blocked.splice(0)},null,2));console.log('PROBED '+module.number+' '+module.slug+' '+surfaces.length+' surfaces');
 }
 await context.storageState({path:'test-results/phase3-probe-auth.json'});
}finally{if(page&&context){try{await page.goto(appPath('/'),{waitUntil:'domcontentloaded',timeout:15000});await page.getByRole('banner').getByRole('button',{name:'account',exact:true}).click({timeout:5000});await page.getByRole('menuitem',{name:'Log out',exact:true}).click({timeout:5000});}catch{}}await browser.close();}
