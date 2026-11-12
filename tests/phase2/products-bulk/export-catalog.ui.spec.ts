import {test,verifyExport} from './support/catalog';
test('F02-j CSV export contains the complete catalogue, not only the visible page',async({page},info)=>verifyExport(page,info,'CSV'));
test('F02-j JSON export contains the complete catalogue',async({page},info)=>verifyExport(page,info,'JSON'));
