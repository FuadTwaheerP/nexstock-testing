import {test,templateScenario} from './support/templates';
test('F22-c Modern and Classic style persistence',async({page},info)=>templateScenario(page,info,'style'));
test('F22-c invoice quotation and 80mm thermal document presets',async({page},info)=>templateScenario(page,info,'presets'));
