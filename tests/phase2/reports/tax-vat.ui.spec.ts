import {test,reportScenario} from './support/reports';
test('F20-e standard zero-rated and net VAT fiscal report',async({page},info)=>reportScenario(page,info,'tax'));
