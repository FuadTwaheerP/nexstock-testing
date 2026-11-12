import {test,countScenario} from './support/counts';
test('F06-a counted quantity and frozen expectation survive reload',async({page},info)=>countScenario(page,info,'entry'));
