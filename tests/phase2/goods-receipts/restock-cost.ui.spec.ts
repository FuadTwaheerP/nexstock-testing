import {test,receiptScenario} from './support/receipts';
test('F16-a standalone Restock line and estimated total use the QA purchase cost',async({page},info)=>receiptScenario(page,info,'cost'));
