import {test,registerScenario} from './support/register';
test('F09-b cash in with amount and reason',async({page},info)=>registerScenario(page,info,'cash-in'));
test('F09-b cash out with amount and reason',async({page},info)=>registerScenario(page,info,'cash-out'));
