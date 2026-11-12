import { test, expect, receiptState, paperPreview, openPOS, printExistingReceipt, physicalEvidence } from './support/hardware';

for (const width of ['58mm', '80mm'] as const) {
  test(`@phase1 @hardware F27-a select ${width} paper and render sample receipt preview without saving`, async ({ page }, info) => {
    const preview = await paperPreview(page, width);
    await info.attach(`${width}-sample-preview-not-physical-output`, { body: await preview.innerText(), contentType: 'text/plain' });
    await info.attach(`${width}-sample-preview`, { body: await preview.screenshot(), contentType: 'image/png' });
  });
}
test('@phase1 @hardware F27-a unsaved width edits do not change persisted receipt configuration', async ({ page }) => {
  const before = await receiptState(page);
  await paperPreview(page, before.width.startsWith('80mm') ? '58mm' : '80mm');
  const after = await receiptState(page);
  expect(after).toEqual(before);
});
test('@phase1 @hardware F27-a existing QA receipt requests browser printing exactly once', async ({ page }, info) => {
  await openPOS(page);
  await printExistingReceipt(page, info);
});
test('@phase1 @hardware F27-a actual 58mm 80mm native-dialog and paper acceptance needs hardware evidence', async ({}, info) => {
  await physicalEvidence('printers', info);
});
