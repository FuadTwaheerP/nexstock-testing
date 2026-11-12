import {request} from 'playwright';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const deployment=JSON.parse(readFileSync('blob-report/archive/release-verification-2026-10-30/public-deployment.json','utf8'));
const asset=deployment.assets[0];if(!/^\/app\/assets\/index-[\w-]+\.js$/.test(asset.path))throw new Error('Unexpected public asset');
const context=await request.newContext();
try{const r=await context.get(new URL(asset.path,deployment.target).href,{timeout:120_000});if(!r.ok())throw new Error('Public asset HTTP '+r.status());const bytes=await r.body();if(createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw new Error('Deployment changed during inspection');const path='test-results/public-release-'+asset.path.split('/').at(-1);writeFileSync(path,bytes);console.log(path);}finally{await context.dispose();}
