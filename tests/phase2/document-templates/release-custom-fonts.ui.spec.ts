import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {test,expect,route,main,writeScope,proof,record,blocked,bug} from '../support/phase2';
import {readRoute} from '../support/observed';
import {datePlus,fillDates} from '../../phase1/invoicing/support/invoicing';
import {exportPDF} from '../../phase1/invoicing/support/pdf';
const ledger='test-results/final-mvp-fonts.json';
const save=(data:any)=>writeFileSync(ledger,JSON.stringify(data,null,2));
const state=()=>existsSync(ledger)?JSON.parse(readFileSync(ledger,'utf8')):{token:Date.now().toString(36),fonts:[],documents:{}};
const fontsPath='/app/api/v1/settings/fonts';
const fixtures=[{file:'Vera.ttf',suffix:'Regular',postscript:'BitstreamVeraSans-Roman'}, {file:'VeraIt.ttf',suffix:'Italic',postscript:'BitstreamVeraSans-Oblique'}];
async function fontSettings(page:any){
 const fonts=page.waitForResponse((r:any)=>r.request().method()==='GET'&&new URL(r.url()).pathname===fontsPath).then(async(r:any)=>{expect(r.ok()).toBe(true);return(await r.json()).data;});
 await route(page,'/settings');await page.getByRole('tab',{name:'Advanced',exact:true}).click();await expect(page.getByRole('heading',{name:'Custom Fonts',exact:true})).toBeVisible();return fonts;
}
async function choose(page:any,control:any,name:string,exact=true){await control.click();await page.getByRole('option',{name,exact}).first().click();}

