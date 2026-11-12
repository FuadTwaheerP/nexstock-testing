import {test,registerScenario} from './support/register';
test('F09-d mid-shift X-report content and printing',async({page},info)=>registerScenario(page,info,'x-report'));
test('F09-d closed-shift Z-report content and printing',async({page},info)=>registerScenario(page,info,'z-report'));
