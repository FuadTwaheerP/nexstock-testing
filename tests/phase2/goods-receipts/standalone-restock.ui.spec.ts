import {test,receiptScenario} from './support/receipts';
test('F16-a standalone no-PO Restock adds only one QA item and preserves other branches',async({page},info)=>receiptScenario(page,info,'adhoc'));
