import {test,notificationScenario} from './support/notifications';
test('F29-c immediate overdue alert for a newly issued unpaid past-due QA invoice',async({page},info)=>notificationScenario(page,info,'overdue'));
