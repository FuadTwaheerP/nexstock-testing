import {chromium} from 'playwright';
import {loadEnvFile} from 'node:process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
loadEnvFile('.env');
const fixture=JSON.parse(readFileSync('test-results/invoicing-fixture.json','utf8'));
const ref=process.argv[2]||fixture.references[0];
if(!fixture.references.includes(ref)||fixture.company!=='Nexstock QA Company')throw new Error('Only a current-run QA invoice may be inspected');
const browser=await chromium.launch();
try{
 const context=await browser.newContext({storageState:'test-results/invoicing-auth.json',viewport:{width:1920,height:1080},serviceWorkers:'block'});
 const blocked=[];await context.route('**/*',r=>{
  const q=r.request(),u=new URL(q.url());
  if(['GET','HEAD','OPTIONS'].includes(q.method())||q.method()==='POST'&&u.origin===new URL(process.env.BASE_URL).origin&&u.pathname==='/app/api/v1/auth/refresh')return r.continue();
  blocked.push({method:q.method(),path:u.pathname});return r.abort('blockedbyclient');
 });
 const page=await context.newPage(),reads=[],pending=[];
 page.on('response',r=>{const u=new URL(r.url());if(r.request().method()!=='GET'||!u.pathname.startsWith('/app/api/')||!u.pathname.includes('invoice'))return;
  pending.push((async()=>{const body=await r.json();reads.push({path:u.pathname,status:r.status(),body});})());
 });
 await page.goto(new URL('invoicing/'+ref,process.env.BASE_URL.replace(/\/?$/,'/')).href,{waitUntil:'domcontentloaded'});
 await page.getByRole('banner').getByRole('button',{name:fixture.company,exact:true}).waitFor();
 await page.getByRole('main').getByText(fixture.customer,{exact:true}).first().waitFor();
 await Promise.all(pending);const screen=await page.getByRole('main').ariaSnapshot();
 const out=resolve('blob-report/archive/phase1-round2-2026-10-26');mkdirSync(out,{recursive:true});
 writeFileSync(out+'/invoice-'+ref+'-diagnostic.json',JSON.stringify({ref,reads,screen,blockedWrites:blocked},null,2));
 console.log(JSON.stringify({ref,reads:reads.map(r=>({path:r.path,status:r.status,keys:Object.keys(r.body?.data||r.body),data:r.body?.data})),screen,blockedWrites:blocked}));
}finally{await browser.close();}
