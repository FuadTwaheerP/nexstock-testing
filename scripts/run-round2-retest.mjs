import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,existsSync,createWriteStream} from 'node:fs';
import {resolve,join} from 'node:path';

const root=resolve(process.env.PHASE2_ARCHIVE_ROOT||'blob-report/archive/round2-retest-2026-10-26');
const plan=JSON.parse(readFileSync('data/phase2-plan.json','utf8'));
const resume=process.argv.includes('--resume');
const selected=process.argv.slice(2).filter(a=>a!=='--resume');
if(!selected.length||selected.some(name=>!plan.modules.some(m=>m.slug===name)))throw new Error('Supply module slugs from the Phase 2 plan.');
mkdirSync(root,{recursive:true});
const manifestPath=join(root,'campaign.json');
if(existsSync(manifestPath)&&!resume)throw new Error('Campaign already exists; pass --resume to append evidence without replacing history.');
const manifest=existsSync(manifestPath)?JSON.parse(readFileSync(manifestPath,'utf8')):{started:new Date().toISOString(),scope:process.env.RETEST_SCOPE||'Fresh production verification of latest Phase 2 tickets. Historical assessments excluded.',modules:[]};
manifest.pid=process.pid;delete manifest.finished;delete manifest.stopped;
writeFileSync(manifestPath,JSON.stringify(manifest,null,2));
async function run(script,args,logPath){
 const log=createWriteStream(logPath);
 const p=spawn(process.execPath,[script,...args],{env:{...process.env,PHASE2_ARCHIVE_ROOT:root},stdio:['ignore','pipe','pipe']});
 for(const stream of [p.stdout,p.stderr])stream.on('data',d=>log.write(d));
 const code=await new Promise((done,reject)=>{p.on('error',reject);p.on('close',done);});
 await new Promise(done=>log.end(done));return code;
}
for(const slug of selected){
 if(existsSync(join(root,'STOP_REQUESTED'))){manifest.stopped='Stop requested before next module';break;}
 console.log('START '+slug);
 const item={slug,started:new Date().toISOString()};manifest.modules.push(item);writeFileSync(manifestPath,JSON.stringify(manifest,null,2));
 item.exitCode=await run('scripts/run-phase2.mjs',[slug],join(root,slug+'-campaign-console.log'));
 item.assessmentCode=await run('scripts/assess-phase2.mjs',[slug],join(root,slug+'-campaign-assessment.log'));
 const assessment=JSON.parse(readFileSync(join(root,slug+'-assessment.json'),'utf8'));
 item.counts=assessment.counts;item.bugs=assessment.bugs;item.finished=new Date().toISOString();
 writeFileSync(manifestPath,JSON.stringify(manifest,null,2));console.log('DONE '+JSON.stringify(item));
 const support=assessment.cases.filter(c=>['phase2-setup','phase2-cleanup'].includes(c.project));
 if(support.length!==2||support.some(c=>c.status!=='PASS')){console.log('STOP: review failed setup/cleanup before the next module.');process.exitCode=1;break;}
}
manifest.finished=new Date().toISOString();writeFileSync(manifestPath,JSON.stringify(manifest,null,2));
