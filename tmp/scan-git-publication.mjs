import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const staged=process.argv.includes('--staged');
const files=[...new Set(execFileSync('git',staged?['diff','--cached','--name-only','--diff-filter=ACMR','-z']:['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean))];
const unquote=value=>{const s=value.trim();return [34,39].includes(s.charCodeAt(0))&&s.charCodeAt(0)===s.charCodeAt(s.length-1)?s.slice(1,-1):s;};
const secrets=readFileSync('.env','utf8').split(/\r?\n/).filter(l=>/^[A-Z_]*(PASSWORD|SECRET|TOKEN|PRIVATE_KEY)[A-Z_]*=/.test(l)).map(l=>unquote(l.slice(l.indexOf('=')+1))).filter(v=>v.length>=6);
const matches=[],sensitiveNames=[],largeFiles=[];let bytes=0;
for(const file of files){
 if(!existsSync(file))continue;const content=staged?execFileSync('git',['show',':'+file],{maxBuffer:100*1024*1024}):readFileSync(file);bytes+=content.length;
 if(content.length>50*1024*1024)largeFiles.push({file,bytes:content.length});
 if(/(?:^|\/)(?:\.env(?!\.example)|[^/]*(?:auth|storage-state|credentials|private-key)[^/]*\.json$|id_rsa$|.*\.(?:pem|p12|key)$)/i.test(file))sensitiveNames.push(file);
 if(secrets.some(secret=>content.includes(Buffer.from(secret))))matches.push(file);
 if(/\.(?:md|mjs|ts|js|json|yml|txt|example)$/.test(file)){
  const text=content.toString('utf8');
  if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|AKIA[A-Z0-9]{16}/.test(text))matches.push(file);
 }
}
console.log(JSON.stringify({staged,candidateFiles:files.length,totalMB:Math.round(bytes/1024/1024*100)/100,knownOrRecognizableSecretMatches:[...new Set(matches)],sensitiveFilenameReview:sensitiveNames,largeFiles},null,2));
if(matches.length)process.exitCode=1;
