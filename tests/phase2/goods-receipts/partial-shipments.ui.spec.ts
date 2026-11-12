import {test,receiptScenario} from './support/receipts';
test('F16-b multiple deliveries retain received quantities and close outstanding balance',async({page},info)=>receiptScenario(page,info,'partial'));
