import {type Page} from 'playwright/test';
import {expect,route,verifyCompany,record,paceAPI} from './phase3';
const reads=new WeakMap<Page,Map<string,{url:string;headers:Record<string,string>}>>();
export const hasRead=(page:Page,endpoint:string)=>!!reads.get(page)?.has(endpoint);
export async function observeAction(page:Page,endpoint:string,run:()=>Promise<any>,matches:(u:URL)=>boolean=()=>true){const next=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===endpoint&&matches(new URL(r.url())),{timeout:60_000}).then(async r=>{const headers=await r.request().allHeaders();delete headers['if-none-match'];delete headers['if-modified-since'];const map=reads.get(page)||new Map();map.set(endpoint,{url:r.url(),headers});reads.set(page,map);expect(r.ok(),'Observed read '+endpoint).toBe(true);return(await r.json()).data;});const[,data]=await Promise.all([run(),next]);return data;}
export async function readRoute(page:Page,path:string,endpoint:string,matches:(url:URL)=>boolean=()=>true){
 await page.goto('about:blank');const loaded=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===endpoint&&matches(new URL(r.url())),{timeout:60_000}).then(async r=>{
  const headers=await r.request().allHeaders();delete headers['if-none-match'];delete headers['if-modified-since'];const map=reads.get(page)||new Map();map.set(endpoint,{url:r.url(),headers});reads.set(page,map);expect(r.ok(),'Observed GET '+endpoint+' HTTP '+r.status()).toBe(true);return (await r.json()).data;
 });const [,data]=await Promise.all([route(page,path),loaded]);return data;
}
export async function reread(page:Page,endpoint:string){const observed=reads.get(page)?.get(endpoint);expect(observed,'Only re-read an actually observed GET').toBeTruthy();await paceAPI();const r=await page.context().request.get(observed!.url,{headers:observed!.headers,maxRedirects:0});expect(r.ok()).toBe(true);return (await r.json()).data;}
export async function observedCall(page:Page,endpoint:string,method:string,data?:any,suffix=''){
 await verifyCompany(page,true);const observed=reads.get(page)?.get(endpoint);expect(observed,'Use only a live observed endpoint and public request contract').toBeTruthy();const url=new URL(observed!.url);url.search='';url.pathname+=suffix;const headers={...observed!.headers};for(const k of ['content-type','content-length'])delete headers[k];await paceAPI();const response=await page.context().request.fetch(url.href,{method,headers,data,maxRedirects:0});record({category:'explicit-api-diagnostic',method,path:url.pathname,status:response.status()});return response;
}
export async function allPages(page:Page,endpoint:string,initial:any){
 const observed=reads.get(page)?.get(endpoint);expect(observed).toBeTruthy();let batch=initial,out:any[]=[];const seen=new Set();
 for(let i=0;i<60;i++){const rows=Array.isArray(batch)?batch:batch.data;expect(Array.isArray(rows)).toBe(true);for(const row of rows)if(!seen.has(String(row.id))){seen.add(String(row.id));out.push(row);}const current=Number(batch.current_page||batch.meta?.current_page||1),last=Number(batch.last_page||batch.meta?.last_page||1);if(current>=last)return out;
  // Independent data oracle: use the live catalogue's documented page parameter
  // on its actually observed endpoint, just as the native catalogue Next does.
  // Do not claim this validates server-supplied link URLs or document pickers.
  const url=new URL(observed!.url);url.searchParams.set('page',String(current+1));expect(url.pathname).toBe(endpoint);await paceAPI();const r=await page.context().request.get(url.href,{headers:observed!.headers,maxRedirects:0});expect(r.ok()).toBe(true);batch=(await r.json()).data;}
 throw new Error('Pagination failed to terminate within advertised catalogue size');
}

