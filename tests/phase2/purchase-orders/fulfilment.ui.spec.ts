import {test,poScenario} from './support/purchasing';
test('F15-d partial then full receipt closes fulfillment',async({page},info)=>poScenario(page,info,'fulfilment'));
