import {request} from 'playwright';
import {loadEnvFile} from 'node:process';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
loadEnvFile('.env');
const target=new URL(process.env.BASE_URL);
if(target.origin!=='https://nexstock.stylotech.mu')throw new Error('Unexpected production target');
const context=await request.newContext({extraHTTPHeaders:{'Cache-Control':'no-cache'}});
try{
 const response=await context.get(target.href,{timeout:90_000});
 if(!response.ok())throw new Error('Public app HTML HTTP '+response.status());
 const html=await response.text(),assets=[];
 for(const match of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)){
  const url=new URL(match[1],response.url());
  if(url.origin!==target.origin||!/^\/app\/assets\/index-[\w-]+\.js$/.test(url.pathname))continue;
  const source=await context.get(url.href,{timeout:120_000});if(!source.ok())throw new Error('Public asset HTTP '+source.status());
  const bytes=await source.body();assets.push({path:url.pathname,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
 }
 if(!assets.length)throw new Error('No deployed main app asset was observed');
 const baseline=process.env.RETEST_BASELINE_SHA256||'fc08fb2957a2fb9595829709b75d88bc102d62df496cbe4b15318af9cf593591';
 const result={checkedAt:new Date().toISOString(),target:target.href,assets,previousMainBundleSha256:baseline,frontendChanged:assets.some(a=>a.sha256!==baseline),scope:'Publicly served frontend fingerprint only; not a deployment-matched commit or backend migration certificate.'};
 const out=resolve(process.env.RETEST_DEPLOYMENT_ROOT||'blob-report/archive/phase1-round2-2026-10-26');mkdirSync(out,{recursive:true});writeFileSync(out+'/public-deployment.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await context.dispose();}
