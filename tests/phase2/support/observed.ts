import {type Page} from 'playwright/test';
import {expect,route} from './phase2';
const reads=new WeakMap<Page,Map<string,{url:string;headers:Record<string,string>}>>();
export async function readRoute(page:Page,path:string,endpoint:string,matches:(url:URL)=>boolean=()=>true){
 await page.goto('about:blank');const loaded=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===endpoint&&matches(new URL(r.url())),{timeout:60_000}).then(async r=>{
  const headers=await r.request().allHeaders();delete headers['if-none-match'];delete headers['if-modified-since'];const map=reads.get(page)||new Map();map.set(endpoint,{url:r.url(),headers});reads.set(page,map);expect(r.ok(),'Observed GET '+endpoint+' HTTP '+r.status()).toBe(true);return (await r.json()).data;
 });const [,data]=await Promise.all([route(page,path),loaded]);return data;
}
export async function reread(page:Page,endpoint:string){const observed=reads.get(page)?.get(endpoint);expect(observed,'Only re-read an actually observed GET').toBeTruthy();const r=await page.context().request.get(observed!.url,{headers:observed!.headers,maxRedirects:0});expect(r.ok()).toBe(true);return (await r.json()).data;}
