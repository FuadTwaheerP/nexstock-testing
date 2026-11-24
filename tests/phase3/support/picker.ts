import {type Page,type Locator,type TestInfo} from 'playwright/test';
import {expect} from './phase3';

/** Operate the deployed server-search control, never inject a missing option. */
export async function searchPicker(page:Page,control:Locator,query:string,endpoint:string,info?:TestInfo){
 await control.click();
 const tag=await control.evaluate(el=>el.tagName);
 const listId=await control.getAttribute('aria-controls');
 const input=tag==='INPUT'?control:page.getByRole('searchbox').and(page.locator('[aria-controls='+JSON.stringify(listId)+']'));
 const next=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===endpoint&&new URL(r.url()).searchParams.get('search')===query,{timeout:20_000});void next.catch(()=>{});
 await input.fill(query);const response=await next;expect(response.ok()).toBe(true);
 const body=await response.json();
 if(info)await info.attach('picker-search-'+endpoint.split('/').at(-1)+'-'+query.replace(/[^a-z0-9]/gi,'').slice(-30),{body:JSON.stringify({query,url:response.url(),status:response.status(),body}),contentType:'application/json'});
 return body;
}
export async function selectPicker(page:Page,control:Locator,query:string,endpoint:string,info?:TestInfo){
 await searchPicker(page,control,query,endpoint,info);
 const option=page.getByRole('option').filter({hasText:new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i')});
 await expect(option).toHaveCount(1);await option.click();
}
