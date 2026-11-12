import {test,quoteScenario} from './support/quotations';
test('F11-c saved quotation branded PDF and print entry point',async({page},info)=>quoteScenario(page,info,'pdf'));
