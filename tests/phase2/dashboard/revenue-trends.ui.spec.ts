import {test,revenueChart,periods} from './support/dashboard';
test('F01-b saved revenue trend renders the selected sales data source',async({page},info)=>revenueChart(page,info));
test('F01-b daily weekly and monthly sales periods can be selected',async({page},info)=>periods(page,info));
