import {test,expect,main,route,proof,observedPrintCalls} from '../support/phase2';
import {readRoute} from '../support/observed';
import {verifyPDF} from '../support/pdf';

test('REL-DN-001 legacy debit 4 repairs product name SKU and string DTO identifiers',async({page},info)=>{
 info.setTimeout(120_000);
 const legacy=await readRoute(page,'/debit-notes/4','/app/api/v1/sales/debit-notes/4');
 expect(legacy.customer).toBe('QA Billing Automation Customer');expect(legacy.debitNoteNumber).toBe('DN-TMF7QHSF');
 expect(typeof legacy.id).toBe('string');expect(typeof legacy.invoiceId).toBe('string');expect(legacy.items.length).toBeGreaterThan(0);
 for(const item of legacy.items){expect(typeof item.id).toBe('string');expect(typeof item.productId).toBe('string');}
 const expected=['QA add mv9rtxw1-3b087e','QA-ADD-mv9rtxw1-3b087e'];
 for(const value of expected)expect(JSON.stringify(legacy.items)).toContain(value);
 for(const value of [legacy.debitNoteNumber,...expected])await expect(main(page)).toContainText(value);
 await info.attach('legacy-debit-repaired-resource',{body:JSON.stringify(legacy),contentType:'application/json'});await proof(page,info,'legacy-debit-repaired');
 await route(page,'/debit-notes');const row=main(page).getByRole('row').filter({has:page.getByRole('cell',{name:legacy.debitNoteNumber,exact:true})}),before=observedPrintCalls(page),opened=page.waitForEvent('popup');
 await row.getByRole('button',{name:'Download PDF',exact:true}).click();const popup=await opened;
 try{await expect(popup).toHaveURL(/\/app\/debit-notes\/4\?print=true/);for(const value of expected)await expect(popup.getByRole('main')).toContainText(value);await expect.poll(()=>observedPrintCalls(page)).toBe(before+1);
 const path=info.outputPath('legacy-debit-repaired.pdf');await popup.pdf({path,format:'A4',printBackground:true});await verifyPDF(path,info,[legacy.debitNoteNumber,...expected]);await info.attach('legacy-debit-repaired PDF',{path,contentType:'application/pdf'});
 }finally{await popup.close();}
});
