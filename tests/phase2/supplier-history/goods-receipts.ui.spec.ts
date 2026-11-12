import {test,supplierHistory} from './support/history';
test('F18-d supplier history retains received shipment linkage',async({page},info)=>supplierHistory(page,info,'receipts'));
