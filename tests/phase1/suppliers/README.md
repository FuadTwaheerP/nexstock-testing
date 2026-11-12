# Suppliers & Vendor Management — Phase 1

Three independent submodule specs plus a full-flow spec. Each npm command runs its own login/company selection. Every functional test uses a unique QA supplier; no test depends on a supplier created by another test. No intentional skips or expected-failure annotations.

Latest complete run (18 October 2026): **20 tests — 14 passed, 6 failed, 0 skipped**, including passing authentication and cleanup. Functional checks alone: **12 passed, 6 failed**. Five failed tests concern **two confirmed missing capabilities** (separate BRN and credit-limit controls). The sixth checked an in-memory negative period without a fresh navigation; that automation check was corrected and its final independent recheck **passed, together with setup and cleanup (3/3)**. The complete HTML/JUnit report is preserved; it predates this last single-case correction. Do not interpret its six failures as six bugs.

Latest verified case outcomes across the complete run and this focused recheck leave **five application-failing tests concerning two confirmed defects**. Profile updates, optional-field clearing and non-persistence of negative agreed credit days pass. See `suppliers-failure-tickets.md`. This is automated coverage with outstanding findings, **not a fully passing sign-off**.

| Spec | Complete-run passed | Complete-run failed | Latest finding / recheck |
|---|---:|---:|---|
| Add Supplier | 5 | 1 | Separate BRN missing |
| Edit / Deactivate | 4 | 1 | Separate BRN missing |
| Credit Terms | 3 | 3 | Create/edit credit limit missing; negative-period case subsequently passed after fresh navigation |
| Full flow | 0 | 1 | BRN and credit-limit controls missing; supported downstream steps execute |
| Authentication + cleanup | 2 | 0 | QA company selected; created vendors verified inactive |

| Requirement | Independent spec | Scripted checks |
|---|---|---|
| F18-a Add Supplier | `add-supplier.ui.spec.ts` | Create/reload/reopen identity/contact/address/Tax ID; separate optional BRN; advertised name-only creation; missing name; malformed email; cancel |
| F18-b Edit / Deactivate Supplier | `edit-deactivate-supplier.ui.spec.ts` | Edit/reload, independent optional BRN/Tax ID, clear optional fields, inactive/active filters, retained identity and reactivation |
| F18-c Credit Terms & Payment Conditions | `credit-terms-payment-conditions.ui.spec.ts` | Net 15/30/60 and credit periods; create/edit credit limit; negative credit-period rejection; read-only active supplier selection on a purchase form |
| Full flow | `suppliers-full-flow.ui.spec.ts` | Create with Net 15 → verify → edit to Net 30/credit-limit configuration → select active vendor → deactivate → retain identity |

## Run

```powershell
npm run test:suppliers
npm run test:suppliers -- --headed
npm run report
```

Independent runs:

```powershell
npm run test:suppliers:add
npm run test:suppliers:edit
npm run test:suppliers:terms
npm run test:suppliers:flow
```

Headed Chromium starts maximized with `viewport: null` and no incompatible device-scale setting. One worker/no retries avoids overlapping fixture mutations. There are 18 functional tests plus authentication setup and cleanup verification.

## Data and cleanup

- Reuses `PRODUCT_TEST_EMAIL` / `PRODUCT_TEST_PASSWORD` from the ignored `.env` and the existing disposable-account/write/production opt-ins. `SUPPLIER_TEST_COMPANY` optionally overrides the QA company.
- Unique `QA SUP ...` names, `QA-SUP-...` codes and reserved `example.invalid` emails distinguish records from real suppliers and other runs.
  The name-only case intentionally omits the code/email too, exercising the form's advertised defaults.
- Each functional fixture deactivates its own created supplier in `finally`, even on assertion failure. The suite teardown retries/verifies recorded fixtures and attaches a screenshot. **Records are retained inactive, never deleted.** No existing real supplier is edited.
- Attempts and saved records are journaled in ignored `test-results/suppliers-fixtures.json`. A cancelled/invalid form should create no record; unexpected visible QA records are also eligible for deactivation.
- No product, inventory, company-tax or invoice-branding settings are changed. No purchase orders, bills, receipts or payments are submitted. No vendor-email/send action is invoked; synthetic supplier addresses use reserved `example.invalid` domains.
- One preliminary UI inspection supplier was created and left inactive before the automated suite; it is separate from the per-run fixture journal.
- One earlier inactive QA fixture was also used for an independent manual clearing check; Company Name and Contact Person saved blank after reload and the fixture remains inactive. It is not a real vendor.

## Requirement interpretation and limits

The user confirmed on 18 October 2026 that **BRN and Tax ID are separate and both optional**. Synthetic `QA-BRN-...` and `QA-TAX-...` values are deliberately different. Dedicated create/edit BRN checks fail normally if the separate control is absent; Tax ID is not used as a substitute. Name-only creation checks that omission is allowed, and optional-field clearing includes Tax ID. These checks do not establish official identifier-format validation.

Payment Terms is free text and Credit Period is numeric; the suite does not assume a dropdown is required. A minimum-order value is not treated as a credit limit. Missing BRN/credit-limit controls remain ordinary failures. The full flow makes these assertions soft so remaining supported operations can execute; the test still fails and absent fields are not reported as configured.

Credit Period is tested under F18-c's **agreed payment-period** scope (e.g. Net 30), not as a countdown to an existing invoice's due date. The user clarified that negative **days remaining** may legitimately mean overdue; the supplier profile suite does not flag or certify that separate transaction-level behaviour. A fresh-navigation recheck confirmed that -1 does not persist as an agreed supplier credit period; no negative-days bug is logged. This test remains enabled, without skip/expected-failure annotations.

Name-only creation tests the form's explicit help text, “Only the name is required.” If email is actually mandatory, a failure is classified as a help-text/validation-contract mismatch, not proof that an email requirement itself is wrong.

Purchase form interactions are read-only supplier lookup checks. Inactive suppliers were visible/selectable during inspection; **no order was submitted**. Eligibility/enforcement policy must be confirmed with the developer before calling that a defect. This suite does not certify order acceptance, credit-limit enforcement, historic purchase retention or financial balances.

Excluded: Phase 2 supplier transaction history/ledger; Phase 3 preferred-SKU catalogs and supplier statement export; purchase-order creation and other-role authorization. The status fields and supplier record retention are tested without generating Phase 2 financial history.

Normal HTML/JUnit/screenshots in `playwright-report` and `test-results` are replaced on rerun. Preserve attachments before filing tickets.

Automation safeguards: wait for the actual supplier-list response and render commit, then wait for the token-specific **debounced server-search response** before opening Edit (a matching row may already be visible in the unfiltered list). Finish editor-triggered reads before filling, verify entered values before Save, wait for UI-triggered writes before reload, explicitly open the action menu, and observe real submission validation rather than manufacture native invalid events. Diagnostic attachments record pre-save editor values and the synthetic supplier write payload (never authentication headers/tokens). Functional tests have a 180-second overall budget; the multi-step full flow has 240 seconds. Individual assertion/API waits remain bounded.
