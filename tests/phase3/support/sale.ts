import {type Page} from 'playwright/test';
import {expect,route,main,writeScope} from './phase3';
export async function sell(page:Page,p:any,amount:number){
 const result=await attemptSale(page,p,amount);expect(result.ok,'Owned QA cash sale HTTP '+result.status+': '+JSON.stringify(result.body)).toBe(true);return result.body.data;
}
export async function attemptSale(page:Page,p:any,amount:number){
 await route(page,'/pos');await page.getByPlaceholder('Search products or scan barcode…').fill(p.sku);const tile=main(page).getByRole('button').filter({has:page.getByText(p.sku,{exact:true})});await expect(tile).toBeEnabled();await tile.click();const cart=main(page).getByRole('complementary');await cart.getByRole('button',{name:/^Charge /}).click();const pay=page.getByRole('dialog',{name:'Complete Payment',exact:true});await pay.getByRole('spinbutton').fill(String(amount));
 return writeScope(page,'owned QA cash sale, no payment gateway',[/^\/app\/api\/v1\/pos\/sales$/],async()=>{const wait=page.waitForResponse(r=>r.request().method()==='POST'&&new URL(r.url()).pathname==='/app/api/v1/pos/sales');await pay.getByRole('button',{name:'Complete Sale',exact:true}).click();const r=await wait;return {ok:r.ok(),status:r.status(),body:await r.json(),request:r.request().postDataJSON()};});
}
