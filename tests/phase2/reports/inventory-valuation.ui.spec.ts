import {test,reportScenario} from './support/reports';
test('F20-c complete inventory valuation at cost across catalogue',async({page},info)=>reportScenario(page,info,'valuation-current'));
test('F20-c valuation includes newly counted later-page QA inventory',async({page},info)=>reportScenario(page,info,'valuation'));
test('F20-c positive cost-value change from an owned QA branch adjustment',async({page},info)=>reportScenario(page,info,'valuation-live'));
