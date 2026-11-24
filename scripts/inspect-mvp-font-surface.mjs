import {chromium} from 'playwright';
import {loadEnvFile} from 'node:process';
import {writeFileSync,mkdirSync} from 'node:fs';
import {validateProductTestTarget,appPath} from '../helpers/safety.mjs';
loadEnvFile('.env');validateProductTestTarget(process.env.BASE_URL);
const root='blob-report/archive/final-mvp-2026-11-13/discovery';mkdirSync(root,{recursive:true});
const browser=await chromium.launch();
try{
 const context=await browser.newContext({viewport:{width:1920,height:1080},serviceWorkers:'block'});let auth=true;
 await context.route('**/*',async route=>{const r=route.request(),u=new URL(r.url());if(['GET','HEAD','OPTIONS'].includes(r.method()))return route.continue();if(u.origin===new URL(process.env.BASE_URL).origin&&r.method()==='POST'&&(/\/auth\/refresh$/.test(u.pathname)||auth&&/\/auth\/(?:login|select-business|logout)$/.test(u.pathname)))return route.continue();return route.abort('blockedbyclient');});
 const page=await context.newPage();await page.goto(appPath('/login'));await page.getByLabel('Email Address',{exact:true}).fill(process.env.PRODUCT_TEST_EMAIL);await page.getByLabel('Password',{exact:true}).fill(process.env.PRODUCT_TEST_PASSWORD);await page.getByRole('button',{name:'Sign In',exact:true}).click();
 const company=process.env.PRODUCT_TEST_COMPANY||'Nexstock QA Company',chooser=page.getByRole('heading',{name:'Choose a business',exact:true}),selected=page.getByRole('banner').getByRole('button',{name:company,exact:true});await selected.or(chooser).first().waitFor({timeout:30000});if(await chooser.isVisible())await page.getByRole('button').filter({has:page.getByRole('heading',{name:company,exact:true})}).click();await selected.waitFor();auth=false;
 const reads=[];page.on('response',async r=>{const u=new URL(r.url());if(r.request().method()==='GET'&&u.pathname.endsWith('/settings/fonts')){try{reads.push({path:u.pathname,status:r.status(),body:await r.json()});}catch{}}});
 await page.goto(appPath('/settings'));await page.getByLabel('Company Name',{exact:true}).waitFor();const tabs=await page.getByRole('tab').allTextContents();const fontLoaded=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname.endsWith('/settings/fonts'));await page.getByRole('tab',{name:'Advanced',exact:true}).click();await(await fontLoaded).finished();await page.getByRole('heading',{name:'Custom Fonts',exact:true}).waitFor();const settings=await page.getByRole('main').ariaSnapshot();await page.screenshot({path:root+'/font-settings.png',fullPage:true});
 await page.goto(appPath('/products'));await page.getByRole('button',{name:'New Product',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Add New Product',exact:true});const productTabs=await dialog.getByRole('tab').allTextContents();await dialog.getByRole('tab',{name:/Custom/i}).click();const customization=await dialog.ariaSnapshot();await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
 writeFileSync(root+'/font-surface.json',JSON.stringify({settingsTabs:tabs,fontReads:reads,settings,productTabs,customization},null,2));console.log(root+'/font-surface.json');
}finally{await browser.close();}