test('MVP-FONT upload two fonts in Settings and persist font-capable service fields',async({page},info)=>{
 info.setTimeout(240_000);const data=state();save(data);await fontSettings(page);
 const posts:any[]=[];page.on('request',r=>{if(r.method()==='POST'&&new URL(r.url()).pathname===fontsPath)posts.push({method:r.method(),path:fontsPath});});
 await page.locator('input[type="file"][accept=".ttf,.otf"]').setInputFiles({name:'QA-invalid-font.txt',mimeType:'text/plain',buffer:Buffer.from('QA invalid extension')});
 await expect(page.getByText('Please upload TTF or OTF font files',{exact:true})).toBeVisible();expect(posts).toEqual([]);
 for(const [index,fixture] of fixtures.entries()){
  const name='QAMVP'+data.token+fixture.suffix,buffer=readFileSync('tests/fixtures/fonts/'+fixture.file);
  await writeScope(page,'upload uniquely named owned QA font',[/^\/app\/api\/v1\/settings\/fonts$/],async()=>{
   let observed:any;
   const next=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===fontsPath).then(async r=>{observed=r.request();const contentType=r.request().headers()['content-type'],body=r.request().postData()||'';return {status:r.status(),ok:r.ok(),body:await r.json(),request:{contentType,bytes:r.request().postDataBuffer()?.length,hasMultipartBoundary:/boundary=/i.test(contentType||''),json:contentType?.includes('application/json')?JSON.parse(body):undefined}};});
   // Repeat with the original fixture path as well as a browser File buffer.
   await page.locator('input[type="file"][accept=".ttf,.otf"]').setInputFiles(index===0?resolve('tests/fixtures/fonts/'+fixture.file):{name:name+'.ttf',mimeType:'font/ttf',buffer});const result=await next;
   await info.attach(name+'-upload',{body:JSON.stringify(result),contentType:'application/json'});data.uiUploads??=[];data.uiUploads.push({fixture:fixture.file,...result});save(data);
   if(!result.ok){info.annotations.push({type:'confirmed-bug',description:'MVP-FONT-001: Valid Settings font upload returned HTTP '+result.status+'; '+result.body.message});await page.getByText(/Could not upload/).last().waitFor({timeout:3_000}).catch(()=>undefined);await proof(page,info,'font-upload-'+fixture.suffix+'-failed');}
   expect.soft(result.ok,'Settings must upload the valid '+fixture.file+' through its own UI').toBe(true);
   let font=result.ok?result.body.data:undefined,provenance='Settings UI';
   if(!font&&process.env.MVP_FONT_DIAGNOSTIC_SEED==='1'&&!data.fonts.some((f:any)=>f.fixture===fixture.file)){
    // Isolate downstream rendering despite the UI blocker. Use only the exact
    // observed own-tenant URL/session, with a real multipart file; never patch
    // application JS, force a success response or count this as a UI pass.
    const headers=await observed.allHeaders();for(const field of ['content-type','content-length','host'])delete headers[field];
    expect(new URL(observed.url()).pathname).toBe(fontsPath);
    const response=await page.context().request.post(observed.url(),{headers,multipart:{name,file:{name:name+'.ttf',mimeType:'font/ttf',buffer}},maxRedirects:0});
    const seeded={status:response.status(),body:await response.json(),provenance:'Diagnostic standard-multipart fixture setup; UI upload remains failed'};
    await info.attach(name+'-diagnostic-fixture-setup',{body:JSON.stringify(seeded),contentType:'application/json'});expect(response.ok()).toBe(true);font=seeded.body.data;provenance=seeded.provenance;
    record({category:'diagnostic-owned-font-setup',method:'POST',path:fontsPath,status:response.status(),id:font.id,provenance});
   }
   if(font&&!data.fonts.some((f:any)=>f.fixture===fixture.file)){
    expect(font.id).toBeTruthy();expect(font.fontFamily).toBeTruthy();data.fonts.push({...font,provenance,fixture:fixture.file,postscript:fixture.postscript,sha256:createHash('sha256').update(buffer).digest('hex')});save(data);
    record({category:'owned-fixture',kind:'font retained for saved QA document reproducibility',id:font.id,name:font.name,provenance});
   }
  });
 }
 if(data.fonts.length!==2){await info.attach('font-prerequisite-unavailable',{body:'Both valid UI uploads were attempted; document rendering cannot be exercised without fonts. No downstream rendering failure is inferred.',contentType:'text/plain'});return;}
 const persisted=await fontSettings(page);for(const font of data.fonts){expect(persisted.find((f:any)=>f.id===font.id)).toMatchObject({name:font.name,fontFamily:font.fontFamily});
  // This URL is taken from the file GET made by FontManager, not a guessed API.
  const observed=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname===fontsPath+'/'+font.id+'/file');
  await page.reload();await page.getByRole('tab',{name:'Advanced',exact:true}).click();const response=await observed;expect(response.ok()).toBe(true);expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(font.sha256);
 }
 await proof(page,info,'uploaded-fonts-after-reload');
 if(!data.product){
  const name='QA 000 MVP Fonts '+data.token,sku='QA-MVP-FONT-'+data.token;await route(page,'/products');await main(page).getByRole('button',{name:'New Product',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Add New Product',exact:true});await dialog.getByLabel(/^Product Name/i).fill(name);await dialog.getByLabel(/^SKU/i).fill(sku);
  await choose(page,dialog.getByLabel(/^Category/i),'QA Automation');await choose(page,dialog.getByLabel(/^Unit of Measurement/i),'Piece',false);
  await dialog.getByLabel(/^Cost Price/i).fill('0');await dialog.getByLabel(/^Selling Price/i).fill('100');await dialog.getByLabel(/^Min Threshold/i).fill('0');
  await choose(page,dialog.getByRole('combobox',{name:/Product Type|Item Type/i}),'Service',false);
  await dialog.getByRole('tab',{name:'Custom Fields',exact:true}).click();
  for(const field of ['QA Engraving','QA Signature']){await dialog.getByLabel('Field Name',{exact:true}).fill(field);await dialog.getByRole('checkbox',{name:'Supports custom fonts',exact:true}).check();await dialog.getByRole('button',{name:'Add Field',exact:true}).click();}
  await info.attach('font-capable-product-editor',{body:await dialog.ariaSnapshot(),contentType:'text/plain'});
  await writeScope(page,'create own stockless QA custom-text product',[/^\/app\/api\/v1\/products$/],async()=>{
   const next=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/app/api/v1/products').then(async r=>({ok:r.ok(),body:await r.json(),request:r.request().postDataJSON()}));
   await dialog.getByRole('button',{name:'Add Product',exact:true}).click();const result=await next;await info.attach('saved-font-product',{body:JSON.stringify(result),contentType:'application/json'});expect(result.ok).toBe(true);data.product={...result.body.data,name,sku};save(data);
  });
 }
 await route(page,'/products');const searched=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/products'&&[...new URL(r.url()).searchParams.values()].some(v=>v.includes(data.product.sku))).then(async r=>{expect(r.ok()).toBe(true);return(await r.json()).data;});
 await main(page).getByPlaceholder('Search...',{exact:true}).fill(data.product.sku);await main(page).getByRole('button',{name:'Filter',exact:true}).click();const found=await searched,rows=Array.isArray(found)?found:found.data,fresh=rows.find((p:any)=>String(p.id)===String(data.product.id));expect(fresh).toBeTruthy();
 const row=main(page).getByRole('row').filter({has:page.getByRole('cell',{name:data.product.sku,exact:true})});await row.getByRole('button',{name:'Actions',exact:true}).click();await page.getByRole('menuitem',{name:'Edit',exact:true}).click();const edit=page.getByRole('dialog',{name:'Edit Product',exact:true});await edit.getByRole('tab',{name:'Custom Fields',exact:true}).click();
 const snapshot=await edit.ariaSnapshot(),fields=fresh.customFields||fresh.custom_fields||[];data.productPersistence={fresh,snapshot,uiHasBoth:snapshot.includes('QA Engraving')&&snapshot.includes('QA Signature')};save(data);await info.attach('reloaded-custom-field-definitions',{body:JSON.stringify(data.productPersistence),contentType:'application/json'});await proof(page,info,'reloaded-font-product-custom-fields');
 if(fields.length!==2||!data.productPersistence.uiHasBoth)info.annotations.push({type:'confirmed-bug',description:'MVP-FONT-002: Font-capable custom field definitions submitted on the owned product are missing from its fresh GET and reopened editor.'});
 expect.soft(fields,'Submitted custom field definitions must persist after a fresh product read').toHaveLength(2);expect.soft(data.productPersistence.uiHasBoth,'Both custom field definitions must remain in Edit Product').toBe(true);await edit.getByRole('button',{name:'Cancel',exact:true}).click();
 await info.attach('custom-font-state',{body:JSON.stringify(data),contentType:'application/json'});
});

