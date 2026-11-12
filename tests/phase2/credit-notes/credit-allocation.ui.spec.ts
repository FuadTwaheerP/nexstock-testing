import {test,creditScenario} from './support/credit';
test('F13-d credit allocation and cash refund entry points',async({page},info)=>creditScenario(page,info,'allocation'));
