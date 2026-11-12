import {test,templateScenario} from './support/templates';
test('Document theme content presets preview and actual invoice full flow @full-flow',async({page},info)=>templateScenario(page,info,'full'));