for(const kind of ['invoice','quotation'])test('MVP-FONT '+kind+' custom text retains selected fonts on web and exported PDF',async({page},info)=>{
 info.setTimeout(240_000);const data=state();if(data.fonts.length!==2||!data.product?.id)await blocked(info,'Settings font upload prerequisite failed. No persisted pair of owned fonts/product is available, so '+kind+' rendering has not been exercised.');const isInvoice=kind==='invoice',path=isInvoice?'/invoicing':'/quotations',endpoint='/app/api/v1/sales/'+(isInvoice?'invoices':'quotations');
 const markers=['QAREG'+data.token.toUpperCase(),'QAITALIC'+data.token.toUpperCase()],values=[markers[0]+' Emile & Co',markers[1]+' Personalised gift'];
 if(!data.documents[kind]){
  const productRead=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/products',{timeout:30_000}).then(async r=>({url:r.url(),status:r.status(),body:await r.json()}));await route(page,path);await main(page).getByRole('button',{name:isInvoice?'New Invoice':'New Quotation',exact:true}).click();await expect(main(page).getByRole('heading',{name:isInvoice?'New Invoice':'New Quotation',exact:true})).toBeVisible();const productPage=await productRead;
  await main(page).getByRole('combobox').first().click();await page.getByRole('option').filter({hasText:'qa.billing.customer@example.invalid'}).click();await fillDates(page,datePlus(0),datePlus(15));
  await main(page).getByRole('button',{name:'Add Row',exact:true}).click();await main(page).getByRole('combobox').filter({hasText:'Choose product...'}).click();const own=page.getByRole('option').filter({hasText:data.product.name+' - Rs'});await page.getByRole('option').last().press('End');
  await info.attach(kind+'-product-picker',{body:JSON.stringify({ownedProduct:{id:data.product.id,name:data.product.name,sku:data.product.sku},observedPage:productPage,options:await page.getByRole('option').allTextContents(),snapshot:await page.getByRole('listbox').ariaSnapshot()}),contentType:'application/json'});
  if(!await own.count())await bug(page,info,'MVP-LOOKUP-001','Persisted active QA product '+data.product.id+' is absent from the '+kind+' product picker. Only its initial product page is loaded; selected-font output is blocked before item selection.');await own.click();
  if(!await main(page).getByPlaceholder('Enter qa engraving...',{exact:true}).count())await bug(page,info,'MVP-FONT-002','The saved product has no usable custom-text definitions in the '+kind+' editor; custom text and selected-font output cannot be entered.');
  for(let i=0;i<2;i++){
   const field=main(page).getByPlaceholder('Enter '+['qa engraving','qa signature'][i]+'...',{exact:true});await field.fill(values[i]);
   await field.locator('..').getByRole('combobox').click();const options=await page.getByRole('option').allTextContents(),option=page.getByRole('option',{name:data.fonts[i].name,exact:true}),available=await option.count()===1;
   data.selections??={};data.selections[kind]??=[];data.selections[kind][i]={font:data.fonts[i].name,family:data.fonts[i].fontFamily,available,options};save(data);
   if(available)await option.click();else{await page.keyboard.press('Escape');info.annotations.push({type:'confirmed-bug',description:'MVP-FONT-003: Persisted server font is absent from '+kind+' custom-text font selector.'});await info.attach(kind+'-'+i+'-font-options',{body:JSON.stringify(data.selections[kind][i]),contentType:'application/json'});}
   expect.soft(available,'Persisted uploaded font '+data.fonts[i].name+' must be selectable in '+kind).toBe(true);
  }
  await page.evaluate(()=>document.fonts.ready);const previews=await page.evaluate((texts:string[])=>texts.map(text=>{const el=[...document.querySelectorAll('p')].find(e=>e.textContent===text);return {text,found:!!el,cssFamily:el?getComputedStyle(el).fontFamily:null,faces:[...document.fonts].map(f=>({family:f.family,status:f.status}))};}),values);
  data.editorPreviews??={};data.editorPreviews[kind]=previews;save(data);await proof(page,info,kind+'-selected-font-editor');
  await writeScope(page,'save own QA custom-font '+kind,[new RegExp('^'+endpoint+'$')],async()=>{
   const next=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname===endpoint).then(async r=>({ok:r.ok(),body:await r.json(),request:r.request().postDataJSON()}));
   await main(page).getByRole('button',{name:isInvoice?'Save Invoice':'Save Quotation',exact:true}).click();await page.getByRole('menuitem',{name:'Save as Draft',exact:true}).click();const result=await next;await info.attach('saved-custom-font-'+kind,{body:JSON.stringify(result),contentType:'application/json'});expect(result.ok).toBe(true);data.documents[kind]={...result.body.data,markers,values};save(data);
  });
 }
 const doc=data.documents[kind],saved=await readRoute(page,path+'/'+doc.id,endpoint+'/'+doc.id);await info.attach('fresh-'+kind+'-custom-font-data',{body:JSON.stringify(saved),contentType:'application/json'});
 for(let i=0;i<2;i++)expect.soft(saved.items[0].customFields[i]).toMatchObject({value:doc.values[i],...(data.selections[kind][i].available?{fontFamily:data.fonts[i].fontFamily}:{})});
 await expect(main(page).getByRole('button',{name:'Print',exact:true})).toBeVisible();await page.evaluate(()=>document.fonts.ready);
 data.details??={};data.details[kind]=await page.evaluate((texts:string[])=>({fonts:[...document.fonts].map(f=>({family:f.family,status:f.status})),texts:texts.map((text,index)=>{const els=[...document.querySelectorAll('main *')].filter(el=>el.textContent?.includes(text)&&![...el.children].some(child=>child.textContent?.includes(text)));els.forEach((el,n)=>el.setAttribute('data-qa-font-probe',index+'-'+n));return {text,matches:els.map(el=>({tag:el.tagName,text:el.textContent,cssFamily:getComputedStyle(el).fontFamily}))};})}),doc.values);
 const cdp=await page.context().newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');const {root}=await cdp.send('DOM.getDocument');
 for(let i=0;i<2;i++){const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'[data-qa-font-probe="'+i+'-0"]'});data.details[kind].texts[i].platformFonts=nodeId?(await cdp.send('CSS.getPlatformFontsForNode',{nodeId})).fonts:[];}await cdp.detach();
 await info.attach('fresh-'+kind+'-rendered-fonts',{body:JSON.stringify(data.details[kind]),contentType:'application/json'});await proof(page,info,kind+'-saved-custom-font-text');save(data);
 const pdfPath=info.outputPath(kind+'-custom-fonts.pdf');if(isInvoice)await exportPDF(page,String(doc.id),pdfPath);else{const next=page.waitForEvent('download');await main(page).getByRole('button',{name:'PDF',exact:true}).click();await(await next).saveAs(pdfPath);}
 await info.attach(kind+'-custom-font-PDF',{path:pdfPath,contentType:'application/pdf'});
 const parsed=JSON.parse(execFileSync(process.env.PDF_PYTHON||'python',[resolve('tests/phase2/document-templates/support/inspect_custom_font_pdf.py'),pdfPath,...doc.markers],{encoding:'utf8'}));
 expect(parsed.pages.map((p:any)=>p.text).join('\n'),'The native download must be the exact saved QA document').toContain(isInvoice?saved.invoiceNumber:saved.quoteNumber);
 data.pdfs??={};data.pdfs[kind]=parsed;save(data);await info.attach(kind+'-PDF-font-oracle',{body:JSON.stringify(parsed),contentType:'application/json'});
 for(let i=0;i<2;i++){
  expect.soft(parsed.pages.map((p:any)=>p.text).join('\n'),'Custom text must be printed in '+kind).toContain(doc.values[i]);
  if(!data.selections[kind][i].available)continue; // Selected-font output is blocked; default text does not prove a font-rendering defect.
  expect.soft(parsed.markers[doc.markers[i]]?.some((word:any)=>word.fontname.includes(data.fonts[i].postscript)),'Selected '+data.fonts[i].postscript+' must render the actual custom text in '+kind+' PDF').toBe(true);
  expect.soft(data.details[kind].texts[i].matches.some((m:any)=>m.cssFamily.includes(data.fonts[i].fontFamily)),'Saved '+kind+' web document applies the selected custom font').toBe(true);
  expect.soft(data.details[kind].fonts.some((f:any)=>f.family.replaceAll('"','').replaceAll("'",'')===data.fonts[i].fontFamily&&f.status==='loaded'),'Saved '+kind+' web document loads the selected font file').toBe(true);
  expect.soft(data.details[kind].texts[i].platformFonts.some((f:any)=>f.isCustomFont&&f.glyphCount>0),'Chromium must use a custom font for actual '+kind+' custom-text glyphs').toBe(true);
 }
 await info.attach('complete-custom-font-state',{body:JSON.stringify(data),contentType:'application/json'});
});
