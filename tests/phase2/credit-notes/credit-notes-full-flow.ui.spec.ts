import {test,creditScenario} from './support/credit';
test('Linked invoice credit creation allocation full flow @full-flow',async({page},info)=>creditScenario(page,info,'full'));
