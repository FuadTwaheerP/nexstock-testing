import {test,branchScope} from './support/dashboard';
test('F01-f dashboard can isolate a branch instead of only comparing branches',async({page},info)=>branchScope(page,info));
