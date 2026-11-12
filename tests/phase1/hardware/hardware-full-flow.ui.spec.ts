import { test, expect, fixtureData, receiptState, paperPreview, scannerFixture, openPOS, scan, printExistingReceipt, physicalEvidence } from './support/hardware';

test('@phase1 @hardware @full-flow Hardware paper widths HID scans existing receipt print and baseline verification', async ({ page }, info) => {
  await test.step('F27-a inspect both unsaved paper choices', async () => {
    for (const width of ['58mm', '80mm'] as const) await paperPreview(page, width);
    expect(await receiptState(page)).toEqual(fixtureData().receipt);
  });
  await test.step('F27-b scanner burst sequence without checkout or stock changes', async () => {
    try {
      const fixture = scannerFixture(3);
      await openPOS(page);
      for (let quantity = 1; quantity <= 3; quantity++) await scan(page, fixture, quantity);
    } catch (error) {
      await info.attach('scanner-flow-failure-before-read-only-recovery', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
      expect.soft(false, String(error)).toBe(true);
      // Keep the failure; discard only this unsaved cart/modal so independent
      // read-only reprint prerequisites can still be assessed. No fake sale.
      await openPOS(page);
    }
  });
  await test.step('F27-a existing receipt reprint without a new sale', async () => {
    try { await printExistingReceipt(page, info); }
    catch (error) { expect.soft(false, String(error)).toBe(true); }
  });
  await test.step('Physical acceptance prerequisites are not silently passed', async () => {
    for (const scope of ['printers', 'scanners'] as const) {
      try { await physicalEvidence(scope, info); }
      catch (error) { expect.soft(false, String(error)).toBe(true); }
    }
  });
  await test.step('Unsaved configuration still matches baseline', async () => {
    expect(await receiptState(page)).toEqual(fixtureData().receipt);
  });
});
