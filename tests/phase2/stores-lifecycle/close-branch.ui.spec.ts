import {test,closure} from './support/branches';
test('F03-f closing an owned QA branch preserves its identifier and details',async({page},info)=>closure(page,info));
test('F03-f active-location count reconciles after adding and closing only a QA branch',async({page},info)=>closure(page,info,true));
