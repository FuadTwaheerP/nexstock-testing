import {test,creditScenario} from './support/credit';
test('F13-a save and reopen credit note linked to isolated QA invoice',async({page},info)=>creditScenario(page,info,'create'));
