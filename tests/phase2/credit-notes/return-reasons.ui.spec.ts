import {test,creditScenario} from './support/credit';
test('F13-b product return billing correction and concession reason logging',async({page},info)=>creditScenario(page,info,'reason'));
