import {test,transferCheck} from './support/transfers';
test('F05-d own pending and completed transfer ledger history',async({page},info)=>transferCheck(page,info,'Independent ledger fixture prerequisite'));
