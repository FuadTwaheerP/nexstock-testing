import {test,quoteScenario} from './support/quotations';
test('F11-b custom payment terms notes and individual line discounts',async({page},info)=>quoteScenario(page,info,'terms'));
