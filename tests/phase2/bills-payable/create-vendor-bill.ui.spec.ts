import {test,billScenario} from './support/bills';
test('F17-a vendor bill linked to received PO with dates reference and balance',async({page},info)=>billScenario(page,info,'create'));
test('F17-a direct QA supplier bill core persistence without a PO prerequisite',async({page},info)=>billScenario(page,info,'direct'));
