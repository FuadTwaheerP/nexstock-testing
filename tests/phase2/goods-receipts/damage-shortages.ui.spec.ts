import {test,receiptScenario} from './support/receipts';
test('F16-d rejected damaged quantity reason persistence and stock exclusion',async({page},info)=>receiptScenario(page,info,'damage'));
