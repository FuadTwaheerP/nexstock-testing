import {test,expect,salesMetrics,profitability,revenueChart,periods,ranking,lowStock,activity,branchScope} from './support/dashboard';
test('Dashboard complete analytics flow @full-flow',async({page},info)=>{
  info.setTimeout(240_000);const failures=[];
  for(const [name,run] of Object.entries({salesMetrics,profitability,revenueChart,periods,ranking,lowStock,activity,branchScope})){
    await test.step(name,async()=>{try{await run(page,info);}catch(error){failures.push({step:name,error:String(error)});}});
  }
  await info.attach('full-flow-outcomes',{body:JSON.stringify(failures,null,2),contentType:'application/json'});expect(failures).toEqual([]);
});
