import {test,billScenario} from './support/bills';
test('Supplier receipt bill and installments full flow @full-flow',async({page},info)=>billScenario(page,info,'full'));
