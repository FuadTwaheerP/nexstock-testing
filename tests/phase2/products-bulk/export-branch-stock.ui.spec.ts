import {test,verifyBranchStockExport} from './support/catalog';
test('F02-j CSV export displays every branch stock column and a reconciled company total',async({page},info)=>verifyBranchStockExport(page,info));
