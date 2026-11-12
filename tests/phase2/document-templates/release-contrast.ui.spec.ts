import {writeFileSync} from 'node:fs';
import {test,expect,route,main,proof,bug} from '../support/phase2';
import {readRoute} from '../support/observed';
import {openTemplate,applyTemplate,saveTemplate,restoreTemplate} from './support/templates';
import {rgba,compositeBackground,contrastRatio} from '../../../helpers/document-colour.mjs';

for(const color of ['#17675e','#15b8a6']){
test('P2-DOC-004 Classic dark rendered borders and text contrast '+color,async({page},info)=>{
 info.setTimeout(240_000);await restoreTemplate(page);const raw=await openTemplate(page);
 await expect(page.locator('html'),'This check requires actual application dark mode').toHaveClass(/\bdark\b/);
 const baseline={template_name:raw.template_name,primary_color:raw.primary_color,font_family:raw.font_family,header_note:raw.header_note||'',footer_note:raw.footer_note||'',show_watermark:raw.show_watermark};
 writeFileSync('test-results/phase2-template-recovery.json',JSON.stringify({baseline,raw,restored:false},null,2));
 const findings:any[]=[],observations:any[]=[];
 try{
  await applyTemplate(page,{...baseline,template_name:'classic',primary_color:color});await saveTemplate(page,info);
  for(const [path,endpoint]of [['/invoicing','/app/api/v1/sales/invoices'],['/quotations','/app/api/v1/sales/quotations'],['/credit-notes','/app/api/v1/sales/credit-notes']]){
   const data=await readRoute(page,path,endpoint),rows=Array.isArray(data)?data:data.data;
   const own=rows.find((r:any)=>r.customer==='QA Billing Automation Customer');expect(own,'An existing synthetic QA document is required').toBeTruthy();
   await readRoute(page,path+'/'+own.id,endpoint+'/'+own.id);await expect(main(page)).toContainText('QA Billing Automation Customer');
   await expect(page.locator('html')).toHaveClass(/\bdark\b/);
   const rendered=await main(page).evaluate(element=>{
    const visible=(e:Element)=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0;
    const nodes=[...element.querySelectorAll('*')].filter(visible);
    const texts=nodes.filter(e=>String(e.className).includes('text-[var(--doc-primary')&&e.textContent?.trim()).map(e=>{
     const s=getComputedStyle(e),backgrounds=[];for(let n:Element|null=e;n;n=n.parentElement)backgrounds.push({tag:n.tagName,className:String(n.className),color:getComputedStyle(n).backgroundColor});
     return {tag:e.tagName,text:e.textContent?.trim(),className:String(e.className),color:s.color,backgrounds};
    });
    const borders=nodes.filter(e=>String(e.className).includes('border-[var(--doc-primary)]')).map(e=>{
     const s=getComputedStyle(e);return {className:String(e.className),colors:[s.borderTopColor,s.borderRightColor,s.borderBottomColor,s.borderLeftColor],widths:[s.borderTopWidth,s.borderRightWidth,s.borderBottomWidth,s.borderLeftWidth]};
    });
    return {texts,borders,variables:nodes.filter(e=>(e.getAttribute('style')||'').includes('--doc-primary')).map(e=>({primary:getComputedStyle(e).getPropertyValue('--doc-primary'),dark:getComputedStyle(e).getPropertyValue('--doc-primary-dark')}))};
   });
   expect(rendered.texts.length,'Identify actual brand text before classifying colour behavior').toBeGreaterThan(0);expect(rendered.borders.length).toBeGreaterThan(0);
   const expected=rgba(color).slice(0,3),texts=rendered.texts.map(t=>({...t,actualBackground:compositeBackground(t.backgrounds.map(b=>b.color)),contrast:contrastRatio(t.color,compositeBackground(t.backgrounds.map(b=>b.color)))}));
   for(const border of rendered.borders)for(let i=0;i<4;i++)if(parseFloat(border.widths[i])>0&&rgba(border.colors[i]).slice(0,3).some((n,j)=>Math.abs(n-expected[j])>0.01))findings.push({document:path,id:own.id,kind:'border',border});
   for(const text of texts){if(text.contrast<3-0.001)findings.push({document:path,id:own.id,kind:'actual text contrast below developer requirement',...text});if(color==='#15b8a6'&&rgba(text.color).slice(0,3).some((n,j)=>Math.abs(n-expected[j])>0.01))findings.push({document:path,id:own.id,kind:'unnecessary tint on readable brand colour',...text});}
   observations.push({document:path,id:own.id,selectedColor:color,...rendered,texts});await proof(page,info,'classic-contrast-'+color.slice(1)+'-'+path.slice(1));
  }
  await info.attach('actual-classic-brand-contrast',{body:JSON.stringify({requirement:'Exact brand borders; brand text >=3:1 against its actual rendered dark surface, with no tint needed for the high-contrast positive control.',selectedColor:color,declaredSurfaceControl:{original:contrastRatio(color,'#0f172a'),developerTint:contrastRatio('#236f66','#0f172a')},observations,findings}),contentType:'application/json'});
  if(findings.length)await bug(page,info,'P2-DOC-004','Classic dark branding still violates the stated rendered colour/contrast rule: '+JSON.stringify(findings.map(f=>({document:f.document,kind:f.kind,color:f.color,background:f.actualBackground,contrast:f.contrast}))));
 }finally{await restoreTemplate(page);}
});
}
