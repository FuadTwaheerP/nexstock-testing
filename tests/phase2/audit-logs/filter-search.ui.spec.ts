import {test,auditScenario} from './support/audit';
test('F25-b Products module filter returns matching persisted entries',async({page},info)=>auditScenario(page,info,'module'));
test('F25-b user text search returns matching persisted audit entries',async({page},info)=>auditScenario(page,info,'search'));
test('F25-b user module and action-type filter controls',async({page},info)=>auditScenario(page,info,'filters'));
test('F25-b explicit custom date range filtering',async({page},info)=>auditScenario(page,info,'date'));
