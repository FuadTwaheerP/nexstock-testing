import { test as base, expect, type Page, type BrowserContext, type TestInfo } from 'playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { appPath, validateProductTestTarget } from '../../../helpers/safety.mjs';
export { expect };
export const required=(key:string)=>{const v=process.env[key]?.trim();if(!v)throw new Error('Missing '+key);return v;};
export const company=()=>process.env.PRODUCT_TEST_COMPANY?.trim()||'Nexstock QA Company';
export const main=(page:Page)=>page.getByRole('main');
export const authPath='test-results/phase2-auth.json';
export const journalPath='test-results/phase2-journal.json';
const permissions=new WeakMap<BrowserContext,{label:string;paths:RegExp[]}>();
const operations=new WeakMap<BrowserContext,'login'|'logout'>();
const printCounters=new WeakMap<BrowserContext,{count:number}>();
const publicAssets=new Map<string,Promise<{status:number;body:Buffer;contentType:string;sha256:string}>>();
export const observedPrintCalls=(page:Page)=>printCounters.get(page.context())?.count||0;
export function record(event:Record<string,unknown>){const j=JSON.parse(readFileSync(journalPath,'utf8'));j.events.push(event);writeFileSync(journalPath,JSON.stringify(j,null,2));}
export async function verifyCompany(page:Page,allowModal=false){
  // Radix marks the background aria-hidden while a modal is open, which also
  // removes its accessible name. Scope by the already observed header DOM text
  // in that case, not by a now-empty accessible name or by guessing a tenant.
  const header=allowModal?page.locator('header button').filter({hasText:company()}):page.getByRole('banner').getByRole('button',{name:company(),exact:true});
  if(allowModal)await expect(header,'The current QA workspace header must remain uniquely identified behind the modal').toHaveCount(1);
  else await expect(header,'Only the disposable QA company is in scope').toBeVisible({timeout:30_000});
}
export async function guard(context:BrowserContext,info:TestInfo){
  await context.route('**/*',async intercepted=>{
    const req=intercepted.request(), url=new URL(req.url()), origin=new URL(required('BASE_URL')).origin;
    if(req.method()==='GET'&&url.origin===origin&&/^\/app\/assets\/[\w-]+-[\w-]{8,}\.(?:js|css)$/.test(url.pathname)){
      // Routing disables Chromium's HTTP cache. Fetch fingerprinted public assets
      // through the HTTP client once per worker, then replay the exact bytes.
      // Documents, API reads and business mutations always remain live.
      const cached=publicAssets.has(url.href);
      if(!cached)publicAssets.set(url.href,(async()=>{
        const response=await intercepted.fetch({timeout:90_000,maxRedirects:0});
        const contentType=response.headers()['content-type']||'application/octet-stream';if(response.status()===200&&!/javascript|text\/css/i.test(contentType))throw new Error('Unexpected public asset content type');
        const body=await response.body();return {status:response.status(),body,contentType,sha256:createHash('sha256').update(body).digest('hex')};
      })());
      let asset;try{asset=await publicAssets.get(url.href);}catch(error){publicAssets.delete(url.href);throw error;}
      if(!asset)throw new Error('Missing public asset fetch');if(asset.status!==200)publicAssets.delete(url.href);
      record({category:'unchanged-public-asset',path:url.pathname,status:asset.status,bytes:asset.body.length,sha256:asset.sha256,cached});
      return intercepted.fulfill({status:asset.status,headers:{'content-type':asset.contentType},body:asset.body});
    }
    if(['GET','HEAD','OPTIONS'].includes(req.method())) return intercepted.continue();
    if(url.origin!==origin) return intercepted.fulfill({status:204,body:''});
    const op=operations.get(context), auth='/app/api/v1/auth/';
    const session=req.method()==='POST'&&(url.pathname===auth+'refresh'||op==='login'&&['login','select-business'].includes(url.pathname.replace(auth,''))||op==='logout'&&url.pathname===auth+'logout');
    const permit=permissions.get(context);
    if(session || permit?.paths.some(p=>p.test(url.pathname))){
      record({test:info.title,category:session?'own-session':'scoped-write',operation:permit?.label,method:req.method(),path:url.pathname});
      return intercepted.continue();
    }
    const sync=/\/auth\/(?:theme|language)$/.test(url.pathname);
    record({test:info.title,category:sync?'prevented-preference-sync':'unexpected-write',method:req.method(),path:url.pathname});
    return intercepted.abort('blockedbyclient');
  });
}
export async function writeScope<T>(page:Page,label:string,paths:RegExp[],run:()=>Promise<T>):Promise<T>{
  validateProductTestTarget(required('BASE_URL')); await verifyCompany(page,true);
  permissions.set(page.context(),{label,paths});
  try{return await run();}finally{permissions.delete(page.context());}
}
export async function signIn(page:Page){
  operations.set(page.context(),'login');
  try{
    await page.goto(appPath('/login',required('BASE_URL')),{waitUntil:'domcontentloaded'});
    await page.getByLabel('Email Address',{exact:true}).waitFor({timeout:30_000});
    await page.getByLabel('Email Address',{exact:true}).fill(required('PRODUCT_TEST_EMAIL'));
    await page.getByLabel('Password',{exact:true}).fill(required('PRODUCT_TEST_PASSWORD'));
    await page.getByRole('button',{name:'Sign In',exact:true}).click();
    const chooser=page.getByRole('heading',{name:'Choose a business',exact:true});
    const selected=page.getByRole('banner').getByRole('button',{name:company(),exact:true});
    await expect(chooser.or(selected).first()).toBeVisible({timeout:30_000});
    if(await chooser.isVisible())await page.getByRole('button').filter({has:page.getByRole('heading',{name:company(),exact:true})}).click();
    await verifyCompany(page);
  }finally{operations.delete(page.context());}
}
export async function route(page:Page,path:string){await page.goto(appPath(path,required('BASE_URL')),{waitUntil:'domcontentloaded'});await verifyCompany(page);}
export async function blocked(info:TestInfo,reason:string):Promise<never>{info.annotations.push({type:'blocked',description:reason});await info.attach('blocked',{body:reason,contentType:'text/plain'});throw new Error('[BLOCKED] '+reason);}
export async function bug(page:Page,info:TestInfo,id:string,reason:string):Promise<never>{
  info.annotations.push({type:'confirmed-bug',description:id+': '+reason});
  await proof(page,info,id);throw new Error(`[${id}] ${reason}`);
}
export async function proof(page:Page,info:TestInfo,label:string){const path=info.outputPath(label+'.png');await page.screenshot({path,fullPage:true});await info.attach(label,{path,contentType:'image/png'});}
export const number=(s:string)=>{
  const normalized=s.replace(/,/g,'').replace(/−/g,'-'),match=normalized.match(/-?\d+(?:\.\d+)?/);
  if(!match)return NaN;const value=Number(match[0]),prefix=normalized.slice(0,match.index);
  // The app formats negative amounts as "-Rs 16.00". Preserve a sign that
  // precedes the currency, as well as ordinary numeric "-16" quantities.
  return /-\s*(?:[A-Za-z]{2,3}|[$€£₹])?\s*$/.test(prefix)?-Math.abs(value):value;
};
export const test=base.extend<{qa:void}>({qa:[async({context},use,info)=>{
  validateProductTestTarget(required('BASE_URL'));await guard(context,info);
  const counter={count:0};printCounters.set(context,counter);await context.exposeBinding('__phase2PrintObserved',()=>counter.count++);
  await context.addInitScript(()=>{(window as any).__qaPrintCalls=0;window.print=()=>{(window as any).__qaPrintCalls++;void (window as any).__phase2PrintObserved();};});
  await use();
},{auto:true}]});
export async function logout(page:Page){
  await route(page,'/');operations.set(page.context(),'logout');
  try{const header=page.getByRole('banner');await header.getByRole('button',{name:'account',exact:true}).or(header.getByRole('button').filter({hasText:/Admin|Manager|Cashier/})).last().click();await page.getByRole('menuitem',{name:/^Log out$/i}).click();await expect(page.getByLabel('Email Address',{exact:true})).toBeVisible();}finally{operations.delete(page.context());}
}
