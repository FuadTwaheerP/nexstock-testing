import { test, expect, type Locator, type Page } from 'playwright/test';
import { appPath, validateOnboardingTarget } from '../../../helpers/safety.mjs';

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}; configure the disposable onboarding account before running this test`);
  return value;
}

function setting(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

async function choose(locator: Locator, optionName: string, page: Page) {
  await expect(locator).toBeVisible();
  if (await locator.evaluate(element => element.tagName === 'SELECT')) {
    await locator.selectOption({ label: optionName });
    return;
  }

  await locator.click();
  const semanticOption = page.getByRole('option', { name: optionName, exact: true });
  if (await semanticOption.count()) await semanticOption.click();
  else await page.getByText(optionName, { exact: true }).last().click();
}

async function expectValueOrText(locator: Locator, value: RegExp) {
  await expect(locator).toBeVisible();
  const tagName = await locator.evaluate(element => element.tagName);
  if (tagName === 'INPUT' || tagName === 'SELECT') await expect(locator).toHaveValue(value);
  else await expect(locator).toContainText(value);
}

test('Onboarding process @phase1 @auth @write', async ({ page }) => {
  const baseURL = required('BASE_URL');
  validateOnboardingTarget(baseURL);

  const email = required('ONBOARDING_EMAIL');
  const password = required('ONBOARDING_PASSWORD');

  await test.step('Login with a fresh onboarding account', async () => {
    await page.goto(appPath('/login', baseURL));
    await page.getByLabel('Email Address', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await expect(page.getByRole('heading', {
      name: /Choose Your Plan|Tell us about your company|How can people reach you\?|Regional and tax settings/,
    })).toBeVisible();
  });

  await test.step('1. Choose plan', async () => {
    if (!await page.getByRole('heading', { name: 'Choose Your Plan', exact: true }).isVisible()) return;
    const plan = setting('ONBOARDING_PLAN', 'Lifetime License');
    await expect(page.getByText('Choose plan', { exact: true })).toBeVisible();

    if (plan === 'Monthly Subscription') {
      await page.getByRole('button', { name: 'Select Plan', exact: true }).click();
    } else if (plan !== 'Lifetime License') {
      throw new Error('ONBOARDING_PLAN must be "Lifetime License" or "Monthly Subscription"');
    }

    await expect(page.getByText(plan, { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Selected', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Start free trial', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Tell us about your company', exact: true })).toBeVisible();
  });

  await test.step('2. Company', async () => {
    if (!await page.getByRole('heading', { name: 'Tell us about your company', exact: true }).isVisible()) return;
    await page.getByLabel(/^Company Name/i).fill(setting('ONBOARDING_COMPANY_NAME', 'Nexstock QA Company'));
    await choose(page.getByLabel(/^Industry/i), setting('ONBOARDING_INDUSTRY', 'Distribution'), page);
    await page.getByLabel(/^Website/i).fill(setting('ONBOARDING_WEBSITE', 'https://example.invalid'));
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'How can people reach you?', exact: true })).toBeVisible();
  });

  await test.step('3. Contact', async () => {
    if (!await page.getByRole('heading', { name: 'How can people reach you?', exact: true }).isVisible()) return;
    await page.getByLabel(/^Company Email/i).fill(setting('ONBOARDING_COMPANY_EMAIL', email));
    await page.getByLabel(/^Phone Number/i).fill(setting('ONBOARDING_PHONE', '51234567'));
    await expectValueOrText(page.getByLabel(/^Country/i), /Mauritius/i);
    await page.getByLabel(/^Street Address/i).fill(setting('ONBOARDING_STREET_ADDRESS', '12 Cyber City'));
    await page.getByLabel(/^City/i).fill(setting('ONBOARDING_CITY', 'Ebene'));
    await page.getByLabel(/^Postal Code/i).fill(setting('ONBOARDING_POSTAL_CODE', '72201'));
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Regional and tax settings', exact: true })).toBeVisible();
  });

  await test.step('4. Tax & region', async () => {
    await expect(page.getByRole('heading', { name: 'Regional and tax settings', exact: true })).toBeVisible();
    await expectValueOrText(page.getByLabel(/^Currency/i), /MUR/i);
    await choose(page.getByLabel(/^Language/i), setting('ONBOARDING_LANGUAGE', 'English (English)'), page);
    const brn = setting('ONBOARDING_BRN', '');
    await page.getByLabel(/^Business Registration Number/i).fill(brn);
    if (brn) {
      const proofPath = required('ONBOARDING_BRN_PROOF_PATH');
      await page.getByLabel(/^Proof of BRN/i).setInputFiles(proofPath);
    }

    const vatSwitch = page.getByRole('switch', { name: /VAT registered/i });
    const shouldRegisterForVat = setting('ONBOARDING_VAT_REGISTERED', 'false') === 'true';
    if ((await vatSwitch.isChecked()) !== shouldRegisterForVat) await vatSwitch.click();
    await expect(vatSwitch).toHaveAttribute('aria-checked', String(shouldRegisterForVat));

    await page.getByRole('button', { name: 'Finish setup', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Regional and tax settings', exact: true })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Finish setup', exact: true })).toBeHidden();
  });
});
