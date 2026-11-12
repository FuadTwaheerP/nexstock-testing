import { chromium } from 'playwright';
import { loadEnvFile } from 'node:process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
loadEnvFile('.env');
const label=process.argv[2]||'Dashboard';
const browser=await chromium.launch();
try{
 const state='test-results/phase2-discovery-auth.json';
 const context=await browser.newContext({viewport:{width:1920,height:1080},...(existsSync(state)?{storageState:state}:{})});
 let signing=true;
 const blockedWrites=[];
 await context.addInitScript(()=>{window.print=()=>{};});
 await context.route('**/*',async route=>{const r=route.request(),u=new URL(r.url());if(['GET','HEAD','OPTIONS'].includes(r.method()))return route.continue();if(r.method()==='POST'&&(/\/auth\/refresh$/.test(u.pathname)||signing&&/\/auth\/(?:login|select-business)$/.test(u.pathname)))return route.continue();if(u.origin===new URL(process.env.BASE_URL).origin)blockedWrites.push({method:r.method(),path:u.pathname});return route.abort('blockedbyclient');});
 const company=process.env.PRODUCT_TEST_COMPANY||'Nexstock QA Company';
 const page=await context.newPage();await page.goto(process.env.BASE_URL.replace(/\/$/,'')+'/');
 const login=page.getByLabel('Email Address',{exact:true});
 const selected=page.getByRole('banner').getByRole('button',{name:company,exact:true});
 await selected.or(login).or(page.getByRole('heading',{name:'Choose a business',exact:true})).first().waitFor({timeout:30_000});
 if(await login.isVisible()) {await login.fill(process.env.PRODUCT_TEST_EMAIL);await page.getByLabel('Password',{exact:true}).fill(process.env.PRODUCT_TEST_PASSWORD);await page.getByRole('button',{name:'Sign In',exact:true}).click();}
 const chooser=page.getByRole('heading',{name:'Choose a business',exact:true});
 await page.getByRole('banner').getByRole('button',{name:company,exact:true}).or(chooser).first().waitFor({timeout:30_000});
 if(await chooser.isVisible())await page.getByRole('button').filter({has:page.getByRole('heading',{name:company,exact:true})}).click();
 await page.getByRole('banner').getByRole('button',{name:company,exact:true}).waitFor(); signing=false;
 const navigation=await page.getByRole('navigation').ariaSnapshot();
 const reads=[];
 page.on('response',async response=>{const u=new URL(response.url());if(response.request().method()==='GET'&&u.pathname.includes('/api/')){let keys=[],dataKeys=[],trends;try{const j=await response.json();keys=Object.keys(j||{});dataKeys=Object.keys(j?.data||{});if(u.pathname.endsWith('/reporting/dashboard/stats'))trends={revenue:j.data.revenue_trend,stock:j.data.stock_value_trend};}catch{}reads.push({path:u.pathname+u.search,status:response.status(),keys,dataKeys,trends});}});
 const button=page.getByRole('navigation').getByRole('button',label==='Notifications'?{name:/^Notifications\b/}:{name:label,exact:true});await button.click();
 await page.getByRole('main').waitFor();
 await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{});
 await page.getByRole('main').evaluate(el=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));
 const out=resolve('blob-report/archive/phase2-2026-10-25/discovery');mkdirSync(out,{recursive:true});
 const slug=label.toLowerCase().replace(/[^a-z0-9]+/g,'-');
 let details;
 const assetHints=[];
 for(const action of process.argv.slice(3)){
  if(action.startsWith('assets:invite')){
   for(const src of await page.locator('script[src]').evaluateAll(es=>es.map(e=>e.src))){const u=new URL(src);if(u.origin!==new URL(page.url()).origin||!u.pathname.endsWith('.js'))continue;const response=await context.request.get(src);const source=await response.text();const pattern=action.endsWith('contract')?/.{0,100}(?:path:[^,]{0,100}(?:invite|join)|membershipRoleSchema=|acceptInvitation|accept-invitation|invitationToken).{0,240}/gi:/.{0,130}(?:invitation|accept-invite|join-business|join-company).{0,130}/gi;assetHints.push({asset:u.pathname,snippets:(source.match(pattern)||[]).slice(0,30)});}
  }
  else if(action.startsWith('combo:'))await page.getByRole('combobox').nth(Number(action.slice(6))).click();
  else if(action.startsWith('option:'))await page.getByRole('option',{name:action.slice(7),exact:true}).click();
  else if(action.startsWith('textbox:')){const [name,value]=action.slice(8).split('=');await page.getByRole('textbox',{name,exact:true}).fill(value);}
  else if(action==='settle'){await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{});}
  else if(action.startsWith('spin:')){const [name,value]=action.slice(5).split('=');await page.getByRole('spinbutton',{name,exact:true}).fill(value);}
  else if(action.startsWith('view-ref:'))await page.getByRole('main').getByRole('row').filter({has:page.getByRole('cell',{name:action.slice(9),exact:true})}).locator('button:has(svg.lucide-eye)').click();
  else if(action.startsWith('sku:'))await page.getByRole('main').getByRole('button').filter({has:page.getByText(action.slice(4),{exact:true})}).click();
  else if(action.startsWith('ready:'))await page.getByPlaceholder(action.slice(6),{exact:true}).waitFor();
  else if(action.startsWith('heading:'))await page.getByRole('heading',{name:action.slice(8),exact:true}).first().click();
  else if(action.startsWith('tab:'))await page.getByRole('tab',{name:action.slice(4),exact:true}).click();
  else if(action.startsWith('radio:'))await page.getByRole('radio',{name:action.slice(6),exact:true}).check();
  else await page.getByRole('button',{name:action,exact:true}).first().click();
  details=await page.locator('body').ariaSnapshot();
 }
 const suffix=details?'-'+process.argv.slice(3).join('-').toLowerCase().replace(/[^a-z0-9]+/g,'-'):'';
 const buttons=await page.getByRole('main').getByRole('button').evaluateAll(elements=>elements.map(el=>({text:el.textContent,title:el.getAttribute('title'),aria:el.getAttribute('aria-label'),svg:el.querySelector('svg')?.getAttribute('class')})));
 writeFileSync(out+'/'+slug+suffix+'.txt',JSON.stringify({url:page.url(),navigation,reads,blockedWrites,assetHints,buttons,snapshot:await page.getByRole('main',{includeHidden:true}).ariaSnapshot(),details},null,2));
 await page.screenshot({path:out+'/'+slug+'.png',fullPage:true});
 console.log(out+'/'+slug+suffix+'.txt');
 await context.storageState({path:'test-results/phase2-discovery-auth.json'});
}finally{await browser.close();}
