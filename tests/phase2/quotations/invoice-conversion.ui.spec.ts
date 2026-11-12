import {test,quoteScenario} from './support/quotations';
test('F11-e accepted quotation exposes tax invoice conversion',async({page},info)=>quoteScenario(page,info,'convert'));
