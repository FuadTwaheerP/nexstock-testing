import {test,reportScenario} from './support/reports';
test('F20-f actual CSV download arithmetic and browser export history',async({page},info)=>reportScenario(page,info,'csv'));
test('F20-f standard report PDF export availability',async({page},info)=>reportScenario(page,info,'pdf'));
test('Reports honor the confirmed Rs currency prefix',async({page},info)=>reportScenario(page,info,'currency'));
