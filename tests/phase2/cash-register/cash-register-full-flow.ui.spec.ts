import {test,registerScenario} from './support/register';
test('Register opening cash movements checkout reporting and closure full flow @full-flow',async({page},info)=>registerScenario(page,info,'full'));
