import {test,reportScenario} from './support/reports';
test('F20-d complete depleted and critical stock report',async({page},info)=>reportScenario(page,info,'low-stock'));
