import {readFileSync} from 'node:fs';
import {type Page,type TestInfo} from 'playwright/test';
import {test,expect,route,main,bug,proof,writeScope,blocked,record} from '../../support/phase2';
import {branches as readAllBranches} from '../../stores-lifecycle/support/branches';
export {test,expect,main,bug,proof};
export function parseCSV(text:string){
  const rows:string[][]=[];let row:string[]=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
    else if(c===','&&!quoted){row.push(cell);cell='';}
    else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.length))rows.push(row);row=[];cell='';}
    else cell+=c;
  }
  if(cell.length||row.length){row.push(cell);rows.push(row);}return rows;
}
export const csvText=(rows:(string|number)[][])=>rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
export async function openCatalog(page:Page){
  await page.goto('about:blank');
  const read=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/products',{timeout:60_000}).then(async r=>({ok:r.ok(),data:(await r.json()).data}));
  const [,response]=await Promise.all([route(page,'/products'),read]);expect(response.ok).toBe(true);
  const data=response.data;await expect(main(page).getByRole('heading',{name:'Products',exact:true})).toBeVisible();
  await expect(main(page).getByText(`Showing 1 to 15 of ${data.total}`,{exact:true}).or(main(page).getByText(`Showing 1 to ${data.data.length} of ${data.total}`,{exact:true})).first()).toBeVisible();
  return data;
}
export async function exchange(page:Page){
  await main(page).getByRole('button',{name:'Import/Export',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Import / Export Products',exact:true});await expect(dialog).toBeVisible();return dialog;
}
export async function exportCatalog(page:Page,info:TestInfo,kind:'CSV'|'JSON'='CSV'){
  const snapshot=await openCatalog(page),dialog=await exchange(page);
  const next=page.waitForEvent('download');await dialog.getByRole('button',{name:new RegExp('^Export as '+kind)}).click();
  const download=await next,path=info.outputPath('catalogue.'+kind.toLowerCase());await download.saveAs(path);
  await info.attach('catalogue-'+kind,{path,contentType:kind==='CSV'?'text/csv':'application/json'});
  return {snapshot,text:readFileSync(path,'utf8'),path,dialog};
}
export async function verifyExport(page:Page,info:TestInfo,kind:'CSV'|'JSON'){
  const {snapshot,text,dialog}=await exportCatalog(page,info,kind);
  await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
  const requiredSkus:string[]=snapshot.data.map((r:any)=>r.sku);
  while(await main(page).getByRole('button',{name:'Next',exact:true}).isEnabled()){
    const loaded=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/products');
    await main(page).getByRole('button',{name:'Next',exact:true}).click();
    const response=await loaded;expect(response.ok()).toBe(true);const pageData=(await response.json()).data;
    requiredSkus.push(...pageData.data.map((r:any)=>r.sku));
    await expect(main(page).getByRole('cell',{name:pageData.data[0].sku,exact:true})).toBeVisible();
  }
  const csv=kind==='CSV'?parseCSV(text):null;
  const rows=kind==='CSV'?csv!.slice(1):JSON.parse(text);
  const count=Array.isArray(rows)?rows.length:Array.isArray(rows.products)?rows.products.length:NaN;
  const exportedSkus=kind==='CSV'?rows.map((r:string[])=>r[csv![0].indexOf('SKU')]):rows.map((r:any)=>r.sku);
  const missing=[...new Set(requiredSkus)].filter(s=>!exportedSkus.includes(s));
  await info.attach('export-count-oracle',{body:JSON.stringify({visiblePage:snapshot.data.length,totalActive:snapshot.total,activeSkusChecked:new Set(requiredSkus).size,exported:count,missing,scope:'Archived inclusions are not treated as a defect; every active SKU must be present.'}),contentType:'application/json'});
  expect(new Set(requiredSkus).size,'UI pagination oracle must cover the active catalogue').toBe(snapshot.total);
  if(missing.length)await bug(page,info,'P2-BULK-001',`Full catalogue ${kind} export contains ${count} records and misses ${missing.length} active SKUs from the ${snapshot.total}-product catalogue; it only covers the visible page.`);
}
export async function verifyBranchStockExport(page:Page,info:TestInfo){
  const {text,dialog,snapshot}=await exportCatalog(page,info,'CSV');const rows=parseCSV(text),headers=rows[0];
  await dialog.getByRole('button',{name:'Cancel',exact:true}).click();const locations=await readAllBranches(page);
  const table=main(page).getByRole('table');await expect(table.getByRole('columnheader').nth(2)).toBeVisible();
  const inventoryHeaders=(await table.getByRole('columnheader').allTextContents()).map(h=>h.trim());
  const branches=locations.map((b:any)=>b.name);
  const branchIndex=(b:string)=>headers.findIndex(h=>h.replace(/^Stock\s*[-–—:]\s*/i,'').trim().toLowerCase()===b.toLowerCase());
  const missing=branches.filter(b=>branchIndex(b)<0);
  const totalIndex=headers.findIndex(h=>/^total(?:\s+(?:stock|quantity|qty))?$/i.test(h));
  await info.attach('csv-branch-stock-contract',{body:JSON.stringify({confirmedByUser:'25 Oct 2026: every branch column plus total',csvHeaders:headers,inventoryHeaders,missingBranches:missing,totalIndex}),contentType:'application/json'});
  if(missing.length||totalIndex<0)await bug(page,info,'P2-BULK-004','CSV stock export does not provide the user-required per-branch columns and total stock column. Missing branches: '+missing.join(', ')+'; total column present: '+(totalIndex>=0));
  for(const row of rows.slice(1)){
    const sum=branches.reduce((n,b)=>n+Number(row[branchIndex(b)]),0);
    expect(Number(row[totalIndex]),'CSV total must sum every branch column').toBeCloseTo(sum,3);
  }
  let reconciled=0;
  for(const inventoryRow of await table.getByRole('row').filter({has:page.getByRole('cell')}).all()){
    const cells=await inventoryRow.getByRole('cell').allTextContents(),exported=rows.slice(1).find(r=>r[headers.indexOf('SKU')]===cells[1]?.trim());if(!exported)continue;
    for(const b of branches){const displayed=cells[inventoryHeaders.indexOf(b)];if(!displayed)continue;const quantity=Number(displayed.replace(/,/g,'').match(/-?\d+(?:\.\d+)?/)?.[0]);expect(Number.isFinite(quantity),'Inventory matrix must provide a numeric comparison').toBe(true);expect(Number(exported[branchIndex(b)]),'CSV branch stock for '+cells[1]+' / '+b).toBe(quantity);}
    reconciled++;
  }
  expect(reconciled,'Compare exported quantities with independently rendered branch inventory').toBeGreaterThan(0);
  await info.attach('branch-stock-reconciliation',{body:JSON.stringify({inventoryProductsReconciled:reconciled,branches,exportedProducts:rows.length-1}),contentType:'application/json'});
}

export function importFixtures(){const token=Date.now().toString(36);return [1,2].map(i=>({sku:`QA-P2-CSV-${token}-${i}`,name:`QA P2 CSV ${token} ${i}`,barcode:`000${Date.now()}${i}`,price:100.75+i,cost:40.25,description:`QA CSV, quoted "row ${i}"`}));}
export async function searchOwned(page:Page,sku:string){
  expect(sku).toMatch(/^QA-P2-CSV-/);await openCatalog(page);
  const read=page.waitForResponse(r=>{const u=new URL(r.url());return r.request().method()==='GET'&&u.pathname==='/app/api/v1/products'&&[...u.searchParams.values()].some(v=>v.includes(sku));});
  await main(page).getByPlaceholder('Search...',{exact:true}).fill(sku);await main(page).getByRole('button',{name:'Filter',exact:true}).click();
  const response=await read;expect(response.ok()).toBe(true);const data=(await response.json()).data;
  const row=main(page).getByRole('row').filter({has:page.getByRole('cell',{name:sku,exact:true})});
  return {row,data};
}
export async function archiveOwned(page:Page,sku:string){
  const {row,data}=await searchOwned(page,sku);const owned=data.data.find((p:any)=>p.sku===sku);if(!owned)return;
  await expect(row).toBeVisible();await row.getByRole('button').last().click();
  await writeScope(page,'archive own CSV test fixture',[new RegExp('^/app/api/v1/products/'+owned.id+'(?:/archive)?$')],async()=>{
    await page.getByRole('menuitem',{name:'Archive',exact:true}).click();
    const confirm=page.getByRole('dialog').filter({hasText:/archive|delete/i});
    await expect.poll(async()=>!await row.isVisible()||await confirm.isVisible()).toBe(true);
    if(await confirm.isVisible()){await confirm.getByRole('button',{name:/^(Archive|Confirm)$/i}).last().click();await expect(confirm).toBeHidden();}
  });
  await expect(row).toBeHidden();
}
export async function importCSV(page:Page,info:TestInfo,invalid=false,rich=false){
  const fixtures=importFixtures();
  if(!rich)fixtures.forEach((f,i)=>f.description=`QA plain CSV row ${i+1}`);
  for(const f of fixtures)record({test:info.title,category:'owned-fixture',kind:'CSV product',...f});
  const {text,dialog}=await exportCatalog(page,info,'CSV');const source=parseCSV(text);
  const headers=source[0],sample=source[1];expect(headers).toContain('SKU');expect(headers).toContain('Name');
  const values=(f:ReturnType<typeof importFixtures>[number])=>headers.map((h,index)=>({SKU:f.sku,Name:invalid?'':f.name,Barcode:f.barcode,Price:f.price,Cost:f.cost,Stock:0,Description:f.description,Supplier:''}[h]??(['Category','Unit'].includes(h)?sample[index]:'')));
  const contents=csvText([headers,...fixtures.map(values)]).replaceAll('\r\n',rich?'\r\n':'\n');
  await dialog.getByRole('tab',{name:'Import',exact:true}).click();
  const responses:{path:string;status:number}[]=[];
  page.on('response',response=>{const u=new URL(response.url());if(response.request().method()!=='GET'&&u.pathname.startsWith('/app/api/v1/products'))responses.push({path:u.pathname,status:response.status()});});
  try{
    await writeScope(page,'import only unique QA-P2-CSV fixture rows',[/^\/app\/api\/v1\/products(?:\/.*)?$/],async()=>{
      await dialog.locator('input[type="file"]').setInputFiles({name:'qa-phase2-products.csv',mimeType:'text/csv',buffer:Buffer.from(contents)});
      await info.attach('import-preview',{body:await dialog.ariaSnapshot(),contentType:'text/plain'});
      const submit=dialog.getByRole('button',{name:/^Import(?:\s|$)/i});
      await expect(submit).toBeVisible();
      if(invalid&&!await submit.isEnabled()){await proof(page,info,'invalid-csv-disabled');return;}
      await submit.click();
      await expect(dialog,'Importer should report a definitive result').toBeHidden({timeout:20_000});
    });
    await info.attach('import-write-responses',{body:JSON.stringify(responses),contentType:'application/json'});
    const observations=[];
    for(const f of fixtures){
      const found=await searchOwned(page,f.sku);const exists=found.data.data.some((p:any)=>p.sku===f.sku);observations.push({sku:f.sku,exists});
      if(invalid){if(exists)await bug(page,info,'P2-BULK-003','CSV rows with an empty required product Name were persisted.');}
      else if(!exists)await bug(page,info,'P2-BULK-002','Valid CSV using the application\'s own exported headers closes as imported, but the QA rows do not persist after a fresh catalogue read.');
      else{
        await expect(found.row).toContainText(f.name);await expect(found.row).toContainText(f.price.toFixed(2));
        await found.row.getByRole('button').last().click();await page.getByRole('menuitem',{name:'Edit',exact:true}).click();
        const editor=page.getByRole('dialog',{name:'Edit Product',exact:true});
        const actual={description:await editor.getByLabel('Description',{exact:true}).inputValue(),barcode:await editor.getByLabel('Barcode',{exact:true}).inputValue(),cost:await editor.getByLabel(/^Cost Price/).inputValue()};
        await info.attach('csv-reopened-fields',{body:JSON.stringify({expected:f,actual}),contentType:'application/json'});
        if(actual.description!==f.description||actual.barcode!==f.barcode||Number(actual.cost)!==f.cost)await bug(page,info,'P2-BULK-002','Imported CSV fields are corrupted or omitted after reopening Edit: '+JSON.stringify({expected:f,actual,richCSV:rich}));
        await editor.getByRole('button',{name:'Cancel',exact:true}).click();
      }
    }
    await info.attach('import-persistence-oracle',{body:JSON.stringify(observations),contentType:'application/json'});
  }finally{
    await info.attach('import-write-responses-final',{body:JSON.stringify(responses),contentType:'application/json'});
    for(const f of fixtures)await archiveOwned(page,f.sku);
  }
}
