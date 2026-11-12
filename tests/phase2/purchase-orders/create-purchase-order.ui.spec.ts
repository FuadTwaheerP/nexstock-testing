import {test,poScenario} from './support/purchasing';
test('F15-a supplier items costs delivery date currency and totals persist',async({page},info)=>poScenario(page,info,'create'));
test('F15-a select delivery warehouse or branch',async({page},info)=>poScenario(page,info,'location'));
