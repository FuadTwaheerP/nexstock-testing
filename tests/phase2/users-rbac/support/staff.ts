import {type Page,type TestInfo} from 'playwright/test';
import {test,expect,main,route,proof,record,blocked} from '../../support/phase2';
import {readRoute} from '../../support/observed';
export {test,expect};
const teamPath='/app/api/v1/company/members',fakeId='900000001';
async function observe(page:Page,info:TestInfo,id:string,reason:string):Promise<never>{info.annotations.push({type:'mock-observation',description:id+': '+reason});await proof(page,info,id);throw new Error('[MOCK-OBSERVATION] '+id+': '+reason);}
async function mockTeam(page:Page,info:TestInfo){
 info.annotations.push({type:'test-scope',description:'mocked-staff-ui'});const real=await readRoute(page,'/users-roles',teamPath),baseline=structuredClone(real),token='QA-MOCK-'+Date.now().toString(36),email='qa.staff.'+token.toLowerCase()+'@example.invalid';let invitation:any,member:any;const calls:any[]=[];
 const response=(data:any)=>({status:200,contentType:'application/json',body:JSON.stringify({success:true,code:200,data})});
 await page.context().route('**/app/api/v1/company/**',async intercepted=>{
  const r=intercepted.request(),path=new URL(r.url()).pathname,method=r.method();
  if(method==='GET'&&path===teamPath)return intercepted.fulfill(response({...baseline,members:[...(baseline.members||[]),...(member?[member]:[])],invitations:[...(baseline.invitations||[]),...(invitation?[invitation]:[])]}));
  if(['GET','HEAD','OPTIONS'].includes(method))return intercepted.continue();
  const data=r.postDataJSON()||{};calls.push({method,path,data});record({category:'mocked-write',test:info.title,method,path,data});
  if(method==='POST'&&path==='/app/api/v1/company/invitations'){
   expect(data.email).toBe(email);expect(['admin','manager','staff']).toContain(data.role);invitation={id:token,email,role:data.role,jobTitle:data.job_title,invitedBy:'QA mock sender',expiresAt:new Date(Date.now()+7*86400000).toISOString(),createdAt:new Date().toISOString()};return intercepted.fulfill(response(invitation));
  }
  if(invitation&&path==='/app/api/v1/company/invitations/'+token+'/resend'&&method==='POST')return intercepted.fulfill(response(invitation));
  if(invitation&&path==='/app/api/v1/company/invitations/'+token&&method==='DELETE'){invitation=undefined;return intercepted.fulfill(response({}));}
  if(member&&path===teamPath+'/'+fakeId&&method==='PATCH'){expect(Object.keys(data).every(k=>['role','job_title'].includes(k))).toBe(true);if(data.role)member.role=data.role;if(data.job_title!==undefined)member.jobTitle=data.job_title;return intercepted.fulfill(response(member));}
  if(member&&method==='POST'&&[teamPath+'/'+fakeId+'/suspend',teamPath+'/'+fakeId+'/reactivate'].includes(path)){member.status=path.endsWith('/suspend')?'suspended':'active';return intercepted.fulfill(response(member));}
  if(member&&method==='DELETE'&&path===teamPath+'/'+fakeId){member=undefined;return intercepted.fulfill(response({}));}
  record({category:'unexpected-write',test:info.title,method,path,reason:'Unrecognized staff mock write was prevented'});await intercepted.abort('blockedbyclient');throw new Error('Never forward an unrecognized staff mock mutation: '+method+' '+path);
 });
 const fakeJoinUrl=new URL(page.url());fakeJoinUrl.search='';fakeJoinUrl.searchParams.set('qa_mock_join',token);
 await page.context().route('**/app/users-roles?qa_mock_join=*',async intercepted=>{
  const url=new URL(intercepted.request().url());if(intercepted.request().isNavigationRequest()&&url.searchParams.get('qa_mock_join')===token&&invitation){member={id:fakeId,userId:'900000002',firstName:'QA Mock',lastName:'Staff',email,businessEmail:email,businessPhone:'+23050000000',jobTitle:invitation.jobTitle,role:invitation.role,status:'active',joinedAt:new Date().toISOString(),isYou:false};invitation=undefined;}
  await intercepted.continue();
 });
 await info.attach('mock-scope',{body:JSON.stringify({fakeJoinUrl:fakeJoinUrl.href,email,scope:'The harness simulates acceptance; this uses the owner session and actual Members UI. No production join token, staff login or authorization enforcement is certified.'}),contentType:'application/json'});
 const fresh=async()=>{await route(page,'/users-roles');await expect(main(page).getByRole('heading',{name:'Users & Roles',exact:true})).toBeVisible();};
 return {email,token,fakeJoinUrl:fakeJoinUrl.href,calls,fresh,baseline,get member(){return member;},get invitation(){return invitation;},assertOwnerUnchanged:async()=>{expect(real).toEqual(baseline);await page.context().unroute('**/app/api/v1/company/**');const actual=await readRoute(page,'/users-roles',teamPath);const members=(r:any)=>r.members.map((m:any)=>({id:String(m.id),role:m.role,status:m.status,email:m.email}));expect(members(actual)).toEqual(members(baseline));expect(actual.invitations.map((i:any)=>String(i.id))).toEqual((baseline.invitations||[]).map((i:any)=>String(i.id)));await info.attach('real-members-unchanged',{body:JSON.stringify({memberCount:actual.members.length,invitationCount:actual.invitations.length,productionStateUnchanged:true,mockWritesForwarded:0}),contentType:'application/json'});}};
}
const row=(page:Page,email:string)=>main(page).getByRole('row').filter({has:page.getByRole('cell',{name:email,exact:true})});
async function invite(page:Page,info:TestInfo,m:Awaited<ReturnType<typeof mockTeam>>){
 await m.fresh();await main(page).getByRole('button',{name:'Invite member',exact:true}).click();const d=page.getByRole('dialog',{name:'Invite someone to this business',exact:true});await d.getByRole('textbox',{name:'Email',exact:true}).fill(m.email);await d.getByRole('textbox',{name:/Job title/}).fill('QA mock cashier');await d.getByRole('button',{name:'Send invitation',exact:true}).click();await expect(d).toBeHidden();await expect(row(page,m.email)).toContainText('Staff');expect(m.invitation.role).toBe('staff');expect(m.calls.filter(c=>c.path.endsWith('/invitations'))).toHaveLength(1);await proof(page,info,'mock-pending-invitation');
}
async function join(page:Page,info:TestInfo,m:Awaited<ReturnType<typeof mockTeam>>){await invite(page,info,m);await page.goto(m.fakeJoinUrl,{waitUntil:'domcontentloaded'});await expect(row(page,m.email)).toContainText('QA Mock Staff');await expect(row(page,m.email)).toContainText('Active');expect(m.invitation).toBeUndefined();expect(m.member.isYou).toBe(false);await proof(page,info,'mock-join-handoff-member');}
export async function predefinedRoles(page:Page,info:TestInfo){
 await readRoute(page,'/users-roles',teamPath);await main(page).getByRole('button',{name:'Invite member',exact:true}).click();const d=page.getByRole('dialog',{name:'Invite someone to this business',exact:true});await d.getByRole('combobox',{name:'Role',exact:true}).click();const options=await page.getByRole('option').allTextContents();expect(options.map(x=>x.trim()).sort()).toEqual(['Admin','Manager','Staff'].sort());await info.attach('live-predefined-role-controls',{body:JSON.stringify({options,scope:'Live owner invitation role choices only; backend role enforcement is unverified.'}),contentType:'application/json'});await page.keyboard.press('Escape');await d.getByRole('button',{name:'Cancel',exact:true}).click();await proof(page,info,'live-role-choices');
}
export async function staffScenario(page:Page,info:TestInfo,mode:string){
 info.setTimeout(240_000);const m=await mockTeam(page,info);
 try{
  if(mode==='revoke-invite'){await invite(page,info,m);await row(page,m.email).locator('button:has(svg.lucide-rotate-ccw)').click();await expect.poll(()=>m.calls.filter(c=>c.path.endsWith('/resend')).length).toBe(1);await row(page,m.email).locator('button:has(svg.lucide-trash2)').click();await expect(row(page,m.email)).toBeHidden();expect(m.invitation).toBeUndefined();return;}
  await join(page,info,m);if(mode==='join')return;
  await row(page,m.email).getByRole('combobox').click();await page.getByRole('option',{name:'Manager',exact:true}).click();await expect(row(page,m.email).getByRole('combobox')).toContainText('Manager');expect(m.member.role).toBe('manager');
  if(mode==='profile'){
   await info.attach('mock-member-editor',{body:await main(page).ariaSnapshot(),contentType:'text/plain'});await observe(page,info,'P2-STAFF-OBS-001','With a simulated active non-owner member, deployed UI supports inline role changes but has no name/phone profile editor or password-reset action. This UI observation is not live account/credential verification.');
  }
  if(mode==='branch'){
   const memberUi=await main(page).ariaSnapshot();await route(page,'/stores');await main(page).getByRole('heading',{name:'QA Inspection Store 20261017',exact:true}).locator('xpath=ancestor::*[@data-slot="card"][1]').getByRole('button',{name:'Edit Store',exact:true}).click();const d=page.getByRole('dialog',{name:'Edit Store Branch',exact:true});await info.attach('branch-assignment-surfaces',{body:JSON.stringify({memberUi,branchEditor:await d.ariaSnapshot()}),contentType:'application/json'});await observe(page,info,'P2-STAFF-OBS-002','No branch assignment selector appears in the deployed invite/member UI or QA branch editor, including with simulated Manager staff. Production branch restriction enforcement remains unverified.');
  }
  await row(page,m.email).locator('button:has(svg.lucide-user-minus)').click();await expect(row(page,m.email)).toContainText('Suspended');expect(m.member.status).toBe('suspended');await proof(page,info,'mock-member-suspended');await row(page,m.email).locator('button:has(svg.lucide-user-check)').click();await expect(row(page,m.email)).toContainText('Active');page.once('dialog',d=>d.accept());await row(page,m.email).locator('button:has(svg.lucide-trash2)').click();await expect(row(page,m.email)).toBeHidden();expect(m.member).toBeUndefined();
 }finally{await m.assertOwnerUnchanged();await info.attach('mock-only-write-register',{body:JSON.stringify(m.calls),contentType:'application/json'});}
}
