import {test,transferCheck} from './support/transfers';
test('F05-a create source-to-destination transfer request',async({page},info)=>transferCheck(page,info,'Create transfer prerequisite'));
