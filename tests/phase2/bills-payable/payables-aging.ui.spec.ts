import {test,billScenario} from './support/bills';
test('F17-c upcoming liability and overdue payable visibility',async({page},info)=>billScenario(page,info,'aging'));
