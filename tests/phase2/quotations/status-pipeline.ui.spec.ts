import {test,quoteScenario} from './support/quotations';
test('F11-d saved draft exposes status pipeline',async({page},info)=>quoteScenario(page,info,'status'));
