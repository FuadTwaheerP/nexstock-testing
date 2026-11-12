import {test,poScenario} from './support/purchasing';
test('Purchase order supplier approval partial and final receipt full flow @full-flow',async({page},info)=>poScenario(page,info,'full'));
