import {test,poScenario} from './support/purchasing';
test('F15-b draft approve and mark ordered without sending supplier email',async({page},info)=>poScenario(page,info,'status'));
