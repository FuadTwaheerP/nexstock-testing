import {test,auditScenario} from './support/audit';
test('QA creation modification deletion export and fresh audit full flow @full-flow',async({page},info)=>auditScenario(page,info,'full'));
