import {test,activity} from './support/dashboard';
test('F01-e recent feed includes sales and stock activity',async({page},info)=>activity(page,info));
