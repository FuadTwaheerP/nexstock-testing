import {test} from '../support/phase2';
import {holdScenario} from './support/hold';
test('F08-j hold a QA service cart and display it after reload',async({page},info)=>holdScenario(page,info));
