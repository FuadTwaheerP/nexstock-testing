import {test,transferCheck} from './support/transfers';
test('F05-c receiving reconciles both QA branch stock balances',async({page},info)=>transferCheck(page,info,'Independent shipment fixture prerequisite'));
