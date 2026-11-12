import {test,supplierHistory} from './support/history';
test('F18-d supplier history retains its own purchase order',async({page},info)=>supplierHistory(page,info,'orders'));
