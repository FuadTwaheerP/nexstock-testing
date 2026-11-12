import {test,staffScenario} from './support/staff';
test('F23-a MOCK invitation payload pending list and fake join URL handoff',async({page},info)=>staffScenario(page,info,'join'));
test('F23-a MOCK invitation resend and revoke UI',async({page},info)=>staffScenario(page,info,'revoke-invite'));
