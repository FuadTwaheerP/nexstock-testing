import {test,creditScenario} from './support/credit';
test('F13-e official linked credit voucher print and PDF',async({page},info)=>creditScenario(page,info,'pdf'));
