# System Settings & Localization — findings

Reviewed 21 October 2026 against production https://nexstock.stylotech.mu/app, Chromium, disposable Nexstock QA Company, approved Admin account.

## Latest execution and approved workaround

The user explicitly approved option 2: retain BRN `QA-BRN-2026` as the QA baseline. The one-time adapter verified that all other captured settings matched, backed up the original blank-BRN baseline privately, and recorded that approval. This unblocks setup; it does not fix or waive BRN clearing (SET-002).

All 18 functional cases were executed, plus setup and cleanup. No intentional skips or expected-failure annotations. Most-recent result per case across the full run and corrected preference rerun: **20 cases, 10 passed, 10 failed, 0 skipped/dependency-blocked**. There are **10 distinct confirmed Settings findings**, not one ticket for every repeated assertion.

- Full run before the final preference-adapter correction: **20 tests, 10 passed, 10 failed, 0 skipped**. One failure was cleanup rejecting an observed theme-preference request; this is a corrected automation issue, not an application ticket. [Archived full HTML report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/junit.xml).
- Focused rerun of language, themes and integrated flow, including setup/cleanup: **10 tests, 5 passed, 5 failed, 0 skipped**. Four failures represent saved French persistence, HTML document language, System Default theme and the integrated flow's duplicate missing-capability gates. The fifth was a light-theme form-readiness timeout. The readiness correction exposed a genuine same-session Light-mode persistence failure, subsequently reproduced with an explicit successful preference write (SET-010). Earlier Light-mode checks that ran before full hydration are not accepted as final persistence evidence. [Latest HTML report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-preference-verification-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-preference-verification-2026-10-21/junit.xml), [safe request journal](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-preference-verification-2026-10-21/settings-run.json).
- Final reload-readiness rerun: **5 tests, 3 passed, 2 failed, 0 skipped**. Dark mode passes. Saved French still reverts after the actual settings GET and a 30-second translated-heading wait; Light mode returns to Dark after reload. [Final HTML report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-reload-readiness-verification-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-reload-readiness-verification-2026-10-21/junit.xml), [safe journal](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-reload-readiness-verification-2026-10-21/settings-run.json).
- Final explicit Light-mode reproduction: **3 tests, 2 passed, 1 failed, 0 skipped**. Setup and cleanup pass. The safe journal records `theme=light` with HTTP 200; after the settings GET/form readiness check, the UI still reloads Dark. This confirms SET-010 rather than a no-op/initial-render assumption. [Final HTML report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-explicit-light-theme-verification-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-explicit-light-theme-verification-2026-10-21/junit.xml), [safe journal](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-explicit-light-theme-verification-2026-10-21/settings-run.json).
- Local safety/baseline checks: **58 passed, 0 failed, 0 skipped**.
- The combined Tax ID/BRN test exposes two independent problems (SET-008 and SET-002). The integrated flow repeats SET-003/004/005/006; it creates no additional tickets. SET-005 overlaps the existing Products pricing-mode capability and should be linked to that existing Trello card where appropriate.
- Cleanup verified the approved baseline, left its recovery ledger not pending, retained only the approved QA BRN, and logged out the QA test session. Original private baseline/backup and auth state are never Trello attachments. No real sale, payment, stock or credential/security-policy mutation was performed.

The latest standalone report contains only the final 3-test explicit-theme rerun; the 20-case figure above is a deduplicated latest-result summary, not a claim that its report contains 20 tests.

## Confirmed application bugs

## SET-001

### Title

Company Email changes are not retained after Save Changes and reload

### Environment

Production NexStock, Chromium, disposable Nexstock QA Company, Admin; reproduced 21 October 2026. Settings → Company.

### Priority

P2 — required company contact information cannot be updated reliably.

### Step-by-step

1. Sign in with the approved QA account and select Nexstock QA Company.
2. Open Settings → Company.
3. Change Company Email from contact@nexstock.com to qa-settings@example.com.
4. Click Save Changes and wait for the successful settings response.
5. Reload Settings → Company and inspect Company Email.

### Expected Result

Company Email remains qa-settings@example.com after a successful save and reload.

### Actual Result

The field returns to contact@nexstock.com. Other company identity fields can persist, so this is not a blanket save/network failure.

### Attachment

