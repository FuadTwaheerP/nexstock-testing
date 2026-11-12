import {test,auditScenario} from './support/audit';
test('F25-a audit record creation with actor module timestamp and QA reference',async({page},info)=>auditScenario(page,info,'create'));
test('F25-a audit record modification in an isolated QA writer window',async({page},info)=>auditScenario(page,info,'update'));
test('F25-a audit deletion of a newly owned unused unpaid QA bill',async({page},info)=>auditScenario(page,info,'delete'));
test('F25-a log a real standard product CSV export operation',async({page},info)=>auditScenario(page,info,'export'));
