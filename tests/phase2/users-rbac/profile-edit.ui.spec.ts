import {test,staffScenario} from './support/staff';
test('F23-b MOCK member role edit and profile/password action inventory',async({page},info)=>staffScenario(page,info,'profile'));
