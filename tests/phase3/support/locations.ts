import {type Page} from 'playwright/test';
import {readRoute} from './observed';
export async function branches(page:Page){const data=await readRoute(page,'/stores','/app/api/v1/branches');return Array.isArray(data)?data:data.data;}
