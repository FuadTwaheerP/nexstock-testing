import {test,lowStock} from './support/dashboard';
test('F01-d low stock rows independently breach their displayed thresholds',async({page},info)=>lowStock(page,info));
