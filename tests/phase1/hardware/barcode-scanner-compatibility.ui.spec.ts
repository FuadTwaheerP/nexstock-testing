import { test, expect, scannerFixture, openPOS, search, scan, cart, line, tile, confirmCustomization, physicalEvidence } from './support/hardware';

for(const viewport of [{width:1920,height:1080},{width:1440,height:900}]){
test(viewport.width===1920?'@phase1 release basic-variant customization Add to Order remains reachable on desktop':'@phase1 release basic-variant customization remains reachable at 1440 x 900', async ({ page }, info) => {
  await page.setViewportSize(viewport);
  await openPOS(page);
  const custom = tile(page, 'QA-FLOW-mv89ihb7-8dc11e');
  await expect(custom, 'Existing QA basic-variant fixture required').toBeEnabled();
  await custom.click();
  const dialog = page.getByRole('dialog', { name: /^Customize product$/i });
  await expect(dialog).toBeVisible();
  const add = dialog.getByRole('button', { name: /^Add to order$/i });
  await info.attach('variant-dialog-layout', {body:JSON.stringify(await add.evaluate(element=>{
    const r=element.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
    return {viewport:{width:innerWidth,height:innerHeight},button:{x:r.x,y:r.y,width:r.width,height:r.height},hitAtButtonCentre:{tag:hit?.tagName,text:hit?.textContent?.slice(0,120)},buttonReceivesPointer:!!hit&&(element===hit||element.contains(hit))};
  })),contentType:'application/json'});
  await info.attach(`variant-footer-${viewport.width}-before-click`, { body: await page.screenshot(), contentType: 'image/png' });
  await add.scrollIntoViewIfNeeded();
  try{await add.click();}catch(error){
    const hit=await add.evaluate(element=>{const r=element.getBoundingClientRect(),target=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {receivesPointer:!!target&&(element===target||element.contains(target)),scrollAreaCoversAction:!!target?.closest('[data-slot="scroll-area"]')};});
    if(!hit.receivesPointer&&hit.scrollAreaCoversAction)info.annotations.push({type:'confirmed-bug',description:'RET-003: Variant scroll content covers the enabled Add to order action and intercepts a normal pointer click.'});
    await info.attach('blocked-variant-action-hit-test',{body:JSON.stringify(hit),contentType:'application/json'});throw error;
  }
  await expect(dialog).toBeHidden();
  await expect(line(page, 'QA flow mv89ihb7-8dc11e Final')).toHaveCount(1);
  await info.attach(`variant-${viewport.width}-added-to-cart`, { body: await page.screenshot(), contentType: 'image/png' });
});
}

for (const delay of [0, 5, 25]) {
  test(`@phase1 @hardware F27-b keyboard HID emulation ${delay}ms key cadence retains leading zeros and adds one unit`, async ({ page }) => {
    const fixture = scannerFixture();
    expect(fixture.barcode.startsWith('0'), 'Leading-zero fixture required; do not silently replace with a numeric barcode').toBe(true);
    await openPOS(page);
    await scan(page, fixture, 1, delay);
  });
}
test('@phase1 @hardware F27-b repeated confirmed scan bursts merge to exactly three units', async ({ page }) => {
  const fixture = scannerFixture(3);
  await openPOS(page);
  for (let quantity = 1; quantity <= 3; quantity++) await scan(page, fixture, quantity, 5);
});
test('@phase1 @hardware F27-b unknown barcode leaves the order empty', async ({ page }) => {
  await openPOS(page);
  await search(page).pressSequentially(`QA-UNKNOWN-HARDWARE-${Date.now()}`, { delay: 5 });
  await search(page).press('Enter');
  await expect(cart(page).getByText('Your order is empty', { exact: true })).toBeVisible();
  await expect(cart(page).locator('div.group')).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Customize Product', exact: true })).toHaveCount(0);
});
test('@phase1 @hardware F27-b Scan action focuses the scanner input', async ({ page }) => {
  await openPOS(page);
  await page.getByRole('button', { name: 'Scan', exact: true }).click();
  await expect(search(page)).toBeFocused();
});
test('@phase1 @hardware F27-b manual keyboard search remains usable after a scanner input', async ({ page }) => {
  const fixture = scannerFixture(2);
  await openPOS(page);
  await scan(page, fixture, 1);
  await search(page).fill(fixture.sku);
  await expect(tile(page, fixture.sku)).toBeEnabled();
  await tile(page, fixture.sku).click();
  await confirmCustomization(page, fixture);
  await expect(line(page, fixture.name).locator('span.tabular-nums')).toHaveText('2');
});
test('@phase1 @hardware F27-b manual product click calibration opens customization with one unit', async ({ page }, info) => {
  const fixture = scannerFixture();
  await openPOS(page);
  await search(page).fill(fixture.sku);
  await expect(tile(page, fixture.sku)).toBeEnabled();
  await tile(page, fixture.sku).click();
  if (fixture.customizable) {
    const dialog = page.getByRole('dialog', { name: 'Customize Product', exact: true });
    await expect(dialog).toBeVisible();
    expect((await dialog.innerText()).match(/Quantity:\s*×\s*(\d+)/)?.[1], 'Manual-click calibration must start at one, independently of scanner Enter').toBe('1');
    await info.attach('manual-click-one-unit-calibration', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
    await dialog.press('Escape');
    await expect(cart(page).getByText('Your order is empty', { exact: true })).toBeVisible();
  } else {
    await expect(line(page, fixture.name).locator('span.tabular-nums')).toHaveText('1');
  }
});
test('@phase1 @hardware F27-b real USB and Bluetooth devices need physical acceptance evidence', async ({}, info) => {
  await physicalEvidence('scanners', info);
});
