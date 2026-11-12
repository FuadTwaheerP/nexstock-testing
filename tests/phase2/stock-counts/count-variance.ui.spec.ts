import {test,countScenario} from './support/counts';
test('F06-b surplus quantity and cost variance',async({page},info)=>countScenario(page,info,'variance',2));
test('F06-b shortage quantity and cost variance',async({page},info)=>countScenario(page,info,'variance',-1));
