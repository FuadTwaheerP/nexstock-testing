import {test,staffScope} from './support/branches';
test('F03-e cashier and manager branch restrictions require an activated QA staff fixture',async({page},info)=>staffScope(page,info));
