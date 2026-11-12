import {test,notificationScenario} from './support/notifications';
test('F29-b immediate low-stock alert from a unique threshold-crossing adjustment',async({page},info)=>notificationScenario(page,info,'low'));
test('F29-b immediate out-of-stock alert from a unique zero-stock adjustment',async({page},info)=>notificationScenario(page,info,'out'));
