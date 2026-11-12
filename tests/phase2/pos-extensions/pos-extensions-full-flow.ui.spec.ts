import {test} from '../support/phase2';
import {holdScenario} from './support/hold';
import {formalScenario} from './support/fiscal';
test('POS hold resume checkout and formal invoice full flow @full-flow',async({page},info)=>{
 info.setTimeout(300_000);await holdScenario(page,info);await formalScenario(page,info,true);
});
