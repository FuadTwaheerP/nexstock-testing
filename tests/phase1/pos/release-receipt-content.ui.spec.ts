import { test, expect, route, openPOS, companyTax, setCompanyTax, addItem, completeSale, observedPrintCalls } from './support/pos';

test('release till receipt prints branch header footer and inherited company VAT number', async ({ page, pos }, info) => {
  // Stock-adjustment's default branch is not necessarily this user's till.
  // Discover the actual till branch from a synthetic baseline receipt before
  // touching branch settings; accept only the two already approved QA stores.
  await addItem(page, pos);
  const probe = await completeSale(page, pos);
  const matching: string[] = [];
  for (const name of [pos.branch, pos.otherBranch]) if (await probe.receipt.getByText(name, { exact: true }).count()) matching.push(name);
  expect(matching, 'Receipt must identify exactly one approved QA branch').toHaveLength(1);
  const activeBranch = matching[0];
  await info.attach('verified-till-branch', { body: activeBranch, contentType: 'text/plain' });
  const tax = await companyTax(page);
  const vat = await page.getByLabel('VAT Registration Number', { exact: true }).inputValue();
  const editBranch = async (target: typeof page) => {
    await route(target, '/stores');
    const card = target.locator('[data-slot="card"]').filter({ has: target.getByRole('heading', { name: activeBranch, exact: true }) });
    await card.getByRole('button', { name: 'Edit Store', exact: true }).click();
    const dialog = target.getByRole('dialog', { name: 'Edit Store Branch', exact: true });
    await expect(dialog.getByRole('switch', { name: "Use the company's tax registration", exact: true })).toBeChecked();
    return dialog;
  };
  let branch = await editBranch(page);
  const before = { header: await branch.getByLabel('Receipt header', { exact: true }).inputValue(), footer: await branch.getByLabel('Receipt footer', { exact: true }).inputValue() };
  await branch.getByRole('button', { name: 'Cancel', exact: true }).click();
  try {
    await setCompanyTax(page, true, '15');
    await page.getByLabel('VAT Registration Number', { exact: true }).fill('QA-VAT-RECEIPT');
    await page.getByRole('button', { name: 'Save Settings', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/saved|updated/i);
    branch = await editBranch(page);
    await branch.getByLabel('Receipt header', { exact: true }).fill('QA Branch Receipt Header');
    await branch.getByLabel('Receipt footer', { exact: true }).fill('QA Branch Receipt Footer');
    await branch.getByRole('button', { name: 'Save Changes', exact: true }).click();
    await expect(branch).toBeHidden();
    branch = await editBranch(page);
    await expect(branch.getByLabel('Receipt header', { exact: true })).toHaveValue('QA Branch Receipt Header');
    await expect(branch.getByLabel('Receipt footer', { exact: true })).toHaveValue('QA Branch Receipt Footer');
    await branch.getByRole('button', { name: 'Cancel', exact: true }).click();
    await openPOS(page); await addItem(page, pos);
    const { receipt } = await completeSale(page, pos);
    await expect(receipt).toContainText('QA Branch Receipt Header');
    await expect(receipt).toContainText('QA Branch Receipt Footer');
    await expect(receipt).toContainText('QA-VAT-RECEIPT');
    const proof = info.outputPath('branch-vat-receipt.png');
    await receipt.screenshot({ path: proof });
    await info.attach('branch-vat-receipt', { path: proof, contentType: 'image/png' });
    await receipt.getByRole('button', { name: 'Standard Print', exact: true }).click();
    await expect.poll(() => observedPrintCalls(page)).toBeGreaterThan(0);
  } finally {
    const cleanup = await page.context().newPage();
    try {
      branch = await editBranch(cleanup);
      await branch.getByLabel('Receipt header', { exact: true }).fill(before.header);
      await branch.getByLabel('Receipt footer', { exact: true }).fill(before.footer);
      await branch.getByRole('button', { name: 'Save Changes', exact: true }).click();
      await expect(branch).toBeHidden();
      await setCompanyTax(cleanup, tax.enabled, tax.rate);
      await cleanup.getByLabel('VAT Registration Number', { exact: true }).fill(vat);
      await cleanup.getByRole('button', { name: 'Save Settings', exact: true }).click();
      await expect(cleanup.getByRole('region', { name: 'Notifications alt+T' })).toContainText(/saved|updated/i);
      expect(await companyTax(cleanup)).toEqual(tax);
      await expect(cleanup.getByLabel('VAT Registration Number', { exact: true })).toHaveValue(vat);
    } finally { await cleanup.close(); }
  }
});
