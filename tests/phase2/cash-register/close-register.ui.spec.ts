import {test,registerScenario} from './support/register';
test('F09-c balanced drawer closure',async({page},info)=>registerScenario(page,info,'close-balanced'));
test('F09-c overage calculation and confirmation',async({page},info)=>registerScenario(page,info,'close-over'));
test('F09-c shortage calculation and confirmation',async({page},info)=>registerScenario(page,info,'close-short'));
