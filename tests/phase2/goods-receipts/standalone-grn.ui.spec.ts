import {test,receiptScenario} from './support/receipts';
test('F16-a separate no-PO GRN needs only supplier product and quantity',async({page},info)=>receiptScenario(page,info,'grn-minimal'));
