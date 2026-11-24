import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {type Page,type TestInfo} from 'playwright/test';
import {expect,main,writeScope} from './phase3';
import {readRoute} from './observed';
const endpoint='/app/api/v1/settings/document-template',file='test-results/retest-template-recovery.json';
const fields=(r:any)=>({template_name:r.template_name||'modern',primary_color:r.primary_color||'#0f172a',font_family:r.font_family||'Inter',header_note:r.header_note||'',footer_note:r.footer_note||'',show_watermark:r.show_watermark??true});
export async function openTemplate(page:Page){const raw=await readRoute(page,'/business/document-builder',endpoint);await expect(main(page).getByRole('heading',{name:'Document Builder',exact:true,level:1})).toBeVisible();await expect(main(page).locator('input[type="text"][name="primary_color"]')).toHaveValue(fields(raw).primary_color);return raw;}
export async function applyTemplate(page:Page,state:any){
 await main(page).getByRole('radio',{name:state.template_name==='classic'?'Classic':'Modern',exact:true}).check();await main(page).locator('input[type="text"][name="primary_color"]').fill(state.primary_color);
 await main(page).getByRole('combobox',{name:'Font Family',exact:true}).click();await page.getByRole('option').filter({hasText:state.font_family}).first().click();await main(page).getByRole('textbox',{name:'Header Note',exact:true}).fill(state.header_note);await main(page).getByRole('textbox',{name:'Footer Text (T&C)',exact:true}).fill(state.footer_note);await main(page).getByRole('switch',{name:'Show Watermark',exact:true}).setChecked(state.show_watermark);
}
export async function saveTemplate(page:Page,info?:TestInfo){
 await writeScope(page,'save/restore QA document template only',[/^\/app\/api\/v1\/settings\/document-template$/],async()=>{const next=page.waitForResponse(r=>r.request().method()==='PUT'&&new URL(r.url()).pathname===endpoint).then(async r=>({ok:r.ok(),body:await r.json(),request:r.request().postDataJSON()}));await main(page).getByRole('button',{name:'Save',exact:true}).click();const result=await next;expect(result.ok).toBe(true);if(info)await info.attach('native-document-template-save',{body:JSON.stringify(result),contentType:'application/json'});});return openTemplate(page);
}
export async function restoreTemplate(page:Page){
 if(!existsSync(file))return;const state=JSON.parse(readFileSync(file,'utf8'));if(state.restored)return;const current=await openTemplate(page);let raw=current;if(JSON.stringify(fields(current))!==JSON.stringify(state.baseline)){await applyTemplate(page,state.baseline);raw=await saveTemplate(page);}expect(fields(raw)).toEqual(state.baseline);for(const[key,value]of Object.entries(state.raw))if(!['updated_at',...Object.keys(state.baseline)].includes(key))expect(raw[key],'Preserved unrelated template field '+key).toEqual(value);state.restored=true;writeFileSync(file,JSON.stringify(state,null,2));
}
