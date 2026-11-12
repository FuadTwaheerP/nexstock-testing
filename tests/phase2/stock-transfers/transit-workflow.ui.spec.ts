import {test,transferCheck} from './support/transfers';
test('F05-b draft to in-transit progression',async({page},info)=>transferCheck(page,info,'Independent draft fixture prerequisite'));
