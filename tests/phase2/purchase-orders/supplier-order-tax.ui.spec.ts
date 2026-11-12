import {test,expect,main,route,proof} from '../support/phase2';
import {vendor} from './support/purchasing';
test('Release supplier-specific order uses an entered tax amount instead of flat ten percent',async({page},info)=>{
 const v=await vendor(page,info);await route(page,'/suppliers/new-order?supplierId='+v.id);await expect(main(page).getByRole('heading',{name:'New Purchase Order',exact:true})).toBeVisible();
 await expect(main(page)).toContainText(v.name);const tax=main(page).getByRole('spinbutton',{name:'Tax',exact:true});await expect(tax).toHaveValue('0');
 for(const amount of ['7.35','27.40']){await tax.fill(amount);await expect(main(page).getByText('Total',{exact:true}).locator('..')).toContainText('Rs '+amount);}
 await proof(page,info,'entered-supplier-order-tax');await info.attach('tax-scope',{body:'Read-only form arithmetic with no order lines: an entered tax amount contributes the same amount to the total. No order is submitted; persisted tax with product lines is outside this control check.',contentType:'text/plain'});
});
