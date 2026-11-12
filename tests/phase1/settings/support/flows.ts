import { expect, baseline, setTax, taxState, route, openTab } from './settings';
import type { Page } from 'playwright/test';

export async function vat15(page: Page) {
  await setTax(page, { ...baseline().tax, enabled: true, rate: '15' });
  const state = await taxState(page); expect(state.enabled).toBe(true); expect(Number(state.rate)).toBe(15);
  await route(page, '/pos'); await expect(page.getByRole('complementary').getByText(/Tax \(15%\)/)).toBeVisible();
}

export async function separateTaxAndVatFields(page: Page) {
  const panel = await openTab(page, 'company');
  await expect(panel.getByLabel('Tax ID / EIN', { exact: true }), 'Company Tax ID remains independent of VAT').toBeVisible();
  const vat = panel.getByLabel(/\bVAT\b.*(?:number|registration|id)|(?:number|registration|id).*\bVAT\b/i).and(panel.getByRole('textbox'));
  await expect(vat, 'F28-a: user confirmed VAT registration number requires its own field, separate from Tax ID / EIN').toBeVisible();
  await expect(vat, 'Tax ID and VAT must not be aliases for one input').not.toHaveAttribute('id', 'tax-id');
}
