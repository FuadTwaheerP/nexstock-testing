import {test,poScenario} from './support/purchasing';
test('F15-c actual purchase order PDF export',async({page},info)=>poScenario(page,info,'pdf'));
