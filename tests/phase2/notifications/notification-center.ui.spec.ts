import {test,notificationScenario} from './support/notifications';
test('F29-a header bell unread badge panel and full-center navigation',async({page},info)=>notificationScenario(page,info,'bell'));
test('F29-a own new alert display read persistence and linked product navigation',async({page},info)=>notificationScenario(page,info,'center'));
test('F29-a notification type and priority filtering',async({page},info)=>notificationScenario(page,info,'filters'));
