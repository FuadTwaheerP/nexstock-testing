import {test,ranking} from './support/dashboard';
test('F01-c top products exposes quantity and revenue performance',async({page},info)=>ranking(page,info));
