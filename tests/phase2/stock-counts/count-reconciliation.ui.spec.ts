import {test,countScenario} from './support/counts';
test('F06-c committing a surplus count updates only its QA branch',async({page},info)=>countScenario(page,info,'reconcile',2));
test('F06-c committing a shortage count updates only its QA branch',async({page},info)=>countScenario(page,info,'reconcile',-1));
