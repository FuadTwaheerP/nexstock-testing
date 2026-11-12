import {test,billScenario} from './support/bills';
test('F17-b record manual Cash Bank Transfer and Cheque installments to zero balance',async({page},info)=>billScenario(page,info,'payments'));
test('F17-b record transaction reference with bank or cheque payment',async({page},info)=>billScenario(page,info,'reference'));
