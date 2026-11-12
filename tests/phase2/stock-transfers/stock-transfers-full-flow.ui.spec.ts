import {test,transferCheck} from './support/transfers';
test('Stock transfer request dispatch receipt and ledger full flow @full-flow',async({page},info)=>transferCheck(page,info,'Create draft before dispatch and receiving'));
