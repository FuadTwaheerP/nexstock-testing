import {test,receiptScenario} from './support/receipts';
test('Purchase order acceptance damage and stock receipt full flow @full-flow',async({page},info)=>receiptScenario(page,info,'full'));