- [Failure context and exact assertion](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/phase1-settings-company-pr-51ab1-fter-reload-phase1-settings-chromium-settings/error-context.md).
- [HTML report with screenshot attachments](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/junit.xml).
- Scenario: `F28-a saves company email after reload`. Review/redact screenshots before sharing; never attach .env, auth state or the private recovery baseline.

### Comment

F28-a. This is the existing email ticket, not a new duplicate. The QA original email is preserved. The observed bulk settings payload has no company-email field; implementation root cause is not proven.

---

## SET-002

### Title

Business Registration Number cannot be cleared after it has been saved

### Environment

Production NexStock, Chromium, disposable Nexstock QA Company, Admin; reproduced 21 October 2026. Settings → Company.

### Priority

P2 — an incorrect optional legal identifier cannot be removed.

### Step-by-step

1. Select Nexstock QA Company and open Settings → Company → Tax & Invoicing.
2. Confirm Business Registration Number contains QA-BRN-2026 (the explicitly approved QA baseline).
3. Clear the complete Business Registration Number field.
4. Click Save Settings in Tax & Invoicing and wait for successful completion.
5. Reload Settings → Company and inspect Business Registration Number.

### Expected Result

The optional BRN is blank after clearing, saving and reloading.

### Actual Result

QA-BRN-2026 returns after the clear/save/reload attempt.

### Attachment

- [Failure context and exact assertion](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/phase1-settings-company-pr-a0a5d-egistration-phase1-settings-chromium-settings/error-context.md).
- [HTML report with screenshot attachments](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/junit.xml).
- Scenario: `F28-a saves independent BRN and Tax ID fields without changing tax registration`. Review/redact screenshots before sharing; never attach .env, auth state or the private recovery baseline.

### Comment

Existing SET-002 remains open. User approval to keep QA-BRN-2026 is a test-data workaround, not a product fix or waived assertion. The regression still explicitly expects a blank value; teardown restores the approved non-empty QA value. The original blank baseline is preserved privately, never attached to Trello.

---

## SET-003

### Title

Company settings has no separate VAT registration number field

### Environment

Production NexStock, Chromium, disposable Nexstock QA Company, Admin; reproduced 21 October 2026. Settings → Company.

### Priority

P2 — required VAT legal-identity configuration is unavailable.

### Step-by-step

1. Select Nexstock QA Company and open Settings → Company.
2. Locate the Tax ID / EIN field and the separate Business Registration Number field.
3. In Tax & Invoicing, enable Tax Registered, set Tax Percentage to 15 and click Save Settings.
4. Reload Company settings and inspect the legal-identity/tax fields.
5. Look for a VAT registration number input separate from Tax ID / EIN and BRN.

### Expected Result

A VAT registration number can be entered independently of Tax ID / EIN and BRN. The user explicitly confirmed that Tax ID and VAT number are different fields.

### Actual Result

Tax ID / EIN and BRN are present, but no separately identified VAT registration number input is exposed, including with tax registration enabled.

### Attachment

- [Failure context and exact assertion](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/phase1-settings-company-pr-fdf8d-red-company-phase1-settings-chromium-settings/error-context.md).
- [HTML report with screenshot attachments](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/junit.xml).
- Scenario: `F28-a exposes separate Tax ID and VAT number for a registered company`. Review/redact screenshots before sharing; never attach .env, auth state or the private recovery baseline.

### Comment

F28-a, user clarification dated 20 October 2026. This is not an assumed Tax ID-to-VAT mapping. Registration is enabled before checking conditional fields. No unsupported required/optional VAT-number validation rule is assumed. The tax baseline is restored afterward.

---

## SET-004

### Title

Company settings does not expose the required decimal display on/off control

### Environment

Production NexStock, Chromium, disposable Nexstock QA Company, Admin; reproduced 21 October 2026. Settings → Company.

### Priority

P2 — the confirmed company-level financial-formatting option is unavailable.

### Step-by-step

1. Select Nexstock QA Company and open Settings → Company.
2. Inspect currency/financial formatting settings for a decimal display enable/disable control.
3. Also inspect Localization to confirm the option has not simply moved there.
4. Attempt to configure decimal display off and then back on using the UI.

### Expected Result

Company settings allows decimal display to be enabled/disabled. It is enabled by default and always uses 2dp when enabled. Rs always prefixes amounts; no symbol-position or arbitrary-precision selector is required.

### Actual Result

The inspected Company and Localization screens expose no decimal display toggle, so the configured on/off workflow cannot be completed.

### Attachment

