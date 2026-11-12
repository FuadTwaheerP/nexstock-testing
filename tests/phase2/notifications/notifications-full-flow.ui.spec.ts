import {test,notificationScenario} from './support/notifications';
test('QA stock alerts read action overdue invoice and filter full flow @full-flow',async({page},info)=>notificationScenario(page,info,'full'));
