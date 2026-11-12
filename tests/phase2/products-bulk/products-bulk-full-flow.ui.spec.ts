import {test,expect,verifyExport,verifyBranchStockExport,importCSV} from './support/catalog';
test('Bulk catalogue export import validate and archive QA rows @full-flow',async({page},info)=>{
  info.setTimeout(240_000);const failures=[];
  for(const [step,run] of [['CSV export',()=>verifyExport(page,info,'CSV')],['Branch stock export',()=>verifyBranchStockExport(page,info)],['JSON export',()=>verifyExport(page,info,'JSON')],['Valid CSV import',()=>importCSV(page,info)],['Quoted CSV import',()=>importCSV(page,info,false,true)],['Invalid CSV validation',()=>importCSV(page,info,true)]] as const){
    await test.step(step,async()=>{try{await run();}catch(error){failures.push({step,error:String(error)});}});
  }
  await info.attach('full-flow-outcomes',{body:JSON.stringify(failures,null,2),contentType:'application/json'});expect(failures).toEqual([]);
});
