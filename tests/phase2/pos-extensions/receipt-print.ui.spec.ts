import {test,receiptScenario} from './support/fiscal';
test('F08-k cash receipt matches the recorded QA sale and invokes printing',async({page},info)=>receiptScenario(page,info));
