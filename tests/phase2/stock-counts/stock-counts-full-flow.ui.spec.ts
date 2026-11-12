import {test,countScenario} from './support/counts';
test('Physical count entry variance and stock reconciliation full flow @full-flow',async({page},info)=>countScenario(page,info,'full'));
