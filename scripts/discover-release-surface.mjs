import {chromium} from 'playwright';
import {loadEnvFile} from 'node:process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
loadEnvFile('.env');
const path=process.argv[2];if(!path?.startsWith('/')||path.startsWith('//'))throw new Error('Supply an observed app-relative route.');
const base=new URL(process.env.BASE_URL),root=resolve(process.env.RETEST_DISCOVERY_ROOT||'blob-report/archive/release-verification-2026-10-30/discovery');mkdirSync(root,{recursive:true});
const browser=await chromium.launch();
try{
 const context=await browser.newContext({storageState:'test-results/phase2-auth.json',viewport:{width:1920,height:1080},serviceWorkers:'block'});
 const blocked=[];await context.route('**/*',r=>{const q=r.request(),u=new URL(q.url());if(['GET','HEAD','OPTIONS'].includes(q.method())||q.method()==='POST'&&u.origin===base.origin&&u.pathname==='/app/api/v1/auth/refresh')return r.continue();blocked.push({method:q.method(),path:u.pathname});return r.abort('blockedbyclient');});
 const page=await context.newPage(),reads=[],pending=[],structures=[];
 page.on('response',r=>{const u=new URL(r.url());if(r.request().method()!=='GET'||!u.pathname.startsWith('/app/api/'))return;pending.push((async()=>{try{const body=await r.json(),data=body?.data||body;reads.push({path:u.pathname+u.search,status:r.status(),keys:Object.keys(data||{}),sample:u.pathname.endsWith('/reporting/reports')?{columns:data.columns,rows:data.rows?.slice(0,4),totals:data.totals}:u.pathname.endsWith('/reporting/dashboard/stats')?data:undefined});}catch{}})());});
 await page.goto(base.href.replace(/\/$/,'')+path,{waitUntil:'domcontentloaded'});
 await page.getByRole('banner').getByRole('button',{name:process.env.PRODUCT_TEST_COMPANY||'Nexstock QA Company',exact:true}).waitFor({timeout:30_000});
 if(/^\/suppliers\/\d+$/.test(path))await page.getByRole('main').getByRole('heading',{level:1}).waitFor({timeout:30_000});
 for(const action of process.argv.slice(3)){
  const [type,...parts]=action.split(':');const name=parts.join(':');
  if(type==='tab')await page.getByRole('tab',{name,exact:true}).click();
  else if(type==='report-tab'){const [label,report]=name.split('|');const next=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/reporting/reports'&&new URL(r.url()).searchParams.get('type')===report);await page.getByRole('tab',{name:label,exact:true}).click();await (await next).json();}
  else if(type==='button')await page.getByRole('button',{name,exact:true}).click();
  else if(type==='button-first')await page.getByRole('button',{name,exact:true}).first().click();
  else if(type==='field'){const [label,value]=name.split('|');await page.getByLabel(label,{exact:true}).fill(value);}
  else if(type==='combo')await page.getByRole('combobox').nth(Number(name)).click();
  else if(type==='option')await page.getByRole('option',{name,exact:true}).click();
  else if(type==='wait')await page.getByText(name,{exact:true}).first().waitFor({timeout:30_000});
  else if(type==='bill-pay')await page.getByRole('main').getByRole('row').filter({has:page.getByRole('cell',{name,exact:true})}).getByRole('button',{name:/pay/i}).click();
  else if(type==='dom')structures.push(await page.getByRole('button',{name,exact:true}).first().evaluate(el=>[el.parentElement?.outerHTML,el.parentElement?.parentElement?.outerHTML]));
  else if(type==='product'){await page.getByRole('button',{name:'Add Row',exact:true}).click();await page.getByRole('combobox').filter({hasText:'Choose product...'}).last().click();await page.getByRole('option').filter({hasText:name}).click();}
  else throw new Error('Unsupported discovery action');
 }
 await page.waitForLoadState('networkidle',{timeout:15_000}).catch(()=>{});await Promise.all(pending);
 const slug=(path+'-'+process.argv.slice(3).join('-')).replace(/[^\w-]/g,'-').slice(0,160);
 const controls=await page.getByRole('main').locator('input,textarea,select').evaluateAll(es=>es.map(e=>({tag:e.tagName,type:e.getAttribute('type'),id:e.id,name:e.getAttribute('name'),placeholder:e.getAttribute('placeholder'),value:e.value})));
 const result={path,url:page.url(),reads,structures,controls,blockedWrites:blocked,snapshot:await page.locator('body').ariaSnapshot()};
 writeFileSync(root+'/'+slug+'.json',JSON.stringify(result,null,2));await page.screenshot({path:root+'/'+slug+'.png',fullPage:true});console.log(JSON.stringify({...result,snapshot:result.snapshot.slice(0,14_000)}));
}finally{await browser.close();}
