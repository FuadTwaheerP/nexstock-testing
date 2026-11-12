import {test,salesMetrics,profitability} from './support/dashboard';
test('F01-a revenue orders and AOV widgets bind hydrated values and reconcile the ratio',async({page},info)=>salesMetrics(page,info));
test('F01-a gross profit and net margin KPI metrics are available',async({page},info)=>profitability(page,info));
