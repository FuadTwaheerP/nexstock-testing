import {test,reportScenario} from './support/reports';
test('Standard reporting and actual export full flow @full-flow',async({page},info)=>reportScenario(page,info,'full'));
