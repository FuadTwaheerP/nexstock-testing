import {test,supplierHistory} from './support/history';
test('F18-d supplier complete ledger includes an owned partial outgoing cash payment',async({page},info)=>supplierHistory(page,info,'payments'));
