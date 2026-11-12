import {writeFileSync} from 'node:fs';
import {test,expect,main,proof} from '../support/phase2';
import {readRoute} from '../support/observed';
import {openTemplate,applyTemplate,saveTemplate,restoreTemplate} from './support/templates';
import {captureInvoiceText,setInvoiceText,restoreInvoiceText} from './support/release';
import {exportPDF} from '../../phase1/invoicing/support/pdf';
import {sellQA} from '../pos-extensions/support/fiscal';

test('RET-002 PDF fallback builder precedence whitespace and saved-template isolation',async({page},info)=>{
 info.setTimeout(360_000);await restoreTemplate(page);await captureInvoiceText(page);
 const raw=await openTemplate(page),baseline={template_name:raw.template_name,primary_color:raw.primary_color,font_family:raw.font_family,header_note:raw.header_note||'',footer_note:raw.footer_note||'',show_watermark:raw.show_watermark};
 writeFileSync('test-results/phase2-template-recovery.json',JSON.stringify({baseline,raw,restored:false},null,2));
 const token=Date.now().toString(36),settings={header:'QA Settings header '+token,footer:'QA Settings bank NOT-A-REAL-ACCOUNT '+token},builder={header:'QA Builder header '+token,footer:'QA Builder footer '+token};
 try{
  await setInvoiceText(page,settings);
  const invoices=await readRoute(page,'/invoicing','/app/api/v1/sales/invoices'),invoice=invoices.find((i:any)=>i.customer==='QA Billing Automation Customer'&&/^INV-/.test(i.invoiceNumber));expect(invoice).toBeTruthy();
  const observations=[];
  for(const mode of ['empty builder fallback','builder precedence','whitespace fallback']){
   await openTemplate(page);const notes=mode==='builder precedence'?builder:mode==='whitespace fallback'?{header:'   ',footer:'   '}:{header:'',footer:''};
   await applyTemplate(page,{...baseline,header_note:notes.header,footer_note:notes.footer});const saved=await saveTemplate(page,info);
   const path=info.outputPath(mode.replaceAll(' ','-')+'.pdf'),pdf=await exportPDF(page,String(invoice.id),path);await info.attach(mode+' PDF',{path,contentType:'application/pdf'});
   const expected=mode==='builder precedence'?builder:settings;
   for(const text of [expected.header,expected.footer])expect.soft(pdf.text,'PDF uses '+mode).toContain(text);
   if(mode==='builder precedence'){expect.soft(pdf.text).not.toContain(settings.header);expect.soft(pdf.text).not.toContain(settings.footer);}
   const after=await openTemplate(page);expect(after.header_note,'Rendering must not persist its fallback into the saved builder').toBe(saved.header_note);expect(after.footer_note).toBe(saved.footer_note);
   observations.push({mode,invoiceId:invoice.id,invoiceNumber:invoice.invoiceNumber,settings,builderBefore:{header:saved.header_note,footer:saved.footer_note},builderAfter:{header:after.header_note,footer:after.footer_note},pdfText:pdf.text});
  }
  await info.attach('pdf-precedence-and-template-isolation',{body:JSON.stringify(observations),contentType:'application/json'});await proof(page,info,'restorable-template-after-precedence');
 }finally{try{await restoreTemplate(page);}finally{await restoreInvoiceText(page);}}
});

test('RET-002 till-generated internal invoice notes remain absent from customer PDF',async({page},info)=>{
 info.setTimeout(180_000);const {sale,receipt}=await sellQA(page,info);await receipt.getByRole('button',{name:'Close',exact:true}).last().click();
 const invoice=await readRoute(page,'/invoicing/'+sale.id,'/app/api/v1/sales/invoices/'+sale.id),internal=String(invoice.notes||'');
 await info.attach('internal-invoice-note-oracle',{body:JSON.stringify({id:invoice.id,number:invoice.invoiceNumber,notes:internal}),contentType:'application/json'});
 expect(internal.length,'A nonempty till-generated note is needed to verify deliberate exclusion').toBeGreaterThan(10);
 const path=info.outputPath('internal-notes-excluded.pdf'),pdf=await exportPDF(page,String(sale.id),path);await info.attach('internal-notes-excluded PDF',{path,contentType:'application/pdf'});
 expect(pdf.text.replace(/\s+/g,' ')).not.toContain(internal.replace(/\s+/g,' '));
});