- [Failure context and exact assertion](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/phase1-settings-currency-f-cff3d-ble-control-phase1-settings-chromium-settings/error-context.md).
- [HTML report with screenshot attachments](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/junit.xml).
- Scenario: `F28-b Company settings exposes decimal display enable disable control`. Review/redact screenshots before sharing; never attach .env, auth state or the private recovery baseline.

### Comment

F28-b, confirmed 20 October 2026. One ticket for the missing control and its blocked downstream on/off persistence/output checks. This is not a complaint about a missing symbol-placement selector. Fresh-company default validation and disabled-value rounding are not claimed as executed.

---

## SET-005

### Title

System fiscal settings does not expose tax-inclusive versus tax-exclusive pricing mode

### Environment

Production NexStock, Chromium, disposable Nexstock QA Company, Admin; reproduced 21 October 2026. Settings → Company.

### Priority

P2 — required fiscal pricing configuration is unavailable.

### Step-by-step

1. Select Nexstock QA Company and open Settings → Company → Tax & Invoicing.
2. Inspect the available fiscal configuration.
3. Look for an inclusive/exclusive pricing switch, checkbox or pricing-mode selector.
4. Distinguish that pricing mode from Tax Registered and Tax Percentage.
5. Attempt to select and save tax-inclusive versus tax-exclusive pricing.

### Expected Result

An explicit inclusive/exclusive pricing mode is available as required by F28-c.

### Actual Result

Only tax registration/rate and legal/invoice text fields are exposed; no inclusive/exclusive pricing-mode control is available in the inspected fiscal settings.

### Attachment

- [Failure context and exact assertion](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/phase1-settings-fiscal-tax-144fb-ricing-mode-phase1-settings-chromium-settings/error-context.md).
- [HTML report with screenshot attachments](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/junit.xml).
- Scenario: `F28-c system settings expose tax inclusive exclusive pricing mode`. Review/redact screenshots before sharing; never attach .env, auth state or the private recovery baseline.

### Comment

F28-c. Cross-reference the existing Products & Catalog ticket 10 (same missing pricing-mode capability in Add Product) before creating another Trello card. Prefer updating the existing ticket with this Settings reproduction when the capability is tracked together. Tax Registered is not a replacement for pricing mode. No real sale or historical invoice was changed.

---

## SET-006

### Title

No selectable System Default theme is available alongside Light and Dark

### Environment

Production NexStock, Chromium, disposable Nexstock QA Company, Admin; reproduced 21 October 2026. Settings → Advanced / appearance preferences.

### Priority

P3 — a required appearance preference is missing while explicit light/dark modes work.

### Step-by-step

1. Select Nexstock QA Company and open Settings → Advanced.
2. Inspect the System Preferences appearance controls.
3. Open the account menu and inspect its Theme control.
4. Inspect Profile → Preferences → Display Settings without saving unrelated demo/profile data.
5. Attempt to select System Default / follow operating-system appearance instead of explicit Light or Dark.

### Expected Result

System Default can be selected alongside Light and Dark as required by F28-d.

### Actual Result

The inspected surfaces expose binary Dark Mode switches or a Toggle theme button, with no selectable System Default option.

### Attachment

- [Failure context and exact assertion](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-preference-verification-2026-10-21/phase1-settings-theme-sett-245e1-ht-and-dark-phase1-settings-chromium-settings/error-context.md).
- [HTML report with screenshot attachments](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-preference-verification-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-preference-verification-2026-10-21/junit.xml).
- Scenario: `F28-d exposes System Default appearance alongside light and dark`. Review/redact screenshots before sharing; never attach .env, auth state or the private recovery baseline.

### Comment

F28-d. Separate from light/dark persistence checks, which are tested independently. Missing System Default is one capability ticket, not one per inspected surface. This does not certify full contrast, accessibility or printed/PDF appearance.

---

## SET-007

### Title

French interface leaves the document language set to English

### Environment

Production NexStock, Chromium, disposable Nexstock QA Company, Admin; reproduced 21 October 2026. Settings → Localization.

### Priority

P2 — assistive technology receives the wrong document language for the visible interface.

### Step-by-step

1. Select Nexstock QA Company and open Settings → Localization.
2. Choose Français in Language (App Display).
3. Confirm the visible Settings heading becomes Paramètres and navigation is French.
4. Inspect the root HTML element in browser developer tools, or evaluate document.documentElement.lang read-only.
5. Compare the root language with the visible French interface.

