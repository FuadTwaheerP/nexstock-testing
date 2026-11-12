import {test,quoteScenario} from './support/quotations';
test('Quotation creation review status conversion full flow @full-flow',async({page},info)=>quoteScenario(page,info,'full'));
