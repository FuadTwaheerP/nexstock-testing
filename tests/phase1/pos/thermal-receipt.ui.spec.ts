import { test, expect, addItem, completeSale, openPOS, observedPrintCalls } from './support/pos';
import { paperPreview } from '../hardware/support/hardware';

test.describe('POS — Thermal Receipt Printing', () => {
  for (const width of ['58mm', '80mm']) {
    test(`previews ${width} receipt content and invokes printing @phase1 @pos`, async ({ page, pos }, info) => {
      await paperPreview(page, width as '58mm' | '80mm');
      await openPOS(page);
      await addItem(page, pos, 2);
      const { receipt, due } = await completeSale(page, pos);
      await expect(receipt).toContainText(pos.company);
      await expect(receipt).toContainText(pos.name);
      await expect(receipt).toContainText(due.toFixed(2));
      await receipt.getByRole('button', { name: 'Standard Print', exact: true }).click();
      await expect.poll(() => observedPrintCalls(page)).toBeGreaterThan(0);
      info.annotations.push({ type: 'scope', description: 'Unsaved 58/80mm sample template preview plus real QA receipt print invocation. Does not certify saved paper-width selection, native dialog or physical output.' });
    });
  }
});