### Expected Result

When the interface is French, the document exposes lang="fr" (or an appropriate French language tag), not English.

### Actual Result

The visible interface is French, but the root HTML element remains lang="en".

### Attachment

- [Failure context and exact assertion](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-preference-verification-2026-10-21/phase1-settings-multi-lang-ce644--technology-phase1-settings-chromium-settings/error-context.md).
- [HTML report with screenshot attachments](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-preference-verification-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-preference-verification-2026-10-21/junit.xml).
- Scenario: `F28-e French interface updates document language for assistive technology`. Review/redact screenshots before sharing; never attach .env, auth state or the private recovery baseline.

### Comment

F28-e / P1-060 document-language check. This is a document-language/accessibility defect, not proof that visible translation switching fails. The regression is isolated so this defect does not block separate switching, persistence, translated-label or full-flow checks. No claim of full accessibility compliance is made.

---

## SET-008

### Title

Tax ID / EIN is blank after saving company identity and tax settings then reloading

### Environment

Production NexStock, Chromium, disposable Nexstock QA Company, Admin; reproduced 21 October 2026. Settings → Company.

### Priority

P2 — a required independent company tax identifier is not retained/displayed through the settings workflow.

### Step-by-step

1. Select Nexstock QA Company and open Settings → Company.
2. Enter QA-TAX-2026 in Tax ID / EIN and click Save Changes.
3. Reload/open Company settings, keep the existing tax-registration/rate values, and save Business Registration Number QA-BRN-2026 using Save Settings in Tax & Invoicing.
4. Reload Settings → Company.
5. Inspect Tax ID / EIN and verify it is independent of the BRN field.

### Expected Result

Tax ID / EIN remains QA-TAX-2026 after both save actions and reload; saving BRN/tax preferences must not lose the independent Tax ID.

### Actual Result

The Tax ID / EIN input is blank instead of QA-TAX-2026 after the observed save/reload sequence. BRN remains separately populated.

### Attachment

- [Failure context and exact assertion](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/phase1-settings-company-pr-a0a5d-egistration-phase1-settings-chromium-settings/error-context.md).
- [HTML report with screenshot attachments](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-before-preference-sync-fix-2026-10-21/junit.xml).
- Scenario: `F28-a saves independent BRN and Tax ID fields without changing tax registration`. Review/redact screenshots before sharing; never attach .env, auth state or the private recovery baseline.

### Comment

F28-a and the user-confirmed separate Tax ID/VAT requirement. This failure and SET-002 are two different assertions in one scenario: losing/displaying a saved Tax ID versus inability to clear BRN. The exact observed sequence includes both Company and Tax & Invoicing saves; whether the value is never stored, not rebound on load, or lost between forms is not established. Do not assert a backend root cause. Unlike the email field, the observed settings payload includes taxNumber; link SET-001 if the developer confirms a shared cause.

---

## SET-009

### Title

Saved French display language reverts to English after reload

### Environment

Production NexStock, Chromium, disposable Nexstock QA Company, Admin; reproduced 21 October 2026. Settings → Localization.

### Priority

P2 — a selected and saved interface preference is lost on reload.

### Step-by-step

1. Sign in with the approved QA account and select Nexstock QA Company.
2. Open Settings → Localization.
3. Choose Français in Language (App Display); confirm Paramètres and French navigation are visible.
4. Wait for the language-preference update to finish, then click Enregistrer les paramètres and wait for the successful settings save.
5. Reload the current Settings page and inspect its heading and navigation.

### Expected Result

The same browser session retains the saved French interface after reload.

### Actual Result

The interface reloads in English (Settings / Dashboard / Products), despite displaying French before reload and successful preference/settings responses. The later Products-route assertion is not reached.

### Attachment

- [Failure context and exact assertion](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-reload-readiness-verification-2026-10-21/phase1-settings-multi-lang-77e91--navigation-phase1-settings-chromium-settings/error-context.md).
- [HTML report with screenshot attachments](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-preference-verification-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-preference-verification-2026-10-21/junit.xml).
- Scenario: `F28-e French persists on save reload and route navigation`. Review/redact screenshots before sharing; never attach .env, auth state or the private recovery baseline.

### Comment

Reproduced in the full run and focused rerun after the adapter explicitly awaited the language synchronization response. Distinct from SET-007: visible preference persistence versus document metadata. No cross-device or new-login persistence policy is assumed. The test restores the original saved company language and browser display afterward.

