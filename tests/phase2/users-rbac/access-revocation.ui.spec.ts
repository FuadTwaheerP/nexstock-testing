import {test,staffScenario} from './support/staff';
test('F23-c MOCK member suspend reactivate and remove UI',async({page},info)=>staffScenario(page,info,'access'));
