import {test,quoteScenario} from './support/quotations';
test('F11-a customer items negotiated price discount and expiry persist independently',async({page},info)=>quoteScenario(page,info,'create'));
