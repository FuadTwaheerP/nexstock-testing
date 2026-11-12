import { type Page,type TestInfo } from 'playwright/test';
import { test,expect,main,route,bug,number,proof } from '../../support/phase2';
export { test,expect,main,proof };
const modifiedLayout=new WeakSet<Page>();
export async function openDashboard(page:Page){
  const read=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/reporting/dashboard/stats',{timeout:60_000}).then(async r=>({ok:r.ok(),data:(await r.json()).data}));
  const [,response]=await Promise.all([route(page,'/'),read]);expect(response.ok,'Dashboard source must hydrate before assertions').toBe(true);
  const data=response.data;
  await expect(main(page).getByRole('heading',{name:'Dashboard',exact:true})).toBeVisible();
  if(modifiedLayout.has(page)){
    // Reset selects a built-in six-widget template rather than the original
    // empty layout. Remove only widgets created in this isolated test context
    // through their observed UI delete controls; do not reset business data.
    await main(page).getByRole('button',{name:/^Customize(?: Dashboard)?$/}).click();
    const remove=page.locator('button:has(svg.lucide-trash-2)');
    while(await remove.count()){const count=await remove.count();await remove.first().click();await expect(remove).toHaveCount(count-1);}
    await page.getByRole('button',{name:'Save Layout',exact:true}).click();
    modifiedLayout.delete(page);
  }
  await expect(main(page).getByText('Total Products',{exact:true})).toBeVisible();
  await expect(main(page).getByText(String(data.total_products),{exact:true}).first()).toBeVisible();
  return data;
}
export async function configure(page:Page,type:string){
  if(!await page.getByRole('heading',{name:'Dashboard Builder',exact:true}).isVisible()) await main(page).getByRole('button',{name:/^Customize(?: Dashboard)?$/}).click();
  await page.getByRole('button',{name:'Add Widget',exact:true}).first().click();
  const library=page.getByRole('dialog',{name:/^Widget Library$/i});await library.getByRole('heading',{name:type,exact:true}).click();
  const dialog=page.getByRole('dialog',{name:/^Configure New Widget$/i});await expect(dialog).toBeVisible();return dialog;
}
export async function addPreview(page:Page,type:string,source:RegExp,title:string){
  const dialog=await configure(page,type);await dialog.getByPlaceholder('Enter widget title',{exact:true}).fill(title);
  await dialog.getByRole('radio',{name:new RegExp(source.source,'i')}).check();await dialog.getByRole('button',{name:'Add Widget',exact:true}).click();
  await expect(dialog).toBeHidden();await expect(page.getByText(title,{exact:true})).toBeVisible();
  // Builder cards are configuration placeholders, not rendered widgets.
  await page.getByRole('button',{name:'Save Layout',exact:true}).click();
  await expect(main(page).getByRole('button',{name:/^Customize(?: Dashboard)?$/})).toBeVisible();
  modifiedLayout.add(page);
}
export async function salesMetrics(page:Page,info:TestInfo){
  const data=await openDashboard(page);
  const mismatches=[];
  for(const [metric,key,title] of [[/^Revenue /,'revenue','QA P2 Revenue'],[/^Total Orders /,'total_orders','QA P2 Orders'],[/^Avg\. Order Value /,'average_order_value','QA P2 AOV']] as const){
    await addPreview(page,'Stat Card',metric,title);
    const expected=Number(data[key]);expect(Number.isFinite(expected),'Hydrated numeric metric '+key).toBe(true);
    const paragraphs=await main(page).getByRole('paragraph').allTextContents();
    const at=paragraphs.indexOf(title);expect(at,'Saved widget title must be rendered').toBeGreaterThanOrEqual(0);
    const actual=number(paragraphs[at+1]);
    if(Math.abs(actual-expected)>0.005)mismatches.push({metric:key,expected,actual,display:paragraphs[at+1]});
  }
  const denominator=Number(data.total_orders);
  await info.attach('dashboard-metric-oracle',{body:JSON.stringify({revenue:data.revenue,totalOrders:data.total_orders,aov:data.average_order_value,ratio:denominator>0?Number(data.revenue)/denominator:null,mismatches,scope:'Widget binding; underlying transaction eligibility/date matrix not certified'}),contentType:'application/json'});
  await proof(page,info,'sales-metrics-preview');
  if(mismatches.length)await bug(page,info,'P2-DASH-003','Saved configured widgets do not bind to the live QA dashboard data: '+JSON.stringify(mismatches));
  if(denominator>0)expect(Number(data.average_order_value),'AOV must reconcile revenue/order count for the same snapshot').toBeCloseTo(Number(data.revenue)/denominator,2);
}
export async function profitability(page:Page,info:TestInfo){
  await openDashboard(page);const dialog=await configure(page,'Stat Card');
  if(await dialog.getByRole('radio',{name:/gross profit|net margin/i}).count()<2)await bug(page,info,'P2-DASH-001','Gross profit and net margin are absent from the available KPI metrics, including the Stat Card configuration. Revenue/orders/AOV are available separately.');
}
export async function revenueChart(page:Page,info:TestInfo){
  const data=await openDashboard(page);await addPreview(page,'Line Chart',/^Revenue Trend /,'QA P2 Revenue Trend');
  await expect(main(page).getByRole('application').last()).toBeVisible();await proof(page,info,'revenue-chart-preview');
  // Charts are SVG, not HTMLElements; inspect rendered text-node labels.
  const ticks=await main(page).getByRole('application').last().locator('text').allTextContents();
  const actual=ticks.join(' ');
  const labels=(data.revenue_trend||[]).map((r:any)=>r.label);
  await info.attach('revenue-chart-oracle',{body:JSON.stringify({live:data.revenue_trend,display:actual}),contentType:'application/json'});
  if(labels.some((label:string)=>!ticks.includes(label)))await bug(page,info,'P2-DASH-003','Saved Revenue Trend chart uses sample month/data labels instead of the live revenue series: expected '+labels.join(', ')+'; displayed '+actual);
}
export async function periods(page:Page,info:TestInfo){
  await openDashboard(page);const dialog=await configure(page,'Line Chart');
  const weekly=dialog.getByRole('radio',{name:/week/i}).or(dialog.getByRole('combobox',{name:/period|range|interval|group/i}));
  if(!await weekly.count())await bug(page,info,'P2-DASH-002','Revenue chart configuration exposes Revenue Trend and Monthly Performance but no weekly source or daily/weekly/monthly grouping selector; the dashboard itself has no period controls.');
}
export async function ranking(page:Page,info:TestInfo){
  const data=await openDashboard(page);await addPreview(page,'Data Table',/^Top Products /,'QA P2 Top Products');
  const tables=main(page).getByRole('table');
  await info.attach('top-product-table-columns',{body:JSON.stringify(await tables.getByRole('columnheader').allTextContents()),contentType:'application/json'});
  if(!await tables.getByRole('columnheader',{name:/revenue|sales amount/i}).count())await bug(page,info,'P2-DASH-003','A saved Top Products widget renders a low-stock table (Current/Min/Store/Status and sample products), not the selected quantity/revenue ranking.');
  expect(data.top_products.length,'Live ranking must be nonempty').toBeGreaterThan(0);
  for(const p of data.top_products){const row=tables.getByRole('row').filter({has:page.getByRole('cell',{name:p.name,exact:true})});await expect(row).toHaveCount(1);const cells=await row.getByRole('cell').allTextContents();expect(number(cells[1])).toBe(Number(p.quantity));expect(number(cells[2])).toBeCloseTo(Number(p.revenue),2);}
  await info.attach('ranking-live-source',{body:JSON.stringify(data.top_products),contentType:'application/json'});
}
export async function lowStock(page:Page,info:TestInfo){
  await openDashboard(page);
  const table=main(page).getByRole('table');const rows=table.getByRole('row').filter({has:page.getByRole('cell')});
  let checked=0;
  for(const row of await rows.all()){const cells=await row.getByRole('cell').allTextContents();if(cells.length<5)continue;expect(number(cells[1]),'Every low-stock row must breach its threshold').toBeLessThan(number(cells[2]));checked++;}
  expect(checked,'Existing QA data has a depleted product; do not call an empty panel a positive arithmetic check').toBeGreaterThan(0);
  await proof(page,info,'low-stock-panel');
}
export async function activity(page:Page,info:TestInfo){
  const data=await openDashboard(page);const scope=main(page).getByRole('heading',{name:'Recent Activity',exact:true}).locator('..');
  // The nearest header may contain only the heading; inspect its card container.
  const text=await scope.locator('..').innerText();
  const events=data.recent_activity;
  expect(Array.isArray(events),'Recent activity must come from the hydrated dashboard response').toBe(true);
  expect(events.length,'A nonempty live feed is required for this rendering check').toBeGreaterThan(0);
  // The latest activity window changes as QA work is performed. Its current
  // entries need not contain both sales and inventory on every execution.
  // Verify the actual source entries rather than assuming historical types.
  for(const event of events){
    expect(text).toContain(String(event.action));
    if(event.module)expect(text).toContain(String(event.module));
    if(event.user)expect(text).toContain(String(event.user));
  }
  await info.attach('recent-activity-source',{body:JSON.stringify({events,scope:'Rendering of current live feed; no guarantee that every event type appears in the latest window.'}),contentType:'application/json'});
  await proof(page,info,'recent-activity');
}
export async function branchScope(page:Page,info:TestInfo){
  const aggregate=await openDashboard(page);
  const control=main(page).getByRole('combobox',{name:/branch|store|location/i}).or(main(page).getByRole('button',{name:/^(?:All branches|All stores|Select branch|Select store)$/i}));
  if(!await control.count())await bug(page,info,'P2-DASH-004','Dashboard has an aggregate Branch Comparison chart but no branch scope selector to isolate the required company-wide versus individual-branch metrics.');
  const read=page.waitForResponse(r=>r.request().method()==='GET'&&new URL(r.url()).pathname==='/app/api/v1/reporting/dashboard/stats'&&new URL(r.url()).searchParams.get('branch_id')==='1').then(async r=>{expect(r.ok()).toBe(true);return (await r.json()).data;});
  await control.click();await page.getByRole('option',{name:'QA Inspection Store 20261017',exact:true}).click();const data=await read;
  const value=main(page).getByText('Total Stock Value',{exact:true}).locator('xpath=ancestor::*[count(.//p)>=2][1]').getByRole('paragraph').nth(1);await expect.poll(async()=>number(await value.innerText()),{message:'Displayed stock value must switch to the selected branch response'}).toBeCloseTo(Number(data.total_value),2);
  await expect(main(page).getByText(String(data.total_products),{exact:true}).first()).toBeVisible();await expect(control).toContainText('QA Inspection Store 20261017');await info.attach('branch-scoped-dashboard',{body:JSON.stringify({branchId:1,data,scope:'Selected QA branch is sent to the live stats endpoint; underlying transaction aggregation is not independently audited.'}),contentType:'application/json'});await proof(page,info,'branch-dashboard');
  await control.click();await page.getByRole('option',{name:'All branches',exact:true}).click();await expect(control).toContainText('All branches');await expect(main(page).getByText(String(aggregate.total_products),{exact:true}).first()).toBeVisible();
  await expect.poll(async()=>number(await value.innerText()),{message:'Aggregate stock value is restored, including a cached aggregate response'}).toBeCloseTo(Number(aggregate.total_value),2);
}
