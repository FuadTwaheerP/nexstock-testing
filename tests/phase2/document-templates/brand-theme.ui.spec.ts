import {test,templateScenario} from './support/templates';
test('F22-a primary and secondary brand theme controls',async({page},info)=>templateScenario(page,info,'branding'));
test('F22-a choose and display an unsaved company logo while preserving saved settings',async({page},info)=>templateScenario(page,info,'logo'));
test('F22-a saved primary theme applies to a newly generated actual QA invoice',async({page},info)=>templateScenario(page,info,'integration'));
