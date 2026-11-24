import { test as setup } from 'playwright/test';
import { mkdirSync, writeFileSync,readFileSync } from 'node:fs';
import { authPath,journalPath,company,guard,signIn } from './phase3';
setup('authenticate Phase 3 QA workspace',async({page,context},info)=>{
  mkdirSync('test-results',{recursive:true});
  writeFileSync(authPath,JSON.stringify({cookies:[],origins:[]}));
  writeFileSync(journalPath,JSON.stringify({module:process.env.PHASE3_MODULE,stage:process.env.PHASE3_STAGE,company:company(),setupComplete:false,events:[],constraints:['QA-prefixed fixtures only','no real email/payment dispatch','no existing-staff credential/access changes','restore captured stock/settings baselines']},null,2));
  await guard(context,info);await signIn(page);await context.storageState({path:authPath});const j=JSON.parse(readFileSync(journalPath,'utf8'));j.setupComplete=true;writeFileSync(journalPath,JSON.stringify(j,null,2));
});