---

## SET-010

### Title

Explicitly selected Light theme reverts to Dark after same-session reload

### Environment

Production NexStock, Chromium, disposable Nexstock QA Company, Admin; reproduced 21 October 2026. Settings / account-menu appearance.

### Priority

P2 — the selected appearance is not retained after a successful preference save.

### Step-by-step

1. Select Nexstock QA Company and open Settings.
2. Using the account menu Toggle theme control, explicitly switch to Dark and then to Light.
3. Confirm the visible interface is Light and the light theme preference request completes successfully.
4. Reload the same Settings page in the same browser session.
5. Wait for Settings data and the Company form to load, then inspect the visible theme and the root HTML class.

### Expected Result

The explicitly saved Light theme remains Light after reload in the same browser session.

### Actual Result

After a successful theme=light preference response and a fully loaded Settings page, the root HTML element has class dark and the UI returns to Dark.

### Attachment

- [Exact theme assertion](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-explicit-light-theme-verification-2026-10-21/phase1-settings-theme-sett-cbc4b-orms-usable-phase1-settings-chromium-settings/error-context.md).
- [Safe journal recording theme=light / HTTP 200](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-explicit-light-theme-verification-2026-10-21/settings-run.json).
- [HTML report and screenshots](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-explicit-light-theme-verification-2026-10-21/playwright-report/index.html), [JUnit](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/settings-explicit-light-theme-verification-2026-10-21/junit.xml).
- Never attach auth state, credentials or the private baseline.

### Comment

Separate from SET-006 (missing System Default). The final reproduction explicitly transitions to the requested mode and waits for its actual preference response, avoiding initial-render/no-op assumptions. Cross-device or new-login persistence policy is not asserted. The same-session Dark check passes independently. Restore the captured QA appearance after testing.

---

## Corrected automation issues — not application tickets

- Sign-in waits for the real business chooser or exact disposable-company header; header selection matches the inspected visible company span, including the known temporary QA rename.
- Navigation and reload checks wait for the actual settings GET and populated inputs, rather than a delayed DOMContentLoaded event or placeholder values.
- Scoped bulk saves compare unrelated fields against the latest server snapshot; profile-to-tax transitions refresh it. Only equivalent optional blank/null normalization is accepted.
- Profile recovery has an adequate time budget and a fixture-teardown backstop. A timed-out test does not silently become a new baseline.
- POS Rs and amount may be separate text spans with no literal space. The assertion accepts whitespace variation without weakening fixed-prefix/2dp requirements.
- Language switching, save/reload persistence and HTML-language metadata are independent checks; one metadata failure no longer blocks all language coverage.
- Language/theme changes wait for their actual preference response before navigation. The observed theme endpoint permits only same-origin PUT, an explicit theme operation and an exact light/dark-only payload. Credentials, other preferences and arbitrary writes remain blocked.
- Saved company language and browser display preference are both restored. The final cleanup journal must have zero unexpected application writes.
- A fresh-browser audit initially treated the browser default theme as company-data drift. Setup now audits company data and explicitly restores the captured QA appearance after that audit navigation; it does not adopt an unrelated company value or assert an unconfirmed cross-login preference policy.
- Earlier adapter/timing/recovery-attempt reports are retained as history, not counted as extra application defects. Cross-device preference persistence policy is unconfirmed and is not asserted.

## Passed checks and remaining coverage boundaries

Passed: exact QA business selection/baseline audit; name/phone/address changes and restoration; MUR selection and save/reload; POS zero total with Rs prefix and 2dp; VAT15/default POS rate; disabled-tax persistence without BRN loss; visible English/French navigation; translated French Company label without raw keys; explicit Dark-mode reload, form-focus and product-table smoke; final baseline recovery and logout.

Missing VAT/decimal/pricing-mode/System Default controls remain failing contract checks. Their deeper data entry/calculation/system-following workflows cannot pass until implemented. Decimal off/output persistence and an approved fresh-company default-on fixture are not executed; there is no requirement for arbitrary precision or symbol positioning.

Staff/RBAC restrictions, invoice/PDF identity and monetary formatting, nonzero/large financial boundaries, historical tax immutability, full contrast/accessibility and every translation/validation string remain unverified. The French persistence case fails at reload before its Products-route continuation. This module is not fully passed/certified merely because every implemented case was attempted.
