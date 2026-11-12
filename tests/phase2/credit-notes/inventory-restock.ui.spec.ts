import {test,creditScenario} from './support/credit';
test('F13-c optional return to warehouse stock',async({page},info)=>creditScenario(page,info,'restock'));
