import {test,receiptScenario} from './support/receipts';
test('F16-a receive accepted items against an isolated approved QA purchase order',async({page},info)=>receiptScenario(page,info,'receive'));
