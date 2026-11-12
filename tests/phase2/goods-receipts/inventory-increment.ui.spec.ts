import {test,receiptScenario} from './support/receipts';
test('F16-c receipt increments warehouse stock and preserves other branch balances',async({page},info)=>receiptScenario(page,info,'stock'));
