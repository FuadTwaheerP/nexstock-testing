import {test,supplierHistory} from './support/history';
test('Supplier bill payment and transaction ledger full flow @full-flow',async({page},info)=>supplierHistory(page,info,'full'));
