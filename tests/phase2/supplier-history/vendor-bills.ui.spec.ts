import {test,supplierHistory} from './support/history';
test('F18-d supplier complete ledger includes an owned unpaid bill',async({page},info)=>supplierHistory(page,info,'bills'));
