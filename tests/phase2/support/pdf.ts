import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {homedir} from 'node:os';
import {resolve} from 'node:path';
import {type TestInfo} from 'playwright/test';
import {expect} from './phase2';
export async function verifyPDF(path:string,info:TestInfo,required:string[]){
 const b=readFileSync(path);expect(b.subarray(0,5).toString()).toBe('%PDF-');expect(b.toString('latin1').slice(-1024)).toContain('%%EOF');const bundled=resolve(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe');
 const data=JSON.parse(execFileSync(process.env.PDF_PYTHON||(existsSync(bundled)?bundled:'python'),[resolve('scripts/inspect-phase2-pdf.py'),path],{encoding:'utf8',timeout:30_000}));expect(data.pages).toBeGreaterThan(0);for(const text of required)expect(data.text).toContain(text);await info.attach('parsed-pdf-content',{body:JSON.stringify(data),contentType:'application/json'});return data;
}
