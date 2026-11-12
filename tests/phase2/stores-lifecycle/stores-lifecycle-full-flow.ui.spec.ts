import {test,expect,closure,staffScope} from './support/branches';
test('Branch closure and staff-scoping full flow @full-flow',async({page},info)=>{
  info.setTimeout(180_000);const failures=[];
  for(const [step,run] of [['Branch closure and counters',()=>closure(page,info,true)],['Branch staff restriction',()=>staffScope(page,info)]] as const){await test.step(step,async()=>{try{await run();}catch(error){failures.push({step,error:String(error)});}});}
  await info.attach('full-flow-outcomes',{body:JSON.stringify(failures),contentType:'application/json'});expect(failures).toEqual([]);
});
